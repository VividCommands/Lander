import {lifetime, pro, all} from './macro-slides.js?v=4';

const sets = {lifetime, pro, all};
const cached = new Map();
function preload(slide) {
  if (!cached.has(slide.src)) {
    const image = new Image();
    image.src = slide.src;
    cached.set(slide.src, image.decode().then(() => true).catch(() => false));
  }
  return cached.get(slide.src);
}

document.querySelectorAll('[data-macro-gallery]').forEach(gallery => {
  const slides = sets[gallery.dataset.macroGallery];
  const image = gallery.querySelector('img');
  if (!slides?.length || !image) return;
  const interval = Number(gallery.dataset.interval) || 6000;
  let index = 0;
  let held = false;
  let timer;
  let generation = 0;
  const initial = slides.findIndex(slide => image.getAttribute('src') === slide.src);
  if (initial >= 0) index = initial;
  slides.forEach(preload);
  function schedule() {
    clearTimeout(timer);
    if (!held && !document.hidden) timer = setTimeout(advance, interval);
  }
  async function advance() {
    const token = ++generation;
    const next = (index + 1) % slides.length;
    const slide = slides[next];
    const loaded = await preload(slide);
    if (token !== generation || held || document.hidden) return;
    if (loaded) {
      image.src = slide.src;
      image.alt = slide.alt;
      image.width = slide.width;
      image.height = slide.height;
      gallery.dataset.format = slide.format;
    }
    index = next;
    schedule();
  }
  function hold() { held = true; generation++; clearTimeout(timer); }
  function release() { if (!held) return; held = false; schedule(); }
  gallery.addEventListener('pointerdown', event => {
    if (event.button !== 0) return;
    hold();
    gallery.setPointerCapture(event.pointerId);
  });
  gallery.addEventListener('pointerup', release);
  gallery.addEventListener('pointercancel', release);
  gallery.addEventListener('lostpointercapture', release);
  gallery.addEventListener('contextmenu', event => event.preventDefault());
  gallery.addEventListener('keydown', event => {
    if (!['Space', 'Enter'].includes(event.code)) return;
    event.preventDefault();
    hold();
  });
  gallery.addEventListener('keyup', event => {
    if (!['Space', 'Enter'].includes(event.code)) return;
    event.preventDefault();
    release();
  });
  gallery.addEventListener('blur', release);
  window.addEventListener('pointerup', release);
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', () => { generation++; schedule(); });
  schedule();
});
