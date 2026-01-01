/* =========================================
   MMD PRIVÉ — CONFIRMATION MODULES (v2)
   Pages: payment | job | model
   - PromptPay QR via promptpay.io (phone locked)
   - Shows QR only when status != success AND method=promptpay
   - Deposit/Balance supported for ALL tiers
========================================= */

(function () {
  "use strict";

  window.MMD = window.MMD || {};
  const MMD = window.MMD;

  // LOCKED PromptPay phone
  const PROMPTPAY_PHONE = "0829528889";

  function row(label, value, mono){
    const cls = mono ? "mmd-info-value mono" : "mmd-info-value";
    return `
      <div class="mmd-info-row">
        <div class="mmd-info-label">${label}</div>
        <div class="${cls}">${value || "—"}</div>
      </div>
    `;
  }

  function btn(label, href, primary, action){
    const cls = "mmdc-btn" + (primary ? " primary" : " ghost");
    if (href) return `<a class="${cls}" href="${href}" data-action="${action||""}">${label}</a>`;
    return `<button class="${cls}" type="button" data-action="${action||""}">${label}</button>`;
  }

  function actions(ctx, t){
    const out = [];

    // Primary: Continue (if exists)
    if (ctx.nextUrl){
      out.push(btn(t("confirmation.common.cta.continue","Continue"), ctx.nextUrl, true, "next"));
    }

    // Print always available (premium feel)
    out.push(btn(t("confirmation.common.cta.print","Print / Save PDF"), "", false, "print"));

    // Terms modal if there are terms items (or always, your call)
    out.push(btn(t("confirmation.common.cta.terms","Terms & Conditions"), "", false, "terms"));

    // Support
    if (ctx.supportUrl){
      out.push(btn(t("confirmation.common.cta.support","Support"), ctx.supportUrl, false, "support"));
    }

    // Failed -> show retry at the front
    if (ctx.status === "failed"){
      out.unshift(btn(t("confirmation.common.cta.try_again","Try Again"), "", true, "retry"));
    }

    return out.join("");
  }

  function methodLabel(ctx, t){
    const map = {
      credit_card: t("confirmation.payment.method.credit_card","Credit Card"),
      promptpay: t("confirmation.payment.method.promptpay","PromptPay"),
      paypal: t("confirmation.payment.method.paypal","PayPal"),
      bank_transfer: t("confirmation.payment.method.bank_transfer","Bank Transfer"),
    };
    return map[ctx.method] || ctx.method;
  }

  function statusShort(ctx, t){
    const map = {
      success: t("confirmation.common.status.success.short","success"),
      pending: t("confirmation.common.status.pending.short","pending"),
      failed:  t("confirmation.common.status.failed.short","failed"),
    };
    return map[ctx.status] || ctx.status;
  }

  function promptpayQrSrc(amountNumber){
    if (amountNumber == null) return `https://promptpay.io/${PROMPTPAY_PHONE}.png`;
    return `https://promptpay.io/${PROMPTPAY_PHONE}/${String(amountNumber)}.png`;
  }

  function locationBlock(ctx, t){
    if (!ctx.locationName && !ctx.locationUrl) return "";
    const link = ctx.locationUrl
      ? `<a class="mmd-link" href="${ctx.locationUrl}" target="_blank" rel="noopener">${t("confirmation.common.cta.view_map","View map")}</a>`
      : "";
    const val = `${ctx.locationName || "—"}${link ? `<br>${link}` : ""}`;
    return row(t("confirmation.common.fields.location","Location"), val, false);
  }

  function payment(ctx, { t }){
    const leftHtml = [
      row(t("confirmation.common.fields.reference","Reference"), ctx.refCode || ctx.orderIdMasked, true),
      row(t("confirmation.common.fields.service","Service"), ctx.service || "—"),
      row(t("confirmation.common.fields.model","Model"), ctx.modelCode || "—"),
      row(t("confirmation.common.fields.date","Date"), ctx.date || "—"),
      row(t("confirmation.common.fields.time","Time"), ctx.time || "—"),
      locationBlock(ctx,t),
      row(t("confirmation.common.fields.status","Status"), statusShort(ctx,t))
    ].join("");

    // Payment panel: show amount + deposit/balance if provided
    const breakdownRows = [
      `<div>${t("confirmation.payment.summary.total","Total")}</div><div>${ctx.amountText}</div>`,
      (ctx.deposit != null) ? `<div>${t("confirmation.payment.summary.deposit","Deposit")}</div><div>${ctx.depositText}</div>` : "",
      (ctx.balance != null) ? `<div>${t("confirmation.payment.summary.balance","Balance")}</div><div>${ctx.balanceText}</div>` : "",
      `<div>${t("confirmation.payment.summary.method","Method")}</div><div>${methodLabel(ctx,t)}</div>`
    ].filter(Boolean).join("");

    // QR: show only when pending/failed AND method promptpay
    let verifyHtml = "";
    const shouldShowQr = (ctx.status !== "success") && (ctx.method === "promptpay");
    if (shouldShowQr){
      const qrSrc = promptpayQrSrc(ctx.amount);
      const hashLine = ctx.hash ? `<div class="mmd-hash">${t("confirmation.payment.verify.code","Verification Code")}: <span class="mmd-info-value mono">${ctx.hash}</span></div>` : "";
      const barcodeLine = ctx.barcode ? `<div class="mmd-barcode" title="${ctx.barcode}">${ctx.barcode}</div>` : "";
      const adminHint = `<div class="mmd-hash">${t("confirmation.payment.verify.hint","Admin scan to verify payment")}</div>`;

      verifyHtml = `
        <div class="mmd-verify">
          <img class="mmd-verify-qr" src="${qrSrc}" alt="PromptPay QR">
          <div>
            <div class="mmd-hash">${t("confirmation.payment.verify.note","Keep your reference for verification.")}</div>
            <div class="mmd-hash">${ctx.refCode ? ctx.refCode : ""}</div>
            ${hashLine}
            ${barcodeLine}
            ${adminHint}
          </div>
        </div>
      `;
    }

    const rightHtml = `
      <div data-only="payment">
        <div class="mmd-budget-box">
          <div class="mmd-budget-label">${t("confirmation.payment.summary.title","Payment Summary")}</div>
          <div class="mmd-budget-value">${ctx.amountText}</div>
          <div class="mmd-payment-breakdown">
            ${breakdownRows}
          </div>
        </div>
        ${verifyHtml}
      </div>
    `;

    return { leftHtml, rightHtml, actionsHtml: actions(ctx,t) };
  }

  function job(ctx, { t }){
    const leftHtml = [
      row(t("confirmation.common.fields.reference","Reference"), ctx.refCode || ctx.orderIdMasked, true),
      row(t("confirmation.common.fields.service","Service"), ctx.service || "—"),
      row(t("confirmation.common.fields.model","Model"), ctx.modelCode || "—"),
      row(t("confirmation.common.fields.date","Date"), ctx.date || "—"),
      row(t("confirmation.common.fields.time","Time"), ctx.time || "—"),
      locationBlock(ctx,t),
      row(t("confirmation.common.fields.status","Status"), statusShort(ctx,t))
    ].join("");

    const rightHtml = `
      <div data-only="job">
        <div class="mmd-budget-box">
          <div class="mmd-budget-label">${t("confirmation.job.panel.title","Next Steps")}</div>
          <div class="mmd-hash" style="margin-top:10px;">
            ${t("confirmation.job.panel.desc","Your booking is recorded. If you need changes, contact support.")}
          </div>
        </div>
      </div>
    `;

    return { leftHtml, rightHtml, actionsHtml: actions(ctx,t) };
  }

  function model(ctx, { t }){
    const leftHtml = [
      row(t("confirmation.common.fields.reference","Reference"), ctx.refCode || ctx.orderIdMasked, true),
      row(t("confirmation.common.fields.service","Service"), ctx.service || "—"),
      row(t("confirmation.common.fields.model","Model"), ctx.modelCode || "—"),
      row(t("confirmation.common.fields.date","Date"), ctx.date || "—"),
      row(t("confirmation.common.fields.time","Time"), ctx.time || "—"),
      locationBlock(ctx,t),
      row(t("confirmation.common.fields.status","Status"), statusShort(ctx,t))
    ].join("");

    const rightHtml = `
      <div data-only="model">
        <div class="mmd-budget-box">
          <div class="mmd-budget-label">${t("confirmation.model.panel.title","Assignment Locked")}</div>
          <div class="mmd-hash" style="margin-top:10px;">
            ${t("confirmation.model.panel.desc","This assignment is reserved under this confirmation.")}
          </div>
        </div>
      </div>
    `;

    return { leftHtml, rightHtml, actionsHtml: actions(ctx,t) };
  }

  MMD.confirmation = MMD.confirmation || {};
  MMD.confirmation.modules = { payment, job, model };

})();
