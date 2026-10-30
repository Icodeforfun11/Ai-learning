"use client";
import { useEffect, useRef } from "react";
import { mountPreview, type ConsoleMsg } from "@/lib/sandbox";

/** Sandboxed live preview. `build(id)` returns the srcdoc; re-mounts whenever `version` changes. */
export default function Preview({ build, version, onConsole, title = "Preview (sandboxed)", style, className = "preview" }: {
  build: (id: string) => string; version: unknown; onConsole?: (m: ConsoleMsg) => void; title?: string; style?: React.CSSProperties; className?: string;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const cb = useRef(onConsole); cb.current = onConsole;
  const buildRef = useRef(build); buildRef.current = build;
  useEffect(() => {
    if (!ref.current) return;
    return mountPreview(ref.current, (id) => buildRef.current(id), (m) => cb.current?.(m));
  }, [version]);
  return <iframe ref={ref} className={className} title={title} style={style} />;
}
