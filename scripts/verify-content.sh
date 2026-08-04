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
#
# B11-E extension (2026-08-03, postdeploy-repair): parses JSON-LD blocks,
# asserts no-JS static-row count, SVG fan fallback, static scenario summary.
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

# B11-E: assert count of static .tripcell rows in no-JS HTML equals 9
assert_grid9_count() {
    local url="$1" expected="$2"
    CHECKS=$((CHECKS + 1))
    local html
    html=$(fetch "$url") || { echo -e "  ${RED}❌ FETCH FAILED${NC} $url → grid9 count"; FAILURES=$((FAILURES + 1)); return; }
    local got
    got=$(echo "$html" | grep -cF 'class="tripcell')
    if [ "$got" -eq "$expected" ]; then
        echo -e "  ${GREEN}✅${NC} B11-A: $url has exactly $expected static .tripcell rows (no-JS)"
    else
        echo -e "  ${RED}❌ B11-A: $url has $got .tripcell rows, expected $expected${NC}"
        FAILURES=$((FAILURES + 1))
    fi
}

# B11-E: assert every JSON-LD <script type="application/ld+json"> block parses
assert_jsonld_parses() {
    local url="$1"
    CHECKS=$((CHECKS + 1))
    local html
    html=$(fetch "$url") || { echo -e "  ${RED}❌ FETCH FAILED${NC} $url → JSON-LD parse"; FAILURES=$((FAILURES + 1)); return; }
    # Use python (always available on af-forge) to extract and parse every JSON-LD block.
    local out
    if ! out=$(echo "$html" | python3 -c '
import sys, re, json
html = sys.stdin.read()
blocks = re.findall(r"<script type=\"application/ld\+json\"[^>]*>([\s\S]*?)</script>", html)
ok = 0; bad = []
for i, b in enumerate(blocks):
    s = b.strip()
    if not s.startswith("{"):
        continue
    try:
        json.loads(s); ok += 1
    except Exception as e:
        bad.append((i, str(e)[:80], s[:120]))
print(f"OK={ok}")
for b in bad:
    print("BAD", *b, sep="|")
'); then
        echo -e "  ${RED}❌ JSON-LD parse harness error${NC}"
        FAILURES=$((FAILURES + 1))
        return
    fi
    local okcount
    okcount=$(echo "$out" | head -1 | sed 's/OK=//')
    if [ -n "$okcount" ] && [ "$okcount" -ge 4 ]; then
        echo -e "  ${GREEN}✅${NC} B11-E: $url JSON-LD blocks parse ($okcount blocks)"
    else
        echo -e "  ${RED}❌ B11-E: $url JSON-LD parse count = $okcount (expected ≥4)${NC}"
        FAILURES=$((FAILURES + 1))
    fi
    # Surface any parser errors
    if echo "$out" | grep -q "^BAD|"; then
        echo -e "  ${RED}❌ B11-E: $url JSON-LD parse errors:${NC}"
        echo "$out" | grep "^BAD|" | sed 's/^/      /'
        FAILURES=$((FAILURES + 1))
    fi
}

# B11-E: assert the institutional-vitals-reality JSON-LD carries the B11 contract
assert_reality_jsonld() {
    local url="$1"
    CHECKS=$((CHECKS + 1))
    local html
    html=$(fetch "$url") || { echo -e "  ${RED}❌ FETCH FAILED${NC} $url → reality JSON-LD"; FAILURES=$((FAILURES + 1)); return; }
    local result
    if ! result=$(echo "$html" | python3 -c '
import sys, re, json
html = sys.stdin.read()
m = re.search(r"<script type=\"application/ld\+json\" data-agent-role=\"institutional-vitals-reality\"[^>]*>([\s\S]*?)</script>", html)
if not m:
    print("MISSING"); sys.exit(0)
try:
    ld = json.loads(m.group(1))
except Exception as e:
    print("PARSE_ERR", e); sys.exit(0)
ok = (
    ld.get("display_pulse") == 0
    and ld.get("display_verdict") == "VOID"
    and ld.get("pre_lock_pulse") == 48
    and ld.get("pre_lock_verdict") == "HOLD"
    and ld.get("static_row_count") == 9
    and ld.get("fy2026_declared_state", {}).get("feeds_scoring") is False
    and ld.get("fy2026_declared_state", {}).get("epistemic_class") == "[DEC]"
    and isinstance(ld.get("indicators"), list) and len(ld["indicators"]) == 9
)
print("PASS" if ok else "FAIL", json.dumps({
    "display_pulse": ld.get("display_pulse"),
    "display_verdict": ld.get("display_verdict"),
    "pre_lock_pulse": ld.get("pre_lock_pulse"),
    "pre_lock_verdict": ld.get("pre_lock_verdict"),
    "static_row_count": ld.get("static_row_count"),
    "indicator_count": len(ld.get("indicators", [])),
    "feeds_scoring": ld.get("fy2026_declared_state", {}).get("feeds_scoring"),
    "epistemic_class": ld.get("fy2026_declared_state", {}).get("epistemic_class"),
}))
'); then
        echo -e "  ${RED}❌ reality JSON-LD harness error${NC}"
        FAILURES=$((FAILURES + 1))
        return
    fi
    local verdict
    verdict=$(echo "$result" | head -1 | awk '{print $1}')
    if [ "$verdict" = "PASS" ]; then
        echo -e "  ${GREEN}✅${NC} B11-D: reality JSON-LD contract (display=0/VOID, pre_lock=48/HOLD, [DEC] non-scoring)"
    else
        echo -e "  ${RED}❌ B11-D: reality JSON-LD contract FAIL${NC}"
        echo "$result" | sed 's/^/      /'
        FAILURES=$((FAILURES + 1))
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
assert_present "/vitals/"  "B10: 8 canonical present"       "8 canonical WEALTH"

# ── B11-E: forbidden contiguous marker '48 HOLD' (R1 + B11-D) ──
assert_absent "/vitals/"   "B11-E: no contiguous '48 HOLD' marker" "48 HOLD"
assert_absent "/data/wealth/petronas_vitals.json" "B11-E: source JSON no '48 HOLD' (canonical-source URL is irrelevant; this would 404 but checks for absence via grep on dist if reachable)" "48 HOLD" || true

# ── B11-A: exactly 9 static .tripcell rows in no-JS HTML ──
assert_grid9_count "/vitals/" 9

# ── B11-B: static SVG fan fallback present ──
assert_present "/vitals/"  "B11-B: SVG fan-svg element"   'id="fan-svg"'
assert_present "/vitals/"  "B11-B: NET-DEBT TRIPWIRE label" "NET-DEBT TRIPWIRE"
assert_present "/vitals/"  "B11-B: fan-fallback marker"    'data-agent-role="fan-fallback-static"'
assert_present "/vitals/"  "B11-B: [SPEC] non-scoring"     "[SPEC] non-scoring"

# ── B11-C: static scenario summary present ──
assert_present "/vitals/"  "B11-C: scenario-summary marker" 'data-agent-role="scenario-summary-static"'
assert_present "/vitals/"  "B11-C: IFR sole scoring input" "audited IFR FY2025 remains the sole scoring input"

# ── B11-D: reality JSON-LD contract ──
assert_reality_jsonld "/vitals/"
assert_present "/vitals/"  "B11-D: pre_lock_pulse 48 in JSON-LD"  '"pre_lock_pulse": 48'
assert_present "/vitals/"  "B11-D: display_pulse 0 in JSON-LD"    '"display_pulse": 0'
assert_present "/vitals/"  "B11-D: fy2026 [DEC] feeds_scoring=false" '"feeds_scoring": false'
assert_absent "/vitals/"   "B11-D: '48 HOLD' must not appear in any JSON-LD" "48 HOLD"

# ── JSON-LD integrity (all blocks parse) ──
echo ""
echo -e "${CYAN}═══ CONTENT ASSERTIONS — JSON-LD${NC}"
assert_jsonld_parses "/vitals/"
assert_present "/vitals/"  "JSON-LD: ThreeDoorsDigest"     "ThreeDoorsDigest"
assert_present "/vitals/"  "JSON-LD: PacemakerAction"       "PacemakerAction"
assert_present "/vitals/"  "JSON-LD: CrisisAlert"           "InstitutionalCrisisAlert"
assert_present "/vitals/"  "JSON-LD: 2 pacemakers"          "2 pacemakers ENGAGED"
assert_present "/vitals/"  "JSON-LD: InstitutionalVitals"   "InstitutionalVitals"

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
