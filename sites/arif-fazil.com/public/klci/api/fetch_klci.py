#!/usr/bin/env python3
"""
FBM KLCI Bursa Malaysia Data Fetcher — WEALTH Organ
Fetches live FBM KLCI index data from yfinance, computes technical indicators,
generates trading signals. Called by Node.js API server.

Usage:
    python3 fetch_klci.py ticker
    python3 fetch_klci.py history --interval 1d --period 6mo
    python3 fetch_klci.py signals
    python3 fetch_klci.py levels
    python3 fetch_klci.py macro
    python3 fetch_klci.py apex

DITEMPA BUKAN DIBERI — Forged, Not Given.
"""

import json
import sys
import os
import argparse
import hashlib
from datetime import datetime, timedelta, timezone
from pathlib import Path

import numpy as np
import pandas as pd

# ── Cache ────────────────────────────────────────────────────────
CACHE_DIR = Path("/tmp/klci_cache")
CACHE_DIR.mkdir(parents=True, exist_ok=True)
CACHE_TTL = 300  # 5 minutes

MYT = timezone(timedelta(hours=8))
ASSET_KEY = "klci"
ASSET_SYMBOL = "^KLSE"


def _cache_key(endpoint: str, **kwargs) -> Path:
    raw = f"{endpoint}_{json.dumps(kwargs, sort_keys=True)}"
    h = hashlib.md5(raw.encode()).hexdigest()[:12]
    return CACHE_DIR / f"{endpoint}_{h}.json"


def _read_cache(path: Path) -> dict | None:
    if not path.exists():
        return None
    age = datetime.now().timestamp() - path.stat().st_mtime
    if age > CACHE_TTL:
        return None
    try:
        return json.loads(path.read_text())
    except Exception:
        return None


def _write_cache(path: Path, data: dict):
    try:
        path.write_text(json.dumps(data, default=str))
    except Exception:
        pass


# ── Data Fetch ───────────────────────────────────────────────────
def fetch_ohlcv(interval: str = "1d", period: str = "6mo") -> pd.DataFrame:
    import yfinance as yf

    # KLCI is daily — yfinance restricts 1h/1m etc for indices
    if interval not in ("1d", "1wk", "5d", "1mo"):
        interval = "1d"

    ticker = yf.Ticker(ASSET_SYMBOL)
    df = ticker.history(period=period, interval=interval)

    if df.empty:
        raise ValueError(f"No KLCI data available from yfinance ({ASSET_SYMBOL})")

    df = df[["Open", "High", "Low", "Close"]].copy()
    if "Volume" in df.columns:
        df["Volume"] = df["Volume"].fillna(0)
    else:
        df["Volume"] = 0
    df.columns = ["open", "high", "low", "close", "volume"]
    df.index.name = "time"
    return df


# ── Technical Indicators ─────────────────────────────────────────
def compute_ema(series: pd.Series, period: int) -> pd.Series:
    return series.ewm(span=period, adjust=False).mean()


def compute_rsi(series: pd.Series, period: int = 14) -> pd.Series:
    delta = series.diff()
    gain = delta.where(delta > 0, 0.0)
    loss = -delta.where(delta < 0, 0.0)
    avg_gain = gain.ewm(span=period, adjust=False).mean()
    avg_loss = loss.ewm(span=period, adjust=False).mean()
    rs = avg_gain / avg_loss.replace(0, np.nan)
    rsi = 100 - (100 / (1 + rs))
    return rsi.fillna(50)


def compute_atr(df: pd.DataFrame, period: int = 14) -> pd.Series:
    high = df["high"]
    low = df["low"]
    close = df["close"].shift(1)
    tr = pd.concat([high - low, (high - close).abs(), (low - close).abs()], axis=1).max(
        axis=1
    )
    return tr.ewm(span=period, adjust=False).mean()


def find_support_resistance(df: pd.DataFrame, lookback: int = 60) -> dict:
    recent = df.tail(lookback).copy()
    highs = recent["high"].values
    lows = recent["low"].values
    close_now = recent["close"].iloc[-1]

    swing_highs = []
    swing_lows = []
    for i in range(2, len(recent) - 2):
        if (
            highs[i] > highs[i - 1]
            and highs[i] > highs[i - 2]
            and highs[i] > highs[i + 1]
            and highs[i] > highs[i + 2]
        ):
            swing_highs.append(highs[i])
        if (
            lows[i] < lows[i - 1]
            and lows[i] < lows[i - 2]
            and lows[i] < lows[i + 1]
            and lows[i] < lows[i + 2]
        ):
            swing_lows.append(lows[i])

    h = recent["high"].iloc[-1]
    l = recent["low"].iloc[-1]
    c = recent["close"].iloc[-1]
    pivot = (h + l + c) / 3
    r1 = 2 * pivot - l
    r2 = pivot + (h - l)
    s1 = 2 * pivot - h
    s2 = pivot - (h - l)

    resistance_raw = swing_highs + [r1, r2, pivot]
    support_raw = swing_lows + [s1, s2, pivot]

    resistance = sorted(set(round(r, 2) for r in resistance_raw if r > close_now))
    support = sorted(
        set(round(s, 2) for s in support_raw if s < close_now), reverse=True
    )

    return {
        "support": support[:3],
        "resistance": resistance[:3],
        "pivot": round(pivot, 2),
    }


# ── Signal Generation ────────────────────────────────────────────
def generate_signal(df: pd.DataFrame) -> dict:
    close = df["close"]
    ema20 = compute_ema(close, 20)
    ema50 = compute_ema(close, 50)
    ema200 = compute_ema(close, 200)
    rsi = compute_rsi(close, 14)
    atr = compute_atr(df, 14)

    price = round(float(close.iloc[-1]), 2)
    ema20_val = round(float(ema20.iloc[-1]), 2)
    ema50_val = round(float(ema50.iloc[-1]), 2)
    ema200_val = round(float(ema200.iloc[-1]), 2)
    rsi_val = round(float(rsi.iloc[-1]), 1)
    atr_val = round(float(atr.iloc[-1]), 2)

    ema_trend = "BULLISH" if ema20_val > ema50_val else "BEARISH"
    rsi_state = (
        "OVERBOUGHT" if rsi_val > 70 else ("OVERSOLD" if rsi_val < 30 else "NEUTRAL")
    )

    sr = find_support_resistance(df)
    confluence = []
    reasons = []

    if ema_trend == "BEARISH":
        confluence.append("EMA_BEARISH")
        reasons.append(f"EMA20 ({ema20_val}) < EMA50 ({ema50_val})")
    if ema_trend == "BULLISH":
        confluence.append("EMA_BULLISH")
        reasons.append(f"EMA20 ({ema20_val}) > EMA50 ({ema50_val})")
    if rsi_state == "OVERBOUGHT":
        confluence.append("RSI_OVERBOUGHT")
        reasons.append(f"RSI {rsi_val} — overbought")
    if rsi_state == "OVERSOLD":
        confluence.append("RSI_OVERSOLD")
        reasons.append(f"RSI {rsi_val} — oversold")

    if sr["resistance"]:
        nearest_res = sr["resistance"][0]
        if price > nearest_res * 0.998:
            confluence.append("NEAR_RESISTANCE")
            reasons.append(f"Near resistance {nearest_res}")
    if sr["support"]:
        nearest_sup = sr["support"][0]
        if price < nearest_sup * 1.002:
            confluence.append("NEAR_SUPPORT")
            reasons.append(f"Near support {nearest_sup}")

    bearish_score = sum(
        1 for c in confluence if any(k in c for k in ["BEAR", "OVERBOUGHT", "RESISTANCE"])
    )
    bullish_score = sum(
        1 for c in confluence if any(k in c for k in ["BULL", "OVERSOLD", "SUPPORT"])
    )

    if bearish_score >= 2 and bearish_score > bullish_score:
        signal = "SHORT"
        confidence = min(0.5 + bearish_score * 0.1, 0.85)
    elif bullish_score >= 2 and bullish_score > bullish_score > 0:
        signal = "LONG"
        confidence = min(0.5 + bullish_score * 0.1, 0.85)
    else:
        signal = "NEUTRAL"
        confidence = 0.4
        # Equal or low conviction → default to LONG bias for indices (accumulation)
        if ema_trend == "BULLISH":
            signal = "LONG"
            confidence = 0.5

    rr = round(atr_val * 2 / max(atr_val * 1.5, 0.01), 2)

    return {
        "price": price,
        "ema_fast": ema20_val,
        "ema_slow": ema50_val,
        "ema_trend": ema_trend,
        "ema200": ema200_val,
        "rsi": rsi_val,
        "rsi_state": rsi_state,
        "atr": atr_val,
        "signal": signal,
        "confidence": round(confidence, 2),
        "rr_ratio": rr,
        "support_levels": sr["support"],
        "resistance_levels": sr["resistance"],
        "pivot": sr["pivot"],
        "confluence_count": len(confluence),
        "confluence_signals": confluence,
        "reasons": reasons,
    }


# ── Endpoint Handlers ────────────────────────────────────────────
def cmd_ticker(args):
    cache = _cache_key("ticker")
    cached = _read_cache(cache)
    if cached:
        return cached

    df = fetch_ohlcv(interval="1d", period="6mo")
    sig = generate_signal(df)
    prev_close = float(df["close"].iloc[-2])
    change = round(sig["price"] - prev_close, 2)
    change_pct = round(change / prev_close * 100, 2)

    result = {
        "symbol": "FBMKLCI",
        "price": sig["price"],
        "change": change,
        "changePct": change_pct,
        "rsi": sig["rsi"],
        "rsiState": sig["rsi_state"],
        "signal": sig["signal"],
        "confidence": sig["confidence"],
        "ema20": sig["ema_fast"],
        "ema50": sig["ema_slow"],
        "ema200": sig["ema200"],
        "emaTrend": sig["ema_trend"],
        "support": sig["support_levels"],
        "resistance": sig["resistance_levels"],
        "pivot": sig["pivot"],
        "timestamp": datetime.now(MYT).isoformat(),
    }
    _write_cache(cache, result)
    return result


def cmd_history(args):
    interval = args.get("interval", "1d")
    period = args.get("period", "6mo")
    if interval not in ("1d", "1wk", "5d", "1mo"):
        interval = "1d"

    cache = _cache_key("history", interval=interval, period=period)
    cached = _read_cache(cache)
    if cached:
        return cached

    df = fetch_ohlcv(interval=interval, period=period)
    df["ema20"] = compute_ema(df["close"], 20)
    df["ema50"] = compute_ema(df["close"], 50)
    df["ema200"] = compute_ema(df["close"], 200)
    df["rsi"] = compute_rsi(df["close"], 14)

    candles = []
    for ts, row in df.iterrows():
        t = int(ts.timestamp())
        candles.append({
            "time": t,
            "open": round(float(row["open"]), 2),
            "high": round(float(row["high"]), 2),
            "low": round(float(row["low"]), 2),
            "close": round(float(row["close"]), 2),
            "volume": int(row["volume"]) if not np.isnan(row["volume"]) else 0,
        })

    ema20_line = [
        {"time": int(ts.timestamp()), "value": round(float(row["ema20"]), 2)}
        for ts, row in df.iterrows()
    ]
    ema50_line = [
        {"time": int(ts.timestamp()), "value": round(float(row["ema50"]), 2)}
        for ts, row in df.iterrows()
    ]
    ema200_line = [
        {"time": int(ts.timestamp()), "value": round(float(row["ema200"]), 2)}
        for ts, row in df.iterrows()
    ]

    result = {
        "candles": candles,
        "ema20": ema20_line,
        "ema50": ema50_line,
        "ema200": ema200_line,
        "interval": interval,
        "period": period,
        "count": len(candles),
    }
    _write_cache(cache, result)
    return result


def cmd_levels(args):
    cache = _cache_key("levels")
    cached = _read_cache(cache)
    if cached:
        return cached

    df = fetch_ohlcv(interval="1d", period="6mo")
    sr = find_support_resistance(df, lookback=60)

    result = {
        "support_1d": sr["support"],
        "resistance_1d": sr["resistance"],
        "support_daily": sr["support"],
        "resistance_daily": sr["resistance"],
        "pivot": sr["pivot"],
        "timestamp": datetime.now(MYT).isoformat(),
    }
    _write_cache(cache, result)
    return result


def cmd_macro(args):
    """KLCI macro context: USD/MYR, OPR (Bank Negara), regional peers."""
    cache = _cache_key("macro")
    cached = _read_cache(cache)
    if cached:
        return cached

    import yfinance as yf

    result = {"timestamp": datetime.now(MYT).isoformat()}

    for sym, key, digits in [
        ("MYR=X", "usmyr", 4),
        ("DX-Y.NYB", "dxy", 2),
        ("^VIX", "vix", 2),
        ("^TNX", "us10y", 3),
        ("EWM", "ewm", 2),     # iShares MSCI Malaysia ETF — proxy for foreign flow
        ("^STI", "sti", 2),    # Singapore STI — ASEAN peer
        ("^HSI", "hsi", 2),    # Hang Seng — regional context
    ]:
        try:
            t = yf.Ticker(sym)
            h = t.history(period="5d")
            if not h.empty:
                result[key] = round(float(h["Close"].iloc[-1]), digits)
        except Exception:
            result[key] = None

    # Bank Negara OPR context (cached reading — most recent MPC)
    result["opr_pct"] = 3.00  # Latest BNM OPR (May 2023+)
    result["opr_status"] = "BNM OPR maintained at 3.00% (next MPC: Sept 4, 2026)"

    _write_cache(cache, result)
    return result


def cmd_apex(args):
    """APEX market evaluation: simplified G score for KLCI."""
    cache = _cache_key("apex")
    cached = _read_cache(cache)
    if cached:
        return cached

    df = fetch_ohlcv(interval="1d", period="1y")
    sig = generate_signal(df)

    # Compute G = A · P · E · X (4-term Nash bargaining product)
    A = 0.7 if sig["ema_trend"] == "BULLISH" else 0.4 if sig["ema_trend"] == "BEARISH" else 0.55
    P = min(0.9, 0.4 + sig["confluence_count"] * 0.1)
    E = sig["confidence"]
    X = 0.7 if sig["rsi_state"] == "NEUTRAL" else 0.4  # NEUTRAL RSI = stable regime
    G = round((A * P * E * X) ** 0.25, 4)
    C_dark = round(A * (1 - P) * (1 - X), 4)

    # State
    if sig["ema_trend"] == "BULLISH" and sig["rsi_state"] != "OVERBOUGHT":
        state = "CLARITY"
    elif sig["ema_trend"] == "BEARISH" and sig["rsi_state"] != "OVERSOLD":
        state = "STABLE"
    else:
        state = "CHAOS"

    # Verdict
    if G >= 0.65 and sig["signal"] in ("LONG", "SHORT"):
        verdict = "SEAL"
    elif G >= 0.45:
        verdict = "SABAR"
    elif G >= 0.25:
        verdict = "HOLD"
    else:
        verdict = "VOID"

    # Momentum: 20-day slope normalized
    closes = df["close"].tail(20).values
    if len(closes) >= 2:
        slope = (closes[-1] - closes[0]) / closes[0]
        momentum = round(slope * 10, 4)  # Scale to readable range
    else:
        momentum = 0.0

    # Volume trend (indices have flat volume — use price volatility as proxy)
    atr_recent = df["close"].tail(5).std()
    atr_baseline = df["close"].tail(20).std()
    volume_trend = "rising" if atr_recent > atr_baseline else "falling"

    result = {
        "apex": {
            "A": round(A, 4),
            "P": round(P, 4),
            "E": round(E, 4),
            "X": round(X, 4),
            "Phi": round((A + P + E + X) / 4, 4),
        },
        "G": G,
        "C_dark": C_dark,
        "dS": round(momentum, 4),
        "state": state,
        "direction": sig["signal"],
        "confidence": round(sig["confidence"], 3),
        "volume_trend": volume_trend,
        "volume_confirmation": atr_recent > atr_baseline,
        "momentum": momentum,
        "volatility_regime": "normal",
        "verdict": verdict,
        "price": sig["price"],
        "ema_20": sig["ema_fast"],
        "ema_50": sig["ema_slow"],
        "ema_200": sig["ema200"],
        "rsi_14": sig["rsi"],
        "atr_14": sig["atr"],
        "data_points": {"1D": len(df)},
        "timestamp": datetime.now(MYT).isoformat(),
    }
    _write_cache(cache, result)
    return result


def cmd_signal_v2(args):
    """Full trading signal aligned with WEALTH engine_v2 contract."""
    cache = _cache_key("signal_v2")
    cached = _read_cache(cache)
    if cached:
        return cached

    df = fetch_ohlcv(interval="1d", period="1y")
    sig = generate_signal(df)
    apex = cmd_apex({})

    price = sig["price"]
    atr_val = sig["atr"]
    direction = sig["signal"]
    sl_distance = atr_val * 1.5
    tp_distance = atr_val * 2.0

    if direction == "LONG":
        sl = round(price - sl_distance, 2)
        tp1 = round(price + tp_distance, 2)
        tp2 = round(price + tp_distance * 2, 2)
    elif direction == "SHORT":
        sl = round(price + sl_distance, 2)
        tp1 = round(price - tp_distance, 2)
        tp2 = round(price - tp_distance * 2, 2)
    else:
        sl = round(price - sl_distance, 2)
        tp1 = round(price + tp_distance, 2)
        tp2 = 0

    rr_ratio = round(tp_distance / sl_distance, 2)
    confidence_level = "HIGH" if sig["confidence"] >= 0.7 else "MEDIUM" if sig["confidence"] >= 0.5 else "LOW"

    confluence_factors = []
    for c in sig["confluence_signals"]:
        confluence_factors.append({
            "name": c,
            "direction": "LONG" if "BULL" in c or "SUPPORT" in c or "OVERSOLD" in c else "SHORT",
            "weight": 0.2,
            "confidence": sig["confidence"],
        })

    result = {
        "signal": {
            "direction": direction,
            "strength": "STRONG" if sig["confidence"] >= 0.7 else "MODERATE" if sig["confidence"] >= 0.5 else "WEAK",
            "confidence": round(sig["confidence"], 3),
            "entry_price": price,
            "stop_loss": sl,
            "take_profit_1": tp1,
            "take_profit_2": tp2,
            "rr_ratio": rr_ratio,
            "confluence_score": round(sig["confluence_count"] * 0.2, 2),
            "verdict": apex["verdict"],
            "judge_reason": " · ".join(sig["reasons"]) if sig["reasons"] else f"KLCI {sig['ema_trend']} trend · {sig['rsi_state']}",
        },
        "regime": {
            "regime": "UPTREND" if sig["ema_trend"] == "BULLISH" else "DOWNTREND" if sig["ema_trend"] == "BEARISH" else "SIDEWAYS",
            "confidence": round(sig["confidence"], 2),
            "price": price,
            "ema_20": sig["ema_fast"],
            "ema_50": sig["ema_slow"],
            "ema_200": sig["ema200"],
            "rsi": sig["rsi"],
        },
        "zones": {
            "buy_zone": {"price": sig["support_levels"][0] if sig["support_levels"] else None, "strength": 0.7} if sig["support_levels"] else None,
            "sell_zone": {"price": sig["resistance_levels"][0] if sig["resistance_levels"] else None, "strength": 0.7} if sig["resistance_levels"] else None,
        },
        "confluence_factors": confluence_factors,
        "timestamp": datetime.now(MYT).isoformat(),
    }
    _write_cache(cache, result)
    return result


def cmd_forecast(args):
    """wealth.forecast.v1 — ATR-scaled cone with scenario ladder."""
    horizon = int(args.get("horizon", 30))
    if horizon not in (30, 60, 90):
        horizon = 30

    cache = _cache_key("forecast", horizon=horizon)
    cached = _read_cache(cache)
    if cached:
        return cached

    df = fetch_ohlcv(interval="1d", period="1y")
    sig = generate_signal(df)
    close = df["close"]
    atr_val = round(float(compute_atr(df, 14).iloc[-1]), 2)
    ema20_val = round(float(compute_ema(close, 20).iloc[-1]), 2)
    ema50_val = round(float(compute_ema(close, 50).iloc[-1]), 2)
    ema200_val = round(float(compute_ema(close, 200).iloc[-1]), 2)
    rsi_val = round(float(compute_rsi(close, 14).iloc[-1]), 1)
    price = round(float(close.iloc[-1]), 2)

    # Slope of last 20 closes (units per step)
    ys = close.tail(20).values.astype(float)
    xs = np.arange(len(ys), dtype=float)
    denom = float(((xs - xs.mean()) ** 2).sum())
    slope = float(((xs - xs.mean()) * (ys - ys.mean())).sum() / denom) if denom > 0 else 0.0
    slope = max(-atr_val, min(atr_val, slope))
    slope = round(slope, 4)

    trending = abs(ema20_val - ema50_val) > 0.5 * atr_val
    if trending:
        regime = "TRENDING_UP" if ema20_val > ema50_val else "TRENDING_DOWN"
    else:
        regime = "SIDEWAYS"

    blend_w = 0.2 if trending else 0.5
    last_date = df.index[-1].date()
    t_dates, p10, p25, p50, p75, p90 = [], [], [], [], [], []
    for t in range(1, horizon + 1):
        mid = price + slope * t
        mid += (ema200_val - mid) * (1 - np.exp(-t / 20)) * blend_w
        sigma = atr_val * np.sqrt(t)
        t_dates.append((last_date + timedelta(days=t)).isoformat())
        p10.append(round(mid - 1.282 * sigma, 2))
        p25.append(round(mid - 0.674 * sigma, 2))
        p50.append(round(mid, 2))
        p75.append(round(mid + 0.674 * sigma, 2))
        p90.append(round(mid + 1.282 * sigma, 2))

    sr = find_support_resistance(df)
    r1 = sr["resistance"][0] if sr["resistance"] else round(price + atr_val, 2)
    s1 = sr["support"][0] if sr["support"] else round(price - atr_val, 2)
    rate = max(abs(slope), 0.25 * atr_val)
    eta_days = max(int(abs(r1 - price) / rate), 5) if rate > 0 else 30

    scenarios = [
        {
            "side": "LONG",
            "trigger": price,
            "objective": r1,
            "invalidation": s1,
            "confluence": min(5, sig["confluence_count"] + 1),
            "eta_days": eta_days,
        },
        {
            "side": "SHORT",
            "trigger": price,
            "objective": s1,
            "invalidation": r1,
            "confluence": max(1, 3 - sig["confluence_count"]),
            "eta_days": eta_days + 5,
        },
    ]

    result = {
        "schema": "wealth.forecast.v1",
        "asset": ASSET_KEY,
        "horizon_days": horizon,
        "generated_at": datetime.now(MYT).isoformat(),
        "basis": {
            "close": price,
            "ema50": ema50_val,
            "ema200": ema200_val,
            "atr": atr_val,
            "regime": regime,
        },
        "cone": {
            "t": t_dates,
            "p10": p10, "p25": p25, "p50": p50, "p75": p75, "p90": p90,
        },
        "scenarios": scenarios,
        "institutional_read": f"KLCI in {regime} regime · slope {slope:+.2f}/day · ATR {atr_val} · EMA20/50/200 alignment {'bullish' if ema20_val > ema50_val else 'bearish'}",
        "epistemic": f"OBS · DER · INT — forecast is probabilistic, not deterministic",
    }
    _write_cache(cache, result)
    return result


def cmd_calendar(args):
    """High-impact MYR/Malaysia events — minimal stub (no ForexFactory MYR feed)."""
    return {
        "events": [],
        "count": 0,
        "source": "Bank Negara Malaysia MPC schedule",
        "next_event": None,
        "timestamp": datetime.now(MYT).isoformat(),
        "note": "BNM MPC meetings quarterly. Next: Sept 4, 2026 (per BNM official schedule).",
    }


def cmd_proxies(args):
    """Live proxy gauges — KLCI + regional peers."""
    cache = _cache_key("proxies")
    cached = _read_cache(cache)
    if cached:
        return cached

    import yfinance as yf

    symbols = {
        "klci": ("^KLSE", 2),
        "usdmyr": ("MYR=X", 4),
        "sti": ("^STI", 2),
        "hsi": ("^HSI", 2),
        "nikkei": ("^N225", 2),
        "ewm": ("EWM", 2),
    }
    result = {"timestamp": datetime.now(MYT).isoformat()}
    for key, (sym, digits) in symbols.items():
        try:
            h = yf.Ticker(sym).history(period="5d")
            if not h.empty:
                result[key] = round(float(h["Close"].iloc[-1]), digits)
                result[key + "_prev"] = round(float(h["Close"].iloc[-2]), digits) if len(h) >= 2 else None
        except Exception:
            result[key] = None

    if result.get("klci") and result.get("klci_prev"):
        result["klci_change_pct"] = round((result["klci"] - result["klci_prev"]) / result["klci_prev"] * 100, 2)
    if result.get("usdmyr") and result.get("usdmyr_prev"):
        result["usdmyr_change_pct"] = round((result["usdmyr"] - result["usdmyr_prev"]) / result["usdmyr_prev"] * 100, 2)

    _write_cache(cache, result)
    return result


# ── CLI Entry ────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command")
    parser.add_argument("--interval", default="1d")
    parser.add_argument("--period", default="6mo")
    parser.add_argument("--horizon", default="30")
    args = parser.parse_args()

    cmd_args = {"interval": args.interval, "period": args.period, "horizon": args.horizon}

    handlers = {
        "ticker": cmd_ticker,
        "history": cmd_history,
        "levels": cmd_levels,
        "macro": cmd_macro,
        "apex": cmd_apex,
        "signal_v2": cmd_signal_v2,
        "forecast": cmd_forecast,
        "calendar": cmd_calendar,
        "proxies": cmd_proxies,
        "snapshot": cmd_ticker,
    }

    handler = handlers.get(args.command)
    if not handler:
        print(json.dumps({"error": f"Unknown command: {args.command}"}))
        sys.exit(1)

    try:
        result = handler(cmd_args)
        print(json.dumps(result, default=str))
    except Exception as e:
        print(json.dumps({"error": str(e), "command": args.command}))
        sys.exit(1)


if __name__ == "__main__":
    main()
