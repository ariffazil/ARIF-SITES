#!/usr/bin/env python3
"""
LIVE MARKET PROXY FETCHER — arif-fazil.com/propa/
Fetches Brent crude, gold, USD/MYR, and natural gas proxies.
Outputs HTML fragment for the live-strip section.
Epistemic tag: OBS (live market readings, not sealed tripwire values).

DITEMPA BUKAN DIBERI — live data, sealed anchors.
"""

import json, sys, os, time
from datetime import datetime, timezone
from urllib.request import Request, urlopen
from urllib.error import URLError
import ssl

ssl_ctx = ssl.create_default_context()


def fetch_json(url, timeout=5):
    try:
        req = Request(
            url, headers={"User-Agent": "arifOS-WEALTH/1.0 (live-market-proxy)"}
        )
        with urlopen(req, timeout=timeout, context=ssl_ctx) as r:
            return json.loads(r.read().decode())
    except Exception as e:
        print(f"<!-- fetch failed: {url} -> {e} -->", file=sys.stderr)
        return None


def fmt_price(v, dp=2):
    if v is None:
        return "—"
    return f"{v:,.{dp}f}"


def direction(now, prev):
    if now is None or prev is None:
        return ""
    if now > prev:
        return "up"
    if now < prev:
        return "down"
    return ""


def format_live_strip(prices, timestamp):
    chips = []

    def arrow(dir_cls):
        if dir_cls == "up":
            return "▲"
        if dir_cls == "down":
            return "▼"
        return ""

    # Brent Crude
    brent = prices.get("brent")
    if brent:
        dir_cls = direction(brent.get("now"), brent.get("prev"))
        arrow_html = (
            ' <span class="{}">{}</span>'.format(dir_cls, arrow(dir_cls))
            if dir_cls
            else ""
        )
        chips.append(
            '<span class="ls-chip">Brent <b>${}</b>{} <span style="font-size:.6rem;color:var(--faint)">ICE</span></span>'.format(
                fmt_price(brent["now"]), arrow_html
            )
        )
    else:
        chips.append(
            '<span class="ls-chip">Brent <b>&mdash;</b> <span style="font-size:.6rem;color:var(--faint)">unavailable</span></span>'
        )

    # Gold XAU
    gold = prices.get("gold")
    if gold:
        dir_cls = direction(gold.get("now"), gold.get("prev"))
        arrow_html = (
            ' <span class="{}">{}</span>'.format(dir_cls, arrow(dir_cls))
            if dir_cls
            else ""
        )
        chips.append(
            '<span class="ls-chip">XAU <b>${}</b>{} <span style="font-size:.6rem;color:var(--faint)">/oz</span></span>'.format(
                fmt_price(gold["now"]), arrow_html
            )
        )
    else:
        chips.append('<span class="ls-chip">XAU <b>&mdash;</b></span>')

    # USD/MYR
    usdmyr = prices.get("usdmyr")
    if usdmyr:
        chips.append(
            '<span class="ls-chip">USD/MYR <b>{}</b> <span style="font-size:.6rem;color:var(--faint)">FX</span></span>'.format(
                fmt_price(usdmyr["now"], 4)
            )
        )
    else:
        chips.append('<span class="ls-chip">USD/MYR <b>&mdash;</b></span>')

    # Natural Gas (TTF proxy)
    ngas = prices.get("ngas")
    if ngas:
        chips.append(
            '<span class="ls-chip">TTF Gas <b>&euro;{}</b> <span style="font-size:.6rem;color:var(--faint)">/MWh</span></span>'.format(
                fmt_price(ngas["now"])
            )
        )

    ts_str = timestamp.strftime("%Y-%m-%d %H:%M UTC") if timestamp else "&mdash;"

    any_live = any(prices.get(k) for k in ["brent", "gold", "usdmyr"])
    badge = "LIVE" if any_live else "PARTIAL"

    html = """<div class="live-strip" id="liveStrip">
  <div class="ls-head"><span class="ls-badge" id="lsBadge" style="color:#22c55e">{badge}</span><span>LIVE MARKET PROXIES</span><span style="margin-left:auto" id="lsTime">{ts_str}</span></div>
  <div class="ls-chips" id="lsChips" aria-live="polite">{chips}</div>
  <div class="ls-note">Transmission: &plusmn;$10 Brent &asymp; &plusmn;RM6.0B FCF/CFFO. FCF (#1) crosses zero at Brent &asymp; $71.60/bbl. CFFO tripwire (RM60B) requires Brent &lt; $47.40. Proxies are live market readings, NOT sealed tripwire values. Anchors remain sovereign-sealed. Source: WEALTH commodity engine &middot; 5-min cache.</div>
</div>""".format(badge=badge, ts_str=ts_str, chips=" ".join(chips))
    return html


def main():
    prices = {}
    now = datetime.now(timezone.utc)

    # Gold XAU/USD via gold-api.com (free, no key)
    try:
        gold_data = fetch_json("https://api.gold-api.com/price/XAU", timeout=5)
        if gold_data and "price" in gold_data:
            prices["gold"] = {
                "now": gold_data["price"],
                "prev": gold_data.get("prev_close_price"),
            }
    except:
        pass

    # USD/MYR via exchangerate-api.com (free, no key)
    try:
        fx_data = fetch_json(
            "https://api.exchangerate-api.com/v4/latest/USD", timeout=8
        )
        if fx_data and "rates" in fx_data:
            prices["usdmyr"] = {"now": fx_data["rates"].get("MYR")}
    except:
        pass

    # Brent Crude via yfinance
    try:
        import yfinance as yf

        brent = yf.Ticker("BZ=F")
        try:
            info = brent.fast_info
            prices["brent"] = {
                "now": info.get("lastPrice") or info.get("regularMarketPrice")
            }
        except:
            hist = brent.history(period="1d")
            if not hist.empty:
                prices["brent"] = {"now": float(hist["Close"].iloc[-1])}
    except Exception as e:
        print("<!-- yfinance brent failed: {} -->".format(e), file=sys.stderr)

    # Natural Gas TTF via yfinance
    try:
        import yfinance as yf

        ttf = yf.Ticker("TTF=F")
        try:
            info = ttf.fast_info
            prices["ngas"] = {
                "now": info.get("lastPrice") or info.get("regularMarketPrice")
            }
        except:
            hist = ttf.history(period="1d")
            if not hist.empty:
                prices["ngas"] = {"now": float(hist["Close"].iloc[-1])}
    except Exception as e:
        print("<!-- yfinance ttf failed: {} -->".format(e), file=sys.stderr)

    # Save prices cache
    cache_dir = os.path.join(os.path.dirname(__file__), "..", "dist", "vitals")
    os.makedirs(cache_dir, exist_ok=True)
    cache_path = os.path.join(cache_dir, "live_prices.json")
    with open(cache_path, "w") as f:
        json.dump(
            {
                "prices": prices,
                "timestamp": now.isoformat(),
                "fetched_by": "live-market.py",
            },
            f,
            indent=2,
        )

    # Copy to propa dist
    propa_dir = os.path.join(os.path.dirname(__file__), "..", "dist", "propa")
    os.makedirs(propa_dir, exist_ok=True)
    propa_cache = os.path.join(propa_dir, "live_prices.json")
    with open(propa_cache, "w") as f:
        json.dump(
            {
                "prices": prices,
                "timestamp": now.isoformat(),
                "fetched_by": "live-market.py",
            },
            f,
            indent=2,
        )

    # Output HTML fragment
    html = format_live_strip(prices, now)
    print(html)


if __name__ == "__main__":
    main()
