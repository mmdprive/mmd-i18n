/* =========================================
   MMD Privé — Internal Admin JS (v2026-LOCK-01)
   Webflow-safe embed script
   - Singleton guard
   - Memberstack auth + role check
   - API base override via dataset/localStorage
   - Dual-label translation (EN/TH) via dict if present
========================================= */

(function(){
  "use strict";

  const root = document.getElementById("mmd-admin");
  if(!root) return;

  if (window.__MMD_ADMIN_BOOTSTRAPPED__) return;
  window.__MMD_ADMIN_BOOTSTRAPPED__ = true;

  // ---------- Config ----------
  const LS_API_BASE = "mmd_admin_api_base";
  const DEFAULT_API_BASE = "https://telegram.malemodel-bkk.workers.dev";

  // Change endpoints here (single source of truth)
  const ENDPOINTS = {
    metrics:   "/v1/admin/metrics",
    members:   "/v1/admin/members/search", // ?q=
    models:    "/v1/admin/models/list",
    telegram:  "/v1/admin/telegram/logs",
  };

  // ---------- DOM helpers ----------
  const $  = (sel)=> root.querySelector(sel);
  const $$ = (sel)=> Array.from(root.querySelectorAll(sel));

  // ---------- Elements ----------
  const pillAuth = $("#pill-auth");
  const pillRole = $("#pill-role");
  const authState = $("#auth-state");
  const roleState = $("#role-state");

  const msgBlocked = $("#msg-blocked");
  const msgBlockedText = $("#msg-blocked-text");
  const msgError = $("#msg-error");
  const msgErrorText = $("#msg-error-text");
  const msgOk = $("#msg-ok");
  const msgOkText = $("#msg-ok-text");

  const apiBaseText = $("#api-base-text");
  const memberIdText = $("#member-id-text");
  const tokenStateText = $("#token-state-text");

  const viewTitle = $("#view-title");
  const viewSubtitle = $("#view-subtitle");

  const btnRefresh = $("#btn-refresh");
  const btnSignout = $("#btn-signout");

  const memQuery = $("#mem-query");
  const btnMemSearch = $("#btn-mem-search");
  const memTbody = $("#mem-tbody");

  const btnModelsRefresh = $("#btn-models-refresh");
  const modelsTbody = $("#models-tbody");

  const btnTgRefresh = $("#btn-tg-refresh");
  const tgTbody = $("#tg-tbody");

  const apiBaseInput = $("#api-base-input");
  const btnApiSave = $("#btn-api-save");
  const btnApiReset = $("#btn-api-reset");

  const requiredRoleText = $("#required-role-text");
  const currentViewText = $("#current-view-text");
  const langText = $("#lang-text");

  const kpiMembers = $("#kpi-members");
  const kpiActive = $("#kpi-active");
  const kpiPremium = $("#kpi-premium");
  const kpiVip = $("#kpi-vip");

  // ---------- State ----------
  const state = {
    apiBase: "",
    token: "",
    member: null,
    role: "",
    requiredRole: (root.dataset.requiredRole || "owner").toLowerCase(),
    currentView: "dashboard",
    lang: "th", // content language default
    ready: false
  };

  // ---------- Utilities ----------
  function setPill(pillEl, ok){
    pillEl.classList.remove("ok","bad");
    pillEl.classList.add(ok ? "ok" : "bad");
  }

  function showMsg(which, text){
    msgBlocked.style.display = "none";
    msgError.style.display = "none";
    msgOk.style.display = "none";

    if(which === "blocked"){
      msgBlockedText.textContent = text || "Access blocked.";
      msgBlocked.style.display = "";
    }else if(which === "error"){
      msgErrorText.textContent = text || "Unknown error.";
      msgError.style.display = "";
    }else if(which === "ok"){
      msgOkText.textContent = text || "Ready.";
      msgOk.style.display = "";
    }
  }

  function esc(s){
    return (s ?? "").toString()
      .replaceAll("&","&amp;")
      .replaceAll("<","&lt;")
      .replaceAll(">","&gt;")
      .replaceAll('"',"&quot;")
      .replaceAll("'","&#039;");
  }

  function fmtNum(n){
    const x = Number(n);
    if(!Number.isFinite(x)) return "—";
    return x.toLocaleString("en-US");
  }

  function fmtTime(ts){
    if(!ts) return "—";
    const d = new Date(ts);
    if(Number.isNaN(d.getTime())) return esc(ts);
    return d.toISOString().replace("T"," ").slice(0,19);
  }

  function normalizeRole(r){
    r = (r ?? "").toString().trim().toLowerCase();
    if(!r) return "";
    // 1:1 mapping aligned with your “normalizeRole() แบบ 1:1” direction
    const allow = new Set(["guest","standard","premium","vip","svip","blackcard","owner","admin"]);
    if(allow.has(r)) return r;

    // compatibility aliases
    const map = {
      "black card":"blackcard",
      "black_card":"blackcard",
      "supervip":"svip",
      "super-vip":"svip"
    };
    return map[r] || r;
  }

  // ---------- i18n dual-label force translator ----------
  // Supports elements like: data-i18n-force="en:admin.nav.dashboard"
  function dictLookup(lang, key){
    const D = window.I18N_DICT || window.MMD_I18N_DICT || {};
    if (D && D[lang] && typeof D[lang][key] !== "undefined") return D[lang][key];
    if (D && D[key] && typeof D[key][lang] !== "undefined") return D[key][lang];
    return "";
  }

  function applyForcedI18n(){
    const nodes = $$("[data-i18n-force]");
    if(!nodes.length) return;

    nodes.forEach(el=>{
      const raw = el.getAttribute("data-i18n-force") || "";
      const m = raw.match(/^([a-z]{2}):(.+)$/i);
      if(!m) return;

      const forceLang = m[1].toLowerCase();
      const key = m[2].trim();
      const val = dictLookup(forceLang, key);

      // If dict not present, keep fallback inner text.
      if(typeof val === "string" && val.trim()){
        el.textContent = val;
      }
    });
  }

  // ---------- API base resolution ----------
  function getApiBase(){
    const ds = (root.dataset.apiBase || "").trim();
    if(ds) return ds;
    try{
      const ls = (localStorage.getItem(LS_API_BASE) || "").trim();
      if(ls) return ls;
    }catch(_){}
    return DEFAULT_API_BASE;
  }

  function setApiBase(next){
    state.apiBase = (next || "").trim() || DEFAULT_API_BASE;
    apiBaseText.textContent = state.apiBase;
    apiBaseInput.value = state.apiBase;
  }

  // ---------- Memberstack integration ----------
  function waitFor(fn, timeoutMs){
    const start = Date.now();
    return new Promise((resolve, reject)=>{
      const tick = ()=>{
        try{
          const v = fn();
          if(v) return resolve(v);
        }catch(_){}
        if(Date.now() - start > timeoutMs) return reject(new Error("timeout"));
        setTimeout(tick, 80);
      };
      tick();
    });
  }

  async function getMemberstack(){
    // Prefer $memberstackDom (as you referenced)
    if(window.$memberstackDom && typeof window.$memberstackDom.getCurrentMember === "function"){
      return window.$memberstackDom;
    }
    // Wait a bit for Webflow/Memberstack to load
    return await waitFor(()=> (window.$memberstackDom && typeof window.$memberstackDom.getCurrentMember === "function" ? window.$memberstackDom : null), 8000);
  }

  function extractMemberId(m){
    return m?.id || m?.data?.id || m?.member?.id || m?.data?._id || "";
  }

  function extractEmail(m){
    return m?.email || m?.data?.email || m?.member?.email || "";
  }

  function extractCustomFields(m){
    return m?.customFields || m?.data?.customFields || m?.member?.customFields || {};
  }

  async function getToken(ms){
    // Try common Memberstack token methods
    const candidates = ["getToken","getAccessToken","getMemberToken","getAuthToken"];
    for (const name of candidates){
      if(typeof ms[name] === "function"){
        try{
          const t = await ms[name]();
          if(typeof t === "string" && t.trim()) return t.trim();
        }catch(_){}
      }
    }
    return "";
  }

  function deriveRole(member){
    const cf = extractCustomFields(member) || {};
    const candidates = [
      cf.role,
      cf.mmd_role,
      cf.user_role,
      member?.role,
      member?.data?.role
    ];
    for(const r of candidates){
      const nr = normalizeRole(r);
      if(nr) return nr;
    }
    return "";
  }

  // ---------- API fetch ----------
  async function apiFetch(path, opts){
    const url = state.apiBase.replace(/\/+$/,"") + path;
    const headers = new Headers((opts && opts.headers) ? opts.headers : undefined);

    if(state.token){
      headers.set("Authorization", "Bearer " + state.token);
    }
    headers.set("Accept", "application/json");

    const res = await fetch(url, {
      ...opts,
      headers,
      method: (opts && opts.method) ? opts.method : "GET"
    });

    const text = await res.text();
    let json = null;
    try{ json = text ? JSON.parse(text) : null; }catch(_){}

    if(!res.ok){
      const msg = (json && (json.error || json.message)) ? (json.error || json.message) : (text || res.statusText);
      const e = new Error(`HTTP ${res.status}: ${msg}`);
      e.status = res.status;
      e.body = json || text;
      throw e;
    }

    return json;
  }

  // ---------- Views ----------
  function setView(view){
    state.currentView = view;
    currentViewText.textContent = view;

    // toggle nav active
    $$(".navbtn").forEach(b=> b.classList.toggle("active", b.dataset.view === view));

    // toggle panels
    $$("[data-view-panel]").forEach(p=>{
      p.style.display = (p.id === ("view-" + view)) ? "" : "none";
    });

    // titles
    const titles = {
      dashboard: ["Dashboard","Overview & KPIs"],
      members:   ["Members","Search & manage members"],
      models:    ["Models","List & uploads"],
      telegram:  ["Telegram","Logs & alerts"],
      settings:  ["Settings","API & debug"]
    };
    const t = titles[view] || ["Admin",""];
    viewTitle.textContent = t[0];
    viewSubtitle.textContent = t[1];
  }

  function bindNav(){
    $$(".navbtn").forEach(b=>{
      b.addEventListener("click", ()=>{
        setView(b.dataset.view || "dashboard");
        // auto load some views
        if(state.ready){
          if(state.currentView === "dashboard") loadDashboard().catch(showApiErr);
          if(state.currentView === "models") loadModels().catch(showApiErr);
          if(state.currentView === "telegram") loadTelegram().catch(showApiErr);
        }
      });
    });
  }

  // ---------- Render helpers ----------
  function tr(cols){
    return "<tr>" + cols.map(c=> `<td>${c}</td>`).join("") + "</tr>";
  }

  function showApiErr(err){
    const body = (err && err.body) ? (typeof err.body === "string" ? err.body : JSON.stringify(err.body)) : "";
    showMsg("error", (err?.message || "API error") + (body ? ("\n" + body) : ""));
  }

  // ---------- Loaders ----------
  async function loadDashboard(){
    showMsg("ok","Loading dashboard…");
    const data = await apiFetch(ENDPOINTS.metrics);

    // Example expected shape (adjust server if needed):
    // { members_total, members_active_30d, premium_current, vip_current }
    kpiMembers.textContent = fmtNum(data?.members_total);
    kpiActive.textContent = fmtNum(data?.members_active_30d);
    kpiPremium.textContent = fmtNum(data?.premium_current);
    kpiVip.textContent = fmtNum(data?.vip_current);

    showMsg("ok","Dashboard loaded.");
  }

  async function loadMembers(){
    const q = (memQuery.value || "").trim();
    showMsg("ok", q ? "Searching members…" : "Loading members…");

    const qs = new URLSearchParams();
    if(q) qs.set("q", q);
    qs.set("limit","50");

    const data = await apiFetch(ENDPOINTS.members + "?" + qs.toString());

    const rows = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
    memTbody.innerHTML = rows.map(it=>{
      const id = esc(it.id || it.member_id || "");
      const email = esc(it.email || "");
      const tier = esc(it.tier || it.plan || "");
      const role = esc(it.role || "");
      const points = esc((it.points ?? it.points_total ?? "").toString());
      const updated = esc(fmtTime(it.updated_at || it.updatedAt || it.created_at || it.createdAt || ""));
      return tr([`<span class="mono">${id||"—"}</span>`, email||"—", tier||"—", role||"—", points||"—", `<span class="mono">${updated}</span>`]);
    }).join("") || tr([`<span class="muted">—</span>`,`<span class="muted">No results</span>`,`—`,`—`,`—`,`—`]);

    showMsg("ok","Members loaded.");
  }

  async function loadModels(){
    showMsg("ok","Loading models…");
    const qs = new URLSearchParams();
    qs.set("limit","100");
    const data = await apiFetch(ENDPOINTS.models + "?" + qs.toString());

    const rows = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
    modelsTbody.innerHTML = rows.map(it=>{
      const code = esc(it.code || it.model_code || "");
      const name = esc(it.name || it.display_name || "");
      const cat  = esc(it.category || "");
      const notes = esc(it.notes || it.note || "");
      const updated = esc(fmtTime(it.updated_at || it.updatedAt || it.created_at || it.createdAt || ""));
      return tr([`<span class="mono">${code||"—"}</span>`, name||"—", cat||"—", notes||"—", `<span class="mono">${updated}</span>`]);
    }).join("") || tr([`<span class="muted">—</span>`,`<span class="muted">No models</span>`,`—`,`—`,`—`]);

    showMsg("ok","Models loaded.");
  }

  async function loadTelegram(){
    showMsg("ok","Loading telegram logs…");
    const qs = new URLSearchParams();
    qs.set("limit","100");
    const data = await apiFetch(ENDPOINTS.telegram + "?" + qs.toString());

    const rows = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
    tgTbody.innerHTML = rows.map(it=>{
      const time = esc(fmtTime(it.time || it.ts || it.created_at || it.createdAt || ""));
      const topic = esc(it.topic || it.channel || it.type || "");
      const msg = esc(it.message || it.text || "");
      const meta = esc(it.meta ? (typeof it.meta === "string" ? it.meta : JSON.stringify(it.meta)) : "");
      return tr([`<span class="mono">${time}</span>`, topic||"—", msg||"—", `<span class="mono">${meta||"—"}</span>`]);
    }).join("") || tr([`<span class="muted">—</span>`,`<span class="muted">No logs</span>`,`—`,`—`]);

    showMsg("ok","Telegram logs loaded.");
  }

  // ---------- Hero setup ----------
  function setupHero(){
    // tags
    const tags = (root.dataset.heroTags || "").split(",").map(s=>s.trim()).filter(Boolean);
    tags.slice(0,4).forEach((t,i)=>{
      const el = $("#tag-"+(i+1));
      if(el) el.textContent = t;
    });

    // optional faces via dataset (comma separated URLs)
    // example: data-hero-faces="url1,url2,url3,url4"
    const faces = (root.dataset.heroFaces || "").split(",").map(s=>s.trim()).filter(Boolean);
    faces.slice(0,4).forEach((u,i)=>{
      const img = $("#face-"+(i+1));
      if(img) img.src = u;
    });

    // optional logo src
    const logoSrc = (root.dataset.logoSrc || "").trim();
    if(logoSrc){
      const logoBox = root.querySelector(".logo");
      if(logoBox){
        logoBox.innerHTML = `<img alt="MMD" src="${esc(logoSrc)}">`;
      }
    }else{
      // render minimal gold monogram placeholder
      const logoBox = root.querySelector(".logo");
      if(logoBox){
        logoBox.innerHTML = `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:900;color:rgba(215,181,109,.92);letter-spacing:.5px;">MMD</div>`;
      }
    }
  }

  // ---------- Buttons ----------
  function bindButtons(ms){
    btnRefresh.addEventListener("click", ()=>{
      if(!state.ready) return;
      if(state.currentView === "dashboard") loadDashboard().catch(showApiErr);
      if(state.currentView === "members") loadMembers().catch(showApiErr);
      if(state.currentView === "models") loadModels().catch(showApiErr);
      if(state.currentView === "telegram") loadTelegram().catch(showApiErr);
    });

    btnSignout.addEventListener("click", async ()=>{
      try{
        if(ms && typeof ms.logout === "function"){
          await ms.logout();
          location.reload();
          return;
        }
      }catch(_){}
      // fallback: hard reload
      location.href = "/";
    });

    if(btnMemSearch){
      btnMemSearch.addEventListener("click", ()=> loadMembers().catch(showApiErr));
    }
    if(memQuery){
      memQuery.addEventListener("keydown", (e)=>{
        if(e.key === "Enter") loadMembers().catch(showApiErr);
      });
    }

    if(btnModelsRefresh){
      btnModelsRefresh.addEventListener("click", ()=> loadModels().catch(showApiErr));
    }
    if(btnTgRefresh){
      btnTgRefresh.addEventListener("click", ()=> loadTelegram().catch(showApiErr));
    }

    btnApiSave.addEventListener("click", ()=>{
      const next = (apiBaseInput.value || "").trim();
      try{ localStorage.setItem(LS_API_BASE, next); }catch(_){}
      setApiBase(next);
      showMsg("ok","Saved API base.");
    });

    btnApiReset.addEventListener("click", ()=>{
      try{ localStorage.removeItem(LS_API_BASE); }catch(_){}
      setApiBase(DEFAULT_API_BASE);
      showMsg("ok","Reset API base to default.");
    });
  }

  // ---------- Boot ----------
  async function boot(){
    // forced bilingual labels (if dict exists; otherwise keeps fallback text)
    applyForcedI18n();

    // set default content lang = TH (store both keys for your global i18n engine)
    try{
      localStorage.setItem("mmd_lang", "th");
      localStorage.setItem("lang", "th");
    }catch(_){}
    langText.textContent = "th";

    requiredRoleText.textContent = state.requiredRole;
    setApiBase(getApiBase());
    setupHero();
    bindNav();
    setView("dashboard");

    // Memberstack
    let ms;
    try{
      ms = await getMemberstack();
    }catch(_){
      setPill(pillAuth, false);
      authState.textContent = "No Memberstack";
      tokenStateText.textContent = "missing";
      showMsg("error","Memberstack not ready. Ensure Memberstack is installed on this page and member is signed in.");
      return;
    }

    // Read member
    let member;
    try{
      member = await ms.getCurrentMember();
      // some MS builds return { data: {...} }
      state.member = member;
    }catch(err){
      setPill(pillAuth, false);
      authState.textContent = "Not signed in";
      showMsg("blocked","Please sign in to access Internal Admin.");
      return;
    }

    const memberId = extractMemberId(member);
    const email = extractEmail(member);
    memberIdText.textContent = memberId ? (memberId + (email ? (" • " + email) : "")) : (email || "—");

    // Token
    state.token = await getToken(ms);
    tokenStateText.textContent = state.token ? "ok" : "missing";

    // Role check
    state.role = normalizeRole(deriveRole(member));
    roleState.textContent = state.role || "—";

    const roleOk = (state.role && state.role === state.requiredRole);
    setPill(pillRole, roleOk);

    if(!state.token){
      setPill(pillAuth, false);
      authState.textContent = "Token missing";
      showMsg("error","Missing bearer token from Memberstack. Add/enable a token method (getToken/getAccessToken) or expose a valid token for internal admin API.");
      return;
    }

    setPill(pillAuth, true);
    authState.textContent = "OK";

    if(!roleOk){
      setPill(pillAuth, true); // auth ok but blocked by role
      showMsg("blocked", `Role "${state.role || "—"}" is not allowed. Required: "${state.requiredRole}".`);
      return;
    }

    state.ready = true;
    showMsg("ok","Authenticated. Loading dashboard…");

    // initial loads
    await loadDashboard();
  }

  boot().catch(err=>{
    showMsg("error", err?.message || "Boot error");
  });

})();
