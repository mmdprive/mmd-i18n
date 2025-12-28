/* =========================================
   i18n Dictionary – MMD Privé (LOCK • FIXED)
   - Valid JS
   - Keys aligned with benefits-lite embed
========================================= */

window.I18N_DICT = window.I18N_DICT || {};

Object.assign(window.I18N_DICT, {
  /* =======================
     THAI
  ======================= */
  th: {
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
    "membership.pkg.standard.desc":
      "เข้าถึงคลังภาพกลุ่ม + Telegram Standard",
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
       Membership Benefits – Lite (Popup/page)
       Keys MUST match embed:
       - benefits_lite.title
       - benefits_lite.hero.eyebrow / hero.h / hero.p
       - benefits_lite.hero.cta_primary / hero.cta_secondary
       - benefits_lite.preview.* guest.* standard.* premium.* black.*
       - benefits_lite.note
    ======================= */
    "benefits_lite.title": "Benefits",

    "benefits_lite.hero.eyebrow": "MEMBERSHIP PAYMENT",
    "benefits_lite.hero.h": "Membership Benefits",
    "benefits_lite.hero.p":
      "ภาพรวมแบบกระชับของระดับการเข้าถึง เพื่อให้คุณเลือกแพ็กเกจได้ตรงกับการใช้งานจริง",
    "benefits_lite.hero.cta_primary": "View Full Benefits",
    "benefits_lite.hero.cta_secondary": "Black Card",

    "benefits_lite.preview.t": "Preview",
    "benefits_lite.preview.d":
      "ทำความเข้าใจระบบ แนวทาง และระดับการเข้าถึง (ยังไม่ใช่สมาชิก)",

    "benefits_lite.guest.t": "7 Days Guest Pass",
    "benefits_lite.guest.d":
      "ทดลองใช้งานแบบจำกัด 7 วัน เหมาะสำหรับการใช้งานช่วงสั้น",

    "benefits_lite.standard.t": "Standard",
    "benefits_lite.standard.d":
      "ระดับเริ่มต้นสำหรับสมาชิก โครงสร้างชัด ใช้งานต่อเนื่องได้",

    "benefits_lite.premium.t": "Premium",
    "benefits_lite.premium.d":
      "ลำดับความสำคัญสูงขึ้น + สิทธิ์ครบกว่า เหมาะสำหรับผู้ใช้งานจริงจัง",

    "benefits_lite.black.t": "Black Card",
    "benefits_lite.black.d":
      "การเข้าถึงแบบความสัมพันธ์ ทีมจะให้รายละเอียดเมื่อเหมาะสม",

    "benefits_lite.note":
      "หมายเหตุ: สิทธิ์อาจมีการอัปเดตตามช่วงเวลาและความเหมาะสม"
  },

  /* =======================
     ENGLISH
  ======================= */
  en: {
    /* Common */
    "common.close": "Close",

    /* Lang labels */
    "lang.th": "TH",
    "lang.en": "EN",
    "lang.zh": "中文",
    "lang.jp": "JP",

    /* Membership helpers */
    "membership.helper.vip":
      "You are recognized as a high-tier user with priority handling.",
    "membership.helper.blackcard":
      "You hold Black Card status with special access and consideration.",
    "membership.helper.admin":
      "Administrator mode for system review and management.",

    /* Pay – Course */
    "pay.course.title": "Service Payment",
    "pay.course.subtitle": "Private Session · Course (PN / VIP)",
    "pay.course.option.deposit": "30% Deposit",
    "pay.course.option.deposit.m": "30% Deposit",
    "pay.course.option.full": "100% Full Payment",
    "pay.course.note": "Please review the payment option before proceeding.",

    /* Pay – Travel */
    "pay.travel.title": "Activity Reservation Confirmation",
    "pay.travel.subtitle": "Lifestyle Companion · Travel · Party",
    "pay.travel.people": "Number of participants",
    "pay.travel.deposit": "20% Deposit",
    "pay.travel.deposit.m": "20% Deposit",
    "pay.travel.balance": "Remaining balance due on the activity date",
    "pay.travel.note": "This is not a transportation or ticket fee.",

    /* Pay – Renewal */
    "pay.renewal.title": "Membership Renewal",
    "pay.renewal.subtitle": "Standard · Premium",
    "pay.renewal.note": "Renewal terms may vary based on your previous usage.",
    "pay.renewal.cta": "Confirm renewal",

    /* Pay – Upgrade */
    "pay.upgrade.title": "Membership Upgrade",
    "pay.upgrade.subtitle": "Standard → Premium · 7 Days → Premium",
    "pay.upgrade.case1":
      "Standard → Premium: Pay an additional 2,000 THB. Expiration date remains the same.",
    "pay.upgrade.case2":
      "7 Days → Premium: Upgrade within 15 days with an additional 2,000 THB.",
    "pay.upgrade.note":
      "After the eligible period, full Premium payment is required.",
    "pay.upgrade.cta": "Confirm upgrade",

    /* Pay – Membership */
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

    /* Benefits – Lite */
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
    "benefits_lite.guest.d":
      "Short-term access for 7 days, designed for quick usage.",

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
  },

  /* =======================
     CHINESE (SIMPLIFIED)
  ======================= */
  zh: {
    /* Common */
    "common.close": "关闭",

    /* Lang labels */
    "lang.th": "泰",
    "lang.en": "EN",
    "lang.zh": "中文",
    "lang.jp": "JP",

    /* Benefits – Lite (aligned keys) */
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
  },

  /* =======================
     CHINESE (TRADITIONAL)
  ======================= */
  "zh-Hant": {
    /* Common */
    "common.close": "關閉",

    /* Lang labels */
    "lang.th": "泰",
    "lang.en": "EN",
    "lang.zh": "中文",
    "lang.jp": "JP",

    /* Benefits – Lite (aligned keys) */
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
  },

  /* =======================
     JAPANESE
  ======================= */
  jp: {
    /* Common */
    "common.close": "閉じる",

    /* Lang labels */
    "lang.th": "TH",
    "lang.en": "EN",
    "lang.zh": "中文",
    "lang.jp": "JP",

    /* Benefits – Lite (aligned keys) */
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
    "benefits_lite.black.d": "関係性に基づくアクセス。詳細は適切なタイミングでご案内します。",

    "benefits_lite.note": "注：権限は状況により更新される場合があります。"
  }
});
