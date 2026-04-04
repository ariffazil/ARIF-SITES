#!/bin/bash
# ============================================================
# arif-sites Deploy Script — Phase 1
# Ditempa Bukan Diberi — Forged, Not Given
# ============================================================
set -e

VPS_PATH="/opt/arifos/sites/arif-fazil.com"
BUILD_LOG="/tmp/arif-sites-deploy.log"

echo "=== arif-sites deploy $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee "$BUILD_LOG"

# Build each site
echo "--- Building arif ---" | tee -a "$BUILD_LOG"
(cd /root/arif-sites/arif && npm run build) >> "$BUILD_LOG" 2>&1

echo "--- Building aaa ---" | tee -a "$BUILD_LOG"
(cd /root/arif-sites/aaa && npm install --silent 2>/dev/null; npm run build) >> "$BUILD_LOG" 2>&1

echo "--- Building arifos ---" | tee -a "$BUILD_LOG"
(cd /root/arif-sites/arifos && npm install --silent 2>/dev/null; npm run build) >> "$BUILD_LOG" 2>&1

# Sync to VPS
echo "--- Syncing to VPS ---" | tee -a "$BUILD_LOG"
cp -r /root/arif-sites/arif/dist/.  "$VPS_PATH/arif/" 2>/dev/null || mkdir -p "$VPS_PATH/arif" && cp -r /root/arif-sites/arif/dist/. "$VPS_PATH/arif/"
cp -r /root/arif-sites/aaa/dist/.  "$VPS_PATH/aaa/" 2>/dev/null || mkdir -p "$VPS_PATH/aaa" && cp -r /root/arif-sites/aaa/dist/. "$VPS_PATH/aaa/"
cp -r /root/arif-sites/arifos/dist/. "$VPS_PATH/arifos/" 2>/dev/null || mkdir -p "$VPS_PATH/arifos" && cp -r /root/arif-sites/arifos/dist/. "$VPS_PATH/arifos/"

# Also sync forge (static) if changed
if [ -d /root/arif-sites/forge ]; then
  echo "--- Syncing forge ---" | tee -a "$BUILD_LOG"
  cp -r /root/arif-sites/forge/. "$VPS_PATH/forge/" 2>/dev/null
fi

# Verify
echo "--- Verifying ---" | tee -a "$BUILD_LOG"
for url in "https://arif-fazil.com/" "https://aaa.arif-fazil.com/" "https://arifos.arif-fazil.com/"; do
  status=$(curl -sI "$url" --max-time 5 | head -1 | tr -d '\r')
  echo "$status  $url" | tee -a "$BUILD_LOG"
done

echo "=== Deploy complete ===" | tee -a "$BUILD_LOG"
