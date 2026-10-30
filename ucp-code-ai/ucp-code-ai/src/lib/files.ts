"use client";
import type { ProjectFile } from "@/data/templates";

export async function copyText(text: string) {
  try { await navigator.clipboard.writeText(text); return true; } catch { return false; }
}

/** Export a project as a .zip using a tiny STORE-only zip writer (no dependency). */
export function downloadZip(name: string, files: ProjectFile[]) {
  const enc = new TextEncoder();
  const crcTable = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  const crc32 = (b: Uint8Array) => { let c = 0xffffffff; for (const x of b) c = crcTable[(c ^ x) & 0xff] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
  const all = [...files, { name: "README.md", content: `# ${name}\n\nCreated with UCP CODE AI by Universal Creativity Projects.\nOpen index.html in a browser to run it.\n` }];
  const parts: Uint8Array[] = [], central: Uint8Array[] = []; let offset = 0;
  for (const f of all) {
    const nameB = enc.encode(f.name), data = enc.encode(f.content), crc = crc32(data);
    const h = new DataView(new ArrayBuffer(30));
    h.setUint32(0, 0x04034b50, true); h.setUint16(4, 20, true); h.setUint16(8, 0, true); h.setUint32(14, crc, true); h.setUint32(18, data.length, true); h.setUint32(22, data.length, true); h.setUint16(26, nameB.length, true);
    parts.push(new Uint8Array(h.buffer), nameB, data);
    const c = new DataView(new ArrayBuffer(46));
    c.setUint32(0, 0x02014b50, true); c.setUint16(4, 20, true); c.setUint16(6, 20, true); c.setUint32(16, crc, true); c.setUint32(20, data.length, true); c.setUint32(24, data.length, true); c.setUint16(28, nameB.length, true); c.setUint32(42, offset, true);
    central.push(new Uint8Array(c.buffer), nameB);
    offset += 30 + nameB.length + data.length;
  }
  const cSize = central.reduce((n, p) => n + p.length, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true); end.setUint16(8, all.length, true); end.setUint16(10, all.length, true); end.setUint32(12, cSize, true); end.setUint32(16, offset, true);
  const blob = new Blob([...parts, ...central, new Uint8Array(end.buffer)] as BlobPart[], { type: "application/zip" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = (name || "project").replace(/[^\w-]+/g, "-").toLowerCase() + ".zip";
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 5000);
}
