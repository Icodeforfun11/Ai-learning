/**
 * Server-side AI providers with streaming. API keys are read from server env vars only
 * and never sent to the browser. Each provider returns a ReadableStream of plain-text deltas.
 */
export type ChatMessage = { role: "user" | "assistant"; content: string };
export type Tier = "quick" | "default" | "deep";

export function activeProvider(): "anthropic" | "openai" | null {
  const p = (process.env.AI_PROVIDER || "anthropic").toLowerCase();
  if (p === "openai" && process.env.OPENAI_API_KEY) return "openai";
  if (p === "anthropic" && process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.ANTHROPIC_API_KEY) return "anthropic";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

const maxTokens = (tier: Tier) => {
  const cap = Number(process.env.AI_MAX_OUTPUT_TOKENS || 2048);
  return Math.min(cap, tier === "quick" ? 1024 : tier === "deep" ? 4096 : 2048);
};

/** Parse an SSE byte stream and emit text deltas extracted by `pick`. */
function sseToText(body: ReadableStream<Uint8Array>, pick: (evt: any) => string | undefined): ReadableStream<Uint8Array> {
  const decoder = new TextDecoder(), encoder = new TextEncoder();
  let buf = "";
  const reader = body.getReader();
  return new ReadableStream({
    async pull(controller) {
      const { done, value } = await reader.read();
      if (done) { controller.close(); return; }
      buf += decoder.decode(value, { stream: true });
      const lines = buf.split("\n");
      buf = lines.pop() || "";
      for (const line of lines) {
        const l = line.trim();
        if (!l.startsWith("data:")) continue;
        const data = l.slice(5).trim();
        if (!data || data === "[DONE]") continue;
        try { const t = pick(JSON.parse(data)); if (t) controller.enqueue(encoder.encode(t)); } catch { /* ignore keep-alives */ }
      }
    },
    cancel() { reader.cancel().catch(() => {}); },
  });
}

export async function streamChat(opts: { system: string; messages: ChatMessage[]; tier: Tier; signal?: AbortSignal }): Promise<ReadableStream<Uint8Array>> {
  const provider = activeProvider();
  if (!provider) throw new Error("NO_PROVIDER");

  if (provider === "anthropic") {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: opts.signal,
      headers: { "content-type": "application/json", "x-api-key": process.env.ANTHROPIC_API_KEY!, "anthropic-version": "2023-06-01" },
      body: JSON.stringify({ model: process.env.ANTHROPIC_MODEL || "claude-sonnet-5-5", max_tokens: maxTokens(opts.tier), system: opts.system, messages: opts.messages, stream: true }),
    });
    if (!res.ok || !res.body) throw new Error("UPSTREAM_" + res.status);
    return sseToText(res.body, (e) => (e.type === "content_block_delta" && e.delta?.type === "text_delta" ? e.delta.text : undefined));
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    signal: opts.signal,
    headers: { "content-type": "application/json", authorization: "Bearer " + process.env.OPENAI_API_KEY },
    body: JSON.stringify({ model: process.env.OPENAI_MODEL || "gpt-4o-mini", max_tokens: maxTokens(opts.tier), stream: true, messages: [{ role: "system", content: opts.system }, ...opts.messages] }),
  });
  if (!res.ok || !res.body) throw new Error("UPSTREAM_" + res.status);
  return sseToText(res.body, (e) => e.choices?.[0]?.delta?.content);
}
