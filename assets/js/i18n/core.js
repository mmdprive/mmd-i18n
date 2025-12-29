/* =========================================
   MMD Privé i18n – Core Engine
   File: assets/js/i18n/core.js
   ========================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "mmd_lang";
  const DEFAULT_LANG = "th";
  const SUPPORTED = ["th", "en", "zh", "ja"];

  function normalizeLang(raw) {
    if (!raw) return null;
    const s = String(raw).toLowerCase();
    if (s.startsWith("zh")) return "zh";
    if (s.startsWith("ja") || s.startsWith("jp")) return "ja";
    if (s.startsWith("en")) return "en";
    if (s.startsWith("th")) return "th";
    return SUPPORTED.includes(s) ? s : null;
  }

  function getUrlLang() {
    const q = new URLSearchParams(window.location.search).get("lang");
    return normalizeLang(q);
  }

  function getHtmlLang() {
    const h = document.documentElement && document.documentElement.getAttribute("lang");
    return normalizeLang(h);
  }

  function getLang() {
    const urlLang = getUrlLang();
    if (urlLang) return urlLang;

    const stored = normalizeLang(localStorage.getItem(STORAGE_KEY));
    if (stored) return stored;

    const htmlLang = getHtmlLang();
    if (htmlLang) return htmlLang;

    return DEFAULT_LANG;
  }

  function applyI18n(forcedLang) {
    const lang = forcedLang || getLang();
    const dict = (window.I18N_DICT && window.I18N_DICT[lang]) || {};

    // data-i18n -> innerHTML
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const val = dict[key];
      if (val != null) el.innerHTML = val;
    });

    // data-i18n-placeholder -> placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const val = dict[key];
      if (val != null) el.setAttribute("placeholder", val);
    });

    // data-i18n-title -> title
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key) return;
      const val = dict[key];
      if (val != null) el.setAttribute("title", val);
    });

    // optional: active state for language buttons
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      const bLang = normalizeLang(btn.getAttribute("data-lang-btn"));
      if (!bLang) return;
      btn.setAttribute("aria-current", bLang === lang ? "true" : "false");
    });

    window.dispatchEvent(new CustomEvent("mmd:i18n:applied", { detail: { lang } }));
  }

  function setLang(lang) {
    const next = normalizeLang(lang) || DEFAULT_LANG;
    localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.setAttribute("lang", next);
    applyI18n(next);
  }

  function t(key, lang) {
    const L = lang || getLang();
    const dict = (window.I18N_DICT && window.I18N_DICT[L]) || {};
    return dict[key];
  }

  // Expose API
  window.MMD = window.MMD || {};
  window.MMD.i18n = window.MMD.i18n || {};
  window.MMD.i18n.getLang = getLang;
  window.MMD.i18n.setLang = setLang;
  window.MMD.i18n.apply = applyI18n;
  window.MMD.i18n.t = t;

  // Auto-apply
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyI18n());
  } else {
    applyI18n();
  }

  // Optional: click-to-set language
  document.addEventListener("click", (e) => {
    const el = e.target && e.target.closest && e.target.closest("[data-set-lang]");
    if (!el) return;
    const lang = el.getAttribute("data-set-lang");
    if (!lang) return;
    e.preventDefault();
    setLang(lang);
  });
})();
