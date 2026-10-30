"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { TEMPLATES, type ProjectFile } from "@/data/templates";
import { buildProject, parseFiles } from "@/lib/sandbox";
import Preview from "@/components/Preview";
import Markdown from "@/components/Markdown";
import { Icon } from "@/components/Icons";
import { downloadZip } from "@/lib/files";

export default function BuilderPage() {
  const { s, t, newProject, update, ask, aiStatus, toast, award } = useApp();
  const router = useRouter();
  const [sel, setSel] = useState(TEMPLATES[0]);
  const [pid, setPid] = useState<string | null>(null);
  const [desc, setDesc] = useState("");
  const [change, setChange] = useState("");
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);
  const abort = useRef<AbortController | null>(null);
  const P = pid ? s.projects[pid] : null;
  const files = P ? P.files : sel.files;

  async function gen(instruction: string, base: ProjectFile[], target: string | null) {
    if (abort.current) { abort.current.abort(); return; }
    abort.current = new AbortController(); setBusy(true); setStatus("Generating…");
    try {
      const reply = await ask({ mode: "builder", signal: abort.current.signal, onText: (x) => setStatus("Writing code… " + (Math.round(x.length / 100) / 10) + "k chars"),
        messages: [{ role: "user", content: instruction + "\n\nStarting files:\n" + base.map((f) => "```" + f.name.split(".").pop() + " " + f.name + "\n" + f.content.slice(0, 12000) + "\n```").join("\n") }] });
      const out = parseFiles(reply);
      if (aiStatus !== "live" || !out.length) { setStatus(aiStatus !== "live" ? reply : "The AI reply didn't include files. Try rephrasing your request."); return; }
      if (!target) { const p = newProject(desc.trim().slice(0, 40) || sel.name, out, sel.id); setPid(p.id); }
      else update((x) => { const p = x.projects[target]; out.forEach((f) => { const e = p.files.find((y) => y.name === f.name); if (e) e.content = f.content; else p.files.push(f); }); p.updatedAt = Date.now(); award("ai-pair", x); }, ["p:" + target]);
      setStatus(reply.replace(/```[\s\S]*?```/g, "").trim());
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) setStatus("⚠️ " + (e instanceof Error ? e.message : "Generation failed."));
      else setStatus("");
    } finally { abort.current = null; setBusy(false); }
  }

  return (
    <div className="wrap page">
      <div className="page-head"><div><div className="eyebrow">{t("builder")}</div><h2>{t("builderTitle")}</h2><p className="muted">{t("builderSub")}</p></div></div>
      <div className="grid g4">
        {TEMPLATES.map((tp) => (
          <button key={tp.id} className="card hover" aria-pressed={tp.id === sel.id && !P} style={{ textAlign: "start", cursor: "pointer", color: "inherit", font: "inherit", outline: tp.id === sel.id ? "2px solid var(--violet)" : undefined }} onClick={() => { setSel(tp); setPid(null); }}>
            <div style={{ fontSize: "1.6rem" }}>{tp.icon}</div><b>{tp.name}</b><div className="small muted">{tp.desc}</div>
          </button>
        ))}
      </div>
      <div className="grid g2" style={{ marginTop: 16, alignItems: "start" }}>
        <div className="card stack">
          <label className="field"><span>{t("describe")}</span><textarea value={desc} onChange={(e) => setDesc(e.target.value)} maxLength={3000} placeholder="e.g. A portfolio for a 14-year-old game developer with a dark space theme, 4 project cards and a contact form" /></label>
          <div className="row">
            <button className="btn primary" onClick={() => { if (desc.trim().length < 8) { toast("Describe your project in a sentence or two.", "err"); return; } gen("Customize the " + sel.name + " template to match this description: " + desc.trim(), sel.files, null); }}>
              <Icon.tutor /> {busy ? t("stop") : t("generate")}</button>
            <button className="btn" onClick={() => { const p = newProject(sel.name, sel.files, sel.id); setPid(p.id); toast("✓ " + sel.name + " created", "ok"); }}>{t("useTemplate")}</button>
          </div>
          {aiStatus !== "live" && <div className="notice">{t("demoNotice")}</div>}
          {P && <div className="stack">
            <label className="field"><span>{t("modify")}</span><textarea value={change} onChange={(e) => setChange(e.target.value)} maxLength={2000} placeholder="e.g. Make the buttons rounder and add a footer" /></label>
            <button className="btn" onClick={() => change.trim() && gen("Modify the existing project as requested: " + change.trim() + ". Keep everything else working.", P.files, P.id)}><Icon.tutor /> {t("modify")}</button>
          </div>}
          {status && <div className="small muted" aria-live="polite">{busy ? <><span className="spinner" /> {status}</> : <Markdown text={status} prefix="bld" />}</div>}
        </div>
        <div className="card" style={{ padding: 0, overflow: "hidden", minHeight: 420, display: "flex", flexDirection: "column" }}>
          <div className="pane-h"><span>{P ? P.name : sel.name + " (template preview)"}</span><span className="grow" />
            <button className="btn sm" disabled={!P} onClick={() => { if (P) { update((x) => { x.activeProject = P.id; }); router.push("/studio"); } }}>{t("openInStudio")}</button>
            <button className="btn sm icon" disabled={!P} aria-label={t("download")} onClick={() => P && downloadZip(P.name, P.files)}><Icon.dl /></button>
          </div>
          <Preview version={(P ? P.id + P.updatedAt : sel.id)} build={(id) => buildProject(files, id)} style={{ flex: 1, minHeight: 380 }} title="Builder preview (sandboxed)" />
          <div className="small dim" style={{ padding: "6px 12px", borderTop: "1px solid var(--line)" }}>{files.map((f) => f.name).join(" · ")}</div>
        </div>
      </div>
    </div>
  );
}
