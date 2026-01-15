/* =========================================================
   MMD Privé — Internal Admin JS (LOCK v2026-01-15b)
   Updates:
   - Hero background uses HIRO image (FULL, contain)
   - Robust token retrieval (cookie + memberstackDom + localStorage scan)
   - View routing + buttons + API calls (Bearer)
========================================================= */

(function () {
  "use strict";

  const root = document.getElementById("mmd-admin");
  if (!root) return;
  if (window.__MMD_INTERNAL_ADMIN_LOCK__) return;
  window.__MMD_INTERNAL_ADMIN_LOCK__ = true;

  // ---------------------------
  // Constants
  // ---------------------------
  const DEFAULT_API_BASE = "https://telegram.malemodel-bkk.workers.dev";
  const LS_API_BASE = "mmd_admin_api_base";

  // HIRO full background image (your URL)
  const HIRO_BG =
    "https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/69689c883d85e7d17271524d_ChatGPT%20Image%2015%20%E0%B8%A1.%E0%B8%84.%202569%2014_50_45.png";

  // Admin endpoints (server must implement + verify token)
  const EP = {
    config:  "/v1/admin/config",
    metrics: "/v1/admin/metrics",
    member:  "/v1/admin/member", // ?email=
    tgInvite:"/v1/admin/telegram/invite"
  };

  // ---------------------------
  // DOM
  // ---------------------------
  const $ = (id) => document.getElementById(id);

  const elAuthState = $("mmd-auth-state");
  const elPermState = $("mmd-perm-state");
  const elApiBaseText = $("mmd-api-base-text");

  const btnRefresh = $("mmd-btn-refresh");
  const btnSignout = $("mmd-btn-signout");

  const kpiMembers = $("kpi-members");
  const kpiPayments = $("kpi-payments");
  const kpiLedger = $("kpi-ledger");
  const dashStatus = $("dash-status");

  const memEmail = $("mem-email");
  const btnMemLookup = $("btn-mem-lookup");
  const memStatus = $("mem-status");
  const memResult = $("mem-result");

  const tgUserId = $("tg-user-id");
  const tgTier = $("tg-tier");
  const tgNote = $("tg-note");
  const btnTgInvite = $("btn-tg-invite");
  const tgStatus = $("tg-status");

  // Views
  const navBtns = Array.from(root.querySelectorAll(".navbtn"));
  const views = {
    dashboard: root.querySelector("#view-dashboard"),
    members: root.querySelector("#view-members"),
    telegram: root.querySelector("#view-telegram"),
  };

  // ---------------------------
  // Utils
  // ---------------------------
  function setStatus(el, msg, kind) {
    if (!el) return;
    el.textContent = String(msg || "—");
    el.classList.remove("ok", "bad");
    if (kind) el.classList.add(kind);
  }

  function getApiBase() {
    let base = String(root.getAttribute("data-api-base") || "").trim() || DEFAULT_API_BASE;
    try {
      const ov = String(localStorage.getItem(LS_API_BASE) || "").trim();
      if (ov) base = ov;
    } catch (_) {}
    return base.replace(/\/+$/, "");
  }

  function readCookie(name) {
    const all = document.cookie || "";
    const m = all.match(new RegExp("(^|;\\s*)" + name.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&") + "=([^;]+)"));
    return m ? decodeURIComponent(m[2]) : "";
  }

  function looksLikeJwt(s) {
    const v = String(s || "").trim();
    const parts = v.split(".");
    return parts.length === 3 && parts[0].length > 10 && parts[1].length > 10;
  }

  function tryLocalStorageToken() {
    try {
      // common keys (best-effort)
      const keys = ["_ms-mid", "ms-mid", "memberstack:token", "memberstack_token", "accessToken"];
      for (const k of keys) {
        const v = localStorage.getItem(k);
        if (looksLikeJwt(v)) return v;
      }
      // scan all keys for JWT-like
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const v = localStorage.getItem(k);
        if (looksLikeJwt(v)) return v;
      }
    } catch (_) {}
    return "";
  }

  async function getMemberstackToken() {
    // 1) cookie mode
    const c = readCookie("_ms-mid");
    if (looksLikeJwt(c)) return c;

    // 2) memberstack dom helper
    try {
      const ms = window.$memberstackDom;
      if (ms && typeof ms.getMemberCookie === "function") {
        const out = await ms.getMemberCookie();
        if (typeof out === "string") {
          const m = out.match(/_ms-mid=([^;]+)/);
          if (m && looksLikeJwt(m[1])) return m[1];
          if (looksLikeJwt(out)) return out;
        } else if (out && typeof out === "object") {
          if (looksLikeJwt(out.token)) return out.token;
          if (looksLikeJwt(out.accessToken)) return out.accessToken;
        }
      }
    } catch (_) {}

    // 3) localStorage
    const ls = tryLocalStorageToken();
    if (looksLikeJwt(ls)) return ls;

    return "";
  }

  async function getCurrentMemberSafe() {
    const ms = window.$memberstackDom;
    if (!ms || typeof ms.getCurrentMember !== "function") return null;
    try {
      return await ms.getCurrentMember();
    } catch {
      return null;
    }
  }

  function extractPermissions(member) {
    const perms = member?.data?.permissions || member?.permissions || [];
    return Array.isArray(perms) ? perms.map(String) : [];
  }

  async function apiFetch(path, opts) {
    const base = getApiBase();
    const token = await getMemberstackToken();
    if (!token) throw new Error("Missing Memberstack token (auth not ready / not signed in)");

    const url = base + path;
    const headers = Object.assign(
      {
        "content-type": "application/json",
        "authorization": "Bearer " + token,
      },
      (opts && opts.headers) || {}
    );

    const res = await fetch(url, Object.assign({}, opts || {}, { headers }));
    const ct = res.headers.get("content-type") || "";
    const payload = ct.includes("application/json")
      ? await res.json().catch(() => null)
      : await res.text().catch(() => "");

    if (!res.ok) {
      const msg = typeof payload === "string" ? payload : (payload?.error || payload?.message || JSON.stringify(payload));
      throw new Error(`HTTP ${res.status}: ${msg}`);
    }
    return payload;
  }

  function setView(name) {
    navBtns.forEach((b) => b.classList.toggle("active", b.getAttribute("data-view") === name));
    Object.keys(views).forEach((k) => {
      if (views[k]) views[k].classList.toggle("active", k === name);
    });
  }

  // ---------------------------
  // HERO: Apply Hiro background (FULL image)
  // ---------------------------
  function applyHeroBackground() {
    const hero = root.querySelector(".hero");
    if (!hero) return;
    hero.style.setProperty("--hiro-bg", `url("${HIRO_BG}")`);
  }

  // ---------------------------
  // Loaders
  // ---------------------------
  async function loadMetrics() {
    setStatus(dashStatus, "Loading…", "");
    const data = await apiFetch(EP.metrics, { method: "GET" });

    // expected shape (server-side)
    // { members_total, payments_total, points_ledger_total }
    kpiMembers.textContent = String(data?.members_total ?? "—");
    kpiPayments.textContent = String(data?.payments_total ?? "—");
    kpiLedger.textContent = String(data?.points_ledger_total ?? "—");

    setStatus(dashStatus, "OK", "ok");
  }

  async function lookupMember() {
    const email = String(memEmail?.value || "").trim();
    if (!email) {
      setStatus(memStatus, "Please enter email", "bad");
      return;
    }
    setStatus(memStatus, "Searching…", "");
    memResult.textContent = "";

    const qs = new URLSearchParams({ email });
    const data = await apiFetch(`${EP.member}?${qs.toString()}`, { method: "GET" });

    memResult.textContent = JSON.stringify(data, null, 2);
    setStatus(memStatus, "OK", "ok");
  }

  async function sendInvite() {
    const telegram_user_id = String(tgUserId?.value || "").trim();
    const tier = String(tgTier?.value || "").trim();
    const note = String(tgNote?.value || "").trim();

    if (!telegram_user_id || !/^\d+$/.test(telegram_user_id)) {
      setStatus(tgStatus, "telegram_user_id must be numeric", "bad");
      return;
    }

    setStatus(tgStatus, "Sending…", "");
    const body = { telegram_user_id: Number(telegram_user_id), tier, note };

    const data = await apiFetch(EP.tgInvite, { method: "POST", body: JSON.stringify(body) });
    setStatus(tgStatus, data?.ok ? "OK" : "Sent (check server response)", data?.ok ? "ok" : "");
  }

  // ---------------------------
  // Boot
  // ---------------------------
  async function boot() {
    applyHeroBackground();

    const base = getApiBase();
    if (elApiBaseText) elApiBaseText.textContent = base;

    // client-side hint for auth/perm (server still enforces)
    setStatus(elAuthState, "Checking…", "");
    setStatus(elPermState, "—", "");

    const token = await getMemberstackToken();
    if (!token) {
      setStatus(elAuthState, "No token", "bad");
      setStatus(elPermState, "blocked", "bad");
      return;
    }

    setStatus(elAuthState, "OK", "ok");

    const member = await getCurrentMemberSafe();
    const perms = extractPermissions(member);

    // show permission hint (you can change policy server-side)
    if (perms.length) {
      // prefer owner/admin markers
      const top = perms.find(p => /owner|admin/i.test(p)) || perms[0];
      setStatus(elPermState, top, "ok");
    } else {
      setStatus(elPermState, "unknown", "");
    }

    // default view load
    await loadMetrics().catch((e) => setStatus(dashStatus, e.message, "bad"));
  }

  // ---------------------------
  // Events
  // ---------------------------
  navBtns.forEach((b) => {
    b.addEventListener("click", () => {
      const v = b.getAttribute("data-view") || "dashboard";
      setView(v);
    });
  });

  if (btnRefresh) {
    btnRefresh.addEventListener("click", () => {
      const current = navBtns.find(b => b.classList.contains("active"))?.getAttribute("data-view") || "dashboard";
      if (current === "dashboard") loadMetrics().catch((e) => setStatus(dashStatus, e.message, "bad"));
    });
  }

  if (btnMemLookup) btnMemLookup.addEventListener("click", () => lookupMember().catch((e) => setStatus(memStatus, e.message, "bad")));
  if (btnTgInvite) btnTgInvite.addEventListener("click", () => sendInvite().catch((e) => setStatus(tgStatus, e.message, "bad")));

  if (btnSignout) {
    btnSignout.addEventListener("click", async () => {
      try {
        if (window.$memberstackDom && typeof window.$memberstackDom.logout === "function") {
          await window.$memberstackDom.logout();
        }
      } catch (_) {}
      location.href = "/";
    });
  }

  setView("dashboard");
  boot().catch((e) => {
    setStatus(elAuthState, "Error", "bad");
    setStatus(elPermState, e.message, "bad");
  });

})();
