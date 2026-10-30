"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp, type Chat } from "@/lib/store";
import { findLesson } from "@/data/courses";
import { uid } from "@/lib/sandbox";
import CodeEditor from "@/components/CodeEditor";
import Markdown from "@/components/Markdown";
import { Icon } from "@/components/Icons";
import type { I18nKey } from "@/data/i18n";

type Mode = "explain" | "practice" | "review" | "debug" | "improve";
const MODES: [Mode, I18nKey][] = [["explain", "explainLines"], ["practice", "practice"], ["review", "review"], ["debug", "debug"], ["improve", "improve"]];
const INSTR: Record<Mode, string> = {
  explain: "Explain the code line by line (or small groups of lines) in plain language. Finish with one question that checks understanding.",
  practice: "Create 3 short practice exercises based on the concepts in this code, from easy to harder. Give a hint for each but NOT the solutions.",
  review: "Review the learner's solution. Say what works, what's wrong, and why. Guide them with hints and questions; do not rewrite the whole solution unless they've clearly tried and asked for it.",
  debug: "Diagnose the bug. Explain the likely cause and how to find it (where to look, what to log). Lead them to the fix step by step instead of pasting the full corrected program.",
  improve: "Suggest improvements for readability, performance, accessibility and best practices, ordered by impact. Show small focused snippets, not a full rewrite.",
};
const LANGS: Record<string, string> = { HTML: "html", CSS: "css", JavaScript: "js", TypeScript: "ts", Python: "py", React: "jsx" };

export default function TutorPage() { return <Suspense><Tutor /></Suspense>; }

function Tutor() {
  const { s, t, update, ask, aiStatus, toast, award } = useApp();
  const qp = useSearchParams();
  const lesson = qp.get("lesson") ? findLesson(qp.get("lesson")!) : null;
  const [mode, setMode] = useState<Mode>((qp.get("mode") as Mode) || "explain");
  const [lang, setLang] = useState("JavaScript");
  const [level, setLevel] = useState(s.profile.level);
  const [code, setCode] = useState(lesson ? lesson.lesson.exercise.starter : "// Paste or write code here\nfunction greet(name) {\n  return 'Hi ' + name\n}\n");
  const [q, setQ] = useState(lesson ? "I'm working on this exercise: " + lesson.lesson.exercise.prompt.replace(/`/g, "") + "\nGive me a hint, not the full answer." : "");
  const [session, setSession] = useState<Chat | null>(null);
  const [out, setOut] = useState<string | null>(null);
  const [follow, setFollow] = useState("");
  const abort = useRef<AbortController | null>(null);
  useEffect(() => () => abort.current?.abort(), []);

  async function go(sess: Chat) {
    abort.current = new AbortController(); setOut("");
    try {
      const reply = await ask({ mode: "tutor", messages: sess.messages.map((m) => ({ role: m.role, content: m.content })), onText: setOut, signal: abort.current.signal });
      const done: Chat = { ...sess, messages: [...sess.messages, { role: "assistant", content: reply, demo: aiStatus !== "live", ts: Date.now() }], updatedAt: Date.now() };
      setSession(done); setOut(reply);
      update((x) => { x.chats[done.id] = done; award("ai-pair", x); }, ["c:" + done.id]);
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) { setOut("⚠️ " + (e instanceof Error ? e.message : "Something went wrong.")); toast(e instanceof Error ? e.message : "Error", "err"); }
    } finally { abort.current = null; }
  }

  return (
    <div className="wrap page" style={{ maxWidth: 1100 }}>
      <div className="page-head">
        <div><div className="eyebrow">{t("tutor")}</div><h2>{t("tutorTitle")}</h2><p className="muted">{t("tutorSub")}</p></div>
        <span className={"pill " + aiStatus}><span className="dot" />{aiStatus === "live" ? t("aiLive") : t("aiDemo")}</span>
      </div>
      <div className="grid g2" style={{ alignItems: "start" }}>
        <form className="card stack" onSubmit={(e) => {
          e.preventDefault();
          if (abort.current) { abort.current.abort(); return; }
          if (!code.trim() && !q.trim()) { toast("Add some code or a question first.", "err"); return; }
          const content = "TUTOR MODE: " + INSTR[mode] + "\nLearner level: " + level + ".\nLanguage of the code: " + lang + ".\n\n" +
            (code.trim() ? "Code:\n```" + LANGS[lang] + "\n" + code.slice(0, 16000) + "\n```\n" : "") + (q.trim() ? "\nQuestion: " + q.trim().slice(0, 4000) : "");
          const label = t(MODES.find((m) => m[0] === mode)![1]);
          const sess: Chat = { id: uid("c"), kind: "tutor", title: label + ": " + (q || code).slice(0, 40), messages: [{ role: "user", content, ts: Date.now() }], updatedAt: Date.now() };
          setSession(sess); go(sess);
        }}>
          <div className="chips" role="group" aria-label="Tutor mode">
            {MODES.map(([k, l]) => <button type="button" key={k} className="chip" aria-pressed={mode === k} onClick={() => setMode(k)}>{t(l)}</button>)}
          </div>
          <div className="row">
            <label className="field grow"><span>Language</span><select value={lang} onChange={(e) => setLang(e.target.value)}>{Object.keys(LANGS).map((x) => <option key={x}>{x}</option>)}</select></label>
            <label className="field grow"><span>{t("skill")}</span><select value={level} onChange={(e) => setLevel(e.target.value as typeof level)}>{(["beginner", "intermediate", "advanced"] as const).map((x) => <option key={x} value={x}>{t(x)}</option>)}</select></label>
            <label className="field grow"><span>{t("respondIn")}</span><select value={s.settings.tutorLang} onChange={(e) => update((x) => { x.settings.tutorLang = e.target.value as "en" | "ar"; })}><option value="en">English</option><option value="ar">العربية</option></select></label>
          </div>
          <div><span className="small muted" style={{ fontWeight: 600 }}>{t("yourCode")}</span><div style={{ height: 240, marginTop: 6 }}><CodeEditor value={code} language={LANGS[lang]} onChange={setCode} label="Tutor code editor" /></div></div>
          <label className="field"><span>{t("yourQuestion")}</span><textarea value={q} onChange={(e) => setQ(e.target.value)} maxLength={4000} placeholder="e.g. Why does my loop run one extra time?" /></label>
          <div className="row"><button className="btn primary"><Icon.tutor /> {out !== null && abort.current ? t("stop") : t("ask")}</button><button type="button" className="btn ghost" onClick={() => { setCode(""); setQ(""); }}>{t("clear")}</button></div>
        </form>
        <section className="card" aria-live="polite">
          <h3>Tutor</h3>
          <div className="msg ai" style={{ minHeight: 200 }}>
            {out === null ? <><p className="muted">Pick a mode, paste code, and ask. The tutor explains at your level and nudges you toward the answer.</p>{aiStatus !== "live" && <div className="notice">{t("demoNotice")}</div>}</>
              : <>{aiStatus !== "live" && <span className="badge demo">DEMO · not AI</span>}<Markdown text={out || "…"} prefix="tut" streaming={!!abort.current} /></>}
          </div>
          {session && session.messages.length > 1 && (
            <form className="row" style={{ marginTop: 10 }} onSubmit={(e) => {
              e.preventDefault(); const v = follow.trim(); if (!v) return; setFollow("");
              const sess = { ...session, messages: [...session.messages, { role: "user" as const, content: v.slice(0, 2000), ts: Date.now() }] }; setSession(sess); go(sess);
            }}>
              <input type="text" className="grow" style={{ flex: 1 }} value={follow} onChange={(e) => setFollow(e.target.value)} placeholder="Ask a follow-up…" maxLength={2000} />
              <button className="btn">{t("send")}</button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
