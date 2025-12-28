/* MMD Privé - Local i18n (Dict + Core)
   Version: 2025.12.29
*/

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
    "comparison.val.suitable.premium": "ใช้งานครบสิทธิ์ระดับพรีเมียม",
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
    "comparison.note.vip": "ผู้ที่มียอดใช้จ่ายภายใน 365 วันบิลรวมเกิน 120,000 บาท จะได้รับสิทธิ์เข้ากลุ่ม Telegram: MMD VIP Lounge ทันที",
    "comparison.note.expiry": "เมื่อสมาชิกหมดอายุ จะถูกถอดออกจาก Google Drive ทันที และคงสิทธิ์ได้เฉพาะใน Telegram Standard เท่านั้น"
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

    "comparison.note.vip": "Members with total spending over THB 120,000 within 365 days will gain instant access to Telegram: MMD VIP Lounge.",
    "comparison.note.expiry": "Upon expiry, Google Drive access will be revoked immediately, and only Telegram Standard access will remain."
  },

  zh: {
    "comparison.pkg.guest": "7天体验通行证",
    "comparison.pkg.standard": "标准套餐",
    "comparison.pkg.premium": "尊享套餐",
    "comparison.pkg.black": "黑卡",

    "comparison.row.suitable": "适合对象",
    "comparison.row.duration": "使用期限",
    "comparison.row.services": "可用服务",
    "comparison.row.public": "公共模特",
    "comparison.row.private_std": "私有标准模特",
    "comparison.row.private_pre": "私有高级模特",
    "comparison.row.exclusive": "专属模特",
    "comparison.row.drive": "Google Drive 权限",
    "comparison.row.telegram": "Telegram 群组",
    "comparison.row.trial": "Premium 试用",

    "comparison.val.suitable.guest": "短期体验",
    "comparison.val.duration.guest": "7天",
    "comparison.val.services.guest": "Travel / Extreme（仅限公共）",
    "comparison.val.public.guest": "包含",
    "comparison.val.private_std.guest": "不包含",
    "comparison.val.private_pre.guest": "不包含",
    "comparison.val.exclusive.guest": "不包含",
    "comparison.val.drive.guest": "不包含",
    "comparison.val.telegram.guest": "不包含",
    "comparison.val.trial.guest": "包含（7天）",

    "comparison.val.suitable.standard": "全年标准使用",
    "comparison.val.duration.standard": "365天",
    "comparison.val.services.standard": "公共 + 私有（标准）",
    "comparison.val.public.standard": "包含",
    "comparison.val.private_std.standard": "包含",
    "comparison.val.private_pre.standard": "不包含",
    "comparison.val.exclusive.standard": "不包含",
    "comparison.val.drive.standard": "Standard",
    "comparison.val.telegram.standard": "Standard 群",
    "comparison.val.trial.standard": "不包含",

    "comparison.val.suitable.premium": "完整尊享体验",
    "comparison.val.duration.premium": "365天",
    "comparison.val.services.premium": "标准全部 + 私有（高级）",
    "comparison.val.public.premium": "包含",
    "comparison.val.private_std.premium": "包含",
    "comparison.val.private_pre.premium": "包含",
    "comparison.val.exclusive.premium": "按使用次数解锁",
    "comparison.val.drive.premium": "Standard + Premium",
    "comparison.val.telegram.premium": "Standard + Premium 群",
    "comparison.val.trial.premium": "不包含",

    "comparison.val.suitable.black": "最高级长期权限",
    "comparison.val.duration.black": "5年",
    "comparison.val.services.black": "全部权限 + 专属",
    "comparison.val.public.black": "包含",
    "comparison.val.private_std.black": "包含",
    "comparison.val.private_pre.black": "包含",
    "comparison.val.exclusive.black": "全部解锁",
    "comparison.val.drive.black": "全部权限",
    "comparison.val.telegram.black": "全部权限",
    "comparison.val.trial.black": "不包含",

    "comparison.premium.rule.title": "Premium 专属规则",
    "comparison.premium.rule.r2": "使用2次以上：解锁精选专属模特",
    "comparison.premium.rule.r3": "使用3次以上：访问更高级的秘密专属模特",
    "comparison.premium.rule.note": "权限为递进式，需符合系统条件",

    "comparison.note.vip": "365天内累计消费超过120,000泰铢的会员，可立即加入 Telegram：MMD VIP Lounge。",
    "comparison.note.expiry": "会员到期后将立即移除 Google Drive 权限，仅保留 Telegram Standard 权限。"
  },

  ja: {
    "comparison.pkg.guest": "7日ゲストパス",
    "comparison.pkg.standard": "スタンダードパッケージ",
    "comparison.pkg.premium": "プレミアムパッケージ",
    "comparison.pkg.black": "ブラックカード",

    "comparison.row.suitable": "おすすめ",
    "comparison.row.duration": "利用期間",
    "comparison.row.services": "利用可能サービス",
    "comparison.row.public": "パブリックモデル",
    "comparison.row.private_std": "プライベート（標準）",
    "comparison.row.private_pre": "プライベート（プレミアム）",
    "comparison.row.exclusive": "エクスクルーシブモデル",
    "comparison.row.drive": "Google Drive アクセス",
    "comparison.row.telegram": "Telegram グループ",
    "comparison.row.trial": "Premium 体験",

    "comparison.val.suitable.guest": "短期体験",
    "comparison.val.duration.guest": "7日",
    "comparison.val.services.guest": "Travel / Extreme（パブリックのみ）",
    "comparison.val.public.guest": "含まれる",
    "comparison.val.private_std.guest": "含まれない",
    "comparison.val.private_pre.guest": "含まれない",
    "comparison.val.exclusive.guest": "含まれない",
    "comparison.val.drive.guest": "含まれない",
    "comparison.val.telegram.guest": "含まれない",
    "comparison.val.trial.guest": "含まれる（7日）",

    "comparison.val.suitable.standard": "年間標準利用",
    "comparison.val.duration.standard": "365日",
    "comparison.val.services.standard": "パブリック + プライベート（標準）",
    "comparison.val.public.standard": "含まれる",
    "comparison.val.private_std.standard": "含まれる",
    "comparison.val.private_pre.standard": "含まれない",
    "comparison.val.exclusive.standard": "含まれない",
    "comparison.val.drive.standard": "Standard",
    "comparison.val.telegram.standard": "Standard グループ",
    "comparison.val.trial.standard": "含まれない",

    "comparison.val.suitable.premium": "フルプレミアム体験",
    "comparison.val.duration.premium": "365日",
    "comparison.val.services.premium": "Standard 全て + プライベート（Premium）",
    "comparison.val.public.premium": "含まれる",
    "comparison.val.private_std.premium": "含まれる",
    "comparison.val.private_pre.premium": "含まれる",
    "comparison.val.exclusive.premium": "段階的に解放",
    "comparison.val.drive.premium": "Standard + Premium",
    "comparison.val.telegram.premium": "Standard + Premium グループ",
    "comparison.val.trial.premium": "含まれない",

    "comparison.val.suitable.black": "最上位の長期アクセス",
    "comparison.val.duration.black": "5年",
    "comparison.val.services.black": "全アクセス + 専属",
    "comparison.val.public.black": "含まれる",
    "comparison.val.private_std.black": "含まれる",
    "comparison.val.private_pre.black": "含まれる",
    "comparison.val.exclusive.black": "全て即時解放",
    "comparison.val.drive.black": "全アクセス",
    "comparison.val.telegram.black": "全アクセス",
    "comparison.val.trial.black": "含まれない",

    "comparison.premium.rule.title": "Premium 専属ルール",
    "comparison.premium.rule.r2": "2回以上利用：厳選エクスクルーシブモデルを解放",
    "comparison.premium.rule.r3": "3回以上利用：シークレット専属モデルにアクセス可能",
    "comparison.premium.rule.note": "権限は段階的に付与され、条件に基づきます",

    "comparison.note.vip": "365日以内の累計利用額が120,000バーツを超えると、Telegram：MMD VIP Lounge へ即時参加できます。",
    "comparison.note.expiry": "有効期限終了後、Google Drive アクセスは即時停止され、Telegram Standard のみが維持されます。"
  }

});
</script>

<script>
/* =========================================================
   2) CORE i18n ENGINE
   - Applies translations to:
     [data-i18n]              -> innerHTML
     [data-i18n-placeholder]  -> placeholder
     [data-i18n-title]        -> title
   - Language resolution order:
     ?lang=xx -> localStorage -> <html lang=""> -> default
========================================================= */
(function () {
  "use strict";

  const STORAGE_KEY = "mmd_lang";
  const DEFAULT_LANG = "th";
  const SUPPORTED = ["th","en","zh","ja"];

  function normalizeLang(raw) {
    if (!raw) return null;
    const s = String(raw).toLowerCase();
    // map common variants
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

  function applyNodeText(el, value) {
    // allow explicit HTML in dict (used for line breaks / emphasis in table)
    el.innerHTML = value;
  }

  function applyI18n(forcedLang) {
    const lang = forcedLang || getLang();
    const dict = (window.I18N_DICT && window.I18N_DICT[lang]) || {};

    // data-i18n -> innerHTML
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      if (!key) return;
      const val = dict[key];
      if (val != null) applyNodeText(el, val);
    });

    // placeholder
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      const key = el.getAttribute("data-i18n-placeholder");
      if (!key) return;
      const val = dict[key];
      if (val != null) el.setAttribute("placeholder", val);
    });

    // title
    document.querySelectorAll("[data-i18n-title]").forEach((el) => {
      const key = el.getAttribute("data-i18n-title");
      if (!key) return;
      const val = dict[key];
      if (val != null) el.setAttribute("title", val);
    });

    // optional: mark active language buttons
    document.querySelectorAll("[data-lang-btn]").forEach((btn) => {
      const bLang = normalizeLang(btn.getAttribute("data-lang-btn"));
      if (!bLang) return;
      btn.setAttribute("aria-current", bLang === lang ? "true" : "false");
    });

    // dispatch event for other scripts (optional hook)
    window.dispatchEvent(new CustomEvent("mmd:i18n:applied", { detail: { lang } }));
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

  // Optional: auto-wire click handlers for elements with [data-set-lang]
  document.addEventListener("click", (e) => {
    const el = e.target && e.target.closest && e.target.closest("[data-set-lang]");
    if (!el) return;
    const lang = el.getAttribute("data-set-lang");
    if (!lang) return;
    e.preventDefault();
    setLang(lang);
  });
})();
</script>

<!-- =========================
 HOW TO USE (examples)
 1) Text:
   <div data-i18n="comparison.note.vip"></div>

 2) Placeholder:
   <input data-i18n-placeholder="ui.search.placeholder" />

 3) Title tooltip:
   <span data-i18n-title="comparison.premium.rule.note">i</span>

 4) Language switch:
   <a href="#" data-set-lang="th" data-lang-btn="th">TH</a>
   <a href="#" data-set-lang="en" data-lang-btn="en">EN</a>
   <a href="#" data-set-lang="zh" data-lang-btn="zh">中文</a>
   <a href="#" data-set-lang="ja" data-lang-btn="ja">日本語</a>

 Quick test in console:
   MMD.i18n.setLang('en')
========================= -->
