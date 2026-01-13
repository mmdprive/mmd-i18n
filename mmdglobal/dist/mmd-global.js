/* =========================================
   MMD PRIVÉ — Global Bootstrap (mmd.global.js)
   v2026-LOCK-03 (FULL)

   DATA MODEL (locked spec)
   - base  : standard | premium | blackcard | guest | 7days
   - role  : guest | standard | premium | vip | blackcard
   - badge : guest | standard | premium | vip | svip | blackcard

   Memberstack (custom fields suggested)
   - tier         (badge): standard|premium|vip|svip|blackcard
   - base_tier    (optional): standard|premium|blackcard|7days|guest
   - vip_approved (optional): true/1/yes/on
   - svip_approved(optional): true/1/yes/on
   - status       (optional): active/expired
   - expire_at / Expire At   (optional): date/time

   DOM outputs
   - data-user-role="..."
   - data-user-badge="..."
   - data-user-base="..."
   - classes:
       mmd-role-*
       mmd-badge-*
       mmd-base-*

   Role Locks
   - data-mmd-min-role="premium"
   - data-mmd-show="premium,vip,blackcard"
   - data-mmd-hide="guest"

   Badge Locks (UI text / CTA variants)
   - data-mmd-show-badge="svip"
   - data-mmd-hide-badge="blackcard"

   Back-compat aliases
   - data-mmd-show-tier / data-mmd-hide-tier  => treated as badge list
========================================= */

(function (window, document) {
  "use strict";

  var VERSION = "v2026-LOCK-03";

  var DEFAULTS = {
    debug: false,

    // optional for reference
    memberstackAppId: "",

    // storage keys
    roleStorageKey: "mmd_user_role",
    badgeStorageKey: "mmd_user_badge",
    baseStorageKey: "mmd_user_base",
    intentStorageKey: "mmd_intent",
    langKeys: ["mmd_lang", "lang"],

    // supported langs
    supportedLangs: ["th", "en", "zh", "ja"],
    defaultLang: "th",

    // role rank (higher = more privileges)
    roleRank: {
      guest: 0,
      standard: 1,
      premium: 2,
      vip: 3,
      blackcard: 4,
      svip: 4 // alias
    },

    // badge -> role mapping
    badgeToRoleMap: {
      guest: "guest",
      standard: "standard",
      premium: "premium",
      vip: "vip",
      svip: "blackcard",
      blackcard: "blackcard"
    },

    // base -> role mapping
    baseToRoleMap: {
      guest: "guest",
      "7days": "guest",
      standard: "standard",
      premium: "premium",
      blackcard: "blackcard"
    },

    // Memberstack polling
    memberstack: {
      timeoutMs: 6000,
      pollMs: 250
    },

    // Lock selectors
    lock: {
      selector:
        "[data-mmd-min-role],[data-mmd-show],[data-mmd-hide]," +
        "[data-mmd-show-badge],[data-mmd-hide-badge]," +
        "[data-mmd-show-base],[data-mmd-hide-base]," +
        "[data-mmd-show-tier],[data-mmd-hide-tier]" // aliases
    }
  };

  // ----------------------------
  // helpers
  // ----------------------------
  function now() { return Date.now ? Date.now() : +new Date(); }

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch (_) { return null; }
  }

  function isPlainObject(x) {
    return !!x && typeof x === "object" && Object.prototype.toString.call(x) === "[object Object]";
  }

  function shallowMerge(a, b) {
    var out = {};
    var k;
    for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) out[k] = a[k];
    for (k in b) if (Object.prototype.hasOwnProperty.call(b, k)) {
      if (isPlainObject(out[k]) && isPlainObject(b[k])) out[k] = shallowMerge(out[k], b[k]);
      else out[k] = b[k];
    }
    return out;
  }

  function qs() {
    try { return new URLSearchParams(window.location.search || ""); }
    catch (_) {
      var out = {};
      var q = (window.location.search || "").replace(/^\?/, "");
      if (!q) return { get: function (k) { return out[k] || null; } };
      q.split("&").forEach(function (p) {
        var a = p.split("=");
        out[decodeURIComponent(a[0] || "")] = decodeURIComponent(a[1] || "");
      });
      return { get: function (k) { return out[k] || null; } };
    }
  }

  function safeToken(s) {
    // allow a-z 0-9 _ -
    s = (s || "").toString().trim().toLowerCase();
    if (!s) return "";
    s = s.replace(/\s+/g, "");
    if (!/^[a-z0-9_-]+$/.test(s)) return "";
    return s;
  }

  function truthy(v) {
    if (v === true) return true;
    if (v === false) return false;
    v = (v ?? "").toString().trim().toLowerCase();
    return (v === "1" || v === "true" || v === "yes" || v === "y" || v === "on");
  }

  function toEpochMaybe(v) {
    // supports: ISO date, timestamp seconds/ms, or empty
    if (v === null || v === undefined) return 0;
    if (typeof v === "number") {
      // assume ms if > 1e12
      return (v > 1e12) ? v : (v * 1000);
    }
    var s = (v || "").toString().trim();
    if (!s) return 0;

    // numeric string
    if (/^\d+$/.test(s)) {
      var n = parseInt(s, 10);
      if (!isFinite(n)) return 0;
      return (n > 1e12) ? n : (n * 1000);
    }

    var t = Date.parse(s);
    if (!isFinite(t)) return 0;
    return t;
  }

  // ----------------------------
  // public namespace
  // ----------------------------
  var MMD = window.MMD = window.MMD || {};
  MMD.global = MMD.global || {};
  MMD.global.version = VERSION;

  // config merge
  var cfg = DEFAULTS;
  try {
    if (window.MMD_CONFIG && typeof window.MMD_CONFIG === "object") {
      cfg = shallowMerge(cfg, window.MMD_CONFIG);
    }
    var htmlCfg = document.documentElement.getAttribute("data-mmd-config");
    if (htmlCfg) {
      var parsed = safeJsonParse(htmlCfg);
      if (parsed && typeof parsed === "object") cfg = shallowMerge(cfg, parsed);
    }
  } catch (_) {}
  MMD.config = cfg;

  function log() {
    if (!MMD.config.debug) return;
    try {
      var args = Array.prototype.slice.call(arguments);
      args.unshift("[MMD.global " + VERSION + "]");
      console.log.apply(console, args);
    } catch (_) {}
  }

  // ----------------------------
  // language
  // ----------------------------
  function isSupportedLang(lang) {
    return !!lang && MMD.config.supportedLangs.indexOf(lang) >= 0;
  }

  function getLang() {
    var p = qs();
    var qLang = (p.get && p.get("lang")) ? (p.get("lang") || "").toString().trim().toLowerCase() : "";
    if (isSupportedLang(qLang)) return qLang;

    for (var i = 0; i < MMD.config.langKeys.length; i++) {
      try {
        var v = (window.localStorage.getItem(MMD.config.langKeys[i]) || "").toString().trim().toLowerCase();
        if (isSupportedLang(v)) return v;
      } catch (_) {}
    }

    try {
      var n = (navigator.language || navigator.userLanguage || "").toLowerCase();
      if (n.indexOf("th") === 0) return "th";
      if (n.indexOf("ja") === 0) return "ja";
      if (n.indexOf("zh") === 0) return "zh";
      if (n.indexOf("en") === 0) return "en";
    } catch (_) {}

    return MMD.config.defaultLang;
  }

  function setLang(lang, opts) {
    opts = opts || {};
    lang = (lang || "").toString().trim().toLowerCase();
    if (!isSupportedLang(lang)) lang = MMD.config.defaultLang;

    if (opts.persist !== false) {
      try { window.localStorage.setItem("mmd_lang", lang); } catch (_) {}
      try { window.localStorage.setItem("lang", lang); } catch (_) {}
    }

    try { document.documentElement.setAttribute("lang", lang); } catch (_) {}

    try {
      if (window.MMD_I18N) {
        if (typeof window.MMD_I18N.setLang === "function") window.MMD_I18N.setLang(lang);
        else if (typeof window.MMD_I18N.apply === "function") window.MMD_I18N.apply(lang);
      } else if (typeof window.mmd_i18n_apply === "function") {
        window.mmd_i18n_apply(lang);
      }
    } catch (_) {}

    try { window.dispatchEvent(new CustomEvent("mmd:lang", { detail: { lang: lang } })); } catch (_) {}
    return lang;
  }

  function bindLangButtons() {
    var btns;
    try { btns = document.querySelectorAll("[data-set-lang],.mmd-lang-btn[data-set-lang]"); }
    catch (_) { return; }
    if (!btns || !btns.length) return;

    var activate = function (lang) {
      try {
        var all = document.querySelectorAll("[data-set-lang],.mmd-lang-btn[data-set-lang]");
        Array.prototype.forEach.call(all, function (b) {
          var isActive = (b.getAttribute("data-set-lang") || "").toLowerCase() === lang;
          b.classList.toggle("mmd-lang-active", !!isActive);
        });
      } catch (_) {}
    };

    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () {
        var l = (b.getAttribute("data-set-lang") || "").toLowerCase();
        activate(setLang(l));
      });
    });

    activate(getLang());
  }

  // ----------------------------
  // intent
  // ----------------------------
  function captureIntentFromUrl() {
    var p = qs();
    if (!p || typeof p.get !== "function") return;
    var intent = (p.get("intent") || "").toString().trim();
    if (!intent) return;
    try { window.localStorage.setItem(MMD.config.intentStorageKey, intent); } catch (_) {}
    log("intent captured:", intent);
  }

  function getIntent() {
    try { return (window.localStorage.getItem(MMD.config.intentStorageKey) || "").toString().trim(); }
    catch (_) { return ""; }
  }

  function clearIntent() {
    try { window.localStorage.removeItem(MMD.config.intentStorageKey); } catch (_) {}
  }

  // ----------------------------
  // normalize role/base/badge
  // ----------------------------
  function normalizeRole(role) {
    role = safeToken(role);
    if (role === "svip") role = "blackcard";
    if (!role) return "guest";
    if (!MMD.config.roleRank.hasOwnProperty(role)) return "guest";
    return role;
  }

  function roleRank(role) {
    role = normalizeRole(role);
    return MMD.config.roleRank[role] || 0;
  }

  function normalizeBase(base) {
    base = safeToken(base);
    if (base === "svip") base = "blackcard";
    if (!base) return "guest";
    // allow 7days as base
    if (base === "7days") return "7days";
    if (base === "blackcard" || base === "premium" || base === "standard" || base === "guest") return base;
    return "guest";
  }

  function normalizeBadge(badge) {
    badge = safeToken(badge);
    if (badge === "svip") return "svip";
    if (badge === "blackcard" || badge === "vip" || badge === "premium" || badge === "standard" || badge === "guest") return badge;
    // sometimes someone might store "black_card"
    if (badge === "blackcardmembership" || badge === "black_card") return "blackcard";
    return "";
  }

  function baseToRole(base) {
    base = normalizeBase(base);
    return normalizeRole(MMD.config.baseToRoleMap[base] || "guest");
  }

  function badgeToRole(badge) {
    badge = normalizeBadge(badge);
    return normalizeRole(MMD.config.badgeToRoleMap[badge] || "guest");
  }

  // ----------------------------
  // DOM datasets / classes
  // ----------------------------
  function removePrefixedClasses(el, prefix) {
    if (!el || !el.classList) return;
    try {
      Array.prototype.slice.call(el.classList).forEach(function (c) {
        if (c.indexOf(prefix) === 0) el.classList.remove(c);
      });
    } catch (_) {}
  }

  function setDatasetTriplet(role, badge, base) {
    role = normalizeRole(role);
    badge = normalizeBadge(badge) || "guest";
    base = normalizeBase(base);

    // html
    try {
      var html = document.documentElement;
      if (html) {
        html.setAttribute("data-user-role", role);
        html.setAttribute("data-user-badge", badge);
        html.setAttribute("data-user-base", base);

        removePrefixedClasses(html, "mmd-role-");
        removePrefixedClasses(html, "mmd-badge-");
        removePrefixedClasses(html, "mmd-base-");

        html.classList.add("mmd-role-" + role);
        html.classList.add("mmd-badge-" + badge);
        html.classList.add("mmd-base-" + base);
      }
    } catch (_) {}

    // body
    try {
      var body = document.body;
      if (body) {
        body.setAttribute("data-user-role", role);
        body.setAttribute("data-user-badge", badge);
        body.setAttribute("data-user-base", base);

        removePrefixedClasses(body, "mmd-role-");
        removePrefixedClasses(body, "mmd-badge-");
        removePrefixedClasses(body, "mmd-base-");

        body.classList.add("mmd-role-" + role);
        body.classList.add("mmd-badge-" + badge);
        body.classList.add("mmd-base-" + base);
      }
    } catch (_) {}
  }

  // ----------------------------
  // lock engine
  // ----------------------------
  function parseList(s) {
    return (s || "")
      .toString()
      .split(",")
      .map(function (x) { return safeToken(x); })
      .filter(function (x) { return !!x; });
  }

  function hideEl(el) {
    if (!el) return;
    try {
      if (!el.hasAttribute("data-mmd-orig-display")) {
        el.setAttribute("data-mmd-orig-display", el.style.display || "");
      }
      el.style.display = "none";
      el.setAttribute("aria-hidden", "true");
    } catch (_) {}
  }

  function showEl(el) {
    if (!el) return;
    try {
      var orig = el.getAttribute("data-mmd-orig-display");
      el.style.display = (orig !== null) ? orig : "";
      el.removeAttribute("aria-hidden");
    } catch (_) {}
  }

  function applyLocks(root) {
    root = root || document;

    var role = getRole();
    var badge = getBadge();
    var base = getBase();

    var nodes;
    try { nodes = root.querySelectorAll(MMD.config.lock.selector); }
    catch (_) { return; }

    if (!nodes || !nodes.length) return;

    Array.prototype.forEach.call(nodes, function (el) {
      try {
        // 1) min-role (strongest)
        var minRole = normalizeRole(el.getAttribute("data-mmd-min-role") || "");
        if (minRole && minRole !== "guest") {
          if (roleRank(role) >= roleRank(minRole)) showEl(el);
          else hideEl(el);
          return;
        }

        // 2) show/hide by role
        var showRoles = parseList(el.getAttribute("data-mmd-show") || "");
        if (showRoles.length) {
          if (showRoles.indexOf(role) >= 0) showEl(el);
          else hideEl(el);
          return;
        }

        var hideRoles = parseList(el.getAttribute("data-mmd-hide") || "");
        if (hideRoles.length) {
          if (hideRoles.indexOf(role) >= 0) hideEl(el);
          else showEl(el);
          return;
        }

        // 3) show/hide by badge
        var showBadges = parseList(el.getAttribute("data-mmd-show-badge") || "");
        // back-compat alias: show-tier treated as badge
        var showTierAlias = parseList(el.getAttribute("data-mmd-show-tier") || "");
        if (showTierAlias.length) showBadges = showBadges.concat(showTierAlias);

        if (showBadges.length) {
          if (showBadges.indexOf(badge) >= 0) showEl(el);
          else hideEl(el);
          return;
        }

        var hideBadges = parseList(el.getAttribute("data-mmd-hide-badge") || "");
        var hideTierAlias = parseList(el.getAttribute("data-mmd-hide-tier") || "");
        if (hideTierAlias.length) hideBadges = hideBadges.concat(hideTierAlias);

        if (hideBadges.length) {
          if (hideBadges.indexOf(badge) >= 0) hideEl(el);
          else showEl(el);
          return;
        }

        // 4) show/hide by base
        var showBase = parseList(el.getAttribute("data-mmd-show-base") || "");
        if (showBase.length) {
          if (showBase.indexOf(base) >= 0) showEl(el);
          else hideEl(el);
          return;
        }

        var hideBase = parseList(el.getAttribute("data-mmd-hide-base") || "");
        if (hideBase.length) {
          if (hideBase.indexOf(base) >= 0) hideEl(el);
          else showEl(el);
          return;
        }

      } catch (_) {}
    });
  }

  function observeLocks() {
    if (!("MutationObserver" in window)) return;
    try {
      var obs = new MutationObserver(function (mutations) {
        for (var i = 0; i < mutations.length; i++) {
          var m = mutations[i];
          if (m.addedNodes && m.addedNodes.length) {
            for (var j = 0; j < m.addedNodes.length; j++) {
              var n = m.addedNodes[j];
              if (n && n.nodeType === 1) applyLocks(n);
            }
          }
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });
    } catch (_) {}
  }

  // ----------------------------
  // state + API
  // ----------------------------
  var _role = "guest";
  var _badge = "guest";
  var _base = "guest";

  function getRole() { return normalizeRole(_role); }
  function getBadge() { return normalizeBadge(_badge) || "guest"; }
  function getBase() { return normalizeBase(_base); }

  function persistTriplet(role, badge, base) {
    try { window.localStorage.setItem(MMD.config.roleStorageKey, normalizeRole(role)); } catch (_) {}
    try { window.localStorage.setItem(MMD.config.badgeStorageKey, normalizeBadge(badge) || "guest"); } catch (_) {}
    try { window.localStorage.setItem(MMD.config.baseStorageKey, normalizeBase(base)); } catch (_) {}
  }

  function applyTriplet(role, badge, base, opts) {
    opts = opts || {};
    role = normalizeRole(role);
    badge = normalizeBadge(badge) || "guest";
    base = normalizeBase(base);

    _role = role;
    _badge = badge;
    _base = base;

    if (opts.persist !== false) persistTriplet(role, badge, base);

    setDatasetTriplet(role, badge, base);
    applyLocks();

    // role suffix i18n (key.{role}) and other dynamic copy
    try {
      if (window.MMD_I18N && typeof window.MMD_I18N.apply === "function") {
        window.MMD_I18N.apply(getLang());
      }
    } catch (_) {}

    try {
      window.dispatchEvent(new CustomEvent("mmd:entitlement", {
        detail: { role: role, badge: badge, base: base, version: VERSION }
      }));
    } catch (_) {}

    log("entitlement set:", { role: role, badge: badge, base: base });
    return { role: role, badge: badge, base: base };
  }

  // expose public API
  MMD.global.getLang = getLang;
  MMD.global.setLang = setLang;
  MMD.global.getIntent = getIntent;
  MMD.global.clearIntent = clearIntent;

  MMD.global.getRole = getRole;
  MMD.global.getBadge = getBadge;
  MMD.global.getBase = getBase;

  MMD.global.applyLocks = applyLocks;

  // manual override helpers (rarely needed)
  MMD.global.setEntitlement = function (role, badge, base) {
    return applyTriplet(role, badge, base, { persist: true });
  };

  // ----------------------------
  // sources: body/storage/memberstack
  // ----------------------------
  function fromBody() {
    var out = { role: "", badge: "", base: "" };
    try {
      var b = document.body;
      if (!b) return out;
      out.role = normalizeRole(b.getAttribute("data-user-role") || "");
      out.badge = normalizeBadge(b.getAttribute("data-user-badge") || "");
      out.base = normalizeBase(b.getAttribute("data-user-base") || "");
      // allow legacy:
      if (!out.badge) out.badge = normalizeBadge(b.getAttribute("data-user-tier") || "");
    } catch (_) {}
    return out;
  }

  function fromStorage() {
    var out = { role: "", badge: "", base: "" };
    try { out.role = normalizeRole(window.localStorage.getItem(MMD.config.roleStorageKey) || ""); } catch (_) {}
    try { out.badge = normalizeBadge(window.localStorage.getItem(MMD.config.badgeStorageKey) || ""); } catch (_) {}
    try { out.base = normalizeBase(window.localStorage.getItem(MMD.config.baseStorageKey) || ""); } catch (_) {}
    return out;
  }

  function getMemberstackInstance() {
    return window.memberstack || window.MemberStack || window.$memberstack || null;
  }

  function extractMemberPromise(msObj) {
    if (!msObj) return null;
    // Promise-based methods across versions
    if (typeof msObj.getMemberJSON === "function") return msObj.getMemberJSON();
    if (typeof msObj.getCurrentMember === "function") return msObj.getCurrentMember();
    if (typeof msObj.getMember === "function") return msObj.getMember();
    if (msObj.member && typeof msObj.member === "object") return Promise.resolve(msObj.member);
    return null;
  }

  function getCustomField(member, keyList) {
    if (!member || typeof member !== "object") return null;

    var keys = (Array.isArray(keyList) ? keyList : [keyList])
      .map(function (k) { return (k || "").toString(); })
      .filter(Boolean);

    // common: member.customFields as object
    var cf = member.customFields;
    if (cf && typeof cf === "object" && !Array.isArray(cf)) {
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (cf.hasOwnProperty(k)) return cf[k];
        // try tokenized keys
        var tk = safeToken(k);
        if (tk && cf.hasOwnProperty(tk)) return cf[tk];
      }
    }

    // sometimes customFields is an array of { key, value } or { slug, value }
    if (Array.isArray(cf)) {
      for (var j = 0; j < cf.length; j++) {
        var row = cf[j] || {};
        var k2 = row.key || row.slug || row.name;
        if (!k2) continue;
        var k2t = safeToken(k2);
        for (var x = 0; x < keys.length; x++) {
          if (k2 === keys[x] || k2t === safeToken(keys[x])) return row.value;
        }
      }
    }

    return null;
  }

  function inferFromPlanNames(member) {
    // returns { base, badgeCandidate }
    var names = [];

    function pushName(x) {
      if (!x) return;
      var s = (x.name || x.planName || x.title || x).toString();
      if (s) names.push(s);
    }

    try {
      if (Array.isArray(member.planConnections)) {
        member.planConnections.forEach(function (pc) {
          pushName(pc && (pc.planName || (pc.plan && pc.plan.name) || pc.plan));
        });
      }
      if (Array.isArray(member.plans)) member.plans.forEach(pushName);
      if (Array.isArray(member.subscriptions)) member.subscriptions.forEach(pushName);
      if (member.plan) pushName(member.plan);
      if (member.subscription) pushName(member.subscription);
    } catch (_) {}

    var base = "";
    var badgeCandidate = "";

    names.forEach(function (n) {
      var s = (n || "").toString().toLowerCase();

      if (s.indexOf("black") >= 0 || s.indexOf("svip") >= 0) {
        base = "blackcard";
        badgeCandidate = badgeCandidate || "blackcard";
        return;
      }
      if (s.indexOf("premium") >= 0) {
        base = base || "premium";
        badgeCandidate = badgeCandidate || "premium";
        return;
      }
      if (s.indexOf("standard") >= 0) {
        base = base || "standard";
        badgeCandidate = badgeCandidate || "standard";
        return;
      }
      if (s.indexOf("7") >= 0 && s.indexOf("day") >= 0) {
        base = base || "7days";
        badgeCandidate = badgeCandidate || "guest";
        return;
      }
    });

    return { base: base, badgeCandidate: badgeCandidate };
  }

  function computeEntitlementFromMember(member) {
    // read custom fields
    var cfTier = normalizeBadge(getCustomField(member, ["tier", "Tier"]) || "");
    var cfBase = normalizeBase(getCustomField(member, ["base_tier", "baseTier", "base", "package", "plan_code"]) || "");
    var vipApproved = truthy(getCustomField(member, ["vip_approved", "vipApproved", "vip"]) || "");
    var svipApproved = truthy(getCustomField(member, ["svip_approved", "svipApproved", "svip"]) || "");

    // status/expire gates
    var status = (getCustomField(member, ["status", "Status"]) || "").toString().trim().toLowerCase();
    var expireAt = getCustomField(member, ["expire_at", "Expire At", "ExpireAt"]) || "";
    var expireEpoch = toEpochMaybe(expireAt);
    var expiredByDate = (expireEpoch > 0 && expireEpoch < now());
    var expiredByStatus = (status === "expired" || status === "inactive");

    // plan infer as fallback
    var inferred = inferFromPlanNames(member);

    var base = cfBase || inferred.base || "";
    base = normalizeBase(base);

    // If no base but tier is standard/premium/blackcard, treat as base for safety
    if ((!base || base === "guest") && (cfTier === "standard" || cfTier === "premium" || cfTier === "blackcard")) {
      base = normalizeBase(cfTier);
    }

    // handle expired
    if (expiredByDate || expiredByStatus) {
      return { role: "guest", badge: "guest", base: "guest", expired: true };
    }

    // badge decision (locked precedence)
    // 0) if cfTier explicitly set -> respect it
    // 1) else if base is blackcard -> badge blackcard (paid 25,000)
    // 2) else if svipApproved -> badge svip (selected)
    // 3) else if vipApproved -> badge vip
    // 4) else badge = base (standard/premium) or inferred badgeCandidate
    var badge = cfTier || "";
    if (!badge) {
      if (base === "blackcard") badge = "blackcard";
      else if (svipApproved) badge = "svip";
      else if (vipApproved) badge = "vip";
      else badge = normalizeBadge(inferred.badgeCandidate) || normalizeBadge(base) || "guest";
    }

    // role decision
    var role = "guest";
    // any SVIP/Blackcard-equivalent -> role blackcard
    if (badge === "svip" || badge === "blackcard" || base === "blackcard" || svipApproved) role = "blackcard";
    else if (badge === "vip" || vipApproved) role = "vip";
    else role = baseToRole(base);

    return { role: role, badge: badge, base: base, expired: false };
  }

  function resolveMemberstack(done) {
    var ms = getMemberstackInstance();
    var start = now();
    var timeoutAt = start + MMD.config.memberstack.timeoutMs;

    function finish(ent) {
      try { done && done(ent); } catch (_) {}
    }

    function poll() {
      ms = getMemberstackInstance();
      var p = null;
      try { p = extractMemberPromise(ms); } catch (_) { p = null; }

      if (p && typeof p.then === "function") {
        p.then(function (member) {
          var ent = computeEntitlementFromMember(member || {});
          finish(ent);
        }).catch(function () {
          finish(null);
        });
        return;
      }

      if (now() >= timeoutAt) {
        finish(null);
        return;
      }

      setTimeout(poll, MMD.config.memberstack.pollMs);
    }

    // prefer onReady if exists
    try {
      if (ms && typeof ms.onReady === "function") {
        var doneOnce = false;
        var t = setTimeout(function () {
          if (doneOnce) return;
          doneOnce = true;
          finish(null);
        }, MMD.config.memberstack.timeoutMs);

        ms.onReady(function () {
          if (doneOnce) return;
          doneOnce = true;
          clearTimeout(t);
          poll();
        });
        return;
      }
    } catch (_) {}

    poll();
  }

  // ----------------------------
  // bootstrap
  // ----------------------------
  function bootstrap() {
    // debug: ?debug=1
    try {
      var p = qs();
      var dbg = (p.get && p.get("debug")) ? p.get("debug") : "";
      if (dbg === "1" || dbg === "true") MMD.config.debug = true;
    } catch (_) {}

    log("boot start");

    captureIntentFromUrl();

    // lang
    var lang = setLang(getLang(), { persist: true });
    bindLangButtons();

    // initial from body + storage (sync)
    var b = fromBody();
    var s = fromStorage();

    // initial merge priority: body > storage > defaults
    var initBase = b.base || s.base || "guest";
    var initBadge = b.badge || s.badge || "";
    var initRole = b.role || s.role || "";

    initBase = normalizeBase(initBase);

    // if badge missing, infer from base
    initBadge = normalizeBadge(initBadge) || normalizeBadge(initBase) || "guest";

    // if role missing, infer from badge/base
    initRole = normalizeRole(initRole) || badgeToRole(initBadge) || baseToRole(initBase);

    applyTriplet(initRole, initBadge, initBase, { persist: true });

    // observe for dynamic DOM
    observeLocks();

    // resolve from Memberstack (authoritative if present)
    resolveMemberstack(function (ent) {
      if (ent && ent.role && ent.badge && ent.base) {
        applyTriplet(ent.role, ent.badge, ent.base, { persist: true });
      } else {
        log("memberstack not available; kept local entitlement");
      }

      // ready event
      try {
        window.dispatchEvent(new CustomEvent("mmd:ready", {
          detail: { role: getRole(), badge: getBadge(), base: getBase(), lang: lang, version: VERSION }
        }));
      } catch (_) {}

      log("boot done");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }

})(window, document);
