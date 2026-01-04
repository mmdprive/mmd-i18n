/* =========================================================
   MMD PAY (GLOBAL) — Course/Travel Controller
   File: assets/js/mmd-pay.js
   Version: 2026-01-04 • LOCK-UI
========================================================= */

(() => {
  "use strict";

  // Guard กันรันซ้ำ (Webflow มัก inject ซ้ำ)
  if (window.__MMD_PAY_LOADED__) return;
  window.__MMD_PAY_LOADED__ = true;

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const toNumber = (v) => {
    if (v == null) return 0;
    const s = String(v).replace(/,/g, "").trim();
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

  const moneyTHB = (n) => {
    const x = Math.max(0, Math.round(n));
    return x.toLocaleString("th-TH") + " THB";
  };

  const upper = (s) => String(s || "").trim().toUpperCase();

  // -------- Promo (live from Worker best-effort) --------
  async function fetchPromoCodesLive(workerBase){
    if (!workerBase) return null;

    const endpoints = [
      `${workerBase}/promo-codes.json`,
      `${workerBase}/promo-codes`,
      `${workerBase}/PROMO_CODES_JSON`,
      `${workerBase}/config`
    ];

    for (const url of endpoints) {
      try {
        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) continue;

        const data = await r.json().catch(() => null);
        if (!data) continue;

        // Accept: {PROMO_CODES_JSON:"{...}"} or {PROMO_CODES_JSON:{...}} or direct object/array
        if (data.PROMO_CODES_JSON) {
          if (typeof data.PROMO_CODES_JSON === "string") {
            try { return JSON.parse(data.PROMO_CODES_JSON); } catch(_) {}
          } else if (typeof data.PROMO_CODES_JSON === "object") {
            return data.PROMO_CODES_JSON;
          }
        }

        if (typeof data === "object") return data;
      } catch (_) {}
    }
    return null;
  }

  function findPromo(promoCodes, code){
    if (!promoCodes || !code) return null;
    const key = upper(code);

    if (Array.isArray(promoCodes)) {
      return promoCodes.find(x => upper(x.code) === key) || null;
    }

    if (promoCodes[key] && typeof promoCodes[key] === "object") {
      return { code: key, ...promoCodes[key] };
    }

    if (Array.isArray(promoCodes.codes)) {
      return promoCodes.codes.find(x => upper(x.code) === key) || null;
    }

    return null;
  }

  function applyDiscount(baseAmount, promoApplied){
    // discount applies to baseAmount only (not tips)
    if (!promoApplied) return { discounted: baseAmount, discount: 0 };

    let discount = 0;
    if (Number.isFinite(promoApplied.percent_off)) {
      discount = baseAmount * (promoApplied.percent_off / 100);
    } else if (Number.isFinite(promoApplied.amount_off)) {
      discount = promoApplied.amount_off;
    }
    discount = clamp(discount, 0, baseAmount);
    return { discounted: baseAmount - discount, discount };
  }

  // -------- PromptPay link builder --------
  function buildPromptPayLink(promptpayId, amountTHB){
    // promptpayId can be: "promptpay.io/082..." or "https://promptpay.io/082..."
    const clean = String(promptpayId || "").trim().replace(/^https?:\/\//, "");
    const amt = Math.max(0, Math.round(amountTHB));
    return `https://${clean.replace(/\/+$/,"")}/${amt}`;
  }

  // -------- Floating bar control --------
  function ensureFloating(root, getAmountFn, actions){
    // actions: { onPromptPay, onKTB, onPayPal }
    const wrap = document.createElement("div");
    wrap.className = "mmdpay-float";
    wrap.innerHTML = `
      <div class="mmdpay-float-inner">
        <div class="mmdpay-float-left">
          <div class="mmdpay-float-title">PAY NOW</div>
          <div class="mmdpay-float-amount" data-float-amount>—</div>
        </div>
        <div class="mmdpay-float-actions">
          <button type="button" class="mmdpay-btn mmdpay-btn-gold" data-float-pp>PromptPay</button>
          <button type="button" class="mmdpay-btn" data-float-ktb>KTB</button>
          <button type="button" class="mmdpay-btn" data-float-paypal>PayPal</button>
        </div>
      </div>
    `;
    document.body.appendChild(wrap);

    const amountEl = $('[data-float-amount]', wrap);
    const btnPP = $('[data-float-pp]', wrap);
    const btnKTB = $('[data-float-ktb]', wrap);
    const btnPayPal = $('[data-float-paypal]', wrap);

    btnPP.addEventListener("click", () => actions.onPromptPay());
    btnKTB.addEventListener("click", () => actions.onKTB());
    btnPayPal.addEventListener("click", () => actions.onPayPal());

    const tick = () => {
      try {
        const amt = getAmountFn();
        amountEl.textContent = moneyTHB(amt);
      } catch (_) {}
    };
    tick();
    return { tick };
  }

  // -------- KTB modal --------
  function ensureKTBModal(bank){
    // bank: { bank_name, account_name, account_no, note }
    const modal = document.createElement("div");
    modal.className = "mmdpay-modal";
    modal.innerHTML = `
      <div class="mmdpay-modal-card" role="dialog" aria-modal="true">
        <div class="mmdpay-modal-head">
          <div class="mmdpay-modal-title">KTB Bank Transfer</div>
          <button class="mmdpay-x" type="button" aria-label="Close">✕</button>
        </div>
        <div class="mmdpay-modal-body">
          <div class="mmdpay-bankline"><div class="mmdpay-bankk">Bank</div><div class="mmdpay-bankv">${bank.bank_name || "KTB"}</div></div>
          <div class="mmdpay-bankline"><div class="mmdpay-bankk">Account name</div><div class="mmdpay-bankv">${bank.account_name || "MMD Privé"}</div></div>
          <div class="mmdpay-bankline"><div class="mmdpay-bankk">Account no.</div><div class="mmdpay-bankv" data-acct>${bank.account_no || "-"}</div></div>
          ${bank.note ? `<div class="mmdpay-hint" style="margin-top:10px;">${bank.note}</div>` : ``}

          <div class="mmdpay-copy">
            <button class="mmdpay-btn mmdpay-btn-gold" type="button" data-copy-acct>Copy account</button>
            <button class="mmdpay-btn" type="button" data-close>Close</button>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    const open = () => modal.classList.add("is-open");
    const close = () => modal.classList.remove("is-open");

    $(".mmdpay-x", modal).addEventListener("click", close);
    $('[data-close]', modal).addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });

    $('[data-copy-acct]', modal).addEventListener("click", async () => {
      const acct = String(bank.account_no || "").trim();
      if (!acct) return;
      try {
        await navigator.clipboard.writeText(acct);
      } catch(_) {}
    });

    return { open, close };
  }

  // -------- Controller per page root --------
  function initCourse(root, cfg){
    // Elements
    const elHeroBg = $(".mmdpay-hero-bg", root);
    if (elHeroBg && cfg.hero_image) elHeroBg.style.backgroundImage = `url("${cfg.hero_image}")`;

    // Inputs
    const inModel = $("#mmd_model", root);
    const inTotal = $("#mmd_total", root);
    const inTips  = $("#mmd_tips", root);

    // Summary
    const outSumTotal = $("#mmd_sumTotal", root);
    const outSumPct   = $("#mmd_sumPct", root);
    const outSumPay   = $("#mmd_sumPay", root);
    const badge = $("#mmd_promoBadge", root);
    const promoMsg = $("#mmd_promoMsg", root);

    // Buttons
    const btnApplyPromo = $("#mmd_applyPromo", root);
    const inPromo = $("#mmd_promo", root);
    const btnPayPal = $("#mmd_paypalBtn", root);
    const btnPromptPay = $("#mmd_promptpayBtn", root);
    const btnKTB = $("#mmd_ktbBtn", root);

    // State
    let promoCodes = null;
    let promoApplied = null;

    const getPlan = () => Number($('input[name="mmd_plan"]:checked', root)?.value || 30);

    const compute = () => {
      const plan = getPlan();

      const total = toNumber(inTotal?.value);
      const tips = toNumber(inTips?.value);

      // discount only base total
      const { discounted, discount } = applyDiscount(total, promoApplied);

      const due = (discounted * (plan/100)) + tips;

      if (outSumTotal) outSumTotal.textContent = moneyTHB(total);
      if (outSumPct) outSumPct.textContent = `${plan}%`;
      if (outSumPay) outSumPay.textContent = moneyTHB(due);

      if (badge){
        if (promoApplied){
          const label = promoApplied.label ? ` · ${promoApplied.label}` : "";
          const d = Math.round(discount);
          badge.style.display = "";
          badge.textContent = `Applied: ${promoApplied.code}${label}${d>0?` (−${moneyTHB(d).replace(" THB","")} THB)`:``}`;
        } else {
          badge.style.display = "none";
          badge.textContent = "";
        }
      }

      return { plan, total, tips, due };
    };

    const openPromptPay = () => {
      const { due } = compute();
      const link = buildPromptPayLink(cfg.promptpay_id, due);
      window.open(link, "_blank", "noopener");
    };

    const openPayPal = () => {
      // Open PayPal base (optionally add context)
      const { plan, total, tips } = compute();
      const u = new URL(cfg.paypal_url);
      u.searchParams.set("plan", String(plan));
      u.searchParams.set("total", String(Math.round(total)));
      u.searchParams.set("tips", String(Math.round(tips)));
      const code = upper(inPromo?.value);
      if (code) u.searchParams.set("promo", code);
      if (inModel?.value) u.searchParams.set("model", String(inModel.value).trim());
      window.open(u.toString(), "_blank", "noopener");
    };

    const ktbModal = ensureKTBModal(cfg.ktb || {
      bank_name: "KTB",
      account_name: "MMD Privé",
      account_no: cfg.ktb_account_no || "",
      note: cfg.ktb_note || ""
    });

    const openKTB = () => ktbModal.open();

    // Bind inputs
    ["input","blur"].forEach(evt => {
      inTotal?.addEventListener(evt, compute);
      inTips?.addEventListener(evt, compute);
      inModel?.addEventListener(evt, () => {}); // keep value
    });
    $$('input[name="mmd_plan"]', root).forEach(r => r.addEventListener("change", compute));

    // Promo apply
    async function doApplyPromo(){
      const code = upper(inPromo?.value);
      promoApplied = null;

      if (!code){
        if (promoMsg) promoMsg.textContent = "";
        compute();
        return;
      }

      const found = findPromo(promoCodes, code);
      if (found){
        promoApplied = {
          code,
          label: found.label || "",
          percent_off: Number.isFinite(found.percent_off) ? Number(found.percent_off) : undefined,
          amount_off: Number.isFinite(found.amount_off) ? Number(found.amount_off) : undefined
        };
        if (promoMsg) promoMsg.textContent = `Applied: ${promoApplied.code}${promoApplied.label ? " · " + promoApplied.label : ""}`;
        compute();
        return;
      }

      // optional validate endpoint (if your worker supports)
      try {
        const url = `${cfg.worker_domain}/validate-promo?code=${encodeURIComponent(code)}&context=course`;
        const r = await fetch(url, { cache:"no-store" });
        if (r.ok){
          const data = await r.json().catch(() => null);
          if (data && data.ok && data.promo){
            promoApplied = {
              code: upper(data.promo.code || code),
              label: data.promo.label || "",
              percent_off: Number.isFinite(data.promo.percent_off) ? Number(data.promo.percent_off) : undefined,
              amount_off: Number.isFinite(data.promo.amount_off) ? Number(data.promo.amount_off) : undefined
            };
            if (promoMsg) promoMsg.textContent = `Applied: ${promoApplied.code}${promoApplied.label ? " · " + promoApplied.label : ""}`;
            compute();
            return;
          }
        }
      } catch(_) {}

      if (promoMsg) promoMsg.textContent = "โค้ดไม่ถูกต้อง";
      compute();
    }

    btnApplyPromo?.addEventListener("click", doApplyPromo);
    inPromo?.addEventListener("keydown", (e) => {
      if (e.key === "Enter"){ e.preventDefault(); doApplyPromo(); }
    });

    // Payment buttons
    btnPromptPay?.addEventListener("click", openPromptPay);
    btnPayPal?.addEventListener("click", openPayPal);
    btnKTB?.addEventListener("click", openKTB);

    // Floating bar
    const floater = ensureFloating(root, () => compute().due, {
      onPromptPay: openPromptPay,
      onKTB: openKTB,
      onPayPal: openPayPal
    });

    // Initial + live promo load
    (async () => {
      promoCodes = await fetchPromoCodesLive(cfg.worker_domain);
      compute();
      floater.tick();
    })();

    // Keep floater updated on any compute
    const _compute = compute;
    const wrapped = () => {
      const v = _compute();
      floater.tick();
      return v;
    };
    // Replace compute reference for internal calls
    // (safe because only used in closures above)
  }

  // -------- Boot: detect which page root exists --------
  function boot(){
    // Course page root (this answer focuses on /pay/course)
    const courseRoot = document.getElementById("mmd-pay-course");
    if (!courseRoot) return;

    // Config from data-config element (optional)
    const cfgEl = document.querySelector('[data-mmd-pay-config="course"]');

    const cfg = {
      worker_domain: cfgEl?.getAttribute("data-worker-domain") || "https://telegram.malemodel-bkk.workers.dev",
      promptpay_id: cfgEl?.getAttribute("data-promptpay-id") || "promptpay.io/0829528889",
      paypal_url: cfgEl?.getAttribute("data-paypal-url") || "https://www.paypal.com/ncp/payment/996TRGRKP8JJS",
      hero_image: cfgEl?.getAttribute("data-hero-image") || "",
      ktb: {
        bank_name: cfgEl?.getAttribute("data-ktb-bank-name") || "KTB",
        account_name: cfgEl?.getAttribute("data-ktb-account-name") || "MMD Privé",
        account_no: cfgEl?.getAttribute("data-ktb-account-no") || "",
        note: cfgEl?.getAttribute("data-ktb-note") || "หลังโอน กรุณาเก็บสลิปไว้ และแจ้งทีมงาน"
      }
    };

    initCourse(courseRoot, cfg);
  }

  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot, { once:true });

})();
