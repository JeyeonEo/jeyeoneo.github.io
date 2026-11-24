// notes/*.md  ->  data/notes.json
// 사용법: node scripts/build-notes.mjs
// 의존성 없음 (Node 18+).
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const notesDir = path.join(root, "notes");
const outFile = path.join(root, "data", "notes.json");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function parseFrontmatter(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta = {};
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_][\w-]*)\s*:\s*(.*)$/);
    if (!kv) continue;
    let v = kv[2].trim();
    if (v.startsWith("[") && v.endsWith("]")) {
      v = v
        .slice(1, -1)
        .split(",")
        .map((x) => x.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    } else {
      v = v.replace(/^["']|["']$/g, "");
    }
    meta[kv[1]] = v;
  }
  return { meta, body: m[2] };
}

// [[id]] / [[id|표시 텍스트]]
const WIKI = /\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]/g;

function inline(text, resolve) {
  let s = esc(text);
  s = s.replace(/`([^`]+)`/g, "<code>$1</code>");
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  s = s.replace(
    /\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener">$1</a>'
  );
  s = s.replace(WIKI, (_, target, alias) => {
    const id = resolve(target.trim());
    const label = alias || titleOf(id) || target;
    return id
      ? `<a class="wikilink" href="#note=${encodeURIComponent(id)}" data-note="${id}">${label}</a>`
      : `<span class="wikilink ghost">${label}</span>`;
  });
  return s;
}

function render(body, resolve) {
  const lines = body.replace(/\r\n/g, "\n").split("\n");
  const out = [];
  let para = [];
  let list = null;
  let code = null;
  const flushPara = () => {
    if (para.length) out.push(`<p>${inline(para.join(" "), resolve)}</p>`);
    para = [];
  };
  const flushList = () => {
    if (list) out.push(`</${list}>`);
    list = null;
  };
  for (const line of lines) {
    if (code !== null) {
      if (line.startsWith("```")) {
        out.push(`<pre><code>${esc(code.join("\n"))}</code></pre>`);
        code = null;
      } else code.push(line);
      continue;
    }
    if (line.startsWith("```")) {
      flushPara();
      flushList();
      code = [];
      continue;
    }
    let m;
    if ((m = line.match(/^(#{1,4})\s+(.*)$/))) {
      flushPara();
      flushList();
      const lv = Math.min(m[1].length + 2, 6); // 노트 안의 # 는 h3부터
      out.push(`<h${lv}>${inline(m[2], resolve)}</h${lv}>`);
    } else if ((m = line.match(/^\s*[-*]\s+(.*)$/))) {
      flushPara();
      if (list !== "ul") {
        flushList();
        out.push("<ul>");
        list = "ul";
      }
      out.push(`<li>${inline(m[1], resolve)}</li>`);
    } else if ((m = line.match(/^\s*\d+\.\s+(.*)$/))) {
      flushPara();
      if (list !== "ol") {
        flushList();
        out.push("<ol>");
        list = "ol";
      }
      out.push(`<li>${inline(m[1], resolve)}</li>`);
    } else if ((m = line.match(/^>\s?(.*)$/))) {
      flushPara();
      flushList();
      out.push(`<blockquote>${inline(m[1], resolve)}</blockquote>`);
    } else if (line.trim() === "") {
      flushPara();
      flushList();
    } else {
      flushList();
      para.push(line.trim());
    }
  }
  flushPara();
  flushList();
  return out.join("\n");
}

const files = (await readdir(notesDir)).filter((f) => f.endsWith(".md")).sort();
const raw = [];
for (const f of files) {
  const text = await readFile(path.join(notesDir, f), "utf8");
  const { meta, body } = parseFrontmatter(text);
  const id = f.replace(/\.md$/, "");
  const h1 = body.match(/^#\s+(.+)$/m);
  raw.push({
    id,
    title: meta.title || (h1 ? h1[1].trim() : id),
    meta,
    body: body.replace(/^#\s+.+\n?/m, ""),
  });
}

const byKey = new Map();
for (const n of raw) {
  byKey.set(n.id.toLowerCase(), n.id);
  byKey.set(n.title.toLowerCase(), n.id);
}
const resolve = (t) => byKey.get(t.toLowerCase()) || null;
const titleOf = (id) => raw.find((n) => n.id === id)?.title;

const notes = raw.map((n) => {
  const links = new Set();
  for (const m of n.body.matchAll(WIKI)) {
    const id = resolve(m[1].trim());
    if (id && id !== n.id) links.add(id);
  }
  const tags = Array.isArray(n.meta.tags)
    ? n.meta.tags
    : n.meta.tags
    ? [n.meta.tags]
    : [];
  return {
    id: n.id,
    title: n.title,
    type: n.meta.type || "paper",
    tags,
    authors: n.meta.authors || "",
    year: n.meta.year ? Number(n.meta.year) : null,
    source: n.meta.source || "",
    url: n.meta.url || "",
    lang: n.meta.lang || "ko",
    date: n.meta.date || "",
    links: [...links],
    backlinks: [],
    html: render(n.body, resolve),
  };
});

const idx = new Map(notes.map((n) => [n.id, n]));
for (const n of notes) for (const l of n.links) idx.get(l).backlinks.push(n.id);

await writeFile(outFile, JSON.stringify({ generated: new Date().toISOString(), notes }, null, 1));
const edges = notes.reduce((a, n) => a + n.links.length, 0);
console.log(`notes: ${notes.length}, links: ${edges} -> data/notes.json`);
