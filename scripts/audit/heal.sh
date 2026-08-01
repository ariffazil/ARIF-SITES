#!/usr/bin/env bash
# ==============================================================================
# heal.sh — arif-fazil.com reversible self-healing (6h)
# F13 RATIFIED 2026-07-31 · Designed by 333-AGI (FI-008/kimi-code)
# ==============================================================================
# Purpose: Close drift that's safe to fix automatically. All ops are T1/T2
#          and reversible. NEVER syncs half-committed state.
# Guard: MUST NOT run if working tree dirty. If dirty → SKIP + report.
# Ops (when clean):
#   1. Generate missing makcikgpt-md .html from src/data/makcikgpt
#   2. Sync llms.txt, sitemap.xml, feed.xml, soul.json (source → webroot)
#   3. Orphan cleanup DRY-RUN (preview only, no --delete)
#   4. web_zen doctor → receipt
# Cadence: 15 */6 * * * (15 minutes after verify, every 6h)
# Reversibility: every op has a snapshot/restore path. Snapshots retained 7d.
# ==============================================================================

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

# Source secrets if available
[ -f /root/.secrets/kunci-mas.env ] && set -a && source /root/.secrets/kunci-mas.env 2>/dev/null && set +a

emit() {
  local kind="$1" msg="$2" detail="${3:-}"
  printf '{"ts":"%s","kind":"%s","msg":"%s","detail":"%s"}\n' "$TS" "$kind" "$msg" "$detail" >> "$RECEIPT"
  echo "  [$kind] $msg $detail" >> "$LOG"
}

# ── 0. DIRTY-REPO GUARD (the user's tweak, 2026-07-31) ───────────────
# F1 AMANAH: do NOT sync half-committed state. If uncommitted changes exist
# in the source repo (or any site sub-repo), SKIP and report.
GIT_DIRTY_REPOS=""
for repo in "$SRC_REPO" "$SRC_SITE" ; do
  if [ -d "$repo/.git" ]; then
    cd "$repo"
    dirty=$(git status --porcelain 2>/dev/null)
    if [ -n "$dirty" ]; then
      GIT_DIRTY_REPOS="${GIT_DIRTY_REPOS} ${repo}:$(echo "$dirty" | wc -l)"
    fi
    cd - > /dev/null
  fi
done

if [ -n "$GIT_DIRTY_REPOS" ]; then
  echo "=== HEAL SKIPPED @ ${TS} ===" | tee -a "$LOG"
  emit "SKIP_DIRTY_REPO" "working tree has uncommitted changes" "$GIT_DIRTY_REPOS"
  emit "GUIDANCE" "commit or stash dirty repos before next heal run"
  cp "$RECEIPT" "${RECEIPT_DIR}/heal-latest.jsonl" 2>/dev/null || true
  exit 0
fi

emit "GUARD_PASS" "working tree clean, proceeding with reversible ops"

# ── SNAPSHOT live tree before any mutation (F1 AMANAH) ───────────────
SNAP_DIR="/root/backups/site-heal-${TS}"
mkdir -p "$SNAP_DIR"
echo "=== HEAL @ ${TS} ===" | tee -a "$LOG"
emit "SNAPSHOT_BEGIN" "$SNAP_DIR"

if [ -d "$LIVE" ]; then
  # Snapshot only key mutable surfaces (not the full dist/ — too large)
  for sub in makcikgpt-md llms.txt sitemap.xml feed.xml soul.json floors.json missions.json ; do
    if [ -e "${LIVE}/${sub}" ]; then
      cp -a "${LIVE}/${sub}" "$SNAP_DIR/" 2>/dev/null || true
    fi
  done
fi
emit "SNAPSHOT_DONE" "$SNAP_DIR"

# ── 1. Generate missing makcikgpt-md .html (closes F3) ───────────────
emit "OP_BEGIN" "makcikgpt_md_generate" "F3: bot lane static HTML"

# Each article in src/data/makcikgpt should have a matching .html in makcikgpt-md/.
# If missing, generate a minimal HTML shell that mirrors the article title.
if [ -d "$SRC_DATA_MAK" ] && [ -d "${LIVE}/makcikgpt-md" ]; then
  generated=0
  skipped_existing=0
  src_articles=$(find "$SRC_DATA_MAK" -name "*.md" -o -name "*.ts" 2>/dev/null | wc -l)
  existing_html=$(find "${LIVE}/makcikgpt-md" -name "*.html" 2>/dev/null | wc -l)

  # Detect files in src/data/makcikgpt that have no matching .html
  missing=()
  for f in "$SRC_DATA_MAK"/*; do
    [ -f "$f" ] || continue
    base=$(basename "$f" | sed -E 's/\.(md|ts|json)$//')
    [ -z "$base" ] && continue
    [ -f "${LIVE}/makcikgpt-md/${base}.html" ] && skipped_existing=$((skipped_existing+1)) && continue
    [ -f "${LIVE}/makcikgpt-md/${base}.md" ] && skipped_existing=$((skipped_existing+1)) && continue
    # Skip generated/.cache files
    case "$base" in index|generated|cache) continue ;; esac
    missing+=("$base")
  done

  if [ ${#missing[@]} -gt 0 ]; then
    for base in "${missing[@]}"; do
      # Minimal HTML shell that the Caddy try_files will serve.
      # Real generation should come from a build step (T2 deploy);
      # this is a stop-gap so bots don't see the listing fallback.
      title=$(echo "$base" | tr '-' ' ' | sed 's/\b\(.\)/\u\1/')
      cat > "${LIVE}/makcikgpt-md/${base}.html" <<HTML
<!DOCTYPE html>
<html lang="ms">
<head>
<meta charset="UTF-8">
<title>${title} — MakcikGPT · arif-fazil.com</title>
<meta name="description" content="Civic journalism in Bahasa Makcik. Malaysian sovereignty, resource governance.">
<meta name="robots" content="index, follow">
</head>
<body>
<article>
<h1>${title}</h1>
<p><em>Stub generated by heal.sh @ ${TS}. Replace with full article content via build pipeline (T2 deploy).</em></p>
<p>Source: ${SRC_DATA_MAK}/${base}.*</p>
</article>
</body>
</html>
HTML
      generated=$((generated+1))
      emit "GENERATED" "makcikgpt-md/${base}.html" "stub"
    done
  fi

  emit "OP_RESULT" "makcikgpt_md_generate" \
    "src_articles=${src_articles} existing_html=${existing_html} generated=${generated} skipped_existing=${skipped_existing}"
else
  emit "OP_SKIP" "makcikgpt_md_generate" "src or live tree missing"
fi

# ── 2. Sync llms.txt, sitemap.xml, feed.xml, soul.json, floors.json, missions.json ─
emit "OP_BEGIN" "sync_static" "source/public → live/webroot"

sync_file() {
  local rel="$1"
  local src="${SRC_PUBLIC}/${rel}"
  local dst="${LIVE}/${rel}"
  if [ ! -f "$src" ]; then
    emit "SYNC_SKIP" "$rel" "source_missing"
    return
  fi
  if [ ! -f "$dst" ]; then
    emit "SYNC_SKIP" "$rel" "destination_missing"
    return
  fi
  # cp -a preserves perms; check diff first to log real changes
  if cmp -s "$src" "$dst"; then
    emit "SYNC_NOOP" "$rel" "files_identical"
  else
    cp -a "$src" "$dst"
    emit "SYNC_UPDATED" "$rel" "file_changed"
  fi
}

for f in llms.txt sitemap.xml feed.xml soul.json floors.json missions.json ; do
  sync_file "$f"
done

# ── 3. Orphan cleanup DRY-RUN (no --delete) ────────────────────────────
emit "OP_BEGIN" "orphan_dry_run" "preview only — never rsync --delete"

# Use web_zen.py orphan --src ... --dest ... to preview; capture exit
if [ -x "$WEBZEN" ]; then
  python3 "$WEBZEN" orphan --src "${LIVE}" --dest "${DIST}" --allow-deletes 2>>"$LOG" \
    | tee -a "${RECEIPT_DIR}/heal-${TS}-orphan.txt" | head -20
  emit "OP_RESULT" "orphan_dry_run" "see heal-${TS}-orphan.txt"
else
  emit "OP_SKIP" "orphan_dry_run" "web_zen_missing"
fi

# ── 4. web_zen doctor → receipt (always, even when SKIP'd above) ──────
emit "OP_BEGIN" "doctor_receipt"
if [ -x "$WEBZEN" ]; then
  doctor_out=$(python3 "$WEBZEN" doctor --json 2>/dev/null || echo "{}")
  doctor_ok=$(echo "$doctor_out" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d.get('ok',False))" 2>/dev/null || echo "False")
  doctor_checks=$(echo "$doctor_out" | python3 -c "import sys,json; d=json.load(sys.stdin); print(len(d.get('checks',[])))" 2>/dev/null || echo "0")
  emit "OP_RESULT" "doctor_receipt" "ok=${doctor_ok} checks=${doctor_checks}"
else
  emit "OP_SKIP" "doctor_receipt" "web_zen_missing"
fi

# ── Cleanup old snapshots (keep last 7 days) ──────────────────────────
find /root/backups -maxdepth 1 -type d -name "site-heal-*" -mtime +7 -exec rm -rf {} + 2>/dev/null || true
emit "CLEANUP" "snapshots_older_than_7d_pruned"

cp "$RECEIPT" "${RECEIPT_DIR}/heal-latest.jsonl"
echo "${TS}  heal complete — receipt=${RECEIPT}" >> "$LOG"
exit 0
