/* =========================================================
   MMD • COURSE PAGE — Redirect → /confirm/payment-confirmation
   File: mmd-course.js
   Version: v2026-LOCK-02
========================================================= */
(function(){
  "use strict";

  // Guard: prevent double-boot
  if (window.__MMD_COURSE_BOOTED__) return;
  window.__MMD_COURSE_BOOTED__ = true;

  // ---------- CONFIG ----------
  var CONFIRM_URL = "/confirm/payment-confirmation";

  // Locked payment links (per project memory)
  var PROMPTPAY_BASE = "https://promptpay.io/0829528889";
  var PAYPAL_URL     = "https://www.paypal.com/ncp/payment/M697T7AW2QZZJ";

  // ---------- HELPERS ----------
  function $(id){ return document.getElementById(id); }

  function num(v){
    var s = String(v == null ? "" : v).replace(/,/g, "").trim();
    var n = parseFloat(s);
    return isFinite(n) ? n : 0;
  }

  function getPlanPercent(){
    // expects: <input type="radio" name="plan" value="30|100|...">
    var r = document.querySelector("input[name='plan']:checked");
    var p = r ? Number(r.value) : 30;
    return isFinite(p) && p > 0 ? p : 30;
  }

  function calc(){
    var totalEl = $("mmd-total");
    var tipsEl  = $("mmd-tips");

    var total = totalEl ? num(totalEl.value) : 0;
    var tips  = tipsEl  ? num(tipsEl.value)  : 0;
    var plan  = getPlanPercent();

    var deposit = Math.round(total * plan / 100);
    var payNow  = Math.max(0, deposit + tips);

    return { total: total, tips: tips, plan: plan, deposit: deposit, payNow: payNow };
  }

  function redirect(method, data){
    var modelEl = $("mmd-model");
    var model = (modelEl && modelEl.value ? String(modelEl.value).trim() : "—");

    var qs = new URLSearchParams({
      page: "course",
      status: "success",

      service: "COURSE",
      model: model,

      amount: String(data.total),
      deposit: String(data.deposit),
      balance: String(Math.max(0, data.total - data.deposit)),

      paid_now: String(data.payNow),
      currency: "THB",

      payment_method: String(method || "")
    });

    window.location.href = CONFIRM_URL + "?" + qs.toString();
  }

  function bindClick(id, handler){
    var el = $(id);
    if (!el) return false;
    el.addEventListener("click", function(ev){
      try { ev.preventDefault(); } catch(_){}
      handler();
    });
    return true;
  }

  // ---------- BINDINGS ----------
  var hasAny =
    bindClick("mmd-pay-promptpay", function(){
      var d = calc();
      var url = PROMPTPAY_BASE + "/" + encodeURIComponent(String(d.payNow));
      window.open(url, "_blank", "noopener,noreferrer");
      setTimeout(function(){ redirect("promptpay", d); }, 500);
    }) |
    bindClick("mmd-pay-paypal", function(){
      var d = calc();
      window.open(PAYPAL_URL, "_blank", "noopener,noreferrer");
      setTimeout(function(){ redirect("paypal", d); }, 500);
    }) |
    bindClick("mmd-pay-ktb", function(){
      var d = calc();
      alert(
        "🎗 ธนาคารกรุงไทย (KTB)\n" +
        "ชื่อบัญชี: ธัชชะ ป.\n" +
        "เลขบัญชี: 1420335898\n\n" +
        "หลังโอน ระบบจะพาไปหน้ายืนยัน"
      );
      setTimeout(function(){ redirect("ktb", d); }, 600);
    });

  // If buttons not found, do nothing silently (safe for other pages)
  if (!hasAny) return;

})();
