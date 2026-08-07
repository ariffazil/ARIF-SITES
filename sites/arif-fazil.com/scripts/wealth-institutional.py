#!/usr/bin/env python3
"""
WEALTH Institutional Health Panel — arif-fazil.com/propa/
Generates HTML panel with Power Consequence Map + Institutional Stress data.
Refreshes via cron. Fetches from local WEALTH engine.

DITEMPA BUKAN DIBERI
"""

import json, sys, os, ssl
from datetime import datetime, timezone
from urllib.request import Request, urlopen


def call_wealth_tool(tool_name, args):
    """Call WEALTH MCP tool via localhost API with session init."""
    ssl_ctx = ssl.create_default_context()
    base = "http://localhost:18082/mcp"
    try:
        # Initialize session
        init_req = Request(
            base,
            data=json.dumps(
                {
                    "jsonrpc": "2.0",
                    "id": 1,
                    "method": "initialize",
                    "params": {
                        "protocolVersion": "2024-11-05",
                        "capabilities": {},
                        "clientInfo": {
                            "name": "wealth-institutional",
                            "version": "1.0",
                        },
                    },
                }
            ).encode(),
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "MCP-Protocol-Version": "2024-11-05",
            },
        )
        init_resp = urlopen(init_req, timeout=5, context=ssl_ctx)
        # Get session ID from header
        sid = init_resp.headers.get("mcp-session-id", "")

        if not sid:
            return None

        # Call tool
        call_req = Request(
            base,
            data=json.dumps(
                {
                    "jsonrpc": "2.0",
                    "id": 2,
                    "method": "tools/call",
                    "params": {"name": tool_name, "arguments": args},
                }
            ).encode(),
            headers={
                "Content-Type": "application/json",
                "Accept": "application/json",
                "MCP-Protocol-Version": "2024-11-05",
                "Mcp-Session-Id": sid,
            },
        )
        call_resp = urlopen(call_req, timeout=15, context=ssl_ctx)
        data = json.loads(call_resp.read())

        if "result" in data:
            for c in data["result"].get("content", []):
                if c.get("type") == "text":
                    return json.loads(c["text"])
        return None
    except Exception as e:
        print(f"<!-- WEALTH call failed: {e} -->", file=sys.stderr)
        return None


def fetch_institutional():
    """Fetch institutional health from WEALTH."""
    result = {"pcm": None, "stress": None}

    # PCM via capital_entropy
    pcm_raw = call_wealth_tool(
        "capital_entropy",
        {
            "mode": "power_consequence_map",
            "decision_makers": json.dumps(
                [{"role": "PETRONAS Board", "count": 1}, {"role": "MoF", "count": 1}]
            ),
            "beneficiaries": json.dumps(
                [
                    {"role": "Federal Gov (dividend)", "count": 1},
                    {"role": "Employees", "count": 1},
                ]
            ),
            "cost_bearers": json.dumps(
                [
                    {"role": "Balance Sheet", "count": 1},
                    {"role": "Future Capex", "count": 1},
                    {"role": "Minorities (no exit)", "count": 1},
                ]
            ),
            "veto_holders": json.dumps(["Prime Minister", "MoF"]),
        },
    )
    if pcm_raw:
        result["pcm"] = pcm_raw.get("result", {})

    return result


def format_panel(data, timestamp):
    pcm = data.get("pcm", {})
    ts = timestamp.strftime("%Y-%m-%d %H:%M UTC")

    metrics = []
    if pcm:
        metrics = [
            ("Veto Concentration", pcm.get("veto_concentration", 0), 1.0),
            ("Consequence Gap", pcm.get("consequence_gap", 0), 1.0),
            ("Compensation Gap", pcm.get("compensation_gap", 0), 1.0),
            ("Power Concentration", pcm.get("power_concentration", 0), 1.0),
            ("Exit Ratio", pcm.get("exit_ratio", 0), 1.0),
        ]

    cards = ""
    for name, val, mx in metrics:
        ratio = val / mx if mx > 0 else 1
        if ratio <= 0.33:
            color = "#22c55e"
        elif ratio <= 0.66:
            color = "#d4a017"
        else:
            color = "#f0506e"
        pct = min(ratio * 100, 100)
        cards += f"""    <div class="inst-card">
      <div class="inst-label">{name}</div>
      <div class="inst-val" style="color:{color}">{val:.2f}</div>
      <div class="inst-bar"><div class="inst-fill" style="width:{pct}%;background:{color}"></div></div>
    </div>
"""

    css = """<style>
.inst-panel{{margin:0 0 1.2rem;padding:1rem 1.1rem;border:1px solid var(--line,#2a2a3a);border-radius:8px;background:rgba(212,160,23,.03)}}
.inst-head{{display:flex;flex-wrap:wrap;align-items:baseline;gap:.6rem;margin-bottom:.75rem;font-size:.7rem;letter-spacing:.08em}}
.inst-badge{{font-family:var(--mono);font-weight:700;padding:.25rem .55rem;border:1px solid #d4a017;border-radius:4px;letter-spacing:.1em;text-transform:uppercase;color:#d4a017}}
.inst-grid{{display:grid;grid-template-columns:repeat(auto-fill,minmax(155px,1fr));gap:.5rem;margin-bottom:.6rem}}
.inst-card{{padding:.45rem .6rem;background:var(--surface3,#1e1e2e);border:1px solid var(--line,#2a2a3a);border-radius:6px}}
.inst-label{{font-size:.62rem;color:var(--dim,#8a8378);letter-spacing:.04em;text-transform:uppercase}}
.inst-val{{font-family:var(--mono);font-size:1.05rem;font-weight:700;margin:.15rem 0}}
.inst-bar{{height:3px;background:var(--line,#2a2a3a);border-radius:2px;overflow:hidden}}
.inst-fill{{height:100%;border-radius:2px;transition:width .3s}}
.inst-foot{{font-size:.62rem;color:var(--faint,#5a554d);line-height:1.5}}
</style>"""

    html = f"""<div class="inst-panel">
  <div class="inst-head">
    <span class="inst-badge">WEALTH MCP</span>
    <span>Power Consequence Map &middot; Institutional Health</span>
    <span style="margin-left:auto;font-size:.6rem;color:var(--faint)">{ts}</span>
  </div>
  <div class="inst-grid">
{cards}  </div>
  <div class="inst-foot">
    <strong>Source:</strong> WEALTH capital_entropy(power_consequence_map) · COMPUTE_ONLY. Veto 1.0 = PM + MoF hold all institutional veto. Consequence gap measures distance between who decides and who bears cost. Compensation gap 1.0 = cost bearers have no structured exit. <span style="color:var(--faint)">arifOS judges. Arif decides.</span>
  </div>
</div>"""
    return css + "\n" + html


def main():
    now = datetime.now(timezone.utc)
    data = fetch_institutional()

    # Cache
    for subdir in ["dist/propa", "dist/vitals"]:
        cache_dir = os.path.join(
            os.path.dirname(os.path.abspath(__file__)), "..", subdir
        )
        os.makedirs(cache_dir, exist_ok=True)
        with open(os.path.join(cache_dir, "institutional_health.json"), "w") as f:
            json.dump({"data": data, "ts": now.isoformat()}, f, indent=2)

    html = format_panel(data, now)
    print(html)


if __name__ == "__main__":
    main()
