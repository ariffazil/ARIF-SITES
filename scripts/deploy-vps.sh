#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# arif-sites Autonomous VPS Deploy — Static site deployment
#
# Purpose: Build and deploy all static sites to VPS webroot.
#          React sites are built; static sites are copied directly.
#          Cloudflare Pages sites deploy via git push (not handled here).
#
# Flow:
#   1. Get current commit SHA
#   2. Build React sites (arif-fazil.com, travel.arif-fazil.com)
#   3. Deploy all sites to /var/www/html/
#   4. Reload Caddy
#   5. Verify key sites are live
#
# Usage:
#   ./scripts/deploy-vps.sh           # full deploy
#   ./scripts/deploy-vps.sh <site>    # deploy single site
#
# DITEMPA BUKAN DIBERI — Forged, Not Given
# ═══════════════════════════════════════════════════════════════════════════════

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SITES_DIR="/root/ARIF-SITES/sites"
LOG_PREFIX="[arif-sites-deploy]"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info()  { echo -e "${GREEN}[INFO]${NC} $*"; }
log_warn()  { echo -e "${YELLOW}[WARN]${NC} $*"; }
log_error() { echo -e "${RED}[ERROR]${NC} $*"; }

# Map site → webroot
declare -A SITE_MAP=(
    ["arif-fazil.com"]="arif"
    ["arifos.arif-fazil.com"]="arifos"
    ["aaa.arif-fazil.com"]="aaa"
    ["forge.arif-fazil.com"]="forge"
    ["wiki.arif-fazil.com"]="wiki"
    ["geox.arif-fazil.com"]="geox"
    ["arifosmcp.arif-fazil.com"]="arifosmcp"
    ["apex.arif-fazil.com"]="apex"
    ["waw.arif-fazil.com"]="waw"
    ["wawa.arif-fazil.com"]="wawa"
)

# Sites that require npm build
REACT_SITES=("arif-fazil.com" "travel.arif-fazil.com")

# ── 1. Get current commit SHA ────────────────────────────────────────────────
cd /root/ARIF-SITES
SHORT_SHA=$(git rev-parse --short HEAD)
log_info "Deploying arif-sites commit: $SHORT_SHA"

# ── 2. Deploy function ───────────────────────────────────────────────────────
deploy_site() {
    local site="$1"
    local source="$SITES_DIR/$site"
    local webroot_name="${SITE_MAP[$site]:-${site%.arif-fazil.com}}"
    local webroot="/var/www/html/$webroot_name"

    if [[ ! -d "$source" ]]; then
        log_warn "Source not found: $source — skipping"
        return 0
    fi

    log_info "Deploying $site → $webroot"

    # Build if React site
    local build_dir="$source"
    if [[ " ${REACT_SITES[*]} " =~ " $site " ]]; then
        if [[ -f "$source/package.json" ]]; then
            log_info "  Building $site..."
            cd "$source"
            npm ci --quiet 2>/dev/null || npm install --quiet
            npm run build 2>&1
            build_dir="$source/dist"
        fi
    fi

    # Atomic deploy
    local temp_dir="${webroot}.tmp.$SHORT_SHA"
    mkdir -p "$temp_dir"
    cp -a "$build_dir/"* "$temp_dir/" 2>/dev/null || cp -a "$build_dir" "$temp_dir/"

    local backup_dir="${webroot}.bak.$SHORT_SHA"
    if [[ -d "$webroot" ]]; then
        mv "$webroot" "$backup_dir"
    fi
    mv "$temp_dir" "$webroot"
    chown -R www-data:www-data "$webroot" 2>/dev/null || true

    log_info "  ✅ $site deployed"
}

# ── 3. Deploy all or single site ─────────────────────────────────────────────
if [[ -n "${1:-}" ]]; then
    deploy_site "$1"
else
    for site in "${!SITE_MAP[@]}"; do
        deploy_site "$site"
    done
fi

# ── 4. Reload Caddy ──────────────────────────────────────────────────────────
log_info "Reloading Caddy..."
# F1 AMANAH — snapshot current Caddyfile before each reload. Idempotent (overwrite
# is harmless when content is unchanged; fresh timestamp gives us a forensic
# chain for free). Closes the 2026-07-29 audit gap where today's edit had no
# local rollback file.
if [[ -f /etc/caddy/Caddyfile ]]; then
    _caddy_reload_ts="$(date -u +%Y%m%dT%H%M%SZ)"
    cp -p /etc/caddy/Caddyfile "/etc/caddy/Caddyfile.bak.${_caddy_reload_ts}-reload" 2>/dev/null || \
        log_warn "  ⚠️  could not snapshot /etc/caddy/Caddyfile (continuing reload)"
fi
caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || systemctl reload caddy 2>/dev/null || true

# ── 5. Verify key sites ──────────────────────────────────────────────────────
log_info "Verifying key sites..."
for site in arif-fazil.com arifos.arif-fazil.com aaa.arif-fazil.com; do
    if curl -s -o /dev/null -w "%{http_code}" "https://${site}/" 2>/dev/null | grep -q "200"; then
        log_info "  ✅ https://${site}/ is live"
    else
        log_warn "  ⚠️  https://${site}/ returned non-200"
    fi
done

log_info "═══════════════════════════════════════════════════════════════════════════════"
log_info "arif-sites deploy complete: $SHORT_SHA"
log_info "═══════════════════════════════════════════════════════════════════════════════"
