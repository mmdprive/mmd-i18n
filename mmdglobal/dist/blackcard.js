/* =========================================
   MMD Privé — Black Card (Per Lux)
   File: blackcard.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {
  const root = document.getElementById("blackcard");
  if (!root) return;

  /* ---------------------------
     Helpers: role
  --------------------------- */
  const ROLE_ORDER = ["guest", "member", "vip", "blackcard", "admin"];

  function normalizeRole(r) {
    const s = String(r || "").toLowerCase().trim();
    if (s === "black card") return "blackcard";
    if (ROLE_ORDER.includes(s)) return s;
    return "guest";
  }

  // Admin override for testing
  const OVERRIDE_KEY = "mmd_role_override";

  function getRoleFromDom() {
    return normalizeRole(document.body?.dataset?.userRole || "guest");
  }

  function getRoleFromOverride() {
    try {
      return normalizeRole(localStorage.getItem(OVERRIDE_KEY) || "");
    } catch {
      return "";
    }
  }

  function getRole() {
    // priority: override -> body dataset -> memberstack (async updates later)
    return getRoleFromOverride() || getRoleFromDom();
  }

  function setRole(role) {
    const r = normalizeRole(role);
    document.body.dataset.userRole = r;
    renderRole(r);
  }

  /* ---------------------------
     Dynamic copy (Per Lux tone)
  --------------------------- */
  const COPY = {
    hero: {
      title: "BLACK CARD",
      sub: "Relationship-tier access. Curated, discreet, and granted when appropriate."
    },
    role: { label: "STATUS" },
    flow: {
      title: "From Premium to Black Card",
      p1:
        "Premium is designed for full access with priority handling. Black Card is a different layer — it is relationship-tier, built on long-term fit, consistency, and mutual trust.",
      p2:
        "This page explains the intent, the signals we look at, and what “consideration” means — without exposing internal criteria or creating false expectations."
    },
    what: {
      title: "What Black Card is",
      p1:
        "Black Card is not a “package” you purchase. It is a status we may extend based on relationship quality, usage maturity, and alignment with how our system is designed to operate.",
      li1: "Discreet access and tailored coordination.",
      li2: "Higher trust surface area — fewer frictions, clearer context.",
      li3: "Eligibility is reviewed over time, not “applied for” once."
    },
    how: {
      title: "How consideration works",
      p1:
        "We observe consistency, communication quality, and appropriate usage patterns. When the time is right, we will inform you directly.",
      c1: { t: "Consistency", d: "Reliable behavior across time — not a single peak moment." },
      c2: { t: "Clarity", d: "Clear communication, respect for boundaries, and smooth coordination." },
      c3: { t: "Fit", d: "Alignment with what MMD Privé is built for — premium, private, and intentional." }
    },
    foot: {
      note: "Access and consideration may evolve over time. Final decision remains at team discretion."
    },
    roleMessage: {
      guest:
        "You are currently in Guest view. Black Card is not available for direct entry. If you want a structured path forward, begin with Premium membership and build consistency over time.",
      member:
        "You are a member. Maintain clean communication and consistent usage. If Black Card becomes appropriate, the team will inform you directly.",
      vip:
        "You are VIP. You are already on priority handling. Continue with consistent patterns; Black Card consideration is evaluated quietly over time.",
      blackcard:
        "Black Card status is active. Your access is handled discreetly and contextually. For coordination, use your usual team channel.",
      admin:
        "Admin mode. Role gates and copy are visible for verification. Use the dev buttons below to simulate roles."
    }
  };

  function applyCopy() {
    const map = {
      "hero.title": COPY.hero.title,
      "hero.sub": COPY.hero.sub,
      "role.label": COPY.role.label,
      "flow.title": COPY.flow.title,
      "flow.p1": COPY.flow.p1,
      "flow.p2": COPY.flow.p2,
      "what.title": COPY.what.title,
      "what.p1": COPY.what.p1,
      "what.li1": COPY.what.li1,
      "what.li2": COPY.what.li2,
      "what.li3": COPY.what.li3,
      "how.title": COPY.how.title,
      "how.p1": COPY.how.p1,
      "how.c1.t": COPY.how.c1.t,
      "how.c1.d": COPY.how.c1.d,
      "how.c2.t": COPY.how.c2.t,
      "how.c2.d": COPY.how.c2.d,
      "how.c3.t": COPY.how.c3.t,
      "how.c3.d": COPY.how.c3.d,
      "foot.note": COPY.foot.note
    };

    root.querySelectorAll("[data-copy]").forEach((el) => {
      const key = el.getAttribute("data-copy");
      if (key && map[key]) el.textContent = map[key];
    });
  }

  /* ---------------------------
     Role gates + role message
  --------------------------- */
  function gateByRole(role) {
    // hide elements requiring role allow
    document.querySelectorAll("[data-role-allow]").forEach((el) => {
      const allowed = String(el.getAttribute("data-role-allow") || "")
        .split(",")
        .map((x) => x.trim().toLowerCase())
        .filter(Boolean);

      if (!allowed.length) return;
      if (!allowed.includes(role)) el.remove();
    });

    // guest-only hints
    document.querySelectorAll("[data-guest-only]").forEach((el) => {
      el.style.display = role === "guest" ? "block" : "none";
    });

    // 🔐 Hide CTA wrap for guest
    const ctaWrap = root.querySelector("[data-cta-wrap]");
    if (ctaWrap) ctaWrap.style.display = role === "guest" ? "none" : "block";
  }

  function renderRole(role) {
    const r = normalizeRole(role);

    const roleValue = root.querySelector("[data-role-value]");
    if (roleValue) roleValue.textContent = r;

    const roleMsg = root.querySelector("[data-role-message]");
    if (roleMsg) roleMsg.textContent = COPY.roleMessage[r] || COPY.roleMessage.guest;

    gateByRole(r);
  }

  /* ---------------------------
     Fade-in
  --------------------------- */
  function initFadeIn() {
    const faders = document.querySelectorAll(".fade-in");
    const appearOptions = { threshold: 0.18, rootMargin: "0px 0px -60px 0px" };

    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, appearOptions);

    faders.forEach((el) => io.observe(el));
  }

  /* ---------------------------
     Sparkle Canvas (hero)
  --------------------------- */
  function initSparkleCanvas() {
    const canvas = document.querySelector(".sparkle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();

    const particles = Array.from({ length: 46 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.6 + 0.6,
      vx: (Math.random() - 0.5) * 0.38,
      vy: (Math.random() - 0.5) * 0.38,
      a: Math.random() * 0.8 + 0.2
    }));

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,214,87,${p.a})`;
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      }
      requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener("resize", resize);
  }

  /* ---------------------------
     Background Particles (page)
  --------------------------- */
  function initBackgroundParticles() {
    const bgCanvas = document.querySelector(".background-canvas");
    if (!bgCanvas) return;
    const ctx = bgCanvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      bgCanvas.width = window.innerWidth;
      bgCanvas.height = window.innerHeight;
    }
    resize();

    const dots = Array.from({ length: 140 }, () => ({
      x: Math.random() * bgCanvas.width,
      y: Math.random() * bgCanvas.height,
      r: Math.random() * 1.6 + 0.4,
      vy: Math.random() * 0.26 + 0.08,
      a: Math.random() * 0.55 + 0.10
    }));

    function tick() {
      ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,214,87,${d.a})`;
        ctx.fill();

        d.y += d.vy;
        if (d.y > bgCanvas.height + 8) {
          d.y = -8;
          d.x = Math.random() * bgCanvas.width;
        }
      }
      requestAnimationFrame(tick);
    }
    tick();

    window.addEventListener("resize", resize);
  }

  /* ---------------------------
     Audio control (safe)
  --------------------------- */
  function initAudioControl() {
    const audio = document.getElementById("bg-audio");
    if (!audio) return;

    // Default muted off? We keep muted true until user clicks.
    audio.volume = 0.15;
    audio.muted = true;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "mmd-btn ghost";
    btn.textContent = "Audio: Off";
    btn.style.position = "fixed";
    btn.style.bottom = "18px";
    btn.style.right = "18px";
    btn.style.zIndex = "1000";
    btn.style.padding = "10px 14px";
    btn.style.borderRadius = "12px";

    document.body.appendChild(btn);

    let playing = false;
    btn.addEventListener("click", async () => {
      try {
        if (!playing) {
          audio.muted = false;
          await audio.play();
          playing = true;
          btn.textContent = "Audio: On";
        } else {
          audio.pause();
          playing = false;
          btn.textContent = "Audio: Off";
        }
      } catch {
        // Autoplay blocked or missing src — keep silent.
        playing = false;
        btn.textContent = "Audio: Off";
      }
    });
  }

  /* ---------------------------
     Memberstack integration (optional)
     If MemberStack is present, update role when ready.
  --------------------------- */
  function initMemberStackRole() {
    if (!window.MemberStack || !window.MemberStack.onReady) return;

    window.MemberStack.onReady.then((member) => {
      // Attempt common shapes
      const candidate =
        member?.role ||
        member?.data?.role ||
        member?.membership?.role ||
        member?.plan?.role ||
        "";

      // If your MemberStack role naming differs, map here:
      // e.g. "svip" -> "vip", "black-card" -> "blackcard"
      const mapped = normalizeRole(
        String(candidate).replace("-", "").replace("_", "")
      );

      // Only set if not overridden
      if (!getRoleFromOverride()) setRole(mapped);
    });
  }

  /* ---------------------------
     Admin dev tools
  --------------------------- */
  function initAdminTools() {
    document.querySelectorAll("[data-admin-action]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const action = btn.getAttribute("data-admin-action");
        const map = {
          "force-guest": "guest",
          "force-member": "member",
          "force-vip": "vip",
          "force-blackcard": "blackcard"
        };
        const next = map[action];
        if (!next) return;

        try {
          localStorage.setItem(OVERRIDE_KEY, next);
        } catch {}
        setRole(next);
      });
    });
  }

  /* ---------------------------
     Boot
  --------------------------- */
  applyCopy();
  initFadeIn();
  initSparkleCanvas();
  initBackgroundParticles();
  initAudioControl();
  initMemberStackRole();
  initAdminTools();

  renderRole(getRole());
});
