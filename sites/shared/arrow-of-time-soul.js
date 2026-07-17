// Arrow of Time — Ψ SOUL Overlay
// Human temporal frame: weekday, age-of-canon, sovereign timeline
// Loads ONLY on data-ring="SOUL" surfaces (arif-fazil.com)
// Canon genesis: 000_SOVEREIGN_FORGE_2026-06-07T14:45:00Z
// DITEMPA BUKAN DIBERI — Forged, Not Given.

(function () {
  // Only activate on SOUL surfaces
  var ring = document.documentElement.getAttribute('data-ring');
  if (ring !== 'SOUL') return;
  if (document.getElementById('aot-soul-overlay')) return;

  var CANON_GENESIS = new Date('2026-06-07T14:45:00Z').getTime();
  var MS_PER_DAY = 86400000;

  var WEEKDAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December'];

  var style = document.createElement('style');
  style.textContent =
    '#aot-soul-overlay{' +
      'display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap;' +
      'padding:0.25rem 1rem;background:#0a0a0a;' +
      'font-family:"JetBrains Mono","SF Mono","Fira Code",monospace;' +
      'font-size:0.65rem;letter-spacing:0.03em;color:#555;' +
      'border-bottom:1px solid #151515;min-height:22px' +
    '}' +
    '#aot-soul-overlay .sot-sep{color:#222;margin:0 0.4rem}' +
    '#aot-soul-overlay .sot-label{color:#383838;font-size:0.55rem;text-transform:uppercase;letter-spacing:0.08em;margin-right:0.25rem}' +
    '#aot-soul-overlay .sot-date{color:#D4A853}' +  /* gold — human time */
    '#aot-soul-overlay .sot-weekday{color:#888}' +
    '#aot-soul-overlay .sot-canon{color:#00D4AA}' +  /* teal — canon age */
    '#aot-soul-overlay .sot-canon-label{color:#383838}' +
    '#aot-soul-overlay .sot-timeline-bar{' +
      'display:inline-flex;align-items:center;gap:0.25rem' +
    '}' +
    '#aot-soul-overlay .sot-timeline-track{' +
      'width:60px;height:2px;background:#1a1a1a;border-radius:1px;overflow:hidden' +
    '}' +
    '#aot-soul-overlay .sot-timeline-fill{' +
      'height:100%;border-radius:1px;' +
      'background:linear-gradient(90deg,#D4A853,#00D4AA)' +
    '}' +
    '#aot-soul-overlay .sot-myt{color:#666}' +
    '#aot-soul-overlay .sot-quote{' +
      'color:#333;font-style:italic;font-size:0.55rem;margin-left:0.5rem' +
    '}' +
    '@media(max-width:600px){' +
      '#aot-soul-overlay{font-size:0.55rem;padding:0.2rem 0.5rem}' +
      '#aot-soul-overlay .sot-quote{display:none}' +
    '}';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'aot-soul-overlay';
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-label', 'Ψ SOUL temporal overlay — human frame');

  function insert() {
    var mainClock = document.getElementById('arrow-of-time');
    if (mainClock && mainClock.nextSibling) {
      mainClock.parentNode.insertBefore(bar, mainClock.nextSibling);
    } else if (document.body) {
      document.body.appendChild(bar);
    }
  }

  if (document.getElementById('arrow-of-time')) {
    insert();
  } else {
    // Wait for the main clock to appear
    var observer = new MutationObserver(function () {
      if (document.getElementById('arrow-of-time')) {
        observer.disconnect();
        insert();
        tick();
      }
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  function ordinal(n) {
    var s = ['th', 'st', 'nd', 'rd'];
    var v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function tick() {
    var now = new Date();

    // MYT date components
    var mytNow = new Date(now.getTime() + 8 * 3600000);
    var weekday = WEEKDAYS[mytNow.getUTCDay()];
    var day = mytNow.getUTCDate();
    var month = MONTHS[mytNow.getUTCMonth()];
    var year = mytNow.getUTCFullYear();

    // Human-readable MYT time
    var h = mytNow.getUTCHours();
    var ampm = h >= 12 ? 'pm' : 'am';
    var h12 = h % 12 || 12;
    var mytStr = h12 + ':' + pad(mytNow.getUTCMinutes()) + ' ' + ampm;

    // Age of canon
    var elapsed = now.getTime() - CANON_GENESIS;
    var canonDays = Math.floor(elapsed / MS_PER_DAY);
    var canonHours = Math.floor((elapsed % MS_PER_DAY) / 3600000);

    // Sovereign timeline — progress through year 1 of canon
    // Year 1 ends: 2027-06-07T14:45:00Z
    var year1End = CANON_GENESIS + (365.25 * MS_PER_DAY);
    var yearPct = Math.min(100, (elapsed / (year1End - CANON_GENESIS)) * 100);

    // Build HTML
    bar.innerHTML =
      '<span class="sot-label">Ψ</span>' +
      '<span class="sot-weekday">' + weekday + '</span>' +
      '<span class="sot-sep">·</span>' +
      '<span class="sot-date">' + ordinal(day) + ' ' + month + ' ' + year + '</span>' +
      '<span class="sot-sep">·</span>' +
      '<span class="sot-myt">' + mytStr + ' MYT</span>' +
      '<span class="sot-sep">|</span>' +
      '<span class="sot-canon-label">CANON</span>' +
      '<span class="sot-canon">Day ' + canonDays + '</span>' +
      '<span class="sot-sep">·</span>' +
      '<span class="sot-timeline-bar">' +
        '<span class="sot-timeline-track"><span class="sot-timeline-fill" style="width:' + yearPct.toFixed(1) + '%"></span></span>' +
        '<span class="sot-label">' + yearPct.toFixed(0) + '% Y1</span>' +
      '</span>' +
      '<span class="sot-quote">"Intelligence is what time looks like"</span>';
  }

  tick();
  setInterval(tick, 1000);
})();
