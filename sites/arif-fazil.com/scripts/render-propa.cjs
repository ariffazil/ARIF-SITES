#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════════════
// B11 source-first vitals renderer
// ═══════════════════════════════════════════════════════════════════════
// Reads:
//   - public/data/wealth/petronas_vitals.json  (authoritative audited data)
//   - public/propa/index.html                (hand-written template
//                                              with B11-A/B/B/C/D markers)
//
// Writes:
//   - dist/propa/index.html                   (deterministic, idempotent)
//
// Source-first contract: the source HTML is the truth for chrome, layout,
// JavaScript, and prose. The dist is regenerated each build by replacing
// only the B11 marker regions with content derived from the source JSON.
// Running this script twice with no input change produces byte-identical
// output (modulo any source HTML edits).
//
// Markers (stable, idempotent):
//   <!--B11-A:GRID9-MARKER:BEGIN--> ... <!--B11-A:GRID9-MARKER:END-->
//     → exactly 9 static ranked .tripcell rows
//   <!--B11-B:FAN-SVG-MARKER:BEGIN--> ... <!--B11-B:FAN-SVG-MARKER:END-->
//     → accessible static SVG fan-chart fallback (Bull/Base/Bear + tripwire)
//   <!--B11-C:SUMMARY-MARKER:BEGIN--> ... <!--B11-C:SUMMARY-MARKER:END-->
//     → static scenario summary table (key outputs/assumptions, [SPEC])
//   <!--B11-D:JSONLD-MARKER:BEGIN--> ... <!--B11-D:JSONLD-MARKER:END-->
//     → structured reality JSON-LD with display_pulse / pre_lock parity
// ═══════════════════════════════════════════════════════════════════════
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '..');
const SOURCE_JSON = path.join(ROOT, 'public/data/wealth/petronas_vitals.json');
const SOURCE_HTML = path.join(ROOT, 'public/propa/index.html');
const DIST_HTML = path.join(ROOT, 'dist/propa/index.html');

const data = JSON.parse(fs.readFileSync(SOURCE_JSON, 'utf8'));
let html = fs.readFileSync(SOURCE_HTML, 'utf8');

// ──────────────────────────── helpers ────────────────────────────
function score(t) {
  const now = Math.round(t.now * 10) / 10;
  const trip = Math.round(t.trip * 10) / 10;
  const safe = Math.round(t.safe * 10) / 10;
  let s;
  if (t.dir === 'below') s = (now - trip) / (safe - trip) * 100;
  else s = (trip - now) / (trip - safe) * 100;
  return Math.max(0, Math.min(100, Math.round(s * 10) / 10));
}
function isBreached(t) {
  return t.dir === 'below' ? t.now < t.trip : t.now > t.trip;
}
function verdictFor(v, breached) {
  if (breached) return { w: 'BREACHED', c: 'var(--void)' };
  if (v >= 80) return { w: 'SEAL', c: 'var(--seal)' };
  if (v >= 60) return { w: 'SABAR', c: 'var(--sabar)' };
  if (v >= 40) return { w: 'HOLD', c: 'var(--hold)' };
  return { w: 'VOID', c: 'var(--void)' };
}
function escapeAttr(s) {
  return String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function escapeText(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function replaceMarker(src, name, body) {
  const re = new RegExp(`<!--${name}:BEGIN-->[\\s\\S]*?<!--${name}:END-->`, 'g');
  if (!re.test(src)) {
    throw new Error(`render-propa: marker <!--${name}:BEGIN/END--> not found in source HTML`);
  }
  return src.replace(re, `<!--${name}:BEGIN-->\n${body}\n<!--${name}:END-->`);
}

// Ranked order: breached first, then ascending score, then ascending id
const ranked = data.tripwires.slice().sort((a, b) => {
  const ba = isBreached(a);
  const bb = isBreached(b);
  if (ba !== bb) return ba ? -1 : 1;
  return score(a) - score(b) || a.id - b.id;
});
if (ranked.length !== 9) {
  throw new Error(`render-propa: expected 9 tripwires, found ${ranked.length}`);
}

// ──────────────────────────── B11-A: static grid9 ────────────────────────────
const humanLabels = {
  BODY: 'Financial capacity',
  SPINE: 'Operating resilience',
  SOUL: 'Governance & stakeholder balance',
};
let gridHtml = '';
for (const t of ranked) {
  const sc = score(t);
  const b = isBreached(t);
  const v = verdictFor(sc, b);
  const tense = b || sc <= 25 ? ' tense' : '';
  const dir = t.dir === 'below' ? '&lt;' : '>';
  const statusDetail = b
    ? `BREACHED (+${(t.dir === 'above' ? t.now - t.trip : t.trip - t.now).toFixed(1)}${escapeText(t.unit)} over tripwire)`
    : sc <= 25 ? 'LOW MARGIN' : `${sc.toFixed(0)}/100`;
  const epiClass = t.tag === 'EVIDENCE' ? 'EVIDENCE' : t.tag === 'INTERPRET' ? 'INTERPRET' : 'MIXED';
  const breach = b ? ' true' : ' false';
  gridHtml += `<div class="tripcell${tense}" data-id="${t.id}" data-layer="${escapeAttr(t.layer)}" data-score="${sc}" data-verdict="${v.w}" data-breached="${b}" data-now="${escapeAttr(t.now)}" data-trip="${escapeAttr(t.trip)}" data-safe="${escapeAttr(t.safe)}" data-dir="${escapeAttr(t.dir)}" data-tag="${escapeAttr(epiClass)}" data-source="${escapeAttr(t.source)}" data-sealed="${escapeAttr(t.sealed)}">`
    + `<div class="idx mono">#${t.id}</div>`
    + `<div class="title">${escapeText(t.name)}</div>`
    + `<div class="layer">${escapeText(humanLabels[t.layer])} · <span class="epi-tag-small ${escapeAttr(epiClass)}">${escapeText(epiClass)}</span></div>`
    + `<div class="gauge"><div class="gauge-fill" style="width:${sc}%;background:${v.c}"></div><div class="gauge-trip" style="left:2%"></div></div>`
    + `<div class="metrics"><span class="m-now">${escapeText(t.now)}${escapeText(t.unit)}</span><span class="m-trip">trip ${dir}${escapeText(t.trip)}${escapeText(t.unit)}</span><span class="m-safe">safe ${escapeText(t.safe)}${escapeText(t.unit)}</span></div>`
    + `<div class="verdict" style="color:${v.c}">${v.w} · ${statusDetail}</div>`
    + `<div class="seal-date">sealed ${escapeText(t.sealed)} · ${escapeText(t.source)}</div>`
    + `</div>\n`;
}
html = replaceMarker(html, 'B11-A:GRID9-MARKER', gridHtml);

// ──────────────────────────── B11-B: static SVG fan fallback ────────────────────────────
// Same model as the live canvas (XOM cash-flow kit). Deterministic, no I/O.
const YEARS = [2025, 2026, 2027, 2028, 2029, 2030, 2031];
const BASE = { revenue: 266.1, pat: 45.4, cffo: 85.2, capex: 41.6, dividend: 32.0, net_cash_start: 82.8, prefchem_debt: 35.0 };
const PAT_ELASTICITY = [1.00, 1.04, 1.02, 1.00, 0.98, 0.97, 0.96];
const DIVIDEND_CAP_PCT = 0.60;
const MOF_FLOOR = 20.0;
const SENS = { upstream_crude: 1.00, upstream_gas: 0.60, downstream: 0.15, petrochemicals: 0.04, gas_power: 0.20, fx: 0.40 };
const SCEN = {
  BULL: { brent: 95, jkm: 20, henry_hub: 5.0, grm_delta: 5, naphpe_delta: 200, production: 400, lng_export: 30, fx: 4.10 },
  BASE: { brent: 85, jkm: 14, henry_hub: 3.0, grm_delta: 0, naphpe_delta: 0, production: 355, lng_export: 27, fx: 4.10 },
  BEAR: { brent: 55, jkm: 8, henry_hub: 2.0, grm_delta: -3, naphpe_delta: -100, production: 300, lng_export: 24, fx: 4.30 },
};
function patFor(s, idx) {
  const d_brent = s.brent - 85, d_jkm = s.jkm - 14, d_hh = (s.henry_hub - 3) * 10, d_grm = s.grm_delta, d_np = s.naphpe_delta / 100, d_fx = (s.fx - 4.10) * 10;
  const delta = d_brent * SENS.upstream_crude + d_jkm * SENS.upstream_gas + d_grm * SENS.downstream + d_np * SENS.petrochemicals + d_hh * SENS.gas_power + d_fx * SENS.fx;
  return Math.round((BASE.pat + delta) * PAT_ELASTICITY[idx] * 10) / 10;
}
function cffoFor(pat) { return Math.round(pat * (BASE.cffo / BASE.pat) * 10) / 10; }
function capexFor(idx, key) {
  if (key === 'BULL') return Math.round(BASE.capex * (1 + 0.04 * idx) * 10) / 10;
  if (key === 'BEAR') return Math.round(BASE.capex * (1 - 0.03 * idx) * 10) / 10;
  return Math.round(BASE.capex * (1 + 0.01 * idx) * 10) / 10;
}
function divFor(pat) { return Math.round(Math.max(MOF_FLOOR, pat * DIVIDEND_CAP_PCT) * 10) / 10; }
function buildPath(key) {
  const path = [BASE.net_cash_start];
  for (let i = 0; i < YEARS.length - 1; i++) {
    const pat = patFor(SCEN[key], i);
    const cffo = cffoFor(pat);
    const cap = capexFor(i, key);
    const div = divFor(pat);
    let netChange = cffo - cap - div;
    if (i === 0) netChange -= BASE.prefchem_debt;
    path.push(Math.round((path[path.length - 1] + netChange) * 10) / 10);
  }
  return path;
}
const nBull = buildPath('BULL');
const nBase = buildPath('BASE');
const nBear = buildPath('BEAR');
function firstCross(arr) { for (let i = 1; i < arr.length; i++) if (arr[i] < 0) return YEARS[i]; return null; }

const SVG_W = 1040, SVG_H = 320, SVG_PAD = 50;
const allVals = [...nBull, ...nBase, ...nBear, 90, -90];
const smax = Math.max(...allVals), smin = Math.min(...allVals);
const sx = i => SVG_PAD + (SVG_W - SVG_PAD * 1.6) * i / (YEARS.length - 1);
const sy = v => SVG_PAD / 2 + (SVG_H - SVG_PAD * 1.5) * (smax - v) / (smax - smin);

let pathBull = '', pathBase = '', pathBear = '';
for (let i = 0; i < YEARS.length; i++) {
  const cmd = i === 0 ? 'M' : 'L';
  pathBull += `${cmd}${sx(i).toFixed(1)},${sy(nBull[i]).toFixed(1)} `;
  pathBase += `${cmd}${sx(i).toFixed(1)},${sy(nBase[i]).toFixed(1)} `;
  pathBear += `${cmd}${sx(i).toFixed(1)},${sy(nBear[i]).toFixed(1)} `;
}
let fanPolygon = `M${sx(0)},${sy(nBull[0])} `;
for (let i = 1; i < YEARS.length; i++) fanPolygon += `L${sx(i).toFixed(1)},${sy(nBull[i]).toFixed(1)} `;
for (let i = YEARS.length - 1; i >= 0; i--) fanPolygon += `L${sx(i).toFixed(1)},${sy(nBear[i]).toFixed(1)} `;
fanPolygon += 'Z';

const yearLabels = YEARS.map((y, i) => `<text x="${sx(i).toFixed(1)}" y="${(SVG_H - SVG_PAD + 16).toFixed(1)}" text-anchor="middle" font-family="monospace" font-size="11" fill="#5a6675">${y}</text>`).join('');
const gridLines = Array.from({ length: 6 }, (_, s) => {
  const v = smax - (smax - smin) * s / 5, yy = sy(v);
  return `<line x1="${SVG_PAD}" y1="${yy.toFixed(1)}" x2="${(SVG_W - SVG_PAD * 0.4).toFixed(1)}" y2="${yy.toFixed(1)}" stroke="#1f2733" stroke-width="1"/>` +
    `<text x="4" y="${(yy + 4).toFixed(1)}" font-family="monospace" font-size="10" fill="#5a6675">${Math.round(v)}B</text>`;
}).join('');
const fanSvg = `<div class="fan-fallback" data-agent-role="fan-fallback-static" aria-label="Net-cash fan chart — Bull, Base, Bear paths 2025–2031 — non-scoring [SPEC]">`
  + `<svg id="fan-svg" viewBox="0 0 ${SVG_W} ${SVG_H}" role="img" width="${SVG_W}" height="${SVG_H}" preserveAspectRatio="xMidYMid meet" style="width:100%;max-width:1040px;height:auto;display:block;margin-top:8px;background:var(--surface2,#0b1018);border:1px solid var(--line,#1f2733);border-radius:6px">`
  + `<title>Net-cash scenarios 2025–2031 — Bull / Base / Bear (non-scoring [SPEC])</title>`
  + `<desc>Static SVG fan-chart fallback rendered from sealed audited inputs. Canvas enhancement is non-essential; this SVG is the no-JS truth.</desc>`
  + gridLines
  + yearLabels
  + `<path d="${fanPolygon}" fill="rgba(74,168,255,0.09)" stroke="none"/>`
  + `<line x1="${SVG_PAD}" y1="${sy(0).toFixed(1)}" x2="${(SVG_W - SVG_PAD * 0.4).toFixed(1)}" y2="${sy(0).toFixed(1)}" stroke="rgba(240,80,110,0.5)" stroke-width="1.5" stroke-dasharray="6 4"/>`
  + `<text x="${(SVG_PAD + 4).toFixed(1)}" y="${(sy(0) - 6).toFixed(1)}" font-family="monospace" font-size="10" fill="#f0506e">NET-DEBT TRIPWIRE (0)</text>`
  + `<path d="${pathBull.trim()}" fill="none" stroke="#31c48d" stroke-width="2"/>`
  + `<path d="${pathBase.trim()}" fill="none" stroke="#4aa8ff" stroke-width="2.5"/>`
  + `<path d="${pathBear.trim()}" fill="none" stroke="#f0506e" stroke-width="2"/>`
  + nBull.map((v, i) => `<circle cx="${sx(i).toFixed(1)}" cy="${sy(v).toFixed(1)}" r="2.5" fill="#31c48d"/>`).join('')
  + nBase.map((v, i) => `<circle cx="${sx(i).toFixed(1)}" cy="${sy(v).toFixed(1)}" r="2.5" fill="#4aa8ff"/>`).join('')
  + nBear.map((v, i) => `<circle cx="${sx(i).toFixed(1)}" cy="${sy(v).toFixed(1)}" r="2.5" fill="#f0506e"/>`).join('')
  + `<text x="${SVG_PAD}" y="${(SVG_PAD / 2 - 12).toFixed(1)}" font-family="monospace" font-size="11" fill="#7a8698">RM B · net cash · Bull (Brent $95) / Base ($85) / Bear ($55) · [SPEC] non-scoring</text>`
  + `</svg>`
  + `<div class="fan-legend fan-legend-static" aria-label="Fan chart legend">`
  + `<span><i style="background:#31c48d"></i>Bull (Brent $95 / JKM $20 / HH $5)</span>`
  + `<span><i style="background:#4aa8ff"></i>Base (Brent $85 / JKM $14 / HH $3)</span>`
  + `<span><i style="background:#f0506e"></i>Bear (Brent $55 / JKM $8 / HH $2)</span>`
  + `<span><i style="background:#f0506e;opacity:.5"></i>Net-debt tripwire (0)</span>`
  + `<span style="color:var(--void,#f0506e)">[SPEC] non-scoring · modeled after ExxonMobil IR cash-flow kit</span>`
  + `</div>`
  + `</div>`;
html = replaceMarker(html, 'B11-B:FAN-SVG-MARKER', fanSvg);

// ──────────────────────────── B11-C: static scenario summary ────────────────────────────
const scenRows = [
  { lab: 'Brent crude (USD/bbl)', k: 'brent', src: "Moody's / forward curve" },
  { lab: 'JKM LNG (USD/MMBtu)', k: 'jkm', src: 'Platts Asia LNG' },
  { lab: 'Henry Hub gas (USD/MMBtu)', k: 'henry_hub', src: 'NYMEX forward' },
  { lab: 'USD/MYR', k: 'fx', src: 'BNM benchmark' },
  { lab: 'Singapore GRM delta ($/bbl)', k: 'grm_delta', src: 'FY25 disclosure' },
  { lab: 'Naphtha-PE spread delta ($/T)', k: 'naphpe_delta', src: 'PRefChem commissioning' },
];
let summaryTable = `<table class="data-table b11-static-summary" data-agent-role="scenario-summary-static" style="font-size:.7rem;width:100%;margin-top:6px">`
  + `<caption class="b11-caption" style="font-family:var(--mono);font-size:.65rem;color:var(--faint);text-align:left;padding:6px 0">Static scenario summary · key outputs/assumptions · <span style="color:var(--void,#f0506e)">[SPEC]</span> non-scoring — audited IFR FY2025 remains the sole scoring input</caption>`
  + `<thead><tr><th>Macro driver</th><th style="color:#31c48d">Bull</th><th style="color:#4aa8ff">Base</th><th style="color:#f0506e">Bear</th><th>Source</th></tr></thead>`
  + `<tbody>`;
summaryTable += `<tr><td>Year-1 PAT (RM B)</td>`
  + `<td class="num">${patFor(SCEN.BULL, 0).toFixed(1)}</td>`
  + `<td class="num">${patFor(SCEN.BASE, 0).toFixed(1)}</td>`
  + `<td class="num">${patFor(SCEN.BEAR, 0).toFixed(1)}</td>`
  + `<td>ExxonMobil IR cash-flow model</td></tr>`;
summaryTable += `<tr><td>Year-1 CFFO (RM B)</td>`
  + `<td class="num">${cffoFor(patFor(SCEN.BULL, 0)).toFixed(1)}</td>`
  + `<td class="num">${cffoFor(patFor(SCEN.BASE, 0)).toFixed(1)}</td>`
  + `<td class="num">${cffoFor(patFor(SCEN.BEAR, 0)).toFixed(1)}</td>`
  + `<td>CFFO ≈ PAT × 1.88 (FY25 ratio)</td></tr>`;
summaryTable += `<tr><td>Year-1 FCF post capex+div (RM B)</td>`
  + `<td class="num">${(cffoFor(patFor(SCEN.BULL, 0)) - capexFor(0, 'BULL') - divFor(patFor(SCEN.BULL, 0))).toFixed(1)}</td>`
  + `<td class="num">${(cffoFor(patFor(SCEN.BASE, 0)) - capexFor(0, 'BASE') - divFor(patFor(SCEN.BASE, 0))).toFixed(1)}</td>`
  + `<td class="num">${(cffoFor(patFor(SCEN.BEAR, 0)) - capexFor(0, 'BEAR') - divFor(patFor(SCEN.BEAR, 0))).toFixed(1)}</td>`
  + `<td>Net of capex + dividend (60% cap per AMEND-2026-08-03-001)</td></tr>`;
summaryTable += `<tr><td>Net-debt crossover (year)</td>`
  + `<td class="num">${escapeText(String(firstCross(nBull) || 'none <2031'))}</td>`
  + `<td class="num">${escapeText(String(firstCross(nBase) || 'none <2031'))}</td>`
  + `<td class="num">${escapeText(String(firstCross(nBear) || 'none <2031'))}</td>`
  + `<td>First year net-cash &lt; 0</td></tr>`;
for (const r of scenRows) {
  const v = k => SCEN[k][r.k];
  summaryTable += `<tr><td>${escapeText(r.lab)}</td>`
    + `<td class="num">${v('BULL')}</td>`
    + `<td class="num">${v('BASE')}</td>`
    + `<td class="num">${v('BEAR')}</td>`
    + `<td>${escapeText(r.src)}</td></tr>`;
}
summaryTable += `</tbody></table>`;
html = replaceMarker(html, 'B11-C:SUMMARY-MARKER', summaryTable);

// ──────────────────────────── B11-D: JSON-LD with parity ────────────────────────────
const indicatorArr = data.tripwires.map((t) => {
  const sc = score(t);
  const b = isBreached(t);
  const epiClass = t.tag === 'EVIDENCE' ? 'EVIDENCE' : t.tag === 'INTERPRET' ? 'INTERPRET' : 'MIXED';
  return {
    id: t.id,
    name: t.name,
    layer: t.layer,
    now: t.now,
    trip: t.trip,
    safe: t.safe,
    unit: t.unit,
    dir: t.dir,
    score: sc,
    verdict: verdictFor(sc, b).w,
    breached: b,
    epistemic_class: epiClass,
    source: t.source,
    sealed: t.sealed,
  };
});
const locked = data.extraction_crisis_lock && data.extraction_crisis_lock.state === 'ENGAGED';
const computedPulse = Math.round((data.layers.BODY.score * 0.40 + data.layers.SPINE.score * 0.35 + data.layers.SOUL.score * 0.25) * 10) / 10;
const displayPulse = locked ? 0 : computedPulse;
const displayVerdict = locked ? 'VOID' : (displayPulse >= 80 ? 'SEAL' : displayPulse >= 60 ? 'SABAR' : displayPulse >= 40 ? 'HOLD' : 'VOID');
const preLockPulse = (data.pulse_pre_lock !== undefined ? data.pulse_pre_lock : (data.pulse_verdict_pre_lock === 'HOLD' ? 48 : null));
const preLockVerdict = data.pulse_verdict_pre_lock || 'HOLD';
const allSeals = new Set(indicatorArr.map((i) => i.sealed));
const sourceSeal = allSeals.size === 1 ? [...allSeals][0] : 'mixed';

const jsonLd = {
  '@context': 'https://arif-fazil.com/schemas/v1/EconomicsContext.jsonld',
  '@type': 'InstitutionalVitals',
  'organ': data.organ,
  'timestamp': `${data.reseal_date || '2026-08-03'}T16:45:00+08:00`,
  'url': 'https://arif-fazil.com/propa/',
  'canonical_source_url': 'https://arif-fazil.com/propa/',
  'as_of': data.reseal_date || '2026-08-03',
  'seal_date': data.reseal_date || '2026-08-03',
  'source_seal': sourceSeal,
  'next_audit': data.next_audit || '2026-11-03',
  'constitutional_amendment': data.extraction_crisis_lock?.constitutional_amendment_id || 'AMEND-2026-08-03-001',
  'extraction_crisis_lock': locked ? 'ENGAGED' : 'CLEAR',
  'epistemic_tier': displayVerdict,
  // B11-D canonical: display values are what users see. Pre-lock values are
  // historical facts, not active state.
  'display_pulse': displayPulse,
  'display_verdict': displayVerdict,
  'composite_pulse': displayPulse,
  'verdict': displayVerdict,
  'pre_lock_pulse': preLockPulse,
  'pre_lock_verdict': preLockVerdict,
  'composite_pulse_pre_lock': preLockPulse,
  'verdict_pre_lock': preLockVerdict,
  'lock_basis': locked ? 'sovereign_extraction 70.5% > 65% pacemaker threshold' : null,
  'f13_sovereign_veto': 'FINAL',
  // FY2026 [DEC] is declared (not audited) — must not feed scoring
  'fy2026_declared_state': {
    'epistemic_class': '[DEC]',
    'feeds_scoring': false,
    'summary': 'FY2026 board-approved RM20B dividend (38% cut) + RM45-50B capex guidance + ~2 MMboe/d target. Excluded from sealed tripwire scores; audited IFR FY2025 remains the sole scoring input.',
    'as_of_date': '2026-02-27',
  },
  'weights': data.weights,
  'indicators': indicatorArr,
  'static_row_count': indicatorArr.length,
  'static_row_parity': {
    'source_json': 'public/data/wealth/petronas_vitals.json',
    'rows_match_grid9': true,
    'row_count_equals_tripwire_count': indicatorArr.length === data.tripwires.length,
  },
  'scoring_input': 'audited IFR FY2025 only — FY2026 [DEC] is non-scoring per B11-D contract',
  'source': 'sealed tripwire inputs (audited IFR FY2025)',
};
const jsonLdBlock = `<script type="application/ld+json" data-agent-role="institutional-vitals-reality">\n${JSON.stringify(jsonLd, null, 2)}\n</script>`;
html = replaceMarker(html, 'B11-D:JSONLD-MARKER', jsonLdBlock);

// ──────────────────────────── B11-E: recent events panel (additive) ────────────────────────────
let recentEventsHtml = '';
if (Array.isArray(data.recent_events) && data.recent_events.length > 0) {
  const meta = data.recent_events_meta || {};
  const title = meta.panel_title || 'Recent Events';
  const subtitle = meta.panel_subtitle || '';
  const updated = meta.last_updated || '';
  const events = data.recent_events;
  const eff_class_color = {
    capital_recycling:    '#d4a017',
    exploration_writeoff: '#e0483e',
    forward_commitment:   '#4aa8ff',
    growth_signal:        '#4ea77d',
    default:              '#8a8378',
  };
  const rows = events.map((e) => {
    const c = eff_class_color[e.effect_class] || eff_class_color.default;
    const usd = (typeof e.effect_usd_m === 'number')
      ? (e.effect_usd_m === 0 ? 'neutral' : (e.effect_usd_m > 0 ? '+US$' + e.effect_usd_m + 'M' : '−US$' + Math.abs(e.effect_usd_m) + 'M'))
      : '—';
    return '<div class="evt-row" data-effect="' + escapeAttr(e.effect_class) + '" data-id="' + escapeAttr(e.id) + '">' +
      '<div class="evt-date mono">' + escapeText(e.date) + '</div>' +
      '<div class="evt-body">' +
      '<div class="evt-title">' + escapeText(e.title) + '</div>' +
      '<div class="evt-meta mono">' +
      '<span class="evt-tag" style="background:' + c + ';color:#0a0a08">' + escapeText(e.effect_class) + '</span>' +
      '<span class="evt-tag evt-tag-obs">OBS</span>' +
      '<span class="evt-usd mono" style="color:' + c + '">' + escapeText(usd) + '</span>' +
      '</div>' +
      (e.note ? '<div class="evt-note">' + escapeText(e.note) + '</div>' : '') +
      '<div class="evt-source mono">source: ' + escapeText(e.source) + '</div>' +
      '</div></div>';
  }).join('\n');
  recentEventsHtml = '<section class="recent-events-panel" id="recentEvents" data-agent-role="recent-events-additive" data-version="1.4.0-event-tracker-001">' +
    '<div class="re-head">' +
    '<span class="re-badge">' + escapeText(title) + '</span>' +
    '<span class="re-meta mono">' + escapeText(subtitle) + '</span>' +
    (updated ? '<span class="re-time mono">updated ' + escapeText(updated) + '</span>' : '') +
    '</div>' +
    '<div class="re-list">' + rows + '</div>' +
    '<p class="re-foot mono">' +
    '<strong>Read in context, not as override.</strong> PULSE · 9 tripwires · AMEND-2026-08-03-001 (60% dividend cap) — all unchanged. ' +
    'Composite re-seal requires new audited inputs ([EVIDENCE]); these events are [OBS] metadata, not constitutional inputs.' +
    '</p>' +
    '</section>';
}
html = replaceMarker(html, 'B11-E:RECENT-EVENTS-MARKER', recentEventsHtml);

// ──────────────────────────── write dist ────────────────────────────
fs.mkdirSync(path.dirname(DIST_HTML), { recursive: true });
fs.writeFileSync(DIST_HTML, html, 'utf8');
console.log(`render-propa: wrote ${path.relative(ROOT, DIST_HTML)} (${html.length} bytes; ${ranked.length} rows; SVG ${SVG_W}x${SVG_H}; seal ${data.reseal_date || '2026-08-03'})`);
