/**
 * arifOS Observatory — Client-Side Renderer
 * Fetches /.well-known/observatory-snapshot-latest.json (fast static mirror)
 * first; falls back to /api/observatory/v1/snapshot (live, slower).
 * The static mirror is rebuilt periodically by emit_observatory_snapshot.py;
 * the live endpoint rebuilds the snapshot on every request and can take 30-60s.
 * DITEMPA BUKAN DIBERI — Forged, Not Given.
 */
(function () {
  'use strict';

  const SNAPSHOT_MIRROR = '/.well-known/observatory-snapshot-latest.json';
  const SNAPSHOT_LIVE = '/api/observatory/v1/snapshot';
  const REFRESH_MS = 30000; // 30s auto-refresh

  // Mirror preferred (CDN-cached, <50ms); live API is fallback when mirror is stale/missing.
  let SNAPSHOT_URL = SNAPSHOT_MIRROR;

  /* ── helpers ──────────────────────────────────────────── */
  const $ = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => [...(p || document).querySelectorAll(s)];
  const val = (o) => (o && typeof o === 'object' && 'value' in o ? o.value : o);
  const stateClass = (s) => {
    if (!s) return 'unknown';
    const v = (typeof s === 'string' ? s : val(s) || '').toLowerCase();
    if (/true|up|healthy|pass|seal|alive|fresh|ready|full|aligned|kukuh|amanah|bijaksana|selamat|stable|optimal/.test(v)) return 'healthy';
    if (/warn|degraded|partial|amber|sabar|limited/.test(v)) return 'degraded';
    if (/false|down|fail|hold|void|error|critical|stale|unknown|retak/.test(v)) return 'down';
    return 'unknown';
  };
  const badge = (s, label) => `<span class="status status--${stateClass(s)}">${esc(label || s || '—')}</span>`;
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const ago = (ts) => {
    if (!ts) return '—';
    const sec = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (sec < 60) return sec + 's';
    if (sec < 3600) return Math.floor(sec / 60) + 'm';
    if (sec < 86400) return Math.floor(sec / 3600) + 'h';
    return Math.floor(sec / 86400) + 'd';
  };
  const shortHash = (h) => h ? (String(h).substring(0, 7)) : '—';

  /* ── now-strip ────────────────────────────────────────── */
  function renderNowStrip(d) {
    const set = (id, label, st) => {
      const el = $(`#now-${id} .val`);
      if (el) el.textContent = label;
      const pill = $(`#now-${id}`);
      if (pill) { pill.className = 'now-pill'; pill.classList.add(stateClass(st)); }
    };
    const ri = d.runtime_identity || {};
    const gov = d.governance || {};

    set('substrate', val(d.substrate?.cpu?.percent) != null ? `${d.substrate.cpu.value.percent}%` : '…', d.substrate?.memory?.value?.percent < 90 ? 'healthy' : 'degraded');
    set('governance', val(gov.verdict) || '…', val(gov.verdict));
    set('intelligence', val(d.metabolism?.length) ? `${d.metabolism.length} stages` : '…', d.metabolism?.length > 0 ? 'healthy' : 'unknown');
    set('evidence', val(d.evidence?.sources_used) ? `${d.evidence.sources_used.value.length} sources` : '…', d.evidence?.sources_used?.value?.length > 0 ? 'healthy' : 'unknown');
    set('authority', d.authority?.effective_action_authority?.authorized ? 'AUTHORIZED' : '…', d.authority?.effective_action_authority?.authorized ? 'healthy' : 'unknown');
  }

  /* ── meta strip ────────────────────────────────────────── */
  function renderMeta(d) {
    $('#meta-age').textContent = d.observed_at ? ago(d.observed_at) + ' ago' : '…';
    $('#meta-incidents').textContent = d.incidents?.length || 0;
    $('#meta-findings').textContent = d.findings?.length || (typeof d.findings === 'object' && d.findings !== null ? Object.keys(d.findings).length : 0);
    $('#meta-stage').textContent = d.stage_evidence?.stage || d.conformance?.stage || '…';
    const drift = d.runtime_identity?.drift?.value;
    const driftEl = $('#meta-drift');
    if (drift && typeof drift === 'object') {
      const drifted = Object.entries(drift).filter(([,v]) => /DRIFTED/i.test(v)).length;
      const total = Object.keys(drift).length;
      driftEl.textContent = `${drifted}/${total} drifted`;
      driftEl.className = 'badge ' + (drifted > 0 ? 'badge--warn' : 'badge--ok');
    } else {
      driftEl.textContent = '—';
      driftEl.className = 'badge';
    }
    // highest HOLD
    const holds = (d.findings || []).filter(f => /hold/i.test(f.severity || f.verdict || ''));
    const holdEl = $('#meta-hold');
    if (holds.length) {
      holdEl.textContent = holds.length + ' holds';
      holdEl.className = 'badge badge--hold';
    } else {
      holdEl.textContent = '—';
      holdEl.className = 'badge';
    }
    $('#meta-test').textContent = d.capabilities?.tested_count + '/' + d.capabilities?.declared_count + ' tested' || '…';

    // footer
    $('#footer-snap-id').textContent = d.snapshot_id || '…';
    $('#footer-obs-at').textContent = d.observed_at ? new Date(d.observed_at).toISOString() : '…';
    const sig = d.signature || {};
    $('#footer-signature').textContent = `algorithm=${sig.algorithm || 'null'} · key_id=${sig.key_id || 'null'} · payload_hash=${shortHash(sig.payload_hash) || 'null'} · signed_at=${sig.signed_at || 'null'}`;

    // tier (snapshot envelope: {value, state, source, ...}; page reads .current or .value)
    const tier = d.tier || {};
    const tierValue = tier.current ?? tier.value;
    const tierEl = $('#tier-pill');
    if (tierEl && tierValue) {
      tierEl.textContent = 'tier: ' + tierValue;
      tierEl.dataset.tierActive = tierValue !== 'public' ? 'true' : 'false';
    }
  }

  /* ── F2 Runtime identity ─────────────────────────────── */
  function renderIdentity(d) {
    const ri = d.runtime_identity || {};
    const set = (id, v, cl) => {
      const el = $(`#id-${id} .v`);
      if (el) { el.textContent = v || '…'; if (cl) el.className = 'v ' + cl; }
    };
    set('source', shortHash(val(ri.source_commit)));
    set('deployed', shortHash(val(ri.deployed_commit)));
    set('build', shortHash(val(ri.build_commit)));
    const drift = ri.drift?.value;
    if (drift && typeof drift === 'object') {
      const parts = Object.entries(drift).map(([k, v]) => `${k}=${v}`);
      set('drift', parts.join(' · '), parts.some(p => /DRIFTED/i.test(p)) ? 'warn' : 'ok');
    } else {
      set('drift', '—');
    }
    set('mode', val(ri.deployment_mode));
    set('started', val(ri.process_started_at) ? new Date(val(ri.process_started_at)).toLocaleString() : '…');
    set('platform', val(ri.platform) || '…');
    set('epoch', val(ri.kernel_epoch) || '…');
  }

  /* ── F2/F8 7-state vocabulary ──────────────────────────── */
  function renderVocabulary(d) {
    const states = {
      LIVENESS: d.substrate?.memory?.value?.percent != null ? `${(100 - d.substrate.memory.value.percent).toFixed(0)}% free` : '…',
      READINESS: d.conformance?.stage || d.stage_evidence?.stage || '…',
      CAPABILITY: d.capabilities?.declared_count ? `${d.capabilities.invocable_count}/${d.capabilities.declared_count}` : '…',
      GOVERNANCE: val(d.governance?.verdict) || '…',
      AUTHORIZATION: d.authority?.effective_action_authority?.authorized ? 'AUTHORIZED' : '…',
      RECEIPT: val(d.receipts?.last_receipt_tier) || '…',
      CONSTITUTIONAL: val(d.governance?.floors_loaded) ? `${d.governance.floors_passing?.value || '?'}/${d.governance.floors_loaded?.value || '?'}` : '…',
    };
    Object.entries(states).forEach(([k, v]) => {
      const cell = $(`#vocab-${k} .val`);
      if (cell) cell.textContent = v;
    });
  }

  /* ── F1-F13 Governance state ──────────────────────────── */
  function renderGovernance(d) {
    const gov = d.governance || {};
    const floors = gov.floors || {};
    const grid = $('#floor-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // F1-F13 canonical names
    const floorNames = {
      F1: 'AMANAH', F2: 'TRUTH', F3: 'WITNESS', F4: 'CLARITY',
      F5: 'PEACE²', F6: 'MARUAH', F7: 'HUMILITY', F8: 'GENIUS',
      F9: 'ANTI-HANTU', L10: 'ONTOLOGY', L11: 'AUDIT', L12: 'INJECTION', L13: 'SOVEREIGN'
    };
    const floorDisplay = { F1: 'F1', F2: 'F2', F3: 'F3', F4: 'F4', F5: 'F5', F6: 'F6', F7: 'F7', F8: 'F8', F9: 'F9', L10: 'L10', L11: 'L11', L12: 'L12', L13: 'L13' };

    Object.entries(floorNames).forEach(([key, name]) => {
      const data = floors[key] || {};
      const score = data.score?.value ?? data.value ?? null;
      const st = data.score?.state || data.state || 'unknown';
      const source = data.score?.source || data.source || '';
      const cell = document.createElement('div');
      cell.className = 'floor-cell';
      const sc = score != null ? (typeof score === 'number' ? score.toFixed(2) : score) : '—';
      cell.innerHTML = `
        <div class="floor-header"><span class="floor-num">${key}</span><span class="floor-name">${name}</span></div>
        <div class="floor-score ${stateClass(st)}">${sc}</div>
        <div class="floor-meta">${stateClass(st)} · ${esc(source).split('/').pop() || '—'}</div>
      `;
      grid.appendChild(cell);
    });

    // verdict decomposition
    const vd = gov.verdict_decomposition || {};
    const decomp = $('#verdict-decomp');
    if (decomp) {
      decomp.innerHTML = Object.entries(vd).map(([k, v]) => {
        const vv = typeof v === 'object' && v !== null ? v.value || v.state || JSON.stringify(v) : v;
        return `<div class="vocab-cell"><div class="name">${esc(k)}</div><div class="val ${stateClass(v)}">${esc(String(vv).substring(0, 30))}</div></div>`;
      }).join('');
    }
  }

  /* ── F2 Capability drift table ────────────────────────── */
  function renderDrift(d) {
    const caps = d.capabilities || {};
    const matrix = caps.matrix || [];
    const tbody = $('#drift-table tbody');
    if (!tbody) return;

    if (!matrix.length) {
      tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;color:var(--text-muted);padding:2rem">No capability data — probes pending</td></tr>`;
      return;
    }
    tbody.innerHTML = matrix.map(row => {
      if (typeof row !== 'object') return '';
      return `<tr>
        <td><code>${esc(row.name || row.tool || '—')}</code></td>
        <td>${badge(row.declared)}</td>
        <td>${badge(row.registered)}</td>
        <td>${badge(row.exposed)}</td>
        <td>${badge(row.invocable)}</td>
        <td>${badge(row.tested)}</td>
        <td>${badge(row.in_out_match)}</td>
        <td style="font-family:var(--font-mono);font-size:.7rem">${row.last_test ? ago(row.last_test) : '—'}</td>
        <td>${badge(row.truth)}</td>
      </tr>`;
    }).join('');
  }

  /* ── ΔΨΩ Federation organs ────────────────────────────── */
  function renderOrgans(d) {
    const organs = d.organs || {};
    const grid = $('#organs-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const organMeta = {
      arifos: { label: 'arifOS', ring: 'MIND', port: ':8088', role: 'Constitutional Kernel' },
      geox: { label: 'GEOX', ring: 'SOUL', port: ':8081', role: 'Earth Intelligence' },
      wealth: { label: 'WEALTH', ring: 'BODY', port: ':18082', role: 'Capital Intelligence' },
      well: { label: 'WELL', ring: 'SOUL', port: ':18083', role: 'Human Readiness' },
      aaa: { label: 'AAA', ring: 'BODY', port: ':3001', role: 'Control Plane' },
      aforge: { label: 'A-FORGE', ring: 'MIND', port: ':7071/:7072', role: 'Execution Shell' },
      mcp_gateway: { label: 'MCP Gateway', ring: 'MIND', port: '', role: 'Canonical Routing' },
    };

    Object.entries(organs).forEach(([key, data]) => {
      if (!data || typeof data !== 'object') return;
      const meta = organMeta[key] || { label: key, ring: '', port: '', role: '' };
      const transport = val(data.transport);
      const card = document.createElement('div');
      card.className = `organ-card organ-card--${stateClass(transport)}`;
      if (meta.ring) card.dataset.ring = meta.ring;
      const driftVal = typeof data.drift === 'object' ? data.drift.value : data.drift;
      card.innerHTML = `
        <div class="organ-head">
          <span class="organ-name">${esc(meta.label)}</span>
          <span class="ring-badge ring-${meta.ring ? meta.ring.toLowerCase() : 'mind'}">${meta.ring || '?'}</span>
        </div>
        <div class="organ-port" style="font-family:var(--font-mono)">${esc(meta.port)}</div>
        <div class="organ-role">${esc(meta.role)}</div>
        <div class="organ-meta">
          <span>transport: ${badge(transport)}</span>
          <span>drift: ${driftVal ? esc(String(driftVal).substring(0, 40)) : badge('none')}</span>
        </div>
      `;
      grid.appendChild(card);
    });
  }

  /* ── F13 Federation edges ─────────────────────────────── */
  function renderEdges(d) {
    const fed = d.federation_edges || {};
    const edges = fed.edges || [];
    const wrap = $('#edge-graph-wrap');
    const tbl = $('#edge-table-wrap');
    if (!wrap) return;

    // SVG simple radial graph
    const nodes = ['arifOS', 'A-FORGE', 'AAA', 'GEOX', 'WEALTH', 'WELL', 'MCP'];
    const cx = 300, cy = 200, r = 130;
    const angleStep = (2 * Math.PI) / nodes.length;

    let svg = `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg">`;
    svg += `<defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--gold, #c9a84c)"/></marker></defs>`;

    const positions = nodes.map((n, i) => ({
      label: n,
      x: cx + r * Math.cos(angleStep * i - Math.PI / 2),
      y: cy + r * Math.sin(angleStep * i - Math.PI / 2),
    }));

    // edges first (behind nodes)
    edges.forEach(edge => {
      if (!edge.source || !edge.target) return;
      const src = positions.find(p => p.label.toLowerCase() === edge.source.toLowerCase());
      const tgt = positions.find(p => p.label.toLowerCase() === edge.target.toLowerCase());
      if (!src || !tgt) return;
      const overall = stateClass(edge.overall || edge.transport);
      svg += `<line x1="${src.x}" y1="${src.y}" x2="${tgt.x}" y2="${tgt.y}" stroke="${overall === 'healthy' ? 'var(--green, #22c55e)' : overall === 'degraded' ? 'var(--amber, #f59e0b)' : 'var(--red, #ef4444)'}" stroke-width="${overall === 'healthy' ? '2' : '3'}" marker-end="url(#arrow)" opacity="0.6"/>`;
    });

    // nodes
    positions.forEach(p => {
      svg += `<circle cx="${p.x}" cy="${p.y}" r="28" fill="var(--surface, #0d0d1a)" stroke="var(--gold, #c9a84c)" stroke-width="2"/>`;
      svg += `<text x="${p.x}" y="${p.y + 4}" text-anchor="middle" fill="var(--text, #e2d8c8)" font-family="var(--font-mono, monospace)" font-size="9">${p.label}</text>`;
    });
    svg += `</svg>`;
    wrap.innerHTML = svg;

    // edge table
    if (!tbl) return;
    if (!edges.length) {
      tbl.innerHTML = `<p style="color:var(--text-muted);padding:.5rem;font-size:.8rem">No edge probes recorded yet — federation edge scanning pending</p>`;
      return;
    }
    let html = `<table class="drift" style="font-size:.75rem"><thead><tr><th>source</th><th>target</th><th>transport</th><th>identity</th><th>schema</th><th>session</th><th>actor</th><th>trace</th><th>receipt</th><th>overall</th></tr></thead><tbody>`;
    edges.forEach(e => {
      html += `<tr>
        <td>${esc(e.source)}</td><td>${esc(e.target)}</td>
        <td>${badge(e.transport)}</td><td>${badge(e.identity_match)}</td>
        <td>${badge(e.schema_match)}</td><td>${badge(e.session_propagated)}</td>
        <td>${badge(e.actor_propagated)}</td><td>${badge(e.trace_propagated)}</td>
        <td>${badge(e.receipt_produced)}</td>
        <td>${badge(e.overall)}</td>
      </tr>`;
    });
    html += `</tbody></table>`;
    tbl.innerHTML = html;
  }

  /* ── 000-010 Intelligence metabolism ───────────────────── */
  function renderMetabolism(d) {
    const metab = d.metabolism || [];
    const grid = $('#metab-grid');
    if (!grid) return;

    if (!metab.length || (metab.length === 1 && JSON.stringify(metab[0]) === '{}')) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted)">Metabolism data pending — organ probes not yet reporting</div>`;
      return;
    }
    grid.innerHTML = metab.map(m => {
      if (typeof m !== 'object' || !m.name) return '';
      const st = stateClass(m.state || m.value);
      return `<div class="metab-cell metab-cell--${st}">
        <div class="metab-name">${esc(m.name)}</div>
        <div class="metab-val ${st}">${esc(m.value != null ? m.value : m.state || '—')}</div>
        <div class="metab-meta">${st} · conf: ${m.confidence || '?'}</div>
      </div>`;
    }).join('');
  }

  /* ── 999 VAULT999 witness ──────────────────────────────── */
  function renderVault(d) {
    const ev = d.evidence || {};
    const r = d.receipts || {};
    const grid = $('#vault-states');
    if (!grid) return;
    grid.innerHTML = `
      <div class="vocab-cell"><div class="name">SOURCES</div><div class="val">${ev.sources_used?.value?.length || 0}</div></div>
      <div class="vocab-cell"><div class="name">DIVERSITY</div><div class="val ${stateClass(ev.source_diversity)}">${esc(val(ev.source_diversity) || '—')}</div></div>
      <div class="vocab-cell"><div class="name">CONTRADICTIONS</div><div class="val">${ev.contradictions?.value?.length || 0}</div></div>
      <div class="vocab-cell"><div class="name">DIRECT</div><div class="val">${ev.direct_vs_inferred?.direct?.value || 0}</div></div>
      <div class="vocab-cell"><div class="name">INFERRED</div><div class="val">${ev.direct_vs_inferred?.inferred?.value || 0}</div></div>
      <div class="vocab-cell"><div class="name">LAST RECEIPT</div><div class="val">${r.last_receipt_tier || '—'}</div></div>
      <div class="vocab-cell"><div class="name">SEAL CHAIN</div><div class="val">seq ${r.seal_chain_seq || '—'}</div></div>
      <div class="vocab-cell"><div class="name">VAULT</div><div class="val ${stateClass(d.substrate?.vault999)}">${esc(val(d.substrate?.vault999) || '—')}</div></div>
    `;

    // vault test button
    const btn = $('#vault-test-btn');
    if (btn) {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        btn.textContent = 'testing…';
        btn.style.opacity = '0.5';
        try {
          const resp = await fetch('/api/observatory/v1/snapshot');
          if (resp.ok) {
            btn.textContent = '✅ snapshot reachable (round-trip OK)';
          } else {
            btn.textContent = '❌ HTTP ' + resp.status;
          }
        } catch (err) {
          btn.textContent = '❌ ' + err.message;
        }
        btn.style.opacity = '1';
        setTimeout(() => { btn.textContent = 'run round-trip test'; }, 5000);
      });
    }
  }

  /* ── F13 Daily Reality Pulse ───────────────────────────── */
  function renderPulse(d) {
    const grid = $('#pulse-grid');
    if (!grid) return;

    const organs = d.organs || {};
    const pulseData = [
      { name: 'arifOS', key: 'arifos', signal: 'constitutional' },
      { name: 'A-FORGE', key: 'aforge', signal: 'execution' },
      { name: 'AAA', key: 'aaa', signal: 'routing' },
      { name: 'GEOX', key: 'geox', signal: 'earth' },
      { name: 'WEALTH', key: 'wealth', signal: 'capital' },
      { name: 'WELL', key: 'well', signal: 'human' },
      { name: 'MACHINE', key: null, signal: 'substrate(ALIGNED) | intelligence(RETAK)' },
    ];

    grid.innerHTML = pulseData.map(p => {
      const od = p.key ? organs[p.key] : null;
      const transport = od ? val(od.transport) : d.substrate?.memory?.value?.percent != null ? 'degraded' : 'unknown';
      const st = stateClass(transport);
      return `<div class="pulse-cell pulse-cell--${st}">
        <div class="pulse-name">${esc(p.name)}</div>
        <div class="pulse-signal">${esc(p.signal)}</div>
        <div class="pulse-status ${st}">${st.toUpperCase()}</div>
      </div>`;
    }).join('');
  }

  /* ── main fetch + render ──────────────────────────────── */
  async function loadSnapshot() {
    // Try the fast static mirror first; if it 404s or fails, fall back to the live API.
    let resp;
    try {
      resp = await fetch(SNAPSHOT_URL, { cache: 'no-store' });
      if (!resp.ok) throw new Error(`mirror HTTP ${resp.status}`);
    } catch (mirrorErr) {
      console.warn('Observatory mirror unavailable, falling back to live:', mirrorErr.message);
      resp = await fetch(SNAPSHOT_LIVE, { cache: 'no-store' });
      if (!resp.ok) throw new Error(`live HTTP ${resp.status}`);
    }
    try {
      const d = await resp.json();

      // mark loading done
      document.body.dataset.state = 'loaded';
      document.body.dataset.observedAt = d.observed_at || '';
      document.body.dataset.ageSeconds = d.observed_at ? Math.floor((Date.now() - new Date(d.observed_at).getTime()) / 1000) : '0';
      document.body.dataset.evidenceClass = d.signature?.algorithm ? 'signed' : 'reported';
      document.body.dataset.confidence = d.signature?.algorithm ? '0.99' : '0.85';
      document.body.dataset.freshnessState = d.observed_at && (Date.now() - new Date(d.observed_at).getTime()) < 120000 ? 'fresh' : 'stale';

      renderNowStrip(d);
      renderMeta(d);
      renderIdentity(d);
      renderVocabulary(d);
      renderGovernance(d);
      renderDrift(d);
      renderOrgans(d);
      renderEdges(d);
      renderMetabolism(d);
      renderVault(d);
      renderPulse(d);

      // schedule refresh
      setTimeout(loadSnapshot, REFRESH_MS);
    } catch (err) {
      console.error('Observatory snapshot error:', err);
      document.body.dataset.state = 'error';
      $('#meta-age').textContent = 'error: ' + err.message;

      // retry in 10s
      setTimeout(loadSnapshot, 10000);
    }
  }

  /* ── bootstrap ──────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSnapshot);
  } else {
    loadSnapshot();
  }
})();
