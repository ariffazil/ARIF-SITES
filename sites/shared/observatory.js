/**
 * arifOS Observatory — Client-Side Renderer
 * Fetches /.well-known/observatory-snapshot-latest.json (fast static mirror)
 * first; falls back to /api/observatory/v1/snapshot (live, slower).
 * DITEMPA BUKAN DIBERI — Forged, Not Given.
 */
(function () {
  'use strict';

  const SNAPSHOT_MIRROR = '/.well-known/observatory-snapshot-latest.json';
  const SNAPSHOT_LIVE = '/api/observatory/v1/snapshot';
  const REFRESH_MS = 30000;
  const UNAVAILABLE = 'unavailable';

  const runtime = {
    fetch: 'not measured',
    fetchSource: 'source: missing',
    render: 'not measured',
    lastRenderAt: null,
    timer: null,
    checks: {},
  };

  /* ── defensive envelope + DOM helpers ───────────────────── */
  const $ = (selector, parent) => (parent || document).querySelector(selector);
  const hasOwn = (value, key) => Object.prototype.hasOwnProperty.call(value, key);
  const isRecord = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
  const isEnvelope = (value) => isRecord(value) && (
    hasOwn(value, 'value') || hasOwn(value, 'state') || hasOwn(value, 'source') ||
    hasOwn(value, 'confidence') || hasOwn(value, 'observed_at') || hasOwn(value, 'age_seconds')
  );
  const unwrap = (input) => {
    let value = input;
    let depth = 0;
    while (isRecord(value) && hasOwn(value, 'value') && depth < 8) {
      value = value.value;
      depth += 1;
    }
    return value;
  };
  const val = unwrap;
  const esc = (input) => String(input == null ? '' : input)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
  const setText = (selector, value) => {
    const element = $(selector);
    if (element) element.textContent = value;
  };
  const asArray = (input) => {
    const value = unwrap(input);
    return Array.isArray(value) ? value : [];
  };
  const findingsList = (data) => {
    const findings = unwrap(data && data.findings);
    if (Array.isArray(findings)) return findings;
    if (isRecord(findings) && Array.isArray(findings.findings)) return findings.findings;
    if (isRecord(findings) && Array.isArray(findings.items)) return findings.items;
    if (isRecord(findings) && Array.isArray(findings.list)) return findings.list;
    return [];
  };
  const safeJson = (value) => {
    try { return JSON.stringify(value); } catch (error) {
      console.error('Observatory value serialization failed:', error);
      return UNAVAILABLE;
    }
  };
  const compactValue = (input, fallback) => {
    const value = unwrap(input);
    if (value == null || value === '') return fallback || UNAVAILABLE;
    if (Array.isArray(value)) {
      if (!value.length) return fallback || UNAVAILABLE;
      return value.map((item) => compactValue(item, UNAVAILABLE)).join(' · ');
    }
    if (isRecord(value)) {
      const preferred = ['status', 'verdict', 'state', 'summary', 'name', 'id'];
      const preferredKey = preferred.find((key) => hasOwn(value, key) && unwrap(value[key]) != null);
      if (preferredKey) return compactValue(value[preferredKey], fallback);
      const entries = Object.entries(value).slice(0, 4).map(([key, item]) => `${key}=${compactValue(item, UNAVAILABLE)}`);
      return entries.length ? entries.join(' · ') : (fallback || UNAVAILABLE);
    }
    return String(value);
  };
  const sourceValue = (input) => {
    if (!isRecord(input)) return null;
    const source = unwrap(input.source);
    return source == null || source === '' ? null : String(source);
  };
  const confidenceValue = (input) => {
    if (!isRecord(input)) return null;
    const confidence = unwrap(input.confidence);
    return confidence == null || confidence === '' ? null : String(confidence);
  };
  const observedAtValue = (input) => {
    if (!isRecord(input)) return null;
    const observedAt = unwrap(input.observed_at);
    return observedAt == null || observedAt === '' ? null : String(observedAt);
  };
  const ageSecondsValue = (input) => {
    if (!isRecord(input)) return null;
    const age = Number(unwrap(input.age_seconds));
    return Number.isFinite(age) && age >= 0 ? age : null;
  };
  const ago = (timestamp) => {
    if (!timestamp) return UNAVAILABLE;
    const milliseconds = new Date(timestamp).getTime();
    if (!Number.isFinite(milliseconds)) return UNAVAILABLE;
    const seconds = Math.max(0, Math.floor((Date.now() - milliseconds) / 1000));
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
  };
  const freshnessValue = (input, fallbackObservedAt) => {
    const age = ageSecondsValue(input);
    if (age != null) return `${Math.floor(age)}s old`;
    const observedAt = observedAtValue(input) || fallbackObservedAt;
    return observedAt ? `${ago(observedAt)} old` : UNAVAILABLE;
  };
  const metadataLine = (input, fallbackObservedAt, extra) => {
    const source = sourceValue(input) || 'missing';
    const confidence = confidenceValue(input) || 'unknown';
    const freshness = freshnessValue(input, fallbackObservedAt);
    return `source: ${source} · confidence: ${confidence} · freshness: ${freshness}${extra ? ` · ${extra}` : ''}`;
  };
  const stateToken = (input) => {
    if (isRecord(input)) {
      const value = unwrap(input);
      if (typeof value === 'string' || typeof value === 'boolean') return String(value);
      const status = unwrap(input.status);
      if (status != null) return String(status);
      const state = unwrap(input.state);
      if (state != null) return String(state);
    }
    const value = unwrap(input);
    return value == null ? '' : String(value);
  };
  const semanticState = (input) => {
    const token = stateToken(input).trim().toLowerCase();
    if (!token || /^(unknown|unavailable|missing|null|none|not measured|unmeasured|unverified|n\/a|—)$/.test(token)) return 'unknown';
    if (/\b(hold|void|down|fail|failed|false|error|critical|blocked|denied|breach|retak|killed)\b/.test(token)) return 'down';
    if (/\b(warn|warning|degraded|partial|amber|sabar|limited|stale|pending|planned|next|queued|incomplete)\b/.test(token)) return 'degraded';
    if (/\b(true|up|healthy|pass|passed|seal|sealed|alive|live|fresh|ready|full|aligned|verified|kukuh|amanah|bijaksana|selamat|stable|optimal|active|measured|loaded)\b/.test(token)) return 'healthy';
    return 'unknown';
  };
  const paletteClass = (input) => ({ healthy: 'green', degraded: 'amber', down: 'red', unknown: 'grey' }[semanticState(input)]);
  const badge = (input, label) => {
    const shown = label == null ? compactValue(input) : compactValue(label);
    const semantic = semanticState(input);
    return `<span class="status status--${semantic} badge badge--${paletteClass(input)}" data-state="${semantic}">${esc(shown)}</span>`;
  };
  const firstPresent = (...values) => values.find((value) => value !== undefined && value !== null);
  const recordState = (record, fallback) => {
    if (isRecord(record)) {
      const status = firstPresent(record.status, record.state, record.verdict);
      if (status != null) return status;
    }
    return fallback == null ? record : fallback;
  };
  const normalizeKey = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  /* ── governance normalization ────────────────────────────── */
  const floorDefinitions = [
    { id: 'F1', aliases: ['F1'], name: 'AMANAH' },
    { id: 'F2', aliases: ['F2'], name: 'TRUTH' },
    { id: 'F3', aliases: ['F3'], name: 'WITNESS' },
    { id: 'F4', aliases: ['F4'], name: 'CLARITY' },
    { id: 'F5', aliases: ['F5'], name: 'PEACE²' },
    { id: 'F6', aliases: ['F6'], name: 'MARUAH' },
    { id: 'F7', aliases: ['F7'], name: 'HUMILITY' },
    { id: 'F8', aliases: ['F8'], name: 'GENIUS' },
    { id: 'F9', aliases: ['F9'], name: 'ANTI-HANTU' },
    { id: 'F10', aliases: ['F10', 'L10'], name: 'ONTOLOGY' },
    { id: 'F11', aliases: ['F11', 'L11'], name: 'AUDIT' },
    { id: 'F12', aliases: ['F12', 'L12'], name: 'INJECTION' },
    { id: 'F13', aliases: ['F13', 'L13'], name: 'SOVEREIGN' },
  ];
  const normalizedFloors = (governance) => {
    const raw = unwrap(governance && governance.floors);
    if (Array.isArray(raw)) {
      return floorDefinitions.map((definition) => {
        const record = raw.find((item) => definition.aliases.includes(String(unwrap(item && (item.id || item.floor || item.name))).toUpperCase()));
        return { definition, record };
      });
    }
    const floors = isRecord(raw) ? raw : {};
    return floorDefinitions.map((definition) => {
      const key = definition.aliases.find((alias) => hasOwn(floors, alias));
      return { definition, record: key ? floors[key] : undefined };
    });
  };
  const floorParts = (definition, record) => {
    const data = isRecord(record) ? record : {};
    const scoreRecord = firstPresent(data.score, isEnvelope(record) ? record : undefined);
    const rawScore = unwrap(firstPresent(data.score, isEnvelope(record) ? record : undefined));
    const score = typeof rawScore === 'number' && Number.isFinite(rawScore)
      ? rawScore
      : (typeof rawScore === 'string' && rawScore.trim() !== '' && !Number.isNaN(Number(rawScore)) ? Number(rawScore) : null);
    const statusRecord = firstPresent(data.status, data.verdict, data.state, isEnvelope(record) ? record.state : undefined);
    const status = compactValue(statusRecord, UNAVAILABLE);
    const normalizedStatus = status.toLowerCase();
    let measurement = 'not measured';
    if (/stale/.test(normalizedStatus)) measurement = 'stale';
    else if (/blocked|hold|void|fail|critical/.test(normalizedStatus)) measurement = 'blocked';
    else if (score != null) measurement = 'measured';
    else if (record !== undefined) measurement = 'loaded / not measured';
    if (definition.id === 'F13' && score == null) {
      const active = /active|pass|seal|human/.test(normalizedStatus);
      measurement = active ? 'active · human authority · not measured' : 'human authority · not measured';
    }
    const state = score != null ? recordState(statusRecord, scoreRecord) : recordState(statusRecord, 'unknown');
    return { score, scoreRecord, statusRecord, status, measurement, state };
  };
  const findEarthWitness = (decomposition) => {
    const data = unwrap(decomposition);
    if (!isRecord(data)) return { found: false, value: undefined };
    if (hasOwn(data, 'witness.earth')) return { found: true, value: data['witness.earth'] };
    const candidates = [data.witness, data.F3, data.f3, data.tri_witness, data.triwitness].filter(isRecord);
    for (const candidate of candidates) {
      if (hasOwn(candidate, 'earth')) return { found: true, value: candidate.earth };
      if (isRecord(candidate.witness) && hasOwn(candidate.witness, 'earth')) return { found: true, value: candidate.witness.earth };
    }
    return { found: false, value: undefined };
  };
  const flattenStates = (input, prefix, output) => {
    const value = unwrap(input);
    const target = output || [];
    const path = prefix || '';
    if (Array.isArray(value)) {
      value.forEach((item, index) => flattenStates(item, `${path}[${index}]`, target));
      return target;
    }
    if (isRecord(value)) {
      Object.entries(value).forEach(([key, item]) => flattenStates(item, path ? `${path}.${key}` : key, target));
      return target;
    }
    if (value != null && value !== '') target.push({ path, value: String(value), state: semanticState(value) });
    return target;
  };
  const effectiveGovernance = (governance) => {
    const rawVerdict = compactValue(governance && governance.verdict, UNAVAILABLE).toUpperCase();
    const explicitReason = compactValue(firstPresent(governance && governance.reason, governance && governance.verdict_reason), '');
    if (rawVerdict !== 'UNKNOWN' && rawVerdict !== UNAVAILABLE.toUpperCase()) {
      return { rawVerdict, verdict: rawVerdict, reason: explicitReason || 'reason unavailable' };
    }
    const decomposition = governance && governance.verdict_decomposition;
    const earth = findEarthWitness(decomposition);
    const earthValue = earth.found ? compactValue(earth.value, UNAVAILABLE) : '';
    if (earth.found && semanticState(earth.value) === 'unknown') {
      return { rawVerdict, verdict: 'HOLD', reason: 'HOLD — F3 witness.earth incomplete (missing or unknown)' };
    }
    const decisive = flattenStates(decomposition).find((entry) => entry.state === 'down' || entry.state === 'degraded');
    if (explicitReason) return { rawVerdict, verdict: 'HOLD', reason: `HOLD — ${explicitReason}` };
    if (decisive) return { rawVerdict, verdict: 'HOLD', reason: `HOLD — ${decisive.path || 'verdict decomposition'} is ${decisive.value}` };
    if (earth.found && earthValue) return { rawVerdict, verdict: 'HOLD', reason: `HOLD — raw verdict UNKNOWN; witness.earth reports ${earthValue}` };
    return { rawVerdict, verdict: 'HOLD', reason: 'HOLD — raw verdict UNKNOWN; no decisive measured decomposition is available' };
  };

  /* ── NOW + metadata ──────────────────────────────────────── */
  function renderNowStrip(data) {
    const set = (id, label, state) => {
      setText(`#now-${id} .val`, label);
      const pill = $(`#now-${id}`);
      if (pill) pill.className = `now-pill now-pill--${paletteClass(state)}`;
    };
    const substrate = data.substrate || {};
    const cpuValue = unwrap(substrate.cpu);
    const cpuPercent = isRecord(cpuValue) ? firstPresent(cpuValue.percent, cpuValue.cpu_percent) : firstPresent(unwrap(substrate.cpu_percent), cpuValue);
    const governance = effectiveGovernance(data.governance || {});
    const metabolism = asArray(data.metabolism);
    const sources = asArray(data.evidence && data.evidence.sources_used);
    const authorization = data.authority && data.authority.effective_action_authority;
    const authorized = isRecord(unwrap(authorization)) ? unwrap(authorization).authorized : unwrap(authorization);

    set('substrate', cpuPercent != null ? `${cpuPercent}% CPU` : UNAVAILABLE, substrate.cpu);
    set('governance', governance.rawVerdict === 'UNKNOWN' ? 'HOLD (raw UNKNOWN)' : governance.verdict, governance.verdict);
    set('intelligence', metabolism.length ? `${metabolism.length} stages` : UNAVAILABLE, metabolism.length ? 'measured' : 'unknown');
    set('evidence', sources.length ? `${sources.length} sources` : UNAVAILABLE, sources.length ? 'measured' : 'unknown');
    set('authority', authorized === true ? 'AUTHORIZED' : (authorized === false ? 'NOT AUTHORIZED' : UNAVAILABLE), authorized);
  }

  function renderMeta(data) {
    setText('#meta-age', data.observed_at ? `${ago(data.observed_at)} ago` : UNAVAILABLE);
    setText('#meta-incidents', String(asArray(data.incidents).length));
    const findings = findingsList(data);
    const openFindings = findings.filter((finding) => compactValue(finding && finding.status, '').toUpperCase() === 'OPEN');
    setText('#meta-findings', String(openFindings.length || findings.length));
    setText('#meta-stage', compactValue(firstPresent(data.stage_evidence && data.stage_evidence.stage, data.conformance && data.conformance.stage)));

    const drift = unwrap(data.runtime_identity && data.runtime_identity.drift);
    const driftElement = $('#meta-drift');
    if (driftElement && isRecord(drift)) {
      const entries = Object.entries(drift);
      const drifted = entries.filter(([, value]) => /DRIFTED/i.test(compactValue(value, ''))).length;
      driftElement.textContent = `${drifted}/${entries.length} drifted`;
      driftElement.className = `badge badge--${drifted ? 'amber' : 'green'}`;
    } else if (driftElement) {
      driftElement.textContent = UNAVAILABLE;
      driftElement.className = 'badge badge--grey';
    }

    const holds = findings.filter((finding) => /hold/i.test(compactValue(firstPresent(finding && finding.severity, finding && finding.verdict), '')));
    const holdElement = $('#meta-hold');
    if (holdElement) {
      holdElement.textContent = holds.length ? `${holds.length} holds` : 'none measured';
      holdElement.className = `badge badge--${holds.length ? 'red' : 'grey'}`;
    }

    const capabilities = data.capabilities || {};
    const tested = unwrap(capabilities.tested_count);
    const declared = unwrap(capabilities.declared_count);
    setText('#meta-test', tested != null && declared != null ? `${tested}/${declared} tested` : UNAVAILABLE);
    setText('#footer-snap-id', compactValue(data.snapshot_id));
    setText('#footer-obs-at', data.observed_at && Number.isFinite(new Date(data.observed_at).getTime()) ? new Date(data.observed_at).toISOString() : UNAVAILABLE);

    const signature = unwrap(data.signature) || {};
    const algorithm = compactValue(signature.algorithm, 'unsigned');
    const keyId = compactValue(signature.key_id);
    const payloadHash = compactValue(signature.payload_hash);
    const signedAt = compactValue(signature.signed_at);
    setText('#footer-signature', `algorithm=${algorithm} · key_id=${keyId} · payload_hash=${payloadHash} · signed_at=${signedAt}`);

    const tier = unwrap(data.tier) || {};
    const tierValue = isRecord(tier) ? firstPresent(unwrap(tier.current), unwrap(tier.value)) : tier;
    const tierElement = $('#tier-pill');
    if (tierElement && tierValue) {
      tierElement.textContent = `tier: ${tierValue}`;
      tierElement.dataset.tierActive = tierValue !== 'public' ? 'true' : 'false';
    }
  }

  /* ── F2 Runtime identity ─────────────────────────────────── */
  function renderIdentity(data) {
    const identity = data.runtime_identity || {};
    const set = (id, record, formatter, missingReason) => {
      const element = $(`#id-${id}`);
      const note = $(`#id-${id}-note`);
      const raw = unwrap(record);
      const present = raw !== undefined && raw !== null && raw !== '';
      if (element) {
        element.textContent = present ? (formatter ? formatter(raw) : compactValue(raw)) : UNAVAILABLE;
        element.className = `v ${present ? '' : 'unknown'}`.trim();
      }
      if (note) note.textContent = present
        ? metadataLine(record, data.observed_at)
        : `source: missing · confidence: unknown · reason: ${missingReason || 'metadata unavailable'}`;
    };

    set('source', identity.source_commit, String, 'source commit metadata unavailable');
    set('deployed', identity.deployed_commit, String, 'deployed commit metadata unavailable');
    set('build', identity.build_commit, String, 'build commit metadata unavailable');

    const drift = unwrap(identity.drift);
    const driftText = isRecord(drift)
      ? Object.entries(drift).map(([key, value]) => `${key}=${compactValue(value)}`).join(' · ')
      : compactValue(drift);
    set('drift', drift === undefined || drift === null ? undefined : driftText, String, 'drift metadata unavailable');
    set('mode', identity.deployment_mode, String, 'deployment mode metadata unavailable');
    set('started', identity.process_started_at, (value) => {
      const time = new Date(value).getTime();
      return Number.isFinite(time) ? new Date(time).toLocaleString() : compactValue(value);
    }, 'process start metadata unavailable');
    set('platform', identity.platform, compactValue, 'platform metadata unavailable');
    set('epoch', identity.kernel_epoch, compactValue, 'kernel epoch metadata unavailable');
  }

  /* ── 7-state vocabulary ──────────────────────────────────── */
  function renderVocabulary(data) {
    const memory = unwrap(data.substrate && data.substrate.memory);
    const memoryPercent = isRecord(memory) ? memory.percent : null;
    const capabilities = data.capabilities || {};
    const governance = effectiveGovernance(data.governance || {});
    const authorization = data.authority && data.authority.effective_action_authority;
    const authorizedValue = unwrap(authorization);
    const authorized = isRecord(authorizedValue) ? authorizedValue.authorized : authorizedValue;
    const floors = normalizedFloors(data.governance || {});
    const loadedFloors = floors.filter(({ record }) => record !== undefined).length;
    const states = {
      LIVENESS: { value: memoryPercent != null ? `${(100 - Number(memoryPercent)).toFixed(0)}% memory free` : UNAVAILABLE, state: data.substrate && data.substrate.memory },
      READINESS: { value: compactValue(firstPresent(data.conformance && data.conformance.stage, data.stage_evidence && data.stage_evidence.stage)), state: firstPresent(data.conformance && data.conformance.stage, data.stage_evidence && data.stage_evidence.stage) },
      CAPABILITY: { value: unwrap(capabilities.declared_count) != null ? `${compactValue(capabilities.invocable_count, '0')}/${compactValue(capabilities.declared_count)}` : UNAVAILABLE, state: capabilities.state || capabilities.status },
      GOVERNANCE: { value: governance.rawVerdict === 'UNKNOWN' ? 'HOLD (raw UNKNOWN)' : governance.verdict, state: governance.verdict },
      AUTHORIZATION: { value: authorized === true ? 'AUTHORIZED' : (authorized === false ? 'NOT AUTHORIZED' : UNAVAILABLE), state: authorized },
      RECEIPT: { value: compactValue(data.receipts && data.receipts.last_receipt_tier), state: data.receipts && data.receipts.last_receipt_tier },
      CONSTITUTIONAL: { value: loadedFloors ? `${loadedFloors}/13 loaded` : UNAVAILABLE, state: loadedFloors === 13 ? 'loaded' : 'unknown' },
    };
    Object.entries(states).forEach(([name, item]) => {
      const cell = $(`#vocab-${name} .val`);
      if (cell) {
        cell.textContent = item.value;
        cell.className = `val val--${paletteClass(item.state)}`;
      }
    });
  }

  /* ── F1-F13 Governance state ────────────────────────────── */
  function renderGovernance(data) {
    const governance = data.governance || {};
    const effective = effectiveGovernance(governance);
    const floors = normalizedFloors(governance);
    const floorGrid = $('#floor-grid');
    const measured = floors.filter(({ definition, record }) => floorParts(definition, record).score != null).length;
    const blocked = floors.filter(({ definition, record }) => floorParts(definition, record).measurement === 'blocked').length;
    const stale = floors.filter(({ definition, record }) => floorParts(definition, record).measurement === 'stale').length;
    const loaded = floors.filter(({ record }) => record !== undefined).length;

    const summary = $('#governance-decomposition');
    if (summary) {
      const governanceRecord = governance.verdict;
      const reasonRecord = firstPresent(governance.reason, governance.verdict_reason, governance.verdict_decomposition);
      const driftRecord = firstPresent(governance.drift, data.runtime_identity && data.runtime_identity.drift);
      const vaultRecord = firstPresent(governance.vault999, data.substrate && data.substrate.vault999, data.receipts && data.receipts.chain_status);
      summary.innerHTML = [
        ['GOVERNANCE', effective.rawVerdict === 'UNKNOWN' ? 'HOLD (raw UNKNOWN)' : effective.verdict, effective.verdict, governanceRecord],
        ['REASON', effective.reason, effective.verdict, reasonRecord],
        ['DRIFT', compactValue(driftRecord), driftRecord, driftRecord],
        ['VAULT999', compactValue(vaultRecord), vaultRecord, vaultRecord],
        ['FLOORS', `${loaded}/13 loaded · ${measured} measured · ${blocked} blocked · ${stale} stale`, loaded === 13 ? 'loaded' : 'unknown', governance.floors],
      ].map(([name, value, state, record]) => `
        <div class="vocab-cell governance-cell">
          <div class="name">${esc(name)}</div>
          <div class="val val--${paletteClass(state)}">${esc(value)}</div>
          <div class="observatory-meta">${esc(metadataLine(record, data.observed_at))}</div>
        </div>`).join('');
    }

    if (floorGrid) {
      floorGrid.innerHTML = floors.map(({ definition, record }) => {
        const parts = floorParts(definition, record);
        const sourceRecord = firstPresent(parts.scoreRecord, parts.statusRecord, record);
        const score = parts.score == null ? '—' : parts.score.toFixed(2);
        const status = parts.status === UNAVAILABLE ? 'status: unavailable' : `status: ${parts.status}`;
        return `<div class="floor-cell floor-cell--${paletteClass(parts.state)}" data-floor="${definition.id}" data-measurement="${esc(parts.measurement)}">
          <div class="floor-header"><span class="floor-num">${definition.id}</span><span class="floor-name">${definition.name}</span></div>
          <div class="floor-score">${esc(score)}</div>
          <div class="floor-status">${esc(parts.measurement)} · ${esc(status)}</div>
          <div class="floor-meta">${esc(metadataLine(sourceRecord, data.observed_at))}</div>
        </div>`;
      }).join('');
    }

    const decomposition = unwrap(governance.verdict_decomposition);
    const decompositionGrid = $('#verdict-decomp');
    if (decompositionGrid) {
      const entries = isRecord(decomposition) ? Object.entries(decomposition) : [];
      decompositionGrid.innerHTML = entries.length ? entries.map(([key, value]) => `
        <div class="vocab-cell">
          <div class="name">${esc(key)}</div>
          <div class="val val--${paletteClass(value)}">${esc(compactValue(value))}</div>
          <div class="observatory-meta">${esc(metadataLine(value, data.observed_at))}</div>
        </div>`).join('') : `<div class="vocab-cell"><div class="name">DECOMPOSITION</div><div class="val val--grey">${UNAVAILABLE}</div><div class="observatory-meta">source: missing · confidence: unknown</div></div>`;
    }
  }

  /* ── Capability drift ────────────────────────────────────── */
  function renderDrift(data) {
    const capabilities = data.capabilities || {};
    const matrix = asArray(capabilities.matrix);
    const body = $('#drift-table tbody');
    if (!body) return;
    if (!matrix.length) {
      body.innerHTML = '<tr><td colspan="9" class="observatory-empty">No capability measurements available — parser loaded / not measured</td></tr>';
      return;
    }
    body.innerHTML = matrix.map((row) => {
      if (!isRecord(row)) return '';
      return `<tr>
        <td><code>${esc(compactValue(firstPresent(row.name, row.tool)))}</code></td>
        <td>${badge(row.declared)}</td><td>${badge(row.registered)}</td><td>${badge(row.exposed)}</td>
        <td>${badge(row.invocable)}</td><td>${badge(row.tested)}</td><td>${badge(row.in_out_match)}</td>
        <td>${esc(freshnessValue(firstPresent(row.last_test, row), data.observed_at))}</td><td>${badge(row.truth)}</td>
      </tr>`;
    }).join('');
  }

  /* ── arifFLOW + receipt migration ────────────────────────── */
  const flowSnapshot = (data) => {
    const organs = unwrap(data.organs) || {};
    const candidates = [
      data.arifFLOW, data.arifflow, data.arif_flow, data.flow_plane,
      isRecord(organs) ? firstPresent(organs.arifFLOW, organs.arifflow, organs.arif_flow) : undefined,
    ];
    const candidate = candidates.find((item) => item !== undefined && item !== null);
    const value = unwrap(candidate);
    return { envelope: candidate, value: isRecord(value) ? value : null };
  };
  const flowField = (flow, ...names) => {
    if (!flow) return undefined;
    const name = names.find((key) => hasOwn(flow, key));
    return name ? flow[name] : undefined;
  };
  const formatEndpoints = (record) => {
    const endpoints = unwrap(record);
    if (Array.isArray(endpoints)) return endpoints.length ? endpoints.map((item) => compactValue(item)).join(' · ') : UNAVAILABLE;
    if (isRecord(endpoints)) return Object.entries(endpoints).map(([name, endpoint]) => `${name}: ${compactValue(endpoint)}`).join(' · ') || UNAVAILABLE;
    return compactValue(endpoints);
  };

  function renderFlowPlane(data) {
    const flow = flowSnapshot(data);
    const record = flow.value;
    const health = flowField(record, 'health', 'status', 'transport', 'liveness');
    const receipts = firstPresent(
      flowField(record, 'receipt_count', 'receipts_count', 'count'),
      record && isRecord(unwrap(record.receipts)) ? unwrap(record.receipts).count : undefined,
    );
    const chain = firstPresent(flowField(record, 'chain', 'chain_status', 'receipt_chain'), record && record.ledger && record.ledger.chain);
    const fq = flowField(record, 'fq');
    const endpoints = flowField(record, 'endpoints', 'endpoint', 'routes');
    const authority = firstPresent(flowField(record, 'authority', 'authorization'), data.authority && data.authority.arifFLOW);

    const setFlow = (id, field, formatter) => {
      const value = $(`#flow-${id}-value`);
      const meta = $(`#flow-${id}-meta`);
      if (value) {
        value.innerHTML = id === 'health'
          ? badge(field)
          : esc(formatter ? formatter(field) : compactValue(field));
      }
      if (meta) meta.textContent = metadataLine(field, data.observed_at);
    };
    setFlow('health', health);
    setFlow('receipts', receipts);
    setFlow('chain', chain);
    setFlow('fq', fq);
    setFlow('endpoints', endpoints, (field) => field === undefined ? 'unavailable — no same-origin public route reported' : formatEndpoints(field));
    const source = $('#flow-source-value');
    if (source) source.textContent = sourceValue(flow.envelope) ? `source: ${sourceValue(flow.envelope)}` : 'source: missing';
    const freshness = $('#flow-freshness-value');
    if (freshness) freshness.textContent = freshnessValue(flow.envelope, data.observed_at);
    const authorityElement = $('#flow-authority');
    if (authorityElement) authorityElement.textContent = authority === undefined
      ? 'Authority unavailable in the snapshot. Mutation remains HOLD until ARIF GO.'
      : compactValue(authority);
  }

  const p1Fallback = [
    { id: 'P1-1', scope: 'Receipt event schema', status: 'SEALED' },
    { id: 'P1-2', scope: 'Receipt persistence boundary', status: 'SEALED' },
    { id: 'P1-3', scope: 'Receipt chain verification', status: 'SEALED' },
    { id: 'P1-B', scope: 'Local fallback boundary', status: 'SEALED' },
    { id: 'P1-4', scope: 'AAA → arifFLOW telemetry', status: 'SEALED LIVE' },
    { id: 'P1-5', scope: 'A-FORGE → arifFLOW logEvent', status: 'HOLD / planned' },
    { id: 'P1-6', scope: 'AF-1 canary', status: 'NEXT / AF-1 canary' },
    { id: 'P1-7', scope: 'Federation completion', status: 'pending' },
  ];
  const p1Snapshot = (data) => {
    const flow = flowSnapshot(data).value;
    return unwrap(firstPresent(
      data.receipt_federation,
      data.p1_receipt_federation,
      flow && firstPresent(flow.receipt_federation, flow.p1, flow.migration),
    ));
  };
  const p1Record = (snapshot, id) => {
    if (Array.isArray(snapshot)) return snapshot.find((item) => normalizeKey(unwrap(item && firstPresent(item.id, item.phase, item.name))) === normalizeKey(id));
    if (!isRecord(snapshot)) return undefined;
    const key = Object.keys(snapshot).find((candidate) => normalizeKey(candidate) === normalizeKey(id));
    return key ? snapshot[key] : undefined;
  };

  function renderP1ReceiptFederation(data) {
    const snapshot = p1Snapshot(data);
    const body = $('#p1-receipt-matrix tbody');
    if (!body) return;
    body.innerHTML = p1Fallback.map((fallback) => {
      const observed = p1Record(snapshot, fallback.id);
      const statusRecord = observed === undefined ? fallback.status : firstPresent(observed && observed.status, observed && observed.verdict, observed && observed.state, observed);
      const scope = observed === undefined ? fallback.scope : compactValue(firstPresent(observed && observed.scope, observed && observed.description), fallback.scope);
      const source = observed === undefined ? 'declared migration fallback' : (sourceValue(observed) || 'snapshot');
      const confidence = observed === undefined ? 'unknown' : (confidenceValue(observed) || 'unknown');
      return `<tr data-phase="${fallback.id}" data-source="${observed === undefined ? 'declared-fallback' : 'snapshot'}">
        <td><code>${fallback.id}</code></td><td>${esc(scope)}</td><td>${badge(statusRecord)}</td>
        <td>source: ${esc(source)} · confidence: ${esc(confidence)}</td>
      </tr>`;
    }).join('');
  }

  function renderMutationGate(data) {
    const flow = flowSnapshot(data).value;
    const gate = unwrap(firstPresent(data.next_mutation_gate, flow && flow.next_mutation_gate));
    const fallback = {
      status: 'HOLD', authority: 'ARIF GO required', canary: 'AF-1 logEvent canary',
      follow_up: 'P1-5 follow-up', fallback: 'local fallback preserved', risk: 'additive-only / low-risk',
    };
    const values = {};
    Object.entries(fallback).forEach(([key, value]) => {
      values[key] = isRecord(gate) && hasOwn(gate, key) ? gate[key] : value;
    });
    const set = (id, key) => {
      const element = $(`#mutation-${id}`);
      if (!element) return;
      element.innerHTML = key === 'status' ? badge(values[key]) : esc(compactValue(values[key]));
      element.dataset.source = isRecord(gate) && hasOwn(gate, key) ? 'snapshot' : 'declared-boundary';
    };
    set('status', 'status');
    set('authority', 'authority');
    set('canary', 'canary');
    set('follow-up', 'follow_up');
    set('fallback', 'fallback');
    set('risk', 'risk');
  }

  /* ── Federation organs ───────────────────────────────────── */
  const organMetadata = {
    arifos: { label: 'arifOS', ring: 'MIND', port: ':8088', role: 'Constitutional Kernel' },
    geox: { label: 'GEOX', ring: 'SOUL', port: ':8081', role: 'Earth Intelligence' },
    wealth: { label: 'WEALTH', ring: 'BODY', port: ':18082', role: 'Capital Intelligence' },
    well: { label: 'WELL', ring: 'SOUL', port: ':18083', role: 'Human Readiness' },
    aaa: { label: 'AAA', ring: 'BODY', port: ':3001', role: 'Control Plane' },
    aforge: { label: 'A-FORGE', ring: 'MIND', port: ':7071/:7072', role: 'Execution Shell' },
    mcpgateway: { label: 'MCP Gateway', ring: 'MIND', port: '', role: 'Canonical Routing' },
    arifflow: { label: 'arifFLOW', ring: 'MIND', port: ':7073', role: 'Receipt Flow Plane' },
  };
  const signalRecord = (organKey, data, signal) => {
    const mappings = {
      LIVENESS: ['liveness', 'transport'],
      READINESS: ['readiness', 'dependency'],
      CAPABILITY: ['capability'],
      GOVERNANCE: ['governance'],
      AUTHORIZATION: ['authorization', 'authority', 'identity'],
      RECEIPT: ['receipt', 'last_receipt'],
      CONSTITUTIONAL: ['constitutional', 'contract'],
    };
    const key = mappings[signal].find((name) => hasOwn(data, name));
    if (key) return data[key];
    if (normalizeKey(organKey) === 'aforge' && signal === 'AUTHORIZATION') {
      return { value: 'requires lease', state: 'limited', source: 'declared boundary', confidence: null };
    }
    return undefined;
  };
  const aggregateSignals = (signals) => {
    const states = signals.map((signal) => semanticState(signal));
    if (states.includes('down')) return 'down';
    if (states.includes('degraded')) return 'degraded';
    if (states.includes('unknown')) return 'unknown';
    return states.length && states.every((state) => state === 'healthy') ? 'healthy' : 'unknown';
  };

  function renderOrgans(data) {
    const organs = unwrap(data.organs);
    const grid = $('#organs-grid');
    if (!grid) return;
    if (!isRecord(organs) || !Object.keys(organs).length) {
      grid.innerHTML = '<div class="observatory-empty">Organ measurements unavailable — source: missing · confidence: unknown</div>';
      return;
    }
    const flow = flowSnapshot(data);
    grid.innerHTML = Object.entries(organs).map(([key, rawData]) => {
      const organ = unwrap(rawData);
      if (!isRecord(organ)) return '';
      const normalized = normalizeKey(key);
      const meta = organMetadata[normalized] || { label: key, ring: 'MIND', port: '', role: UNAVAILABLE };
      const names = ['LIVENESS', 'READINESS', 'CAPABILITY', 'GOVERNANCE', 'AUTHORIZATION', 'RECEIPT', 'CONSTITUTIONAL'];
      const signals = names.map((name) => signalRecord(key, organ, name));
      const overall = aggregateSignals(signals);
      const evidence = organ.evidence;
      const drift = organ.drift;
      const flowMeta = firstPresent(organ.arifFLOW, organ.arifflow, organ.flow);
      return `<article class="organ-card organ-card--${paletteClass(overall)}" data-ring="${meta.ring}" data-organ="${esc(normalized)}" data-overall="${overall}">
        <div class="organ-head"><span class="organ-name">${esc(meta.label)}</span><span class="ring-badge ring-${meta.ring.toLowerCase()}">${meta.ring}</span></div>
        <div class="organ-port">${esc(meta.port || UNAVAILABLE)}</div><div class="organ-role">${esc(meta.role)}</div>
        <div class="organ-signals">${names.map((name, index) => {
          const record = signals[index];
          return `<div class="organ-signal" data-signal="${name}">
            <span class="organ-signal-name">${name}</span><span class="organ-signal-value">${badge(record)}</span>
            <span class="organ-signal-meta">${esc(metadataLine(record, data.observed_at))}</span>
          </div>`;
        }).join('')}</div>
        <div class="organ-facts">
          <span>evidence: ${esc(compactValue(evidence))}</span>
          <span>drift: ${esc(compactValue(drift))}</span>
          <span>arifFLOW: ${esc(flowMeta === undefined ? (flow.value ? 'federation metadata available' : UNAVAILABLE) : compactValue(flowMeta))}</span>
        </div>
      </article>`;
    }).join('');
  }

  /* ── Federation edges + declared flow overlays ──────────── */
  const canonicalNode = (value) => {
    const key = normalizeKey(unwrap(value));
    const names = {
      arifos: 'arifOS', aforge: 'A-FORGE', aaa: 'AAA', geox: 'GEOX', wealth: 'WEALTH',
      well: 'WELL', mcp: 'MCP', mcpgateway: 'MCP', arifflow: 'arifFLOW',
    };
    return names[key] || compactValue(value);
  };
  const flowEdgeOverlays = [
    { source: 'AAA', target: 'arifFLOW', overall: 'SEALED LIVE', telemetry_produced: 'SEALED LIVE', overlay_ref: 'P1-4' },
    { source: 'A-FORGE', target: 'arifFLOW', overall: 'HOLD', telemetry_produced: 'pending', overlay_ref: 'AF-110 / P1-5' },
    { source: 'arifOS', target: 'arifFLOW', overall: 'HOLD', telemetry_produced: 'pending', overlay_ref: 'OS-1' },
  ];
  const edgeKey = (edge) => `${normalizeKey(canonicalNode(edge && edge.source))}>${normalizeKey(canonicalNode(edge && edge.target))}`;
  const mergedEdges = (data) => {
    const federation = unwrap(data.federation_edges);
    const observed = asArray(isRecord(federation) ? federation.edges : federation).filter(isRecord).map((edge) => ({ ...edge, __source: 'snapshot' }));
    const keys = new Set(observed.map(edgeKey));
    const overlays = flowEdgeOverlays.filter((overlay) => !keys.has(edgeKey(overlay))).map((overlay) => ({
      ...overlay,
      __source: `declared overlay ${overlay.overlay_ref}`,
      transport: undefined,
      identity_match: undefined,
      schema_match: undefined,
      session_propagated: undefined,
      actor_propagated: undefined,
      trace_propagated: undefined,
      receipt_produced: undefined,
    }));
    return { observed, all: [...observed, ...overlays] };
  };

  function renderEdges(data) {
    const { observed, all } = mergedEdges(data);
    const graph = $('#edge-graph-wrap');
    const table = $('#edge-table-wrap');
    setText('#edge-count', `${all.length} directed · ${observed.length} observed · ${all.length - observed.length} declared overlays`);
    if (!graph) return;

    const seedNodes = ['arifOS', 'A-FORGE', 'AAA', 'GEOX', 'WEALTH', 'WELL', 'MCP', 'arifFLOW'];
    const dynamicNodes = all.flatMap((edge) => [canonicalNode(edge.source), canonicalNode(edge.target)]).filter((node) => node !== UNAVAILABLE);
    const nodes = [...new Set([...seedNodes, ...dynamicNodes])];
    const width = 680;
    const height = 440;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = 155;
    const step = (2 * Math.PI) / nodes.length;
    const positions = nodes.map((label, index) => ({
      label,
      x: centerX + radius * Math.cos(step * index - Math.PI / 2),
      y: centerY + radius * Math.sin(step * index - Math.PI / 2),
    }));
    const color = (state) => ({ healthy: 'var(--color-verdict-seal, #3ddc97)', degraded: 'var(--color-verdict-partial, #f4b740)', down: 'var(--color-verdict-void, #e5484d)', unknown: 'var(--color-verdict-sabar, #8892a6)' }[semanticState(state)]);
    let svg = `<svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Federation edge graph with arifFLOW" xmlns="http://www.w3.org/2000/svg"><defs><marker id="observatory-arrow" viewBox="0 0 10 10" refX="10" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--color-brand-sovereign, #c9a84c)"/></marker></defs>`;
    all.forEach((edge) => {
      const source = positions.find((position) => position.label === canonicalNode(edge.source));
      const target = positions.find((position) => position.label === canonicalNode(edge.target));
      if (!source || !target) return;
      svg += `<line x1="${source.x}" y1="${source.y}" x2="${target.x}" y2="${target.y}" stroke="${color(edge.overall)}" stroke-width="2" stroke-dasharray="${edge.__source === 'snapshot' ? 'none' : '6 4'}" marker-end="url(#observatory-arrow)" opacity="0.72"/>`;
    });
    positions.forEach((position) => {
      svg += `<circle cx="${position.x}" cy="${position.y}" r="30" fill="var(--surface, #0d0d1a)" stroke="var(--color-brand-sovereign, #c9a84c)" stroke-width="2"/><text x="${position.x}" y="${position.y + 4}" text-anchor="middle" fill="var(--text, #e2d8c8)" font-family="var(--font-mono, monospace)" font-size="9">${esc(position.label)}</text>`;
    });
    graph.innerHTML = `${svg}</svg>`;

    if (!table) return;
    table.innerHTML = `<div class="table-scroll"><table class="drift edge-truth-table"><thead><tr>
      <th>source</th><th>target</th><th>transport</th><th>identity</th><th>contract</th><th>session</th><th>actor</th>
      <th>trace</th><th>receipt</th><th>telemetry_produced</th><th>overall</th><th>truth/source</th>
    </tr></thead><tbody>${all.map((edge) => `<tr data-edge-source="${esc(edge.__source)}">
      <td>${esc(canonicalNode(edge.source))}</td><td>${esc(canonicalNode(edge.target))}</td>
      <td>${badge(edge.transport)}</td><td>${badge(firstPresent(edge.identity_match, edge.identity))}</td>
      <td>${badge(firstPresent(edge.schema_match, edge.contract))}</td><td>${badge(edge.session_propagated)}</td>
      <td>${badge(edge.actor_propagated)}</td><td>${badge(firstPresent(edge.trace_propagated, edge.trace))}</td>
      <td>${badge(firstPresent(edge.receipt_produced, edge.receipt))}</td><td>${badge(edge.telemetry_produced)}</td>
      <td>${badge(edge.overall)}</td><td>${esc(edge.__source)}</td>
    </tr>`).join('')}</tbody></table></div>`;
  }

  /* ── Metabolism, vault, pulse ────────────────────────────── */
  function renderMetabolism(data) {
    const metabolism = asArray(data.metabolism);
    const grid = $('#metab-grid');
    if (!grid) return;
    if (!metabolism.length || (metabolism.length === 1 && isRecord(metabolism[0]) && !Object.keys(metabolism[0]).length)) {
      grid.innerHTML = '<div class="observatory-empty">Metabolism parser loaded / not measured</div>';
      return;
    }
    grid.innerHTML = metabolism.map((stage) => {
      if (!isRecord(stage) || !stage.name) return '';
      const state = recordState(stage, stage.value);
      return `<div class="metab-cell metab-cell--${paletteClass(state)}"><div class="metab-name">${esc(stage.name)}</div>
        <div class="metab-val">${esc(compactValue(firstPresent(stage.value, stage.state)))}</div>
        <div class="metab-meta">${esc(metadataLine(stage, data.observed_at))}</div></div>`;
    }).join('');
  }

  function renderVault(data) {
    const evidence = data.evidence || {};
    const receipts = data.receipts || {};
    const grid = $('#vault-states');
    if (!grid) return;
    const sources = asArray(evidence.sources_used);
    const contradictions = asArray(evidence.contradictions);
    const direct = evidence.direct_vs_inferred && evidence.direct_vs_inferred.direct;
    const inferred = evidence.direct_vs_inferred && evidence.direct_vs_inferred.inferred;
    const fields = [
      ['SOURCES', String(sources.length), sources.length ? 'measured' : 'unknown'],
      ['DIVERSITY', compactValue(evidence.source_diversity), evidence.source_diversity],
      ['CONTRADICTIONS', String(contradictions.length), contradictions.length ? 'measured' : 'unknown'],
      ['DIRECT', compactValue(direct), direct],
      ['INFERRED', compactValue(inferred), inferred],
      ['LAST RECEIPT', compactValue(receipts.last_receipt_tier), receipts.last_receipt_tier],
      ['SEAL CHAIN', compactValue(firstPresent(receipts.seal_chain_seq, receipts.chain_status)), firstPresent(receipts.chain_status, receipts.seal_chain_seq)],
      ['VAULT', compactValue(data.substrate && data.substrate.vault999), data.substrate && data.substrate.vault999],
    ];
    grid.innerHTML = fields.map(([name, value, state]) => `<div class="vocab-cell"><div class="name">${name}</div><div class="val val--${paletteClass(state)}">${esc(value)}</div></div>`).join('');

    const button = $('#vault-test-btn');
    if (button && button.dataset.bound !== 'true') {
      button.dataset.bound = 'true';
      button.addEventListener('click', async (event) => {
        event.preventDefault();
        button.textContent = 'testing…';
        button.style.opacity = '0.5';
        try {
          const response = await fetch(SNAPSHOT_LIVE, { cache: 'no-store' });
          button.textContent = response.ok ? 'snapshot reachable (round-trip OK)' : 'snapshot unavailable';
        } catch (error) {
          console.error('Observatory vault round-trip failed:', error);
          button.textContent = 'snapshot unavailable';
        }
        button.style.opacity = '1';
        setTimeout(() => { button.textContent = 'run round-trip test'; }, 5000);
      });
    }
  }

  function renderPulse(data) {
    const grid = $('#pulse-grid');
    if (!grid) return;
    const organs = unwrap(data.organs) || {};
    const pulse = [
      ['arifOS', 'arifos', 'constitutional'], ['A-FORGE', 'aforge', 'execution'], ['AAA', 'aaa', 'routing'],
      ['GEOX', 'geox', 'earth'], ['WEALTH', 'wealth', 'capital'], ['WELL', 'well', 'human'],
    ];
    grid.innerHTML = pulse.map(([name, key, signal]) => {
      const organKey = isRecord(organs) ? Object.keys(organs).find((candidate) => normalizeKey(candidate) === key) : null;
      const organ = organKey ? unwrap(organs[organKey]) : null;
      const records = isRecord(organ) ? ['transport', 'dependency', 'capability', 'governance', 'identity', 'last_receipt', 'contract'].map((field) => organ[field]) : [];
      const state = aggregateSignals(records);
      return `<div class="pulse-cell pulse-cell--${paletteClass(state)}"><div class="pulse-name">${name}</div><div class="pulse-signal">${signal}</div><div class="pulse-status">${state.toUpperCase()}</div></div>`;
    }).join('');
  }

  /* ── Observatory self-check ──────────────────────────────── */
  function renderSelfCheck(data) {
    const findingsOk = !data || Array.isArray(findingsList(data));
    const capabilities = data && data.capabilities;
    const matrix = capabilities ? asArray(capabilities.matrix) : [];
    const capabilityOk = !data || matrix.length > 0 || unwrap(capabilities && capabilities.declared_count) != null;
    const floors = data ? normalizedFloors(data.governance || {}) : [];
    const floorCount = floors.filter(({ record }) => record !== undefined).length;
    const floorOk = !data || floorCount > 0;
    const freshness = data && data.observed_at ? freshnessValue({ observed_at: data.observed_at }, data.observed_at) : UNAVAILABLE;
    const rows = {
      snapshot: { value: runtime.fetch, state: runtime.fetch, detail: runtime.fetchSource },
      findings: { value: findingsOk ? 'loaded' : 'failed', state: findingsOk ? 'loaded' : 'failed', detail: data ? `${findingsList(data).length} records parsed` : 'not measured' },
      capabilities: { value: capabilityOk ? 'loaded' : 'failed', state: capabilityOk ? 'loaded' : 'failed', detail: data ? `${matrix.length} matrix rows parsed` : 'not measured' },
      floors: { value: floorOk ? 'loaded' : 'failed', state: floorOk ? 'loaded' : 'failed', detail: data ? `${floorCount}/13 records parsed` : 'not measured' },
      render: { value: runtime.render, state: runtime.render, detail: runtime.lastRenderAt || 'not measured' },
      freshness: { value: freshness, state: data && data.observed_at && (Date.now() - new Date(data.observed_at).getTime()) < 120000 ? 'fresh' : 'stale', detail: data && data.observed_at ? data.observed_at : 'source: missing' },
    };
    Object.entries(rows).forEach(([id, row]) => {
      const value = $(`#selfcheck-${id}-value`);
      const detail = $(`#selfcheck-${id}-detail`);
      if (value) value.innerHTML = badge(row.state, row.value);
      if (detail) detail.textContent = row.detail;
    });
  }

  /* ── coordinated render + fetch ──────────────────────────── */
  const renderers = [
    ['now strip', renderNowStrip], ['metadata', renderMeta], ['identity', renderIdentity],
    ['vocabulary', renderVocabulary], ['governance', renderGovernance], ['capabilities', renderDrift],
    ['flow plane', renderFlowPlane], ['P1 receipt federation', renderP1ReceiptFederation],
    ['mutation gate', renderMutationGate], ['organs', renderOrgans], ['edges', renderEdges],
    ['metabolism', renderMetabolism], ['vault', renderVault], ['pulse', renderPulse],
  ];
  function renderAll(data) {
    let failed = false;
    renderers.forEach(([name, renderer]) => {
      try {
        renderer(data);
        runtime.checks[name] = 'loaded';
      } catch (error) {
        failed = true;
        runtime.checks[name] = 'failed';
        console.error(`Observatory ${name} renderer failed:`, error);
      }
    });
    runtime.render = failed ? 'partial' : 'loaded';
    runtime.lastRenderAt = new Date().toISOString();
    renderSelfCheck(data);
  }

  async function fetchSnapshot() {
    try {
      const response = await fetch(SNAPSHOT_MIRROR, { cache: 'no-store' });
      if (!response.ok) throw new Error(`mirror HTTP ${response.status}`);
      runtime.fetchSource = SNAPSHOT_MIRROR;
      return response;
    } catch (mirrorError) {
      console.warn('Observatory mirror unavailable; trying live snapshot:', mirrorError);
      const response = await fetch(SNAPSHOT_LIVE, { cache: 'no-store' });
      if (!response.ok) throw new Error(`live HTTP ${response.status}`);
      runtime.fetchSource = SNAPSHOT_LIVE;
      return response;
    }
  }

  async function loadSnapshot() {
    if (runtime.timer) clearTimeout(runtime.timer);
    try {
      const response = await fetchSnapshot();
      const data = await response.json();
      runtime.fetch = 'loaded';
      document.body.dataset.state = 'loaded';
      document.body.dataset.observedAt = data.observed_at || '';
      document.body.dataset.ageSeconds = data.observed_at ? String(Math.max(0, Math.floor((Date.now() - new Date(data.observed_at).getTime()) / 1000))) : '0';
      document.body.dataset.evidenceClass = unwrap(data.signature && data.signature.algorithm) ? 'signed' : 'reported';
      document.body.dataset.confidence = unwrap(data.signature && data.signature.algorithm) ? '0.99' : '0.85';
      document.body.dataset.freshnessState = data.observed_at && (Date.now() - new Date(data.observed_at).getTime()) < 120000 ? 'fresh' : 'stale';
      renderAll(data);
      runtime.timer = setTimeout(loadSnapshot, REFRESH_MS);
    } catch (error) {
      console.error('Observatory snapshot load failed:', error);
      runtime.fetch = UNAVAILABLE;
      runtime.fetchSource = 'source: missing';
      runtime.render = 'not measured';
      document.body.dataset.state = 'error';
      document.body.dataset.freshnessState = 'unknown';
      setText('#meta-age', 'snapshot unavailable');
      renderSelfCheck(null);
      runtime.timer = setTimeout(loadSnapshot, 10000);
    }
  }

  const api = {
    unwrap, findingsList, compactValue, metadataLine, semanticState, paletteClass,
    effectiveGovernance, normalizedFloors, flowSnapshot, mergedEdges,
    renderAll, renderFlowPlane, renderP1ReceiptFederation, renderMutationGate,
    renderGovernance, renderOrgans, renderEdges, renderSelfCheck, loadSnapshot,
  };
  globalThis.__ARIFOS_OBSERVATORY__ = Object.freeze(api);

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', loadSnapshot);
  else loadSnapshot();
})();
