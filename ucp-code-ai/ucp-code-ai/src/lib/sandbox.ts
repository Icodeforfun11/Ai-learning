/**
 * Sandboxed execution for learner / AI-generated web code.
 * Untrusted code only ever runs inside <iframe sandbox="allow-scripts"> with an opaque origin:
 * it cannot read this app's DOM, cookies, localStorage, Supabase session or call our API with credentials.
 * Nothing is executed on the server.
 */
import type { ProjectFile } from "@/data/templates";
import type { Test } from "@/data/courses";

export type ConsoleMsg = { __ucp: string; type: "log" | "info" | "warn" | "error" | "tests"; args: string[]; results?: TestResult[] };
export type TestResult = { name: string; pass: boolean; err?: string };

export const uid = (p = "") => p + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

export const bridge = (id: string) =>
  "<script>(function(){var I=" + JSON.stringify(id) + ";window.__logs=[];" +
  "function f(x){try{if(x===undefined)return'undefined';if(typeof x==='string')return x;if(x instanceof Error)return x.name+': '+x.message;if(typeof x==='function')return'[Function '+(x.name||'anonymous')+']';return JSON.stringify(x)}catch(e){return String(x)}}" +
  "function s(t,a){var v=[].map.call(a,f);if(t==='log'||t==='info')window.__logs.push(v.join(' '));try{parent.postMessage({__ucp:I,type:t,args:v},'*')}catch(e){}}" +
  "['log','info','warn','error'].forEach(function(k){var o=console[k];console[k]=function(){s(k,arguments);o&&o.apply(console,arguments)}});" +
  "window.addEventListener('error',function(e){s('error',[(e.message||'Error')+(e.lineno?' (line '+e.lineno+')':'')])});" +
  "window.addEventListener('unhandledrejection',function(e){s('error',['Unhandled promise rejection: '+((e.reason&&e.reason.message)||e.reason)])});" +
  "window.alert=function(m){s('info',['alert: '+m])};" +
  "})();<\/script>";

const REACT_LIBS =
  '<script src="https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.development.js"><\/script>' +
  '<script src="https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.development.js"><\/script>' +
  '<script src="https://cdn.jsdelivr.net/npm/@babel/standalone@7.26.4/babel.min.js"><\/script>';

export type DocKind = "html" | "css" | "js" | "react";
export function buildDoc(kind: DocKind, code: string, id: string, extra = ""): string {
  const head = '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' + bridge(id);
  if (kind === "js") return head + "<style>body{font-family:system-ui;color:#555;padding:12px}</style></head><body><p>JavaScript is running. Output appears in the console.</p><script>" + code + "\n<\/script>" + extra + "</body></html>";
  if (kind === "react") return head + REACT_LIBS + '</head><body><div id="root"></div><script type="text/babel" data-presets="react">const { useState, useEffect, useRef } = React;\n' + code + "\n<\/script>" + extra + "</body></html>";
  if (kind === "css") return head + "<style>" + code + "</style></head><body>" + extra + "</body></html>";
  return head + "</head><body>" + code + extra + "</body></html>";
}

/** Inline local style.css / script.js references so a multi-file project renders inside srcdoc. */
export function buildProject(files: ProjectFile[], id: string): string {
  const map = Object.fromEntries(files.map((f) => [f.name, f.content]));
  let html = map["index.html"] ?? '<!DOCTYPE html><html><body><p style="font-family:system-ui">Add an index.html file to preview.</p></body></html>';
  for (const f of files) {
    const n = f.name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (f.name.endsWith(".css")) html = html.replace(new RegExp("<link[^>]+href=[\"']\\.?/?" + n + "[\"'][^>]*>", "gi"), () => "<style>\n" + f.content + "\n</style>");
    if (/\.(js|mjs)$/.test(f.name))
      html = html.replace(new RegExp("<script([^>]*)src=[\"']\\.?/?" + n + "[\"']([^>]*)>\\s*</script>", "gi"), (_m, a: string, b: string) =>
        "<script" + a.replace(/\s+$/, "") + b + ">\n" + f.content.replace(/<\/script/gi, "<\\/script") + "\n<\/script>");
  }
  const b = bridge(id);
  return /<head[^>]*>/i.test(html) ? html.replace(/<head[^>]*>/i, (m) => m + b) : b + html;
}

type Handler = { frame: HTMLIFrameElement | null; fn: (d: ConsoleMsg) => void };
const handlers = new Map<string, Handler>();
let listening = false;
function listen() {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("message", (e: MessageEvent) => {
    const d = e.data as ConsoleMsg;
    if (!d || typeof d.__ucp !== "string") return;
    const h = handlers.get(d.__ucp);
    if (h && (!h.frame || e.source === h.frame.contentWindow)) h.fn(d);
  });
}

/** Mount srcdoc into a sandboxed iframe and receive its console output. Returns an unsubscribe function. */
export function mountPreview(frame: HTMLIFrameElement, make: (id: string) => string, onMsg?: (d: ConsoleMsg) => void) {
  listen();
  const id = uid("sb");
  frame.setAttribute("sandbox", "allow-scripts allow-forms allow-modals");
  handlers.set(id, { frame, fn: onMsg || (() => {}) });
  frame.srcdoc = make(id);
  return () => handlers.delete(id);
}

/** Run exercise checks in a hidden sandbox. Pattern tests are static regex checks for languages we don't execute. */
export function runTests(opts: { type: "html" | "css" | "js" | "pattern"; code: string; fixture?: string; tests: Test[]; isAsync?: boolean }): Promise<TestResult[]> {
  const { type, code, fixture = "", tests, isAsync } = opts;
  return new Promise((resolve) => {
    if (type === "pattern") {
      resolve(tests.map((t) => { let pass = false; try { pass = new RegExp(t.re || "", "m").test("\n" + code); } catch {} return { name: t.name, pass }; }));
      return;
    }
    listen();
    const id = uid("tst");
    const frame = document.createElement("iframe");
    frame.style.cssText = "position:absolute;width:1px;height:1px;opacity:0;pointer-events:none;border:0";
    frame.setAttribute("aria-hidden", "true");
    frame.tabIndex = -1;
    const errors: string[] = [];
    const runner =
      "<script>window.addEventListener('load',function(){setTimeout(async function(){var T=" + JSON.stringify(tests) + ",r=[];" +
      "for(var i=0;i<T.length;i++){try{var fn=new (Object.getPrototypeOf(async function(){}).constructor)('return ('+T[i].expr+')');r.push({name:T[i].name,pass:!!(await fn())})}catch(e){r.push({name:T[i].name,pass:false,err:e.message})}}" +
      "parent.postMessage({__ucp:" + JSON.stringify(id) + ",type:'tests',args:[],results:r},'*')}," + (isAsync ? 120 : 30) + ")})<\/script>";
    const doc = type === "js" ? buildDoc("js", code, id, runner) : type === "css" ? buildDoc("css", code, id, fixture + runner) : buildDoc("html", code, id, runner);
    const done = (res: TestResult[]) => { clearTimeout(timer); handlers.delete(id); frame.remove(); resolve(res); };
    const timer = setTimeout(() => done([{ name: "Run finished in time", pass: false, err: "Timed out. Is there an infinite loop?" }]), 5000);
    handlers.set(id, {
      frame,
      fn: (d) => {
        if (d.type === "error") errors.push(d.args.join(" "));
        if (d.type === "tests" && d.results) done(d.results.map((r) => (!r.pass && !r.err && errors.length ? { ...r, err: errors[0] } : r)));
      },
    });
    frame.setAttribute("sandbox", "allow-scripts");
    frame.srcdoc = doc;
    document.body.appendChild(frame);
  });
}

/** Extract ```lang filename blocks from an AI reply. */
export function parseFiles(text: string): ProjectFile[] {
  const files: ProjectFile[] = [];
  const re = /```([\w+#-]*)[ \t]+([\w.\-\/]+\.[a-z]{1,5})[ \t]*\n([\s\S]*?)```/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) files.push({ name: m[2].replace(/^\.?\//, ""), content: m[3].replace(/\n$/, "") });
  return files;
}

export const langOf = (name: string) => {
  const e = (name.split(".").pop() || "").toLowerCase();
  return ({ htm: "html", html: "html", css: "css", js: "javascript", mjs: "javascript", jsx: "javascript", ts: "typescript", tsx: "typescript", py: "python", json: "json", md: "markdown" } as Record<string, string>)[e] || "plaintext";
};
