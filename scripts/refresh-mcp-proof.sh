#!/bin/bash
# refresh-mcp-proof.sh — Regenerate /proof/index.json from live MCP health + tools
# Run via cron: */15 * * * * /root/ARIF-SITES/scripts/refresh-mcp-proof.sh
set -euo pipefail

PROOF_DIR="/var/www/html/mcp/proof"
SOURCE_DIR="/root/ARIF-SITES/sites/mcp.arif-fazil.com/proof"
TMP=$(mktemp)

python3 - << 'PYEOF' > "$TMP"
import json, urllib.request
from datetime import datetime, timezone

def fetch(url):
    try:
        req = urllib.request.Request(url, headers={"Accept": "application/json"})
        with urllib.request.urlopen(req, timeout=10) as r:
            return json.loads(r.read())
    except Exception as e:
        return {"error": str(e)}

health = fetch("https://mcp.arif-fazil.com/health")
tools_data = fetch("https://mcp.arif-fazil.com/tools")
now = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

tools = [{"name": t["name"], "stage": t["stage"], "access": t.get("access", "unknown"), "description": t["description"][:120]} for t in tools_data.get("tools", [])]

proof = {
    "@context": "https://arif-fazil.com/proof/v1",
    "type": "MCPProof",
    "generated_at": now,
    "server": {
        "identity": "did:web:arif-fazil.com",
        "endpoint": "https://mcp.arif-fazil.com/mcp",
        "service": health.get("service"),
        "release": health.get("release_name"),
        "version": health.get("version"),
        "commit": health.get("git_commit"),
        "branch": health.get("git_branch"),
        "build_time": health.get("build_time"),
        "transport": health.get("transport"),
        "protocol_version": health.get("mcp_protocol_version"),
    },
    "tools": {
        "count": len(tools),
        "surface": tools,
        "surface_hash": health.get("surface_consistency", {}).get("canonical_hash"),
        "surface_verdict": health.get("surface_consistency", {}).get("verdict"),
        "contract_drift": health.get("contract_drift"),
        "runtime_drift": health.get("runtime_drift"),
    },
    "floors": {
        "active": health.get("floors_active"),
        "enforcement": health.get("floors_enforcement"),
        "classification": health.get("governance", {}).get("floors_health_report", {}),
        "runtime_values": health.get("runtime_floors", {}),
    },
    "vault": {
        "health": health.get("vault999_health"),
        "last_seal": health.get("governance", {}).get("last_seal_timestamp"),
    },
    "governance": {
        "final_authority": health.get("final_authority"),
        "owner_summary": health.get("owner_summary"),
        "thermodynamic": health.get("thermodynamic"),
        "seal_readiness": health.get("seal_readiness"),
    },
    "identity": {
        "hash_algorithm": health.get("identity_hash", {}).get("algorithm"),
        "hash": health.get("identity_hash", {}).get("hash"),
        "boot_attestation": health.get("boot_attestation"),
    },
    "verification": {
        "did_document": "https://arif-fazil.com/.well-known/did.json",
        "did_configuration": "https://arif-fazil.com/.well-known/did-configuration.json",
        "constitution": "https://arifos.arif-fazil.com/constitution.json",
        "federation_manifest": "https://arif-fazil.com/.well-known/arifos-federation.json",
        "vault_attestation": "https://arif-fazil.com/999/",
        "human_identity": "https://arif-fazil.com/000/",
    },
    "seal": "DITEMPA BUKAN DIBERI — 999 SEAL ALIVE",
}
print(json.dumps(proof, indent=2))
PYEOF

# Atomic deploy
cp "$TMP" "$SOURCE_DIR/index.json"
cp "$TMP" "$PROOF_DIR/index.json"
rm "$TMP"
echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] proof refreshed" >&2
