/* =========================================
   i18n Core Engine – MMD Privé (v1.6 LOCK • FULL)
   - no-blank overwrite (uses data-fallback / keep existing)
   - reads/writes BOTH mmd_lang + lang
   - supports role suffix: key.{role}
   - supports mobile suffix: key.m (when data-i18n-mobile="true")
   - dict supports:
       A) dict[lang][key]
       B) dict[key][lang]  (optional compatibility)
   - bindings (NO-BLANK overwrite rules apply to ALL):
       [data-i18n="key"]                      -> innerHTML
       [data-i18n-text="key"]                 -> textContent
       [data-i18n-html="key"]                 -> innerHTML
       [data-i18n-placeholder="key"]          -> placeholder
       [data-i18n-title="key"]                -> title
       [data-i18n-aria-label="key"]           -> aria-label
       [data-i18n-value="key"]                -> value
       [data-i18n-attr="attr:key;attr2:key2"] -> any attributes
   - language blocks:
       [data-lang="th|en|zh|zh-Hant|jp"] -> show current, else show fallback, else hide
   - toggles:
       click [data-set-lang="th|en|zh|jp"] -> setLang()
       adds .is-active-lang + aria-pressed on toggles
   - exposes:
       MMD.i18n.t(key, lang?)
       MMD.i18n.setLang(lang, scope?)
       MMD.i18n.getLang()
       MMD.i18n.lang (current)
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

    // keep compatibility if you already use "zh-Hant" keys in dict
    if (s === "zh-hant" || s.startsWith("zh-tw") || s.startsWith("zh-hk")) return "zh-Hant";
    if (s.startsWith("zh")) return "zh";

    // project uses "jp"
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

  function getRole() {
    return (document.body && document.body.dataset && document.body.dataset.userRole) || "guest";
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

    // role-specific first
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

  function nonEmpty(v) {
    return v != null && String(v).trim() !== "";
  }

  function getDefaultFallbackForElement(el, mode) {
    // mode: "html" | "text" | "attr"
    const attr = el.getAttribute("data-fallback");

    // If data-fallback is explicitly set (even "0" or whitespace), respect if non-empty after trim.
    if (attr != null && String(attr).trim() !== "") return attr;

    // Otherwise, use current content/value as fallback snapshot
    if (mode === "text") return (el.textContent || "").trim();
    if (mode === "attr") return ""; // attr fallback handled per-attr
    return (el.innerHTML || "").trim();
  }

  function setIfNonBlank(el, mode, value, fallback, attrName) {
    // no-blank overwrite: only set if translation non-empty,
    // else if fallback non-empty set fallback,
    // else do nothing.

    if (mode === "text") {
      if (nonEmpty(value)) el.textContent = value;
      else if (nonEmpty(fallback)) el.textContent = fallback;
      return;
    }

    if (mode === "html") {
      if (nonEmpty(value)) el.innerHTML = value;
      else if (nonEmpty(fallback)) el.innerHTML = fallback;
      return;
    }

    if (mode === "value") {
      const current = (el.value != null ? String(el.value) : "").trim();
      const fb = nonEmpty(fallback) ? fallback : current;
      if (nonEmpty(value)) el.value = value;
      else if (nonEmpty(fb)) el.value = fb;
      return;
    }

    if (mode === "attr") {
      const currentAttr = (el.getAttribute(attrName) || "").trim();
      const fb = nonEmpty(fallback) ? fallback : currentAttr;
      if (nonEmpty(value)) el.setAttribute(attrName, value);
      else if (nonEmpty(fb)) el.setAttribute(attrName, fb);
      return;
    }
  }

  function applyLang(lang, scope) {
    const L = normalizeLang(lang);
    const root = scope && scope.querySelectorAll ? scope : document;
    const role = getRole();

    // Sync <html lang="">
    try {
      // keep "ja" in html for platform compatibility
      document.documentElement.setAttribute("lang", L === "jp" ? "ja" : L);
    } catch (e) {}

    // 0) data-lang blocks (show only current; if current missing, show fallback language blocks)
    // Rule:
    // - if element data-lang == current => show
    // - else if element data-lang == FALLBACK_LANG and current != FALLBACK_LANG => show only if current pack missing
    // - else hide
    try {
      const dict = window.I18N_DICT || {};
      const hasCurrentPack = !!(dict[L] && typeof dict[L] === "object");
      root.querySelectorAll("[data-lang]").forEach((el) => {
        const elLang = normalizeLang(el.getAttribute("data-lang"));
        let show = false;

        if (elLang === L) show = true;
        else if (!hasCurrentPack && elLang === FALLBACK_LANG) show = true;
        else show = false;

        el.style.display = show ? "" : "none";
      });
    } catch (e) {}

    // Helper: translate by key with mobile flag
    function tr(key, isMobile) {
      return getValue(L, key, !!isMobile, role);
    }

    // 1) [data-i18n] -> innerHTML (legacy main binding)
    try {
      root.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        if (!key) return;
        const isMobile = el.getAttribute("data-i18n-mobile") === "true";
        const value = tr(key, isMobile);
        const fallback = getDefaultFallbackForElement(el, "html");
        setIfNonBlank(el, "html", value, fallback);
      });
    } catch (e) {}

    // 2) explicit text binding
    try {
      root.querySelectorAll("[data-i18n-text]").forEach((el) => {
        const key = el.getAttribute("data-i18n-text");
        if (!key) return;
        const isMobile = el.getAttribute("data-i18n-mobile") === "true";
        const value = tr(key, isMobile);
        const fallback = getDefaultFallbackForElement(el, "text");
        setIfNonBlank(el, "text", value, fallback);
      });
    } catch (e) {}

    // 3) explicit html binding
    try {
      root.querySelectorAll("[data-i18n-html]").forEach((el) => {
        const key = el.getAttribute("data-i18n-html");
        if (!key) return;
        const isMobile = el.getAttribute("data-i18n-mobile") === "true";
        const value = tr(key, isMobile);
        const fallback = getDefaultFallbackForElement(el, "html");
        setIfNonBlank(el, "html", value, fallback);
      });
    } catch (e) {}

    // 4) placeholder/title/aria-label/value
    const attrMaps = [
      { sel: "[data-i18n-placeholder]", attr: "placeholder", keyAttr: "data-i18n-placeholder" },
      { sel: "[data-i18n-title]", attr: "title", keyAttr: "data-i18n-title" },
      { sel: "[data-i18n-aria-label]", attr: "aria-label", keyAttr: "data-i18n-aria-label" }
    ];

    attrMaps.forEach(({ sel, attr, keyAttr }) => {
      try {
        root.querySelectorAll(sel).forEach((el) => {
          const key = el.getAttribute(keyAttr);
          if (!key) return;
          const isMobile = el.getAttribute("data-i18n-mobile") === "true";
          const value = tr(key, isMobile);

          // fallback for attr:
          // prefer explicit data-fallback, else existing attr
          const fb = (el.getAttribute("data-fallback") || "").trim() || (el.getAttribute(attr) || "").trim();
          setIfNonBlank(el, "attr", value, fb, attr);
        });
      } catch (e) {}
    });

    try {
      root.querySelectorAll("[data-i18n-value]").forEach((el) => {
        const key = el.getAttribute("data-i18n-value");
        if (!key) return;
        const isMobile = el.getAttribute("data-i18n-mobile") === "true";
        const value = tr(key, isMobile);

        // fallback for value:
        // prefer explicit data-fallback, else existing value
        const fb = (el.getAttribute("data-fallback") || "").trim() || (el.value != null ? String(el.value).trim() : "");
        setIfNonBlank(el, "value", value, fb);
      });
    } catch (e) {}

    // 5) generic attribute binding: data-i18n-attr="href:key;aria-label:key2"
    try {
      root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
        const spec = el.getAttribute("data-i18n-attr");
        if (!spec) return;

        const pairs = spec.split(";").map(s => s.trim()).filter(Boolean);

        pairs.forEach((p) => {
          const idx = p.indexOf(":");
          if (idx <= 0) return;

          const attr = p.slice(0, idx).trim();
          const key = p.slice(idx + 1).trim();
          if (!attr || !key) return;

          const isMobile = el.getAttribute("data-i18n-mobile") === "true";
          const value = tr(key, isMobile);

          // fallback per-attr: explicit data-fallback wins; else existing attr
          const fb = (el.getAttribute("data-fallback") || "").trim() || (el.getAttribute(attr) || "").trim();
          setIfNonBlank(el, "attr", value, fb, attr);
        });
      });
    } catch (e) {}

    // 6) Update toggle active state
    try {
      root.querySelectorAll("[data-set-lang]").forEach((el) => {
        const v = normalizeLang(el.getAttribute("data-set-lang"));
        const active = v === L;
        el.classList.toggle("is-active-lang", !!active);
        el.setAttribute("aria-pressed", active ? "true" : "false");
      });
    } catch (e) {}

    // Persist and sync public state
    safeSetStoredLang(L);

    window.MMD = window.MMD || {};
    window.MMD.i18n = window.MMD.i18n || {};
    window.MMD.i18n.lang = L;

    // Broadcast for other widgets if needed
    try {
      window.dispatchEvent(new CustomEvent("mmd:lang", { detail: { lang: L } }));
    } catch (e) {}

    return L;
  }

  function t(key, lang) {
    const L = normalizeLang(lang || safeGetStoredLang() || detectLang());
    const role = getRole();
    return getValue(L, key, false, role);
  }

  // Expose API
  window.MMD = window.MMD || {};
  window.MMD.i18n = window.MMD.i18n || {};
  window.MMD.i18n.t = t;
  window.MMD.i18n.setLang = applyLang;
  window.MMD.i18n.getLang = () => normalizeLang(safeGetStoredLang() || detectLang());
  window.MMD.i18n.lang = window.MMD.i18n.getLang();

  // Toggle click handler
  document.addEventListener("click", function (ev) {
    const btn = ev.target && ev.target.closest ? ev.target.closest("[data-set-lang]") : null;
    if (!btn) return;
    const next = normalizeLang(btn.getAttribute("data-set-lang"));
    if (!next) return;
    ev.preventDefault();
    applyLang(next);
  }, { passive: false });

  // Auto apply on DOM ready
  document.addEventListener("DOMContentLoaded", () => {
    applyLang(window.MMD.i18n.getLang());
  });

})();
