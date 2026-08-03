/* ═══════════════════════════════════════════════════════════════════
   zen-market.js — consolidated market engine for GOLD · GAS · OIL
   Replaces 3 × ~800 lines of copy-pasted inline JS (2026-07-26).
   Per-page differences live in window.ZEN_MARKET (set before this script):

     window.ZEN_MARKET = {
       asset:      'gold',                 // api asset key + validation
       label:      'XAUUSD',               // display label
       apiBase:    '/wealth/gold/api',     // origin-relative API base
       stanceKey:  'gold_stance',          // safe-storage key
       rrMarginal: 1.2,                    // gas: 1.5
       chartAccent:'#c9a84c',              // cone/crosshair/entry line
       macro:      ['dxy','us10y','vix','silver','gsr','usmyr'],
       driverExtra: function (t, fmt, macro) {    // extra pulse-driver segment
         // macro.usmyr = live USD/MYR from /macro (fallback 4.35 if absent)
         return ' · XAU/MYR: RM ' + fmt((t.price || 0) * (macro.usmyr || 4.35) / 31.1035) + '/gram';
       },
     }

   Data contract (unchanged): /snapshot /apex /signal_v2 /forecast
   /history /calendar — wealth.*.v1 schemas, 8s timeout, null on failure.
   DITEMPA BUKAN DIBERI · v1.0 · F13: ARIF
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var ZM = window.ZEN_MARKET || {};
  var CONFIG = {
    API_BASE: window.location.origin + (ZM.apiBase || '/wealth/' + (ZM.asset || 'gold') + '/api'),
    REFRESH_INTERVAL: 300000,
    TIMEZONE: 'Asia/Kuala_Lumpur',
    ASSET: ZM.asset || 'gold',
    RR_MARGINAL: ZM.rrMarginal || 1.2,
    ACCENT: ZM.chartAccent || '#c9a84c',
    TF_INTERVALS: { '1H': '1h', '4H': '1h', '1D': '1d', '1W': '1wk' },
    TF_PERIODS: { '1H': '7d', '4H': '30d', '1D': '3mo', '1W': '6mo' },
  };
  var TAG = '[' + CONFIG.ASSET + ']';

  var currentTF = '4H';
  var activeEMAs = { '20': true, '50': true, '200': true };
  var chartDataCache = {};
  var latestSnapshot = null;

  var $ = function (id) { return document.getElementById(id); };
  var fmt = function (n, d) {
    d = d === undefined ? 2 : d;
    return Number(n || 0).toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
  };
  var store = window.zsStore || { get: function () { return null; }, set: function () {} };

  // ── Plain-language translator for arifOS judge reasons ──
  function translateJudge(reason) {
    if (!reason) return 'Wait for clearer signal before entry.';
    var txt = reason
      .replace(/F\d+:[^;]*;?/g, '')
      .replace(/RR ratio [\d.]+ < 1\.5[^;]*;?/g, '')
      .replace(/Confluence score [\d.]* too low;?/g, '')
      .replace(/Signal strength NONE[^;]*;?/g, '')
      .replace(/No clear direction[^;]*;?/g, '')
      .replace(/\s+/g, ' ').trim();
    if (!txt || txt.length < 10) {
      if (reason.indexOf('SABAR') !== -1) return 'Market not yet clear. Wait for trend + signal to align before entry.';
      if (reason.indexOf('HOLD') !== -1) return 'Risk unresolved. Do not enter yet.';
      return 'Check entry conditions before deciding.';
    }
    return txt
      .replace(/insufficient reward/g, 'reward does not justify risk')
      .replace(/no evidence basis/g, 'insufficient evidence')
      .replace(/no confluence factors/g, 'signals not aligned')
      .replace(/not enough confluence/g, 'mixed signals');
  }

  // ── Freshness + reconciliation + watchdog ──
  var firstViewportRendered = false;
  function updateFreshness(snapshot) {
    if (!snapshot || !snapshot.observed_at) return;
    var ts = new Date(snapshot.observed_at);
    var hhmm = ts.toLocaleTimeString('en-MY', { timeZone: CONFIG.TIMEZONE, hour: '2-digit', minute: '2-digit', hour12: false });
    var asOfEl = $('maAsOf'); if (asOfEl) asOfEl.textContent = hhmm + ' MYT';
    var lastEl = $('maLastVerified'); if (lastEl) lastEl.textContent = hhmm + ' MYT';
    var unavail = $('maUnavailable'); if (unavail) unavail.hidden = true;
    firstViewportRendered = true;
  }

  function updateReconciliation(snapshot) {
    var el = $('maReconcile');
    if (!el) return;
    el.hidden = true;
    if (!snapshot || !snapshot.levels) return;
    var levels = snapshot.levels;
    var emaTrend = (snapshot.ticker && snapshot.ticker.emaTrend) || 'NEUTRAL';
    var s1 = (levels.support || [])[0];
    var r1 = (levels.resistance || [])[0];
    var price = (snapshot.ticker && snapshot.ticker.price) || 0;
    if (emaTrend === 'BEARISH' && price && s1 && r1 && price > r1) {
      el.textContent = 'Intraday bounce inside daily downtrend · direction may flip on retest of S1';
      el.hidden = false;
    } else if (emaTrend === 'BULLISH' && price && s1 && r1 && price < s1) {
      el.textContent = 'Intraday dip inside daily uptrend · direction may flip on retest of R1';
      el.hidden = false;
    }
  }

  var firstViewportWatchdog = null;
  function armFirstViewportWatchdog() {
    if (firstViewportWatchdog) clearTimeout(firstViewportWatchdog);
    firstViewportWatchdog = setTimeout(function () {
      if (!firstViewportRendered) {
        var ts = $('pulseTimestamp'); if (ts) ts.textContent = 'Data unavailable';
        var unavail = $('maUnavailable'); if (unavail) unavail.hidden = false;
      }
    }, 10000);
  }

  // ── API fetch with 8s timeout ──
  function apiFetch(endpoint) {
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 8000);
    return fetch(CONFIG.API_BASE + endpoint, { signal: controller.signal })
      .then(function (resp) {
        clearTimeout(timeout);
        if (!resp.ok) throw new Error('HTTP ' + resp.status);
        return resp.json();
      })
      .catch(function (err) {
        clearTimeout(timeout);
        console.warn(TAG, endpoint, 'failed:', err.message);
        return null;
      });
  }

  // ── Chart (guarded — chart failure never kills data panels) ──
  var chart = null, candleSeries = null, emaSeries = {};
  function hexToRgba(hex, a) {
    var h = hex.replace('#', '');
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }
  function initChart() {
    if (chart) return true;
    var el = $('mainChart');
    if (!el) return false;
    if (typeof LightweightCharts === 'undefined') {
      el.innerHTML = '<div style="padding:3rem 1rem;text-align:center;color:var(--faint);font-family:var(--mono);font-size:.75rem">⚠ CHART OFFLINE — data panels live</div>';
      return false;
    }
    try {
      chart = LightweightCharts.createChart(el, {
        autoSize: true,
        layout: {
          background: { type: 'solid', color: '#11151c' },
          textColor: '#8b98a8',
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
        },
        grid: {
          vertLines: { color: 'rgba(31,39,51,0.6)' },
          horzLines: { color: 'rgba(31,39,51,0.6)' },
        },
        crosshair: {
          mode: LightweightCharts.CrosshairMode.Normal,
          vertLine: { color: hexToRgba(CONFIG.ACCENT, .3), width: 1, style: LightweightCharts.LineStyle.Dashed },
          horzLine: { color: hexToRgba(CONFIG.ACCENT, .3), width: 1, style: LightweightCharts.LineStyle.Dashed },
        },
        rightPriceScale: { borderColor: '#1f2733', scaleMargins: { top: 0.1, bottom: 0.1 } },
        timeScale: { borderColor: '#1f2733', timeVisible: true, secondsVisible: false },
        handleScroll: { vertTouchDrag: false },
      });
      candleSeries = chart.addCandlestickSeries({
        upColor: '#31c48d', downColor: '#f0506e',
        borderUpColor: '#31c48d', borderDownColor: '#f0506e',
        wickUpColor: '#31c48d', wickDownColor: '#f0506e',
      });
      emaSeries = {
        '20': chart.addLineSeries({ color: '#e3b341', lineWidth: 1, visible: activeEMAs['20'] }),
        '50': chart.addLineSeries({ color: '#4aa8ff', lineWidth: 1, visible: activeEMAs['50'] }),
        '200': chart.addLineSeries({ color: '#5a6675', lineWidth: 1, visible: activeEMAs['200'] }),
      };
      return true;
    } catch (err) {
      console.warn(TAG, 'chart init failed:', err.message);
      el.innerHTML = '<div style="padding:3rem 1rem;text-align:center;color:var(--faint);font-family:var(--mono);font-size:.75rem">⚠ CHART OFFLINE — data panels live</div>';
      chart = null; candleSeries = null; emaSeries = {};
      return false;
    }
  }

  // ── Position markers ──
  var positionLines = [];
  function clearPositionLines() {
    positionLines.forEach(function (pl) { try { candleSeries.removePriceLine(pl); } catch (e) {} });
    positionLines = [];
  }
  function plotPositionMarkers(sig) {
    if (!candleSeries) return;
    clearPositionLines();
    if (!sig.entry_price || !sig.stop_loss || sig.direction === 'FLAT') return;
    var rr = sig.rr_ratio || 0;
    var rrLabel = rr > 0 ? 'ENTRY · R:R 1:' + rr.toFixed(1) : 'ENTRY';
    positionLines.push(candleSeries.createPriceLine({
      price: sig.entry_price, color: CONFIG.ACCENT, lineWidth: 2,
      lineStyle: LightweightCharts.LineStyle.Solid, axisLabelVisible: true, title: rrLabel,
    }));
    if (sig.stop_loss > 0) {
      positionLines.push(candleSeries.createPriceLine({
        price: sig.stop_loss, color: '#f0506e', lineWidth: 1.5,
        lineStyle: LightweightCharts.LineStyle.Dashed, axisLabelVisible: true,
        title: 'SL · Risk $' + Math.abs(sig.entry_price - sig.stop_loss).toFixed(1),
      }));
    }
    if (sig.take_profit_1 > 0) {
      positionLines.push(candleSeries.createPriceLine({
        price: sig.take_profit_1, color: '#31c48d', lineWidth: 1.5,
        lineStyle: LightweightCharts.LineStyle.Dashed, axisLabelVisible: true,
        title: 'TP1 · Reward $' + Math.abs(sig.take_profit_1 - sig.entry_price).toFixed(1),
      }));
    }
    if (sig.take_profit_2 > 0) {
      positionLines.push(candleSeries.createPriceLine({
        price: sig.take_profit_2, color: '#31c48d', lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle.Dotted, axisLabelVisible: true, title: 'TP2',
      }));
    }
  }

  function computeEMA(candles, period) {
    var k = 2 / (period + 1);
    var result = [];
    var ema = (candles[0] && candles[0].close) || 0;
    for (var i = 0; i < candles.length; i++) {
      if (i === 0) ema = candles[i].close;
      else if (i < period - 1) ema = candles.slice(0, i + 1).reduce(function (s, c) { return s + c.close; }, 0) / (i + 1);
      else ema = candles[i].close * k + ema * (1 - k);
      result.push({ time: candles[i].time, value: +ema.toFixed(2) });
    }
    return result;
  }

  // ── Forecast cone (wealth.forecast.v1) ──
  var coneSeries = null, forecastCache = {}, currentHorizon = 30, latestForecast = null;
  function loadForecast(horizon) {
    var hit = forecastCache[horizon];
    if (hit && (Date.now() - hit._ts) < 300000) return Promise.resolve(hit);
    return apiFetch('/forecast?horizon=' + horizon).then(function (d) {
      if (d && d.schema === 'wealth.forecast.v1' && d.cone && d.cone.t) {
        d._ts = Date.now();
        forecastCache[horizon] = d;
        return d;
      }
      return null;
    });
  }
  function ensureConeSeries() {
    if (coneSeries || !chart) return;
    var mk = function (color, width, style) {
      return chart.addLineSeries({
        color: color, lineWidth: width, lineStyle: style,
        priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false,
      });
    };
    var D = LightweightCharts.LineStyle.Dashed, T = LightweightCharts.LineStyle.Dotted;
    coneSeries = {
      p10: mk(hexToRgba(CONFIG.ACCENT, .22), 1, T),
      p25: mk(hexToRgba(CONFIG.ACCENT, .45), 1, D),
      p50: mk(CONFIG.ACCENT, 2, D),
      p75: mk(hexToRgba(CONFIG.ACCENT, .45), 1, D),
      p90: mk(hexToRgba(CONFIG.ACCENT, .22), 1, T),
    };
  }
  function renderCone(candles) {
    loadForecast(currentHorizon).then(function (fc) {
      if (!fc || !chart || !candleSeries || !candles || !candles.length) return;
      latestForecast = fc;
      ensureConeSeries();
      var lastT = candles[candles.length - 1].time;
      var toPts = function (arr) {
        return arr.map(function (v, i) {
          return { time: Math.floor(new Date(fc.cone.t[i] + 'T00:00:00Z').getTime() / 1000), value: v };
        }).filter(function (p) { return p.time > lastT; });
      };
      ['p10', 'p25', 'p50', 'p75', 'p90'].forEach(function (k) { coneSeries[k].setData(toPts(fc.cone[k])); });
      updatePredictionCard(fc);
    });
  }

  window.selectHorizon = function (btn) {
    var h = parseInt(btn.dataset.horizon, 10);
    if (h === currentHorizon) return;
    currentHorizon = h;
    document.querySelectorAll('.cone-toggle').forEach(function (b) { b.classList.toggle('active', b === btn); });
    var payload = chartDataCache[currentTF];
    if (payload && payload.candles) renderCone(payload.candles);
  };

  function updatePredictionCard(fc) {
    var b = fc.basis || {};
    var end = (fc.cone.p50 || []).length - 1;
    if (end < 0) return;
    var L = (fc.scenarios || []).filter(function (s) { return s.side === 'LONG'; })[0];
    var S = (fc.scenarios || []).filter(function (s) { return s.side === 'SHORT'; })[0];
    var tf = '1D';

    if ($('predCurrent')) {
      $('predCurrent').textContent = '$' + fmt(b.close);
      $('predCurrentSub').textContent = fc.generated_at ? 'engine · ' + fc.generated_at.slice(11, 16) + ' MYT' : 'engine';
      $('predRange').textContent = '$' + fmt(fc.cone.p25[end]) + ' – $' + fmt(fc.cone.p75[end]);
      $('predRangeSub').textContent = currentHorizon + '-day cone · p25–p75';
      $('predBias').textContent = (fc.bias || '—') + ' · ' + tf;
      $('predBias').style.color = fc.bias === 'BULLISH' ? 'var(--seal)' : (fc.bias === 'BEARISH' ? 'var(--void)' : 'var(--sabar)');
      $('predBiasSub').textContent = 'confluence L' + (L ? L.confluence : '–') + '/5 · S' + (S ? S.confluence : '–') + '/5';
      if (L) {
        $('predKey').textContent = '$' + fmt(L.invalidation);
        $('predKeySub').textContent = 'Support 1 · ' + tf;
      }
    }
    if ($('predScenarios') && L && S) {
      var rungRR = function (trigger, invalidation, objective) {
        if (![trigger, invalidation, objective].every(function (v) { return typeof v === 'number' && isFinite(v); })) return null;
        var risk = Math.abs(trigger - invalidation);
        var reward = Math.abs(objective - trigger);
        if (risk <= 0) return null;
        var rr = reward / risk;
        return rr >= 1.0 ? rr : null;
      };
      var longRR = rungRR(+S.invalidation, +L.invalidation, +L.objective);
      var shortRR = rungRR(+L.invalidation, +S.invalidation, +S.objective);
      var rows = [];
      if (longRR !== null) {
        rows.push('<div class="scenario-row"><b>▲ LONG</b><span>' + L.trigger + '</span><span>→ <b>$' + fmt(L.objective) + '</b></span><span>invalid $' + fmt(L.invalidation) + '</span><span>R:R 1:' + fmt(longRR, 1) + '</span><span>ETA ' + L.eta_days + 'd</span><span>conf ' + L.confluence + '/5</span></div>');
      }
      if (shortRR !== null) {
        rows.push('<div class="scenario-row"><b>▼ SHORT</b><span>' + S.trigger + '</span><span>→ <b>$' + fmt(S.objective) + '</b></span><span>invalid $' + fmt(S.invalidation) + '</span><span>R:R 1:' + fmt(shortRR, 1) + '</span><span>ETA ' + S.eta_days + 'd</span><span>conf ' + S.confluence + '/5</span></div>');
      }
      $('predScenarios').innerHTML = rows.length ? rows.join('') : '<div class="market-answer-no-setup">SABAR · No active setup</div>';
    }
    if ($('predRead')) {
      $('predRead').innerHTML = '<b>Why:</b> ' + (fc.institutional_read || '') + (fc.epistemic ? ' — ' + fc.epistemic : '');
    }
    if ($('mt-s1') && L && S) {
      $('mt-s1').textContent = '$' + fmt(L.invalidation);
      $('mt-s2').textContent = '$' + fmt(S.objective);
      $('mt-r1').textContent = '$' + fmt(S.invalidation);
      $('mt-r2').textContent = '$' + fmt(L.objective);
      $('mt-ma50').textContent = '$' + fmt(b.ema50);
      $('mt-ma200').textContent = '$' + fmt(b.ema200);
    }
  }

  // ── Chart data ──
  function loadChartData(tf) {
    var interval = CONFIG.TF_INTERVALS[tf] || '1h';
    var period = CONFIG.TF_PERIODS[tf] || '30d';
    if (chartDataCache[tf]) return Promise.resolve(chartDataCache[tf]);
    return apiFetch('/history?interval=' + interval + '&period=' + period).then(function (data) {
      if (data && data.candles && data.candles.length > 0) {
        var norm = function (arr) {
          return (arr || []).map(function (p) {
            return { time: typeof p.time === 'number' ? p.time : Math.floor(new Date(p.time + 'Z').getTime() / 1000), value: p.value };
          });
        };
        var payload = {
          candles: data.candles.map(function (c) {
            return {
              time: typeof c.time === 'number' ? c.time : Math.floor(new Date(c.time + 'Z').getTime() / 1000),
              open: +c.open, high: +c.high, low: +c.low, close: +c.close,
            };
          }),
          ema: { '20': norm(data.ema20), '50': norm(data.ema50), '200': norm(data.ema200) },
        };
        chartDataCache[tf] = payload;
        return payload;
      }
      return null;
    });
  }

  function renderChart(tf) {
    currentTF = tf;
    if (!initChart()) return Promise.resolve();
    return loadChartData(tf).then(function (payload) {
      if (!payload || !payload.candles || !payload.candles.length) {
        console.warn(TAG, 'no chart data for TF:', tf);
        return;
      }
      var candles = payload.candles;
      candleSeries.setData(candles);
      Object.keys(emaSeries).forEach(function (period) {
        var server = payload.ema && payload.ema[period];
        var emaData = (server && server.length === candles.length) ? server : computeEMA(candles, parseInt(period, 10));
        emaSeries[period].setData(emaData);
      });
      renderCone(candles);
      chart.timeScale().fitContent();
      document.querySelectorAll('.tf-pill').forEach(function (b) {
        b.classList.toggle('active', b.dataset.tf === tf);
      });
    });
  }

  window.selectTF = function (btn) {
    var tf = btn.dataset.tf;
    if (tf === currentTF) return;
    document.querySelectorAll('.tf-pill').forEach(function (b) { b.classList.remove('active'); });
    btn.classList.add('active');
    renderChart(tf);
  };

  window.toggleEMA = function (btn) {
    var period = btn.dataset.ema;
    activeEMAs[period] = !activeEMAs[period];
    btn.classList.toggle('active', activeEMAs[period]);
    if (emaSeries[period]) emaSeries[period].applyOptions({ visible: activeEMAs[period] });
  };

  // ── Reality packet (JSON-LD) ──
  function updateRealityPacket(snapshot) {
    var pktEl = $('wealth-reality-packet');
    if (!pktEl) return;
    try {
      var pkt = JSON.parse(pktEl.textContent);
      var ticker = snapshot.ticker || {};
      var levels = snapshot.levels || {};
      var macro = snapshot.macro || {};
      pkt.schema = snapshot.schema;
      pkt.observed_at = snapshot.observed_at;
      pkt.timestamp = snapshot.observed_at;
      pkt.coherence_id = snapshot.coherence_id;
      if (pkt.market_state) {
        pkt.market_state.symbol = ticker.symbol || pkt.market_state.symbol;
        pkt.market_state.price_usd = ticker.price;
        pkt.market_state.change_pct = ticker.changePct;
        pkt.market_state.regime = ticker.emaTrend || null;
        pkt.market_state.rsi_14 = ticker.rsi;
        pkt.market_state.ema_trend = ticker.emaTrend || null;
        pkt.market_state.key_levels = { support: levels.support || [], resistance: levels.resistance || [] };
      }
      if (pkt.economic_trinity && pkt.economic_trinity.fx) {
        pkt.economic_trinity.fx.global = macro.dxy == null ? 'Live DXY and rates unavailable' : 'DXY ' + macro.dxy + ' · live rates unavailable';
      }
      pktEl.textContent = JSON.stringify(pkt, null, 2);
    } catch (err) {
      console.warn(TAG, 'packet update failed:', err.message);
    }
  }

  function refreshSnapshot() {
    return apiFetch('/snapshot').then(function (snapshot) {
      if (!snapshot || snapshot.schema !== 'wealth.snapshot.v1' || snapshot.asset !== CONFIG.ASSET ||
          !snapshot.observed_at || !snapshot.ticker || !snapshot.levels || !snapshot.macro ||
          !snapshot.coherence_id) return null;
      latestSnapshot = snapshot;
      updateRealityPacket(snapshot);
      updateFreshness(snapshot);
      updateReconciliation(snapshot);
      return snapshot;
    });
  }

  // ── Ticker + hero pulse ──
  function refreshTicker(force) {
    return (force || !latestSnapshot ? refreshSnapshot() : Promise.resolve(latestSnapshot)).then(function (snapshot) {
      if (!snapshot) return;
      var levels = snapshot.levels || {};
      var data = Object.assign({}, snapshot.ticker || {}, {
        support: levels.support || [],
        resistance: levels.resistance || [],
      });

      if ($('pulsePrice')) $('pulsePrice').textContent = '$' + fmt(data.price);
      var delta = data.change || 0;
      var pct = data.changePct || 0;
      var isUp = delta >= 0;

      var dEl = $('pulseDelta');
      if (dEl) { dEl.textContent = (isUp ? '+' : '') + fmt(delta); dEl.className = 'pulse-delta ' + (isUp ? 'up' : 'down'); }
      var pEl = $('pulsePct');
      if (pEl) pEl.textContent = '(' + (isUp ? '+' : '') + fmt(pct) + '%)';

      var bias = $('biasPill');
      var emaTrend = data.emaTrend || 'NEUTRAL';
      var biasTf = currentTF || '4H';
      if (bias) {
        if (emaTrend === 'BULLISH') { bias.textContent = 'Bullish · ' + biasTf; bias.className = 'bias-pill bullish'; }
        else if (emaTrend === 'BEARISH') { bias.textContent = 'Bearish · ' + biasTf; bias.className = 'bias-pill bearish'; }
        else { bias.textContent = 'Neutral · ' + biasTf; bias.className = 'bias-pill neutral'; }
      }

      if (data.support && data.resistance && $('pulseLevels')) {
        $('pulseLevels').innerHTML =
          '<span class="level-chip support">S1<span class="val">$' + fmt(data.support[0]) + '</span></span>' +
          '<span class="level-chip support">S2<span class="val">$' + fmt(data.support[1]) + '</span></span>' +
          '<span class="level-chip resistance">R1<span class="val">$' + fmt(data.resistance[0]) + '</span></span>' +
          '<span class="level-chip resistance">R2<span class="val">$' + fmt(data.resistance[1]) + '</span></span>';
      }

      if ($('riskBars')) {
        var bars = $('riskBars').children;
        var riskLevel = data.signal === 'SELL' ? 5 : data.signal === 'NEUTRAL' ? 3 : 1;
        for (var i = 0; i < bars.length; i++) {
          bars[i].className = 'risk-bar' + (i < riskLevel ? ' active ' + (i < 2 ? 'low' : i < 4 ? 'med' : 'high') : '');
        }
      }

      if ($('pulseTimestamp')) {
        var now = new Date(snapshot.observed_at);
        var isStale = (data.stale === true) || (Date.now() - now.getTime() > 10 * 60 * 1000);
        var freshBadge = isStale
          ? '<span style="color:var(--hold)">⚠ STALE</span> '
          : '<span style="color:var(--seal)">● LIVE</span> ';
        $('pulseTimestamp').innerHTML = freshBadge + now.toLocaleString('en-MY', {
          timeZone: CONFIG.TIMEZONE, year: 'numeric', month: '2-digit',
          day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false,
        }) + ' MYT';
        var liveDot = document.querySelector('.zs-status .live-dot');
        if (liveDot) liveDot.className = 'live-dot ' + (isStale ? 'stale' : 'on');
      }

      if ($('pulseDriver')) {
        var rsi = data.rsi || 50;
        var rsiState = data.rsiState || 'NEUTRAL';
        var extra = '';
        try {
          extra = (typeof ZM.driverExtra === 'function')
            ? ZM.driverExtra(data, fmt, (snapshot && snapshot.macro) || {})
            : '';
        } catch (driverErr) {
          console.warn(TAG, 'driverExtra failed:', driverErr.message);
          extra = '';
        }
        $('pulseDriver').innerHTML = '<strong>RSI ' + fmt(rsi, 1) + '</strong> — ' + rsiState + extra + ' · TF: 1H levels, 4H regime';
      }
    });
  }

  // ── Market Pulse (APEX) ──
  function refreshApex() {
    return apiFetch('/apex').then(function (d) {
      if (!d) return;

      var g = d.G || 0;
      var gEl = $('apexG');
      if (gEl) {
        gEl.textContent = g >= 0.5 ? 'Clear' : g >= 0.3 ? 'Mixed' : 'Murky';
        gEl.style.color = g >= 0.5 ? 'var(--seal)' : g >= 0.3 ? 'var(--sabar)' : 'var(--void)';
      }
      var c = d.C_dark || 0;
      var cEl = $('apexCdark');
      if (cEl) {
        cEl.textContent = c < 0.15 ? 'Low' : c < 0.3 ? 'Medium' : 'High';
        cEl.style.color = c < 0.15 ? 'var(--seal)' : c < 0.3 ? 'var(--sabar)' : 'var(--void)';
      }
      var ds = d.dS || 0;
      var dsEl = $('apexDS');
      if (dsEl) {
        dsEl.textContent = ds > 0.05 ? 'Building' : ds < -0.05 ? 'Fading' : 'Steady';
        dsEl.style.color = ds > 0.05 ? 'var(--sabar)' : ds < -0.05 ? 'var(--dim)' : 'var(--action)';
      }
      var stateEl = $('apexState');
      if (stateEl) {
        var stateMap = { 'CLARITY': 'Clear Trend', 'STABLE': 'Ranging', 'CHAOS': 'Choppy' };
        stateEl.textContent = stateMap[d.state] || d.state || '—';
      }
      if (d.direction && $('apexDirection')) {
        $('apexDirection').textContent = (d.direction || '—') + ' · ' + (currentTF || '4H');
      }
      var vEl = $('apexVerdict');
      if (vEl) {
        var verdictMap = { 'SEAL': 'Strong Signal', 'SABAR': 'Wait', 'HOLD': 'Hold', 'VOID': 'Refused' };
        vEl.textContent = verdictMap[d.verdict] || d.verdict || 'SABAR';
        vEl.className = 'apex-verdict ' + (d.verdict || 'sabar').toLowerCase();
      }
      var maEl = $('maVerdict');
      if (maEl) {
        var v = ({ 'SEAL': 'SEAL', 'PROCEED': 'SEAL', 'SABAR': 'SABAR', 'HOLD': 'HOLD', 'VOID': 'VOID' })[d.verdict] || 'SABAR';
        maEl.textContent = v;
        maEl.className = 'zs-badge ' + v;
      }
      var sigEl = $('signalLastUpdated');
      if (sigEl) sigEl.textContent = new Date().toLocaleTimeString('en-MY', { timeZone: CONFIG.TIMEZONE });

      var ap = d.apex || {};
      var setPrim = function (id, val, label) {
        var e = $(id);
        if (e) {
          e.textContent = label + ': ' + Math.round((val || 0) * 100) + '%';
          e.style.color = val >= 0.6 ? 'var(--seal)' : val >= 0.3 ? 'var(--dim)' : 'var(--void)';
        }
      };
      if (ap.A !== undefined) setPrim('apexA', ap.A, 'Structure');
      if (ap.P !== undefined) setPrim('apexP', ap.P, 'Strength');
      if (ap.E !== undefined) setPrim('apexE', ap.E, 'Signal');
      if (ap.X !== undefined) setPrim('apexX', ap.X, 'Stability');
      if (ap.Phi !== undefined) setPrim('apexPhi', ap.Phi, 'Agreement');

      if (d.momentum !== undefined && $('apexMom')) {
        $('apexMom').textContent = 'Momentum: ' + (d.momentum >= 0 ? '+' : '') + fmt(d.momentum, 3);
        $('apexMom').style.color = d.momentum >= 0 ? 'var(--seal)' : 'var(--void)';
      }
      if (d.volume_trend && $('apexVolTrend')) {
        $('apexVolTrend').textContent = 'Volume: ' + d.volume_trend;
        $('apexVolTrend').style.color = d.volume_trend === 'rising' ? 'var(--seal)' : 'var(--sabar)';
      }

      var confPct = Math.round((d.confidence || 0.5) * 100);
      if ($('confluenceScore')) $('confluenceScore').textContent = confPct + '%';
      if ($('confluenceBar')) {
        $('confluenceBar').style.width = confPct + '%';
        $('confluenceBar').className = 'confluence-bar-fill ' + (confPct >= 65 ? 'high' : confPct >= 40 ? 'med' : 'low');
      }
      if ($('biasConfluence')) $('biasConfluence').textContent = confPct + '% confluence';
    });
  }

  // ── Macro strip ──
  function refreshMacro() {
    return (latestSnapshot ? Promise.resolve(latestSnapshot) : refreshSnapshot()).then(function (snapshot) {
      var data = snapshot && snapshot.macro;
      if (!data) return;
      var setMacro = function (id, value, change) {
        var el = $(id);
        if (!el) return;
        el.textContent = value || '—';
        if (change !== undefined) {
          var isUp = change >= 0;
          el.innerHTML += ' <span class="macro-change ' + (isUp ? 'up' : 'down') + '">' + (isUp ? '▲' : '▼') + Math.abs(change).toFixed(2) + '%</span>';
        }
      };
      setMacro('mcr-dxy', data.dxy ? data.dxy.toFixed(2) : null, data.dxy_change);
      setMacro('mcr-us10y', data.us10y ? data.us10y.toFixed(2) + '%' : null, data.us10y_change);
      setMacro('mcr-vix', data.vix ? data.vix.toFixed(2) : null, data.vix_change);
      setMacro('mcr-silver', data.silver ? '$' + data.silver.toFixed(2) : null, data.silver_change);
      setMacro('mcr-gsr', data.gsr ? data.gsr.toFixed(1) : null, data.gsr_change);
      setMacro('mcr-usmyr', data.usmyr ? data.usmyr.toFixed(4) : null, data.usmyr_change);
      setMacro('wf-usmyr', data.usmyr ? data.usmyr.toFixed(4) : null, data.usmyr_change);
      var timeEl = $('mcr-time');
      if (timeEl) {
        timeEl.textContent = new Date(snapshot.observed_at).toLocaleString('en-MY', {
          timeZone: CONFIG.TIMEZONE, month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
        }) + ' MYT';
      }
    });
  }

  // ── Signal V2 ──
  function refreshSignals() {
    return apiFetch('/signal_v2').then(function (d) {
      if (!d || !d.signal) return;
      var sig = d.signal;
      var regime = d.regime || {};
      var rr = sig.rr_ratio || 0;
      var dir = (sig.direction || 'FLAT').toUpperCase();
      var rrMissing = (sig.rr_ratio === null || sig.rr_ratio === undefined);
      var rrGated = rrMissing || rr < 1.0;
      var isFlat = dir === 'FLAT' || rrGated;

      var plainVerdict = translateJudge(sig.judge_reason);
      var tf = currentTF || '4H';
      if ($('synthesisVerdict')) {
        $('synthesisVerdict').innerHTML = '<strong>' + (sig.verdict || 'SABAR') + ' · ' + dir + ' · ' + tf + '</strong><br><br>' + plainVerdict +
          '<br><br><strong>Numbers:</strong> R:R ' + (rrMissing ? '—' : fmt(rr, 1) + ':1') +
          ' · Confluence ' + Math.round((sig.confluence_score || 0) * 100) + '%' +
          ' · Trend ' + (regime.regime || 'NONE') + ' (' + Math.round((regime.confidence || 0) * 100) + '% conf)';
      }

      var ladder = $('tradeLadder');
      var noSetup = $('tradeNoSetup');
      if (ladder) ladder.hidden = isFlat;
      if (noSetup) noSetup.hidden = !isFlat;

      if (!isFlat) {
        if ($('tradeRR')) {
          $('tradeRR').textContent = '1:' + fmt(rr, 1);
          $('tradeRR').className = 'trade-metric-value ' + (rr >= 2 ? 'good' : rr >= CONFIG.RR_MARGINAL ? 'marginal' : 'poor');
        }
        if ($('tradeConf')) $('tradeConf').textContent = Math.round((sig.confluence_score || 0) * 100) + '%';
        if ($('tradeConfLvl')) {
          var confMap = { 'HIGH': 'High', 'MEDIUM': 'Medium', 'LOW': 'Low' };
          $('tradeConfLvl').textContent = confMap[(sig.confidence_level || 'MEDIUM').toUpperCase()] || 'Medium';
        }
        if ($('tradeVerdict')) {
          $('tradeVerdict').textContent = rr >= 2 ? 'SEAL · Strong R:R' : rr >= 1.5 ? 'SEAL · Acceptable R:R' : 'SABAR · Minimum R:R';
          $('tradeVerdict').className = 'trade-quality-verdict ' + (rr >= 1.5 ? 'good' : 'marginal');
        }
      }
      plotPositionMarkers(sig);
    });
  }

  // ── Technical Forge ──
  function refreshTechnicalForge() {
    return (latestSnapshot ? Promise.resolve(latestSnapshot) : refreshSnapshot()).then(function (snapshot) {
      return Promise.all([apiFetch('/signal_v2'), apiFetch('/apex')]).then(function (res) {
        var sigData = res[0], apexData = res[1];
        var levels = (snapshot && snapshot.levels) || {};
        var ticker = snapshot && snapshot.ticker ? Object.assign({}, snapshot.ticker, {
          support: levels.support || [],
          resistance: levels.resistance || [],
        }) : null;
        if (!ticker) return;

        var emaTrend = ticker.emaTrend || 'NEUTRAL';
        var price = ticker.price || 0;
        var ema20 = ticker.ema20 || 0, ema50 = ticker.ema50 || 0, ema200 = ticker.ema200 || 0;
        var rsi = ticker.rsi || 50;
        var rsiState = ticker.rsiState || 'NEUTRAL';
        var regime = (sigData && sigData.regime) || {};
        var sig = (sigData && sigData.signal) || {};
        var apexG = (apexData && apexData.G) || 0;
        var tier = function (score) { return score >= 70 ? 'Tier 3 — High' : score >= 40 ? 'Tier 2 — Moderate' : 'Tier 1 — Low'; };
        var tierCls = function (score) { return 'confidence-tier ' + (score >= 70 ? 't3' : score >= 40 ? 't2' : 't1'); };

        // TREND
        var trendBull = emaTrend === 'BULLISH';
        var trendScore = trendBull ? 65 : (emaTrend === 'BEARISH' ? 35 : 50);
        if ($('tfTrendScore')) { $('tfTrendScore').textContent = emaTrend; $('tfTrendScore').className = 'signal-score ' + (trendBull ? 'bullish' : emaTrend === 'BEARISH' ? 'bearish' : 'neutral'); }
        if ($('tfTrendBody')) $('tfTrendBody').innerHTML =
          'EMA20 ($' + fmt(ema20) + ') <strong>' + (ema20 > ema50 ? 'above' : 'below') + '</strong> EMA50 ($' + fmt(ema50) + '). ' +
          '200 EMA at $' + fmt(ema200) + ' — ' + (price > ema200 ? 'price above = macro support' : 'price below = macro resistance') + '. ' +
          'Regime: ' + (regime.regime || emaTrend) + ' (' + Math.round((regime.confidence || 0.8) * 100) + '% conf).';
        if ($('tfTrendConf')) $('tfTrendConf').textContent = 'Score: ' + trendScore + '/100';
        if ($('tfTrendTier')) { $('tfTrendTier').textContent = tier(trendScore); $('tfTrendTier').className = tierCls(trendScore); }

        // MOMENTUM
        var momScore = Math.round(rsi);
        if ($('tfMomScore')) { $('tfMomScore').textContent = rsiState; $('tfMomScore').className = 'signal-score ' + (rsi > 70 ? 'bearish' : rsi < 30 ? 'bullish' : 'neutral'); }
        if ($('tfMomBody')) $('tfMomBody').innerHTML =
          'RSI <strong>' + fmt(rsi, 1) + '</strong> — ' + rsiState.toLowerCase() + '. ' +
          (rsi > 70 ? 'Overbought — potential pullback.' : rsi < 30 ? 'Oversold — potential bounce.' : 'Mid-range — no extreme signal.') +
          ' Confluence: ' + Math.round((sig.confluence_score || 0) * 100) + '%. Direction: ' + (sig.direction || 'FLAT') + '.';
        if ($('tfMomConf')) $('tfMomConf').textContent = 'Score: ' + momScore + '/100';
        if ($('tfMomTier')) { $('tfMomTier').textContent = tier(momScore); $('tfMomTier').className = tierCls(momScore); }

        // STRUCTURE
        var structScore = Math.round((regime.confidence || 0) * 100);
        var s1 = ticker.support ? ticker.support[0] : 0;
        var r1 = ticker.resistance ? ticker.resistance[0] : 0;
        if ($('tfStructScore')) { $('tfStructScore').textContent = regime.regime || 'SIDEWAYS'; $('tfStructScore').className = 'signal-score ' + (regime.regime === 'UPTREND' ? 'bullish' : regime.regime === 'DOWNTREND' ? 'bearish' : 'neutral'); }
        if ($('tfStructBody')) $('tfStructBody').innerHTML =
          '<strong>' + (regime.regime || 'SIDEWAYS') + '</strong> regime (' + Math.round((regime.confidence || 0.8) * 100) + '% confidence). ' +
          'S1: $' + fmt(s1) + ' | R1: $' + fmt(r1) + '. ' +
          'Verdict: <strong>' + (sig.verdict || 'SABAR') + '</strong> — ' + translateJudge(sig.judge_reason) + '.';
        if ($('tfStructConf')) $('tfStructConf').textContent = 'Score: ' + structScore + '/100';
        if ($('tfStructTier')) { $('tfStructTier').textContent = tier(structScore); $('tfStructTier').className = tierCls(structScore); }

        // VOLUME / QUALITY
        var volScore = Math.round(apexG * 100);
        if ($('tfVolScore')) { $('tfVolScore').textContent = apexG >= 0.5 ? 'Sufficient' : apexG >= 0.3 ? 'Moderate' : 'Weak'; $('tfVolScore').className = 'signal-score ' + (apexG >= 0.5 ? 'bullish' : apexG >= 0.3 ? 'neutral' : 'bearish'); }
        if ($('tfVolBody')) $('tfVolBody').innerHTML =
          'Signal quality: <strong>' + (apexG >= 0.5 ? 'GOOD — entry candidate' : apexG >= 0.3 ? 'MODERATE — wait for confirmation' : 'WEAK — do not enter') + '</strong>. ' +
          'Strength: ' + (sig.strength || 'NONE') + '. R:R Ratio: ' + fmt(sig.rr_ratio || 0, 1) + ':1. ' +
          '★ Market data from yfinance — estimate only, not broker data.';
        if ($('tfVolConf')) $('tfVolConf').textContent = 'Score: ' + volScore + '/100';
        if ($('tfVolTier')) { $('tfVolTier').textContent = tier(volScore); $('tfVolTier').className = tierCls(volScore); }
      });
    });
  }

  // ── Calendar ──
  function refreshCalendar() {
    return apiFetch('/calendar').then(function (d) {
      var listEl = $('eventsList');
      if (!listEl) return;
      if (!d || !d.events || !d.events.length) {
        listEl.innerHTML = '<div class="events-empty">No high-impact USD events this week</div>';
        return;
      }
      var now = new Date();
      var warningHtml = '';
      d.events.forEach(function (ev) {
        if (ev.impact !== 'high' || !ev.datetime) return;
        try {
          var diffMins = (new Date(ev.datetime) - now) / 60000;
          if (diffMins > 0 && diffMins <= 15 && !warningHtml) {
            warningHtml = '<div class="event-alert critical">🚨 ' + ev.event + ' IN ' + Math.round(diffMins) + ' MINS — CLOSE POSITIONS</div>';
          } else if (diffMins > 0 && diffMins <= 120 && !warningHtml) {
            warningHtml = '<div class="event-alert warning">⚠️ ' + ev.event + ' in ' + Math.round(diffMins) + ' mins — avoid new openings</div>';
          }
        } catch (e) {}
      });
      listEl.innerHTML = warningHtml + d.events.map(function (ev) {
        return '<div class="event-row ' + (ev.impact === 'high' ? 'high' : 'medium') + '">' +
          '<span class="event-date">' + (ev.date || '') + '</span>' +
          '<span class="event-time">' + (ev.time || '') + '</span>' +
          '<span class="event-name">' + ev.event + '</span>' +
          '<span class="event-actual">' + (ev.actual || '—') + '</span>' +
          '<span class="event-forecast">' + (ev.forecast || '—') + '</span>' +
          '<span class="event-previous">' + (ev.previous || '—') + '</span></div>';
      }).join('');
    });
  }

  // ── Stance buttons (safe storage) ──
  function initStanceButtons() {
    var saved = store.get(ZM.stanceKey || (CONFIG.ASSET + '_stance')) || 'observe';
    var stances = { observe: 'stanceObserve', prepare: 'stancePrepare', await: 'stanceAwait' };
    Object.keys(stances).forEach(function (key) {
      var btn = $(stances[key]);
      if (!btn) return;
      btn.classList.toggle('active', saved === key);
      btn.addEventListener('click', function () {
        document.querySelectorAll('.stance-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        store.set(ZM.stanceKey || (CONFIG.ASSET + '_stance'), key);
      });
    });
  }

  // ── Machine digest drawer (?mode=agent) ──
  window.toggleMachineDigest = function () {
    var drawer = $('machineDigestDrawer');
    var code = $('machineDigestCode');
    if (!drawer) return;
    if (drawer.style.display === 'none' || !drawer.style.display) {
      var packet = $('wealth-reality-packet');
      if (packet && code) {
        try { code.textContent = JSON.stringify(JSON.parse(packet.textContent), null, 2); }
        catch (e) { code.textContent = packet.textContent; }
      }
      drawer.style.display = 'block';
    } else {
      drawer.style.display = 'none';
    }
  };

  // ── Full refresh ──
  function refreshAll() {
    var liveDot = document.querySelector('.zs-status .live-dot');
    return refreshSnapshot().then(function (snapshot) {
      if (!snapshot) return;
      return Promise.all([
        refreshTicker(), refreshApex(), refreshMacro(),
        refreshSignals(), refreshTechnicalForge(), refreshCalendar(),
        renderChart(currentTF),
      ]);
    });
  }

  // ── Boot ──
  document.addEventListener('DOMContentLoaded', function () {
    armFirstViewportWatchdog();
    if (new URLSearchParams(window.location.search).get('mode') === 'agent') {
      window.toggleMachineDigest();
    }
    refreshSnapshot().then(function () {
      refreshTicker();
      refreshMacro();
      renderChart('4H');
      refreshApex();
      refreshSignals();
      refreshTechnicalForge();
      refreshCalendar();
    });
    initStanceButtons();
    setInterval(refreshAll, CONFIG.REFRESH_INTERVAL);
    setInterval(function () { refreshTicker(true); }, 120000);
  });
})();
