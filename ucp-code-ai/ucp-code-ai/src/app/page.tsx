"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { hl } from "@/lib/markdown";
import { Icon } from "@/components/Icons";

const DEMO_CODE = '<button class="glow" id="b">\n  Clicked 0 times\n</button>\n<style>\n.glow { padding: 14px 24px;\n  border-radius: 14px; border: 0;\n  background: linear-gradient(135deg,#3d8bff,#8b5cff);\n  color: #fff; box-shadow: 0 0 30px #8b5cff; }\n</style>\n<script>\nlet n = 0;\nb.onclick = () => b.textContent =\n  `Clicked ${++n} times`;\n</script>';

const FEATURES: [string, string, string, string][] = [
  ["✨", "AI pair programmer", "Ask AI to write, explain and fix code. Answers stream live, and code applies to your project in one tap.", "/studio"],
  ["⚡", "Live sandboxed preview", "HTML, CSS and JavaScript run instantly in an isolated sandbox with a real console.", "/studio"],
  ["🎓", "Interactive courses", "Seven tracks from fundamentals to React, with runnable examples, exercises with instant checks and quizzes.", "/learn"],
  ["🧑‍🏫", "AI tutor that guides", "Line-by-line explanations, practice exercises, solution reviews and bug diagnosis in English or Arabic.", "/tutor"],
  ["🛠️", "Project builder", "Start from a portfolio, landing page, calculator, dashboard or game, then let AI customize it.", "/builder"],
  ["🏆", "XP, streaks & badges", "Daily challenges, levels and achievements keep you coming back.", "/dashboard"],
];
const FAQ: [string, string][] = [
  ["Is the AI real?", "Yes. When the server has an AI provider key configured, answers stream from a real model in real time. Without one, the app clearly shows Demo Mode and labels every pre-written reply."],
  ["Which languages can I run?", "HTML, CSS, JavaScript and React run live in a secure, sandboxed preview. Python and TypeScript lessons use guided examples, automatic syntax checks and AI review, because they need an execution environment outside the browser."],
  ["Is my code safe?", "Your code runs in an isolated sandbox that can't access the app, your account or your data. Nothing you write is executed on our servers."],
  ["Where is my progress saved?", "Signed in, your progress, projects and chats sync to your account, protected by per-user access rules. Otherwise they're saved in this browser."],
  ["Can I use it on iPhone?", "Yes. Every screen is built for touch. In Safari, tap Share → Add to Home Screen for a full-screen app."],
  ["Does it cost anything?", "No payments or billing are built into this app."],
];

export default function Home() {
  const { t, s } = useApp();
  const [i, setI] = useState(0);
  const [clicks, setClicks] = useState(0);
  const reduce = s.settings.reduceMotion;
  useEffect(() => {
    if (reduce) { setI(DEMO_CODE.length); return; }
    if (i >= DEMO_CODE.length) return;
    const h = setTimeout(() => setI((x) => x + 2), 22);
    return () => clearTimeout(h);
  }, [i, reduce]);
  const done = i >= DEMO_CODE.length;

  return (
    <>
      <div className="wrap">
        <section className="hero">
          <div>
            <div className="eyebrow">{t("heroEyebrow")}</div>
            <h1>{t("heroTitle1")}<br /><span className="grad-text">{t("heroTitle2")}</span></h1>
            <p className="lead">{t("heroLead")}</p>
            <div className="row" style={{ marginTop: 22 }}>
              <Link className="btn primary" href="/learn">{t("startLearning")} <Icon.arrow /></Link>
              <Link className="btn" href="/studio"><Icon.tutor /> {t("openStudio")}</Link>
            </div>
            <div className="row small muted" style={{ marginTop: 18, gap: 16 }}>
              <span>✓ HTML · CSS · JS · Python · TS · React</span><span>✓ English · العربية</span><span>✓ Works on iPhone</span>
            </div>
          </div>
          <div className="demo-win" aria-label="Animated demo: AI writes code and the preview updates">
            <div className="demo-bar"><i /><i /><i /><span style={{ marginInlineStart: 8 }}>index.html · UCP Studio</span></div>
            <div className="ai-bubble">✨ <b>You:</b> “Make a glowing button that counts clicks”</div>
            <div className="demo-body" dir="ltr">
              <pre className="demo-code"><span dangerouslySetInnerHTML={{ __html: hl(DEMO_CODE.slice(0, i), "html") }} />{!done && <span className="caret" />}</pre>
              <div className="demo-prev">
                {done ? <button onClick={() => setClicks((c) => c + 1)} style={{ padding: "14px 24px", borderRadius: 14, border: 0, background: "linear-gradient(135deg,#3d8bff,#8b5cff)", color: "#fff", font: "600 15px system-ui", boxShadow: "0 0 30px #8b5cff", cursor: "pointer" }}>Clicked {clicks} times</button>
                  : <span style={{ color: "#999", font: "13px system-ui" }}>Preview</span>}
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="section"><div className="wrap">
        <div className="eyebrow">Features</div><h2>{t("featuresTitle")}</h2>
        <div className="grid g3" style={{ marginTop: 24 }}>
          {FEATURES.map(([e, h, p, href]) => (
            <Link key={h} className="card hover" href={href} style={{ textDecoration: "none" }}>
              <div style={{ fontSize: "1.6rem" }}>{e}</div><h3 style={{ marginTop: 10 }}>{h}</h3><p className="muted small" style={{ margin: 0 }}>{p}</p>
            </Link>
          ))}
        </div>
      </div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="wrap">
        <div className="eyebrow">Workflow</div><h2>{t("howTitle")}</h2>
        <div className="grid g3 steps" style={{ marginTop: 24 }}>
          <div className="card"><h3>Learn the concept</h3><p className="muted small" style={{ margin: 0 }}>Short lessons with examples you can edit and run right away.</p></div>
          <div className="card"><h3>Practice with feedback</h3><p className="muted small" style={{ margin: 0 }}>Solve exercises. Automatic checks and hints guide you before the answer is ever revealed.</p></div>
          <div className="card"><h3>Build real projects</h3><p className="muted small" style={{ margin: 0 }}>Use the Studio and AI to build, preview and export complete web apps.</p></div>
        </div>
      </div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="wrap">
        <div className="eyebrow">Pathway</div><h2>{t("pathTitle")}</h2>
        <div className="path" style={{ marginTop: 24 }}>
          {([["beginner", "Fundamentals → HTML → CSS → Python basics"], ["intermediate", "JavaScript → DOM & events → TypeScript → Flexbox"], ["advanced", "Async JS → Generics → React state → Responsive design"]] as const).map(([lv, txt], n) => (
            <div key={lv} className="card"><span className={"badge " + lv}>{t(lv)}</span><h3 style={{ marginTop: 12 }}>Stage {n + 1}</h3><p className="muted small" style={{ margin: 0 }}>{txt}</p></div>
          ))}
        </div>
      </div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="wrap">
        <div className="eyebrow">Voices</div><h2>{t("testiTitle")}</h2>
        <p className="small"><span className="badge demo">PLACEHOLDER</span> <span className="muted">{t("placeholderNote")}</span></p>
        <div className="grid g3" style={{ marginTop: 16 }}>
          {["“The tutor asked me questions until I found the bug myself.”", "“I built my first game in a weekend.”", "“Arabic explanations made everything click.”"].map((q, n) => (
            <figure key={n} className="card" style={{ margin: 0 }}><blockquote style={{ margin: "0 0 12px" }}>{q}</blockquote><figcaption className="dim small">Placeholder learner {n + 1}</figcaption></figure>
          ))}
        </div>
      </div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="wrap" style={{ maxWidth: 820 }}>
        <div className="eyebrow">FAQ</div><h2>{t("faqTitle")}</h2>
        {FAQ.map(([q, a]) => <details key={q} className="faq"><summary>{q}</summary><p>{a}</p></details>)}
      </div></section>

      <section className="section" style={{ paddingTop: 0 }}><div className="wrap">
        <div className="cta"><h2>{t("ctaTitle")}</h2><p className="muted">No setup. No installs.</p><Link className="btn primary" href="/studio">{t("ctaBtn")} <Icon.arrow /></Link></div>
      </div></section>
      <footer className="foot"><div className="wrap row" style={{ justifyContent: "space-between" }}>
        <span>© {new Date().getFullYear()} UCP CODE AI · Universal Creativity Projects</span>
        <span className="row"><Link href="/learn">{t("learn")}</Link><Link href="/community">{t("community")}</Link><Link href="/settings">{t("settings")}</Link></span>
      </div></footer>
    </>
  );
}
