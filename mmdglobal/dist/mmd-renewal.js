(function(){
  "use strict";

  const root = document.getElementById("mmd-renewal");
  if(!root) return;

  /* Kill particles */
  const PARTICLE_SELECTOR =
    "canvas#gold-particles, #gold-particles, canvas[id*='particle' i], canvas[class*='particle' i]";
  function killParticles(){ document.querySelectorAll(PARTICLE_SELECTOR).forEach(el=>el.remove()); }
  killParticles();
  try{
    const mo = new MutationObserver(killParticles);
    mo.observe(document.documentElement, { childList:true, subtree:true });
  }catch(e){}

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

  function fmtTHB(n){
    const v = Number(n);
    if(!Number.isFinite(v)) return "฿0";
    return "฿" + Math.trunc(v).toLocaleString("en-US");
  }
  function toNumber(v){
    const n = Number(String(v || "").replace(/[^\d.]/g,""));
    return Number.isFinite(n) ? n : 0;
  }
  function buildPromptPayUrl(amount){
    return "https://promptpay.io/" + encodeURIComponent(CONFIG.PROMPTPAY_ID) + "/" + encodeURIComponent(String(Math.trunc(amount)));
  }
  function renderQR(url){
    const el = $("#qr"); if(!el) return;
    el.innerHTML = "";
    if(!window.QRCode){
      el.innerHTML = "<div style='color:#111;font-weight:900;font-family:DM Sans;padding:14px;text-align:center;'>QR library not loaded</div>";
      return;
    }
    new QRCode(el, { text: url, width: 220, height: 220 });
  }

  function calcRenewal({ pkg, usage, activity }){
    const isActive = activity === "active365";
    let pay = 0, rateTH = "—", rateEN = "—";

    if(pkg === "premium"){
      if(isActive && usage >= 120000){ pay=0; rateTH="ต่อฟรี 1 ปี (Premium)"; rateEN="FREE 1 year (Premium)"; }
      else if(isActive && usage >= 40000){ pay=1900; rateTH="เรทต่ออายุ Premium ฿1,900"; rateEN="Premium renewal ฿1,900"; }
      else { pay=2500; rateTH="เรทต่ออายุ Premium ฿2,500"; rateEN="Premium renewal ฿2,500"; }
    }else{
      if(isActive && usage >= 60000){ pay=0; rateTH="ต่อฟรี 1 ปี (Standard)"; rateEN="FREE 1 year (Standard)"; }
      else if(isActive && usage >= 15000){ pay=900; rateTH="เรทต่ออายุ Standard ฿900"; rateEN="Standard renewal ฿900"; }
      else { pay=1050; rateTH="เรทต่ออายุ Standard ฿1,050"; rateEN="Standard renewal ฿1,050"; }
    }

    let vip="Standard", vipGold=false;
    if(usage >= 250000){ vip="SVIP • BLACK CARD"; vipGold=true; }
    else if(usage >= 150000){ vip="VIP"; vipGold=true; }

    return { pay, rateTH, rateEN, vip, vipGold };
  }

  function recalc(){
    const lang = root.dataset.lang || "th";
    const pkg = $("#pkg").value;
    const usage = toNumber($("#usage").value);
    const activity = $("#activity").value;

    const out = calcRenewal({ pkg, usage, activity });

    $("#payAmount").textContent = fmtTHB(out.pay);
    $("#rateLabel").textContent = (lang === "th") ? out.rateTH : out.rateEN;

    const vipBadge = $("#vipBadge");
    vipBadge.textContent = out.vip;
    vipBadge.classList.toggle("gold", !!out.vipGold);

    const mini = $("#tierBadgeMini");
    if(mini){
      mini.textContent = out.vipGold ? "VIP Eligible" : "";
      mini.style.color = out.vipGold ? "rgba(232,212,154,.92)" : "rgba(244,242,238,.52)";
    }

    const qrPay = out.pay > 0 ? out.pay : 1; // ถ้า free: สร้าง QR 1 บาทกัน QR ว่าง
    renderQR(buildPromptPayUrl(qrPay));

    return { pkg, usage, activity, payAmount: out.pay, vip: out.vip, lang };
  }

  /* Language toggle */
  (function initLang(){
    const btns = $$(".lang button");
    const setLang = (lang)=>{
      $$("[data-lang]").forEach(el=>{
        el.style.display = (el.getAttribute("data-lang")===lang) ? "" : "none";
      });
      btns.forEach(b=>b.classList.toggle("active", b.dataset.setLang===lang));
      root.dataset.lang = lang;
      recalc();
    };
    btns.forEach(b=>b.addEventListener("click", ()=>setLang(b.dataset.setLang)));
    setLang(root.dataset.lang || "th");
  })();

  /* Payment method switch */
  function setPaymentMethod(method){
    const pp = $("#promptpayPanel");
    const paypal = $("#paypalPanel");
    if(pp) pp.style.display = (method==="promptpay") ? "" : "none";
    if(paypal) paypal.style.display = (method==="paypal") ? "" : "none";
    $$(".method").forEach(m=> m.classList.toggle("is-selected", m.getAttribute("data-method")===method));
    if(method==="promptpay") recalc();
  }
  document.querySelectorAll('input[name="pay_method"]').forEach(r=>{
    r.addEventListener("change", ()=> setPaymentMethod(r.value));
  });
  setPaymentMethod("promptpay");

  /* Recalc events */
  $("#btnRecalc")?.addEventListener("click", recalc);
  ["pkg","usage","activity"].forEach(id=>{
    $("#"+id)?.addEventListener("input", ()=>{ clearTimeout(window.__mmd_rt); window.__mmd_rt=setTimeout(recalc, 150); });
    $("#"+id)?.addEventListener("change", recalc);
  });

  /* Turnstile */
  let tsWidgetId = null;

  function ensureTurnstileWidget(mountSel){
    return new Promise((resolve, reject)=>{
      const mount = document.querySelector(mountSel);
      if(!mount) return reject(new Error("Turnstile mount missing"));

      const ready = ()=>{
        try{
          mount.innerHTML = "<div class='tsBox'></div>";
          const box = mount.querySelector(".tsBox");
          tsWidgetId = window.turnstile.render(box, {
            sitekey: CONFIG.TURNSTILE_SITEKEY,
            size: "invisible",
            callback: function(){}
          });
          resolve(tsWidgetId);
        }catch(e){ reject(e); }
      };

      const maxWait = Date.now() + 8000;
      (function poll(){
        if(window.turnstile && typeof window.turnstile.render === "function") return ready();
        if(Date.now() > maxWait) return reject(new Error("Turnstile not ready"));
        setTimeout(poll, 120);
      })();
    });
  }

  function getTurnstileToken(mountSel){
    return new Promise(async (resolve, reject)=>{
      try{
        await ensureTurnstileWidget(mountSel);

        const done = (token)=>{
          try{ window.turnstile.reset(tsWidgetId); }catch{}
          resolve(token);
        };

        try{ window.turnstile.remove(tsWidgetId); }catch{}
        tsWidgetId = null;

        const mount = document.querySelector(mountSel);
        mount.innerHTML = "<div class='tsBox'></div>";
        const box = mount.querySelector(".tsBox");

        tsWidgetId = window.turnstile.render(box, {
          sitekey: CONFIG.TURNSTILE_SITEKEY,
          size: "invisible",
          callback: done,
          "error-callback": ()=>reject(new Error("Turnstile error")),
          "expired-callback": ()=>reject(new Error("Turnstile expired"))
        });

        window.turnstile.execute(tsWidgetId);
      }catch(e){
        reject(e);
      }
    });
  }

  async function postNotify(mountSel, btnSel){
    const calc = recalc();
    const btn = document.querySelector(btnSel);
    if(btn){ btn.disabled = true; btn.style.opacity = ".75"; }

    try{
      const token = await getTurnstileToken(mountSel);

      const payload = {
        package: calc.pkg,
        amount_thb: calc.payAmount,
        currency: CONFIG.CURRENCY,
        promo_code: "",
        promptpay_id: CONFIG.PROMPTPAY_ID,
        promptpay_url: buildPromptPayUrl(calc.payAmount),
        page: CONFIG.PAGE,
        lang: calc.lang,
        is_authenticated: false,
        customer_email: String($("#email")?.value || "").trim(),
        customer_name: String($("#name")?.value || "").trim(),
        member_id: "",
        anomaly_flags: [],
        turnstile_token: token,
        renewal_usage_12m: calc.usage,
        renewal_activity: calc.activity,
        vip_eligibility: calc.vip
      };

      const res = await fetch(CONFIG.ENDPOINT, {
        method: "POST",
        headers:{ "Content-Type":"application/json", "Origin": CONFIG.ALLOWED_ORIGIN },
        body: JSON.stringify(payload)
      });

      if(!res.ok) console.warn("[MMD] notify failed", res.status);
    }catch(e){
      console.warn("[MMD] notify error", e);
    }finally{
      if(btn){ btn.disabled = false; btn.style.opacity = "1"; }
    }
  }

  $("#btnNotify")?.addEventListener("click", ()=> postNotify("#tsMount", "#btnNotify"));
  $("#btnNotify2")?.addEventListener("click", ()=> postNotify("#tsMount2", "#btnNotify2"));

  recalc();
})();
