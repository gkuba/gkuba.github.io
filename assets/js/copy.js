// Adds a copy button to every code block
document.querySelectorAll("pre:not(.term-body)").forEach((pre) => {
  const wrap = document.createElement("div");
  wrap.className = "code-wrap";
  pre.parentNode.insertBefore(wrap, pre);
  wrap.appendChild(pre);
  const btn = document.createElement("button");
  btn.className = "copy";
  btn.type = "button";
  btn.textContent = "Copy";
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(pre.innerText.replace(/\n$/, ""));
      btn.textContent = "Copied";
      btn.classList.add("done");
    } catch {
      btn.textContent = "Failed";
    }
    setTimeout(() => { btn.textContent = "Copy"; btn.classList.remove("done"); }, 1500);
  });
  wrap.appendChild(btn);
});
