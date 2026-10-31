// Ctrl+K / "/" command palette over the JSON index of the home page
(() => {
  const pal = document.getElementById("palette");
  if (!pal) return;
  const input = pal.querySelector(".pal-in");
  const list = pal.querySelector(".pal-list");
  let items = null, shown = [], sel = 0, last = null;

  const load = async () => {
    if (items) return;
    try { items = await (await fetch(pal.dataset.index)).json(); } catch { items = []; }
  };
  // Every word must appear somewhere; title hits rank above body text
  const score = (it, q) => {
    const t = it.t.toLowerCase(), d = (it.d || "").toLowerCase(), c = (it.c || "").toLowerCase();
    let total = 0;
    for (const w of q.split(/\s+/)) {
      if (t.startsWith(w)) total += 6;
      else if (t.includes(w)) total += 4;
      else if (d.includes(w) || it.k.includes(w)) total += 2;
      else if (c.includes(w)) total += 1;
      else return 0;
    }
    return total;
  };
  // A short excerpt of the body around the first word that only matched there
  const snippet = (it, q) => {
    if (!q || !it.c) return "";
    const hay = (it.t + " " + (it.d || "")).toLowerCase();
    const w = q.split(/\s+/).find((w) => !hay.includes(w));
    if (!w) return "";
    const i = it.c.toLowerCase().indexOf(w);
    if (i < 0) return "";
    const a = Math.max(0, i - 50), b = Math.min(it.c.length, i + w.length + 70);
    return (a ? "…" : "") + esc(it.c.slice(a, i)) + "<mark>" + esc(it.c.slice(i, i + w.length)) + "</mark>" + esc(it.c.slice(i + w.length, b)) + (b < it.c.length ? "…" : "");
  };
  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const render = () => {
    const q = input.value.trim().toLowerCase();
    shown = q ? items.map((it) => [score(it, q), it]).filter(([s]) => s).sort((a, b) => b[0] - a[0]).map(([, it]) => it) : items;
    sel = Math.min(sel, Math.max(0, shown.length - 1));
    list.innerHTML = shown.length
      ? shown.map((it, i) => `<li role="option" aria-selected="${i === sel}" data-i="${i}"><span class="pal-k">${esc(it.k)}</span><b>${esc(it.t)}</b>${it.d ? `<small>${esc(it.d)}</small>` : ""}${(s => s ? `<small class="pal-snip">${s}</small>` : "")(snippet(it, q))}</li>`).join("")
      : `<li class="pal-none">Nothing matches “${esc(input.value)}”</li>`;
    list.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  };
  const go = (it) => { if (it) location.href = it.u; };
  const open = async (q = "") => {
    last = document.activeElement;
    pal.hidden = false;
    document.body.style.overflow = "hidden";
    await load();
    input.value = typeof q === "string" ? q : ""; sel = 0; render(); input.focus();
  };
  const close = () => { pal.hidden = true; document.body.style.overflow = ""; last?.focus?.(); };

  document.querySelectorAll("[data-palette-open]").forEach((b) => b.addEventListener("click", () => open()));
  document.addEventListener("palette:open", (e) => open(e.detail || ""));
  addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement?.tagName);
    if ((e.key === "k" && (e.ctrlKey || e.metaKey)) || (e.key === "/" && !typing && pal.hidden)) { e.preventDefault(); pal.hidden ? open() : close(); }
    else if (!pal.hidden && e.key === "Escape") close();
  });
  input.addEventListener("input", () => { sel = 0; render(); });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); render(); }
    else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); render(); }
    else if (e.key === "Enter") { e.preventDefault(); go(shown[sel]); }
  });
  list.addEventListener("click", (e) => { const li = e.target.closest("[data-i]"); if (li) go(shown[+li.dataset.i]); });
  pal.addEventListener("click", (e) => { if (e.target === pal) close(); });
})();
