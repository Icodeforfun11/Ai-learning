import { NextRequest } from "next/server";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { activeProvider, streamChat } from "@/lib/ai/providers";
import { rateLimit } from "@/lib/ai/rateLimit";
import { buildSystem } from "@/lib/ai/prompts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const Body = z.object({
  mode: z.enum(["studio", "tutor", "builder", "review"]),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("beginner"),
  lang: z.enum(["en", "ar"]).default("en"),
  tier: z.enum(["quick", "default", "deep"]).default("default"),
  messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().min(1).max(40_000) })).min(1).max(30),
});

const json = (status: number, data: unknown, headers: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json", ...headers } });

export async function POST(req: NextRequest) {
  if (!activeProvider()) return json(503, { demo: true, error: "AI provider not configured. The app is running in Demo Mode." });

  // Optional auth: verify the Supabase access token server-side
  let userKey = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "anon";
  const token = req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
  const sbUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL, sbKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (token && sbUrl && sbKey) {
    const { data } = await createClient(sbUrl, sbKey).auth.getUser(token);
    if (data.user) userKey = "user:" + data.user.id;
  }
  if (process.env.AI_REQUIRE_AUTH === "true" && !userKey.startsWith("user:")) return json(401, { error: "Please sign in to use the AI." });

  const rl = rateLimit(userKey, Number(process.env.AI_RATE_LIMIT_PER_MINUTE || 8), Number(process.env.AI_RATE_LIMIT_PER_DAY || 150));
  if (!rl.ok) return json(429, { error: rl.reason }, { "retry-after": String(rl.retryAfter) });

  let body: z.infer<typeof Body>;
  try { body = Body.parse(await req.json()); }
  catch { return json(400, { error: "Invalid request." }); }

  // Cost control: cap total input size and keep only recent turns
  const messages = body.messages.slice(-12);
  const total = messages.reduce((n, m) => n + m.content.length, 0);
  if (total > 80_000) return json(413, { error: "Your message and attached code are too long. Attach less code." });
  if (messages[0].role !== "user") messages.shift();

  try {
    const stream = await streamChat({ system: buildSystem(body.mode, body.level, body.lang), messages, tier: body.tier, signal: req.signal });
    return new Response(stream, { headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-ai-provider": activeProvider()! } });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    console.error("[ai] upstream error", msg); // never log user content or keys
    return json(502, { error: msg.includes("429") ? "The AI provider is busy. Try again shortly." : "The AI service had a problem. Please try again." });
  }
}
