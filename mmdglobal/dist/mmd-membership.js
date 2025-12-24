
<!DOCTYPE html><!-- This site was created in Webflow. https://webflow.com --><!-- Last Published: Wed Dec 24 2025 22:14:46 GMT+0000 (Coordinated Universal Time) --><html data-wf-domain="mmdprive.webflow.io" data-wf-page="691d52c5df2f193755bed1b4" data-wf-site="68f879d546d2f4e2ab186e90" lang="en"><head><meta charset="utf-8"/><title>MMD Privé - Pay Membership</title><meta content="MMD Privé - Pay Membership" property="og:title"/><meta content="MMD Privé - Pay Membership" property="twitter:title"/><meta content="width=device-width, initial-scale=1" name="viewport"/><meta content="Webflow" name="generator"/><link href="https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/css/mmdprive.webflow.shared.a99d407c3.min.css" rel="stylesheet" type="text/css"/><link href="https://fonts.googleapis.com" rel="preconnect"/><link href="https://fonts.gstatic.com" rel="preconnect" crossorigin="anonymous"/><script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js" type="text/javascript"></script><script type="text/javascript">WebFont.load({  google: {    families: ["Outfit:regular,500,600,700,800,900","DM Sans:regular,500,600,700,800,900","Antonio:regular,500,600,700"]  }});</script><script type="text/javascript">!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);</script><link href="https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/68f879d646d2f4e2ab18711f_Small%20Fav%20Icon.svg" rel="shortcut icon" type="image/x-icon"/><link href="https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/691241b1fafe5c4d23cd6510_MMD%20Prive%20256.png" rel="apple-touch-icon"/><!-- Memberstack -->
<script data-memberstack-app="app_cmjajuv1600150su284ov77w1" src="https://static.memberstack.com/scripts/v2/memberstack.js"></script>

<!-- Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=DM+Sans:wght@400;500;600;700&family=Antonio:wght@400;500;600;700&display=swap" rel="stylesheet">

<!-- QRCode -->
<script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script>

<!-- Turnstile (ถ้าใช้ Notify endpoint) -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" async defer></script>

<!-- Master CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/mmdprive/mmd-i18n@refs/heads/main/assets/css/mmd-master.css?v=2025-LOCK-01">
</head><body><section><div class="w-layout-blockcontainer w-container"><div class="w-embed w-iframe w-script"><div id="mmd-membership" class="mmd-pay" data-lang="th" data-page="membership">

  <style>
    /* =========================
       MMD PAY — LUX THEME (Scoped)
       ========================= */
    #mmd-membership.mmd-pay{
      --bg0:#050506;
      --bg1:#0B0B0D;
      --card: rgba(255,255,255,.035);
      --card2: rgba(255,255,255,.022);
      --line: rgba(255,255,255,.11);
      --line2: rgba(255,255,255,.07);
      --text:#F4F2EE;
      --muted: rgba(244,242,238,.72);
      --muted2: rgba(244,242,238,.52);

      --gold:#C8A24F;
      --gold2:#E8D49A;

      --ok:#6EE7B7;
      --danger:#FF5A5F;

      --r14:14px;
      --r18:18px;
      --r22:22px;
      --r28:28px;

      --shadow: 0 26px 90px rgba(0,0,0,.62);
      --shadow2: 0 18px 60px rgba(0,0,0,.45);
      --glowGold: 0 0 0 1px rgba(200,162,79,.26), 0 18px 60px rgba(200,162,79,.10);
      --glowSoft: 0 0 0 1px rgba(255,255,255,.10), 0 18px 60px rgba(0,0,0,.55);

      font-family: "DM Sans", system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
      color: var(--text);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;

      /* กัน theme ภายนอกชน */
      position: relative;
      isolation: isolate;
    }

    #mmd-membership *{ box-sizing: border-box; }
    #mmd-membership img{ max-width:100%; display:block; }
    #mmd-membership a{ color:inherit; text-decoration:none; }

    /* Container */
    #mmd-membership .wrap{
      max-width: 1160px;
      margin: 0 auto;
      padding: 28px 18px 78px;
    }

    /* Topbar */
    #mmd-membership .topbar{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:14px;
      margin-bottom: 16px;
    }
    #mmd-membership .brand{
      display:flex;
      align-items:center;
      gap:12px;
      min-width: 240px;
    }
    #mmd-membership .brandLogo{
      width:46px;
      height:46px;
      border-radius: 14px;
      display:grid;
      place-items:center;
      background: rgba(255,255,255,.03);
      border: 1px solid var(--line2);
      overflow:hidden;
      box-shadow: var(--glowSoft);
    }
    #mmd-membership .brandLogo img{
      width:82%;
      height:auto;
      filter: contrast(1.03);
    }
    #mmd-membership .brandTxt{
      display:flex;
      flex-direction:column;
      gap:3px;
      line-height:1.05;
    }
    #mmd-membership .brandTxt .logo{
      font-family:"Antonio","Outfit",sans-serif;
      letter-spacing:.18em;
      font-size:16px;
    }
    #mmd-membership .brandTxt .sub{
      font-size:12px;
      color: var(--muted2);
    }

    /* Language switch */
    #mmd-membership .lang{
      display:flex;
      gap:8px;
      border-radius: 999px;
      padding: 6px;
      background: rgba(255,255,255,.035);
      border:1px solid var(--line2);
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      box-shadow: var(--glowSoft);
    }
    #mmd-membership .lang button{
      border:0;
      cursor:pointer;
      padding: 9px 13px;
      border-radius: 999px;
      background: transparent;
      color: var(--muted);
      font-weight: 900;
      font-size:12px;
      letter-spacing:.03em;
    }
    #mmd-membership .lang button.active{
      background: rgba(200,162,79,.18);
      color: var(--text);
      border:1px solid rgba(200,162,79,.28);
      box-shadow: var(--glowGold);
    }

    /* Hero */
    #mmd-membership .hero{
      display:grid;
      grid-template-columns: 1.06fr .94fr;
      gap:0;
      border:1px solid var(--line2);
      border-radius: var(--r28);
      overflow:hidden;
      background: linear-gradient(180deg, rgba(255,255,255,.035), rgba(255,255,255,.012));
      box-shadow: var(--shadow);
    }
    @media (max-width: 920px){
      #mmd-membership .hero{ grid-template-columns: 1fr; }
    }

    #mmd-membership .heroL{
      padding: 30px 26px 26px;
      position: relative;
    }
    #mmd-membership .eyebrow{
      display:flex;
      gap:10px;
      align-items:center;
      color: var(--muted2);
      font-weight: 900;
      font-size: 12px;
      letter-spacing: .12em;
      text-transform: uppercase;
    }
    #mmd-membership .eyebrow .dot{
      width:6px;
      height:6px;
      border-radius:50%;
      background: var(--gold);
      box-shadow: 0 0 0 3px rgba(200,162,79,.16);
    }
    #mmd-membership .h1{
      font-family:"Outfit", sans-serif;
      margin: 14px 0 12px;
      font-size: 42px;
      line-height: 1.04;
      letter-spacing: -0.02em;
    }
    @media (max-width: 520px){
      #mmd-membership .h1{ font-size: 34px; }
    }
    #mmd-membership .desc{
      color: var(--muted);
      font-size: 15px;
      line-height: 1.72;
      max-width: 62ch;
      margin: 0 0 18px;
    }

    #mmd-membership .heroActions{
      display:flex;
      justify-content:flex-start;
      margin-top: 18px;
    }
    @media (max-width:920px){
      #mmd-membership .heroActions{ justify-content:center; }
    }

    #mmd-membership .heroR{
      position: relative;
      background:#000;
      min-height: 340px;
    }
    #mmd-membership .heroR img{
      width:100%;
      height:100%;
      object-fit: cover;
      filter: contrast(1.03) saturate(1.02);
    }
    #mmd-membership .heroR::after{
      content:"";
      position:absolute; inset:0;
      background:
        radial-gradient(1200px 380px at 80% 20%, rgba(0,0,0,.10), rgba(0,0,0,.72)),
        linear-gradient(180deg, rgba(0,0,0,.12), rgba(0,0,0,.76));
      pointer-events:none;
    }

    /* Grid */
    #mmd-membership .grid{
      display:grid;
      grid-template-columns: 1fr .98fr;
      gap: 18px;
      margin-top: 18px;
    }
    @media (max-width: 920px){
      #mmd-membership .grid{ grid-template-columns: 1fr; }
    }

    /* Card shell */
    #mmd-membership .card{
      border: 1px solid var(--line2);
      border-radius: var(--r28);
      background: linear-gradient(180deg, rgba(255,255,255,.032), rgba(255,255,255,.014));
      box-shadow: var(--shadow2);
      overflow:hidden;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    #mmd-membership .cardHd{
      padding: 18px 18px 14px;
      border-bottom: 1px solid rgba(255,255,255,.06);
      display:flex;
      align-items:flex-start;
      justify-content:space-between;
      gap: 12px;
    }
    #mmd-membership .ttl{
      font-family:"Outfit", sans-serif;
      font-size: 16px;
      font-weight: 900;
      letter-spacing: .02em;
    }
    #mmd-membership .mini{
      font-size: 12px;
      color: var(--muted2);
      padding-top: 2px;
      text-align:right;
    }
    #mmd-membership .cardBd{ padding: 16px 18px 18px; }

    /* Form */
    #mmd-membership .fieldset{ margin: 0 0 14px; }
    #mmd-membership label.baseLabel{
      display:block;
      font-size: 12px;
      color: var(--muted2);
      margin: 0 0 8px;
      letter-spacing: .03em;
      font-weight: 900;
    }
    #mmd-membership input.text{
      width: 100%;
      border-radius: var(--r14);
      border: 1px solid rgba(255,255,255,.11);
      background: rgba(0,0,0,.34);
      color: var(--text);
      padding: 12px 12px;
      outline:none;
      font-size: 14px;
      transition: box-shadow .15s ease, border-color .15s ease;
    }
    #mmd-membership input.text:focus{
      border-color: rgba(200,162,79,.42);
      box-shadow: 0 0 0 4px rgba(200,162,79,.12);
    }
    #mmd-membership .row2{
      display:grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    @media (max-width: 520px){
      #mmd-membership .row2{ grid-template-columns: 1fr; }
    }

    /* Packages */
    #mmd-membership .pkgRow{ display:grid; gap: 10px; }
    #mmd-membership .pkg{
      display:flex;
      gap: 12px;
      padding: 14px 14px;
      border-radius: var(--r22);
      border: 1px solid rgba(255,255,255,.11);
      background: rgba(255,255,255,.02);
      cursor:pointer;
      transition: transform .14s ease, background .14s ease, border-color .14s ease, box-shadow .14s ease;
      position: relative;
    }
    #mmd-membership .pkg:hover{
      transform: translateY(-1px);
      border-color: rgba(200,162,79,.22);
      background: rgba(200,162,79,.05);
      box-shadow: 0 18px 60px rgba(0,0,0,.30);
    }
    #mmd-membership .pkg input{
      margin-top: 2px;
      width:auto;
      accent-color: var(--gold);
    }
    #mmd-membership .pkgMain{ flex:1; }
    #mmd-membership .pkgName{
      font-family:"Outfit",sans-serif;
      font-weight: 900;
      letter-spacing: .02em;
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap: 10px;
      font-size: 14px;
    }
    #mmd-membership .pkgName .price{
      color: var(--gold2);
      font-weight: 900;
      font-size: 14px;
    }
    #mmd-membership .pkgSub{
      color: var(--muted);
      font-size: 13px;
      margin-top: 6px;
      line-height: 1.58;
    }

    #mmd-membership .divider{
      height:1px;
      background: rgba(255,255,255,.06);
      margin: 16px 0;
    }

    /* Summary */
    #mmd-membership .summary{
      display:grid;
      gap: 10px;
      padding: 14px;
      border-radius: var(--r22);
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(0,0,0,.30);
    }
    #mmd-membership .sumRow{
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap: 12px;
      font-size: 13px;
      color: var(--muted);
    }
    #mmd-membership .sumRow strong{ color: var(--text); }
    #mmd-membership .sumFinal{
      padding-top: 10px;
      border-top: 1px solid rgba(255,255,255,.08);
      margin-top: 6px;
    }
    #mmd-membership .sumFinal .amt{
      font-family:"Outfit",sans-serif;
      font-size: 22px;
      letter-spacing: .02em;
      color: var(--gold2);
      font-weight: 900;
    }

    /* Buttons */
    #mmd-membership .btnRow{
      display:flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-top: 14px;
    }
    #mmd-membership .btn{
      border:0;
      cursor:pointer;
      padding: 12px 14px;
      border-radius: var(--r14);
      font-weight: 900;
      letter-spacing: .04em;
      font-size: 12px;
      text-transform: uppercase;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap: 10px;
      user-select:none;
      white-space: nowrap;
      transition: transform .12s ease, filter .12s ease, box-shadow .12s ease, background .12s ease, border-color .12s ease;
    }
    #mmd-membership .btn:active{ transform: translateY(1px); }

    #mmd-membership .btn.primary{
      color: #0A0A0A;
      background: linear-gradient(180deg, rgba(232,212,154,1), rgba(200,162,79,1));
      box-shadow: 0 14px 30px rgba(200,162,79,.16);
    }
    #mmd-membership .btn.primary:hover{ filter: brightness(1.03); box-shadow: 0 18px 40px rgba(200,162,79,.18); }

    #mmd-membership .btn.ghost{
      color: var(--text);
      background: rgba(255,255,255,.05);
      border: 1px solid rgba(255,255,255,.10);
    }
    #mmd-membership .btn.ghost:hover{
      border-color: rgba(200,162,79,.22);
      background: rgba(200,162,79,.05);
      box-shadow: 0 18px 60px rgba(0,0,0,.30);
    }

    #mmd-membership .btn.gold{
      min-width: 240px;
      color:#0A0A0A;
      background: linear-gradient(180deg, rgba(232,212,154,1), rgba(200,162,79,1));
      box-shadow: 0 14px 30px rgba(200,162,79,.16);
    }

    /* Payment methods (Premium) */
    #mmd-membership .payMethods{ display:grid; gap: 12px; margin-bottom: 14px; }

    #mmd-membership .method{
      border-radius: var(--r22);
      border: 1px solid rgba(255,255,255,.10);
      background: linear-gradient(180deg, rgba(255,255,255,.028), rgba(0,0,0,.26));
      padding: 14px 14px;
      display:flex;
      gap: 12px;
      align-items:flex-start;
      cursor:pointer;
      position: relative;
      transition: transform .14s ease, border-color .14s ease, box-shadow .14s ease, background .14s ease;
    }
    #mmd-membership .method:hover{
      transform: translateY(-1px);
      border-color: rgba(200,162,79,.18);
      box-shadow: 0 18px 60px rgba(0,0,0,.34);
    }

    /* Hide native radio, custom indicator */
    #mmd-membership .method input[type="radio"]{
      position:absolute;
      opacity:0;
      pointer-events:none;
    }
    #mmd-membership .methodIndicator{
      width: 18px;
      height: 18px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.18);
      background: rgba(0,0,0,.25);
      box-shadow: inset 0 0 0 3px rgba(0,0,0,.55);
      margin-top: 2px;
      flex: 0 0 auto;
      position: relative;
    }
    #mmd-membership .method.is-selected .methodIndicator{
      border-color: rgba(232,212,154,.55);
      box-shadow: 0 0 0 4px rgba(200,162,79,.12), inset 0 0 0 3px rgba(0,0,0,.55);
    }
    #mmd-membership .method.is-selected .methodIndicator::after{
      content:"";
      position:absolute;
      inset:4px;
      border-radius:999px;
      background: linear-gradient(180deg, rgba(232,212,154,1), rgba(200,162,79,1));
    }

    #mmd-membership .methodBody{ flex:1; min-width: 0; }
    #mmd-membership .methodTitle{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap: 10px;
      font-family:"Outfit",sans-serif;
      font-weight: 900;
      letter-spacing: .02em;
      font-size: 14px;
    }
    #mmd-membership .methodSub{
      color: var(--muted);
      font-size: 13px;
      line-height: 1.6;
      margin-top: 6px;
    }
    #mmd-membership .method.is-selected{
      border-color: rgba(200,162,79,.30);
      box-shadow: var(--glowGold);
      background: linear-gradient(180deg, rgba(200,162,79,.09), rgba(0,0,0,.26));
    }

    /* Pill */
    #mmd-membership .pill{
      font-size: 11px;
      font-weight: 900;
      letter-spacing: .10em;
      text-transform: uppercase;
      padding: 7px 10px;
      border-radius: 999px;
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.03);
      color: rgba(244,242,238,.88);
      white-space: nowrap;
      flex: 0 0 auto;
    }
    #mmd-membership .pill.gold{
      border-color: rgba(200,162,79,.28);
      background: rgba(200,162,79,.12);
      color: rgba(244,242,238,.92);
    }

    /* Copy button */
    #mmd-membership .copyBtn{
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.04);
      color: var(--text);
      border-radius: 12px;
      padding: 9px 10px;
      cursor:pointer;
      font-weight: 900;
      letter-spacing: .08em;
      font-size: 11px;
      text-transform: uppercase;
      transition: background .12s ease, border-color .12s ease, transform .12s ease;
      flex: 0 0 auto;
      margin-top: -2px;
    }
    #mmd-membership .copyBtn:hover{
      border-color: rgba(200,162,79,.26);
      background: rgba(200,162,79,.06);
    }
    #mmd-membership .copyBtn:active{ transform: translateY(1px); }

    /* PromptPay box */
    #mmd-membership .qrBox{
      display:grid;
      place-items:center;
      padding: 14px;
      border-radius: var(--r22);
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(0,0,0,.30);
      min-height: 280px;
      box-shadow: inset 0 0 0 1px rgba(255,255,255,.04);
    }
    #mmd-membership #qr{
      width: 220px;
      height: 220px;
      border-radius: 18px;
      overflow:hidden;
      background: #fff;
      padding: 10px;
      box-shadow: 0 18px 60px rgba(0,0,0,.25);
    }

    #mmd-membership .payMeta{
      display:grid;
      gap: 10px;
      margin-top: 12px;
    }
    #mmd-membership .kv{
      display:flex;
      justify-content:space-between;
      gap: 12px;
      font-size: 13px;
      color: var(--muted);
      padding: 12px 12px;
      border-radius: var(--r18);
      border: 1px solid rgba(255,255,255,.08);
      background: rgba(255,255,255,.02);
      align-items:center;
      min-width: 0;
    }
    #mmd-membership .kv b{ color: var(--text); font-weight: 900; }
    #mmd-membership .kv a{ font-weight: 900; }
    #mmd-membership .kv .truncate{
      overflow:hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 62%;
      text-align:right;
    }

    /* Status (keep minimal but premium) */
    #mmd-membership .status{
      margin-top: 12px;
      padding: 12px 12px;
      border-radius: var(--r18);
      border: 1px solid rgba(255,255,255,.10);
      background: rgba(255,255,255,.02);
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
    }
    #mmd-membership .status.ok{ border-color: rgba(110,231,183,.28); background: rgba(110,231,183,.06); }
    #mmd-membership .status.bad{ border-color: rgba(255,90,95,.28); background: rgba(255,90,95,.06); }

    /* Modal */
    #mmd-membership .modal{
      position:fixed;
      inset:0;
      background: rgba(0,0,0,.76);
      display:none;
      align-items:center;
      justify-content:center;
      padding: 18px;
      z-index: 9999;
    }
    #mmd-membership .modal.show{ display:flex; }
    #mmd-membership .modalCard{
      width: min(980px, 100%);
      height: min(80vh, 680px);
      border-radius: var(--r28);
      border: 1px solid rgba(255,255,255,.12);
      background: linear-gradient(180deg, rgba(255,255,255,.04), rgba(255,255,255,.02));
      box-shadow: var(--shadow);
      overflow:hidden;
      display:flex;
      flex-direction:column;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }
    #mmd-membership .modalHd{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap: 12px;
      padding: 12px 14px;
      border-bottom: 1px solid rgba(255,255,255,.08);
    }
    #mmd-membership .modalHd .mt{
      font-family:"Outfit",sans-serif;
      font-weight: 900;
      letter-spacing: .02em;
      font-size: 14px;
    }
    #mmd-membership .xBtn{
      border: 1px solid rgba(255,255,255,.12);
      background: rgba(255,255,255,.04);
      color: var(--text);
      border-radius: 12px;
      padding: 10px 12px;
      cursor:pointer;
      font-weight: 900;
      letter-spacing: .10em;
      font-size: 11px;
      text-transform: uppercase;
      transition: background .12s ease, border-color .12s ease;
    }
    #mmd-membership .xBtn:hover{
      border-color: rgba(200,162,79,.26);
      background: rgba(200,162,79,.06);
    }
    #mmd-membership .modalBody{ flex:1; background:#000; }
    #mmd-membership .modalBody iframe{
      width:100%;
      height:100%;
      border:0;
      background:#000;
    }

    #mmd-membership .footer{
      margin-top: 18px;
      color: rgba(244,242,238,.38);
      font-size: 11px;
      text-align:center;
    }

    /* Kill particles if global inject exists */
    #gold-particles,
    canvas#gold-particles,
    canvas[id*="particle" i],
    canvas[class*="particle" i]{
      display:none !important;
      opacity:0 !important;
      visibility:hidden !important;
      pointer-events:none !important;
    }
  </style>

  <div class="wrap">
    <div class="topbar">
      <div class="brand">
        <div class="brandLogo" aria-label="MMD Privé Logo">
          <img alt="MMD Privé" src="https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/694be4daa4af005bc77b8fec_MMD%20Prive%20transparentt.png">
        </div>
        <div class="brandTxt">
          <div class="logo">MMD PRIVÉ</div>
          <div class="sub" data-lang="th">Membership Payment</div>
          <div class="sub" data-lang="en" style="display:none;">Membership Payment</div>
        </div>
      </div>

      <div class="lang" role="tablist" aria-label="Language">
        <button type="button" class="active" data-set-lang="th">ไทย</button>
        <button type="button" data-set-lang="en">EN</button>
      </div>
    </div>

    <!-- HERO -->
    <section class="hero">
      <div class="heroL">
        <div class="eyebrow">
          <span class="dot"></span>
          <span data-lang="th">MMD PRIVÉ • MEMBERSHIP</span>
          <span data-lang="en" style="display:none;">MMD PRIVÉ • MEMBERSHIP</span>
        </div>

        <div class="h1" data-lang="th">สมัครสมาชิกแพคเกจรายปี</div>
        <div class="h1" data-lang="en" style="display:none;">Annual Membership Packages</div>

        <p class="desc" data-lang="th">
          Package private ของ MMD จะมีการเก็บค่าสมาชิกรายปี มีอยู่ 2 แพคเกจ คือ Standard และ Premium
          คุณสามารถเลือกแพคเกจที่ตรงกับความต้องการของคุณได้ ถ้าหากคุณเป็นนักท่องเที่ยว หรืออาจใช้บริการในช่วงเวลาไม่นาน
          เรามี 7 Days Guest Pass ให้ทดลองใช้ภายใน 7 วัน
        </p>
        <p class="desc" data-lang="en" style="display:none;">
          MMD private packages are billed annually with 2 options: Standard and Premium.
          Choose the plan that fits your needs. If you're visiting or staying short-term,
          try our 7 Days Guest Pass for 7-day access.
        </p>

        <div class="heroActions">
          <button class="btn gold" type="button" id="btnBenefits">
            <span data-lang="th">สิทธิประโยชน์</span>
            <span data-lang="en" style="display:none;">Benefits</span>
            <span style="opacity:.85">↗</span>
          </button>
        </div>
      </div>

      <div class="heroR">
        <img
          alt="MMD Privé Membership Hero"
          src="https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/694c0439c67f07806c6d8f31_2568-12-24%2022.17.16.jpg"
        />
      </div>
    </section>

    <div class="grid">
      <!-- LEFT -->
      <section class="card">
        <div class="cardHd">
          <div>
            <div class="ttl" data-lang="th">STEP 1 — เลือกแพ็กเกจ & โปร</div>
            <div class="ttl" data-lang="en" style="display:none;">STEP 1 — Package & Promo</div>
          </div>
          <div class="mini" id="promoBadge"></div>
        </div>

        <div class="cardBd">
          <div class="fieldset">
            <label class="baseLabel" data-lang="th">แพ็กเกจสมาชิก</label>
            <label class="baseLabel" data-lang="en" style="display:none;">Membership package</label>

            <div class="pkgRow" id="pkgList">
              <label class="pkg">
                <input type="radio" name="pkg" value="standard" checked />
                <div class="pkgMain">
                  <div class="pkgName">
                    <span data-lang="th">Standard Package 1 ปี</span>
                    <span data-lang="en" style="display:none;">Standard Package 1 Year</span>
                    <span class="price">฿1,199</span>
                  </div>
                  <div class="pkgSub" data-lang="th">สิทธิในการเข้าถึงแฟ้มรูปภาพกลุ่ม และ telegram Standard</div>
                  <div class="pkgSub" data-lang="en" style="display:none;">Access to group photo folders and Telegram Standard.</div>
                </div>
              </label>

              <label class="pkg">
                <input type="radio" name="pkg" value="premium" />
                <div class="pkgMain">
                  <div class="pkgName">
                    <span data-lang="th">Premium Package 1 ปี</span>
                    <span data-lang="en" style="display:none;">Premium Package 1 Year</span>
                    <span class="price">฿2,999</span>
                  </div>
                  <div class="pkgSub" data-lang="th">สิทธิในการเข้าถึงแฟ้มรูปภาพกลุ่ม และ telegram Premium + Standard</div>
                  <div class="pkgSub" data-lang="en" style="display:none;">Access to group photo folders and Telegram Premium + Standard.</div>
                </div>
              </label>

              <label class="pkg">
                <input type="radio" name="pkg" value="7days" />
                <div class="pkgMain">
                  <div class="pkgName">
                    <span data-lang="th">7 Days Guest Pass 7 วัน</span>
                    <span data-lang="en" style="display:none;">7 Days Guest Pass</span>
                    <span class="price">฿1,499</span>
                  </div>
                  <div class="pkgSub" data-lang="th">สิทธิในการเข้าถึงแฟ้มรูปภาพกลุ่ม และ telegram Premium + Standard ทั้งหมด 7 วัน</div>
                  <div class="pkgSub" data-lang="en" style="display:none;">7-day access to group photo folders and Telegram Premium + Standard.</div>
                </div>
              </label>
            </div>
          </div>

          <div class="divider"></div>

          <div class="row2">
            <div class="fieldset">
              <label class="baseLabel" data-lang="th">Promo Code (ถ้ามี)</label>
              <label class="baseLabel" data-lang="en" style="display:none;">Promo code (optional)</label>
              <input class="text" id="promoCode" placeholder="e.g., XMAS2025" autocomplete="off" />
            </div>
            <div class="fieldset">
              <label class="baseLabel" data-lang="th">อีเมลลูกค้า (optional)</label>
              <label class="baseLabel" data-lang="en" style="display:none;">Customer email (optional)</label>
              <input class="text" id="email" placeholder="you@example.com" autocomplete="email" />
            </div>
          </div>

          <div class="row2">
            <div class="fieldset">
              <label class="baseLabel" data-lang="th">ชื่อ (optional)</label>
              <label class="baseLabel" data-lang="en" style="display:none;">Name (optional)</label>
              <input class="text" id="name" placeholder="Full name" autocomplete="name" />
            </div>
            <div class="fieldset">
              <label class="baseLabel" data-lang="th">Member ID (optional)</label>
              <label class="baseLabel" data-lang="en" style="display:none;">Member ID (optional)</label>
              <input class="text" id="memberId" placeholder="MS / Member ID" autocomplete="off" />
            </div>
          </div>

          <div class="summary" aria-live="polite">
            <div class="sumRow">
              <span data-lang="th">ราคาปกติ</span>
              <span data-lang="en" style="display:none;">Base price</span>
              <strong id="basePrice">฿0</strong>
            </div>
            <div class="sumRow">
              <span data-lang="th">ส่วนลด</span>
              <span data-lang="en" style="display:none;">Discount</span>
              <strong id="discount">฿0</strong>
            </div>
            <div class="sumRow sumFinal">
              <span data-lang="th">ยอดชำระ</span>
              <span data-lang="en" style="display:none;">Pay amount</span>
              <span class="amt" id="payAmount">฿0</span>
            </div>
          </div>

          <div class="btnRow">
            <button class="btn ghost" type="button" id="btnApply">
              <span data-lang="th">คำนวณใหม่</span>
              <span data-lang="en" style="display:none;">Recalculate</span>
            </button>

            <button class="btn primary" type="button" id="btnNotify">
              <span data-lang="th">Notify Team</span>
              <span data-lang="en" style="display:none;">Notify Team</span>
              <span style="opacity:.85">→</span>
            </button>
          </div>

          <div id="tsMount" style="height:0; overflow:hidden;"></div>
        </div>
      </section>

      <!-- RIGHT -->
      <section class="card">
        <div class="cardHd">
          <div>
            <div class="ttl" data-lang="th">STEP 2 — เลือกช่องทางชำระเงิน</div>
            <div class="ttl" data-lang="en" style="display:none;">STEP 2 — Choose payment method</div>
          </div>
          <div class="mini" id="ppMini"></div>
        </div>

        <div class="cardBd">

          <div class="payMethods" id="payMethods">
            <label class="method is-selected" data-method="promptpay">
              <input type="radio" name="pay_method" value="promptpay" checked />
              <span class="methodIndicator" aria-hidden="true"></span>
              <div class="methodBody">
                <div class="methodTitle">
                  <span data-lang="th">PromptPay (QR)</span>
                  <span data-lang="en" style="display:none;">PromptPay (QR)</span>
                  <span class="pill gold">RECOMMENDED</span>
                </div>
                <div class="methodSub" data-lang="th">สร้าง QR ตามยอดที่ต้องชำระ (อัปเดตอัตโนมัติ)</div>
                <div class="methodSub" data-lang="en" style="display:none;">Auto-generated QR based on your pay amount.</div>
              </div>
            </label>

            <label class="method" data-method="ktb">
              <input type="radio" name="pay_method" value="ktb" />
              <span class="methodIndicator" aria-hidden="true"></span>
              <div class="methodBody">
                <div class="methodTitle">
                  <span data-lang="th">KTB Bank (โอนบัญชี)</span>
                  <span data-lang="en" style="display:none;">KTB Bank (Bank transfer)</span>
                  <span class="pill">KTB</span>
                </div>
                <div class="methodSub" data-lang="th">
                  ชื่อบัญชี: <b>ธัชชะ ป.</b><br>
                  เลขบัญชี: <b>1420335898</b>
                </div>
                <div class="methodSub" data-lang="en" style="display:none;">
                  Account name: <b>ธัชชะ ป.</b><br>
                  Account no.: <b>1420335898</b>
                </div>
              </div>
              <button class="copyBtn" type="button" data-copy="1420335898">COPY</button>
            </label>

            <label class="method" data-method="paypal">
              <input type="radio" name="pay_method" value="paypal" />
              <span class="methodIndicator" aria-hidden="true"></span>
              <div class="methodBody">
                <div class="methodTitle">
                  <span>PayPal</span>
                  <span class="pill">CREDIT CARD</span>
                </div>
                <!-- เอาข้อความไม่จำเป็นออก เหลือแค่ service charge ตามที่ต้องการ -->
                <div class="methodSub" style="margin-top:8px;">
                  <b>Service charge 4%</b>
                </div>
              </div>
            </label>
          </div>

          <!-- PromptPay section -->
          <div id="promptpayPanel">
            <div class="qrBox">
              <div id="qr" aria-label="PromptPay QR"></div>
            </div>

            <div class="payMeta">
              <div class="kv">
                <span data-lang="th">PromptPay ID</span>
                <span data-lang="en" style="display:none;">PromptPay ID</span>
                <b id="ppId">—</b>
              </div>
              <div class="kv">
                <span data-lang="th">ลิงก์</span>
                <span data-lang="en" style="display:none;">Link</span>
                <b class="truncate"><a id="ppUrl" href="#" target="_blank" rel="noopener">open</a></b>
              </div>
            </div>
          </div>

          <!-- KTB section -->
          <div id="ktbPanel" style="display:none;">
            <div class="status" style="margin-top:0;">
              <div style="font-weight:900; letter-spacing:.02em; font-family:'Outfit',sans-serif; margin-bottom:8px;">
                <span data-lang="th">KTB Bank</span>
                <span data-lang="en" style="display:none;">KTB Bank</span>
              </div>
              <div data-lang="th">
                ชื่อบัญชี: <b>ธัชชะ ป.</b><br>
                เลขบัญชี: <b>1420335898</b>
              </div>
              <div data-lang="en" style="display:none;">
                Account name: <b>ธัชชะ ป.</b><br>
                Account no.: <b>1420335898</b>
              </div>
            </div>
          </div>

          <!-- PayPal section -->
          <div id="paypalPanel" style="display:none;">
            <div class="status" style="margin-top:0;">
              <div style="font-weight:900; letter-spacing:.02em; font-family:'Outfit',sans-serif; margin-bottom:10px;">
                PayPal
              </div>
              <a class="btn primary" href="https://www.paypal.com/ncp/payment/M697T7AW2QZZJ" target="_blank" rel="noopener" style="width:100%;">
                <span data-lang="th">ไปชำระเงินด้วย PayPal</span>
                <span data-lang="en" style="display:none;">Pay with PayPal</span>
                <span style="opacity:.85">↗</span>
              </a>
              <div style="margin-top:10px; color:rgba(244,242,238,.60); font-size:12px; line-height:1.55;">
                <b>Service charge 4%</b>
              </div>
              <div style="margin-top:10px; color:rgba(244,242,238,.60); font-size:12px; line-height:1.55;" data-lang="th">
                หลังชำระเงินแล้ว กลับมาและกด <b>Notify Team</b> เพื่อแจ้งทีมตรวจสอบ
              </div>
              <div style="margin-top:10px; color:rgba(244,242,238,.60); font-size:12px; line-height:1.55; display:none;" data-lang="en">
                After payment, come back and click <b>Notify Team</b> to notify our team.
              </div>
            </div>
          </div>

          <div class="status ok" id="statusBox">
            <span data-lang="th">สถานะ: พร้อมใช้งาน</span>
            <span data-lang="en" style="display:none;">Status: Ready</span>
          </div>

        </div>
      </section>
    </div>

    <div class="footer">© MMD Privé</div>
  </div>

  <!-- Benefits Modal -->
  <div class="modal" id="benefitsModal" role="dialog" aria-modal="true" aria-label="Benefits">
    <div class="modalCard">
      <div class="modalHd">
        <div class="mt" data-lang="th">สิทธิประโยชน์</div>
        <div class="mt" data-lang="en" style="display:none;">Benefits</div>
        <button class="xBtn" type="button" id="btnCloseModal">Close</button>
      </div>
      <div class="modalBody">
        <iframe id="benefitsFrame" src="/membership/benefits-lite" title="Benefits"></iframe>
      </div>
    </div>
  </div>

  <script>
    /* =========================
       CONFIG
       ========================= */
    const CONFIG = {
      ENDPOINT: "https://telegram.malemodel-bkk.workers.dev",
      ALLOWED_ORIGIN: "https://mmdprive.webflow.io",
      TURNSTILE_SITEKEY: "0x4AAAAAACIE9VleQdOBRfBG",
      PROMPTPAY_ID: "0829528889",
      PAGE: "/pay/membership",
      CURRENCY: "THB",
      LOCKED_PRICES: { standard: 1199, premium: 2999, "7days": 1499 },
      PROMO_MONTHLY_JSON: "{}",
      PROMO_CODES_JSON: "{}"
    };

    /* =========================
       Helpers (Scoped)
       ========================= */
    const root = document.getElementById("mmd-membership");
    const $ = (sel, ctx=root)=> (ctx || document).querySelector(sel);
    const $$ = (sel, ctx=root)=> Array.from((ctx || document).querySelectorAll(sel));

    function safeParseJSON(s, fallback){
      try{ const v = JSON.parse(String(s||"")); return (v && typeof v==="object") ? v : fallback; }
      catch{ return fallback; }
    }

    const PROMO_MONTHLY = safeParseJSON(CONFIG.PROMO_MONTHLY_JSON, {});
    const PROMO_CODES   = safeParseJSON(CONFIG.PROMO_CODES_JSON, {});

    function isExpired(expires){
      if(!expires) return false;
      const t = Date.parse(expires);
      if(!Number.isFinite(t)) return false;
      return Date.now() > t;
    }
    function fmtTHB(n){
      const v = Number(n);
      if(!Number.isFinite(v)) return "฿0";
      return "฿" + v.toLocaleString("en-US");
    }

    function getSelectedPkg(){
      const el = document.querySelector('input[name="pkg"]:checked');
      return el ? el.value : "standard";
    }
    function getBasePrice(pkg){
      return Number(CONFIG.LOCKED_PRICES[pkg] || 0);
    }
    function getMonthlyPromoForNow(){
      const d = new Date();
      const key = d.getFullYear() + "-" + String(d.getMonth()+1).padStart(2,"0");
      const promo = PROMO_MONTHLY[key];
      if(!promo) return null;
      if(promo.expires && isExpired(promo.expires)) return { expired:true, key, promo };
      return { expired:false, key, promo };
    }

    function applyPromoRules({pkg, basePrice, promoCode, lang}){
      let price = basePrice;
      let discount = 0;
      let badge = "";
      let codeState = { ok:true, message:"" };

      const monthly = getMonthlyPromoForNow();
      if(monthly && !monthly.expired && monthly.promo && monthly.promo.prices && monthly.promo.prices[pkg] != null){
        const p = Number(monthly.promo.prices[pkg]);
        if(Number.isFinite(p) && p > 0 && p < price){
          discount += (price - p);
          price = p;
          badge = (lang==="th" ? monthly.promo.label_th : monthly.promo.label_en) || "Monthly promo";
        }else if(Number.isFinite(p) && p === price){
          badge = (lang==="th" ? monthly.promo.label_th : monthly.promo.label_en) || "Monthly promo";
        }
      }

      const raw = String(promoCode||"").trim().toUpperCase();
      if(raw){
        const rule = PROMO_CODES[raw];
        if(!rule) return { finalPrice: price, discount, badge, codeState:{ok:false,message:"invalid code"} };
        if(rule.expires && isExpired(rule.expires)) return { finalPrice: price, discount, badge, codeState:{ok:false,message:"code expired"} };

        const pkgs = Array.isArray(rule.packages) ? rule.packages : ["standard","premium","7days"];
        if(pkgs.length && !pkgs.includes(pkg)) return { finalPrice: price, discount, badge, codeState:{ok:false,message:"invalid code"} };

        const type = String(rule.type||"").toLowerCase();
        const val  = Number(rule.value);

        if(type==="percent" && Number.isFinite(val) && val>0){
          const cut = Math.round(price*(val/100));
          discount += cut;
          price = Math.max(1, price-cut);
          badge = badge || ((lang==="th" ? rule.label_th : rule.label_en) || (raw+" applied"));
        }else if(type==="amount" && Number.isFinite(val) && val>0){
          const cut = Math.min(price-1, Math.round(val));
          discount += cut;
          price = Math.max(1, price-cut);
          badge = badge || ((lang==="th" ? rule.label_th : rule.label_en) || (raw+" applied"));
        }else if(type==="price" && Number.isFinite(val) && val>0){
          if(val<price){ discount += (price-val); price = val; }
          badge = badge || ((lang==="th" ? rule.label_th : rule.label_en) || (raw+" applied"));
        }else{
          return { finalPrice: price, discount, badge, codeState:{ok:false,message:"invalid code"} };
        }
      }

      return { finalPrice: price, discount, badge, codeState };
    }

    function setStatus(kind, msgTh, msgEn){
      const box = $("#statusBox");
      if(!box) return;
      box.classList.remove("ok","bad");
      if(kind==="ok") box.classList.add("ok");
      if(kind==="bad") box.classList.add("bad");

      const th = box.querySelector("[data-lang='th']");
      const en = box.querySelector("[data-lang='en']");
      if(th) th.textContent = msgTh;
      if(en) en.textContent = msgEn;
    }

    function buildPromptPayUrl(amount){
      return "https://promptpay.io/" + encodeURIComponent(CONFIG.PROMPTPAY_ID) + "/" + encodeURIComponent(String(amount));
    }

    async function ensureQRCodeLib(){
      if(window.QRCode) return true;

      // ถ้าหน้าไม่ได้ใส่ qrcodejs ใน HEAD ให้โหลดเองแบบ fallback
      return new Promise((resolve)=>{
        const s = document.createElement("script");
        s.src = "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js";
        s.async = true;
        s.onload = ()=> resolve(true);
        s.onerror = ()=> resolve(false);
        document.head.appendChild(s);
      });
    }

    async function renderQR(url){
      const ok = await ensureQRCodeLib();
      const el = $("#qr");
      if(!el) return;

      el.innerHTML = "";
      if(!ok || !window.QRCode){
        el.innerHTML = "<div style='color:#111;font-weight:900;font-family:DM Sans;padding:14px;text-align:center;'>QR library not loaded</div>";
        return;
      }

      new QRCode(el, { text: url, width: 220, height: 220 });

      const link = $("#ppUrl");
      if(link){
        link.href = url;
        link.textContent = url.replace("https://", "");
      }
      const ppId = $("#ppId");
      if(ppId) ppId.textContent = CONFIG.PROMPTPAY_ID;
    }

    function recalc(){
      const pkg = getSelectedPkg();
      const lang = root.dataset.lang || "th";
      const promoCode = ($("#promoCode")?.value || "");

      const base = getBasePrice(pkg);
      const out = applyPromoRules({ pkg, basePrice: base, promoCode, lang });

      $("#basePrice").textContent = fmtTHB(base);
      $("#discount").textContent = fmtTHB(out.discount);
      $("#payAmount").textContent = fmtTHB(out.finalPrice);

      const badge = $("#promoBadge");
      if(badge){
        if(out.badge){
          badge.textContent = out.badge;
          badge.style.color = "rgba(232,212,154,.92)";
        }else{
          badge.textContent = "";
        }
      }

      if(!out.codeState.ok){
        setStatus("bad","สถานะ: "+out.codeState.message,"Status: "+out.codeState.message);
      }else{
        setStatus("ok","สถานะ: พร้อมใช้งาน","Status: Ready");
      }

      const ppUrl = buildPromptPayUrl(out.finalPrice);
      renderQR(ppUrl);

      return {
        pkg,
        base,
        finalPrice: out.finalPrice,
        discount: out.discount,
        promoCode: String(promoCode||"").trim().toUpperCase(),
        ppUrl,
        codeOk: out.codeState.ok
      };
    }

    /* =========================
       Language toggle
       ========================= */
    (function initLang(){
      const btns = $$(".lang button");
      const setLang = (lang)=>{
        $$("[data-lang]").forEach(el=>{
          el.style.display = (el.getAttribute("data-lang")===lang) ? "" : "none";
        });
        btns.forEach(b=>b.classList.toggle("active", b.dataset.setLang===lang));
        root.dataset.lang = lang;
        recalc();
      };
      btns.forEach(b=>b.addEventListener("click", ()=>setLang(b.dataset.setLang)));
      setLang(root.dataset.lang || "th");
    })();

    /* =========================
       Benefits modal
       ========================= */
    (function initModal(){
      const modal = $("#benefitsModal");
      const openBtn = $("#btnBenefits");
      const closeBtn = $("#btnCloseModal");
      if(!modal || !openBtn || !closeBtn) return;

      const open = ()=>{ modal.classList.add("show"); document.body.style.overflow="hidden"; };
      const close = ()=>{ modal.classList.remove("show"); document.body.style.overflow=""; };

      openBtn.addEventListener("click", open);
      closeBtn.addEventListener("click", close);
      modal.addEventListener("click", (e)=>{ if(e.target===modal) close(); });
      window.addEventListener("keydown", (e)=>{ if(e.key==="Escape") close(); });
    })();

    /* =========================
       Copy helper
       ========================= */
    (function initCopy(){
      $$("[data-copy]").forEach(btn=>{
        btn.addEventListener("click", async (e)=>{
          e.preventDefault(); e.stopPropagation();
          const val = btn.getAttribute("data-copy");
          try{
            await navigator.clipboard.writeText(val);
          }catch{
            const ta = document.createElement("textarea");
            ta.value = val; document.body.appendChild(ta);
            ta.select(); document.execCommand("copy");
            document.body.removeChild(ta);
          }
          const prev = btn.textContent;
          btn.textContent = "COPIED";
          setTimeout(()=>btn.textContent = prev || "COPY", 900);
        });
      });
    })();

    /* =========================
       Payment method switch + Selected state
       ========================= */
    function setPaymentMethod(method){
      const pp = $("#promptpayPanel");
      const ktb = $("#ktbPanel");
      const paypal = $("#paypalPanel");

      if(pp) pp.style.display = (method==="promptpay") ? "" : "none";
      if(ktb) ktb.style.display = (method==="ktb") ? "" : "none";
      if(paypal) paypal.style.display = (method==="paypal") ? "" : "none";

      $$(".method").forEach(m=>{
        m.classList.toggle("is-selected", m.getAttribute("data-method")===method);
      });

      // ถ้าอยู่ promptpay ให้ re-render QR อีกครั้งกันกรณี element เพิ่ง show
      if(method==="promptpay"){ recalc(); }
    }

    document.querySelectorAll('input[name="pay_method"]').forEach(r=>{
      r.addEventListener("change", ()=> setPaymentMethod(r.value));
    });
    setPaymentMethod("promptpay");

    /* =========================
       Package events
       ========================= */
    $("#btnApply")?.addEventListener("click", recalc);
    $("#promoCode")?.addEventListener("input", ()=>{
      window.clearTimeout(window.__mmd_t);
      window.__mmd_t = setTimeout(recalc, 250);
    });
    document.querySelectorAll('input[name="pkg"]').forEach(r=> r.addEventListener("change", recalc));

    /* =========================
       Turnstile (kept as-is)
       ========================= */
    let tsWidgetId = null;

    function ensureTurnstileWidget(){
      return new Promise((resolve, reject)=>{
        const mount = $("#tsMount", document);
        if(!mount) return reject(new Error("Turnstile mount missing"));

        const ready = ()=>{
          try{
            if(tsWidgetId !== null) return resolve(tsWidgetId);
            mount.innerHTML = "<div id='tsBox'></div>";
            tsWidgetId = window.turnstile.render("#tsBox", {
              sitekey: CONFIG.TURNSTILE_SITEKEY,
              size: "invisible",
              callback: function(){},
            });
            resolve(tsWidgetId);
          }catch(e){ reject(e); }
        };

        const maxWait = Date.now() + 8000;
        (function poll(){
          if(window.turnstile && typeof window.turnstile.render === "function") return ready();
          if(Date.now() > maxWait) return reject(new Error("Turnstile not ready"));
          setTimeout(poll, 120);
        })();
      });
    }

    function getTurnstileToken(){
      return new Promise(async (resolve, reject)=>{
        try{
          await ensureTurnstileWidget();

          const done = (token)=>{
            try{ window.turnstile.reset(tsWidgetId); }catch{}
            resolve(token);
          };

          try{ window.turnstile.remove(tsWidgetId); }catch{}
          tsWidgetId = null;

          const mount = $("#tsMount", document);
          mount.innerHTML = "<div id='tsBox'></div>";
          tsWidgetId = window.turnstile.render("#tsBox", {
            sitekey: CONFIG.TURNSTILE_SITEKEY,
            size: "invisible",
            callback: done,
            "error-callback": ()=>reject(new Error("Turnstile error")),
            "expired-callback": ()=>reject(new Error("Turnstile expired"))
          });

          window.turnstile.execute(tsWidgetId);
        }catch(e){
          reject(e);
        }
      });
    }

    async function postNotify(){
      const lang = root.dataset.lang || "th";
      const calc = recalc();

      if(!calc.codeOk){
        setStatus("bad","สถานะ: invalid code / code expired","Status: invalid code / code expired");
        return;
      }

      const btn = $("#btnNotify");
      btn.disabled = true;
      btn.style.opacity = ".75";

      try{
        setStatus("", "กำลังตรวจสอบความปลอดภัย…", "Verifying security…");
        const token = await getTurnstileToken();

        setStatus("", "กำลังส่งข้อมูล…", "Sending…");

        const payload = {
          package: calc.pkg,
          amount_thb: calc.finalPrice,
          currency: CONFIG.CURRENCY,
          promo_code: calc.promoCode || "",
          promptpay_id: CONFIG.PROMPTPAY_ID,
          promptpay_url: calc.ppUrl,
          page: CONFIG.PAGE,
          lang: lang,

          is_authenticated: false,
          customer_email: String($("#email")?.value || "").trim(),
          customer_name: String($("#name")?.value || "").trim(),
          member_id: String($("#memberId")?.value || "").trim(),

          anomaly_flags: [],
          turnstile_token: token
        };

        const res = await fetch(CONFIG.ENDPOINT, {
          method: "POST",
          headers:{
            "Content-Type":"application/json",
            "Origin": CONFIG.ALLOWED_ORIGIN
          },
          body: JSON.stringify(payload)
        });

        const txt = await res.text();
        let data = null;
        try{ data = JSON.parse(txt); }catch{}

        if(res.ok && data && data.ok){
          setStatus("ok",
            "สำเร็จ: แจ้งทีมเรียบร้อย (Event: " + (data.event_id || "-") + ")",
            "Success: Team notified (Event: " + (data.event_id || "-") + ")"
          );
        }else{
          setStatus("bad",
            "ล้มเหลว: ส่งไม่สำเร็จ ("+res.status+")",
            "Failed: request not ok ("+res.status+")"
          );
        }
      }catch(e){
        setStatus("bad",
          "ล้มเหลว: " + (e && e.message ? e.message : "error"),
          "Failed: " + (e && e.message ? e.message : "error")
        );
      }finally{
        btn.disabled = false;
        btn.style.opacity = "1";
      }
    }

    $("#btnNotify")?.addEventListener("click", postNotify);

    /* First paint */
    recalc();
  </script>
</div></div></div></section><script src="https://d3e54v103j8qbb.cloudfront.net/js/jquery-3.5.1.min.dc5e7f18c8.js?site=68f879d546d2f4e2ab186e90" type="text/javascript" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script><script src="https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/js/webflow.schunk.36b8fb49256177c8.js" type="text/javascript"></script><script src="https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/js/webflow.schunk.46c0b086821e7bf0.js" type="text/javascript"></script><script src="https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/js/webflow.0ea1108e.9d707afa2c3e4627.js" type="text/javascript"></script><script>
(function () {
  "use strict";

  window.MMD = window.MMD || {};

  // merge env (ไม่ทับของเดิมถ้ามี)
  MMD.env = Object.assign(
    { debug: new URLSearchParams(window.location.search).has("debug") },
    MMD.env || {}
  );

  MMD.onReady = function (fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  };

  // ========== Kill particles (JS only) ==========
  // ป้องกัน/ลบ canvas ที่ถูก inject มาจากที่อื่น
  const PARTICLE_SELECTOR =
    "canvas#gold-particles, #gold-particles, canvas[id*='particle' i], canvas[class*='particle' i]";

  function killParticles() {
    document.querySelectorAll(PARTICLE_SELECTOR).forEach((el) => el.remove());
  }

  MMD.onReady(function () {
    if (MMD.env.debug) console.log("[MMD] Global UI loaded");

    // Role Gate
    const role = document.body && document.body.dataset ? document.body.dataset.userRole : "";
    if (role) {
      document.querySelectorAll("[data-role-allow]").forEach((el) => {
        const allowed = String(el.dataset.roleAllow || "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (allowed.length && !allowed.includes(role)) el.remove();
      });
    }

    // Confirm Fade-in
    const confirmWrap = document.querySelector(".mmd-confirm-wrap");
    if (confirmWrap) requestAnimationFrame(() => confirmWrap.classList.add("is-visible"));

    // Job / Payment Auto Switch
    if (confirmWrap) {
      const type = confirmWrap.dataset.confirmType || "job";
      const status = confirmWrap.querySelector(".mmd-status");
      if (status) status.textContent = type === "payment" ? "Payment Confirmed" : "Job Confirmed";

      const steps = confirmWrap.querySelectorAll(".mmd-step");
      steps.forEach((step) => step.classList.remove("is-done"));
      if (type === "job") steps[0] && steps[0].classList.add("is-done");
      if (type === "payment") steps.forEach((step) => step.classList.add("is-done"));
    }

    // Reference Hash + QR (สำหรับหน้า confirm ที่มี #mmd-qr)
    const refEl = document.querySelector("[data-ref]");
    if (refEl) {
      const reference = refEl.textContent.trim();
      const hash = btoa(reference + "|MMD").replace(/=/g, "").slice(0, 16);

      const hashEl = document.getElementById("mmd-hash");
      if (hashEl) hashEl.textContent = hash;

      const qrTarget = document.getElementById("mmd-qr");
      if (qrTarget && window.QRCode) {
        new QRCode(qrTarget, {
          text: location.origin + location.pathname + "?ref=" + reference,
          width: 76,
          height: 76
        });
      }
    }

    // Kill particles immediately + keep killing if injected later
    killParticles();
    const mo = new MutationObserver(killParticles);
    mo.observe(document.documentElement, { childList: true, subtree: true });
  });
})();
</script>
</body></html>
