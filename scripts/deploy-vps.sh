#!/usr/bin/env bash
# Compatibility entrypoint. The root deployer is canonical.
set -euo pipefail
exec "$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/deploy-vps.sh" "$@"
