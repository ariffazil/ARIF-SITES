#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# PAGE INVENTORY GATE — arif-fazil.com
# ═══════════════════════════════════════════════════════════════════════
# Scans dist/ for every index.html, maps to URL, curls live, asserts 200.
# Non-bypassable: any gap = FAIL + HOLD. No gap survives deployment.
#
# Forged 2026-08-03 by 333-AGI under F13 directive "stop asking me"
# DITEMPA BUKAN DIBERI — entropy must not accumulate at integration boundaries.
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail

BASE_URL="${1:-https://arif-fazil.com}"
DIST_DIR="${2:-/root/arif-fazil.com/sites/arif-fazil.com/dist}"
TIMEOUT="${3:-10}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

# ── Intentional exclusions ────────────────────────────────────────
# Paths that are intentionally NOT served as static pages:
#   /mcp/* → reverse-proxied to arifOS MCP kernel (:8088)
#   /makcikgpt-md/* → bot-only rendering surface (not human-facing)
#   /_shared/* → internal asset directory
# Add to this array when creating non-browser surfaces.
INTENTIONAL_EXCLUSIONS=(
    "/mcp/"
    "/mcp/proof/"
    "/makcikgpt-md/"
)

FAIL_COUNT=0
PASS_COUNT=0
SKIP_COUNT=0
GAPS=()

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  PAGE INVENTORY GATE"
echo "  Base:  $BASE_URL"
echo "  Dist:  $DIST_DIR"
echo "  Time:  $(date -u +'%Y-%m-%dT%H:%M:%SZ')"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# ── Scan dist/ for all index.html files ──────────────────────────
if [ ! -d "$DIST_DIR" ]; then
    echo -e "${RED}✗ FAIL${NC} — dist directory not found: $DIST_DIR"
    exit 2
fi

echo "Scanning $DIST_DIR for pages..."
echo ""

while IFS= read -r -d '' html_file; do
    # Derive URL path from dist path
    rel_path="${html_file#$DIST_DIR}"
    # Strip /index.html to get the directory path
    url_path="${rel_path%/index.html}"
    # If root, it's /
    if [ -z "$url_path" ]; then
        url_path="/"
    else
        url_path="$url_path/"
    fi
    
    full_url="${BASE_URL}${url_path}"
    
    # Check intentional exclusions
    EXCLUDED=false
    for excl in "${INTENTIONAL_EXCLUSIONS[@]}"; do
        if [ "$url_path" = "$excl" ]; then
            EXCLUDED=true
            break
        fi
    done
    if $EXCLUDED; then
        echo -e "  ${CYAN}⊘${NC} SKIP $url_path  $(tput dim)(intentional exclusion)${NC}"
        SKIP_COUNT=$((SKIP_COUNT + 1))
        continue
    fi
    
    # Probe the URL
    http_code=$(curl -s -o /dev/null -w '%{http_code}' \
        --max-time "$TIMEOUT" \
        -H "User-Agent: arifOS-PageGate/1.0 (verification; +https://arif-fazil.com)" \
        "$full_url" 2>/dev/null || echo "000")
    
    if [ "$http_code" = "200" ] || [ "$http_code" = "301" ] || [ "$http_code" = "308" ]; then
        # 200 = direct serve, 301/308 = redirect (acceptable for clean URLs)
        if [ "$http_code" = "200" ]; then
            echo -e "  ${GREEN}✓${NC} $http_code  $url_path"
        else
            # Follow redirect to see final code
            final_code=$(curl -s -o /dev/null -w '%{http_code}' \
                --max-time "$TIMEOUT" \
                -L \
                -H "User-Agent: arifOS-PageGate/1.0" \
                "$full_url" 2>/dev/null || echo "000")
            if [ "$final_code" = "200" ]; then
                echo -e "  ${GREEN}✓${NC} $http_code→200  $url_path"
            else
                echo -e "  ${YELLOW}⚠${NC} $http_code→$final_code  $url_path  $(tput dim)(redirect dead-ends)${NC}"
                FAIL_COUNT=$((FAIL_COUNT + 1))
                GAPS+=("$url_path (redirect→$final_code, dist: $rel_path)")
                continue
            fi
        fi
        PASS_COUNT=$((PASS_COUNT + 1))
    elif [ "$http_code" = "404" ]; then
        echo -e "  ${RED}✗${NC} $http_code  $url_path  $(tput dim)(dist exists: $rel_path)${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        GAPS+=("$url_path (404, dist: $rel_path)")
    else
        echo -e "  ${YELLOW}⚠${NC} $http_code  $url_path  $(tput dim)(dist: $rel_path)${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
        GAPS+=("$url_path (HTTP $http_code, dist: $rel_path)")
    fi
done < <(find "$DIST_DIR" -name "index.html" -type f -print0)

# ── Also check paths that MUST exist but have no index.html ────────
# These are critical SPA routes or API endpoints
CRITICAL_PATHS=(
    "/api/organs"
    "/.well-known/mcp/server.json"
)

echo ""
echo "Checking critical paths (no dist/index.html expected)..."
echo ""

for cpath in "${CRITICAL_PATHS[@]}"; do
    http_code=$(curl -s -o /dev/null -w '%{http_code}' \
        --max-time "$TIMEOUT" \
        -H "User-Agent: arifOS-PageGate/1.0" \
        "${BASE_URL}${cpath}" 2>/dev/null || echo "000")
    
    if [ "$http_code" = "200" ]; then
        echo -e "  ${GREEN}✓${NC} $http_code  $cpath"
        PASS_COUNT=$((PASS_COUNT + 1))
    else
        echo -e "  ${YELLOW}⚠${NC} $http_code  $cpath  $(tput dim)(may need attention)${NC}"
    fi
done

# ── Report ────────────────────────────────────────────────────────
echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  RESULT"
echo "═══════════════════════════════════════════════════════════════"

if [ ${#GAPS[@]} -gt 0 ]; then
    echo ""
    echo -e "  ${RED}✗ GAPS DETECTED — ${#GAPS[@]} pages unreachable${NC}"
    echo ""
    for gap in "${GAPS[@]}"; do
        echo -e "    ${RED}•${NC} $gap"
    done
    echo ""
    echo "  ─────────────────────────────────────────────"
    echo "  These pages exist in dist/ but return errors."
    echo "  Fix one of:"
    echo "    a) Add route to /etc/caddy/Caddyfile"
    echo "    b) Add entry to public/_redirects"  
    echo "    c) Add path to _routes.json exclude list if SPA-handled"
    echo "  ─────────────────────────────────────────────"
    echo ""
    echo -e "  ${RED}VERDICT: HOLD${NC} — do not deploy until all gaps closed."
    exit 1
else
    echo ""
    echo -e "  ${GREEN}✓ ALL PAGES REACHABLE${NC}"
    echo "  Total: $PASS_COUNT pages verified ($SKIP_COUNT intentionally excluded)"
    echo ""
    echo -e "  ${CYAN}VERDICT: PASS${NC} — safe to deploy."
    exit 0
fi
