document.addEventListener('DOMContentLoaded', ()=>{

  /* Fade-in */
  const faders = document.querySelectorAll('.fade-in');
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold:.2 });
  faders.forEach(el=>io.observe(el));

  /* Background particles */
  const bg = document.querySelector('.background-canvas');
  if(!bg) return;
  const ctx = bg.getContext('2d');

  function resize(){
    bg.width = window.innerWidth;
    bg.height = window.innerHeight;
  }
  resize(); window.addEventListener('resize', resize);

  const particles = Array.from({length:120},()=>({
    x:Math.random()*bg.width,
    y:Math.random()*bg.height,
    r:Math.random()*1.6+.4,
    s:Math.random()*.35+.1,
    o:Math.random()*.6
  }));

  (function loop(){
    ctx.clearRect(0,0,bg.width,bg.height);
    particles.forEach(p=>{
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(200,162,79,${p.o})`;
      ctx.fill();
      p.y+=p.s; if(p.y>bg.height)p.y=0;
    });
    requestAnimationFrame(loop);
  })();

});
