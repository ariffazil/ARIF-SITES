#!/usr/bin/env bash
# Registry-driven multi-site coordinator for arif-sites deployments.
# Default is --dry-run. It delegates every surface to scripts/deploy-site.sh,
# so batch and per-site paths use the same ownership and overlay policy.

set -euo pipefail

CANONICAL_REPO_ROOT="/root/arif-fazil.com"
RAW_SCRIPT_PATH="${BASH_SOURCE[0]}"
if [[ "$RAW_SCRIPT_PATH" == *"/arif-sites/"* && "$RAW_SCRIPT_PATH" != *"/arif-fazil.com/"* ]] || [[ "${PWD:-}" == *"/arif-sites" && "${PWD:-}" != *"/arif-fazil.com"* ]]; then
  echo "WARNING: lowercase /root/arif-sites is deprecated — canonical repo is $CANONICAL_REPO_ROOT" >&2
  echo "Continuing with lowercase path for backward compat…" >&2
fi

REPO_ROOT="$(cd "$(dirname "$RAW_SCRIPT_PATH")" && pwd -P)"
if [[ "$REPO_ROOT" != "$CANONICAL_REPO_ROOT" ]]; then
  echo "ERROR: deploy-vps.sh must run from canonical repository $CANONICAL_REPO_ROOT (resolved $REPO_ROOT)" >&2
  exit 2
fi

REGISTRY="${ARIF_SITES_OVERLAY_REGISTRY:-$REPO_ROOT/infra/runtime-overlays.json}"
DEPLOY_SITE="$REPO_ROOT/scripts/deploy-site.sh"
CADDYFILE="${ARIF_SITES_CADDYFILE:-/etc/caddy/Caddyfile}"
CADDY_BIN="${ARIF_SITES_CADDY_BIN:-caddy}"

usage() {
  cat >&2 <<'USAGE'
Usage:
  ./deploy-vps.sh [--dry-run] [--site SITE]       # default; no mutation
  ./deploy-vps.sh --validate-build [--site SITE]  # isolated build validation
  ./deploy-vps.sh --apply [--site SITE]           # preflight all, then deploy

A single positional SITE is accepted for compatibility. Unknown or ambiguous
sites fail closed; there is no inferred webroot fallback.
USAGE
}

MODE="dry-run"
MODE_SEEN=0
ONLY_SITE=""
while (($#)); do
  case "$1" in
    --dry-run)
      ((MODE_SEEN == 0)) || { echo "ERROR: select exactly one mode" >&2; exit 2; }
      MODE="dry-run"
      MODE_SEEN=1
      shift
      ;;
    --validate-build)
      ((MODE_SEEN == 0)) || { echo "ERROR: select exactly one mode" >&2; exit 2; }
      MODE="validate-build"
      MODE_SEEN=1
      shift
      ;;
    --apply)
      ((MODE_SEEN == 0)) || { echo "ERROR: select exactly one mode" >&2; exit 2; }
      MODE="apply"
      MODE_SEEN=1
      shift
      ;;
    --site)
      [[ $# -ge 2 ]] || { echo "ERROR: --site requires a site name" >&2; exit 2; }
      [[ -z "$ONLY_SITE" ]] || { echo "ERROR: select only one site" >&2; exit 2; }
      ONLY_SITE="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    --*)
      echo "ERROR: unknown argument: $1" >&2
      usage
      exit 2
      ;;
    *)
      [[ -z "$ONLY_SITE" ]] || { echo "ERROR: select only one site" >&2; exit 2; }
      ONLY_SITE="$1"
      shift
      ;;
  esac
done

command -v jq >/dev/null 2>&1 || { echo "ERROR: jq is required" >&2; exit 1; }
[[ -x "$DEPLOY_SITE" ]] || { echo "ERROR: missing per-site deployer: $DEPLOY_SITE" >&2; exit 1; }
[[ -f "$REGISTRY" ]] || { echo "ERROR: missing runtime overlay registry: $REGISTRY" >&2; exit 1; }

jq -e '
  .schema_version == 1 and
  .canonical_repo_root == "/root/arif-sites" and
  (.sites | type == "array" and length > 0) and
  (([.sites[].site] | length) == ([.sites[].site] | unique | length)) and
  (([.sites[].webroot] | length) == ([.sites[].webroot] | unique | length)) and
  (all(.sites[]; (.owner | type == "string" and length > 0)))
' "$REGISTRY" >/dev/null || {
  echo "ERROR: invalid or ambiguously owned runtime overlay registry: $REGISTRY" >&2
  exit 1
}

if [[ -n "$ONLY_SITE" ]]; then
  MATCH_COUNT="$(jq --arg site "$ONLY_SITE" '[.sites[] | select(.site == $site)] | length' "$REGISTRY")"
  if [[ "$MATCH_COUNT" != "1" ]]; then
    echo "ERROR: unknown or ambiguously owned site '$ONLY_SITE' (registry matches: $MATCH_COUNT)" >&2
    exit 1
  fi
  mapfile -t SITES < <(jq -r --arg site "$ONLY_SITE" '.sites[] | select(.site == $site) | .site' "$REGISTRY")
else
  mapfile -t SITES < <(jq -r '[.sites[] | select(.batch == true)] | sort_by(.batch_order)[] | .site' "$REGISTRY")
fi
((${#SITES[@]} > 0)) || { echo "ERROR: no deployable sites selected" >&2; exit 1; }

retry_command() {
  local description="$1"
  local attempts="$2"
  local delay="$3"
  shift 3
  local attempt
  for ((attempt = 1; attempt <= attempts; attempt++)); do
    if "$@"; then
      return 0
    fi
    printf '[deploy-vps] %s failed (attempt %d/%d)\n' "$description" "$attempt" "$attempts" >&2
    if ((attempt < attempts)) && [[ "$delay" != "0" ]]; then
      sleep "$delay"
    fi
  done
  return 1
}

case "$MODE" in
  dry-run)
    PLANS=()
    for site in "${SITES[@]}"; do
      plan="$("$DEPLOY_SITE" "$site" --dry-run)" || exit 1
      PLANS+=("$plan")
    done
    printf '%s\n' "${PLANS[@]}" | jq -s --arg registry "$REGISTRY" '{mode: "dry-run", mutation: false, registry: $registry, sites: .}'
    ;;
  validate-build)
    for site in "${SITES[@]}"; do
      printf '[deploy-vps] validating %s in an isolated temporary copy\n' "$site" >&2
      "$DEPLOY_SITE" "$site" --validate-build
    done
    printf '[deploy-vps] isolated validation passed for %d site(s)\n' "${#SITES[@]}" >&2
    ;;
  apply)
    CADDY_ATTEMPTS="${ARIF_SITES_CADDY_ATTEMPTS:-$(jq -r '.defaults.caddy_attempts' "$REGISTRY")}"
    RETRY_DELAY="${ARIF_SITES_RETRY_DELAY:-$(jq -r '.defaults.retry_delay_seconds' "$REGISTRY")}"
    [[ "$CADDY_ATTEMPTS" =~ ^[1-9][0-9]*$ ]] || { echo "ERROR: Caddy attempts must be a positive integer" >&2; exit 1; }
    [[ "$RETRY_DELAY" =~ ^[0-9]+([.][0-9]+)?$ ]] || { echo "ERROR: retry delay must be non-negative" >&2; exit 1; }

    # Complete every build preflight, including the pinned wiki build, before
    # the first live tree is swapped. A failed preflight therefore cannot leave
    # a partially deployed batch.
    for site in "${SITES[@]}"; do
      "$DEPLOY_SITE" "$site" --dry-run >/dev/null
      printf '[deploy-vps] preflight build: %s\n' "$site" >&2
      "$DEPLOY_SITE" "$site" --validate-build
    done

    if ! retry_command "Caddy validation" "$CADDY_ATTEMPTS" "$RETRY_DELAY" \
      "$CADDY_BIN" validate --config "$CADDYFILE"; then
      echo "ERROR: Caddy validation failed closed before the first site swap" >&2
      exit 1
    fi

    RECEIPTS=()
    for site in "${SITES[@]}"; do
      printf '[deploy-vps] applying %s\n' "$site" >&2
      receipt="$("$DEPLOY_SITE" "$site" --apply)" || exit 1
      [[ -f "$receipt" ]] || { echo "ERROR: missing receipt after $site apply: $receipt" >&2; exit 1; }
      jq -e '.schema == "arif-sites.deploy-receipt.v1" and (.status == "live" or .status == "restored")' "$receipt" >/dev/null || {
        echo "ERROR: invalid or unsuccessful receipt after $site apply: $receipt" >&2
        exit 1
      }
      RECEIPTS+=("$receipt")
    done
    printf '%s\n' "${RECEIPTS[@]}" | jq -R -s --arg registry "$REGISTRY" '{mode: "apply", registry: $registry, receipts: (split("\n") | map(select(length > 0)))}'
    ;;
  *)
    echo "ERROR: unsupported mode: $MODE" >&2
    exit 2
    ;;
esac
