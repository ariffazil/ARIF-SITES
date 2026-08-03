#!/usr/bin/env bash
# ═══════════════════════════════════════════════════════════════════════
# CONTENT ASSERTION GATE — arif-fazil.com
# ═══════════════════════════════════════════════════════════════════════
# Verifies served HTML contains (or excludes) expected strings.
# Outlives verify-pages.sh — reachability is not correctness.
# A 200 with stale content passes verify-pages. This gate catches it.
#
# Forged 2026-08-03 by 333-AGI under APEX Audit Directive E2.
# DITEMPA BUKAN DIBERI — a gate that passes when zero changes deployed
# is not a gate — it is a liveness check wearing a gate's name.
# ═══════════════════════════════════════════════════════════════════════
set -euo pipefail

BASE_URL="${1:-https://arif-fazil.com}"
TIMEOUT="${2:-10}"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
CYAN='\033[0;36m'
NC='\033[0m'

FAILURES=0
CHECKS=0

fetch() {
    curl -sf --max-time "$TIMEOUT" -H "Cache-Control: no-cache" "$BASE_URL$1"
}

assert_present() {
    local url="$1" label="$2" needle="$3"
    CHECKS=$((CHECKS + 1))
    local html
    html=$(fetch "$url") || { echo -e "  ${RED}❌ FETCH FAILED${NC} $url → $label"; FAILURES=$((FAILURES + 1)); return; }
    # use grep -cF not -qF: -q exits on first match, SIGPIPE kills echo, pipefail propagates 141
    if [ "$(echo "$html" | grep -cF "$needle")" -gt 0 ]; then
        echo -e "  ${GREEN}✅${NC} $label"
    else
        echo -e "  ${RED}❌ MISSING${NC} $url → $label"
        FAILURES=$((FAILURES + 1))
    fi
}

assert_absent() {
    local url="$1" label="$2" needle="$3"
    CHECKS=$((CHECKS + 1))
    local html
    html=$(fetch "$url") || { echo -e "  ${RED}❌ FETCH FAILED${NC} $url → $label"; FAILURES=$((FAILURES + 1)); return; }
    if [ "$(echo "$html" | grep -cF "$needle")" -gt 0 ]; then
        echo -e "  ${RED}❌ STILL PRESENT${NC} $url → $label"
        FAILURES=$((FAILURES + 1))
    else
        echo -e "  ${GREEN}✅${NC} $label (absent)"
    fi
}

echo -e "${CYAN}═══ CONTENT ASSERTIONS — /vitals/${NC}"

# ── Workstream A — Banner ──
assert_present "/vitals/"  "A: FY2026 DECLARED panel"     "FY2026 DECLARED STATE"
assert_present "/vitals/"  "A: FY2025 SEALED reading"      "FY2025 SEALED READING"
assert_present "/vitals/"  "A: RM20 billion disclosed"     "RM20 billion"
assert_present "/vitals/"  "A: 38% cut stated"             "38% cut"
assert_present "/vitals/"  "A: Feb 2026 date"              "27 February 2026"
assert_present "/vitals/"  "A: Capex RM45-50B"             "RM45–50B"
assert_present "/vitals/"  "A: F13 veto restored"          "F13 veto remains final"
assert_present "/vitals/"  "A: Exit at RM36.4B"            "RM36.4B"
assert_present "/vitals/"  "A: Cap/floor collision"        "RM33.3B"
assert_present "/vitals/"  "A: [DEC] tag"                  "[DEC]"

# ── Stale phrases removed ──
assert_absent "/vitals/"   "A: DIVIDEND STOP removed"      "DIVIDEND STOP EFFECTIVE"
assert_absent "/vitals/"   "A: No human override removed"   "No human override"

# ── Workstream B — Site render ──
assert_present "/vitals/"  "B1: Pulse 0"                   'id="pulseval" style="color:var(--void)">0<'
assert_present "/vitals/"  "B1: Verdict VOID"              'pulseverdict" style="background:var(--void)'
assert_present "/vitals/"  "B2: BODY override"             "OVERRIDE ACTIVE"
assert_present "/vitals/"  "B3: 2 of 6 ENGAGED"            "2 of 6 ENGAGED"
assert_present "/vitals/"  "B3: Governance ACTIVE"          "Governance Capacity"
assert_absent "/vitals/"   "B4: 0.59/1.00 removed"          "0.59/1.00"
assert_present "/vitals/"  "B4: 1.00/3 present"             "1.00/3"
assert_present "/vitals/"  "B5: Tripwire labelled"          "60% tripwire"
assert_present "/vitals/"  "B5: Pacemaker labelled"         "65% pacemaker"
assert_absent "/vitals/"   "B6: \$83.78 hardcoded removed"  "83.78"
assert_present "/vitals/"  "B8: Honesty EN"                 "None of the"
assert_absent "/vitals/"   "B9: RM3.5B removed"             "RM3.5B"
assert_present "/vitals/"  "B9: RM3.1B present"             "RM3.1B"
assert_absent "/vitals/"   "B10: 12 tools removed"          "12 WEALTH tools"
assert_present "/vitals/"  "B10: 9 canonical present"       "9 canonical WEALTH"

# ── JSON-LD integrity ──
echo ""
echo -e "${CYAN}═══ CONTENT ASSERTIONS — JSON-LD${NC}"
assert_present "/vitals/"  "JSON-LD: ThreeDoorsDigest"     "ThreeDoorsDigest"
assert_present "/vitals/"  "JSON-LD: PacemakerAction"       "PacemakerAction"
assert_present "/vitals/"  "JSON-LD: CrisisAlert"           "InstitutionalCrisisAlert"
assert_present "/vitals/"  "JSON-LD: 2 pacemakers"          "2 pacemakers ENGAGED"

# ── Cross-surface nav ──
echo ""
echo -e "${CYAN}═══ CONTENT ASSERTIONS — Nav completeness${NC}"
for page in /oil/ /gas/ /gold/ /klci/ /usdmyr/; do
    assert_present "$page" "Nav to /vitals/"  "/vitals/"
    assert_present "$page" "Nav to /malaysia/" "/malaysia/"
done

# ── Commodity live proxies ──
echo ""
echo -e "${CYAN}═══ CONTENT ASSERTIONS — Live proxies${NC}"
for page in /oil/ /gas/ /gold/ /klci/ /usdmyr/; do
    assert_present "$page" "Live strip on $page" "LIVE MARKET PROXIES"
done

# ── Verdict ──
echo ""
echo -e "${CYAN}════════════════════════════════════════${NC}"
if [ "$FAILURES" -eq 0 ]; then
    echo -e "  ${GREEN}✅ ALL $CHECKS CONTENT ASSERTIONS PASS${NC}"
    echo -e "  ${CYAN}VERDICT: PASS${NC} — content matches expected state"
    exit 0
else
    echo -e "  ${RED}❌ $FAILURES/$CHECKS ASSERTIONS FAILED${NC}"
    echo -e "  ${RED}VERDICT: FAIL${NC} — content assertions must pass before deploy"
    exit 1
fi
