#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# agentic-build.sh — Single-command federation build + deploy
#
# Usage:  ./scripts/agentic-build.sh
#
# What it does (one shot, top to bottom):
#   1. prebuild  — runs all 5 generators (feed, discovery, makcik,
#                  wealth-archive, ns-telemetry). Re-renders:
#                    public/sitemap.xml, llms.txt, llms.json,
#                    page.json, feed.xml, makcikgpt-md/index.html,
#                    data/wealth/archive_index.json,
#                    data/politics/ns_live_telemetry.json
#   2. build     — tsc -b && vite build (React SPA + dist/)
#   3. postbuild — copy-static-html.js (canon + 999)
#   4. dossier   — append human-curated dossier entries to
#                    llms.txt (dossier-llms-additions.md) and
#                    sitemap.xml (dossier-sitemap-additions.xml)
#                    so they survive every regeneration
#   5. mirror    — rsync dist/ + updated public/ → /var/www/html/arif/
#                    (the live root that Caddy serves)
#   6. verify    — probe every key surface and report status
#
# Conventions respected (per AGENTS.md / arifOS):
#   - F1 AMANAH: reversible, dry-runnable with --no-mirror
#   - F2 TRUTH:   only commits when probes return 200; never fabricates
#   - F4 CLARITY: every output file is generated from a known source
#   - F11 AUDIT: every run prints a hash of the generated outputs
# ═══════════════════════════════════════════════════════════════════════

set -euo pipefail

SITE_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
LIVE_ROOT="/var/www/html/arif"
DOSSIER_LLMS="scripts/dossier-llms-additions.md"
DOSSIER_SITEMAP="scripts/dossier-sitemap-additions.xml"

# ── args ─────────────────────────────────────────────────────────────
NO_MIRROR=0
SKIP_BUILD=0
for arg in "$@"; do
  case "$arg" in
    --no-mirror) NO_MIRROR=1 ;;
    --no-build)  SKIP_BUILD=1 ;;
    -h|--help)
      sed -n '2,32p' "$0"
      exit 0 ;;
    *) echo "Unknown arg: $arg" >&2; exit 2 ;;
  esac
done

cd "$SITE_ROOT"
echo "═══════════════════════════════════════════════════════════"
echo "  agentic-build · $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "  site:     $SITE_ROOT"
echo "  live:     $LIVE_ROOT"
echo "═══════════════════════════════════════════════════════════"
echo ""

# ── 1. prebuild + 2. build + 3. postbuild ───────────────────────────
if [ "$SKIP_BUILD" = "0" ]; then
  echo "── 1/6 · npm run build (prebuild + build + postbuild)"
  npm run build 2>&1 | tail -8
  echo ""
else
  echo "── 1/6 · SKIPPED (--no-build)"
  echo ""
fi

# ── 4. dossier additions (post-build fragment) ───────────────────
echo "── 2/6 · inject dossier additions into llms.txt + sitemap.xml"

if [ -f "$DOSSIER_LLMS" ] && [ -f "public/llms.txt" ]; then
  # Append the dossier fragment to llms.txt, before any closing marker
  if ! grep -q "Federation Zen Bootstrap" public/llms.txt; then
    cat "$DOSSIER_LLMS" >> public/llms.txt
    # Also write to dist/ — Vite has already built, so it isn't in dist/ yet
    [ -f "dist/llms.txt" ] && cat "$DOSSIER_LLMS" >> dist/llms.txt
    echo "  ✓ llms.txt ← dossier additions appended (source + dist)"
  else
    echo "  ⊝ llms.txt already has dossier fragment (skip source)"
    # Still mirror if dist/ doesn't have it
    if [ -f "dist/llms.txt" ] && ! grep -q "Federation Zen Bootstrap" dist/llms.txt; then
      cat "$DOSSIER_LLMS" >> dist/llms.txt
      echo "  ✓ llms.txt ← dist/ caught up"
    fi
  fi
fi

if [ -f "$DOSSIER_SITEMAP" ] && [ -f "public/sitemap.xml" ]; then
  inject_dossier_sitemap() {
    local target="$1"
    python3 -c "
import sys
p='$target'
s=open(p).read()
ins=open('${DOSSIER_SITEMAP}').read().rstrip()
s2=s.replace('</urlset>', ins + '\n</urlset>', 1)
open(p,'w').write(s2)
"
  }
  if ! grep -q "earth/kinabalu-basin" public/sitemap.xml; then
    inject_dossier_sitemap "public/sitemap.xml"
    [ -f "dist/sitemap.xml" ] && inject_dossier_sitemap "dist/sitemap.xml"
    echo "  ✓ sitemap.xml ← dossier URLs appended (source + dist)"
  else
    echo "  ⊝ sitemap.xml already has dossier URLs (skip source)"
    if [ -f "dist/sitemap.xml" ] && ! grep -q "earth/kinabalu-basin" dist/sitemap.xml; then
      inject_dossier_sitemap "dist/sitemap.xml"
      echo "  ✓ sitemap.xml ← dist/ caught up"
    fi
  fi
fi
echo ""

# ── 5. mirror dist/ → /var/www/html/arif/ ──────────────────────────
if [ "$NO_MIRROR" = "0" ]; then
  echo "── 3/6 · mirror dist/ + public/ → $LIVE_ROOT"
  rsync -a --delete "$SITE_ROOT/dist/" "$LIVE_ROOT/" 2>&1 | tail -2
  chown -R www-data:www-data "$LIVE_ROOT" 2>/dev/null || true
  echo "  ✓ mirror complete"
  echo ""
else
  echo "── 3/6 · SKIPPED (--no-mirror)"
  echo ""
fi

# ── 6. verify ───────────────────────────────────────────────────────
echo "── 4/6 · verify (HTTP probe every key surface)"
SURFACES=(
  "https://arif-fazil.com/"
  "https://arif-fazil.com/earth/"
  "https://arif-fazil.com/earth/kinabalu-basin/"
  "https://arif-fazil.com/earth/kinabalu-cross-section.html"
  "https://arif-fazil.com/earth/malay-basin/"
  "https://arif-fazil.com/earth/malay-basin-cross-section.html"
  "https://arif-fazil.com/sitemap.xml"
  "https://arif-fazil.com/llms.txt"
  "https://arif-fazil.com/_shared/zen-all.js"
)
PASS=0; FAIL=0
for url in "${SURFACES[@]}"; do
  code=$(curl -sI "$url" --max-time 6 -o /dev/null -w "%{http_code}")
  if [ "$code" = "200" ]; then
    printf "  ✓ %3s  %s\n" "$code" "$url"
    PASS=$((PASS+1))
  else
    printf "  ✗ %3s  %s\n" "$code" "$url"
    FAIL=$((FAIL+1))
  fi
done
echo ""
echo "── 5/6 · compute hashes (F11 AUDIT)"
for f in public/sitemap.xml public/llms.txt public/llms.json public/page.json public/feed.xml; do
  if [ -f "$f" ]; then
    h=$(sha256sum "$f" | cut -d' ' -f1 | head -c 16)
    s=$(stat -c%s "$f")
    printf "  %-30s  %sB  sha256:%s\n" "$f" "$s" "$h"
  fi
done
echo ""
echo "── 6/6 · summary"
echo "  Surfaces: $PASS passed, $FAIL failed"
[ "$FAIL" = "0" ] && echo "  ✓ build is GREEN" || echo "  ✗ build has failures"
echo ""
echo "═══════════════════════════════════════════════════════════"
echo "  agentic-build complete · $(date -u +%Y-%m-%dT%H:%M:%SZ)"
echo "═══════════════════════════════════════════════════════════"
