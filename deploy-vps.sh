#!/bin/bash
# arif-fazil.com Constellation — VPS Deployment Script
# Automates build, sync, and canonicalization

set -e

SITES_ROOT="/root/arif-sites/sites"
WEB_ROOT="/var/www"

echo "🚀 Starting Deployment Strike..."

# 1. Build React Site (Ψ)
echo "[1/5] Building arif-fazil.com (React)..."
cd $SITES_ROOT/arif-fazil.com
npm run build

# 2. Synchronize Files to Web Roots
echo "[2/5] Syncing to $WEB_ROOT..."
mkdir -p $WEB_ROOT/{arif-fazil.com,aaa.arif-fazil.com,apex.arif-fazil.com,waw.arif-fazil.com,wiki.arif-fazil.com,forge.arif-fazil.com,geox.arif-fazil.com,mcp.arif-fazil.com}

# Sync Ψ
rsync -avz --delete $SITES_ROOT/arif-fazil.com/dist/ $WEB_ROOT/arif-fazil.com/
rsync -avz $SITES_ROOT/arif-fazil.com/999/ $WEB_ROOT/arif-fazil.com/999/
rsync -avz $SITES_ROOT/shared/ $WEB_ROOT/arif-fazil.com/shared/

# Sync Others
rsync -avz --delete $SITES_ROOT/aaa.arif-fazil.com/ $WEB_ROOT/aaa.arif-fazil.com/
rsync -avz --delete $SITES_ROOT/apex.arif-fazil.com/ $WEB_ROOT/apex.arif-fazil.com/
rsync -avz --delete $SITES_ROOT/waw.arif-fazil.com/ $WEB_ROOT/waw.arif-fazil.com/
rsync -avz --delete $SITES_ROOT/wiki.arif-fazil.com/ $WEB_ROOT/wiki.arif-fazil.com/
rsync -avz --delete $SITES_ROOT/forge.arif-fazil.com/ $WEB_ROOT/forge.arif-fazil.com/
rsync -avz --delete $SITES_ROOT/geox.arif-fazil.com/ $WEB_ROOT/geox.arif-fazil.com/
rsync -avz --delete $SITES_ROOT/arifosmcp.arif-fazil.com/ $WEB_ROOT/mcp.arif-fazil.com/

# 3. Canonicalize Domain References
echo "[3/5] Canonicalizing references to mcp.arif-fazil.com..."
grep -r "arifosmcp.arif-fazil.com" $WEB_ROOT | cut -d: -f1 | sort -u | xargs -I {} sed -i 's/arifosmcp.arif-fazil.com/mcp.arif-fazil.com/g' {} || true

# 4. Permissions
echo "[4/5] Setting permissions..."
chown -R www-data:www-data $WEB_ROOT

# 5. Reload Nginx
echo "[5/5] Reloading Nginx..."
nginx -t && systemctl reload nginx

echo "✅ DEPLOYMENT COMPLETE. Constellation is Live."
