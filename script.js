// ===============================
// CONFIG
// ===============================
const CONFIG = {
  attackInterval: 2500,
  matrixEnabled: window.innerWidth >= 768
};

// ===============================
// UTIL
// ===============================
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// ===============================
// CYBER ATTACK ANIMATION
// ===============================
const CyberAttacks = (() => {
  const layer = $("#cyberAttacks");

  function create() {
    if (!layer) return;

    const el = document.createElement("div");
    el.className = "attack";

    const startX = Math.random() * window.innerWidth;
    const startY = Math.random() * window.innerHeight;

    const dx = window.innerWidth / 2 - startX;
    const dy = window.innerHeight / 2 - startY;

    el.style.left = startX + "px";
    el.style.top = startY + "px";
    el.style.setProperty("--dx", dx + "px");
    el.style.setProperty("--dy", dy + "px");

    const duration = 2000 + Math.random() * 2000;
    el.style.width = (30 + Math.random() * 100) + "px";
    el.style.animationDuration = duration + "ms";

    layer.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  function init() {
    setInterval(create, CONFIG.attackInterval);
  }

  return { init };
})();

// ===============================
// SCROLL REVEAL
// ===============================
const Reveal = (() => {
  function init() {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("show");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    $$(".reveal").forEach(el => observer.observe(el));
  }

  return { init };
})();

// ===============================
// PROGRESS BARS
// ===============================
const ProgressBars = (() => {
  function init() {
    document.querySelectorAll(".progress-bar").forEach(el => {
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
  const btn = $("#backToTop");

  function init() {
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
  const header = $("header");

  function init() {
    window.addEventListener("scroll", () => {
      const current = window.pageYOffset;

      if (current > lastScroll + 10) {
        header.classList.add("hide");
      } else if (lastScroll > current + 10) {
        header.classList.remove("hide");
      }

      lastScroll = current <= 0 ? 0 : current;
    });
  }

  return { init };
})();

// ===============================
// MATRIX BACKGROUND
// ===============================
const Matrix = (() => {
  let animationId;

  function init() {
    if (!CONFIG.matrixEnabled) return;

    const canvas = $("#matrixCanvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const letters = "01";
    const drops = Array(Math.floor(canvas.width / 14)).fill(1);

    function draw() {
      ctx.fillStyle = "rgba(15,15,20,0.07)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#c46efe";
      ctx.font = "14px monospace";

      drops.forEach((y, i) => {
        const text = letters[Math.floor(Math.random() * letters.length)];
        ctx.fillText(text, i * 14, y * 14);

        if (y * 14 > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });

      animationId = requestAnimationFrame(draw);
    }

    draw();

    document.addEventListener("visibilitychange", () => {
      if (document.hidden) cancelAnimationFrame(animationId);
      else draw();
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
    if (sessionStorage.getItem("introPlayed")) {
      $("#terminalIntro").style.display = "none";
      return;
    }

    const el = $("#terminalText");
    let line = 0, char = 0;

    function type() {
      if (line < lines.length) {
        if (char < lines[line].length) {
          el.textContent += lines[line][char++];
          setTimeout(type, 30);
        } else {
          el.textContent += "\n";
          line++; char = 0;
          setTimeout(type, 400);
        }
      } else {
        sessionStorage.setItem("introPlayed", "true");
        $("#terminalIntro").style.opacity = "0";
        setTimeout(() => $("#terminalIntro").style.display = "none", 800);
      }
    }

    type();
  }

  return { init };
})();

// ===============================
// INIT APP
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  CyberAttacks.init();
  Reveal.init();
  ProgressBars.init();
  BackToTop.init();
  Navbar.init();
  Matrix.init();
  Terminal.init();
});