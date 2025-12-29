/* =========================================
   i18n Core Engine – MMD Privé (v1.5 LOCK)
   - Safe: never blanks text when key missing
   - Supports data-fallback + existing text fallback
   - Supports scoped apply (root element)
   - Exposes MMD.i18n: t(), setLang(), getLang()
   - Storage keys: mmd_lang + lang (compat)
========================================= */

(function () {
  "use strict";

  const DEFAULT_LANG = "en";
  const FALLBACK_LANG = "en";
  const STORAGE_KEYS = ["mmd_lang", "lang"]; // read/write both

  const ROLE_LANG_DEFAULT = {
    guest: "en",
    member: "en",
    vip: "en",
    blackcard: "en",
    admin: "en"
  };

  const I18N_DEBUG = new URLSearchParams(window.location.search).has("i18n_debug");

  function debugWrap(key) {
    return `<span style="
      color:#ff6b6b;
      background:rgba(255,107,107,0.12);
      padding:2px 4px;
      border-radius:4px;
      font-size:12px;
      font-family:monospace;
    ">${key}</span>`;
  }

  function getUserRole() {
    return document.body?.dataset?.userRole || "guest";
  }

  function normalizeLang(l) {
    const s = String(l || "").toLowerCase();
    if (s.startsWith("th")) return "th";
    if (s === "zh-hant" || s.startsWith("zh-tw") || s.startsWith("zh-hk")) return "zh-Hant";
    if (s.startsWith("zh")) return "zh";
    if (s.startsWith("ja") || s.startsWith("jp")) return "jp";
    return "en";
  }

  function readStoredLang() {
    try {
      for (const k of STORAGE_KEYS) {
        const v = localStorage.getItem(k);
        if (v) return v;
      }
    } catch (e) {}
    return "";
  }

  function writeStoredLang(lang) {
    try {
      for (const k of STORAGE_KEYS) localStorage.setItem(k, lang);
    } catch (e) {}
  }

  function detectLang() {
    const role = getUserRole();
    const stored = readStoredLang();
    if (stored) return normalizeLang(stored);

    const nav = navigator.language || "";
    if (nav.startsWith("th")) return "th";
    if (nav.startsWith("zh-TW") || nav.startsWith("zh-HK")) return "zh-Hant";
    if (nav.startsWith("zh")) return "zh";

    return normalizeLang(ROLE_LANG_DEFAULT[role] || DEFAULT_LANG);
  }

  // Dict supports:
  // 1) dict[lang][key]
  // 2) dict[key][lang]
  function getFromDict(dict, lang, key) {
    if (!dict) return null;

    const a = dict[lang];
    if (a && typeof a === "object" && typeof a[key] === "string") return a[key];

    const b = dict[key];
    if (b && typeof b === "object" && typeof b[lang] === "string") return b[lang];

    return null;
  }

  function t(key, lang, opts) {
    const dict = window.I18N_DICT;
    const L = normalizeLang(lang || detectLang());
    const role = getUserRole();
    const isMobile = !!(opts && opts.isMobile);

    // role-specific
    let v = getFromDict(dict, L, `${key}.${role}`);
    if (typeof v === "string" && v.trim()) return v;

    // mobile short
    if (isMobile) {
      v = getFromDict(dict, L, `${key}.m`);
      if (typeof v === "string" && v.trim()) return v;
    }

    // normal
    v = getFromDict(dict, L, key);
    if (typeof v === "string" && v.trim()) return v;

    // fallback lang (role)
    v = getFromDict(dict, FALLBACK_LANG, `${key}.${role}`);
    if (typeof v === "string" && v.trim()) return v;

    // fallback lang (normal)
    v = getFromDict(dict, FALLBACK_LANG, key);
    if (typeof v === "string" && v.trim()) return v;

    return I18N_DEBUG ? debugWrap(key) : null;
  }

  function applyLang(lang, rootEl) {
    const L = normalizeLang(lang || detectLang());
    const root = rootEl || document;

    const nodes = root.querySelectorAll ? root.querySelectorAll("[data-i18n]") : [];
    nodes.forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const isMobile = el.getAttribute("data-i18n-mobile") === "true";

      const fallbackAttr = el.getAttribute("data-fallback");
      const fallbackText = (fallbackAttr != null) ? fallbackAttr : el.textContent;

      const value = t(key, L, { isMobile });

      // SAFE RULE: never blank text
      if (typeof value === "string" && value.trim()) el.innerHTML = value;
      else if (fallbackText != null && String(fallbackText).trim()) el.textContent = fallbackText;
      // else: keep as-is
    });

    writeStoredLang(L);
    return L;
  }

  function setLang(lang, rootEl) {
    const L = applyLang(lang, rootEl);
    window.dispatchEvent(new CustomEvent("mmd:lang", { detail: { lang: L } }));
    return L;
  }

  function getLang() {
    return normalizeLang(readStoredLang() || detectLang());
  }

  window.MMD = window.MMD || {};
  window.MMD.i18n = window.MMD.i18n || {};
  window.MMD.i18n.t = t;
  window.MMD.i18n.setLang = setLang;
  window.MMD.i18n.getLang = getLang;

  // Init (full page)
  document.addEventListener("DOMContentLoaded", () => {
    applyLang(getLang(), document);
  });

})();
