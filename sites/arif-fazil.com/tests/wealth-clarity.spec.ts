/**
 * WEALTH clarity suite — gold/oil/gas (Vite preview :4173) + vitals/malaysia
 * (static server :4174 rooted at ../wealth.arif-fazil.com).
 *
 * Determinism contract:
 *  - All commodity API calls (`/wealth/<asset>/api/*`, `/wealth/gold/api/proxies`)
 *    are intercepted with schema-correct fixtures. No live WEALTH service is touched.
 *  - `/_shared/economics.css` is fulfilled from /root/arif-sites/sites/shared/economics.css
 *    (it lives outside both web roots, so both servers 404 it natively).
 *  - The lightweight-charts CDN script is fulfilled from a vendored copy in this
 *    directory so chart-dependent rendering (forecast cone, prediction card) is
 *    network-independent. Google Fonts are aborted (cosmetic only).
 *
 * Tests only — no production page is modified by this file.
 */
import { test, expect, type Page, type Route } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MAIN = 'http://127.0.0.1:4173';
const WEALTH = 'http://127.0.0.1:4174';
const SHARED_CSS = '/root/arif-sites/sites/shared/economics.css';
const CHART_JS = path.join(HERE, 'lightweight-charts.standalone.js');

const FORBIDDEN_TEXT = [
  'SENSE111',
  '777_FORGE',
  '888_JUDGE',
  'Marginal R:R',
  'Loading live',
  'PULSE_REPLACE',
  'shadow sovereign balance sheet',
];

// ────────────────────────────────────────────────────────────────────────────
// Fixture builders (schema-correct per the page renderers)
// ────────────────────────────────────────────────────────────────────────────

type Asset = 'gold' | 'oil' | 'gas';

const ASSET_META: Record<Asset, { symbol: string; price: number }> = {
  gold: { symbol: 'XAUUSD', price: 2412.35 },
  oil: { symbol: 'BRENT', price: 85.42 },
  gas: { symbol: 'NG', price: 3.418 },
};

interface SnapshotOverrides {
  emaTrend?: string;
  priceAboveResistance?: boolean;
}

function snapshotFixture(asset: Asset, overrides: SnapshotOverrides = {}) {
  const { symbol, price } = ASSET_META[asset];
  const support = [price - 22.35, price - 48.35];
  let resistance = [price + 7.65, price + 27.65];
  let finalPrice = price;
  if (overrides.priceAboveResistance) {
    // Conflict fixture: price above R1 while emaTrend says BEARISH
    resistance = [price - 10, price - 2];
  }
  return {
    schema: 'wealth.snapshot.v1',
    asset, // must equal CONFIG.ASSET in the page
    observed_at: new Date().toISOString(),
    coherence_id: 'e2e-coherence-0001',
    ticker: {
      symbol,
      price: finalPrice,
      change: 12.3,
      changePct: 0.51,
      emaTrend: overrides.emaTrend ?? 'BULLISH',
      rsi: 58.2,
      rsiState: 'NEUTRAL',
      ema20: price - 8,
      ema50: price - 16,
      ema200: price - 60,
    },
    levels: { support, resistance },
    macro: {
      dxy: 104.25, dxy_change: -0.12,
      us10y: 4.21, us10y_change: 0.03,
      vix: 15.62, vix_change: -0.38,
      silver: 31.24, silver_change: 0.22,
      gsr: 76.9, gsr_change: -0.4,
      usmyr: 4.213, usmyr_change: 0.002,
    },
  };
}

function apexFixture() {
  return {
    G: 0.62,
    C_dark: 0.12,
    dS: 0.08,
    state: 'CLARITY',
    direction: 'Bearish', // → apexDirection "Bearish · <TF>"
    verdict: 'SABAR',
    confidence: 0.71,
    apex: { A: 0.7, P: 0.66, E: 0.6, X: 0.58, Phi: 0.69 },
    momentum: 0.014,
    volume_trend: 'rising',
  };
}

interface SignalOverrides {
  direction?: string;
  verdict?: string;
  rr?: number | null;
}

function signalFixture(overrides: SignalOverrides = {}) {
  return {
    signal: {
      direction: overrides.direction ?? 'LONG',
      verdict: overrides.verdict ?? 'SEAL',
      rr_ratio: overrides.rr === undefined ? 2.3 : overrides.rr,
      confluence_score: 0.74,
      confidence_level: 'HIGH',
      strength: 'STRONG',
      judge_reason: 'F2: evidence aligned; confluence strong',
    },
    regime: { regime: 'UPTREND', confidence: 0.82 },
  };
}

function forecastFixture(asset: Asset) {
  const { price } = ASSET_META[asset];
  const coneDates = Array.from({ length: 30 }, (_, i) =>
    new Date(Date.UTC(2026, 6, 25 + i)).toISOString().slice(0, 10),
  );
  const walk = (step: number) => coneDates.map((_, i) => +(price + i * step).toFixed(2));
  return {
    schema: 'wealth.forecast.v1',
    generated_at: '2026-07-24T02:30:00Z',
    horizon_days: 30,
    bias: 'BEARISH', // → predBias "BEARISH · 1D" (forecast evidence is daily)
    basis: { close: price, ema50: price - 16, ema200: price - 60 },
    cone: {
      t: coneDates,
      p10: walk(-1.4),
      p25: walk(-0.7),
      p50: walk(0.1),
      p75: walk(0.9),
      p90: walk(1.6),
    },
    scenarios: [
      { side: 'LONG', trigger: 'break above R1', objective: price + 48, invalidation: price - 24, eta_days: 12, confluence: 3 },
      { side: 'SHORT', trigger: 'loss of S1', objective: price - 72, invalidation: price + 10, eta_days: 9, confluence: 2 },
    ],
    institutional_read: 'Bearish bias while price holds below R1',
    epistemic: 'INT · model cone, not a promise',
  };
}

function historyFixture(asset: Asset) {
  const { price } = ASSET_META[asset];
  const lastT = Math.floor(Date.UTC(2026, 6, 24, 0, 0, 0) / 1000);
  const n = 80;
  const candles = Array.from({ length: n }, (_, i) => {
    const base = price - 40 + i * 0.5;
    return {
      time: lastT - (n - 1 - i) * 3600,
      open: +(base - 0.2).toFixed(3),
      high: +(base + 1.1).toFixed(3),
      low: +(base - 1.1).toFixed(3),
      close: +base.toFixed(3),
    };
  });
  const ema = (offset: number) =>
    candles.map((c) => ({ time: c.time, value: +(c.close - offset).toFixed(3) }));
  return {
    candles,
    ema20: ema(1.2),
    ema50: ema(3.4),
    ema200: ema(9.8),
  };
}

function calendarFixture() {
  return {
    events: [
      {
        date: 'Jul 29',
        time: '14:00',
        event: 'FOMC Rate Decision',
        impact: 'high',
        actual: '—',
        forecast: '4.50%',
        previous: '4.50%',
      },
    ],
  };
}

function proxiesFixture() {
  return {
    timestamp: new Date().toISOString(),
    brent: 85.42, brent_prev: 84.97,
    natgas: 3.418, natgas_prev: 3.39,
    usdmyr: 4.213, usdmyr_prev: 4.2085,
    dxy: 104.25, dxy_prev: 104.41,
    klci: 1612.4, klci_prev: 1608.2,
    ewm: 22.41, ewm_prev: 22.3,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Route stubs
// ────────────────────────────────────────────────────────────────────────────

async function stubSharedAssets(page: Page) {
  await page.route('**/_shared/economics.css', (route: Route) =>
    route.fulfill({ contentType: 'text/css', body: fs.readFileSync(SHARED_CSS) }),
  );
  await page.route('**/lightweight-charts*.js', (route: Route) =>
    route.fulfill({ contentType: 'application/javascript', path: CHART_JS }),
  );
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (route: Route) => route.abort());
}

interface MarketFixtures {
  snapshot: unknown;
  apex: unknown;
  signal: unknown;
  forecast: unknown;
  history: unknown;
  calendar: unknown;
}

function marketFixtures(asset: Asset, sigOverrides: SignalOverrides = {}, snapOverrides: SnapshotOverrides = {}): MarketFixtures {
  return {
    snapshot: snapshotFixture(asset, snapOverrides),
    apex: apexFixture(),
    signal: signalFixture(sigOverrides),
    forecast: forecastFixture(asset),
    history: historyFixture(asset),
    calendar: calendarFixture(),
  };
}

async function stubMarketApi(page: Page, asset: Asset, fx: MarketFixtures) {
  const b = `**/wealth/${asset}/api`;
  await page.route(`${b}/snapshot`, (route) => route.fulfill({ json: fx.snapshot as object }));
  await page.route(`${b}/apex`, (route) => route.fulfill({ json: fx.apex as object }));
  await page.route(`${b}/signal_v2`, (route) => route.fulfill({ json: fx.signal as object }));
  await page.route(`${b}/forecast**`, (route) => route.fulfill({ json: fx.forecast as object }));
  await page.route(`${b}/history**`, (route) => route.fulfill({ json: fx.history as object }));
  await page.route(`${b}/calendar`, (route) => route.fulfill({ json: fx.calendar as object }));
}

/** Snapshot hangs for 60s (page close aborts it); every other endpoint fails fast. */
async function stubMarketTimeout(page: Page, asset: Asset, fx: MarketFixtures) {
  const b = `**/wealth/${asset}/api`;
  await page.route(`${b}/snapshot`, (route) => {
    const timer = setTimeout(() => route.fulfill({ json: fx.snapshot as object }), 60_000);
    return () => clearTimeout(timer);
  });
  for (const ep of ['apex', 'signal_v2', 'forecast**', 'history**', 'calendar']) {
    await page.route(`${b}/${ep}`, (route) => route.abort());
  }
}

async function stubProxies(page: Page) {
  await page.route('**/wealth/gold/api/proxies', (route) =>
    route.fulfill({ json: proxiesFixture() }),
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Shared DOM-truth assertions
// ────────────────────────────────────────────────────────────────────────────

async function expectNoForbiddenText(page: Page) {
  const bodyText = await page.locator('body').innerText();
  for (const bad of FORBIDDEN_TEXT) {
    expect(bodyText, `visible text must not contain "${bad}"`).not.toContain(bad);
  }
}

async function expectChromeTruth(page: Page) {
  await expect(page.locator('.cmd-bar:visible')).toHaveCount(0);
  await expect(page.locator('.market-map-bar:visible')).toHaveCount(0);
  // exactly one visible orientation surface
  await expect(page.locator('.zen-pulse:visible')).toHaveCount(1);
  // default details closed
  await expect(page.locator('details[open]')).toHaveCount(0);
}

async function getJsonLd(page: Page, selector: string) {
  const raw = await page.locator(selector).textContent();
  expect(raw, `JSON-LD block ${selector} must exist`).toBeTruthy();
  return JSON.parse(raw as string);
}

// ────────────────────────────────────────────────────────────────────────────
// 1. Market pages — gold / oil / gas
// ────────────────────────────────────────────────────────────────────────────

const MARKET_ASSETS: Asset[] = ['gold', 'oil', 'gas'];

for (const asset of MARKET_ASSETS) {
  test.describe(`market page · /${asset}/`, () => {
    test('fixture run renders answer, freshness, dominant reason, ladder, JSON-LD', async ({ page }) => {
      await stubSharedAssets(page);
      await stubMarketApi(page, asset, marketFixtures(asset));
      await page.goto(`${MAIN}/${asset}/`);

      // data landed (first-viewport market answer: price + freshness + dominant reason)
      await expect(page.locator('#pulsePrice')).toHaveText(/\$/);
      await expect(page.locator('#pulseTimestamp')).toContainText('MYT');
      await expect(page.locator('#pulseDriver')).toContainText('RSI');

      // first-viewport geometry: pulse bar (market answer) is inside the initial viewport
      const priceBox = await page.locator('#pulsePrice').boundingBox();
      const viewport = page.viewportSize();
      expect(priceBox, 'pulse price must be in first viewport').toBeTruthy();
      expect(priceBox!.y).toBeLessThan(viewport!.height);
      expect(priceBox!.y + priceBox!.height).toBeGreaterThan(0);

      // market-answer block: freshness / seal / verdict / unavailable strip hidden
      await expect(page.locator('.market-answer')).toBeVisible();
      await expect(page.locator('.market-answer-freshness')).toContainText('as of');
      await expect(page.locator('.market-answer-freshness')).toContainText('sealed');
      await expect(page.locator('#maAsOf')).toContainText('MYT');
      await expect(page.locator('#maVerdict')).toHaveText(/SEAL|SABAR|HOLD|VOID/);
      await expect(page.locator('#maUnavailable')).toBeHidden();

      // action link (cross-navigation) visible
      await expect(page.locator('.zp-nav a').first()).toBeVisible();

      // timeframe-stamped direction: apex follows chart TF; forecast evidence is daily → · 1D
      await expect(page.locator('#apexDirection')).toHaveText(/Bearish · (1H|4H|1D|1W)/);
      await expect(page.locator('#predBias')).toHaveText(/BEARISH · 1D/);
      await expect(page.locator('#predKeySub')).toHaveText('Support 1 · 1D');

      // dominant reason in the answer block
      await expect(page.locator('#predRead')).toContainText('Bearish bias while price holds below R1');

      // forecast scenario rungs carry per-rung R:R (default fixture: LONG 38/34 → 1:1.1, SHORT 48/34 → 1:1.4)
      await expect(page.locator('#predScenarios .scenario-row')).toHaveCount(2);
      await expect(page.locator('#predScenarios')).toContainText('R:R 1:1.1');
      await expect(page.locator('#predScenarios')).toContainText('R:R 1:1.4');

      // DOM order: the answer precedes the chart
      const maBeforeChart = await page.evaluate(() => {
        const ma = document.querySelector('section.market-answer');
        const cs = document.querySelector('section.chart-section');
        return !!(ma && cs && (ma.compareDocumentPosition(cs) & Node.DOCUMENT_POSITION_FOLLOWING));
      });
      expect(maBeforeChart, 'section.market-answer must precede section.chart-section').toBe(true);

      // valid R:R → ladder shown, no-setup hidden
      await expect(page.locator('#tradeLadder')).toBeVisible();
      await expect(page.locator('#tradeRR')).toHaveText('1:2.3');
      await expect(page.locator('#tradeNoSetup')).toBeHidden();

      // chrome truth: forbidden text, no cmd/market-map bars, one orientation surface, details closed
      await expectNoForbiddenText(page);
      await expectChromeTruth(page);

      // JSON-LD parses with numeric pulse after snapshot lands
      const pkt = await getJsonLd(page, '#wealth-reality-packet');
      expect(typeof pkt.market_state.price_usd, 'JSON-LD price_usd must be numeric').toBe('number');
      expect(pkt.market_state.price_usd).toBe(ASSET_META[asset].price);
      expect(pkt.observed_at).toBeTruthy();
      expect(pkt.schema).toBe('wealth.snapshot.v1');
    });

    test('invalid/flat R:R hides ladder and shows SABAR · No active setup', async ({ page }) => {
      // gold: FLAT direction · oil: R:R below 1.0 gate · gas: R:R missing (null)
      const sigOverrides: Record<Asset, SignalOverrides> = {
        gold: { direction: 'FLAT', verdict: 'SABAR', rr: 0.4 },
        oil: { direction: 'LONG', verdict: 'SABAR', rr: 0.5 },
        gas: { direction: 'LONG', verdict: 'SABAR', rr: null },
      };
      await stubSharedAssets(page);
      await stubMarketApi(page, asset, marketFixtures(asset, sigOverrides[asset]));
      await page.goto(`${MAIN}/${asset}/`);

      // wait until the signal response was processed (synthesis text updated)
      await expect(page.locator('#synthesisVerdict')).toContainText('SABAR');

      await expect(page.locator('#tradeLadder')).toBeHidden();
      await expect(page.locator('#tradeNoSetup')).toBeVisible();
      await expect(page.locator('#tradeNoSetup')).toHaveText('SABAR · No active setup');
      await expect(page.locator('#tradeRR')).toHaveText('—');

      if (asset === 'gold') {
        await expect(page.locator('#synthesisVerdict')).toContainText('FLAT');
      } else if (asset === 'oil') {
        await expect(page.locator('#synthesisVerdict')).toContainText('R:R Ratio: 0.5:1');
      } else {
        await expect(page.locator('#synthesisVerdict')).toContainText('R:R Ratio: —');
      }
      await expectNoForbiddenText(page);
    });

    test('scenario rungs gated by R:R — bad rung (R:R < 1) absent, valid rung remains with R:R 1:x', async ({ page }) => {
      const { price } = ASSET_META[asset];
      const fx = marketFixtures(asset);
      // LONG: trigger R1 (= SHORT invalidation, price+10), invalidation price-24 → risk 34;
      //       objective price+12 → reward 2 → R:R 0.1 < 1 → suppressed.
      // SHORT: trigger S1 (= LONG invalidation, price-24), invalidation price+10 → risk 34;
      //        objective price-72 → reward 48 → R:R 1.4 → kept.
      (fx.forecast as { scenarios: unknown[] }).scenarios = [
        { side: 'LONG', trigger: 'break above R1', objective: price + 12, invalidation: price - 24, eta_days: 12, confluence: 3 },
        { side: 'SHORT', trigger: 'loss of S1', objective: price - 72, invalidation: price + 10, eta_days: 9, confluence: 2 },
      ];
      await stubSharedAssets(page);
      await stubMarketApi(page, asset, fx);
      await page.goto(`${MAIN}/${asset}/`);

      await expect(page.locator('#predScenarios .scenario-row')).toHaveCount(1);
      await expect(page.locator('#predScenarios')).toContainText('▼ SHORT');
      await expect(page.locator('#predScenarios')).toContainText('R:R 1:1.4');
      await expect(page.locator('#predScenarios')).not.toContainText('▲ LONG');
      await expectNoForbiddenText(page);
    });

    test('both rungs below R:R 1.0 → scenario ladder shows no active setup', async ({ page }) => {
      const { price } = ASSET_META[asset];
      const fx = marketFixtures(asset);
      // LONG reward 2/34 → 0.1 · SHORT reward 6/34 → 0.2 — both suppressed.
      (fx.forecast as { scenarios: unknown[] }).scenarios = [
        { side: 'LONG', trigger: 'break above R1', objective: price + 12, invalidation: price - 24, eta_days: 12, confluence: 3 },
        { side: 'SHORT', trigger: 'loss of S1', objective: price - 30, invalidation: price + 10, eta_days: 9, confluence: 2 },
      ];
      await stubSharedAssets(page);
      await stubMarketApi(page, asset, fx);
      await page.goto(`${MAIN}/${asset}/`);

      await expect(page.locator('#predScenarios .scenario-row')).toHaveCount(0);
      await expect(page.locator('#predScenarios')).toContainText('SABAR · No active setup');
      await expectNoForbiddenText(page);
    });

    test('snapshot timeout → "Data unavailable" / "last verified" within watchdog, no placeholder numbers', async ({ page }) => {
      const fx = marketFixtures(asset);
      await stubSharedAssets(page);
      await stubMarketTimeout(page, asset, fx);
      await page.goto(`${MAIN}/${asset}/`);

      // The page arms a 10s first-viewport watchdog; the strip must appear at ~10s.
      // 11s expect budget proves the fallback lands within the watchdog window.
      await expect(page.locator('#maUnavailable')).toBeVisible({ timeout: 11_000 });
      await expect(page.locator('#maUnavailable')).toContainText('Data unavailable');
      await expect(page.locator('#maUnavailable')).toContainText('last verified');
      await expect(page.locator('#pulseTimestamp')).toContainText('Data unavailable');

      // no placeholder numeric direction / R:R anywhere in the trade area
      await expect(page.locator('#tradeRR')).toHaveText('—');
      await expect(page.locator('#predBias')).toHaveText('—');
      await expect(page.locator('#apexDirection')).toHaveText('—');
      await expect(page.locator('#tradeLadder')).toBeHidden();
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).not.toMatch(/R:R\s+1:\d/);
      expect(bodyText).not.toMatch(/1:\d+\.\d/);
      await expectNoForbiddenText(page);
    });
  });
}

// oil / gas asset purity — no gold vocabulary leaks
for (const asset of ['oil', 'gas'] as const) {
  test(`/${asset}/ has no gold vocabulary (/gram, Silver, GSR, Gold Dashboard, gold_stance)`, async ({ page }) => {
    await stubSharedAssets(page);
    await stubMarketApi(page, asset, marketFixtures(asset));
    await page.goto(`${MAIN}/${asset}/`);
    await expect(page.locator('#pulsePrice')).toHaveText(/\$/);

    const bodyText = await page.locator('body').innerText();
    for (const bad of ['/gram', 'Silver', 'GSR', 'Gold Dashboard']) {
      expect(bodyText, `/${asset}/ visible text must not contain "${bad}"`).not.toContain(bad);
    }
    const html = await page.content();
    expect(html, `/${asset}/ must not reference gold_stance`).not.toContain('gold_stance');
  });
}

// gold-only: forecast card is daily-driven — timeframe switch must NOT re-stamp it
test('gold: switching chart timeframe leaves forecast card stamped · 1D', async ({ page }) => {
  await stubSharedAssets(page);
  await stubMarketApi(page, 'gold', marketFixtures('gold'));
  await page.goto(`${MAIN}/gold/`);
  await expect(page.locator('#predBias')).toHaveText(/BEARISH · 1D/);
  await page.locator('.tf-pill[data-tf="1H"]').click();
  // chart re-renders on 1H, but forecast evidence stays daily
  await expect(page.locator('#predBias')).toHaveText(/BEARISH · 1D/);
  await expect(page.locator('#predKeySub')).toHaveText('Support 1 · 1D');
});

// gold-only: reconciliation line appears when timeframes conflict
test('gold: reconciliation line appears for conflicting fixture (BEARISH trend, price above R1)', async ({ page }) => {
  await stubSharedAssets(page);
  await stubMarketApi(page, 'gold', marketFixtures('gold', {}, { emaTrend: 'BEARISH', priceAboveResistance: true }));
  await page.goto(`${MAIN}/gold/`);
  await expect(page.locator('#pulsePrice')).toHaveText(/\$/);
  await expect(page.locator('#maReconcile')).toBeVisible();
  await expect(page.locator('#maReconcile')).toContainText('Intraday bounce inside daily downtrend');
});

// ────────────────────────────────────────────────────────────────────────────
// 2. Institutional pages — vitals / malaysia
// ────────────────────────────────────────────────────────────────────────────

test('vitals: no-JS initial HTML carries PETRONAS 0/VOID (lock) + pre-lock 48/HOLD as separate structured facts', async ({ request }) => {
  const resp = await request.get(`${WEALTH}/vitals/`);
  expect(resp.ok()).toBeTruthy();
  const html = await resp.text();
  // B11-D: served pulse is the override (0, VOID), not the pre-lock 48/HOLD
  expect(html).toContain('id="pulseval"');
  expect(html).toMatch(/id="pulseval"[^>]*>0</);
  expect(html).toMatch(/id="pulseverdict"[^>]*>VOID</);
  // sub-scores: BODY 0 (override), SPINE 34, SOUL 22
  expect(html).toMatch(/id="sb-body"[^>]*>0/);
  expect(html).toContain('id="sb-spine">34<');
  expect(html).toContain('id="sb-soul">22<');
  // Pre-lock 48 + HOLD preserved as separate historical facts, never as a contiguous "48 HOLD" marker
  expect(html).not.toContain('48 HOLD');
  // Pre-lock pulse + verdict appear as distinct facts
  expect(html).toMatch(/pre[-_]lock[-_ ]pulse[\s\S]{0,400}48/);
  expect(html).toMatch(/pre[-_]lock[-_ ]verdict[\s\S]{0,400}HOLD/);
  // FY2026 [DEC] is present but explicitly marked feeds_scoring=false
  expect(html).toContain('[DEC]');
  expect(html).toContain('feeds_scoring');
});

test('malaysia: no-JS initial HTML carries Malaysia 45/HOLD + 34/56/48', async ({ request }) => {
  const resp = await request.get(`${WEALTH}/malaysia/`);
  expect(resp.ok()).toBeTruthy();
  const html = await resp.text();
  expect(html).toContain('id="pulseval">45<');
  expect(html).toContain('id="pulseverdict">HOLD<');
  expect(html).toContain('id="sb-body">34<');
  expect(html).toContain('id="sb-engine">56<');
  expect(html).toContain('id="sb-soul">48<');
});

const TRIPWIRE_NAMES: Record<'vitals' | 'malaysia', string[]> = {
  vitals: [
    'FCF after capex & dividend',
    'Gearing ratio',
    'CFFO — master variable',
    'Production / reserve replacement',
    'Capital Recycling Ratio',
    'Dividend-to-FCF payout',
    'Enabler ratio (rightsizing gauge)',
    'Governance separation index',
    'Sovereign extraction gauge',
  ],
  malaysia: [
    'Federal Debt / GDP',
    'Fiscal Deficit / GDP',
    'Reserves (months of imports)',
    'Real GDP Growth',
    'Current Account Balance / GDP',
    'FDI / GDP (net inflows)',
    'Old-Age Dependency Ratio',
    'Corruption Perception Index',
    'Rule of Law (WGI Percentile)',
  ],
};

for (const slug of ['vitals', 'malaysia'] as const) {
  test(`${slug}: DOM truth, tripwires once, threshold text, numeric JSON-LD`, async ({ page }) => {
    await stubSharedAssets(page);
    await stubProxies(page);
    await page.goto(`${WEALTH}/${slug}/`);

    // institution answer + freshness/seal + dominant reason + action link in first viewport
    await expect(page.locator('[data-agent-role="institution-answer"]')).toBeVisible();
    await expect(page.locator('.pulse-meta')).toContainText('sealed');
    await expect(page.locator('.pulse-meta')).toContainText('next audit');
    await expect(page.locator('.pulse-desc')).not.toBeEmpty();
    await expect(page.locator('.verb-row a').first()).toBeVisible();

    const pulseBox = await page.locator('#pulseval').boundingBox();
    expect(pulseBox, 'institution pulse must be in first viewport').toBeTruthy();
    expect(pulseBox!.y).toBeLessThan(page.viewportSize()!.height);

    // live proxies landed deterministically
    await expect(page.locator('#lsBadge')).toContainText('LIVE');

    // chrome truth
    await expectNoForbiddenText(page);
    await expectChromeTruth(page);

    // each tripwire appears exactly once in the ranked grid
    await expect(page.locator('#grid9 .tripcell')).toHaveCount(9);
    const gridText = await page.locator('#grid9').innerText();
    for (const name of TRIPWIRE_NAMES[slug]) {
      const occurrences = gridText.split(name).length - 1;
      expect(occurrences, `tripwire "${name}" must appear exactly once in #grid9`).toBe(1);
    }

    // B11-A: each static row has stable data-* attributes (id/layer/score/verdict/now/trip/safe/tag/source/sealed)
    const firstCell = page.locator('#grid9 .tripcell').first();
    for (const attr of ['data-id', 'data-layer', 'data-score', 'data-verdict', 'data-now', 'data-trip', 'data-safe', 'data-tag', 'data-source', 'data-sealed']) {
      await expect(firstCell).toHaveAttribute(attr, /\S+/);
    }

    // B11-B: static SVG fan fallback present
    await expect(page.locator('svg#fan-svg')).toBeAttached();
    await expect(page.locator('[data-agent-role="fan-fallback-static"]')).toBeAttached();

    // B11-C: static scenario summary present
    await expect(page.locator('table[data-agent-role="scenario-summary-static"]')).toBeAttached();
    await expect(page.locator('table[data-agent-role="scenario-summary-static"]')).toContainText('audited IFR FY2025 remains the sole scoring input');

    // full SEAL 80 / SABAR 60 / VOID 40 threshold text present in page or script
    const html = await page.content();
    expect(html).toContain('80–100');
    expect(html).toContain('60–79');
    expect(html).toContain('SEAL');
    expect(html).toContain('SABAR');
    expect(html).toContain('VOID');

    // B11-D: no-JS rows present even before any client enhancement
    const noJsCellCount = await page.locator('#grid9 .tripcell').count();
    expect(noJsCellCount).toBe(9);

    // B11-D: institutional-vitals-reality JSON-LD is present
    const realityLd = await page.evaluate(() => {
      const scripts = document.querySelectorAll('script[type="application/ld+json"][data-agent-role="institutional-vitals-reality"]');
      return scripts.length === 0 ? null : JSON.parse(scripts[0].textContent || '{}');
    });

    // JSON-LD parses with numeric pulse
    const ld = await getJsonLd(page, 'script[type="application/ld+json"]');
    if (slug === 'vitals') {
      // B11-D canonical: display_pulse = 0, display_verdict = 'VOID' under HARD LOCK
      expect(typeof ld.display_pulse).toBe('number');
      expect(ld.display_pulse).toBe(0);
      expect(ld.display_verdict).toBe('VOID');
      expect(ld.pre_lock_pulse).toBe(48);
      expect(ld.pre_lock_verdict).toBe('HOLD');
      expect(ld.fy2026_declared_state.feeds_scoring).toBe(false);
      expect(ld.fy2026_declared_state.epistemic_class).toBe('[DEC]');
      expect(ld.static_row_count).toBe(9);
      expect(ld.indicators).toHaveLength(9);
      for (const ind of ld.indicators) expect(typeof ind.score).toBe('number');
      // Reality JSON-LD (B11-D) present
      expect(realityLd).toBeTruthy();
      expect(realityLd.display_pulse).toBe(0);
      expect(realityLd.pre_lock_pulse).toBe(48);
    } else {
      expect(typeof ld.composite_pulse).toBe('number');
      expect(ld.composite_pulse).toBe(45);
      expect(ld.verdict).toBe('HOLD');
      expect(ld.subscores).toEqual({ BODY: 34, ENGINE: 56, SOUL: 48 });
      expect(ld.tripwires).toHaveLength(9);
      for (const tw of ld.tripwires) expect(typeof tw.score).toBe('number');
    }
  });
}

test('malaysia: no "Five pillars" vocabulary anywhere', async ({ page }) => {
  await stubSharedAssets(page);
  await stubProxies(page);
  await page.goto(`${WEALTH}/malaysia/`);
  const bodyText = await page.locator('body').innerText();
  expect(bodyText).not.toContain('Five pillars');
  const html = await page.content();
  expect(html).not.toContain('Five pillars');
});

// ────────────────────────────────────────────────────────────────────────────
// 3. Navigation — Home + WEALTH hub
// ────────────────────────────────────────────────────────────────────────────

const EXPECTED_NAV = ['PETRONAS health', 'Malaysia position', 'Gold', 'Oil', 'Gas'];

for (const [name, url] of [
  ['Home (arif-fazil.com)', `${MAIN}/`],
  ['WEALTH hub', `${WEALTH}/`],
] as const) {
  test(`${name}: exactly one WEALTH live intelligence nav with five ordered links`, async ({ page }) => {
    await stubSharedAssets(page);
    await page.goto(url);
    const nav = page.locator('nav[aria-label="WEALTH live intelligence"]');
    await expect(nav).toHaveCount(1);
    await expect(nav.first()).toBeVisible();
    const links = nav.first().locator('a');
    await expect(links).toHaveCount(5);
    const texts = (await links.allTextContents()).map((t) => t.trim());
    expect(texts).toEqual(EXPECTED_NAV);
  });
}

// ────────────────────────────────────────────────────────────────────────────
// 4. Mobile viewport 390x844
// ────────────────────────────────────────────────────────────────────────────

test.describe('mobile 390x844', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  async function expectNoHorizontalOverflow(page: Page) {
    const { sw, iw } = await page.evaluate(() => ({
      sw: document.documentElement.scrollWidth,
      iw: window.innerWidth,
    }));
    expect(sw, `horizontal overflow: scrollWidth ${sw} > innerWidth ${iw}`).toBeLessThanOrEqual(iw + 1);
  }

  async function expectMinFontSize(page: Page, selector: string, minPx = 10) {
    const el = page.locator(selector).first();
    await expect(el).toBeVisible();
    const size = await el.evaluate((node) => parseFloat(getComputedStyle(node).fontSize));
    expect(size, `${selector} font-size ${size}px must be ≥ ${minPx}px`).toBeGreaterThanOrEqual(minPx);
  }

  for (const asset of MARKET_ASSETS) {
    test(`/${asset}/ mobile: no overflow, answer visible, essential text ≥ 10px`, async ({ page }) => {
      await stubSharedAssets(page);
      await stubMarketApi(page, asset, marketFixtures(asset));
      await page.goto(`${MAIN}/${asset}/`);
      await expect(page.locator('#pulsePrice')).toHaveText(/\$/);

      await expectNoHorizontalOverflow(page);

      // market answer visible
      const answer = page.locator('.market-answer');
      await answer.scrollIntoViewIfNeeded();
      await expect(answer).toBeVisible();
      await expect(page.locator('#maAsOf')).toContainText('MYT');

      // essential text ≥ 10px (spot check computed styles)
      await expectMinFontSize(page, '#pulsePrice');
      await expectMinFontSize(page, '#maVerdict');
      await expectMinFontSize(page, '.market-answer-label');
      await expectMinFontSize(page, '#predBias');
    });
  }

  test('vitals mobile: no overflow, answer visible, fan controls/readouts stack', async ({ page }) => {
    await stubSharedAssets(page);
    await stubProxies(page);
    await page.goto(`${WEALTH}/vitals/`);
    // B11-D: served pulse reflects HARD LOCK override (0/VOID), not pre-lock 48/HOLD
    await expect(page.locator('#pulseval')).toHaveText('0');
    await expect(page.locator('#pulseverdict')).toContainText('VOID');

    await expectNoHorizontalOverflow(page);

    // institution answer visible
    await expect(page.locator('[data-agent-role="institution-answer"]')).toBeVisible();

    // fan sliders stack vertically at 390px
    const sliders = page.locator('.fan-sliders .slider');
    await expect(sliders).toHaveCount(2);
    const s0 = await sliders.nth(0).boundingBox();
    const s1 = await sliders.nth(1).boundingBox();
    expect(s0 && s1, 'fan slider boxes must exist').toBeTruthy();
    expect(s1!.y, 'second fan slider must stack below the first').toBeGreaterThanOrEqual(s0!.y + s0!.height - 2);

    // fan readout stacks below the sliders
    const slidersBox = await page.locator('.fan-sliders').boundingBox();
    const readoutBox = await page.locator('.fan-readout').boundingBox();
    expect(slidersBox && readoutBox, 'fan sliders/readout boxes must exist').toBeTruthy();
    expect(readoutBox!.y, 'fan readout must stack below fan sliders').toBeGreaterThanOrEqual(
      slidersBox!.y + slidersBox!.height - 2,
    );

    // essential text ≥ 10px
    await expectMinFontSize(page, '#pulseval');
    await expectMinFontSize(page, '#pulseverdict');
    await expectMinFontSize(page, '.hero h1');
    await expectMinFontSize(page, '.sub-card .val');
  });

  test('malaysia mobile: no overflow, answer visible, what-if controls stack', async ({ page }) => {
    await stubSharedAssets(page);
    await stubProxies(page);
    await page.goto(`${WEALTH}/malaysia/`);
    await expect(page.locator('#pulseval')).toHaveText('45');

    await expectNoHorizontalOverflow(page);
    await expect(page.locator('[data-agent-role="institution-answer"]')).toBeVisible();

    // what-if proxy sliders stack vertically at 390px
    const brent = await page.locator('#myBrent').boundingBox();
    const myr = await page.locator('#myMyr').boundingBox();
    expect(brent && myr, 'what-if slider boxes must exist').toBeTruthy();
    expect(myr!.y, 'USD/MYR slider must stack below Brent slider').toBeGreaterThanOrEqual(
      brent!.y + brent!.height - 2,
    );

    // essential text ≥ 10px
    await expectMinFontSize(page, '#pulseval');
    await expectMinFontSize(page, '#pulseverdict');
    await expectMinFontSize(page, '.hero h1');
    await expectMinFontSize(page, '.sub-card .val');
  });
});
