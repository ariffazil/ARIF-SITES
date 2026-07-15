#!/bin/bash
# deploy-site — Atomic VPS deploy for arif-sites
#
# Usage:
#   scripts/deploy-site.sh <site> [--apply]
#   scripts/deploy-site.sh <site> --restore <backup-tag>
#
# Default is --dry-run. --apply performs the atomic swap, retains the
# previous build in /root/forge_work/deployments/<site>/<tag>/, and
# writes a JSON receipt. On a failed post-swap probe, the prior build
# is restored automatically and the receipt records the rollback.
#
# Backups live in a bounded archive, not in /var/www/html; the script
# never hard-deletes without a human --remove-backup command.
set -euo pipefail

SITE_NAME="${1:-}"
MODE="${2:---dry-run}"
RESTORE_TAG="${3:-}"

if [[ -z "$SITE_NAME" ]]; then
  echo "usage: $0 <site> [--apply|--dry-run]   # default --dry-run" >&2
  echo "       $0 <site> --restore <tag>      # roll back to a previous receipt" >&2
  exit 2
fi

if [[ "$MODE" != "--apply" && "$MODE" != "--dry-run" && "$MODE" != "--restore" ]]; then
  echo "ERROR: unknown mode $MODE (expected --apply, --dry-run, or --restore)" >&2
  exit 2
fi

SOURCE_DIR="/root/ARIF-SITES/sites/${SITE_NAME}"
ARCHIVE_ROOT="/root/forge_work/deployments/${SITE_NAME}"
TS=$(date -u +%Y%m%dT%H%M%SZ)
LOG_PREFIX="[deploy:${SITE_NAME}]"
RECEIPT="${ARCHIVE_ROOT}/${TS}.json"
LOG="${ARCHIVE_ROOT}/${TS}.log"

log() { echo "$LOG_PREFIX $*" >&2 | tee -a "$LOG" 2>/dev/null || echo "$LOG_PREFIX $*"; }
fail() { echo "$LOG_PREFIX ERROR: $*" >&2 | tee -a "$LOG" 2>/dev/null || true; exit 1; }

mkdir -p "$ARCHIVE_ROOT"

# Map site name to webroot directory name
case "$SITE_NAME" in
    arif-fazil.com)        WEBROOT_NAME="arif" ;;
    arifos.arif-fazil.com) WEBROOT_NAME="arifos" ;;
    aaa.arif-fazil.com)    WEBROOT_NAME="aaa" ;;
    forge.arif-fazil.com)  WEBROOT_NAME="forge" ;;
    wiki.arif-fazil.com)   WEBROOT_NAME="wiki" ;;
    geox.arif-fazil.com)   WEBROOT_NAME="geox" ;;
    *)                     WEBROOT_NAME="${SITE_NAME%.arif-fazil.com}" ;;
esac

WEBROOT="/var/www/html/${WEBROOT_NAME}"

# ── restore mode ─────────────────────────────────────────────────────
if [[ "$MODE" == "--restore" ]]; then
  if [[ -z "$RESTORE_TAG" ]]; then
    echo "ERROR: --restore requires a backup tag (the second argument)" >&2
    exit 2
  fi
  BACKUP_DIR="${ARCHIVE_ROOT}/${RESTORE_TAG}/previous"
  if [[ ! -d "$BACKUP_DIR" ]]; then
    echo "ERROR: backup ${BACKUP_DIR} not found" >&2
    exit 1
  fi
  TEMP_DIR="${WEBROOT}.tmp.restore.${TS}"
  mkdir -p "$TEMP_DIR"
  cp -a "$BACKUP_DIR/." "$TEMP_DIR/"
  if [[ -d "$WEBROOT" ]]; then mv "$WEBROOT" "${WEBROOT}.pre-restore.${TS}"; fi
  mv "$TEMP_DIR" "$WEBROOT"
  chown -R www-data:www-data "$WEBROOT"
  echo "$WEBROOT"
  exit 0
fi

[[ -d "$SOURCE_DIR" ]] || fail "Source not found: $SOURCE_DIR"

# Determine build output directory
if [[ -d "$SOURCE_DIR/dist" ]]; then
  BUILD_DIR="$SOURCE_DIR/dist"
elif [[ -f "$SOURCE_DIR/index.html" ]]; then
  BUILD_DIR="$SOURCE_DIR"
else
  fail "No dist/ or index.html found in $SOURCE_DIR"
fi

# Build if package.json exists
if [[ -f "$SOURCE_DIR/package.json" ]]; then
  log "Installing dependencies (build step)"
  ( cd "$SOURCE_DIR" && npm ci --quiet --legacy-peer-deps ) || fail "npm ci failed"
  ( cd "$SOURCE_DIR" && npm run build ) > "$LOG" 2>&1 || fail "build failed"
fi

if [[ "$MODE" == "--dry-run" ]]; then
  log "[dry-run] would swap $BUILD_DIR -> $WEBROOT (use --apply to execute)"
  exit 0
fi

# ── apply: atomic swap with retained backup ───────────────────────────
DEPLOY_DIR="${ARCHIVE_ROOT}/${TS}"
mkdir -p "$DEPLOY_DIR"

BUILD_HASH=$(find "$BUILD_DIR" -type f -print0 | sort -z | xargs -0 sha256sum 2>/dev/null | sha256sum | cut -c1-16 || echo "n/a")
SOURCE_HASH=$(cd "$SOURCE_DIR" && git rev-parse --short HEAD 2>/dev/null || echo "no-git")
log "atomic swap $BUILD_DIR -> $WEBROOT (build=$BUILD_HASH, source=$SOURCE_HASH)"

TEMP_DIR="${WEBROOT}.tmp.${TS}"
mkdir -p "$TEMP_DIR"
cp -a "$BUILD_DIR/." "$TEMP_DIR/"

BACKUP_PREVIOUS="${DEPLOY_DIR}/previous"
mkdir -p "$BACKUP_PREVIOUS"
if [[ -d "$WEBROOT" ]]; then
  rsync -a --delete "$WEBROOT/" "$BACKUP_PREVIOUS/"
  mv "$WEBROOT" "${WEBROOT}.pre-swap.${TS}"
fi
mv "$TEMP_DIR" "$WEBROOT"
chown -R www-data:www-data "$WEBROOT"

# ── Pattern 6: Write build-info.json for freshness detection ───────
# Every deploy writes a timestamped build-info so trinity-nav.js can
# detect stale surfaces and show a warning banner to agents/humans.
BUILD_INFO="${WEBROOT}/build-info.json"
cat > "$BUILD_INFO" <<BUILDJSON
{
  "built_at": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "surface": "${SITE_NAME}",
  "deployed_by": "deploy-site.sh",
  "deploy_tag": "${TS}",
  "source_commit": "${SOURCE_HASH}",
  "build_hash": "${BUILD_HASH}"
}
BUILDJSON
chown www-data:www-data "$BUILD_INFO"
log "build-info.json written to $BUILD_INFO"

# Probe and decide
PROBE_URL="https://${SITE_NAME}/"
PROBE_CODE=$(curl -sS -o /dev/null -w '%{http_code}' --max-time 10 "$PROBE_URL" || echo 000)
PROBE_OK=0
[[ "$PROBE_CODE" =~ ^2 ]] && PROBE_OK=1

if [[ $PROBE_OK -eq 0 ]]; then
  log "probe failed ($PROBE_CODE) — restoring prior build"
  RESTORE_TMP="${WEBROOT}.tmp.restore.${TS}"
  mkdir -p "$RESTORE_TMP"
  rsync -a --delete "$BACKUP_PREVIOUS/" "$RESTORE_TMP/"
  rm -rf "$WEBROOT"
  mv "$RESTORE_TMP" "$WEBROOT"
  chown -R www-data:www-data "$WEBROOT"
  STATUS="rolled_back"
else
  STATUS="live"
fi

cat > "$RECEIPT" <<JSON
{
  "site": "${SITE_NAME}",
  "webroot": "${WEBROOT}",
  "deploy_tag": "${TS}",
  "status": "${STATUS}",
  "source_commit": "${SOURCE_HASH}",
  "build_hash": "${BUILD_HASH}",
  "backup_path": "${BACKUP_PREVIOUS}",
  "probe": {"url": "${PROBE_URL}", "code": ${PROBE_CODE:-0}, "ok": ${PROBE_OK}}
}
JSON

log "receipt: $RECEIPT (status=${STATUS})"
echo "${WEBROOT}"
