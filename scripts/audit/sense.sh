#!/usr/bin/env bash
# ==============================================================================
# sense.sh — arif-fazil.com constellation surface probe (15m)
# F13 RATIFIED 2026-07-31 · Designed by 333-AGI (FI-008/kimi-code)
# ==============================================================================
# Purpose: Surface-only liveness probe of every public surface.
# Scope: 22 SPA routes · 6 constellation subdomains · 5 static sub-sites ·
#        7 bot-discovery endpoints · 3 commodity APIs.
# Mutations: NONE. Read-only curl + file write (JSONL receipt).
# Cadence: */15 * * * * (15 minutes)
# Reversibility: N/A (no mutations). Delete JSONL files freely.
# Failure mode: any 4xx/5xx surfaces in JSONL with route/url/code/bytes.
# ==============================================================================

set -uo pipefail
umask 077

RECEIPT_DIR="/root/forge_work/site-audit/sense"
mkdir -p "$RECEIPT_DIR"
TS=$(date -u +%Y%m%dT%H%M%SZ)
RECEIPT="${RECEIPT_DIR}/sense-${TS}.jsonl"
PREV="${RECEIPT_DIR}/sense-latest.jsonl"
LOG="${RECEIPT_DIR}/sense.log"

# Source secrets if available (for arifOS calls later)
[ -f /root/.secrets/kunci-mas.env ] && set -a && source /root/.secrets/kunci-mas.env 2>/dev/null && set +a

probe() {
  local label="$1" url="$2" ua="${3:-Mozilla/5.0}"
  local result code bytes dt
  # Single curl call — avoids double-fallback (000000) and halves network load.
  # Format: http_code size_download time_total (space-separated, one line).
  result=$(curl -s -o /dev/null -w "%{http_code} %{size_download} %{time_total}" \
    -A "$ua" --max-time 10 "$url" 2>/dev/null || echo "000 0 0")
  code=$(echo "$result" | awk '{print $1}')
  bytes=$(echo "$result" | awk '{print $2}')
  dt=$(echo "$result" | awk '{printf "%.0f", $3 * 1000}')
  printf '{"ts":"%s","label":"%s","url":"%s","code":%s,"bytes":%s,"latency_ms":%s,"ua":"%s"}\n' \
    "$TS" "$label" "$url" "$code" "$bytes" "$dt" "$ua" >> "$RECEIPT"
  echo "  $code $bytes $dt ms  $label  $url" >> "$LOG"
}

echo "=== SENSE @ ${TS} ===" >> "$LOG"

# ── 22 SPA routes (browser UA) ───────────────────────────────────────
for path in \
  / /writing/ /doctrine/ /missions/ /earth/ /earth/kinabalu-basin/ \
  /world/ /world/makcikgpt /world/oil/ /world/gas/ /world/gold/ \
  /wealth/ /geox/ /gas/ /genesis/ /connect/ \
  /politics/ns-election/ /politics/ns-election/playbook/ \
  /commodity/gold/ ; do
  probe "spa:${path}" "https://arif-fazil.com${path}"
done

# ── 2 browser-facing subdomains (API gateways arifos/aaa/geox/wealth excluded) ──
for sub in mcp well ; do
  probe "sub:${sub}" "https://${sub}.arif-fazil.com/"
done

# ── 5 static sub-sites ───────────────────────────────────────────────
for path in /000/ /999/ /arifos/ /gas/ /gas/world/ ; do
  probe "static:${path}" "https://arif-fazil.com${path}"
done

# ── 7 bot-discovery endpoints ────────────────────────────────────────
for path in /llms.txt /missions.json /robots.txt /sitemap.xml /feed.xml /soul.json /floors.json ; do
  probe "bot:${path}" "https://arif-fazil.com${path}"
done

# ── 3 commodity APIs (vital signs) ───────────────────────────────────
probe "api:gold:3456" "http://127.0.0.1:3456/health" "internal"
probe "api:oil:3457"  "http://127.0.0.1:3457/health" "internal"
probe "api:gas:3458"  "http://127.0.0.1:3458/health" "internal"

# ── Build hash + dirty-repo check (lightweight) ──────────────────────
build_hash=$(python3 -c "import json; print(json.load(open('/var/www/html/arif/build-info.json')).get('build_hash','UNKNOWN'))" 2>/dev/null || echo "UNKNOWN")
git_dirty="clean"
if [ -d /root/arif-fazil.com/.git ]; then
  if [ -n "$(git -C /root/arif-fazil.com status --porcelain 2>/dev/null)" ]; then
    git_dirty="dirty"
  fi
fi
printf '{"ts":"%s","meta":"build_hash","value":"%s"}\n' "$TS" "$build_hash" >> "$RECEIPT"
printf '{"ts":"%s","meta":"git_dirty","value":"%s"}\n' "$TS" "$git_dirty" >> "$RECEIPT"

# ── Diff vs previous (delta only) ────────────────────────────────────
TOTAL=$(wc -l < "$RECEIPT" | tr -d ' ')
FAIL=$(awk -F'"code":' '/"code":/ {print $2}' "$RECEIPT" | awk -F',' '{print $1}' | awk '$1 >= 400 || $1 == "000" {n++} END {print n+0}')
CHANGED=""
if [ -f "$PREV" ]; then
  CHANGED=$(diff "$PREV" "$RECEIPT" | grep -cE "^[<>]" || echo 0)
fi
cp "$RECEIPT" "$PREV"

# ── Summary line ─────────────────────────────────────────────────────
echo "${TS}  total=${TOTAL}  fail=${FAIL}  git=${git_dirty}  build=${build_hash}  changed_lines_vs_prev=${CHANGED}" >> "$LOG"

# ── Emit alert if failures > 0 ──────────────────────────────────────
if [ "$FAIL" -gt 0 ]; then
  echo "${TS}  ALERT: ${FAIL} surfaces failed — see $RECEIPT" >> "$LOG"
  exit 1
fi

exit 0
