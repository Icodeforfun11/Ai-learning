"use client";
import Link from "next/link";
import { use } from "react";
import { notFound } from "next/navigation";
import { useApp } from "@/lib/store";
import { COURSES, coursePct } from "@/data/courses";

export default function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const { s, t } = useApp();
  const c = COURSES.find((x) => x.id === courseId);
  if (!c) notFound();
  return (
    <div className="wrap page" style={{ maxWidth: 820 }}>
      <Link href="/learn" className="small muted">← {t("courses")}</Link>
      <div className="row" style={{ margin: "14px 0 6px" }}><div className="icon-tile" style={{ background: c.color, color: "#0b1020" }}>{c.short}</div>
        <div><h2 style={{ margin: 0 }}>{c.title}</h2><span className={"badge " + c.level}>{t(c.level)}</span></div></div>
      <p className="muted">{c.desc}</p>
      <div className="progress" style={{ margin: "10px 0 22px" }}><i style={{ width: coursePct(c, s.done) + "%" }} /></div>
      <div className="lesson-list">
        {c.lessons.map((l, i) => (
          <Link key={l.id} href={"/learn/" + l.id}>
            <span className={"check " + (s.done[l.id] ? "on" : "")}>{s.done[l.id] ? "✓" : i + 1}</span>
            <span className="grow"><b>{l.title}</b><br /><span className={"badge " + l.level}>{t(l.level)}</span></span>
          </Link>
        ))}
      </div>
    </div>
  );
}
