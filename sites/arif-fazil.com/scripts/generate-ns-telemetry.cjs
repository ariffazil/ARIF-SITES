// generate-ns-telemetry.cjs — Public Live Telemetry for Negeri Sembilan PRN 2026
//
// Architecture (2026-07-31, post-autonomy pass — fixes audit BLOCKERS B1-B5 + MAJOR M3-M4):
//
//   SOURCE OF TRUTH:   /root/arif-fazil.com/sealed/n9-ground-truth.json
//                      (F13 sovereign file, READ-ONLY by this script)
//   PROBE:             Polymarket Gamma API (graceful fail, exact N9 match only)
//   WRITES:            atomic dual-write via mktemp + rename to:
//                        (a) source repo public/ (git history)
//                        (b) live webroot /var/www/html/arif/data/politics/
//                      Both writes attempted even if one fails; result reflected in payload.
//
// Cron: 7,22,37,52 * * * * (avoid :00/:15/:30/:45 herd). Runs as root (T2/T3 defer:
// dedicated service account).

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');

const SCRIPT_DIR = __dirname;
const SOURCE_PUBLIC = path.join(SCRIPT_DIR, '..', 'public', 'data', 'politics');
const SOURCE_PATH = path.join(SOURCE_PUBLIC, 'ns_live_telemetry.json');
const LIVE_WEBROOT = '/var/www/html/arif/data/politics';
const LIVE_PATH = path.join(LIVE_WEBROOT, 'ns_live_telemetry.json');
const SEALED_GROUND_TRUTH = '/root/arif-fazil.com/sealed/n9-ground-truth.json';

const POLYMARKET_TIMEOUT_MS = 6000;

// Health levels (top-level only — nested objects expose their own status)
const HEALTH_OK = 'OK';                  // every upstream healthy
const HEALTH_SEALED_ONLY = 'SEALED_ONLY'; // only sealed ground truth, no live feed
const HEALTH_LIVE_PARTIAL = 'LIVE_PARTIAL'; // live data present but with warnings
const HEALTH_DEGRADED = 'DEGRADED';       // upstream failure, emitted as best-effort

// ── helpers ────────────────────────────────────────────────────────────
function nowISO() { return new Date().toISOString(); }

function safeReadJSON(p) {
  try {
    if (!fs.existsSync(p)) return { __error: 'FILE_MISSING', path: p };
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch (e) {
    return { __error: 'PARSE_ERROR: ' + e.message, path: p };
  }
}

function safeMkdir(p) {
  try { fs.mkdirSync(p, { recursive: true }); return true; }
  catch (e) { return false; }
}

function atomicWrite(targetPath, payload) {
  // mktemp for unique temp file (avoids race with concurrent cron/manual runs)
  const dir = path.dirname(targetPath);
  if (!safeMkdir(dir)) return { ok: false, error: 'mkdir_failed: ' + dir };
  const tmp = path.join(dir, `.${path.basename(targetPath)}.${crypto.randomBytes(6).toString('hex')}.tmp`);
  try {
    fs.writeFileSync(tmp, JSON.stringify(payload, null, 2));
    fs.renameSync(tmp, targetPath);
    return { ok: true, path: targetPath, sha256: crypto.createHash('sha256').update(JSON.stringify(payload)).digest('hex') };
  } catch (e) {
    try { fs.unlinkSync(tmp); } catch (_) {}
    return { ok: false, error: e.message, path: targetPath };
  }
}

function httpsGetJson(url, timeoutMs) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: timeoutMs }, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        if (res.statusCode !== 200) {
          resolve({ ok: false, status: res.statusCode, error: `http_${res.statusCode}` });
          return;
        }
        try { resolve({ ok: true, data: JSON.parse(body) }); }
        catch (e) { resolve({ ok: false, error: 'parse_error: ' + e.message }); }
      });
    });
    req.on('timeout', () => { req.destroy(); resolve({ ok: false, error: 'timeout' }); });
    req.on('error', (e) => { resolve({ ok: false, error: e.code || e.message }); });
  });
}

function asArray(x) {
  if (Array.isArray(x)) return x;
  if (typeof x === 'string') {
    try { const v = JSON.parse(x); return Array.isArray(v) ? v : []; }
    catch (_) { return []; }
  }
  return [];
}

function pct(n) {
  if (typeof n !== 'number' || isNaN(n)) return null;
  // Round to 1 decimal place: (74.5 * 10) / 10 = 74.5
  return Math.round(n * 10) / 10;
}

function validateSealed(sealed) {
  // Schema check: required top-level fields + epistemic_class tagging
  if (!sealed || sealed.__error) return { ok: false, error: sealed?.__error || 'sealed_unreadable' };
  const required = ['observations', 'interpretations', 'sources', 'as_of', 'seal_id'];
  for (const k of required) {
    if (!(k in sealed)) return { ok: false, error: 'missing_field: ' + k };
  }
  // Validate that every numeric claim has epistemic_class (either in source field
  // or by walking the observations.* structure). Skip if no observation found.
  if (sealed.observations) {
    for (const [k, v] of Object.entries(sealed.observations)) {
      if (typeof v === 'object' && v && !v.epistemic_class) {
        return { ok: false, error: 'observation_missing_epistemic_class: ' + k };
      }
    }
  }
  if (sealed.interpretations) {
    for (const [k, v] of Object.entries(sealed.interpretations)) {
      if (typeof v === 'object' && v && !v.epistemic_class && k !== 'hotseat_signals') {
        return { ok: false, error: 'interpretation_missing_epistemic_class: ' + k };
      }
      // hotseat_signals.seats array is exempt (each seat object carries its own classification)
    }
  }
  return { ok: true };
}

// ── Polymarket probe — exact N9 event match only ──────────────────────
//
// BLOCKER B1 fix: previous version matched any market mentioning 'anwar' or
// 'pakatan', which would silently repurpose an unrelated market's odds as the
// N9 coalition forecast. Now requires:
//   - slug or question references Negeri Sembilan / N9 PRN / N9 state election
//   - OR an event-level match (parent event explicitly about N9 state poll)
//   - AND at least one outcome label matching 'BN-PN' or 'BN/PN'
async function probePolymarket() {
  const probedAt = nowISO();
  const result = {
    probed_at: probedAt,
    status: 'UNKNOWN',
    markets_scanned: 0,
    matches_found: 0,
    n9_market: null,
    note: ''
  };
  try {
    const url = 'https://gamma-api.polymarket.com/markets?active=true&closed=false&limit=500';
    const r = await httpsGetJson(url, POLYMARKET_TIMEOUT_MS);
    if (!r.ok) {
      result.status = 'PROBE_FAILED';
      result.error = r.error || 'unknown';
      result.note = `Polymarket unreachable: ${result.error}. Falling back to sealed ground truth.`;
      return result;
    }
    const markets = Array.isArray(r.data) ? r.data : [];
    result.markets_scanned = markets.length;

    // Exact-match filter — accept only N9-specific markets
    const n9Candidates = markets.filter((m) => {
      const s = ((m.question || '') + ' ' + (m.description || '') + ' ' + (m.slug || '')).toLowerCase();
      return s.includes('negeri sembilan') ||
             s.includes('n9 state') ||
             s.includes('n9 election') ||
             s.includes('n9 prn') ||
             (s.includes('malaysia') && s.includes('state election') && s.includes('2026'));
    });

    // Filter to those with coalition-style outcomes
    const coalitionCandidates = n9Candidates.filter((m) => {
      const outcomes = asArray(m.outcomes);
      return outcomes.some((o) => /bn.?pn|bn\/pn|barisan.perikatan/i.test(String(o)));
    });

    result.matches_found = coalitionCandidates.length;
    if (coalitionCandidates.length === 0) {
      result.status = n9Candidates.length > 0 ? 'NO_COALITION_OUTCOME' : 'NO_MARKET';
      result.note = n9Candidates.length > 0
        ? `Found ${n9Candidates.length} N9-related market(s) but none with BN-PN coalition outcome labels. Falling back to sealed ground truth.`
        : 'No active N9 election market exists on Polymarket at probe time. Falling back to sealed ground truth.';
      return result;
    }

    // Pick first coalition candidate with valid prices
    const chosen = coalitionCandidates[0];
    const outcomePrices = asArray(chosen.outcomePrices);
    const outcomes = asArray(chosen.outcomes);
    if (outcomePrices.length === 0 || outcomes.length === 0) {
      result.status = 'MALFORMED';
      result.note = 'Market found but outcomePrices or outcomes empty/malformed.';
      return result;
    }

    // Map each price to its named outcome; pick the one matching BN-PN label
    const bnPnIdx = outcomes.findIndex((o) => /bn.?pn|bn\/pn|barisan.perikatan/i.test(String(o)));
    const idx = bnPnIdx >= 0 ? bnPnIdx : 0; // fallback to first outcome if no match
    const bnPnPrice = parseFloat(outcomePrices[idx]);
    if (isNaN(bnPnPrice)) {
      result.status = 'MALFORMED';
      result.note = 'BN-PN outcome price parse failed.';
      return result;
    }

    result.status = 'LIVE_MATCH';
    result.n9_market = {
      id: chosen.id,
      question: chosen.question,
      slug: chosen.slug,
      outcomes,
      outcomePrices: outcomePrices.map(String),
      selected_outcome: outcomes[idx],
      selected_price_pct: pct(bnPnPrice),
      volume: chosen.volume,
      endDate: chosen.endDate,
      matched_at: nowISO()
    };
    result.note = `Live N9 coalition market found: outcome="${outcomes[idx]}" → ${pct(bnPnPrice)}%`;
    return result;
  } catch (e) {
    result.status = 'EXCEPTION';
    result.error = e.message;
    result.note = `Polymarket probe exception: ${e.message}`;
    return result;
  }
}

// ── main ──────────────────────────────────────────────────────────────
(async () => {
  const generatedAt = nowISO();
  const warnings = [];
  let topHealth = HEALTH_OK;

  // 1. Read sealed ground truth
  const sealed = safeReadJSON(SEALED_GROUND_TRUTH);
  const validation = validateSealed(sealed);
  if (!validation.ok) {
    topHealth = HEALTH_DEGRADED;
    const degraded = {
      metadata: {
        title: 'Negeri Sembilan PRN 2026 Live Telemetry (DEGRADED)',
        updated_at_utc: generatedAt,
        sealed_by: 'arifOS VAULT999 (DEGRADED)',
        status: HEALTH_DEGRADED,
        health: HEALTH_DEGRADED,
        version: '2.3.0',
        generated_at_utc: generatedAt,
        warning: 'Sealed ground truth missing or invalid: ' + validation.error
      },
      summary_metrics: null,
      provenance: { sealed_ground_truth: validation.error }
    };
    const srcResult = atomicWrite(SOURCE_PATH, degraded);
    const liveResult = atomicWrite(LIVE_PATH, degraded);
    if (!srcResult.ok) warnings.push('source_write_failed: ' + srcResult.error);
    if (!liveResult.ok) warnings.push('live_write_failed: ' + liveResult.error);
    if (warnings.length === 0) {
      console.log('✓ DEGRADED payload emitted (both webroots)');
      process.exit(0);
    }
    console.error('⚠ DEGRADED emit + write issues: ' + warnings.join('; '));
    process.exit(2);
  }

  // 2. Probe Polymarket
  const polymarket = await probePolymarket();
  if (polymarket.status === 'PROBE_FAILED' || polymarket.status === 'EXCEPTION') {
    topHealth = HEALTH_LIVE_PARTIAL;
  }
  if (polymarket.status === 'NO_MARKET' || polymarket.status === 'NO_COALITION_OUTCOME') {
    // No live market exists — still HEALTH_SEALED_ONLY (sealed path is primary)
    // unless there was also a probe failure
    if (topHealth === HEALTH_OK) topHealth = HEALTH_SEALED_ONLY;
  }

  // 3. Derive observations from sealed file (with epistemic_class)
  const obs = sealed.observations || {};
  const sentiment = obs.popular_vote_pct_vodus_n437 || null;
  const turnout = (sealed.render_hints && sealed.render_hints.voter_turnout_projection_pct) || null;

  // 4. Seat signals — each carries its own epistemic_class (INT, source SOVEREIGN)
  const intSeats = sealed.interpretations?.hotseat_signals?.seats || [];
  const seatSignals = intSeats.map((s) => ({
    code: s.code,
    name: s.name,
    status: s.status,
    live_sentiment: s.live_sentiment,
    note: s.note,
    epistemic_class: 'INT',
    source: 'SOVEREIGN_PROJECTION_2026_07_31',
    as_of: sealed.as_of
  }));

  // 5. BN-PN coalition forecast — Polymarket wins if LIVE_MATCH, else sealed sovereign projection
  let coalitionForecastPct = null;
  let coalitionForecastLabel = null;
  let coalitionSourceAsOf = null;
  if (polymarket.status === 'LIVE_MATCH' && polymarket.n9_market) {
    coalitionForecastPct = polymarket.n9_market.selected_price_pct;
    coalitionForecastLabel = 'live_polymarket';
    coalitionSourceAsOf = polymarket.n9_market.matched_at;
  } else {
    const sovereignForecast = sealed.interpretations?.sovereign_coalition_forecast;
    if (sovereignForecast && typeof sovereignForecast.bn_pn_coalition_forecast_pct === 'number') {
      // BLOCKER B5 + drift fix: read directly from typed numeric field, NOT regex
      coalitionForecastPct = pct(sovereignForecast.bn_pn_coalition_forecast_pct);
      coalitionForecastLabel = sovereignForecast.bn_pn_coalition_forecast_label || 'sovereign_projection';
      coalitionSourceAsOf = sovereignForecast.source ? sealed.sources?.[sovereignForecast.source]?.as_of || sealed.as_of : sealed.as_of;
    }
  }

  // 6. Build payload with per-field provenance + epistemic_class
  const payload = {
    metadata: {
      title: 'Negeri Sembilan PRN 2026 Live Sensory Telemetry',
      updated_at_utc: generatedAt,
      generated_at_utc: generatedAt,
      sealed_by: 'arifOS VAULT999 SENSORY HUB',
      seal_id: sealed.seal_id,
      status: topHealth === HEALTH_OK ? 'LIVE_STREAMING' :
              topHealth === HEALTH_SEALED_ONLY ? 'SEALED_STREAMING' :
              topHealth === HEALTH_LIVE_PARTIAL ? 'LIVE_PARTIAL' : 'DEGRADED',
      health: topHealth,
      version: '2.3.0',
      schema: 'arifos.n9.telemetry.v3',
      health_legend: {
        OK:           'all upstreams healthy',
        SEALED_ONLY:  'no live market exists; sealed ground truth is authoritative',
        LIVE_PARTIAL: 'live market probed but degraded; sealed fallback engaged',
        DEGRADED:     'sealed file invalid or write failed; emit incomplete payload'
      }
    },
    summary_metrics: {
      sentiment_index: sentiment ? {
        ph_positive: sentiment.PH,
        bn_positive: sentiment.BN,
        pn_positive: sentiment.PN,
        epistemic_class: sentiment.epistemic_class || 'OBS',
        source: sealed.sources?.[sentiment.source]?.kind || sentiment.source,
        source_id: sentiment.source,
        source_url: sealed.sources?.[sentiment.source]?.url || null,
        as_of: sealed.sources?.[sentiment.source]?.as_of || sealed.as_of,
        note: sealed.sources?.[sentiment.source]?.note || null
      } : null,
      voter_turnout_projection_pct: turnout,
      voter_turnout_projection_source: sealed.render_hints?.voter_turnout_projection_source || null,
      highest_volatility_seat: seatSignals.find((s) => s.status === 'HOT_EPICENTER')?.name || null,
      bn_pn_coalition_forecast_pct: coalitionForecastPct,
      bn_pn_coalition_forecast_label: coalitionForecastLabel,
      bn_pn_coalition_forecast_source_as_of: coalitionSourceAsOf
    },
    polymarket: {
      probed_at_utc: polymarket.probed_at,
      status: polymarket.status,
      markets_scanned: polymarket.markets_scanned,
      matches_found: polymarket.matches_found,
      n9_market: polymarket.n9_market,
      note: polymarket.note,
      error: polymarket.error || null
    },
    ground_telemetry_seats: seatSignals,
    sovereign_synthesis: sealed.interpretations?.sovereign_coalition_forecast || null,
    warnings: warnings.length > 0 ? warnings : null
  };

  // 7. Dual-write (atomic per destination)
  const srcResult = atomicWrite(SOURCE_PATH, payload);
  const liveResult = atomicWrite(LIVE_PATH, payload);

  if (!srcResult.ok) warnings.push('source_write_failed: ' + srcResult.error);
  if (!liveResult.ok) warnings.push('live_write_failed: ' + liveResult.error);
  if (warnings.length > 0) topHealth = HEALTH_DEGRADED;

  // Re-stamp the payload with final warnings/health if degraded after write
  if (warnings.length > 0) {
    payload.warnings = warnings;
    payload.metadata.health = HEALTH_DEGRADED;
    payload.metadata.status = 'DEGRADED';
    // Best-effort re-write of both destinations with final state
    atomicWrite(SOURCE_PATH, payload);
    atomicWrite(LIVE_PATH, payload);
  }

  console.log(
    '✓ ' +
    (srcResult.ok ? 'src:OK' : 'src:FAIL') + ' + ' +
    (liveResult.ok ? 'live:OK' : 'live:FAIL') +
    ' | health=' + topHealth +
    ' | polymarket=' + polymarket.status +
    ' | bn_pn_forecast=' + (coalitionForecastPct !== null ? coalitionForecastPct + '%(' + coalitionForecastLabel + ')' : 'null') +
    ' | sha=' + (liveResult.sha256 || srcResult.sha256 || 'n/a').slice(0, 12)
  );
})();