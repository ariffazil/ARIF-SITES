// Trinity Navigation Loader — injects shared nav into all arifOS Federation sites
// Served from /_shared/trinity-nav.js — included by all Trinity sites
// DITEMPA BUKAN DIBERI — Forged, Not Given

(function() {
  if (document.querySelector('.trinity-nav')) return;

  var nav = document.createElement('nav');
  nav.className = 'trinity-nav';
  nav.setAttribute('role', 'navigation');
  nav.setAttribute('aria-label', 'Trinity Navigation');
  nav.innerHTML =
    '<a href="https://arif-fazil.com" class="soul">&Psi; SOUL</a>' +
    '<span class="sep">|</span>' +
    '<a href="https://arifos.arif-fazil.com" class="mind">&Omega; MIND</a>' +
    '<span class="sep">|</span>' +
    '<a href="https://aaa.arif-fazil.com" class="body">&Delta; BODY</a>' +
    '<span class="motto">DITEMPA BUKAN DIBERI</span>';

  if (document.body) {
    document.body.insertBefore(nav, document.body.firstChild);
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.body.insertBefore(nav, document.body.firstChild);
    });
  }

  var style = document.createElement('style');
  style.textContent =
    '.trinity-nav{display:flex;gap:0;justify-content:center;align-items:center;' +
    'padding:0.6rem 1rem;background:#0a0a0a;border-bottom:2px solid #1a1a1a;' +
    'font-family:"JetBrains Mono","SF Mono",monospace;font-size:0.78rem;' +
    'letter-spacing:0.05em;flex-wrap:wrap}' +
    '.trinity-nav a{color:#888;text-decoration:none;padding:0.3rem 0.8rem;' +
    'border-radius:3px;transition:all 0.15s ease}' +
    '.trinity-nav a:hover{color:#fff;background:rgba(255,255,255,0.05)}' +
    '.trinity-nav a.soul{color:#FF3333}' +
    '.trinity-nav a.soul:hover{background:rgba(255,51,51,0.1)}' +
    '.trinity-nav a.mind{color:#00D4AA}' +
    '.trinity-nav a.mind:hover{background:rgba(0,212,170,0.1)}' +
    '.trinity-nav a.body{color:#D4A853}' +
    '.trinity-nav a.body:hover{background:rgba(212,168,83,0.1)}' +
    '.trinity-nav .sep{color:#333;margin:0 0.15rem;user-select:none}' +
    '.trinity-nav .motto{color:#444;font-size:0.65rem;margin-left:auto;font-style:italic}';
  document.head.appendChild(style);
})();
