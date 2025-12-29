/* =========================================
   MMD Privé i18n – Thai (th)
   File: assets/js/i18n/th.js
   ========================================= */

window.I18N_DICT = window.I18N_DICT || {};

window.I18N_DICT.th = Object.assign({}, window.I18N_DICT.th || {}, {

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
  "comparison.note.vip":
    "ผู้ที่มียอดใช้จ่ายภายใน 365 วันบิลรวมเกิน 120,000 บาท จะได้รับสิทธิ์เข้ากลุ่ม Telegram: MMD VIP Lounge ทันที",
  "comparison.note.expiry":
    "เมื่อสมาชิกหมดอายุ จะถูกถอดออกจาก Google Drive ทันที และคงสิทธิ์ได้เฉพาะใน Telegram Standard เท่านั้น"

   /* ===== Benefits Lite (Per Lux • TH) ===== */
"benefits_lite.title": "Benefits",
"benefits_lite.hero.eyebrow": "MEMBERSHIP PAYMENT",
"benefits_lite.hero.h": "Membership Benefits",
"benefits_lite.hero.p": "ภาพรวมสิทธิ์แบบกระชับ เพื่อให้คุณเลือกแพ็กเกจได้ตรงระดับการใช้งาน",
"benefits_lite.hero.cta_primary": "ดูสิทธิ์แบบเต็ม",
"benefits_lite.hero.cta_secondary": "Black Card",

"benefits_lite.section.overview": "สรุปสิทธิ์แบบเร็ว",
"benefits_lite.section.compare": "ตารางเปรียบเทียบสิทธิ์",
"benefits_lite.note": "หมายเหตุ: สิทธิ์และเงื่อนไขอาจมีการปรับตามช่วงเวลา ความเหมาะสม และดุลยพินิจของทีม",

/* Cards (Per Lux tone) */
"benefits_lite.preview.t": "Preview",
"benefits_lite.preview.d": "สำรวจระบบและแนวทางการเข้าถึง เพื่อประเมินความเหมาะสมก่อนสมัคร",
"benefits_lite.guest.t": "7 Days Guest Pass",
"benefits_lite.guest.d": "ทดลองใช้งาน 7 วัน สำหรับการใช้งานระยะสั้นหรือช่วงเดินทาง",
"benefits_lite.standard.t": "Standard",
"benefits_lite.standard.d": "ทางเลือกเริ่มต้นสำหรับสมาชิก: โครงสร้างชัดเจน และใช้งานต่อเนื่อง",
"benefits_lite.premium.t": "Premium",
"benefits_lite.premium.d": "สิทธิ์ครบกว่าและลำดับความสำคัญสูงขึ้น เหมาะกับผู้ใช้งานจริงจัง",
"benefits_lite.black.t": "Black Card",
"benefits_lite.black.d": "ระดับความสัมพันธ์ ทีมจะแจ้งรายละเอียดเมื่อเหมาะสม",

/* Compare table */
"benefits_lite.table.col.feature": "หัวข้อ",
"benefits_lite.table.col.preview": "Preview",
"benefits_lite.table.col.guest7": "7 Days",
"benefits_lite.table.col.standard": "Standard",
"benefits_lite.table.col.premium": "Premium",
"benefits_lite.table.col.black": "Black",

"benefits_lite.table.row.drive": "คลังภาพ (Drive / Gallery)",
"benefits_lite.table.row.telegram": "Telegram Group",
"benefits_lite.table.row.updates": "อัปเดตคอนเทนต์ / ข่าวสาร",
"benefits_lite.table.row.support": "การดูแลและลำดับความสำคัญ",
"benefits_lite.table.row.access": "สิทธิ์ในการเข้าถึงระดับแพ็กเกจ",

"benefits_lite.table.val.preview_drive": "—",
"benefits_lite.table.val.guest7_drive": "ทดลอง (ระยะเวลา 7 วัน)",
"benefits_lite.table.val.standard_drive": "มาตรฐานสมาชิก",
"benefits_lite.table.val.premium_drive": "ครบกว่า + เร็วกว่า",
"benefits_lite.table.val.black_drive": "ตามดุลยพินิจทีม",

"benefits_lite.table.val.preview_tg": "—",
"benefits_lite.table.val.guest7_tg": "ทดลอง 7 วัน",
"benefits_lite.table.val.standard_tg": "Standard",
"benefits_lite.table.val.premium_tg": "Premium + Standard",
"benefits_lite.table.val.black_tg": "เฉพาะกรณี",

"benefits_lite.table.val.preview_updates": "ดูภาพรวมระบบ",
"benefits_lite.table.val.guest7_updates": "ระหว่างช่วงทดลอง",
"benefits_lite.table.val.standard_updates": "อัปเดตตามรอบ",
"benefits_lite.table.val.premium_updates": "อัปเดตต่อเนื่องกว่า",
"benefits_lite.table.val.black_updates": "ตามความเหมาะสม",

"benefits_lite.table.val.preview_support": "—",
"benefits_lite.table.val.guest7_support": "มาตรฐาน",
"benefits_lite.table.val.standard_support": "มาตรฐานสมาชิก",
"benefits_lite.table.val.premium_support": "Priority",
"benefits_lite.table.val.black_support": "Priority สูงสุด",

"benefits_lite.table.val.preview_access": "ทำความเข้าใจระบบ",
"benefits_lite.table.val.guest7_access": "ทดลองก่อนสมัคร",
"benefits_lite.table.val.standard_access": "สมาชิกเริ่มต้น",
"benefits_lite.table.val.premium_access": "สมาชิกเต็มรูปแบบ",
"benefits_lite.table.val.black_access": "เชิงความสัมพันธ์"

// TH — Benefits Lite (Per Lux)
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

"benefits_lite.note": "หมายเหตุ: สิทธิ์อาจอัปเดตตามช่วงเวลาและความเหมาะสม",

// TH — Compare table
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


});
