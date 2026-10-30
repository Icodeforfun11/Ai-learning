import Link from "next/link";
export default function NotFound() {
  return <div className="wrap page"><div className="empty"><h3>Page not found</h3><p>That page doesn&apos;t exist.</p><Link className="btn" href="/">Home</Link></div></div>;
}
