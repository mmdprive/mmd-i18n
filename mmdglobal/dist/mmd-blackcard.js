(function(){
  const root = document.getElementById("mmd-blackcard");
  if(!root) return;

  function getRole(){
    return document.body.dataset.userRole || "guest";
  }

  function applyRole(){
    const role = getRole();
    root.dataset.userRole = role;
  }

  function boot(){
    applyRole();

    if(window.MMD && MMD.i18n){
      MMD.i18n.setLang(
        localStorage.getItem("lang") || "en",
        root
      );
    }
  }

  if(document.readyState !== "loading") boot();
  else document.addEventListener("DOMContentLoaded", boot);
})();
