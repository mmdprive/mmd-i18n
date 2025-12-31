/* =========================================
   MMD PRIVÉ — CONFIRMATION BOOT
   - Auto init on DOM ready
   - Webflow friendly
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

  function boot(){
    if (!window.MMD || !window.MMD.confirmation || typeof window.MMD.confirmation.init !== "function") return;
    const root = document.getElementById("mmd-confirmation");
    if (!root) return;
    window.MMD.confirmation.init(root);
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
