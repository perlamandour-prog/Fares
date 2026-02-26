(() => {
  const $ = (q, el = document) => el.querySelector(q);
  const $$ = (q, el = document) => Array.from(el.querySelectorAll(q));

  // Year
  const yearEl = $("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Cursor blob (premium glow)
  const blob = $(".cursor-blob");
  let blobX = -9999, blobY = -9999, tx = blobX, ty = blobY;

  const moveBlob = () => {
    // smooth follow
    tx += (blobX - tx) * 0.12;
    ty += (blobY - ty) * 0.12;
    if (blob) blob.style.transform = `translate(${tx}px, ${ty}px) translate(-50%, -50%)`;
    requestAnimationFrame(moveBlob);
  };
  requestAnimationFrame(moveBlob);

  window.addEventListener("pointermove", (e) => {
    blobX = e.clientX;
    blobY = e.clientY;
  }, { passive: true });

  // Reveal on scroll
  const revealEls = $$(".reveal");
  const io = new IntersectionObserver((entries) => {
    for (const ent of entries) {
      if (ent.isIntersecting) {
        const el = ent.target;
        const d = Number(el.getAttribute("data-reveal-delay") || "0");
        el.style.transitionDelay = `${Math.min(d, 400)}ms`;
        el.classList.add("is-in");
        io.unobserve(el);
      }
    }
  }, { threshold: 0.12 });

  revealEls.forEach(el => io.observe(el));

  // Parallax subtle
  const parallaxEls = $$(".parallax");
  let scrollY = window.scrollY;

  const onScroll = () => { scrollY = window.scrollY; };
  window.addEventListener("scroll", onScroll, { passive: true });

  const tick = () => {
    const vh = window.innerHeight || 800;
    for (const el of parallaxEls) {
      const r = el.getBoundingClientRect();
      // only if near viewport
      if (r.bottom < -100 || r.top > vh + 100) continue;
      const strength = Number(el.dataset.parallax || "0.06");
      const offset = (r.top - vh * 0.5) * strength;
      el.style.transform = `translateY(${offset}px)`;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);

  // Mobile nav (simple)
  const toggle = $(".navToggle");
  const nav = $(".nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));

      // quick overlay panel
      if (!expanded) {
        nav.style.display = "flex";
        nav.style.position = "absolute";
        nav.style.right = "calc(var(--pad) * 1)";
        nav.style.top = "62px";
        nav.style.flexDirection = "column";
        nav.style.padding = "12px";
        nav.style.borderRadius = "18px";
        nav.style.background = "rgba(8,9,15,.90)";
        nav.style.border = "1px solid rgba(255,255,255,.10)";
        nav.style.backdropFilter = "blur(12px)";
        nav.style.boxShadow = "0 22px 70px rgba(0,0,0,.55)";
      } else {
        nav.style.display = "";
        nav.removeAttribute("style");
      }
    });

    // close on click
    nav.addEventListener("click", (e) => {
      if (e.target.tagName.toLowerCase() === "a") {
        toggle.setAttribute("aria-expanded", "false");
        nav.style.display = "";
        nav.removeAttribute("style");
      }
    });
  }
})();
// Portrait click animation
const portrait = document.querySelector(".portraitCard");

if (portrait) {
  portrait.addEventListener("click", () => {
    portrait.classList.toggle("active");

    // remove effect after 600ms لو عايزه يرجع طبيعي
    setTimeout(() => {
      portrait.classList.remove("active");
    }, 600);
  });
}