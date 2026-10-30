"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/store";
import { SAMPLES, type Sample } from "@/data/templates";
import { buildProject } from "@/lib/sandbox";
import Preview from "@/components/Preview";
import Modal from "@/components/Modal";

export default function CommunityPage() {
  const { t, newProject } = useApp();
  const router = useRouter();
  const [view, setView] = useState<Sample | null>(null);
  const remix = (smp: Sample) => { newProject(smp.title + " (remix)", smp.files); router.push("/studio"); };
  return (
    <div className="wrap page">
      <div className="page-head">
        <div><div className="eyebrow">{t("community")}</div><h2>{t("communityTitle")}</h2><p className="muted">{t("communitySub")}</p></div>
        <button className="btn" disabled aria-disabled="true" title={t("shareSoon")}>Share project <span className="badge na">SOON</span></button>
      </div>
      <p className="notice small" style={{ marginBottom: 16 }}>{t("shareSoon")}</p>
      <div className="grid g3">
        {SAMPLES.map((smp) => (
          <article key={smp.id} className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ height: 170, background: "#fff", overflow: "hidden" }}>
              <Preview version={smp.id} build={(id) => buildProject(smp.files, id)} title={smp.title + " preview"} style={{ height: 340, width: "200%", transform: "scale(.5)", transformOrigin: "0 0", pointerEvents: "none" }} />
            </div>
            <div style={{ padding: 16 }}>
              <b>{smp.title}</b>
              <div className="small dim">by {smp.author} · <span className="badge na">SAMPLE</span> {smp.tags.map((x) => <span key={x} className="badge">{x}</span>)}</div>
              <div className="row" style={{ marginTop: 12 }}><button className="btn sm" onClick={() => setView(smp)}>{t("preview")}</button><button className="btn sm primary" onClick={() => remix(smp)}>{t("remix")}</button></div>
            </div>
          </article>
        ))}
      </div>
      <Modal open={!!view} onClose={() => setView(null)} wide label={view?.title}>
        {view && <>
          <div className="row" style={{ marginBottom: 10 }}><b className="grow">{view.title}</b><button className="btn sm primary" onClick={() => remix(view)}>{t("remix")}</button><button className="btn sm" onClick={() => setView(null)} aria-label="Close">✕</button></div>
          <Preview version={view.id} build={(id) => buildProject(view.files, id)} style={{ flex: 1, borderRadius: 12 }} title={view.title} />
        </>}
      </Modal>
    </div>
  );
}
