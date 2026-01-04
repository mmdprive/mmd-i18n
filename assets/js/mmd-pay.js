/* =========================================================
   MMD PAY (GLOBAL) — Controller
   FILE: assets/js/mmd-pay.js
   VERSION: 2026-01-04.2
========================================================= */

(() => {
  "use strict";

  // Guard กันรันซ้ำ (Webflow embed ชอบซ้ำ)
  if (window.__MMD_PAY_BOOT__) return;
  window.__MMD_PAY_BOOT__ = true;

  const $ = (sel, root=document) => root.querySelector(sel);
  const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));

  const toNumber = (v) => {
    if (v == null) return 0;
    const s = String(v).replace(/,/g, "").trim();
    const n = parseFloat(s);
    return Number.isFinite(n) ? n : 0;
  };

  const clamp = (n, a, b) => Math.min(b, Math.max(a, n));

  const money = (n) => {
    const x = Math.max(0, Math.round(n));
    return x.toLocaleString("th-TH") + " THB";
  };

  const normalizeCode = (s) => String(s || "").trim().toUpperCase();

  function readConfig() {
    const cfg = $('[data-mmd-pay-config="course"]') || $('[data-mmd-pay-config]');
    const data = cfg ? cfg.dataset : {};

    // Required
    const rootId = data.rootId || "mmd-pay-course";

    // Worker / endpoints
    const worker = (data.workerDomain || "").replace(/\/$/, "");
    const promptpayId = (data.promptpayId || "promptpay.io/0829528889").replace(/^https?:\/\//,"").replace(/\/$/,"");
    const paypalUrl = data.paypalUrl || "";

    // Hero
    const heroImage = data.heroImage || "";

    // KTB
    const ktbBankName = data.ktbBankName || "KTB";
    const ktbAccountName = data.ktbAccountName || "ธัชชะ ป.";
    const ktbAccountNo = data.ktbAccountNo || "1420335898";
    const ktbNote = data.ktbNote || "หลังโอน กรุณาเก็บสลิปไว้ และแจ้งทีมงาน";

    return {
      rootId,
      worker,
      promptpayId,
      paypalUrl,
      heroImage,
      ktb: { ktbBankName, ktbAccountName, ktbAccountNo, ktbNote }
    };
  }

  /* =========================
     PROMO (LIVE from Worker)
     Accepts formats:
       - {PROMO_CODES_JSON:"{...}"} or {PROMO_CODES_JSON:{...}}
       - direct: { VIP2025:{label,percent_off|amount_off}, ... }
       - direct array: [{code,label,percent_off|amount_off}]
       - {codes:[...]}
========================= */
  async function fetchPromoCodesLive(workerBase) {
    if (!workerBase) return null;

    const endpoints = [
      `${workerBase}/promo`,
      `${workerBase}/promo-codes`,
      `${workerBase}/promo-codes.json`,
      `${workerBase}/config`,
      `${workerBase}/PROMO_CODES_JSON`,
    ];

    for (const url of endpoints) {
      try {
        const r = await fetch(url, { cache: "no-store" });
        if (!r.ok) continue;

        const data = await r.json().catch(() => null);
        if (!data) continue;

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

  function findPromo(promoCodes, code) {
    if (!promoCodes) return null;
    const key = normalizeCode(code);
    if (!key) return null;

    if (Array.isArray(promoCodes)) {
      return promoCodes.find(x => normalizeCode(x.code) === key) || null;
    }

    if (promoCodes[key] && typeof promoCodes[key] === "object") {
      return { code: key, ...promoCodes[key] };
    }

    if (Array.isArray(promoCodes.codes)) {
      return promoCodes.codes.find(x => normalizeCode(x.code) === key) || null;
    }

    return null;
  }

  function applyDiscount(baseAmount, promoApplied) {
    // discount affects base only (ยอดชำระทั้งหมด), not tips
    if (!promoApplied) return { discounted: baseAmount, discount: 0 };

    const p = promoApplied;
    let discount = 0;

    if (Number.isFinite(p.percent_off)) {
      discount = baseAmount * (p.percent_off / 100);
    } else if (Number.isFinite(p.amount_off)) {
      discount = p.amount_off;
    }

    discount = clamp(discount, 0, baseAmount);
    return { discounted: baseAmount - discount, discount };
  }

  /* =========================
     KTB MODAL
========================= */
  function ensureKtbModal(cfg) {
    if ($("#mmd-ktb-modal")) return;

    const modal = document.createElement("div");
    modal.className = "mmdpay-modal";
    modal.id = "mmd-ktb-modal";
    modal.innerHTML = `
      <div class="mmdpay-modal-backdrop" data-close="1"></div>
      <div class="mmdpay-modal-card" role="dialog" aria-modal="true" aria-label="KTB Bank Transfer">
        <div class="mmdpay-modal-head">
          <div class="mmdpay-modal-title">โอนเงินผ่านธนาคาร (${cfg.ktb.ktbBankName})</div>
          <button class="mmdpay-modal-x" type="button" data-close="1">✕</button>
        </div>
        <div class="mmdpay-modal-body">
          <div class="mmdpay-kvblock">
            <div class="mmdpay-kvrow"><div class="k">ธนาคาร</div><div class="v" id="mmd_ktb_bank">${cfg.ktb.ktbBankName}</div></div>
            <div class="mmdpay-kvrow"><div class="k">ชื่อบัญชี</div><div class="v" id="mmd_ktb_name">${cfg.ktb.ktbAccountName}</div></div>
            <div class="mmdpay-kvrow"><div class="k">เลขบัญชี</div><div class="v" id="mmd_ktb_no">${cfg.ktb.ktbAccountNo}</div></div>
          </div>

          <div class="mmdpay-hint" style="margin-top:12px">${cfg.ktb.ktbNote}</div>

          <div class="mmdpay-copy">
            <button class="mmdpay-btn" type="button" id="mmd_copy_ktb_name">Copy ชื่อบัญชี</button>
            <button class="mmdpay-btn mmdpay-btn-gold" type="button" id="mmd_copy_ktb_no">Copy เลขบัญชี</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    const close = () => modal.classList.remove("is-open");
    modal.addEventListener("click", (e) => {
      const t = e.target;
      if (t && t.getAttribute && t.getAttribute("data-close") === "1") close();
    });

    $("#mmd_copy_ktb_name")?.addEventListener("click", async () => {
      await safeCopy(cfg.ktb.ktbAccountName);
    });
    $("#mmd_copy_ktb_no")?.addEventListener("click", async () => {
      await safeCopy(cfg.ktb.ktbAccountNo);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function openKtbModal() {
    const modal = $("#mmd-ktb-modal");
    if (modal) modal.classList.add("is-open");
  }

  async function safeCopy(text) {
    try {
      await navigator.clipboard.writeText(String(text || ""));
    } catch (_) {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = String(text || "");
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand("copy"); } catch(_) {}
      ta.remove();
    }
  }

  /* =========================
     MAIN (COURSE)
     Due now = (baseAfterDiscount * percent) + tips
========================= */
  function bindCourse(cfg, promoCodes) {
    const root = document.getElementById(cfg.rootId);
    if (!root) return;

    // inject hero bg
    const heroBg = $(".mmdpay-hero-bg", root);
    if (heroBg && cfg.heroImage) {
      heroBg.style.backgroundImage = `url("${cfg.heroImage}")`;
    }

    ensureKtbModal(cfg);

    // elements
    const elModel = $("#mmd_model", root);
    const elTotal = $("#mmd_total", root);
    const elTips  = $("#mmd_tips", root);

    const elPromo = $("#mmd_promo", root);
    const elPromoBtn = $("#mmd_applyPromo", root);
    const elPromoMsg = $("#mmd_promoMsg", root);
    const elPromoBadge = $("#mmd_promoBadge", root);

    const elSumTotal = $("#mmd_sumTotal", root);
    const elSumPct = $("#mmd_sumPct", root);
    const elSumPay = $("#mmd_sumPay", root);

    const btnPromptPay = $("#mmd_promptpayBtn", root);
    const btnPayPal = $("#mmd_paypalBtn", root);
    const btnKtb = $("#mmd_ktbBtn", root);

    // floating
    const floatAmt = $("#mmd_float_amount");
    const floatPP  = $("#mmd_float_pp");
    const floatPY  = $("#mmd_float_py");
    const floatKB  = $("#mmd_float_kb");

    let promoApplied = null; // {code,label,percent_off,amount_off}

    const getPlan = () => {
      const r = $('input[name="mmd_plan"]:checked', root);
      return Number(r?.value || 30);
    };

    const calc = () => {
      const total = toNumber(elTotal?.value);
      const tips = toNumber(elTips?.value);
      const plan = getPlan();

      const { discounted, discount } = applyDiscount(total, promoApplied);
      const due = (discounted * (plan / 100)) + tips;

      // summary UI
      if (elSumTotal) elSumTotal.textContent = money(total);
      if (elSumPct) elSumPct.textContent = `${plan}%`;
      if (elSumPay) elSumPay.textContent = money(due);

      // floating
      if (floatAmt) floatAmt.textContent = money(due);

      // promo badge
      if (elPromoBadge) {
        if (promoApplied) {
          const d = Math.round(discount);
          const label = promoApplied.label ? ` · ${promoApplied.label}` : "";
          elPromoBadge.style.display = "";
          elPromoBadge.textContent = `Applied: ${promoApplied.code}${label}${d > 0 ? ` (−${d.toLocaleString("th-TH")} THB)` : ""}`;
        } else {
          elPromoBadge.style.display = "none";
          elPromoBadge.textContent = "";
        }
      }

      return { total, tips, plan, due };
    };

    const openPromptPay = () => {
      const { due } = calc();
      const amt = Math.max(0, Math.round(due));
      const url = `https://${cfg.promptpayId}/${amt}`;
      window.open(url, "_blank", "noopener");
    };

    const openPayPal = () => {
      if (!cfg.paypalUrl) return;
      const { total, tips, plan, due } = calc();
      const u = new URL(cfg.paypalUrl);

      // optional params (ไม่ทำให้ลิงก์หลักพัง)
      u.searchParams.set("plan", String(plan));
      u.searchParams.set("total", String(Math.round(total)));
      u.searchParams.set("tips", String(Math.round(tips)));
      u.searchParams.set("due", String(Math.round(due)));

      const code = normalizeCode(elPromo?.value);
      if (code) u.searchParams.set("promo", code);

      const model = String(elModel?.value || "").trim();
      if (model) u.searchParams.set("model", model);

      window.open(u.toString(), "_blank", "noopener");
    };

    const applyPromo = async () => {
      const code = normalizeCode(elPromo?.value);
      promoApplied = null;

      if (!code) {
        if (elPromoMsg) elPromoMsg.textContent = "";
        calc();
        return;
      }

      // 1) local/live list
      const found = findPromo(promoCodes, code);
      if (found) {
        promoApplied = {
          code,
          label: found.label || "",
          percent_off: Number.isFinite(found.percent_off) ? Number(found.percent_off) : undefined,
          amount_off: Number.isFinite(found.amount_off) ? Number(found.amount_off) : undefined
        };
        if (elPromoMsg) elPromoMsg.textContent = `Applied: ${promoApplied.code}${promoApplied.label ? " · " + promoApplied.label : ""}`;
        calc();
        return;
      }

      // 2) validate via worker (best effort)
      if (cfg.worker) {
        try {
          const url = `${cfg.worker}/validate-promo?code=${encodeURIComponent(code)}&context=course`;
          const r = await fetch(url, { cache: "no-store" });
          if (r.ok) {
            const data = await r.json().catch(() => null);
            if (data && data.ok && data.promo) {
              promoApplied = {
                code: normalizeCode(data.promo.code || code),
                label: data.promo.label || "",
                percent_off: Number.isFinite(data.promo.percent_off) ? Number(data.promo.percent_off) : undefined,
                amount_off: Number.isFinite(data.promo.amount_off) ? Number(data.promo.amount_off) : undefined
              };
              if (elPromoMsg) elPromoMsg.textContent = `Applied: ${promoApplied.code}${promoApplied.label ? " · " + promoApplied.label : ""}`;
              calc();
              return;
            }
          }
        } catch (_) {}
      }

      if (elPromoMsg) elPromoMsg.textContent = "โค้ดไม่ถูกต้อง";
      calc();
    };

    // bind events
    [elTotal, elTips].forEach(el => {
      if (!el) return;
      el.addEventListener("input", calc);
      el.addEventListener("blur", calc);
    });

    $$('input[name="mmd_plan"]', root).forEach(r => r.addEventListener("change", calc));

    elPromoBtn?.addEventListener("click", applyPromo);
    elPromo?.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); applyPromo(); }
    });

    btnPromptPay?.addEventListener("click", openPromptPay);
    btnPayPal?.addEventListener("click", openPayPal);
    btnKtb?.addEventListener("click", openKtbModal);

    // floating bind
    floatPP?.addEventListener("click", openPromptPay);
    floatPY?.addEventListener("click", openPayPal);
    floatKB?.addEventListener("click", openKtbModal);

    // initial calc
    calc();
  }

  /* =========================
     INIT
========================= */
  document.addEventListener("DOMContentLoaded", async () => {
    const cfg = readConfig();
    const promoCodes = await fetchPromoCodesLive(cfg.worker);

    // bind course UI
    bindCourse(cfg, promoCodes);
  });

})();
