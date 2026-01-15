/* =========================================
   MMD • INTERNAL ADMIN — JS (LOCK 2026-01-15)
   Scope: #mmd-admin
========================================= */
(function(){
  "use strict";

  const root = document.getElementById("mmd-admin");
  if(!root) return;

  if (window.__MMD_ADMIN_BOOTSTRAPPED__) return;
  window.__MMD_ADMIN_BOOTSTRAPPED__ = true;

  const LS_API_BASE = "mmd_admin_api_base";
  const DEFAULT_API_BASE = "https://telegram.malemodel-bkk.workers.dev";

  const $  = (sel)=> root.querySelector(sel);
  const $$ = (sel)=> Array.from(root.querySelectorAll(sel));

  const elHeroImg = $("#hero-img");

  const elAuthPill  = $("#auth-pill");
  const elRolePill  = $("#role-pill");
  const elAuthState = $("#auth-state");
  const elRoleState = $("#role-state");

  function setPill(pillEl, mode){
    if(!pillEl) return;
    pillEl.classList.remove("good","bad");
    if(mode === "good") pillEl.classList.add("good");
    if(mode === "bad")  pillEl.classList.add("bad");
  }

  function applyHero(){
    const src = String(root.getAttribute("data-hero-src") || "").trim();
    if (elHeroImg && src) elHeroImg.src = src;
  }

  function setActiveView(view){
    const v = String(view || "dashboard").trim();
    $$(".nav-btn").forEach(btn=>{
      btn.classList.toggle("active", btn.getAttribute("data-view") === v);
    });
    $$(".view").forEach(sec=>{
      sec.classList.toggle("active", sec.getAttribute("data-view") === v);
    });
  }

  function bindNav(){
    $$(".nav-btn").forEach(btn=>{
      btn.addEventListener("click", ()=>{
        setActiveView(btn.getAttribute("data-view"));
      });
    });
  }

  function getApiBase(){
    try{
      return (localStorage.getItem(LS_API_BASE) || DEFAULT_API_BASE).trim();
    } catch(_){
      return DEFAULT_API_BASE;
    }
  }

  function setApiBase(v){
    const s = String(v || "").trim();
    if(!s) return;
    try{ localStorage.setItem(LS_API_BASE, s); } catch(_){}
  }

  async function getCurrentMemberSafe(){
    try{
      if (window.$memberstackDom && typeof window.$memberstackDom.getCurrentMember === "function") {
        return await window.$memberstackDom.getCurrentMember();
      }
    } catch(_){}
    return null;
  }

  async function refreshAuth(){
    if (elAuthState) elAuthState.textContent = "Checking…";
    if (elRoleState) elRoleState.textContent = "—";
    setPill(elAuthPill, null);
    setPill(elRolePill, null);

    const mem = await getCurrentMemberSafe();
    if (!mem || !mem.data) {
      if (elAuthState) elAuthState.textContent = "Not signed in";
      if (elRoleState) elRoleState.textContent = "guest";
      setPill(elAuthPill, "bad");
      setPill(elRolePill, "bad");
      return { ok:false };
    }

    const data = mem.data;
    const cf = data.customFields || data.custom_fields || {};
    const roleGuess =
      String(cf.role || cf.permission || cf.admin_role || data.role || "").trim() ||
      (data.planConnections?.[0]?.planName || "");

    if (elAuthState) elAuthState.textContent = "Signed in";
    setPill(elAuthPill, "good");

    if (elRoleState) elRoleState.textContent = roleGuess || "member";
    setPill(elRolePill, roleGuess ? "good" : null);

    return { ok:true, role: roleGuess || "member" };
  }

  function pretty(obj){
    try { return JSON.stringify(obj, null, 2); } catch { return String(obj); }
  }

  async function apiFetch(path, opts){
    const base = getApiBase().replace(/\/+$/,"");
    const url = base + path;

    const headers = Object.assign(
      { "content-type":"application/json" },
      (opts && opts.headers) ? opts.headers : {}
    );

    const res = await fetch(url, Object.assign({}, opts || {}, { headers }));
    const txt = await res.text().catch(()=> "");
    let json;
    try { json = JSON.parse(txt); } catch { json = { raw: txt }; }

    if(!res.ok){
      const err = new Error(json?.error || json?.message || `HTTP ${res.status}`);
      err.status = res.status;
      err.data = json;
      throw err;
    }
    return json;
  }

  async function memberLookup(email, outEl){
    if(!outEl) return;
    const q = String(email || "").trim();
    if(!q){ outEl.textContent = "Missing email"; return; }

    outEl.textContent = "…";
    try{
      const data = await apiFetch(`/v1/admin/member?email=${encodeURIComponent(q)}`, { method:"GET" });
      outEl.textContent = pretty(data);
    } catch(e){
      outEl.textContent = pretty({ ok:false, error:String(e.message || e), status:e.status || 0, data:e.data || null });
    }
  }

  async function telegramInvite(tgUserId, tier, outEl){
    if(!outEl) return;
    const id = String(tgUserId || "").trim();
    if(!id){ outEl.textContent = "Missing telegram_user_id"; return; }

    outEl.textContent = "…";
    try{
      const payload = { telegram_user_id: id, tier: String(tier || "standard") };
      const data = await apiFetch(`/v1/admin/telegram/invite`, {
        method:"POST",
        body: JSON.stringify(payload)
      });
      outEl.textContent = pretty(data);
    } catch(e){
      outEl.textContent = pretty({ ok:false, error:String(e.message || e), status:e.status || 0, data:e.data || null });
    }
  }

  async function refreshMetrics(){
    // Optional endpoint (ถ้ายังไม่ทำก็ไม่พัง)
    try{
      const data = await apiFetch(`/v1/admin/metrics`, { method:"GET" });
      const m = data?.metrics || data || {};

      const km = $("#kpi-members");
      const kp = $("#kpi-payments");
      const kl = $("#kpi-ledger");

      if (km) km.textContent = (m.members ?? "—");
      if (kp) kp.textContent = (m.payments ?? "—");
      if (kl) kl.textContent = (m.points_ledger ?? m.ledger ?? "—");
    } catch(_){}
  }

  function bindButtons(){
    const btnRefresh = $("#btn-refresh");
    const btnSignout = $("#btn-signout");

    if (btnRefresh) btnRefresh.addEventListener("click", async ()=>{
      await refreshAuth();
      await refreshMetrics();
    });

    if (btnSignout) btnSignout.addEventListener("click", async ()=>{
      try{
        if (window.$memberstackDom && typeof window.$memberstackDom.logout === "function") {
          await window.$memberstackDom.logout();
        }
      } catch(_){}
      location.reload();
    });

    const btnLookup1 = $("#btn-member-lookup");
    const btnLookup2 = $("#btn-member-lookup-2");

    if (btnLookup1) btnLookup1.addEventListener("click", ()=>{
      memberLookup($("#mem-query")?.value || "", $("#member-result"));
    });

    if (btnLookup2) btnLookup2.addEventListener("click", ()=>{
      memberLookup($("#mem-query-2")?.value || "", $("#member-result-2"));
    });

    const btnTg = $("#btn-tg-invite");
    if (btnTg) btnTg.addEventListener("click", ()=>{
      telegramInvite($("#tg-user-id")?.value || "", $("#tg-tier")?.value || "standard", $("#tg-result"));
    });

    const btnSave = $("#btn-save-settings");
    if (btnSave) btnSave.addEventListener("click", ()=>{
      const elApiBase = $("#api-base");
      const elHeroSrc = $("#hero-src");

      if (elApiBase && elApiBase.value) setApiBase(elApiBase.value);

      if (elHeroSrc && elHeroSrc.value) {
        root.setAttribute("data-hero-src", elHeroSrc.value.trim());
        applyHero();
      }
    });
  }
   
  function bindSettingsInit(){
    const elApiBase = $("#api-base");
    const elHeroSrc = $("#hero-src");

    if (elApiBase) elApiBase.value = getApiBase();
    if (elHeroSrc) elHeroSrc.value = String(root.getAttribute("data-hero-src") || "").trim();
  }

  function boot(){
    applyHero();
    bindNav();
    bindButtons();
    bindSettingsInit();
    setActiveView("dashboard");

    refreshAuth().then(()=> refreshMetrics());
  }

  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot, { once:true });

})();
