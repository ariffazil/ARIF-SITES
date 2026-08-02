#!/bin/bash
# ═══════════════════════════════════════════════════════════════════════════════
# Komda Color Lint — SOVEREIGN DECREES §04.4
#
# Purpose: Scan HTML/SVG/CSS for foreign-family color tokens in territory DOMs.
#          Per SOVEREIGN_DECREES §04.1 ("foreign-family color in territory DOM
#          is a violation").
#
# Usage:
#   ./lint-komda-colors.sh <scan-path>            # default: --warn-only
#   ./lint-komda-colors.sh <scan-path> --gate     # exit 1 on violation
#   FORCE_KOMDA_GATE=1 ./lint-komda-colors.sh .   # env-var gate
#
# Output:
#   stdout: human-readable violations + summary
#   exit:   0=clean, 1=violations (gate mode) or 0=warn-only
#
# Doctrine:        /root/docs/design-rules/SOVEREIGN_DECREES.md §04
# Registry:        /root/arif-fazil.com/data/family-colors.yaml
# Reversibility:   F1 — script content is freely editable; doctrine is F13.
# ═══════════════════════════════════════════════════════════════════════════════

set -uo pipefail

SCAN_PATH="${1:-.}"
MODE="${2:---warn-only}"

# ── Territory → allowed color tokens ────────────────────────────────────────
# Closed family + bridges + universal field. Sync with family-colors.yaml.
declare -A ALLOWED=(
    [arifos]="#a82733 #6f2dbd #0a0a0f #ffd54f"
    [geox]="#2d5f8b #8b4513 #0a0a0f #ffd54f"
    [wealth]="#ffcc00 #1e3a8a #0a0a0f #ffd54f"
    [well]="#5fb84a #e07a5f #0a0a0f"
    [aaa]="#9a9aa8 #ffd54f #0a0a0f"
)

if [[ ! -d "$SCAN_PATH" ]]; then
    echo "⚠️  scan path not found: $SCAN_PATH — skipping lint"
    exit 0
fi

violations=0
scanned=0

# ── Scan HTML / SVG / CSS files ──────────────────────────────────────────────
while IFS= read -r -d '' file; do
    scanned=$((scanned + 1))
    fname=$(basename "$file")

    # Detect territory from filename patterns
    territory=""
    for t in arifos geox wealth well aaa; do
        case "$fname" in
            ${t}-*|*-${t}-*|${t}.*|*_${t}.*|*${t}*)
                territory="$t"
                break
                ;;
        esac
    done

    [[ -z "$territory" ]] && continue

    allowed="${ALLOWED[$territory]}"

    # Find hex colors in file
    while IFS= read -r color; do
        [[ -z "$color" ]] && continue

        # Normalize 3-digit to 6-digit
        if [[ ${#color} -eq 4 ]]; then
            r="${color:1:1}"; g="${color:2:1}"; b="${color:3:1}"
            normalized="#${r}${r}${g}${g}${b}${b}"
        else
            normalized="$color"
        fi

        # Lowercase
        norm_lower=$(echo "$normalized" | tr '[:upper:]' '[:lower:]')

        # Check against allowed set (glob match — # treated as literal)
        if [[ " $allowed " != *" $norm_lower "* ]]; then
            violations=$((violations + 1))
            echo "❌ ${file}[${territory}]: foreign-family color ${color} (allowed: ${allowed})"
        fi
    done < <(grep -ohE "#[0-9a-fA-F]{3,6}" "$file" 2>/dev/null | sort -u || true)

done < <(find "$SCAN_PATH" -type f \( -name "*.html" -o -name "*.svg" -o -name "*.css" \) -not -path "*.bak.*" -print0 2>/dev/null)

# ── Verdict ──────────────────────────────────────────────────────────────────
if [[ $violations -gt 0 ]]; then
    echo ""
    echo "Komda lint: ${violations} violation(s) across ${scanned} file(s) in ${SCAN_PATH}"
    if [[ "$MODE" == "--gate" ]] || [[ "${FORCE_KOMDA_GATE:-0}" == "1" ]]; then
        echo "MODE=gate → exiting 1"
        exit 1
    fi
    echo "MODE=warn-only — non-blocking lint"
    exit 0
fi

echo "Komda lint: ${scanned} file(s) scanned, 0 violations in ${SCAN_PATH}"
exit 0
