/* =========================================
   MMD PRIVÉ — PAY / MEMBERSHIP (LOCK v2026-LOCK-02)
   - tiers purchasable: 7days / standard / premium
   - VIP / SVIP: not purchasable (intent redirects to Black Card page)
   - promo code only (NO deposit/full)
   - updates UI:
       .mmd-tier[data-pkg] active state
       [data-money="pkg.price"] labels
       #mmdBasePrice #mmdDiscount #mmdTotal #mmdFinePrint #mmdTierNote
       #mmdPromoCode #mmdApplyPromo #mmdClearPromo #mmdPromoMsg
       #mmdPayNow
   - redirect -> /confirm/payment-confirmation with query
   - stores payload -> sessionStorage
   ========================================= */

(function () {
  "use strict";

  const root = document.getElementById("mmd-pay-membership");
  if (!root) return;

  /* -----------------------------
     CONFIG (HTML data-*)
  ----------------------------- */
  const PROMO_ENDPOINT =
    (root.getAttribute("data-promo-endpoint") || "").trim(); // e.g. https://telegram.malemodel-bkk.workers.dev/<path>
  const NEXT_CONFIRM_URL =
    (root.getAttribute("data-confirm-url") || "/confirm/payment-confirmation").trim();
  const BLACKCARD_URL =
    (root.getAttribute("data-blackcard-url") || "/blackcard/black-card").trim();

  /* -----------------------------
     PRICES (THB) — ตามที่ให้มา
  ----------------------------- */
  const PKG = {
    "7days": { price: 1499, duration: "7d" },
    standard: { price: 1199, duration: "12m" },
    premium: { price: 2999, duration: "12m" },
  };

  const STORAGE_KEY = "mmd_pay_payload_membership_v2026_02";

  /* -----------------------------
     STATE
  ----------------------------- */
  const state = {
    pkg: clampPkg((root.getAttribute("data-default-pkg") || "premium").toLowerCase()),
    promo: null,
    lang: getLang(),
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
  const $tierNote = root.querySelector("#mmdTierNote");

  const $promoInput = root.querySelector("#mmdPromoCode");
  const $promoApply = root.querySelector("#mmdApplyPromo");
  const $promoClear = root.querySelector("#mmdClearPromo");
  const $promoMsg = root.querySelector("#mmdPromoMsg");

  const $payNow = root.querySelector("#mmdPayNow");

  /* -----------------------------
     INIT
  ----------------------------- */
  hydrateMoneyLabels();
  bindTierClicks();
  bindPromo();
  render();
  bootIntent();

  /* -----------------------------
     HELPERS
  ----------------------------- */
  function getLang() {
    const byLS = localStorage.getItem("mmd_lang") || localStorage.getItem("lang");
    const htmlLang = document.documentElement.getAttribute("lang");
    return (byLS || htmlLang || "th").toLowerCase();
  }

  function clampPkg(p) {
    return PKG[p] ? p : "premium";
  }

  function money(n) {
    try {
      return new Intl.NumberFormat("th-TH", {
        style: "currency",
        currency: "THB",
        maximumFractionDigits: 0,
      }).format(n);
    } catch (_) {
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
    $tiers.forEach((btn) => {
      btn.addEventListener("click", () => {
        const nextPkg = clampPkg((btn.getAttribute("data-pkg") || "").toLowerCase());
        state.pkg = nextPkg;

        // ถ้าโค้ดจำกัด tier แล้วเปลี่ยน tier ไม่ได้ ให้ล้างโค้ด
        if (state.promo && !promoTierAllowed(state.promo, state.pkg)) {
          state.promo = null;
          if ($promoInput) $promoInput.value = "";
          setPromoMsg("โค้ดนี้ใช้กับแพ็กเกจที่เลือกไม่ได้", "bad");
        }

        render();
      });
    });
  }

  function bindPromo() {
    if ($promoApply) {
      $promoApply.addEventListener("click", async () => {
        const code = ($promoInput && $promoInput.value ? $promoInput.value : "").trim();
        if (!code) {
          setPromoMsg("กรุณากรอกโค้ด", "warn");
          return;
        }

        $promoApply.disabled = true;
        setPromoMsg("ขออนุญาตตรวจสอบสักครู่…", "info");

        try {
          const promo = await validatePromo(code);
          if (!promo || !promo.valid) {
            state.promo = null;
            setPromoMsg((promo && promo.message) ? promo.message : "โค้ดไม่ถูกต้อง", "bad");
            render();
            return;
          }

          if (!promoTierAllowed(promo, state.pkg)) {
            state.promo = null;
            setPromoMsg("โค้ดนี้ใช้กับแพ็กเกจที่เลือกไม่ได้", "bad");
            render();
            return;
          }

          state.promo = normalizePromo(promo, code);
          setPromoMsg(state.promo.message || "ใช้โค้ดสำเร็จ", "good");
          render();
        } catch (_) {
          state.promo = null;
          setPromoMsg("ขออนุญาตตรวจสอบสักครู่แล้วลองใหม่อีกครั้ง", "bad");
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
        setPromoMsg("ล้างโค้ดแล้ว", "info");
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
      tiersAllowed: promo.tiersAllowed || promo.tiers || null,
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
    if (Array.isArray(allowed)) {
      return allowed.map((x) => String(x).toLowerCase()).includes(pkg);
    }
    if (typeof allowed === "string") {
      return allowed
        .toLowerCase()
        .split(",")
        .map((s) => s.trim())
        .includes(pkg);
    }
    return true;
  }

  async function validatePromo(code) {
    if (!PROMO_ENDPOINT) {
      return { valid: false, message: "ยังไม่ได้ตั้งค่า promo endpoint" };
    }

    const payload = {
      code,
      page: "pay/membership",
      pkg: state.pkg,
      lang: state.lang,
    };

    const res = await fetch(PROMO_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "omit",
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
      return {
        valid: false,
        message:
          (data && (data.message || data.error)) ? (data.message || data.error) : "โค้ดไม่ถูกต้อง",
      };
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
        message: data.message || data.discount.message || "",
      };
    }

    if (data && data.valid === true) return data;

    return {
      valid: false,
      message:
        (data && (data.message || data.error)) ? (data.message || data.error) : "โค้ดไม่ถูกต้อง",
    };
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

    return { basePrice, discountAmount, net, dueNow: net };
  }

  function render() {
    $tiers.forEach((btn) => {
      const p = (btn.getAttribute("data-pkg") || "").toLowerCase();
      btn.classList.toggle("is-active", p === state.pkg);
    });

    const c = calc();

    if ($base) $base.textContent = money(c.basePrice);
    if ($discount) $discount.textContent = (c.discountAmount > 0) ? `- ${money(c.discountAmount)}` : money(0);
    if ($total) $total.textContent = money(c.dueNow);

    if ($tierNote) {
      $tierNote.textContent =
        (state.pkg === "7days")
          ? "7Days เป็นแพ็กเกจทดลองสิทธิ์ (ถ้ามีโค้ดเฉพาะ 7Days ให้กรอกได้)"
          : "VIP / SVIP ไม่เปิดรับสมัครผ่านหน้านี้";
    }

    if ($fine) {
      const parts = [];
      parts.push(`Package: ${state.pkg.toUpperCase()}`);
      if (state.promo && state.promo.code) parts.push(`Code: ${state.promo.code}`);
      parts.push("ตรวจสอบยอดโดย MMD");
      $fine.textContent = parts.join(" • ");
    }

    if ($payNow) $payNow.onclick = () => proceed(c);
  }

  function proceed(c) {
    const payload = {
      page: "pay/membership",
      package: state.pkg,
      basePrice: c.basePrice,
      discount: c.discountAmount,
      net: c.net,
      totalDueNow: c.dueNow,
      promo: state.promo
        ? {
            code: state.promo.code,
            type: state.promo.type,
            percentOff: state.promo.percentOff || null,
            amountOff: state.promo.amountOff || null,
          }
        : null,
      lang: state.lang,
      ts: Date.now(),
    };

    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (_) {}

    // ส่ง query ไป confirm ด้วย (เผื่อหน้า confirm อ่านจาก query)
    const qs = new URLSearchParams();
    qs.set("page", "pay/membership");
    qs.set("package", state.pkg);
    qs.set("amount", String(c.dueNow));
    if (state.promo && state.promo.code) qs.set("promo", state.promo.code);

    window.location.href = NEXT_CONFIRM_URL + "?" + qs.toString();
  }

  /* -----------------------------
     INTENT HANDLER
     - join_vip/join_svip/join_blackcard -> blackcard page
     - join_7days variants -> 7days
  ----------------------------- */
  function getIntent() {
    const qs = new URLSearchParams(location.search);
    const qIntent = (qs.get("intent") || "").trim();
    if (qIntent) return qIntent;
    try {
      return (localStorage.getItem("mmd_intent") || "").trim();
    } catch (_) {
      return "";
    }
  }

  function clearIntent() {
    try {
      localStorage.removeItem("mmd_intent");
    } catch (_) {}
  }

  function bootIntent() {
    const intent = getIntent();
    if (!intent) return;

    // VIP/SVIP/BLACKCARD: สมัครไม่ได้ -> ไปหน้า Black Card
    if (intent === "join_vip" || intent === "join_svip" || intent === "join_blackcard") {
      clearIntent();
      window.location.href = BLACKCARD_URL;
      return;
    }

    const map = {
      join_standard: "standard",
      join_premium: "premium",
      join_7days: "7days",
      join_7_days: "7days",
      join_7days_guest: "7days",
      join_guestpass: "7days",
    };

    const pkg = map[intent] || "";
    if (!pkg) {
      clearIntent();
      return;
    }

    const btn = root.querySelector('.mmd-tier[data-pkg="' + pkg + '"]');
    if (btn) btn.click();

    const sec = root.querySelector(".mmd-tier-grid");
    if (sec) sec.scrollIntoView({ behavior: "smooth", block: "start" });

    clearIntent();
  }
})();
