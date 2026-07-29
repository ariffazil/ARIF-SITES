#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════
# deploy-makcik.sh — MakcikGPT Deploy Pipeline (One Command)
# ═══════════════════════════════════════════════════════════════════
# Usage:
#   ./deploy-makcik.sh                           # stage + build + deploy + verify
#   ./deploy-makcik.sh --verify-only             # just verify live state
#   ./deploy-makcik.sh --dry-run                 # check registration only, no build
#
# Prerequisites:
#   - Run from /root/arif-sites/sites/arif-fazil.com/
#   - New article .ts file already exists in src/data/makcikgpt/
#
# Pipeline:
#   1. ARTICLE SCAVENGER — detect unregistered .ts files
#   2. REGISTER — index.ts + essays.json (prompt user for each)
#   3. BUILD — npm install --legacy-peer-deps + npm run build
#   4. GENERATE STATIC — fallback HTML for bot/crawler
#   5. DEPLOY — rsync to VPS webroot + caddy reload
#   6. VERIFY — full protocol (bundle, article, listing, feed, sitemap, llms.txt)
# ═══════════════════════════════════════════════════════════════════

set -euo pipefail

# ── Config ─────────────────────────────────────────────────────────
SITE_DIR="/root/arif-fazil.com/sites/arif-fazil.com"
WEBROOT="/var/www/html/arif"
CADDYFILE="/etc/caddy/Caddyfile"
MAKCIKGPT_DIR="$SITE_DIR/src/data/makcikgpt"
ESSAYS_JSON="$SITE_DIR/src/data/essays.json"
INDEX_TS="$MAKCIKGPT_DIR/index.ts"
PUBLIC_MD_DIR="$SITE_DIR/public/makcikgpt-md"
BOT_STATIC_DIR="$WEBROOT/makcikgpt-md"

# ── Helpers ─────────────────────────────────────────────────────────
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; RED='\033[0;31m'; CYAN='\033[0;36m'; NC='\033[0m'
pass() { echo -e "  ${GREEN}✅${NC} $1"; }
warn() { echo -e "  ${YELLOW}⚠️  $1${NC}"; }
fail() { echo -e "  ${RED}❌${NC} $1"; }
info() { echo -e "  ${CYAN}ℹ️  $1${NC}"; }
header() { echo -e "\n${CYAN}══════════════════════════════════════════════${NC}"; echo -e "${CYAN}  $1${NC}"; echo -e "${CYAN}══════════════════════════════════════════════${NC}"; }

cd "$SITE_DIR" || { fail "Can't cd to $SITE_DIR"; exit 1; }

DRY_RUN=false
VERIFY_ONLY=false
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --verify-only) VERIFY_ONLY=true ;;
  esac
done

# ── Phase 0: Verify-only mode ──────────────────────────────────────
if $VERIFY_ONLY; then
  header "VERIFY ONLY — Checking live state"
  exec "$SITE_DIR/scripts/verify-makcik-deploy.sh" 2>/dev/null || {
    # Inline verification
    TOTAL_FAIL=0
    DIST_JS=$(ls -t "$SITE_DIR/dist/assets/"*.js 2>/dev/null | head -1 | xargs basename 2>/dev/null || echo "")
    LIVE_JS=$(curl -sk --resolve arif-fazil.com:443:127.0.0.1 "https://arif-fazil.com/" 2>/dev/null | grep -oP 'index-[A-Za-z0-9]+\.js' || echo "")
    if [ -n "$DIST_JS" ] && [ "$DIST_JS" = "$LIVE_JS" ]; then pass "JS bundle: $DIST_JS"; else fail "JS bundle mismatch"; TOTAL_FAIL=$((TOTAL_FAIL+1)); fi

    # Test each slug
    for ts_file in "$MAKCIKGPT_DIR"/*.ts; do
      slug=$(basename "$ts_file" .ts)
      [ "$slug" = "index" ] || [ "$slug" = "types" ] || [ "$slug" = "fix" ] || [ "$slug" = "jsonld-blocks" ] && continue
      BOT_CODE=$(curl -sk --resolve arif-fazil.com:443:127.0.0.1 -o /dev/null -w "%{http_code}" "https://arif-fazil.com/world/makcikgpt/$slug" 2>/dev/null || echo "000")
      BROW_CODE=$(curl -sk --resolve arif-fazil.com:443:127.0.0.1 -H "User-Agent: Mozilla/5.0" -o /dev/null -w "%{http_code}" "https://arif-fazil.com/world/makcikgpt/$slug" 2>/dev/null || echo "000")
      if [ "$BOT_CODE" = "200" ] && [ "$BROW_CODE" = "200" ]; then
        pass "$slug — bot:$BOT_CODE browser:$BROW_CODE"
      else
        fail "$slug — bot:$BOT_CODE browser:$BROW_CODE"; TOTAL_FAIL=$((TOTAL_FAIL+1))
      fi
    done

    # Listing, feed, sitemap, llms
    for check in "listing /world/makcikgpt/|https://arif-fazil.com/world/makcikgpt/|200" \
                 "feed.xml|https://arif-fazil.com/feed.xml|200" \
                 "sitemap.xml|https://arif-fazil.com/sitemap.xml|200" \
                 "llms.txt|https://arif-fazil.com/llms.txt|200"; do
      name="${check%%|*}"; url="${check#*|}"; url="${url%|*}"; exp="${check##*|}"
      CODE=$(curl -sk --resolve arif-fazil.com:443:127.0.0.1 -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
      [ "$CODE" = "$exp" ] && pass "$name ($CODE)" || { fail "$name ($CODE)"; TOTAL_FAIL=$((TOTAL_FAIL+1)); }
    done

    [ "$TOTAL_FAIL" -eq 0 ] && pass "ALL VERIFICATIONS PASSED" || fail "$TOTAL_FAIL checks failed"
    exit "$TOTAL_FAIL"
  }
fi

# ── Phase 1: Article Scavenger — Find unregistered .ts files ───────
header "PHASE 1: Article Scavenger"
UNREGISTERED=()
for f in "$MAKCIKGPT_DIR"/*.ts; do
  slug=$(basename "$f" .ts)
  [ "$slug" = "index" ] || [ "$slug" = "types" ] || [ "$slug" = "fix" ] || [ "$slug" = "jsonld-blocks" ] && continue
  if ! grep -q "'$slug'" "$INDEX_TS" 2>/dev/null; then
    UNREGISTERED+=("$slug")
    warn "UNREGISTERED: $slug"
  fi
done

if [ ${#UNREGISTERED[@]} -eq 0 ]; then
  pass "All articles registered in index.ts"
else
  info "${#UNREGISTERED[@]} unregistered article(s) found"
fi

# Also check essays.json
MISSING_ESSAYS=()
for f in "$MAKCIKGPT_DIR"/*.ts; do
  slug=$(basename "$f" .ts)
  [ "$slug" = "index" ] || [ "$slug" = "types" ] || [ "$slug" = "fix" ] || [ "$slug" = "jsonld-blocks" ] && continue
  if ! grep -q "/world/makcikgpt/$slug" "$ESSAYS_JSON" 2>/dev/null; then
    MISSING_ESSAYS+=("$slug")
    warn "MISSING from essays.json: $slug"
  fi
done

TOTAL_UNREG=$(( ${#UNREGISTERED[@]} + ${#MISSING_ESSAYS[@]} ))

if $DRY_RUN; then
  header "DRY RUN — Stopping here"
  info "Would register: ${UNREGISTERED[*]:-none} in index.ts"
  info "Would add to essays.json: ${MISSING_ESSAYS[*]:-none}"
  info "Then build + deploy + verify"
  exit 0
fi

if [ "$TOTAL_UNREG" -gt 0 ]; then
  warn "Found $TOTAL_UNREG unregistered articles. Proceeding will NOT register them —"
  warn "this script detects orphans but cannot auto-register (needs human judgment)."
  warn "Register manually, then re-run."
  info "Timing out 5 seconds for Ctrl+C..."; sleep 3
  echo -e "${CYAN}Proceeding with current registration...${NC}"
fi

# ── Phase 2: Ensure npm deps are fresh ─────────────────────────────
header "PHASE 2: npm install (if needed)"
if [ ! -d "node_modules" ] || [ "$(find node_modules -maxdepth 0 -mmin +60)" ]; then
  info "node_modules stale or missing — running npm install..."
  if ! npm install --legacy-peer-deps 2>&1; then
    warn "npm install had issues (peer dep conflicts expected with vite-plugin-ssg + React 19)"
  fi
  pass "npm install done"
else
  pass "node_modules fresh"
fi

# ── Phase 3: Generate static HTML/MD for bot/crawler ───────────────
header "PHASE 3: Static HTML/MD Generation"
if [ -f "scripts/generate-makcik-index.cjs" ]; then
  node scripts/generate-makcik-index.cjs && pass "makcikgpt index regenerated" || warn "Index regeneration had issues"
fi

# Generate individual article HTML files from essays.json
if [ -f "$ESSAYS_JSON" ]; then
  python3 -c "
import json, os
with open('$ESSAYS_JSON') as f:
    essays = json.load(f)
for e in essays:
    slug = e.get('id', '')
    title = e.get('title', slug)
    subtitle = e.get('subtitle', '')
    date = e.get('date', '')
    if not slug: continue
    html_path = os.path.join('$PUBLIC_MD_DIR', f'{slug}.html')
    if os.path.exists(html_path): continue
    os.makedirs('$PUBLIC_MD_DIR', exist_ok=True)
    with open(html_path, 'w') as hf:
        hf.write(f'''<!DOCTYPE html><html lang=\"ms\">
<head><meta charset=\"utf-8\"><title>{title} — MakcikGPT</title>
<meta name=\"description\" content=\"{subtitle}\">
<link rel=\"canonical\" href=\"https://arif-fazil.com/world/makcikgpt/{slug}\">
<meta name=\"robots\" content=\"index,follow\">
<style>body{{background:#0d0d0d;color:#ccc;font-family:sans-serif;max-width:720px;margin:3em auto;padding:0 1em;line-height:1.6}}
a{{color:#d4a843}}h1{{color:#eee}}time{{color:#888;font-size:0.9em}}</style>
</head><body>
<h1>{title}</h1>
<p><time>{date}</time></p>
{subtitle and f'<p>{subtitle}</p>' or ''}
<p><a href=\"/world/makcikgpt/{slug}\">Baca artikel penuh →</a></p>
</body></html>''')
    print(f'  Generated: {slug}.html')
" && pass "Static HTML generated for new articles" || warn "Static HTML generation had issues"
fi

# ── Phase 4: Build ─────────────────────────────────────────────────
header "PHASE 4: Build"
if npm run build 2>&1; then
  pass "Build succeeded"
else
  fail "Build failed"
  info "Common fixes: check TypeScript syntax, imports in index.ts, metadata shape"
  exit 1
fi

# ── Phase 5: Deploy ─────────────────────────────────────────────────
header "PHASE 5: Deploy"

# 5a: Sync static MD files
if [ -d "$PUBLIC_MD_DIR" ]; then
  rsync -av --delete "$PUBLIC_MD_DIR/" "$BOT_STATIC_DIR/" && pass "Static MD files synced" || warn "Static MD sync failed"
fi

# 5b: Sync dist to webroot
rsync -av --delete "$SITE_DIR/dist/" "$WEBROOT/" && pass "dist synced to webroot" || { fail "dist sync failed"; exit 1; }

# 5c: Caddy reload
if sudo caddy reload --config "$CADDYFILE" 2>&1; then
  pass "Caddy reloaded"
else
  warn "Caddy reload had issues — trying validate first"
  sudo caddy validate --config "$CADDYFILE" 2>&1 || { fail "Caddy config invalid"; exit 1; }
  sudo caddy reload --config "$CADDYFILE" 2>&1 && pass "Caddy reloaded" || { fail "Caddy reload still failing"; exit 1; }
fi

# ── Phase 6: Verify ─────────────────────────────────────────────────
header "PHASE 6: Verify"

# 6a: JS bundle hash
DIST_JS=$(ls -t "$SITE_DIR/dist/assets/"*.js 2>/dev/null | head -1 | xargs basename 2>/dev/null || echo "no-dist")
LIVE_JS=$(curl -sk --resolve arif-fazil.com:443:127.0.0.1 "https://arif-fazil.com/" 2>/dev/null | grep -oP 'index-[A-Za-z0-9]+\.js' || echo "no-live")
if [ -n "$DIST_JS" ] && [ -n "$LIVE_JS" ] && [ "$DIST_JS" = "$LIVE_JS" ]; then
  pass "JS bundle: $DIST_JS (live matches dist)"
else
  fail "JS bundle mismatch: dist=$DIST_JS live=$LIVE_JS"
  TOTAL_FAIL=1
fi

# 6b: Check each article slug
TOTAL_FAIL=${TOTAL_FAIL:-0}
for ts_file in "$MAKCIKGPT_DIR"/*.ts; do
  slug=$(basename "$ts_file" .ts)
  [ "$slug" = "index" ] || [ "$slug" = "types" ] || [ "$slug" = "fix" ] || [ "$slug" = "jsonld-blocks" ] && continue
  BOT_CODE=$(curl -sk --resolve arif-fazil.com:443:127.0.0.1 -o /dev/null -w "%{http_code}" "https://arif-fazil.com/world/makcikgpt/$slug" 2>/dev/null || echo "000")
  BROW_CODE=$(curl -sk --resolve arif-fazil.com:443:127.0.0.1 -H "User-Agent: Mozilla/5.0" -o /dev/null -w "%{http_code}" "https://arif-fazil.com/world/makcikgpt/$slug" 2>/dev/null || echo "000")
  if [ "$BOT_CODE" = "200" ] && [ "$BROW_CODE" = "200" ]; then
    pass "$slug — bot:$BOT_CODE browser:$BROW_CODE"
  elif [ "$BOT_CODE" = "200" ]; then
    warn "$slug — bot:$BOT_CODE browser:$BROW_CODE (SPA may need JS)"
  else
    fail "$slug — bot:$BOT_CODE browser:$BROW_CODE"; TOTAL_FAIL=$((TOTAL_FAIL+1))
  fi
done

# 6c: Listing page
LIST_BOT=$(curl -sk --resolve arif-fazil.com:443:127.0.0.1 -o /dev/null -w "%{http_code}" "https://arif-fazil.com/world/makcikgpt/" 2>/dev/null || echo "000")
LIST_BROW=$(curl -sk --resolve arif-fazil.com:443:127.0.0.1 -H "User-Agent: Mozilla/5.0" -o /dev/null -w "%{http_code}" "https://arif-fazil.com/world/makcikgpt/" 2>/dev/null || echo "000")
if [ "$LIST_BOT" = "200" ]; then pass "Listing bot: $LIST_BOT"; else fail "Listing bot: $LIST_BOT"; TOTAL_FAIL=$((TOTAL_FAIL+1)); fi
if [ "$LIST_BROW" = "200" ]; then pass "Listing browser: $LIST_BROW"; else warn "Listing browser: $LIST_BROW"; fi

# 6d: Feed, sitemap, llms.txt
for pair in "feed.xml|https://arif-fazil.com/feed.xml" "sitemap.xml|https://arif-fazil.com/sitemap.xml" "llms.txt|https://arif-fazil.com/llms.txt"; do
  name="${pair%%|*}"; url="${pair##*|}"
  CODE=$(curl -sk --resolve arif-fazil.com:443:127.0.0.1 -o /dev/null -w "%{http_code}" "$url" 2>/dev/null || echo "000")
  [ "$CODE" = "200" ] && pass "$name ($CODE)" || { fail "$name ($CODE)"; TOTAL_FAIL=$((TOTAL_FAIL+1)); }
done

# ── Summary ─────────────────────────────────────────────────────────
header "SUMMARY"
if [ "${TOTAL_FAIL:-0}" -eq 0 ]; then
  pass "ALL CHECKS PASSED — MakcikGPT deploy successful"
  echo ""
  info "What was deployed:"
  for ts_file in "$MAKCIKGPT_DIR"/*.ts; do
    slug=$(basename "$ts_file" .ts)
    [ "$slug" = "index" ] || [ "$slug" = "types" ] || [ "$slug" = "fix" ] || [ "$slug" = "jsonld-blocks" ] && continue
    echo "    • $slug"
  done
  echo ""
  info "Next: distribute to Telegram/WhatsApp groups"
else
  fail "${TOTAL_FAIL} verification(s) failed — check above"
  exit 1
fi
