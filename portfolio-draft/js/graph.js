/* 의존성 없는 force-directed 그래프 (canvas). window.NoteGraph 로 노출. */
(function () {
  const PALETTE = ["#2f4fd8", "#e0578a", "#1b9aaa", "#e09f3e", "#7a5af8", "#3a9d5d"];

  function NoteGraph(canvas, notes, opts) {
    const ctx = canvas.getContext("2d");
    const onSelect = (opts && opts.onSelect) || function () {};
    const nodes = notes.map((n, i) => ({
      id: n.id, title: n.title, tags: n.tags, type: n.type,
      deg: n.links.length + n.backlinks.length,
      x: Math.cos(i * 2.4) * 120, y: Math.sin(i * 2.4) * 120, vx: 0, vy: 0,
    }));
    const byId = new Map(nodes.map((n) => [n.id, n]));
    const edges = [];
    notes.forEach((n) => n.links.forEach((t) => byId.has(t) && edges.push([byId.get(n.id), byId.get(t)])));

    const tagList = [...new Set(notes.flatMap((n) => n.tags))].sort();
    const colorOf = (n) => PALETTE[Math.max(0, tagList.indexOf(n.tags[n.tags.length - 1])) % PALETTE.length];

    let W = 0, H = 0, dpr = 1, alpha = 1;
    let hover = null, selected = null, dragging = null, filter = null;
    const neighbors = (n) => {
      const s = new Set([n.id]);
      edges.forEach(([a, b]) => { if (a === n) s.add(b.id); if (b === n) s.add(a.id); });
      return s;
    };
    const radius = (n) => 7 + Math.min(n.deg, 6) * 2.2;
    const visible = (n) => !filter || n.tags.includes(filter);

    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = window.devicePixelRatio || 1;
      W = r.width; H = r.height;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      alpha = Math.max(alpha, 0.4);
    }

    function step() {
      const k = alpha;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          let dx = b.x - a.x, dy = b.y - a.y;
          let d2 = dx * dx + dy * dy + 0.01;
          const f = (14000 * k) / d2;
          const d = Math.sqrt(d2);
          dx = (dx / d) * f; dy = (dy / d) * f;
          a.vx -= dx; a.vy -= dy; b.vx += dx; b.vy += dy;
        }
      }
      edges.forEach(([a, b]) => {
        const dx = b.x - a.x, dy = b.y - a.y;
        const d = Math.sqrt(dx * dx + dy * dy) || 1;
        const f = (d - 130) * 0.02 * k;
        a.vx += (dx / d) * f; a.vy += (dy / d) * f;
        b.vx -= (dx / d) * f; b.vy -= (dy / d) * f;
      });
      nodes.forEach((n) => {
        n.vx -= n.x * 0.004 * k; n.vy -= n.y * 0.004 * k;
        if (n === dragging) { n.vx = n.vy = 0; return; }
        n.vx *= 0.82; n.vy *= 0.82;
        n.x += n.vx; n.y += n.vy;
      });
      alpha *= 0.992;
    }

    const toScreen = (n) => [W / 2 + n.x, H / 2 + n.y];

    function draw() {
      ctx.clearRect(0, 0, W, H);
      const focus = hover || selected;
      const near = focus ? neighbors(focus) : null;
      ctx.lineWidth = 1.2;
      edges.forEach(([a, b]) => {
        if (!visible(a) || !visible(b)) return;
        const [x1, y1] = toScreen(a), [x2, y2] = toScreen(b);
        const hot = focus && (a === focus || b === focus);
        ctx.strokeStyle = hot ? "#2f4fd8" : focus ? "rgba(23,35,107,.08)" : "rgba(23,35,107,.28)";
        ctx.lineWidth = hot ? 2 : 1.2;
        ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
      });
      ctx.font = '500 12px "Noto Sans KR", system-ui, sans-serif';
      ctx.textAlign = "center";
      nodes.forEach((n) => {
        if (!visible(n)) return;
        const [x, y] = toScreen(n);
        const dim = (near && !near.has(n.id)) ;
        const r = radius(n);
        ctx.globalAlpha = dim ? 0.2 : 1;
        ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = n.type === "essay" ? "#fff" : colorOf(n);
        ctx.fill();
        ctx.lineWidth = n === selected ? 3 : 1.6;
        ctx.strokeStyle = n === selected ? "#0b2394" : n.type === "essay" ? colorOf(n) : "#fff";
        ctx.stroke();
        const showLabel = !dim || n === hover;
        if (showLabel) {
          const t = n.title.length > 22 ? n.title.slice(0, 21) + "…" : n.title;
          ctx.fillStyle = "#17236b";
          ctx.fillText(t, x, y + r + 14);
        }
        ctx.globalAlpha = 1;
      });
    }

    function loop() {
      if (alpha > 0.02 || dragging) { step(); }
      draw();
      requestAnimationFrame(loop);
    }

    function pick(ev) {
      const r = canvas.getBoundingClientRect();
      const mx = ev.clientX - r.left, my = ev.clientY - r.top;
      let best = null, bd = 1e9;
      nodes.forEach((n) => {
        if (!visible(n)) return;
        const [x, y] = toScreen(n);
        const d = Math.hypot(x - mx, y - my);
        if (d < radius(n) + 6 && d < bd) { best = n; bd = d; }
      });
      return { node: best, mx, my };
    }

    let moved = false;
    canvas.addEventListener("pointerdown", (e) => {
      const { node } = pick(e);
      moved = false;
      if (node) { dragging = node; canvas.setPointerCapture(e.pointerId); canvas.classList.add("drag"); alpha = Math.max(alpha, 0.3); }
    });
    canvas.addEventListener("pointermove", (e) => {
      const { node, mx, my } = pick(e);
      if (dragging) {
        moved = true;
        dragging.x = mx - W / 2; dragging.y = my - H / 2;
        alpha = Math.max(alpha, 0.3);
      } else {
        hover = node;
        canvas.style.cursor = node ? "pointer" : "grab";
      }
    });
    const up = () => {
      if (dragging && !moved) { selected = dragging; onSelect(dragging.id); }
      dragging = null; canvas.classList.remove("drag");
    };
    canvas.addEventListener("pointerup", up);
    canvas.addEventListener("pointercancel", up);
    canvas.addEventListener("pointerleave", () => { if (!dragging) hover = null; });
    window.addEventListener("resize", resize);

    resize();
    for (let i = 0; i < 200; i++) step(); // 초기 배치
    alpha = 0.4;
    requestAnimationFrame(loop);

    return {
      tags: tagList,
      colorOfTag: (t) => PALETTE[tagList.indexOf(t) % PALETTE.length],
      select(id) { selected = byId.get(id) || null; },
      setFilter(t) { filter = t; alpha = Math.max(alpha, 0.2); },
    };
  }

  window.NoteGraph = NoteGraph;
})();
