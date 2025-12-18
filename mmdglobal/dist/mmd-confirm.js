(function(){
  const wrap = document.querySelector('.mmd-confirm-wrap');
  if(!wrap) return;

  // fade in
  requestAnimationFrame(()=>wrap.classList.add('is-visible'));

  const p = new URLSearchParams(location.search);
  const ref = p.get('ref');
  const layoutQ = p.get('layout'); // a|b
  const exp = Number(p.get('exp'));
  const sig = p.get('sig');
  const SALT = 'MMD_LOCK_2026';

  const b64 = s => btoa(s).replace(/=+/g,'').replace(/\+/g,'-').replace(/\//g,'_');

  // Signed URL verify (UX-level)
  if(exp && Date.now()/1000 > exp){
    wrap.innerHTML = '<div class="mmd-status">Link expired</div>';
    return;
  }
  if(ref && layoutQ && exp && sig){
    const expect = b64([ref,layoutQ,exp,SALT].join('|')).slice(0,16);
    if(sig !== expect){
      wrap.innerHTML = '<div class="mmd-status">Invalid link</div>';
      return;
    }
    wrap.classList.add(layoutQ === 'b' ? 'layout-b' : 'layout-a');
  } else {
    // role-based fallback
    const role = document.body.dataset.userRole || 'customer';
    wrap.classList.add((role === 'vip' || role === 'model') ? 'layout-b' : 'layout-a');
  }

  // QR + hash
  const refEl = document.querySelector('[data-ref]');
  if(refEl){
    const r = refEl.textContent.trim();
    const hashEl = document.getElementById('hash');
    if(hashEl) hashEl.textContent = b64(r+'|MMD').slice(0,12);
    if(window.QRCode){
      new QRCode(document.getElementById('qr'),{
        text: location.origin + location.pathname + '?ref=' + r,
        width:80,height:80
      });
    }
  }
})();
