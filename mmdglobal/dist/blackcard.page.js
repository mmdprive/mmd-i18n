document.addEventListener('DOMContentLoaded', ()=>{

  /* i18n */
  if(window.setLang){
    const lang =
      localStorage.getItem('lang') ||
      (navigator.language.startsWith('th') && 'th') ||
      'en';
    window.setLang(lang);
  }

  /* Role gating (รองรับ MemberStack ถ้ามี) */
  const role = document.body.dataset.userRole || 'guest';

  document.querySelectorAll('[data-role-allow]').forEach(el=>{
    const allow = el.dataset.roleAllow.split(',').map(s=>s.trim());
    if(!allow.includes(role)) el.remove();
  });

});
