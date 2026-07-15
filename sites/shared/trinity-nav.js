// Trinity Navigation Loader — injects shared nav into all arifOS Federation sites
// Served from /_shared/trinity-nav.js — included by all Trinity sites
// DITEMPA BUKAN DIBERI — Forged, Not Given
// Pattern 6: Freshness check added 2026-07-15 — detects stale deployments

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
    '<span class="sep">|</span>' +
    '<a href="https://geox.arif-fazil.com" class="geox">&Phi; GEOX</a>' +
    '<span class="sep">|</span>' +
    '<a href="https://wealth.arif-fazil.com" class="wealth">&Xi; WEALTH</a>' +
    '<span class="sep">|</span>' +
    '<a href="https://well.arif-fazil.com" class="well">&Omega;&#9733; WELL</a>' +
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
    '.trinity-nav a.geox{color:#5a9e38}' +
    '.trinity-nav a.geox:hover{background:rgba(90,158,56,0.1)}' +
    '.trinity-nav a.wealth{color:#D4A853}' +
    '.trinity-nav a.wealth:hover{background:rgba(212,168,83,0.1)}' +
    '.trinity-nav a.well{color:#ff4444}' +
    '.trinity-nav a.well:hover{background:rgba(255,68,68,0.1)}' +
    '.trinity-nav .sep{color:#333;margin:0 0.15rem;user-select:none}' +
    '.trinity-nav .motto{color:#444;font-size:0.65rem;margin-left:auto;font-style:italic}' +
    '.freshness-warning{display:none;padding:0.5rem 1rem;text-align:center;' +
    'font-family:"JetBrains Mono","SF Mono",monospace;font-size:0.75rem;' +
    'background:#1a1612;color:#FF9500;border-bottom:1px solid #332200}' +
    '.freshness-warning.visible{display:block}';
  document.head.appendChild(style);

  // ── Pattern 6: Freshness Check ──────────────────────────────────
  // Fetches /build-info.json, shows warning if deployment is > 7 days old
  // Read-only, no state change, F2 TRUTH mechanism
  function checkFreshness() {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', '/build-info.json', true);
      xhr.timeout = 5000;
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          try {
            var info = JSON.parse(xhr.responseText);
            if (!info.built_at) return;
            var built = new Date(info.built_at);
            var now = new Date();
            var ageMs = now - built;
            var ageDays = Math.floor(ageMs / 86400000);
            if (ageDays > 7) {
              var banner = document.createElement('div');
              banner.className = 'freshness-warning visible';
              banner.textContent = '\u26A0\uFE0F This surface was last deployed ' + ageDays + ' days ago (' + info.built_at.split('T')[0] + '). Data may be stale.';
              if (document.body) {
                document.body.insertBefore(banner, document.body.firstChild);
              }
            }
          } catch (e) { /* parse error — silent */ }
        }
      };
      xhr.send();
    } catch (e) { /* network error — silent */ }
  }
  checkFreshness();
})();
