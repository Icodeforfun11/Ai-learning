"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/lib/store";
import { Icon, Logo } from "./Icons";
import Modal from "./Modal";
import type { I18nKey } from "@/data/i18n";

const NAV: [string, I18nKey][] = [["/", "home"], ["/studio", "studio"], ["/learn", "learn"], ["/tutor", "tutor"], ["/builder", "builder"], ["/community", "community"], ["/dashboard", "dashboard"], ["/settings", "settings"]];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const { t, s, update, aiStatus, syncMode, toasts } = useApp();
  const path = usePathname() || "/";
  const [more, setMore] = useState(false);
  const active = (href: string) => (href === "/" ? path === "/" : path.startsWith(href));

  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  useEffect(() => setMore(false), [path]);

  return (
    <>
      <a className="skip" href="#app">{s.settings.lang === "ar" ? "انتقل إلى المحتوى" : "Skip to content"}</a>
      <header className="topbar"><div className="wrap">
        <Link className="brand" href="/" aria-label="UCP CODE AI home">
          <Logo />
          <span>UCP CODE <span className="grad-text">AI</span><small>{t("tagline")}</small></span>
        </Link>
        <nav className="navlinks" aria-label="Main">
          {NAV.map(([href, k]) => <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>{t(k)}</Link>)}
        </nav>
        <div className="top-actions">
          <span className={"pill " + aiStatus} role="status" title={(aiStatus === "live" ? "Live AI" : "Live AI not configured; replies are labeled demos") + " · " + (syncMode === "cloud" ? t("synced") : t("localOnly"))}>
            <span className="dot" /><span>{aiStatus === "live" ? t("aiLive") : aiStatus === "demo" ? t("aiDemo") : t("aiChecking")}</span>
          </span>
          <button className="btn icon ghost" aria-label="Toggle theme" onClick={() => update((x) => { x.settings.theme = x.settings.theme === "dark" ? "light" : "dark"; })}>
            {s.settings.theme === "dark" ? <Icon.sun /> : <Icon.moon />}
          </button>
          <button className="btn icon ghost" aria-label="Switch language" style={{ fontWeight: 700 }} onClick={() => update((x) => { x.settings.lang = x.settings.lang === "ar" ? "en" : "ar"; })}>
            {s.settings.lang === "ar" ? "EN" : "ع"}
          </button>
        </div>
      </div></header>

      <main id="app" tabIndex={-1}>{children}</main>

      <nav className="tabbar" aria-label="Main (mobile)">
        {(["home", "studio", "learn", "tutor"] as const).map((k) => {
          const href = k === "home" ? "/" : "/" + k; const I = Icon[k];
          return <Link key={k} href={href} aria-current={active(href) ? "page" : undefined}><I /><span>{t(k)}</span></Link>;
        })}
        <button onClick={() => setMore(true)} aria-current={["/builder", "/community", "/dashboard", "/settings"].some(active) ? "page" : undefined}><Icon.more /><span>{t("more")}</span></button>
      </nav>
      <Modal open={more} onClose={() => setMore(false)} label={t("more")}>
        <h3>{t("more")}</h3>
        <div className="grid" style={{ gap: 8 }}>
          {NAV.slice(4).map(([href, k]) => <Link key={href} className="btn" style={{ justifyContent: "flex-start" }} href={href}>{t(k)}</Link>)}
        </div>
        <div className="notice small" style={{ marginTop: 14 }}><b>📱 {t("installTitle")}</b><br />{t("installBody")}</div>
      </Modal>

      <div id="toasts" aria-live="polite">{toasts.map((x) => <div key={x.id} className={"toast " + x.kind} role="status">{x.msg}</div>)}</div>
    </>
  );
}
