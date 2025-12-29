/* =========================================
   i18n Dictionary – MMD Privé (LOCK • FIXED)
   File: assets/i18n/i18n.dict.js
   - Valid JS
   - No duplicate keys within a locale
========================================= */

window.I18N_DICT = window.I18N_DICT || {};

Object.assign(window.I18N_DICT, {
  /* =======================
     THAI
  ======================= */
  th: Object.assign({}, window.I18N_DICT.th || {}, {
    /* Common */
    "common.close": "Close",

    /* Lang labels (for pills) */
    "lang.th": "ไทย",
    "lang.en": "EN",
    "lang.zh": "中文",
    "lang.jp": "JP",

    /* Membership helpers */
    "membership.helper.vip":
      "คุณอยู่ในกลุ่มผู้ใช้งานระดับสูง ระบบจะจัดลำดับความสำคัญให้คุณ",
    "membership.helper.blackcard":
      "คุณถือสถานะ Black Card สิทธิ์และการเข้าถึงเป็นกรณีพิเศษ",
    "membership.helper.admin":
      "โหมดผู้ดูแลระบบ สำหรับการตรวจสอบและจัดการข้อมูล",

    /* Pay – Course */
    "pay.course.title": "การชำระค่าบริการ",
    "pay.course.subtitle": "Private Session · Course (PN / VIP)",
    "pay.course.option.deposit": "มัดจำ 30%",
    "pay.course.option.deposit.m": "มัดจำ 30%",
    "pay.course.option.full": "ชำระเต็ม 100%",
    "pay.course.note": "กรุณาตรวจสอบรูปแบบการชำระก่อนดำเนินการ",

    /* Pay – Travel */
    "pay.travel.title": "การยืนยันการจองกิจกรรม",
    "pay.travel.subtitle": "Lifestyle Companion · Travel · Party",
    "pay.travel.people": "จำนวนผู้ร่วมกิจกรรม",
    "pay.travel.deposit": "มัดจำ 20%",
    "pay.travel.deposit.m": "มัดจำ 20%",
    "pay.travel.balance": "ชำระส่วนที่เหลือหน้างาน",
    "pay.travel.note": "หน้านี้ไม่ใช่ค่าการเดินทางหรือค่าตั๋ว",

    /* Pay – Renewal */
    "pay.renewal.title": "การต่ออายุสมาชิก",
    "pay.renewal.subtitle": "Standard · Premium",
    "pay.renewal.note":
      "เงื่อนไขการต่ออายุอาจแตกต่างกันตามยอดการใช้งานในรอบที่ผ่านมา",
    "pay.renewal.cta": "ยืนยันการต่ออายุ",

    /* Pay – Upgrade */
    "pay.upgrade.title": "การอัปเกรดสมาชิก",
    "pay.upgrade.subtitle": "Standard → Premium · 7 Days → Premium",
    "pay.upgrade.case1":
      "Standard → Premium : ชำระเพิ่ม 2,000 บาท และคงวันหมดอายุเดิม",
    "pay.upgrade.case2":
      "7 Days → Premium : อัปเกรดได้ภายใน 15 วัน โดยชำระเพิ่ม 2,000 บาท",
    "pay.upgrade.note":
      "หากเกินระยะเวลาที่กำหนด จะต้องชำระ Premium เต็มจำนวน",
    "pay.upgrade.cta": "ยืนยันการอัปเกรด",

    /* Pay – Membership (main page copy: Per tone) */
    "membership.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
    "membership.title": "Membership รายปี",
    "membership.subtitle": "Membership Payment",
    "membership.intro":
      "Membership ของ MMD เป็นระบบรายปี เพื่อให้คุณเข้าถึงข้อมูลและอัปเดตได้ต่อเนื่อง เลือกแพ็กเกจให้ตรงกับจังหวะการใช้งานของคุณ หากต้องการทดลองก่อน เรามี 7 Days Guest Pass สำหรับการใช้งานระยะสั้น",
    "membership.benefits": "สิทธิประโยชน์",

    "membership.pkg.standard.name": "Standard (1 ปี)",
    "membership.pkg.standard.desc": "เข้าถึงคลังภาพกลุ่ม + Telegram Standard",
    "membership.pkg.standard.price": "1,199 บาท",

    "membership.pkg.premium.name": "Premium (1 ปี)",
    "membership.pkg.premium.desc":
      "เข้าถึงคลังภาพกลุ่ม + Telegram Premium และ Standard",
    "membership.pkg.premium.price": "2,999 บาท",

    "membership.pkg.guest7.name": "7 Days Guest Pass (7 วัน)",
    "membership.pkg.guest7.desc":
      "ทดลองใช้งาน 7 วัน: เข้าถึงคลังภาพกลุ่ม + Telegram Premium และ Standard",
    "membership.pkg.guest7.price": "1,499 บาท",

    "membership.step1.title": "STEP 1 — เลือกแพ็กเกจ & โปรโมชัน",
    "membership.step2.title": "STEP 2 — เลือกช่องทางชำระเงิน",

    "membership.form.package": "แพ็กเกจสมาชิก",
    "membership.form.promo": "Promo Code (ถ้ามี)",
    "membership.form.promo.ph": "เช่น XMAS2025",
    "membership.form.email": "อีเมลลูกค้า (optional)",
    "membership.form.email.ph": "you@example.com",
    "membership.form.name": "ชื่อ (optional)",
    "membership.form.name.ph": "Full name",
    "membership.form.memberId": "Member ID (optional)",
    "membership.form.memberId.ph": "MS / Member ID",

    "membership.summary.base": "ราคาปกติ",
    "membership.summary.discount": "ส่วนลด",
    "membership.summary.pay": "ยอดชำระ",

    "membership.btn.recalc": "คำนวณใหม่",
    "membership.btn.notify": "Notify Team",

    "membership.pay.title": "ช่องทางชำระเงิน",

    "membership.pay.promptpay.title": "PromptPay (QR)",
    "membership.pay.promptpay.sub": "สร้าง QR ตามยอดชำระ (อัปเดตอัตโนมัติ)",
    "membership.pay.promptpay.pill": "แนะนำ",

    "membership.pay.ktb.title": "KTB Bank (โอนบัญชี)",
    "membership.pay.ktb.pill": "KTB",
    "membership.pay.ktb.name": "ชื่อบัญชี: ธัชชะ ป.",
    "membership.pay.ktb.acc": "เลขบัญชี: 1420335898",
    "membership.pay.copy": "COPY",

    "membership.pay.paypal.title": "PayPal",
    "membership.pay.paypal.pill": "CREDIT CARD",
    "membership.pay.paypal.fee": "Service charge 4%",
    "membership.pay.paypal.after":
      "หลังชำระเงินแล้ว ให้กลับมาที่หน้านี้และกด Notify Team เพื่อแจ้งทีมตรวจสอบ",

    "membership.promptpay.id": "PromptPay ID",
    "membership.promptpay.link": "ลิงก์",
    "membership.promptpay.open": "open",
    "membership.status.ready": "สถานะ: พร้อมใช้งาน",

    /* =======================
       Benefits Lite (Per Lux)
    ======================= */
    "benefits_lite.title": "Benefits",
    "benefits_lite.hero.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
    "benefits_lite.hero.h": "สิทธิ์สมาชิกโดยสรุป",
    "benefits_lite.hero.p":
      "ภาพรวมแบบกระชับ เพื่อเลือกแพ็กเกจที่เหมาะกับรูปแบบการใช้งานของคุณ",
    "benefits_lite.hero.cta_primary": "ดูสิทธิ์แบบละเอียด",
    "benefits_lite.hero.cta_secondary": "Black Card",

    "benefits_lite.preview.t": "Preview",
    "benefits_lite.preview.d":
      "สำรวจระบบและแนวทางการเข้าถึง เพื่อประเมินความเหมาะสมก่อนสมัคร",

    "benefits_lite.guest.t": "7 Days Guest Pass",
    "benefits_lite.guest.d": "ทดลองใช้งาน 7 วัน เหมาะสำหรับช่วงสั้นหรือช่วงเดินทาง",

    "benefits_lite.standard.t": "Standard",
    "benefits_lite.standard.d": "ทางเลือกเริ่มต้นสำหรับสมาชิก: โครงสร้างชัด และใช้งานต่อเนื่อง",

    "benefits_lite.premium.t": "Premium",
    "benefits_lite.premium.d":
      "ระดับความสำคัญสูงขึ้น พร้อมสิทธิ์ที่ครบกว่า เหมาะกับผู้ใช้งานจริงจัง",

    "benefits_lite.black.t": "Black Card",
    "benefits_lite.black.d": "การเข้าถึงระดับความสัมพันธ์ ทีมจะให้รายละเอียดเมื่อเหมาะสม",

    "benefits_lite.note":
      "หมายเหตุ: สิทธิ์อาจอัปเดตตามช่วงเวลาและความเหมาะสม",

    /* Compare (lite) */
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
    "benefits_lite.compare.r6": "Black Card consideration",

    /* =======================
       Comparison Table (TH)
       - As provided
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
    "comparison.premium.rule.r2":
      "ใช้บริการตั้งแต่ 2 ครั้งขึ้นไป: ปลดล็อก Exclusive Models ชุดคัดพิเศษ",
    "comparison.premium.rule.r3":
      "ใช้บริการตั้งแต่ 3 ครั้งขึ้นไป: เข้าถึง Secret Exclusive Models",
    "comparison.premium.rule.note": "สิทธิ์เป็นแบบไล่ระดับ และขึ้นกับเงื่อนไขของระบบ",

    "comparison.note.vip":
      "ผู้ที่มียอดใช้จ่ายภายใน 365 วันบิลรวมเกิน 120,000 บาท จะได้รับสิทธิ์เข้ากลุ่ม Telegram: MMD VIP Lounge ทันที",
    "comparison.note.expiry":
      "เมื่อสมาชิกหมดอายุ จะถูกถอดออกจาก Google Drive ทันที และคงสิทธิ์ได้เฉพาะใน Telegram Standard เท่านั้น"
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

    "membership.helper.vip":
      "You are recognized as a high-tier user with priority handling.",
    "membership.helper.blackcard":
      "You hold Black Card status with special access and consideration.",
    "membership.helper.admin":
      "Administrator mode for system review and management.",

    "pay.course.title": "Service Payment",
    "pay.course.subtitle": "Private Session · Course (PN / VIP)",
    "pay.course.option.deposit": "30% Deposit",
    "pay.course.option.deposit.m": "30% Deposit",
    "pay.course.option.full": "100% Full Payment",
    "pay.course.note": "Please review the payment option before proceeding.",

    "pay.travel.title": "Activity Reservation Confirmation",
    "pay.travel.subtitle": "Lifestyle Companion · Travel · Party",
    "pay.travel.people": "Number of participants",
    "pay.travel.deposit": "20% Deposit",
    "pay.travel.deposit.m": "20% Deposit",
    "pay.travel.balance": "Remaining balance due on the activity date",
    "pay.travel.note": "This is not a transportation or ticket fee.",

    "pay.renewal.title": "Membership Renewal",
    "pay.renewal.subtitle": "Standard · Premium",
    "pay.renewal.note": "Renewal terms may vary based on your previous usage.",
    "pay.renewal.cta": "Confirm renewal",

    "pay.upgrade.title": "Membership Upgrade",
    "pay.upgrade.subtitle": "Standard → Premium · 7 Days → Premium",
    "pay.upgrade.case1":
      "Standard → Premium: Pay an additional 2,000 THB. Expiration date remains the same.",
    "pay.upgrade.case2":
      "7 Days → Premium: Upgrade within 15 days with an additional 2,000 THB.",
    "pay.upgrade.note":
      "After the eligible period, full Premium payment is required.",
    "pay.upgrade.cta": "Confirm upgrade",

    "membership.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
    "membership.title": "Annual membership",
    "membership.subtitle": "Membership Payment",
    "membership.intro":
      "MMD membership is billed annually for consistent access and ongoing updates. Choose the plan that matches your usage. If you prefer to try first, the 7 Days Guest Pass is designed for short-term access.",
    "membership.benefits": "Benefits",

    "membership.step1.title": "STEP 1 — Package & Promo",
    "membership.step2.title": "STEP 2 — Choose payment method",

    "membership.form.package": "Membership package",
    "membership.form.promo": "Promo code (optional)",
    "membership.form.promo.ph": "e.g., XMAS2025",
    "membership.form.email": "Customer email (optional)",
    "membership.form.email.ph": "you@example.com",
    "membership.form.name": "Name (optional)",
    "membership.form.name.ph": "Full name",
    "membership.form.memberId": "Member ID (optional)",
    "membership.form.memberId.ph": "MS / Member ID",

    "membership.summary.base": "Base price",
    "membership.summary.discount": "Discount",
    "membership.summary.pay": "Pay amount",

    "membership.btn.recalc": "Recalculate",
    "membership.btn.notify": "Notify Team",

    "membership.pay.promptpay.pill": "RECOMMENDED",
    "membership.pay.paypal.after":
      "After payment, return to this page and click Notify Team so our team can verify.",

    "benefits_lite.title": "Benefits",
    "benefits_lite.hero.eyebrow": "MEMBERSHIP PAYMENT",
    "benefits_lite.hero.h": "Membership Benefits",
    "benefits_lite.hero.p":
      "A concise overview of access tiers to help you choose what fits your actual usage.",
    "benefits_lite.hero.cta_primary": "View Full Benefits",
    "benefits_lite.hero.cta_secondary": "Black Card",

    "benefits_lite.preview.t": "Preview",
    "benefits_lite.preview.d":
      "Understand the system, approach, and access structure (not a membership).",

    "benefits_lite.guest.t": "7 Days Guest Pass",
    "benefits_lite.guest.d": "Short-term access for 7 days, designed for quick usage.",

    "benefits_lite.standard.t": "Standard",
    "benefits_lite.standard.d":
      "The baseline membership tier with clear structure and continuity.",

    "benefits_lite.premium.t": "Premium",
    "benefits_lite.premium.d":
      "Higher priority with fuller access, designed for serious users.",

    "benefits_lite.black.t": "Black Card",
    "benefits_lite.black.d":
      "Relationship-tier access. Details are shared when appropriate.",

    "benefits_lite.note": "Note: Access may evolve over time."
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
    "benefits_lite.hero.eyebrow": "MEMBERSHIP PAYMENT",
    "benefits_lite.hero.h": "会员权益概览",
    "benefits_lite.hero.p":
      "用简洁方式说明不同层级权限，帮助你选择最符合实际使用的方案。",
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

    "benefits_lite.note": "注：权限可能会随时间更新。"
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
    "benefits_lite.hero.eyebrow": "MEMBERSHIP PAYMENT",
    "benefits_lite.hero.h": "會員權益概覽",
    "benefits_lite.hero.p":
      "以精簡方式說明不同層級權限，協助你選擇最符合實際使用的方案。",
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

    "benefits_lite.note": "註：權限可能會隨時間更新。"
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
    "benefits_lite.hero.eyebrow": "MEMBERSHIP PAYMENT",
    "benefits_lite.hero.h": "Membership Benefits",
    "benefits_lite.hero.p":
      "利用スタイルに合うプランを選べるよう、アクセス階層を簡潔にまとめています。",
    "benefits_lite.hero.cta_primary": "View Full Benefits",
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
    "benefits_lite.black.d":
      "関係性に基づくアクセス。詳細は適切なタイミングでご案内します。",

    "benefits_lite.note": "注：権限は状況により更新される場合があります。"
  })
});
