"use client";
import { useState } from "react";
import { useApp, today } from "@/lib/store";
import { dailyForToday } from "@/data/courses";
import { runTests, type TestResult } from "@/lib/sandbox";
import CodeEditor from "./CodeEditor";
import Markdown from "./Markdown";
import Modal from "./Modal";

export default function DailyChallenge({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { t, update, addXP, award, toast, s } = useApp();
  const d = dailyForToday();
  const [code, setCode] = useState(d.starter);
  const [res, setRes] = useState<TestResult[] | null>(null);
  const [hints, setHints] = useState(0);
  const [busy, setBusy] = useState(false);
  const check = async () => {
    setBusy(true); const r = await runTests({ type: "js", code, tests: d.tests }); setBusy(false); setRes(r);
    if (r.every((x) => x.pass) && !s.daily[today()]) { update((x) => { x.daily[today()] = true; addXP(40, x); award("daily", x); }); toast("🎉 +40 XP", "ok"); }
  };
  return (
    <Modal open={open} onClose={onClose} label={t("daily")}>
      <h3>📅 {d.title}</h3>
      <Markdown className="prose small" text={d.prompt} />
      <div style={{ height: 200, margin: "10px 0" }}><CodeEditor value={code} language="js" onChange={setCode} onRun={check} label="Daily challenge editor" /></div>
      <div className="stack" aria-live="polite">
        {d.hints.slice(0, hints).map((h, n) => <div key={"h" + n} className="result info">💡 <Markdown text={h} /></div>)}
        {res?.map((x) => <div key={x.name} className={"result " + (x.pass ? "ok" : "bad")}>{x.pass ? "✓" : "✗"} {x.name}{x.err ? " · " + x.err : ""}</div>)}
      </div>
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn primary" onClick={check} disabled={busy}>{busy ? <span className="spinner" /> : t("check")}</button>
        <button className="btn" onClick={() => (hints < d.hints.length ? setHints(hints + 1) : toast("No more hints. You've got this!"))}>{t("hint")}</button>
        <span className="grow" /><button className="btn" onClick={onClose}>{t("cancel")}</button>
      </div>
    </Modal>
  );
}
