/**
 * Federation Pulse Widget — mini status bar
 * Embed: <div id="federation-pulse" data-source="https://arifos.arif-fazil.com/api/federation-probe" data-refresh="30000"></div>
 *        <script src="/_shared/federation-pulse-widget.js?v=20260726" defer></script>
 *
 * Renders a live horizontal pulse bar: organ count · FQ · receipts · verdict
 * DITEMPA BUKAN DIBERI
 */
(function () {
  'use strict';

  var PULSE_SOURCES = [
    'https://arifos.arif-fazil.com/api/federation-probe',
    'https://arifos.arif-fazil.com/public-state.json',
    '/api/federation-probe'
  ];
  var REFRESH_MS = 30000;
  var el = document.getElementById('federation-pulse');
  if (!el) return;

  var src = el.getAttribute('data-source');
  var refresh = parseInt(el.getAttribute('data-refresh'), 10) || REFRESH_MS;

  function pulseStyle() {
    if (document.getElementById('fp-style')) return;
    var s = document.createElement('style');
    s.id = 'fp-style';
    s.textContent = [
      '#federation-pulse{display:flex;align-items:center;gap:0.75rem;padding:0.5rem 1rem;background:#141312;border-bottom:1px solid #2a2826;font-family:ui-monospace,monospace;font-size:0.7rem;color:#9b9995;overflow-x:auto;white-space:nowrap}',
      '#federation-pulse .fp-dot{display:inline-block;width:8px;height:8px;border-radius:50%;margin-right:4px}',
      '#federation-pulse .fp-dot.green{background:#22c55e}',
      '#federation-pulse .fp-dot.yellow{background:#eab308}',
      '#federation-pulse .fp-dot.red{background:#ef4444}',
      '#federation-pulse .fp-item{display:inline-flex;align-items:center}',
      '#federation-pulse .fp-label{color:#706e6b;margin-right:0.3rem}',
      '#federation-pulse .fp-val{color:#e6e4e0}',
      '#federation-pulse .fp-gold{color:#d4af37}',
      '#federation-pulse .fp-sep{color:#2a2826;margin:0 0.25rem}'
    ].join('');
    document.head.appendChild(s);
  }

  function render(data) {
    try {
      var verdict = data.verdict || data.aggregate_state || 'unknown';
      var nodes = data.nodes || data.organs || [];
      var organCount = Array.isArray(nodes) ? nodes.length : Object.keys(nodes).length;
      var operational = Array.isArray(nodes)
        ? nodes.filter(function(n){ return (n.overall && n.overall.state === 'OPERATIONAL') || n.state === 'OPERATIONAL'; }).length
        : 0;
      var fqMatch = (data.fq ? data.fq : (typeof window.__FQ !== 'undefined' ? window.__FQ : null)) || null;
      var receiptCount = data.receipts ? (data.receipts.count || data.receipts.total || 0) : 0;
      var dotClass = verdict.toUpperCase() === 'OPERATIONAL' ? 'green' : verdict.toUpperCase().indexOf('DEGRADED') >= 0 ? 'yellow' : 'red';

      el.innerHTML = [
        '<span class="fp-item"><span class="fp-dot ' + dotClass + '"></span><span class="fp-label">' + verdict + '</span></span>',
        '<span class="fp-sep">|</span>',
        '<span class="fp-item"><span class="fp-label">Organs</span><span class="fp-val">' + operational + '/' + organCount + '</span></span>',
        fqMatch ? '<span class="fp-sep">|</span><span class="fp-item"><span class="fp-label">FQ</span><span class="fp-val fp-gold">' + fqMatch + '</span></span>' : '',
        receiptCount ? '<span class="fp-sep">|</span><span class="fp-item"><span class="fp-label">Receipts</span><span class="fp-val">' + receiptCount + '</span></span>' : ''
      ].filter(Boolean).join('');
    } catch(e) {
      el.textContent = 'pulse: ' + e.message;
    }
  }

  function load() {
    var urls = src ? [src].concat(PULSE_SOURCES.filter(function(u){ return u !== src; })) : PULSE_SOURCES;
    (function tryFetch(i) {
      if (i >= urls.length) { el.textContent = 'pulse: unreachable'; return; }
      var xhr = new XMLHttpRequest();
      xhr.open('GET', urls[i], true);
      xhr.timeout = 5000;
      xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
          try { render(JSON.parse(xhr.responseText)); }
          catch(e) { el.textContent = 'pulse: parse error'; }
        } else { tryFetch(i + 1); }
      };
      xhr.onerror = function() { tryFetch(i + 1); };
      xhr.ontimeout = function() { tryFetch(i + 1); };
      xhr.send();
    })(0);
  }

  pulseStyle();
  load();
  if (refresh > 0) setInterval(load, refresh);
})();
