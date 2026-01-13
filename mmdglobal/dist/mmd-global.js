/* =========================================
   MMD PRIVÉ — Global Bootstrap (mmd.global.js)
   v2026-LOCK-01
   - role resolve: body[data-user-role] -> localStorage -> Memberstack (best-effort)
   - role lock: data-mmd-min-role / data-mmd-show / data-mmd-hide
   - lang bootstrap: reads/writes BOTH mmd_lang + lang
   - intent capture: ?intent= -> localStorage.mmd_intent
   ========================================= */

(function (window, document) {
  "use strict";

  var VERSION = "v2026-LOCK-01";

  var DEFAULTS = {
    debug: false,

    // storage keys
    roleStorageKey: "mmd_user_role",
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

    // memberstack polling
    memberstack: {
      timeoutMs: 4500,
      pollMs: 250
    },

    // DOM lock behavior
    lock: {
      selector: "[data-mmd-min-role],[data-mmd-show],[data-mmd-hide]",
      attrMin: "data-mmd-min-role",
      attrShow: "data-mmd-show",
      attrHide: "data-mmd-hide",
      hiddenStyle: "display:none !important;"
    }
  };

  // ----------------------------
  // small helpers
  // ----------------------------
  function now() { return Date.now ? Date.now() : +new Date(); }

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch (_) { return null; }
  }

  function qs() {
    try { return new URLSearchParams(window.location.search || ""); }
    catch (_) {
      // very old fallback
      var out = {};
      var q = (window.location.search || "").replace(/^\?/, "");
      if (!q) return {
        get: function (k) { return out[k] || null; }
      };
      q.split("&").forEach(function (p) {
        var a = p.split("=");
        out[decodeURIComponent(a[0] || "")] = decodeURIComponent(a[1] || "");
      });
      return { get: function (k) { return out[k] || null; } };
    }
  }

  function log() {
    if (!MMD.config.debug) return;
    try {
      var args = Array.prototype.slice.call(arguments);
      args.unshift("[MMD.global " + VERSION + "]");
      console.log.apply(console, args);
    } catch (_) {}
  }

  function isSupportedLang(lang) {
    return !!lang && MMD.config.supportedLangs.indexOf(lang) >= 0;
  }

  function normalizeRole(role) {
    role = (role || "").toString().trim().toLowerCase();
    if (role === "svip") role = "blackcard";
    if (!role) return "guest";
    if (!MMD.config.roleRank.hasOwnProperty(role)) return "guest";
    return role;
  }

  function roleRank(role) {
    role = normalizeRole(role);
    return MMD.config.roleRank[role] || 0;
  }

  function setDatasetRole(role) {
    var r = normalizeRole(role);

    // set on <html> + <body> for CSS/JS usage
    try {
      document.documentElement.setAttribute("data-user-role", r);
      document.documentElement.classList.add("mmd-role-" + r);
    } catch (_) {}

    try {
      if (document.body) {
        document.body.setAttribute("data-user-role", r);
        document.body.classList.add("mmd-role-" + r);
      }
    } catch (_) {}
  }

  // ----------------------------
  // public API namespace
  // ----------------------------
  var MMD = window.MMD = window.MMD || {};
  MMD.global = MMD.global || {};
  MMD.global.version = VERSION;

  // config merge (optional)
  var cfg = DEFAULTS;
  try {
    // allow window.MMD_CONFIG to override
    if (window.MMD_CONFIG && typeof window.MMD_CONFIG === "object") {
      cfg = shallowMerge(cfg, window.MMD_CONFIG);
    }
    // allow html[data-mmd-config='json']
    var htmlCfg = document.documentElement.getAttribute("data-mmd-config");
    if (htmlCfg) {
      var parsed = safeJsonParse(htmlCfg);
      if (parsed && typeof parsed === "object") {
        cfg = shallowMerge(cfg, parsed);
      }
    }
  } catch (_) {}

  MMD.config = cfg;

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

  function isPlainObject(x) {
    return !!x && typeof x === "object" && Object.prototype.toString.call(x) === "[object Object]";
  }

  // ----------------------------
  // language
  // ----------------------------
  function getLang() {
    // URL override: ?lang=
    var p = qs();
    var qLang = (p.get && p.get("lang")) ? (p.get("lang") || "").toString().trim().toLowerCase() : "";
    if (isSupportedLang(qLang)) return qLang;

    // storage
    var i;
    for (i = 0; i < MMD.config.langKeys.length; i++) {
      try {
        var v = (window.localStorage.getItem(MMD.config.langKeys[i]) || "").toString().trim().toLowerCase();
        if (isSupportedLang(v)) return v;
      } catch (_) {}
    }

    // navigator hint
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

    // persist both keys
    if (opts.persist !== false) {
      try { window.localStorage.setItem("mmd_lang", lang); } catch (_) {}
      try { window.localStorage.setItem("lang", lang); } catch (_) {}
    }

    // set html lang attribute
    try { document.documentElement.setAttribute("lang", lang); } catch (_) {}

    // notify i18n core if present (best-effort)
    try {
      if (window.MMD_I18N) {
        if (typeof window.MMD_I18N.setLang === "function") window.MMD_I18N.setLang(lang);
        else if (typeof window.MMD_I18N.apply === "function") window.MMD_I18N.apply(lang);
      } else if (typeof window.mmd_i18n_apply === "function") {
        window.mmd_i18n_apply(lang);
      }
    } catch (_) {}

    // broadcast
    try {
      window.dispatchEvent(new CustomEvent("mmd:lang", { detail: { lang: lang } }));
    } catch (_) {}

    return lang;
  }

  function bindLangButtons() {
    // compatible with your existing pattern:
    // 1) .mmd-lang-btn[data-set-lang="th"]
    // 2) any element [data-set-lang="en"]
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
        var lang = (b.getAttribute("data-set-lang") || "").toLowerCase();
        var applied = setLang(lang);
        activate(applied);
      });
    });

    // initial active state
    activate(getLang());
  }

  // ----------------------------
  // intent capture
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
  // role resolve (best-effort)
  // ----------------------------
  var _role = "guest";

  function getRole() { return normalizeRole(_role); }

  function setRole(role, opts) {
    opts = opts || {};
    role = normalizeRole(role);
    _role = role;

    // persist
    if (opts.persist !== false) {
      try { window.localStorage.setItem(MMD.config.roleStorageKey, role); } catch (_) {}
    }

    setDatasetRole(role);
    applyLocks(); // immediately apply

    // broadcast
    try {
      window.dispatchEvent(new CustomEvent("mmd:role", { detail: { role: role } }));
    } catch (_) {}

    // re-apply i18n if it depends on role suffix (key.{role})
    try {
      if (window.MMD_I18N && typeof window.MMD_I18N.apply === "function") {
        window.MMD_I18N.apply(getLang());
      }
    } catch (_) {}

    log("role set:", role);
    return role;
  }

  function roleFromBody() {
    try {
      var b = document.body;
      if (!b) return "";
      var r = (b.getAttribute("data-user-role") || "").toString().trim().toLowerCase();
      return normalizeRole(r);
    } catch (_) { return ""; }
  }

  function roleFromStorage() {
    try {
      var r = (window.localStorage.getItem(MMD.config.roleStorageKey) || "").toString().trim().toLowerCase();
      return normalizeRole(r);
    } catch (_) { return ""; }
  }

  function chooseHigherRole(a, b) {
    a = normalizeRole(a);
    b = normalizeRole(b);
    return roleRank(a) >= roleRank(b) ? a : b;
  }

  function roleFromMemberObject(member) {
    if (!member || typeof member !== "object") return "";

    // direct custom role hints
    var direct =
      (member.role || member.tier || (member.customFields && (member.customFields.role || member.customFields.tier))) || "";
    direct = (direct || "").toString().toLowerCase();
    if (direct) {
      if (direct.indexOf("black") >= 0 || direct.indexOf("svip") >= 0) return "blackcard";
      if (direct.indexOf("vip") >= 0) return "vip";
      if (direct.indexOf("premium") >= 0) return "premium";
      if (direct.indexOf("standard") >= 0) return "standard";
    }

    // plan lists (Memberstack schema varies by version)
    var names = [];

    function pushName(x) {
      if (!x) return;
      var s = (x.name || x.planName || x.title || x).toString();
      if (s) names.push(s);
    }

    // common candidates
    if (Array.isArray(member.planConnections)) {
      member.planConnections.forEach(function (pc) {
        pushName(pc && (pc.planName || (pc.plan && pc.plan.name) || pc.plan));
      });
    }
    if (Array.isArray(member.plans)) member.plans.forEach(pushName);
    if (Array.isArray(member.subscriptions)) member.subscriptions.forEach(pushName);
    if (member.plan) pushName(member.plan);
    if (member.subscription) pushName(member.subscription);

    // choose highest by name matching
    var best = "guest";
    names.forEach(function (n) {
      var s = (n || "").toString().toLowerCase();
      if (!s) return;

      if (s.indexOf("black") >= 0 || s.indexOf("svip") >= 0) best = chooseHigherRole(best, "blackcard");
      else if (s.indexOf("vip") >= 0) best = chooseHigherRole(best, "vip");
      else if (s.indexOf("premium") >= 0) best = chooseHigherRole(best, "premium");
      else if (s.indexOf("standard") >= 0) best = chooseHigherRole(best, "standard");
    });

    return best;
  }

  function resolveRoleSync() {
    var r = "guest";
    r = chooseHigherRole(r, roleFromBody());
    r = chooseHigherRole(r, roleFromStorage());
    return normalizeRole(r);
  }

  function getMemberstackInstance() {
    return window.memberstack || window.MemberStack || window.$memberstack || null;
  }

  function tryResolveRoleFromMemberstack(done) {
    var ms = getMemberstackInstance();
    var start = now();
    var timeoutAt = start + MMD.config.memberstack.timeoutMs;

    function finish(role) {
      if (typeof done === "function") done(normalizeRole(role || "guest"));
    }

    function extractFromMs(msObj) {
      // best-effort: support multiple method names
      if (!msObj) return null;

      // Promise-based methods
      if (typeof msObj.getMemberJSON === "function") return msObj.getMemberJSON();
      if (typeof msObj.getCurrentMember === "function") return msObj.getCurrentMember();
      if (typeof msObj.getMember === "function") return msObj.getMember();

      // sometimes Memberstack exposes current member object directly
      if (msObj.member && typeof msObj.member === "object") return Promise.resolve(msObj.member);

      return null;
    }

    function poll() {
      ms = getMemberstackInstance();
      var p;

      try { p = extractFromMs(ms); } catch (_) { p = null; }

      if (p && typeof p.then === "function") {
        p.then(function (member) {
          var role = roleFromMemberObject(member);

          // if member exists but no plan found, still treat as at least standard? no.
          // keep guest unless explicit evidence.
          finish(role || "guest");
        }).catch(function () {
          finish("guest");
        });
        return;
      }

      if (now() >= timeoutAt) {
        finish("guest");
        return;
      }

      setTimeout(poll, MMD.config.memberstack.pollMs);
    }

    // if ms has onReady, prefer it (but still guard timeout)
    try {
      if (ms && typeof ms.onReady === "function") {
        var doneOnce = false;

        var t = setTimeout(function () {
          if (doneOnce) return;
          doneOnce = true;
          finish("guest");
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

    // fallback poll
    poll();
  }

  // ----------------------------
  // role lock / visibility
  // ----------------------------
  function parseRoleList(s) {
    return (s || "")
      .toString()
      .split(",")
      .map(function (x) { return normalizeRole(x); })
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
    var nodes;

    try { nodes = root.querySelectorAll(MMD.config.lock.selector); }
    catch (_) { return; }

    if (!nodes || !nodes.length) return;

    Array.prototype.forEach.call(nodes, function (el) {
      try {
        var minRole = normalizeRole(el.getAttribute(MMD.config.lock.attrMin) || "");
        var showList = parseRoleList(el.getAttribute(MMD.config.lock.attrShow) || "");
        var hideList = parseRoleList(el.getAttribute(MMD.config.lock.attrHide) || "");

        // precedence: min-role > show/hide
        if (minRole && minRole !== "guest") {
          if (roleRank(role) >= roleRank(minRole)) showEl(el);
          else hideEl(el);
          return;
        }

        if (showList.length) {
          if (showList.indexOf(role) >= 0) showEl(el);
          else hideEl(el);
          return;
        }

        if (hideList.length) {
          if (hideList.indexOf(role) >= 0) hideEl(el);
          else showEl(el);
          return;
        }
      } catch (_) {}
    });
  }

  // keep locks applied for newly injected elements (Webflow/Memberstack often updates DOM)
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
  // bootstrap
  // ----------------------------
  function bootstrap() {
    // debug flag: ?debug=1
    try {
      var p = qs();
      var dbg = (p.get && p.get("debug")) ? p.get("debug") : "";
      if (dbg === "1" || dbg === "true") MMD.config.debug = true;
    } catch (_) {}

    log("boot start");

    // intent
    captureIntentFromUrl();

    // lang
    var lang = setLang(getLang(), { persist: true });

    // bind language buttons (optional)
    bindLangButtons();

    // role sync first (immediate)
    setRole(resolveRoleSync(), { persist: true });

    // apply locks immediately
    applyLocks();

    // observe DOM changes for lock application
    observeLocks();

    // async memberstack role (upgrade only if higher)
    tryResolveRoleFromMemberstack(function (msRole) {
      msRole = normalizeRole(msRole);
      var current = getRole();
      var chosen = chooseHigherRole(current, msRole);

      // if Memberstack says guest but we already have something higher, keep ours
      // if Memberstack finds higher tier, upgrade
      if (chosen !== current) setRole(chosen, { persist: true });
      else log("role unchanged after memberstack:", current);

      // ready event
      try {
        window.dispatchEvent(new CustomEvent("mmd:ready", {
          detail: { role: getRole(), lang: lang, version: VERSION }
        }));
      } catch (_) {}
    });

    log("boot done");
  }

  // expose minimal API
  MMD.global.getLang = getLang;
  MMD.global.setLang = setLang;
  MMD.global.getRole = getRole;
  MMD.global.setRole = setRole;
  MMD.global.applyLocks = applyLocks;
  MMD.global.getIntent = getIntent;
  MMD.global.clearIntent = clearIntent;

  // start after DOM is available (but do not wait for images)
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootstrap);
  } else {
    bootstrap();
  }

})(window, document);
