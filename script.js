// ===============================
// CONFIG
// ===============================
const CONFIG = {
  matrixEnabled: window.matchMedia("(min-width: 768px)").matches
};

// ===============================
// UTIL
// ===============================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===============================
// SCROLL REVEAL
// ===============================
const Reveal = (() => {
  function init() {
    const elements = $$(".reveal");
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    elements.forEach(el => observer.observe(el));
  }

  return { init };
})();

// ===============================
// PROGRESS BARS
// ===============================
const ProgressBars = (() => {
  function init() {
    $$(".progress-bar").forEach(el => {
      const pct = el.dataset.progress || 0;
      el.style.width = pct + "%";
    });
  }

  return { init };
})();

// ===============================
// BACK TO TOP
// ===============================
const BackToTop = (() => {
  function init() {
    const btn = $("#backToTop");
    if (!btn) return;

    window.addEventListener("scroll", () => {
      btn.classList.toggle("show", window.scrollY > 400);
    });

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  return { init };
})();

// ===============================
// NAVBAR SCROLL
// ===============================
const Navbar = (() => {
  let lastScroll = 0;

  function init() {
    const header = $("header");
    if (!header) return;

    window.addEventListener("scroll", () => {
      const current = window.pageYOffset;

      if (current > lastScroll + 10) {
        header.classList.add("hide");
      } else if (current < lastScroll - 10) {
        header.classList.remove("hide");
      }

      lastScroll = Math.max(current, 0);
    });
  }

  return { init };
})();

// ===============================
// MATRIX BACKGROUND
// ===============================
const Matrix = (() => {
  let animationId;
  const letters = "01".split("");
  let drops = [];

  function draw(ctx, canvas) {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgb(81, 11, 247)";
    ctx.font = "14px monospace";

    drops.forEach((y, i) => {
      const text = letters[Math.floor(Math.random() * letters.length)];
      ctx.fillText(text, i * 14, y * 14);

      if (y * 14 > canvas.height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    });

    animationId = requestAnimationFrame(() => draw(ctx, canvas));
  }

  function init() {
    if (!CONFIG.matrixEnabled) return;

    const canvas = $("#matrixCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const cols = Math.floor(canvas.width / 14) + 1;
      drops = Array(cols).fill(0);
    }

    window.addEventListener("resize", resize);
    resize();
    draw(ctx, canvas);

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(animationId);
      else draw(ctx, canvas);
    });
  }

  return { init };
})();

// ===============================
// TERMINAL INTRO
// ===============================
const Terminal = (() => {
  const lines = [
    "> initializing security interface...",
    "> connecting to github repositories...",
    "> loading projects...",
    "> verifying credentials...",
    "> access granted"
  ];

  function init() {
    const container = $("#terminalIntro");
    const output = $("#terminalText");

    if (!container || !output) return;

    if (sessionStorage.getItem("introPlayed")) {
      container.style.display = "none";
      return;
    }

    let line = 0, char = 0;

    function type() {
      if (line < lines.length) {
        if (char < lines[line].length) {
          output.textContent += lines[line][char++];
          setTimeout(type, 30);
        } else {
          output.textContent += "\n";
          line++;
          char = 0;
          setTimeout(type, 400);
        }
      } else {
        sessionStorage.setItem("introPlayed", "true");
        container.style.opacity = "0";
        setTimeout(() => (container.style.display = "none"), 800);
      }
    }

    type();
  }

  return { init };
})();

// ===============================
// SKIP INTRO BUTTON
// ===============================
(() => {
  const skipBtn = $("#skipIntro");
  const intro = $("#terminalIntro");

  if (!skipBtn || !intro) return;

  skipBtn.addEventListener("click", () => {
    sessionStorage.setItem("introPlayed", "true");
    intro.style.display = "none";
  });
})();

// ===============================
// INIT APP
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  Reveal.init();
  ProgressBars.init();
  BackToTop.init();
  Navbar.init();
  Matrix.init();
  Terminal.init();
});