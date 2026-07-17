#!/usr/bin/env bash
# Canonical static-surface deployer for the arifOS federation.
# Domain inventory: config/sites.json. Caddy/DNS changes are deliberately out of scope.

set -euo pipefail

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REGISTRY="$REPO_ROOT/config/sites.json"
HTML_ROOT="/var/www/html"
OBSERVATORY_RUNTIME="/root/.arifos/observatory"
ONLY_SITE=""
RELOAD_CADDY=false

usage() {
  echo "Usage: $0 [--site HOST] [--reload-caddy]" >&2
}

while (($#)); do
  case "$1" in
    --site)
      [[ $# -ge 2 ]] || { usage; exit 2; }
      ONLY_SITE="$2"
      shift 2
      ;;
    --reload-caddy)
      RELOAD_CADDY=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown argument: $1" >&2
      usage
      exit 2
      ;;
  esac
done

[[ -f "$REGISTRY" ]] || { echo "Missing registry: $REGISTRY" >&2; exit 1; }

mapfile -t SITE_ROWS < <(
  python3 - "$REGISTRY" "$ONLY_SITE" <<'PY'
import json
import sys

registry, selected = sys.argv[1:]
with open(registry, encoding="utf-8") as handle:
    data = json.load(handle)

rows = [site for site in data["surfaces"] if site.get("deployable")]
if selected:
    rows = [site for site in rows if site["host"] == selected]
    if not rows:
        raise SystemExit(f"Unknown or non-deployable site: {selected}")

for site in rows:
    print("\t".join([
        site["host"], site["source"], site["webroot"], site.get("build", "")
    ]))
PY
)

echo "[sites] Canonical registry: $REGISTRY"

# One global asset tree serves every hostname through Caddy's /_shared/* route.
install -d -m 0755 "$HTML_ROOT/_shared"
rsync -a --delete "$REPO_ROOT/sites/shared/" "$HTML_ROOT/_shared/"

for row in "${SITE_ROWS[@]}"; do
  IFS=$'\t' read -r host source_rel webroot build_cmd <<<"$row"
  source_dir="$REPO_ROOT/$source_rel"
  deploy_dir="$source_dir"

  [[ -d "$source_dir" ]] || { echo "Missing source for $host: $source_dir" >&2; exit 1; }
  if [[ -n "$build_cmd" ]]; then
    echo "[sites] Building $host"
    (cd "$source_dir" && npm ci --quiet --legacy-peer-deps && npm run build)
    deploy_dir="$source_dir/dist"
  fi

  echo "[sites] Syncing $host -> $webroot"
  install -d -m 0755 "$webroot"
  rsync -a --delete "$deploy_dir/" "$webroot/"

  if [[ "$host" == "arif-fazil.com" ]]; then
    # Caddy serves these files directly to AI crawlers at /wealth/makcikgpt/*.
    install -d -m 0755 "$webroot/wealth/makcikgpt"
    install -m 0644 "$source_dir"/public/makcikgpt-md/*.md "$webroot/wealth/makcikgpt/"
  fi

  if [[ "$host" == "arifos.arif-fazil.com" ]]; then
    if ! python3 "$OBSERVATORY_RUNTIME/observatory_emit.py"; then
      echo "[sites] WARNING: Observatory emit failed; deploying last valid signed snapshot" >&2
    fi
    [[ -f "$OBSERVATORY_RUNTIME/snapshots/snapshot_latest.json" ]] || {
      echo "[sites] No Observatory snapshot available; refusing incomplete deployment" >&2
      exit 1
    }
    install -d -m 0755 "$webroot/.well-known"
    install -m 0644 "$OBSERVATORY_RUNTIME/snapshots/snapshot_latest.json" \
      "$webroot/.well-known/observatory-snapshot-latest.json"
    install -m 0644 "$OBSERVATORY_RUNTIME/did.json" \
      "$webroot/.well-known/did-arifos-observatory.json"
    install -m 0644 "$OBSERVATORY_RUNTIME/keys/observatory_signing_key.pub.pem" \
      "$webroot/.well-known/observatory_signing_key.pub.pem"
  fi

  chown -R www-data:www-data "$webroot"
done

if $RELOAD_CADDY; then
  caddy validate --config /etc/caddy/Caddyfile
  caddy reload --config /etc/caddy/Caddyfile
else
  echo "[sites] Caddy unchanged (use --reload-caddy only for an approved routing change)"
fi

for row in "${SITE_ROWS[@]}"; do
  IFS=$'\t' read -r host _ <<<"$row"
  code="$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "https://$host/")"
  [[ "$code" == "200" ]] || { echo "Verification failed: $host returned $code" >&2; exit 1; }
  echo "[sites] $host $code"
done

echo "[sites] Deployment complete"
