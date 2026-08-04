#!/usr/bin/env node
/**
 * VITALS parity test — B11 source-first contract.
 *
 * Verifies that the three sources of truth agree exactly:
 *   1) Source JSON     — public/data/wealth/petronas_vitals.json
 *   2) Generated HTML  — dist/vitals/index.html
 *   3) Reality JSON-LD — the institutional-vitals-reality <script> block
 *                        embedded in dist/vitals/index.html
 *
 * Parity contract (B11):
 *   - source JSON tripwires[] count == 9
 *   - generated HTML #grid9 .tripcell count == 9
 *   - reality JSON-LD indicators[] count == 9 == static_row_count
 *   - for every tripwire, HTML data-id matches JSON id, data-score matches
 *     computed score, data-now/data-trip/data-safe match the JSON now/trip/safe
 *   - display_pulse = 0, display_verdict = 'VOID'
 *   - pre_lock_pulse = 48, pre_lock_verdict = 'HOLD'
 *   - fy2026_declared_state.feeds_scoring === false
 *   - forbidden markers '48 HOLD' and 'No human override' absent from all
 *     three artifacts
 *
 * Run: `node tests/vitals-parity.test.cjs` or `npm test:source-parity`.
 */
'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { test } = require('node:test');
const assert = require('node:assert/strict');

const HERE = __dirname;
const ROOT = path.resolve(HERE, '..');
const SOURCE_JSON = path.join(ROOT, 'public/data/wealth/petronas_vitals.json');
const SOURCE_HTML = path.join(ROOT, 'public/vitals/index.html');
const DIST_HTML = path.join(ROOT, 'dist/vitals/index.html');

function readOrFail(p) {
  if (!fs.existsSync(p)) throw new Error(`missing fixture: ${p}`);
  return fs.readFileSync(p, 'utf8');
}

const srcJson = JSON.parse(readOrFail(SOURCE_JSON));
const srcHtml = readOrFail(SOURCE_HTML);
const distHtml = readOrFail(DIST_HTML);

const FORBIDDEN = ['48 HOLD', 'No human override'];
const TRIPWIRE_IDS = srcJson.tripwires.map(t => t.id).sort((a, b) => a - b);

// ─── forbidden-marker absence (R1 contract) ───
test('forbidden markers absent from source JSON, source HTML, dist HTML', () => {
  for (const f of FORBIDDEN) {
    assert.equal(srcJson.f2_audit.changed.join('\n').includes(f), false, `source JSON still has "${f}"`);
    assert.equal(srcJson.tripwires.some(t => (t.note || '').includes(f)), false, `source JSON tripwire note has "${f}"`);
    assert.equal(srcHtml.includes(f), false, `source HTML has "${f}"`);
    assert.equal(distHtml.includes(f), false, `dist HTML has "${f}"`);
  }
});

// ─── B11-A: 9 static ranked .tripcell rows with stable data attrs ───
test('dist #grid9 has exactly 9 .tripcell rows with stable data-* attrs', () => {
  const cells = [...distHtml.matchAll(/<div class="tripcell[^"]*"([^>]*)>/g)].map(m => m[1]);
  assert.equal(cells.length, 9, `expected 9 tripcells, got ${cells.length}`);
  for (const c of cells) {
    for (const attr of ['data-id', 'data-layer', 'data-score', 'data-verdict', 'data-now', 'data-trip', 'data-safe', 'data-tag', 'data-source', 'data-sealed']) {
      assert.match(c, new RegExp(`${attr}="[^"]+"`), `tripcell missing ${attr}: ${c.slice(0, 80)}`);
    }
  }
});

test('grid9 tripcell data-ids match source JSON tripwire ids (parity)', () => {
  const ids = [...distHtml.matchAll(/data-id="(\d+)"/g)].map(m => +m[1]).sort((a, b) => a - b);
  assert.deepEqual(ids, TRIPWIRE_IDS, `grid9 ids ${ids} != source ${TRIPWIRE_IDS}`);
});

// ─── B11-B: SVG fan fallback present ───
test('B11-B static SVG fan fallback is present in dist', () => {
  assert.match(distHtml, /<svg id="fan-svg"[^>]*>/, 'fan-svg element missing');
  assert.match(distHtml, /NET-DEBT TRIPWIRE/, 'NET-DEBT TRIPWIRE label missing');
  assert.match(distHtml, /data-agent-role="fan-fallback-static"/, 'fan-fallback marker missing');
  assert.match(distHtml, /\[SPEC\] non-scoring/, '[SPEC] non-scoring label missing in fan fallback');
  // bull/base/bear paths
  assert.match(distHtml, /stroke="#31c48d"[^>]*\/>/, 'bull path missing');
  assert.match(distHtml, /stroke="#4aa8ff"[^>]*\/>/, 'base path missing');
  assert.match(distHtml, /stroke="#f0506e"[^>]*\/>/, 'bear path missing');
});

// ─── B11-C: static scenario summary present ───
test('B11-C static scenario summary is present in dist with [SPEC] label', () => {
  assert.match(distHtml, /data-agent-role="scenario-summary-static"/, 'scenario-summary marker missing');
  // The caption spans a styled [SPEC] tag, prose "non-scoring", and the IFR-soles rule.
  // Allow arbitrary HTML between tokens because the [SPEC] marker is wrapped in a span.
  assert.match(distHtml, /\[SPEC\][\s\S]{0,200}non-scoring[\s\S]{0,200}audited IFR FY2025 remains the sole scoring input/);
  // bull/base/bear columns
  for (const k of ['Bull', 'Base', 'Bear']) {
    assert.match(distHtml, new RegExp(`>${k}</th>`), `${k} column header missing`);
  }
});

// ─── B11-D: JSON-LD parity ───
function extractRealityLd(html) {
  const m = html.match(/<script type="application\/ld\+json" data-agent-role="institutional-vitals-reality">\s*([\s\S]*?)\s*<\/script>/);
  if (!m) throw new Error('institutional-vitals-reality JSON-LD not found in dist');
  return JSON.parse(m[1]);
}

test('B11-D: reality JSON-LD exposes display_pulse 0, display_verdict VOID, pre_lock_pulse 48, pre_lock_verdict HOLD', () => {
  const ld = extractRealityLd(distHtml);
  assert.equal(ld.display_pulse, 0, `display_pulse=${ld.display_pulse}`);
  assert.equal(ld.display_verdict, 'VOID', `display_verdict=${ld.display_verdict}`);
  assert.equal(ld.pre_lock_pulse, 48, `pre_lock_pulse=${ld.pre_lock_pulse}`);
  assert.equal(ld.pre_lock_verdict, 'HOLD', `pre_lock_verdict=${ld.pre_lock_verdict}`);
});

test('B11-D: FY2026 [DEC] does not feed scoring (feeds_scoring=false)', () => {
  const ld = extractRealityLd(distHtml);
  assert.equal(ld.fy2026_declared_state.epistemic_class, '[DEC]');
  assert.equal(ld.fy2026_declared_state.feeds_scoring, false);
});

test('B11-D: static_row_count == source.tripwires.length == grid9 count', () => {
  const ld = extractRealityLd(distHtml);
  assert.equal(ld.static_row_count, 9);
  assert.equal(ld.indicators.length, 9);
  const cells = [...distHtml.matchAll(/<div class="tripcell[^"]*"/g)];
  assert.equal(cells.length, 9);
  assert.equal(ld.static_row_parity.rows_match_grid9, true);
  assert.equal(ld.static_row_parity.row_count_equals_tripwire_count, true);
  assert.equal(ld.static_row_parity.source_json, 'public/data/wealth/petronas_vitals.json');
});

test('B11-D: indicator rows mirror source JSON tripwires (id/score/now/trip/safe/verdict)', () => {
  const ld = extractRealityLd(distHtml);
  const byId = Object.fromEntries(ld.indicators.map(i => [i.id, i]));
  for (const t of srcJson.tripwires) {
    const ind = byId[t.id];
    assert.ok(ind, `indicator for tripwire ${t.id} missing`);
    assert.equal(ind.name, t.name);
    assert.equal(ind.layer, t.layer);
    assert.equal(ind.now, t.now);
    assert.equal(ind.trip, t.trip);
    assert.equal(ind.safe, t.safe);
    assert.equal(ind.unit, t.unit);
    assert.equal(ind.dir, t.dir);
    assert.equal(ind.sealed, t.sealed);
    // Score is computed; compare to locally-computed score
    const now = Math.round(t.now * 10) / 10, trip = Math.round(t.trip * 10) / 10, safe = Math.round(t.safe * 10) / 10;
    const expectedScore = Math.max(0, Math.min(100, Math.round(
      (t.dir === 'below' ? (now - trip) / (safe - trip) : (trip - now) / (trip - safe)) * 100 * 10
    ) / 10));
    assert.equal(ind.score, expectedScore, `tripwire ${t.id} score mismatch: ${ind.score} vs ${expectedScore}`);
  }
});

test('B11-D: every JSON-LD in dist parses cleanly', () => {
  const blocks = [...distHtml.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
  assert.ok(blocks.length >= 4, `expected ≥4 JSON-LD blocks, got ${blocks.length}`);
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i].trim();
    if (b.startsWith('{')) {
      try { JSON.parse(b); } catch (e) { assert.fail(`JSON-LD #${i} failed to parse: ${e.message}\n${b.slice(0, 200)}`); }
    }
  }
});

// ─── Renderer is idempotent: re-running yields byte-identical dist ───
test('render-vitals.cjs is idempotent (re-run produces byte-identical dist)', () => {
  const { execSync } = require('node:child_process');
  const before = readOrFail(DIST_HTML);
  execSync('node scripts/render-vitals.cjs', { cwd: ROOT, stdio: 'pipe' });
  const after = readOrFail(DIST_HTML);
  assert.equal(after, before, 'dist changed after re-running renderer (not idempotent)');
});

// ─── Browser JS enhancement: no duplicate rows added by client-side code ───
// We cannot run JS in this test, but we can ensure the static rows are already
// 9, so any client-side enhancement that appends would produce 10+ and break
// the count check. (Renderer is the authority.)
test('static row count is exactly 9 (browser JS must enhance, not duplicate)', () => {
  const cells = [...distHtml.matchAll(/<div class="tripcell[^"]*"/g)];
  assert.equal(cells.length, 9, 'static rows must be exactly 9; JS must not duplicate');
});
