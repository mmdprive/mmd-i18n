/* =====================================================
   MMD PRIVÉ — MEMBERSHIP PAGE LOGIC (PRODUCTION)
   Requires: #mmd-membership markup
===================================================== */
(function () {
  "use strict";

  const root = document.getElementById("mmd-membership");
  if (!root) return;

  const $ = (sel, ctx = root) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx = root) => Array.from((ctx || document).querySelectorAll(sel));

  // --- Config (override ได้ด้วย window.MMD_MEMBERSHIP_CONFIG) ---
  const DEFAULTS = {
    ENDPOINT: "https://telegram.malemodel-bkk.workers.dev",
    ALLOWED_ORIGIN: "https://mmdprive.webflow.io",
    TURNSTILE_SITEKEY: "0x4AAAAAACIE9VleQdOBRfBG",
    PROMPTPAY_ID: "0829528889",
    PAGE: "/pay/membership",
    CURRENCY: "THB",
    LOCKED_PRICES: { standard: 1199, premium: 2999, "7days": 1499 },
    PROMO_MONTHLY_JSON: "{}",
    PROMO_CODES_JSON: "{}"
  };

  const CONFIG = Object.assign({}, DEFAULTS, window.MMD_MEMBERSHIP_CONFIG || {});

  function safeParseJSON(s, fallback) {
    try {
      const v = JSON.parse(String(s || ""));
      return v && typeof v === "object" ? v : fallback;
    } catch {
      return fallback;
    }
  }
  const PROMO_MONTHLY = safeParseJSON(CONFIG.PROMO_MONTHLY_JSON, {});
  const PROMO_CODES = safeParseJSON(CONFIG.PROMO_CODES_JSON, {});

  function isExpired(expires) {
    if (!expires) return false;
    const t = Date.parse(expires);
    if (!Number.isFinite(t)) return false;
    return Date.now() > t;
  }
  function fmtTHB(n) {
    const v = Number(n);
    if (!Number.isFinite(v)) return "฿0";
    return "฿" + v.toLocaleString("en-US");
  }
  function getSelectedPkg() {
    const el = document.querySelector('input[name="pkg"]:checked');
    return el ? el.value : "standard";
  }
  function getBasePrice(pkg) {
    return Number(CONFIG.LOCKED_PRICES[pkg] || 0);
  }
  function getMonthlyPromoForNow() {
    const d = new Date();
    const key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
    const promo = PROMO_MONTHLY[key];
    if (!promo) return null;
    if (promo.expires && isExpired(promo.expires)) return { expired: true, key, promo };
    return { expired: false, key, promo };
  }

  function applyPromoRules({ pkg, basePrice, promoCode, lang }) {
    let price = basePrice;
    let discount = 0;
    let badge = "";
    let codeState = { ok: true, message: "" };

    const monthly = getMonthlyPromoForNow();
    if (
      monthly &&
      !monthly.expired &&
      monthly.promo &&
      monthly.promo.prices &&
      monthly.promo.prices[pkg] != null
    ) {
      const p = Number(monthly.promo.prices[pkg]);
      if (Number.isFinite(p) && p > 0 && p < price) {
        discount += price - p;
        price = p;
        badge = (lang === "th" ? monthly.promo.label_th : monthly.promo.label_en) || "Monthly promo";
      } else if (Number.isFinite(p) && p === price) {
        badge = (lang === "th" ? monthly.promo.label_th : monthly.promo.label_en) || "Monthly promo";
      }
    }

    const raw = String(promoCode || "").trim().toUpperCase();
    if (raw) {
      const rule = PROMO_CODES[raw];
      if (!rule) return { finalPrice: price, discount, badge, codeState: { ok: false, message: "invalid code" } };
      if (rule.expires && isExpired(rule.expires))
        return { finalPrice: price, discount, badge, codeState: { ok: false, message: "code expired" } };

      const pkgs = Array.isArray(rule.packages) ? rule.packages : ["standard", "premium", "7days"];
      if (pkgs.length && !pkgs.includes(pkg))
        return { finalPrice: price, discount, badge, codeState: { ok: false, message: "invalid code" } };

      const type = String(rule.type || "").toLowerCase();
      const val = Number(rule.value);

      if (type === "percent" && Number.isFinite(val) && val > 0) {
        const cut = Math.round(price * (val / 100));
        discount += cut;
        price = Math.max(1, price - cut);
        badge = badge || ((lang === "th" ? rule.label_th : rule.label_en) || raw + " applied");
      } else if (type === "amount" && Number.isFinite(val) && val > 0) {
        const cut = Math.min(price - 1, Math.round(val));
        discount += cut;
        price = Math.max(1, price - cut);
        badge = badge || ((lang === "th" ? rule.label_th : rule.label_en) || raw + " applied");
      } else if (type === "price" && Number.isFinite(val) && val > 0) {
        if (val < price) {
          discount += price - val;
          price = val;
        }
        badge = badge || ((lang === "th" ? rule.label_th : rule.label_en) || raw + " applied");
      } else {
        return { finalPrice: price, discount, badge, codeState: { ok: false, message: "invalid code" } };
      }
    }

    return { finalPrice: price, discount, badge, codeState };
  }

  function setStatus(kind, msgTh, msgEn) {
    const box = $("#statusBox");
    if (!box) return;

    box.classList.remove("ok", "bad");
    if (kind === "ok") box.classList.add("ok");
    if (kind === "bad") box.classList.add("bad");

    const th = box.querySelector("[data-lang='th']");
    const en = box.querySelector("[data-lang='en']");
    if (th) th.textContent = msgTh;
    if (en) en.textContent = msgEn;
  }

  function buildPromptPayUrl(amount) {
    return "https://promptpay.io/" + encodeURIComponent(CONFIG.PROMPTPAY_ID) + "/" + encodeURIComponent(String(amount));
  }

  function ensureQRCodeLib() {
    if (window.QRCode) return Promise.resolve(true);
    return new Promise((resolve) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js";
      s.async = true;
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.head.appendChild(s);
    });
  }

  async function renderQR(url) {
    const ok = await ensureQRCodeLib();
    const el = $("#qr");
    if (!el) return;

    el.innerHTML = "";
    if (!ok || !window.QRCode) {
      el.innerHTML =
        "<div style='color:#111;font-weight:900;font-family:DM Sans;padding:14px;text-align:center;'>QR library not loaded</div>";
      return;
    }
    new window.QRCode(el, { text: url, width: 220, height: 220 });

    const link = $("#ppUrl");
    if (link) {
      link.href = url;
      link.textContent = url.replace("https://", "");
    }
    const ppId = $("#ppId");
    if (ppId) ppId.textContent = CONFIG.PROMPTPAY_ID;
  }

  function recalc() {
    const pkg = getSelectedPkg();
    const lang = root.dataset.lang || "th";
    const promoCode = ($("#promoCode")?.value || "");

    const base = getBasePrice(pkg);
    const out = applyPromoRules({ pkg, basePrice: base, promoCode, lang });

    $("#basePrice").textContent = fmtTHB(base);
    $("#discount").textContent = fmtTHB(out.discount);
    $("#payAmount").textContent = fmtTHB(out.finalPrice);

    const badge = $("#promoBadge");
    if (badge) {
      if (out.badge) {
        badge.textContent = out.badge;
        badge.style.color = "rgba(232,212,154,.92)";
      } else {
        badge.textContent = "";
      }
    }

    if (!out.codeState.ok) {
      setStatus("bad", "สถานะ: " + out.codeState.message, "Status: " + out.codeState.message);
    } else {
      setStatus("ok", "สถานะ: พร้อมใช้งาน", "Status: Ready");
    }

    const ppUrl = buildPromptPayUrl(out.finalPrice);
    renderQR(ppUrl);

    return {
      pkg,
      base,
      finalPrice: out.finalPrice,
      discount: out.discount,
      promoCode: String(promoCode || "").trim().toUpperCase(),
      ppUrl,
      codeOk: out.codeState.ok
    };
  }

  // Language toggle
  (function initLang() {
    const btns = $$(".lang button");
    const setLang = (lang) => {
      $$("[data-lang]").forEach((el) => {
        el.style.display = el.getAttribute("data-lang") === lang ? "" : "none";
      });
      btns.forEach((b) => b.classList.toggle("active", b.dataset.setLang === lang));
      root.dataset.lang = lang;
      recalc();
    };
    btns.forEach((b) => b.addEventListener("click", () => setLang(b.dataset.setLang)));
    setLang(root.dataset.lang || "th");
  })();

  // Benefits modal
  (function initModal() {
    const modal = $("#benefitsModal");
    const openBtn = $("#btnBenefits");
    const closeBtn = $("#btnCloseModal");
    if (!modal || !openBtn || !closeBtn) return;

    const open = () => { modal.classList.add("show"); document.body.style.overflow = "hidden"; };
    const close = () => { modal.classList.remove("show"); document.body.style.overflow = ""; };

    openBtn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    modal.addEventListener("click", (e) => { if (e.target === modal) close(); });
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  })();

  // Copy helper
  (function initCopy() {
    $$("[data-copy]").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const val = btn.getAttribute("data-copy");
        try {
          await navigator.clipboard.writeText(val);
        } catch {
          const ta = document.createElement("textarea");
          ta.value = val;
          document.body.appendChild(ta);
          ta.select();
          document.execCommand("copy");
          document.body.removeChild(ta);
        }
        const prev = btn.textContent;
        btn.textContent = "COPIED";
        setTimeout(() => (btn.textContent = prev || "COPY"), 900);
      });
    });
  })();

  // Payment method switch + selected state
  function setPaymentMethod(method) {
    const pp = $("#promptpayPanel");
    const ktb = $("#ktbPanel");
    const paypal = $("#paypalPanel");

    if (pp) pp.style.display = method === "promptpay" ? "" : "none";
    if (ktb) ktb.style.display = method === "ktb" ? "" : "none";
    if (paypal) paypal.style.display = method === "paypal" ? "" : "none";

    $$(".method").forEach((m) => m.classList.toggle("is-selected", m.getAttribute("data-method") === method));

    if (method === "promptpay") recalc(); // กันตอน show ใหม่แล้ว QR ว่าง
  }

  document.querySelectorAll('input[name="pay_method"]').forEach((r) => {
    r.addEventListener("change", () => setPaymentMethod(r.value));
  });
  setPaymentMethod("promptpay");

  // Package + promo events
  $("#btnApply")?.addEventListener("click", recalc);
  $("#promoCode")?.addEventListener("input", () => {
    window.clearTimeout(window.__mmd_t);
    window.__mmd_t = setTimeout(recalc, 250);
  });
  document.querySelectorAll('input[name="pkg"]').forEach((r) => r.addEventListener("change", recalc));

  // Turnstile + Notify (คง UX เดิม)
  let tsWidgetId = null;

  function ensureTurnstileWidget() {
    return new Promise((resolve, reject) => {
      const mount = document.getElementById("tsMount");
      if (!mount) return reject(new Error("Turnstile mount missing"));

      const ready = () => {
        try {
          if (tsWidgetId !== null) return resolve(tsWidgetId);
          mount.innerHTML = "<div id='tsBox'></div>";
          tsWidgetId = window.turnstile.render("#tsBox", {
            sitekey: CONFIG.TURNSTILE_SITEKEY,
            size: "invisible",
            callback: function () {}
          });
          resolve(tsWidgetId);
        } catch (e) {
          reject(e);
        }
      };

      const maxWait = Date.now() + 8000;
      (function poll() {
        if (window.turnstile && typeof window.turnstile.render === "function") return ready();
        if (Date.now() > maxWait) return reject(new Error("Turnstile not ready"));
        setTimeout(poll, 120);
      })();
    });
  }

  function getTurnstileToken() {
    return new Promise(async (resolve, reject) => {
      try {
        await ensureTurnstileWidget();

        const done = (token) => {
          try { window.turnstile.reset(tsWidgetId); } catch {}
          resolve(token);
        };

        try { window.turnstile.remove(tsWidgetId); } catch {}
        tsWidgetId = null;

        const mount = document.getElementById("tsMount");
        mount.innerHTML = "<div id='tsBox'></div>";
        tsWidgetId = window.turnstile.render("#tsBox", {
          sitekey: CONFIG.TURNSTILE_SITEKEY,
          size: "invisible",
          callback: done,
          "error-callback": () => reject(new Error("Turnstile error")),
          "expired-callback": () => reject(new Error("Turnstile expired"))
        });

        window.turnstile.execute(tsWidgetId);
      } catch (e) {
        reject(e);
      }
    });
  }

  async function postNotify() {
    const lang = root.dataset.lang || "th";
    const calc = recalc();

    if (!calc.codeOk) {
      setStatus("bad", "สถานะ: invalid code / code expired", "Status: invalid code / code expired");
      return;
    }

    const btn = $("#btnNotify");
    btn.disabled = true;
    btn.style.opacity = ".75";

    try {
      setStatus("", "กำลังตรวจสอบความปลอดภัย…", "Verifying security…");
      const token = await getTurnstileToken();

      setStatus("", "กำลังส่งข้อมูล…", "Sending…");

      const payload = {
        package: calc.pkg,
        amount_thb: calc.finalPrice,
        currency: CONFIG.CURRENCY,
        promo_code: calc.promoCode || "",
        promptpay_id: CONFIG.PROMPTPAY_ID,
        promptpay_url: calc.ppUrl,
        page: CONFIG.PAGE,
        lang: lang,

        is_authenticated: false,
        customer_email: String($("#email")?.value || "").trim(),
        customer_name: String($("#name")?.value || "").trim(),
        member_id: String($("#memberId")?.value || "").trim(),

        anomaly_flags: [],
        turnstile_token: token
      };

      const res = await fetch(CONFIG.ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Origin": CONFIG.ALLOWED_ORIGIN },
        body: JSON.stringify(payload)
      });

      const txt = await res.text();
      let data = null;
      try { data = JSON.parse(txt); } catch {}

      if (res.ok && data && data.ok) {
        setStatus("ok",
          "สำเร็จ: แจ้งทีมเรียบร้อย (Event: " + (data.event_id || "-") + ")",
          "Success: Team notified (Event: " + (data.event_id || "-") + ")"
        );
      } else {
        setStatus("bad",
          "ล้มเหลว: ส่งไม่สำเร็จ (" + res.status + ")",
          "Failed: request not ok (" + res.status + ")"
        );
      }
    } catch (e) {
      setStatus("bad",
        "ล้มเหลว: " + (e && e.message ? e.message : "error"),
        "Failed: " + (e && e.message ? e.message : "error")
      );
    } finally {
      btn.disabled = false;
      btn.style.opacity = "1";
    }
  }

  $("#btnNotify")?.addEventListener("click", postNotify);

  // First paint
  recalc();
})();
