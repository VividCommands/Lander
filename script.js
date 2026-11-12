// Lonware main script
document.addEventListener('DOMContentLoaded', () => {

/* Dynamic hero word */
const dynamicWord = document.getElementById('dynamic-word');
const words = ['faster','smoother','steadier','simpler','yours'];
let wordIndex = 0;
const updateWord = () => {
  if (!dynamicWord) return;
  dynamicWord.textContent = words[wordIndex];
  wordIndex = (wordIndex + 1) % words.length;
};
if (dynamicWord) { updateWord(); setInterval(updateWord, 2000); }

/* =============================================
ANNOUNCEMENT BAR + NAVBAR POSITIONING
Single synchronized state prevents stepped or sticky transitions.
============================================= */
const announcementBar = document.querySelector('.announcement-bar');
const navbar = document.querySelector('.navbar');
const SCROLL_IN = 72;
const SCROLL_OUT = 24;
let isScrolled = window.scrollY > SCROLL_IN;
let navFrame = 0;

function syncNavMetrics() {
  if (!navbar) return;
  const annH = announcementBar ? announcementBar.getBoundingClientRect().height : 0;
  const expandedNavH = window.matchMedia('(max-width: 768px)').matches ? 52 : 58;
  document.documentElement.style.setProperty('--announcement-height', annH + 'px');
  document.body.style.paddingTop = (annH + expandedNavH) + 'px';
  if (!isScrolled) navbar.style.top = annH + 'px';
}
function paintNavbarState() {
  if (!navbar) return;
  navbar.classList.toggle('scrolled', isScrolled);
  if (announcementBar) {
    announcementBar.style.transform = isScrolled ? 'translate3d(0,-100%,0)' : 'translate3d(0,0,0)';
  }
  navbar.style.top = isScrolled ? '' : 'var(--announcement-height)';
}
function queueNavbarUpdate() {
  if (navFrame) return;
  navFrame = requestAnimationFrame(() => {
    navFrame = 0;
    const y = Math.max(0, window.scrollY);
    const next = isScrolled ? y > SCROLL_OUT : y > SCROLL_IN;
    if (next !== isScrolled) {
      isScrolled = next;
      paintNavbarState();
    }
  });
}
if (announcementBar) {
  announcementBar.style.transition = 'transform .62s cubic-bezier(.2,.8,.2,1)';
  announcementBar.style.willChange = 'transform';
}
if ('ResizeObserver' in window) {
  const navResizeObserver = new ResizeObserver(syncNavMetrics);
  if (navbar) navResizeObserver.observe(navbar);
  if (announcementBar) navResizeObserver.observe(announcementBar);
}
window.addEventListener('scroll', queueNavbarUpdate, {passive:true});
window.addEventListener('resize', syncNavMetrics, {passive:true});
syncNavMetrics();
paintNavbarState();

/* Mobile menu toggle */
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('active');
  });
}

/* Particle background */
(function initParticles() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || document.body.matches('.pingr-page,.macro-page')) return;
  const canvas = document.createElement('canvas');
  canvas.id = 'particle-canvas';
  canvas.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;pointer-events:none;touch-action:none;z-index:0;';
  document.body.appendChild(canvas);
  const ctx = canvas.getContext('2d');
  let W, H;
  const resize = () => { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; };
  resize();
  window.addEventListener('resize', resize);
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;
  const PARTICLE_COUNT = isMobile ? 15 : 25;
  let mouseX = -9999, mouseY = -9999;
  if (!isMobile) {
    document.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });
    document.addEventListener('mouseleave', () => { mouseX = -9999; mouseY = -9999; });
  }
  const particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random()*W, y: Math.random()*H,
      vx: (Math.random()-0.5)*0.3, vy: (Math.random()-0.5)*0.3,
      radius: Math.random()*2+0.5,
      opacity: Math.random()*0.15+0.05,
      baseOpacity: Math.random()*0.15+0.05,
      pulseSpeed: Math.random()*0.005+0.002,
      pulsePhase: Math.random()*Math.PI*2
    });
  }
  function animate() {if(document.hidden){requestAnimationFrame(animate);return;}
    ctx.clearRect(0,0,W,H);
    for (let i=0;i<particles.length;i++) {
      const p=particles[i];
      p.x+=p.vx; p.y+=p.vy;
      p.pulsePhase+=p.pulseSpeed;
      p.opacity=p.baseOpacity+Math.sin(p.pulsePhase)*0.04;
      if (!isMobile && mouseX>-9000) {
        const dx=mouseX-p.x,dy=mouseY-p.y,dist=Math.sqrt(dx*dx+dy*dy);
        if(dist<200&&dist>0){const f=(1-dist/200)*0.015;p.vx+=dx/dist*f;p.vy+=dy/dist*f;p.opacity=Math.min(p.baseOpacity+0.12,0.35);}
      }
      p.vx*=0.995;p.vy*=0.995;
      const spd=Math.sqrt(p.vx*p.vx+p.vy*p.vy);
      if(spd>0.5){p.vx=p.vx/spd*0.5;p.vy=p.vy/spd*0.5;}
      if(p.x<-10)p.x=W+10;if(p.x>W+10)p.x=-10;if(p.y<-10)p.y=H+10;if(p.y>H+10)p.y=-10;
      ctx.beginPath();ctx.arc(p.x,p.y,p.radius,0,Math.PI*2);ctx.fillStyle='rgba(0,255,255,'+p.opacity+')';ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  animate();
})();

/* Circular product stage with an independent screenshot shuffle per product */
const orbit = document.querySelector('.product-orbit');
if (orbit) {
  const products = [...orbit.querySelectorAll('.orbit-product')];
  const controls = orbit.querySelector('.orbit-controls');
  let activeProduct = 0;
  let orbitTimer;
  let shotTimer;
  const orbitMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let orbitPaused = orbitMotion.matches;
  let orbitHovered = false;
  let orbitFocused = false;
  const pauseOrbit = orbit.querySelector('.orbit-pause');

  products.forEach((product, index) => {
    product.dataset.shot = '0';
    product.inert = index !== activeProduct;
    product.setAttribute('aria-hidden', String(index !== activeProduct));
    product.querySelectorAll('.orbit-shot').forEach((shot,i) => shot.setAttribute('aria-hidden', String(i !== 0)));
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'orbit-dot' + (index === 0 ? ' is-current' : '');
    dot.setAttribute('aria-label', 'Bring ' + product.querySelector('h2').textContent + ' forward');
    if (index === activeProduct) dot.setAttribute('aria-current', 'true');
    dot.addEventListener('click', () => { rotateProducts(index, index < activeProduct ? -1 : 1); restartOrbit(); });
    controls.appendChild(dot);
  });

  function rotateProducts(index, direction = 1) {
    const next = (index + products.length) % products.length;
    if (next === activeProduct) return;
    const outgoing = products[activeProduct];
    const incoming = products[next];
    outgoing.className = 'orbit-product is-leaving ' + (direction > 0 ? 'to-left' : 'to-right');
    incoming.className = 'orbit-product is-entering ' + (direction > 0 ? 'from-right' : 'from-left');
    requestAnimationFrame(() => requestAnimationFrame(() => {
      outgoing.className = 'orbit-product is-behind ' + (direction > 0 ? 'behind-left' : 'behind-right');
      incoming.className = 'orbit-product is-front';
    }));
    activeProduct = next;
    products.forEach((product,i) => { product.inert = i !== activeProduct; product.setAttribute('aria-hidden', String(i !== activeProduct)); });
    controls.querySelectorAll('.orbit-dot').forEach((dot, i) => {
      dot.classList.toggle('is-current', i === activeProduct);
      if (i === activeProduct) dot.setAttribute('aria-current', 'true');
      else dot.removeAttribute('aria-current');
    });
  }

  function advanceShots() {
    products.forEach(product => {
      const shots = [...product.querySelectorAll('.orbit-shot')];
      if (shots.length < 2) return;
      const next = (Number(product.dataset.shot) + 1) % shots.length;
      shots.forEach((shot, i) => { shot.classList.toggle('is-current', i === next); shot.setAttribute('aria-hidden', String(i !== next)); });
      product.dataset.shot = String(next);
      const edition = product.querySelector('.orbit-edition');
      if (edition) { edition.textContent = shots[next].dataset.tier; edition.classList.toggle('is-pro', shots[next].dataset.tier === 'Pro'); }
    });
  }

  function restartOrbit() {
    clearInterval(orbitTimer);
    clearInterval(shotTimer);
    if (pauseOrbit) { pauseOrbit.textContent = orbitPaused ? 'Play' : 'Pause'; pauseOrbit.setAttribute('aria-label', orbitPaused ? 'Play product carousel' : 'Pause product carousel'); }
    if (orbitPaused || orbitHovered || orbitFocused || document.hidden) return;
    orbitTimer = setInterval(() => rotateProducts(activeProduct + 1, 1), 7000);
    shotTimer = setInterval(advanceShots, 3500);
  }

  orbit.querySelector('.orbit-prev').addEventListener('click', () => { rotateProducts(activeProduct - 1, -1); restartOrbit(); });
  orbit.querySelector('.orbit-next').addEventListener('click', () => { rotateProducts(activeProduct + 1, 1); restartOrbit(); });
  orbit.addEventListener('mouseenter', () => { orbitHovered = true; restartOrbit(); });
  orbit.addEventListener('focusin', () => { orbitFocused = true; restartOrbit(); });
  orbit.addEventListener('focusout', event => { orbitFocused = orbit.contains(event.relatedTarget); restartOrbit(); });
  document.addEventListener('visibilitychange', restartOrbit);
  if (pauseOrbit) pauseOrbit.addEventListener('click', () => { orbitPaused = !orbitPaused; restartOrbit(); });
  orbit.addEventListener('mouseleave', () => { orbitHovered = false; restartOrbit(); });
  orbitMotion.addEventListener('change', () => { orbitPaused = orbitMotion.matches; restartOrbit(); });

  restartOrbit();
}

/* Testimonial slider */
const testimonialSlides = document.querySelectorAll('.testimonial-slide');
const prevBtn = document.querySelector('.testimonial-nav.left');
const nextBtn = document.querySelector('.testimonial-nav.right');
let currentSlide = 0;
const testimonialContainer = document.querySelector('.testimonials-container');
let dotsContainer = null;
if (testimonialSlides.length > 0 && testimonialContainer) {
  dotsContainer = document.createElement('div');
  dotsContainer.className = 'testimonial-dots';
  testimonialContainer.parentElement.appendChild(dotsContainer);
  for (let i=0;i<testimonialSlides.length;i++) {
    const dot=document.createElement('button');
    dot.className='testimonial-dot'+(i===0?' active':'');
    dot.setAttribute('aria-label','Go to testimonial '+(i+1));
    dot.addEventListener('click',()=>showSlide(i));
    dotsContainer.appendChild(dot);
  }
}
function showSlide(index) {
  if (!testimonialSlides.length) return;
  currentSlide=((index%testimonialSlides.length)+testimonialSlides.length)%testimonialSlides.length;
  testimonialSlides.forEach((s,i)=>s.classList.toggle('active',i===currentSlide));
  if(dotsContainer){dotsContainer.querySelectorAll('.testimonial-dot').forEach((d,i)=>d.classList.toggle('active',i===currentSlide));}
}
if(prevBtn)prevBtn.addEventListener('click',()=>showSlide(currentSlide-1));
if(nextBtn)nextBtn.addEventListener('click',()=>showSlide(currentSlide+1));
if(testimonialSlides.length>1){setInterval(()=>showSlide(currentSlide+1),6000);}
showSlide(0);

/* Scroll reveal */
const revealSelectors = 'section:not(.hero),.product-card,.package-card,.stat-item,.benefit-item,.testimonials-section,.purchase-feed-section,.metric,footer';
const revealEls = document.body.matches('.macro-page,.optii-page,.pingr-page') || matchMedia('(prefers-reduced-motion: reduce)').matches ? [] : document.querySelectorAll(revealSelectors);
if (revealEls.length) {
  revealEls.forEach(el=>{if(!el.closest('.hero'))el.classList.add('reveal-hidden');});
  requestAnimationFrame(()=>{requestAnimationFrame(()=>{
    const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('reveal-visible');entry.target.classList.remove('reveal-hidden');obs.unobserve(entry.target);}});},{threshold:0,rootMargin:'0px 0px 0px 0px'});
    revealEls.forEach(el=>{if(el.classList.contains('reveal-hidden'))obs.observe(el);});
  });});
}

/* Hero glow pulse */
const planet = document.querySelector('.hero');
if (planet && planet.tagName) {
  let glowPhase=0;
  const ag=()=>{glowPhase+=0.02;const i=0.3+Math.sin(glowPhase)*0.15,s=80+Math.sin(glowPhase*0.7)*30;planet.style.setProperty('--glow-intensity',i);planet.style.setProperty('--glow-spread',s+'px');requestAnimationFrame(ag);};
  ag();
}

/* Video hover desktop only */
function isMobileDevice(){return/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)||window.innerWidth<768;}
if(!isMobileDevice()){document.querySelectorAll('.product-card').forEach(card=>{const video=card.querySelector('.product-media video');if(!video)return;card.addEventListener('mouseenter',()=>video.play());card.addEventListener('mouseleave',()=>{video.pause();video.currentTime=0;});});}

/* Bloom preview starts as it enters view on desktop; mobile keeps its tap control. */
document.querySelectorAll('.bloom-preview-card').forEach(card=>{
  const frame=card.querySelector('.bloom-card-video');
  const trigger=card.querySelector('.bloom-mobile-preview');
  if(!frame)return;
  const coarse=window.matchMedia('(hover: none), (pointer: coarse)');
  let previewRequested=false;
  const playerOrigin='https://www.youtube.com';
  const playerCommand=(func)=>frame.contentWindow?.postMessage(JSON.stringify({event:'command',func,args:[]}),playerOrigin);
  frame.addEventListener('load',()=>{
    if(previewRequested)frame.contentWindow?.postMessage(JSON.stringify({event:'listening',id:'bloom-card'}),playerOrigin);
  });
  window.addEventListener('message',event=>{
    if(event.origin!==playerOrigin||event.source!==frame.contentWindow||!previewRequested)return;
    let data;
    try{data=JSON.parse(event.data);}catch{return;}
    if(data.event==='onReady')playerCommand('playVideo');
    if(data.event==='onStateChange'&&data.info===1)card.classList.add('is-previewing');
  });
  const start=()=>{
    previewRequested=true;
    if(frame.getAttribute('src')==='about:blank')frame.setAttribute('src',frame.dataset.previewSrc);
    if(coarse.matches)card.classList.add('is-previewing');
  };
  const stop=()=>{
    previewRequested=false;
    card.classList.remove('is-previewing');
    frame.setAttribute('src','about:blank');
  };
  if(trigger)trigger.addEventListener('click',event=>{
    event.preventDefault();
    event.stopPropagation();
    previewRequested?stop():start();
    trigger.textContent=previewRequested?'Stop':'Preview';
  });
  const observer=new IntersectionObserver(entries=>{
    if(!coarse.matches && entries[0].intersectionRatio >= .35)start();
    else if(!entries[0].isIntersecting)stop();
  },{threshold:[0,.35]});
  observer.observe(card);
});

/* Hero video autoplay */
const heroVideo=document.querySelector('.orbit-product.is-front video');
if(heroVideo)heroVideo.play().catch(()=>{});

/* Scroll-down indicator */
const scrollIndicator=document.querySelector('.scroll-indicator');
if(scrollIndicator){const upd=()=>{scrollIndicator.classList.toggle('is-hidden',window.scrollY>40);};window.addEventListener('scroll',upd,{passive:true});upd();}

});
