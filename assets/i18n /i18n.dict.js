/* =====================================================
   MMD • i18n.dict.js (LOCK • ALL-IN-ONE)
   - Safe merge only (Object.assign)
   - Includes:
     1) Benefits Lite + Comparison + Black Card + Helpers
     2) Pay Pages (/pay/*)
     3) Renewal (/pay/renewal)
   Languages: TH / EN / ZH / JP
===================================================== */

window.I18N_DICT = window.I18N_DICT || {};

/* =====================================================
   TH
===================================================== */
window.I18N_DICT.th = Object.assign({}, window.I18N_DICT.th || {}, {

  /* Language */
  "lang.th": "ไทย",
  "lang.en": "English",
  "lang.zh": "中文",
  "lang.jp": "日本語",

  /* =======================
     BENEFITS LITE
  ======================= */
  "benefits_lite.title": "สิทธิ์สมาชิก (สรุป)",
  "benefits_lite.hero.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
  "benefits_lite.hero.h": "สิทธิ์สมาชิกโดยสรุป",
  "benefits_lite.hero.p": "ภาพรวมแบบกระชับ เพื่อเลือกแพ็กเกจที่เหมาะกับรูปแบบการใช้งานของคุณ",
  "benefits_lite.hero.cta_primary": "ดูสิทธิ์แบบละเอียด",
  "benefits_lite.hero.cta_secondary": "Black Card",

  "benefits_lite.section.overview": "สรุปแบบเร็ว",
  "benefits_lite.section.compare": "ตารางเปรียบเทียบสิทธิ์",
  "benefits_lite.note": "หมายเหตุ: สิทธิ์และเงื่อนไขอาจมีการปรับตามช่วงเวลา ความเหมาะสม และดุลยพินิจของทีม",

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

  /* =======================
     COMPARISON
  ======================= */
  "comparison.title": "ตารางเปรียบเทียบสิทธิ์",
  "comparison.sub": "ดูภาพรวมสิทธิ์แบบรวดเร็ว ก่อนเลือกแพ็กเกจ",

  "comparison.pkg.guest": "7 Days Guest Pass",
  "comparison.pkg.standard": "Standard",
  "comparison.pkg.premium": "Premium",
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

  "comparison.note.vip": "ผู้ที่มียอดใช้จ่ายภายใน 365 วันบิลรวมเกิน 120,000 บาท จะได้รับสิทธิ์เข้ากลุ่ม Telegram: MMD VIP Lounge ทันที",
  "comparison.note.expiry": "เมื่อสมาชิกหมดอายุ จะถูกถอดออกจาก Google Drive ทันที และคงสิทธิ์ได้เฉพาะใน Telegram Standard เท่านั้น",

  /* =======================
     BLACK CARD (core)
  ======================= */
  "blackcard.eyebrow": "MMD PRIVÉ • BLACK CARD",
  "blackcard.title": "Black Card Status",
  "blackcard.intro": "Black Card ไม่ใช่แพ็กเกจ และไม่ใช่สิ่งที่สามารถสมัครหรือซื้อได้ แต่เป็นสถานะความสัมพันธ์ระดับสูงสุดภายในระบบของ MMD Privé",

  "blackcard.section.what": "What Black Card Is",
  "blackcard.what.desc": "Black Card คือระดับการเข้าถึงที่เกิดจากความต่อเนื่อง ความเข้าใจระบบ และความเหมาะสมในระยะยาว ไม่ได้อิงจากยอดเงินเพียงอย่างเดียว",

  "blackcard.section.compare": "Conceptual Comparison",
  "blackcard.compare.premium": "Premium คือการเข้าถึงแบบแพ็กเกจ โครงสร้างชัด สิทธิ์ครบ และมีลำดับความสำคัญสูง เหมาะกับผู้ใช้งานจริงจังที่ต้องการระบบที่คาดการณ์ได้",
  "blackcard.compare.blackcard": "Black Card คือการเข้าถึงเชิงความสัมพันธ์ ไม่ยึดติดกับโครงสร้างแพ็กเกจ การดูแลและการตัดสินใจขึ้นกับบริบทและความเหมาะสมในแต่ละช่วงเวลา",

  "blackcard.note": "หมายเหตุ: Black Card จะถูกพิจารณาและแจ้งให้ทราบโดยทีมเท่านั้น ไม่มีขั้นตอนการสมัคร ไม่มีฟอร์ม และไม่มีราคากำหนด",

  /* Black Card (hero/sections – aligned with JP structure) */
  "blackcard.hero.eyebrow": "MMD PRIVÉ • BLACK CARD",
  "blackcard.hero.h": "Black Card",
  "blackcard.hero.p": "Black Card เป็นสถานะการเข้าถึงแบบความสัมพันธ์ ไม่ใช่แพ็กเกจที่สามารถซื้อได้โดยตรง และจะพิจารณาจากการใช้งานต่อเนื่อง ความน่าเชื่อถือ และความเหมาะสมโดยรวม",
  "blackcard.hero.cta_primary": "ดูเมมเบอร์ชิพ",
  "blackcard.hero.cta_secondary": "ดูสรุปสิทธิ์",

  "blackcard.section.what.title": "Black Card คืออะไร",
  "blackcard.section.what.sub": "การเข้าถึงระดับสูงสุดของระบบ ที่ให้ความสำคัญกับความไว้วางใจ ความต่อเนื่อง และความเหมาะสมตามบริบท",

  "blackcard.what.r1.t": "ความสัมพันธ์เป็นฐาน",
  "blackcard.what.r1.d": "ไม่ใช่แพ็กเกจที่ซื้อได้ แต่เป็นสถานะที่ทีมพิจารณาให้ตามเกณฑ์ภายใน",
  "blackcard.what.r2.t": "ลำดับความสำคัญสูงสุด",
  "blackcard.what.r2.d": "การติดต่อ การจัดคิว และการเข้าถึง จะถูกจัดการด้วยระดับความสำคัญสูงสุด",
  "blackcard.what.r3.t": "การเข้าถึงตามบริบท",
  "blackcard.what.r3.d": "ขอบเขตการเข้าถึงไม่ตายตัว และทีมจะอธิบายเมื่อถึงเวลาที่เหมาะสม",

  "blackcard.section.consider.title": "แนวทางการพิจารณา",
  "blackcard.section.consider.sub": "รายการต่อไปนี้เป็นแนวทางประกอบ ไม่ใช่เงื่อนไขตายตัว ระบบจะประเมินโดยภาพรวม",

  "blackcard.consider.r1.t": "ความต่อเนื่อง",
  "blackcard.consider.r1.d": "การใช้งานระยะยาวที่สม่ำเสมอ และการสื่อสารที่เหมาะสม",
  "blackcard.consider.r2.t": "ความไว้วางใจและความปลอดภัย",
  "blackcard.consider.r2.d": "ความเข้าใจและการร่วมมือกับกฎของระบบและแนวทางความปลอดภัย",
  "blackcard.consider.r3.t": "เกณฑ์ภายใน",
  "blackcard.consider.r3.d": "การประเมินภายในเพื่อคงคุณภาพในระยะยาว",

  /* Helpers */
  "membership.helper.blackcard":
    "Black Card เป็นสถานะการเข้าถึงแบบความสัมพันธ์ ไม่ใช่แพ็กเกจที่สามารถสมัครหรือซื้อได้โดยตรง",
  "blackcard.helper.premium":
    "คุณอยู่ในระดับ Premium หากใช้งานต่อเนื่องและเหมาะสม ระบบจะพิจารณาสถานะเพิ่มเติมตามดุลยพินิจทีม",
  "blackcard.helper.vip":
    "คุณอยู่ในกลุ่มที่ระบบให้ความสำคัญ ทีมจะประเมินการเข้าถึงในระดับที่เหมาะสมต่อไป",

  /* =====================================================
     PAY PAGES (/pay/*)
  ===================================================== */
  "pay.common.title": "ยืนยันการชำระเงิน",
  "pay.common.subtitle": "กรุณาตรวจสอบรายละเอียดก่อนดำเนินการ",
  "pay.common.reference": "หมายเลขอ้างอิง",
  "pay.common.status": "สถานะ",
  "pay.common.amount": "ยอดรวม",
  "pay.common.currency": "บาท",
  "pay.common.confirmed": "ยืนยันเรียบร้อย",
  "pay.common.pending": "รอดำเนินการ",
  "pay.common.failed": "ไม่สำเร็จ",

  "pay.method.title": "วิธีการชำระเงิน",
  "pay.method.promptpay": "พร้อมเพย์",
  "pay.method.creditcard": "บัตรเครดิต",
  "pay.method.banktransfer": "โอนผ่านธนาคาร",

  "pay.breakdown.title": "รายละเอียดค่าใช้จ่าย",
  "pay.breakdown.deposit": "มัดจำ",
  "pay.breakdown.balance": "ยอดคงเหลือ",
  "pay.breakdown.total": "ยอดรวมทั้งหมด",

  "pay.course.title": "ชำระเงินคอร์ส",
  "pay.course.program": "ชื่อคอร์ส",
  "pay.course.private": "Private Edition",
  "pay.course.note": "การชำระเงินมัดจำ 30% เพื่อยืนยันการจองคอร์ส",

  "pay.travel.title": "ชำระเงินงานเดินทาง",
  "pay.travel.location": "สถานที่",
  "pay.travel.date": "วันที่",
  "pay.travel.time": "เวลา",

  "pay.membership.title": "ชำระค่าสมาชิก",
  "pay.membership.tier": "ระดับสมาชิก",
  "pay.membership.duration": "ระยะเวลา",
  "pay.membership.active": "เปิดใช้งานแล้ว",

  "pay.points.title": "คะแนนสะสม",
  "pay.points.earned": "คะแนนที่ได้รับ",
  "pay.points.total": "คะแนนสะสมทั้งหมด",
  "pay.points.rule": "ทุก 1,000 บาท = 1 คะแนน",
  "pay.points.threshold": "ครบ 120 คะแนน จะมีการแจ้งเตือนเพื่ออนุมัติเข้ากลุ่ม Telegram",

  "pay.cta.confirm": "ยืนยันการชำระเงิน",
  "pay.cta.print": "พิมพ์ / บันทึก PDF",
  "pay.cta.back": "ย้อนกลับ",
  "pay.cta.support": "ติดต่อเจ้าหน้าที่",

  "pay.terms.title": "ข้อกำหนดและเงื่อนไข",
  "pay.terms.item1": "ข้อมูลทั้งหมดเป็นความลับ",
  "pay.terms.item2": "การชำระเงินไม่สามารถขอคืนได้",
  "pay.terms.item3": "การเปลี่ยนแปลงใด ๆ ต้องได้รับการยืนยันจาก MMD",

  /* =====================================================
     RENEWAL (/pay/renewal)
  ===================================================== */
  "renewal.eyebrow": "MMD PRIVÉ • RENEWAL",
  "renewal.title": "ต่ออายุสมาชิก MMD Privé",
  "renewal.desc": "เลือกเงื่อนไขที่เหมาะกับคุณ ระบบจะสรุปยอดและสร้าง QR ให้พร้อมชำระทันที",

  "renewal.badge.fast": "FAST RENEWAL",
  "renewal.badge.secure": "SECURE PAYMENT",
  "renewal.badge.support": "PREMIUM SUPPORT",

  "renewal.section.payment": "Renewal Payment",
  "renewal.section.payment.desc": "เลือกเงื่อนไขหรือกรอกยอดเอง จากนั้นชำระผ่าน PromptPay หรือ PayPal",

  "renewal.step.1": "STEP 1 — เลือกแพ็กเกจ / ระยะเวลา",
  "renewal.step.2": "STEP 2 — เลือกช่องทางชำระเงิน",

  "renewal.pkg.standard": "Standard Renewal",
  "renewal.pkg.premium": "Premium Renewal",
  "renewal.pkg.blackcard": "Black Card Renewal",
  "renewal.pkg.7days": "7 Days Guest Pass",

  "renewal.label.promo": "Promo Code (ถ้ามี)",
  "renewal.label.email": "อีเมลลูกค้า (optional)",
  "renewal.label.name": "ชื่อ (optional)",
  "renewal.label.member_id": "Member ID (optional)",

  "renewal.summary.base": "ราคาปกติ",
  "renewal.summary.discount": "ส่วนลด",
  "renewal.summary.total": "ยอดชำระ",

  "renewal.btn.recalc": "คำนวณใหม่",
  "renewal.btn.notify": "Notify Team",

  "renewal.method.promptpay": "PromptPay (QR)",
  "renewal.method.promptpay.desc": "สร้าง QR ตามยอดที่ต้องชำระ (อัปเดตอัตโนมัติ)",

  "renewal.method.ktb": "KTB Bank (โอนบัญชี)",
  "renewal.method.paypal": "PayPal",
  "renewal.method.paypal.fee": "Service charge 4%",

  "renewal.promptpay.id": "PromptPay ID",
  "renewal.promptpay.link": "ลิงก์",

  "renewal.status.ready": "สถานะ: พร้อมใช้งาน",
  "renewal.status.sending": "กำลังส่งข้อมูล…",
  "renewal.status.security": "กำลังตรวจสอบความปลอดภัย…",
  "renewal.status.success": "สำเร็จ: แจ้งทีมเรียบร้อย",
  "renewal.status.fail": "ล้มเหลว: ส่งไม่สำเร็จ"
});


/* =====================================================
   EN
===================================================== */
window.I18N_DICT.en = Object.assign({}, window.I18N_DICT.en || {}, {

  /* Language */
  "lang.th": "TH",
  "lang.en": "English",
  "lang.zh": "中文",
  "lang.jp": "日本語",

  /* Benefits Lite */
  "benefits_lite.title": "Benefits",
  "benefits_lite.hero.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
  "benefits_lite.hero.h": "Membership Benefits (Summary)",
  "benefits_lite.hero.p": "A concise overview to help you choose a package that fits your actual usage.",
  "benefits_lite.hero.cta_primary": "View full benefits",
  "benefits_lite.hero.cta_secondary": "Black Card",

  "benefits_lite.section.overview": "Quick overview",
  "benefits_lite.section.compare": "Benefits comparison",
  "benefits_lite.note": "Note: Access and terms may change over time at the team’s discretion.",

  "benefits_lite.preview.t": "Preview",
  "benefits_lite.preview.d": "Understand the system and access approach before subscribing.",
  "benefits_lite.guest.t": "7 Days Guest Pass",
  "benefits_lite.guest.d": "7-day trial designed for short-term usage.",
  "benefits_lite.standard.t": "Standard",
  "benefits_lite.standard.d": "Entry membership tier with clear structure and continuity.",
  "benefits_lite.premium.t": "Premium",
  "benefits_lite.premium.d": "Higher priority with fuller access for serious users.",
  "benefits_lite.black.t": "Black Card",
  "benefits_lite.black.d": "Relationship-tier access. Details are shared when appropriate.",

  /* Comparison */
  "comparison.title": "Benefits comparison",
  "comparison.sub": "A quick overview before you decide.",

  "comparison.pkg.guest": "7 Days",
  "comparison.pkg.standard": "Standard",
  "comparison.pkg.premium": "Premium",
  "comparison.pkg.black": "Black",

  "comparison.row.suitable": "Best for",
  "comparison.row.duration": "Duration",
  "comparison.row.services": "Eligible services",
  "comparison.row.public": "Public Models",
  "comparison.row.private_std": "Private Standard Models",
  "comparison.row.private_pre": "Private Premium Models",
  "comparison.row.exclusive": "Exclusive Models",
  "comparison.row.drive": "Google Drive access",
  "comparison.row.telegram": "Telegram group",
  "comparison.row.trial": "Premium trial",

  "comparison.premium.rule.title": "Premium exclusive rule",
  "comparison.premium.rule.r2": "2+ sessions: unlock curated Exclusive Models",
  "comparison.premium.rule.r3": "3+ sessions: access Secret Exclusive Models",
  "comparison.premium.rule.note": "Progressive access based on system rules.",

  "comparison.note.vip": "Spend over 120,000 THB (combined bills within 365 days) to access Telegram: MMD VIP Lounge.",
  "comparison.note.expiry": "When membership expires, Google Drive access is removed immediately; Telegram Standard may remain.",

  /* Black Card */
  "blackcard.eyebrow": "MMD PRIVÉ • BLACK CARD",
  "blackcard.title": "Black Card Status",
  "blackcard.intro": "Black Card is not a package and cannot be applied for or purchased. It represents the highest relationship-based access within MMD Privé.",

  "blackcard.section.what": "What Black Card Is",
  "blackcard.what.desc": "Black Card access is built on continuity, understanding of the system, and long-term suitability — not spending alone.",

  "blackcard.section.compare": "Conceptual Comparison",
  "blackcard.compare.premium": "Premium is a structured package with defined benefits and priority, designed for serious users who value predictability.",
  "blackcard.compare.blackcard": "Black Card is relationship-based access. Decisions, care, and access are contextual rather than package-driven.",

  "blackcard.note": "Note: Black Card is granted and communicated by the team only. There is no application, form, or fixed price.",

  "blackcard.hero.eyebrow": "MMD PRIVÉ • BLACK CARD",
  "blackcard.hero.h": "Black Card",
  "blackcard.hero.p": "Black Card is a relationship-based access status. It is not a plan that can be purchased directly. Status is granted based on continuity, reliability, and overall suitability.",
  "blackcard.hero.cta_primary": "View membership",
  "blackcard.hero.cta_secondary": "View benefits summary",

  "blackcard.section.what.title": "What Black Card Is",
  "blackcard.section.what.sub": "The highest level of access, built on trust, continuity, and contextual suitability.",

  "blackcard.what.r1.t": "Relationship-based",
  "blackcard.what.r1.d": "Not a purchasable plan. It is a status granted under internal evaluation.",
  "blackcard.what.r2.t": "Highest priority",
  "blackcard.what.r2.d": "Contact, coordination, and access are handled with top priority.",
  "blackcard.what.r3.t": "Context-based access",
  "blackcard.what.r3.d": "Access scope is not fixed and is explained at the appropriate time.",

  "blackcard.section.consider.title": "About consideration",
  "blackcard.section.consider.sub": "These are guidelines only, not fixed requirements. Decisions are made holistically.",

  "blackcard.consider.r1.t": "Continuity",
  "blackcard.consider.r1.d": "Long-term, consistent usage and appropriate communication.",
  "blackcard.consider.r2.t": "Trust & safety",
  "blackcard.consider.r2.d": "Understanding and cooperation with system rules and safety policies.",
  "blackcard.consider.r3.t": "Internal standards",
  "blackcard.consider.r3.d": "Internal evaluation to maintain long-term quality.",

  "membership.helper.blackcard":
    "Black Card is a relationship-based access status. It is not a package that can be applied for or purchased.",
  "blackcard.helper.premium":
    "You are currently at the Premium level. With continued and appropriate usage, the system may consider additional status at the team’s discretion.",
  "blackcard.helper.vip":
    "You are in a high-priority group. The team will continue to evaluate appropriate levels of access.",

  "blackcard.internal.note":
    "Black Card access is granted manually by owner only. Do not disclose criteria or promise eligibility.",

  /* =====================================================
     PAY PAGES (/pay/*)
  ===================================================== */
  "pay.common.title": "Payment Confirmation",
  "pay.common.subtitle": "Please review the details before proceeding",
  "pay.common.reference": "Reference",
  "pay.common.status": "Status",
  "pay.common.amount": "Total Amount",
  "pay.common.currency": "THB",
  "pay.common.confirmed": "Confirmed",
  "pay.common.pending": "Pending",
  "pay.common.failed": "Failed",

  "pay.method.title": "Payment Method",
  "pay.method.promptpay": "PromptPay",
  "pay.method.creditcard": "Credit Card",
  "pay.method.banktransfer": "Bank Transfer",

  "pay.breakdown.title": "Payment Breakdown",
  "pay.breakdown.deposit": "Deposit",
  "pay.breakdown.balance": "Remaining Balance",
  "pay.breakdown.total": "Total",

  "pay.course.title": "Course Payment",
  "pay.course.program": "Program",
  "pay.course.private": "Private Edition",
  "pay.course.note": "A 30% deposit is required to confirm your booking",

  "pay.travel.title": "Travel Job Payment",
  "pay.travel.location": "Location",
  "pay.travel.date": "Date",
  "pay.travel.time": "Time",

  "pay.membership.title": "Membership Payment",
  "pay.membership.tier": "Membership Tier",
  "pay.membership.duration": "Duration",
  "pay.membership.active": "Activated",

  "pay.points.title": "Reward Points",
  "pay.points.earned": "Points Earned",
  "pay.points.total": "Total Points",
  "pay.points.rule": "Every 1,000 THB = 1 point",
  "pay.points.threshold": "At 120 points, a Telegram approval notification will be triggered",

  "pay.cta.confirm": "Confirm Payment",
  "pay.cta.print": "Print / Save PDF",
  "pay.cta.back": "Back",
  "pay.cta.support": "Contact Support",

  "pay.terms.title": "Terms & Conditions",
  "pay.terms.item1": "All information is confidential",
  "pay.terms.item2": "Payments are non-refundable",
  "pay.terms.item3": "Any changes require MMD approval",

  /* =====================================================
     RENEWAL (/pay/renewal)
  ===================================================== */
  "renewal.eyebrow": "MMD PRIVÉ • RENEWAL",
  "renewal.title": "Renew Your MMD Privé Membership",
  "renewal.desc": "Select your renewal option. The system will calculate the amount and generate a QR code instantly.",

  "renewal.badge.fast": "FAST RENEWAL",
  "renewal.badge.secure": "SECURE PAYMENT",
  "renewal.badge.support": "PREMIUM SUPPORT",

  "renewal.section.payment": "Renewal Payment",
  "renewal.section.payment.desc": "Choose an option or enter an amount, then pay via PromptPay or PayPal.",

  "renewal.step.1": "STEP 1 — Select Package / Duration",
  "renewal.step.2": "STEP 2 — Choose Payment Method",

  "renewal.pkg.standard": "Standard Renewal",
  "renewal.pkg.premium": "Premium Renewal",
  "renewal.pkg.blackcard": "Black Card Renewal",
  "renewal.pkg.7days": "7 Days Guest Pass",

  "renewal.label.promo": "Promo code (optional)",
  "renewal.label.email": "Customer email (optional)",
  "renewal.label.name": "Name (optional)",
  "renewal.label.member_id": "Member ID (optional)",

  "renewal.summary.base": "Base price",
  "renewal.summary.discount": "Discount",
  "renewal.summary.total": "Pay amount",

  "renewal.btn.recalc": "Recalculate",
  "renewal.btn.notify": "Notify Team",

  "renewal.method.promptpay": "PromptPay (QR)",
  "renewal.method.promptpay.desc": "Auto-generated QR based on the payable amount.",

  "renewal.method.ktb": "KTB Bank (Transfer)",
  "renewal.method.paypal": "PayPal",
  "renewal.method.paypal.fee": "Service charge 4%",

  "renewal.promptpay.id": "PromptPay ID",
  "renewal.promptpay.link": "Link",

  "renewal.status.ready": "Status: Ready",
  "renewal.status.sending": "Sending…",
  "renewal.status.security": "Verifying security…",
  "renewal.status.success": "Success: Team notified",
  "renewal.status.fail": "Failed: Request not successful"
});


/* =====================================================
   ZH (Simplified)
===================================================== */
window.I18N_DICT.zh = Object.assign({}, window.I18N_DICT.zh || {}, {

  /* Language */
  "lang.th": "泰",
  "lang.en": "English",
  "lang.zh": "中文",
  "lang.jp": "日本語",

  /* Benefits Lite */
  "benefits_lite.title": "权益",
  "benefits_lite.hero.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
  "benefits_lite.hero.h": "会员权益概览",
  "benefits_lite.hero.p": "以精简方式呈现不同层级权限，帮助你按实际使用选择方案。",
  "benefits_lite.hero.cta_primary": "查看完整权益",
  "benefits_lite.hero.cta_secondary": "黑卡",

  "benefits_lite.section.overview": "快速概览",
  "benefits_lite.section.compare": "权益对比表",
  "benefits_lite.note": "注：权益与规则可能会随时间调整，由团队酌情决定。",

  "benefits_lite.preview.t": "Preview",
  "benefits_lite.preview.d": "在订阅前了解系统与访问方式，以评估是否适合。",
  "benefits_lite.guest.t": "7 Days Guest Pass",
  "benefits_lite.guest.d": "7 天体验，适合短期使用或旅行期间。",
  "benefits_lite.standard.t": "Standard",
  "benefits_lite.standard.d": "入门级会员：结构清晰，适合持续使用。",
  "benefits_lite.premium.t": "Premium",
  "benefits_lite.premium.d": "更高优先级与更完整权限，适合重度用户。",
  "benefits_lite.black.t": "Black Card",
  "benefits_lite.black.d": "关系层级访问，团队会在合适时机说明细节。",

  /* Comparison */
  "comparison.title": "权益对比表",
  "comparison.sub": "快速浏览全局，再选择方案。",

  "comparison.pkg.guest": "7 Days Guest Pass",
  "comparison.pkg.standard": "Standard",
  "comparison.pkg.premium": "Premium",
  "comparison.pkg.black": "Black Card",

  "comparison.row.suitable": "适合人群",
  "comparison.row.duration": "有效期",
  "comparison.row.services": "可用服务类型",
  "comparison.row.public": "Public Models",
  "comparison.row.private_std": "Private Standard Models",
  "comparison.row.private_pre": "Private Premium Models",
  "comparison.row.exclusive": "Exclusive Models",
  "comparison.row.drive": "Google Drive 访问",
  "comparison.row.telegram": "Telegram 群组",
  "comparison.row.trial": "Premium 体验",

  "comparison.val.suitable.guest": "体验 / 短期使用",
  "comparison.val.duration.guest": "7 天",
  "comparison.val.services.guest": "Travel / Extreme（仅 Public）",
  "comparison.val.public.guest": "包含",
  "comparison.val.private_std.guest": "不包含",
  "comparison.val.private_pre.guest": "不包含",
  "comparison.val.exclusive.guest": "不包含",
  "comparison.val.drive.guest": "不包含",
  "comparison.val.telegram.guest": "不包含",
  "comparison.val.trial.guest": "包含（7 天）",

  "comparison.val.suitable.standard": "全年标准使用",
  "comparison.val.duration.standard": "365 天",
  "comparison.val.services.standard": "Public + Private（Standard）",
  "comparison.val.public.standard": "包含",
  "comparison.val.private_std.standard": "包含",
  "comparison.val.private_pre.standard": "不包含",
  "comparison.val.exclusive.standard": "不包含",
  "comparison.val.drive.standard": "Standard",
  "comparison.val.telegram.standard": "Standard 群组",
  "comparison.val.trial.standard": "不包含",

  "comparison.val.suitable.premium": "完整 Premium 权限",
  "comparison.val.duration.premium": "365 天",
  "comparison.val.services.premium": "All Standard + Private（Premium）",
  "comparison.val.public.premium": "包含",
  "comparison.val.private_std.premium": "包含",
  "comparison.val.private_pre.premium": "包含",
  "comparison.val.exclusive.premium": "按使用条件解锁",
  "comparison.val.drive.premium": "Standard + Premium",
  "comparison.val.telegram.premium": "Standard + Premium 群组",
  "comparison.val.trial.premium": "不包含",

  "comparison.val.suitable.black": "最高级长期权限",
  "comparison.val.duration.black": "5 年",
  "comparison.val.services.black": "All Access + Exclusive",
  "comparison.val.public.black": "包含",
  "comparison.val.private_std.black": "包含",
  "comparison.val.private_pre.black": "包含",
  "comparison.val.exclusive.black": "立即全部包含",
  "comparison.val.drive.black": "All Access",
  "comparison.val.telegram.black": "All Access",
  "comparison.val.trial.black": "不包含",

  "comparison.premium.rule.title": "Premium 的 Exclusive 规则",
  "comparison.premium.rule.r2": "使用 2 次及以上：解锁精选 Exclusive Models",
  "comparison.premium.rule.r3": "使用 3 次及以上：访问 Secret Exclusive Models",
  "comparison.premium.rule.note": "权限为递进式，并受系统条件约束。",

  "comparison.note.vip": "在 365 天内累计账单消费超过 120,000 泰铢，可立即进入 Telegram：MMD VIP Lounge。",
  "comparison.note.expiry": "会员到期后将立即移除 Google Drive 访问权限；Telegram Standard 可能保留。",

  /* Black Card (core + hero/sections) */
  "blackcard.eyebrow": "MMD PRIVÉ • 黑卡",
  "blackcard.title": "Black Card 状态",
  "blackcard.intro": "Black Card 不是套餐，也无法申请或购买，而是 MMD Privé 内部最高级别的关系型访问权限。",

  "blackcard.section.what": "Black Card 是什么",
  "blackcard.what.desc": "Black Card 建立在长期合作、系统理解与整体适配度之上，而不仅仅取决于消费金额。",

  "blackcard.section.compare": "概念对比",
  "blackcard.compare.premium": "Premium 是结构清晰的套餐型权限，适合希望明确权益与优先级的深度用户。",
  "blackcard.compare.blackcard": "Black Card 属于关系型访问，决策与照顾方式取决于当下的情境与长期信任。",

  "blackcard.note": "说明：Black Card 仅由团队评估并主动告知，不提供申请流程、表单或固定价格。",

  "blackcard.hero.eyebrow": "MMD PRIVÉ • 黑卡",
  "blackcard.hero.h": "Black Card",
  "blackcard.hero.p": "Black Card 是基于关系的访问状态，并非可直接购买的计划。状态将根据持续使用、可靠性与整体适配度授予。",
  "blackcard.hero.cta_primary": "查看会员",
  "blackcard.hero.cta_secondary": "查看权益概览",

  "blackcard.section.what.title": "Black Card 是什么",
  "blackcard.section.what.sub": "系统最高级访问，强调信任、连续性与情境适配。",

  "blackcard.what.r1.t": "关系型访问",
  "blackcard.what.r1.d": "并非可购买套餐，而是基于内部评估授予的状态。",
  "blackcard.what.r2.t": "最高优先级",
  "blackcard.what.r2.d": "在联系、协调与访问层面提供最高优先处理。",
  "blackcard.what.r3.t": "情境式权限",
  "blackcard.what.r3.d": "访问范围并非固定，将在合适时机说明。",

  "blackcard.section.consider.title": "关于评估",
  "blackcard.section.consider.sub": "以下为参考指引，并非固定条件；将综合评估。",

  "blackcard.consider.r1.t": "连续性",
  "blackcard.consider.r1.d": "长期、稳定的使用与适当沟通。",
  "blackcard.consider.r2.t": "信任与安全",
  "blackcard.consider.r2.d": "理解并配合系统规则与安全政策。",
  "blackcard.consider.r3.t": "内部标准",
  "blackcard.consider.r3.d": "用于维持长期质量的内部评估标准。",

  /* Helpers */
  "membership.helper.blackcard":
    "Black Card 是一种基于关系的访问状态，并非可直接申请或购买的套餐。",
  "blackcard.helper.premium":
    "您目前处于 Premium 等级。若持续合理使用，系统将根据团队判断评估进一步的访问状态。",
  "blackcard.helper.vip":
    "您属于系统重点关注的用户群体，团队将持续评估适当的访问级别。",

  /* =====================================================
     PAY PAGES (/pay/*) — ZH
  ===================================================== */
  "pay.common.title": "付款确认",
  "pay.common.subtitle": "请在继续前确认以下信息",
  "pay.common.reference": "参考编号",
  "pay.common.status": "状态",
  "pay.common.amount": "总金额",
  "pay.common.currency": "泰铢",
  "pay.common.confirmed": "已确认",
  "pay.common.pending": "处理中",
  "pay.common.failed": "失败",

  "pay.method.title": "付款方式",
  "pay.method.promptpay": "PromptPay",
  "pay.method.creditcard": "信用卡",
  "pay.method.banktransfer": "银行转账",

  "pay.breakdown.title": "费用明细",
  "pay.breakdown.deposit": "定金",
  "pay.breakdown.balance": "剩余金额",
  "pay.breakdown.total": "总计",

  "pay.course.title": "课程付款",
  "pay.course.program": "课程名称",
  "pay.course.private": "私人课程",
  "pay.course.note": "需支付 30% 定金以确认预约",

  "pay.travel.title": "行程项目付款",
  "pay.travel.location": "地点",
  "pay.travel.date": "日期",
  "pay.travel.time": "时间",

  "pay.membership.title": "会员付款",
  "pay.membership.tier": "会员等级",
  "pay.membership.duration": "期限",
  "pay.membership.active": "已启用",

  "pay.points.title": "积分",
  "pay.points.earned": "获得积分",
  "pay.points.total": "累计积分",
  "pay.points.rule": "每消费 1,000 泰铢 = 1 积分",
  "pay.points.threshold": "累计 120 积分后，系统将通知审核加入 Telegram",

  "pay.cta.confirm": "确认付款",
  "pay.cta.print": "打印 / 保存 PDF",
  "pay.cta.back": "返回",
  "pay.cta.support": "联系客服",

  "pay.terms.title": "条款与条件",
  "pay.terms.item1": "所有信息均为机密",
  "pay.terms.item2": "付款后不可退款",
  "pay.terms.item3": "任何变更需经 MMD 确认",

  /* =====================================================
     RENEWAL (/pay/renewal) — ZH
  ===================================================== */
  "renewal.eyebrow": "MMD PRIVÉ • 续费",
  "renewal.title": "续费 MMD Privé 会员",
  "renewal.desc": "请选择续费方案，系统将自动计算金额并生成二维码。",

  "renewal.badge.fast": "快速续费",
  "renewal.badge.secure": "安全支付",
  "renewal.badge.support": "专属支持",

  "renewal.section.payment": "续费付款",
  "renewal.section.payment.desc": "选择方案或自行输入金额，然后通过 PromptPay 或 PayPal 付款。",

  "renewal.step.1": "步骤 1 — 选择套餐 / 期限",
  "renewal.step.2": "步骤 2 — 选择付款方式",

  "renewal.pkg.standard": "Standard 续费",
  "renewal.pkg.premium": "Premium 续费",
  "renewal.pkg.blackcard": "Black Card 续费",
  "renewal.pkg.7days": "7 天体验",

  "renewal.label.promo": "优惠码（如有）",
  "renewal.label.email": "邮箱（可选）",
  "renewal.label.name": "姓名（可选）",
  "renewal.label.member_id": "会员 ID（可选）",

  "renewal.summary.base": "原价",
  "renewal.summary.discount": "折扣",
  "renewal.summary.total": "应付金额",

  "renewal.btn.recalc": "重新计算",
  "renewal.btn.notify": "通知团队",

  "renewal.method.promptpay": "PromptPay（二維碼）",
  "renewal.method.promptpay.desc": "根据应付金额自动生成二维码",

  "renewal.method.ktb": "KTB 银行转账",
  "renewal.method.paypal": "PayPal",
  "renewal.method.paypal.fee": "服务费 4%",

  "renewal.promptpay.id": "PromptPay ID",
  "renewal.promptpay.link": "链接",

  "renewal.status.ready": "状态：可用",
  "renewal.status.sending": "正在发送…",
  "renewal.status.security": "安全验证中…",
  "renewal.status.success": "成功：已通知团队",
  "renewal.status.fail": "失败：发送未成功"
});


/* =====================================================
   JP
===================================================== */
window.I18N_DICT.jp = Object.assign({}, window.I18N_DICT.jp || {}, {

  /* Language */
  "lang.th": "TH",
  "lang.en": "English",
  "lang.zh": "中文",
  "lang.jp": "日本語",

  /* Benefits Lite */
  "benefits_lite.title": "特典",
  "benefits_lite.hero.eyebrow": "MMD PRIVÉ • MEMBERSHIP",
  "benefits_lite.hero.h": "会員特典（サマリー）",
  "benefits_lite.hero.p": "利用スタイルに合わせて選べるよう、権限の要点を簡潔にまとめています。",
  "benefits_lite.hero.cta_primary": "特典を詳しく見る",
  "benefits_lite.hero.cta_secondary": "Black Card",

  "benefits_lite.section.overview": "クイック概要",
  "benefits_lite.section.compare": "特典比較",
  "benefits_lite.note": "注：権限と条件は状況により更新される場合があります。",

  "benefits_lite.preview.t": "Preview",
  "benefits_lite.preview.d": "加入前にシステムとアクセス方針を確認し、適合性を判断できます。",
  "benefits_lite.guest.t": "7 Days Guest Pass",
  "benefits_lite.guest.d": "7日間のトライアル。短期利用や旅行期間に適しています。",
  "benefits_lite.standard.t": "Standard",
  "benefits_lite.standard.d": "入門層。構造が明確で、継続利用に向きます。",
  "benefits_lite.premium.t": "Premium",
  "benefits_lite.premium.d": "優先度が高く、より包括的なアクセス。ヘビーユーザー向け。",
  "benefits_lite.black.t": "Black Card",
  "benefits_lite.black.d": "関係性レベルのアクセス。詳細は適切なタイミングで案内されます。",

  /* Comparison */
  "comparison.title": "特典比較",
  "comparison.sub": "全体像を素早く確認してから選べます。",

  "comparison.pkg.guest": "7 Days Guest Pass",
  "comparison.pkg.standard": "Standard",
  "comparison.pkg.premium": "Premium",
  "comparison.pkg.black": "Black Card",

  "comparison.row.suitable": "おすすめ",
  "comparison.row.duration": "期間",
  "comparison.row.services": "利用可能サービス",
  "comparison.row.public": "Public Models",
  "comparison.row.private_std": "Private Standard Models",
  "comparison.row.private_pre": "Private Premium Models",
  "comparison.row.exclusive": "Exclusive Models",
  "comparison.row.drive": "Google Drive アクセス",
  "comparison.row.telegram": "Telegram グループ",
  "comparison.row.trial": "Premium トライアル",

  "comparison.val.suitable.guest": "トライアル / 短期利用",
  "comparison.val.duration.guest": "7日",
  "comparison.val.services.guest": "Travel / Extreme（Publicのみ）",
  "comparison.val.public.guest": "含む",
  "comparison.val.private_std.guest": "含まない",
  "comparison.val.private_pre.guest": "含まない",
  "comparison.val.exclusive.guest": "含まない",
  "comparison.val.drive.guest": "含まない",
  "comparison.val.telegram.guest": "含まない",
  "comparison.val.trial.guest": "含む（7日）",

  "comparison.val.suitable.standard": "年間の標準利用",
  "comparison.val.duration.standard": "365日",
  "comparison.val.services.standard": "Public + Private（Standard）",
  "comparison.val.public.standard": "含む",
  "comparison.val.private_std.standard": "含む",
  "comparison.val.private_pre.standard": "含まない",
  "comparison.val.exclusive.standard": "含まない",
  "comparison.val.drive.standard": "Standard",
  "comparison.val.telegram.standard": "Standard Group",
  "comparison.val.trial.standard": "含まない",

  "comparison.val.suitable.premium": "Premium をフル活用",
  "comparison.val.duration.premium": "365日",
  "comparison.val.services.premium": "All Standard + Private（Premium）",
  "comparison.val.public.premium": "含む",
  "comparison.val.private_std.premium": "含む",
  "comparison.val.private_pre.premium": "含む",
  "comparison.val.exclusive.premium": "利用条件により解放",
  "comparison.val.drive.premium": "Standard + Premium",
  "comparison.val.telegram.premium": "Standard + Premium Group",
  "comparison.val.trial.premium": "含まない",

  "comparison.val.suitable.black": "最上位の長期アクセス",
  "comparison.val.duration.black": "5年",
  "comparison.val.services.black": "All Access + Exclusive",
  "comparison.val.public.black": "含む",
  "comparison.val.private_std.black": "含む",
  "comparison.val.private_pre.black": "含む",
  "comparison.val.exclusive.black": "即時フル含有",
  "comparison.val.drive.black": "All Access",
  "comparison.val.telegram.black": "All Access",
  "comparison.val.trial.black": "含まない",

  "comparison.premium.rule.title": "Premium の Exclusive ルール",
  "comparison.premium.rule.r2": "利用2回以上：厳選 Exclusive Models を解放",
  "comparison.premium.rule.r3": "利用3回以上：Secret Exclusive Models にアクセス",
  "comparison.premium.rule.note": "アクセスは段階式で、システム条件に基づきます。",

  "comparison.note.vip": "365日以内の合算請求が 120,000 THB を超えると、Telegram：MMD VIP Lounge に即時アクセス可能。",
  "comparison.note.expiry": "会員期限切れ後、Google Drive アクセスは即時解除。Telegram Standard は維持される場合があります。",

  /* Black Card (JP requested) */
  "blackcard.title": "ブラックカード",

  "blackcard.hero.eyebrow": "MMD PRIVÉ • BLACK CARD",
  "blackcard.hero.h": "Black Card",
  "blackcard.hero.p":
    "Black Card は関係性に基づくアクセスステータスです。直接購入できるプランではなく、継続的な利用、信頼性、総合的な適合性をもとに付与されます。",
  "blackcard.hero.cta_primary": "メンバーシップを見る",
  "blackcard.hero.cta_secondary": "特典概要を見る",

  "blackcard.section.what.title": "Black Card とは",
  "blackcard.section.what.sub":
    "信頼と継続性、状況適合性を重視した、システム最高レベルのアクセスです。",

  "blackcard.what.r1.t": "リレーションシップ型",
  "blackcard.what.r1.d":
    "購入可能なプランではなく、内部基準に基づき付与されるステータスです。",

  "blackcard.what.r2.t": "最優先対応",
  "blackcard.what.r2.d":
    "連絡・調整・アクセスにおいて最優先で対応されます。",

  "blackcard.what.r3.t": "状況ベースのアクセス",
  "blackcard.what.r3.d":
    "アクセス範囲は固定されておらず、適切なタイミングで説明されます。",

  "blackcard.section.consider.title": "検討基準について",
  "blackcard.section.consider.sub":
    "以下は参考指針であり、固定条件ではありません。総合的に判断されます。",

  "blackcard.consider.r1.t": "継続性",
  "blackcard.consider.r1.d":
    "長期的かつ安定した利用と丁寧なコミュニケーション。",

  "blackcard.consider.r2.t": "信頼と安全",
  "blackcard.consider.r2.d":
    "システムルールおよび安全方針への理解と協力。",

  "blackcard.consider.r3.t": "内部基準",
  "blackcard.consider.r3.d":
    "長期的な品質維持のための内部評価基準。",

  /* Helpers (JP) */
  "membership.helper.blackcard":
    "Black Card は関係性に基づくアクセスステータスであり、直接申し込み・購入できるプランではありません。",

  /* =====================================================
     PAY PAGES (/pay/*) — JP
  ===================================================== */
  "pay.common.title": "支払い確認",
  "pay.common.subtitle": "続行する前に内容をご確認ください",
  "pay.common.reference": "参照番号",
  "pay.common.status": "ステータス",
  "pay.common.amount": "合計金額",
  "pay.common.currency": "THB",
  "pay.common.confirmed": "確認済み",
  "pay.common.pending": "処理中",
  "pay.common.failed": "失敗",

  "pay.method.title": "支払い方法",
  "pay.method.promptpay": "PromptPay",
  "pay.method.creditcard": "クレジットカード",
  "pay.method.banktransfer": "銀行振込",

  "pay.breakdown.title": "支払い内訳",
  "pay.breakdown.deposit": "デポジット",
  "pay.breakdown.balance": "残額",
  "pay.breakdown.total": "合計",

  "pay.course.title": "コース支払い",
  "pay.course.program": "コース名",
  "pay.course.private": "プライベート",
  "pay.course.note": "予約確定のため、30% のデポジットが必要です",

  "pay.travel.title": "トラベル案件支払い",
  "pay.travel.location": "場所",
  "pay.travel.date": "日付",
  "pay.travel.time": "時間",

  "pay.membership.title": "会員支払い",
  "pay.membership.tier": "会員ランク",
  "pay.membership.duration": "期間",
  "pay.membership.active": "有効化済み",

  "pay.points.title": "ポイント",
  "pay.points.earned": "獲得ポイント",
  "pay.points.total": "累計ポイント",
  "pay.points.rule": "1,000 THB ごとに 1 ポイント",
  "pay.points.threshold": "120 ポイント到達時、Telegram 承認通知が送信されます",

  "pay.cta.confirm": "支払いを確認",
  "pay.cta.print": "印刷 / PDF 保存",
  "pay.cta.back": "戻る",
  "pay.cta.support": "サポートに連絡",

  "pay.terms.title": "利用規約",
  "pay.terms.item1": "すべての情報は機密です",
  "pay.terms.item2": "支払い後の返金はできません",
  "pay.terms.item3": "変更には MMD の承認が必要です",

  /* =====================================================
     RENEWAL (/pay/renewal) — JP
  ===================================================== */
  "renewal.eyebrow": "MMD PRIVÉ • 更新",
  "renewal.title": "MMD Privé 会員の更新",
  "renewal.desc": "更新プランを選択してください。金額は自動計算され、QR が生成されます。",

  "renewal.badge.fast": "迅速更新",
  "renewal.badge.secure": "安全な支払い",
  "renewal.badge.support": "プレミアムサポート",

  "renewal.section.payment": "更新支払い",
  "renewal.section.payment.desc": "プランを選択、または金額を入力し、PromptPay または PayPal で支払います。",

  "renewal.step.1": "STEP 1 — プラン / 期間を選択",
  "renewal.step.2": "STEP 2 — 支払い方法を選択",

  "renewal.pkg.standard": "Standard 更新",
  "renewal.pkg.premium": "Premium 更新",
  "renewal.pkg.blackcard": "Black Card 更新",
  "renewal.pkg.7days": "7 日間ゲスト",

  "renewal.label.promo": "プロモコード（任意）",
  "renewal.label.email": "メール（任意）",
  "renewal.label.name": "名前（任意）",
  "renewal.label.member_id": "会員 ID（任意）",

  "renewal.summary.base": "基本価格",
  "renewal.summary.discount": "割引",
  "renewal.summary.total": "支払金額",

  "renewal.btn.recalc": "再計算",
  "renewal.btn.notify": "チームに通知",

  "renewal.method.promptpay": "PromptPay（QR）",
  "renewal.method.promptpay.desc": "支払金額に基づいて QR を自動生成",

  "renewal.method.ktb": "KTB 銀行振込",
  "renewal.method.paypal": "PayPal",
  "renewal.method.paypal.fee": "手数料 4%",

  "renewal.promptpay.id": "PromptPay ID",
  "renewal.promptpay.link": "リンク",

  "renewal.status.ready": "ステータス：利用可能",
  "renewal.status.sending": "送信中…",
  "renewal.status.security": "セキュリティ確認中…",
  "renewal.status.success": "成功：チームに通知済み",
  "renewal.status.fail": "失敗：送信できませんでした"
});
