#!/bin/bash
# arif-fazil.com Constellation — VPS Deployment Script
# Automates build, sync, and canonicalization
# Caddy web root: /var/www/html/<site> (NOT /var/www/<domain>)

set -e

SITES_ROOT="/root/ARIF-SITES/sites"
HTML_ROOT="/var/www/html"

echo "Starting VPS Deployment..."

# 1. Build React Site (arif-fazil.com — Ψ SOUL)
echo "[1/6] Building arif-fazil.com (React/Vite)..."
cd $SITES_ROOT/arif-fazil.com
npm run build

# 1b. Pre-render MakcikGPT articles for LLM/SEO extraction (SSR via Puppeteer)
echo "[1.5/6] Pre-rendering MakcikGPT articles (JSON-LD + semantic HTML)..."
node /tmp/prerender-articles.cjs 2>/dev/null || echo "  ⚠ Pre-render skipped (Puppeteer not available)"

# 2. Sync Shared Design System + WebMCP (served via /_shared/* on all domains)
echo "[2/5] Syncing shared assets..."
mkdir -p $HTML_ROOT/_shared/design-system $HTML_ROOT/_shared/webmcp
rsync -avz --delete $SITES_ROOT/shared/design-system/ $HTML_ROOT/_shared/design-system/
rsync -avz --delete $SITES_ROOT/shared/webmcp/ $HTML_ROOT/_shared/webmcp/

# 3. Sync sites to Caddy-served directories
echo "[3/5] Syncing sites..."

# arif-fazil.com (Ψ SOUL) — built React app
rsync -avz --delete $SITES_ROOT/arif-fazil.com/dist/ $HTML_ROOT/arif/

# Agentic Web Optimization: copy raw markdown for bot bypass (survives rsync --delete)
echo "  ⚡ Copying MakcikGPT markdown for AI bot bypass..."
mkdir -p $HTML_ROOT/arif/wealth/makcikgpt/
cp $SITES_ROOT/arif-fazil.com/public/makcikgpt-md/*.md $HTML_ROOT/arif/wealth/makcikgpt/ 2>/dev/null || true

rsync -avz --delete $SITES_ROOT/arif-fazil.com/public/000/ $HTML_ROOT/arif/000/
rsync -avz --delete $SITES_ROOT/arif-fazil.com/public/999/ $HTML_ROOT/arif/999/

# /000/ serves static Genesis page, do not overwrite with root index.html

# arifos.arif-fazil.com (Ω MIND) — static HTML dashboard
rsync -avz --delete $SITES_ROOT/arifos.arif-fazil.com/ $HTML_ROOT/arifos/

# aaa.arif-fazil.com (Δ BODY) — built React cockpit
rsync -avz --delete $SITES_ROOT/aaa.arif-fazil.com/ $HTML_ROOT/aaa/

# Other sites
rsync -avz --delete $SITES_ROOT/geox.arif-fazil.com/   $HTML_ROOT/geox/     2>/dev/null || true
rsync -avz --delete $SITES_ROOT/wealth.arif-fazil.com/ $HTML_ROOT/wealth/   2>/dev/null || true
rsync -avz --delete $SITES_ROOT/wiki.arif-fazil.com/   $HTML_ROOT/wiki/     2>/dev/null || true
rsync -avz --delete $SITES_ROOT/forge.arif-fazil.com/  $HTML_ROOT/forge/    2>/dev/null || true

# 4. Sync runtime state (seal chain heartbeat for Δ BODY clock)
echo "[3.6/5] Syncing seal chain head..."
mkdir -p $HTML_ROOT/aaa/_state
cp /root/VAULT999/seal_chain_head.json $HTML_ROOT/aaa/_state/seal_chain_head.json 2>/dev/null || true

# 5. Permissions
echo "[4/5] Setting permissions..."
chown -R www-data:www-data $HTML_ROOT

# 5. Reload Caddy
echo "[5/5] Reloading Caddy..."
caddy reload --config /etc/caddy/Caddyfile

echo "DEPLOYMENT COMPLETE. Constellation is Live."
