 /* =========================================
-   MMD PRIVÉ — PAY / MEMBERSHIP (v2025-LOCK-01)
+   MMD PRIVÉ — PAY / MEMBERSHIP (LOCK v2026-LOCK-03)
    - tier selector (.mmd-tier[data-pkg])
-   - deposit/full calculation
+   - NO deposit/payMode (membership จ่ายเต็มเท่านั้น)
    - promo validate via Worker endpoint (optional)
    - payload -> sessionStorage for /confirm/*
    - intent handler:
        ?intent=... OR localStorage mmd_intent
-       join_standard/join_premium/join_vip/join_blackcard -> tier
+       join_standard/join_premium/join_7days + (vip/svip/blackcard -> redirect)
    ========================================= */
 
 (function () {
   "use strict";
 
   const root = document.getElementById("mmd-pay-membership");
   if (!root) return;
 
   /* -----------------------------
      CONFIG (set via HTML data-*)
   ----------------------------- */
   const PROMO_ENDPOINT = root.getAttribute("data-promo-endpoint") || ""; // optional
   const NEXT_CONFIRM_URL = root.getAttribute("data-confirm-url") || "/confirm/payment-confirmation";
+  const BLACKCARD_URL = root.getAttribute("data-blackcard-url") || "/blackcard/black-card";
+  const BENEFITS_URL = root.getAttribute("data-benefits-url") || "/membership/benefits";
+  const TELEGRAM_URL = root.getAttribute("data-telegram-url") || "https://t.me/MMDpriveTH";
 
   // Prices (THB) — adjust to your actual pricing
   const PKG = {
-    standard: { price: 7000, duration: "12m" },
-    premium:  { price: 12000, duration: "12m" },
-    vip:      { price: 18000, duration: "12m" },
-    svip:     { price: 25000, duration: "12m" }
+    "7days":  { price: 1499, duration: "7d" },
+    standard: { price: 1199, duration: "365d" },
+    premium:  { price: 2999, duration: "365d" }
   };
 
-  const DEPOSIT_RATE = 0.30;
-  const STORAGE_KEY = "mmd_pay_payload_v1";
+  const STORAGE_KEY = "mmd_pay_payload_membership_v2026_03";
 
   /* -----------------------------
      STATE
   ----------------------------- */
   const state = {
     pkg: clampPkg((root.getAttribute("data-default-pkg") || "premium").toLowerCase()),
-    payMode: ((root.getAttribute("data-default-paymode") || "deposit").toLowerCase() === "full") ? "full" : "deposit",
     promo: null,
     lang: getLang()
   };
 
   /* -----------------------------
      DOM
   ----------------------------- */
   const $tiers = Array.from(root.querySelectorAll(".mmd-tier[data-pkg]"));
   const $moneySpans = Array.from(root.querySelectorAll("[data-money]"));
 
   const $base = root.querySelector("#mmdBasePrice");
   const $discount = root.querySelector("#mmdDiscount");
   const $total = root.querySelector("#mmdTotal");
   const $fine = root.querySelector("#mmdFinePrint");
 
   const $promoInput = root.querySelector("#mmdPromoCode");
   const $promoApply = root.querySelector("#mmdApplyPromo");
   const $promoClear = root.querySelector("#mmdClearPromo");
   const $promoMsg = root.querySelector("#mmdPromoMsg");
 
   const $payNow = root.querySelector("#mmdPayNow");
-  const $payModeHint = root.querySelector("#mmdPayModeHint");
-  const $payModeRadios = Array.from(root.querySelectorAll('input[name="payMode"]'));
+  const $tierNote = root.querySelector("#mmdTierNote");
+
+  const $btnBenefits = root.querySelector("#mmdBtnBenefits");
+  const $btnTelegram = root.querySelector("#mmdBtnTelegram");
+  const $modal = root.querySelector("#mmdBenefitsModal");
+  const $frame = root.querySelector("#mmdBenefitsFrame");
 
   /* -----------------------------
      INIT
   ----------------------------- */
   hydrateMoneyLabels();
   bindTierClicks();
-  bindPayMode();
   bindPromo();
+  bindBenefits();
   render();
 
   // Intent handler (runs after bindings)
   bootIntent();
 
@@
   function clampPkg(p) { return PKG[p] ? p : "premium"; }
@@
   function bindTierClicks() {
     $tiers.forEach(btn => {
       btn.addEventListener("click", () => {
         state.pkg = clampPkg((btn.getAttribute("data-pkg") || "").toLowerCase());
@@
         render();
       });
     });
   }
 
-  function bindPayMode() {
-    $payModeRadios.forEach(r => (r.checked = (r.value === state.payMode)));
-    $payModeRadios.forEach(r => {
-      r.addEventListener("change", () => {
-        state.payMode = (r.value === "full") ? "full" : "deposit";
-        render();
-      });
-    });
-  }
+  function bindBenefits(){
+    if($btnTelegram) $btnTelegram.href = TELEGRAM_URL;
+    if(!$btnBenefits || !$modal || !$frame) return;
+
+    const open = ()=>{
+      $frame.src = BENEFITS_URL;
+      $modal.classList.add("is-open");
+      $modal.setAttribute("aria-hidden","false");
+      document.documentElement.style.overflow="hidden";
+      document.body.style.overflow="hidden";
+    };
+    const close = ()=>{
+      $modal.classList.remove("is-open");
+      $modal.setAttribute("aria-hidden","true");
+      $frame.src = "about:blank";
+      document.documentElement.style.overflow="";
+      document.body.style.overflow="";
+    };
+    $btnBenefits.addEventListener("click", open);
+    $modal.addEventListener("click",(e)=>{
+      const t = e.target;
+      if(t && t.getAttribute && t.getAttribute("data-close")==="1") close();
+    });
+    document.addEventListener("keydown",(e)=>{
+      if(e.key==="Escape" && $modal.classList.contains("is-open")) close();
+    });
+  }
@@
   function calc() {
     const basePrice = PKG[state.pkg].price;
@@
     discountAmount = Math.max(0, Math.min(discountAmount, basePrice));
     const net = basePrice - discountAmount;
 
-    let dueNow = net;
-    let dueLater = 0;
-
-    if (state.payMode === "deposit") {
-      dueNow = Math.round(net * DEPOSIT_RATE);
-      dueLater = net - dueNow;
-    }
-
-    return { basePrice, discountAmount, net, dueNow, dueLater };
+    return { basePrice, discountAmount, net, dueNow: net };
   }
 
   function render() {
@@
     const c = calc();
 
-    if ($payModeHint) {
-      $payModeHint.textContent =
-        (state.payMode === "deposit")
-          ? `Deposit: ${money(c.dueNow)} • Remaining later: ${money(c.dueLater)}`
-          : `Full payment due now: ${money(c.dueNow)}`;
-    }
-
     if ($base) $base.textContent = money(c.basePrice);
     if ($discount) $discount.textContent = (c.discountAmount > 0) ? `- ${money(c.discountAmount)}` : money(0);
     if ($total) $total.textContent = money(c.dueNow);
 
+    if($tierNote){
+      $tierNote.textContent =
+        (state.pkg === "7days")
+          ? "7Days เป็นแพ็กเกจทดลองสิทธิ์ (ถ้ามีโค้ดเฉพาะ 7Days ให้กรอกได้)"
+          : "VIP / SVIP ไม่เปิดรับสมัครผ่านหน้านี้";
+    }
+
     if ($fine) {
       const parts = [];
-      parts.push(`Tier: ${state.pkg.toUpperCase()}`);
-      parts.push(`Mode: ${state.payMode === "deposit" ? "DEPOSIT 30%" : "FULL 100%"}`);
+      parts.push(`Package: ${state.pkg.toUpperCase()}`);
+      parts.push(`Duration: ${PKG[state.pkg].duration}`);
       if (state.promo && state.promo.code) parts.push(`Code: ${state.promo.code}`);
-      if (state.payMode === "deposit") parts.push(`Remaining later: ${money(c.dueLater)}`);
+      parts.push("ตรวจสอบยอดโดย MMD");
       $fine.textContent = parts.join(" • ");
     }
 
     if ($payNow) $payNow.onclick = () => proceed(c);
   }
 
   function proceed(c) {
     const payload = {
       page: "pay/membership",
       package: state.pkg,
-      payMode: state.payMode,
       basePrice: c.basePrice,
       discount: c.discountAmount,
       net: c.net,
-      totalDueNow: c.dueNow,
-      dueLater: c.dueLater,
+      totalDueNow: c.dueNow,
       promo: state.promo ? { code: state.promo.code, type: state.promo.type, percentOff: state.promo.percentOff || null, amountOff: state.promo.amountOff || null } : null,
       lang: state.lang,
       ts: Date.now()
     };
 
     try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch (e) {}
-    window.location.href = NEXT_CONFIRM_URL;
+    const qs = new URLSearchParams();
+    qs.set("page","pay/membership");
+    qs.set("package", state.pkg);
+    qs.set("amount", String(c.dueNow));
+    qs.set("payment_method","membership");
+    if(state.promo && state.promo.code) qs.set("promo", state.promo.code);
+    window.location.href = NEXT_CONFIRM_URL + "?" + qs.toString();
   }
@@
   function applyIntent(intent) {
     if (!intent) return;
 
-    // Map intents -> package on this page
-    // join_blackcard defaults to svip (change later if you add dedicated blackcard tier here)
-    const map = {
-      join_standard: "standard",
-      join_premium: "premium",
-      join_vip: "vip",
-      join_blackcard: "svip",
-      join_svip: "svip"
-    };
+    // VIP/SVIP/BLACKCARD ไม่เปิดสมัคร -> redirect
+    if(intent === "join_vip" || intent === "join_svip" || intent === "join_blackcard"){
+      window.location.href = BLACKCARD_URL;
+      return;
+    }
+
+    const map = {
+      join_standard: "standard",
+      join_premium: "premium",
+      join_7days: "7days",
+      join_7_days: "7days",
+      join_guestpass: "7days",
+      join_7days_guest: "7days"
+    };
