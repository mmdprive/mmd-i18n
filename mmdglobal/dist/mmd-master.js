/* ======================================================
   MMD PRIVÉ — MASTER (FINAL)
   Works with i18n.core.js v1.6 LOCK (MMD.i18n.*)
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

    // language storage keys follow i18n.core.js (reads/writes both)
    langStorageKeys: ["mmd_lang", "lang"],
    defaultLang: "en",

    // visibility standard
    visibleForAttr: "data-visible-for",
  };

  const STATE = {
    role: CONFIG.defaultRole,
    lang: CONFIG.defaultLang,
    ready: false,
  };

  // ---------- Storage (match core behavior) ----------
  function safeGetStoredLang() {
    try {
      for (const k of CONFIG.langStorageKeys) {
        const v = localStorage.getItem(k);
        if (v) return v;
      }
    } catch (e) {}
    return "";
  }

  function safeSetStoredLang(lang) {
    try {
      for (const k of CONFIG.langStorageKeys) localStorage.setItem(k, lang);
    } catch (e) {}
  }

  // ---------- Role ----------
  function normalizeRole(role) {
    if (!role) return CONFIG.defaultRole;
    const r = String(role).trim().toLowerCase();
    return CONFIG.roles.includes(r) ? r : CONFIG.defaultRole;
  }

  function detectRoleFromBody() {
    const body = document.body;
    if (!body) return CONFIG.defaultRole;
    return normalizeRole(body.getAttribute(CONFIG.roleAttr) || body.dataset.userRole);
  }

  function applyRoleToDOM(role) {
    const body = document.body;
    if (!body) return;

    // class hook
    CONFIG.roles.forEach((r) => body.classList.remove(`role-${r}`));
    body.classList.add(`role-${role}`);

    // attrs used by i18n core getRole(): body.dataset.userRole
    body.dataset.userRole = role;
    body.setAttribute(CONFIG.roleAttr, role);
  }

  // ---------- Visibility ----------
  function applyVisibilityByRole() {
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

  // ---------- Language ----------
  function detectLang() {
    // Prefer i18n core getter if present; else fallback
    if (window.MMD?.i18n?.getLang) return window.MMD.i18n.getLang();

    const htmlLang = document.documentElement?.getAttribute("lang");
    const stored = safeGetStoredLang();
    return (stored || htmlLang || CONFIG.defaultLang).trim().toLowerCase();
  }

  function applyI18nLang(lang, scope) {
    // Use the ONLY supported engine: MMD.i18n.setLang
    const i18n = window.MMD && window.MMD.i18n;
    if (i18n && typeof i18n.setLang === "function") {
      i18n.setLang(lang, scope);
      return true;
    }
    return false;
  }

  function setLang(lang) {
    STATE.lang = String(lang || CONFIG.defaultLang).trim().toLowerCase();

    // keep storage aligned with i18n core keys
    safeSetStoredLang(STATE.lang);

    // apply via i18n core (role-aware)
    applyI18nLang(STATE.lang);

    document.dispatchEvent(new CustomEvent("mmd:master:lang", { detail: { lang: STATE.lang } }));
  }

  // ---------- Public API ----------
  window.MMD.getRole = () => STATE.role;
  window.MMD.getLang = () => STATE.lang;

  window.MMD.setRole = (role) => {
    STATE.role = normalizeRole(role);
    applyRoleToDOM(STATE.role);
    applyVisibilityByRole();

    // IMPORTANT: role affects i18n key.{role} -> re-apply current lang
    applyI18nLang(STATE.lang);

    document.dispatchEvent(new CustomEvent("mmd:master:role", { detail: { role: STATE.role } }));
  };

  window.MMD.setLang = (lang) => setLang(lang);

  // If you add this event in i18n.core.js, master will sync when core is ready:
  document.addEventListener("mmd:i18n:ready", function () {
    // ensure i18n sees correct role before applying
    applyRoleToDOM(STATE.role);
    applyI18nLang(STATE.lang);
  });

  // ---------- Init ----------
  function init() {
    STATE.role = detectRoleFromBody();
    applyRoleToDOM(STATE.role);
    applyVisibilityByRole();

    setLang(detectLang());

    STATE.ready = true;
    document.dispatchEvent(new CustomEvent("mmd:master:ready", { detail: { ...STATE } }));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})(window, document);
