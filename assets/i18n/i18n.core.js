/* =========================================
   i18n Core Engine – MMD Privé (v1.5 LOCK)
   - MMD.i18n.t(key, lang)
   - MMD.i18n.setLang(lang, root?)
   - role-aware + mobile short + fallback
   - never blank content if missing translation
   - debug: ?i18n_debug=1
========================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "mmd_lang";
  const DEFAULT_LANG = "en";
  const FALLBACK_LANG = "en";

  const ROLE_LANG_DEFAULT = {
    guest: "en",
    member: "en",
    vip: "en",
    blackcard: "en",
    admin: "en"
  };

  const I18N_DEBUG = new URLSearchParams(window.location.search).has("i18n_debug");

  function debugWrap(key) {
    return (
      `<span style="` +
      `color:#ff6b6b; background:rgba(255,107,107,0.12);` +
      `padding:2px 4px; border-radius:4px; font-size:12px;` +
      `font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;` +
      `">` +
      key +
      `</span>`
    );
  }

  function getUserRole() {
    // preferred: <body data-user-role="vip">
    const b = document.body;
    return (b && (b.dataset.userRole || b.getAttribute("data-user-role"))) || "guest";
  }

  function normalizeLang(lang) {
    const s = String(lang || "").toLowerCase();
    if (s.startsWith("th")) return "th";
    if (s === "zh-hant" || s.startsWith("zh-tw") || s.startsWith("zh-hk")) return "zh-Hant";
    if (s.startsWith("zh")) return "zh";
    if (s === "jp" || s === "ja" || s.startsWith("ja")) return "jp";
    return "en";
  }

  function safeGetStoredLang() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      return null;
    }
  }

  function safeSetStoredLang(lang) {
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {}
  }

  function detectLang() {
    const role = getUserRole();

    const stored = safeGetStoredLang();
    if (stored) return normalizeLang(stored);

    const nav = navigator.language || DEFAULT_LANG;
    // keep explicit mappings first
    if (nav.startsWith("th")) return "th";
    if (nav.startsWith("zh-TW")) return "zh-Hant";
    if (nav.startsWith("zh")) return "zh";

    return normalizeLang(ROLE_LANG_DEFAULT[role] || DEFAULT_LANG);
  }

  function getDict() {
    return window.I18N_DICT || null;
  }

  function getValue(lang, key, isMobile) {
    const dict = getDict();
    if (!dict) return "";

    const role = getUserRole();
    const L = normalizeLang(lang);

    // 1) role-specific
    if (dict[L] && dict[L][`${key}.${role}`] != null) return String(dict[L][`${key}.${role}`]);

    // 2) mobile short
    if (isMobile && dict[L] && dict[L][`${key}.m`] != null) return String(dict[L][`${key}.m`]);

    // 3) normal
    if (dict[L] && dict[L][key] != null) return String(dict[L][key]);

    // 4) fallback language (role)
    if (dict[FALLBACK_LANG] && dict[FALLBACK_LANG][`${key}.${role}`] != null)
      return String(dict[FALLBACK_LANG][`${key}.${role}`]);

    // 5) fallback language (normal)
    if (dict[FALLBACK_LANG] && dict[FALLBACK_LANG][key] != null)
      return String(dict[FALLBACK_LANG][key]);

    // 6) debug / silent
    return I18N_DEBUG ? debugWrap(key) : "";
  }

  function applyToRoot(rootEl, lang) {
    const root = rootEl || document;
    const L = normalizeLang(lang);

    const nodes = root.querySelectorAll ? root.querySelectorAll("[data-i18n]") : [];
    nodes.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;

      const isMobile = (el.getAttribute("data-i18n-mobile") === "true") || (el.dataset && el.dataset.i18nMobile === "true");

      // prefer stable fallback from attribute
      const attrFallback = el.getAttribute("data-fallback");
      const fallback = (attrFallback != null) ? attrFallback : el.innerHTML;

      const value = getValue(L, key, isMobile);

      // IMPORTANT: never blank-out real content in production
      if (value && String(value).trim()) el.innerHTML = value;
      else if (fallback != null) el.innerHTML = fallback;
    });

    // convenience: mark lang on <html> and root data-lang if possible
    try {
      document.documentElement.setAttribute("lang", L);
    } catch (e) {}

    try {
      if (rootEl && rootEl.dataset) rootEl.dataset.lang = L;
    } catch (e) {}
  }

  function setLang(lang, rootEl) {
    const L = normalizeLang(lang || DEFAULT_LANG);
    safeSetStoredLang(L);
    applyToRoot(rootEl || document, L);

    // broadcast
    try {
      window.dispatchEvent(new CustomEvent("mmd:lang", { detail: { lang: L } }));
    } catch (e) {}
    return L;
  }

  function t(key, lang) {
    return getValue(normalizeLang(lang || detectLang()), key, false);
  }

  // expose (preferred namespace)
  window.MMD = window.MMD || {};
  window.MMD.i18n = {
    version: "1.5",
    dict: getDict,
    detectLang,
    normalizeLang,
    getLang: () => normalizeLang(safeGetStoredLang() || detectLang()),
    setLang,
    apply: applyToRoot,
    t
  };

  // legacy alias
  window.setLang = function (lang) { return setLang(lang, document); };

  // auto-init
  document.addEventListener("DOMContentLoaded", function () {
    setLang(detectLang(), document);
  });
})();
