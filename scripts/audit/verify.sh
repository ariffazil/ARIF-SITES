#!/usr/bin/env bash
# ==============================================================================
# verify.sh — arif-fazil.com deep drift + content-truth audit (6h)
# F13 RATIFIED 2026-07-31 · Designed by 333-AGI (FI-008/kimi-code)
# ==============================================================================
# Purpose: Deep audit — catches dist/build drift (F2), MCP mismatch, content
#          lies (status 200 with wrong content). Surface-only.
# Scope: web_zen doctor + dist vs src route comparison + Caddy @spa_routes
#        completeness + key content markers.
# Mutations: NONE. Read-only probes + MD report + JSONL receipt.
# Cadence: 0 */6 * * * (every 6h on the hour)
# Reversibility: N/A. Delete reports freely.
# ==============================================================================

set -uo pipefail
umask 077

RECEIPT_DIR="/root/forge_work/site-audit/verify"
mkdir -p "$RECEIPT_DIR"
TS=$(date -u +%Y%m%dT%H%M%SZ)
REPORT="${RECEIPT_DIR}/verify-${TS}.md"
RECEIPT="${RECEIPT_DIR}/verify-${TS}.jsonl"
LOG="${RECEIPT_DIR}/verify.log"

SRC="/root/arif-fazil.com/sites/arif-fazil.com"
DIST="${SRC}/dist"
LIVE="/var/www/html/arif"
WEBZEN="/root/arif-fazil.com/scripts/web-zen/web_zen.py"

# Source secrets for kernel probes
[ -f /root/.secrets/kunci-mas.env ] && set -a && source /root/.secrets/kunci-mas.env 2>/dev/null && set +a

DRIFT=0
echo "=== VERIFY @ ${TS} ===" | tee "$LOG"

cat > "$REPORT" <<HEADER
# Verify Report — arif-fazil.com constellation
**Generated:** ${TS}
**Source commit:** $(git -C /root/arif-fazil.com rev-parse --short=7 HEAD 2>/dev/null || echo "UNKNOWN")
**Build hash:** $(python3 -c "import json; print(json.load(open('${LIVE}/build-info.json')).get('build_hash','UNKNOWN'))" 2>/dev/null || echo "UNKNOWN")

---

HEADER

emit() {
  local kind="$1" msg="$2"
  printf '{"ts":"%s","kind":"%s","msg":"%s"}\n' "$TS" "$kind" "$msg" >> "$RECEIPT"
}

# ── 1. web_zen doctor (full audit) ───────────────────────────────────
echo "## 1. web_zen doctor" >> "$REPORT"
if [ -x "$WEBZEN" ]; then
  doctor_json=$(python3 "$WEBZEN" doctor --json 2>/dev/null || echo "{}")
  doctor_ok=$(echo "$doctor_json" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('ok',False))" 2>/dev/null || echo "False")
  doctor_checks=$(echo "$doctor_json" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('checks',[])))" 2>/dev/null || echo "0")
  doctor_band=$(echo "$doctor_json" | python3 -c "
import sys,json
d=json.load(sys.stdin)
bands=[c.get('band','UNKNOWN') for c in d.get('checks',[])]
from collections import Counter
print(dict(Counter(bands)))
" 2>/dev/null || echo "{}")
  echo "- doctor.ok: **$doctor_ok**" >> "$REPORT"
  echo "- doctor.checks: **$doctor_checks**" >> "$REPORT"
  echo "- doctor.bands: \`$doctor_band\`" >> "$REPORT"
  emit "doctor_ok" "$doctor_ok"
  emit "doctor_checks" "$doctor_checks"
  [ "$doctor_ok" != "True" ] && DRIFT=1
else
  echo "- ⚠️ web_zen.py not found at $WEBZEN" >> "$REPORT"
  emit "doctor_skip" "web_zen_missing"
  DRIFT=1
fi
echo "" >> "$REPORT"

# ── 2. dist/ vs src/ route drift (F2 class) ───────────────────────────
echo "## 2. dist/ vs src/ route drift (F2 class)" >> "$REPORT"
if [ -d "$DIST/assets" ]; then
  bundle=$(ls "$DIST/assets"/index-*.js 2>/dev/null | head -1)
  if [ -n "$bundle" ]; then
    src_routes=$(grep -oE 'path:"/[a-z][a-z0-9_*-]*"' "${SRC}/src/App.tsx" 2>/dev/null | sort -u | wc -l)
    dist_paths=$(grep -oE 'path:"/[a-z*_-]+"' "$bundle" 2>/dev/null | sort -u | wc -l)
    echo "- src/App.tsx declared routes: **$src_routes**" >> "$REPORT"
    echo "- dist/assets compiled paths:  **$dist_paths**" >> "$REPORT"

    # Check each src route is in dist
    missing_routes=""
    for r in $(grep -oE 'path:"/[a-z][a-z0-9_*-]*"' "${SRC}/src/App.tsx" | sort -u | head -50); do
      r_clean=$(echo "$r" | sed 's/path:"\(.*\)"/\1/')
      # only flag simple /foo paths (not /foo/:slug since route can be /foo)
      if [[ "$r_clean" != *"*"* ]] && ! grep -q "path:\"${r_clean}\"" "$bundle" 2>/dev/null; then
        missing_routes="${missing_routes} ${r_clean}"
      fi
    done
    if [ -n "$missing_routes" ]; then
      echo "- ⚠️ **Source routes MISSING from dist bundle:**$missing_routes" >> "$REPORT"
      emit "drift_missing_routes" "$missing_routes"
      DRIFT=1
    else
      echo "- ✅ All declared routes compiled into dist" >> "$REPORT"
      emit "drift_missing_routes" "none"
    fi
  else
    echo "- ⚠️ No dist/assets/index-*.js bundle found" >> "$REPORT"
    emit "drift_skip" "no_bundle"
    DRIFT=1
  fi
else
  echo "- ⚠️ dist/ directory missing" >> "$REPORT"
  emit "drift_skip" "no_dist"
  DRIFT=1
fi
echo "" >> "$REPORT"

# ── 3. Caddy @spa_routes completeness check (F1 class) ─────────────────
echo "## 3. Caddy @spa_routes completeness (F1 class)" >> "$REPORT"
CADDY="/etc/caddy/Caddyfile"
if [ -f "$CADDY" ]; then
  # Extract the apex arif-fazil.com @spa_routes path list
  spa_paths=$(awk '/^[a-z0-9.-]+\.arif-fazil\.com \{/{flag=1; next} /^\}/{flag=0} flag && /@spa_routes/{flag2=1; next} flag2 && /@/{flag2=0} flag2' "$CADDY" 2>/dev/null | grep -oE '/[a-z*-]+' | sort -u)
  if [ -z "$spa_paths" ]; then
    # alt: just grep the @spa_routes block
    spa_paths=$(grep -A 50 "@spa_routes" "$CADDY" | head -3 | grep -oE '/[a-z*]+' | sort -u)
  fi
  echo "- Current Caddy @spa_routes paths:" >> "$REPORT"
  for p in $spa_paths; do echo "  - \`$p\`" >> "$REPORT"; done

  # Check src routes not in Caddy @spa_routes
  for r in /institution /institution/ /verify /compliance /wealth; do
    if ! echo "$spa_paths" | grep -q "/institution" 2>/dev/null; then
      echo "- ⚠️ /institution* not in @spa_routes — 17-byte 404 expected (F1 gap)" >> "$REPORT"
      emit "caddy_gap" "institution"
      DRIFT=1
    fi
  done
else
  echo "- ⚠️ Caddyfile not found" >> "$REPORT"
  emit "caddy_skip" "no_caddyfile"
fi
echo "" >> "$REPORT"

# ── 4. Content-truth spot checks (F2: 200 with wrong content = lie) ────
echo "## 4. Content-truth spot checks" >> "$REPORT"
spotcheck() {
  local label="$1" url="$2" expected="$3"
  local body status
  body=$(curl -sf -A "Mozilla/5.0" --max-time 10 "$url" 2>/dev/null)
  status=$?
  if [ $status -eq 0 ] && echo "$body" | grep -q "$expected"; then
    echo "- ✅ $label: contains '$expected'" >> "$REPORT"
    emit "content_ok" "$label"
  elif [ $status -ne 0 ]; then
    echo "- ❌ $label: curl failed (exit $status)" >> "$REPORT"
    emit "content_fail" "$label:$status"
    DRIFT=1
  else
    echo "- ⚠️ $label: 200 OK but content missing '$expected'" >> "$REPORT"
    emit "content_lie" "$label:missing_$expected"
    DRIFT=1
  fi
}

spotcheck "Home title"        "https://arif-fazil.com/"                    "DITEMPA BUKAN DIBERI\|arif-fazil.com"
spotcheck "Missions JSON"     "https://arif-fazil.com/missions.json"       "schema.*arifos.missions"
spotcheck "llms.txt"          "https://arif-fazil.com/llms.txt"            "arif-fazil.com"
spotcheck "Kinabalu Basin"    "https://arif-fazil.com/earth/kinabalu-basin/" "Kinabalu"
spotcheck "Writing essay"     "https://arif-fazil.com/writing/01-i-stopped-writing-prompts-heres-what-replaces-them-arep/" "essay\|writing"
spotcheck "Economics"         "https://arif-fazil.com/economics"           "WEALTH"
spotcheck "000 surface"       "https://arif-fazil.com/000/"                "INIT\|000\|genesis"
spotcheck "999 surface"       "https://arif-fazil.com/999/"                "Audit\|999\|proof"
echo "" >> "$REPORT"

# ── 5. Federation organ health (governance view) ──────────────────────
echo "## 5. Federation organ health" >> "$REPORT"
for svc in "arifos:8088" "aforge:7071" "aaa:3001" "geox:8081" "wealth:18082" "well:18083"; do
  name="${svc%%:*}"; port="${svc##*:}"
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "http://127.0.0.1:${port}/health" 2>/dev/null || echo "000")
  if [ "$code" = "200" ]; then
    echo "- ✅ ${name} :${port}" >> "$REPORT"
    emit "organ_ok" "$name"
  else
    echo "- ❌ ${name} :${port} (code=$code)" >> "$REPORT"
    emit "organ_down" "$name:$code"
    DRIFT=1
  fi
done
echo "" >> "$REPORT"

# ── Summary ───────────────────────────────────────────────────────────
if [ $DRIFT -eq 0 ]; then
  echo "## VERDICT: PASS — no drift detected" >> "$REPORT"
  echo "${TS}  VERDICT=PASS" >> "$LOG"
else
  echo "## VERDICT: DRIFT — review report for findings" >> "$REPORT"
  echo "${TS}  VERDICT=DRIFT" >> "$LOG"
fi

# Always copy latest for downstream consumers
cp "$RECEIPT" "${RECEIPT_DIR}/verify-latest.jsonl"
cp "$REPORT"  "${RECEIPT_DIR}/verify-latest.md"
echo "${TS}  report=${REPORT}  receipt=${RECEIPT}" >> "$LOG"

[ $DRIFT -eq 0 ] && exit 0 || exit 1
