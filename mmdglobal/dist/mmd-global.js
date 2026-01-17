/* =========================================================
   MMD • GLOBAL JS (Single File) — v2026-LOCK-02
   File: mmdglobal/dist/mmd-global.js
   RULES (LOCK):
   1) JS Global = 1 file only
   2) No inline duplicate bootstrap, no fork logic
   3) All pages must call via MMD.* only
   4) Behavior changes => change mmd-global.js only
   ========================================================= */
(function () {
  "use strict";

  // ---- LOCK ----
  window.MMD_LOCK = window.MMD_LOCK || "v2026-LOCK-02";

  // ---- Prevent double bootstrap ----
  if (window.__MMD_GLOBAL_BOOTSTRAPPED__) return;
  window.__MMD_GLOBAL_BOOTSTRAPPED__ = true;

  // ---- Namespace ----
  window.MMD = window.MMD || {};

  // ---- Env ----
  (function initEnv() {
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
    try {
      fn();
    } catch (e) {
      if (MMD.env && MMD.env.debug) console.warn("[MMD] once error:", key, e);
    }
  };

  // ---- Event bus ----
  MMD.emit = function (name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
    } catch (_) {}
  };
  MMD.on = function (name, handler, opts) {
    window.addEventListener(name, handler, opts || false);
  };

  // ---- Lang ----
  function normalizeLang(l) {
    const s = String(l || "").toLowerCase().trim();
    if (s.startsWith("th")) return "th";
    if (s.startsWith("zh")) return "zh";
    if (s.startsWith("jp") || s.startsWith("ja")) return "jp";
    return "en";
  }

  function getLang() {
    let v = "en";
    try {
      v =
        localStorage.getItem("mmd_lang") ||
        localStorage.getItem("lang") ||
        document.documentElement.getAttribute("lang") ||
        (navigator.language || "en");
    } catch (_) {}
    return normalizeLang(v);
  }

  function setLang(lang) {
    const L = normalizeLang(lang);
    try {
      localStorage.setItem("mmd_lang", L);
      localStorage.setItem("lang", L);
    } catch (_) {}
    try {
      document.documentElement.setAttribute("lang", L);
    } catch (_) {}
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
    } catch (_) {}
  };

  // ---- API base ----
  MMD.api = MMD.api || {};
  MMD.api.base = MMD.api.base || "https://telegram.malemodel-bkk.workers.dev";

  // ---- Confirm Key (ONLY for /confirm/*; NO hardcode in Head) ----
  function getConfirmKey() {
    try {
      return (
        window.MMD_CONFIRM_KEY ||
        localStorage.getItem("mmd_confirm_key") ||
        ""
      )
        .toString()
        .trim();
    } catch (_) {
      return (window.MMD_CONFIRM_KEY || "").toString().trim();
    }
  }

  function isConfirmPage() {
    try {
      return location.pathname.startsWith("/confirm/");
    } catch (_) {
      return false;
    }
  }

  // ---- Worker helper ----
  // NOTE: /pay/* should call "/v1/payments/notify" (not root)
  MMD.workerPost = async function (path, payload, extraHeaders) {
    const url =
      String(MMD.api.base || "").replace(/\/$/, "") + String(path || "");
    const headers = Object.assign(
      { "Content-Type": "application/json" },
      extraHeaders || {}
    );

    // attach confirm key ONLY on /confirm/*
    if (isConfirmPage()) {
      const key = getConfirmKey();
      if (key && !headers["X-Confirm-Key"]) headers["X-Confirm-Key"] = key;
    }

    const res = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(payload || {}),
    });

    const text = await res.text().catch(() => "");
    let json = null;
    try {
      json = JSON.parse(text);
    } catch (_) {}

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
    MMD.emit("mmd:lang", { lang: getLang() });

    if (window.MMD_KILL_PARTICLES === true) {
      MMD.ui.killParticles();
      try {
        new MutationObserver(MMD.ui.killParticles).observe(
          document.documentElement,
          { childList: true, subtree: true }
        );
      } catch (_) {}
    }
  });
})();
