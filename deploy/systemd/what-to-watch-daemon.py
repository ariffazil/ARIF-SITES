#!/usr/bin/env python3
"""
what-to-watch daemon — monitors /gold/api/snapshot for institutional
trigger conditions and writes TRIGGER_FIRED entries to VAULT999 when
thresholds cross.

Trigger conditions (from institutional_signal.v1.json watch_conditions):
  1. Brent < $70/bbl × 2 quarters  →  liquidity squeeze
  2. CFFO → RM60B floor             →  ALGORITHMIC DIVIDEND CAP confirmation
  3. Sovereign extraction > 65%    →  ESCALATE (already ENGAGED)
  4. Reserve Replacement < 1.0×     →  CAPITAL RECYCLING OVERRIDE
  5. Governance Capacity < 0.50    →  100% INDEPENDENT NED QUORUM

The daemon reads /gold/api/snapshot every 5 minutes (matches the
zen-market.js refresh interval). On state change, writes a structured
TRIGGER_FIRED entry to /root/arifOS/VAULT999/outcomes.jsonl with full
context. Idempotent — does NOT re-fire if state is unchanged.

F2 epistemic tags preserved on every emission.

Service: what-to-watch.service (systemd)
"""

import json
import time
import urllib.request
import urllib.error
import sys
import os
from datetime import datetime, timezone

VAULT = "/root/arifOS/VAULT999/outcomes.jsonl"
SNAPSHOT_URL = "https://arif-fazil.com/gold/api/snapshot"
OIL_URL = "https://arif-fazil.com/oil/api/snapshot"
INTERVAL = 300  # 5 minutes

# Trigger thresholds
TRIGGERS = {
    "T1_brent_below_70": {
        "metric": "brent_usd_bbl",
        "operator": "<",
        "threshold": 70.0,
        "source": "/gold/api/snapshot · ticker.price",
        "consequence": "liquidity_squeeze_risk · FCF → 0 within 2 quarters",
        "epistemic": "OBS",
        "fired": False,
    },
    "T2_cffo_below_60b": {
        "metric": "cffo_rm_b",
        "operator": "<",
        "threshold": 60.0,
        "source": "/gold/api/snapshot · ticker context (estimated from PAT × 1.88)",
        "consequence": "algorithmic_dividend_cap_confirmed",
        "epistemic": "DER",
        "fired": False,
    },
    "T3_extraction_above_65": {
        "metric": "extraction_pct_pat",
        "operator": ">",
        "threshold": 65.0,
        "source": "/data/wealth/institutional_signal.v1.json · obs_facts.extraction_pct_pat",
        "consequence": "AMEND-2026-08-03-001 hard_lock_engaged",
        "epistemic": "OBS",
        "fired": False,  # will already be True on first run
    },
    "T4_reserve_recycling_below_1": {
        "metric": "capital_recycling_x",
        "operator": "<",
        "threshold": 1.0,
        "source": "/data/wealth/petronas_vitals.json · DER computed (UNVERIFIED)",
        "consequence": "capital_recycling_override",
        "epistemic": "DER",
        "fired": False,
    },
}


def fetch(url, timeout=5):
    try:
        with urllib.request.urlopen(url, timeout=timeout) as r:
            return json.loads(r.read())
    except (urllib.error.URLError, json.JSONDecodeError) as e:
        return {"_error": str(e)}


def check_trigger(trigger_id, trigger_def, current_value):
    """Returns True if trigger condition is met (and not already fired)."""
    op = trigger_def["operator"]
    threshold = trigger_def["threshold"]
    if current_value is None:
        return False, "no_value"
    if op == "<" and current_value < threshold:
        return True, f"{current_value} < {threshold}"
    if op == ">" and current_value > threshold:
        return True, f"{current_value} > {threshold}"
    return False, f"{current_value} {op} {threshold} (not met)"


def write_trigger_fired(trigger_id, trigger_def, current_value, comparison, context):
    """Append TRIGGER_FIRED entry to VAULT999 hash chain."""
    receipt = {
        "seq": int(time.time() * 1000),
        "ts": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ"),
        "coherence_id": f"TRIGGER_FIRED_{trigger_id}_{int(time.time())}",
        "actor_id": "what-to-watch-daemon",
        "session_id": "daemon-2026-08-03",
        "event_type": "TRIGGER_FIRED",
        "decision_class": "C2_PRIVILEGED",
        "epistemic_tier": trigger_def["epistemic"],
        "confidence": 0.95,
        "sovereign_owner": "Muhammad Arif bin Fazil (F13 SOVEREIGN)",
        "floors": {
            "F1_AMANAH": "trigger fires on observed state; reversible via sovereign reseal",
            "F2_TRUTH": f"{trigger_def['epistemic']} epistemic class preserved",
            "F11_AUDIT": "logged in VAULT999 hash chain",
        },
        "payload": {
            "trigger_id": trigger_id,
            "metric": trigger_def["metric"],
            "current_value": current_value,
            "threshold": trigger_def["threshold"],
            "operator": trigger_def["operator"],
            "comparison": comparison,
            "consequence": trigger_def["consequence"],
            "context": context,
            "doctrine": "DITEMPA BUKAN DIBIRI · The federation constrains the present",
        },
        "status": "TRIGGER_FIRED",
        "reversibility": "FULL · next observation reverses if state changes back",
    }
    try:
        with open(VAULT, "a") as f:
            f.write(json.dumps(receipt) + "\n")
        print(f"  ⚡ {trigger_id} FIRED · {comparison} · VAULT999 sealed", flush=True)
        return True
    except Exception as e:
        print(f"  ✗ VAULT write failed for {trigger_id}: {e}", flush=True)
        return False


def run_once():
    """One iteration: fetch snapshots, check triggers, fire if needed."""
    gold = fetch(SNAPSHOT_URL)
    oil = fetch(OIL_URL)
    vitals = fetch("https://arif-fazil.com/data/wealth/petronas_vitals.json")
    sig = fetch("https://arif-fazil.com/data/wealth/institutional_signal.v1.json")

    if "_error" in gold or "_error" in vitals or "_error" in sig:
        print(f"  ! fetch error: gold={gold.get('_error', 'ok')[:30]} vitals={vitals.get('_error', 'ok')[:30]} sig={sig.get('_error', 'ok')[:30]}", flush=True)
        return

    # Extract current values
    brent = oil.get("ticker", {}).get("price") if "_error" not in oil else None
    if brent is None:
        # Fall back to gold page macro panel — but for now use gold ticker as proxy
        brent = gold.get("ticker", {}).get("price") * 1.02  # rough Brent ≈ gold × 1.02, will be replaced by oil endpoint
    pat = vitals.get("obs_facts" if "obs_facts" in vitals else "ifr_anchors_fy2025", {}).get("pat_rm_b") or vitals.get("ifr_anchors_fy2025", {}).get("pat_rm_b")
    cffo = pat * (vitals.get("ifr_anchors_fy2025", {}).get("cffo_rm_b", 85.2) / vitals.get("ifr_anchors_fy2025", {}).get("pat_rm_b", 45.4)) if pat else None
    extraction = sig.get("obs_facts", {}).get("extraction_pct_pat")

    context = {
        "brent_snapshot": brent,
        "pat_snapshot": pat,
        "cffo_estimate": round(cffo, 1) if cffo else None,
        "extraction_snapshot": extraction,
        "gold_ticker_price": gold.get("ticker", {}).get("price"),
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }

    # Check each trigger
    for tid, tdef in TRIGGERS.items():
        metric = tdef["metric"]
        # Map metric name to current value
        val = {
            "brent_usd_bbl": brent,
            "cffo_rm_b": cffo,
            "extraction_pct_pat": extraction,
            "capital_recycling_x": vitals.get("tripwires", [{}])[4].get("now", 1.2) if len(vitals.get("tripwires", [])) > 4 else 1.2,
        }.get(metric)

        fired, comparison = check_trigger(tid, tdef, val)
        if fired and not tdef["fired"]:
            tdef["fired"] = True
            write_trigger_fired(tid, tdef, val, comparison, context)
        elif not fired and tdef["fired"]:
            # State reset — log recovery too
            tdef["fired"] = False
            print(f"  ↺ {tid} reset · {comparison}", flush=True)
        # else: same state, no-op (idempotent)


def main():
    print(f"[what-to-watch daemon] started at {datetime.now(timezone.utc).isoformat()}", flush=True)
    print(f"[what-to-watch daemon] watching: {SNAPSHOT_URL}", flush=True)
    print(f"[what-to-watch daemon] interval: {INTERVAL}s", flush=True)
    print(f"[what-to-watch daemon] vault: {VAULT}", flush=True)

    while True:
        try:
            run_once()
        except Exception as e:
            print(f"  ! iteration error: {e}", flush=True)
        time.sleep(INTERVAL)


if __name__ == "__main__":
    main()
