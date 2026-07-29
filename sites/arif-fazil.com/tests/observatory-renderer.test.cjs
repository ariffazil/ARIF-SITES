const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require('playwright');

const SITE_ROOT = path.resolve(__dirname, '..');
const REPO_ROOT = path.resolve(SITE_ROOT, '../..');
const PAGE_PATH = path.join(SITE_ROOT, 'public/arifos/index.html');
const CANONICAL_PATH = path.join(REPO_ROOT, 'sites/shared/observatory.js');
const ROOT_MIRROR_PATH = path.join(SITE_ROOT, 'public/_shared/observatory.js');
const ARIFOS_MIRROR_PATH = path.join(SITE_ROOT, 'public/arifos/_shared/observatory.js');

const pageSource = fs.readFileSync(PAGE_PATH, 'utf8');
const rendererSource = fs.readFileSync(CANONICAL_PATH, 'utf8');

function envelope(value, state = 'measured', source = 'fixture', confidence = 0.9) {
  return { value, state, source, confidence, observed_at: new Date().toISOString(), age_seconds: 1 };
}

function fixture() {
  const floors = {};
  for (let index = 1; index <= 13; index += 1) {
    floors[`F${index}`] = index === 1
      ? { score: envelope(0.91), status: envelope('PASS') }
      : { status: envelope(index === 13 ? 'active' : 'loaded') };
  }
  return {
    snapshot_id: 'fixture-observatory',
    observed_at: new Date().toISOString(),
    findings: {
      findings: [
        { id: 'F-A', status: envelope('OPEN'), severity: envelope('HOLD') },
        { id: 'F-B', status: envelope('CLOSED'), severity: envelope('INFO') },
      ],
    },
    runtime_identity: {
      source_commit: envelope(null, 'unknown', null, null),
      deployed_commit: envelope(null, 'unknown', null, null),
      build_commit: envelope(null, 'unknown', null, null),
      drift: envelope({ artifact: 'UNKNOWN' }, 'unknown'),
    },
    governance: {
      verdict: envelope('UNKNOWN', 'unknown', 'fixture-judge', 0.72),
      verdict_decomposition: {
        policy: envelope('HOLD', 'blocked', 'fixture-policy', 0.88),
      },
      floors,
    },
    capabilities: {
      declared_count: envelope(1),
      tested_count: envelope(0),
      matrix: envelope([
        { name: 'fixture_tool', declared: envelope(true), registered: envelope(false, 'blocked') },
      ]),
    },
    organs: {
      aforge: {
        transport: envelope('up', 'healthy'),
        identity: envelope('verified', 'healthy'),
        contract: envelope('loaded', 'healthy'),
        capability: envelope('partial', 'degraded'),
        evidence: envelope('reported', 'measured'),
        governance: envelope('HOLD', 'blocked'),
        last_receipt: envelope(null, 'unknown', null, null),
        drift: envelope('UNKNOWN', 'unknown'),
        dependency: envelope('ready', 'healthy'),
      },
    },
    federation_edges: {
      edges: [
        {
          source: 'AAA',
          target: 'arifOS',
          transport: envelope('up', 'healthy'),
          trace_propagated: envelope(true, 'healthy'),
          receipt_produced: envelope(false, 'blocked'),
          telemetry_produced: envelope(false, 'blocked'),
          overall: envelope('HOLD', 'blocked'),
        },
      ],
    },
    evidence: { sources_used: envelope([]), contradictions: envelope([]) },
    receipts: {},
    metabolism: [],
  };
}

test('Observatory source contract is defensive and all tracked copies stay synchronized', () => {
  assert.equal(fs.readFileSync(ROOT_MIRROR_PATH, 'utf8'), rendererSource);
  assert.equal(fs.readFileSync(ARIFOS_MIRROR_PATH, 'utf8'), rendererSource);
  assert.doesNotMatch(rendererSource, /\(d\.findings\s*\|\|\s*\[\]\)\.filter/);
  assert.doesNotMatch(rendererSource, /d\.findings\?\.length/);
  assert.doesNotMatch(rendererSource, /17254|17255/);
  assert.match(rendererSource, /const findingsList =/);
  assert.match(rendererSource, /telemetry_produced/);
  assert.match(rendererSource, /globalThis\.__ARIFOS_OBSERVATORY__/);

  for (const id of [
    'sec-flow-plane',
    'flow-plane-card',
    'p1-receipt-matrix',
    'sec-next-mutation-gate',
    'next-mutation-gate',
    'sec-observatory-self-check',
    'observatory-self-check',
  ]) {
    assert.match(pageSource, new RegExp(`id=["']${id}["']`), `missing required section id ${id}`);
  }
  assert.doesNotMatch(pageSource, /awaiting data/i);
  assert.match(pageSource, /loaded \/ not measured/);
});

test('Observatory renders envelope fixtures without false green or raw error leakage', async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const page = await browser.newPage();
  const browserErrors = [];
  page.on('pageerror', (error) => browserErrors.push(error.message));

  const htmlWithoutScripts = pageSource.replace(/<script\b[\s\S]*?<\/script>/gi, '');
  await page.setContent(htmlWithoutScripts, { waitUntil: 'domcontentloaded' });
  const snapshot = fixture();
  await page.evaluate((data) => {
    window.__fixtureSnapshot = data;
    window.fetch = async () => ({ ok: true, status: 200, json: async () => window.__fixtureSnapshot });
    window.setTimeout = () => 0;
    window.clearTimeout = () => {};
  }, snapshot);
  await page.addScriptTag({ path: CANONICAL_PATH });
  await page.waitForSelector('body[data-state="loaded"]');

  assert.deepEqual(await page.evaluate(() => {
    const api = window.__ARIFOS_OBSERVATORY__;
    return [
      api.findingsList({ findings: [1] }).length,
      api.findingsList({ findings: { findings: [1, 2] } }).length,
      api.findingsList({ findings: { items: [1, 2, 3] } }).length,
      api.findingsList({ findings: { list: [1, 2, 3, 4] } }).length,
    ];
  }), [1, 2, 3, 4]);

  assert.equal(await page.textContent('#meta-findings'), '1');
  assert.equal(await page.textContent('#id-source'), 'unavailable');
  assert.match(await page.textContent('#id-source-note'), /source commit metadata unavailable/);
  assert.match(await page.textContent('#now-governance .val'), /HOLD \(raw UNKNOWN\)/);
  const governanceText = await page.textContent('#governance-decomposition');
  assert.match(governanceText, /policy is HOLD/);
  assert.doesNotMatch(governanceText, /witness\.earth incomplete/);

  assert.equal(await page.textContent('[data-floor="F1"] .floor-score'), '0.91');
  assert.match(await page.textContent('[data-floor="F1"] .floor-status'), /measured/);
  assert.match(await page.textContent('[data-floor="F2"] .floor-status'), /loaded \/ not measured/);
  assert.match(await page.textContent('[data-floor="F13"] .floor-status'), /human authority · not measured/);
  assert.equal(await page.getAttribute('[data-floor="F2"]', 'class'), 'floor-cell floor-cell--grey');
  assert.equal(await page.evaluate(() => window.__ARIFOS_OBSERVATORY__.paletteClass('UNKNOWN')), 'grey');

  assert.match(await page.textContent('#flow-receipts-value'), /unavailable/);
  assert.match(await page.textContent('#flow-fq-value'), /unavailable/);
  assert.match(await page.textContent('#flow-fq-meta'), /source: missing · confidence: unknown · freshness: unavailable/);
  assert.match(await page.textContent('#flow-endpoints-value'), /\/receipt\/emit|\/telemetry\/log/);
  assert.match(await page.textContent('#flow-authority'), /Authority unavailable|arifFLOW observes and anchors receipts/);
  assert.equal(await page.locator('[data-organ="aforge"] .organ-signal').count(), 7);
  assert.notEqual(await page.getAttribute('[data-organ="aforge"]', 'class'), 'organ-card organ-card--green');
  assert.match(await page.textContent('[data-organ="aforge"] [data-signal="AUTHORIZATION"]'), /requires lease|verified/);

  assert.match(await page.textContent('#edge-count'), /4 directed · 1 observed · 3 declared overlays/);
  assert.match(await page.textContent('#edge-graph-wrap'), /arifFLOW/);
  assert.match(await page.textContent('#edge-table-wrap'), /telemetry_produced/);
  assert.equal(await page.locator('#edge-table-wrap tr[data-edge-source^="declared overlay"]').count(), 3);

  await page.evaluate((data) => {
    data.arifFLOW = {
      health: { value: 'healthy', state: 'healthy', source: 'fixture-flow', confidence: 0.99 },
      receipt_count: { value: 42, state: 'measured', source: 'fixture-flow', confidence: 0.99 },
      chain_status: { value: 'VERIFIED', state: 'healthy', source: 'fixture-flow', confidence: 0.99 },
      endpoints: { value: ['/fixture/health'], state: 'measured', source: 'fixture-flow', confidence: 0.99 },
    };
    data.federation_edges.edges.push({
      source: 'AAA', target: 'arifFLOW', overall: { value: 'HOLD', state: 'blocked', source: 'fixture-edge' },
      telemetry_produced: { value: false, state: 'blocked', source: 'fixture-edge' },
    });
    window.__ARIFOS_OBSERVATORY__.renderAll(data);
  }, snapshot);
  assert.equal(await page.textContent('#flow-receipts-value'), '42');
  assert.equal(await page.textContent('#flow-chain-value'), 'VERIFIED');
  assert.equal(await page.locator('#edge-table-wrap tbody tr').evaluateAll((rows) => rows.filter((row) => row.children[0].textContent === 'AAA' && row.children[1].textContent === 'arifFLOW').length), 1);
  assert.match(await page.textContent('#edge-count'), /4 directed · 2 observed · 2 declared overlays/);

  await page.evaluate(() => {
    window.fetch = async () => { throw new Error('TOP_SECRET_RAW_EXCEPTION'); };
  });
  await page.click('#vault-test-btn');
  await page.waitForFunction(() => document.querySelector('#vault-test-btn').textContent === 'snapshot unavailable');
  assert.doesNotMatch(await page.textContent('body'), /TOP_SECRET_RAW_EXCEPTION/);
  assert.deepEqual(browserErrors, []);
});
