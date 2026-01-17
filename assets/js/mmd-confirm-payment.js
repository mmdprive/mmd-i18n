<script>
/* =========================================================
   MMD • CONFIRM PAYMENT — mmd-confirm-payment.js
   LOCK v2026-LOCK-02
   Use on: /confirm/payment-confirmation ONLY
   Requires: mmd-global.js (MMD.workerPost)
   ========================================================= */
(function(){
  "use strict";

  // ---- guard page ----
  if (!location.pathname.includes("/confirm/payment-confirmation")) return;

  // ---- guard once ----
  if (window.__MMD_CONFIRM_PAYMENT__) return;
  window.__MMD_CONFIRM_PAYMENT__ = true;

  const root = document.getElementById("mmd-confirmation");
  if (!root || !window.MMD || typeof MMD.workerPost !== "function") return;

  // ---- helpers ----
  const qs = new URLSearchParams(location.search);
  const pick = (k, d="") => (root.dataset[k] || qs.get(k) || d).toString().trim();
  const num = (v) => {
    const n = Number(String(v||"").replace(/,/g,""));
    return Number.isFinite(n) ? n : 0;
  };

  // ---- minimal REQUIRED payload (no guessing) ----
  const payload = {
    source: "confirm",
    page: "/confirm/payment-confirmation",
    amount: String(num(pick("amount","45000"))),            // REQUIRED
    payment_method: pick("paymentMethod","promptpay"),      // REQUIRED
    tier: pick("tier", pick("userRole","premium"))          // optional but useful
  };

  // ---- optional fields (safe) ----
  const deposit = num(pick("deposit","0"));
  const balance = num(pick("balance","0"));
  if (deposit) payload.deposit = String(deposit);
  if (balance) payload.balance = String(balance);

  const model = pick("modelCode","");
  if (model) payload.model = model;

  // ---- send once ----
  (async ()=>{
    try{
      await MMD.workerPost("/v1/payments/notify", payload);
      const pill = document.getElementById("mmd-sync-pill");
      if (pill) pill.textContent = "Sync: done";
    }catch(e){
      const pill = document.getElementById("mmd-sync-pill");
      if (pill) pill.textContent = "Sync: failed";
      // silent fail (no heavy logs)
    }
  })();

})();
</script>
