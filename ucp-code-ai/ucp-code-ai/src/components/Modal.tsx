"use client";
import { useEffect, useRef } from "react";

export default function Modal({ open, onClose, children, wide = false, label }: { open: boolean; onClose: () => void; children: React.ReactNode; wide?: boolean; label?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const key = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", key);
    ref.current?.querySelector<HTMLElement>("button,input,textarea,select,a")?.focus();
    return () => { document.removeEventListener("keydown", key); prev?.focus?.(); };
  }, [open, onClose]);
  if (!open) return null;
  return (
    <div className="modal-bg" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div ref={ref} className={"modal card " + (wide ? "wide" : "")} role="dialog" aria-modal="true" aria-label={label}>{children}</div>
    </div>
  );
}

export function ConfirmModal({ open, title, body, confirmLabel, cancelLabel, onConfirm, onClose }: { open: boolean; title: string; body: string; confirmLabel: string; cancelLabel: string; onConfirm: () => void; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} label={title}>
      <h3>{title}</h3>
      <p className="muted">{body}</p>
      <div className="row" style={{ justifyContent: "flex-end" }}>
        <button className="btn" onClick={onClose}>{cancelLabel}</button>
        <button className="btn danger" onClick={() => { onConfirm(); onClose(); }}>{confirmLabel}</button>
      </div>
    </Modal>
  );
}
