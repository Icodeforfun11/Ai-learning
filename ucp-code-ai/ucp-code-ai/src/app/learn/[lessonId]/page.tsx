"use client";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { findLesson } from "@/data/courses";
import { buildDoc, runTests, type ConsoleMsg, type DocKind, type TestResult } from "@/lib/sandbox";
import CodeEditor from "@/components/CodeEditor";
import Preview from "@/components/Preview";
import Markdown from "@/components/Markdown";
import { ConfirmModal } from "@/components/Modal";
import { Icon } from "@/components/Icons";

const runnable = (lang: string): DocKind | null => (lang === "html" ? "html" : lang === "js" ? "js" : lang === "react" ? "react" : null);

export default function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = use(params);
  const found = findLesson(lessonId);
  if (!found) notFound();
  return <Lesson key={lessonId} {...found} />;
}

function Lesson({ course: c, lesson: L, index }: NonNullable<ReturnType<typeof findLesson>>) {
  const { s, t, update, addXP, checkBadges, toast, ask, newProject } = useApp();
  const router = useRouter();
  const ex = L.exercise;
  const kind = L.example.run === false ? null : runnable(L.example.lang);
  const [exCode, setExCode] = useState(L.example.code);
  const [exV, setExV] = useState(0);
  const [exLogs, setExLogs] = useState<ConsoleMsg[]>([]);
  const [code, setCode] = useState(ex.starter);
  const [results, setResults] = useState<TestResult[] | null>(null);
  const [hints, setHints] = useState(0);
  const [attempted, setAttempted] = useState(false);
  const [busy, setBusy] = useState(false);
  const [confirmSol, setConfirmSol] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [aiReview, setAiReview] = useState<string | null>(null);
  const [picked, setPicked] = useState<Record<number, number>>({});
  const passedBefore = !!s.exOk[L.id];
  const prev = c.lessons[index - 1], next = c.lessons[index + 1];

  useEffect(() => { update((x) => { x.recent = [{ id: L.id, ts: Date.now() }, ...x.recent.filter((r) => r.id !== L.id)].slice(0, 10); }); }, [L.id, update]);

  const check = async () => {
    setBusy(true);
    const r = await runTests({ type: ex.type, code, fixture: ex.fixture, tests: ex.tests, isAsync: ex.async });
    setBusy(false); setResults(r); setAttempted(true);
    if (r.every((x) => x.pass) && !s.exOk[L.id] && !revealed) { update((x) => { x.exOk[L.id] = Date.now(); addXP(30, x); checkBadges(x); }); toast("+30 XP", "ok"); }
  };
  const allOk = results?.every((x) => x.pass);
  const edLang = ex.type === "css" ? "css" : ex.type === "pattern" ? (L.example.lang === "react" ? "jsx" : L.example.lang) : ex.type;

  return (
    <div className="wrap page" style={{ maxWidth: 980 }}>
      <div className="row small muted"><Link href="/learn">{t("courses")}</Link> / <Link href={"/learn/course/" + c.id}>{c.title}</Link></div>
      <div className="row" style={{ margin: "12px 0 18px", justifyContent: "space-between" }}>
        <div><h2 style={{ margin: 0 }}>{L.title}</h2><span className={"badge " + L.level}>{t(L.level)}</span> {s.done[L.id] && <span className="badge beginner">✓ {t("completed")}</span>}</div>
        <span className="small muted">{index + 1} / {c.lessons.length}</span>
      </div>
      <Markdown className="prose" text={L.body} prefix={"b" + L.id} />

      <h3 style={{ marginTop: 28 }}>▶ {t("example")}</h3>
      {kind ? <>
        <div className="runbox">
          <div style={{ height: 260 }}><CodeEditor value={exCode} language={L.example.lang === "react" ? "jsx" : L.example.lang} onChange={setExCode} onRun={() => { setExLogs([]); setExV((v) => v + 1); }} label="Example code editor" /></div>
          <div className="out">
            <Preview version={exV} build={(id) => buildDoc(kind, exCode, id)} onConsole={(m) => setExLogs((l) => [...l, m])} title="Example output (sandboxed)" />
            <div className="console">{exLogs.map((l, n) => <div key={n} className={l.type}>› {l.args.join(" ")}</div>)}</div>
          </div>
        </div>
        <div className="row" style={{ marginTop: 8 }}>
          <button className="btn sm primary" onClick={() => { setExLogs([]); setExV((v) => v + 1); }}><Icon.play /> {t("run")}</button>
          <button className="btn sm" onClick={() => { setExCode(L.example.code); setExLogs([]); setExV((v) => v + 1); }}>Reset</button>
          {kind !== "react" && <button className="btn sm" onClick={() => {
            newProject(L.title + " (example)", kind === "html" ? [{ name: "index.html", content: exCode }] : [{ name: "index.html", content: "<!DOCTYPE html>\n<html><body>\n<h1>" + L.title + "</h1>\n<script src=\"script.js\"></script>\n</body></html>" }, { name: "script.js", content: exCode }]);
            router.push("/studio");
          }}>{t("openInStudio")}</button>}
        </div>
      </> : <>
        <div style={{ height: 240 }}><CodeEditor value={exCode} language={L.example.lang} onChange={setExCode} label="Example code" /></div>
        <p className="small notice" style={{ marginTop: 8 }}>{t("notRunnable")}</p>
      </>}

      <h3 style={{ marginTop: 32 }}>🧩 {t("exercise")}</h3>
      <div className="card">
        <Markdown className="prose" text={ex.prompt} prefix={"e" + L.id} />
        {ex.type === "css" && <p className="small dim">Fixture: <code>{ex.fixture}</code></p>}
        <div style={{ height: 220, marginTop: 10 }}><CodeEditor value={code} language={edLang} onChange={setCode} onRun={check} label="Exercise editor" /></div>
        <div className="row" style={{ marginTop: 10 }}>
          <button className="btn primary" onClick={check} disabled={busy}>{busy ? <span className="spinner" /> : t("check")}</button>
          <button className="btn" onClick={() => (hints < ex.hints.length ? setHints(hints + 1) : toast("That's all the hints. Try it, or reveal the solution."))}>💡 {t("hint")} ({hints}/{ex.hints.length})</button>
          <button className="btn" disabled={!attempted && hints < ex.hints.length} title="Try at least once or use all hints first" onClick={() => setConfirmSol(true)}>{t("showSolution")}</button>
          {ex.type === "pattern" && <button className="btn" onClick={async () => {
            setAiReview("");
            try { await ask({ mode: "review", messages: [{ role: "user", content: "Course: " + c.title + "\nExercise: " + ex.prompt + "\n\nLearner's code:\n```\n" + code.slice(0, 8000) + "\n```" }], onText: setAiReview }); }
            catch (e) { setAiReview("⚠️ " + (e instanceof Error ? e.message : "AI review failed.")); }
          }}><Icon.tutor /> AI review</button>}
          <Link className="btn ghost" href={"/tutor?mode=review&lesson=" + L.id}>{t("askTutor")}</Link>
        </div>
        <div className="stack" style={{ marginTop: 12 }} aria-live="polite">
          {passedBefore && !results && <div className="result ok">✓ Passed previously</div>}
          {ex.hints.slice(0, hints).map((h, n) => <div key={"h" + n} className="result info">💡 <Markdown text={h} /></div>)}
          {results?.map((x) => <div key={x.name} className={"result " + (x.pass ? "ok" : "bad")}>{x.pass ? "✓" : "✗"} {x.name}{x.err && <div className="small" style={{ fontWeight: 400 }}>{x.err}</div>}</div>)}
          {results && (allOk ? <div className="result ok">🎉 Great work!</div> : <div className="result info">Not quite yet. Read the failing check, then try a hint before revealing the solution.</div>)}
          {aiReview !== null && <div className="msg ai"><Markdown text={aiReview || "…"} prefix={"r" + L.id} /></div>}
        </div>
      </div>

      <h3 style={{ marginTop: 32 }}>❓ {t("quiz")}</h3>
      <div className="stack">
        {L.quiz.map((q, qi) => (
          <div key={qi} className="card"><b>{q.q}</b>
            <div>{q.options.map((o, oi) => (
              <button key={oi} className={"quiz-opt " + (picked[qi] === oi ? (oi === q.a ? "right" : "wrong") : "")} onClick={() => {
                setPicked((p) => ({ ...p, [qi]: oi }));
                const key = L.id + ":" + qi;
                if (oi === q.a && !s.quizOk[key]) { update((x) => { x.quizOk[key] = Date.now(); addXP(10, x); checkBadges(x); }); toast("+10 XP", "ok"); }
              }}>{o}</button>))}
            </div>
            {picked[qi] !== undefined && <div className="small muted">{picked[qi] === q.a ? "✓ Correct! " + q.why : "✗ Not quite. Try another option."}</div>}
          </div>
        ))}
      </div>

      <div className="row" style={{ marginTop: 28, justifyContent: "space-between" }}>
        {prev ? <Link className="btn" href={"/learn/" + prev.id}>← {t("prev")}</Link> : <span />}
        <button className="btn primary" onClick={() => {
          if (!s.done[L.id]) { update((x) => { x.done[L.id] = Date.now(); addXP(50, x); checkBadges(x); }); toast("✓ " + L.title + " · +50 XP", "ok"); }
          router.push(next ? "/learn/" + next.id : "/learn/course/" + c.id);
        }}>{s.done[L.id] ? "✓ " + t("completed") : t("markComplete") + " · +50 XP"}</button>
        {next ? <Link className="btn" href={"/learn/" + next.id}>{t("next")} →</Link> : <Link className="btn" href={"/learn/course/" + c.id}>{c.title}</Link>}
      </div>

      <ConfirmModal open={confirmSol} title={t("showSolution") + "?"} body="Try a little longer? You won't earn XP for a revealed solution." confirmLabel={t("showSolution")} cancelLabel={t("cancel")}
        onConfirm={() => { setRevealed(true); setCode(ex.solution); toast("Solution loaded. Read it line by line, then check it."); }} onClose={() => setConfirmSol(false)} />
    </div>
  );
}
