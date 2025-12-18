/* =========================================
   i18n Core Engine – MMD Privé (v1.4 FINAL)
   - role-based language
   - role-aware copy
   - fallback language
   - mobile short copy
   - debug mode
========================================= */

(function () {
  const DEFAULT_LANG = "en";
  const FALLBACK_LANG = "en";

  /* -----------------------------------------
     Role → Default Language
  ----------------------------------------- */
  const ROLE_LANG_DEFAULT = {
    guest: "en",
    member: "en",
    vip: "en",
    blackcard: "en",
    admin: "en"
  };

  /* -----------------------------------------
     Debug mode (?i18n_debug=1)
  ----------------------------------------- */
  const I18N_DEBUG = new URLSearchParams(window.location.search)
    .has("i18n_debug");

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

  /* -----------------------------------------
     Helpers
  ----------------------------------------- */
  function getUserRole() {
    return document.body.dataset.userRole || "guest";
  }

  function detectLang() {
    const role = getUserRole();

    return (
      localStorage.getItem("lang") ||
      ROLE_LANG_DEFAULT[role] ||
      (navigator.language.startsWith("th") && "th") ||
      (navigator.language.startsWith("zh-TW") && "zh-Hant") ||
      (navigator.language.startsWith("zh") && "zh") ||
      DEFAULT_LANG
    );
  }

  function getValue(lang, key, isMobile) {
    const dict = window.I18N_DICT;
    if (!dict) return "";

    const role = getUserRole();

    // 1) role-specific
    if (dict[lang]?.[`${key}.${role}`])
      return dict[lang][`${key}.${role}`];

    // 2) mobile short
    if (isMobile && dict[lang]?.[`${key}.m`])
      return dict[lang][`${key}.m`];

    // 3) normal
    if (dict[lang]?.[key])
      return dict[lang][key];

    // 4) fallback language (role)
    if (dict[FALLBACK_LANG]?.[`${key}.${role}`])
      return dict[FALLBACK_LANG][`${key}.${role}`];

    // 5) fallback language (normal)
    if (dict[FALLBACK_LANG]?.[key])
      return dict[FALLBACK_LANG][key];

    // 6) debug / silent
    return I18N_DEBUG ? debugWrap(key) : "";
  }

  function applyLang(lang) {
    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      const isMobile = el.dataset.i18nMobile === "true";
      const value = getValue(lang, key, isMobile);
      el.innerHTML = value;
    });

    localStorage.setItem("lang", lang);
  }

  /* -----------------------------------------
     Language toggle
  ----------------------------------------- */
  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-lang]");
    if (btn) applyLang(btn.dataset.lang);
  });

  /* -----------------------------------------
     Init
  ----------------------------------------- */
  document.addEventListener("DOMContentLoaded", () => {
    applyLang(detectLang());
  });

  /* -----------------------------------------
     Expose for Memberstack / manual control
  ----------------------------------------- */
  window.setLang = applyLang;

})();
