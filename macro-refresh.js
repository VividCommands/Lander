(() => {
  const gallery = document.querySelector('.macro-gallery');
  if (gallery) {
    const frames = [...gallery.querySelectorAll('.macro-frame')];
    const edition = document.getElementById('macro-edition');
    const caption = document.getElementById('macro-caption');
    const pause = gallery.querySelector('[data-gallery="pause"]');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let current = 0;
    let paused = reducedMotion.matches;
    let timer;
    function show(index) {
      current = (index + frames.length) % frames.length;
      frames.forEach((frame, i) => {
        frame.hidden = i !== current;
        frame.classList.toggle('is-current', i === current);
      });
      edition.textContent = frames[current].dataset.tier;
      edition.classList.toggle('is-pro', edition.textContent === 'Pro');
      caption.textContent = frames[current].dataset.caption;
    }
    function restart() {
      clearInterval(timer);
      pause.textContent = paused ? 'Play' : 'Pause';
      pause.setAttribute('aria-label', paused ? 'Play screenshots' : 'Pause screenshots');
      if (!paused && !document.hidden) timer = setInterval(() => show(current + 1), 5000);
    }
    gallery.querySelector('[data-gallery="prev"]').addEventListener('click', () => { show(current - 1); restart(); });
    gallery.querySelector('[data-gallery="next"]').addEventListener('click', () => { show(current + 1); restart(); });
    pause.addEventListener('click', () => { paused = !paused; restart(); });
    gallery.addEventListener('mouseenter', () => clearInterval(timer));
    gallery.addEventListener('mouseleave', restart);
    gallery.addEventListener('focusin', () => clearInterval(timer));
    gallery.addEventListener('focusout', event => { if (!gallery.contains(event.relatedTarget)) restart(); });
    document.addEventListener('visibilitychange', restart);
    reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; restart(); });
    restart();
  }

  const dialog = document.getElementById('macro-renew-dialog');
  if (!dialog) return;
  const opener = document.getElementById('macro-renew-open');
  const form = document.getElementById('macro-renew-form');
  const input = document.getElementById('macro-license-key');
  const status = document.getElementById('macro-renew-status');
  const submit = document.getElementById('macro-renew-submit');
  const checkout = document.getElementById('macro-renew-checkout');
  let request;
  let checkoutExpiry;
  function resetResult() {
    clearTimeout(checkoutExpiry);
    checkout.hidden = true;
    checkout.removeAttribute('href');
    status.textContent = '';
    status.className = '';
    input.removeAttribute('aria-invalid');
  }
  function error(message) {
    status.textContent = message;
    status.className = 'is-error';
  }
  opener.addEventListener('click', () => { form.reset(); resetResult(); dialog.showModal(); input.focus(); });
  document.getElementById('macro-renew-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { request?.abort(); form.reset(); resetResult(); opener.focus(); });
  input.addEventListener('input', () => { request?.abort(); resetResult(); });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    resetResult();
    const key = input.value.trim();
    if (!key || key.length > 100) { input.setAttribute('aria-invalid', 'true'); error('Enter your license key.'); input.focus(); return; }
    request?.abort();
    const controller = new AbortController();
    request = controller;
    submit.disabled = true;
    submit.textContent = 'Checking…';
    const timeout = setTimeout(() => controller.abort('timeout'), 25000);
    try {
      const response = await fetch('https://gowway.pythonanywhere.com/api/macro/renewal/verify', {
        method: 'POST', headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({license_key: key}), signal: controller.signal,
        credentials: 'omit', cache: 'no-store', referrerPolicy: 'no-referrer'
      });
      const data = await response.json();
      if (request !== controller || !dialog.open) return;
      if (!response.ok || data.eligible !== true) {
        const messages = {
          ineligible: 'This key does not qualify. Use a key from the new Standard, Pro, or Renew plans.',
          rate_limited: 'Too many checks. Please wait a minute and try again.',
          unavailable: 'Key verification is temporarily unavailable. Please try again shortly.'
        };
        error(messages[data.error] || messages.unavailable);
        if (data.error === 'ineligible') input.setAttribute('aria-invalid', 'true');
        return;
      }
      const url = new URL(data.checkout_url);
      if (url.protocol !== 'https:' || url.hostname !== 'payhip.com' || url.pathname !== '/buy' || url.searchParams.get('link') !== 'i627S') throw new Error('Invalid checkout');
      status.textContent = '';
      checkout.href = url.href;
      checkout.hidden = false;
      checkoutExpiry = setTimeout(() => { resetResult(); status.textContent = 'Please verify your key again to continue.'; }, 300000);
      status.textContent = 'Opening checkout…';
      window.location.assign(url.href);
    } catch (e) {
      if (request === controller && dialog.open && (e.name !== 'AbortError' || controller.signal.reason === 'timeout')) error('Unable to check your key right now. Please try again.');
    } finally {
      clearTimeout(timeout);
      if (request === controller) { submit.disabled = false; submit.textContent = 'Submit'; }
    }
  });
})();
