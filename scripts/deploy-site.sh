#!/bin/bash
# deploy-site — Atomic VPS deploy for arif-sites
# Usage: ./deploy-site <site-name>
# Example: ./deploy-site arif-fazil.com
set -euo pipefail

SITE_NAME="${1:-arif-fazil.com}"
SOURCE_DIR="/root/ARIF-SITES/sites/${SITE_NAME}"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
LOG_PREFIX="[deploy:${SITE_NAME}]"

log() { echo "$LOG_PREFIX $1" >&2; }
fail() { echo "$LOG_PREFIX ERROR: $1" >&2; exit 1; }

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
    log "Installing dependencies..."
    cd "$SOURCE_DIR"
    npm ci --quiet --legacy-peer-deps || fail "npm ci failed"

    log "Building..."
    npm run build 2>&1 || fail "build failed"
fi

# Atomic swap: copy to temp dir, then mv
TEMP_DIR="${WEBROOT}.tmp.${TIMESTAMP}"
mkdir -p "$TEMP_DIR"
log "Copying build to temp: $TEMP_DIR"
cp -a "$BUILD_DIR/"* "$TEMP_DIR/" 2>/dev/null || cp -a "$BUILD_DIR" "$TEMP_DIR/"

log "Atomic swap to webroot..."
BACKUP_DIR="${WEBROOT}.bak.${TIMESTAMP}"
if [[ -d "$WEBROOT" ]]; then
    mv "$WEBROOT" "$BACKUP_DIR"
fi
mv "$TEMP_DIR" "$WEBROOT"
chown -R www-data:www-data "$WEBROOT"

log "Reloading Caddy..."
caddy reload --config /root/arifOS/Caddyfile --adapter caddyfile 2>/dev/null || systemctl reload caddy 2>/dev/null || true

sleep 2

if curl -s -o /dev/null -w "%{http_code}" "https://${SITE_NAME}/" 2>/dev/null | grep -q "200"; then
    log "SUCCESS — https://${SITE_NAME}/ is live"
    rm -rf "$BACKUP_DIR"
else
    log "WARNING — curl check failed, but deploy completed"
fi

echo "$WEBROOT"
