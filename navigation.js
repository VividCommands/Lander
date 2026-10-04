document.addEventListener('DOMContentLoaded', () => {
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


});
