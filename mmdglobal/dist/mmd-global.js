/* =========================================
   MMD PRIVÉ — Global Bootstrap (mmd.global.js)
   v2026-LOCK-05 (ONE FILE • cycle_start_at is authoritative)

   Locked Spec
   - base_tier (paid base): guest | 7days | standard | premium | blackcard
   - tier (badge): guest | standard | premium | vip | svip | blackcard
   - role (access order): guest < standard < premium < vip < blackcard

   Expired rule (locked):
   - if expired => role=guest (web access cut)
   - keep base/badge for renew messaging (data-user-base / data-user-badge)

   Upgrade rules (locked flags):
   - Standard -> Premium (+2,000):
       eligible only if:
         status=active AND base_tier=standard AND now <= cycle_start_at + 180 days
       expire_at MUST stay unchanged (handled by Worker/payment logic; JS only exposes eligibility)
   - 7days -> Premium:
       eligible while status=active AND base_tier=7days
========================================= */

(function (window, document) {
  "use strict";

  var VERSION = "v2026-LOCK-05";

  var DEFAULTS = {
    debug: false,
    memberstackAppId: "app_cmjajuv1600150su284ov77w1",

    // storage keys
    roleStorageKey: "mmd_user_role",
    badgeStorageKey: "mmd_user_badge",
    baseStorageKey: "mmd_user_base",
    statusStorageKey: "mmd_user_status",
    cycleStartStorageKey: "mmd_user_cycle_start_at",
    expireAtStorageKey: "mmd_user_expire_at",
    intentStorageKey: "mmd_intent",
    langKeys: ["mmd_lang", "lang"],

    supportedLangs: ["th", "en", "zh", "ja"],
    defaultLang: "th",

    // rank order
    roleRank: { guest: 0, standard: 1, premium: 2, vip: 3, blackcard: 4, svip: 4 },

    // mapping
    badgeToRoleMap: {
      guest: "guest",
      standard: "standard",
      premium: "premium",
      vip: "vip",
      svip: "blackcard",
      blackcard: "blackcard"
    },
    baseToRoleMap: {
      guest: "guest",
      "7days": "guest",
      standard: "standard",
      premium: "premium",
      blackcard: "blackcard"
    },

    // upgrade windows
    upgradeWindowDaysStandardToPremium: 180,

    // memberstack resolve
    memberstack: { timeoutMs: 6000, pollMs: 250 },

    // lock selectors
    lock: {
      selector:
        "[data-mmd-min-role],[data-mmd-show],[data-mmd-hide]," +
        "[data-mmd-show-badge],[data-mmd-hide-badge]," +
        "[data-mmd-show-base],[data-mmd-hide-base]," +
        "[data-mmd-show-status],[data-mmd-hide-status]," +
        "[data-mmd-show-flag],[data-mmd-hide-flag]," +
        "[data-mmd-show-tier],[data-mmd-hide-tier]" // aliases -> badge
    }
  };

  // ----------------------------
  // helpers
  // ----------------------------
  function now() { return Date.now ? Date.now() : +new Date(); }
  function daysMs(d) { return d * 24 * 60 * 60 * 1000; }

  function safeJsonParse(s) { try { return JSON.parse(s); } catch (_) { return null; } }
  function isPlainObject(x) {
    return !!x && typeof x === "object" && Object.prototype.toString.call(x) === "[object Object]";
  }
  function shallowMerge(a, b) {
    var out = {}, k;
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
    if (!isFinite(t)) return 0;
    return t;
  }

  // ----------------------------
  // namespace + config
  // ----------------------------
  var MMD = window.MMD = window.MMD || {};
  MMD.global = MMD.global || {};
  MMD.global.version = VERSION;

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
  // robust Memberstack getter (one-file)
  // ----------------------------
  function mmdSleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function mmdWithTimeout(promise, timeoutMs, label) {
    var t;
    var timeout = new Promise(function (_, rej) {
      t = setTimeout(function () {
        rej(new Error("Timeout: " + (label || "promise") + " (" + timeoutMs + "ms)"));
      }, timeoutMs);
    });
    try {
      return await Promise.race([promise, timeout]);
    } finally {
      clearTimeout(t);
    }
  }

  function mmdUnwrapMember(res) {
    if (!res) return null;
    if (res.data && typeof res.data === "object") {
      if (res.data.data && typeof res.data.data === "object") return res.data.data;
      return res.data;
    }
    if (typeof res === "object") return res;
    return null;
  }

  async function mmdGetCurrentMember(opts) {
    opts = opts || {};
    var timeoutMs = opts.timeoutMs ?? MMD.config.memberstack.timeoutMs;
    var pollMs = opts.pollMs ?? MMD.config.memberstack.pollMs;
    var debug = !!opts.debug || !!MMD.config.debug;

    var started = now();
    var deadline = started + timeoutMs;

    var dlog = function () {
      if (!debug) return;
      try {
        var a = Array.prototype.slice.call(arguments);
        a.unshift("[mmdGetCurrentMember]");
        console.log.apply(console, a);
      } catch (_) {}
    };

    async function tryOnce() {
      // 1) Memberstack DOM (Webflow common)
      try {
        if (window.$memberstackDom && typeof window.$memberstackDom.getCurrentMember === "function") {
          var r1 = await mmdWithTimeout(
            window.$memberstackDom.getCurrentMember(),
            Math.min(1500, Math.max(400, timeoutMs)),
            "$memberstackDom.getCurrentMember"
          );
          return mmdUnwrapMember(r1);
        }
      } catch (e1) { dlog("dom variant failed:", e1 && e1.message ? e1.message : e1); }

      // 2) SDK variants
      var ms = window.memberstack || window.MemberStack || window.$memberstack || null;
      if (ms) {
        try {
          if (typeof ms.getCurrentMember === "function") {
            var r2 = await mmdWithTimeout(ms.getCurrentMember(), 1500, "ms.getCurrentMember");
            return mmdUnwrapMember(r2);
          }
        } catch (e2) { dlog("getCurrentMember failed:", e2 && e2.message ? e2.message : e2); }

        try {
          if (typeof ms.getMemberJSON === "function") {
            var r3 = await mmdWithTimeout(ms.getMemberJSON(), 1500, "ms.getMemberJSON");
            return mmdUnwrapMember(r3);
          }
        } catch (e3) { dlog("getMemberJSON failed:", e3 && e3.message ? e3.message : e3); }

        try {
          if (typeof ms.getMember === "function") {
            var r4 = await mmdWithTimeout(ms.getMember(), 1500, "ms.getMember");
            return mmdUnwrapMember(r4);
          }
        } catch (e4) { dlog("getMember failed:", e4 && e4.message ? e4.message : e4); }

        if (ms.member && typeof ms.member === "object") return ms.member;
      }

      return null;
    }

    var member = await tryOnce();
    if (member) return member;

    while (now() < deadline) {
      await mmdSleep(pollMs);
      member = await tryOnce();
      if (member) return member;
    }

    return null;
  }

  MMD.global.mmdGetCurrentMember = mmdGetCurrentMember;

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
  // normalize: role/base/badge/status
  // ----------------------------
  function normalizeRole(role) {
    role = safeToken(role);
    if (role === "svip") role = "blackcard";
    if (!role) return "guest";
    if (!MMD.config.roleRank.hasOwnProperty(role)) return "guest";
    return role;
  }

  function normalizeBase(base) {
    base = safeToken(base);
    if (base === "svip") base = "blackcard";
    if (!base) return "guest";
    if (base === "7days") return "7days";
    if (base === "blackcard" || base === "premium" || base === "standard" || base === "guest") return base;
    return "guest";
  }

  function normalizeBadge(badge) {
    badge = safeToken(badge);
    if (badge === "svip") return "svip";
    if (badge === "blackcard" || badge === "vip" || badge === "premium" || badge === "standard" || badge === "guest") return badge;
    if (badge === "black_card") return "blackcard";
    return "";
  }

  function normalizeStatus(status) {
    status = (status || "").toString().trim().toLowerCase();
    if (status === "expired" || status === "inactive") return "expired";
    if (status === "active") return "active";
    return "";
  }

  function roleRank(role) { return (MMD.config.roleRank[normalizeRole(role)] || 0); }
  function baseToRole(base) { return normalizeRole(MMD.config.baseToRoleMap[normalizeBase(base)] || "guest"); }
  function badgeToRole(badge) { return normalizeRole(MMD.config.badgeToRoleMap[normalizeBadge(badge)] || "guest"); }

  // ----------------------------
  // read member custom fields (robust)
  // ----------------------------
  function getCustomField(member, keyList) {
    if (!member || typeof member !== "object") return null;

    var keys = (Array.isArray(keyList) ? keyList : [keyList])
      .map(function (k) { return (k || "").toString(); })
      .filter(Boolean);

    var cf = member.customFields;
    if (cf && typeof cf === "object" && !Array.isArray(cf)) {
      for (var i = 0; i < keys.length; i++) {
        var k1 = keys[i];
        if (Object.prototype.hasOwnProperty.call(cf, k1)) return cf[k1];
        var tk = safeToken(k1);
        if (tk && Object.prototype.hasOwnProperty.call(cf, tk)) return cf[tk];
      }
    }

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
    // last resort fallback (not for cycle_start_at)
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
      if (s.indexOf("black") >= 0 || s.indexOf("svip") >= 0) { base = "blackcard"; badgeCandidate = badgeCandidate || "blackcard"; return; }
      if (s.indexOf("premium") >= 0) { base = base || "premium"; badgeCandidate = badgeCandidate || "premium"; return; }
      if (s.indexOf("standard") >= 0) { base = base || "standard"; badgeCandidate = badgeCandidate || "standard"; return; }
      if (s.indexOf("7") >= 0 && s.indexOf("day") >= 0) { base = base || "7days"; badgeCandidate = badgeCandidate || "guest"; return; }
    });

    return { base: base, badgeCandidate: badgeCandidate };
  }

  // ----------------------------
  // cycle_start_at resolver (authoritative)
  // ----------------------------
  function resolveCycleStartEpoch(member) {
    // 1) authoritative custom field
    var csRaw = getCustomField(member, [
      "cycle_start_at", "cycleStartAt",
      "base_started_at", "baseStartedAt"
    ]);
    var cs = toEpochMaybe(csRaw);
    if (cs) return cs;

    // 2) optional fallback: member.createdAt
    var created = toEpochMaybe(member && (member.createdAt || member.created_at || member.created));
    if (created) return created;

    // if still missing, return 0 (upgrade eligibility will be false)
    return 0;
  }

  // ----------------------------
  // entitlement compute
  // ----------------------------
  function computeEntitlement(member) {
    member = member || {};

    var inferred = inferFromPlanNames(member);

    var cfTier = normalizeBadge(getCustomField(member, ["tier", "Tier"]) || "");
    var cfBase = normalizeBase(getCustomField(member, ["base_tier", "baseTier", "base", "package"]) || "");

    var vipApproved = truthy(getCustomField(member, ["vip_approved", "vipApproved", "vip"]) || "");
    var svipApproved = truthy(getCustomField(member, ["svip_approved", "svipApproved", "svip"]) || "");

    var statusRaw = getCustomField(member, ["status", "Status"]) || "";
    var status = normalizeStatus(statusRaw);

    var expireAtRaw = getCustomField(member, ["expire_at", "Expire At", "ExpireAt"]) || "";
    var expireEpoch = toEpochMaybe(expireAtRaw);

    var expiredByDate = (expireEpoch > 0 && expireEpoch < now());
    var expiredByStatus = (status === "expired");
    var isExpired = expiredByDate || expiredByStatus;

    var base = cfBase || inferred.base || "guest";
    base = normalizeBase(base);

    // if base missing but tier is a base-like value, treat it as base
    if ((base === "guest" || !base) && (cfTier === "standard" || cfTier === "premium" || cfTier === "blackcard")) {
      base = normalizeBase(cfTier);
    }

    // badge precedence (keep for messaging even if expired)
    var badge = cfTier || "";
    if (!badge) {
      if (base === "blackcard") badge = "blackcard";          // paid 25k
      else if (svipApproved) badge = "svip";                  // selected
      else if (vipApproved) badge = "vip";
      else badge = normalizeBadge(inferred.badgeCandidate) || normalizeBadge(base) || "guest";
    }
    badge = normalizeBadge(badge) || "guest";

    // role (expired => guest)
    var role = "guest";
    if (!isExpired) {
      if (badge === "svip" || badge === "blackcard" || base === "blackcard" || svipApproved) role = "blackcard";
      else if (badge === "vip" || vipApproved) role = "vip";
      else role = baseToRole(base);
    } else {
      role = "guest";
      status = "expired";
    }

    // authoritative cycle start
    var cycleStartEpoch = resolveCycleStartEpoch(member);

    // flags
    var flags = {};
    flags.active = !isExpired;
    flags.expired = isExpired;

    // Standard -> Premium upgrade eligibility (180 days) — requires cycle_start_at
    var win180 = daysMs(MMD.config.upgradeWindowDaysStandardToPremium);
    flags.upgrade_std_to_premium =
      (!isExpired) &&
      (base === "standard") &&
      (cycleStartEpoch > 0) &&
      (now() <= (cycleStartEpoch + win180));

    flags.std_upgrade_days_left = 0;
    if (!isExpired && base === "standard" && cycleStartEpoch > 0) {
      var msLeft = (cycleStartEpoch + win180) - now();
      flags.std_upgrade_days_left = Math.max(0, Math.ceil(msLeft / daysMs(1)));
    }

    // 7days -> premium upgrade eligibility (while active 7days)
    flags.upgrade_7days_to_premium =
      (!isExpired) &&
      (base === "7days");

    flags.days_left_7days = 0;
    if (!isExpired && base === "7days" && expireEpoch > 0) {
      var ms7 = expireEpoch - now();
      flags.days_left_7days = Math.max(0, Math.ceil(ms7 / daysMs(1)));
    }

    return {
      role: normalizeRole(role),
      badge: badge,
      base: base,
      status: status || (isExpired ? "expired" : "active"),
      expire_at: expireEpoch || 0,
      cycle_start_at: cycleStartEpoch || 0,
      flags: flags
    };
  }

  // ----------------------------
  // DOM dataset + classes
  // ----------------------------
  function removePrefixedClasses(el, prefix) {
    if (!el || !el.classList) return;
    try {
      Array.prototype.slice.call(el.classList).forEach(function (c) {
        if (c.indexOf(prefix) === 0) el.classList.remove(c);
      });
    } catch (_) {}
  }

  function setDatasetEnt(ent) {
    var role = normalizeRole(ent.role);
    var badge = normalizeBadge(ent.badge) || "guest";
    var base = normalizeBase(ent.base);
    var status = (ent.status === "expired") ? "expired" : "active";

    var flags = ent.flags || {};
    var fStdUp = flags.upgrade_std_to_premium ? "1" : "0";
    var f7Up = flags.upgrade_7days_to_premium ? "1" : "0";

    var cs = (ent.cycle_start_at || 0).toString();
    var ex = (ent.expire_at || 0).toString();

    var stdLeft = (flags.std_upgrade_days_left || 0).toString();
    var d7Left = (flags.days_left_7days || 0).toString();

    // html
    try {
      var html = document.documentElement;
      if (html) {
        html.setAttribute("data-user-role", role);
        html.setAttribute("data-user-badge", badge);
        html.setAttribute("data-user-base", base);
        html.setAttribute("data-user-status", status);

        html.setAttribute("data-user-cycle-start-at", cs);
        html.setAttribute("data-user-expire-at", ex);

        html.setAttribute("data-flag-upgrade-std-premium", fStdUp);
        html.setAttribute("data-flag-upgrade-7days-premium", f7Up);
        html.setAttribute("data-days-left-std-upgrade", stdLeft);
        html.setAttribute("data-days-left-7days", d7Left);

        removePrefixedClasses(html, "mmd-role-");
        removePrefixedClasses(html, "mmd-badge-");
        removePrefixedClasses(html, "mmd-base-");
        removePrefixedClasses(html, "mmd-status-");

        html.classList.add("mmd-role-" + role);
        html.classList.add("mmd-badge-" + badge);
        html.classList.add("mmd-base-" + base);
        html.classList.add("mmd-status-" + status);
      }
    } catch (_) {}

    // body
    try {
      var body = document.body;
      if (body) {
        body.setAttribute("data-user-role", role);
        body.setAttribute("data-user-badge", badge);
        body.setAttribute("data-user-base", base);
        body.setAttribute("data-user-status", status);

        body.setAttribute("data-user-cycle-start-at", cs);
        body.setAttribute("data-user-expire-at", ex);

        body.setAttribute("data-flag-upgrade-std-premium", fStdUp);
        body.setAttribute("data-flag-upgrade-7days-premium", f7Up);
        body.setAttribute("data-days-left-std-upgrade", stdLeft);
        body.setAttribute("data-days-left-7days", d7Left);

        removePrefixedClasses(body, "mmd-role-");
        removePrefixedClasses(body, "mmd-badge-");
        removePrefixedClasses(body, "mmd-base-");
        removePrefixedClasses(body, "mmd-status-");

        body.classList.add("mmd-role-" + role);
        body.classList.add("mmd-badge-" + badge);
        body.classList.add("mmd-base-" + base);
        body.classList.add("mmd-status-" + status);
      }
    } catch (_) {}
  }

  // ----------------------------
  // lock engine (role/badge/base/status/flags)
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

    var ent = MMD.global.getEntitlement();
    var role = normalizeRole(ent.role);
    var badge = normalizeBadge(ent.badge) || "guest";
    var base = normalizeBase(ent.base);
    var status = (ent.status === "expired") ? "expired" : "active";
    var flags = ent.flags || {};

    var nodes;
    try { nodes = root.querySelectorAll(MMD.config.lock.selector); }
    catch (_) { return; }
    if (!nodes || !nodes.length) return;

    Array.prototype.forEach.call(nodes, function (el) {
      try {
        // 1) min-role strongest
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

        // 3) show/hide by badge (tier alias)
        var showBadges = parseList(el.getAttribute("data-mmd-show-badge") || "");
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

        // 5) show/hide by status
        var showStatus = parseList(el.getAttribute("data-mmd-show-status") || "");
        if (showStatus.length) {
          if (showStatus.indexOf(status) >= 0) showEl(el);
          else hideEl(el);
          return;
        }
        var hideStatus = parseList(el.getAttribute("data-mmd-hide-status") || "");
        if (hideStatus.length) {
          if (hideStatus.indexOf(status) >= 0) hideEl(el);
          else showEl(el);
          return;
        }

        // 6) show/hide by flags
        var showFlags = parseList(el.getAttribute("data-mmd-show-flag") || "");
        if (showFlags.length) {
          var ok = showFlags.some(function (f) {
            if (f === "upgrade-std-premium") return !!flags.upgrade_std_to_premium;
            if (f === "upgrade-7days-premium") return !!flags.upgrade_7days_to_premium;
            if (f === "active") return !flags.expired;
            if (f === "expired") return !!flags.expired;
            return false;
          });
          if (ok) showEl(el); else hideEl(el);
          return;
        }

        var hideFlags = parseList(el.getAttribute("data-mmd-hide-flag") || "");
        if (hideFlags.length) {
          var bad = hideFlags.some(function (f) {
            if (f === "upgrade-std-premium") return !!flags.upgrade_std_to_premium;
            if (f === "upgrade-7days-premium") return !!flags.upgrade_7days_to_premium;
            if (f === "active") return !flags.expired;
            if (f === "expired") return !!flags.expired;
            return false;
          });
          if (bad) hideEl(el); else showEl(el);
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
  // state + public API
  // ----------------------------
  var _ent = {
    role: "guest",
    badge: "guest",
    base: "guest",
    status: "active",
    cycle_start_at: 0,
    expire_at: 0,
    flags: { active: true, expired: false }
  };

  function persistEnt(ent) {
    try { window.localStorage.setItem(MMD.config.roleStorageKey, normalizeRole(ent.role)); } catch (_) {}
    try { window.localStorage.setItem(MMD.config.badgeStorageKey, normalizeBadge(ent.badge) || "guest"); } catch (_) {}
    try { window.localStorage.setItem(MMD.config.baseStorageKey, normalizeBase(ent.base)); } catch (_) {}
    try { window.localStorage.setItem(MMD.config.statusStorageKey, (ent.status === "expired") ? "expired" : "active"); } catch (_) {}
    try { window.localStorage.setItem(MMD.config.cycleStartStorageKey, String(ent.cycle_start_at || 0)); } catch (_) {}
    try { window.localStorage.setItem(MMD.config.expireAtStorageKey, String(ent.expire_at || 0)); } catch (_) {}
  }

  function applyEntitlement(ent, opts) {
    opts = opts || {};
    ent = ent || _ent;

    var norm = {
      role: normalizeRole(ent.role),
      badge: normalizeBadge(ent.badge) || "guest",
      base: normalizeBase(ent.base),
      status: (ent.status === "expired") ? "expired" : "active",
      cycle_start_at: ent.cycle_start_at || 0,
      expire_at: ent.expire_at || 0,
      flags: ent.flags || {}
    };

    _ent = norm;

    if (opts.persist !== false) persistEnt(norm);

    setDatasetEnt(norm);
    applyLocks();

    try {
      if (window.MMD_I18N && typeof window.MMD_I18N.apply === "function") {
        window.MMD_I18N.apply(getLang());
      }
    } catch (_) {}

    try {
      window.dispatchEvent(new CustomEvent("mmd:entitlement", { detail: { entitlement: norm, version: VERSION } }));
    } catch (_) {}

    log("entitlement applied:", norm);
    return norm;
  }

  function fromBody() {
    var out = { role: "", badge: "", base: "", status: "", cycle_start_at: 0, expire_at: 0 };
    try {
      var b = document.body;
      if (!b) return out;
      out.role = normalizeRole(b.getAttribute("data-user-role") || "");
      out.badge = normalizeBadge(b.getAttribute("data-user-badge") || "") || normalizeBadge(b.getAttribute("data-user-tier") || "");
      out.base = normalizeBase(b.getAttribute("data-user-base") || "");
      out.status = normalizeStatus(b.getAttribute("data-user-status") || "");
      out.cycle_start_at = toEpochMaybe(b.getAttribute("data-user-cycle-start-at") || "");
      out.expire_at = toEpochMaybe(b.getAttribute("data-user-expire-at") || "");
    } catch (_) {}
    return out;
  }

  function fromStorage() {
    var out = { role: "", badge: "", base: "", status: "", cycle_start_at: 0, expire_at: 0 };
    try { out.role = normalizeRole(window.localStorage.getItem(MMD.config.roleStorageKey) || ""); } catch (_) {}
    try { out.badge = normalizeBadge(window.localStorage.getItem(MMD.config.badgeStorageKey) || ""); } catch (_) {}
    try { out.base = normalizeBase(window.localStorage.getItem(MMD.config.baseStorageKey) || ""); } catch (_) {}
    try { out.status = normalizeStatus(window.localStorage.getItem(MMD.config.statusStorageKey) || ""); } catch (_) {}
    try { out.cycle_start_at = toEpochMaybe(window.localStorage.getItem(MMD.config.cycleStartStorageKey) || ""); } catch (_) {}
    try { out.expire_at = toEpochMaybe(window.localStorage.getItem(MMD.config.expireAtStorageKey) || ""); } catch (_) {}
    return out;
  }

  MMD.global.getEntitlement = function () { return _ent; };
  MMD.global.applyLocks = applyLocks;

  MMD.global.getRole = function () { return normalizeRole(_ent.role); };
  MMD.global.getBadge = function () { return normalizeBadge(_ent.badge) || "guest"; };
  MMD.global.getBase = function () { return normalizeBase(_ent.base); };
  MMD.global.getStatus = function () { return (_ent.status === "expired") ? "expired" : "active"; };
  MMD.global.getFlags = function () { return _ent.flags || {}; };

  MMD.global.getLang = getLang;
  MMD.global.setLang = setLang;
  MMD.global.getIntent = getIntent;
  MMD.global.clearIntent = clearIntent;

  // ----------------------------
  // bootstrap
  // ----------------------------
  async function bootstrap() {
    try {
      var p = qs();
      var dbg = (p.get && p.get("debug")) ? p.get("debug") : "";
      if (dbg === "1" || dbg === "true") MMD.config.debug = true;
    } catch (_) {}

    captureIntentFromUrl();
    var lang = setLang(getLang(), { persist: true });
    bindLangButtons();

    // initial: body > storage > defaults
    var b = fromBody();
    var s = fromStorage();

    var initBase = b.base || s.base || "guest";
    var initBadge = b.badge || s.badge || normalizeBadge(initBase) || "guest";
    var initRole = b.role || s.role || badgeToRole(initBadge) || baseToRole(initBase);
    var initStatus = (b.status || s.status || "active");

    applyEntitlement({
      role: initRole,
      badge: initBadge,
      base: initBase,
      status: initStatus,
      cycle_start_at: b.cycle_start_at || s.cycle_start_at || 0,
      expire_at: b.expire_at || s.expire_at || 0,
      flags: { active: (initStatus !== "expired"), expired: (initStatus === "expired") }
    }, { persist: true });

    observeLocks();

    var member = null;
    try {
      member = await mmdGetCurrentMember({
        timeoutMs: MMD.config.memberstack.timeoutMs,
        pollMs: MMD.config.memberstack.pollMs,
        debug: MMD.config.debug
      });
    } catch (_) {}

    if (member) {
      var ent = computeEntitlement(member);
      applyEntitlement(ent, { persist: true });
    } else {
      log("member not found; kept local entitlement");
    }

    try {
      window.dispatchEvent(new CustomEvent("mmd:ready", {
        detail: { entitlement: MMD.global.getEntitlement(), lang: lang, version: VERSION }
      }));
    } catch (_) {}
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { bootstrap(); });
  } else {
    bootstrap();
  }

})(window, document);
