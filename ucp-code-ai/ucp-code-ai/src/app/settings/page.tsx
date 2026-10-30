"use client";
import Link from "next/link";
import { useState } from "react";
import { useApp, DEFAULT_STATE } from "@/lib/store";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { ConfirmModal } from "@/components/Modal";
import { downloadZip } from "@/lib/files";

export default function SettingsPage() {
  const { s, t, update, aiStatus, session, toast, deleteProject, deleteChat } = useApp();
  const st = s.settings;
  const [confirm, setConfirm] = useState<null | "reset" | "delete">(null);
  const chip = (on: boolean, label: string, fn: () => void) => <button className="chip" aria-pressed={on} onClick={fn}>{label}</button>;
  return (
    <div className="wrap page" style={{ maxWidth: 760 }}>
      <div className="eyebrow">{t("settings")}</div><h2>{t("settings")}</h2>
      <section className="card stack"><h3>{t("profile")}</h3>
        <label className="field"><span>{t("name")}</span><input type="text" maxLength={40} defaultValue={s.profile.name} autoComplete="nickname" onBlur={(e) => update((x) => { x.profile.name = e.target.value.trim().slice(0, 40); })} /></label>
        <label className="field"><span>{t("skill")}</span><select value={s.profile.level} onChange={(e) => update((x) => { x.profile.level = e.target.value as typeof x.profile.level; })}>
          {(["beginner", "intermediate", "advanced"] as const).map((x) => <option key={x} value={x}>{t(x)}</option>)}</select></label>
      </section>
      <section className="card stack" style={{ marginTop: 14 }}><h3>{t("theme")} &amp; {t("language")}</h3>
        <div className="chips">{chip(st.theme === "dark", t("dark"), () => update((x) => { x.settings.theme = "dark"; }))}{chip(st.theme === "light", t("light"), () => update((x) => { x.settings.theme = "light"; }))}</div>
        <div className="chips">{chip(st.lang === "en", "English", () => update((x) => { x.settings.lang = "en"; }))}{chip(st.lang === "ar", "العربية", () => update((x) => { x.settings.lang = "ar"; }))}</div>
      </section>
      <section className="card" style={{ marginTop: 14 }}><h3>{t("accessibility")}</h3>
        <div className="switch"><label htmlFor="sfs">{t("fontSize")}: <b>{st.fontSize}px</b></label><input type="range" id="sfs" min={13} max={20} value={st.fontSize} style={{ width: 160 }} onChange={(e) => update((x) => { x.settings.fontSize = +e.target.value; })} /></div>
        <div className="switch"><label htmlFor="srm">{t("reduceMotion")}</label><input type="checkbox" className="toggle" id="srm" checked={st.reduceMotion} onChange={(e) => update((x) => { x.settings.reduceMotion = e.target.checked; })} /></div>
        <div className="switch"><label htmlFor="shc">{t("highContrast")}</label><input type="checkbox" className="toggle" id="shc" checked={st.contrast} onChange={(e) => update((x) => { x.settings.contrast = e.target.checked; })} /></div>
      </section>
      <section className="card stack" style={{ marginTop: 14 }}><h3>{t("aiSettings")}</h3>
        <p className="small muted" style={{ margin: 0 }}>Status: <span className={"pill " + aiStatus}><span className="dot" />{aiStatus === "live" ? t("aiLive") : t("aiDemo")}</span></p>
        <div className="chips" role="group" aria-label={t("modelTier")}>
          {chip(st.tier === "quick", t("quick"), () => update((x) => { x.settings.tier = "quick"; }))}
          {chip(st.tier === "default", t("balanced"), () => update((x) => { x.settings.tier = "default"; }))}
          {chip(st.tier === "deep", t("deep"), () => update((x) => { x.settings.tier = "deep"; }))}
        </div>
        <p className="small dim" style={{ margin: 0 }}>Quick uses fewer tokens; Deep allows longer answers. The server enforces per-user rate limits and a response-length cap to control cost.</p>
        <label className="field"><span>Tutor {t("respondIn")}</span><select value={st.tutorLang} onChange={(e) => update((x) => { x.settings.tutorLang = e.target.value as "en" | "ar"; })}><option value="en">English</option><option value="ar">العربية</option></select></label>
      </section>
      <section className="card stack" style={{ marginTop: 14 }}><h3>{t("account")}</h3>
        {!supabaseConfigured ? <p className="small muted" style={{ margin: 0 }}>💾 Accounts aren't configured on this server, so data is stored in this browser only. <span className="badge na">UNAVAILABLE</span></p>
          : session ? <div className="row"><p className="small muted grow" style={{ margin: 0 }}>☁️ Signed in as <b>{session.user.email}</b>. Your data syncs privately.</p><button className="btn" onClick={() => supabase!.auth.signOut().then(() => toast("Signed out", "ok"))}>Sign out</button></div>
          : <div className="row"><p className="small muted grow" style={{ margin: 0 }}>Sign in to sync progress, projects and chats across devices.</p><Link className="btn primary" href="/login">Sign in</Link></div>}
        <div className="row">
          <button className="btn" onClick={() => downloadZip("ucp-code-ai-data", [{ name: "ucp-data.json", content: JSON.stringify(s, null, 2) }])}>{t("exportData")}</button>
          <button className="btn danger" onClick={() => setConfirm("reset")}>{t("resetProgress")}</button>
          <button className="btn danger" onClick={() => setConfirm("delete")}>{t("deleteAll")}</button>
        </div>
      </section>
      <section className="card" style={{ marginTop: 14 }}><h3>📱 {t("installTitle")}</h3><p className="muted small" style={{ margin: 0 }}>{t("installBody")}</p></section>
      <p className="small dim" style={{ marginTop: 20 }}>UCP CODE AI · Universal Creativity Projects · v1.0</p>
      <ConfirmModal open={!!confirm} title={confirm === "reset" ? t("resetProgress") : t("deleteAll")} body={t("areYouSure")} confirmLabel={t("confirm")} cancelLabel={t("cancel")}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm === "reset") update((x) => { const d = DEFAULT_STATE(); Object.assign(x, { xp: 0, done: {}, quizOk: {}, exOk: {}, badges: {}, streak: d.streak, daily: {}, recent: [] }); });
          else { Object.keys(s.projects).forEach(deleteProject); Object.keys(s.chats).forEach(deleteChat); update((x) => { const d = DEFAULT_STATE(); Object.assign(x, { ...d, settings: x.settings, projects: {}, chats: {} }); }); }
          toast("✓", "ok");
        }} />
    </div>
  );
}
