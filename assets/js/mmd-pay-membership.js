/* =========================================
   MMD PRIVÉ — PAY / MEMBERSHIP (LOCK)
   - tier selector
   - deposit/full calculation
   - promo validate via Worker endpoint (optional)
   - payload -> sessionStorage for /confirm/*
   - + intent handler (query ?intent=... or localStorage mmd_intent)
   ========================================= */

(function () {
  "use strict";

  const root = document.getElementById("mmd-pay-membership");
  if (!root) return;

  /* -----------------------------
     CONFIG (set via HTML data-*)
  ----------------------------- */
  const PROMO_ENDPOINT = root.getAttribute("data-promo-endpoint") || ""; // optional
  const NEXT_CONFIRM_URL = root.getAttribute("data-confirm-url") || "/confirm/payment-confirmation";

  // Prices (THB) — adjust to your actual pricing
  const PKG = {
    standard: { price: 7000, duration: "12m" },
    premium:  { price: 12000, duration: "12m" },
    vip:      { price: 18000, duration: "12m" },
    svip:     { price: 25000, duration: "12m" }
  };

  const DEPOSIT_RATE = 0.30;
  const STORAGE_KEY = "mmd_pay_payload_v1";

  /* -----------------------------
     STATE
  ----------------------------- */
  const state = {
    pkg: clampPkg((root.getAttribute("data-default-pkg") || "premium").toLowerCase()),
    payMode: ((root.getAttribute("data-default-paymode") || "deposit").toLowerCase() === "full") ? "full" : "deposit",
    promo: null,
    lang: getLang()
  };

  /* -----------------------------
     DOM
  ----------------------------- */
  const $tiers = Array.from(root.querySelectorAll(".mmd-tier[data-pkg]"));
  const $moneySpans = Array.from(root.querySelectorAll("[data-money]"));

  const $base = root.querySelector("#mmdBasePrice");
  const $discount = root.querySelector("#mmdDiscount");
  const $total = root.querySelector("#mmdTotal");
  const $fine = root.querySelector("#mmdFinePrint");

  const $promoInput = root.querySelector("#mmdPromoCode");
  const $promoApply = root.querySelector("#mmdApplyPromo");
  const $promoClear = root.querySelector("#mmdClearPromo");
  const $promoMsg = root.querySelector("#mmdPromoMsg");

  const $payNow = root.querySelector("#mmdPayNow");
  const $payModeHint = root.querySelector("#mmdPayModeHint");
  const $payModeRadios = Array.from(root.querySelectorAll('input[name="payMode"]'));

  /* -----------------------------
     INIT
  ----------------------------- */
  hydrateMoneyLabels();
  bindTierClicks();
  bindPayMode();
  bindPromo();
  render();

  // INTENT BOOT (after bindings so it can click)
  bootIntent();

  /* -----------------------------
     HELPERS
  ----------------------------- */

  function getLang() {
    const byLS = localStorage.getItem("mmd_lang") || localStorage.getItem("lang");
    const htmlLang = document.documentElement.getAttribute("lang");
    return (byLS || htmlLang || "th").toLowerCase();
  }

  function clampPkg(p) { return PKG[p] ? p : "premium"; }

  function dict(lang, key) {
    try {
      const D = (window.I18N_DICT && window.I18N_DICT[lang]) ? window.I18N_DICT[lang] : null;
      return (D && typeof D[key] === "string") ? D[key] : "";
    } catch (e) { return ""; }
  }

  function t(key, fallback) {
    const s = dict(state.lang, key);
    return s || fallback || key;
  }

  function money(n) {
    try {
      return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(n);
    } catch (e) {
      return `${n} THB`;
    }
  }

  function hydrateMoneyLabels() {
    for (const el of $moneySpans) {
      const key = el.getAttribute("data-money"); // e.g. premium.price
      if (!key) continue;
      const [pkgKey, field] = key.split(".");
      if (!pkgKey || field !== "price") continue;
      if (!PKG[pkgKey]) continue;
      el.textContent = money(PKG[pkgKey].price);
    }
  }

  function bindTierClicks() {
    $tiers.forEach(btn => {
      btn.addEventListener("click", () => {
        state.pkg = clampPkg((btn.getAttribute("data-pkg") || "").toLowerCase());

        // promo tier eligibility
        if (state.promo && !promoTierAllowed(state.promo, state.pkg)) {
          state.promo = null;
          if ($promoInput) $promoInput.value = "";
          setPromoMsg(t("pay.promo.tier_denied", "This code is not eligible for the selected tier."), "bad");
        }

        render();
      });
    });
  }

  function bindPayMode() {
    $payModeRadios.forEach(r => (r.checked = (r.value === state.payMode)));
    $payModeRadios.forEach(r => {
      r.addEventListener("change", () => {
        state.payMode = (r.value === "full") ? "full" : "deposit";
        render();
      });
    });
  }

  function bindPromo() {
    if ($promoApply) {
      $promoApply.addEventListener("click", async () => {
        const code = ($promoInput && $promoInput.value ? $promoInput.value : "").trim();
        if (!code) {
          setPromoMsg(t("pay.promo.empty", "Please enter a code."), "warn");
          return;
        }

        $promoApply.disabled = true;
        setPromoMsg(t("pay.promo.checking", "Checking code..."), "info");

        try {
          const promo = await validatePromo(code);
          if (!promo || !promo.valid) {
            state.promo = null;
            setPromoMsg((promo && promo.message) ? promo.message : t("pay.promo.invalid", "Invalid code."), "bad");
            render();
            return;
          }

          if (!promoTierAllowed(promo, state.pkg)) {
            state.promo = null;
            setPromoMsg(t("pay.promo.tier_denied", "This code is not eligible for the selected tier."), "bad");
            render();
            return;
          }

          state.promo = normalizePromo(promo, code);
          setPromoMsg(state.promo.message || t("pay.promo.applied", "Code applied."), "good");
          render();
        } catch (err) {
          state.promo = null;
          setPromoMsg(t("pay.promo.error", "Cannot validate code right now. Please try again."), "bad");
          render();
        } finally {
          $promoApply.disabled = false;
        }
      });
    }

    if ($promoClear) {
      $promoClear.addEventListener("click", () => {
        state.promo = null;
        if ($promoInput) $promoInput.value = "";
        setPromoMsg(t("pay.promo.cleared_ok", "Code cleared."), "info");
        render();
      });
    }
  }

  function setPromoMsg(msg, tone) {
    if (!$promoMsg) return;
    $promoMsg.textContent = msg || "";
    $promoMsg.setAttribute("data-tone", tone || "info");
  }

  function normalizePromo(promo, code) {
    const out = {
      code,
      message: promo.message || "",
      tiersAllowed: promo.tiersAllowed || promo.tiers || null
    };

    if (promo.type === "percent" || typeof promo.percentOff === "number") {
      out.type = "percent";
      out.percentOff = (typeof promo.percentOff === "number") ? promo.percentOff : promo.value;
      out.amountOff = null;
      return out;
    }

    out.type = "amount";
    out.amountOff = (typeof promo.amountOff === "number") ? promo.amountOff : promo.value;
    out.percentOff = null;
    return out;
  }

  function promoTierAllowed(promo, pkg) {
    const allowed = promo.tiersAllowed || promo.tiers || null;
    if (!allowed) return true;
    if (Array.isArray(allowed)) return allowed.map(x => String(x).toLowerCase()).includes(pkg);
    if (typeof allowed === "string") return allowed.toLowerCase().split(",").map(s => s.trim()).includes(pkg);
    return true;
  }

  async function validatePromo(code) {
    if (!PROMO_ENDPOINT) {
      return { valid: false, message: t("pay.promo.no_endpoint", "Promo endpoint not configured.") };
    }

    const payload = {
      code,
      page: "pay/membership",
      pkg: state.pkg,
      payMode: state.payMode,
      lang: state.lang
    };

    const res = await fetch(PROMO_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "omit"
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return { valid: false, message: (data && (data.message || data.error)) ? (data.message || data.error) : t("pay.promo.invalid", "Invalid code.") };
    }

    // Support: {valid:true,...} OR {ok:true,discount:{...}}
    if (data && data.discount && (data.ok === true || data.valid === true)) {
      return {
        valid: true,
        type: data.discount.type,
        value: data.discount.value,
        percentOff: data.discount.percentOff,
        amountOff: data.discount.amountOff,
        tiersAllowed: data.discount.tiersAllowed || data.discount.tiers,
        message: data.message || data.discount.message || ""
      };
    }

    if (data && data.valid === true) return data;

    return { valid: false, message: (data && (data.message || data.error)) ? (data.message || data.error) : t("pay.promo.invalid", "Invalid code.") };
  }

  function calc() {
    const basePrice = PKG[state.pkg].price;

    let discountAmount = 0;
    if (state.promo) {
      if (state.promo.type === "percent" && typeof state.promo.percentOff === "number") {
        discountAmount = Math.round(basePrice * (state.promo.percentOff / 100));
      } else if (state.promo.type === "amount" && typeof state.promo.amountOff === "number") {
        discountAmount = state.promo.amountOff;
      }
    }

    discountAmount = Math.max(0, Math.min(discountAmount, basePrice));
    const net = basePrice - discountAmount;

    let dueNow = net;
    let dueLater = 0;

    if (state.payMode === "deposit") {
      dueNow = Math.round(net * DEPOSIT_RATE);
      dueLater = net - dueNow;
    }

    return { basePrice, discountAmount, net, dueNow, dueLater };
  }

  function render() {
    $tiers.forEach(btn => {
      const p = (btn.getAttribute("data-pkg") || "").toLowerCase();
      btn.classList.toggle("is-active", p === state.pkg);
    });

    const c = calc();

    if ($payModeHint) {
      $payModeHint.textContent =
        (state.payMode === "deposit")
          ? `Deposit: ${money(c.dueNow)} • Remaining later: ${money(c.dueLater)}`
          : `Full payment due now: ${money(c.dueNow)}`;
    }

    if ($base) $base.textContent = money(c.basePrice);
    if ($discount) $discount.textContent = (c.discountAmount > 0) ? `- ${money(c.discountAmount)}` : money(0);
    if ($total) $total.textContent = money(c.dueNow);

    if ($fine) {
      const parts = [];
      parts.push(`Tier: ${state.pkg.toUpperCase()}`);
      parts.push(`Mode: ${state.payMode === "deposit" ? "DEPOSIT 30%" : "FULL 100%"}`);
      if (state.promo && state.promo.code) parts.push(`Code: ${state.promo.code}`);
      if (state.payMode === "deposit") parts.push(`Remaining later: ${money(c.dueLater)}`);
      $fine.textContent = parts.join(" • ");
    }

    if ($payNow) $payNow.onclick = () => proceed(c);
  }

  function proceed(c) {
    const payload = {
      page: "pay/membership",
      package: state.pkg,
      payMode: state.payMode,
      basePrice: c.basePrice,
      discount: c.discountAmount,
      net: c.net,
      totalDueNow: c.dueNow,
      dueLater: c.dueLater,
      promo: state.promo ? { code: state.promo.code, type: state.promo.type, percentOff: state.promo.percentOff || null, amountOff: state.promo.amountOff || null } : null,
      lang: state.lang,
      ts: Date.now()
    };

    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload)); } catch (e) {}
    window.location.href = NEXT_CONFIRM_URL;
  }

  /* =========================================
     INTENT HANDLER (LOCK)
     - reads ?intent=... OR localStorage mmd_intent
     - maps to package tier buttons (.mmd-tier[data-pkg])
     - scrolls to tier block
     ========================================= */

  function getIntent() {
    const qs = new URLSearchParams(location.search);
    const qIntent = (qs.get("intent") || "").trim();
    if (qIntent) return qIntent;
    try { return (localStorage.getItem("mmd_intent") || "").trim(); } catch (_) {}
    return "";
  }

  function clearIntent() {
    try { localStorage.removeItem("mmd_intent"); } catch (_) {}
  }

  function applyIntent(intent) {
    if (!intent) return;

    // intent -> pkg mapping (aligned with this page)
    // NOTE: join_blackcard maps to svip by default (you can switch to "black" later)
    const map = {
      join_standard: "standard",
      join_premium: "premium",
      join_vip: "vip",
      join_blackcard: "svip",
      join_svip: "svip"
    };

    const pkg = map[intent] || "";
    if (!pkg) return;

    // click the tier card in THIS page
    const btn = root.querySelector('.mmd-tier[data-pkg="' + pkg + '"]');
    if (btn) btn.click();

    // scroll to tier area
    const sec =
      root.querySelector(".mmd-tier-grid") ||
      root.querySelector("[data-section='tier']") ||
      root.querySelector("#tier");
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function bootIntent() {
    const intent = getIntent();
    if (!intent) return;
    applyIntent(intent);
    clearIntent();
  }

})();
