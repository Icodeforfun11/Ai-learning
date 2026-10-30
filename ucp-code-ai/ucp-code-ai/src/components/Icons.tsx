const P = { fill: "none", stroke: "currentColor", strokeWidth: 2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, viewBox: "0 0 24 24", "aria-hidden": true };
export const Icon = {
  home: () => <svg {...P}><path d="M3 11l9-8 9 8v10h-6v-6H9v6H3z" /></svg>,
  studio: () => <svg {...P}><path d="M8 7l-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" /></svg>,
  learn: () => <svg {...P}><path d="M2 8l10-5 10 5-10 5z" /><path d="M6 10v6c3 2 9 2 12 0v-6" /></svg>,
  tutor: () => <svg {...P}><path d="M12 3l2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5z" /></svg>,
  more: () => <svg {...P}><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></svg>,
  sun: () => <svg {...P}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>,
  moon: () => <svg {...P}><path d="M21 13A9 9 0 1111 3a7 7 0 0010 10z" /></svg>,
  play: () => <svg {...P}><path d="M7 4l13 8-13 8z" /></svg>,
  save: () => <svg {...P}><path d="M5 3h11l4 4v14H4V3z" /><path d="M8 3v6h8" /></svg>,
  dl: () => <svg {...P}><path d="M12 3v12m0 0l-5-5m5 5l5-5M4 21h16" /></svg>,
  plus: () => <svg {...P}><path d="M12 5v14M5 12h14" /></svg>,
  folder: () => <svg {...P}><path d="M3 6h7l2 2h9v11H3z" /></svg>,
  arrow: () => <svg {...P} className="flip"><path d="M5 12h14m-6-6l6 6-6 6" /></svg>,
};
export function Logo() {
  return (
    <svg className="logo" viewBox="0 0 64 64" aria-hidden="true">
      <defs><linearGradient id="lg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#3d8bff" /><stop offset="1" stopColor="#8b5cff" /></linearGradient></defs>
      <path d="M32 6l22 13v26L32 58 10 45V19z" fill="none" stroke="url(#lg)" strokeWidth="4" />
      <path d="M27 25l-7 7 7 7M37 25l7 7-7 7" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="48" cy="14" r="4" fill="#22d3ee" />
    </svg>
  );
}
