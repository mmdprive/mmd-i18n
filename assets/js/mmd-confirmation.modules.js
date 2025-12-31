/* =========================================
   MMD PRIVÉ — CONFIRMATION MODULES
   Modules:
   - payment(ctx)
   - job(ctx)
   - model(ctx)
========================================= */

(function () {
  "use strict";

  window.MMD = window.MMD || {};
  const MMD = window.MMD;

  function money(ctx) {
    if (!ctx.amount_fmt) return "";
    return `${ctx.amount_fmt} ${ctx.currency || ""}`.trim();
  }

  function methodLabel(ctx, t) {
    const map = {
      credit_card: t("confirmation.payment.method.credit_card", "Credit Card"),
      promptpay: t("confirmation.payment.method.promptpay", "PromptPay"),
      paypal: t("confirmation.payment.method.paypal", "PayPal"),
      bank_transfer: t("confirmation.payment.method.bank_transfer", "Bank Transfer"),
    };
    return map[ctx.payment_method] || ctx.payment_method;
  }

  function commonActions(ctx, t) {
    const actions = [];
    if (ctx.next_url) {
      actions.push({ kind: "primary", action: "next", label: t("confirmation.common.cta.continue", "Continue"), href: ctx.next_url });
    } else {
      actions.push({ kind: "primary", action: "next", label: t("confirmation.common.cta.continue", "Continue") });
    }
    if (ctx.support_url) {
      actions.push({ kind: "ghost", action: "support", label: t("confirmation.common.cta.support", "Support"), href: ctx.support_url });
    }
    return actions;
  }

  function payment(ctx, { t }) {
    const rows = [
      { label: t("confirmation.common.fields.order_id", "Order"), value: ctx.order_id_masked || "" , mono: true },
      { label: t("confirmation.payment.fields.method", "Method"), value: methodLabel(ctx, t) },
      { label: t("confirmation.payment.fields.amount", "Amount"), value: money(ctx) },
      { label: t("confirmation.payment.fields.ref", "Reference"), value: ctx.ref_code || "", mono: true },
      { label: t("confirmation.common.fields.status", "Status"), value: t(`confirmation.common.status.${ctx.status}.short`, ctx.status) },
    ];

    let extrasHtml = "";
    if (ctx.payment_method === "promptpay") {
      extrasHtml = `
        <div class="mmdc-panel mmdc-payment-only">
          <p class="mmdc-panel-h">${t("confirmation.payment.extras.promptpay.title", "PromptPay QR")}</p>
          <div class="mmdc-qr">
            <div>
              <p class="mmdc-panel-p">${t("confirmation.payment.extras.promptpay.desc", "If you need to pay again, use the QR below.")}</p>
              <div class="mmdc-divider"></div>
              <p class="mmdc-panel-p">${t("confirmation.payment.extras.promptpay.note", "Payments may take a moment to reflect.")}</p>
            </div>
            <div class="mmdc-qr-box" data-qr="promptpay">
              <span style="color:rgba(255,255,255,.55);font-size:12px;">QR</span>
            </div>
          </div>
        </div>
      `;
    }

    const status = (ctx.status === "success")
      ? { h: t("confirmation.payment.status.success.h", "Payment Confirmed"),
          p: t("confirmation.payment.status.success.p", "Your payment has been confirmed.") }
      : (ctx.status === "pending")
      ? { h: t("confirmation.payment.status.pending.h", "Payment Pending"),
          p: t("confirmation.payment.status.pending.p", "We’re verifying your payment. Please keep your reference.") }
      : { h: t("confirmation.payment.status.failed.h", "Payment Not Completed"),
          p: t("confirmation.payment.status.failed.p", "Please try again or use another method.") };

    const actions = commonActions(ctx, t);
    if (ctx.status === "failed") {
      actions.unshift({ kind: "primary", action: "retry", label: t("confirmation.common.cta.try_again", "Try Again") });
    }

    return { status, rows, extrasHtml, actions };
  }

  function job(ctx, { t }) {
    const rows = [
      { label: t("confirmation.common.fields.order_id", "Job"), value: ctx.order_id_masked || "", mono: true },
      { label: t("confirmation.job.fields.ref", "Reference"), value: ctx.ref_code || "", mono: true },
      { label: t("confirmation.common.fields.status", "Status"), value: t(`confirmation.common.status.${ctx.status}.short`, ctx.status) },
    ];

    const extrasHtml = `
      <div class="mmdc-panel mmdc-job-only">
        <p class="mmdc-panel-h">${t("confirmation.job.extras.next.title", "Next Steps")}</p>
        <p class="mmdc-panel-p">${t("confirmation.job.extras.next.desc", "You can continue to your job detail page or contact support if you need changes.")}</p>
      </div>
    `;

    const status = (ctx.status === "success")
      ? { h: t("confirmation.job.status.success.h", "Job Confirmed"),
          p: t("confirmation.job.status.success.p", "Your request has been confirmed and queued.") }
      : (ctx.status === "pending")
      ? { h: t("confirmation.job.status.pending.h", "Job Pending"),
          p: t("confirmation.job.status.pending.p", "We’re reviewing your request. You will be notified shortly.") }
      : { h: t("confirmation.job.status.failed.h", "Job Not Completed"),
          p: t("confirmation.job.status.failed.p", "Please contact support to resolve this issue.") };

    const actions = commonActions(ctx, t);
    if (ctx.status === "failed" && ctx.support_url) {
      // keep support prominent
      actions.unshift({ kind: "primary", action: "support", label: t("confirmation.common.cta.contact_support", "Contact Support"), href: ctx.support_url });
    }

    return { status, rows, extrasHtml, actions };
  }

  function model(ctx, { t }) {
    const rows = [
      { label: t("confirmation.common.fields.order_id", "Confirmation"), value: ctx.order_id_masked || "", mono: true },
      { label: t("confirmation.model.fields.ref", "Reference"), value: ctx.ref_code || "", mono: true },
      { label: t("confirmation.common.fields.status", "Status"), value: t(`confirmation.common.status.${ctx.status}.short`, ctx.status) },
    ];

    const extrasHtml = `
      <div class="mmdc-panel mmdc-model-only">
        <p class="mmdc-panel-h">${t("confirmation.model.extras.title", "Model Locked")}</p>
        <p class="mmdc-panel-p">${t("confirmation.model.extras.desc", "Your selected model is reserved under this confirmation.")}</p>
      </div>
    `;

    const status = (ctx.status === "success")
      ? { h: t("confirmation.model.status.success.h", "Model Confirmed"),
          p: t("confirmation.model.status.success.p", "Your selection has been confirmed.") }
      : (ctx.status === "pending")
      ? { h: t("confirmation.model.status.pending.h", "Model Pending"),
          p: t("confirmation.model.status.pending.p", "We’re verifying availability. Please wait for final confirmation.") }
      : { h: t("confirmation.model.status.failed.h", "Model Not Completed"),
          p: t("confirmation.model.status.failed.p", "Please choose another model or contact support.") };

    const actions = commonActions(ctx, t);
    if (ctx.status === "failed") {
      actions.unshift({ kind: "primary", action: "retry", label: t("confirmation.model.cta.choose_again", "Choose Again") });
    }

    return { status, rows, extrasHtml, actions };
  }

  MMD.confirmation = MMD.confirmation || {};
  MMD.confirmation.modules = { payment, job, model };

})();
