// Arrow of Time — Ω MIND Overlay
// Constitutional temporal frame: kernel status, tools, version, epoch
// Loads ONLY on data-ring="MIND" surfaces (arifos.arif-fazil.com)
// Fetches live data from /api/status and /api/build-info
// DITEMPA BUKAN DIBERI — Forged, Not Given.

(function () {
  var ring = document.documentElement.getAttribute('data-ring');
  if (ring !== 'MIND') return;
  if (document.getElementById('aot-mind-overlay')) return;

  var style = document.createElement('style');
  style.textContent =
    '#aot-mind-overlay{' +
      'display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap;' +
      'padding:0.25rem 1rem;background:#0a0a0a;' +
      'font-family:"JetBrains Mono","SF Mono","Fira Code",monospace;' +
      'font-size:0.65rem;letter-spacing:0.03em;color:#555;' +
      'border-bottom:1px solid #151515;min-height:22px' +
    '}' +
    '#aot-mind-overlay .mot-sep{color:#222;margin:0 0.4rem}' +
    '#aot-mind-overlay .mot-label{color:#383838;font-size:0.55rem;text-transform:uppercase;letter-spacing:0.08em;margin-right:0.25rem}' +
    '#aot-mind-overlay .mot-status{color:#00D4AA}' +  /* teal — kernel alive */
    '#aot-mind-overlay .mot-status-err{color:#b83060}' +  /* error */
    '#aot-mind-overlay .mot-tools{color:#D4A853}' +  /* gold — tool count */
    '#aot-mind-overlay .mot-version{color:#666}' +
    '#aot-mind-overlay .mot-pulse{' +
      'display:inline-block;width:5px;height:5px;border-radius:50%;' +
      'background:#00D4AA;box-shadow:0 0 4px #00D4AA;animation:mot-pulse 3s infinite' +
    '}' +
    '#aot-mind-overlay .mot-pulse-err{' +
      'display:inline-block;width:5px;height:5px;border-radius:50%;' +
      'background:#b83060;box-shadow:0 0 4px #b83060' +
    '}' +
    '#aot-mind-overlay .mot-pulse-warn{' +
      'display:inline-block;width:5px;height:5px;border-radius:50%;' +
      'background:#c46a1a;box-shadow:0 0 4px #c46a1a' +
    '}' +
    '@keyframes mot-pulse{0%,100%{opacity:1}50%{opacity:.4}}' +
    '#aot-mind-overlay .mot-quote{' +
      'color:#333;font-style:italic;font-size:0.55rem;margin-left:0.5rem' +
    '}' +
    '@media(max-width:600px){' +
      '#aot-mind-overlay{font-size:0.55rem;padding:0.2rem 0.5rem}' +
      '#aot-mind-overlay .mot-quote{display:none}' +
    '}';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'aot-mind-overlay';
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-label', 'Ω MIND temporal overlay — constitutional frame');

  // Initial state
  bar.innerHTML =
    '<span class="mot-label">Ω</span>' +
    '<span class="mot-pulse-warn" id="mot-dot"></span>' +
    '<span class="mot-status" id="mot-status">PROBING...</span>';

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
    var observer = new MutationObserver(function () {
      if (document.getElementById('arrow-of-time')) {
        observer.disconnect();
        insert();
        probe();
      }
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  var lastProbe = 0;
  var PROBE_INTERVAL = 30000; // 30 seconds

  function probe() {
    var now = Date.now();
    if (now - lastProbe < PROBE_INTERVAL) return;
    lastProbe = now;

    var statusEl = document.getElementById('mot-status');
    var dotEl = document.getElementById('mot-dot');

    // Fetch both endpoints in parallel
    Promise.allSettled([
      fetch('/api/status').then(function(r) { return r.json(); }),
      fetch('/api/build-info').then(function(r) { return r.json(); })
    ]).then(function(results) {
      var status = results[0].status === 'fulfilled' ? results[0].value : null;
      var build = results[1].status === 'fulfilled' ? results[1].value : null;

      var kernelOk = status && status.health && status.health.status === 'healthy';
      // Use tools_exposed_via_mcp (what agents actually see), not internal registry count
      var tools = status && status.health ? status.health.tools_exposed_via_mcp : (build ? build.tool_count : '?');
      var version = status && status.health ? status.health.release_name : (build ? build.version : '?');
      var commit = build ? build.short_sha : (status && status.health ? status.health.git_commit : '?');
      var mcpVersion = status && status.health ? status.health.mcp_protocol_version : '?';

      // Build overlay
      bar.innerHTML =
        '<span class="mot-label">Ω</span>' +
        '<span class="' + (kernelOk ? 'mot-pulse' : 'mot-pulse-err') + '"></span>' +
        '<span class="mot-sep">|</span>' +
        '<span class="mot-label">KERNEL</span>' +
        '<span class="' + (kernelOk ? 'mot-status' : 'mot-status-err') + '">' +
          (kernelOk ? 'LIVE' : 'DOWN') +
        '</span>' +
        '<span class="mot-sep">|</span>' +
        '<span class="mot-label">TOOLS</span>' +
        '<span class="mot-tools">' + tools + '</span>' +
        '<span class="mot-sep">|</span>' +
        '<span class="mot-label">VERSION</span>' +
        '<span class="mot-version">' + version + ' · ' + commit + '</span>' +
        '<span class="mot-sep">|</span>' +
        '<span class="mot-label">MCP</span>' +
        '<span class="mot-version">' + mcpVersion + '</span>' +
        '<span class="mot-quote">"No action proceeds unless clarity is intact"</span>';
    }).catch(function() {
      bar.innerHTML =
        '<span class="mot-label">Ω</span>' +
        '<span class="mot-pulse-err"></span>' +
        '<span class="mot-status-err">UNREACHABLE</span>';
    });
  }

  probe();
  setInterval(probe, PROBE_INTERVAL);
})();
