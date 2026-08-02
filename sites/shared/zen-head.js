/* ═══════════════════════════════════════════════════════════════════
   zen-head.js — Zen Sovereign chrome behavior
   Sticky header state · MYT clock · safe storage. ~No dependencies.
   v1.0 · 2026-07-26 · DITEMPA BUKAN DIBERI
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // Sticky header compact state
  var head = document.querySelector('.zs-head');
  if (head) {
    var onScroll = function () {
      head.classList.toggle('scrolled', window.scrollY > 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // MYT clock — any [data-zs-clock] element
  var clocks = document.querySelectorAll('[data-zs-clock]');
  if (clocks.length) {
    var tick = function () {
      var t = new Date().toLocaleTimeString('en-MY', {
        timeZone: 'Asia/Kuala_Lumpur', hour: '2-digit', minute: '2-digit', hour12: false,
      });
      clocks.forEach(function (el) { el.textContent = t + ' MYT'; });
    };
    tick();
    setInterval(tick, 30000);
  }

  // Safe storage — pages must work fully in sandboxed environments
  window.zsStore = {
    get: function (k) { try { return window.localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { window.localStorage.setItem(k, v); } catch (e) { /* sandboxed */ } },
  };
})();
