/* ======================================================
   MMD PRIVÉ — MASTER (FINAL)
   i18n: assets/i18n/i18n.dict.js + assets/i18n/i18n.core.js only
   Contract: window.MMD_I18N.apply(lang)
   Roles: guest, standard, premium, vip, svip
   Version: 2026-01-02
====================================================== */

(function (window, document) {
  "use strict";

  window.MMD = window.MMD || {};

  const CONFIG = {
    roles: ["guest", "standard", "premium", "vip", "svip"],
    defaultRole: "guest",
    roleAttr: "data-user-role",

    // i18n contract (LOCK)
    i18nGlobal: "MMD_I18N",
    i18nApply: "apply",

    // language
    defaultLang: "en",
    langStorageKey: "mmd_lang",

    // visibility (standard)
    visibleForAttr: "data-visible-for",
  };

  const STATE = {
    role: CONFIG.defaultRole,
    lang: CONFIG.defaultLang,
    ready: false,
  };

  // ---------- Helpers ----------
  function normalizeRole(role) {
    if (!role) return CONFIG.defaultRole;
    const r = String(role).trim().toLowerCase();
    return CONFIG.roles.includes(r) ? r : CONFIG.defaultRole;
  }

  function getBodyRole() {
    const body = document.body;
    if (!body) return null;
    return normalizeRole(body.getAttribute(CONFIG.roleAttr) || body.dataset.userRole);
  }

  function applyRole(role) {
    const body = document.body;
    if (!body) return;

    CONFIG.roles.forEach((r) => body.classList.remove(`role-${r}`));
    body.classList.add(`role-${role}`);
    body.setAttribute(CONFIG.roleAttr, role);
  }

  function applyVisibility() {
    const role = STATE.role;
    const attr = CONFIG.visibleForAttr;

    document.querySelectorAll(`[${attr}]`).forEach((el) => {
      const allowed = (el.getAttribute(attr) || "")
        .split(",")
        .map((x) => x.trim().toLowerCase())
        .filter(Boolean);

      el.hidden = !allowed.includes(role);
    });
  }

  function detectLang() {
    const htmlLang = document.documentElement?.getAttribute("lang");
    const saved = localStorage.getItem(CONFIG.langStorageKey);
    return (htmlLang || saved || CONFIG.defaultLang).trim().toLowerCase();
  }

  function getI18n() {
    return window[CONFIG.i18nGlobal] || null;
  }

  function applyI18n(lang) {
    const i18n = getI18n();
    const fn = i18n && i18n[CONFIG.i18nApply];
    if (typeof fn === "function") fn.call(i18n, lang);
  }

  function setLang(lang) {
    STATE.lang = String(lang || CONFIG.defaultLang).trim().toLowerCase();
    localStorage.setItem(CONFIG.langStorageKey, STATE.lang);

    // Apply now if core is ready; if core dispatches ready event later, we'll re-apply then.
    applyI18n(STATE.lang);

    document.dispatchEvent(new CustomEvent("mmd:lang", { detail: { lang: STATE.lang } }));
  }

  // ---------- Public API ----------
  window.MMD.getRole = () => STATE.role;
  window.MMD.getLang = () => STATE.lang;

  window.MMD.setRole = (role) => {
    STATE.role = normalizeRole(role);
    applyRole(STATE.role);
    applyVisibility();
    document.dispatchEvent(new CustomEvent("mmd:role", { detail: { role: STATE.role } }));
  };

  window.MMD.setLang = (lang) => setLang(lang);

  // Optional hook: if i18n.core.js dispatches this when ready
  document.addEventListener("mmd:i18n:ready", function () {
    applyI18n(STATE.lang);
  });

  // ---------- Init ----------
  function init() {
    STATE.role = getBodyRole() || CONFIG.defaultRole;
    applyRole(STATE.role);
    applyVisibility();

    setLang(detectLang());

    STATE.ready = true;
    document.dispatchEvent(new CustomEvent("mmd:ready", { detail: { ...STATE } }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
