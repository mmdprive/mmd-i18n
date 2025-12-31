/* =========================================
   i18n Dictionary – MMD Privé (LOCK)
   - Add/override only (safe merge)
   - Benefits Lite + Comparison + Black Card
========================================= */

window.I18N_DICT = window.I18N_DICT || {};

Object.assign(window.I18N_DICT, {

  /* =======================
     TH
  ======================= */
  th: Object.assign({}, window.I18N_DICT.th || {}, {

    /* Language labels */
    "lang.th": "ไทย",
    "lang.en": "English",
    "lang.zh": "中文",
    "lang.jp": "日本語",

    /* Benefits Lite */
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

    /* Comparison */
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

    /* Black Card */
    "blackcard.eyebrow": "MMD PRIVÉ • BLACK CARD",
    "blackcard.title": "Black Card Status",
    "blackcard.intro": "Black Card ไม่ใช่แพ็กเกจ และไม่ใช่สิ่งที่สามารถสมัครหรือซื้อได้ แต่เป็นสถานะความสัมพันธ์ระดับสูงสุดภายในระบบของ MMD Privé",

    "blackcard.section.what": "What Black Card Is",
    "blackcard.what.desc": "Black Card คือระดับการเข้าถึงที่เกิดจากความต่อเนื่อง ความเข้าใจระบบ และความเหมาะสมในระยะยาว ไม่ได้อิงจากยอดเงินเพียงอย่างเดียว",

    "blackcard.section.compare": "Conceptual Comparison",
    "blackcard.compare.premium": "Premium คือการเข้าถึงแบบแพ็กเกจ โครงสร้างชัด สิทธิ์ครบ และมีลำดับความสำคัญสูง เหมาะกับผู้ใช้งานจริงจังที่ต้องการระบบที่คาดการณ์ได้",
    "blackcard.compare.blackcard": "Black Card คือการเข้าถึงเชิงความสัมพันธ์ ไม่ยึดติดกับโครงสร้างแพ็กเกจ การดูแลและการตัดสินใจขึ้นกับบริบทและความเหมาะสมในแต่ละช่วงเวลา",

    "blackcard.note": "หมายเหตุ: Black Card จะถูกพิจารณาและแจ้งให้ทราบโดยทีมเท่านั้น ไม่มีขั้นตอนการสมัคร ไม่มีฟอร์ม และไม่มีราคากำหนด"
  }),

/* =======================
   EN
======================= */
  en: Object.assign({}, window.I18N_DICT.en || {}, {

    "lang.th": "TH",
    "lang.en": "English",
    "lang.zh": "中文",
    "lang.jp": "日本語",

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

    "blackcard.eyebrow": "MMD PRIVÉ • BLACK CARD",
    "blackcard.title": "Black Card Status",
    "blackcard.intro": "Black Card is not a package and cannot be applied for or purchased. It represents the highest relationship-based access within MMD Privé.",

    "blackcard.section.what": "What Black Card Is",
    "blackcard.what.desc": "Black Card access is built on continuity, understanding of the system, and long-term suitability — not spending alone.",

    "blackcard.section.compare": "Conceptual Comparison",
    "blackcard.compare.premium": "Premium is a structured package with defined benefits and priority, designed for serious users who value predictability.",
    "blackcard.compare.blackcard": "Black Card is relationship-based access. Decisions, care, and access are contextual rather than package-driven.",

    "blackcard.note": "Note: Black Card is granted and communicated by the team only. There is no application, form, or fixed price."
  }),

/* =======================
   ZH (Simplified)
======================= */
  zh: Object.assign({}, window.I18N_DICT.zh || {}, {

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

    /* Black Card */
    "blackcard.eyebrow": "MMD PRIVÉ • 黑卡",
    "blackcard.title": "Black Card 状态",
    "blackcard.intro": "Black Card 不是套餐，也无法申请或购买，而是 MMD Privé 内部最高级别的关系型访问权限。",

    "blackcard.section.what": "Black Card 是什么",
    "blackcard.what.desc": "Black Card 建立在长期合作、系统理解与整体适配度之上，而不仅仅取决于消费金额。",

    "blackcard.section.compare": "概念对比",
    "blackcard.compare.premium": "Premium 是结构清晰的套餐型权限，适合希望明确权益与优先级的深度用户。",
    "blackcard.compare.blackcard": "Black Card 属于关系型访问，决策与照顾方式取决于当下的情境与长期信任。",

    "blackcard.note": "说明：Black Card 仅由团队评估并主动告知，不提供申请流程、表单或固定价格。"
  }),

/* =======================
   JP
======================= */
  jp: Object.assign({}, window.I18N_DICT.jp || {}, {

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

    /* Black Card */
    "blackcard.eyebrow": "MMD PRIVÉ • BLACK CARD",
    "blackcard.title": "Black Card ステータス",
    "blackcard.intro": "Black Card はプランではなく、申し込みや購入ができるものではありません。MMD Privé における最上位の関係性アクセスです。",

    "blackcard.section.what": "What Black Card Is",
    "blackcard.what.desc": "Black Card は、継続性・システム理解・長期的な適合性に基づくアクセスであり、金額のみでは判断されません。",

    "blackcard.section.compare": "Conceptual Comparison",
    "blackcard.compare.premium": "Premium は構造化されたプラン型アクセスで、明確な特典と優先度を求めるユーザー向けです。",
    "blackcard.compare.blackcard": "Black Card は関係性ベースのアクセスで、判断や対応は状況と信頼関係に応じて行われます。",

    "blackcard.note": "注記：Black Card はチームからのみ案内されます。申請・フォーム・固定価格は存在しません。"
  })

});
