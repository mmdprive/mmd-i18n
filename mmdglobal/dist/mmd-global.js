/* =========================================
   MMD PRIVÉ — Global Bootstrap (mmd.global.js)
   V1 (CURRENT) — FINAL FIELDS READY + LEGACY SAFE
   v=V1-LOCK-2026-01-14

   FINAL FIELD SPEC (recommended)
   - base_tier      : standard | premium | blackcard
   - badge_tier     : standard | premium | vip | svip | blackcard
   - vip_approved   : boolean (true/false or 1/0)
   - svip_approved  : boolean (true/false or 1/0)
   - status         : active | expired | (optional suspended)
   - expire_at      : ISO string or epoch (ms/sec)

   LEGACY (read only, for migration period)
   - tier           -> badge_tier
   - Expire At / expire-at -> expire_at
   - Last Payment At / last-payment-at -> last_payment_at (not required by runtime)

   DOM outputs
   - data-user-base="standard|premium|blackcard|guest"
   - data-user-badge="standard|premium|vip|svip|blackcard|guest"
   - data-user-role="guest|standard|premium|vip|blackcard"

   Lock attributes
   - data-mmd-min-role="premium|vip|blackcard"
   - data-mmd-show="premium,vip,blackcard"
   - data-mmd-hide="guest"
   - data-mmd-show-badge="svip"
   - data-mmd-hide-badge="blackcard"
   - data-mmd-show-base="premium"
   - data-mmd-hide-base="standard"
   Aliases:
   - data-mmd-show-tier / data-mmd-hide-tier => treated as badge list
========================================= */

(function (window, document) {
  "use strict";

  var VERSION = "V1-LOCK-2026-01-14";

  var DEFAULTS = {
    debug: false,
    memberstackAppId: "app_cmjajuv1600150su284ov77w1",
    storage: {
      role: "mmd_user_role",
      badge: "mmd_user_badge",
      base: "mmd_user_base",
      intent: "mmd_intent",
      langKeys: ["mmd_lang", "lang"]
    },
    langs: ["th", "en", "zh", "ja"],
    defaultLang: "th",
    roleRank: { guest: 0, standard: 1, premium: 2, vip: 3, blackcard: 4 },
    memberstack: { timeoutMs: 6000, pollMs: 250 },
    lockSelector:
      "[data-mmd-min-role],[data-mmd-show],[data-mmd-hide]," +
      "[data-mmd-show-badge],[data-mmd-hide-badge]," +
      "[data-mmd-show-base],[data-mmd-hide-base]," +
      "[data-mmd-show-tier],[data-mmd-hide-tier]"
  };

  // ----------------------------
  // helpers
  // ----------------------------
  function now() { return Date.now ? Date.now() : +new Date(); }
  function safeJsonParse(s) { try { return JSON.parse(s); } catch (_) { return null; } }
  function isPlainObject(x) { return !!x && typeof x === "object" && Object.prototype.toString.call(x) === "[object Object]"; }

  function merge(a, b) {
    var out = {}, k;
    for (k in a) if (Object.prototype.hasOwnProperty.call(a, k)) out[k] = a[k];
    for (k in b) if (Object.prototype.hasOwnProperty.call(b, k)) {
      if (isPlainObject(out[k]) && isPlainObject(b[k])) out[k] = merge(out[k], b[k]);
      else out[k] = b[k];
    }
    return out;
  }

  function safeToken(s) {
    s = (s || "").toString().trim().toLowerCase().replace(/\s+/g, "");
    if (!s) return "";
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
    if (v === null || v === undefined) return 0;
    if (typeof v === "number") return (v > 1e12) ? v : (v * 1000);
    var s = (v || "").toString().trim();
    if (!s) return 0;
    if (/^\d+$/.test(s)) {
      var n = parseInt(s, 10);
      if (!isFinite(n)) return 0;
      return (n > 1e12) ? n : (n * 1000);
    }
    var t = Date.parse(s);
    return isFinite(t) ? t : 0;
  }

  function qs() {
    try { return new URLSearchParams(window.location.search || ""); }
    catch (_) {
      var out = {}, q = (window.location.search || "").replace(/^\?/, "");
      if (!q) return { get: function (k) { return out[k] || null; } };
      q.split("&").forEach(function (p) {
        var a = p.split("=");
        out[decodeURIComponent(a[0] || "")] = decodeURIComponent(a[1] || "");
      });
      return { get: function (k) { return out[k] || null; } };
    }
  }

  // ----------------------------
  // namespace + config
  // ----------------------------
  var MMD = window.MMD = window.MMD || {};
  MMD.global = MMD.global || {};
  MMD.global.version = VERSION;

  var cfg = DEFAULTS;
  try {
    if (window.MMD_CONFIG && typeof window.MMD_CONFIG === "object") cfg = merge(cfg, window.MMD_CONFIG);
    var htmlCfg = document.documentElement.getAttribute("data-mmd-config");
    if (htmlCfg) {
      var parsed = safeJsonParse(htmlCfg);
      if (parsed && typeof parsed === "object") cfg = merge(cfg, parsed);
    }
  } catch (_) {}
  MMD.global.config = cfg;

  function log() {
    if (!cfg.debug) return;
    try {
      var args = Array.prototype.slice.call(arguments);
      args.unshift("[MMD.global " + VERSION + "]");
      console.log.apply(console, args);
    } catch (_) {}
  }

  // ----------------------------
  // i18n
  // ----------------------------
  function isSupportedLang(l) { return cfg.langs.indexOf(l) >= 0; }

  function getLang() {
    var p = qs();
    var qLang = (p.get && p.get("lang")) ? safeToken(p.get("lang")) : "";
    if (isSupportedLang(qLang)) return qLang;

    for (var i = 0; i < cfg.storage.langKeys.length; i++) {
      try {
        var v = safeToken(window.localStorage.getItem(cfg.storage.langKeys[i]) || "");
        if (isSupportedLang(v)) return v;
      } catch (_) {}
    }

    try {
      var n = (navigator.language || "").toLowerCase();
      if (n.indexOf("th") === 0) return "th";
      if (n.indexOf("ja") === 0) return "ja";
      if (n.indexOf("zh") === 0) return "zh";
      if (n.indexOf("en") === 0) return "en";
    } catch (_) {}

    return cfg.defaultLang;
  }

  function setLang(lang) {
    lang = safeToken(lang);
    if (!isSupportedLang(lang)) lang = cfg.defaultLang;

    try { window.localStorage.setItem("mmd_lang", lang); } catch (_) {}
    try { window.localStorage.setItem("lang", lang); } catch (_) {}
    try { document.documentElement.setAttribute("lang", lang); } catch (_) {}

    try {
      if (window.MMD_I18N) {
        if (typeof window.MMD_I18N.setLang === "function") window.MMD_I18N.setLang(lang);
        else if (typeof window.MMD_I18N.apply === "function") window.MMD_I18N.apply(lang);
      } else if (typeof window.mmd_i18n_apply === "function") {
        window.mmd_i18n_apply(lang);
      }
    } catch (_) {}

    return lang;
  }

  function bindLangButtons() {
    var btns;
    try { btns = document.querySelectorAll("[data-set-lang],.mmd-lang-btn[data-set-lang]"); }
    catch (_) { return; }
    if (!btns || !btns.length) return;

    Array.prototype.forEach.call(btns, function (b) {
      b.addEventListener("click", function () {
        setLang(b.getAttribute("data-set-lang"));
      });
    });
  }

  // ----------------------------
  // intent
  // ----------------------------
  function captureIntent() {
    var p = qs();
    if (!p || typeof p.get !== "function") return;
    var intent = (p.get("intent") || "").toString().trim();
    if (!intent) return;
    try { window.localStorage.setItem(cfg.storage.intent, intent); } catch (_) {}
  }
  function getIntent() {
    try { return (window.localStorage.getItem(cfg.storage.intent) || "").toString().trim(); }
    catch (_) { return ""; }
  }
  function clearIntent() {
    try { window.localStorage.removeItem(cfg.storage.intent); } catch (_) {}
  }

  // ----------------------------
  // normalize + mapping
  // ----------------------------
  function normalizeBase(x) {
    x = safeToken(x);
    if (x === "svip") x = "blackcard";
    if (x === "standard" || x === "premium" || x === "blackcard") return x;
    return "guest";
  }

  function normalizeBadge(x) {
    x = safeToken(x);
    if (x === "svip") return "svip";
    if (x === "vip" || x === "standard" || x === "premium" || x === "blackcard") return x;
    return "guest";
  }

  function normalizeRole(x) {
    x = safeToken(x);
    if (x === "svip") x = "blackcard";
    if (x === "guest" || x === "standard" || x === "premium" || x === "vip" || x === "blackcard") return x;
    return "guest";
  }

  function roleRank(role) { return cfg.roleRank[normalizeRole(role)] || 0; }

  function badgeToRole(badge) {
    badge = normalizeBadge(badge);
    if (badge === "svip" || badge === "blackcard") return "blackcard";
    if (badge === "vip") return "vip";
    if (badge === "premium") return "premium";
    if (badge === "standard") return "standard";
    return "guest";
  }

  function baseToRole(base) {
    base = normalizeBase(base);
    if (base === "blackcard") return "blackcard";
    if (base === "premium") return "premium";
    if (base === "standard") return "standard";
    return "guest";
  }

  // ----------------------------
  // state
  // ----------------------------
  var STATE = { role: "guest", badge: "guest", base: "guest" };

  function setDataset(role, badge, base) {
    role = normalizeRole(role);
    badge = normalizeBadge(badge);
    base = normalizeBase(base);

    function apply(el) {
      if (!el) return;
      try {
        el.setAttribute("data-user-role", role);
        el.setAttribute("data-user-badge", badge);
        el.setAttribute("data-user-base", base);

        // legacy: keep for older CSS/JS
        el.setAttribute("data-user-tier", badge);

        // reset prefixed classes
        var cls = Array.prototype.slice.call(el.classList || []);
        cls.forEach(function (c) {
          if (c.indexOf("mmd-role-") === 0) el.classList.remove(c);
          if (c.indexOf("mmd-badge-") === 0) el.classList.remove(c);
          if (c.indexOf("mmd-base-") === 0) el.classList.remove(c);
        });

        el.classList.add("mmd-role-" + role);
        el.classList.add("mmd-badge-" + badge);
        el.classList.add("mmd-base-" + base);
      } catch (_) {}
    }

    apply(document.documentElement);
    apply(document.body);
  }

  function persist(role, badge, base) {
    try { window.localStorage.setItem(cfg.storage.role, normalizeRole(role)); } catch (_) {}
    try { window.localStorage.setItem(cfg.storage.badge, normalizeBadge(badge)); } catch (_) {}
    try { window.localStorage.setItem(cfg.storage.base, normalizeBase(base)); } catch (_) {}
  }

  function normalizeTriplet(role, badge, base) {
    base = normalizeBase(base);
    badge = normalizeBadge(badge);
    role = normalizeRole(role);

    // fill missing badge/role coherently
    if (badge === "guest" && base !== "guest") badge = base;
    if (role === "guest") role = badgeToRole(badge) || baseToRole(base);

    // keep base/role consistent for blackcard
    if (base === "blackcard") role = "blackcard";
    if (badge === "svip" || badge === "blackcard") role = "blackcard";

    return { role: role, badge: badge, base: base };
  }

  function setEntitlement(role, badge, base) {
    var t = normalizeTriplet(role, badge, base);

    STATE.role = t.role;
    STATE.badge = t.badge;
    STATE.base = t.base;

    persist(t.role, t.badge, t.base);
    setDataset(t.role, t.badge, t.base);
    applyLocks();

    // re-apply i18n if you use key.{role}
    try {
      if (window.MMD_I18N && typeof window.MMD_I18N.apply === "function") {
        window.MMD_I18N.apply(getLang());
      }
    } catch (_) {}

    try {
      window.dispatchEvent(new CustomEvent("mmd:entitlement", {
        detail: { role: STATE.role, badge: STATE.badge, base: STATE.base, version: VERSION }
      }));
    } catch (_) {}
  }

  MMD.global.getRole = function () { return STATE.role; };
  MMD.global.getBadge = function () { return STATE.badge; };
  MMD.global.getBase = function () { return STATE.base; };
  MMD.global.setEntitlement = function (role, badge, base) { setEntitlement(role, badge, base); };

  MMD.global.getLang = getLang;
  MMD.global.setLang = setLang;
  MMD.global.getIntent = getIntent;
  MMD.global.clearIntent = clearIntent;

  // ----------------------------
  // lock engine
  // ----------------------------
  function parseList(s) {
    return (s || "")
      .toString()
      .split(",")
      .map(function (x) { return safeToken(x); })
      .filter(Boolean);
  }

  function hideEl(el) {
    if (!el) return;
    try {
      if (!el.hasAttribute("data-mmd-orig-display")) el.setAttribute("data-mmd-orig-display", el.style.display || "");
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
    var role = STATE.role;
    var badge = STATE.badge;
    var base = STATE.base;

    var nodes;
    try { nodes = root.querySelectorAll(cfg.lockSelector); }
    catch (_) { return; }
    if (!nodes || !nodes.length) return;

    Array.prototype.forEach.call(nodes, function (el) {
      try {
        // 1) min role
        var minRole = normalizeRole(el.getAttribute("data-mmd-min-role") || "");
        if (minRole && minRole !== "guest") {
          if (roleRank(role) >= roleRank(minRole)) showEl(el);
          else hideEl(el);
          return;
        }

        // 2) show/hide by role
        var showRoles = parseList(el.getAttribute("data-mmd-show") || "");
        if (showRoles.length) { (showRoles.indexOf(role) >= 0) ? showEl(el) : hideEl(el); return; }

        var hideRoles = parseList(el.getAttribute("data-mmd-hide") || "");
        if (hideRoles.length) { (hideRoles.indexOf(role) >= 0) ? hideEl(el) : showEl(el); return; }

        // 3) show/hide by badge (and tier aliases)
        var showBadges = parseList(el.getAttribute("data-mmd-show-badge") || "")
          .concat(parseList(el.getAttribute("data-mmd-show-tier") || ""));
        if (showBadges.length) { (showBadges.indexOf(badge) >= 0) ? showEl(el) : hideEl(el); return; }

        var hideBadges = parseList(el.getAttribute("data-mmd-hide-badge") || "")
          .concat(parseList(el.getAttribute("data-mmd-hide-tier") || ""));
        if (hideBadges.length) { (hideBadges.indexOf(badge) >= 0) ? hideEl(el) : showEl(el); return; }

        // 4) show/hide by base
        var showBase = parseList(el.getAttribute("data-mmd-show-base") || "");
        if (showBase.length) { (showBase.indexOf(base) >= 0) ? showEl(el) : hideEl(el); return; }

        var hideBase = parseList(el.getAttribute("data-mmd-hide-base") || "");
        if (hideBase.length) { (hideBase.indexOf(base) >= 0) ? hideEl(el) : showEl(el); return; }

      } catch (_) {}
    });
  }

  MMD.global.applyLocks = applyLocks;

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
  // memberstack reading
  // ----------------------------
  function getMemberstackInstance() {
    return window.memberstack || window.MemberStack || window.$memberstack || null;
  }

  function extractMemberPromise(ms) {
    if (!ms) return null;
    if (typeof ms.getMemberJSON === "function") return ms.getMemberJSON();
    if (typeof ms.getCurrentMember === "function") return ms.getCurrentMember();
    if (typeof ms.getMember === "function") return ms.getMember();
    if (ms.member && typeof ms.member === "object") return Promise.resolve(ms.member);
    return null;
  }

  function getCustomField(member, keys) {
    keys = Array.isArray(keys) ? keys : [keys];
    keys = keys.map(function (k) { return (k || "").toString(); }).filter(Boolean);

    if (!member || typeof member !== "object") return null;
    var cf = member.customFields;

    // object form
    if (cf && typeof cf === "object" && !Array.isArray(cf)) {
      for (var i = 0; i < keys.length; i++) {
        var k = keys[i];
        if (Object.prototype.hasOwnProperty.call(cf, k)) return cf[k];
        var tk = safeToken(k);
        if (tk && Object.prototype.hasOwnProperty.call(cf, tk)) return cf[tk];
      }
    }

    // array form
    if (Array.isArray(cf)) {
      for (var j = 0; j < cf.length; j++) {
        var row = cf[j] || {};
        var rk = row.key || row.slug || row.name;
        if (!rk) continue;
        var rkt = safeToken(rk);
        for (var x = 0; x < keys.length; x++) {
          if (rk === keys[x] || rkt === safeToken(keys[x])) return row.value;
        }
      }
    }
    return null;
  }

  function inferBaseFromPlanNames(member) {
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

    var base = "guest";
    names.forEach(function (n) {
      var s = (n || "").toLowerCase();
      if (s.indexOf("black") >= 0) base = "blackcard";
      else if (base === "guest" && s.indexOf("premium") >= 0) base = "premium";
      else if (base === "guest" && s.indexOf("standard") >= 0) base = "standard";
    });
    return normalizeBase(base);
  }

  function computeEntitlement(member) {
    // expiry gates (FINAL + LEGACY)
    var status = (getCustomField(member, ["status", "Status"]) || "").toString().trim().toLowerCase();

    var expireRaw =
      getCustomField(member, [
        "expire_at", "Expire At", "ExpireAt",
        "expire-at", "Expire-At" // legacy hyphen
      ]) || "";

    var expireEpoch = toEpochMaybe(expireRaw);

    var expired =
      (status === "expired" || status === "inactive") ||
      (expireEpoch > 0 && expireEpoch < now());

    if (expired) return { role: "guest", badge: "guest", base: "guest" };

    // FINAL fields
    var baseTier = normalizeBase(getCustomField(member, ["base_tier", "baseTier"]) || "");
    var badgeTier = normalizeBadge(getCustomField(member, ["badge_tier", "badgeTier"]) || "");

    // legacy: tier -> badge_tier
    if (badgeTier === "guest") {
      var legacyTier = normalizeBadge(getCustomField(member, ["tier", "Tier"]) || "");
      if (legacyTier !== "guest") badgeTier = legacyTier;
    }

    // approvals (FINAL)
    var vipApproved = truthy(getCustomField(member, ["vip_approved", "vipApproved"]) || "");
    var svipApproved = truthy(getCustomField(member, ["svip_approved", "svipApproved"]) || "");

    // fallback base from plan names
    if (baseTier === "guest") {
      var inferred = inferBaseFromPlanNames(member);
      if (inferred !== "guest") baseTier = inferred;
    }

    // badge precedence (locked)
    // 1) badge_tier explicit wins
    // 2) paid blackcard => blackcard
    // 3) svipApproved => svip
    // 4) vipApproved => vip
    // 5) else badge = base
    if (badgeTier === "guest") {
      if (baseTier === "blackcard") badgeTier = "blackcard";
      else if (svipApproved) badgeTier = "svip";
      else if (vipApproved) badgeTier = "vip";
      else badgeTier = (baseTier === "guest") ? "guest" : baseTier;
    }

    // role = access level (SVIP + Blackcard = blackcard)
    var role = "guest";
    if (baseTier === "blackcard" || badgeTier === "blackcard" || badgeTier === "svip" || svipApproved) role = "blackcard";
    else if (badgeTier === "vip" || vipApproved) role = "vip";
    else role = baseToRole(baseTier);

    return normalizeTriplet(role, badgeTier, baseTier);
  }

  function resolveMemberstack(done) {
    var start = now();
    var timeoutAt = start + cfg.memberstack.timeoutMs;

    function finish(ent) { try { done && done(ent); } catch (_) {} }

    function poll() {
      var ms = getMemberstackInstance();
      var p = null;
      try { p = extractMemberPromise(ms); } catch (_) { p = null; }

      if (p && typeof p.then === "function") {
        p.then(function (member) { finish(computeEntitlement(member || {})); })
          .catch(function () { finish(null); });
        return;
      }

      if (now() >= timeoutAt) { finish(null); return; }
      setTimeout(poll, cfg.memberstack.pollMs);
    }

    try {
      var ms0 = getMemberstackInstance();
      if (ms0 && typeof ms0.onReady === "function") {
        var doneOnce = false;
        var t = setTimeout(function () { if (!doneOnce) { doneOnce = true; finish(null); } }, cfg.memberstack.timeoutMs);
        ms0.onReady(function () {
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
    // debug toggle
    try {
      var p = qs();
      var dbg = (p.get && p.get("debug")) ? (p.get("debug") || "") : "";
      if (dbg === "1" || dbg === "true") cfg.debug = true;
    } catch (_) {}

    captureIntent();

    var lang = setLang(getLang());
    bindLangButtons();

    // fast init from storage
    var roleS = "guest", badgeS = "guest", baseS = "guest";
    try { roleS = window.localStorage.getItem(cfg.storage.role) || "guest"; } catch (_) {}
    try { badgeS = window.localStorage.getItem(cfg.storage.badge) || "guest"; } catch (_) {}
    try { baseS = window.localStorage.getItem(cfg.storage.base) || "guest"; } catch (_) {}

    setEntitlement(roleS, badgeS, baseS);

    observeLocks();

    // authoritative from Memberstack
    resolveMemberstack(function (ent) {
      if (ent && ent.role) setEntitlement(ent.role, ent.badge, ent.base);

      try {
        window.dispatchEvent(new CustomEvent("mmd:ready", {
          detail: { role: STATE.role, badge: STATE.badge, base: STATE.base, lang: lang, version: VERSION }
        }));
      } catch (_) {}

      log("ready", { role: STATE.role, badge: STATE.badge, base: STATE.base });
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bootstrap);
  else bootstrap();

})(window, document);
