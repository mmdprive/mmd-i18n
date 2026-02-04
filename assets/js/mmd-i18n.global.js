<script>
/**
 * MMD GLOBAL I18N — v2026
 * Scope: Whole site
 * Keys:
 *  - hero.men.*
 *  - hero.wm.*
 *  - ui.*, nav.*, footer.*, cta.*, form.* (extendable)
 *
 * Behavior:
 *  - If window.MMD_I18N.t exists → delegate to core
 *  - Else → use fallback dictionary below
 *  - Language source: localStorage('mmd_lang') > navigator.language > 'en'
 *  - Listen to event: 'mmd:i18n:change'
 */

(function(){
  /* =========================
     DICTIONARY (LOCK)
     ========================= */
  const DICT = {
    en:{
      /* ===== HERO — MEN ===== */
      "hero.men.kicker":"TRUST ME • PRIVATE SPACE",
      "hero.men.h1a":"Trust Me.",
      "hero.men.h1b":"A curated private space.",
      "hero.men.sub":"I’m Per. I design structure, not fantasy.",
      "hero.men.cta.explore":"Explore",
      "hero.men.cta.how":"How it works",
      "hero.men.cta.safety":"Safety & boundaries",

      /* ===== HERO — WOMEN ===== */
      "hero.wm.kicker":"BELIEVE IN ME • PRIVATE SPACE",
      "hero.wm.h1a":"Believe in me.",
      "hero.wm.h1b":"A private space where you are respected.",
      "hero.wm.sub":"I’m Per. I don’t push situations. I design calm, respectful experiences — so you feel safe and in control.",
      "hero.wm.cta.explore":"Explore options",
      "hero.wm.cta.how":"How it works",
      "hero.wm.cta.safety":"Safety & boundaries",

      /* ===== UI / GLOBAL ===== */
      "ui.scroll":"Scroll",
      "nav.home":"Home",
      "nav.membership":"Membership",
      "nav.contact":"Contact",
      "cta.join":"Join now",
      "cta.chat":"Chat with Per",
      "footer.copy":"© Per / MMD — Private space. Clear boundaries."
    },

    th:{
      "hero.men.kicker":"TRUST ME • PRIVATE SPACE",
      "hero.men.h1a":"เชื่อใจฉัน",
      "hero.men.h1b":"พื้นที่ส่วนตัวที่คัดสรรมาอย่างชัดเจน",
      "hero.men.sub":"Per เองนะ ฉันออกแบบโครงสร้าง ไม่ขายความเพ้อฝัน",
      "hero.men.cta.explore":"ดูโซน",
      "hero.men.cta.how":"วิธีทำงาน",
      "hero.men.cta.safety":"ความปลอดภัยและขอบเขต",

      "hero.wm.kicker":"BELIEVE IN ME • PRIVATE SPACE",
      "hero.wm.h1a":"เชื่อใจฉัน",
      "hero.wm.h1b":"พื้นที่ส่วนตัวที่ให้เกียรติคุณ",
      "hero.wm.sub":"Per เองนะ ที่นี่ไม่เร่ง ไม่กดดัน ทุกอย่างออกแบบให้คุณรู้สึกปลอดภัยและควบคุมได้",
      "hero.wm.cta.explore":"ดูตัวเลือก",
      "hero.wm.cta.how":"วิธีทำงาน",
      "hero.wm.cta.safety":"ความปลอดภัย",

      "ui.scroll":"เลื่อนลง",
      "nav.home":"หน้าแรก",
      "nav.membership":"สมาชิก",
      "nav.contact":"ติดต่อ",
      "cta.join":"สมัครสมาชิก",
      "cta.chat":"คุยกับ Per",
      "footer.copy":"© Per / MMD — พื้นที่ส่วนตัว ขอบเขตชัดเจน"
    },

    jp:{
      "hero.men.kicker":"TRUST ME • PRIVATE SPACE",
      "hero.men.h1a":"私を信じてください。",
      "hero.men.h1b":"厳選されたプライベート空間。",
      "hero.men.sub":"Perです。幻想ではなく、構造を設計します。",
      "hero.men.cta.explore":"見る",
      "hero.men.cta.how":"仕組み",
      "hero.men.cta.safety":"安全と境界",

      "hero.wm.kicker":"BELIEVE IN ME • PRIVATE SPACE",
      "hero.wm.h1a":"私を信じてください。",
      "hero.wm.h1b":"尊重されるプライベート空間。",
      "hero.wm.sub":"Perです。無理に進めません。落ち着きと敬意を大切にします。",
      "hero.wm.cta.explore":"選択を見る",
      "hero.wm.cta.how":"仕組み",
      "hero.wm.cta.safety":"安全",

      "ui.scroll":"スクロール",
      "nav.home":"ホーム",
      "nav.membership":"会員",
      "nav.contact":"連絡先",
      "cta.join":"参加する",
      "cta.chat":"Per と話す",
      "footer.copy":"© Per / MMD — プライベート空間。明確な境界。"
    },

    zh:{
      "hero.men.kicker":"TRUST ME • PRIVATE SPACE",
      "hero.men.h1a":"相信我。",
      "hero.men.h1b":"精心设计的私密空间。",
      "hero.men.sub":"我是 Per。我设计结构，而不是幻想。",
      "hero.men.cta.explore":"查看",
      "hero.men.cta.how":"运作方式",
      "hero.men.cta.safety":"安全与界限",

      "hero.wm.kicker":"BELIEVE IN ME • PRIVATE SPACE",
      "hero.wm.h1a":"相信我。",
      "hero.wm.h1b":"一个尊重你的私密空间。",
      "hero.wm.sub":"我是 Per。我不会施压，只提供冷静、尊重的体验。",
      "hero.wm.cta.explore":"查看选项",
      "hero.wm.cta.how":"运作方式",
      "hero.wm.cta.safety":"安全",

      "ui.scroll":"向下滚动",
      "nav.home":"首页",
      "nav.membership":"会员",
      "nav.contact":"联系",
      "cta.join":"加入",
      "cta.chat":"与 Per 聊天",
      "footer.copy":"© Per / MMD — 私密空间，界限清晰。"
    }
  };

  /* =========================
     CORE BRIDGE
     ========================= */
  const qsa = (s, el=document)=>Array.from(el.querySelectorAll(s));
  const norm = v => String(v||'').toLowerCase().trim();

  function detectLang(){
    const saved = norm(localStorage.getItem('mmd_lang'));
    if(DICT[saved]) return saved;
    const nav = norm((navigator.language||'en').slice(0,2));
    return DICT[nav] ? nav : 'en';
  }

  function translate(lang){
    const L = DICT[lang] ? lang : 'en';
    qsa('[data-i18n]').forEach(el=>{
      const key = el.getAttribute('data-i18n');
      let val = '';
      if(window.MMD_I18N && typeof window.MMD_I18N.t === 'function'){
        val = window.MMD_I18N.t(key, L);
      }else{
        val = DICT[L][key];
      }
      if(typeof val === 'string') el.textContent = val;
    });
  }

  /* =========================
     INIT
     ========================= */
  const initLang = detectLang();
  translate(initLang);

  /* =========================
     LISTENERS
     ========================= */
  document.addEventListener('mmd:i18n:change', (e)=>{
    const lang = norm(e?.detail?.lang);
    localStorage.setItem('mmd_lang', lang);
    translate(lang);
  });

  /* =========================
     PUBLIC API (OPTIONAL)
     ========================= */
  window.MMD_I18N_FALLBACK = {
    set(lang){
      const L = norm(lang);
      document.dispatchEvent(new CustomEvent('mmd:i18n:change',{detail:{lang:L}}));
    },
    get(){ return detectLang(); },
    dict(){ return DICT; }
  };
})();
</script>
