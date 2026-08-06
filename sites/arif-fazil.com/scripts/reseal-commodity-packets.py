#!/usr/bin/env python3
"""Reseal wealth-reality-packet JSON-LD in oil/gas/gold static HTML from live snapshot API.

Belt for F2 TRUTH: static scrapers see ≤1h-old embed even without JS.
Reversible: restore from *.bak-reseal or rebuild site.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request
from datetime import datetime, timezone
from pathlib import Path

ASSETS = ("oil", "gas", "gold")
API = "https://arif-fazil.com/wealth/{asset}/api/snapshot"
# Live + dist + public sources (first existing wins for each asset, all existing updated)
ROOTS = [
    Path("/var/www/html"),  # live commodity apps: /oil /gold /gas
    Path("/var/www/html/arif"),  # SPA-mirrored copies
    Path("/root/arif-fazil.com/sites/arif-fazil.com/dist"),
    Path("/root/arif-fazil.com/sites/arif-fazil.com/public"),
]
PACKET_RE = re.compile(
    r'(<script[^>]*id=["\']wealth-reality-packet["\'][^>]*>)(.*?)(</script>)',
    re.S | re.I,
)


def fetch_snapshot(asset: str) -> dict:
    url = API.format(asset=asset)
    req = urllib.request.Request(
        url, headers={"User-Agent": "reseal-commodity-packets/1.0"}
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read().decode())


def merge_packet(old: dict, snap: dict) -> dict:
    out = dict(old) if isinstance(old, dict) else {}
    ticker = snap.get("ticker") or {}
    levels = snap.get("levels") or {}
    macro = snap.get("macro") or {}
    observed = snap.get("observed_at") or datetime.now(timezone.utc).isoformat()
    out["schema"] = snap.get("schema") or out.get("schema") or "wealth.snapshot.v1"
    out["observed_at"] = observed
    out["timestamp"] = observed
    if snap.get("coherence_id"):
        out["coherence_id"] = snap["coherence_id"]
    # price fields used by scrapers
    if "price" in ticker:
        out["price_usd"] = ticker["price"]
    if "change_pct" in ticker:
        out["change_pct"] = ticker["change_pct"]
    if "symbol" in ticker:
        out["symbol"] = ticker["symbol"]
    # nest full live surfaces when present
    out["ticker"] = ticker
    if levels:
        out["levels"] = levels
    if macro:
        out["macro"] = macro
    # 2026-08-06: refresh market_state from live snapshot
    # Previously market_state was carried forward verbatim — fossilized inside
    # otherwise-fresh JSON-LD. Client JS patches it in-browser but static
    # consumers (scrapers, search engines) see the stale values.
    ms = out.get("market_state")
    if isinstance(ms, dict):
        if "price" in ticker:
            ms["price_usd"] = ticker["price"]
        if "symbol" in ticker:
            ms["symbol"] = ticker["symbol"]
        if "change_pct" in ticker:
            ms["change_pct"] = ticker["change_pct"]
        if levels:
            ms["key_levels"] = levels
        out["market_state"] = ms

    out["resealed_at"] = datetime.now(timezone.utc).isoformat()
    out["reseal_source"] = "live_snapshot_api"
    return out


def patch_file(path: Path, snap: dict) -> bool:
    html = path.read_text(encoding="utf-8", errors="replace")
    m = PACKET_RE.search(html)
    if not m:
        return False
    try:
        old = json.loads(m.group(2))
    except json.JSONDecodeError:
        old = {}
    new = merge_packet(old, snap)
    new_json = json.dumps(new, ensure_ascii=False, separators=(",", ":"))
    new_html = html[: m.start(2)] + new_json + html[m.end(2) :]
    if new_html == html:
        return False
    bak = path.with_suffix(path.suffix + ".bak-reseal")
    if not bak.exists():
        bak.write_text(html, encoding="utf-8")
    path.write_text(new_html, encoding="utf-8")
    return True


def main() -> int:
    updated = 0
    errors = 0
    for asset in ASSETS:
        try:
            snap = fetch_snapshot(asset)
        except Exception as e:
            print(f"ERROR fetch {asset}: {e}", file=sys.stderr)
            errors += 1
            continue
        price = (snap.get("ticker") or {}).get("price")
        obs = snap.get("observed_at")
        print(f"{asset}: price={price} observed_at={obs}")
        for root in ROOTS:
            p = root / asset / "index.html"
            if not p.is_file():
                continue
            try:
                if patch_file(p, snap):
                    print(f"  patched {p}")
                    updated += 1
                else:
                    print(f"  skip {p} (no packet or unchanged)")
            except Exception as e:
                print(f"  ERROR {p}: {e}", file=sys.stderr)
                errors += 1
    print(f"done updated={updated} errors={errors}")
    return 1 if errors else 0


if __name__ == "__main__":
    raise SystemExit(main())
