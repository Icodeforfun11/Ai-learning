"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useApp, type Chat, type Project } from "@/lib/store";
import { buildProject, langOf, parseFiles, uid, type ConsoleMsg } from "@/lib/sandbox";
import { TEMPLATES, BLANK } from "@/data/templates";
import CodeEditor from "@/components/CodeEditor";
import Preview from "@/components/Preview";
import Markdown from "@/components/Markdown";
import Modal, { ConfirmModal } from "@/components/Modal";
import { Icon } from "@/components/Icons";
import { downloadZip } from "@/lib/files";
import type { CodeBlock } from "@/lib/markdown";

type MTab = "files" | "code" | "preview" | "chat";
const FILE_RE = /^[\w-]+\.(html|css|js)$/;

export default function StudioPage() {
  const app = useApp();
  const { s, t, update, newProject, toast, ask, aiStatus, ready } = app;
  const P: Project | undefined = s.projects[s.activeProject || ""] || Object.values(s.projects).sort((a, b) => b.updatedAt - a.updatedAt)[0];

  useEffect(() => { if (ready && !P) newProject("My first project", BLANK); }, [ready, P, newProject]);
  useEffect(() => { if (P && s.activeProject !== P.id) update((x) => { x.activeProject = P.id; }); }, [P, s.activeProject, update]);

  const [cur, setCur] = useState<string>("index.html");
  const [logs, setLogs] = useState<ConsoleMsg[]>([]);
  const [runV, setRunV] = useState(0);
  const [autoRun, setAutoRun] = useState(true);
  const [mtab, setMtab] = useState<MTab>("code");
  const [input, setInput] = useState("");
  const [att, setAtt] = useState(true);
  const [ctx, setCtx] = useState(false);
  const [stream, setStream] = useState<string | null>(null);
  const [modal, setModal] = useState<null | "new" | "projects" | "addfile" | { file: string }>(null);
  const [confirm, setConfirm] = useState<null | { title: string; run: () => void }>(null);
  const [savedAt, setSavedAt] = useState<string>("");
  const abort = useRef<AbortController | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const chat: Chat | undefined = s.chats[s.activeChat || ""]?.kind === "studio" ? s.chats[s.activeChat!] : undefined;
  const file = P?.files.find((f) => f.name === cur) || P?.files[0];
  useEffect(() => { if (P && !P.files.some((f) => f.name === cur) && P.files[0]) setCur(P.files[0].name); }, [P, cur]);

  const run = useCallback(() => { setLogs([]); setRunV((v) => v + 1); }, []);
  const autoTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const editFile = (v: string) => {
    if (!P || !file) return;
    update((x) => { const f = x.projects[P.id].files.find((y) => y.name === file.name); if (f) f.content = v; x.projects[P.id].updatedAt = Date.now(); }, ["p:" + P.id]);
    setSavedAt("✓ " + t("saved") + " · " + new Date().toLocaleTimeString());
    clearTimeout(autoTimer.current);
    if (autoRun) autoTimer.current = setTimeout(run, 900);
  };
  const applyFile = (name: string, content: string) => {
    if (!P) return;
    update((x) => { const p = x.projects[P.id]; const f = p.files.find((y) => y.name === name); if (f) f.content = content; else p.files.push({ name, content }); p.updatedAt = Date.now(); }, ["p:" + P.id]);
    setCur(name); setTimeout(run, 50); toast("✓ " + name + " updated", "ok");
  };
  const onApply = (b: CodeBlock) => applyFile(b.file || ({ html: "index.html", css: "style.css", js: "script.js", javascript: "script.js", jsx: "script.js" } as Record<string, string>)[b.lang] || cur, b.code);

  useEffect(() => { chatRef.current?.scrollTo(0, 1e9); }, [stream, chat?.messages.length]);
  useEffect(() => {
    const k = (e: KeyboardEvent) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setMtab("chat"); setTimeout(() => inputRef.current?.focus(), 0); } };
    document.addEventListener("keydown", k);
    return () => { document.removeEventListener("keydown", k); abort.current?.abort(); };
  }, []);

  async function send(text: string, forceCtx?: boolean) {
    text = text.trim(); if (!text || !P) return;
    if (text.length > 8000) { toast("Message is too long (max 8000 characters).", "err"); return; }
    const useCtx = forceCtx ?? ctx, useAtt = !useCtx && att && file;
    let context = "";
    if (useCtx) context = "Project files:\n" + P.files.map((f) => "```" + f.name.split(".").pop() + " " + f.name + "\n" + f.content.slice(0, 12000) + "\n```").join("\n");
    else if (useAtt && file) context = "Current file:\n```" + file.name.split(".").pop() + " " + file.name + "\n" + file.content.slice(0, 16000) + "\n```";
    const id = chat?.id || uid("c");
    const userMsg = { role: "user" as const, content: text, ctx: context, att: useCtx ? "project" : useAtt ? file!.name : "", ts: Date.now() };
    const history = [...(chat?.messages || []), userMsg];
    update((x) => {
      if (!x.chats[id]) x.chats[id] = { id, kind: "studio", title: text.slice(0, 48), projectId: P.id, messages: [], updatedAt: Date.now() };
      x.chats[id].messages.push(userMsg); x.chats[id].updatedAt = Date.now(); x.activeChat = id;
    }, ["c:" + id]);
    setStream("");
    abort.current = new AbortController();
    const apiMsgs = history.slice(-12).map((m) => ({ role: m.role, content: (m.ctx ? m.ctx + "\n\n" : "") + m.content + (m === history[history.length - 1] ? "\n\n(Project files: " + P.files.map((f) => f.name).join(", ") + ")" : "") }));
    try {
      const reply = await ask({ mode: "studio", messages: apiMsgs, onText: setStream, signal: abort.current.signal });
      update((x) => { x.chats[id].messages.push({ role: "assistant", content: reply, demo: aiStatus !== "live", ts: Date.now() }); x.chats[id].updatedAt = Date.now(); app.award("ai-pair", x); }, ["c:" + id]);
    } catch (e) {
      if (!(e instanceof DOMException && e.name === "AbortError")) {
        const msg = e instanceof Error ? e.message : "Something went wrong.";
        toast(msg, "err");
        update((x) => { x.chats[id].messages.push({ role: "assistant", content: "⚠️ " + msg, ts: Date.now() }); }, ["c:" + id]);
      }
    } finally { abort.current = null; setStream(null); }
  }

  const errors = logs.filter((l) => l.type === "error");
  const chats = useMemo(() => Object.values(s.chats).filter((c) => c.kind === "studio").sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 30), [s.chats]);
  if (!P || !file) return <div className="wrap page"><span className="spinner" /></div>;
  const on = (k: MTab) => "pane" + (mtab === k ? " on" : "");

  return (
    <div className="studio">
      <div className="studio-tabs chips" role="tablist">
        {(["files", "code", "preview", "chat"] as MTab[]).map((k) => <button key={k} className="chip" aria-pressed={mtab === k} onClick={() => { setMtab(k); if (k === "preview") run(); }}>{t(k)}</button>)}
      </div>

      <section className={on("files")} aria-label={t("files")}>
        <div className="pane-h"><Icon.folder />
          <input type="text" defaultValue={P.name} key={P.id} aria-label="Project name" style={{ padding: "5px 8px", fontSize: ".85rem", minHeight: 0 }}
            onBlur={(e) => { const v = e.target.value.trim().slice(0, 60) || "Untitled project"; update((x) => { x.projects[P.id].name = v; x.projects[P.id].updatedAt = Date.now(); }, ["p:" + P.id]); }} />
        </div>
        <div className="pane-b">
          <div className="row" style={{ padding: "8px 10px", gap: 6 }}>
            <button className="btn sm" onClick={() => setModal("projects")}>{t("projects")}</button>
            <button className="btn sm" onClick={() => setModal("new")}><Icon.plus /> {t("newProject")}</button>
          </div>
          <div className="filelist">
            {P.files.map((f) => <button key={f.name} aria-current={f.name === file.name} onClick={() => { setCur(f.name); setMtab("code"); }} onContextMenu={(e) => { e.preventDefault(); setModal({ file: f.name }); }}>
              <span className="dim">{({ html: "◇", css: "#", javascript: "ƒ" } as Record<string, string>)[langOf(f.name)] || "·"}</span>{f.name}</button>)}
          </div>
          <div style={{ padding: "8px 10px" }}><button className="btn sm ghost" onClick={() => setModal("addfile")}><Icon.plus /> {t("addFile")}</button></div>
          <div className="pane-h" style={{ borderTop: "1px solid var(--line)" }}>{t("history")}
            <button className="btn sm ghost" style={{ marginInlineStart: "auto" }} onClick={() => { update((x) => { x.activeChat = null; }); setMtab("chat"); }}>{t("newChat")}</button></div>
          <div className="filelist">
            {chats.length ? chats.map((c) => <button key={c.id} aria-current={c.id === chat?.id} onClick={() => { update((x) => { x.activeChat = c.id; }); setMtab("chat"); }}>💬 {c.title}</button>)
              : <p className="dim small" style={{ padding: "0 12px" }}>{t("emptyChats")}</p>}
          </div>
        </div>
      </section>

      <section className={on("code")} aria-label={t("code")}>
        <div className="pane-h">
          <div className="ftabs grow">{P.files.map((f) => <button key={f.name} aria-current={f.name === file.name} onClick={() => (f.name === file.name ? setModal({ file: f.name }) : setCur(f.name))}>{f.name}</button>)}</div>
          <button className="btn sm primary" onClick={run} title="Ctrl/⌘+Enter"><Icon.play /> {t("run")}</button>
          <button className="btn sm icon" aria-label={t("save")} title={t("save") + " (Ctrl/⌘+S)"} onClick={() => toast(t("saved"), "ok")}><Icon.save /></button>
          <button className="btn sm icon" aria-label={t("download")} title={t("download")} onClick={() => downloadZip(P.name, P.files)}><Icon.dl /></button>
        </div>
        <div className="pane-b" style={{ overflow: "hidden" }}>
          <CodeEditor key={P.id + file.name} value={file.content} language={file.name.split(".").pop()!} onChange={editFile} onRun={run} onSave={() => toast(t("saved"), "ok")} />
        </div>
        <div className="small dim" style={{ padding: "4px 10px", borderTop: "1px solid var(--line)" }}>{savedAt || t("keyboard")}</div>
      </section>

      <section className={on("preview")} aria-label={t("preview")}>
        <div className="pane-h">{t("preview")}
          <label className="row small" style={{ gap: 6, marginInlineStart: "auto", fontWeight: 500 }}><input type="checkbox" checked={autoRun} onChange={(e) => setAutoRun(e.target.checked)} /> Auto-run</label>
          <button className="btn sm" onClick={run} aria-label={t("run")}><Icon.play /></button>
        </div>
        <div className="split-v">
          <Preview version={runV + ":" + P.id} build={(id) => buildProject(P.files, id)} onConsole={(m) => { if (m.type !== "tests") setLogs((l) => [...l.slice(-299), m]); }} title="Project preview (sandboxed)" />
          <div style={{ display: "flex", flexDirection: "column", minHeight: 0, borderTop: "1px solid var(--line)" }}>
            <div className="pane-h" style={{ minHeight: 36 }}>{t("console")} {errors.length > 0 && <span className="badge advanced">{errors.length} error{errors.length > 1 ? "s" : ""}</span>}
              <button className="btn sm ghost" style={{ marginInlineStart: "auto" }} onClick={() => {
                if (!errors.length) { toast(t("noErrors")); return; }
                setMtab("chat");
                send("My preview shows these console errors. Explain what they mean in simple terms, which line causes them, and how to fix them:\n\n" + errors.slice(0, 10).map((x) => "- " + x.args.join(" ")).join("\n"), true);
              }}>{t("explainErrors")}</button>
              <button className="btn sm ghost" onClick={() => setLogs([])}>{t("clear")}</button>
            </div>
            <div className="console" aria-live="polite">
              {logs.length ? logs.map((l, n) => <div key={n} className={l.type}>{l.type === "error" ? "✖ " : l.type === "warn" ? "⚠ " : "› "}{l.args.join(" ")}</div>) : <div className="dim">{t("console")} output appears here.</div>}
            </div>
          </div>
        </div>
      </section>

      <section className={on("chat") + " pane-chat"} aria-label={t("chat")}>
        <div className="pane-h"><Icon.tutor /> {t("chat")}
          <span className={"pill " + aiStatus} style={{ marginInlineStart: "auto" }}><span className="dot" />{aiStatus === "live" ? t("aiLive") : t("aiDemo")}</span></div>
        <div className="pane-b" ref={chatRef}>
          <div className="msgs">
            {!chat?.messages.length && stream === null && <>
              <div className="empty small"><p style={{ margin: 0 }}>Try: <em>“Add a dark mode toggle”</em>, <em>“Why doesn’t my button work?”</em> or <em>“Turn this into a to-do app”</em>.</p></div>
              {aiStatus !== "live" && <div className="notice">{t("demoNotice")}</div>}
            </>}
            {chat?.messages.map((m, n) => m.role === "user"
              ? <div key={n} className="msg user"><div className="who">You{m.att ? <> · <span className="badge">📎 {m.att}</span></> : null}</div><Markdown text={m.content} prefix={chat.id + "u" + n} /></div>
              : <AiMsg key={n} content={m.content} demo={m.demo} prefix={chat.id + "-" + n} onApply={onApply} onApplyAll={(files) => files.forEach((f) => applyFile(f.name, f.content))} />)}
            {stream !== null && <div className="msg ai"><div className="who">UCP AI</div><Markdown text={stream} prefix="stream" streaming /></div>}
          </div>
        </div>
        <form className="composer" onSubmit={(e) => { e.preventDefault(); if (abort.current) { abort.current.abort(); return; } const v = input; setInput(""); send(v); }}>
          <textarea ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder={t("askPlaceholder")} aria-label={t("askPlaceholder")} maxLength={8000}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); (e.currentTarget.form as HTMLFormElement).requestSubmit(); } }} />
          <div className="row small" style={{ gap: 12 }}>
            <label className="row" style={{ gap: 5 }}><input type="checkbox" checked={att} onChange={(e) => setAtt(e.target.checked)} /> {t("attachFile")}</label>
            <label className="row" style={{ gap: 5 }}><input type="checkbox" checked={ctx} onChange={(e) => setCtx(e.target.checked)} /> {t("includeProject")}</label>
            <button className="btn sm primary" style={{ marginInlineStart: "auto" }}>{stream !== null ? t("stop") : t("send")}</button>
          </div>
        </form>
      </section>

      {/* New project */}
      <Modal open={modal === "new"} onClose={() => setModal(null)} label={t("newProject")}>
        <h3>{t("newProject")}</h3>
        <div className="grid g2" style={{ gap: 10 }}>
          <button className="card hover" style={{ textAlign: "start", cursor: "pointer", color: "inherit", font: "inherit" }} onClick={() => { newProject("Untitled project", BLANK); update((x) => { x.activeChat = null; }); setModal(null); }}>📄 <b>Blank web project</b><div className="small muted">index.html, style.css, script.js</div></button>
          {TEMPLATES.map((tp) => <button key={tp.id} className="card hover" style={{ textAlign: "start", cursor: "pointer", color: "inherit", font: "inherit" }} onClick={() => { newProject(tp.name, tp.files, tp.id); update((x) => { x.activeChat = null; }); setModal(null); }}>{tp.icon} <b>{tp.name}</b><div className="small muted">{tp.desc}</div></button>)}
        </div>
        <div className="row" style={{ justifyContent: "flex-end", marginTop: 12 }}><button className="btn" onClick={() => setModal(null)}>{t("cancel")}</button></div>
      </Modal>

      {/* Project picker */}
      <Modal open={modal === "projects"} onClose={() => setModal(null)} label={t("projects")}>
        <h3>{t("projects")}</h3>
        {Object.values(s.projects).sort((a, b) => b.updatedAt - a.updatedAt).map((p) => (
          <div key={p.id} className="row" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
            <div className="grow"><b>{p.name}</b><div className="small dim">{p.files.length} files</div></div>
            <button className="btn sm" onClick={() => { update((x) => { x.activeProject = p.id; }); setModal(null); }}>{t("open")}</button>
            <button className="btn sm danger" aria-label={t("del") + " " + p.name} onClick={() => { setModal(null); setConfirm({ title: t("del") + ": " + p.name, run: () => app.deleteProject(p.id) }); }}>✕</button>
          </div>))}
        <div className="row" style={{ justifyContent: "flex-end", marginTop: 12 }}><button className="btn" onClick={() => setModal(null)}>{t("cancel")}</button></div>
      </Modal>

      <AddFileModal open={modal === "addfile"} onClose={() => setModal(null)} onAdd={(n) => {
        if (!FILE_RE.test(n)) return toast("Use a simple name ending in .html, .css or .js", "err"), false;
        if (P.files.some((f) => f.name === n)) return toast("That file already exists.", "err"), false;
        update((x) => { x.projects[P.id].files.push({ name: n, content: "" }); }, ["p:" + P.id]); setCur(n); return true;
      }} />

      {typeof modal === "object" && modal && "file" in modal && (
        <FileMenu name={modal.file} canDelete={P.files.length > 1} onClose={() => setModal(null)}
          onRename={(n) => {
            if (!FILE_RE.test(n) || (n !== modal.file && P.files.some((f) => f.name === n))) { toast("Invalid or duplicate file name.", "err"); return; }
            update((x) => { const f = x.projects[P.id].files.find((y) => y.name === modal.file); if (f) f.name = n; }, ["p:" + P.id]); setCur(n); setModal(null);
          }}
          onDelete={() => { const n = modal.file; setModal(null); setConfirm({ title: t("del") + " " + n + "?", run: () => { update((x) => { x.projects[P.id].files = x.projects[P.id].files.filter((f) => f.name !== n); }, ["p:" + P.id]); run(); } }); }} />
      )}
      <ConfirmModal open={!!confirm} title={confirm?.title || ""} body={t("areYouSure")} confirmLabel={t("del")} cancelLabel={t("cancel")} onConfirm={() => confirm?.run()} onClose={() => setConfirm(null)} />
    </div>
  );
}

function AiMsg({ content, demo, prefix, onApply, onApplyAll }: { content: string; demo?: boolean; prefix: string; onApply: (b: CodeBlock) => void; onApplyAll: (f: { name: string; content: string }[]) => void }) {
  const { t } = useApp();
  const files = parseFiles(content);
  return (
    <div className="msg ai">
      <div className="who">UCP AI {demo && <span className="badge demo">DEMO · not AI</span>}</div>
      <Markdown text={content} prefix={prefix} onApply={onApply} />
      {files.length > 0 && <div className="row" style={{ marginTop: 8 }}><button className="btn sm primary" onClick={() => onApplyAll(files)}>{t("apply")} ({files.map((f) => f.name).join(", ")})</button></div>}
    </div>
  );
}

function AddFileModal({ open, onClose, onAdd }: { open: boolean; onClose: () => void; onAdd: (n: string) => boolean }) {
  const { t } = useApp();
  const [name, setName] = useState("");
  const go = () => { if (onAdd(name.trim())) { setName(""); onClose(); } };
  return (
    <Modal open={open} onClose={onClose} label={t("addFile")}>
      <h3>{t("addFile")}</h3>
      <label className="field"><span>File name</span><input type="text" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} placeholder="about.html, utils.js, theme.css" /></label>
      <p className="small dim">Allowed: .html .css .js</p>
      <div className="row" style={{ justifyContent: "flex-end" }}><button className="btn" onClick={onClose}>{t("cancel")}</button><button className="btn primary" onClick={go}>{t("addFile")}</button></div>
    </Modal>
  );
}

function FileMenu({ name, canDelete, onClose, onRename, onDelete }: { name: string; canDelete: boolean; onClose: () => void; onRename: (n: string) => void; onDelete: () => void }) {
  const { t } = useApp();
  const [v, setV] = useState(name);
  return (
    <Modal open onClose={onClose} label={name}>
      <h3>{name}</h3>
      <label className="field"><span>{t("rename")}</span><input type="text" value={v} onChange={(e) => setV(e.target.value)} /></label>
      <div className="row" style={{ justifyContent: "space-between", marginTop: 12 }}>
        <button className="btn danger" disabled={!canDelete} onClick={onDelete}>{t("del")}</button>
        <span className="row"><button className="btn" onClick={onClose}>{t("cancel")}</button><button className="btn primary" onClick={() => onRename(v.trim())}>{t("save")}</button></span>
      </div>
    </Modal>
  );
}
