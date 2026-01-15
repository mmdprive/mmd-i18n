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
    "https://cdn.prod.website-files.com/68f879d546d2f4e2ab186e90/69689c8
