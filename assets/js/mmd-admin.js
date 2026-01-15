/* =========================================================
   MMD Privé — Internal Admin JS (LOCK v2026-01-15)
   - Calls Worker admin endpoints:
     GET  /v1/admin/config
     GET  /v1/admin/metrics
     GET  /v1/admin/member?email=...
     POST /v1/admin/telegram/invite
   - Auth: Memberstack access token -> Authorization: Bearer <token>
   - Server verifies token + permissions (recommended by Memberstack)
========================================================= */

(function () {
  "use strict";

  const root = document.getElementById("mmd-admin");
  if (!root) return;
  if (window.__MMD_ADMIN_LOCKED__) return;
  window.__MMD_ADMIN_LOCKED__ = true;

  const LS_API_BASE = "mmd_admin_api_base";

  const $ = (id) => document.getElementById(id);

  const elAuthState = $("mmd-auth-state");
  const elPermState = $("mmd-perm-state");
  const elApiBaseText = $("mmd-api-base-text");

  const kpiMembers = $("kpi-members");
  const kpiPayments = $("kpi-payments");
  const kpiLedger = $("kpi-ledger");
  const dashStatus = $("dash-status");

  const memEmail = $("mem-email");
  const memStatus = $("mem-status");
  const memResult = $("mem-result");

  const tgUserId = $("tg-user-id");
  const tgTier = $("tg-tier");
  const tgNote = $("tg-note");
  const tgStatus = $("tg-status");

  const btnRefresh = $("mmd-btn-refresh");
  const btnSignout = $("mmd-btn-signout");
  const btnMemLookup = $("btn-mem-lookup");
  const btnTgInvite = $("btn-tg-invite");

  // ---------------------------
  // API Base (override-able)
  // ---------------------------
  function getApiBase() {
    const fromData = String(root.getAttribute("data-api-base") || "").trim();
    let base = fromData || "https://telegram.malemodel-bkk.workers.dev";
    try {
      const ov = String(localStorage.getItem(LS_API_BASE) || "").trim();
      if (ov) base = ov;
    } catch (_) {}
    return base.replace(/\/+$/, "");
  }

  function setStatus(el, msg, kind) {
    if (!el) return;
    el.textContent = String(msg || "—");
    el.classList.remove("ok", "bad");
    if (kind) el.classList.add(kind);
  }

  // ---------------------------
  // Memberstack token retrieval
  // (best-effort; supports cookie mode + localStorage)
  // ---------------------------
  function readCookie(name) {
    const all = document.cookie || "";
    const m = all.match(new RegExp("(^|;\\s*)" + name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "=([^;]+)"));
    return m ? decodeURIComponent(m[2]) : "";
  }

  function looksLikeJwt(s) {
    const v = String(s || "").trim();
    const parts = v.split(".");
    return parts.length === 3 && parts[0].length > 10 && parts[1].length > 10;
  }

  function tryLocalStorageToken() {
    try {
      const keys = [
        "_ms-mid",
        "ms-mid",
        "ms_mid",
        "memberstack:token",
        "memberstack_token",
        "accessToken",
      ];
      for (const k of keys) {
        const v = localStorage.getItem(k);
        if (looksLikeJwt(v)) return v;
      }

      // fallback: scan all keys for a JWT-like value
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        const v = localStorage.getItem(k);
        if (looksLikeJwt(v)) return v;
      }
    } catch (_) {}
    return "";
  }

  async function getMemberstackToken() {
    // 1) cookie mode (_ms-mid)
    const c = readCookie("_ms-mid");
    if (looksLikeJwt(c)) return c;

    // 2) Memberstack DOM helper (if available; may return cookie string/object depending on version)
    try {
      const ms = window.$memberstackDom;
      if (ms && typeof ms.getMemberCookie === "function") {
        const out = await ms.getMemberCookie();
        if (typeof out === "string") {
          // sometimes returns cookie header-like string
          const m = String(out).match(/_ms-mid=([^;]+)/);
          if (m && looksLikeJwt(m[1])) return m[1];
          if (looksLikeJwt(out)) return out;
        } else if (out && typeof out === "object") {
          // best-effort: some builds may expose { token } or { accessToken }
          if (looksLikeJwt(out.token)) return out.token;
          if (looksLikeJwt(out.accessToken)) return out.accessToken;
        }
      }
    } catch (_) {}

    // 3) localStorage mode
    const ls = tryLocalStorageToken();
    if (looksLikeJwt(ls)) return ls;

    return "";
  }

  // ---------------------------
  // Memberstack member + permission display (client-side hint only)
  // (server still enforces permissions)
  // ---------------------------
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
    // Memberstack often returns { data: { permissions: [] } }
    const perms =
      member?.data?.permissions ||
      member?.permissions ||
      [];
    return Array.isArray(perms) ? perms.map(String) : [];
  }

  // ---------------------------
  // API wrapper
  // ---------------------------
  async function apiFetch(path, opts) {
    const base = getApiBase();
    const token = await getMemberstackToken();
    if (!token) throw new Error("Missing Memberstack token (enable cookie mode or ensure auth is loaded)");

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
      const msg = typeof payload === "string"
