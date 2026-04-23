#!/bin/bash
# deploy-site — Atomic VPS deploy for arif-sites
# Usage: ./deploy-site <site-name>
# Example: ./deploy-site arif-fazil.com
set -euo pipefail

SITE_NAME="${1:-arif-fazil.com}"
RELEASES_DIR="/opt/arifos/src/arif-sites/.releases"
SOURCE_DIR="/opt/arifos/src/arif-sites/sites/${SITE_NAME}"
WEBROOT_LINK="/opt/arifos/src/arif-sites/arif"
CADDY_COMPOSE="/etc/arifos/compose/docker-compose.yml"
TIMESTAMP=$(date +%Y%m%d%H%M%S)
LOG_PREFIX="[deploy:${SITE_NAME}]"

log() { echo "$LOG_PREFIX $1" >&2; }
fail() { echo "$LOG_PREFIX ERROR: $1" >&2; exit 1; }

[[ -d "$SOURCE_DIR" ]] || fail "Source not found: $SOURCE_DIR"
[[ -d "$SOURCE_DIR/src" ]] || fail "src/ not found in source"

mkdir -p "$RELEASES_DIR"

log "Pulling latest from Git..."
cd "$SOURCE_DIR"
git pull origin main --quiet || fail "git pull failed"

log "Installing dependencies..."
npm ci --quiet || fail "npm ci failed"

log "Building..."
npm run build 2>&1 || fail "build failed"

RELEASE_DIR="${RELEASES_DIR}/${SITE_NAME}.${TIMESTAMP}"
log "Creating release: $RELEASE_DIR"
cp -r "$SOURCE_DIR/dist" "$RELEASE_DIR"

log "Swapping symlink..."
rm -rf "$WEBROOT_LINK"
ln -s ".releases/${SITE_NAME}.${TIMESTAMP}" "$WEBROOT_LINK"

log "Cleaning old releases (keeping last 5)..."
ls -dt "${RELEASES_DIR}/${SITE_NAME}".* 2>/dev/null | tail -n +6 | xargs -r rm -rf

log "Reloading Caddy..."
docker compose -f "$CADDY_COMPOSE" reload caddy 2>/dev/null || docker compose -f "$CADDY_COMPOSE" restart caddy 2>/dev/null

sleep 3

if curl -s -o /dev/null -w "%{http_code}" "https://${SITE_NAME}/" 2>/dev/null | grep -q "200"; then
    log "SUCCESS — https://${SITE_NAME}/ is live"
else
    log "WARNING — curl check failed, but deploy completed"
fi

echo "$RELEASE_DIR"
