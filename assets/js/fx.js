// Card glow that follows the pointer, scroll reveal, and reading progress
(() => {
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".card, .post").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--mx", `${e.clientX - r.left}px`);
      el.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  });
  if (!still && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".grid > *, .posts > *, .sec").forEach((el, i) => {
      el.classList.add("reveal");
      el.style.setProperty("--d", `${(i % 3) * 60}ms`);
      io.observe(el);
    });
  }
  const bar = document.querySelector(".progress");
  if (bar) {
    const art = document.querySelector(".prose");
    const tick = () => {
      const r = art.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
      bar.style.transform = `scaleX(${p})`;
    };
    addEventListener("scroll", tick, { passive: true });
    tick();
  }
  const links = [...document.querySelectorAll(".toc a")];
  if (links.length && "IntersectionObserver" in window) {
    const map = new Map(links.map((a) => [decodeURIComponent(a.hash.slice(1)), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((a) => a.classList.remove("on"));
        map.get(en.target.id)?.classList.add("on");
      });
    }, { rootMargin: "-20% 0px -70% 0px" });
    map.forEach((_, id) => { const h = document.getElementById(id); if (h) spy.observe(h); });
  }
})();
