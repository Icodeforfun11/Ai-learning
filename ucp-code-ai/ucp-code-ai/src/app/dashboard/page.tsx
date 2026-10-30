"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp, BADGES, levelOf, today, timeAgo, type Chat } from "@/lib/store";
import { COURSES, coursePct, findLesson } from "@/data/courses";
import DailyChallenge from "@/components/DailyChallenge";
import Markdown from "@/components/Markdown";
import Modal, { ConfirmModal } from "@/components/Modal";
import { Icon } from "@/components/Icons";

export default function DashboardPage() {
  const { s, t, update, streakNow, syncMode, deleteProject, deleteChat } = useApp();
  const router = useRouter();
  const [daily, setDaily] = useState(false);
  const [confirm, setConfirm] = useState<null | { title: string; run: () => void }>(null);
  const [transcript, setTranscript] = useState<Chat | null>(null);
  const lv = levelOf(s.xp), into = s.xp % 250;
  const projects = Object.values(s.projects).sort((a, b) => b.updatedAt - a.updatedAt);
  const chats = Object.values(s.chats).sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 8);
  const dDone = s.daily[today()];
  return (
    <div className="wrap page">
      <div className="page-head">
        <div><div className="eyebrow">{t("dashboard")}</div><h2>{s.profile.name ? "Welcome back, " + s.profile.name + " 👋" : t("dashTitle")}</h2>
          <p className="muted">{syncMode === "cloud" ? "☁️ " + t("synced") : "💾 " + t("localOnly")}</p></div>
        <Link className="btn primary" href="/learn">{t("continue")} <Icon.arrow /></Link>
      </div>
      <div className="grid g4">
        <div className="card stat"><b className="grad-text">{s.xp}</b><span>{t("xp")}</span></div>
        <div className="card stat"><b>{lv}</b><span>{t("level")} · {250 - into} XP to next</span><div className="progress" style={{ marginTop: 8 }}><i style={{ width: into / 2.5 + "%" }} /></div></div>
        <div className="card stat"><b>🔥 {streakNow()}</b><span>{t("streak")}</span></div>
        <div className="card stat"><b>{Object.keys(s.done).length}</b><span>{t("lessonsDone")}</span></div>
      </div>
      <div className="grid g2" style={{ marginTop: 16, alignItems: "start" }}>
        <section className="card"><h3>{t("progress")}</h3>
          {COURSES.map((c) => <Link key={c.id} href={"/learn/course/" + c.id} style={{ display: "block", textDecoration: "none", margin: "12px 0" }}>
            <div className="row small" style={{ justifyContent: "space-between" }}><span>{c.title}</span><span className="muted">{coursePct(c, s.done)}%</span></div>
            <div className="progress" style={{ marginTop: 5 }}><i style={{ width: coursePct(c, s.done) + "%" }} /></div></Link>)}
        </section>
        <div className="stack">
          <section className="card"><h3>📅 {t("daily")}</h3><p className="muted small">{dDone ? t("dailyDone") : "+40 XP"}</p><button className={"btn " + (dDone ? "" : "primary")} onClick={() => setDaily(true)}>{dDone ? "✓ " + t("completed") : t("solveDaily")}</button></section>
          <section className="card"><h3>{t("recentLessons")}</h3>
            {s.recent.length ? s.recent.slice(0, 5).map((r) => { const f = findLesson(r.id); return f && (
              <Link key={r.id} href={"/learn/" + r.id} className="row" style={{ textDecoration: "none", padding: "8px 0", borderBottom: "1px solid var(--line)" }}>
                <span className={"check " + (s.done[r.id] ? "on" : "")}>{s.done[r.id] ? "✓" : "·"}</span>
                <span className="grow">{f.lesson.title}<div className="small dim">{f.course.title} · {timeAgo(r.ts)}</div></span></Link>); })
              : <div className="empty small">{t("emptyLessons")}</div>}
          </section>
        </div>
      </div>
      <div className="grid g2" style={{ marginTop: 16, alignItems: "start" }}>
        <section className="card"><div className="row"><h3 className="grow" style={{ margin: 0 }}>{t("projects")}</h3><Link className="btn sm" href="/builder"><Icon.plus /> {t("newProject")}</Link></div>
          {projects.length ? projects.slice(0, 8).map((p) => (
            <div key={p.id} className="row" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
              <div className="grow"><b>{p.name}</b><div className="small dim">{p.files.length} files · {timeAgo(p.updatedAt)}</div></div>
              <button className="btn sm" onClick={() => { update((x) => { x.activeProject = p.id; }); router.push("/studio"); }}>{t("open")}</button>
              <button className="btn sm danger" aria-label={t("del") + " " + p.name} onClick={() => setConfirm({ title: t("del") + ": " + p.name, run: () => deleteProject(p.id) })}>✕</button>
            </div>)) : <div className="empty small" style={{ marginTop: 10 }}>{t("emptyProjects")}</div>}
        </section>
        <section className="card"><h3>{t("savedChats")}</h3>
          {chats.length ? chats.map((c) => (
            <div key={c.id} className="row" style={{ padding: "10px 0", borderBottom: "1px solid var(--line)" }}>
              <div className="grow"><b>{c.kind === "tutor" ? "🧑‍🏫" : "💬"} {c.title}</b><div className="small dim">{c.messages.length} messages · {timeAgo(c.updatedAt)}</div></div>
              <button className="btn sm" onClick={() => { if (c.kind === "tutor") setTranscript(c); else { update((x) => { x.activeChat = c.id; if (c.projectId && x.projects[c.projectId]) x.activeProject = c.projectId; }); router.push("/studio"); } }}>{t("open")}</button>
              <button className="btn sm danger" aria-label={t("del")} onClick={() => setConfirm({ title: t("del") + "?", run: () => deleteChat(c.id) })}>✕</button>
            </div>)) : <div className="empty small">{t("emptyChats")}</div>}
        </section>
      </div>
      <section className="card" style={{ marginTop: 16 }}><h3>{t("badges")} · {Object.keys(s.badges).length}/{BADGES.length}</h3>
        <div className="grid g3" style={{ gap: 10 }}>
          {BADGES.map((b) => <div key={b.id} className={"ach " + (s.badges[b.id] ? "" : "locked")}><span className="em">{b.em}</span><div><b>{b.name}</b><div className="small muted">{b.desc}</div></div></div>)}
        </div>
      </section>
      {daily && <DailyChallenge open onClose={() => setDaily(false)} />}
      <ConfirmModal open={!!confirm} title={confirm?.title || ""} body={t("areYouSure")} confirmLabel={t("del")} cancelLabel={t("cancel")} onConfirm={() => confirm?.run()} onClose={() => setConfirm(null)} />
      <Modal open={!!transcript} onClose={() => setTranscript(null)} label={transcript?.title}>
        {transcript && <><div className="row"><h3 className="grow">{transcript.title}</h3><button className="btn sm" onClick={() => setTranscript(null)} aria-label="Close">✕</button></div>
          <div className="msgs" style={{ padding: 0 }}>{transcript.messages.map((m, n) => <div key={n} className={"msg " + (m.role === "user" ? "user" : "ai")}><Markdown text={m.role === "user" && n === 0 ? (m.content.split("Code:")[1] || m.content).slice(0, 3000) : m.content} prefix={"tr" + n} /></div>)}</div></>}
      </Modal>
    </div>
  );
}
