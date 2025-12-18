<script>
/* ======================================
   MMD GLOBAL SCRIPT v1.0 (FINAL)
   Safe for ALL pages
   Author: MMD Privé
====================================== */

/* =========================
   CONFIG
========================= */
const MMD = {
  env: {
    page: 'job-confirmation',   // ← เปลี่ยนตามหน้า
    debug: false                // true = admin debug overlay
  },
  feature: {
    analytics: true,
    i18n: true
  },
  user: {
    role: 'guest'
  }
};

/* =========================
   ROLE → UI
========================= */
function MMD_applyRoleUI() {
  const role = MMD.user.role;

  document.querySelectorAll('[data-role-allow]').forEach(el => {
    const allow = el.dataset.roleAllow.split(',');
    el.style.display = allow.includes(role) ? '' : 'none';
  });

  document.querySelectorAll('[data-role-deny]').forEach(el => {
    const deny = el.dataset.roleDeny.split(',');
    el.style.display = deny.includes(role) ? 'none' : '';
  });
}

/* =========================
   ANALYTICS (SAFE LAYER)
========================= */
function MMD_track(event, payload = {}) {
  if (!MMD.feature.analytics) return;
  if (!window.dataLayer) return;

  window.dataLayer.push({
    event,
    page: MMD.env.page,
    role: MMD.user.role,
    ...payload
  });
}

/* =========================
   DEBUG OVERLAY (ADMIN ONLY)
========================= */
function MMD_initDebug() {
  if (!MMD.env.debug) return;
  if (MMD.user.role !== 'admin') return;

  const box = document.createElement('div');
  box.id = 'mmd-debug';
  box.style.cssText = `
    position:fixed;
    bottom:12px;
    right:12px;
    background:#0b0c13;
    color:#cba65a;
    padding:10px 14px;
    font-size:12px;
    z-index:9999;
    border-radius:10px;
    font-family:system-ui;
  `;
  box.innerHTML = `
    <div><strong>MMD Debug</strong></div>
    <div>page: ${MMD.env.page}</div>
    <div>role: ${MMD.user.role}</div>
    <div>lang: ${localStorage.getItem('lang') || 'auto'}</div>
  `;
  document.body.appendChild(box);
}

/* =========================
   MEMBERSTACK → ROLE SYNC
========================= */
document.addEventListener('DOMContentLoaded', () => {

  // Analytics: page view
  MMD_track('page_view');

  if (!window.MemberStack) return;

  MemberStack.onReady.then(({ member }) => {
    MMD.user.role = member?.roles?.[0] || 'guest';
    document.body.dataset.userRole = MMD.user.role;

    MMD_applyRoleUI();
    MMD_initDebug();

    MMD_track('member_loaded');
  });
});
</script>
