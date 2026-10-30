"use client";
import dynamic from "next/dynamic";
import type { OnMount, BeforeMount } from "@monaco-editor/react";
import { useRef } from "react";
import { useApp } from "@/lib/store";

const Monaco = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => <div className="monaco-host" style={{ display: "grid", placeItems: "center" }}><span className="spinner" /></div>,
});

const MONACO_LANG: Record<string, string> = { html: "html", css: "css", js: "javascript", javascript: "javascript", jsx: "javascript", react: "javascript", ts: "typescript", typescript: "typescript", py: "python", python: "python", json: "json" };

/** Monaco-based editor with UCP themes and Ctrl/⌘+Enter (run) and Ctrl/⌘+S (save) shortcuts. */
export default function CodeEditor({ value, language, onChange, onRun, onSave, height = "100%", label = "Code editor", readOnly = false }: {
  value: string; language: string; onChange?: (v: string) => void; onRun?: () => void; onSave?: () => void; height?: number | string; label?: string; readOnly?: boolean;
}) {
  const { s } = useApp();
  const runRef = useRef(onRun); runRef.current = onRun;
  const saveRef = useRef(onSave); saveRef.current = onSave;

  const beforeMount: BeforeMount = (monaco) => {
    monaco.editor.defineTheme("ucp-dark", { base: "vs-dark", inherit: true, rules: [{ token: "comment", foreground: "6b7aa8", fontStyle: "italic" }, { token: "keyword", foreground: "c792ff" }, { token: "string", foreground: "7ee0a5" }, { token: "number", foreground: "ffb86b" }, { token: "tag", foreground: "5cc8ff" }, { token: "attribute.name", foreground: "ffd479" }], colors: { "editor.background": "#0e1530", "editorLineNumber.foreground": "#5f6b93", "editor.selectionBackground": "#3d8bff55", "editorCursor.foreground": "#22d3ee" } });
    monaco.editor.defineTheme("ucp-light", { base: "vs", inherit: true, rules: [], colors: { "editor.background": "#ffffff" } });
  };
  const onMount: OnMount = (editor, monaco) => {
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => runRef.current?.());
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => saveRef.current?.());
  };
  const mobile = typeof window !== "undefined" && window.innerWidth < 700;

  return (
    <div className="monaco-host" style={{ height }} aria-label={label}>
      <Monaco
        value={value}
        language={MONACO_LANG[language] || language}
        theme={s.settings.theme === "light" ? "ucp-light" : "ucp-dark"}
        onChange={(v) => onChange?.(v ?? "")}
        beforeMount={beforeMount}
        onMount={onMount}
        options={{
          readOnly, fontFamily: "JetBrains Mono, ui-monospace, monospace", fontSize: mobile ? 14 : 13.5, minimap: { enabled: false }, wordWrap: mobile ? "on" : "off",
          scrollBeyondLastLine: false, automaticLayout: true, tabSize: 2, padding: { top: 12 }, ariaLabel: label, accessibilitySupport: "auto", renderLineHighlight: "line", smoothScrolling: true,
        }}
      />
    </div>
  );
}
