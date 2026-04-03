<!-- Turnstile (ถ้าทั้งเว็บยังไม่มี ให้ใส่ / ถ้ามี global แล้ว ไม่ต้องใส่ซ้ำ) -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"></script>

<script>
(function(){
  "use strict";

  // LOCK: only this page
  if (location.pathname !== "/confirm/payment-confirmation") return;

  const root = document.getElementById("mmd-confirmation");
  if(!root) return;

  // Guard: prevent double init
  if (root.__MMD_CONFIRM_INIT__) return;
  root.__MMD_CONFIRM_INIT__ = true;

  const qs = new URLSearchParams(location.search);

  // =========================
  // CONFIG (LOCK)
  // =========================
  const WORKER_NOTIFY = "/v1/payments/notify"; // via MMD.workerPost
  const RULES_ACK     = "/v1/rules/ack";       // via MMD.workerPost

  const RULES_URL = "https://mmdprive.com/rules/model-work.html";
  const RULES_VERSION = "v2026-01-16";
  const RULES_KEY = "mmd_rules_accepted_" + RULES_VERSION;

  const TURNSTILE_SITEKEY = "0x4AAAAAACIE9VleQdOBRfBG";

  const HERO = {
    standard: "https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/69551d32a8d235ce11b4f658_ChatGPT%20Image%20Dec%2031%2C%202025%2C%2004_27_50%20PM.png",
    premium:  "https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/69551d33b6c129d6f740723a_ChatGPT%20Image%20Dec%2031%2C%202025%2C%2004_29_02%20PM.png",
    vip:      "https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/69551d32b6e373f922a7c7c3_ChatGPT%20Image%20Dec%2031%2C%202025%2C%20007_28_37%20PM.png",
    svip:     "https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/69551d328e1146d4fd97df62_ChatGPT%20Image%20Dec%2031%2C%202025%2C%2007_54_17%20PM.png"
  };

  const ACCESS = {
    standard: {
      drive_label: "MMD Standard Drive",
      drive_url: "https://drive.google.com/open?id=1LcKsmuu1VzACvUBnm9UlS3dBgtM2hQ7s&usp=drive_fs",
      telegram_label: "MMD Standard Group",
      telegram_url: "https://t.me/+x7Q9GuhDYltjNmY1"
    },
    premium: {
      drive_label: "MMD Premium Drive",
      drive_url: "https://drive.google.com/drive/u/2/folders/16DfhOo-DwJedBaTi_pvkxGEnPjWGdxxD",
      telegram_label: "MMD Premium Group",
      telegram_url: "https://t.me/+jrHnEcfa0aowNDk1"
    },
    vip: {
      drive_label: "MMD VIP Drive",
      drive_url: "https://drive.google.com/drive/u/2/folders/16DfhOo-DwJedBaTi_pvkxGEnPjWGdxxD",
      telegram_label: "MMD VIP Lounge",
      telegram_url: "https://t.me/" // TODO
    },
    svip: {
      drive_label: "MMD SVIP (Black Card) Drive",
      drive_url: "https://drive.google.com/drive/u/2/folders/16DfhOo-DwJedBaTi_pvkxGEnPjWGdxxD",
      telegram_label: "MMD Black Card Channel",
      telegram_url: "https://t.me/" // TODO
    }
  };

  // =========================
  // HELPERS
  // =========================
  const setIfEmpty = (k, v)=>{
    v = (v ?? "").toString().trim();
    if(!v) return;
    if(!root.dataset[k]) root.dataset[k] = v;
  };
  const numStr = (s)=> (s ?? "").toString().replace(/,/g,"").trim();

  const normalizeTier = (t)=>{
    t = (t || "").toString().toLowerCase().trim();
    if(!t) return "standard";
    if(t === "svip" || t === "blackcard" || t === "black-card") return "svip";
    if(t === "vip") return "vip";
    if(t === "premium") return "premium";
    if(t === "standard") return "standard";
    return "standard";
  };

  const setSyncPill = (txt)=>{
    const el = document.getElementById("mmd-sync-pill");
    if(el) el.textContent = txt;
  };

  // =========================
  // 1) ingest query -> dataset
  // =========================
  setIfEmpty("paymentMethod", qs.get("payment_method"));
  setIfEmpty("amount",  numStr(qs.get("amount")));
  setIfEmpty("deposit", numStr(qs.get("deposit")));
  setIfEmpty("balance", numStr(qs.get("balance")));
  setIfEmpty("modelCode", qs.get("model"));

  const tierFromQs = (qs.get("tier") || qs.get("role") || "").toLowerCase().trim();
  if(tierFromQs){
    setIfEmpty("tier", tierFromQs);
    setIfEmpty("userRole", tierFromQs);
  }

  const tier = normalizeTier(root.dataset.tier || root.dataset.userRole || "");
  root.dataset.tier = tier;
  root.dataset.userRole = tier;

  // =========================
  // 2) apply tier class + hero
  // =========================
  root.classList.remove("tier-standard","tier-premium","tier-vip","tier-svip");
  root.classList.add("tier-" + tier);

  const heroEl = root.querySelector(".mmd-confirm-hero");
  if(heroEl){
    heroEl.style.backgroundImage = 'url("' + (HERO[tier] || HERO.standard) + '")';
  }

  // =========================
  // 3) render dataset -> UI
  // =========================
  root.querySelectorAll("[data-bind]").forEach(el=>{
    const key = el.getAttribute("data-bind");
    const v = (root.dataset[key] ?? "").toString().trim();
    if(v) el.textContent = v;
  });

  // show/hide deposit/balance rows
  const hasDeposit = !!(root.dataset.deposit || "").trim();
  const hasBalance = !!(root.dataset.balance || "").trim();
  const depRow = root.querySelector(".mmd-deposit");
  const balRow = root.querySelector(".mmd-balance");
  if(depRow) depRow.style.display = hasDeposit ? "" : "none";
  if(balRow) balRow.style.display = hasBalance ? "" : "none";

  // =========================
  // 4) next steps by tier
  // =========================
  const driveBtn = document.getElementById("mmd-btn-drive");
  const tgBtn = document.getElementById("mmd-btn-telegram");
  const driveLabel = document.getElementById("mmd-drive-label");
  const tgLabel = document.getElementById("mmd-telegram-label");

  const acc = ACCESS[tier] || ACCESS.standard;
  if(driveBtn) driveBtn.href = acc.drive_url || "#";
  if(driveLabel) driveLabel.textContent = acc.drive_label || "—";
  if(tgBtn) tgBtn.href = acc.telegram_url || "https://t.me/";
  if(tgLabel) tgLabel.textContent = acc.telegram_label || "—";

  // i18n refresh (best-effort)
  try{
    if(window.MMD && MMD.i18n && typeof MMD.i18n.apply === "function"){
      MMD.i18n.apply();
    }
  }catch(_){}

  // =========================
  // Memberstack best-effort
  // =========================
  async function getMemberstackIdentity(){
    try{
      if(window.$memberstackDom && typeof window.$memberstackDom.getCurrentMember === "function"){
        const r = await window.$memberstackDom.getCurrentMember();
        const m = (r && r.data) ? r.data : null;
        if(!m) return null;
        return {
          member_id: m.id || "",
          email: m.email || "",
          name: (m.name || "").trim(),
          phone: (m.phone || m.phoneNumber || "").trim()
        };
      }
    }catch(_){}
    return null;
  }

  // =========================
  // 5) notify worker (confirm) — MUST
  // =========================
  (async ()=>{
    setSyncPill("Sync: running");

    const member = await getMemberstackIdentity();

    const payload = {
      source: "confirm",
      page: location.pathname,
      lang: (window.MMD && MMD.lang && typeof MMD.lang.get === "function") ? MMD.lang.get() : "th",

      tier: tier,
      payment_method: root.dataset.paymentMethod || "",
      amount: root.dataset.amount || "",
      deposit: root.dataset.deposit || "",
      balance: root.dataset.balance || "",
      model: root.dataset.modelCode || "",

      intent: qs.get("intent") || "",
      ref: qs.get("ref") || "",
      ts: new Date().toISOString(),

      member: member || {}
    };

    try{
      // uses X-Confirm-Key automatically (only on /confirm/*) from mmd-global.js
      await MMD.workerPost(WORKER_NOTIFY, payload);
      setSyncPill("Sync: done");
    }catch(e){
      console.error(e);
      setSyncPill("Sync: failed");
    }
  })();

  // =========================
  // 6) RULES POPUP — auto open if not accepted
  // =========================
  function isAccepted(){
    try{ return localStorage.getItem(RULES_KEY) === "1"; }catch(_){ return false; }
  }
  function setAccepted(){
    try{ localStorage.setItem(RULES_KEY,"1"); }catch(_){}
  }

  function ensureModal(){
    if (document.getElementById("mmd-rules-modal")) return;

    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div id="mmd-rules-modal" class="mmd-modal" aria-hidden="true">
        <div class="mmd-modal-backdrop"></div>
        <div class="mmd-modal-card" role="dialog" aria-modal="true" aria-label="MMD Rules">
          <header class="mmd-modal-header">
            <div>
              <h3 class="mmd-title">MMD • กฎข้อปฏิบัติในการไปทำงาน</h3>
              <div class="mmd-sub">กรุณาอ่านให้ครบ และยืนยันการรับทราบ</div>
            </div>
            <div class="mmd-pill" id="mmd-rules-status">Required</div>
          </header>

          <div class="mmd-modal-body">
            <iframe id="mmd-rules-iframe" src="${RULES_URL}" title="MMD Model Work Rules" frameborder="0" loading="eager"></iframe>
          </div>

          <footer class="mmd-modal-footer">
            <label class="mmd-check">
              <input type="checkbox" id="mmd-rules-ack" />
              <span>ฉันได้อ่านและเข้าใจกฎข้อปฏิบัติทั้งหมดแล้ว</span>
            </label>
            <button id="mmd-rules-accept" class="mmd-btn2" disabled>ยืนยัน</button>
          </footer>
        </div>
      </div>
      <div id="mmd-rules-turnstile" style="display:none"></div>
    `;
    document.body.appendChild(wrap.firstElementChild);
    document.body.appendChild(wrap.lastElementChild);
  }

  function openModal(){
    const modal = document.getElementById("mmd-rules-modal");
    modal.setAttribute("aria-hidden","false");
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
  }
  function closeModal(){
    const modal = document.getElementById("mmd-rules-modal");
    modal.setAttribute("aria-hidden","true");
    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
  }

  // Turnstile invisible (best-effort)
  let tsWidgetId = null;
  async function getTurnstileToken(){
    try{
      if(!window.turnstile) return "";
      if(tsWidgetId === null){
        tsWidgetId = window.turnstile.render("#mmd-rules-turnstile", {
          sitekey: TURNSTILE_SITEKEY,
          theme: "dark",
          size: "invisible"
        });
      }
      const token = await window.turnstile.execute(tsWidgetId, { action: "rules_ack" });
      return token || "";
    }catch(_){
      return "";
    }
  }

  async function postRulesAck(){
    const member = await getMemberstackIdentity();
    const token = await getTurnstileToken();

    const payload = {
      type: "rules_ack",
      rules: { url: RULES_URL, version: RULES_VERSION },
      page: { href: location.href, path: location.pathname },
      member: member || {},
      userAgent: navigator.userAgent,
      tsToken: token,
      acceptedAt: new Date().toISOString()
    };

    // uses X-Confirm-Key automatically (only on /confirm/*)
    return await MMD.workerPost(RULES_ACK, payload);
  }

  // Boot popup after DOM
  setTimeout(()=>{
    ensureModal();
    if(isAccepted()) return;

    const ack = document.getElementById("mmd-rules-ack");
    const btn = document.getElementById("mmd-rules-accept");
    const status = document.getElementById("mmd-rules-status");

    if(!ack || !btn) return;

    const setBusy = (busy)=>{
      btn.disabled = busy || !ack.checked;
      btn.textContent = busy ? "กำลังบันทึก..." : "ยืนยัน";
      if(status) status.textContent = busy ? "Saving" : (ack.checked ? "Ready" : "Required");
    };

    ack.addEventListener("change", ()=> setBusy(false));

    btn.addEventListener("click", async ()=>{
      if(!ack.checked) return;
      setBusy(true);
      try{
        await postRulesAck();
        setAccepted();
        closeModal();
      }catch(e){
        console.error(e);
        setBusy(false);
        alert("บันทึกการยอมรับไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
      }
    });

    openModal();
  }, 0);

})();
</script>
