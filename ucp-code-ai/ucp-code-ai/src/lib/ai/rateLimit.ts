/**
 * In-memory sliding-window rate limiter (per user id or IP).
 * Fine for a single server instance. On serverless/multi-instance hosting, swap the Map for a shared
 * store (e.g. Upstash Redis or a Supabase table) so limits hold across instances.
 */
const hits = new Map<string, number[]>();

export function rateLimit(key: string, perMinute: number, perDay: number): { ok: true } | { ok: false; retryAfter: number; reason: string } {
  const now = Date.now();
  const list = (hits.get(key) || []).filter((t) => now - t < 86_400_000);
  const lastMinute = list.filter((t) => now - t < 60_000);
  if (lastMinute.length >= perMinute) return { ok: false, retryAfter: Math.ceil((60_000 - (now - lastMinute[0])) / 1000), reason: "Too many requests. Please wait a moment." };
  if (list.length >= perDay) return { ok: false, retryAfter: Math.ceil((86_400_000 - (now - list[0])) / 1000), reason: "Daily AI limit reached. Try again tomorrow." };
  list.push(now);
  hits.set(key, list);
  if (hits.size > 50_000) for (const [k, v] of hits) if (!v.length || now - v[v.length - 1] > 86_400_000) hits.delete(k);
  return { ok: true };
}
