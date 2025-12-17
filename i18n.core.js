/* =========================================
   i18n Core Engine – MMD Privé
   auto-detect + manual toggle
========================================= */

(function () {
  const DEFAULT_LANG = "en";

  function getLang() {
    return (
      localStorage.getItem("lang") ||
      (navigator.language.startsWith("th") && "th") ||
      (navigator.language.startsWith("zh") && "zh") ||
      DEFAULT_LANG
    );
  }

  function setLang(lang) {
    if (!window.I18N_DICT || !I18N_DICT[lang]) return;

    document.querySelectorAll("[data-i18n]").forEach(el => {
      const key = el.dataset.i18n;
      const mobile = el.dataset.i18nMobile === "true";
      const value = mobile
        ? I18N_DICT[lang][`${key}.m`] || I18N_DICT[lang][key]
        : I18N_DICT[lang][key];

      if (value) el.innerHTML = value;
    });

    localStorage.setItem("lang", lang);
  }

  document.addEventListener("click", e => {
    const btn = e.target.closest("[data-lang]");
    if (btn) setLang(btn.dataset.lang);
  });

  document.addEventListener("DOMContentLoaded", () => {
    setLang(getLang());
  });

  window.setLang = setLang;
})();
