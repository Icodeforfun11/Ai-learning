"use client";
/**
 * App state: settings, learning progress, projects and chats.
 * Always persisted to localStorage; additionally synced to Supabase (RLS-protected tables) when the user is signed in.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { I18N, type I18nKey } from "@/data/i18n";
import { COURSES, type Level } from "@/data/courses";
import { BLANK, type ProjectFile } from "@/data/templates";
import { uid } from "@/lib/sandbox";

export type Project = { id: string; name: string; files: ProjectFile[]; createdAt: number; updatedAt: number; template?: string | null };
export type ChatMsg = { role: "user" | "assistant"; content: string; ctx?: string; att?: string; demo?: boolean; ts: number };
export type Chat = { id: string; kind: "studio" | "tutor"; title: string; projectId?: string; messages: ChatMsg[]; updatedAt: number };
export type Settings = { theme: "dark" | "light"; lang: "en" | "ar"; fontSize: number; reduceMotion: boolean; contrast: boolean; tier: "quick" | "default" | "deep"; tutorLang: "en" | "ar" };
export type State = {
  updatedAt: number;
  profile: { name: string; level: Level };
  settings: Settings;
  xp: number; done: Record<string, number>; quizOk: Record<string, number>; exOk: Record<string, number>;
  badges: Record<string, number>; streak: { count: number; last: string | null }; daily: Record<string, boolean>;
  recent: { id: string; ts: number }[]; projects: Record<string, Project>; chats: Record<string, Chat>;
  activeProject: string | null; activeChat: string | null;
};

export const DEFAULT_STATE = (): State => ({
  updatedAt: 0, profile: { name: "", level: "beginner" },
  settings: { theme: "dark", lang: "en", fontSize: 15, reduceMotion: false, contrast: false, tier: "default", tutorLang: "en" },
  xp: 0, done: {}, quizOk: {}, exOk: {}, badges: {}, streak: { count: 0, last: null }, daily: {}, recent: [], projects: {}, chats: {},
  activeProject: null, activeChat: null,
});

export const BADGES = [
  { id: "first-lesson", em: "🎯", name: "First steps", desc: "Complete your first lesson" },
  { id: "five-lessons", em: "📚", name: "Bookworm", desc: "Complete 5 lessons" },
  { id: "ten-lessons", em: "🏛️", name: "Scholar", desc: "Complete 10 lessons" },
  { id: "quiz-master", em: "🧠", name: "Quiz master", desc: "Answer 10 quiz questions correctly" },
  { id: "solver", em: "🧩", name: "Problem solver", desc: "Pass 5 exercises" },
  { id: "streak-3", em: "🔥", name: "On fire", desc: "3-day learning streak" },
  { id: "streak-7", em: "⚡", name: "Unstoppable", desc: "7-day learning streak" },
  { id: "builder", em: "🛠️", name: "Builder", desc: "Create your first project" },
  { id: "ai-pair", em: "🤖", name: "AI pair programmer", desc: "Have your first AI conversation" },
  { id: "polyglot", em: "🌍", name: "Polyglot", desc: "Finish lessons in 3 different courses" },
  { id: "daily", em: "📅", name: "Daily coder", desc: "Solve a daily challenge" },
];
export const levelOf = (xp: number) => Math.floor(xp / 250) + 1;
const dayStr = (d: Date) => d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
export const today = () => dayStr(new Date());
const yesterday = () => dayStr(new Date(Date.now() - 864e5));

type Toast = { id: string; msg: string; kind: string };
type AiStatus = "checking" | "live" | "demo";
type Ctx = {
  s: State; ready: boolean; session: Session | null; aiStatus: AiStatus; syncMode: "cloud" | "local"; toasts: Toast[];
  update: (fn: (s: State) => void, dirty?: string[]) => void;
  t: (k: I18nKey) => string;
  toast: (msg: string, kind?: string) => void;
  addXP: (n: number, s: State) => void; award: (id: string, s: State) => void; checkBadges: (s: State) => void; streakNow: () => number;
  newProject: (name: string, files?: ProjectFile[], template?: string | null) => Project;
  deleteProject: (id: string) => void; deleteChat: (id: string) => void;
  ask: (o: { mode: "studio" | "tutor" | "builder" | "review"; messages: { role: "user" | "assistant"; content: string }[]; onText?: (s: string) => void; signal?: AbortSignal }) => Promise<string>;
};
const AppCtx = createContext<Ctx | null>(null);
export const useApp = () => { const c = useContext(AppCtx); if (!c) throw new Error("useApp outside provider"); return c; };

const DEMO: Record<string, string> = {
  studio: "**Demo Mode: this is a pre-written example, not an AI response.**\n\nNo AI provider is configured on this server, so live answers are off. Here's the kind of reply you'd get:\n\n```html index.html\n<!DOCTYPE html>\n<html>\n<head><link rel=\"stylesheet\" href=\"style.css\"></head>\n<body>\n  <h1>Hello from the demo</h1>\n  <button id=\"btn\">Click me</button>\n  <script src=\"script.js\"></script>\n</body>\n</html>\n```\n\nAsk the site owner to set an AI API key to enable live AI.",
  tutor: "**Demo Mode: this is a pre-written example, not an AI response.**\n\nA live tutor session would:\n1. Walk through your code line by line in plain language\n2. Ask you a guiding question instead of handing over the answer\n3. Suggest one small next step to try",
  builder: "**Demo Mode: this is a pre-written example, not an AI response.** AI generation is off on this server, so start from a template. Every template works without AI.",
  review: "**Demo Mode: this is a pre-written example, not an AI response.** The automatic checks above still ran for real. AI review needs a configured AI provider.",
};

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(DEFAULT_STATE);
  const [ready, setReady] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [aiStatus, setAi] = useState<AiStatus>("checking");
  const [toasts, setToasts] = useState<Toast[]>([]);
  const dirty = useRef(new Set<string>());
  const deleted = useRef(new Set<string>());
  const sref = useRef(s); sref.current = s;

  const toast = useCallback((msg: string, kind = "") => {
    const id = uid("t"); setToasts((x) => [...x, { id, msg, kind }]);
    setTimeout(() => setToasts((x) => x.filter((y) => y.id !== id)), 3800);
  }, []);

  // load local state
  useEffect(() => {
    try { const raw = localStorage.getItem("ucp.state"); if (raw) { const v = JSON.parse(raw); setS({ ...DEFAULT_STATE(), ...v, settings: { ...DEFAULT_STATE().settings, ...v.settings } }); } } catch {}
    setReady(true);
    fetch("/api/status").then((r) => r.json()).then((j) => setAi(j.ai === "live" ? "live" : "demo")).catch(() => setAi("demo"));
  }, []);

  // apply settings to <html>
  useEffect(() => {
    const r = document.documentElement, st = s.settings;
    r.dataset.theme = st.theme; r.lang = st.lang; r.dir = st.lang === "ar" ? "rtl" : "ltr";
    r.dataset.motion = st.reduceMotion ? "reduce" : ""; r.dataset.contrast = st.contrast ? "high" : "";
    r.style.setProperty("--fs", st.fontSize + "px");
  }, [s.settings]);

  // persist locally
  useEffect(() => { if (!ready) return; const h = setTimeout(() => { try { localStorage.setItem("ucp.state", JSON.stringify(s)); } catch {} }, 300); return () => clearTimeout(h); }, [s, ready]);

  // Supabase auth + initial cloud load
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, sess) => setSession(sess));
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    if (!supabase || !session || !ready) return;
    (async () => {
      const uidv = session.user.id;
      const [{ data: prof }, { data: projects }, { data: chats }] = await Promise.all([
        supabase!.from("profiles").select("*").eq("id", uidv).maybeSingle(),
        supabase!.from("projects").select("*").order("updated_at", { ascending: false }).limit(200),
        supabase!.from("chats").select("*").order("updated_at", { ascending: false }).limit(200),
      ]);
      setS((cur) => {
        const next = structuredClone(cur);
        const remoteUpdated = prof?.updated_at ? Date.parse(prof.updated_at) : 0;
        if (prof && remoteUpdated > cur.updatedAt && prof.progress && Object.keys(prof.progress).length) {
          Object.assign(next, prof.progress);
          next.profile = { name: prof.display_name || "", level: prof.skill_level || "beginner" };
          next.settings = { ...next.settings, ...(prof.settings || {}) };
        }
        for (const p of projects || []) { const u = Date.parse(p.updated_at); if (!next.projects[p.id] || u > next.projects[p.id].updatedAt) next.projects[p.id] = { id: p.id, name: p.name, files: p.files, template: p.template, createdAt: Date.parse(p.created_at), updatedAt: u }; }
        for (const c of chats || []) { const u = Date.parse(c.updated_at); if (!next.chats[c.id] || u > next.chats[c.id].updatedAt) next.chats[c.id] = { id: c.id, kind: c.kind, title: c.title, projectId: c.project_id || undefined, messages: c.messages, updatedAt: u }; }
        Object.keys(next.projects).forEach((k) => dirty.current.add("p:" + k));
        Object.keys(next.chats).forEach((k) => dirty.current.add("c:" + k));
        dirty.current.add("core");
        return next;
      });
    })().catch(() => toast("Couldn't load your cloud data. Working locally.", "err"));
  }, [session, ready, toast]);

  // debounced cloud writes
  const flushing = useRef(false);
  const flush = useCallback(async () => {
    if (!supabase || !session || flushing.current) return;
    flushing.current = true;
    const st = sref.current, user_id = session.user.id;
    try {
      while (dirty.current.size) {
        const key = dirty.current.values().next().value as string; dirty.current.delete(key);
        if (key === "core") {
          const { projects, chats, profile, settings, ...progress } = st;
          await supabase.from("profiles").upsert({ id: user_id, display_name: profile.name, skill_level: profile.level, settings, progress, updated_at: new Date(st.updatedAt || Date.now()).toISOString() });
        } else {
          const [kind, id] = key.split(":");
          if (kind === "p") {
            const p = st.projects[id];
            if (p) await supabase.from("projects").upsert({ id, user_id, name: p.name, files: p.files, template: p.template ?? null, created_at: new Date(p.createdAt).toISOString(), updated_at: new Date(p.updatedAt).toISOString() });
            else if (deleted.current.has(id)) await supabase.from("projects").delete().eq("id", id);
          } else {
            const c = st.chats[id];
            if (c) await supabase.from("chats").upsert({ id, user_id, kind: c.kind, title: c.title.slice(0, 120), project_id: c.projectId ?? null, messages: c.messages.slice(-80), updated_at: new Date(c.updatedAt).toISOString() });
            else if (deleted.current.has(id)) await supabase.from("chats").delete().eq("id", id);
          }
        }
      }
    } catch { toast("Cloud sync failed. Your changes are saved on this device.", "err"); }
    finally { flushing.current = false; }
  }, [session, toast]);
  useEffect(() => { if (!session) return; const h = setTimeout(flush, 1000); return () => clearTimeout(h); }, [s, session, flush]);

  const update = useCallback((fn: (s: State) => void, keys: string[] = []) => {
    setS((cur) => { const next = structuredClone(cur); fn(next); next.updatedAt = Date.now(); return next; });
    keys.concat("core").forEach((k) => dirty.current.add(k));
  }, []);

  const t = useCallback((k: I18nKey) => (I18N[s.settings.lang] as Record<string, string>)[k] || I18N.en[k] || k, [s.settings.lang]);

  // gamification (mutate the draft passed in by update())
  const award = useCallback((id: string, st: State) => {
    if (st.badges[id]) return; st.badges[id] = Date.now();
    const b = BADGES.find((x) => x.id === id); if (b) setTimeout(() => toast(b.em + " Badge unlocked: " + b.name, "ok"), 0);
  }, [toast]);
  const touchStreak = useCallback((st: State) => {
    const d = today(); if (st.streak.last === d) return;
    st.streak.count = st.streak.last === yesterday() ? st.streak.count + 1 : 1; st.streak.last = d;
    if (st.streak.count >= 3) award("streak-3", st); if (st.streak.count >= 7) award("streak-7", st);
  }, [award]);
  const addXP = useCallback((n: number, st: State) => {
    const before = levelOf(st.xp); st.xp += n; touchStreak(st);
    if (levelOf(st.xp) > before) setTimeout(() => toast("⬆️ Level up! You're now level " + levelOf(st.xp), "ok"), 0);
  }, [touchStreak, toast]);
  const checkBadges = useCallback((st: State) => {
    const done = Object.keys(st.done).length;
    if (done >= 1) award("first-lesson", st); if (done >= 5) award("five-lessons", st); if (done >= 10) award("ten-lessons", st);
    if (Object.keys(st.quizOk).length >= 10) award("quiz-master", st); if (Object.keys(st.exOk).length >= 5) award("solver", st);
    if (new Set(COURSES.filter((c) => c.lessons.some((l) => st.done[l.id])).map((c) => c.id)).size >= 3) award("polyglot", st);
  }, [award]);
  const streakNow = useCallback(() => (s.streak.last === today() || s.streak.last === yesterday() ? s.streak.count : 0), [s.streak]);

  const newProject = useCallback((name: string, files: ProjectFile[] = BLANK, template: string | null = null) => {
    const now = Date.now();
    const p: Project = { id: uid("p"), name: name || "Untitled project", files: structuredClone(files), createdAt: now, updatedAt: now, template };
    update((st) => { st.projects[p.id] = p; st.activeProject = p.id; award("builder", st); }, ["p:" + p.id]);
    return p;
  }, [update, award]);
  const deleteProject = useCallback((id: string) => { deleted.current.add(id); update((st) => { delete st.projects[id]; if (st.activeProject === id) st.activeProject = null; }, ["p:" + id]); }, [update]);
  const deleteChat = useCallback((id: string) => { deleted.current.add(id); update((st) => { delete st.chats[id]; if (st.activeChat === id) st.activeChat = null; }, ["c:" + id]); }, [update]);

  const busy = useRef(false);
  const ask: Ctx["ask"] = useCallback(async ({ mode, messages, onText, signal }) => {
    if (busy.current) throw new Error("Please wait for the current answer to finish.");
    busy.current = true;
    try {
      const demo = async () => {
        const text = DEMO[mode] || DEMO.studio; let out = "";
        for (const w of text.split(/(\s+)/)) { if (signal?.aborted) break; out += w; onText?.(out); await new Promise((r) => setTimeout(r, 12)); }
        return out;
      };
      if (aiStatus !== "live") return await demo();
      const headers: Record<string, string> = { "content-type": "application/json" };
      if (session?.access_token) headers.authorization = "Bearer " + session.access_token;
      const st = sref.current;
      const res = await fetch("/api/ai", { method: "POST", headers, signal, body: JSON.stringify({ mode, level: st.profile.level, lang: mode === "tutor" ? st.settings.tutorLang : st.settings.lang, tier: st.settings.tier, messages: messages.map((m) => ({ role: m.role, content: m.content.slice(0, 40000) })) }) });
      if (res.status === 503) { setAi("demo"); return await demo(); }
      if (!res.ok || !res.body) { const j = await res.json().catch(() => ({})); throw new Error(j.error || "AI request failed (" + res.status + ")."); }
      const reader = res.body.getReader(), dec = new TextDecoder(); let out = "";
      for (;;) { const { done, value } = await reader.read(); if (done) break; out += dec.decode(value, { stream: true }); onText?.(out); }
      return out;
    } finally { busy.current = false; }
  }, [aiStatus, session]);

  const value = useMemo<Ctx>(() => ({ s, ready, session, aiStatus, syncMode: session ? "cloud" : "local", toasts, update, t, toast, addXP, award, checkBadges, streakNow, newProject, deleteProject, deleteChat, ask }),
    [s, ready, session, aiStatus, toasts, update, t, toast, addXP, award, checkBadges, streakNow, newProject, deleteProject, deleteChat, ask]);
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export const timeAgo = (ts: number) => { const x = (Date.now() - ts) / 1000; if (x < 60) return "just now"; if (x < 3600) return Math.floor(x / 60) + "m ago"; if (x < 86400) return Math.floor(x / 3600) + "h ago"; return Math.floor(x / 86400) + "d ago"; };
