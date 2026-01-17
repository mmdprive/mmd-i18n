<!-- =========================
     MMD • GLOBAL BOOTSTRAP (Head) — LOCK v2026-LOCK-01
     วางใน: Webflow > Project Settings > Custom Code > Head
========================= -->
<script>
/* =========================================================
   MMD • GLOBAL BOOTSTRAP — LOCK v2026-LOCK-01
   - Namespace + once/onReady/event bus
   - Lang getter/setter (mmd_lang + lang)
   - Optional particle killer (window.MMD_KILL_PARTICLES = true)
   - Worker helper (POST) + Confirm key header
   ========================================================= */
(function () {
  "use strict";

  // ---- LOCK ----
  window.MMD_LOCK = "v2026-LOCK-01";

  // ---- Prevent double bootstrap ----
  if (window.__MMD_GLOBAL_BOOTSTRAPPED__) return;
  window.__MMD_GLOBAL_BOOTSTRAPPED__ = true;

  // ---- Namespace ----
  window.MMD = window.MMD || {};

  // ---- Env ----
  (function initEnv(){
    const qs = new URLSearchParams(window.location.search);
    const debug = qs.has("debug");
    MMD.env = Object.assign({ debug }, MMD.env || {});
  })();

  // ---- Ready helper ----
  MMD.onReady = function (fn) {
    if (typeof fn !== "function") return;
    if (document.readyState !== "loading") fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  };

  // ---- Once helper ----
  const __once = new Set();
  MMD.once = function (key, fn) {
    if (!key || typeof fn !== "function") return;
    if (__once.has(key)) return;
    __once.add(key);
    try { fn(); } catch (e) {
      if (MMD.env && MMD.env.debug) console.warn("[MMD] once error:", key, e);
    }
  };

  // ---- Event bus ----
  MMD.emit = function (name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
    } catch (e) {
      // IE fallback not needed in modern Webflow contexts; keep silent
    }
  };
  MMD.on = function (name, handler, opts) {
    window.addEventListener(name, handler, opts || false);
  };

  // ---- Lang ----
  function normalizeLang(l){
    const s = String(l || "").toLowerCase().trim();
    if (s.startsWith("th")) return "th";
    if (s.startsWith("zh")) return "zh";
    if (s.startsWith("jp") || s.startsWith("ja")) return "jp";
    return "en";
  }

  function getLang(){
    let v = "en";
    try {
      v =
        localStorage.getItem("mmd_lang") ||
        localStorage.getItem("lang") ||
        document.documentElement.getAttribute("lang") ||
        (navigator.language || "en");
    } catch (_){}
    return normalizeLang(v);
  }

  function setLang(lang){
    const L = normalizeLang(lang);
    try {
      localStorage.setItem("mmd_lang", L);
      localStorage.setItem("lang", L);
    } catch (_){}
    try { document.documentElement.setAttribute("lang", L); } catch (_){}
    MMD.emit("mmd:lang", { lang: L });
    return L;
  }

  MMD.lang = MMD.lang || { get: getLang, set: setLang };

  // ---- UI helpers ----
  MMD.ui = MMD.ui || {};
  const PARTICLE_SELECTOR =
    "canvas#gold-particles, #gold-particles, canvas[id*='particle' i], canvas[class*='particle' i]";

  MMD.ui.killParticles = function () {
    try {
      document.querySelectorAll(PARTICLE_SELECTOR).forEach((el) => el.remove());
    } catch (_){}
  };

  // ---- Confirm key (global) ----
  // ตั้งค่าใน Head ได้เลย เช่น: window.MMD_CONFIRM_KEY="xxx";
  // หรือปล่อยไว้ แล้วไปตั้งในหน้า /confirm/* ก็ได้
  window.MMD_CONFIRM_KEY = window.MMD_CONFIRM_KEY || "PUT_YOUR_CONFIRM_KEY_HERE";

  // ---- Worker helper ----
  // IMPORTANT: endpoint ใหม่สำหรับ /pay/* คือ /v1/payments/notify (ไม่ยิง root)
  MMD.api = MMD.api || {};
  MMD.api.base = MMD.api.base || "https://telegram.malemodel-bkk.workers.dev";

  MMD.workerPost = async function (path, payload, extraHeaders) {
    const url = String(MMD.api.base || "").replace(/\/$/, "") + String(path || "");
    const headers = Object.assign(
      { "Content-Type": "application/json" },
      extraHeaders || {}
    );

    // attach confirm key if present
    if (window.MMD_CONFIRM_KEY && !headers["X-Confirm-Key"]) {
      headers["X-Confirm-Key"] = window.MMD_CONFIRM_KEY;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload || {})
    });

    const text = await res.text().catch(() => "");
    let json = null;
    try { json = JSON.parse(text); } catch (_){}

    if (!res.ok) {
      const err = new Error("MMD_WORKER_POST_FAILED " + res.status);
      err.status = res.status;
      err.body = json || text;
      throw err;
    }

    return json || { ok: true, raw: text };
  };

  // ---- DOM ready boot ----
  MMD.onReady(function () {
    document.documentElement.classList.add("mmd-ready");

    // emit current lang once on boot
    MMD.emit("mmd:lang", { lang: getLang() });

    // optional: kill particles globally
    if (window.MMD_KILL_PARTICLES === true) {
      MMD.ui.killParticles();
      try {
        new MutationObserver(MMD.ui.killParticles).observe(document.documentElement, {
          childList: true,
          subtree: true
        });
      } catch (_){}
    }
  });

})();
</script>
