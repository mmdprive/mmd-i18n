/* =========================================
   i18n Dictionary – MMD Privé (LATEST • LOCK)
   - Valid JS
   - No duplicate keys per language
   - Keys aligned with benefits-lite embed
========================================= */

window.I18N_DICT = window.I18N_DICT || {};

Object.assign(window.I18N_DICT, {
  /* =======================
     THAI
  ======================= */
  th: Object.assign({}, window.I18N_DICT.th || {}, {
    /* Common */
    "common.close": "Close",

    /* Lang labels */
    "lang.th": "ไทย",
    "lang.en": "EN",
    "lang.zh": "中文",
    "lang.jp": "JP",

    /* =======================
       Comparison (TH)
    ======================= */
    "comparison.pkg.guest": "7 Days Guest Pass",
    "comparison.pkg.standard": "Standard Pkg",
    "comparison.pkg.premium": "Premium Pkg",
    "comparison.pkg.black": "Black Card",

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

    "comparison.premium.rule.title": "กติกา Exclusive สำหรับ Premium",
    "comparison.premium.rule.r2": "ใช้บริการตั้งแต่ 2 ครั้งขึ้นไป: ปลดล็อก Exclusive Models ชุดคัดพิเศษ",
    "comparison.premium.rule.r3": "ใช้บริการตั้งแต่ 3 ครั้งขึ้นไป: เข้าถึง Secret Exclusive Models",
    "comparison.premium.rule.note": "สิทธิ์เป็นแบบไล่ระดับ และขึ้นกับเงื่อนไขของระบบ",

    "comparison.note.vip":
      "ผู้ที่มียอดใช้จ่ายภายใน 365 วันบิลรวมเกิน 120,000 บาท จะได้รับสิทธิ์เข้ากลุ่ม Telegram: MMD VIP Lounge ทันที",
    "comparison.note.expiry":
      "เมื่อสมาชิกหมดอายุ จะถูกถอดออกจาก Google Drive ทันที และคงสิทธิ์ได้เฉพาะใน Telegram Standard เท่านั้น",

    /* =======================
       Benefits Lite (Per Lux • TH)
    ======================= */
    "benefits_lite.title": "Benefits",
    "benefits_lite.hero.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
    "benefits_lite.hero.h": "สิทธิ์สมาชิกโดยสรุป",
    "benefits_lite.hero.p": "ภาพรวมแบบกระชับ เพื่อเลือกแพ็กเกจที่เหมาะกับรูปแบบการใช้งานของคุณ",
    "benefits_lite.hero.cta_primary": "ดูสิทธิ์แบบละเอียด",
    "benefits_lite.hero.cta_secondary": "Black Card",

    "benefits_lite.preview.t": "Preview",
    "benefits_lite.preview.d": "สำรวจระบบและแนวทางการเข้าถึง เพื่อประเมินความเหมาะสมก่อนสมัคร",

    "benefits_lite.guest.t": "7 Days Guest Pass",
    "benefits_lite.guest.d": "ทดลองใช้งาน 7 วัน เหมาะสำหรับช่วงสั้นหรือช่วงเดินทาง",

    "benefits_lite.standard.t": "Standard",
    "benefits_lite.standard.d": "ทางเลือกเริ่มต้นสำหรับสมาชิก: โครงสร้างชัด และใช้งานต่อเนื่อง",

    "benefits_lite.premium.t": "Premium",
    "benefits_lite.premium.d": "ระดับความสำคัญสูงขึ้น พร้อมสิทธิ์ที่ครบกว่า เหมาะกับผู้ใช้งานจริงจัง",

    "benefits_lite.black.t": "Black Card",
    "benefits_lite.black.d": "การเข้าถึงระดับความสัมพันธ์ ทีมจะให้รายละเอียดเมื่อเหมาะสม",

    "benefits_lite.note": "หมายเหตุ: สิทธิ์และเงื่อนไขอาจมีการปรับตามช่วงเวลา ความเหมาะสม และดุลยพินิจของทีม",

    /* Compare table (Benefits Lite) */
    "benefits_lite.compare.title": "ตารางเปรียบเทียบสิทธิ์",
    "benefits_lite.compare.sub": "ดูภาพรวมสิทธิ์แบบรวดเร็ว ก่อนเลือกแพ็กเกจ",
    "benefits_lite.compare.h.feature": "รายการสิทธิ์",
    "benefits_lite.compare.h.preview": "Preview",
    "benefits_lite.compare.h.guest": "7 Days",
    "benefits_lite.compare.h.standard": "Standard",
    "benefits_lite.compare.h.premium": "Premium",
    "benefits_lite.compare.h.black": "Black",
    "benefits_lite.compare.r1": "เข้าชมโครงสร้างระบบ / แนวทาง",
    "benefits_lite.compare.r2": "สิทธิ์เข้าถึงฐานข้อมูลรูป (Google Drive)",
    "benefits_lite.compare.r3": "ลิงก์เข้ากลุ่ม Telegram",
    "benefits_lite.compare.r4": "อัปเดต / คอนเทนต์ใหม่ (ตามรอบ)",
    "benefits_lite.compare.r5": "ลำดับความสำคัญในการดูแล",
    "benefits_lite.compare.r6": "Black Card consideration"
  }),

  /* =======================
     ENGLISH
  ======================= */
  en: Object.assign({}, window.I18N_DICT.en || {}, {
    "common.close": "Close",

    "lang.th": "TH",
    "lang.en": "EN",
    "lang.zh": "中文",
    "lang.jp": "JP",

    "benefits_lite.title": "Benefits",
    "benefits_lite.hero.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
    "benefits_lite.hero.h": "Membership Benefits (Summary)",
    "benefits_lite.hero.p": "A concise overview to help you choose the right package for your real usage.",
    "benefits_lite.hero.cta_primary": "View Full Benefits",
    "benefits_lite.hero.cta_secondary": "Black Card",

    "benefits_lite.preview.t": "Preview",
    "benefits_lite.preview.d": "Explore the system and access approach before joining.",

    "benefits_lite.guest.t": "7 Days Guest Pass",
    "benefits_lite.guest.d": "Short-term access designed for travel or quick usage (7 days).",

    "benefits_lite.standard.t": "Standard",
    "benefits_lite.standard.d": "Entry membership with clear structure and continuity.",

    "benefits_lite.premium.t": "Premium",
    "benefits_lite.premium.d": "Higher priority with fuller access for serious users.",

    "benefits_lite.black.t": "Black Card",
    "benefits_lite.black.d": "Relationship-tier access. Details are shared when appropriate.",

    "benefits_lite.note": "Note: Access and terms may be updated over time.",

    "benefits_lite.compare.title": "Access comparison",
    "benefits_lite.compare.sub": "Quick view before selecting your package",
    "benefits_lite.compare.h.feature": "Feature",
    "benefits_lite.compare.h.preview": "Preview",
    "benefits_lite.compare.h.guest": "7 Days",
    "benefits_lite.compare.h.standard": "Standard",
    "benefits_lite.compare.h.premium": "Premium",
    "benefits_lite.compare.h.black": "Black",
    "benefits_lite.compare.r1": "System overview / approach",
    "benefits_lite.compare.r2": "Image database access (Google Drive)",
    "benefits_lite.compare.r3": "Telegram group invitation link",
    "benefits_lite.compare.r4": "Updates / new content",
    "benefits_lite.compare.r5": "Support priority",
    "benefits_lite.compare.r6": "Black Card consideration"
  }),

  /* =======================
     CHINESE (SIMPLIFIED)
  ======================= */
  zh: Object.assign({}, window.I18N_DICT.zh || {}, {
    "common.close": "关闭",

    "lang.th": "泰",
    "lang.en": "EN",
    "lang.zh": "中文",
    "lang.jp": "JP",

    "benefits_lite.title": "权益",
    "benefits_lite.hero.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
    "benefits_lite.hero.h": "会员权益概览",
    "benefits_lite.hero.p": "以简洁方式说明不同层级权限，帮助你选择更符合实际使用的方案。",
    "benefits_lite.hero.cta_primary": "查看完整权益",
    "benefits_lite.hero.cta_secondary": "黑卡",

    "benefits_lite.preview.t": "预览",
    "benefits_lite.preview.d": "了解系统与访问方式（非会员）。",

    "benefits_lite.guest.t": "7 天体验",
    "benefits_lite.guest.d": "适合短期使用的 7 天限时权限。",

    "benefits_lite.standard.t": "Standard",
    "benefits_lite.standard.d": "基础会员层级：结构清晰，可持续使用。",

    "benefits_lite.premium.t": "Premium",
    "benefits_lite.premium.d": "更高优先级与更完整权限，适合深度用户。",

    "benefits_lite.black.t": "黑卡",
    "benefits_lite.black.d": "基于关系的访问，细节将由团队在合适时提供。",

    "benefits_lite.note": "注：权限与条件可能会随时间更新。"
  }),

  /* =======================
     CHINESE (TRADITIONAL)
  ======================= */
  "zh-Hant": Object.assign({}, window.I18N_DICT["zh-Hant"] || {}, {
    "common.close": "關閉",

    "lang.th": "泰",
    "lang.en": "EN",
    "lang.zh": "中文",
    "lang.jp": "JP",

    "benefits_lite.title": "權益",
    "benefits_lite.hero.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
    "benefits_lite.hero.h": "會員權益概覽",
    "benefits_lite.hero.p": "以精簡方式說明不同層級權限，協助你選擇更符合實際使用的方案。",
    "benefits_lite.hero.cta_primary": "查看完整權益",
    "benefits_lite.hero.cta_secondary": "黑卡",

    "benefits_lite.preview.t": "預覽",
    "benefits_lite.preview.d": "了解系統與存取方式（非會員）。",

    "benefits_lite.guest.t": "7 天體驗",
    "benefits_lite.guest.d": "適合短期使用的 7 天限時權限。",

    "benefits_lite.standard.t": "Standard",
    "benefits_lite.standard.d": "基礎會員層級：結構清晰，可持續使用。",

    "benefits_lite.premium.t": "Premium",
    "benefits_lite.premium.d": "更高優先級與更完整權限，適合深度用戶。",

    "benefits_lite.black.t": "黑卡",
    "benefits_lite.black.d": "基於關係的存取，細節將由團隊於合適時提供。",

    "benefits_lite.note": "註：權限與條件可能會隨時間更新。"
  }),

  /* =======================
     JAPANESE
  ======================= */
  jp: Object.assign({}, window.I18N_DICT.jp || {}, {
    "common.close": "閉じる",

    "lang.th": "TH",
    "lang.en": "EN",
    "lang.zh": "中文",
    "lang.jp": "JP",

    "benefits_lite.title": "特典",
    "benefits_lite.hero.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
    "benefits_lite.hero.h": "メンバー特典（概要）",
    "benefits_lite.hero.p": "利用スタイルに合うプランを選べるよう、アクセス階層を簡潔にまとめています。",
    "benefits_lite.hero.cta_primary": "詳細を見る",
    "benefits_lite.hero.cta_secondary": "Black Card",

    "benefits_lite.preview.t": "Preview",
    "benefits_lite.preview.d": "仕組みとアクセス方針を理解する（非会員）。",

    "benefits_lite.guest.t": "7 Days Guest Pass",
    "benefits_lite.guest.d": "短期利用向けの7日間アクセス。",

    "benefits_lite.standard.t": "Standard",
    "benefits_lite.standard.d": "基本の会員階層。構造が明確で継続利用に適しています。",

    "benefits_lite.premium.t": "Premium",
    "benefits_lite.premium.d": "優先度が高く、より充実したアクセス。ヘビーユーザー向け。",

    "benefits_lite.black.t": "Black Card",
    "benefits_lite.black.d": "関係性に基づくアクセス。詳細は適切なタイミングでご案内します。",

    "benefits_lite.note": "注：権限と条件は状況により更新される場合があります。"
  })
});
