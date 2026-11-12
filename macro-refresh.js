(() => {
  const gallery = document.querySelector('.macro-gallery');
  if (!gallery) return;
  const frames = [...gallery.querySelectorAll('.macro-frame')];
  frames.forEach(frame => { frame.querySelector('img').loading = 'eager'; });
  const edition = document.getElementById('macro-edition');
  const caption = document.getElementById('macro-caption');
  const position = document.getElementById('macro-position');
  const pause = gallery.querySelector('[data-gallery="pause"]');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = reducedMotion.matches;
  let timer;
  let hovered = false;
  let focused = false;
  function show(index) {
    current = (index + frames.length) % frames.length;
    frames.forEach((frame, i) => {
      frame.hidden = i !== current;
      frame.classList.toggle('is-current', i === current);
    });
    edition.textContent = frames[current].dataset.tier;
    edition.classList.toggle('is-pro', edition.textContent === 'Pro');
    caption.textContent = frames[current].dataset.caption;
    position.textContent = `${current + 1} / ${frames.length}`;
    position.setAttribute('aria-label', `Screenshot ${current + 1} of ${frames.length}`);
  }
  function restart() {
    clearInterval(timer);
    pause.textContent = paused ? 'Play' : 'Pause';
    pause.setAttribute('aria-label', paused ? 'Play screenshots' : 'Pause screenshots');
    if (!paused && !hovered && !focused && !document.hidden) timer = setInterval(() => show(current + 1), 6000);
  }
  gallery.querySelector('[data-gallery="prev"]').addEventListener('click', () => { show(current - 1); restart(); });
  gallery.querySelector('[data-gallery="next"]').addEventListener('click', () => { show(current + 1); restart(); });
  pause.addEventListener('click', () => { paused = !paused; restart(); });
  gallery.addEventListener('mouseenter', () => { hovered = true; restart(); });
  gallery.addEventListener('mouseleave', () => { hovered = false; restart(); });
  gallery.addEventListener('focusin', () => { focused = true; restart(); });
  gallery.addEventListener('focusout', event => { focused = gallery.contains(event.relatedTarget); restart(); });
  document.addEventListener('visibilitychange', restart);
  reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; restart(); });
  show(0);
  restart();
})();
