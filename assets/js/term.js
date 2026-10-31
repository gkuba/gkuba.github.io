// Hero terminal: a tiny shell over the project list
(() => {
  const term = document.querySelector("[data-term]");
  if (!term) return;
  const out = term.querySelector(".term-body");
  const form = term.querySelector(".term-in");
  const input = form.querySelector("input");
  const projects = JSON.parse(term.dataset.term);
  const history = [];
  let hi = 0;

  const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const cls = { linux: "t-dir", tools: "t-tool", games: "t-game" };
  const link = (p) => `<a class="${cls[p.g] || "t-dir"}" href="${p.u}">${p.n}/</a>`;
  const print = (html) => { out.insertAdjacentHTML("beforeend", html + "\n"); out.scrollTop = out.scrollHeight; };
  const find = (arg) => {
    const a = arg.toLowerCase().replace(/\/$/, "");
    return projects.find((p) => p.n === a) || projects.find((p) => p.n.startsWith(a));
  };

  const cmds = {
    help: () => print(`<span class="t-out">commands: <b>ls</b> [group] · <b>cd</b> &lt;project&gt; · <b>cat</b> &lt;project&gt; · <b>whoami</b> · <b>posts</b> · <b>setup</b> · <b>tags</b> · <b>search</b> &lt;words&gt; · <b>clear</b></span>`),
    ls: (arg) => {
      const list = arg ? projects.filter((p) => p.g === arg.replace(/\/$/, "")) : projects;
      print(list.length ? list.map(link).join("  ") : `<span class="t-err">ls: no group "${esc(arg)}" (try linux, tools or games)</span>`);
    },
    cd: (arg) => {
      if (!arg || arg === "~") return print(`<span class="t-out">already home</span>`);
      const p = find(arg);
      if (!p) return print(`<span class="t-err">cd: no such project: ${esc(arg)}</span>`);
      print(`<span class="t-out">opening ${esc(p.t)}…</span>`);
      setTimeout(() => (location.href = p.u), 250);
    },
    cat: (arg) => {
      if (/^about/.test(arg)) return go(term.dataset.about);
      const p = find(arg || "");
      print(p ? `<span class="t-out"><b>${esc(p.t)}</b>: ${esc(p.b)}</span>` : `<span class="t-err">cat: ${esc(arg || "")}: no such file</span>`);
    },
    whoami: () => print(`<span class="t-out">gkuba · linux tinkerer · modder · server wrangler</span>`),
    posts: () => go(term.dataset.posts),
    setup: () => go(term.dataset.setup),
    tags: () => go(term.dataset.tags),
    about: () => go(term.dataset.about),
    search: (arg) => document.dispatchEvent(new CustomEvent("palette:open", { detail: arg })),
    clear: () => { out.innerHTML = ""; },
    sudo: () => print(`<span class="t-err">nice try. this incident will be reported.</span>`),
    exit: () => print(`<span class="t-out">there is no escape. try <b>help</b></span>`),
  };
  cmds.open = cmds.cd;
  const go = (u) => { print(`<span class="t-out">opening ${esc(u)}…</span>`); setTimeout(() => (location.href = u), 250); };

  form.hidden = false;
  print(`<span class="t-dim"># it's a real prompt. type <b>help</b></span>`);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const line = input.value.trim();
    input.value = "";
    print(`<b class="t-pr">❯</b> ${esc(line)}`);
    if (!line) return;
    history.push(line); hi = history.length;
    const [name, ...rest] = line.split(/\s+/);
    const fn = cmds[name.toLowerCase()];
    fn ? fn(rest.join(" ")) : print(`<span class="t-err">${esc(name)}: command not found. try <b>help</b></span>`);
  });
  input.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" && hi > 0) { e.preventDefault(); input.value = history[--hi]; }
    else if (e.key === "ArrowDown") { e.preventDefault(); hi = Math.min(hi + 1, history.length); input.value = history[hi] || ""; }
    else if (e.key === "Tab" && input.value) {
      const [name, arg] = input.value.split(/\s+/);
      if (arg !== undefined) {
        const p = projects.find((p) => p.n.startsWith(arg.toLowerCase()));
        if (p) { e.preventDefault(); input.value = `${name} ${p.n}`; }
      }
    }
  });
  out.addEventListener("click", () => input.focus({ preventScroll: true }));
})();
