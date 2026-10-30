"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { useApp } from "@/lib/store";

const Email = z.string().trim().email().max(200);

export default function LoginPage() {
  const { toast, session } = useApp();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup" | "magic">("signin");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  if (!supabaseConfigured) return (
    <div className="wrap page" style={{ maxWidth: 520 }}><div className="card"><h2>Sign in</h2>
      <p className="muted">Accounts are <b>not configured</b> on this server <span className="badge na">UNAVAILABLE</span>. Your progress is saved in this browser. To enable accounts, set the Supabase variables described in the README.</p></div></div>
  );
  if (session) { router.replace("/dashboard"); return null; }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg("");
    const ok = Email.safeParse(email); if (!ok.success) { setMsg("Enter a valid email address."); return; }
    if (mode !== "magic" && password.length < 8) { setMsg("Password must be at least 8 characters."); return; }
    setBusy(true);
    const redirect = window.location.origin + "/dashboard";
    const res = mode === "magic" ? await supabase!.auth.signInWithOtp({ email: ok.data, options: { emailRedirectTo: redirect } })
      : mode === "signup" ? await supabase!.auth.signUp({ email: ok.data, password, options: { emailRedirectTo: redirect } })
      : await supabase!.auth.signInWithPassword({ email: ok.data, password });
    setBusy(false);
    if (res.error) { setMsg(res.error.message); return; }
    if (mode === "signin") { toast("Welcome back!", "ok"); router.push("/dashboard"); }
    else setMsg(mode === "magic" ? "Check your email for a sign-in link." : "Check your email to confirm your account.");
  }

  return (
    <div className="wrap page" style={{ maxWidth: 480 }}>
      <form className="card stack" onSubmit={submit}>
        <h2 style={{ margin: 0 }}>{mode === "signup" ? "Create account" : "Sign in"}</h2>
        <div className="chips">
          {(["signin", "signup", "magic"] as const).map((m) => <button type="button" key={m} className="chip" aria-pressed={mode === m} onClick={() => setMode(m)}>{m === "signin" ? "Password" : m === "signup" ? "Sign up" : "Email link"}</button>)}
        </div>
        <label className="field"><span>Email</span><input type="text" inputMode="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></label>
        {mode !== "magic" && <label className="field"><span>Password</span><input type="password" autoComplete={mode === "signup" ? "new-password" : "current-password"} value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required
          style={{ width: "100%", padding: "11px 13px", borderRadius: 12, border: "1px solid var(--line)", background: "var(--panel-solid)", color: "var(--text)", fontSize: 16 }} /></label>}
        {msg && <div className="result info" role="status">{msg}</div>}
        <button className="btn primary" disabled={busy}>{busy ? <span className="spinner" /> : mode === "signup" ? "Create account" : mode === "magic" ? "Send link" : "Sign in"}</button>
      </form>
    </div>
  );
}
