/* =========================================
   i18n Core Engine – MMD Privé (v1.5 LOCK)
   - no-blank overwrite (uses data-fallback / keep existing)
   - reads/writes BOTH mmd_lang + lang
   - exposes MMD.i18n.t / MMD.i18n.setLang
========================================= */

(function () {
  "use strict";

  const DEFAULT_LANG = "en";
  const FALLBACK_LANG = "en";
  const STORAGE_KEYS = ["mmd_lang", "lang"]; // read both; write both

  const I18N_DEBUG = new URLSearchParams(window.location.search).has("i18n_debug");

  function debugWrap(key) {
    return `<span style="
      color:#ff6b6b;background:rgba(255,107,107,.12);
      padding:2px 4px;border-radius:4px;font-size:12px;font-family:monospace
    ">${key}</span>`;
  }

  function normalizeLang(l) {
    const s = String(l || "").toLowerCase();
    if (s.startsWith("th")) return "th";
    if (s === "zh-hant" || s.startsWith("zh-tw") || s.startsWith("zh-hk")) return "zh-Hant";
    if (s.startsWith("zh")) return "zh";
    if (s.startsWith("ja") || s.startsWith("jp")) return "jp";
    return "en";
  }

  function safeGetStoredLang() {
    try {
      for (const k of STORAGE_KEYS) {
        const v = localStorage.getItem(k);
        if (v) return v;
      }
    } catch (e) {}
    return "";
  }

  function safeSetStoredLang(lang) {
    try {
      for (const k of STORAGE_KEYS) localStorage.setItem(k, lang);
    } catch (e) {}
  }

  function detectLang() {
    const stored = safeGetStoredLang();
    if (stored) return normalizeLang(stored);

    const nav = navigator.language || DEFAULT_LANG;
    return normalizeLang(nav);
  }

  // dict supports:
  // A) dict[lang][key]
  // B) dict[key][lang]  (optional compatibility)
  function getFromDict(dict, lang, key) {
    if (!dict || !key) return "";

    // A
    if (dict[lang] && typeof dict[lang] === "object" && typeof dict[lang][key] === "string") {
      return dict[lang][key];
    }
    // B
    if (dict[key] && typeof dict[key] === "object" && typeof dict[key][lang] === "string") {
      return dict[key][lang];
    }
    return "";
  }

  function getValue(lang, key, isMobile, role) {
    const dict = window.I18N_DICT;
    if (!dict) return "";

    // role-specific
    const roleKey = role ? `${key}.${role}` : "";
    if (roleKey) {
      const v1 = getFromDict(dict, lang, roleKey);
      if (v1) return v1;
    }

    // mobile short
    if (isMobile) {
      const vm = getFromDict(dict, lang, `${key}.m`);
      if (vm) return vm;
    }

    // normal
    const v = getFromDict(dict, lang, key);
    if (v) return v;

    // fallback lang (role then normal)
    if (roleKey) {
      const f1 = getFromDict(dict, FALLBACK_LANG, roleKey);
      if (f1) return f1;
    }
    const f = getFromDict(dict, FALLBACK_LANG, key);
    if (f) return f;

    return I18N_DEBUG ? debugWrap(key) : "";
  }

  function applyLang(lang, scope) {
    const L = normalizeLang(lang);
    const root = scope && scope.querySelectorAll ? scope : document;

    const role = (document.body && document.body.dataset && document.body.dataset.userRole) || "guest";

    root.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const isMobile = el.getAttribute("data-i18n-mobile") === "true";

      const current = (el.innerHTML || "").trim();
      const fallbackAttr = el.getAttribute("data-fallback");
      const fallback = (fallbackAttr != null && String(fallbackAttr).trim() !== "")
        ? fallbackAttr
        : current;

      const value = getValue(L, key, isMobile, role);

      // IMPORTANT: never blank overwrite
      if (value && String(value).trim() !== "") {
        el.innerHTML = value;
      } else if (fallback && String(fallback).trim() !== "") {
        el.innerHTML = fallback;
      } // else: keep whatever is there (do nothing)
    });

    safeSetStoredLang(L);

    // broadcast for other widgets if needed
    try {
      window.dispatchEvent(new CustomEvent("mmd:lang", { detail: { lang: L } }));
    } catch (e) {}

    return L;
  }

  function t(key, lang) {
    const L = normalizeLang(lang || detectLang());
    const role = (document.body && document.body.dataset && document.body.dataset.userRole) || "guest";
    return getValue(L, key, false, role);
  }

  // expose
  window.MMD = window.MMD || {};
  window.MMD.i18n = window.MMD.i18n || {};
  window.MMD.i18n.t = t;
  window.MMD.i18n.setLang = applyLang;
  window.MMD.i18n.getLang = () => normalizeLang(safeGetStoredLang() || detectLang());

  document.addEventListener("DOMContentLoaded", () => {
    applyLang(detectLang());
  });
})();
