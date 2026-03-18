/* =========================================
   MMD PRIVÉ — CONFIRMATION BOOT (patched)
   - Auto init on DOM ready
   - Webflow friendly
   - Reads URL params and maps them into dataset / overrides
   - Enables Continue flow via nextUrl
========================================= */

(function () {
  "use strict";

  function ready(fn){
    if (document.readyState === "complete" || document.readyState === "interactive"){
      setTimeout(fn, 0);
    } else {
      document.addEventListener("DOMContentLoaded", fn, { once:true });
    }
  }

  function trim(v){
    return (v == null ? "" : String(v)).trim();
  }

  function firstNonEmpty(){
    for (var i = 0; i < arguments.length; i++){
      var v = trim(arguments[i]);
      if (v) return v;
    }
    return "";
  }

  function qp(name){
    try{
      return trim(new URLSearchParams(window.location.search).get(name));
    }catch(_){
      return "";
    }
  }

  function absoluteUrl(pathOrUrl, base){
    var raw = trim(pathOrUrl);
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    return String(base || "").replace(/\/+$/,"") + "/" + raw.replace(/^\/+/,"");
  }

  function inferNextUrl(params){
    var webBase = firstNonEmpty(
      window.MMD_WEB_BASE_URL,
      document.documentElement.getAttribute("data-web-base"),
      window.location.origin
    );

    var explicitNext = firstNonEmpty(
      params.next,
      params.next_url,
      params.nextUrl
    );
    if (explicitNext) return absoluteUrl(explicitNext, webBase);

    var role = firstNonEmpty(params.role, params.view).toLowerCase();

    if (role === "model"){
      return absoluteUrl(
        firstNonEmpty(params.model_dashboard_url, "/model/dashboard"),
        webBase
      );
    }

    if (role === "member" || role === "customer" || role === "client"){
      return absoluteUrl(
        firstNonEmpty(params.member_dashboard_url, "/membership/dashboard"),
        webBase
      );
    }

    return "";
  }

  function buildParams(){
    return {
      t: qp("t"),
      page: qp("page"),
      role: qp("role"),

      next: qp("next"),
      next_url: qp("next_url"),
      nextUrl: qp("nextUrl"),

      support: qp("support"),
      support_url: qp("support_url"),

      member_dashboard_url: qp("member_dashboard_url"),
      model_dashboard_url: qp("model_dashboard_url"),

      session_id: qp("session_id"),
      payment_ref: qp("payment_ref"),
      ref: qp("ref"),

      member_lookup_key: qp("member_lookup_key"),
      model_lookup_key: qp("model_lookup_key"),
      rules_template: qp("rules_template"),

      service: qp("service"),
      model: qp("model"),
      model_code: qp("model_code"),
      date: qp("date"),
      time: qp("time"),
      location_name: qp("location_name"),
      location_url: qp("location_url")
    };
  }

  function applyDataset(root, params){
    var nextUrl = inferNextUrl(params);

    if (nextUrl) root.dataset.nextUrl = nextUrl;

    var supportUrl = firstNonEmpty(params.support, params.support_url);
    if (supportUrl) root.dataset.supportUrl = supportUrl;

    var page = firstNonEmpty(params.page);
    if (!page){
      var role = firstNonEmpty(params.role).toLowerCase();
      if (role === "model") page = "model";
      else if (role === "member" || role === "customer" || role === "client") page = "job";
    }
    if (page) root.dataset.confirmationPage = page;

    var refCode = firstNonEmpty(params.payment_ref, params.ref, params.session_id);
    if (refCode) root.dataset.refCode = refCode;
    if (params.session_id) root.dataset.orderId = params.session_id;

    if (params.service) root.dataset.service = params.service;
    if (params.model || params.model_code) root.dataset.modelCode = firstNonEmpty(params.model, params.model_code);
    if (params.date) root.dataset.date = params.date;
    if (params.time) root.dataset.time = params.time;
    if (params.location_name) root.dataset.locationName = params.location_name;
    if (params.location_url) root.dataset.locationUrl = params.location_url;

    if (params.member_lookup_key) root.dataset.memberId = params.member_lookup_key;
    if (params.model_lookup_key) root.dataset.telegramUserId = params.model_lookup_key;
  }

  function buildOverrides(root, params){
    var nextUrl = inferNextUrl(params);
    var out = {};

    if (nextUrl) out.nextUrl = nextUrl;

    var supportUrl = firstNonEmpty(params.support, params.support_url);
    if (supportUrl) out.supportUrl = supportUrl;

    var page = firstNonEmpty(params.page);
    if (!page){
      var role = firstNonEmpty(params.role).toLowerCase();
      if (role === "model") page = "model";
      else if (role === "member" || role === "customer" || role === "client") page = "job";
    }
    if (page) out.page = page;

    if (params.session_id) out.orderId = params.session_id;
    if (params.payment_ref || params.ref) out.refCode = firstNonEmpty(params.payment_ref, params.ref);

    if (params.service) out.service = params.service;
    if (params.model || params.model_code) out.modelCode = firstNonEmpty(params.model, params.model_code);
    if (params.date) out.date = params.date;
    if (params.time) out.time = params.time;
    if (params.location_name) out.locationName = params.location_name;
    if (params.location_url) out.locationUrl = params.location_url;

    if (params.member_lookup_key) out.memberId = params.member_lookup_key;
    if (params.model_lookup_key) out.telegramUserId = params.model_lookup_key;

    return out;
  }

  function boot(){
    if (!window.MMD || !window.MMD.confirmation || typeof window.MMD.confirmation.init !== "function") return;

    var root = document.getElementById("mmd-confirmation");
    if (!root) return;

    var params = buildParams();
    applyDataset(root, params);
    var overrides = buildOverrides(root, params);

    window.MMD.confirmation.init(root, overrides);
  }

  ready(function(){
    boot();
    try{
      if (window.Webflow && Array.isArray(window.Webflow)){
        window.Webflow.push(function(){ boot(); });
      }
    } catch(e){}
  });

})();
