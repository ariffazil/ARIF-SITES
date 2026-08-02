/* ═══════════════════════════════════════════════════════════════════
   zen-all.js — Federated Zen Bootstrap
   Injects missing zen elements into any arifOS Federation page.
   Idempotent · zero-deps · reverse-compatible.
   Usage: <script src="/_shared/zen-all.js" defer></script>
   v1.0 · 2026-07-29 · DITEMPA BUKAN DIBERI
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';
  if (window.__zenAllLoaded) return;
  window.__zenAllLoaded = true;

  // ── 1. SKIP-LINK (always first focusable element) ──────────────
  if (!document.querySelector('.zs-skip-link, .skip-link')) {
    var sl = document.createElement('a');
    sl.href = '#main-content';
    sl.className = 'zs-skip-link';
    sl.textContent = 'Skip to main content';
    sl.setAttribute('aria-label', 'Skip to main content');
    // Inline minimal CSS so it works on any page
    sl.style.cssText = 'position:absolute;left:-9999px;top:0;z-index:99999;padding:.5rem 1rem;background:#d4af37;color:#0a0a0f;font-family:JetBrains Mono,monospace;font-size:.85rem;border-radius:4px;text-decoration:none;';
    sl.addEventListener('focus', function () {
      sl.style.cssText = 'position:fixed;top:.5rem;left:.5rem;z-index:99999;padding:.5rem 1rem;background:#d4af37;color:#0a0a0f;font-family:JetBrains Mono,monospace;font-size:.85rem;border-radius:4px;text-decoration:none;';
    });
    sl.addEventListener('blur', function () {
      sl.style.cssText = 'position:absolute;left:-9999px;top:0;z-index:99999;padding:.5rem 1rem;background:#d4af37;color:#0a0a0f;font-family:JetBrains Mono,monospace;font-size:.85rem;border-radius:4px;text-decoration:none;';
    });
    (document.body || document.documentElement).insertBefore(sl, document.body.firstChild);
  }

  // ── 2. <main id="main-content"> WRAPPER ─────────────────────────
  // If page has no <main>, wrap the body's primary content
  if (!document.querySelector('main, [role="main"]')) {
    var main = document.createElement('main');
    main.id = 'main-content';
    main.setAttribute('role', 'main');
    var body = document.body;
    // Move all body children that aren't skip-link/script/noscript into main
    var skip = body.querySelector('.zs-skip-link, .skip-link');
    var toMove = [];
    for (var i = 0; i < body.children.length; i++) {
      var el = body.children[i];
      if (el === skip) continue;
      if (el.tagName === 'SCRIPT' || el.tagName === 'NOSCRIPT' || el.tagName === 'STYLE') continue;
      // Keep header/footer/nav at body level for landmark structure
      if (el.tagName === 'HEADER' || el.tagName === 'FOOTER' || el.tagName === 'NAV') continue;
      toMove.push(el);
    }
    toMove.forEach(function (node) { main.appendChild(node); });
    if (main.children.length > 0) {
      body.appendChild(main);
    }
  } else if (!document.getElementById('main-content')) {
    var existing = document.querySelector('main');
    if (existing) existing.id = 'main-content';
  }

  // ── 3. TRINITY NAV (federation cross-link) ─────────────────────
  if (!document.querySelector('.trinity-nav')) {
    // Load the trinity-nav.js script dynamically if not already present
    var existingNavScript = document.querySelector('script[src*="trinity-nav"]');
    if (!existingNavScript) {
      var s = document.createElement('script');
      s.src = '/_shared/trinity-nav.js';
      s.defer = true;
      document.body.appendChild(s);
    }
  }

  // ── 4. ZEN-PULSE (3-second orientation bar) ───────────────────
  if (!document.querySelector('.zen-pulse, .zs-pulse')) {
    var path = window.location.pathname;
    var pageLabel = path === '/' ? 'arif-fazil.com / home'
                    : path.replace(/^\//, '').replace(/\/$/, '').replace(/\//g, ' / ') || 'page';
    var pageTitle = (document.title || '').split('·')[0].split('|')[0].trim() || pageLabel;
    var pulse = document.createElement('div');
    pulse.className = 'zen-pulse zs-pulse';
    pulse.setAttribute('aria-label', '3-second orientation');
    pulse.setAttribute('role', 'region');
    pulse.style.cssText = 'display:flex;flex-wrap:wrap;gap:.5rem;padding:.6rem 1rem;background:rgba(10,10,15,.85);backdrop-filter:blur(10px);border-bottom:1px solid #1a1a25;position:relative;z-index:5;font-family:JetBrains Mono,Inter,sans-serif;font-size:.78rem;color:#9a9aa8;';
    pulse.innerHTML =
      '<span style="display:inline-flex;align-items:baseline;gap:.4rem;padding:.18rem .65rem;border:1px solid #1a1a25;border-radius:99px;background:rgba(16,16,24,.5);">' +
        '<b style="font-family:JetBrains Mono,monospace;font-size:.6rem;letter-spacing:1.5px;color:#00d4aa;text-transform:uppercase;font-weight:600;">Where</b> ' +
        '<span>' + pageLabel + '</span>' +
      '</span>' +
      '<span style="display:inline-flex;align-items:baseline;gap:.4rem;padding:.18rem .65rem;border:1px solid #1a1a25;border-radius:99px;background:rgba(16,16,24,.5);">' +
        '<b style="font-family:JetBrains Mono,monospace;font-size:.6rem;letter-spacing:1.5px;color:#d4af37;text-transform:uppercase;font-weight:600;">What</b> ' +
        '<span>' + (pageTitle.length > 80 ? pageTitle.slice(0, 77) + '…' : pageTitle) + '</span>' +
      '</span>' +
      '<span style="display:inline-flex;align-items:baseline;gap:.4rem;padding:.18rem .65rem;border:1px solid #1a1a25;border-radius:99px;background:rgba(16,16,24,.5);">' +
        '<b style="font-family:JetBrains Mono,monospace;font-size:.6rem;letter-spacing:1.5px;color:#00d4aa;text-transform:uppercase;font-weight:600;">Next</b> ' +
        '<a href="https://arif-fazil.com" style="color:#00d4aa;text-decoration:none;">← federation home</a>' +
      '</span>';
    // Insert after skip-link, before main
    var skipEl = document.querySelector('.zs-skip-link, .skip-link');
    var mainEl = document.querySelector('main, [role="main"]');
    if (skipEl && skipEl.nextSibling) {
      skipEl.parentNode.insertBefore(pulse, skipEl.nextSibling);
    } else if (mainEl) {
      body.insertBefore(pulse, mainEl);
    } else {
      body.insertBefore(pulse, body.firstChild);
    }
  }

  // ── 5. ARIA: Add aria-label to bare <nav> elements ─────────────
  var bareNavs = document.querySelectorAll('nav:not([aria-label]):not([aria-labelledby])');
  bareNavs.forEach(function (n, idx) {
    n.setAttribute('aria-label', 'Page navigation ' + (idx + 1));
  });

  // ── 6. BACK-TO-FEDERATION link (if not already present) ──────
  var hasBack = !!document.querySelector('a[href*="arif-fazil.com/"][class*="back"], .back-btn, [class*="back-btn"]');
  var onHome = window.location.pathname === '/' || window.location.pathname === '/index.html';
  if (!hasBack && !onHome) {
    // Add to first header if present
    var hdr = document.querySelector('header, nav, .trinity-nav');
    if (hdr && !hdr.querySelector('.zs-back-home')) {
      var back = document.createElement('a');
      back.href = 'https://arif-fazil.com';
      back.className = 'zs-back-home';
      back.textContent = '← HOME';
      back.style.cssText = 'font-family:JetBrains Mono,monospace;font-size:.7rem;letter-spacing:1.5px;color:#00d4aa;border:1px solid #00d4aa;padding:.3rem .7rem;border-radius:6px;text-decoration:none;margin-left:1rem;display:inline-block;';
      back.setAttribute('aria-label', 'Back to arif-fazil.com home');
      hdr.appendChild(back);
    }
  }

  // ── 7. DOCTRINE FOOTER (if not already) ────────────────────────
  if (!document.querySelector('.zs-doctrine, footer')) {
    var f = document.createElement('footer');
    f.className = 'zs-doctrine';
    f.style.cssText = 'border-top:1px solid #1a1a25;padding:1.5rem 1rem;text-align:center;font-family:JetBrains Mono,monospace;font-size:.7rem;letter-spacing:3px;color:#d4af37;margin-top:3rem;';
    f.innerHTML = 'DITEMPA BUKAN DIBERI · arifOS Federation';
    document.body.appendChild(f);
  }

  // ── 8. MARK ZEN-LOADED ─────────────────────────────────────────
  document.documentElement.setAttribute('data-zen-all', 'v1');
})();
