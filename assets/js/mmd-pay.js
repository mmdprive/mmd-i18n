/* =========================
  MMD • PAY MODULE (PAY PAGES ONLY)
  STATUS: LOCKED
  VERSION: 2025-LOCK-01
========================= */
(function(){
  "use strict";

  if (window.MMD_LOCK !== "2025-LOCK-01") return;

  function qs(sel, root){ return (root||document).querySelector(sel); }
  function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }

  function thb(n){
    try { return new Intl.NumberFormat("th-TH",{style:"currency",currency:"THB"}).format(n); }
    catch(e){ return (Math.round(n*100)/100).toFixed(2) + " THB"; }
  }

  function getTier(){
    var b=document.body;
    var t=(b.getAttribute("data-tier")||"").toLowerCase().trim();
    if(!t) t=(b.getAttribute("data-user-role")||"").toLowerCase().trim();
    if(!t) t=(localStorage.getItem("mmd_tier")||"").toLowerCase().trim();
    return t || "standard";
  }

  // ✅ NEW: Member ID resolver (prefer data attribute, then global, then storage)
  function getMemberId(payRoot){
    var v = (payRoot && payRoot.getAttribute("data-member-id")) || "";
    if(v) return v.trim();
    if(window.MMD_MEMBER_ID) return String(window.MMD_MEMBER_ID).trim();
    v = localStorage.getItem("mmd_member_id") || "";
    return String(v||"").trim() || null;
  }

  // ✅ NEW: optional turnstile token getter (if you render turnstile)
  function getTurnstileToken(payRoot){
    // option 1: you set it yourself on payRoot (recommended)
    var t = (payRoot && payRoot.getAttribute("data-turnstile-token")) || "";
    if(t) return t.trim();

    // option 2: you expose a function that returns latest token
    if(typeof window.MMD_GET_TURNSTILE_TOKEN === "function"){
      try { return String(window.MMD_GET_TURNSTILE_TOKEN() || "").trim() || null; }
      catch(e){ return null; }
    }
    return null;
  }

  function normalizePromptpayId(raw){
    raw = String(raw||"").trim();
    if(!raw) return "";
    if(raw.indexOf("promptpay.io") !== -1){
      try{
        var u = new URL(raw);
        var parts = u.pathname.split("/").filter(Boolean);
        return parts[0] || "";
      }catch(e){
        return raw.replace(/^.*promptpay\.io\//, "").replace(/\/.*$/, "");
      }
    }
    return raw;
  }

  function applyDiscount(code, tier, amount, rules){
    code = String(code||"").trim().toUpperCase();
    var rule = (rules||{})[code];
    if(!rule) return {ok:false, amount:amount, discount:0, reason:"invalid_code"};
    if(rule.tiers && rule.tiers.length && rule.tiers.indexOf(tier)===-1){
      return {ok:false, amount:amount, discount:0, reason:"tier_not_allowed"};
    }
    var discount = 0;
    if(rule.type==="percent") discount = amount * (rule.value/100);
    if(rule.type==="fixed") discount = rule.value;
    discount = Math.max(0, Math.min(discount, amount));
    return {ok:true, amount:amount-discount, discount:discount, code:code};
  }

  function ensureControls(payRoot){
    if(qs("[data-mmd-pay-controls='true']", payRoot)) return;

    var box = document.createElement("div");
    box.className = "mmd-pay-box";
    box.setAttribute("data-mmd-pay-controls","true");
    box.innerHTML = [
      "<div class='mmd-pay-row'>",
        "<div style='flex:1;min-width:240px'>",
          "<div class='mmd-pay-label'>Payment Option</div>",
          "<div class='mmd-pay-row' style='margin-top:8px'>",
            "<button type='button' class='mmd-pay-btn' data-plan='30_70'>30% Deposit / 70% Before Work</button>",
            "<button type='button' class='mmd-pay-btn' data-plan='100'>Pay 100%</button>",
          "</div>",
          "<div class='mmd-pay-note' style='margin-top:8px'>Points accrue through verified payments. (1 point per 1,000 THB)</div>",
        "</div>",
        "<div style='flex:1;min-width:240px'>",
          "<div class='mmd-pay-label'>Discount Code (Membership)</div>",
          "<input class='mmd-pay-input' placeholder='Enter code' data-discount-code='true' />",
          "<div class='mmd-pay-row' style='margin-top:10px'>",
            "<button type='button' class='mmd-pay-btn' data-apply-discount='true'>Apply</button>",
            "<button type='button' class='mmd-pay-btn primary' data-confirm-pay='true'>Confirm & Generate</button>",
          "</div>",
          "<div class='mmd-pay-note' data-discount-hint='true' style='margin-top:8px'></div>",
        "</div>",
      "</div>"
    ].join("");
    payRoot.prepend(box);
  }

  function ensureQrBox(payRoot){
    var el = qs("#mmd-qr", payRoot);
    if(el) return el;
    el = document.createElement("div");
    el.id = "mmd-qr";
    el.className = "mmd-pay-box";
    el.style.marginTop = "16px";
    el.innerHTML =
      "<div class='mmd-pay-label'>PromptPay QR</div>" +
      "<div id='mmd-qr-code' style='margin-top:10px'></div>" +
      "<div class='mmd-pay-note' id='mmd-qr-note' style='margin-top:10px'></div>";
    payRoot.appendChild(el);
    return el;
  }

  function renderPromptPayQR(payRoot, amountTHB){
    var raw = payRoot.getAttribute("data-promptpay-id") || "";
    var id = normalizePromptpayId(raw);
    if(!id) return {ok:false, reason:"missing_promptpay_id"};

    var box = ensureQrBox(payRoot);
    var codeEl = qs("#mmd-qr-code", box);
    var noteEl = qs("#mmd-qr-note", box);
    if(codeEl) codeEl.innerHTML = "";

    var img = document.createElement("img");
    img.alt = "PromptPay QR";
    img.style.display = "block";
    img.style.maxWidth = "220px";
    img.style.borderRadius = "14px";
    img.style.border = "1px solid rgba(203,166,90,.18)";
    img.src = "https://promptpay.io/" + encodeURIComponent(id) + "/" + encodeURIComponent(String(amountTHB||0)) + ".png";
    codeEl.appendChild(img);

    if(noteEl) noteEl.textContent = "Amount: " + thb(amountTHB) + " | Tier: " + getTier().toUpperCase();
    return {ok:true};
  }

  function genId(prefix){
    return (prefix||"ORD") + "-" + Date.now().toString(36).toUpperCase();
  }

  async function postJSON(url, body){
    var res = await fetch(url, {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body: JSON.stringify(body),
      credentials:"omit"
    });
    return res;
  }

  function init(){
    var payRoot = qs("[data-mmd-payments='true']");
    if(!payRoot) return;

    ensureControls(payRoot);

    var page = payRoot.getAttribute("data-page") || "course";
    var confirmUrl = payRoot.getAttribute("data-confirm-url") || "/confirm/payment-confirmation";
    var workerDomain = payRoot.getAttribute("data-worker-domain") || "";
    var paypalUrl = payRoot.getAttribute("data-paypal-url") || "";
    var tier = getTier();

    var memberId = getMemberId(payRoot); // ✅ NEW

    var DISCOUNT_CODES = {
      "STD10": { type:"percent", value:10, tiers:["standard"] },
      "PRE15": { type:"percent", value:15, tiers:["premium"] },
      "VIP20": { type:"percent", value:20, tiers:["vip"] },
      "SVIP25": { type:"percent", value:25, tiers:["svip","blackcard"] }
    };

    function getBaseTotal(){
      var v = payRoot.getAttribute("data-total-thb");
      return v ? Number(v) : 0;
    }

    var state = {
      plan:"100",
      baseTotal:getBaseTotal(),
      discountedTotal:null,
      discountCode:"",
      discountAmount:0,
      orderId: null,
      refCode: null
    };

    var hint = qs("[data-discount-hint='true']", payRoot);
    var codeInput = qs("[data-discount-code='true']", payRoot);
    var planBtns = qsa("[data-plan]", payRoot);
    var applyBtn = qs("[data-apply-discount='true']", payRoot);
    var confirmBtn = qs("[data-confirm-pay='true']", payRoot);

    function setHint(msg){ if(hint) hint.textContent = msg || ""; }

    function setPlan(plan){
      state.plan = plan;
      planBtns.forEach(function(b){
        b.classList.toggle("primary", b.getAttribute("data-plan")===plan);
      });
    }
    setPlan("100");

    planBtns.forEach(function(b){
      b.addEventListener("click", function(){ setPlan(b.getAttribute("data-plan")); });
    });

    if(applyBtn){
      applyBtn.addEventListener("click", function(){
        state.baseTotal = getBaseTotal();
        var base = state.baseTotal;
        if(!base || base<=0){
          setHint("Missing total. Set data-total-thb on pay root.");
          return;
        }
        var code = (codeInput && codeInput.value) ? codeInput.value : "";
        state.discountCode = code;

        var res = applyDiscount(code, tier, base, DISCOUNT_CODES);
        if(!res.ok){
          setHint(res.reason==="tier_not_allowed" ? "Code not eligible for your tier." : "Invalid code.");
          state.discountedTotal = null;
          state.discountAmount = 0;
          return;
        }
        state.discountedTotal = res.amount;
        state.discountAmount = res.discount;
        setHint("Applied " + res.code + " — Discount " + thb(res.discount) + " → New total " + thb(res.amount));
      });
    }

    function computeAmounts(){
      var base = state.discountedTotal!=null ? state.discountedTotal : state.baseTotal;
      base = Number(base||0);
      if(state.plan==="30_70"){
        var deposit = Math.round(base * 0.30);
        return { total: base, paid: deposit, remaining: base - deposit, plan:"30_70" };
      }
      return { total: base, paid: base, remaining: 0, plan:"100" };
    }

    if(confirmBtn){
      confirmBtn.addEventListener("click", async function(){
        state.baseTotal = getBaseTotal();
        var a = computeAmounts();

        if(!a.total || a.total<=0){
          setHint("Missing total. Set data-total-thb on pay root.");
          return;
        }

        if(!memberId){
          // ไม่บังคับ hard stop ก็ได้ แต่ production แนะนำให้ require
          setHint("Missing memberId. Please ensure user is logged in and data-member-id is set.");
          // return; // ถ้าคุณต้องการบังคับจริง ให้ uncomment
        }

        state.orderId = state.orderId || genId("ORD");
        state.refCode = state.refCode || genId("TXN");

        setHint("Confirmed. Generating QR...");

        renderPromptPayQR(payRoot, a.paid);

        // ✅ Optional: notify worker (audit only) — points จะ award จาก Worker ด้วย amount_paid จริง
        if(workerDomain){
          try{
            var token = getTurnstileToken(payRoot);
            await postJSON(workerDomain.replace(/\/$/,"") + "/api/payment/notify", {
              lock: window.MMD_LOCK,
              page: page,
              plan: a.plan,
              orderId: state.orderId,
              refCode: state.refCode,
              memberId: memberId || null,          // ✅ NEW
              tierHint: tier,
              amountPaid: a.paid,                  // ✅ policy basis = amount_paid
              amountTotal: a.total,
              discountCode: String(state.discountCode||"").trim().toUpperCase(),
              discountAmount: state.discountAmount || 0,
              turnstile_token: token || null       // ✅ NEW
            });
          }catch(e){}
        }

        // ✅ Redirect ไป confirm root เดียว + ส่ง memberId ไปด้วย
        var url =
          confirmUrl +
          "?page=" + encodeURIComponent(page) +
          "&plan=" + encodeURIComponent(a.plan) +
          "&paid=" + encodeURIComponent(String(a.paid)) +
          "&total=" + encodeURIComponent(String(a.total)) +
          "&orderId=" + encodeURIComponent(state.orderId) +
          "&refCode=" + encodeURIComponent(state.refCode) +
          (memberId ? ("&memberId=" + encodeURIComponent(memberId)) : "");

        setTimeout(function(){ location.href = url; }, 400);
      });
    }

    var paypalLink = qs("#mmd-paypal-link", payRoot) || qs("#mmd-paypal-link");
    if(paypalLink && paypalUrl) paypalLink.href = paypalUrl;
  }

  if(document.readyState!=="loading") init();
  else document.addEventListener("DOMContentLoaded", init);
})();
