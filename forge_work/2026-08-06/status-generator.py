#!/usr/bin/env python3
"""
arif-fazil.com status.json generator
Polls the 8 federated organ /health endpoints and writes /var/www/html/status.json
on every run. Designed to be called by cron every 5 minutes.

Authority: AGENTS.md "Caddy /health beats every prose table"
Reversibility: pure read + write of a single JSON file
T-class: T1 (single file write, no service mutation)
"""

from __future__ import annotations

import json
import os
import subprocess
import sys
import time
from typing import Any
from urllib.error import URLError
from urllib.request import Request, urlopen

OUT_PATH = "/var/www/html/status.json"
TIMEOUT_S = 2

# Organ registry: (id, port, base_url, scope)
ORGANS: list[dict[str, str]] = [
    {"id": "arifOS",   "port": "8088",  "scope": "CORE",         "class": "KERNEL",      "base": "http://127.0.0.1:8088"},
    {"id": "A-FORGE",  "port": "7071",  "scope": "CORE",         "class": "EXECUTE",     "base": "http://127.0.0.1:7071"},
    {"id": "GEOX",     "port": "8081",  "scope": "CORE",         "class": "EARTH",       "base": "http://127.0.0.1:8081"},
    {"id": "WEALTH",   "port": "18082", "scope": "CORE",         "class": "CAPITAL",     "base": "http://127.0.0.1:18082"},
    {"id": "WELL",     "port": "18083", "scope": "CORE",         "class": "VITALITY",    "base": "http://127.0.0.1:18083"},
    {"id": "arifFlow", "port": "7073",  "scope": "METABOLISM",   "class": "METABOLIZE",  "base": "http://127.0.0.1:7073"},
    {"id": "SIGNAL",   "port": "18084", "scope": "CORE",         "class": "MEMBRANE",    "base": "http://127.0.0.1:18084"},
    {"id": "AAA",      "port": "3001",  "scope": "CORE",         "class": "COCKPIT",     "base": "http://127.0.0.1:3001"},
]


def fetch_health(base: str) -> tuple[str, dict[str, Any] | str]:
    """Probe /health with a 2s timeout. Return (state, body)."""
    url = f"{base}/health"
    try:
        req = Request(url, headers={"Accept": "application/json"})
        with urlopen(req, timeout=TIMEOUT_S) as resp:
            raw = resp.read().decode("utf-8", errors="replace")
            try:
                return "live", json.loads(raw)
            except json.JSONDecodeError:
                return "live", raw[:512]
    except (URLError, TimeoutError, OSError) as e:
        return "down", f"{type(e).__name__}: {str(e)[:160]}"
    except Exception as e:
        return "down", f"{type(e).__name__}: {str(e)[:160]}"


def extract_fq(body: dict[str, Any] | str) -> float | None:
    """arifFlow returns {fq: {quotient, ...}}."""
    if not isinstance(body, dict):
        return None
    fq = body.get("fq")
    if isinstance(fq, dict):
        return fq.get("quotient")
    return None


def extract_version(body: dict[str, Any] | str) -> str | None:
    if not isinstance(body, dict):
        return None
    for k in ("version", "kanon", "service", "release_name"):
        v = body.get(k)
        if isinstance(v, str):
            return v
    return None


def extract_tool_count(body: dict[str, Any] | str) -> int | None:
    if not isinstance(body, dict):
        return None
    for k in ("tools_loaded", "tool_count", "public_tools", "canonical_tools"):
        v = body.get(k)
        if isinstance(v, int):
            return v
    return None


def main() -> int:
    started = time.time()
    organs_out: list[dict[str, Any]] = []
    fq_value: float | None = None
    tool_count_total = 0
    live_count = 0

    for o in ORGANS:
        state, body = fetch_health(o["base"])
        if state == "live":
            live_count += 1
        record: dict[str, Any] = {
            "id":       o["id"],
            "scope":    o["scope"],
            "class":    o["class"],
            "port":     o["port"],
            "status":   state,
            "endpoint": f"{o['base']}/health",
        }
        if state == "live":
            v = extract_version(body)
            if v:
                record["version"] = v
            tc = extract_tool_count(body)
            if tc is not None:
                record["tool_count"] = tc
                tool_count_total += tc
            fq = extract_fq(body)
            if fq is not None:
                record["fq"] = round(fq, 3)
                fq_value = fq
        else:
            record["error"] = body
        organs_out.append(record)

    payload: dict[str, Any] = {
        "federation": "arif-fazil.com",
        "as_of":      time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "federation_status": "live" if live_count == len(ORGANS) else "degraded",
        "organs_live": live_count,
        "organs_total": len(ORGANS),
        "fq": round(fq_value, 3) if fq_value is not None else None,
        "tools_total": tool_count_total,
        "scan_duration_ms": int((time.time() - started) * 1000),
        "organs": organs_out,
    }

    # Write atomically (write to tmp + rename)
    tmp = f"{OUT_PATH}.tmp"
    try:
        with open(tmp, "w", encoding="utf-8") as f:
            json.dump(payload, f, indent=2, ensure_ascii=False)
            f.write("\n")
        os.replace(tmp, OUT_PATH)
        print(f"wrote {OUT_PATH}  organs_live={live_count}/{len(ORGANS)}  fq={payload['fq']}  tools={payload['tools_total']}  duration={payload['scan_duration_ms']}ms")
        return 0
    except OSError as e:
        print(f"ERR: failed to write {OUT_PATH}: {e}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    sys.exit(main())
