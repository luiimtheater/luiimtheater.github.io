
(function () {
  'use strict';

  async function syncHomeHeader() {
    const mount = document.getElementById('home-header-mount');
    if (!mount) return;

    try {
      const response = await fetch('index.html', { cache: 'no-store' });
      if (!response.ok) throw new Error('index.html ' + response.status);

      const text = await response.text();
      const doc = new DOMParser().parseFromString(text, 'text/html');

      const homeHeader =
        doc.querySelector('header') ||
        doc.querySelector('.site-header') ||
        doc.querySelector('[data-site-header]');

      if (!homeHeader) throw new Error('Homepage header not found');

      doc.querySelectorAll('link[rel="stylesheet"][href]').forEach(function (link) {
        const href = link.getAttribute('href');
        if (!href) return;
        const exists = Array.from(document.querySelectorAll('link[rel="stylesheet"][href]'))
          .some(function (x) { return x.getAttribute('href') === href; });
        if (!exists) document.head.appendChild(link.cloneNode(true));
      });

      const clone = homeHeader.cloneNode(true);

      clone.querySelectorAll('[aria-current]').forEach(function (el) {
        el.removeAttribute('aria-current');
      });
      clone.querySelectorAll('.active, .is-active, .current').forEach(function (el) {
        el.classList.remove('active', 'is-active', 'current');
      });

      const current = location.pathname.split('/').pop() || 'index.html';
      clone.querySelectorAll('a[href]').forEach(function (a) {
        const href = (a.getAttribute('href') || '').split('#')[0].split('?')[0];
        if (!href) return;
        const target = href.split('/').pop() || 'index.html';
        if (target === current) a.setAttribute('aria-current', 'page');
      });

      mount.replaceWith(clone);

      doc.querySelectorAll('script[src]').forEach(function (script) {
        const src = script.getAttribute('src');
        if (!src || src.includes('sync-home-header.js')) return;
        const exists = Array.from(document.scripts)
          .some(function (x) { return x.getAttribute('src') === src; });
        if (!exists) {
          const s = document.createElement('script');
          s.src = src;
          s.defer = true;
          document.body.appendChild(s);
        }
      });
    } catch (err) {
      mount.innerHTML =
        '<div class="header-fallback"><a href="index.html">← 回首頁</a></div>';
      console.warn('Header sync failed:', err);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', syncHomeHeader);
  } else {
    syncHomeHeader();
  }
})();
