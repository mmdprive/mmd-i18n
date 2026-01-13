/* =========================================
   i18n Core Engine — MMD Privé (v1.7 LOCK • 2026-01-14)
   - no-blank overwrite (uses data-fallback / keep existing)
   - reads/writes BOTH: mmd_lang + lang
   - supports role suffix: key.{role}
   - supports mobile suffix: key.m (when data-i18n-mobile="true")
   - dict supports:
       A) I18N_DICT[lang][key]
       B) I18N_DICT[key][lang] (compat)
   - role normalize 1:1 (canonical):
       guest | standard | premium | vip | blackcard | 7days
   - bindings (NO-BLANK overwrite rules apply to ALL):
       [data-i18n="key"]                      -> innerHTML
       [data-i18n-text="key"]                 -> textContent
       [data-i18n-html="key"]                 -> innerHTML
       [data-i18n-placeholder="key"]          -> placeholder
       [data-i18n-title="key"]                -> title
       [data-i18n-aria-label="key"]           -> aria-label
       [data-i18n-value="key"]                -> value
       [data-i18n-attr="attr:key;attr2:key2"] -> setAttribute(attr, value)
   - fallback attributes (optional):
       data-fallback (generic)
       data-fallback-text / -html / -placeholder / -title / -aria-label / -value / -attr-<attr>
========================================= */

(function () {
  "use strict";

  var W = window;
  var D = document;

  // ---------- Config ----------
  var LOCK_VERSION = "v1.7 LOCK";
  var DEFAULT_LANG = "th";
  var STORAGE_KEYS = ["mmd_lang", "lang"];

  // ---------- Helpers ----------
  function str(v) {
    return (v === null || v === undefined) ? "" : String(v);
  }
  function trim(v) {
    return str(v).replace(/\s+/g, " ").trim();
  }
  function isTruthyAttr(v) {
    v = (v || "").toString().toLowerCase().trim();
    return v === "true" || v === "1" || v === "yes" || v === "on";
  }
  function safeGetLS(key) {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  }
  function safeSetLS(key, val) {
    try { localStorage.setItem(key, val); } catch (_) {}
  }

  // ---------- Role normalize (1:1 canonical) ----------
  function normalizeRole(input) {
    var r = trim(input).toLowerCase();

    // tolerate common variants but output MUST be canonical
    if (!r) return "guest";

    // strip separators
    r = r.replace(/[_\s]+/g, "-");

    // aliases -> canonical
    var map = {
      "guest": "guest",
      "free": "guest",
      "public": "guest",

      "standard": "standard",
      "std": "standard",

      "premium": "premium",
      "pre": "premium",

      "vip": "vip",

      "blackcard": "blackcard",
      "black-card": "blackcard",
      "black": "blackcard",
      "svip": "blackcard",      // SVIP สิทธิ์เท่า Black Card (canonical: blackcard)
      "s-vip": "blackcard",

      "7days": "7days",
      "7-day": "7days",
      "7-days": "7days",
      "7days-pass": "7days",
      "guest-pass": "7days"
    };

    return map[r] || "guest";
  }

  function getCurrentRole(root) {
    // priority: root -> body -> localStorage -> guest
    var fromRoot = root && root.getAttribute && (root.getAttribute("data-user-role") || root.dataset && root.dataset.userRole);
    if (fromRoot) return normalizeRole(fromRoot);

    var body = D.body;
    if (body) {
      var fromBody = body.getAttribute("data-user-role") || (body.dataset ? body.dataset.userRole : "");
      if (fromBody) return normalizeRole(fromBody);
    }

    var cached = safeGetLS("mmd_role") || safeGetLS("role") || "";
    if (cached) return normalizeRole(cached);

    return "guest";
  }

  function getLang() {
    var a = safeGetLS("mmd_lang");
    var b = safeGetLS("lang");
    var lang = trim(a || b || DEFAULT_LANG).toLowerCase();
    if (!lang) lang = DEFAULT_LANG;
    return lang;
  }

  function setLang(lang) {
    lang = trim(lang).toLowerCase() || DEFAULT_LANG;
    for (var i = 0; i < STORAGE_KEYS.length; i++) safeSetLS(STORAGE_KEYS[i], lang);
    try { D.documentElement.setAttribute("lang", lang); } catch (_) {}
    return lang;
  }

  function getDict() {
    return W.I18N_DICT || W.I18N || W.DICT || {};
  }

  // dict supports:
  // A) dict[lang][key]
  // B) dict[key][lang]
  function lookupRaw(lang, key) {
    var dict = getDict();
    if (!dict) return null;

    if (dict[lang] && Object.prototype.hasOwnProperty.call(dict[lang], key)) {
      return dict[lang][key];
    }
    if (dict[key] && Object.prototype.hasOwnProperty.call(dict[key], lang)) {
      return dict[key][lang];
    }
    return null;
  }

  // mobile + role suffix resolution
  function resolveKeyCandidates(baseKey, role, isMobile) {
    var out = [];
    var k = trim(baseKey);
    if (!k) return out;

    var r = normalizeRole(role);

    // Preferred order:
    // 1) key.m.role
    // 2) key.role.m   (optional compatibility)
    // 3) key.m
    // 4) key.role
    // 5) key
    if (isMobile) {
      out.push(k + ".m." + r);
      out.push(k + "." + r + ".m");
      out.push(k + ".m");
    }
    out.push(k + "." + r);
    out.push(k);

    // de-dup
    var seen = {};
    var uniq = [];
    for (var i = 0; i < out.length; i++) {
      var kk = out[i];
      if (!seen[kk]) { seen[kk] = true; uniq.push(kk); }
    }
    return uniq;
  }

  function translate(key, opts) {
    opts = opts || {};
    var lang = trim(opts.lang || getLang()).toLowerCase();
    var role = normalizeRole(opts.role || getCurrentRole(opts.root || D.body));
    var isMobile = !!opts.mobile;

    var candidates = resolveKeyCandidates(key, role, isMobile);
    for (var i = 0; i < candidates.length; i++) {
      var v = lookupRaw(lang, candidates[i]);
      if (v === null || v === undefined) continue;

      // IMPORTANT: no-blank overwrite => treat blank as missing
      var vv = str(v);
      if (trim(vv) === "") continue;

      return vv;
    }
    return null;
  }

  function getFallback(el, kind, attrName) {
    // kind: "text" | "html" | "placeholder" | "title" | "aria-label" | "value" | "attr"
    // attrName used only for kind="attr" to support data-fallback-attr-<attr>
    if (!el || !el.getAttribute) return "";

    var specific = "";
    if (kind === "attr" && attrName) {
      specific = el.getAttribute("data-fallback-attr-" + String(attrName).toLowerCase()) || "";
    } else if (kind) {
      specific = el.getAttribute("data-fallback-" + kind) || "";
    }
    var generic = el.getAttribute("data-fallback") || "";

    return trim(specific || generic);
  }

  function applyNoBlank(el, kind, value, attrName) {
    // if value is blank => use fallback if provided, else KEEP existing
    var v = str(value);
    if (trim(v) === "") v = "";

    if (!v) {
      var fb = getFallback(el, kind, attrName);
      if (fb) v = fb;
    }

    if (!v) return; // keep existing (no overwrite)

    if (kind === "text") {
      el.textContent = v;
      return;
    }
    if (kind === "html") {
      el.innerHTML = v;
      return;
    }
    if (kind === "placeholder") {
      el.setAttribute("placeholder", v);
      return;
    }
    if (kind === "title") {
      el.setAttribute("title", v);
      return;
    }
    if (kind === "aria-label") {
      el.setAttribute("aria-label", v);
      return;
    }
    if (kind === "value") {
      // for inputs/selects/textareas
      try { el.value = v; } catch (_) { el.setAttribute("value", v); }
      return;
    }
    if (kind === "attr" && attrName) {
      el.setAttribute(attrName, v);
      return;
    }
  }

  function parseAttrMap(s) {
    // "href:nav.home;title:nav.home.title" (supports ; or , separators)
    s = str(s);
    if (!trim(s)) return [];
    var parts = s.split(/[;,]/g);
    var out = [];
    for (var i = 0; i < parts.length; i++) {
      var p = trim(parts[i]);
      if (!p) continue;
      var idx = p.indexOf(":");
      if (idx <= 0) continue;
      var a = trim(p.slice(0, idx));
      var k = trim(p.slice(idx + 1));
      if (!a || !k) continue;
      out.push({ attr: a, key: k });
    }
    return out;
  }

  function applyToRoot(root, opts) {
    root = root || D;
    opts = opts || {};

    var lang = trim(opts.lang || getLang()).toLowerCase();
    var role = normalizeRole(opts.role || getCurrentRole(root));
    var dict = getDict(); // ensure loaded
    void dict;

    // detect mobile per element: data-i18n-mobile="true"
    function isMobileEl(el) {
      if (!el || !el.getAttribute) return false;
      var v = el.getAttribute("data-i18n-mobile");
      if (v === null) return false;
      return isTruthyAttr(v) || v === "" || v === "mobile";
    }

    // [data-i18n] -> innerHTML
    var nodes;

    nodes = root.querySelectorAll ? root.querySelectorAll("[data-i18n]") : [];
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var key = el.getAttribute("data-i18n");
      var val = translate(key, { lang: lang, role: role, mobile: isMobileEl(el), root: root });
      applyNoBlank(el, "html", val);
    }

    // [data-i18n-text] -> textContent
    nodes = root.querySelectorAll ? root.querySelectorAll("[data-i18n-text]") : [];
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      key = el.getAttribute("data-i18n-text");
      val = translate(key, { lang: lang, role: role, mobile: isMobileEl(el), root: root });
      applyNoBlank(el, "text", val);
    }

    // [data-i18n-html] -> innerHTML
    nodes = root.querySelectorAll ? root.querySelectorAll("[data-i18n-html]") : [];
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      key = el.getAttribute("data-i18n-html");
      val = translate(key, { lang: lang, role: role, mobile: isMobileEl(el), root: root });
      applyNoBlank(el, "html", val);
    }

    // placeholder
    nodes = root.querySelectorAll ? root.querySelectorAll("[data-i18n-placeholder]") : [];
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      key = el.getAttribute("data-i18n-placeholder");
      val = translate(key, { lang: lang, role: role, mobile: isMobileEl(el), root: root });
      applyNoBlank(el, "placeholder", val);
    }

    // title
    nodes = root.querySelectorAll ? root.querySelectorAll("[data-i18n-title]") : [];
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      key = el.getAttribute("data-i18n-title");
      val = translate(key, { lang: lang, role: role, mobile: isMobileEl(el), root: root });
      applyNoBlank(el, "title", val);
    }

    // aria-label
    nodes = root.querySelectorAll ? root.querySelectorAll("[data-i18n-aria-label]") : [];
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      key = el.getAttribute("data-i18n-aria-label");
      val = translate(key, { lang: lang, role: role, mobile: isMobileEl(el), root: root });
      applyNoBlank(el, "aria-label", val);
    }

    // value
    nodes = root.querySelectorAll ? root.querySelectorAll("[data-i18n-value]") : [];
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      key = el.getAttribute("data-i18n-value");
      val = translate(key, { lang: lang, role: role, mobile: isMobileEl(el), root: root });
      applyNoBlank(el, "value", val);
    }

    // attr map
    nodes = root.querySelectorAll ? root.querySelectorAll("[data-i18n-attr]") : [];
    for (i = 0; i < nodes.length; i++) {
      el = nodes[i];
      var mapStr = el.getAttribute("data-i18n-attr");
      var pairs = parseAttrMap(mapStr);
      for (var j = 0; j < pairs.length; j++) {
        var aName = pairs[j].attr;
        var aKey = pairs[j].key;
        var aVal = translate(aKey, { lang: lang, role: role, mobile: isMobileEl(el), root: root });
        applyNoBlank(el, "attr", aVal, aName);
      }
    }

    // mark state
    try {
      if (root === D || root === D.documentElement) {
        D.documentElement.setAttribute("data-mmd-lang", lang);
        D.documentElement.setAttribute("data-mmd-role", role);
      } else if (root && root.setAttribute) {
        root.setAttribute("data-mmd-lang", lang);
        root.setAttribute("data-mmd-role", role);
      }
    } catch (_) {}
  }

  function bindLangButtons(root, opts) {
    root = root || D;
    opts = opts || {};
    var selector = opts.selector || ".mmd-lang-btn,[data-set-lang]";
    var activeClass = opts.activeClass || "mmd-lang-active";

    var btns = root.querySelectorAll ? root.querySelectorAll(selector) : [];
    function refreshActive(lang) {
      for (var i = 0; i < btns.length; i++) {
        var b = btns[i];
        var target = b.getAttribute("data-set-lang") || (b.dataset ? b.dataset.setLang : "");
        if (!target) target = b.getAttribute("data-lang") || (b.dataset ? b.dataset.lang : "");
        target = trim(target).toLowerCase();
        if (!target) continue;
        if (b.classList) b.classList.toggle(activeClass, target === lang);
      }
    }

    for (var i = 0; i < btns.length; i++) {
      (function (b) {
        b.addEventListener("click", function () {
          var target = b.getAttribute("data-set-lang") || (b.dataset ? b.dataset.setLang : "");
          if (!target) target = b.getAttribute("data-lang") || (b.dataset ? b.dataset.lang : "");
          target = trim(target).toLowerCase();
          if (!target) return;

          var lang = setLang(target);
          applyToRoot(opts.applyRoot || D, { lang: lang });
          refreshActive(lang);

          // optional hook
          if (typeof opts.onChange === "function") {
            try { opts.onChange(lang); } catch (_) {}
          }
        });
      })(btns[i]);
    }

    refreshActive(getLang());
  }

  function init(opts) {
    opts = opts || {};
    var root = opts.root || D;

    // Ensure lang persisted
    setLang(getLang());

    // Apply once
    applyToRoot(root, { lang: getLang(), role: getCurrentRole(root) });

    // Bind language toggles (optional)
    if (opts.bindLangButtons !== false) {
      bindLangButtons(D, { applyRoot: root });
    }

    // Observe DOM changes (optional)
    if (opts.observe === true) {
      try {
        var mo = new MutationObserver(function (mutations) {
          for (var i = 0; i < mutations.length; i++) {
            var m = mutations[i];
            if (!m.addedNodes || !m.addedNodes.length) continue;
            // apply only for new nodes subtree
            for (var j = 0; j < m.addedNodes.length; j++) {
              var n = m.addedNodes[j];
              if (!n || n.nodeType !== 1) continue;
              applyToRoot(n, { lang: getLang(), role: getCurrentRole(root) });
            }
          }
        });
        mo.observe(root === D ? D.body : root, { childList: true, subtree: true });
        W.__MMD_I18N_MO__ = mo;
      } catch (_) {}
    }

    return true;
  }

  // ---------- Public API ----------
  var API = {
    version: LOCK_VERSION,
    normalizeRole: normalizeRole,
    getLang: getLang,
    setLang: function (lang) { return setLang(lang); },
    t: function (key, opts) { return translate(key, opts || {}); },
    apply: function (root, opts) { return applyToRoot(root || D, opts || {}); },
    bindLangButtons: function (root, opts) { return bindLangButtons(root || D, opts || {}); },
    init: init
  };

  W.MMD_I18N = API;

  // Convenience global T(k) (non-destructive)
  if (typeof W.T !== "function") {
    W.T = function (key, opts) { return API.t(key, opts); };
  }

  // Auto init on DOM ready (safe default)
  if (D.readyState === "loading") {
    D.addEventListener("DOMContentLoaded", function () {
      try { API.init({ root: D }); } catch (_) {}
    });
  } else {
    try { API.init({ root: D }); } catch (_) {}
  }
})();
