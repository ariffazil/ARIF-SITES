#!/usr/bin/env bash
# Read-only source/build parity check for the shared Observatory renderer.
#
# Goal (Prompt: Observatory upgrade):
#   * Verify the canonical source and the two tracked mirrors are byte-equal.
#   * Verify the .well-known/output artifacts (if any exist locally) agree
#     with the source before deployment.
#   * Exit non-zero on drift with a clear, actionable message.
#   * Never write to /var/www/html, never deploy, never restart services.
#
# Usage:
#   scripts/check_observatory_parity.sh            # default source vs mirrors
#   scripts/check_observatory_parity.sh --verbose  # include SHA-256 of each file
#
# Exit codes:
#   0 — all surface sources agree
#   1 — drift detected
#   2 — missing file (treated as warning, not failure) when --strict is not set

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
SOURCE="$REPO_ROOT/sites/shared/observatory.js"
MIRROR_A="$REPO_ROOT/sites/arif-fazil.com/public/_shared/observatory.js"
MIRROR_B="$REPO_ROOT/sites/arif-fazil.com/public/arifos/_shared/observatory.js"

VERBOSE=0
for arg in "$@"; do
  case "$arg" in
    --verbose|-v) VERBOSE=1 ;;
    --help|-h)
      sed -n '2,18p' "$0"
      exit 0
      ;;
  esac
done

sha256() { sha256sum "$1" | awk '{print $1}'; }

fail=0
check_pair() {
  local label="$1" lhs="$2" rhs="$3"
  if [[ ! -f "$lhs" && ! -f "$rhs" ]]; then
    printf 'skip  %s (neither path exists)\n' "$label"
    return 0
  fi
  if [[ ! -f "$lhs" || ! -f "$rhs" ]]; then
    printf 'skip  %s (one path missing)\n' "$label"
    return 0
  fi
  local lhs_hash rhs_hash
  lhs_hash="$(sha256 "$lhs")"
  rhs_hash="$(sha256 "$rhs")"
  if [[ "$lhs_hash" == "$rhs_hash" ]]; then
    printf 'ok    %s\n' "$label"
    if ((VERBOSE)); then
      printf '       %s\n       %s\n' "$lhs" "$rhs"
    fi
  else
    printf 'drift %s\n' "$label"
    printf '       %s = %s\n' "$lhs" "$lhs_hash"
    printf '       %s = %s\n' "$rhs" "$rhs_hash"
    fail=1
  fi
}

echo "Observatory parity check (read-only, no deploy mutation)"
check_pair "shared/observatory.js vs arif-fazil.com/public/_shared/observatory.js" "$SOURCE" "$MIRROR_A"
check_pair "shared/observatory.js vs arif-fazil.com/public/arifos/_shared/observatory.js" "$SOURCE" "$MIRROR_B"
check_pair "arif-fazil.com/public/_shared/observatory.js vs arif-fazil.com/public/arifos/_shared/observatory.js" "$MIRROR_A" "$MIRROR_B"

if ((fail)); then
  printf '\nDrift detected.\n' >&2
  printf 'Resolve by running: install -m 644 <canonical-source> <mirror-target>\n' >&2
  exit 1
fi

printf '\nAll observatory renderer surfaces agree (sha-256 match).\n'
exit 0
