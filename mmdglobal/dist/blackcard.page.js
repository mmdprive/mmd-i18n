/* =========================================
   MMD PRIVÉ — BLACKCARD (v2025-LOCK-01)
   - intent aware: ?intent=... OR localStorage mmd_intent
   - exposes: body[data-intent="..."]
   - optional: scroll to apply section
   ========================================= */

(function () {
  "use strict";

  const ROOT = document.getElementById("mmd-blackcard") || document.querySelector("[data-page='blackcard']") || document.body;

  function getIntent() {
    const qs = new URLSearchParams(location.search);
    const qIntent = (qs.get("intent") || "").trim();
    if (qIntent) return qIntent;
    try { return (localStorage.getItem("mmd_intent") || "").trim(); } catch (_) {}
    return "";
  }

  function clearIntent() {
    try { localStorage.removeItem("mmd_intent"); } catch (_) {}
  }

  function setIntentAttr(intent) {
    if (!intent) return;
    // put it on body for global CSS hooks
    document.body.setAttribute("data-intent", intent);
    // and on root (optional)
    if (ROOT && ROOT !== document.body) ROOT.setAttribute("data-intent", intent);
  }

  function applyIntent(intent) {
    if (!intent) return;

    setIntentAttr(intent);

    // If coming from membership intent, you may want to auto-focus apply section
    // You can tag your apply section with id="apply" or data-section="apply"
    const applySection =
      document.querySelector("#apply") ||
      document.querySelector("[data-section='apply']") ||
      document.querySelector("#blackcard-apply") ||
      null;

    // Example: if join_blackcard, scroll to apply section
    if (intent === "join_blackcard" && applySection) {
      applySection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // OPTIONAL: If you have an "Apply Now" button you want to highlight
    // const cta = document.querySelector("[data-blackcard-cta], #blackcardCta");
    // if (cta) cta.classList.add("is-intent");
  }

  function boot() {
    const intent = getIntent();
    if (!intent) return;
    applyIntent(intent);
    clearIntent(); // clear to avoid sticky behavior
  }

  if (document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot, { once: true });
})();
