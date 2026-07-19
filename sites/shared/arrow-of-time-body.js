// Arrow of Time — Δ BODY Overlay
// Execution temporal frame: AAA gateway, A-FORGE executor, seal chain heartbeat
// Loads ONLY on data-ring="BODY" surfaces (aaa.arif-fazil.com)
// Fetches: /health, A-FORGE health, /api/seal-chain/head (the real heartbeat)
// DITEMPA BUKAN DIBERI — Forged, Not Given.

(function () {
  var ring = document.documentElement.getAttribute('data-ring');
  if (ring !== 'BODY') return;
  if (document.getElementById('aot-body-overlay')) return;

  var style = document.createElement('style');
  style.textContent =
    '#aot-body-overlay{' +
      'display:flex;align-items:center;justify-content:center;gap:0;flex-wrap:wrap;' +
      'padding:0.25rem 1rem;background:#0a0a0a;' +
      'font-family:"JetBrains Mono","SF Mono","Fira Code",monospace;' +
      'font-size:0.65rem;letter-spacing:0.03em;color:#555;' +
      'border-bottom:1px solid #151515;min-height:22px' +
    '}' +
    '#aot-body-overlay .bot-sep{color:#222;margin:0 0.4rem}' +
    '#aot-body-overlay .bot-label{color:#383838;font-size:0.55rem;text-transform:uppercase;letter-spacing:0.08em;margin-right:0.25rem}' +
    '#aot-body-overlay .bot-status{color:#D4A853}' +
    '#aot-body-overlay .bot-status-err{color:#b83060}' +
    '#aot-body-overlay .bot-forge{color:#00D4AA}' +
    '#aot-body-overlay .bot-forge-err{color:#b83060}' +
    '#aot-body-overlay .bot-chain{color:#00D4AA}' +
    '#aot-body-overlay .bot-chain-hash{color:#555}' +
    '#aot-body-overlay .bot-fresh{color:#5a9e38}' +
    '#aot-body-overlay .bot-stale{color:#c46a1a}' +
    '#aot-body-overlay .bot-expired{color:#b83060}' +
    '#aot-body-overlay .bot-detail{color:#666}' +
    '#aot-body-overlay .bot-pulse{' +
      'display:inline-block;width:5px;height:5px;border-radius:50%;' +
      'background:#D4A853;box-shadow:0 0 4px #D4A853;animation:bot-pulse 2s infinite' +
    '}' +
    '#aot-body-overlay .bot-pulse-forge{' +
      'display:inline-block;width:5px;height:5px;border-radius:50%;' +
      'background:#00D4AA;box-shadow:0 0 4px #00D4AA;animation:bot-pulse 2s infinite' +
    '}' +
    '#aot-body-overlay .bot-pulse-chain{' +
      'display:inline-block;width:5px;height:5px;border-radius:50%;' +
      'background:#00D4AA;box-shadow:0 0 6px #00D4AA;animation:bot-pulse-chain 1.5s infinite' +
    '}' +
    '#aot-body-overlay .bot-pulse-err{' +
      'display:inline-block;width:5px;height:5px;border-radius:50%;' +
      'background:#b83060;box-shadow:0 0 4px #b83060' +
    '}' +
    '#aot-body-overlay .bot-pulse-warn{' +
      'display:inline-block;width:5px;height:5px;border-radius:50%;' +
      'background:#c46a1a;box-shadow:0 0 4px #c46a1a' +
    '}' +
    '@keyframes bot-pulse{0%,100%{opacity:1}50%{opacity:.4}}' +
    '@keyframes bot-pulse-chain{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.3)}}' +
    '#aot-body-overlay .bot-quote{' +
      'color:#333;font-style:italic;font-size:0.55rem;margin-left:0.5rem' +
    '}' +
    '@media(max-width:600px){' +
      '#aot-body-overlay{font-size:0.55rem;padding:0.2rem 0.5rem}' +
      '#aot-body-overlay .bot-quote{display:none}' +
      '#aot-body-overlay .bot-chain-hash{display:none}' +
    '}';
  document.head.appendChild(style);

  var bar = document.createElement('div');
  bar.id = 'aot-body-overlay';
  bar.setAttribute('role', 'status');
  bar.setAttribute('aria-label', 'Δ BODY temporal overlay — execution frame');

  bar.innerHTML =
    '<span class="bot-label">Δ</span>' +
    '<span class="bot-pulse-warn"></span>' +
    '<span class="bot-status">PROBING...</span>';

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
  var lastChainSeq = -1;
  var PROBE_INTERVAL = 10000; // 10 seconds — body needs fast pulse

  function probe() {
    var now = Date.now();
    if (now - lastProbe < PROBE_INTERVAL) return;
    lastProbe = now;

    // Three data sources: AAA health, A-FORGE health, seal chain head
    Promise.allSettled([
      fetch('/health').then(function(r) { return r.json(); }),
      fetch('https://arifos.arif-fazil.com/api/organs/a-forge/health').then(function(r) { return r.json(); }),
      fetch('/api/seal-chain/head').then(function(r) { return r.json(); })
    ]).then(function(results) {
      var aaa = results[0].status === 'fulfilled' ? results[0].value : null;
      var forge = results[1].status === 'fulfilled' ? results[1].value : null;
      var chain = results[2].status === 'fulfilled' ? results[2].value : null;

      var aaaOk = aaa && aaa.status === 'healthy';
      var forgeOk = forge && forge.ok === true;
      var vaultOk = aaa && aaa.vault === 'CONNECTED';
      var chainOk = chain && typeof chain.seq === 'number';

      // Detect new chain events (heartbeat tick)
      var chainPulse = chainOk && chain.seq !== lastChainSeq;
      if (chainOk) lastChainSeq = chain.seq;

      // Chain hash (short form)
      var chainHash = '';
      if (chain && chain.hash) {
        chainHash = chain.hash.replace('sha256:', '').substring(0, 8);
      }

      // Chain age
      var chainAge = '';
      if (chain && chain.epoch) {
        var chainTime = new Date(chain.epoch).getTime();
        var ageSec = Math.floor((now - chainTime) / 1000);
        if (ageSec < 60) chainAge = ageSec + 's ago';
        else if (ageSec < 3600) chainAge = Math.floor(ageSec / 60) + 'm ago';
        else if (ageSec < 86400) chainAge = Math.floor(ageSec / 3600) + 'h ago';
        else chainAge = Math.floor(ageSec / 86400) + 'd ago';
      }

      // Freshness
      var freshClass = 'bot-fresh';
      var freshLabel = 'FRESH';
      if (forge && forge.freshness) {
        if (forge.freshness.status === 'stale') { freshClass = 'bot-stale'; freshLabel = 'STALE'; }
        else if (forge.freshness.status === 'expired') { freshClass = 'bot-expired'; freshLabel = 'EXPIRED'; }
        var age = forge.freshness.age_seconds;
        if (age !== undefined) {
          if (age < 60) freshLabel += ' · ' + age + 's';
          else if (age < 3600) freshLabel += ' · ' + Math.floor(age / 60) + 'm';
          else freshLabel += ' · ' + Math.floor(age / 3600) + 'h';
        }
      }

      var auth = forge ? forge.authority_ceiling : '?';

      // Build — the chain dot is the REAL heartbeat
      bar.innerHTML =
        '<span class="bot-label">Δ</span>' +
        '<span class="' + (aaaOk ? 'bot-pulse' : 'bot-pulse-err') + '"></span>' +
        '<span class="bot-sep">|</span>' +
        '<span class="bot-label">AAA</span>' +
        '<span class="' + (aaaOk ? 'bot-status' : 'bot-status-err') + '">' +
          (aaaOk ? 'LIVE' : 'DOWN') +
        '</span>' +
        '<span class="bot-sep">|</span>' +
        '<span class="' + (forgeOk ? 'bot-pulse-forge' : 'bot-pulse-err') + '"></span>' +
        '<span class="bot-label">FORGE</span>' +
        '<span class="' + (forgeOk ? 'bot-forge' : 'bot-forge-err') + '">' +
          (forgeOk ? 'LIVE' : 'DOWN') +
        '</span>' +
        '<span class="bot-sep">|</span>' +
        '<span class="' + (chainPulse ? 'bot-pulse-chain' : (chainOk ? 'bot-pulse-forge' : 'bot-pulse-warn')) + '"></span>' +
        '<span class="bot-label">CHAIN</span>' +
        '<span class="' + (chainOk ? 'bot-chain' : 'bot-stale') + '">' +
          (chainOk ? 'seq=' + chain.seq : 'NO CHAIN') +
        '</span>' +
        (chainOk ? '<span class="bot-chain-hash"> · ' + chainHash + '</span>' : '') +
        (chainAge ? '<span class="bot-detail"> · ' + chainAge + '</span>' : '') +
        '<span class="bot-sep">|</span>' +
        '<span class="bot-label">AUTH</span>' +
        '<span class="bot-detail">' + auth + '</span>' +
        '<span class="bot-quote">"The heartbeat ticks because blood moved"</span>';
    }).catch(function() {
      bar.innerHTML =
        '<span class="bot-label">Δ</span>' +
        '<span class="bot-pulse-err"></span>' +
        '<span class="bot-status-err">UNREACHABLE</span>';
    });
  }

  probe();
  setInterval(probe, PROBE_INTERVAL);
})();
