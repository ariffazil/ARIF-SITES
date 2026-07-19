/**
 * ═══════════════════════════════════════════════════════════════════════
 * Trinity Design Seam — Nav & Footer
 * ═══════════════════════════════════════════════════════════════════════
 *
 * Custom elements: <trinity-nav> · <trinity-footer>
 *
 * Nav layout (desktop two-row):
 *   [ORGANS]  arifOS · AAA · GEOX · WEALTH · WELL
 *   [ECOSYSTEM] Homepage · Genesis · Constellation   [CANON] Proof · Discoveries · Canon · VAULT999
 *
 * Cross-plane: narrative → "→ Open live organ" to *.arif-fazil.com
 *              organ     → "← Read the doctrine" to arif-fazil.com
 *
 * Auto-detects current site from window.location; highlights with gold underline.
 * Mobile: hamburger, organs-first, full-screen overlay.
 *
 * DITEMPA BUKAN DIBERI — Forged, Not Given.
 * ═══════════════════════════════════════════════════════════════════════
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════
   * SITE DEFINITIONS
   * ═══════════════════════════════════════════════════════════════════ */

  var SITES = [
    { id: 'arifos',     label: 'arifOS',     group: 'organs',    host: 'arifos.arif-fazil.com',  path: '/',   ring: 'mind' },
    { id: 'aaa',        label: 'AAA',        group: 'organs',    host: 'aaa.arif-fazil.com',     path: '/',   ring: 'mind' },
    { id: 'geox',       label: 'GEOX',       group: 'organs',    host: 'geox.arif-fazil.com',    path: '/',   ring: 'body' },
    { id: 'wealth',     label: 'WEALTH',     group: 'organs',    host: 'wealth.arif-fazil.com',  path: '/',   ring: 'body' },
    { id: 'well',       label: 'WELL',       group: 'organs',    host: 'well.arif-fazil.com',    path: '/',   ring: 'body' },
    { id: 'homepage',   label: 'Homepage',   group: 'ecosystem', host: 'arif-fazil.com',          path: '/',   ring: 'soul' },
    { id: 'genesis',    label: 'Genesis',    group: 'ecosystem', host: 'arif-fazil.com',          path: '/genesis',  ring: 'soul' },
    { id: 'constellation', label: 'Constellation', group: 'ecosystem', host: 'arif-fazil.com',    path: '/constellation', ring: 'soul' },
    { id: 'proof',      label: 'Proof',      group: 'canon',     host: 'arif-fazil.com',          path: '/proof', ring: 'soul' },
    { id: 'discoveries',label: 'Discoveries',group: 'canon',     host: 'arif-fazil.com',          path: '/discoveries', ring: 'soul' },
    { id: 'canon',      label: 'Canon',      group: 'canon',     host: 'arif-fazil.com',          path: '/canon', ring: 'soul' },
    { id: 'vault',      label: 'VAULT999',   group: 'canon',     host: 'arif-fazil.com',          path: '/vault', ring: 'soul' },
  ];

  var ORGAN_IDS = ['arifos', 'aaa', 'geox', 'wealth', 'well'];
  var GROUP_ORDER = ['organs', 'ecosystem', 'canon'];
  var GROUP_LABELS = { organs: 'Organs', ecosystem: 'Ecosystem', canon: 'Canon' };

  /* ─── Active site detection ─────────────────────────────────────── */

  function detectActive() {
    var host = window.location.hostname;
    var path = window.location.pathname;
    var score = -1;
    var best = null;

    for (var i = 0; i < SITES.length; i++) {
      var s = SITES[i];
      var match = false;
      if (s.host === host && path.indexOf(s.path) === 0) {
        match = true;
      } else if (host === 'localhost' && s.id === 'arifos') {
        match = true;
      }
      if (match && s.path.length > score) {
        score = s.path.length;
        best = s;
      }
    }
    return best;
  }

  /* ─── Cross-plane link ──────────────────────────────────────────── */

  function crossPlane(active) {
    var host = window.location.hostname;
    if (host === 'arif-fazil.com' || host.indexOf('arif-fazil.com') === -1) {
      // On narrative or unknown → link to primary organ
      return { label: '\u2192 Open live organ', href: 'https://arifos.arif-fazil.com' };
    }
    // On an organ → link back to narrative
    var orgPath = '';
    if (active && ORGAN_IDS.indexOf(active.id) !== -1) {
      orgPath = '/' + active.id.toLowerCase();
    }
    return { label: '\u2190 Read the doctrine', href: 'https://arif-fazil.com' + orgPath };
  }

  /* ─── Groups ─────────────────────────────────────────────────────── */

  function groupItems() {
    var groups = {};
    for (var i = 0; i < SITES.length; i++) {
      var s = SITES[i];
      if (!groups[s.group]) groups[s.group] = [];
      groups[s.group].push(s);
    }
    return groups;
  }

  /* ═══════════════════════════════════════════════════════════════════
   * <trinity-nav> — NAVIGATION COMPONENT
   * ═══════════════════════════════════════════════════════════════════ */

  var TrinityNav = (function () {

    function TrinityNav() {
      HTMLElement.call(this);
      this.attachShadow({ mode: 'open' });
      this._active = detectActive();
    }

    TrinityNav.prototype = Object.create(HTMLElement.prototype);
    TrinityNav.prototype.constructor = TrinityNav;

    TrinityNav.prototype.connectedCallback = function () {
      this.render();
    };

    TrinityNav.prototype.renderItems = function (items, activeId) {
      var html = '';
      for (var i = 0; i < items.length; i++) {
        var s = items[i];
        var cls = 'tn-i';
        if (s.id === activeId) cls += ' tn-i--on';
        html += '<a href="' + s.href + '" class="' + cls + '" data-id="' + s.id + '">' + s.label + '</a>';
      }
      return html;
    };

    TrinityNav.prototype.render = function () {
      var shadow = this.shadowRoot;
      var activeId = this._active ? this._active.id : null;
      var cross = crossPlane(this._active);
      var groups = groupItems();

      var rowsHtml = '';
      for (var gi = 0; gi < GROUP_ORDER.length; gi++) {
        var gk = GROUP_ORDER[gi];
        var items = groups[gk] || [];
        if (items.length === 0) continue;
        rowsHtml += '<div class="tn-g">' +
          '<span class="tn-gl">' + GROUP_LABELS[gk] + '</span>' +
          this.renderItems(items, activeId) +
          '</div>';
      }

      shadow.innerHTML =
        '<style>' +
        ':host{display:block;--c-gold:var(--gold,#D4A853);--c-text:var(--text,#d4d2ce);--c-muted:var(--text-muted,#71717A);--c-bg:var(--bg,#0A0A0B);--c-border:var(--border-subtle,#27272A);--f-sans:var(--font-sans,Inter,system-ui,sans-serif);--f-mono:var(--font-mono,"JetBrains Mono","SF Mono",monospace)}' +
        '.tn-w{background:var(--c-bg);border-bottom:1px solid var(--c-border);font-family:var(--f-sans);position:relative;z-index:100}' +
        '.tn-i{color:var(--c-muted);text-decoration:none;font-size:.82rem;padding:.2rem 0;border-bottom:2px solid transparent;transition:color .15s,border-color .15s;white-space:nowrap}' +
        '.tn-i:hover{color:var(--c-text)}' +
        '.tn-i--on{color:var(--c-gold);border-bottom-color:var(--c-gold)}' +
        '.tn-i + .tn-i:before{content:"\\00B7";color:var(--c-muted);opacity:.3;margin:0 .4rem;display:inline-block}' +
        '.tn-i:first-child:before{display:none}' +
        '.tn-gl{font-family:var(--f-mono);font-size:.6rem;letter-spacing:.1em;text-transform:uppercase;color:var(--c-muted);margin-right:.15rem;opacity:.5}' +
        '.tn-g{display:inline-flex;align-items:center;flex-wrap:wrap;gap:0}' +
        '.tn-g + .tn-g{margin-left:1.5rem}' +
        '.tn-x{font-size:.72rem;font-family:var(--f-mono);margin-top:.35rem}' +
        '.tn-x a{color:var(--c-gold);text-decoration:none;opacity:.7;transition:opacity .15s}' +
        '.tn-x a:hover{opacity:1}' +
        '.tn-wr{max-width:1100px;margin:0 auto;padding:.6rem 1rem .5rem}' +
        '.tn-r1{display:flex;align-items:center;flex-wrap:wrap;gap:.25rem 0}' +
        '@media(max-width:768px){' +
        '.tn-ham{display:block;background:none;border:none;color:var(--c-text);font-size:1.4rem;cursor:pointer;padding:.25rem;line-height:1}' +
        '.tn-dr{display:none;position:fixed;top:0;left:0;right:0;bottom:0;background:var(--c-bg);z-index:1000;padding:1.5rem;overflow-y:auto;flex-direction:column}' +
        '.tn-dr--o{display:flex}' +
        '.tn-dh{display:flex;justify-content:space-between;align-items:center;margin-bottom:1.5rem}' +
        '.tn-dc{background:none;border:none;color:var(--c-text);font-size:1.8rem;cursor:pointer;padding:.25rem;line-height:1}' +
        '.tn-g{display:flex;flex-direction:column;align-items:flex-start;gap:.5rem;margin:0 0 1rem!important}' +
        '.tn-gl{font-size:.65rem;margin-bottom:.15rem}' +
        '.tn-i{font-size:1.1rem;padding:.4rem 0}' +
        '.tn-i + .tn-i:before{display:none}' +
        '.tn-x{margin-top:.5rem;padding-top:.75rem;border-top:1px solid var(--c-border)}' +
        '}' +
        '@media(min-width:769px){' +
        '.tn-ham{display:none!important}' +
        '.tn-dr{display:flex!important;flex-direction:column}' +
        '.tn-dh{display:none!important}' +
        '}' +
        '</style>' +
        '<nav class="tn-w" role="navigation" aria-label="Trinity">' +
        '<div class="tn-wr">' +
        '<button class="tn-ham" aria-label="Toggle navigation" aria-expanded="false">\u2630</button>' +
        '<div class="tn-dr">' +
        '<div class="tn-dh">' +
        '<span style="font-family:var(--f-mono);font-size:.75rem;color:var(--c-muted);letter-spacing:.1em;text-transform:uppercase">Trinity</span>' +
        '<button class="tn-dc" aria-label="Close navigation">\u2715</button>' +
        '</div>' +
        '<div class="tn-r1">' + rowsHtml + '</div>' +
        '<div class="tn-x"><a href="' + cross.href + '">' + cross.label + '</a></div>' +
        '</div>' +
        '</div>' +
        '</nav>';

      // Hamburger toggle
      var ham = shadow.querySelector('.tn-ham');
      var close = shadow.querySelector('.tn-dc');
      var dr = shadow.querySelector('.tn-dr');

      function toggle(open) {
        if (!dr) return;
        dr.classList.toggle('tn-dr--o', open);
        if (ham) ham.setAttribute('aria-expanded', String(open));
      }

      if (ham) ham.addEventListener('click', function () { toggle(true); });
      if (close) close.addEventListener('click', function () { toggle(false); });
      if (dr) dr.addEventListener('click', function (e) { if (e.target === dr) toggle(false); });
    };

    return TrinityNav;
  })();

  /* ═══════════════════════════════════════════════════════════════════
   * <trinity-footer> — FOOTER COMPONENT
   * ═══════════════════════════════════════════════════════════════════ */

  var TrinityFooter = (function () {

    function TrinityFooter() {
      HTMLElement.call(this);
      this.attachShadow({ mode: 'open' });
    }

    TrinityFooter.prototype = Object.create(HTMLElement.prototype);
    TrinityFooter.prototype.constructor = TrinityFooter;

    TrinityFooter.prototype.connectedCallback = function () {
      this.render();
    };

    TrinityFooter.prototype.badgeText = function () {
      var host = window.location.hostname;
      if (host.indexOf('arifos') !== -1)  return 'MIND \u00B7 arifOS';
      if (host.indexOf('aaa') !== -1)     return 'MIND \u00B7 AAA';
      if (host.indexOf('geox') !== -1)    return 'BODY \u00B7 GEOX';
      if (host.indexOf('wealth') !== -1)  return 'BODY \u00B7 WEALTH';
      if (host.indexOf('well') !== -1)    return 'BODY \u00B7 WELL';
      if (host === 'arif-fazil.com')      return 'SOUL \u00B7 SOVEREIGN';
      return 'MIND \u00B7 arifOS';
    };

    TrinityFooter.prototype.render = function () {
      var shadow = this.shadowRoot;
      var badge = this.badgeText();
      var today = new Date().toISOString().slice(0, 10);

      shadow.innerHTML =
        '<style>' +
        ':host{display:block;--c-gold:var(--gold,#D4A853);--c-text:var(--text,#d4d2ce);--c-muted:var(--text-muted,#71717A);--c-bg:var(--bg,#0A0A0B);--c-border:var(--border-subtle,#27272A);--f-sans:var(--font-sans,Inter,system-ui,sans-serif);--f-mono:var(--font-mono,"JetBrains Mono","SF Mono",monospace)}' +
        '.tf{background:var(--c-bg);border-top:1px solid var(--c-border);font-family:var(--f-sans);padding:1.5rem 1rem;text-align:center}' +
        '.tf-in{max-width:1100px;margin:0 auto}' +
        '.tf-st{display:flex;align-items:center;justify-content:center;flex-wrap:wrap;gap:.4rem 1rem;margin-bottom:.75rem;font-family:var(--f-mono);font-size:.65rem;color:var(--c-muted)}' +
        '.tf-bd{display:inline-flex;align-items:center;gap:.35rem;padding:.15rem .55rem;border:1px solid var(--c-border);border-radius:3px;font-size:.6rem;text-transform:uppercase;letter-spacing:.05em}' +
        '.tf-bd--gd{color:var(--c-gold);border-color:var(--c-gold)}' +
        '.tf-sep{color:var(--c-border);-webkit-user-select:none;user-select:none}' +
        '.tf-cp{font-size:.72rem;color:var(--c-muted);opacity:.7}' +
        '.tf-cp a{color:var(--c-gold);text-decoration:none}' +
        '.tf-mt{font-family:var(--f-mono);font-size:.6rem;color:var(--c-muted);opacity:.4;margin-top:.5rem;letter-spacing:.12em;text-transform:uppercase}' +
        '</style>' +
        '<footer class="tf" role="contentinfo">' +
        '<div class="tf-in">' +
        '<div class="tf-st">' +
        '<span class="tf-bd">' + badge + '</span>' +
        '<span class="tf-sep">|</span>' +
        '<span class="tf-bd tf-bd--gd">SEAL</span>' +
        '<span class="tf-sep">|</span>' +
        '<span class="tf-bd">WebMCP</span>' +
        '<span class="tf-sep">|</span>' +
        '<span>updated ' + today + '</span>' +
        '</div>' +
        '<div class="tf-cp">' +
        '\u00A9 2026 Muhammad Arif Fazil \u00B7 ' +
        'Sealed under <a href="https://arif-fazil.com/canon">999_SEAL</a> \u00B7 ' +
        'DITEMPA BUKAN DIBERI' +
        '</div>' +
        '<div class="tf-mt">Forged, Not Given</div>' +
        '</div>' +
        '</footer>';
    };

    return TrinityFooter;
  })();

  /* ═══════════════════════════════════════════════════════════════════
   * REGISTER CUSTOM ELEMENTS
   * ═══════════════════════════════════════════════════════════════════ */

  if (!customElements.get('trinity-nav')) {
    customElements.define('trinity-nav', TrinityNav);
  }
  if (!customElements.get('trinity-footer')) {
    customElements.define('trinity-footer', TrinityFooter);
  }

})();
