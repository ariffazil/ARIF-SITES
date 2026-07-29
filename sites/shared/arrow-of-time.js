// Arrow of Time — Real-time physics clock for arifOS Federation
// Shows: UTC, MYT (Asia/Kuala_Lumpur), Unix epoch, thermodynamic day progress
// One clock. Three sites. Same placement. Same reality.
// DITEMPA BUKAN DIBERI — Forged, Not Given.
// Created: 2026-07-04 by FORGE (000Ω)

(function () {
  if (document.getElementById('arrow-of-time')) return;

  var style = document.createElement('style');
  style.textContent =
    '.aot-machine{background:#080808;border-bottom:1px solid #1a1a1a;' +
    'font-family:"JetBrains Mono","SF Mono","Fira Code",monospace;' +
    'position:relative;z-index:9999}' +
    '.aot-machine>summary{cursor:pointer;list-style:none;padding:0.25rem 1rem;' +
    'color:#555;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;' +
    'user-select:none}' +
    '.aot-machine>summary::-webkit-details-marker{display:none}' +
    '.aot-machine>summary::before{content:"\\25B8\\0020";color:#333}' +
    '.aot-machine[open]>summary::before{content:"\\25BE\\0020"}' +
    '.aot-machine>summary:hover{color:#999}' +
    '#arrow-of-time{' +
      'display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap;' +
      'padding:0.35rem 1rem;background:#080808;border-bottom:1px solid #1a1a1a;' +
      'font-family:"JetBrains Mono","SF Mono","Fira Code",monospace;' +
      'font-size:0.7rem;letter-spacing:0.04em;color:#666;' +
      'position:relative;z-index:9999;user-select:none;' +
      'min-height:28px' +
    '}' +
    '#arrow-of-time .aot-sep{color:#2a2a2a;margin:0 0.5rem}' +
    '#arrow-of-time .aot-label{color:#444;font-size:0.6rem;text-transform:uppercase;letter-spacing:0.08em;margin-right:0.3rem}' +
    '#arrow-of-time .aot-utc{color:#00D4AA}' +
    '#arrow-of-time .aot-myt{color:#D4A853}' +
    '#arrow-of-time .aot-epoch{color:#555}' +
    '#arrow-of-time .aot-arrow{' +
      'display:inline-flex;align-items:center;gap:0.3rem;margin-left:0.5rem' +
    '}' +
    '#arrow-of-time .aot-arrow-bar{' +
      'width:48px;height:3px;background:#1a1a1a;border-radius:2px;overflow:hidden;position:relative' +
    '}' +
    '#arrow-of-time .aot-arrow-fill{' +
      'height:100%;border-radius:2px;transition:width 1s linear;' +
      'background:linear-gradient(90deg,#00D4AA,#D4A853)' +
    '}' +
    '#arrow-of-time .aot-arrow-label{color:#444;font-size:0.55rem}' +
    '#arrow-of-time .aot-pulse{' +
      'display:inline-block;width:5px;height:5px;border-radius:50%;' +
      'background:#00D4AA;box-shadow:0 0 4px #00D4AA;animation:aot-pulse 2s infinite' +
    '}' +
    '@keyframes aot-pulse{0%,100%{opacity:1}50%{opacity:.4}}' +
    '@media(max-width:600px){' +
      '#arrow-of-time{font-size:0.6rem;padding:0.3rem 0.5rem;gap:0.15rem}' +
      '#arrow-of-time .aot-sep{margin:0 0.25rem}' +
      '#arrow-of-time .aot-arrow-bar{width:32px}' +
    '}';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'arrow-of-time';
  bar.setAttribute('role', 'timer');
  bar.setAttribute('aria-label', 'Real-time physics clock — Arrow of Time');
  bar.innerHTML =
    '<span class="aot-pulse" aria-hidden="true"></span>' +
    '<span class="aot-sep" aria-hidden="true">|</span>' +
    '<span class="aot-label">UTC</span>' +
    '<span class="aot-utc" id="aot-utc">--:--:--</span>' +
    '<span class="aot-sep" aria-hidden="true">|</span>' +
    '<span class="aot-label">MYT</span>' +
    '<span class="aot-myt" id="aot-myt">--:--:--</span>' +
    '<span class="aot-sep" aria-hidden="true">|</span>' +
    '<span class="aot-label">DATE</span>' +
    '<span id="aot-date" style="color:#777">----/--/--</span>' +
    '<span class="aot-sep" aria-hidden="true">|</span>' +
    '<span class="aot-label">EPOCH</span>' +
    '<span class="aot-epoch" id="aot-epoch">----------</span>' +
    '<span class="aot-sep" aria-hidden="true">|</span>' +
    '<span class="aot-arrow">' +
      '<span class="aot-arrow-label">t</span>' +
      '<span class="aot-arrow-bar"><span class="aot-arrow-fill" id="aot-arrow-fill"></span></span>' +
      '<span class="aot-arrow-label" id="aot-day-pct">--%</span>' +
    '</span>';

  // 2026-07-26 (P1-HOME/S4): telemetry demoted behind a collapsed <details>.
  // bar keeps id="arrow-of-time" so overlays (soul/mind/body) still find it.
  var details = document.createElement('details');
  details.className = 'aot-machine';
  var summary = document.createElement('summary');
  summary.textContent = 'Machine time & canon telemetry';
  details.appendChild(summary);
  details.appendChild(bar);

  // Insert after trinity-nav if present, otherwise as first child of body
  function insert() {
    var trinityNav = document.querySelector('.trinity-nav');
    if (trinityNav) {
      if (trinityNav.nextSibling) {
        trinityNav.parentNode.insertBefore(details, trinityNav.nextSibling);
      } else {
        trinityNav.parentNode.appendChild(details);
      }
    } else if (document.body) {
      document.body.insertBefore(details, document.body.firstChild);
    }
  }

  if (document.body) {
    insert();
  } else {
    document.addEventListener('DOMContentLoaded', insert);
  }

  // Clock tick
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function tick() {
    var now = new Date();

    // UTC
    var utcH = pad(now.getUTCHours());
    var utcM = pad(now.getUTCMinutes());
    var utcS = pad(now.getUTCSeconds());
    var utcEl = document.getElementById('aot-utc');
    if (utcEl) utcEl.textContent = utcH + ':' + utcM + ':' + utcS;

    // MYT (UTC+8)
    var mytH = pad((now.getUTCHours() + 8) % 24);
    var mytM = pad(now.getUTCMinutes());
    var mytS = pad(now.getUTCSeconds());
    var mytEl = document.getElementById('aot-myt');
    if (mytEl) mytEl.textContent = mytH + ':' + mytM + ':' + mytS;

    // Date (YYYY-MM-DD in MYT)
    var mytDate = new Date(now.getTime() + 8 * 3600000);
    var dateStr = mytDate.getUTCFullYear() + '-' +
      pad(mytDate.getUTCMonth() + 1) + '-' +
      pad(mytDate.getUTCDate());
    var dateEl = document.getElementById('aot-date');
    if (dateEl) dateEl.textContent = dateStr;

    // Unix epoch (seconds)
    var epochEl = document.getElementById('aot-epoch');
    if (epochEl) epochEl.textContent = Math.floor(now.getTime() / 1000);

    // Day progress (thermodynamic arrow — how far through the UTC day)
    var dayMs = (now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds()) * 1000 + now.getUTCMilliseconds();
    var dayPct = (dayMs / 86400000) * 100;
    var fillEl = document.getElementById('aot-arrow-fill');
    if (fillEl) fillEl.style.width = dayPct.toFixed(1) + '%';
    var pctEl = document.getElementById('aot-day-pct');
    if (pctEl) pctEl.textContent = dayPct.toFixed(1) + '%';
  }

  tick();
  setInterval(tick, 1000);
})();
