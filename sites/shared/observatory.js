/**
 * arifOS Observatory — Client-Side Renderer (v2.1, ZEN-SURVIVAL-SIGNED)
 * Source of truth: /root/ARIF-SITES/sites/shared/observatory.js
 * Live mirror:    /var/www/html/_shared/observatory.js
 *
 * Fetches GET /.well-known/observatory-snapshot-latest.json (ed25519-signed, canonical SOT)
 * and binds every visible status. Auto-refreshes every 30 s. Never silent-loading.
 *
 * The legacy in-server endpoint GET /api/observatory/v1/snapshot is deadlock-prone
 * (event-loop lock on mcp.list_tools). Page binds to the SIGNED STATIC snapshot
 * instead; the authority gate still probes the live endpoint to honestly report
 * which surfaces are reachable.
 *
 * Doctrine:
 *   - 7-state non-collapse (no derived→observed falsification)
 *   - Visual honesty palette (green=independent observed, amber=derived,
 *     red=open HIGH/fail, grey=absent/unknown)
 *   - Each cell carries value · state · age · confidence · evidence-class
 *   - UNSIGNED banner is non-nullable while signature.value is null
 *   - Authority gate self-populates from real fetch probes — never hard-codes
 *
 * DITEMPA BUKAN DIBERI — Forged, Not Given.
 */
(function () {
  'use strict';

  /* ── constants ─────────────────────────────────────────── */
  // Canonical SOT — signed static Observatory snapshot. Externally verifiable
  // via ed25519 public key at /.well-known/observatory_signing_key.pub.pem.
  const SNAPSHOT_URL = '/.well-known/observatory-snapshot-latest.json';
  const HEALTH_URL   = '/health';
  const KERNEL_HEALTH_URL = '/health';
  const REFRESH_MS   = 30000;            // 30s auto-refresh
  const PROBE_TIMEOUT_MS = 4000;          // per-probe timeout for authority gate

  /* ── helpers ───────────────────────────────────────────── */
  const $  = (s, p) => (p || document).querySelector(s);
  const $$ = (s, p) => [...(p || document).querySelectorAll(s)];
  const val = (o) => (o && typeof o === 'object' && 'value' in o ? o.value : o);
  const st  = (o) => (o && typeof o === 'object' && 'state' in o ? o.state : null);
  const conf = (o) => (o && typeof o === 'object' && 'confidence' in o ? o.confidence : null);

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function ago(ts) {
    if (!ts) return '—';
    const sec = Math.floor((Date.now() - new Date(ts).getTime()) / 1000);
    if (sec < 0) return 'just now';
    if (sec < 60) return sec + 's ago';
    if (sec < 3600) return Math.floor(sec / 60) + 'm ago';
    if (sec < 86400) return Math.floor(sec / 3600) + 'h ago';
    return Math.floor(sec / 86400) + 'd ago';
  }
  function shortHash(h) { return h ? String(h).substring(0, 7) : '—'; }

  /**
   * Map a snapshot value to one of our 4 visual classes.
   * green/amber/red/grey — derived purely from value text + state token.
   */
  function stateClass(v) {
    if (v == null) return 'grey';
    const s = String(typeof v === 'object' ? val(v) : v).toLowerCase();
    const state = String((v && typeof v === 'object' ? st(v) : '') || '').toLowerCase();
    if (/^(true|up|healthy|pass|seal|alive|fresh|ready|full|aligned|amanah|bijaksana|selamat|stable|optimal|present|observed)$/.test(state))
      return 'green';
    if (/^(healthy|up|pass|seal|aligned|present)$/.test(s)) return 'green';
    if (/^(degraded|warn|partial|amber|sabar|limited|drifted)$/.test(state)) return 'amber';
    if (/^(retak|hold|void|fail|error|critical|stale|unknown|down|false|null)$/.test(state)) return 'red';
    if (/drift/.test(s)) return 'amber';
    if (/unknown|null/.test(s)) return 'grey';
    return 'grey';
  }
  function badge(v, label) {
    const cls = stateClass(v);
    return `<span class="badge badge--${cls}" data-state="${cls}">${esc(label || (typeof v === 'object' ? val(v) : v) || '—')}</span>`;
  }

  /* ── body-state setter ─────────────────────────────────── */
  function setBodyState(snapshot, error) {
    const body = document.body;
    if (error) {
      body.dataset.state = 'error';
      body.dataset.evidenceClass = 'self_reported';
      body.dataset.confidence = '0.0';
      return;
    }
    const sig = snapshot.signature || {};
    const signed = sig.value != null && sig.value !== '';
    body.dataset.state = signed ? 'signed' : 'unsigned';
    body.dataset.observedAt = snapshot.observed_at || '';
    body.dataset.evidenceClass = signed ? 'signed' : 'reported';
    body.dataset.confidence = signed ? '0.99' : '0.85';
    body.dataset.ageSeconds = snapshot.observed_at
      ? String(Math.floor((Date.now() - new Date(snapshot.observed_at).getTime()) / 1000))
      : '0';
    body.dataset.freshnessState = body.dataset.ageSeconds === '0' || Number(body.dataset.ageSeconds) < 120
      ? 'fresh' : 'stale';

    // UNSIGNED banner is non-nullable while signature.value is null
    const banner = $('#unsigned-banner');
    if (banner) banner.style.display = signed ? 'none' : '';
  }

  /* ── NOW strip ─────────────────────────────────────────── */
  function renderNowStrip(d) {
    const set = (id, text, v) => {
      const valEl  = $(`#now-${id} .val`);
      const pillEl = $(`#now-${id}`);
      if (valEl) valEl.textContent = text;
      if (pillEl) {
        pillEl.className = 'now-pill now-pill--' + stateClass(v);
        pillEl.dataset.state = stateClass(v);
      }
    };
    const sub  = d.substrate || {};
    const mem  = sub.memory && sub.memory.value;
    const cpu  = sub.cpu && sub.cpu.value;
    const gov  = d.governance || {};
    const verdictText = (gov.verdict && (val(gov.verdict) || gov.verdict.value)) || '—';
    const meta = d.intelligence_decomposition || {};
    const intelState = (meta.intelligence_pipeline && val(meta.intelligence_pipeline)) || '—';
    const ev = d.evidence || {};
    const srcUsed = ev.sources_used && ev.sources_used.value;
    const tier = d.tier && val(d.tier);
    set('substrate',
      mem && typeof mem === 'object' && mem.percent != null
        ? `cpu ${cpu && cpu.percent != null ? cpu.percent.toFixed(0) : '?'}% · mem ${mem.percent.toFixed(0)}%`
        : '…',
      mem);
    set('governance',
      verdictText + ' · ' + (gov.floors_passing && (val(gov.floors_passing) || '?')) + '/' + (gov.floors_loaded && (val(gov.floors_loaded) || '?')),
      gov.verdict || gov.floors_passing);
    set('intelligence', intelState, meta.intelligence_pipeline);
    set('evidence',
      Array.isArray(srcUsed) ? `${srcUsed.length} src · ${(ev.source_diversity && val(ev.source_diversity)) || '—'}` : '—',
      ev.sources_used);
    set('authority', (tier || 'public').toUpperCase(), tier || 'public');
  }

  /* ── meta strip ────────────────────────────────────────── */
  function renderMeta(d) {
    const findings = d.findings || {};
    const findingsCount = (findings.count != null) ? findings.count
      : (Array.isArray(findings.findings) ? findings.findings.length : 0);
    $('#meta-age').textContent       = d.observed_at ? ago(d.observed_at) : '—';
    $('#meta-incidents').textContent = (d.incidents && d.incidents.length) || 0;
    $('#meta-findings').textContent  = findingsCount;

    // stage (from conformance.live_transport first, else stage_evidence)
    const stageVal = (d.conformance && d.conformance.live_transport && val(d.conformance.live_transport))
                  || (d.stage_evidence && val(d.stage_evidence))
                  || '—';
    const stageEl = $('#meta-stage');
    if (stageEl) { stageEl.textContent = stageVal; stageEl.dataset.evidenceClass = 'derived'; }

    // drift badge
    const drift = d.runtime_identity && d.runtime_identity.drift && d.runtime_identity.drift.value;
    const driftEl = $('#meta-drift');
    if (driftEl) {
      if (drift && typeof drift === 'object') {
        const drifted = Object.values(drift).filter(v => /DRIFTED|UNVERIFIED/i.test(v)).length;
        const total = Object.keys(drift).length;
        driftEl.textContent = `${drifted}/${total} drifted`;
        driftEl.className = 'badge badge--' + (drifted > 0 ? 'amber' : 'green');
      } else {
        driftEl.textContent = '—';
        driftEl.className = 'badge badge--grey';
      }
    }

    // highest severity from findings
    const holdEl = $('#meta-hold');
    if (holdEl) {
      const bySev = findings.by_severity || {};
      const sevOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
      const highest = sevOrder.find(s => (bySev[s] || 0) > 0) || null;
      if (highest) {
        holdEl.textContent = `${highest} × ${bySev[highest]}`;
        holdEl.className = 'badge badge--' + (highest === 'HIGH' || highest === 'CRITICAL' ? 'red' : highest === 'MEDIUM' ? 'amber' : 'grey');
      } else {
        holdEl.textContent = '—';
        holdEl.className = 'badge badge--green';
      }
    }

    // last tool test
    const testEl = $('#meta-test');
    if (testEl) {
      const cap = d.capabilities || {};
      const declared = cap.declared_count != null ? cap.declared_count : '?';
      const tested   = cap.tested_count   != null ? cap.tested_count   : '?';
      testEl.textContent = `${tested}/${declared} tested`;
    }

    // footer signature
    const sig = d.signature || {};
    const sigEl = $('#footer-signature');
    if (sigEl) {
      sigEl.textContent =
        `algorithm=${sig.algorithm || 'null'} · key_id=${sig.key_id || 'null'} · ` +
        `payload_hash=${shortHash(sig.payload_hash) || 'null'} · ` +
        `signed_at=${sig.signed_at || 'null'} · ` +
        `state=${st(sig) || 'unknown'}`;
    }
    const snapIdEl = $('#footer-snap-id');
    if (snapIdEl) snapIdEl.textContent = d.snapshot_id || '—';
    const obsAtEl = $('#footer-obs-at');
    if (obsAtEl) obsAtEl.textContent = d.observed_at ? new Date(d.observed_at).toISOString() : '—';
    const genByEl = $('#footer-generated-by');
    if (genByEl) genByEl.textContent = 'generated by ' + (d.generated_by || 'arifOS');

    // tier pill
    const tierEl = $('#tier-pill');
    if (tierEl) {
      const tier = d.tier && val(d.tier);
      tierEl.textContent = 'tier: ' + (tier || 'public');
      tierEl.dataset.tierActive = (tier && tier !== 'public') ? 'true' : 'false';
    }
  }

  /* ── F2 Runtime identity ──────────────────────────────── */
  function renderIdentity(d) {
    const ri = d.runtime_identity || {};
    const set = (id, v, cls) => {
      const el = $(`#id-${id}`);
      if (!el) return;
      el.textContent = v || '—';
      if (cls) { el.classList.remove('green','amber','red','grey'); el.classList.add(cls); }
    };
    set('source',   shortHash(val(ri.source_commit)));
    set('deployed', shortHash(val(ri.deployed_commit)));
    set('build',    shortHash(val(ri.build_commit)));
    const drift = ri.drift && ri.drift.value;
    if (drift && typeof drift === 'object') {
      const parts = Object.entries(drift).map(([k, v]) => `${k}=${v}`);
      const hasBad = parts.some(p => /DRIFTED|UNVERIFIED|UNKNOWN/i.test(p));
      set('drift', parts.join(' · '), hasBad ? 'amber' : 'green');
    } else {
      set('drift', '—', 'grey');
    }
    set('mode',     val(ri.deployment_mode));
    set('started',  val(ri.process_started_at) ? new Date(val(ri.process_started_at)).toLocaleString() : '—');
    set('platform', val(ri.platform));
    set('epoch',    val(ri.kernel_epoch) || 'unknown');
  }

  /* ── F2/F8 7-state vocabulary ─────────────────────────── */
  function renderVocabulary(d) {
    const sub = d.substrate || {};
    const gov = d.governance || {};
    const cap = d.capabilities || {};
    const rcv = d.receipts || {};
    const con = d.conformance || {};
    const find = d.findings || {};
    const states = {
      LIVENESS:      sub.cpu && sub.cpu.value ? `cpu ${sub.cpu.value.percent != null ? sub.cpu.value.percent.toFixed(0) : '?'}%` : '—',
      READINESS:     val(con.live_transport) || val(con.fast) || '—',
      CAPABILITY:    `${cap.invocable_count != null ? cap.invocable_count : '?'}/${cap.declared_count != null ? cap.declared_count : '?'}`,
      GOVERNANCE:    (val(gov.verdict) || '—') + ' · ' + (val(gov.floors_passing) || '?') + '/' + (val(gov.floors_loaded) || '?') + ' floors',
      AUTHORIZATION: (d.tier && val(d.tier)) ? val(d.tier).toUpperCase() : 'PUBLIC',
      RECEIPT:       (rcv.head_seq && val(rcv.head_seq) != null) ? `seq ${val(rcv.head_seq)}` : '—',
      CONSTITUTIONAL: (find.count != null ? `${find.count} findings` : '—') + ' · ' + (val(gov.floors_passing) || '?') + '/' + (val(gov.floors_loaded) || '?') + ' pass',
    };
    const colors = {
      LIVENESS:      sub.cpu,
      READINESS:     con.live_transport || con.fast,
      CAPABILITY:    cap,
      GOVERNANCE:    gov.verdict || gov.floors_passing,
      AUTHORIZATION: d.tier,
      RECEIPT:       rcv.head_seq,
      CONSTITUTIONAL: gov.verdict,
    };
    Object.entries(states).forEach(([k, text]) => {
      const cell = $(`#vocab-${k} .val`);
      if (!cell) return;
      cell.textContent = text;
      cell.className = 'val val--' + stateClass(colors[k]);
    });
  }

  /* ── F1-F13 Governance state ──────────────────────────── */
  function renderGovernance(d) {
    const gov = d.governance || {};
    const floors = gov.floors || {};
    const grid = $('#floor-grid');
    if (!grid) return;
    const names = {
      F1: 'AMANAH', F2: 'TRUTH', F3: 'WITNESS', F4: 'CLARITY',
      F5: 'PEACE²', F6: 'MARUAH', F7: 'HUMILITY', F8: 'GENIUS',
      F9: 'ANTI-HANTU', L10: 'ONTOLOGY', L11: 'AUDIT', L12: 'INJECTION', L13: 'SOVEREIGN'
    };
    grid.innerHTML = Object.entries(names).map(([key, name]) => {
      const data = floors[key] || {};
      const score = data.score && data.score.value;
      const status = data.status && val(data.status);
      const cellCls = stateClass(status || score);
      const scoreText = score != null ? (typeof score === 'number' ? score.toFixed(2) : score) : '—';
      const statusText = status || (data.score && st(data.score)) || '—';
      const src = (data.score && data.score.source) || '—';
      return `
        <div class="floor-cell floor-cell--${cellCls}" data-floor="${key}">
          <div class="floor-header">
            <span class="floor-num">${key}</span>
            <span class="floor-name">${name}</span>
          </div>
          <div class="floor-score">${scoreText}</div>
          <div class="floor-status">${esc(statusText)}</div>
          <div class="floor-meta" title="${esc(src)}">${esc(src.split('/').pop() || '—')}</div>
        </div>`;
    }).join('');

    // verdict decomposition
    const vd = gov.verdict_decomposition || {};
    const decomp = $('#verdict-decomp');
    if (decomp) {
      const decompKeys = Object.keys(vd);
      if (!decompKeys.length) {
        decomp.innerHTML = `<div class="vocab-cell"><div class="name">verdict_decomposition</div><div class="val val--grey">absent</div></div>`;
      } else {
        decomp.innerHTML = decompKeys.map(k => {
          const v = vd[k];
          const text = (typeof v === 'object' && v !== null) ? (val(v) || st(v) || '—') : v;
          return `<div class="vocab-cell"><div class="name">${esc(k)}</div><div class="val val--${stateClass(v)}">${esc(String(text).substring(0, 40))}</div></div>`;
        }).join('');
      }
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
      if (!row || typeof row !== 'object') return '';
      const lastTest = row.last_test_at || row.last_test;
      const ageStr = lastTest ? ago(lastTest) : '—';
      return `<tr>
        <td><code>${esc(row.name || '—')}</code></td>
        <td>${badge(row.declared ? 'yes' : 'no', row.declared ? 'declared' : '—')}</td>
        <td>${badge(row.registered ? 'yes' : 'no', row.registered ? 'registered' : '—')}</td>
        <td>${badge(row.exposed ? 'yes' : 'no', row.exposed ? 'exposed' : '—')}</td>
        <td>${badge(row.invocable ? 'yes' : 'no', row.invocable ? 'invocable' : '—')}</td>
        <td>${badge(row.tested ? 'yes' : 'no', row.tested ? 'tested' : '—')}</td>
        <td>${badge(row.input_schema_hash_match)}</td>
        <td style="font-family:var(--font-mono);font-size:.7rem">${ageStr}</td>
        <td>${badge(row.capability_truth || row.truth || 'unknown')}</td>
      </tr>`;
    }).join('');
  }

  /* ── ΔΨΩ Federation organs ────────────────────────────── */
  function renderOrgans(d) {
    const organs = d.organs || {};
    const grid = $('#organs-grid');
    if (!grid) return;
    const meta = {
      arifos:     { label: 'arifOS',     ring: 'MIND', port: ':8088',          role: 'Constitutional Kernel' },
      geox:       { label: 'GEOX',       ring: 'SOUL', port: ':8081',          role: 'Earth Intelligence' },
      wealth:     { label: 'WEALTH',     ring: 'BODY', port: ':18082',         role: 'Capital Intelligence' },
      well:       { label: 'WELL',       ring: 'SOUL', port: ':18083',         role: 'Human Readiness' },
      aaa:        { label: 'AAA',        ring: 'BODY', port: ':3001',          role: 'Control Plane' },
      aforge:     { label: 'A-FORGE',    ring: 'MIND', port: ':7071 / :7072',  role: 'Execution Shell' },
      mcp_gateway:{ label: 'MCP Gateway',ring: 'MIND', port: 'mcp.arif-fazil.com', role: 'Canonical Routing' },
    };
    grid.innerHTML = Object.entries(organs).map(([key, data]) => {
      if (!data || typeof data !== 'object') return '';
      const m = meta[key] || { label: key, ring: '', port: '', role: '' };
      const t = data.transport && val(data.transport);
      const id = data.identity && val(data.identity);
      const cap = data.capability && val(data.capability);
      const ev  = data.evidence && val(data.evidence);
      const cls = stateClass(t);
      return `
        <div class="organ-card organ-card--${cls}" data-ring="${m.ring}" data-organ="${key}">
          <div class="organ-head">
            <span class="organ-name">${esc(m.label)}</span>
            <span class="ring-badge ring-${(m.ring || 'mind').toLowerCase()}">${m.ring || '?'}</span>
          </div>
          <div class="organ-port">${esc(m.port)}</div>
          <div class="organ-role">${esc(m.role)}</div>
          <div class="organ-meta">
            <span>transport: ${badge(t)}</span>
            <span>identity: ${badge(id, id || 'null')}</span>
            <span>capability: ${badge(cap)}</span>
            <span>evidence: ${badge(ev)}</span>
          </div>
        </div>`;
    }).join('');
  }

  /* ── F13 Federation edges ─────────────────────────────── */
  function renderEdges(d) {
    const fed = d.federation_edges || {};
    const edges = fed.edges || [];
    const aggregate = fed.aggregate_state || 'UNKNOWN';
    const wrap = $('#edge-graph-wrap');
    const tbl = $('#edge-table-wrap');
    if (!wrap || !tbl) return;

    // radial SVG (organ nodes + arrowed edges)
    const nodes = ['arifOS', 'A-FORGE', 'AAA', 'GEOX', 'WEALTH', 'WELL', 'MCP'];
    const cx = 300, cy = 200, r = 130;
    const step = (2 * Math.PI) / nodes.length;
    const pos = nodes.map((n, i) => ({
      label: n,
      x: cx + r * Math.cos(step * i - Math.PI / 2),
      y: cy + r * Math.sin(step * i - Math.PI / 2),
    }));
    let svg = `<svg viewBox="0 0 600 400" style="width:100%;max-width:600px;display:block;margin:0 auto" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="federation edges">`;
    svg += `<defs><marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--gold,#c9a84c)"/></marker></defs>`;
    edges.forEach(edge => {
      if (!edge || !edge.source || !edge.target) return;
      const s = pos.find(p => p.label.toLowerCase() === String(edge.source).toLowerCase());
      const t = pos.find(p => p.label.toLowerCase() === String(edge.target).toLowerCase());
      if (!s || !t) return;
      const cls = stateClass(edge.overall || edge.transport);
      const stroke = cls === 'green' ? 'var(--green,#3ddc97)' : cls === 'amber' ? 'var(--amber,#f4b740)' : 'var(--red,#e5484d)';
      svg += `<line x1="${s.x}" y1="${s.y}" x2="${t.x}" y2="${t.y}" stroke="${stroke}" stroke-width="2" marker-end="url(#arrow)" opacity="0.7"/>`;
    });
    pos.forEach(p => {
      svg += `<circle cx="${p.x}" cy="${p.y}" r="28" fill="var(--surface,#0d0d1a)" stroke="var(--gold,#c9a84c)" stroke-width="2"/>`;
      svg += `<text x="${p.x}" y="${p.y + 4}" text-anchor="middle" fill="var(--text,#f5f5f7)" font-family="var(--font-mono,monospace)" font-size="9">${p.label}</text>`;
    });
    svg += `</svg>`;
    wrap.innerHTML = svg + `<p style="text-align:center;font-family:var(--font-mono);font-size:.75rem;color:var(--text-muted);margin:.5rem">declared <b>${fed.declared || 0}</b> · probed <b>${fed.probed || 0}</b> · reachable <b>${fed.reachable || 0}</b> · aggregate <b>${esc(aggregate)}</b></p>`;

    if (!edges.length) {
      tbl.innerHTML = `<p style="color:var(--text-muted);padding:.75rem;font-size:.8rem">No edge probes recorded — declared ${fed.declared || 0} edges, all aggregate <b>UNKNOWN</b> until probed. F-005 OPEN.</p>`;
      return;
    }
    tbl.innerHTML = `<table class="drift" style="font-size:.75rem">
      <thead><tr><th>source</th><th>target</th><th>transport</th><th>identity</th><th>schema</th><th>session</th><th>actor</th><th>trace</th><th>receipt</th><th>overall</th></tr></thead>
      <tbody>${edges.map(e => `<tr>
        <td>${esc(e.source || '—')}</td><td>${esc(e.target || '—')}</td>
        <td>${badge(e.transport)}</td><td>${badge(e.identity_match)}</td>
        <td>${badge(e.schema_match)}</td><td>${badge(e.session_propagated)}</td>
        <td>${badge(e.actor_propagated)}</td><td>${badge(e.trace_propagated)}</td>
        <td>${badge(e.receipt_produced)}</td>
        <td>${badge(e.overall || 'unknown')}</td>
      </tr>`).join('')}</tbody></table>`;
  }

  /* ── 000-010 Intelligence metabolism ──────────────────── */
  function renderMetabolism(d) {
    const metab = d.metabolism || [];
    const grid = $('#metab-grid');
    if (!grid) return;
    if (!metab.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted)">Metabolism data pending — event_bus stage counters not yet wired (F-003).</div>`;
      return;
    }
    grid.innerHTML = metab.map(m => {
      if (!m || typeof m !== 'object') return '';
      const stageName = (m.stage && val(m.stage)) || m.name || 'unknown';
      const inv = m.invocations;
      const invVal = inv && val(inv);
      const sr = m.success_rate;
      const srVal = sr && val(sr);
      const responsible = m.responsible_organ && val(m.responsible_organ);
      const humanGate = m.human_gate && val(m.human_gate);
      const state = inv && st(inv);
      const cls = stateClass(state || (invVal != null ? 'observed' : 'unknown'));
      return `
        <div class="metab-cell metab-cell--${cls}" data-stage="${esc(stageName)}">
          <div class="metab-name">${esc(stageName)}</div>
          <div class="metab-val">${invVal != null ? invVal : '—'}</div>
          <div class="metab-meta">
            success: ${srVal != null ? (typeof srVal === 'number' ? (srVal * 100).toFixed(0) + '%' : srVal) : '—'}
            · lane: ${esc(responsible || '—')}
            ${humanGate ? '· 🔒 HUMAN-GATE' : ''}
          </div>
        </div>`;
    }).join('');
  }

  /* ── 999 VAULT999 witness ─────────────────────────────── */
  function renderVault(d) {
    const ev = d.evidence || {};
    const r  = d.receipts || {};
    const sub = d.substrate || {};
    const grid = $('#vault-states');
    if (!grid) return;
    const used = (ev.sources_used && ev.sources_used.value) || [];
    grid.innerHTML = `
      <div class="vocab-cell"><div class="name">SOURCES</div><div class="val val--${used.length ? 'green' : 'grey'}">${used.length}</div></div>
      <div class="vocab-cell"><div class="name">DIVERSITY</div><div class="val val--${stateClass(ev.source_diversity)}">${esc(val(ev.source_diversity) || '—')}</div></div>
      <div class="vocab-cell"><div class="name">CONTRADICTIONS</div><div class="val val--${(ev.contradictions && ev.contradictions.value && ev.contradictions.value.length) ? 'amber' : 'green'}">${(ev.contradictions && ev.contradictions.value || []).length}</div></div>
      <div class="vocab-cell"><div class="name">HEAD_SEQ</div><div class="val val--${stateClass(r.head_seq)}">${esc(val(r.head_seq) ?? '—')}</div></div>
      <div class="vocab-cell"><div class="name">WRITE</div><div class="val val--${stateClass(r.write_path_alive)}">${esc(val(r.write_path_alive) ?? '—')}</div></div>
      <div class="vocab-cell"><div class="name">READ</div><div class="val val--${stateClass(r.read_path_alive)}">${esc(val(r.read_path_alive) ?? '—')}</div></div>
      <div class="vocab-cell"><div class="name">VERIFY</div><div class="val val--${stateClass(r.verify_path_alive)}">${esc(val(r.verify_path_alive) ?? '—')}</div></div>
      <div class="vocab-cell"><div class="name">REPLAY</div><div class="val val--${stateClass(r.replay_path_alive)}">${esc(val(r.replay_path_alive) ?? '—')}</div></div>
      <div class="vocab-cell"><div class="name">VAULT999</div><div class="val val--${stateClass(sub.vault999)}">${esc(val(sub.vault999) || '—')}</div></div>`;

    // vault round-trip button (operator convenience)
    const btn = $('#vault-test-btn');
    if (btn && !btn.dataset.bound) {
      btn.dataset.bound = '1';
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        btn.textContent = 'testing…';
        btn.style.opacity = '0.5';
        try {
          const resp = await fetch(SNAPSHOT_URL, { cache: 'no-store' });
          btn.textContent = resp.ok ? `✅ snapshot reachable · HTTP ${resp.status}` : `❌ HTTP ${resp.status}`;
        } catch (err) {
          btn.textContent = '❌ ' + err.message;
        }
        btn.style.opacity = '1';
        setTimeout(() => { btn.textContent = 'run round-trip test'; }, 5000);
      });
    }
  }

  /* ── F13 Findings panel (NEW — first-class UI) ────────── */
  function renderFindings(d) {
    const findings = d.findings || {};
    const list = findings.findings || [];
    const grid = $('#findings-grid');
    if (!grid) return;
    if (!list.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:2rem;color:var(--text-muted)">No open findings — kernel reports clean across snapshot.</div>`;
      return;
    }
    const sevOrder = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
    grid.innerHTML = list.slice().sort((a, b) =>
      sevOrder.indexOf(a.severity) - sevOrder.indexOf(b.severity)
    ).map(f => {
      const sev = (f.severity || 'LOW').toUpperCase();
      const cls = sev === 'CRITICAL' || sev === 'HIGH' ? 'red'
                : sev === 'MEDIUM' ? 'amber' : 'grey';
      return `
        <div class="finding-card finding-card--${cls}" data-finding-id="${esc(f.id || '?')}">
          <div class="finding-head">
            <span class="finding-id">${esc(f.id || '?')}</span>
            <span class="badge badge--${cls}">${esc(sev)}</span>
            <span class="finding-cat">${esc(f.category || '—')}</span>
            <span class="finding-status">${esc(f.status || 'OPEN')}</span>
          </div>
          <div class="finding-desc">${esc(f.description || '')}</div>
          <div class="finding-evidence"><b>evidence:</b> <code>${esc(f.evidence || '—')}</code></div>
        </div>`;
    }).join('');
  }

  /* ── F13 Daily Reality Pulse ──────────────────────────── */
  function renderPulse(d) {
    const grid = $('#pulse-grid');
    if (!grid) return;
    const organs = d.organs || {};
    const meta = d.intelligence_decomposition || {};
    const machine = meta.machine_substrate && val(meta.machine_substrate);
    const intel   = meta.intelligence_pipeline && val(meta.intelligence_pipeline);
    const items = [
      { name: 'arifOS',  key: 'arifos', signal: 'constitutional' },
      { name: 'A-FORGE', key: 'aforge', signal: 'execution' },
      { name: 'AAA',     key: 'aaa',    signal: 'routing' },
      { name: 'GEOX',    key: 'geox',   signal: 'earth' },
      { name: 'WEALTH',  key: 'wealth', signal: 'capital' },
      { name: 'WELL',    key: 'well',   signal: 'human' },
      { name: 'MACHINE', key: null,     signal: `substrate(${machine || '?'}) | intelligence(${intel || '?'})` },
    ];
    grid.innerHTML = items.map(p => {
      const od = p.key ? organs[p.key] : null;
      const transport = od ? (od.transport && val(od.transport)) : null;
      const cls = stateClass(transport || (p.key ? 'unknown' : intel));
      return `<div class="pulse-cell pulse-cell--${cls}" data-organ="${esc(p.key || 'machine')}">
        <div class="pulse-name">${esc(p.name)}</div>
        <div class="pulse-signal">${esc(p.signal)}</div>
        <div class="pulse-status">${esc((transport || (p.key ? 'unknown' : (intel || 'unknown'))).toString().toUpperCase())}</div>
      </div>`;
    }).join('');
  }

  /* ── F13 Authority gate — self-populating live probe ───── */
  const AUTHORITY_ROWS = [
    { url: '/api/observatory/v1/snapshot',          layer: 'snapshot',     auth: 'un-auth' },
    { url: '/api/observatory/v1/health',            layer: '7-state',      auth: 'un-auth' },
    { url: '/api/observatory/v1/health-public',     layer: 'transport',    auth: 'un-auth', expected: 'public health' },
    { url: '/api/observatory/v1/ready',             layer: 'dependencies', auth: 'internal-network', expected: 'postgres·redis·qdrant' },
    { url: '/api/observatory/v1/capabilities',      layer: 'sanitized',    auth: 'un-auth', expected: 'public tool list' },
    { url: '/api/observatory/v1/capabilities/full', layer: 'operator',     auth: 'X-Op-Token', expected: 'tier=operator' },
    { url: '/api/observatory/v1/seal/head',         layer: 'operator',     auth: 'X-Op-Token', expected: 'VAULT999 head' },
    { url: '/.well-known/did.json',                 layer: 'identity',     auth: 'un-auth', expected: 'root DID' },
    { url: '/.well-known/arifos-federation.json',   layer: 'federation',   auth: 'un-auth', expected: 'organs + edges SOT' },
    { url: '/.well-known/governance.jsonld',        layer: 'constitutional', auth: 'un-auth', expected: '13 floors + 5 ontology' },
    { url: '/.well-known/agent.json',               layer: 'agent card',   auth: 'un-auth', expected: 'machine agent card' },
    { url: '/999/',                                  layer: 'public-proof', auth: 'un-auth', expected: 'VAULT999 sampled proofs' },
  ];

  async function probeAuthorityRow(row) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), PROBE_TIMEOUT_MS);
    try {
      const resp = await fetch(row.url, { method: 'GET', cache: 'no-store', signal: ctrl.signal });
      clearTimeout(timer);
      if (resp.status === 200) {
        const ct = resp.headers.get('content-type') || '';
        const looksJSON = /json/i.test(ct);
        return { ok: true, verdict: 'reachable', note: looksJSON ? '200 JSON' : `200 ${ct.split(';')[0] || '?'}` };
      }
      if (resp.status === 401 || resp.status === 403) return { ok: true, verdict: 'tier-gated', note: `${resp.status} (requires ${row.auth})` };
      if (resp.status === 404) return { ok: false, verdict: 'absent', note: '404 — claim removed' };
      if (resp.status === 405) return { ok: true, verdict: 'method-not-allowed', note: `405 — try POST` };
      return { ok: false, verdict: 'fail', note: `HTTP ${resp.status}` };
    } catch (err) {
      clearTimeout(timer);
      return { ok: false, verdict: 'absent', note: 'timeout / network' };
    }
  }

  async function renderAuthorityGate(d) {
    const tbody = $('#authority-tbody');
    if (!tbody) return;

    // gate signal from snapshot (replaces static "reachable/ready" prose)
    const cap = d.capabilities || {};
    const capDrift = (cap.declared_count != null && cap.registered_count != null && cap.registered_count < cap.declared_count);
    const sig = d.signature || {};
    const sigState = st(sig) || (sig.value != null ? 'signed' : 'unsigned');
    const substrateDeps = d.substrate || {};
    const knownDeps = ['postgres','redis','qdrant'].filter(k => substrateDeps[k] && substrateDeps[k].value && substrateDeps[k].state === 'observed').length;

    const rows = AUTHORITY_ROWS.slice();

    // prepend snapshot-derived rows so they always render
    rows.unshift(
      { url: 'snapshot:capability_matrix', layer: 'capability', auth: 'derived', expected: `declared ${cap.declared_count ?? '?'} / registered ${cap.registered_count ?? '?'}` },
      { url: 'snapshot:signature',         layer: 'integrity',  auth: 'derived', expected: 'ed25519 over canonical-json' },
      { url: 'snapshot:floors',            layer: 'constitutional', auth: 'derived', expected: `${val(d.governance?.floors_passing) ?? '?'}/${val(d.governance?.floors_loaded) ?? '?'} passing` },
    );

    // initial render: all "probing..."
    tbody.innerHTML = rows.map(r => `<tr data-probe-url="${esc(r.url)}">
      <td><code>${esc(r.url)}</code></td>
      <td>${esc(r.auth)}</td>
      <td>${esc(r.layer)}</td>
      <td><span class="badge badge--grey">probing…</span></td>
      <td>${esc(r.expected || '')}</td>
    </tr>`).join('');

    // probe URLs in parallel
    const live = rows.filter(r => r.url.startsWith('/'));
    const results = await Promise.all(live.map(r => probeAuthorityRow(r).then(res => ({ url: r.url, ...res }))));
    const byUrl = Object.fromEntries(results.map(r => [r.url, r]));

    tbody.innerHTML = rows.map(r => {
      let verdict, note, cls;
      if (r.url === 'snapshot:capability_matrix') {
        const drift = capDrift;
        verdict = drift ? 'drift' : 'consistent';
        cls = drift ? 'amber' : 'green';
        note = drift ? `${cap.registered_count} of ${cap.declared_count} tools registered (F-001 OPEN)` : `${cap.registered_count}/${cap.declared_count} consistent`;
      } else if (r.url === 'snapshot:signature') {
        const signed = sig.value != null && sig.value !== '';
        verdict = signed ? 'signed' : 'unsigned';
        cls = signed ? 'green' : 'amber';
        note = signed ? `${sig.algorithm} · key_id ${shortHash(sig.key_id)}` : 'pending key bootstrap — UNSIGNED banner active';
      } else if (r.url === 'snapshot:floors') {
        const pass = val(d.governance?.floors_passing);
        const load = val(d.governance?.floors_loaded);
        verdict = (pass != null && load != null && pass >= load) ? 'pass' : 'partial';
        cls = verdict === 'pass' ? 'green' : 'amber';
        note = `${pass ?? '?'}/${load ?? '?'} passing`;
      } else {
        const res = byUrl[r.url];
        if (!res) {
          verdict = 'skipped'; cls = 'grey'; note = 'not probed';
        } else if (res.ok) {
          verdict = res.verdict;
          cls = res.verdict === 'tier-gated' ? 'amber' : 'green';
          note = res.note;
        } else {
          verdict = res.verdict;
          cls = 'red';
          note = res.note;
        }
      }
      return `<tr data-probe-url="${esc(r.url)}">
        <td><code>${esc(r.url)}</code></td>
        <td>${esc(r.auth)}</td>
        <td>${esc(r.layer)}</td>
        <td><span class="badge badge--${cls}">${esc(verdict)}</span></td>
        <td>${esc(note)}</td>
      </tr>`;
    }).join('');
  }

  /* ── F2 Surface consistency card (multi-surface canon) ── */
  async function renderSurfaceConsistency() {
    const grid = $('#surface-grid');
    if (!grid) return;
    let h;
    try {
      const resp = await fetch(KERNEL_HEALTH_URL, { cache: 'no-store' });
      if (!resp.ok) throw new Error(`health HTTP ${resp.status}`);
      h = await resp.json();
    } catch (err) {
      grid.innerHTML = `<div class="surface-card surface-card--grey" style="grid-column:1/-1">
        <div class="surface-label">/health</div>
        <div class="surface-val">error: ${esc(err.message)}</div>
        <div class="surface-meta">kernel health endpoint unreachable from page</div>
      </div>`;
      return;
    }
    const sc = h.surface_consistency || {};
    const vantages = sc.vantages || [];
    const verdict = sc.verdict || 'UNKNOWN';
    const canonCount = sc.canonical_count != null ? sc.canonical_count : '?';
    const canonHash = sc.canonical_hash || '?';
    const div = sc.divergences || [];

    const supplementary = [
      { label: 'tools_loaded',           val: h.tools_loaded,            public: true,  src: 'kernel.active_surface' },
      { label: 'canonical_tools',        val: h.canonical_tools,        public: true,  src: 'CANONICAL_TOOLS (mode-filtered)' },
      { label: 'canonical_tools_loaded', val: h.canonical_tools_loaded, public: true,  src: 'same as tools_loaded' },
      { label: 'tools_exposed_via_mcp',  val: h.tools_exposed_via_mcp,  public: true,  src: 'tools/list facade' },
      { label: 'tools_registry_size',    val: h.tools_registry_size,    public: false, src: 'raw internal registry' },
      { label: 'diagnostic_tools',       val: h.diagnostic_tools,       public: false, src: 'declared DIAGNOSTIC_TOOLS' },
      { label: 'total_declared_tools',   val: h.total_declared_tools,   public: false, src: 'public + diagnostic' },
      { label: 'operational_tools',      val: h.operational_tools,      public: false, src: 'currently active' },
    ];

    const verdictCls = verdict === 'CONSISTENT' ? 'green' : verdict === 'DIVERGENT' ? 'red' : 'amber';

    let html = `
      <div class="surface-card surface-summary">
        <div class="surface-label">surface_consistency</div>
        <div class="surface-val surface-val--${verdictCls}">${esc(verdict)}</div>
        <div class="surface-meta">
          canonical_count=<b>${esc(canonCount)}</b> · canonical_hash=<code>${esc(canonHash)}</code><br>
          ${div.length ? `⚠ ${div.length} divergence${div.length === 1 ? '' : 's'}` : 'all 6 vantages agree'}
        </div>
      </div>
      <div class="surface-card surface-section-head">vantages from /health</div>
    `;
    vantages.forEach(v => {
      const cls = v.matches_canonical ? 'green' : 'red';
      html += `
        <div class="surface-card surface-card--${cls}">
          <div class="surface-label">${esc(v.source)}</div>
          <div class="surface-val surface-val--${cls}">${esc(v.count)}</div>
          <div class="surface-meta">
            ${v.matches_canonical ? '✓ matches canonical' : '✗ does NOT match canonical'}
            ${v.note ? `<br><span class="surface-note">${esc(v.note)}</span>` : ''}
            ${v.exposed_count != null ? `<br>exposed=${v.exposed_count} internal=${v.internal_count || 0}` : ''}
          </div>
        </div>`;
    });
    html += `<div class="surface-card surface-section-head">supplementary counts from /health</div>`;
    supplementary.forEach(s => {
      const cls = s.public ? 'green' : 'grey';
      html += `
        <div class="surface-card surface-card--${cls}">
          <div class="surface-label">${esc(s.label)}${s.public ? ' · public-wire' : ' · internal/audit'}</div>
          <div class="surface-val surface-val--${cls}">${esc(s.val ?? '—')}</div>
          <div class="surface-meta">${esc(s.src)}</div>
        </div>`;
    });
    grid.innerHTML = html;
  }

  /* ── main fetch + render ──────────────────────────────── */
  async function loadSnapshot() {
    try {
      const resp = await fetch(SNAPSHOT_URL, { cache: 'no-store' });
      if (!resp.ok) throw new Error(`snapshot HTTP ${resp.status}`);
      const d = await resp.json();
      setBodyState(d, null);
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
      renderFindings(d);
      renderPulse(d);
      renderAuthorityGate(d);
      renderSurfaceConsistency();
      setTimeout(loadSnapshot, REFRESH_MS);
    } catch (err) {
      console.error('[observatory] snapshot error:', err);
      setBodyState(null, err);
      const ageEl = $('#meta-age');
      if (ageEl) ageEl.textContent = 'error: ' + err.message;
      setTimeout(loadSnapshot, 10000);
    }
  }

  /* ── bootstrap ─────────────────────────────────────────── */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadSnapshot);
  } else {
    loadSnapshot();
  }
})();