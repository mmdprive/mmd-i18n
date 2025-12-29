/* =========================================
   MMD Privé i18n – Japanese (ja)
   File: assets/js/i18n/ja.js
   ========================================= */

window.I18N_DICT = window.I18N_DICT || {};

window.I18N_DICT.ja = Object.assign({}, window.I18N_DICT.ja || {}, {

  /* ===== Package Names ===== */
  "comparison.pkg.guest": "7日ゲストパス",
  "comparison.pkg.standard": "スタンダードパッケージ",
  "comparison.pkg.premium": "プレミアムパッケージ",
  "comparison.pkg.black": "ブラックカード",

  /* ===== Row Labels ===== */
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

  /* ===== Values: Guest ===== */
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

  /* ===== Values: Standard ===== */
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

  /* ===== Values: Premium ===== */
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

  /* ===== Values: Black Card ===== */
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

  /* ===== Premium Progressive Rule ===== */
  "comparison.premium.rule.title": "Premium 専属ルール",
  "comparison.premium.rule.r2": "2回以上利用：厳選エクスクルーシブモデルを解放",
  "comparison.premium.rule.r3": "3回以上利用：シークレット専属モデルにアクセス可能",
  "comparison.premium.rule.note": "権限は段階的に付与され、条件に基づきます",

  /* ===== Notes ===== */
  "comparison.note.vip":
    "365日以内の累計利用額が120,000バーツを超えると、Telegram：MMD VIP Lounge へ即時参加できます。",
  "comparison.note.expiry":
    "有効期限終了後、Google Drive アクセスは即時停止され、Telegram Standard のみが維持されます。"

});
