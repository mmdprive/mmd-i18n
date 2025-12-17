/* =========================================
   i18n Core Engine – MMD Privé (v1.1)
   - fallback language
   - mobile short copy
   - optional JSON auto-load
========================================= */

(function () {
  const DEFAULT_LANG = "en";
  const FALLBACK_LANG = "en";

  function detectLang() {
    return (
      localStorage.getItem("lang") ||
      (navigator.language.startsWith("th") && "th") ||
      (navigator.language.startsWith("zh") && "zh") ||
      DEFAULT_LANG
    );
  }

  function getValue(lang, key, isMobile) {
    if (!window.I18N_DICT) return null;

    // 1) exact match
    if (isMobile && I18N_DICT[lang]?.[`${key}.m`])
      return I18N_DICT[lang][`${key}.m`];

    if (I18N_DICT[lang]?.[key])
      return I18N_DICT[lang][key];

    // 2) fallback language
    if (isMobile && I18N_DICT[FALLBACK_LANG]?.[`${key}.m`])
      return I18N_DICT[FALLBACK_LANG][`${key}.m`];

    if (I18N_DICT[FALLBACK_LANG]?.[key])
      return I18N_DICT[FALLBACK_LANG][key];

    // 3) key as last resort (debug-safe)
    return key;
  }

  function applyLang(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      const isMobile = el.dataset.i18nMobile === "true";
      const value = getValue(lang, key, isMobile);
      if (value) el.innerHTML = value;
    });
    localStorage.setItem("lang", lang);
  }

  // click toggle
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-lang]");
    if (btn) applyLang(btn.dataset.lang);
  });

  // init
  document.addEventListener("DOMContentLoaded", () => {
    applyLang(detectLang());
  });

  // expose (optional)
  window.setLang = applyLang;
})();
