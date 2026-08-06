#!/usr/bin/env bash
# ⚖️ verify-attestation.sh — kernel identity proof surface
# Forged 2026-08-06 by 333-AGI. DITEMPA BUKAN DIBERI.
#
# Fetches arifOS kernel health and writes a public attestation JSON
# to the web root. This closes the /000 → /999 → /verify/ audit loop.
# External witnesses can fetch this file and compare the identity hash
# against what they see on the /000 page.
#
# Cadence: every 5 min (cron). Read-only. No mutation.
set -euo pipefail

KERNEL="http://127.0.0.1:8088"
OUTFILE="/var/www/html/arif/verify/attestation.json"
OUTFILE_VERIFY="/var/www/html/arif/verify/index.json"     # Canonical: /verify
TMP=$(mktemp)

cleanup() { rm -f "$TMP"; }
trap cleanup EXIT

# Fetch kernel health
HEALTH=$(curl -sf --max-time 5 "${KERNEL}/health" 2>/dev/null) || {
  echo '{"error":"kernel_unreachable","verified":false,"timestamp":"'"$(date -u +%Y-%m-%dT%H:%M:%SZ)"'"}' > "$OUTFILE"
  cp "$OUTFILE" "$OUTFILE_VERIFY"
  exit 0
}

# Also fetch vault999 verify for chain status
VAULT_VERIFY=$(curl -sf --max-time 5 "${KERNEL}/999/verify" 2>/dev/null || echo '{}')

# Compose public attestation
python3 -c "
import json, sys
from datetime import datetime, timezone

health = json.loads(sys.argv[1])
vault = json.loads(sys.argv[2]) if len(sys.argv) > 2 else {}

identity = health.get('identity_hash', 'UNKNOWN')
if isinstance(identity, dict):
    identity = identity.get('b3_full', identity.get('b3_prefix', 'UNKNOWN'))

td = health.get('thermodynamic', {})
sr = health.get('software_release', {})

attestation = {
    'schema': 'arifos.verify.v1',
    'verified': td.get('verdict') == 'SEAL' and health.get('floors_active') == 13,
    'timestamp': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
    'kernel': {
        'identity_hash': identity,
        'identity_prefix': identity[:12] if len(identity) >= 12 else identity,
        'verdict': td.get('verdict', 'UNKNOWN'),
        'floors_active': health.get('floors_active', 0),
        'vault999_health': health.get('vault999_health', 'UNKNOWN'),
        'runtime_drift': health.get('runtime_drift', None),
        'contract_drift': health.get('contract_drift', None),
        'release_id': sr.get('release_id', 'UNKNOWN'),
        'source_commit': sr.get('source_commit', 'UNKNOWN')[:12],
    },
    'vault999': {
        'chain_verified': vault.get('verified', None),
        'head': vault.get('head', None),
        'chain_status': vault.get('chain_status', None),
        'last_seal': vault.get('last_seal', None),
    },
    'falsification': {
        'how_to_verify_001': 'Compare kernel.identity_hash against the BLAKE3 hash on /000. They must match.',
        'how_to_verify_002': 'Check kernel.floors_active == 13. Fewer floors = degraded governance.',
        'how_to_verify_003': 'Check kernel.runtime_drift == false. True = source ≠ deployed code.',
        'how_to_verify_004': 'Fetch this endpoint again in 5 min. identity_hash must remain stable.',
    },
    'public_surfaces': {
        '/000': 'https://arif-fazil.com/000/ — Genesis page with embedded identity hash',
        '/999/verify': 'https://arif-fazil.com/999/verify — vault chain integrity proof',
        '/verify': 'https://arif-fazil.com/verify — this endpoint',
        '/health': 'https://arifos.arif-fazil.com/health — kernel health (may require tunnel)',
    },
    'constitution': 'F1–F13 · arifOS kernel · DITEMPA BUKAN DIBERI',
}

json.dump(attestation, sys.stdout, indent=2, ensure_ascii=False)
" "$HEALTH" "$VAULT_VERIFY" > "$TMP"

mkdir -p "$(dirname "$OUTFILE")"
cp "$TMP" "$OUTFILE"
cp "$TMP" "$OUTFILE_VERIFY"
chmod 644 "$OUTFILE" "$OUTFILE_VERIFY"
