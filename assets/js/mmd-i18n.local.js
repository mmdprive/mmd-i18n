/* =========================================
   MMD Privé Local i18n — Dict + Core (v1.6 LOCK)
   - no-blank overwrite (uses data-fallback / keep existing)
   - reads/writes BOTH: mmd_lang + lang
   - supports role suffix: key.{role}
   - supports mobile suffix: key.m (when data-i18n-mobile="true")
   - dict supports:
       A) I18N_DICT[lang][key]
       B) I18N_DICT[key][lang] (compat)
   - bindings:
       [data-i18n="key"]                -> innerHTML
       [data-i18n-text="key"]           -> textContent
       [data-i18n-html="key"]           -> innerHTML
       [data-i18n-placeholder="key"]    -> placeholder
       [data-i18n-title="key"]          -> title
       [data-i18n-aria-label="key"]     -> aria-label
       [data-i18n-value="key"]          -> value
       [data-i18n-attr="attr:key,..."]  -> attribute
========================================= */

/* =========================
   DICT (ของคุณ) — สามารถขยายต่อได้
========================= */
window.I18N_DICT = window.I18N_DICT || {};
Object.assign(window.I18N_DICT, {
  th: {
    /* ===== Package Names ===== */
    "comparison.pkg.guest": "7 Days Guest Pass",
    "comparison.pkg.standard": "Standard Pkg",
    "comparison.pkg.premium": "Premium Pkg",
    "comparison.pkg.black": "Black Card",

    /* ===== Row Labels ===== */
    "comparison.row.suitable": "เหมาะสำหรับ",
    "comparison.row.duration": "ระยะเวลาใช้งาน",
    "comparison.row.services": "ประเภทงานที่ใช้ได้",
    "comparison.row.public": "Public Models",
    "comparison.row.private_std": "Private Standard Models",
    "comparison.row.private_pre": "Private Premium Models",
    "comparison.row.exclusive": "Exclusive Models",
    "comparison.row.drive": "Google Drive Access",
    "comparison.row.telegram": "Telegram Group",
    "comparison.row.trial": "Premium Trial",

    /* ===== Values: Guest ===== */
    "comparison.val.suitable.guest": "ทดลอง/ใช้งานสั้น",
    "comparison.val.duration.guest": "7 วัน",
    "comparison.val.services.guest": "Travel / Extreme (Public เท่านั้น)",
    "comparison.val.public.guest": "รวม",
    "comparison.val.private_std.guest": "ไม่รวม",
    "comparison.val.private_pre.guest": "ไม่รวม",
    "comparison.val.exclusive.guest": "ไม่รวม",
    "comparison.val.drive.guest": "ไม่รวม",
    "comparison.val.telegram.guest": "ไม่รวม",
    "comparison.val.trial.guest": "รวม (7 วัน)",

    /* ===== Values: Standard ===== */
    "comparison.val.suitable.standard": "ใช้งานมาตรฐานตลอดปี",
    "comparison.val.duration.standard": "365 วัน",
    "comparison.val.services.standard": "Public + Private (Standard)",
    "comparison.val.public.standard": "รวม",
    "comparison.val.private_std.standard": "รวม",
    "comparison.val.private_pre.standard": "ไม่รวม",
    "comparison.val.exclusive.standard": "ไม่รวม",
    "comparison.val.drive.standard": "Standard",
    "comparison.val.telegram.standard": "Standard Group",
    "comparison.val.trial.standard": "ไม่รวม",

    /* ===== Values: Premium ===== */
    "comparison.val.suitable.premium": "ใช้งานครบสิทธิ์ระดับพรีเมี่ยม",
    "comparison.val.duration.premium": "365 วัน",
    "comparison.val.services.premium": "All Standard + Private (Premium)",
    "comparison.val.public.premium": "รวม",
    "comparison.val.private_std.premium": "รวม",
    "comparison.val.private_pre.premium": "รวม",
    "comparison.val.exclusive.premium": "ตามเงื่อนไขการใช้งาน",
    "comparison.val.drive.premium": "Standard + Premium",
    "comparison.val.telegram.premium": "Standard + Premium Group",
    "comparison.val.trial.premium": "ไม่รวม",

    /* ===== Values: Black Card ===== */
    "comparison.val.suitable.black": "สิทธิ์สูงสุดระยะยาว",
    "comparison.val.duration.black": "5 ปี",
    "comparison.val.services.black": "All Access + Exclusive",
    "comparison.val.public.black": "รวม",
    "comparison.val.private_std.black": "รวม",
    "comparison.val.private_pre.black": "รวม",
    "comparison.val.exclusive.black": "รวมทั้งหมดทันที",
    "comparison.val.drive.black": "All Access",
    "comparison.val.telegram.black": "All Access",
    "comparison.val.trial.black": "ไม่รวม",

    /* ===== Premium Progressive Rule ===== */
    "comparison.premium.rule.title": "กติกา Exclusive สำหรับ Premium",
    "comparison.premium.rule.r2": "ใช้บริการตั้งแต่ 2 ครั้งขึ้นไป: ปลดล็อก Exclusive Models ชุดคัดพิเศษ",
    "comparison.premium.rule.r3": "ใช้บริการตั้งแต่ 3 ครั้งขึ้นไป: เข้าถึง Secret Exclusive Models",
    "comparison.premium.rule.note": "สิทธิ์เป็นแบบไล่ระดับ และขึ้นกับเงื่อนไขของระบบ",

    /* ===== Notes ===== */
    "comparison.note.vip":
      "ผู้ที่มียอดใช้จ่ายภายใน 365 วันบิลรวมเกิน 120,000 บาท จะได้รับสิทธิ์เข้ากลุ่ม Telegram: MMD VIP Lounge ทันที",
    "comparison.note.expiry":
      "เมื่อสมาชิกหมดอายุ จะถูกถอดออกจาก Google Drive ทันที และคงสิทธิ์ได้เฉพาะใน Telegram Standard เท่านั้น"
  },

  en: {
    "comparison.pkg.guest": "7 Days Guest Pass",
    "comparison.pkg.standard": "Standard Package",
    "comparison.pkg.premium": "Premium Package",
    "comparison.pkg.black": "Black Card",

    "comparison.row.suitable": "Best For",
    "comparison.row.duration": "Duration",
    "comparison.row.services": "Service Scope",
    "comparison.row.public": "Public Models",
    "comparison.row.private_std": "Private Standard Models",
    "comparison.row.private_pre": "Private Premium Models",
    "comparison.row.exclusive": "Exclusive Models",
    "comparison.row.drive": "Google Drive Access",
    "comparison.row.telegram": "Telegram Group",
    "comparison.row.trial": "Premium Trial",

    "comparison.val.suitable.guest": "Short-term trial",
    "comparison.val.duration.guest": "7 Days",
    "comparison.val.services.guest": "Travel / Extreme (Public only)",
    "comparison.val.public.guest": "Included",
    "comparison.val.private_std.guest": "Not included",
    "comparison.val.private_pre.guest": "Not included",
    "comparison.val.exclusive.guest": "Not included",
    "comparison.val.drive.guest": "Not included",
    "comparison.val.telegram.guest": "Not included",
    "comparison.val.trial.guest": "Included (7 days)",

    "comparison.val.suitable.standard": "Year-round standard use",
    "comparison.val.duration.standard": "365 Days",
    "comparison.val.services.standard": "Public + Private (Standard)",
    "comparison.val.public.standard": "Included",
    "comparison.val.private_std.standard": "Included",
    "comparison.val.private_pre.standard": "Not included",
    "comparison.val.exclusive.standard": "Not included",
    "comparison.val.drive.standard": "Standard",
    "comparison.val.telegram.standard": "Standard Group",
    "comparison.val.trial.standard": "Not included",

    "comparison.val.suitable.premium": "Full premium experience",
    "comparison.val.duration.premium": "365 Days",
    "comparison.val.services.premium": "All Standard + Private (Premium)",
    "comparison.val.public.premium": "Included",
    "comparison.val.private_std.premium": "Included",
    "comparison.val.private_pre.premium": "Included",
    "comparison.val.exclusive.premium": "Progressive access",
    "comparison.val.drive.premium": "Standard + Premium",
    "comparison.val.telegram.premium": "Standard + Premium Group",
    "comparison.val.trial.premium": "Not included",

    "comparison.val.suitable.black": "Ultimate long-term access",
    "comparison.val.duration.black": "5 Years",
    "comparison.val.services.black": "All Access + Exclusive",
    "comparison.val.public.black": "Included",
    "comparison.val.private_std.black": "Included",
    "comparison.val.private_pre.black": "Included",
    "comparison.val.exclusive.black": "All unlocked",
    "comparison.val.drive.black": "All Access",
    "comparison.val.telegram.black": "All Access",
    "comparison.val.trial.black": "Not included",

    "comparison.premium.rule.title": "Premium Exclusive Rules",
    "comparison.premium.rule.r2": "2+ sessions: Unlock curated Exclusive Models",
    "comparison.premium.rule.r3": "3+ sessions: Access Secret Exclusive Models",
    "comparison.premium.rule.note": "Access is progressive and subject to eligibility",

    "comparison.note.vip":
      "Members with total spending over THB 120,000 within 365 days will gain instant access to Telegram: MMD VIP Lounge.",
    "comparison.note.expiry":
      "Upon expiry, Google Drive access will be revoked immediately, and only Telegram Standard access will remain."
  },

  zh: { /* ... ตามของคุณ ... */ },
  ja: { /* ... ตามของคุณ ... */ }
});

/* =========================
   CORE ENGINE (LOCK)
========================= */
(function () {
  "use strict";

  // Guard กันรันซ้ำ (สำคัญกับ Webflow)
  if (window.__MMD_I18N_LOCAL_BOOTSTRAPPED__) return;
  window.__MMD_I18N_LOCAL_BOOTSTRAPPED__ = true;

  const STORAGE_PRIMARY = "mmd_lang";
  const STORAGE_COMPAT  = "lang";
  const DEFAULT_LANG = "th";

  function isNonBlank(v){
    return v != null && String(v).trim() !== "";
  }

  function normalizeLang(raw) {
    if (!raw) return null;
    const s = String(raw).trim().toLowerCase();

    // zh variants
    if (s.startsWith("zh-hant") || s === "zh-tw" || s === "zh-hk") {
      return window.I18N_DICT && window.I18N_DICT["zh-hant"] ? "zh-hant" : "zh";
    }
    if (s.startsWith("zh")) return "zh";

    // ja/jp
    if (s.startsWith("ja") || s.startsWith("jp")) return "ja";

    // en/th
    if (s.startsWith("en")) return "en";
    if (s.startsWith("th")) return "th";

    // direct
    return s;
  }

  function getUrlLang() {
    const q = new URLSearchParams(window.location.search).get("lang");
    return normalizeLang(q);
  }

  function getHtmlLang() {
    const h = document.documentElement && document.documentElement.getAttribute("lang");
    return normalizeLang(h);
  }

  function getStoredLang() {
    const a = normalizeLang(localStorage.getItem(STORAGE_PRIMARY));
    if (a) return a;
    const b = normalizeLang(localStorage.getItem(STORAGE_COMPAT));
    if (b) return b;
    return null;
  }

  function getLang() {
    return (
      getUrlLang() ||
      getStoredLang() ||
      getHtmlLang() ||
      normalizeLang(navigator.language) ||
      DEFAULT_LANG
    );
  }

  function getRole(){
    // ใช้ body[data-user-role] เป็นหลัก (ตามที่คุณใช้ในหลายหน้า)
    const r =
      (document.body && document.body.getAttribute("data-user-role")) ||
      (document.documentElement && document.documentElement.getAttribute("data-user-role")) ||
      "";
    return String(r || "").trim().toLowerCase();
  }

  function isMobileKeyEnabled(el){
    const v = el.getAttribute("data-i18n-mobile");
    if (v == null) return false;
    const s = String(v).toLowerCase();
    return (s === "" || s === "true" || s === "1" || s === "yes");
  }

  function dictLookup(lang, key){
    const D = window.I18N_DICT || {};

    // A) D[lang][key]
    const byLang = D[lang];
    if (byLang && Object.prototype.hasOwnProperty.call(byLang, key)) return byLang[key];

    // B) D[key][lang] (compat)
    const byKey = D[key];
    if (byKey && Object.prototype.hasOwnProperty.call(byKey, lang)) return byKey[lang];

    return undefined;
  }

  function resolveKeyVariants(baseKey, role, mobileEnabled){
    // order when both apply:
    // 1) key.role.m
    // 2) key.role
    // 3) key.m
    // 4) key
    const out = [];
    if (role && mobileEnabled) out.push(`${baseKey}.${role}.m`);
    if (role) out.push(`${baseKey}.${role}`);
    if (mobileEnabled) out.push(`${baseKey}.m`);
    out.push(baseKey);
    return out;
  }

  function getTextFor(el, baseKey, lang){
    const role = getRole();
    const mobileEnabled = isMobileKeyEnabled(el);

    const keys = resolveKeyVariants(baseKey, role, mobileEnabled);
    for (const k of keys){
      const v = dictLookup(lang, k);
      if (isNonBlank(v)) return { value: v, usedKey: k };
    }

    // fallback (optional)
    const fb = el.getAttribute("data-fallback");
    if (isNonBlank(fb)) return { value: fb, usedKey: "data-fallback" };

    return { value: undefined, usedKey: null };
  }

  function setIfNonBlankText(el, mode, value){
    // no-blank overwrite: ถ้า value blank/undefined -> ไม่แตะ (keep existing)
    if (!isNonBlank(value)) return;

    if (mode === "text") el.textContent = value;
    else if (mode === "html") el.innerHTML = value;
  }

  function setIfNonBlankAttr(el, attr, value){
    if (!isNonBlank(value)) return;
    el.setAttribute(attr, value);
  }

  function setIfNonBlankValue(el, value){
    if (!isNonBlank(value)) return;
    // for inputs/select/textarea
    try { el.value = value; } catch(e){}
    el.setAttribute("value", value);
  }

  function applyI18n(forcedLang){
    const lang = normalizeLang(forcedLang) || getLang();

    // set lang attrs
    document.documentElement.setAttribute("lang", lang);

    // MAIN: data-i18n (legacy -> html)
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const { value } = getTextFor(el, key, lang);
      setIfNonBlankText(el, "html", value);
    });

    // text binding
    document.querySelectorAll("[data-i18n-text]").forEach((el) => {
      const key = el.getAttribute("data-i18n-text");
      if (!key) return;
      const { value } = getTextFor(el, key, lang);
      setIfNonBlankText(el, "text", value);
    });

    // html binding
    document.querySelectorAll("[data-i18n-html]").forEach((el) => {
      const key = el.getAttribute("data-i18n-html");
      if (!key) return;
      const { value } = getTextFor(el, key, lang);
      setIfNonBlankText(el, "html", value);
    });

    // placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const { value } = getTextFor(el, key, lang);
      setIfNonBlankAttr(el, "placeholder", value);
    });

    // title
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key) return;
      const { value } = getTextFor(el, key, lang);
      setIfNonBlankAttr(el, "title", value);
    });

    // aria-label
    document.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
      const key = el.getAttribute("data-i18n-aria-label");
      if (!key) return;
      const { value } = getTextFor(el, key, lang);
      setIfNonBlankAttr(el, "aria-label", value);
    });

    // value
    document.querySelectorAll("[data-i18n-value]").forEach((el) => {
      const key = el.getAttribute("data-i18n-value");
      if (!key) return;
      const { value } = getTextFor(el, key, lang);
      setIfNonBlankValue(el, value);
    });

    // attr mapper: data-i18n-attr="href:key,aria-label:key2"
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      const raw = el.getAttribute("data-i18n-attr");
      if (!raw) return;

      raw.split(",").map(s=>s.trim()).filter(Boolean).forEach(pair=>{
        const idx = pair.indexOf(":");
        if (idx === -1) return;
        const attr = pair.slice(0, idx).trim();
        const key  = pair.slice(idx+1).trim();
        if (!attr || !key) return;

        const { value } = getTextFor(el, key, lang);
        setIfNonBlankAttr(el, attr, value);
      });
    });

    // lang buttons UI
    document.querySelectorAll("[data-set-lang], [data-lang-btn]").forEach((btn) => {
      const bLang = normalizeLang(btn.getAttribute("data-set-lang") || btn.getAttribute("data-lang-btn"));
      if (!bLang) return;
      const active = (bLang === lang);
      btn.classList.toggle("mmd-lang-active", active);
      btn.setAttribute("aria-current", active ? "true" : "false");
    });

    // notify
    window.dispatchEvent(new CustomEvent("mmd:i18n:applied", { detail: { lang } }));
  }

  function setLang(lang){
    const next = normalizeLang(lang) || DEFAULT_LANG;

    // write BOTH keys
    localStorage.setItem(STORAGE_PRIMARY, next);
    localStorage.setItem(STORAGE_COMPAT,  next);

    // set html + apply
    document.documentElement.setAttribute("lang", next);
    applyI18n(next);

    // broadcast for other modules
    window.dispatchEvent(new CustomEvent("mmd:lang", { detail: { lang: next } }));

    return next;
  }

  function t(key, lang){
    const L = normalizeLang(lang) || getLang();
    const v = dictLookup(L, key);
    return v;
  }

  // expose
  window.MMD = window.MMD || {};
  window.MMD.i18n = window.MMD.i18n || {};
  window.MMD.i18n.version = "v1.6-LOCK-local";
  window.MMD.i18n.getLang = getLang;
  window.MMD.i18n.setLang = setLang;
  window.MMD.i18n.apply   = applyI18n;
  window.MMD.i18n.t       = t;

  // init
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => applyI18n(), { once:true });
  } else {
    applyI18n();
  }

  // click handler (language switch)
  document.addEventListener("click", (e) => {
    const el = e.target && e.target.closest && e.target.closest("[data-set-lang], [data-lang-btn]");
    if (!el) return;
    const lang = el.getAttribute("data-set-lang") || el.getAttribute("data-lang-btn");
    if (!lang) return;
    e.preventDefault();
    setLang(lang);
  });

  // optional: react to external broadcast (เช่น global bootstrap)
  window.addEventListener("mmd:lang", (e) => {
    const L = e && e.detail && e.detail.lang;
    if (!L) return;
    applyI18n(L);
  });

})();
