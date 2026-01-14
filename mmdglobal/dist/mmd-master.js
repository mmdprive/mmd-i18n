/* =========================================
   mmd-master.js — MMD Privé Global Bootstrap (v2026-LOCK-01)
   Purpose:
   - Global bootstrap for ALL Webflow pages (Privé system)
   - Detect user role/tier (Memberstack + overrides)
   - Maintain status (active/expired/trial) via optional expire_at
   - Apply UI gating (role + entitlement)
   - Provide i18n core (v1.6 LOCK behavior) + convenient helpers

   Assumptions:
   - Dict is loaded BEFORE this file (recommended):
       window.I18N_DICT = { th:{...}, en:{...}, zh:{...}, ja:{...} }
     (Or compatibility: window.I18N_DICT[key][lang])
   - Memberstack is installed on the site.
   - No secrets are embedded here. Any privileged “Tables” reads must be done via your server/Worker.

   Key DOM conventions supported:
   - Role enforcement (per-page):
       <html data-force-role="standard">  (or on body)
   - Language:
       Buttons: [data-set-lang="th|en|zh|ja"] or .mmd-lang-btn[data-set-lang=...]
   - i18n bindings:
       [data-i18n="key"] / [data-i18n-text="key"] / [data-i18n-html="key"] etc.
   - Gating:
       [data-mmd-role-min="premium"]                      // min role
       [data-mmd-role-any="standard,premium,vip"]         // allow list
       [data-mmd-entitlement="drive.premium"]             // entitlement
       [data-mmd-hide-when-expired="true"]                // hide if expired
       [data-mmd-show-when-expired="true"]                // show only if expired
========================================= */
(function () {
  "use strict";

  /* =========================
     0) CONFIG (SAFE DEFAULTS)
  ========================= */
  const CONFIG = {
    // Storage keys
    storageLangA: "mmd_lang",
    storageLangB: "lang",
    storageRole: "mmd_role",
    storageStatus: "mmd_status",

    // Supported languages
    langs: ["th", "en", "zh", "ja"],

    // Role order (low -> high)
    roleOrder: ["guest", "standard", "premium", "vip", "svip", "blackcard"],

    // Querystring overrides (optional)
    qsLangKey: "lang",
    qsRoleKey: "role",
    qsDebugKey: "debug",

    // Debug
    debug: false,

    // Optional: connect to your Worker to enrich profile (tier/expire_at/telegram_id)
    // IMPORTANT: This endpoint must be public-safe and should validate origin/session server-side.
    profileEndpoint: "", // e.g. "https://api.yourdomain.com/mmd/profile"

    // Optional: mapping plan IDs (or plan names) -> roles (if you want hard mapping)
    planIdToRole: {
      // "pln_xxx_standard": "standard",
      // "pln_xxx_premium": "premium",
      // "pln_xxx_vip": "vip",
      // "pln_xxx_blackcard": "blackcard",
    },

    // Entitlement rules (can be overridden at runtime)
    // You can use these keys in DOM: data-mmd-entitlement="drive.standard"
    entitlements: {
      // Drive access requires ACTIVE membership (your business rule)
      "drive.standard": (ctx) => ctx.roleAtLeast("standard") && ctx.status === "active",
      "drive.premium": (ctx) => ctx.roleAtLeast("premium") && ctx.status === "active",
      "drive.vip": (ctx) => ctx.roleAtLeast("vip") && ctx.status === "active",
      "drive.svip": (ctx) => ctx.roleAtLeast("svip") && ctx.status === "active",
      "drive.blackcard": (ctx) => ctx.roleAtLeast("blackcard") && ctx.status === "active",

      // Telegram groups:
      // - Standard: even if expired, they may remain (your “renew-only bot” concept)
      // - Premium/VIP/SVIP/Blackcard: expired -> should be kicked, so require active
      "tg.standard": (ctx) => ctx.roleAtLeast("standard"),
      "tg.premium": (ctx) => ctx.roleAtLeast("premium") && ctx.status === "active",
      "tg.vip": (ctx) => ctx.roleAtLeast("vip") && ctx.status === "active",
      "tg.svip": (ctx) => ctx.roleAtLeast("svip") && ctx.status === "active",
      "tg.blackcard": (ctx) => ctx.roleAtLeast("blackcard") && ctx.status === "active",
    },

    // If a user was premium/vip/svip and expires, web UI can optionally “degrade” role for access decisions.
    // Your business rule: Premium expired still remains in TG Standard; web can treat them as standard+expired.
    degradeOnExpire: true,
    degradeMap: {
      premium: "standard",
      vip: "standard",
      svip: "standard",
      blackcard: "standard",
    },
  };

  /* =========================
     1) SMALL UTILITIES
  ========================= */
  const nowISO = () => new Date().toISOString();
  const clampStr = (v) => (v == null ? "" : String(v)).trim();
  const uniq = (arr) => Array.from(new Set(arr));

  function safeParseJSON(s) {
    try { return JSON.parse(s); } catch (_) { return null; }
  }

  function getQS(name) {
    try {
      const qs = new URLSearchParams(location.search);
      return qs.get(name);
    } catch (_) {
      return null;
    }
  }

  function setDataAttr(el, k, v) {
    if (!el) return;
    const val = clampStr(v);
    if (!val) {
      try { delete el.dataset[k]; } catch (_) {}
      return;
    }
    el.dataset[k] = val;
  }

  function getStorage(key) {
    try { return localStorage.getItem(key) || ""; } catch (_) { return ""; }
  }
  function setStorage(key, val) {
    try { localStorage.setItem(key, clampStr(val)); } catch (_) {}
  }
  function rmStorage(key) {
    try { localStorage.removeItem(key); } catch (_) {}
  }

  function onReady(fn) {
    if (document.readyState === "complete" || document.readyState === "interactive") fn();
    else document.addEventListener("DOMContentLoaded", fn, { once: true });
  }

  function log(...args) {
    if (!CONFIG.debug) return;
    // eslint-disable-next-line no-console
    console.log("[MMD]", ...args);
  }

  function warn(...args) {
    // eslint-disable-next-line no-console
    console.warn("[MMD]", ...args);
  }

  /* =========================
     2) ROLE NORMALIZATION (1:1)
        Supports: guest/standard/premium/vip/svip/blackcard
  ========================= */
  function normalizeRole(input) {
    const s = clampStr(input).toLowerCase();

    if (!s) return "guest";

    // Direct hits
    if (CONFIG.roleOrder.includes(s)) return s;

    // Common aliases
    if (["free", "anon", "anonymous", "visitor", "public"].includes(s)) return "guest";
    if (["std", "standardpkg", "standard_package", "standard-package"].includes(s)) return "standard";
    if (["pre", "prem", "premiumpkg", "premium_package", "premium-package"].includes(s)) return "premium";
    if (["v.i.p", "vipmember", "vip-package"].includes(s)) return "vip";
    if (["svip", "s-vip", "supervip"].includes(s)) return "svip";
    if (["black", "blackcard", "black-card", "black_card", "bc"].includes(s)) return "blackcard";

    // If they send something like "tier:premium"
    if (s.startsWith("tier:")) return normalizeRole(s.replace("tier:", ""));

    return "guest";
  }

  function roleIndex(role) {
    const r = normalizeRole(role);
    const idx = CONFIG.roleOrder.indexOf(r);
    return idx >= 0 ? idx : 0;
  }

  function roleAtLeast(role, minRole) {
    return roleIndex(role) >= roleIndex(minRole);
  }

  /* =========================
     3) STATUS / EXPIRY
  ========================= */
  function normalizeStatus(input) {
    const s = clampStr(input).toLowerCase();
    if (!s) return "unknown";
    if (["active", "paid", "ok", "valid"].includes(s)) return "active";
    if (["expired", "expire", "ended", "lapsed"].includes(s)) return "expired";
    if (["trial", "trialing"].includes(s)) return "trial";
    if (["canceled", "cancelled"].includes(s)) return "canceled";
    return s; // keep custom statuses if you use them
  }

  function parseDate(input) {
    const s = clampStr(input);
    if (!s) return null;
    const d = new Date(s);
    if (Number.isNaN(d.getTime())) return null;
    return d;
  }

  function computeStatusFromExpireAt(expireAt) {
    const d = parseDate(expireAt);
    if (!d) return "unknown";
    return d.getTime() > Date.now() ? "active" : "expired";
  }

  /* =========================
     4) I18N CORE (v1.6 LOCK behavior)
        - no-blank overwrite (respects data-fallback / keep existing)
        - reads/writes BOTH: mmd_lang + lang
        - supports role suffix: key.{role}
        - supports mobile suffix: key.m (when data-i18n-mobile="true")
        - dict supports:
            A) I18N_DICT[lang][key]
            B) I18N_DICT[key][lang] (compat)
        - bindings:
            [data-i18n="key"]                -> innerHTML
            [data-i18n-text="key"]           -> textContent
            [data-i18n-html="key"]           -> innerHTML
            [data-i18n-placeholder="key"]    -> placeholder
            [data-i18n-title="key"]          -> title
            [data-i18n-aria-label="key"]     -> aria-label
            [data-i18n-value="key"]          -> value
            [data-i18n-attr="attr:key"]      -> setAttribute(attr, value)
  ========================= */
  const I18N = (function () {
    function getDict() {
      return (typeof window !== "undefined" && window.I18N_DICT) ? window.I18N_DICT : null;
    }

    function getLang() {
      const qsLang = clampStr(getQS(CONFIG.qsLangKey)).toLowerCase();
      if (qsLang && CONFIG.langs.includes(qsLang)) return qsLang;

      const a = clampStr(getStorage(CONFIG.storageLangA)).toLowerCase();
      if (a && CONFIG.langs.includes(a)) return a;

      const b = clampStr(getStorage(CONFIG.storageLangB)).toLowerCase();
      if (b && CONFIG.langs.includes(b)) return b;

      return "th";
    }

    function setLang(lang) {
      const L = clampStr(lang).toLowerCase();
      if (!CONFIG.langs.includes(L)) return getLang();

      setStorage(CONFIG.storageLangA, L);
      setStorage(CONFIG.storageLangB, L);

      // Also set attribute on <html> for CSS hooks
      setDataAttr(document.documentElement, "lang", L);

      dispatch("mmd:lang", { lang: L });
      return L;
    }

    function pick(dict, lang, key) {
      if (!dict || !key) return "";

      // A) dict[lang][key]
      if (dict[lang] && Object.prototype.hasOwnProperty.call(dict[lang], key)) {
        return dict[lang][key];
      }
      // B) dict[key][lang] (compat)
      if (dict[key] && Object.prototype.hasOwnProperty.call(dict[key], lang)) {
        return dict[key][lang];
      }
      return "";
    }

    function shouldOverwrite(el, newVal) {
      const v = clampStr(newVal);
      if (!v) return false;

      // no-blank overwrite: allow overwrite always if new value is non-blank
      // but if element has data-fallback and current content exists, we still allow overwrite
      // because overwrite is controlled by new value presence.
      // (If you want “keep existing always”, put data-i18n-lock="true" and we will skip.)
      if (el && el.getAttribute && el.getAttribute("data-i18n-lock") === "true") return false;

      return true;
    }

    function applyToElement(el, type, val) {
      if (!el) return;

      if (!shouldOverwrite(el, val)) return;

      if (type === "html") el.innerHTML = val;
      else if (type === "text") el.textContent = val;
      else if (type === "placeholder") el.setAttribute("placeholder", val);
      else if (type === "title") el.setAttribute("title", val);
      else if (type === "ariaLabel") el.setAttribute("aria-label", val);
      else if (type === "value") el.value = val;
    }

    function applyAttrBinding(el, expr, val) {
      // expr format: "attr:key" => setAttribute(attr, translatedValue)
      const raw = clampStr(expr);
      const i = raw.indexOf(":");
      if (i < 1) return;
      const attr = raw.slice(0, i).trim();
      if (!attr) return;
      if (!shouldOverwrite(el, val)) return;
      el.setAttribute(attr, val);
    }

    function resolveKeyVariants(baseKey, ctx) {
      const keys = [];
      const k = clampStr(baseKey);
      if (!k) return keys;

      // role suffix
      const role = normalizeRole(ctx && ctx.role ? ctx.role : "");
      if (role && role !== "guest") keys.push(`${k}.${role}`);

      // mobile suffix (opt-in)
      const isMobile = (ctx && ctx.mobile === true) || false;
      if (isMobile) keys.push(`${k}.m`);

      // base last
      keys.push(k);
      return keys;
    }

    function t(key, ctx) {
      const dict = getDict();
      const lang = (ctx && ctx.lang) ? ctx.lang : getLang();

      const kList = resolveKeyVariants(key, ctx);
      for (const k of kList) {
        const val = pick(dict, lang, k);
        if (clampStr(val)) return val;
      }
      return "";
    }

    function apply(rootEl, ctx) {
      const root = rootEl || document;
      const dict = getDict();
      if (!dict) {
        warn("I18N_DICT not found. Load assets/i18n/i18n.dict.js before mmd-master.js");
      }

      const lang = (ctx && ctx.lang) ? ctx.lang : getLang();
      const role = (ctx && ctx.role) ? normalizeRole(ctx.role) : normalizeRole(getStorage(CONFIG.storageRole) || "guest");

      const isMobileFlag = (ctx && typeof ctx.mobile === "boolean")
        ? ctx.mobile
        : false;

      const fullCtx = { lang, role, mobile: isMobileFlag };

      // [data-i18n] -> innerHTML
      root.querySelectorAll("[data-i18n]").forEach((el) => {
        const key = el.getAttribute("data-i18n");
        const mobile = el.getAttribute("data-i18n-mobile") === "true";
        const val = t(key, { ...fullCtx, mobile });
        if (!clampStr(val)) return;

        // no-blank overwrite: optional fallback
        // if data-fallback exists and val blank, we'd keep existing. (val is non-blank here)
        applyToElement(el, "html", val);
      });

      // [data-i18n-text]
      root.querySelectorAll("[data-i18n-text]").forEach((el) => {
        const key = el.getAttribute("data-i18n-text");
        const mobile = el.getAttribute("data-i18n-mobile") === "true";
        const val = t(key, { ...fullCtx, mobile });
        if (!clampStr(val)) return;
        applyToElement(el, "text", val);
      });

      // [data-i18n-html]
      root.querySelectorAll("[data-i18n-html]").forEach((el) => {
        const key = el.getAttribute("data-i18n-html");
        const mobile = el.getAttribute("data-i18n-mobile") === "true";
        const val = t(key, { ...fullCtx, mobile });
        if (!clampStr(val)) return;
        applyToElement(el, "html", val);
      });

      // [data-i18n-placeholder]
      root.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
        const key = el.getAttribute("data-i18n-placeholder");
        const mobile = el.getAttribute("data-i18n-mobile") === "true";
        const val = t(key, { ...fullCtx, mobile });
        if (!clampStr(val)) return;
        applyToElement(el, "placeholder", val);
      });

      // [data-i18n-title]
      root.querySelectorAll("[data-i18n-title]").forEach((el) => {
        const key = el.getAttribute("data-i18n-title");
        const mobile = el.getAttribute("data-i18n-mobile") === "true";
        const val = t(key, { ...fullCtx, mobile });
        if (!clampStr(val)) return;
        applyToElement(el, "title", val);
      });

      // [data-i18n-aria-label]
      root.querySelectorAll("[data-i18n-aria-label]").forEach((el) => {
        const key = el.getAttribute("data-i18n-aria-label");
        const mobile = el.getAttribute("data-i18n-mobile") === "true";
        const val = t(key, { ...fullCtx, mobile });
        if (!clampStr(val)) return;
        applyToElement(el, "ariaLabel", val);
      });

      // [data-i18n-value]
      root.querySelectorAll("[data-i18n-value]").forEach((el) => {
        const key = el.getAttribute("data-i18n-value");
        const mobile = el.getAttribute("data-i18n-mobile") === "true";
        const val = t(key, { ...fullCtx, mobile });
        if (!clampStr(val)) return;
        applyToElement(el, "value", val);
      });

      // [data-i18n-attr="attr:key"]
      root.querySelectorAll("[data-i18n-attr]").forEach((el) => {
        const expr = el.getAttribute("data-i18n-attr");
        const raw = clampStr(expr);
        const i = raw.indexOf(":");
        if (i < 1) return;
        const key = raw.slice(i + 1).trim();
        if (!key) return;

        const mobile = el.getAttribute("data-i18n-mobile") === "true";
        const val = t(key, { ...fullCtx, mobile });
        if (!clampStr(val)) return;
        applyAttrBinding(el, raw, val);
      });

      dispatch("mmd:i18n", { lang, role });
      return { lang, role };
    }

    function wireLangButtons(rootEl) {
      const root = rootEl || document;
      const btns = root.querySelectorAll("[data-set-lang], .mmd-lang-btn[data-set-lang]");
      if (!btns || !btns.length) return;

      btns.forEach((btn) => {
        const lang = clampStr(btn.getAttribute("data-set-lang") || btn.dataset.setLang).toLowerCase();
        if (!CONFIG.langs.includes(lang)) return;

        btn.addEventListener("click", () => {
          setLang(lang);
          apply(document, { lang, role: MMD.role });
          updateLangButtonUI(document, lang);
        });
      });

      updateLangButtonUI(root, getLang());
    }

    function updateLangButtonUI(rootEl, lang) {
      const root = rootEl || document;
      const L = clampStr(lang).toLowerCase();
      root.querySelectorAll("[data-set-lang], .mmd-lang-btn[data-set-lang]").forEach((b) => {
        const bl = clampStr(b.getAttribute("data-set-lang") || b.dataset.setLang).toLowerCase();
        const active = bl === L;
        b.classList.toggle("mmd-lang-active", active);
        b.setAttribute("aria-pressed", active ? "true" : "false");
      });
    }

    return {
      getLang,
      setLang,
      t,
      apply,
      wireLangButtons,
    };
  })();

  /* =========================
     5) EVENT DISPATCH
  ========================= */
  function dispatch(name, detail) {
    try {
      window.dispatchEvent(new CustomEvent(name, { detail: detail || {} }));
    } catch (_) {}
  }

  /* =========================
     6) MEMBERSTACK INTEGRATION (ROBUST)
        Supports both patterns:
        - window.MemberStack (older)
        - window.memberstack (MS2)
  ========================= */
  async function getMemberstackMember() {
    // MS2: window.memberstack
    try {
      if (window.memberstack && typeof window.memberstack.getCurrentMember === "function") {
        const res = await window.memberstack.getCurrentMember();
        // Typical: { data: { member: {...} } }
        return res && res.data && res.data.member ? res.data.member : null;
      }
    } catch (e) {
      log("memberstack.getCurrentMember failed", e);
    }

    // Older: window.MemberStack.onReady
    try {
      if (window.MemberStack && typeof window.MemberStack.onReady === "function") {
        const ms = await window.MemberStack.onReady;
        if (ms && typeof ms.getCurrentMember === "function") {
          const res = await ms.getCurrentMember();
          return res && res.data ? res.data : null;
        }
      }
    } catch (e) {
      log("MemberStack.onReady/getCurrentMember failed", e);
    }

    return null;
  }

  function pickTierFromMember(member) {
    if (!member) return "";

    // Common places you may keep tier:
    // - member.customFields.tier
    // - member.metaData.tier
    // - member["tier"]
    // - member.planConnections or plans
    const cf = member.customFields || member.custom_fields || {};
    const md = member.metaData || member.metadata || {};

    const direct =
      clampStr(member.tier) ||
      clampStr(cf.tier) ||
      clampStr(md.tier);

    if (direct) return direct;

    // Plan-based inference (if present)
    const planConnections = member.planConnections || member.plan_connections || [];
    const plans = member.plans || [];

    // Try to map by plan ID via CONFIG.planIdToRole
    const planIds = [];
    planConnections.forEach((p) => {
      if (p && p.planId) planIds.push(p.planId);
      if (p && p.plan_id) planIds.push(p.plan_id);
    });
    plans.forEach((p) => {
      if (p && p.id) planIds.push(p.id);
      if (p && p.planId) planIds.push(p.planId);
    });

    for (const pid of uniq(planIds)) {
      if (CONFIG.planIdToRole[pid]) return CONFIG.planIdToRole[pid];
    }

    // If you have plan names exposed, you can infer by keyword
    const planNames = [];
    planConnections.forEach((p) => {
      if (p && p.planName) planNames.push(p.planName);
      if (p && p.plan_name) planNames.push(p.plan_name);
    });
    plans.forEach((p) => {
      if (p && p.name) planNames.push(p.name);
    });

    const joined = planNames.join(" ").toLowerCase();
    if (joined.includes("black")) return "blackcard";
    if (joined.includes("svip")) return "svip";
    if (joined.includes("vip")) return "vip";
    if (joined.includes("premium")) return "premium";
    if (joined.includes("standard")) return "standard";

    // If they are logged in but no tier signal => treat as guest unless you want “standard default”
    return "";
  }

  function pickExpireAtFromMember(member) {
    if (!member) return "";

    const cf = member.customFields || member.custom_fields || {};
    const md = member.metaData || member.metadata || {};

    // The screenshot shows fields like:
    // expire_at, last_payment_at, telegram_id
    // In Memberstack “member custom fields”, you might mirror these.
    return (
      clampStr(member.expire_at) ||
      clampStr(cf.expire_at) ||
      clampStr(md.expire_at) ||
      clampStr(cf.expireAt) ||
      clampStr(md.expireAt)
    );
  }

  function pickTelegramIdFromMember(member) {
    if (!member) return "";
    const cf = member.customFields || member.custom_fields || {};
    return clampStr(member.telegram_id) || clampStr(cf.telegram_id) || clampStr(cf.telegramId);
  }

  /* =========================
     7) OPTIONAL PROFILE ENRICHMENT
        If you use Memberstack Tables (Members table), you typically cannot read it
        securely from browser without server mediation. This hook supports that.
  ========================= */
  async function enrichProfileViaEndpoint(member) {
    const url = clampStr(CONFIG.profileEndpoint);
    if (!url) return null;

    // This request should be validated server-side (cookie/session/origin).
    // DO NOT put API keys in this JS.
    try {
      const res = await fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          "Accept": "application/json",
        },
      });
      if (!res.ok) return null;
      const json = await res.json();

      // Expected shape example (you can define your own):
      // {
      //   tier: "premium",
      //   status: "active",
      //   expire_at: "2026-12-31T00:00:00.000Z",
      //   telegram_id: "123456",
      //   source: "memberstack_table"
      // }
      return json && typeof json === "object" ? json : null;
    } catch (e) {
      log("profileEndpoint fetch failed", e);
      return null;
    }
  }

  /* =========================
     8) CORE STATE + HELPERS
  ========================= */
  const MMD = {
    // Runtime state
    lang: "th",
    role: "guest",
    status: "unknown",
    expireAt: "",
    member: null,
    telegramId: "",

    // Helpers
    normalizeRole,
    roleAtLeast: (minRole) => roleAtLeast(MMD.role, minRole),
    roleIndex: () => roleIndex(MMD.role),

    hasEntitlement: (name) => {
      const key = clampStr(name);
      const rule = CONFIG.entitlements[key];
      if (typeof rule !== "function") return false;
      return !!rule({
        role: MMD.role,
        status: MMD.status,
        expireAt: MMD.expireAt,
        roleAtLeast: (min) => roleAtLeast(MMD.role, min),
      });
    },

    t: (key, ctx) => I18N.t(key, {
      lang: MMD.lang,
      role: MMD.role,
      mobile: ctx && ctx.mobile === true,
    }),

    setLang: (lang) => {
      const L = I18N.setLang(lang);
      MMD.lang = L;
      I18N.apply(document, { lang: L, role: MMD.role });
      applyGating(document);
      return L;
    },

    setRole: (role) => {
      const r = normalizeRole(role);
      MMD.role = r;
      setStorage(CONFIG.storageRole, r);

      setDataAttr(document.documentElement, "userRole", r);
      setDataAttr(document.body, "userRole", r);

      dispatch("mmd:role", { role: r, status: MMD.status });
      I18N.apply(document, { lang: MMD.lang, role: r });
      applyGating(document);
      return r;
    },

    setStatus: (status, expireAt) => {
      const s = normalizeStatus(status);
      MMD.status = s;
      setStorage(CONFIG.storageStatus, s);

      if (expireAt !== undefined) {
        MMD.expireAt = clampStr(expireAt);
      }

      setDataAttr(document.documentElement, "userStatus", s);
      setDataAttr(document.body, "userStatus", s);

      if (MMD.expireAt) {
        setDataAttr(document.documentElement, "expireAt", MMD.expireAt);
        setDataAttr(document.body, "expireAt", MMD.expireAt);
      }

      dispatch("mmd:status", { status: s, expireAt: MMD.expireAt });
      applyGating(document);
      return s;
    },

    refresh: async () => {
      await bootstrapMember();
      I18N.apply(document, { lang: MMD.lang, role: MMD.role });
      applyGating(document);
    },
  };

  // expose
  window.MMD = window.MMD || MMD;

  /* =========================
     9) GATING ENGINE (ROLE + ENTITLEMENT + EXPIRY)
  ========================= */
  function applyGating(rootEl) {
    const root = rootEl || document;

    // 9.1) data-mmd-role-min
    root.querySelectorAll("[data-mmd-role-min]").forEach((el) => {
      const min = normalizeRole(el.getAttribute("data-mmd-role-min"));
      const ok = roleAtLeast(MMD.role, min);
      el.style.display = ok ? "" : "none";
    });

    // 9.2) data-mmd-role-any="standard,premium"
    root.querySelectorAll("[data-mmd-role-any]").forEach((el) => {
      const raw = clampStr(el.getAttribute("data-mmd-role-any"));
      const allow = raw.split(",").map((x) => normalizeRole(x));
      const ok = allow.includes(normalizeRole(MMD.role));
      el.style.display = ok ? "" : "none";
    });

    // 9.3) data-mmd-entitlement="drive.premium"
    root.querySelectorAll("[data-mmd-entitlement]").forEach((el) => {
      const ent = clampStr(el.getAttribute("data-mmd-entitlement"));
      const ok = MMD.hasEntitlement(ent);
      el.style.display = ok ? "" : "none";
    });

    // 9.4) expiry toggles
    root.querySelectorAll("[data-mmd-hide-when-expired='true']").forEach((el) => {
      el.style.display = (MMD.status === "expired") ? "none" : "";
    });
    root.querySelectorAll("[data-mmd-show-when-expired='true']").forEach((el) => {
      el.style.display = (MMD.status === "expired") ? "" : "none";
    });

    // 9.5) convenience body classes (optional)
    // - mmd-role-guest, mmd-role-premium, etc.
    // - mmd-status-active/expired
    try {
      const b = document.body;
      if (b) {
        CONFIG.roleOrder.forEach((r) => b.classList.toggle(`mmd-role-${r}`, MMD.role === r));
        b.classList.toggle("mmd-status-active", MMD.status === "active");
        b.classList.toggle("mmd-status-expired", MMD.status === "expired");
        b.classList.toggle("mmd-status-trial", MMD.status === "trial");
      }
    } catch (_) {}
  }

  /* =========================
     10) BOOTSTRAP ROLE/LANG FAST PATH
  ========================= */
  function detectDebug() {
    const qs = clampStr(getQS(CONFIG.qsDebugKey));
    if (qs === "1" || qs === "true") return true;
    const stored = clampStr(getStorage("mmd_debug"));
    return stored === "1" || stored === "true";
  }

  function detectForcedRole() {
    const html = document.documentElement;
    const body = document.body;

    const forced =
      clampStr((html && html.getAttribute("data-force-role")) || "") ||
      clampStr((body && body.getAttribute("data-force-role")) || "");

    return forced ? normalizeRole(forced) : "";
  }

  function detectRoleFromQS() {
    const q = clampStr(getQS(CONFIG.qsRoleKey));
    return q ? normalizeRole(q) : "";
  }

  function detectRoleFromStorage() {
    const r = clampStr(getStorage(CONFIG.storageRole));
    return r ? normalizeRole(r) : "guest";
  }

  function detectLangFast() {
    return I18N.getLang();
  }

  /* =========================
     11) MEMBER BOOTSTRAP (ASYNC)
  ========================= */
  async function bootstrapMember() {
    // 11.1) Forced role wins (page-level override)
    const forcedRole = detectForcedRole();
    if (forcedRole) {
      log("forced role:", forcedRole);
      MMD.setRole(forcedRole);

      // Still try to load member for other data (email/telegram/status), but do not override role.
    }

    // 11.2) Try Memberstack
    const member = await getMemberstackMember();
    MMD.member = member;

    // Not logged in
    if (!member) {
      if (!forcedRole) {
        const qsRole = detectRoleFromQS();
        if (qsRole) MMD.setRole(qsRole);
        else MMD.setRole(detectRoleFromStorage() || "guest");
      }

      // status
      const storedStatus = normalizeStatus(getStorage(CONFIG.storageStatus) || "");
      if (storedStatus && storedStatus !== "unknown") MMD.setStatus(storedStatus);
      else MMD.setStatus("unknown");

      dispatch("mmd:member", { signedIn: false });
      return;
    }

    // 11.3) Basic member signals
    const tier = pickTierFromMember(member);
    const expireAt = pickExpireAtFromMember(member);
    const telegramId = pickTelegramIdFromMember(member);

    if (telegramId) MMD.telegramId = telegramId;

    // 11.4) Optional server enrichment (Tables, canonical tier/status)
    const enriched = await enrichProfileViaEndpoint(member);

    // Decide final tier/role
    const roleCandidate = normalizeRole((enriched && enriched.tier) || tier || "guest");

    // Decide status/expireAt
    const finalExpireAt = clampStr((enriched && enriched.expire_at) || expireAt || "");
    let finalStatus =
      normalizeStatus((enriched && enriched.status) || "") ||
      "unknown";

    if (!clampStr((enriched && enriched.status) || "")) {
      // If no explicit status, infer from expire_at when possible
      const inferred = computeStatusFromExpireAt(finalExpireAt);
      if (inferred !== "unknown") finalStatus = inferred;
    }

    MMD.setStatus(finalStatus, finalExpireAt);

    // Apply role (unless forced)
    if (!forcedRole) {
      let finalRole = roleCandidate;

      // If expired and degradeOnExpire enabled
      if (CONFIG.degradeOnExpire && MMD.status === "expired") {
        const degraded = CONFIG.degradeMap[finalRole];
        if (degraded) finalRole = normalizeRole(degraded);
      }
      MMD.setRole(finalRole);
    }

    // Expose a few useful datasets for CSS/other scripts
    try {
      const email = clampStr(member.email) || clampStr(member.auth && member.auth.email);
      const msId =
        clampStr(member.id) ||
        clampStr(member.memberstack_id) ||
        clampStr(member.memberstackId);

      setDataAttr(document.documentElement, "msEmail", email);
      setDataAttr(document.documentElement, "msId", msId);
      setDataAttr(document.body, "msEmail", email);
      setDataAttr(document.body, "msId", msId);

      // If you also store “source/status” fields like in your table screenshot
      const cf = member.customFields || member.custom_fields || {};
      const source = clampStr((enriched && enriched.source) || cf.source || member.source);
      if (source) {
        setDataAttr(document.documentElement, "memberSource", source);
        setDataAttr(document.body, "memberSource", source);
      }
    } catch (_) {}

    dispatch("mmd:member", { signedIn: true, tier: roleCandidate, status: MMD.status });
  }

  /* =========================
     12) BOOT FLOW (ORDER MATTERS)
  ========================= */
  function boot() {
    CONFIG.debug = detectDebug();

    // 12.1) lang fast
    MMD.lang = detectLangFast();
    setDataAttr(document.documentElement, "lang", MMD.lang);

    // 12.2) role fast (pre-memberstack)
    // priority: data-force-role > qs role > storage role > guest
    const forcedRole = detectForcedRole();
    if (forcedRole) MMD.role = forcedRole;
    else {
      const qsRole = detectRoleFromQS();
      if (qsRole) MMD.role = qsRole;
      else MMD.role = detectRoleFromStorage() || "guest";
    }

    // set initial dataset (for CSS)
    setDataAttr(document.documentElement, "userRole", MMD.role);
    setDataAttr(document.body, "userRole", MMD.role);

    // status (fast)
    MMD.status = normalizeStatus(getStorage(CONFIG.storageStatus) || "unknown");
    setDataAttr(document.documentElement, "userStatus", MMD.status);
    setDataAttr(document.body, "userStatus", MMD.status);

    // 12.3) wire language buttons
    I18N.wireLangButtons(document);

    // 12.4) apply i18n (fast)
    I18N.apply(document, { lang: MMD.lang, role: MMD.role });

    // 12.5) apply gating (fast)
    applyGating(document);

    // 12.6) async member resolution (authoritative)
    bootstrapMember()
      .then(() => {
        // Re-apply i18n and gating with authoritative role/status
        I18N.apply(document, { lang: MMD.lang, role: MMD.role });
        applyGating(document);
        log("boot ok", { lang: MMD.lang, role: MMD.role, status: MMD.status, at: nowISO() });
      })
      .catch((e) => {
        warn("bootstrapMember error", e);
      });
  }

  onReady(boot);

  /* =========================
     13) OPTIONAL: PUBLIC API HOOKS
        - You can call window.MMD.refresh() after sign-in/out callbacks.
  ========================= */
  window.MMD_I18N = window.MMD_I18N || I18N;

})();
