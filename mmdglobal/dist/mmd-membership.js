/* =====================================================
   MMD PRIVÉ — MEMBERSHIP PAY (LUX) v1
   File: mmdglobal/dist/mmd-membership.js
   Requires: QRCode (qrcodejs), Turnstile (optional), fetch
===================================================== */

(function () {
  "use strict";

  // ---- Safe onReady ----
  function onReady(fn) {
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn);
  }

  // ---- Config (override via window.MMD_MEMBERSHIP_CONFIG) ----
  var DEFAULT_CONFIG = {
    ENDPOINT: "https://telegram.malemodel-bkk.workers.dev",
    ALLOWED_ORIGIN: "https://mmdprive.webflow.io",
    TURNSTILE_SITEKEY: "0x4AAAAAACIE9VleQdOBRfBG",

    PROMPTPAY_ID: "0829528889",
    PROMPTPAY_NAME: "ธัชชะ ป.",
    KTB_NAME: "ธัชชะ ป.",
    KTB_ACCOUNT: "1420335898",
    PAYPAL_URL: "https://www.paypal.com/ncp/payment/M697T7AW2QZZJ",

    PAGE: "/pay/membership",
    CURRENCY: "THB",
    LOCKED_PRICES: { standard: 1199, premium: 2999, "7days": 1499 },

    PROMO_MONTHLY_JSON: "{}",
    PROMO_CODES_JSON: "{}",

    // Assets
    QR_FALLBACK_SRC: "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"
  };

  function mergeConfig() {
    var o = window.MMD_MEMBERSHIP_CONFIG || {};
    var out = {};
    Object.keys(DEFAULT_CONFIG).forEach(function (k) { out[k] = DEFAULT_CONFIG[k]; });
    Object.keys(o).forEach(function (k) { out[k] = o[k]; });
    return out;
  }

  // ---- JSON Safe Parse ----
  function safeParseJSON(s, fallback) {
    try {
      var v = JSON.parse(String(s || ""));
      return v && typeof v === "object" ? v : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function isExpired(expires) {
    if (!expires) return false;
    var t = Date.parse(expires);
    if (!isFinite(t)) return false;
    return Date.now() > t;
  }

  function fmtTHB(n) {
    var v = Number(n);
    if (!isFinite(v)) return "฿0";
    return "฿" + v.toLocaleString("en-US");
  }

  function ensureQRCode(CONFIG) {
    return new Promise(function (resolve, reject) {
      if (window.QRCode) return resolve();
      var s = document.createElement("script");
      s.src = CONFIG.QR_FALLBACK_SRC;
      s.onload = function () { resolve(); };
      s.onerror = function () { reject(new Error("QRCode library missing")); };
      document.head.appendChild(s);
    });
  }

  function buildPromptPayUrl(CONFIG, amount) {
    return "https://promptpay.io/" + encodeURIComponent(CONFIG.PROMPTPAY_ID) + "/" + encodeURIComponent(String(amount));
  }

  // ---- Turnstile (optional) ----
  var tsWidgetId = null;

  function ensureTurnstileWidget(CONFIG) {
    return new Promise(function (resolve, reject) {
      var mount = document.getElementById("tsMount");
      if (!mount) return reject(new Error("Turnstile mount missing"));

      var ready = function () {
        try {
          if (tsWidgetId !== null) return resolve(tsWidgetId);
          mount.innerHTML = "<div id='tsBox'></div>";
          tsWidgetId = window.turnstile.render("#tsBox", {
            sitekey: CONFIG.TURNSTILE_SITEKEY,
            size: "invisible",
            callback: function () {}
          });
          resolve(tsWidgetId);
        } catch (e) { reject(e); }
      };

      var maxWait = Date.now() + 8000;
      (function poll() {
        if (window.turnstile && typeof window.turnstile.render === "function") return ready();
        if (Date.now() > maxWait) return reject(new Error("Turnstile not ready"));
        setTimeout(poll, 120);
      })();
    });
  }

  function getTurnstileToken(CONFIG) {
    return new Promise(function (resolve, reject) {
      ensureTurnstileWidget(CONFIG).then(function () {
        var done = function (token) {
          try { window.turnstile.reset(tsWidgetId); } catch (_) {}
          resolve(token);
        };

        try { window.turnstile.remove(tsWidgetId); } catch (_) {}
        tsWidgetId = null;

        var mount = document.getElementById("tsMount");
        mount.innerHTML = "<div id='tsBox'></div>";
        tsWidgetId = window.turnstile.render("#tsBox", {
          sitekey: CONFIG.TURNSTILE_SITEKEY,
          size: "invisible",
          callback: done,
          "error-callback": function () { reject(new Error("Turnstile error")); },
          "expired-callback": function () { reject(new Error("Turnstile expired")); }
        });

        window.turnstile.execute(tsWidgetId);
      }).catch(reject);
    });
  }

  // ---- Main init ----
  function initMembershipPay() {
    var root = document.getElementById("mmd-membership");
    if (!root) return;

    var CONFIG = mergeConfig();
    var PROMO_MONTHLY = safeParseJSON(CONFIG.PROMO_MONTHLY_JSON, {});
    var PROMO_CODES = safeParseJSON(CONFIG.PROMO_CODES_JSON, {});

    function getSelectedPkg() {
      var el = root.querySelector('input[name="pkg"]:checked');
      return el ? el.value : "standard";
    }

    function getBasePrice(pkg) {
      return Number((CONFIG.LOCKED_PRICES || {})[pkg] || 0);
    }

    function getMonthlyPromoForNow() {
      var d = new Date();
      var key = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0");
      var promo = PROMO_MONTHLY[key];
      if (!promo) return null;
      if (promo.expires && isExpired(promo.expires)) return { expired: true, key: key, promo: promo };
      return { expired: false, key: key, promo: promo };
    }

    function applyPromoRules(args) {
      var pkg = args.pkg;
      var basePrice = args.basePrice;
      var promoCode = args.promoCode;
      var lang = args.lang;

      var price = basePrice;
      var discount = 0;
      var badge = "";
      var codeState = { ok: true, message: "" };

      var monthly = getMonthlyPromoForNow();
      if (monthly && !monthly.expired && monthly.promo && monthly.promo.prices && monthly.promo.prices[pkg] != null) {
        var p = Number(monthly.promo.prices[pkg]);
        if (isFinite(p) && p > 0 && p <= price) {
          discount += (price - p);
          price = p;
          badge = (lang === "th" ? monthly.promo.label_th : monthly.promo.label_en) || "Monthly promo";
        }
      }

      var raw = String(promoCode || "").trim().toUpperCase();
      if (raw) {
        var rule = PROMO_CODES[raw];
        if (!rule) return { finalPrice: price, discount: discount, badge: badge, codeState: { ok: false, message: "invalid code" } };
        if (rule.expires && isExpired(rule.expires)) return { finalPrice: price, discount: discount, badge: badge, codeState: { ok: false, message: "code expired" } };

        var pkgs = Array.isArray(rule.packages) ? rule.packages : ["standard", "premium", "7days"];
        if (pkgs.length && pkgs.indexOf(pkg) === -1) return { finalPrice: price, discount: discount, badge: badge, codeState: { ok: false, message: "invalid code" } };

        var type = String(rule.type || "").toLowerCase();
        var val = Number(rule.value);

        if (type === "percent" && isFinite(val) && val > 0) {
          var cutP = Math.round(price * (val / 100));
          discount += cutP; price = Math.max(1, price - cutP);
          badge = badge || ((lang === "th" ? rule.label_th : rule.label_en) || (raw + " applied"));
        } else if (type === "amount" && isFinite(val) && val > 0) {
          var cutA = Math.min(price - 1, Math.round(val));
          discount += cutA; price = Math.max(1, price - cutA);
          badge = badge || ((lang === "th" ? rule.label_th : rule.label_en) || (raw + " applied"));
        } else if (type === "price" && isFinite(val) && val > 0) {
          if (val < price) { discount += (price - val); price = val; }
          badge = badge || ((lang === "th" ? rule.label_th : rule.label_en) || (raw + " applied"));
        } else {
          return { finalPrice: price, discount: discount, badge: badge, codeState: { ok: false, message: "invalid code" } };
        }
      }

      return { finalPrice: price, discount: discount, badge: badge, codeState: codeState };
    }

    function syncSelectedStates() {
      root.querySelectorAll("#pkgList .mmd-pkg").forEach(function (lbl) {
        var r = lbl.querySelector("input[type=radio]");
        lbl.classList.toggle("is-selected", !!(r && r.checked));
      });
      root.querySelectorAll("#payMethods .mmd-method").forEach(function (lbl) {
        var r = lbl.querySelector("input[type=radio]");
        lbl.classList.toggle("is-selected", !!(r && r.checked));
      });
    }

    function setStatus(kind, msgTh, msgEn) {
      var box = document.getElementById("statusBox");
      if (!box) return;
      box.classList.remove("ok", "bad");
      if (kind === "ok") box.classList.add("ok");
      if (kind === "bad") box.classList.add("bad");

      var th = box.querySelector("[data-lang='th']");
      var en = box.querySelector("[data-lang='en']");
      if (th) th.textContent = msgTh;
      if (en) en.textContent = msgEn;
    }

    function setPaymentMethod(method) {
      var pp = document.getElementById("promptpayPanel");
      var ktb = document.getElementById("ktbPanel");
      var paypal = document.getElementById("paypalPanel");
      if (pp) pp.style.display = (method === "promptpay") ? "" : "none";
      if (ktb) ktb.style.display = (method === "ktb") ? "" : "none";
      if (paypal) paypal.style.display = (method === "paypal") ? "" : "none";
    }

    var qrRenderLock = 0;
    function renderQR(url) {
      var current = ++qrRenderLock;
      return ensureQRCode(CONFIG).then(function () {
        if (current !== qrRenderLock) return; // keep latest
        var el = document.getElementById("mmd-qr");
        if (!el) return;
        el.innerHTML = "";
        new window.QRCode(el, { text: url, width: 224, height: 224 });
      });
    }

    function recalc() {
      var lang = root.dataset.lang || "th";
      var pkg = getSelectedPkg();
      var promoCodeEl = document.getElementById("promoCode");
      var promoCode = promoCodeEl ? promoCodeEl.value : "";

      var base = getBasePrice(pkg);
      var out = applyPromoRules({ pkg: pkg, basePrice: base, promoCode: promoCode, lang: lang });

      var basePriceEl = document.getElementById("basePrice");
      var discountEl = document.getElementById("discount");
      var payAmountEl = document.getElementById("payAmount");
      if (basePriceEl) basePriceEl.textContent = fmtTHB(base);
      if (discountEl) discountEl.textContent = fmtTHB(out.discount);
      if (payAmountEl) payAmountEl.textContent = fmtTHB(out.finalPrice);

      var badgeEl = document.getElementById("promoBadge");
      if (badgeEl) {
        if (out.badge) {
          badgeEl.textContent = out.badge;
          badgeEl.style.color = "rgba(224,194,122,.92)";
        } else {
          badgeEl.textContent = "";
        }
      }

      if (!out.codeState.ok) {
        setStatus("bad", "สถานะ: " + out.codeState.message, "Status: " + out.codeState.message);
      } else {
        setStatus("ok", "สถานะ: พร้อมใช้งาน", "Status: Ready");
      }

      var ppUrl = buildPromptPayUrl(CONFIG, out.finalPrice);
      renderQR(ppUrl);
      syncSelectedStates();

      return {
        pkg: pkg,
        base: base,
        finalPrice: out.finalPrice,
        discount: out.discount,
        promoCode: String(promoCode || "").trim().toUpperCase(),
        ppUrl: ppUrl,
        codeOk: out.codeState.ok
      };
    }

    // Language toggle
    (function initLang() {
      var btns = root.querySelectorAll(".mmd-lang button");
      function setLang(lang) {
        root.querySelectorAll("[data-lang]").forEach(function (el) {
          el.style.display = (el.getAttribute("data-lang") === lang) ? "" : "none";
        });
        btns.forEach(function (b) {
          b.classList.toggle("active", b.dataset.setLang === lang);
        });
        root.dataset.lang = lang;
        recalc();
      }
      btns.forEach(function (b) {
        b.addEventListener("click", function () { setLang(b.dataset.setLang); });
      });
      setLang("th");
    })();

    // Benefits modal
    (function initModal() {
      var modal = document.getElementById("benefitsModal");
      var openBtn = document.getElementById("btnBenefits");
      var closeBtn = document.getElementById("btnCloseModal");
      if (!modal || !openBtn || !closeBtn) return;

      function open() { modal.classList.add("show"); document.body.style.overflow = "hidden"; }
      function close() { modal.classList.remove("show"); document.body.style.overflow = ""; }

      openBtn.addEventListener("click", open);
      closeBtn.addEventListener("click", close);
      modal.addEventListener("click", function (e) { if (e.target === modal) close(); });
      window.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
    })();

    // Copy helper
    (function initCopy() {
      root.querySelectorAll("[data-copy]").forEach(function (btn) {
        btn.addEventListener("click", function (e) {
          e.preventDefault();
          e.stopPropagation();
          var val = btn.getAttribute("data-copy") || "";
          function ok() {
            btn.textContent = "COPIED";
            setTimeout(function () { btn.textContent = "COPY"; }, 900);
          }
          if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(val).then(ok).catch(function () {
              var ta = document.createElement("textarea");
              ta.value = val;
              document.body.appendChild(ta);
              ta.select();
              document.execCommand("copy");
              document.body.removeChild(ta);
              ok();
            });
          } else {
            var ta2 = document.createElement("textarea");
            ta2.value = val;
            document.body.appendChild(ta2);
            ta2.select();
            document.execCommand("copy");
            document.body.removeChild(ta2);
            ok();
          }
        });
      });
    })();

    // Payment method switch
    root.querySelectorAll('input[name="pay_method"]').forEach(function (r) {
      r.addEventListener("change", function () {
        setPaymentMethod(r.value);
        syncSelectedStates();
      });
    });
    setPaymentMethod("promptpay");

    // Bind recalc triggers
    var btnApply = document.getElementById("btnApply");
    if (btnApply) btnApply.addEventListener("click", recalc);

    var promoCodeEl = document.getElementById("promoCode");
    if (promoCodeEl) {
      promoCodeEl.addEventListener("input", function () {
        clearTimeout(window.__mmd_t);
        window.__mmd_t = setTimeout(recalc, 250);
      });
    }

    root.querySelectorAll('input[name="pkg"]').forEach(function (r) {
      r.addEventListener("change", recalc);
    });

    // Notify handler
    var btnNotify = document.getElementById("btnNotify");
    if (btnNotify) {
      btnNotify.addEventListener("click", function () {
        var lang = root.dataset.lang || "th";
        var calc = recalc();
        if (!calc.codeOk) {
          setStatus("bad", "สถานะ: invalid code / code expired", "Status: invalid code / code expired");
          return;
        }

        btnNotify.disabled = true;
        btnNotify.style.opacity = ".75";

        function done() {
          btnNotify.disabled = false;
          btnNotify.style.opacity = "1";
        }

        // If turnstile is not present, still allow notify (optional)
        var tokenPromise;
        if (window.turnstile && CONFIG.TURNSTILE_SITEKEY) {
          setStatus("", "กำลังตรวจสอบความปลอดภัย…", "Verifying security…");
          tokenPromise = getTurnstileToken(CONFIG);
        } else {
          tokenPromise = Promise.resolve("");
        }

        tokenPromise.then(function (token) {
          setStatus("", "กำลังส่งข้อมูล…", "Sending…");

          var payload = {
            package: calc.pkg,
            amount_thb: calc.finalPrice,
            currency: CONFIG.CURRENCY,
            promo_code: calc.promoCode || "",
            promptpay_id: CONFIG.PROMPTPAY_ID,
            promptpay_url: calc.ppUrl,
            page: CONFIG.PAGE,
            lang: lang,

            is_authenticated: false,
            customer_email: String((document.getElementById("email") || {}).value || "").trim(),
            customer_name: String((document.getElementById("name") || {}).value || "").trim(),
            member_id: String((document.getElementById("memberId") || {}).value || "").trim(),

            anomaly_flags: [],
            turnstile_token: token
          };

          return fetch(CONFIG.ENDPOINT, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Origin": CONFIG.ALLOWED_ORIGIN
            },
            body: JSON.stringify(payload)
          }).then(function (res) {
            if (res.redirected || res.status === 302) {
              setStatus("bad",
                "สถานะ: Endpoint ถูกล็อค (Cloudflare Access) — ต้องปิด Access/Allow public สำหรับ worker นี้",
                "Status: Endpoint is protected (Cloudflare Access) — disable Access/allow public for this worker"
              );
              return null;
            }
            return res.text().then(function (txt) {
              var data = null;
              try { data = JSON.parse(txt); } catch (_) {}
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
              return null;
            });
          });
        }).catch(function (e) {
          setStatus("bad",
            "ล้มเหลว: " + (e && e.message ? e.message : "error"),
            "Failed: " + (e && e.message ? e.message : "error")
          );
        }).finally(done);
      });
    }

    // First paint
    syncSelectedStates();
    recalc();
  }

  onReady(initMembershipPay);
})();
