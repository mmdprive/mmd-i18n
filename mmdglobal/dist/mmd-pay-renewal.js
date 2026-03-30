(function(){
  "use strict";

  const root = document.querySelector("#mmd-pay-renewal[data-renewal-ui='v2']");
  if(!root) return;

  const CONFIG = {
    ENDPOINT: "https://telegram.malemodel-bkk.workers.dev",
    ALLOWED_ORIGIN: "https://mmdprive.webflow.io",
    TURNSTILE_SITEKEY: "0x4AAAAAACIE9VleQdOBRfBG",
    PROMPTPAY_ID: "0829528889",
    PAGE: "/pay/renewal",
    CURRENCY: "THB",
    PAYPAL_URL: "https://www.paypal.com/ncp/payment/M697T7AW2QZZJ"
  };

  const $ = (sel, ctx=root)=> (ctx || document).querySelector(sel);
  const $$ = (sel, ctx=root)=> Array.from((ctx || document).querySelectorAll(sel));

  const state = {
    method: "promptpay",
    tsWidgetId: null
  };

  function fmtTHB(n){
    const v = Number(n);
    if(!Number.isFinite(v)) return "฿0";
    return "฿" + Math.trunc(v).toLocaleString("en-US");
  }

  function toNumber(v){
    const n = Number(String(v || "").replace(/[^\d.]/g, ""));
    return Number.isFinite(n) ? n : 0;
  }

  function currentLang(){
    return root.dataset.lang || "th";
  }

  function field(name){
    return $(`[data-renew-field='${name}']`);
  }

  function output(name){
    return $(`[data-renew-output='${name}']`);
  }

  function calcRenewal(payload){
    const pkg = payload.package;
    const usage = payload.usage;
    const isActive = payload.activity === "active365";
    let pay = 0;
    let rateTH = "—";
    let rateEN = "—";

    if(pkg === "premium"){
      if(isActive && usage >= 120000){
        pay = 0;
        rateTH = "ต่อฟรี 1 ปี สำหรับ Premium";
        rateEN = "Free 1-year renewal for Premium";
      }else if(isActive && usage >= 40000){
        pay = 1900;
        rateTH = "เรท Premium Renewal ฿1,900";
        rateEN = "Premium renewal rate ฿1,900";
      }else{
        pay = 2500;
        rateTH = "เรท Premium Renewal ฿2,500";
        rateEN = "Premium renewal rate ฿2,500";
      }
    }else{
      if(isActive && usage >= 60000){
        pay = 0;
        rateTH = "ต่อฟรี 1 ปี สำหรับ Standard";
        rateEN = "Free 1-year renewal for Standard";
      }else if(isActive && usage >= 15000){
        pay = 900;
        rateTH = "เรท Standard Renewal ฿900";
        rateEN = "Standard renewal rate ฿900";
      }else{
        pay = 1050;
        rateTH = "เรท Standard Renewal ฿1,050";
        rateEN = "Standard renewal rate ฿1,050";
      }
    }

    let vipLabel = "Standard";
    let vipHintTH = "สถานะปกติ";
    let vipHintEN = "Standard Status";
    let vipGold = false;

    if(usage >= 250000){
      vipLabel = "SVIP • BLACK CARD";
      vipHintTH = "สิทธิ์ระดับ BLACK CARD";
      vipHintEN = "BLACK CARD Eligible";
      vipGold = true;
    }else if(usage >= 150000){
      vipLabel = "VIP";
      vipHintTH = "สิทธิ์ระดับ VIP";
      vipHintEN = "VIP Eligible";
      vipGold = true;
    }

    return { pay, rateTH, rateEN, vipLabel, vipHintTH, vipHintEN, vipGold };
  }

  function buildPromptPayUrl(amount){
    return "https://promptpay.io/" + encodeURIComponent(CONFIG.PROMPTPAY_ID) + "/" + encodeURIComponent(String(Math.trunc(amount)));
  }

  function ensureQRCodeLib(){
    if(window.QRCode) return Promise.resolve(true);
    return new Promise((resolve)=>{
      const existing = document.querySelector("script[data-mmd-qr='1']");
      if(existing){
        existing.addEventListener("load", ()=> resolve(true), { once:true });
        existing.addEventListener("error", ()=> resolve(false), { once:true });
        return;
      }

      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js";
      script.async = true;
      script.dataset.mmdQr = "1";
      script.onload = ()=> resolve(true);
      script.onerror = ()=> resolve(false);
      document.head.appendChild(script);
    });
  }

  async function renderQR(url){
    const el = $("#renew-qr");
    if(!el) return;
    el.innerHTML = "";

    const ok = await ensureQRCodeLib();
    if(!ok || !window.QRCode){
      el.innerHTML = "<div style='color:#111;font-weight:900;font-family:DM Sans;padding:14px;text-align:center;'>QR library not loaded</div>";
      return;
    }

    new QRCode(el, { text:url, width:220, height:220 });
  }

  function toast(message, tone){
    const el = output("toast");
    if(!el) return;
    el.textContent = message;
    el.className = "mmd-toast show";
    if(tone) el.classList.add(tone);
  }

  function clearToast(){
    const el = output("toast");
    if(!el) return;
    el.className = "mmd-toast";
    el.textContent = "";
  }

  function readForm(){
    return {
      package: field("package")?.value || "premium",
      activity: field("activity")?.value || "active365",
      usage: toNumber(field("usage")?.value || 0),
      name: String(field("name")?.value || "").trim(),
      email: String(field("email")?.value || "").trim()
    };
  }

  function updateSummary(){
    const lang = currentLang();
    const form = readForm();
    const result = calcRenewal(form);

    const rateLabel = output("rateLabel");
    const tierHint = output("tierHint");
    const payAmount = output("payAmount");
    const vipBadge = output("vipBadge");

    if(rateLabel) rateLabel.textContent = lang === "th" ? result.rateTH : result.rateEN;
    if(tierHint){
      tierHint.textContent = lang === "th" ? result.vipHintTH : result.vipHintEN;
      tierHint.style.color = result.vipGold ? "rgba(232,212,154,.92)" : "rgba(244,242,238,.52)";
    }
    if(payAmount) payAmount.textContent = fmtTHB(result.pay);
    if(vipBadge){
      vipBadge.textContent = result.vipLabel;
      vipBadge.classList.toggle("gold", result.vipGold);
    }

    void renderQR(buildPromptPayUrl(result.pay > 0 ? result.pay : 1));
    clearToast();

    return { form, result, lang };
  }

  function setLang(lang){
    root.dataset.lang = lang;
    $$("[data-lang]").forEach((el)=>{
      el.style.display = el.getAttribute("data-lang") === lang ? "" : "none";
    });
    $$(".lang button").forEach((btn)=>{
      const active = btn.dataset.setLang === lang;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", active ? "true" : "false");
    });
    updateSummary();
  }

  function setMethod(method){
    state.method = method;
    $$("[data-renew-method]").forEach((card)=>{
      const active = card.getAttribute("data-renew-method") === method;
      card.classList.toggle("is-selected", active);
      const input = $("input[type='radio']", card);
      if(input) input.checked = active;
    });

    $$("[data-renew-panel]").forEach((panel)=>{
      panel.style.display = panel.getAttribute("data-renew-panel") === method ? "" : "none";
    });
  }

  function ensureTurnstileWidget(mount){
    return new Promise((resolve, reject)=>{
      if(!mount) return reject(new Error("Turnstile mount missing"));

      const ready = ()=>{
        try{
          mount.innerHTML = "<div class='tsBox'></div>";
          const box = mount.querySelector(".tsBox");
          state.tsWidgetId = window.turnstile.render(box, {
            sitekey: CONFIG.TURNSTILE_SITEKEY,
            size: "invisible",
            callback: function(){}
          });
          resolve(state.tsWidgetId);
        }catch(error){
          reject(error);
        }
      };

      const maxWait = Date.now() + 8000;
      (function poll(){
        if(window.turnstile && typeof window.turnstile.render === "function") return ready();
        if(Date.now() > maxWait) return reject(new Error("Turnstile not ready"));
        setTimeout(poll, 120);
      })();
    });
  }

  function getTurnstileToken(kind){
    const mount = $(`[data-renew-turnstile='${kind}']`);
    return new Promise(async (resolve, reject)=>{
      try{
        await ensureTurnstileWidget(mount);

        const done = (token)=>{
          try{ window.turnstile.reset(state.tsWidgetId); }catch(_err){}
          resolve(token);
        };

        try{ window.turnstile.remove(state.tsWidgetId); }catch(_err){}
        state.tsWidgetId = null;

        mount.innerHTML = "<div class='tsBox'></div>";
        const box = mount.querySelector(".tsBox");
        state.tsWidgetId = window.turnstile.render(box, {
          sitekey: CONFIG.TURNSTILE_SITEKEY,
          size: "invisible",
          callback: done,
          "error-callback": ()=> reject(new Error("Turnstile error")),
          "expired-callback": ()=> reject(new Error("Turnstile expired"))
        });

        window.turnstile.execute(state.tsWidgetId);
      }catch(error){
        reject(error);
      }
    });
  }

  async function notify(kind){
    const snapshot = updateSummary();
    const button = $(`[data-renew-action='notify-${kind}']`);
    if(button){
      button.disabled = true;
      button.style.opacity = ".75";
    }

    try{
      const token = await getTurnstileToken(kind);
      const payload = {
        package: snapshot.form.package,
        amount_thb: snapshot.result.pay,
        currency: CONFIG.CURRENCY,
        promo_code: "",
        promptpay_id: CONFIG.PROMPTPAY_ID,
        promptpay_url: buildPromptPayUrl(snapshot.result.pay || 1),
        page: CONFIG.PAGE,
        lang: snapshot.lang,
        is_authenticated: false,
        customer_email: snapshot.form.email,
        customer_name: snapshot.form.name,
        member_id: "",
        anomaly_flags: [],
        turnstile_token: token,
        renewal_usage_12m: snapshot.form.usage,
        renewal_activity: snapshot.form.activity,
        vip_eligibility: snapshot.result.vipLabel,
        payment_method: kind
      };

      const response = await fetch(CONFIG.ENDPOINT, {
        method: "POST",
        headers: { "Content-Type":"application/json", "Origin": CONFIG.ALLOWED_ORIGIN },
        body: JSON.stringify(payload)
      });

      if(!response.ok){
        throw new Error("notify failed");
      }

      toast(
        snapshot.lang === "th"
          ? "ส่งข้อมูลให้ทีมเรียบร้อยแล้ว ทีมจะติดตามรายการต่ออายุของคุณต่อ"
          : "Your renewal details have been sent to the team for follow-up.",
        "good"
      );
    }catch(error){
      console.warn("[MMD] renewal notify error", error);
      toast(
        currentLang() === "th"
          ? "ยังส่งข้อมูลไม่สำเร็จ กรุณาลองอีกครั้งในอีกสักครู่"
          : "The page could not send your renewal details yet. Please try again shortly.",
        "bad"
      );
    }finally{
      if(button){
        button.disabled = false;
        button.style.opacity = "1";
      }
    }
  }

  function bind(){
    $$(".lang button").forEach((btn)=>{
      btn.addEventListener("click", ()=> setLang(btn.dataset.setLang || "th"));
    });

    ["package", "activity", "usage"].forEach((name)=>{
      const el = field(name);
      if(!el) return;
      el.addEventListener("input", ()=> updateSummary());
      el.addEventListener("change", ()=> updateSummary());
    });

    ["name", "email"].forEach((name)=>{
      const el = field(name);
      if(!el) return;
      el.addEventListener("input", clearToast);
    });

    $("[data-renew-action='recalc']")?.addEventListener("click", ()=> updateSummary());

    $$("input[name='renew_payment_method']").forEach((input)=>{
      input.addEventListener("change", ()=> setMethod(input.value));
    });

    $("[data-renew-action='notify-promptpay']")?.addEventListener("click", ()=> notify("promptpay"));
    $("[data-renew-action='notify-paypal']")?.addEventListener("click", ()=> notify("paypal"));
  }

  bind();
  setLang(root.dataset.lang || "th");
  setMethod(($("input[name='renew_payment_method']:checked") || {}).value || "promptpay");
  updateSummary();
})();
