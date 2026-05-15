#!/bin/bash
# arif-fazil.com Constellation — VPS Deployment Script
# Automates build, sync, and canonicalization
# Caddy web root: /var/www/html/<site> (NOT /var/www/<domain>)

set -e

SITES_ROOT="/root/arif-sites/sites"
HTML_ROOT="/var/www/html"

echo "Starting VPS Deployment..."

# 1. Build React Site (arif-fazil.com — Ψ SOUL)
echo "[1/5] Building arif-fazil.com (React/Vite)..."
cd $SITES_ROOT/arif-fazil.com
npm run build

# 2. Sync Shared Design System + WebMCP (served via /_shared/* on all domains)
echo "[2/5] Syncing shared assets..."
mkdir -p $HTML_ROOT/_shared/design-system $HTML_ROOT/_shared/webmcp
rsync -avz --delete $SITES_ROOT/shared/design-system/ $HTML_ROOT/_shared/design-system/
rsync -avz --delete $SITES_ROOT/shared/webmcp/ $HTML_ROOT/_shared/webmcp/

# 3. Sync sites to Caddy-served directories
echo "[3/5] Syncing sites..."

# arif-fazil.com (Ψ SOUL) — built React app
rsync -avz --delete $SITES_ROOT/arif-fazil.com/dist/ $HTML_ROOT/arif/
rsync -avz --delete $SITES_ROOT/arif-fazil.com/public/000/ $HTML_ROOT/arif/000/
rsync -avz --delete $SITES_ROOT/arif-fazil.com/public/999/ $HTML_ROOT/arif/999/

# arifos.arif-fazil.com (Ω MIND) — static HTML dashboard
rsync -avz --delete $SITES_ROOT/arifos.arif-fazil.com/ $HTML_ROOT/arifos/

# aaa.arif-fazil.com (Δ BODY) — built React cockpit
rsync -avz --delete $SITES_ROOT/aaa.arif-fazil.com/ $HTML_ROOT/aaa/

# Other sites
rsync -avz --delete $SITES_ROOT/geox.arif-fazil.com/   $HTML_ROOT/geox/     2>/dev/null || true
rsync -avz --delete $SITES_ROOT/wiki.arif-fazil.com/   $HTML_ROOT/wiki/     2>/dev/null || true
rsync -avz --delete $SITES_ROOT/forge.arif-fazil.com/  $HTML_ROOT/forge/    2>/dev/null || true

# 4. Permissions
echo "[4/5] Setting permissions..."
chown -R www-data:www-data $HTML_ROOT

# 5. Reload Caddy
echo "[5/5] Reloading Caddy..."
caddy reload --config /etc/caddy/Caddyfile

echo "DEPLOYMENT COMPLETE. Constellation is Live."
