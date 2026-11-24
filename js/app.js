(function () {
  "use strict";

  const UI = {
    ko: {
      "nav.profile": "Profile", "nav.books": "Books", "nav.courses": "Courses", "nav.writing": "Writing", "nav.teaching": "Teaching", "nav.published": "Published", "nav.notes": "Notes",
      "sec.profile": "Profile", "sec.books": "Books", "sec.courses": "Courses & Certificates", "sec.writing": "Papers & Essays", "sec.teaching": "Teaching", "sec.published": "Published", "sec.notes": "Paper Notes",
      "top.mid": "PERSONAL ARCHIVE / BOOKS · COURSES · NOTES", "side.label": "CONTENTS / 01",
      "hello": "안녕하세요, {name}입니다.",
      "sub.courses": "수강한 강의", "sub.certs": "자격증",
      "notes.sub": "읽은 논문의 짧은 메모입니다. 메모 사이의 링크가 그래프가 됩니다.",
      "notes.hint": "노드를 끌어 움직이고, 클릭하면 열립니다",
      "notes.empty": "그래프의 노드나 아래 목록에서 메모를 선택하세요.",
      "all": "전체", "reading": "읽는 중", "done": "완독", "want": "읽을 예정",
      "backlinks": "이 메모를 가리키는 메모", "links": "연결된 메모", "source": "원문",
      "paper": "논문", "essay": "에세이", "course": "인강", "ebook": "전자책",
      "expires": "만료", "open": "열기", "nonotes": "연결된 메모가 없습니다",
      "bookTitle": "책", "lang": "EN",
    },
    en: {
      "nav.profile": "Profile", "nav.books": "Books", "nav.courses": "Courses", "nav.writing": "Writing", "nav.teaching": "Teaching", "nav.published": "Published", "nav.notes": "Notes",
      "sec.profile": "Profile", "sec.books": "Books", "sec.courses": "Courses & Certificates", "sec.writing": "Papers & Essays", "sec.teaching": "Teaching", "sec.published": "Published", "sec.notes": "Paper Notes",
      "top.mid": "PERSONAL ARCHIVE / BOOKS · COURSES · NOTES", "side.label": "CONTENTS / 01",
      "hello": "Hello, {name}.",
      "sub.courses": "Online courses", "sub.certs": "Certificates",
      "notes.sub": "Short memos on papers I read. Links between notes form the graph.",
      "notes.hint": "Drag nodes · click to open",
      "notes.empty": "Select a node or a note from the list.",
      "all": "All", "reading": "Reading", "done": "Finished", "want": "Want to read",
      "backlinks": "Linked from", "links": "Links to", "source": "Source",
      "paper": "paper", "essay": "essay", "course": "course", "ebook": "e-book",
      "expires": "expires", "open": "Open", "nonotes": "No linked notes",
      "bookTitle": "Books", "lang": "한국어",
    },
  };

  let lang = "ko";
  lang = (navigator.language || "ko").startsWith("ko") ? "ko" : "en";
  try {
    const saved = localStorage.getItem("lang");
    if (saved === "ko" || saved === "en") lang = saved;
  } catch (e) { /* 저장소 접근 불가 */ }

  const D = {};
  let graph = null;
  let bookFilter = "all";
  let currentNote = null;

  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const T = (k) => UI[lang][k] ?? UI.ko[k] ?? k;
  const L = (v) => (v && typeof v === "object" ? v[lang] ?? v.ko ?? v.en ?? "" : v ?? "");
  const tags = (arr) => (arr && arr.length ? `<span class="tags">${arr.map((t) => `<span class="tag">${esc(t)}</span>`).join("")}</span>` : "");
  const link = (url, text) => (url ? `<a href="${esc(url)}" target="_blank" rel="noopener">${esc(text)}</a>` : esc(text));
  const sortDesc = (a, b) => (b.year || 0) - (a.year || 0);

  /* ---------- renderers ---------- */
  function renderStatic() {
    document.documentElement.lang = lang;
    document.querySelectorAll("[data-i18n]").forEach((el) => (el.textContent = T(el.dataset.i18n)));
    $("#lang").textContent = T("lang");
  }

  const linkHtml = (l) => l.url
    ? `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`
    : `<span class="plain">${esc(l.label)}: ${esc(l.text)}</span>`;

  function renderProfile() {
    const p = D.profile;
    const name = L(p.name);
    document.title = `${name} · Portfolio`;
    $("#brand").textContent = name;
    $("#hero-name").textContent = T("hello").replace("{name}", name);
    $("#today").textContent = new Date().toLocaleDateString(lang === "ko" ? "ko-KR" : "en-US", { year: "numeric", month: "long", day: "numeric", weekday: "long" });
    $("#hero-role").textContent = L(p.role);
    $("#hero-tagline").textContent = L(p.tagline);
    $("#intro").textContent = L(p.intro);
    const links = (p.links || []).map(linkHtml).join("");
    $("#hero-links").innerHTML = links;
    $("#foot-name").textContent = name.toUpperCase();
    $("#foot-links").innerHTML = (p.links || []).map(linkHtml).join("");
    $("#timeline").innerHTML = (p.timeline || []).map((t) => `
      <li><small>${esc(t.period)}</small><div><b>${esc(L(t.title))}</b><p>${esc(L(t.desc))}</p></div></li>`).join("");
  }

  function renderBooks() {
    const all = D.books;
    const statuses = ["all", ...new Set(all.map((b) => b.status))];
    $("#books-filter").innerHTML = statuses
      .map((s) => `<button type="button" data-s="${s}" class="${s === bookFilter ? "on" : ""}">${esc(T(s))}</button>`).join("");
    const list = all.filter((b) => bookFilter === "all" || b.status === bookFilter);
    $("#books-list").innerHTML = list.map((b) => `
      <article class="card">
        <span class="stat">${esc(T(b.status))}${b.rating ? " · " + "★".repeat(b.rating) : ""}</span>
        <div class="t">${esc(b.title)}</div>
        <div class="m">${esc(b.author)}${b.year ? " · " + b.year : ""}</div>
        <div class="n">${esc(L(b.note))}</div>
        ${tags(b.tags)}
      </article>`).join("");
  }

  function renderCourses() {
    const c = D.courses;
    $("#courses-list").innerHTML = [...c.courses].sort(sortDesc).map((x) => `
      <li><span class="t">${link(x.url, L(x.title))}</span><span class="r">${x.year}</span>
      <span class="m">${esc(x.provider)} ${tags(x.tags)}</span></li>`).join("");
    $("#certs-list").innerHTML = [...c.certs].sort(sortDesc).map((x) => `
      <li><span class="t">${esc(L(x.title))}</span><span class="r">${x.year}</span>
      <span class="m">${esc(x.issuer)}${x.id ? " · " + esc(x.id) : ""}${x.expires ? " · " + T("expires") + " " + x.expires : ""}</span></li>`).join("");
  }

  function renderWriting() {
    $("#writing-list").innerHTML = [...D.writings].sort(sortDesc).map((w) => `
      <li><span class="t"><span class="badge ${w.kind === "paper" ? "paper" : ""}">${esc(T(w.kind))}</span>${link(w.url, L(w.title))}</span>
      <span class="r">${w.year}</span>
      <span class="m">${esc(w.venue)}${w.authors ? " · " + esc(w.authors) : ""} ${tags(w.tags)}</span></li>`).join("");
  }

  function renderTeaching() {
    $("#teaching-list").innerHTML = D.teaching.map((t) => `
      <li><span class="t">${esc(L(t.title))}</span><span class="r">${esc(t.period)}</span>
      <span class="m">${esc(L(t.role))} · ${esc(L(t.desc))}</span></li>`).join("");
    $("#products-list").innerHTML = [...D.products].sort(sortDesc).map((p) => `
      <article class="card">
        <span class="stat">${esc(T(p.type))} · ${p.year}</span>
        <div class="t">${esc(L(p.title))}</div>
        <div class="m">${esc(p.platform)}</div>
        <div class="n">${esc(L(p.desc))}</div>
        ${p.url ? `<a class="go" href="${esc(p.url)}" target="_blank" rel="noopener">${T("open")} →</a>` : ""}
      </article>`).join("");
  }

  /* ---------- notes ---------- */
  function noteIndex() { return new Map(D.notes.notes.map((n) => [n.id, n])); }

  function renderNotesList() {
    $("#notes-list").innerHTML = [...D.notes.notes].sort(sortDesc).map((n) => `
      <li><span class="t"><span class="badge ${n.type === "paper" ? "paper" : ""}">${esc(T(n.type) || n.type)}</span><a href="#note=${encodeURIComponent(n.id)}" data-note="${esc(n.id)}">${esc(n.title)}</a></span>
      <span class="r">${n.year || ""}</span>
      <span class="m">${esc(n.authors)} ${tags(n.tags)}</span></li>`).join("");
  }

  function openNote(id, scroll) {
    const idx = noteIndex();
    const n = idx.get(id);
    if (!n) return;
    currentNote = id;
    if (graph) graph.select(id);
    const chips = (ids) => ids.map((i) => `<a class="wikilink" href="#note=${encodeURIComponent(i)}" data-note="${esc(i)}">${esc(idx.get(i).title)}</a>`).join("");
    const meta = [n.authors, n.source, n.year].filter(Boolean).map(esc).join(" · ");
    $("#reader").innerHTML = `
      <span class="badge ${n.type === "paper" ? "paper" : ""}">${esc(T(n.type) || n.type)}</span>
      ${tags(n.tags)}
      <h4>${esc(n.title)}</h4>
      <div class="meta">${meta}${n.url ? ` · <a class="src" href="${esc(n.url)}" target="_blank" rel="noopener">${T("source")} ↗</a>` : ""}</div>
      ${n.html}
      <div class="back">
        ${n.links.length ? `<div><b>${T("links")}</b> ${chips(n.links)}</div>` : ""}
        ${n.backlinks.length ? `<div><b>${T("backlinks")}</b> ${chips(n.backlinks)}</div>` : ""}
      </div>`;
    $("#reader").scrollTop = 0;
    if (scroll) $("#notes").scrollIntoView({ behavior: "smooth" });
  }

  function initNotes() {
    const notes = D.notes.notes;
    if (!notes.length) return;
    const canvas = $("#graph");
    graph = window.NoteGraph(canvas, notes, { onSelect: (id) => { history.replaceState(null, "", "#note=" + encodeURIComponent(id)); openNote(id); } });
    renderGraphTags();
  }

  let tagFilter = null;
  function renderGraphTags() {
    if (!graph) return;
    const btn = (t, label) => `<button type="button" data-tag="${esc(t ?? "")}" class="${t === tagFilter ? "on" : ""}">${t ? `<span style="color:${graph.colorOfTag(t)}">●</span> ` : ""}${esc(label)}</button>`;
    $("#graph-tags").innerHTML = btn(null, T("all")) + graph.tags.map((t) => btn(t, t)).join("");
  }

  /* ---------- events ---------- */
  document.addEventListener("click", (e) => {
    const lg = e.target.closest("#lang");
    if (lg) {
      lang = lang === "ko" ? "en" : "ko";
      try { localStorage.setItem("lang", lang); } catch (_) {}
      renderAll();
      return;
    }
    const bf = e.target.closest("#books-filter button");
    if (bf) { bookFilter = bf.dataset.s; renderBooks(); return; }
    const gt = e.target.closest("#graph-tags button");
    if (gt) { tagFilter = gt.dataset.tag || null; graph.setFilter(tagFilter); renderGraphTags(); return; }
    const nl = e.target.closest("a[data-note]");
    if (nl) { e.preventDefault(); history.replaceState(null, "", "#note=" + encodeURIComponent(nl.dataset.note)); openNote(nl.dataset.note, !nl.closest("#reader")); }
  });

  function fromHash() {
    const m = location.hash.match(/^#note=(.+)$/);
    if (m) openNote(decodeURIComponent(m[1]), true);
  }
  window.addEventListener("hashchange", fromHash);

  function renderAll() {
    renderStatic(); renderProfile(); renderBooks(); renderCourses();
    renderWriting(); renderTeaching(); renderNotesList();
    renderGraphTags();
    if (currentNote) openNote(currentNote);
  }

  async function load() {
    const get = (f) => fetch("data/" + f).then((r) => { if (!r.ok) throw new Error(f); return r.json(); });
    const [profile, books, courses, writings, teaching, products, notes] = await Promise.all(
      ["profile", "books", "courses", "writings", "teaching", "products", "notes"].map((n) => get(n + ".json"))
    );
    Object.assign(D, { profile, books, courses, writings, teaching, products, notes });
  }

  const links = [...document.querySelectorAll("#side-nav a")];
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + e.target.id));
  }), { rootMargin: "-30% 0px -60% 0px" });
  document.querySelectorAll(".panel").forEach((p) => io.observe(p));
  load().then(() => {
    renderAll();
    initNotes();
    fromHash();
  }).catch((err) => {
    document.querySelector("main").insertAdjacentHTML("afterbegin",
      `<p style="padding:40px;text-align:center">데이터를 불러오지 못했습니다 (${esc(err.message)}). file:// 이 아니라 로컬 서버로 열어 주세요: <code>python3 -m http.server</code></p>`);
  });
})();
