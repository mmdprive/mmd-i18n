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

  // kill particles forever
  const PARTICLE_SELECTOR =
    "canvas#gold-particles, #gold-particles, canvas[id*='particle' i], canvas[class*='particle' i]";
  function killParticles() {
    document.querySelectorAll(PARTICLE_SELECTOR).forEach((el) => el.remove());
  }

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
      "<div>lang: " + (localStorage.getItem("lang") || "auto") + "</div>";
    document.body.appendChild(box);
  }

  MMD.onReady(function () {
    // always kill particles
    killParticles();
    const mo = new MutationObserver(killParticles);
    mo.observe(document.documentElement, { childList: true, subtree: true });

    // role sync (Memberstack)
    const defaultRole = document.body?.dataset?.userRole || "guest";

    if (!window.MemberStack || !MemberStack.onReady) {
      document.body.dataset.userRole = defaultRole;
      applyRoleUI(defaultRole);
      initDebug(defaultRole);
      return;
    }

    MemberStack.onReady.then(({ member }) => {
      const role = member?.roles?.[0] || defaultRole || "guest";
      document.body.dataset.userRole = role;
      applyRoleUI(role);
      initDebug(role);
    });
  });
})();

window.t = function t(key, lang) {
  const dict = window.I18N_DICT || {};
  const l = (lang || document.documentElement.lang || "th").toLowerCase();

  // TH is canonical fallback
  return (
    (dict[l] && dict[l][key]) ||
    (dict.th && dict.th[key]) ||
    (dict.en && dict.en[key]) || // optional second fallback
    key
  );
};

</script>
