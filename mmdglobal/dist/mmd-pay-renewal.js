(function(){
  "use strict";

  const root = document.querySelector("#mmd-pay-renewal[data-renewal-ui='v2']");
  if(!root) return;

  const CONFIG = {
    ENDPOINT: "https://admin-worker.malemodel-bkk.workers.dev/member/api/renewal/intake",
    TURNSTILE_SITEKEY: "0x4AAAAAACIE9VleQdOBRfBG",
    PROMPTPAY_ID: "0829528889",
    PAGE: "/pay/renewal",
    FALLBACK_ONBOARDING_URL: "/sigil/onboarding",
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

  function packageLabel(pkg){
    return pkg === "standard" ? "Standard" : "Premium";
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

  function isEmail(value){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
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

  function buildServiceHistoryNote(snapshot, kind){
    return [
      "renewal_page_submission",
      "page:" + CONFIG.PAGE,
      "package:" + packageLabel(snapshot.form.package),
      "activity:" + snapshot.form.activity,
      "usage_12m:" + String(snapshot.form.usage),
      "selected_rate:" + String(snapshot.result.pay),
      "payment_method:" + kind
    ].join(" | ");
  }

  function validateForm(snapshot){
    if(!snapshot.form.name){
      return snapshot.lang === "th"
        ? "กรุณากรอกชื่อของคุณก่อนส่งข้อมูล"
        : "Please enter your name before submitting.";
    }

    if(!snapshot.form.email){
      return snapshot.lang === "th"
        ? "กรุณากรอกอีเมลสำหรับการติดตามผล"
        : "Please enter an email for follow-up.";
    }

    if(!isEmail(snapshot.form.email)){
      return snapshot.lang === "th"
        ? "รูปแบบอีเมลไม่ถูกต้อง กรุณาตรวจสอบอีกครั้ง"
        : "The email format looks invalid. Please check it again.";
    }

    if(snapshot.form.usage <= 0){
      return snapshot.lang === "th"
        ? "กรุณากรอกยอดใช้งานย้อนหลัง 12 เดือนเป็นตัวเลขมากกว่า 0"
        : "Please enter your last 12 months of usage as a number greater than 0.";
    }

    return "";
  }

  function setFieldValidity(name, valid){
    const el = field(name);
    if(!el) return;
    el.setAttribute("aria-invalid", valid ? "false" : "true");
    el.style.borderColor = valid ? "" : "rgba(214, 106, 106, 0.95)";
  }

  function updateActionState(){
    const snapshot = updateSummary();
    const error = validateForm(snapshot);
    const disabled = Boolean(error);

    ["name", "email"].forEach((name)=>{
      const value = snapshot.form[name];
      const valid = name === "email" ? (!value || isEmail(value)) : Boolean(value);
      setFieldValidity(name, valid);
    });
    setFieldValidity("usage", snapshot.form.usage > 0);

    ["promptpay", "paypal"].forEach((kind)=>{
      const button = $(`[data-renew-action='notify-${kind}']`);
      if(!button) return;
      button.disabled = disabled;
      button.setAttribute("aria-disabled", disabled ? "true" : "false");
      button.style.opacity = disabled ? ".55" : "1";
      button.style.cursor = disabled ? "not-allowed" : "";
    });

    return { snapshot, error };
  }

  function buildRenewalPayload(snapshot, kind, token){
    return {
      display_name: snapshot.form.name,
      name: snapshot.form.name,
      email: snapshot.form.email,
      current_tier_hint: packageLabel(snapshot.form.package),
      target_tier: packageLabel(snapshot.form.package),
      package: snapshot.form.package,
      package_code: snapshot.form.package,
      package_label: packageLabel(snapshot.form.package),
      total: snapshot.result.pay,
      payment_method: kind,
      flow: "renewal",
      page: CONFIG.PAGE,
      source_page: window.location.pathname || CONFIG.PAGE,
      service_history_note: buildServiceHistoryNote(snapshot, kind),
      raw_json: JSON.stringify({
        lang: snapshot.lang,
        renewal_activity: snapshot.form.activity,
        renewal_usage_12m: snapshot.form.usage,
        vip_eligibility: snapshot.result.vipLabel,
        turnstile_token: token
      })
    };
  }

  async function postRenewal(snapshot, kind, token){
    const response = await fetch(CONFIG.ENDPOINT, {
      method: "POST",
      headers: { "Content-Type":"application/json" },
      body: JSON.stringify(buildRenewalPayload(snapshot, kind, token))
    });

    const payload = await response.json().catch(()=> null);
    if(!response.ok || !payload || payload.ok === false){
      const message = payload && payload.error && payload.error.message ? payload.error.message : "renewal intake failed";
      throw new Error(message);
    }

    return payload;
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
    const state = updateActionState();
    const snapshot = state.snapshot;
    const validationError = state.error;
    if(validationError){
      toast(validationError, "bad");
      return;
    }

    const button = $(`[data-renew-action='notify-${kind}']`);
    if(button){
      button.disabled = true;
      button.style.opacity = ".75";
    }

    try{
      const token = await getTurnstileToken(kind);
      const payload = await postRenewal(snapshot, kind, token);

      toast(
        snapshot.lang === "th"
          ? "ส่งข้อมูลให้ทีมเรียบร้อยแล้ว ทีมจะติดตามรายการต่ออายุของคุณต่อ"
          : "Your renewal details have been sent to the team for follow-up.",
        "good"
      );

      const onboardingUrl =
        payload && payload.data && payload.data.links && payload.data.links.customer_url
          ? String(payload.data.links.customer_url)
          : CONFIG.FALLBACK_ONBOARDING_URL;

      if(onboardingUrl){
        window.location.href = onboardingUrl;
        return;
      }
    }catch(error){
      console.warn("[MMD] renewal notify error", error);
      toast(
        currentLang() === "th"
          ? "ยังส่งข้อมูลไม่สำเร็จ กรุณาตรวจข้อมูลแล้วลองอีกครั้ง"
          : "The page could not send your renewal details yet. Please review the form and try again.",
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
      el.addEventListener("input", ()=> updateActionState());
      el.addEventListener("change", ()=> updateActionState());
    });

    ["name", "email"].forEach((name)=>{
      const el = field(name);
      if(!el) return;
      el.addEventListener("input", ()=>{
        clearToast();
        updateActionState();
      });
      el.addEventListener("blur", ()=> updateActionState());
    });

    $("[data-renew-action='recalc']")?.addEventListener("click", ()=> updateActionState());

    $$("input[name='renew_payment_method']").forEach((input)=>{
      input.addEventListener("change", ()=> setMethod(input.value));
    });

    $("[data-renew-action='notify-promptpay']")?.addEventListener("click", ()=> notify("promptpay"));
    $("[data-renew-action='notify-paypal']")?.addEventListener("click", ()=> notify("paypal"));
  }

  bind();
  setLang(root.dataset.lang || "th");
  setMethod(($("input[name='renew_payment_method']:checked") || {}).value || "promptpay");
  updateActionState();
})();
