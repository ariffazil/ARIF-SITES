#!/bin/bash
# ============================================================
# arif-sites Deploy Script — Phase 2
# Ditempa Bukan Diberi — Forged, Not Given
# ============================================================
set -e

VPS_PATH="/opt/arifos/sites/arif-fazil.com"
BUILD_LOG="/tmp/arif-sites-deploy.log"

echo "=== arif-sites deploy $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee "$BUILD_LOG"

# ---- Build React apps ----
for site in arif arifos aaa; do
  echo "--- Building $site ---" | tee -a "$BUILD_LOG"
  (cd /root/arif-sites/$site && npm run build) >> "$BUILD_LOG" 2>&1
done

# ---- Copy React dist/ to VPS ----
for site in arif arifos aaa; do
  echo "--- Syncing $site dist/ to VPS ---" | tee -a "$BUILD_LOG"
  cp -r /root/arif-sites/$site/dist/. "$VPS_PATH/$site/" 2>/dev/null
done

# ---- Static sites (forge, apex, geox) — copy from source ----
for site in forge apex geox; do
  if [ -d "/root/arif-sites/$site" ]; then
    echo "--- Syncing $site static ---" | tee -a "$BUILD_LOG"
    cp -r /root/arif-sites/$site/. "$VPS_PATH/$site/" 2>/dev/null
  fi
done

# ---- Copy sitemap.xml + robots.txt to VPS root ----
cp /root/arif-sites/sitemap.xml "$VPS_PATH/"
echo "--- Synced sitemap.xml to VPS root ---" | tee -a "$BUILD_LOG"

# ---- Build and sync specs/ ----
if [ -d "/root/arif-sites/specs" ]; then
  mkdir -p "$VPS_PATH/specs"
  cp -r /root/arif-sites/specs/. "$VPS_PATH/specs/"
  echo "--- Synced specs/ ---" | tee -a "$BUILD_LOG"
fi

# ---- Cross-link nav injection on apex + geox ----
for site in apex geox; do
  if [ -f "$VPS_PATH/$site/index.html" ]; then
    NAV='<nav style="border-top:1px solid #333;margin-top:40px;padding:20px 0;font-size:13px"><a href="https://arif-fazil.com" style="color:#d4a853;margin-right:16px">THE SOUL</a><a href="https://arifOS.arif-fazil.com" style="color:#d4a853;margin-right:16px">THE MIND</a><a href="https://aaa.arif-fazil.com" style="color:#d4a853;margin-right:16px">THE BODY</a><a href="https://forge.arif-fazil.com" style="color:#d4a853;margin-right:16px">Forge</a><a href="https://geox.arif-fazil.com" style="color:#d4a853;margin-right:16px">GEOX</a><br><span style="color:#666;font-size:11px">Machine: <a href="/llms.txt" style="color:#666">llms.txt</a> · <a href="/sitemap.xml" style="color:#666">sitemap</a> · <a href="/page.json" style="color:#666">page.json</a></span></nav>'
    if ! grep -q "cross-links\|arifOS Estate" "$VPS_PATH/$site/index.html" 2>/dev/null; then
      sed -i "s|</body>|$NAV</body>|g" "$VPS_PATH/$site/index.html"
      echo "  Injected nav into $site" | tee -a "$BUILD_LOG"
    fi
  fi
done

# ---- Full verification ----
echo "--- Verification ---" | tee -a "$BUILD_LOG"
ALL_OK=true
check_url() {
  local url="$1"
  local status
  status=$(curl -sI "$url" --max-time 8 | head -1 | tr -d '\r\n')
  if echo "$status" | grep -q "200\|301\|302"; then
    echo "  ✅ $status  $url" | tee -a "$BUILD_LOG"
  else
    echo "  ❌ $status  $url" | tee -a "$BUILD_LOG"
    ALL_OK=false
  fi
}

check_url "https://arif-fazil.com/"
check_url "https://arif-fazil.com/llms.txt"
check_url "https://arif-fazil.com/sitemap.xml"
check_url "https://arif-fazil.com/page.json"
check_url "https://arif-fazil.com/.well-known/agent.json"
check_url "https://aaa.arif-fazil.com/"
check_url "https://aaa.arif-fazil.com/llms.txt"
check_url "https://aaa.arif-fazil.com/page.json"
check_url "https://aaa.arif-fazil.com/.well-known/agent.json"
check_url "https://arifOS.arif-fazil.com/"
check_url "https://arifOS.arif-fazil.com/llms.txt"
check_url "https://arifOS.arif-fazil.com/page.json"
check_url "https://arifOS.arif-fazil.com/.well-known/agent.json"
check_url "https://forge.arif-fazil.com/"
check_url "https://forge.arif-fazil.com/llms.txt"
check_url "https://geox.arif-fazil.com/"
check_url "https://apex.arif-fazil.com/"

if $ALL_OK; then
  echo "=== Deploy PASSED ===" | tee -a "$BUILD_LOG"
else
  echo "=== Deploy COMPLETED WITH WARNINGS ===" | tee -a "$BUILD_LOG"
fi
