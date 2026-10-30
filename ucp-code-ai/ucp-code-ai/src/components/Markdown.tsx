"use client";
import { md, CODEBLOCKS, type CodeBlock } from "@/lib/markdown";
import { useApp } from "@/lib/store";
import { copyText } from "@/lib/files";

/** Renders AI/lesson Markdown. Content is escaped before formatting (see lib/markdown), so it is safe to inject. */
export default function Markdown({ text, prefix = "md", onApply, className, streaming }: { text: string; prefix?: string; onApply?: (b: CodeBlock) => void; className?: string; streaming?: boolean }) {
  const { t, toast } = useApp();
  return (
    <div
      className={(className || "") + (streaming ? " typing" : "")}
      onClick={(e) => {
        const el = e.target as HTMLElement;
        const c = el.closest<HTMLElement>("[data-cb-copy]");
        if (c) { const b = CODEBLOCKS.get(c.dataset.cbCopy!); if (b) copyText(b.code).then((ok) => toast(ok ? t("copied") : "Copy failed. Select the text manually.", ok ? "ok" : "err")); }
        const a = el.closest<HTMLElement>("[data-cb-apply]");
        if (a && onApply) { const b = CODEBLOCKS.get(a.dataset.cbApply!); if (b) onApply(b); }
      }}
      dangerouslySetInnerHTML={{ __html: md(text, { prefix, apply: !!onApply, copyLabel: t("copy"), applyLabel: t("apply") }) }}
    />
  );
}
