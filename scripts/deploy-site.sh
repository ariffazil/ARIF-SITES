#!/usr/bin/env bash
# Compatibility entrypoint for deploying one canonical static surface.
set -euo pipefail
[[ $# -eq 1 ]] || { echo "Usage: $0 HOST" >&2; exit 2; }
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/deploy-vps.sh" --site "$1"
