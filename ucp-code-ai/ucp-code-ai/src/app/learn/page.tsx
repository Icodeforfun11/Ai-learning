"use client";
import Link from "next/link";
import { useState } from "react";
import { useApp, today } from "@/lib/store";
import { COURSES, coursePct, dailyForToday, type Level } from "@/data/courses";
import DailyChallenge from "@/components/DailyChallenge";

export default function LearnPage() {
  const { s, t } = useApp();
  const [filter, setFilter] = useState<"all" | Level>("all");
  const [daily, setDaily] = useState(false);
  const d = dailyForToday(), dDone = s.daily[today()];
  return (
    <div className="wrap page">
      <div className="page-head">
        <div><div className="eyebrow">{t("learn")}</div><h2>{t("courses")}</h2><p className="muted">Personalized for: <b>{t(s.profile.level)}</b> · <Link href="/settings">change</Link></p></div>
        <div className="chips" role="group" aria-label="Filter by level">
          {(["all", "beginner", "intermediate", "advanced"] as const).map((l) => <button key={l} className="chip" aria-pressed={filter === l} onClick={() => setFilter(l)}>{l === "all" ? t("allLevels") : t(l)}</button>)}
        </div>
      </div>
      <div className="card" style={{ marginBottom: 18, display: "flex", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div className="icon-tile">📅</div>
        <div className="grow"><b>{t("daily")}: {d.title}</b><div className="small muted">{dDone ? t("dailyDone") : "+40 XP · " + d.prompt.replace(/`/g, "")}</div></div>
        <button className={"btn " + (dDone ? "" : "primary")} onClick={() => setDaily(true)}>{dDone ? "✓ " + t("completed") : t("solveDaily")}</button>
      </div>
      <div className="grid g3">
        {COURSES.filter((c) => filter === "all" || c.level === filter || c.lessons.some((l) => l.level === filter)).map((c) => {
          const pct = coursePct(c, s.done), next = c.lessons.find((l) => !s.done[l.id]) || c.lessons[0];
          return (
            <article key={c.id} className="card hover" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <div className="row"><div className="icon-tile" style={{ background: c.color, color: "#0b1020" }}>{c.short}</div>
                <div className="grow"><h3 style={{ margin: 0 }}>{c.title}</h3><span className={"badge " + c.level}>{t(c.level)}</span> {c.level === s.profile.level && <span className="badge">★ Recommended</span>}</div></div>
              <p className="muted small" style={{ margin: 0, flex: 1 }}>{c.desc}</p>
              <div><div className="row small muted" style={{ justifyContent: "space-between" }}><span>{c.lessons.length} {t("lessons")}</span><span>{pct}% {t("complete")}</span></div>
                <div className="progress" style={{ marginTop: 6 }}><i style={{ width: pct + "%" }} /></div></div>
              <div className="row"><Link className="btn sm primary" href={"/learn/" + next.id}>{pct ? t("continue") : t("startCourse")}</Link><Link className="btn sm" href={"/learn/course/" + c.id}>{t("lessons")}</Link></div>
            </article>
          );
        })}
      </div>
      {daily && <DailyChallenge open onClose={() => setDaily(false)} />}
    </div>
  );
}
