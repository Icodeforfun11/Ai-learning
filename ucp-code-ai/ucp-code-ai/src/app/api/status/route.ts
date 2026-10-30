import { activeProvider } from "@/lib/ai/providers";
export const dynamic = "force-dynamic";
/** Public, non-secret status: tells the client whether live AI is available or Demo Mode applies. */
export function GET() {
  const p = activeProvider();
  return Response.json({ ai: p ? "live" : "demo", provider: p, auth: !!process.env.NEXT_PUBLIC_SUPABASE_URL });
}
