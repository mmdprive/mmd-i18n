document.addEventListener('DOMContentLoaded', function() {
  // Scroll Fade-in
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = { threshold: 0.2, rootMargin: "0px 0px -50px 0px" };
  const appearOnScroll = new IntersectionObserver((entries, observer)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, appearOptions);
  faders.forEach(fader => appearOnScroll.observe(fader));

  // Hero Sparkle Canvas
  const heroCanvas = document.querySelector('.sparkle-canvas');
  const ctx = heroCanvas.getContext('2d');
  heroCanvas.width = heroCanvas.offsetWidth;
  heroCanvas.height = heroCanvas.offsetHeight;
  const particles = Array.from({length:50}, () => ({
    x: Math.random()*heroCanvas.width,
    y: Math.random()*heroCanvas.height,
    size: Math.random()*3 + 1,
    speedX: (Math.random()-0.5)*0.5,
    speedY: (Math.random()-0.5)*0.5,
    opacity: Math.random()
  }));
  function animateSparkle(){
    ctx.clearRect(0,0,heroCanvas.width,heroCanvas.height);
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
      ctx.fillStyle = `rgba(249,214,87,${p.opacity})`;
      ctx.fill();
      p.x += p.speedX; p.y += p.speedY;
      if(p.x<0||p.x>heroCanvas.width)p.speedX*=-1;
      if(p.y<0||p.y>heroCanvas.height)p.speedY*=-1;
    });
    requestAnimationFrame(animateSparkle);
  }
  animateSparkle();

  // Background Particles
  const bgCanvas = document.querySelector('.background-canvas');
  const bgCtx = bgCanvas.getContext('2d');
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  const bgParticles = Array.from({length:150}, () => ({
    x: Math.random()*bgCanvas.width,
    y: Math.random()*bgCanvas.height,
    size: Math.random()*2 + 0.5,
    speedY: Math.random()*0.3+0.1,
    opacity: Math.random()
  }));
  function animateBackground(){
    bgCtx.clearRect(0,0,bgCanvas.width,bgCanvas.height);
    bgParticles.forEach(p=>{
      bgCtx.beginPath();
      bgCtx.arc(p.x,p.y,p.size,0,Math.PI*2);
      bgCtx.fillStyle = `rgba(249,214,87,${p.opacity})`;
      bgCtx.fill();
      p.y += p.speedY;
      if(p.y>bgCanvas.height)p.y=0;
    });
    requestAnimationFrame(animateBackground);
  }
  animateBackground();
  window.addEventListener('resize', ()=>{
    bgCanvas.width = window.innerWidth;
    bgCanvas.height = window.innerHeight;
  });

  // Background Audio
  const audio = document.getElementById('bg-audio');
  audio.volume = 0.15;
  audio.muted = false;

  const audioControl = document.createElement('button');
  audioControl.innerText = '🔊 Audio On';
  audioControl.style.position = 'fixed';
  audioControl.style.bottom = '20px';
  audioControl.style.right = '20px';
  audioControl.style.background = 'rgba(249,214,87,0.8)';
  audioControl.style.color = '#080808';
  audioControl.style.border = 'none';
  audioControl.style.padding = '10px 15px';
  audioControl.style.borderRadius = '8px';
  audioControl.style.cursor = 'pointer';
  audioControl.style.zIndex = '1000';
  document.body.appendChild(audioControl);
  let isPlaying = true;
  audioControl.addEventListener('click', () => {
    if(isPlaying){ audio.pause(); isPlaying=false; audioControl.innerText='🔇 Audio Off'; }
    else{ audio.play(); isPlaying=true; audioControl.innerText='🔊 Audio On'; }
  });

  // MemberStack Role gating
  if(window.MemberStack){
    window.MemberStack.onReady.then(function(member){
      document.querySelectorAll('[data-role-allow]').forEach(el=>{
        const allowedRoles = el.dataset.roleAllow.split(',').map(r=>r.trim());
        if(!allowedRoles.includes(member.role)) el.remove();
      });
    });
  }
});
