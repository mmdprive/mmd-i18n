/* =========================================
   MMD PRIVÉ — CONFIRMATION CORE (v3)
   - Reads ctx from #mmd-confirmation dataset
   - Expired view support
   - Actions: print | terms | support | next | retry
   - Points:
     - pointsEarned, pointsTotal, pointsThreshold
     - Emits threshold event when crossing threshold
     - localStorage de-dup per order/ref
   - Exposes: MMD.confirmation.init(root?, overrides?)
========================================= */

(function () {
  "use strict";

  window.MMD = window.MMD || {};
  const MMD = window.MMD;

  const ROOT_ID = "mmd-confirmation";

  const ALLOW = {
    page: new Set(["payment","job","model"]),
    tier: new Set(["standard","premium","vip","svip"]),
    status: new Set(["success","pending","failed"]),
  };

  const DEFAULT_POINTS_THRESHOLD = 120;

  function safeLower(v){ return (v == null ? "" : String(v)).trim().toLowerCase(); }
  function toUpper(v){ return (v == null ? "" : String(v)).trim().toUpperCase(); }
  function trim(v){ return (v == null ? "" : String(v)).trim(); }

  function t(key, fallback){
    try{
      if (MMD.i18n && typeof MMD.i18n.t === "function"){
        const v = MMD.i18n.t(key);
        if (v && v !== key) return v;
      }
    } catch(e){}
    return fallback || key;
  }

  function maskId(id){
    if (!id) return "—";
    const s = String(id).trim();
    if (s.length <= 6) return s;
    return s.slice(0,2) + "****" + s.slice(-4);
  }

  function numberize(v){
    if (v == null) return null;
    const s = String(v).replace(/,/g,"").trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function intize(v){
    if (v == null) return null;
    const s = String(v).replace(/,/g,"").trim();
    if (!s) return null;
    const n = Number(s);
    if (!Number.isFinite(n)) return null;
    return Math.floor(n);
  }

  function money(n, locale, currency){
    if (n == null) return "—";
    return new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(n) + " " + currency;
  }

  function splitTermsItems(s){
    const raw = trim(s);
    if (!raw) return [];
    return raw.split("|").map(x => x.trim()).filter(Boolean);
  }

  function safeDispatch(name, detail){
    try{
      window.dispatchEvent(new CustomEvent(name, { detail }));
    } catch(e){}
  }

  function read(root){
    const d = root.dataset || {};
    return {
      page: safeLower(d.confirmationPage),
      tier: safeLower(d.userTier),
      status: safeLower(d.status),
      locale: safeLower(d.locale) || "en",

      expired: d.expired === "1" || d.expired === "true",

      orderId: trim(d.orderId),
      refCode: trim(d.refCode),

      service: trim(d.service),
      modelCode: trim(d.modelCode),
      date: trim(d.date),
      time: trim(d.time),
      locationName: trim(d.locationName),
      locationUrl: trim(d.locationUrl),

      amount: numberize(d.amount),
      deposit: numberize(d.deposit),
      balance: numberize(d.balance),
      currency: toUpper(d.currency) || "THB",
      method: safeLower(d.paymentMethod) || "credit_card",

      hash: trim(d.hash),
      barcode: trim(d.barcode),

      // Points (authoritative values should come from Workers)
      pointsEarned: intize(d.pointsEarned),
      pointsTotal: intize(d.pointsTotal),
      pointsThreshold: intize(d.pointsThreshold) ?? DEFAULT_POINTS_THRESHOLD,

      // Identity / membership mapping (for bot approval flow)
      memberId: trim(d.memberId),
      telegramUserId: trim(d.telegramUserId),

      termsTitle: trim(d.termsTitle) || t("confirmation.terms.title","Terms & Conditions"),
      termsItems: splitTermsItems(d.termsItems),

      nextUrl: trim(d.nextUrl),
      supportUrl: trim(d.supportUrl),

      // Optional: pointsTotalBefore (if Workers sends it; otherwise UI will not infer threshold crossing)
      pointsTotalBefore: intize(d.pointsTotalBefore),
    };
  }

  function normalize(ctx){
    const out = Object.assign({}, ctx);

    if (!ALLOW.page.has(out.page)) out.page = "payment";
    if (!ALLOW.tier.has(out.tier)) out.tier = "standard";
    if (!ALLOW.status.has(out.status)) out.status = "success";

    out.orderIdMasked = maskId(out.orderId);

    out.amountText  = money(out.amount, out.locale, out.currency);
    out.depositText = money(out.deposit, out.locale, out.currency);
    out.balanceText = money(out.balance, out.locale, out.currency);

    // Points helpers for UI (no client-side computation to avoid mismatch)
    out.hasPoints = (out.pointsEarned != null) || (out.pointsTotal != null);
    out.pointsThreshold = out.pointsThreshold || DEFAULT_POINTS_THRESHOLD;
    out.pointsProgressText =
      (out.pointsTotal != null)
        ? `${out.pointsTotal} / ${out.pointsThreshold}`
        : `— / ${out.pointsThreshold}`;

    return out;
  }

  function setAttrs(root, ctx){
    root.setAttribute("data-confirmation-page", ctx.page);
    root.setAttribute("data-user-tier", ctx.tier);
    root.setAttribute("data-status", ctx.status);
    root.setAttribute("data-locale", ctx.locale);
    root.setAttribute("data-expired", ctx.expired ? "1" : "0");
  }

  function statusCopy(ctx){
    const base = {
      success: { h: t("confirmation.common.status.success.h","Confirmed"), p: t("confirmation.common.status.success.p","Your confirmation has been recorded successfully.") },
      pending: { h: t("confirmation.common.status.pending.h","Pending"), p: t("confirmation.common.status.pending.p","We’re verifying your details. You will be notified once completed.") },
      failed:  { h: t("confirmation.common.status.failed.h","Not Completed"), p: t("confirmation.common.status.failed.p","Please try again or contact support.") },
    };

    const byPage = {
      payment: {
        success: { h: t("confirmation.payment.status.success.h","Payment Confirmed"), p: t("confirmation.payment.status.success.p","Your payment has been confirmed.") },
        pending: { h: t("confirmation.payment.status.pending.h","Payment Pending"), p: t("confirmation.payment.status.pending.p","We’re verifying your payment. Please keep your reference.") },
        failed:  { h: t("confirmation.payment.status.failed.h","Payment Not Completed"), p: t("confirmation.payment.status.failed.p","Please try again or use another method.") },
      },
      job: {
        success: { h: t("confirmation.job.status.success.h","Job Confirmed"), p: t("confirmation.job.status.success.p","Your request has been confirmed and queued.") },
        pending: { h: t("confirmation.job.status.pending.h","Job Pending"), p: t("confirmation.job.status.pending.p","We’re reviewing your request.") },
        failed:  { h: t("confirmation.job.status.failed.h","Job Not Completed"), p: t("confirmation.job.status.failed.p","Please contact support to resolve this issue.") },
      },
      model: {
        success: { h: t("confirmation.model.status.success.h","Assignment Confirmed"), p: t("confirmation.model.status.success.p","Your selection has been confirmed.") },
        pending: { h: t("confirmation.model.status.pending.h","Assignment Pending"), p: t("confirmation.model.status.pending.p","We’re verifying availability.") },
        failed:  { h: t("confirmation.model.status.failed.h","Assignment Not Completed"), p: t("confirmation.model.status.failed.p","Please choose another model or contact support.") },
      }
    };

    return (byPage[ctx.page] && byPage[ctx.page][ctx.status]) || base[ctx.status] || base.success;
  }

  function expiredHtml(ctx){
    return `
      <div class="mmdc-expired" role="region" aria-label="Expired">
        <h2>${t("confirmation.expired.title","Link Expired")}</h2>
        <p>${t("confirmation.expired.desc","This confirmation link is no longer valid. Please contact support if you need assistance.")}</p>
        <div class="mmdc-actions" style="margin-top:18px;">
          ${ctx.supportUrl ? `<a class="mmdc-btn primary" href="${ctx.supportUrl}" data-action="support">${t("confirmation.common.cta.support","Support")}</a>` : ""}
          <button class="mmdc-btn ghost" type="button" data-action="print">${t("confirmation.common.cta.print","Print / Save PDF")}</button>
        </div>
      </div>
    `;
  }

  function termsModalHtml(ctx){
    const items = (ctx.termsItems && ctx.termsItems.length)
      ? `<ul>${ctx.termsItems.map(li => `<li>${li}</li>`).join("")}</ul>`
      : `<div>${t("confirmation.terms.empty","No terms provided.")}</div>`;

    return `
      <div class="mmdc-modal" aria-hidden="true" role="dialog" aria-modal="true">
        <div class="mmdc-modal-backdrop" data-action="terms-close" aria-hidden="true"></div>
        <div class="mmdc-modal-box" role="document">
          <div class="mmdc-modal-head">
            <h3 class="mmdc-modal-title">${ctx.termsTitle}</h3>
            <button class="mmdc-modal-close" type="button" aria-label="Close" data-action="terms-close">✕</button>
          </div>
          <div class="mmdc-modal-body">
            ${items}
          </div>
        </div>
      </div>
    `;
  }

  function shellHtml(ctx){
    const copy = statusCopy(ctx);
    return `
      <div class="mmdc-shell">
        <div class="mmdc-hero" aria-hidden="true"></div>

        ${expiredHtml(ctx)}

        <section class="mmd-confirm-wrap" role="region" aria-label="Confirmation">
          <div class="mmdc-head">
            <div class="mmdc-brand">
              <div class="mmdc-logo"></div>
              <div>
                <h1 class="mmdc-title">MMD Privé</h1>
                <p class="mmdc-subtitle">${t("confirmation.common.subtitle","Confirmation")}</p>
              </div>
            </div>

            <div class="mmd-status" aria-label="Status">
              <span class="mmd-status-dot"></span>
              <span>${copy.h}</span>
            </div>
          </div>

          <div class="mmd-timeline" aria-label="Progress">
            <div class="mmd-step is-done">${t("confirmation.timeline.step1","Submitted")}</div>
            <div class="mmd-step ${ctx.status !== "failed" ? "is-done" : ""}">${t("confirmation.timeline.step2","Verified")}</div>
            <div class="mmd-step ${ctx.status === "success" ? "is-done" : ""}">${t("confirmation.timeline.step3","Confirmed")}</div>
          </div>

          <div class="mmd-confirm-grid">
            <div data-slot="left"></div>
            <div data-slot="right"></div>
          </div>

          <div class="mmdc-actions" data-slot="actions"></div>
        </section>

        ${termsModalHtml(ctx)}
      </div>
    `;
  }

  function render(root, ctx){
    root.innerHTML = shellHtml(ctx);

    if (!ctx.expired){
      const wrap = root.querySelector(".mmd-confirm-wrap");
      if (wrap) requestAnimationFrame(() => wrap.classList.add("is-visible"));
    }

    if (ctx.expired) return;

    const left = root.querySelector('[data-slot="left"]');
    const right = root.querySelector('[data-slot="right"]');
    const actions = root.querySelector('[data-slot="actions"]');

    const modules = MMD.confirmation && MMD.confirmation.modules;
    if (!modules || typeof modules[ctx.page] !== "function") return;

    const payload = modules[ctx.page](ctx, { t });

    if (left) left.innerHTML = payload.leftHtml || "";
    if (right) right.innerHTML = payload.rightHtml || "";
    if (actions) actions.innerHTML = payload.actionsHtml || "";
  }

  function openTerms(root){
    const modal = root.querySelector(".mmdc-modal");
    if (!modal) return;
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden","false");
    try{ document.body.style.overflow = "hidden"; } catch(e){}
  }

  function closeTerms(root){
    const modal = root.querySelector(".mmdc-modal");
    if (!modal) return;
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden","true");
    try{ document.body.style.overflow = ""; } catch(e){}
  }

  function storageKeyFor(ctx){
    const id = ctx.orderId || ctx.refCode || "unknown";
    return `mmd_points_notified_${id}`;
  }

  function maybeEmitPointsThreshold(ctx){
    // Emit only when:
    // - status success (authoritative)
    // - pointsTotal + threshold exist
    // - we can prove crossing threshold (pointsTotalBefore provided), OR we allow fallback if pointsTotal >= threshold and not notified before
    if (ctx.status !== "success") return;
    if (ctx.pointsTotal == null || ctx.pointsThreshold == null) return;

    const key = storageKeyFor(ctx);
    const already = (function(){
      try{ return localStorage.getItem(key) === "1"; } catch(e){ return false; }
    })();
    if (already) return;

    const threshold = ctx.pointsThreshold;

    let crossed = false;
    if (ctx.pointsTotalBefore != null){
      crossed = (ctx.pointsTotalBefore < threshold) && (ctx.pointsTotal >= threshold);
    } else {
      // fallback: if we do not have "before", still notify once when total >= threshold
      crossed = (ctx.pointsTotal >= threshold);
    }

    if (!crossed) return;

    try{ localStorage.setItem(key, "1"); } catch(e){}

    safeDispatch("mmd:points:threshold", {
      orderId: ctx.orderId || null,
      refCode: ctx.refCode || null,
      memberId: ctx.memberId || null,
      telegramUserId: ctx.telegramUserId || null,
      tier: ctx.tier,
      pointsTotal: ctx.pointsTotal,
      pointsThreshold: threshold,
      pointsEarned: ctx.pointsEarned,
      page: ctx.page,
    });
  }

  function bindActions(root, ctx){
    root.addEventListener("click", function(e){
      const el = e.target && e.target.closest ? e.target.closest("[data-action]") : null;
      if (!el) return;

      const action = el.getAttribute("data-action") || "";
      if (!action) return;

      if (action === "print"){
        e.preventDefault();
        window.print();
        return;
      }

      if (action === "terms"){
        e.preventDefault();
        openTerms(root);
        return;
      }

      if (action === "terms-close"){
        e.preventDefault();
        closeTerms(root);
        return;
      }

      if (action === "retry"){
        e.preventDefault();
        safeDispatch("mmd:confirmation:retry", { ctx });
        return;
      }
    }, { passive:false });

    root.addEventListener("keydown", function(e){
      if (e.key === "Escape") closeTerms(root);
    });
  }

  function init(rootEl, overrides){
    const root = rootEl || document.getElementById(ROOT_ID);
    if (!root) return;

    const raw = read(root);
    const ctx = normalize(Object.assign({}, raw, overrides || {}));
    setAttrs(root, ctx);

    render(root, ctx);

    if (!root.__mmdConfirmBound){
      root.__mmdConfirmBound = true;
      bindActions(root, ctx);
    }

    // Global ready event (for Workers/UI integrations)
    safeDispatch("mmd:confirmation:ready", { ctx });

    // Points threshold event (for Telegram approval flow)
    maybeEmitPointsThreshold(ctx);
  }

  MMD.confirmation = MMD.confirmation || {};
  MMD.confirmation.init = init;

})();
