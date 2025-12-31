/* =========================================
   MMD PRIVÉ — CONFIRMATION MODULES
   Pages: payment | job | model
========================================= */

(function () {
  "use strict";

  window.MMD = window.MMD || {};
  const MMD = window.MMD;

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
    if (ctx.status === "failed"){
      out.push(btn(t("confirmation.common.cta.try_again","Try Again"), "", true, "retry"));
    }
    out.push(btn(t("confirmation.common.cta.continue","Continue"), ctx.nextUrl || "", true, "next"));
    if (ctx.supportUrl){
      out.push(btn(t("confirmation.common.cta.support","Support"), ctx.supportUrl, false, "support"));
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

  function payment(ctx, { t }){
    const leftHtml = [
      row(t("confirmation.common.fields.order_id","Order"), ctx.orderIdMasked, true),
      row(t("confirmation.payment.fields.method","Method"), methodLabel(ctx,t)),
      row(t("confirmation.payment.fields.amount","Amount"), ctx.amountText),
      ctx.refCode ? row(t("confirmation.common.fields.ref","Reference"), ctx.refCode, true) : "",
      row(t("confirmation.common.fields.status","Status"), statusShort(ctx,t))
    ].join("");

    const rightHtml = `
      <div data-only="payment">
        <div class="mmd-budget-box">
          <div class="mmd-budget-label">${t("confirmation.payment.summary.total","Total")}</div>
          <div class="mmd-budget-value">${ctx.amountText}</div>
          <div class="mmd-payment-breakdown">
            <div>${t("confirmation.payment.summary.method","Method")}</div><div>${methodLabel(ctx,t)}</div>
            <div>${t("confirmation.payment.summary.status","Status")}</div><div>${statusShort(ctx,t)}</div>
          </div>
        </div>

        <div class="mmd-verify">
          <div class="mmd-verify-qr" aria-label="QR" data-qr="placeholder"></div>
          <div>
            <div class="mmd-hash">${t("confirmation.payment.verify.note","Keep your reference for verification.")}</div>
            <div class="mmd-hash">${ctx.refCode ? ctx.refCode : ""}</div>
          </div>
        </div>
      </div>
    `;

    return { leftHtml, rightHtml, actionsHtml: actions(ctx,t) };
  }

  function job(ctx, { t }){
    const leftHtml = [
      row(t("confirmation.common.fields.order_id","Job"), ctx.orderIdMasked, true),
      ctx.refCode ? row(t("confirmation.common.fields.ref","Reference"), ctx.refCode, true) : "",
      row(t("confirmation.common.fields.status","Status"), statusShort(ctx,t)),
    ].join("");

    const rightHtml = `
      <div data-only="job">
        <div class="mmd-budget-box">
          <div class="mmd-budget-label">${t("confirmation.job.panel.title","Next Steps")}</div>
          <div class="mmd-hash" style="margin-top:10px;">
            ${t("confirmation.job.panel.desc","You can continue to your job detail page or contact support if you need changes.")}
          </div>
        </div>
      </div>
    `;

    return { leftHtml, rightHtml, actionsHtml: actions(ctx,t) };
  }

  function model(ctx, { t }){
    const leftHtml = [
      row(t("confirmation.common.fields.order_id","Confirmation"), ctx.orderIdMasked, true),
      ctx.refCode ? row(t("confirmation.common.fields.ref","Reference"), ctx.refCode, true) : "",
      row(t("confirmation.common.fields.status","Status"), statusShort(ctx,t)),
    ].join("");

    const rightHtml = `
      <div data-only="model">
        <div class="mmd-budget-box">
          <div class="mmd-budget-label">${t("confirmation.model.panel.title","Model Locked")}</div>
          <div class="mmd-hash" style="margin-top:10px;">
            ${t("confirmation.model.panel.desc","Your selected model is reserved under this confirmation.")}
          </div>
        </div>
      </div>
    `;

    return { leftHtml, rightHtml, actionsHtml: actions(ctx,t) };
  }

  MMD.confirmation = MMD.confirmation || {};
  MMD.confirmation.modules = { payment, job, model };

})();
