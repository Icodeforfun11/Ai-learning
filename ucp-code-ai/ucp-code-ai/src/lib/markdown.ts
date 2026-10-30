/**
 * Escape-first Markdown renderer: all text is HTML-escaped BEFORE formatting is applied,
 * so AI output can never inject markup or scripts. Links are restricted to http(s).
 */
export const esc = (s: unknown) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export type CodeBlock = { lang: string; file: string; code: string };
export const CODEBLOCKS = new Map<string, CodeBlock>();

function inlineMd(s: string) {
  return s
    .replace(/`([^`\n]+)`/g, (_m, c) => "<code>" + c + "</code>")
    .replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>")
    .replace(/(^|[\s(])\*([^*\n]+)\*(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>")
    .replace(/\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\)/g, (_m, txt, url) => '<a href="' + url + '" target="_blank" rel="noopener noreferrer">' + txt + "</a>");
}

export function md(src: string, opts: { prefix?: string; apply?: boolean; copyLabel?: string; applyLabel?: string } = {}) {
  const blocks: CodeBlock[] = [];
  src = String(src || "").replace(/```([\w+#-]*)[ \t]*([^\n`]*)\n([\s\S]*?)(?:```|$)/g, (_m, lang, file, code) => {
    blocks.push({ lang: (lang || "").toLowerCase(), file: file.trim(), code: code.replace(/\n$/, "") });
    return "\n\u0000" + (blocks.length - 1) + "\u0000\n";
  });
  const lines = esc(src).split("\n");
  let html = "", list: "ul" | "ol" | null = null, para: string[] = [];
  const flushP = () => { if (para.length) { html += "<p>" + inlineMd(para.join("<br>")) + "</p>"; para = []; } };
  const flushL = () => { if (list) { html += "</" + list + ">"; list = null; } };
  for (const line of lines) {
    let m: RegExpMatchArray | null;
    if ((m = line.match(/^\u0000(\d+)\u0000$/))) {
      flushP(); flushL();
      const b = blocks[+m[1]], id = (opts.prefix || "cb") + "-" + m[1];
      CODEBLOCKS.set(id, b);
      html += '<pre><div class="codebar"><span class="dim small" style="margin-inline-end:auto">' + esc(b.file || b.lang || "code") + "</span>" +
        '<button class="btn sm ghost" data-cb-copy="' + id + '">' + (opts.copyLabel || "Copy") + "</button>" +
        (opts.apply && /^(html|css|js|javascript|jsx)$/.test(b.lang) ? '<button class="btn sm" data-cb-apply="' + id + '">' + (opts.applyLabel || "Apply") + "</button>" : "") +
        "</div><code>" + hl(b.code, b.lang) + "</code></pre>";
    } else if ((m = line.match(/^(#{1,4})\s+(.*)/))) { flushP(); flushL(); const n = Math.min(4, m[1].length + 1); html += "<h" + n + ">" + inlineMd(m[2]) + "</h" + n + ">"; }
    else if ((m = line.match(/^\s*[-*]\s+(.*)/))) { flushP(); if (list !== "ul") { flushL(); html += "<ul>"; list = "ul"; } html += "<li>" + inlineMd(m[1]) + "</li>"; }
    else if ((m = line.match(/^\s*\d+[.)]\s+(.*)/))) { flushP(); if (list !== "ol") { flushL(); html += "<ol>"; list = "ol"; } html += "<li>" + inlineMd(m[1]) + "</li>"; }
    else if (!line.trim()) { flushP(); flushL(); }
    else { flushL(); para.push(line); }
  }
  flushP(); flushL();
  return html;
}

/* --- small highlighter for chat/markdown code blocks (Monaco handles the editor) --- */
function tok(code: string, re: RegExp, cls: string[]) {
  let out = "", last = 0, m: RegExpExecArray | null;
  re.lastIndex = 0;
  while ((m = re.exec(code))) {
    if (m[0] === "") { re.lastIndex++; continue; }
    out += esc(code.slice(last, m.index));
    let g = 1; while (g < m.length && m[g] === undefined) g++;
    out += cls[g - 1] ? '<span class="tok-' + cls[g - 1] + '">' + esc(m[0]) + "</span>" : esc(m[0]);
    last = m.index + m[0].length;
  }
  return out + esc(code.slice(last));
}
const RE = {
  js: /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)|(\b\d+(?:\.\d+)?\b)|\b(const|let|var|function|return|if|else|for|while|do|break|continue|new|class|extends|import|from|export|default|async|await|try|catch|finally|throw|typeof|instanceof|in|of|switch|case|this|null|undefined|true|false|interface|type|enum|implements|readonly|public|private)\b|([A-Za-z_$][\w$]*)(?=\s*\()/g,
  py: /(#[^\n]*)|("""[\s\S]*?"""|'''[\s\S]*?'''|[fr]?"(?:\\.|[^"\\\n])*"|[fr]?'(?:\\.|[^'\\\n])*')|(\b\d+(?:\.\d+)?\b)|\b(def|class|return|if|elif|else|for|while|in|import|from|as|with|try|except|finally|raise|lambda|None|True|False|and|or|not|pass|break|continue|yield|self|is|global)\b|([A-Za-z_]\w*)(?=\s*\()/g,
  css: /(\/\*[\s\S]*?\*\/)|("[^"\n]*"|'[^'\n]*')|(#[0-9a-fA-F]{3,8}\b|-?\b\d+(?:\.\d+)?(?:px|rem|em|%|vh|vw|s|ms|deg|fr)?\b)|(@[\w-]+|!important)|([\w-]+)(?=\s*:[^{};]*[;}])/g,
};
function hlTags(s: string) {
  let out = "", last = 0, m: RegExpExecArray | null;
  const re = /<!--[\s\S]*?-->|<\/?[\w-]+(?:\s+[^\s=>\/]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s*\/?>/g;
  while ((m = re.exec(s))) {
    out += esc(s.slice(last, m.index));
    if (m[0].startsWith("<!--")) out += '<span class="tok-c">' + esc(m[0]) + "</span>";
    else {
      const tm = m[0].match(/^(<\/?)([\w-]+)([\s\S]*?)(\/?>)$/)!;
      const attrs = esc(tm[3]).replace(/([\w:@.-]+)(=)(&quot;.*?&quot;|&#39;.*?&#39;|[^\s&]+)?/g, (_a, n, eq, v) => '<span class="tok-a">' + n + "</span>" + eq + (v ? '<span class="tok-s">' + v + "</span>" : ""));
      out += '<span class="tok-p">' + esc(tm[1]) + '</span><span class="tok-t">' + tm[2] + "</span>" + attrs + '<span class="tok-p">' + esc(tm[4]) + "</span>";
    }
    last = m.index + m[0].length;
  }
  return out + esc(s.slice(last));
}
export function hl(code: string, lang: string): string {
  lang = (lang || "").toLowerCase();
  if (/^(html|xml|svg)$/.test(lang))
    return code.split(/(<script\b[^>]*>[\s\S]*?<\/script>|<style\b[^>]*>[\s\S]*?<\/style>)/i).map((part) => {
      const sm = part.match(/^(<(script|style)\b[^>]*>)([\s\S]*?)(<\/\2>)$/i);
      return sm ? hlTags(sm[1]) + hl(sm[3], sm[2].toLowerCase() === "style" ? "css" : "js") + hlTags(sm[4]) : hlTags(part);
    }).join("");
  if (/^(css|scss)$/.test(lang)) return tok(code, RE.css, ["c", "s", "n", "k", "a"]);
  if (/^(py|python)$/.test(lang)) return tok(code, RE.py, ["c", "s", "n", "k", "f"]);
  if (/^(js|javascript|ts|typescript|jsx|tsx|react|json)$/.test(lang)) return tok(code, RE.js, ["c", "s", "n", "k", "f"]);
  return esc(code);
}
