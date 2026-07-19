/**
 * Shared federation chrome — one nav + footer + organ status strip.
 * Include: <script src="/_shared/federation-chrome.js?v=20260718" data-active="geox"></script>
 * Or set window.ARIFOS_ACTIVE_ORGAN = 'geox' | 'wealth' | 'well' | 'arifos' | 'mcp' | 'root'
 */
(function () {
  var MANIFEST_URLS = [
    'https://arif-fazil.com/.well-known/arifos-federation.json',
    '/_shared/arifos-federation.json'
  ];
  var STATE_URLS = [
    'https://arifos.arif-fazil.com/api/public-state',
    'https://arifos.arif-fazil.com/public-state.json'
  ];

  function scriptTag() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      if ((scripts[i].src || '').indexOf('federation-chrome') !== -1) return scripts[i];
    }
    return null;
  }

  function activeOrgan() {
    if (window.ARIFOS_ACTIVE_ORGAN) return String(window.ARIFOS_ACTIVE_ORGAN).toLowerCase();
    var s = scriptTag();
    if (s && s.getAttribute('data-active')) return s.getAttribute('data-active').toLowerCase();
    var host = (location.hostname || '').toLowerCase();
    if (host.indexOf('geox') === 0) return 'geox';
    if (host.indexOf('wealth') === 0) return 'wealth';
    if (host.indexOf('well') === 0) return 'well';
    if (host.indexOf('mcp') === 0) return 'mcp';
    if (host.indexOf('arifos') === 0) return 'observatory';
    if (host.indexOf('aaa') === 0) return 'aaa';
    return 'root';
  }

  function fetchJson(urls) {
    var i = 0;
    function next() {
      if (i >= urls.length) return Promise.reject(new Error('all failed'));
      var u = urls[i++];
      return fetch(u, { cache: 'no-store' }).then(function (r) {
        if (!r.ok) throw new Error(String(r.status));
        return r.json();
      }).catch(next);
    }
    return next();
  }

  function injectStyles() {
    if (document.getElementById('fed-chrome-css')) return;
    var css = document.createElement('style');
    css.id = 'fed-chrome-css';
    css.textContent = [
      '.fed-nav{box-sizing:border-box;width:100%;background:#0a0a0a;border-bottom:1px solid #1a1a1a;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:0.72rem;letter-spacing:0.04em}',
      '.fed-nav-inner{display:flex;flex-wrap:wrap;gap:0.15rem;align-items:center;padding:0.45rem 1rem;max-width:1100px;margin:0 auto}',
      '.fed-nav a{color:#888;text-decoration:none;padding:0.3rem 0.65rem;border-radius:3px}',
      '.fed-nav a:hover{color:#fff;background:rgba(255,255,255,0.05)}',
      '.fed-nav a.active{color:#00D4AA;background:rgba(0,212,170,0.08)}',
      '.fed-nav .sep{color:#333;margin:0 0.15rem}',
      '.fed-status{box-sizing:border-box;width:100%;background:#111;border-bottom:1px solid #1a1a1a;font-family:system-ui,sans-serif;font-size:0.78rem;color:#9b9995}',
      '.fed-status-inner{max-width:1100px;margin:0 auto;padding:0.55rem 1rem;display:flex;flex-wrap:wrap;gap:0.5rem 1rem;align-items:center}',
      '.fed-status strong{color:#e6e4e0;font-weight:650}',
      '.fed-status a{color:#3a9ea8;text-decoration:none}',
      '.fed-status a:hover{text-decoration:underline}',
      '.fed-foot{box-sizing:border-box;width:100%;margin-top:3rem;padding:1.5rem 1rem 2rem;border-top:1px solid #1a1a1a;background:#0a0a0a;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:0.68rem;color:#706e6b}',
      '.fed-foot-inner{max-width:1100px;margin:0 auto}',
      '.fed-foot-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:0.45rem 1rem;margin-bottom:1rem}',
      '.fed-foot-grid a{color:#9b9995;text-decoration:none}',
      '.fed-foot-grid a:hover{color:#fff}',
      '.fed-foot-grid .d{color:#555;display:block;font-size:0.6rem;letter-spacing:0.08em;margin-bottom:0.15rem}',
      '.fed-foot-line{color:#555;max-width:52ch;line-height:1.5}'
    ].join('');
    document.head.appendChild(css);
  }

  function buildNav(manifest, active) {
    var nav = document.createElement('nav');
    nav.className = 'fed-nav';
    nav.setAttribute('aria-label', 'Federation');
    var inner = document.createElement('div');
    inner.className = 'fed-nav-inner';
    var items = (manifest && manifest.nav_primary) || [
      { id: 'arif', label: 'Arif', href: 'https://arif-fazil.com/' },
      { id: 'geox', label: 'GEOX', href: 'https://geox.arif-fazil.com/' },
      { id: 'wealth', label: 'WEALTH', href: 'https://wealth.arif-fazil.com/' },
      { id: 'well', label: 'WELL', href: 'https://well.arif-fazil.com/' },
      { id: 'arifos', label: 'arifOS', href: 'https://arif-fazil.com/arifos/' },
      { id: 'observatory', label: 'Observatory', href: 'https://arifos.arif-fazil.com/' }
    ];
    items.forEach(function (item, idx) {
      if (idx) {
        var sep = document.createElement('span');
        sep.className = 'sep';
        sep.textContent = '·';
        inner.appendChild(sep);
      }
      var a = document.createElement('a');
      a.href = item.href;
      a.textContent = item.label;
      var id = String(item.id || '').toLowerCase();
      if (id === active || (active === 'mcp' && id === 'arifos') || (active === 'observatory' && id === 'observatory')) {
        a.className = 'active';
        a.setAttribute('aria-current', 'page');
      }
      // highlight organ match
      if (active === id) a.className = 'active';
      inner.appendChild(a);
    });
    nav.appendChild(inner);
    return nav;
  }

  function buildStatus(state, active) {
    var bar = document.createElement('div');
    bar.className = 'fed-status';
    var inner = document.createElement('div');
    inner.className = 'fed-status-inner';
    if (!state || state.schema !== 'arifos.public-state.v1') {
      inner.innerHTML = '<span>Observed by arifOS Observatory · public-state unavailable</span>';
      bar.appendChild(inner);
      return bar;
    }
    var organs = state.organs || {};
    var row = organs[active] || organs.arifos || null;
    var rel = (state.release && state.release.release_id) || '—';
    var tools = row && row.public_tools != null ? row.public_tools : (state.mcp && state.mcp.public_tools);
    var transport = (row && row.transport) || (state.planes && state.planes.transport) || '—';
    var observed = (row && row.last_observed) || state.generated_at || (state.snapshot && state.snapshot.observed_at) || '';
    var label = (row && row.label) || active.toUpperCase();
    var evidence = (row && row.evidence_url) || 'https://arifos.arif-fazil.com/';
    var myt = '';
    if (observed) {
      try {
        var d = new Date(observed);
        var m = new Date(d.getTime() + 8 * 3600000);
        myt = m.getUTCDate() + ' ' +
          ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][m.getUTCMonth()] +
          ' ' + m.getUTCFullYear() + ', ' +
          String(m.getUTCHours()).padStart(2,'0') + ':' + String(m.getUTCMinutes()).padStart(2,'0') + ' MYT';
      } catch (e) { myt = observed; }
    }
    inner.innerHTML =
      '<span><strong>Observed by arifOS Observatory</strong></span>' +
      '<span>' + label + ': <strong>' + (tools != null ? tools + ' public tools' : '—') + '</strong> · transport ' + transport + '</span>' +
      (myt ? '<span>Last verified ' + myt + '</span>' : '') +
      '<span>Release ' + rel + '</span>' +
      '<a href="' + evidence + '">Inspect evidence</a>';
    bar.appendChild(inner);
    return bar;
  }

  function buildFooter(manifest) {
    var foot = document.createElement('footer');
    foot.className = 'fed-foot';
    var inner = document.createElement('div');
    inner.className = 'fed-foot-inner';
    var grid = document.createElement('div');
    grid.className = 'fed-foot-grid';
    var rows = (manifest && manifest.footer_rows) || [];
    rows.forEach(function (r) {
      var cell = document.createElement('div');
      cell.innerHTML = '<span class="d">' + (r.domain || '') + '</span>';
      var a = document.createElement('a');
      a.href = r.href || '#';
      a.textContent = r.name || '';
      cell.appendChild(a);
      grid.appendChild(cell);
    });
    inner.appendChild(grid);
    var line = document.createElement('p');
    line.className = 'fed-foot-line';
    line.textContent = (manifest && manifest.authority_line) ||
      'Governed by arifOS. Domain organs advise or witness. The human remains the final authority.';
    inner.appendChild(line);
    foot.appendChild(inner);
    return foot;
  }

  function mount(manifest, state) {
    injectStyles();
    var active = activeOrgan();
    if (!document.querySelector('.fed-nav')) {
      document.body.insertBefore(buildNav(manifest, active), document.body.firstChild);
    }
    // status strip under nav for organ domains
    if (!document.querySelector('.fed-status') && ['geox','wealth','well','mcp','observatory','arifos'].indexOf(active) !== -1) {
      var nav = document.querySelector('.fed-nav');
      var status = buildStatus(state, active === 'observatory' || active === 'arifos' ? 'arifos' : active === 'mcp' ? 'arifos' : active);
      if (nav && nav.nextSibling) nav.parentNode.insertBefore(status, nav.nextSibling);
      else document.body.insertBefore(status, document.body.children[1] || null);
    }
    if (!document.querySelector('.fed-foot')) {
      document.body.appendChild(buildFooter(manifest));
    }
    // replace stale tool count placeholders
    if (state && state.organs) {
      document.querySelectorAll('[data-public-tools]').forEach(function (el) {
        var id = el.getAttribute('data-public-tools');
        var row = state.organs[id];
        if (row && row.public_tools != null) el.textContent = String(row.public_tools);
      });
      document.querySelectorAll('[data-organ-release]').forEach(function (el) {
        var id = el.getAttribute('data-organ-release');
        var row = state.organs[id] || state.release;
        if (row && (row.release || row.release_id)) el.textContent = row.release || row.release_id;
      });
    }
  }

  function boot() {
    Promise.all([
      fetchJson(MANIFEST_URLS).catch(function () { return null; }),
      fetchJson(STATE_URLS).catch(function () { return null; })
    ]).then(function (pair) {
      mount(pair[0], pair[1]);
    }).catch(function () {
      mount(null, null);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
