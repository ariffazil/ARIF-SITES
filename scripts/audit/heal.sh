#!/usr/bin/env bash
# heal.sh — scheduled audit proposal (OBSERVE/PROPOSE only)
# The cron path is deliberately fail-closed: repairs are authorized only by A-FORGE.
set -uo pipefail
umask 077

RECEIPT_DIR="/root/forge_work/site-audit/heal"
mkdir -p "$RECEIPT_DIR"
TS=$(date -u +%Y%m%dT%H%M%SZ)
RECEIPT="${RECEIPT_DIR}/heal-${TS}.jsonl"
LOG="${RECEIPT_DIR}/heal.log"
WEBZEN="/root/arif-fazil.com/scripts/web-zen/web_zen.py"
SRC_REPO="/root/arif-fazil.com"
SRC_SITE="${SRC_REPO}/sites/arif-fazil.com"
SRC_PUBLIC="${SRC_SITE}/public"
SRC_DATA_MAK="${SRC_SITE}/src/data/makcikgpt"
DIST="${SRC_SITE}/dist"
LIVE="/var/www/html/arif"

emit() {
  local kind="$1" msg="$2" detail="${3:-}"
  printf '{"ts":"%s","kind":"%s","msg":"%s","detail":"%s"}\n' "$TS" "$kind" "$msg" "$detail" >> "$RECEIPT"
  printf '  [%s] %s %s\n' "$kind" "$msg" "$detail" >> "$LOG"
}

# Preserve the half-committed-state guard. It is a proposal guard, not an apply gate.
GIT_DIRTY_REPOS=""
for repo in "$SRC_REPO" "$SRC_SITE"; do
  if [ -d "$repo/.git" ]; then
    dirty=$(git -C "$repo" status --porcelain 2>/dev/null)
    [ -n "$dirty" ] && GIT_DIRTY_REPOS="${GIT_DIRTY_REPOS} ${repo}:$(printf '%s\n' "$dirty" | wc -l)"
  fi
done
if [ -n "$GIT_DIRTY_REPOS" ]; then
  emit "SKIP_DIRTY_REPO" "working tree has uncommitted changes" "$GIT_DIRTY_REPOS"
  emit "GUIDANCE" "commit or stash dirty repos before the next proposal"
  cp "$RECEIPT" "${RECEIPT_DIR}/heal-latest.jsonl" 2>/dev/null || true
  exit 0
fi

emit "GUARD_PASS" "working tree clean; proposal only, no repair authority"
emit "POLICY" "OBSERVE_PROPOSE_ONLY" "A-FORGE must review and apply any repair"

# Compare only; never create snapshots or write to source/live/backups.
for rel in llms.txt sitemap.xml feed.xml soul.json floors.json missions.json; do
  src="${SRC_PUBLIC}/${rel}"; dst="${LIVE}/${rel}"
  if [ ! -f "$src" ]; then emit "PROPOSAL_SKIP" "$rel" "source_missing"
  elif [ ! -f "$dst" ]; then emit "PROPOSAL" "$rel" "live_missing; A-FORGE review required"
  elif cmp -s "$src" "$dst"; then emit "OBSERVE_NOOP" "$rel" "identical"
  else emit "PROPOSAL" "$rel" "drift; source_to_live review required"
  fi
done

if [ -d "$SRC_DATA_MAK" ] && [ -d "${LIVE}/makcikgpt-md" ]; then
  for f in "$SRC_DATA_MAK"/*; do
    [ -f "$f" ] || continue
    base=$(basename "$f" | sed -E 's/\.(md|ts|json)$//')
    [ -z "$base" ] && continue
    case "$base" in index|generated|cache) continue ;; esac
    if [ ! -f "${LIVE}/makcikgpt-md/${base}.html" ] && [ ! -f "${LIVE}/makcikgpt-md/${base}.md" ]; then
      emit "PROPOSAL" "makcikgpt-md/${base}.html" "missing; build/A-FORGE review required"
    fi
  done
else
  emit "PROPOSAL_SKIP" "makcikgpt_md_generate" "source or live tree missing"
fi

emit "OP_BEGIN" "orphan_dry_run" "preview only; no delete authority"
if [ -f "$WEBZEN" ]; then
  python3 "$WEBZEN" orphan --src "$LIVE" --dest "$DIST" --allow-deletes 2>>"$LOG" \
    | tee -a "${RECEIPT_DIR}/heal-${TS}-orphan.txt" | head -20 || true
else
  emit "OP_SKIP" "orphan_dry_run" "web_zen_missing"
fi

emit "OP_BEGIN" "doctor_receipt"
if [ -f "$WEBZEN" ]; then
  doctor_out=$(python3 "$WEBZEN" doctor --json 2>/dev/null || echo "{}")
  doctor_ok=$(printf '%s' "$doctor_out" | python3 -c 'import sys,json; print(json.load(sys.stdin).get("ok",False))' 2>/dev/null || echo False)
  doctor_checks=$(printf '%s' "$doctor_out" | python3 -c 'import sys,json; print(len(json.load(sys.stdin).get("checks",[])))' 2>/dev/null || echo 0)
  emit "OP_RESULT" "doctor_receipt" "ok=${doctor_ok} checks=${doctor_checks}"
else emit "OP_SKIP" "doctor_receipt" "web_zen_missing"; fi

emit "CLEANUP_SKIPPED" "snapshot pruning disabled; scheduled path cannot delete backups"
cp "$RECEIPT" "${RECEIPT_DIR}/heal-latest.jsonl" 2>/dev/null || true
printf '%s  proposal complete — receipt=%s\n' "$TS" "$RECEIPT" >> "$LOG"
exit 0
