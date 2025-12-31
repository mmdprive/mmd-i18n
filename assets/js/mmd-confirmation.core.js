/* =========================================
   MMD PRIVÉ — CONFIRMATION CORE (Unified)
   - Reads dataset from #mmd-confirm
   - Normalizes ctx
   - Renders shell
   - Dispatches to modules (payment/job/model)
   - Binds actions and emits events
========================================= */

(function () {
  "use strict";

  window.MMD = window.MMD || {};
  const MMD = window.MMD;

  const ROOT_ID = "mmd-confirm";
  const DEFAULTS = {
    page: "payment",
    tier: "standard",
    status: "success",
    locale: "en",
    currency: "THB",
    payment_method: "credit_card",
  };

  const ALLOW = {
    page: new Set(["payment", "job", "model"]),
    tier: new Set(["standard", "premium", "vip", "svip"]),
    status: new Set(["success", "pending", "failed"]),
    locale: new Set(["th", "en", "zh", "ja"]),
    payment_method: new Set(["credit_card", "promptpay", "paypal", "bank_transfer"]),
  };

  function $(sel, root) {
    return (root || document).querySelector(sel);
  }

  function safeLower(v) {
    return (v == null ? "" : String(v)).trim().toLowerCase();
  }

  function toNumber(v) {
    if (v == null) return null;
    const s = String(v).replace(/,/g, "").trim();
    if (!s) return null;
    const n = Number(s);
    return Number.isFinite(n) ? n : null;
  }

  function maskId(id) {
    if (!id) return "";
    const s = String(id).trim();
    if (s.length <= 6) return s;
    return s.slice(0, 2) + "****" + s.slice(-4);
  }

  function readDataset(root) {
    const d = root.dataset || {};
    return {
      page: safeLower(d.confirmPage),
      tier: safeLower(d.userTier),
      status: safeLower(d.status),
      locale: safeLower(d.locale),
      order_id: d.orderId ? String(d.orderId).trim() : "",
      ref_code: d.refCode ? String(d.refCode).trim() : "",
      amount: toNumber(d.amount),
      currency: (d.currency ? String(d.currency).trim() : "").toUpperCase(),
      payment_method: safeLower(d.paymentMethod),
      next_url: d.nextUrl ? String(d.nextUrl).trim() : "",
      support_url: d.supportUrl ? String(d.supportUrl).trim() : "",
      // extensible: extra fields can be added without breaking shell
    };
  }

  function normalize(ctx) {
    const out = Object.assign({}, ctx);

    out.page = ALLOW.page.has(out.page) ? out.page : DEFAULTS.page;
    out.tier = ALLOW.tier.has(out.tier) ? out.tier : DEFAULTS.tier;
    out.status = ALLOW.status.has(out.status) ? out.status : DEFAULTS.status;
    out.locale = ALLOW.locale.has(out.locale) ? out.locale : DEFAULTS.locale;

    out.currency = out.currency || DEFAULTS.currency;
    out.payment_method = ALLOW.payment_method.has(out.payment_method) ? out.payment_method : DEFAULTS.payment_method;

    out.order_id_masked = maskId(out.order_id);
    out.amount_fmt = (out.amount == null)
      ? ""
      : new Intl.NumberFormat(out.locale, { maximumFractionDigits: 0 }).format(out.amount);

    return out;
  }

  function t(key, fallback) {
    // Hook into your existing i18n core: MMD.i18n.t(key)
    // fallback if not available.
    try {
      if (MMD.i18n && typeof MMD.i18n.t === "function") {
        const v = MMD.i18n.t(key);
        if (v && v !== key) return v;
      }
    } catch (e) {}
    return fallback || key;
  }

  function iconSvg(kind) {
    // Minimal inline SVG so no external deps.
    if (kind === "success") {
      return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>`;
    }
    if (kind === "pending") {
      return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M12 8v5l3 2" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      </svg>`;
    }
    return `<svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 9v4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M12 17h.01" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`;
  }

  function renderShell(root, ctx) {
    // Build once; then only update inner areas.
    root.innerHTML = `
      <div class="mmdc-shell">
        <div class="mmdc-hero" aria-hidden="true"></div>

        <section class="mmdc-card" role="region" aria-label="Confirmation">
          <header class="mmdc-header">
            <div class="mmdc-brand">
              <div class="mmdc-logo" data-slot="logo">
                <!-- optional logo image injected by user or left blank -->
              </div>
