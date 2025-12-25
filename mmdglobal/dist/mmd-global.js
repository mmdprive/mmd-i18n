<script>
(function () {
  "use strict";

  window.MMD = window.MMD || {};

  // env (merge)
  MMD.env = Object.assign(
    { debug: new URLSearchParams(location.search).has("debug") },
    MMD.env || {}
  );

  MMD.onReady = function (fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  };

  /* =========================
     Particles killer
  ========================= */
  const PARTICLE_SELECTOR =
    "canvas#gold-particles, #gold-particles, canvas[id*='particle' i], canvas[class*='particle' i]";
  function killParticles() {
    document.querySelectorAll(PARTICLE_SELECTOR).forEach((el) => el.remove());
  }

  /* =========================
     Role UI
  ========================= */
  function applyRoleUI(role) {
    document.querySelectorAll("[data-role-allow]").forEach((el) => {
      const allowed = String(el.dataset.roleAllow || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (allowed.length && !allowed.includes(role)) el.remove();
    });
    document.querySelectorAll("[data-role-deny]").forEach((el) => {
      const deny = String(el.dataset.roleDeny || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      if (deny.length && deny.includes(role)) el.remove();
    });
  }

  function initDebug(role) {
    if (!MMD.env.debug) return;
    if (role !== "admin") return;

    const box = document.createElement("div");
    box.id = "mmd-debug";
    box.style.cssText =
      "position:fixed;bottom:12px;right:12px;background:#0b0c13;color:#cba65a;padding:10px 14px;font-size:12px;z-index:99999;border-radius:12px;font-family:system-ui;border:1px solid rgba(203,166,90,.25)";
    box.innerHTML =
      "<div style='font-weight:900'>MMD Debug</div>" +
      "<div>role: " + role + "</div>" +
      "<div>lang: " + (localStorage.getItem("lang") || "th") + "</div>";
    document.body.appendChild(box);
  }

  /* =========================
     i18n helpers (TH is canonical)
     - Uses window.I18N_DICT
     - Optional: apply [data-i18n]
  ========================= */
  function normalizeLang(lang) {
    const l = String(lang || "").toLowerCase();

    // keep your 4 langs canonical
    if (l === "th" || l === "en" || l === "ch" || l === "jp") return l;

    // common aliases -> ch
    if (l === "zh" || l === "zh-cn" || l === "zh-hans" || l === "cn") return "ch";
    if (l === "zh-hant" || l === "zh-tw" || l === "tw" || l === "hk") return "ch";

    return "th";
  }

  // Global translator (TH-first fallback)
  window.t = function t(key, lang) {
    const dict = window.I18N_DICT || {};
    const l = normalizeLang(lang || localStorage.getItem("lang") || document.documentElement.lang || "th");

    return (
      (dict[l] && dict[l][key]) ||
      (dict.th && dict.th[key]) ||
      (dict.en && dict.en[key]) ||
      key
    );
  };

  // Optional i18n module (non-breaking)
  MMD.i18n = MMD.i18n || {};

  MMD.i18n.getLang = function () {
    return normalizeLang(localStorage.getItem("lang") || "th");
  };

  MMD.i18n.setLang = function (lang) {
    const l = normalizeLang(lang);
    localStorage.setItem("lang", l);
    document.documentElement.lang = l; // for accessibility + tooling
    return l;
  };

  // Apply translations to elements with [data-i18n="key"]
  // Uses textContent by default; supports data-i18n-attr="placeholder|title|aria-label|..."
  MMD.i18n.apply = function (lang) {
    const l = normalizeLang(lang || MMD.i18n.getLang());
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const attr = el.getAttribute("data-i18n-attr");
      const val = window.t(key, l);

      if (attr) el.setAttribute(attr, val);
      else el.textContent = val;
    });
  };

  /* =========================
     Boot
  ========================= */
  MMD.onReady(function () {
    // always kill particles
    killParticles();
    const mo = new MutationObserver(killParticles);
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // Ensure lang default TH (canonical)
    if (!localStorage.getItem("lang")) localStorage.setItem("lang", "th");
    document.documentElement.lang = normalizeLang(localStorage.getItem("lang"));

    // role sync (Memberstack)
    const defaultRole = document.body?.dataset?.userRole || "guest";

    if (!window.MemberStack || !MemberStack.onReady) {
      document.body.dataset.userRole = defaultRole;
      applyRoleUI(defaultRole);
      initDebug(defaultRole);
      // Optional auto-apply i18n (only if you start using [data-i18n])
      // MMD.i18n.apply();
      return;
    }

    MemberStack.onReady.then(({ member }) => {
      const role = member?.roles?.[0] || defaultRole || "guest";
      document.body.dataset.userRole = role;
      applyRoleUI(role);
      initDebug(role);
      // Optional auto-apply i18n (only if you start using [data-i18n])
      // MMD.i18n.apply();
    });
  });
})();
</script>
