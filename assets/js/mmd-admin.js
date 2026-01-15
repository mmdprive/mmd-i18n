(function(){
  "use strict";

  const root = document.getElementById("mmd-admin");
  if(!root) return;

  const hero = root.querySelector("#hero-img");
  const heroSrc = root.getAttribute("data-hero-src");
  if(hero && heroSrc) hero.src = heroSrc;

  // Nav switch
  root.querySelectorAll(".nav-btn").forEach(btn=>{
    btn.addEventListener("click",()=>{
      root.querySelectorAll(".nav-btn").forEach(b=>b.classList.remove("active"));
      btn.classList.add("active");
    });
  });

  // Mock auth state (ต่อกับ Memberstack ภายหลัง)
  document.getElementById("auth-state").textContent = "Authenticated";
  document.getElementById("role-state").textContent = "Owner";

})();
