#!/usr/bin/env bash
# Atomic, registry-governed VPS deployment for one arif-sites surface.
# Default mode is a read-only dry run. Builds run only in isolated temporary copies.

set -euo pipefail

CANONICAL_REPO_ROOT="/root/ARIF-SITES"
RAW_SCRIPT_PATH="${BASH_SOURCE[0]}"
if [[ "$RAW_SCRIPT_PATH" == *"/arif-sites/"* && "$RAW_SCRIPT_PATH" != *"/ARIF-SITES/"* ]] || [[ "${PWD:-}" == *"/arif-sites" && "${PWD:-}" != *"/ARIF-SITES"* ]]; then
  echo "WARNING: lowercase /root/arif-sites is deprecated — canonical repo is $CANONICAL_REPO_ROOT" >&2
  echo "Continuing with lowercase path for backward compat…" >&2
fi

REPO_ROOT="$(cd "$(dirname "$RAW_SCRIPT_PATH")/.." && pwd -P)"
if [[ "$REPO_ROOT" != "$CANONICAL_REPO_ROOT" ]]; then
  echo "ERROR: deploy-site.sh must run from canonical repository $CANONICAL_REPO_ROOT (resolved $REPO_ROOT)" >&2
  exit 2
fi

REGISTRY="${ARIF_SITES_OVERLAY_REGISTRY:-$REPO_ROOT/infra/runtime-overlays.json}"
HTML_ROOT="${ARIF_SITES_HTML_ROOT:-/var/www/html}"
ARCHIVE_BASE="${ARIF_SITES_ARCHIVE_ROOT:-/root/forge_work/deployments}"
STAGING_ROOT="${ARIF_SITES_STAGING_ROOT:-$(dirname "$HTML_ROOT")/.arif-sites-staging}"
BUILD_TMP_ROOT="${ARIF_SITES_BUILD_TMP_ROOT:-${TMPDIR:-/tmp}}"
CADDYFILE="${ARIF_SITES_CADDYFILE:-/etc/caddy/Caddyfile}"
CADDY_BIN="${ARIF_SITES_CADDY_BIN:-caddy}"
CURL_BIN="${ARIF_SITES_CURL_BIN:-curl}"
WEB_OWNER="${ARIF_SITES_WEB_OWNER:-www-data:www-data}"
SKIP_CHOWN="${ARIF_SITES_SKIP_CHOWN:-0}"

usage() {
  cat >&2 <<'USAGE'
Usage:
  scripts/deploy-site.sh <site> [--dry-run]       # default; no mutation
  scripts/deploy-site.sh <site> --validate-build  # isolated build, then cleanup
  scripts/deploy-site.sh <site> --apply            # deploy, verify, receipt
  scripts/deploy-site.sh <site> --restore <tag>    # restore archived previous tree
USAGE
}

SITE_NAME="${1:-}"
[[ -n "$SITE_NAME" ]] || { usage; exit 2; }
shift

MODE="dry-run"
RESTORE_TAG=""
MODE_SEEN=0
while (($#)); do
  case "$1" in
    --dry-run)
      ((MODE_SEEN == 0)) || { echo "ERROR: select exactly one mode" >&2; exit 2; }
      MODE="dry-run"
      MODE_SEEN=1
      shift
      ;;
    --validate-build)
      ((MODE_SEEN == 0)) || { echo "ERROR: select exactly one mode" >&2; exit 2; }
      MODE="validate-build"
      MODE_SEEN=1
      shift
      ;;
    --apply)
      ((MODE_SEEN == 0)) || { echo "ERROR: select exactly one mode" >&2; exit 2; }
      MODE="apply"
      MODE_SEEN=1
      shift
      ;;
    --restore)
      ((MODE_SEEN == 0)) || { echo "ERROR: select exactly one mode" >&2; exit 2; }
      [[ $# -ge 2 ]] || { echo "ERROR: --restore requires a backup tag" >&2; exit 2; }
      MODE="restore"
      RESTORE_TAG="$2"
      MODE_SEEN=1
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "ERROR: unknown argument: $1" >&2
      usage
      exit 2
      ;;
  esac
done

LOG_PREFIX="[deploy:${SITE_NAME}]"
LOG_FILE=""
log() {
  local line
  line="$LOG_PREFIX $*"
  if [[ -n "$LOG_FILE" ]]; then
    printf '%s\n' "$line" | tee -a "$LOG_FILE" >&2
  else
    printf '%s\n' "$line" >&2
  fi
}
die() {
  log "ERROR: $*"
  exit 1
}

command -v jq >/dev/null 2>&1 || die "jq is required"
command -v rsync >/dev/null 2>&1 || die "rsync is required"
[[ -f "$REGISTRY" ]] || die "overlay registry not found: $REGISTRY"

validate_registry() {
  jq -e '
    (.schema_version == 1 or .schema_version == 2) and
    (.canonical_repo_root == "/root/arif-sites" or .canonical_repo_root == "/root/ARIF-SITES") and
    (.sites | type == "array" and length > 0) and
    (all(.sites[];
      (.site | type == "string" and test("^[a-z0-9._-]+$")) and
      (.source | type == "string" and length > 0 and (startswith("/") | not) and (test("(^|/)\\.\\.(/|$)") | not)) and
      (.webroot | type == "string" and test("^[a-z0-9_-]+$")) and
      (.owner | type == "string" and length > 0) and
      (.batch | type == "boolean") and
      (.batch_order | type == "number") and
      (.required_artifacts | type == "array") and
      (all(.required_artifacts[]; type == "string" and length > 0 and (startswith("/") | not) and (test("(^|/)\\.\\.(/|$)") | not))) and
      (.probe.url | type == "string" and startswith("https://")) and
      (.probe.accepted_codes | type == "array" and length > 0 and all(.[]; type == "number")) and
      (.overlays | type == "array") and
      (all(.overlays[];
        (.path | type == "string" and length > 0 and (startswith("/") | not) and (test("(^|/)\\.\\.(/|$)") | not)) and
        (.owner | type == "string" and length > 0) and
        (.strategy == "preserve-live" or .strategy == "merge-source-wins")
      )) and
      ((.build // null) == null or (
        (.build.kind | type == "string") and
        (.build.command | type == "array" and length > 0 and all(.[]; type == "string" and length > 0)) and
        (.build.output | type == "string" and length > 0 and (startswith("/") | not) and (test("(^|/)\\.\\.(/|$)") | not))
      ))
    )) and
    (([.sites[].site] | length) == ([.sites[].site] | unique | length)) and
    (([.sites[].webroot] | length) == ([.sites[].webroot] | unique | length)) and
    (all(.sites[]; (([.overlays[].path] | length) == ([.overlays[].path] | unique | length))))
  ' "$REGISTRY" >/dev/null || die "invalid or ambiguous runtime overlay registry: $REGISTRY"
}
validate_registry

MATCH_COUNT="$(jq --arg site "$SITE_NAME" '[.sites[] | select(.site == $site)] | length' "$REGISTRY")"
if [[ "$MATCH_COUNT" != "1" ]]; then
  die "unknown or ambiguously owned site '$SITE_NAME' (registry matches: $MATCH_COUNT)"
fi
ENTRY="$(jq -ce --arg site "$SITE_NAME" '.sites[] | select(.site == $site)' "$REGISTRY")"
SOURCE_REL="$(jq -r '.source' <<<"$ENTRY")"
WEBROOT_NAME="$(jq -r '.webroot' <<<"$ENTRY")"
SITE_OWNER="$(jq -r '.owner' <<<"$ENTRY")"
SOURCE_DIR="$REPO_ROOT/$SOURCE_REL"
WEBROOT="$HTML_ROOT/$WEBROOT_NAME"
ARCHIVE_ROOT="$ARCHIVE_BASE/$SITE_NAME"
PROBE_URL="$(jq -r '.probe.url' <<<"$ENTRY")"
PROBE_ATTEMPTS="${ARIF_SITES_PROBE_ATTEMPTS:-$(jq -r '.defaults.probe_attempts' "$REGISTRY")}"
CADDY_ATTEMPTS="${ARIF_SITES_CADDY_ATTEMPTS:-$(jq -r '.defaults.caddy_attempts' "$REGISTRY")}"
RETRY_DELAY="${ARIF_SITES_RETRY_DELAY:-$(jq -r '.defaults.retry_delay_seconds' "$REGISTRY")}"

for numeric_value in "$PROBE_ATTEMPTS" "$CADDY_ATTEMPTS"; do
  [[ "$numeric_value" =~ ^[1-9][0-9]*$ ]] || die "retry attempts must be positive integers"
done
[[ "$RETRY_DELAY" =~ ^[0-9]+([.][0-9]+)?$ ]] || die "retry delay must be non-negative"

SOURCE_REAL="$(realpath -m "$SOURCE_DIR")"
case "$SOURCE_REAL/" in
  "$REPO_ROOT"/*) ;;
  *) die "source escapes canonical repository: $SOURCE_DIR" ;;
esac

HTML_ROOT="$(realpath -m "$HTML_ROOT")"
ARCHIVE_BASE="$(realpath -m "$ARCHIVE_BASE")"
STAGING_ROOT="$(realpath -m "$STAGING_ROOT")"
BUILD_TMP_ROOT="$(realpath -m "$BUILD_TMP_ROOT")"
WEBROOT="$HTML_ROOT/$WEBROOT_NAME"
ARCHIVE_ROOT="$ARCHIVE_BASE/$SITE_NAME"
case "$STAGING_ROOT/" in
  "$HTML_ROOT/"*) die "staging root must not be inside the Caddy webroot: $STAGING_ROOT" ;;
esac
case "$BUILD_TMP_ROOT/" in
  "$HTML_ROOT/"*) die "build temp root must not be inside the Caddy webroot: $BUILD_TMP_ROOT" ;;
esac
case "$ARCHIVE_BASE/" in
  "$HTML_ROOT/"*) die "archive root must not be inside the Caddy webroot: $ARCHIVE_BASE" ;;
esac

mapfile -t OVERLAY_PATHS < <(jq -r '.overlays[].path' <<<"$ENTRY")
mapfile -t OVERLAY_OWNERS < <(jq -r '.overlays[].owner' <<<"$ENTRY")
mapfile -t OVERLAY_STRATEGIES < <(jq -r '.overlays[].strategy' <<<"$ENTRY")
mapfile -t REQUIRED_ARTIFACTS < <(jq -r '.required_artifacts[]' <<<"$ENTRY")

for ((i = 0; i < ${#OVERLAY_PATHS[@]}; i++)); do
  for ((j = i + 1; j < ${#OVERLAY_PATHS[@]}; j++)); do
    left="${OVERLAY_PATHS[$i]}"
    right="${OVERLAY_PATHS[$j]}"
    if [[ "$left" == "$right"/* || "$right" == "$left"/* ]]; then
      die "ambiguous overlay ownership: '$left' (${OVERLAY_OWNERS[$i]}) overlaps '$right' (${OVERLAY_OWNERS[$j]})"
    fi
  done
done

TEMP_DIRS=()
SWAP_ACTIVE=0
OLD_STAGE=""
DEPLOY_DIR=""
TS=""

safe_remove_temp() {
  local path="$1"
  [[ -e "$path" || -L "$path" ]] || return 0
  case "$path/" in
    "$BUILD_TMP_ROOT"/*|"$STAGING_ROOT"/*) ;;
    *) log "refusing cleanup outside temporary roots: $path"; return 1 ;;
  esac
  find -P "$path" -depth -delete
}

emergency_rollback() {
  local failed_stage
  ((SWAP_ACTIVE == 1)) || return 0
  set +e
  failed_stage="$STAGING_ROOT/${WEBROOT_NAME}.failed-unexpected.${TS}.$$"
  if [[ -e "$WEBROOT" || -L "$WEBROOT" ]]; then
    mv -- "$WEBROOT" "$failed_stage"
  fi
  if [[ -n "$OLD_STAGE" && ( -e "$OLD_STAGE" || -L "$OLD_STAGE" ) ]]; then
    mv -- "$OLD_STAGE" "$WEBROOT"
  fi
  if [[ -n "$DEPLOY_DIR" && ( -e "$failed_stage" || -L "$failed_stage" ) ]]; then
    mv -- "$failed_stage" "$DEPLOY_DIR/failed-unexpected" 2>/dev/null || true
  fi
  SWAP_ACTIVE=0
  set -e
}

on_exit() {
  local status=$?
  set +e
  if ((status != 0)); then
    emergency_rollback
  fi
  for path in "${TEMP_DIRS[@]:-}"; do
    [[ -n "$path" ]] && safe_remove_temp "$path"
  done
  exit "$status"
}
trap on_exit EXIT

copy_path() {
  local from_root="$1"
  local to_root="$2"
  local rel="$3"
  local source_path="$from_root/$rel"
  local target_path="$to_root/$rel"

  [[ -e "$source_path" || -L "$source_path" ]] || return 1
  mkdir -p "$(dirname "$target_path")"
  if [[ -d "$source_path" && ! -L "$source_path" ]]; then
    mkdir -p "$target_path"
    rsync -a "$source_path/" "$target_path/"
  else
    cp -a -- "$source_path" "$target_path"
  fi
}

validate_artifacts() {
  local root="$1"
  local artifact
  for artifact in "${REQUIRED_ARTIFACTS[@]}"; do
    [[ -e "$root/$artifact" || -L "$root/$artifact" ]] || die "required artifact missing: $root/$artifact"
  done
}

run_build_command() {
  local cwd="$1"
  shift
  if [[ -n "$LOG_FILE" ]]; then
    (cd "$cwd" && "$@") 2>&1 | tee -a "$LOG_FILE"
  else
    (cd "$cwd" && "$@")
  fi
}

DEPLOY_SOURCE="$SOURCE_DIR"
BUILD_WORK=""
prepare_build() {
  local build_kind build_output version_expected version_output marker_path marker_text
  local -a install_command build_command version_command

  if ! jq -e '.build != null' <<<"$ENTRY" >/dev/null; then
    DEPLOY_SOURCE="$SOURCE_DIR"
    validate_artifacts "$DEPLOY_SOURCE"
    return 0
  fi

  mkdir -p "$BUILD_TMP_ROOT"
  BUILD_WORK="$(mktemp -d "$BUILD_TMP_ROOT/arif-sites-build.${SITE_NAME}.XXXXXX")"
  TEMP_DIRS+=("$BUILD_WORK")
  mkdir -p "$BUILD_WORK/source"
  build_output="$(jq -r '.build.output' <<<"$ENTRY")"
  rsync -a --delete \
    --exclude='/node_modules' \
    --exclude="/$build_output" \
    --exclude='/.git' \
    "$SOURCE_DIR/" "$BUILD_WORK/source/"

  build_kind="$(jq -r '.build.kind' <<<"$ENTRY")"
  if [[ "$build_kind" == "npm" ]]; then
    [[ -f "$BUILD_WORK/source/package-lock.json" ]] || die "npm build requires a pinned package-lock.json"
  fi

  if jq -e '.build.pinned == true' <<<"$ENTRY" >/dev/null; then
    mapfile -t version_command < <(jq -r '.build.version_command[]' <<<"$ENTRY")
    version_expected="$(jq -r '.build.version_contains' <<<"$ENTRY")"
    ((${#version_command[@]} > 0)) || die "pinned build is missing version_command"
    if ! version_output="$(cd "$BUILD_WORK/source" && "${version_command[@]}" 2>&1)"; then
      die "pinned build tool is unavailable: ${version_command[*]}"
    fi
    [[ "$version_output" == *"$version_expected"* ]] || die "pinned build version mismatch: expected '$version_expected', got '$version_output'"
  fi

  if jq -e '.build.install != null' <<<"$ENTRY" >/dev/null; then
    mapfile -t install_command < <(jq -r '.build.install[]' <<<"$ENTRY")
    log "running isolated dependency install for $SITE_NAME"
    run_build_command "$BUILD_WORK/source" "${install_command[@]}" || die "isolated dependency install failed"
  fi

  mapfile -t build_command < <(jq -r '.build.command[]' <<<"$ENTRY")
  log "running isolated $build_kind build for $SITE_NAME"
  run_build_command "$BUILD_WORK/source" "${build_command[@]}" || die "isolated build failed"

  DEPLOY_SOURCE="$BUILD_WORK/source/$build_output"
  [[ -d "$DEPLOY_SOURCE" ]] || die "build succeeded without output directory: $DEPLOY_SOURCE"
  validate_artifacts "$DEPLOY_SOURCE"

  while IFS=$'\t' read -r marker_path marker_text; do
    [[ -n "$marker_path" ]] || continue
    [[ -f "$DEPLOY_SOURCE/$marker_path" ]] || die "pinned build marker file missing: $marker_path"
    grep -Fq -- "$marker_text" "$DEPLOY_SOURCE/$marker_path" || die "pinned build marker mismatch in $marker_path"
  done < <(jq -r '.build.output_markers[]? | [.path, .contains] | @tsv' <<<"$ENTRY")
}

stage_tree() {
  local source_root="$1"
  local current_root="$2"
  local target_root="$3"
  local restore_overlays="$4"
  local -a rsync_args=(-a --delete)
  local rel strategy owner

  for rel in "${OVERLAY_PATHS[@]}"; do
    rsync_args+=("--exclude=/$rel")
  done
  rsync "${rsync_args[@]}" "$source_root/" "$target_root/"

  if [[ "$SKIP_CHOWN" != "1" ]]; then
    chown -R "$WEB_OWNER" "$target_root"
  fi

  for ((i = 0; i < ${#OVERLAY_PATHS[@]}; i++)); do
    rel="${OVERLAY_PATHS[$i]}"
    owner="${OVERLAY_OWNERS[$i]}"
    strategy="${OVERLAY_STRATEGIES[$i]}"
    if [[ -d "$current_root" ]] && copy_path "$current_root" "$target_root" "$rel"; then
      log "preserved overlay $rel (owner=$owner, strategy=$strategy)"
    fi
    if [[ "$restore_overlays" != "1" && "$strategy" == "merge-source-wins" ]]; then
      copy_path "$source_root" "$target_root" "$rel" || true
    fi
  done
  validate_artifacts "$target_root"
}

hash_tree() {
  local root="$1"
  find "$root" -type f -print0 \
    | sort -z \
    | xargs -0 sha256sum 2>/dev/null \
    | sha256sum \
    | cut -c1-16
}

retry_command() {
  local description="$1"
  local attempts="$2"
  local delay="$3"
  shift 3
  local attempt
  for ((attempt = 1; attempt <= attempts; attempt++)); do
    if "$@"; then
      return 0
    fi
    log "$description failed (attempt $attempt/$attempts)"
    if ((attempt < attempts)) && [[ "$delay" != "0" ]]; then
      sleep "$delay"
    fi
  done
  return 1
}

LAST_PROBE_CODE="not_run"
probe_once() {
  local code
  if ! code="$("$CURL_BIN" -sS -o /dev/null -w '%{http_code}' --max-time 10 "$PROBE_URL")"; then
    LAST_PROBE_CODE="000"
    return 1
  fi
  LAST_PROBE_CODE="$code"
  jq -e --argjson code "$code" '.probe.accepted_codes | index($code) != null' <<<"$ENTRY" >/dev/null
}

write_build_info() {
  local target="$1"
  local build_hash="$2"
  local source_commit="$3"
  local output="$target/build-info.json"
  local tmp="$target/.build-info.json.tmp.$$"
  jq -n \
    --arg built_at "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    --arg surface "$SITE_NAME" \
    --arg deploy_tag "$TS" \
    --arg source_commit "$source_commit" \
    --arg build_hash "$build_hash" \
    '{
      built_at: $built_at,
      surface: $surface,
      deployed_by: "scripts/deploy-site.sh",
      deploy_tag: $deploy_tag,
      source_commit: $source_commit,
      build_hash: $build_hash
    }' >"$tmp"
  jq -e . "$tmp" >/dev/null
  mv -- "$tmp" "$output"
  if [[ "$SKIP_CHOWN" != "1" ]]; then
    chown "$WEB_OWNER" "$output"
  fi
}

RECEIPT=""
write_receipt() {
  local status="$1"
  local probe_ok="$2"
  local caddy_ok="$3"
  local build_hash="$4"
  local source_commit="$5"
  local backup_path="$6"
  local reason="$7"
  local tmp="$RECEIPT.tmp.$$"
  local overlays_json
  overlays_json="$(jq -c '[.overlays[] | {path, owner, strategy}]' <<<"$ENTRY")"
  jq -n \
    --arg schema "arif-sites.deploy-receipt.v1" \
    --arg site "$SITE_NAME" \
    --arg owner "$SITE_OWNER" \
    --arg mode "$MODE" \
    --arg webroot "$WEBROOT" \
    --arg deploy_tag "$TS" \
    --arg status "$status" \
    --arg source_commit "$source_commit" \
    --arg build_hash "$build_hash" \
    --arg backup_path "$backup_path" \
    --arg probe_url "$PROBE_URL" \
    --arg probe_code "$LAST_PROBE_CODE" \
    --arg reason "$reason" \
    --argjson probe_ok "$probe_ok" \
    --argjson caddy_ok "$caddy_ok" \
    --argjson overlays "$overlays_json" \
    '{
      schema: $schema,
      site: $site,
      owner: $owner,
      mode: $mode,
      webroot: $webroot,
      deploy_tag: $deploy_tag,
      status: $status,
      source_commit: $source_commit,
      build_hash: $build_hash,
      backup_path: $backup_path,
      overlays: $overlays,
      caddy: {ok: $caddy_ok},
      probe: {url: $probe_url, code: $probe_code, ok: $probe_ok},
      reason: $reason
    }' >"$tmp"
  jq -e . "$tmp" >/dev/null
  mv -- "$tmp" "$RECEIPT"
}

rollback_after_failure() {
  local reason="$1"
  local status="$2"
  local build_hash="$3"
  local source_commit="$4"
  local caddy_ok="$5"
  local probe_ok="$6"
  local failed_stage="$STAGING_ROOT/${WEBROOT_NAME}.failed.${TS}.$$"

  if [[ -e "$WEBROOT" || -L "$WEBROOT" ]]; then
    if ! mv -- "$WEBROOT" "$failed_stage"; then
      log "rollback could not move failed live tree out of $WEBROOT"
      return 2
    fi
  fi
  if [[ -n "$OLD_STAGE" && ( -e "$OLD_STAGE" || -L "$OLD_STAGE" ) ]]; then
    if ! mv -- "$OLD_STAGE" "$WEBROOT"; then
      log "rollback could not restore prior tree from $OLD_STAGE"
      return 2
    fi
  fi
  SWAP_ACTIVE=0
  if ! retry_command "Caddy reload after rollback" "$CADDY_ATTEMPTS" "$RETRY_DELAY" \
    "$CADDY_BIN" reload --config "$CADDYFILE" >/dev/null 2>&1; then
    log "Caddy reload also failed after filesystem rollback"
  fi
  if [[ -e "$failed_stage" || -L "$failed_stage" ]]; then
    mv -- "$failed_stage" "$DEPLOY_DIR/failed" 2>/dev/null || log "failed tree retained outside webroot: $failed_stage"
  fi
  if ! write_receipt "$status" "$probe_ok" "$caddy_ok" "$build_hash" "$source_commit" "$DEPLOY_DIR/previous" "$reason"; then
    log "rollback completed but receipt creation failed"
    return 2
  fi
  log "deployment failed closed: $reason; receipt=$RECEIPT"
  return 1
}

[[ -d "$SOURCE_DIR" ]] || die "source not found: $SOURCE_DIR"

if [[ "$MODE" == "dry-run" ]]; then
  if jq -e '.build == null' <<<"$ENTRY" >/dev/null; then
    validate_artifacts "$SOURCE_DIR"
  elif [[ "$(jq -r '.build.kind' <<<"$ENTRY")" == "npm" && ! -f "$SOURCE_DIR/package-lock.json" ]]; then
    die "npm build requires a pinned package-lock.json"
  fi
  jq -n \
    --arg mode "$MODE" \
    --arg site "$SITE_NAME" \
    --arg source "$SOURCE_DIR" \
    --arg webroot "$WEBROOT" \
    --arg owner "$SITE_OWNER" \
    --arg registry "$REGISTRY" \
    --argjson build "$(jq -c '.build // null' <<<"$ENTRY")" \
    --argjson overlays "$(jq -c '[.overlays[] | {path, owner, strategy}]' <<<"$ENTRY")" \
    '{mode: $mode, site: $site, source: $source, webroot: $webroot, owner: $owner, registry: $registry, build: $build, overlays: $overlays, mutation: false}'
  exit 0
fi

if [[ "$MODE" == "validate-build" ]]; then
  prepare_build
  log "isolated build validation passed; temporary copy will be removed"
  exit 0
fi

TS="$(date -u +%Y%m%dT%H%M%S%NZ)"
DEPLOY_DIR="$ARCHIVE_ROOT/$TS"
mkdir -p "$DEPLOY_DIR" "$STAGING_ROOT"
LOG_FILE="$DEPLOY_DIR/deploy.log"
RECEIPT="$DEPLOY_DIR/receipt.json"
: >"$LOG_FILE"

if [[ "$MODE" == "restore" ]]; then
  [[ "$RESTORE_TAG" =~ ^[A-Za-z0-9._-]+$ ]] || die "invalid restore tag: $RESTORE_TAG"
  DEPLOY_SOURCE="$ARCHIVE_ROOT/$RESTORE_TAG/previous"
  [[ -d "$DEPLOY_SOURCE" ]] || die "backup not found: $DEPLOY_SOURCE"
  validate_artifacts "$DEPLOY_SOURCE"
  RESTORE_OVERLAYS=1
else
  prepare_build
  RESTORE_OVERLAYS=0
fi

SOURCE_COMMIT="$(git -C "$REPO_ROOT" rev-parse --short HEAD 2>/dev/null || printf 'no-git')"
BUILD_HASH="$(hash_tree "$DEPLOY_SOURCE")"

if ! retry_command "Caddy validation" "$CADDY_ATTEMPTS" "$RETRY_DELAY" \
  "$CADDY_BIN" validate --config "$CADDYFILE"; then
  LAST_PROBE_CODE="not_run"
  write_receipt "failed_pre_swap" false false "$BUILD_HASH" "$SOURCE_COMMIT" "" "Caddy validation failed"
  die "Caddy validation failed closed; no swap performed"
fi

NEW_STAGE="$(mktemp -d "$STAGING_ROOT/${WEBROOT_NAME}.new.${TS}.XXXXXX")"
TEMP_DIRS+=("$NEW_STAGE")
stage_tree "$DEPLOY_SOURCE" "$WEBROOT" "$NEW_STAGE" "$RESTORE_OVERLAYS"
write_build_info "$NEW_STAGE" "$BUILD_HASH" "$SOURCE_COMMIT"

OLD_STAGE="$STAGING_ROOT/${WEBROOT_NAME}.old.${TS}.$$"
if [[ -e "$WEBROOT" || -L "$WEBROOT" ]]; then
  mv -- "$WEBROOT" "$OLD_STAGE"
fi
mv -- "$NEW_STAGE" "$WEBROOT"
SWAP_ACTIVE=1

if ! retry_command "Caddy reload" "$CADDY_ATTEMPTS" "$RETRY_DELAY" \
  "$CADDY_BIN" reload --config "$CADDYFILE"; then
  rollback_after_failure "Caddy reload failed" "rolled_back" "$BUILD_HASH" "$SOURCE_COMMIT" false false || exit 1
fi

if ! retry_command "site probe" "$PROBE_ATTEMPTS" "$RETRY_DELAY" probe_once; then
  rollback_after_failure "probe failed after retries (last code $LAST_PROBE_CODE)" "rolled_back" "$BUILD_HASH" "$SOURCE_COMMIT" true false || exit 1
fi

# Post-deploy hook (2026-07-27, 888 auth): re-render the WEALTH briefing.
# /wealth is served from $WEBROOT/static/wealth.html, cron-rendered daily at
# 06:00 UTC from data/wealth/latest.json. Both are preserve-live overlays, so
# they survive the swap — but a deploy must still leave the page freshly
# rendered, never a stale bake. Non-fatal: a renderer failure must not roll
# back an otherwise healthy site deploy; the 06:00 UTC cron self-repairs.
if [[ "$WEBROOT_NAME" == "arif" && -f "$WEBROOT/data/wealth/latest.json" ]]; then
  mkdir -p "$WEBROOT/static"
  if python3 /root/scripts/wealth-static-render.py \
      "$WEBROOT/data/wealth/latest.json" "$WEBROOT/static/wealth.html"; then
    log "post-deploy: re-rendered static/wealth.html from latest.json"
  else
    log "WARN post-deploy: wealth re-render failed (non-fatal); cron repairs at 06:00 UTC"
  fi
fi

BACKUP_PREVIOUS="$DEPLOY_DIR/previous"
if [[ -e "$OLD_STAGE" || -L "$OLD_STAGE" ]]; then
  mkdir -p "$BACKUP_PREVIOUS"
  rsync -a --delete "$OLD_STAGE/" "$BACKUP_PREVIOUS/" || die "failed to archive previous tree"
fi

SUCCESS_STATUS="live"
[[ "$MODE" == "restore" ]] && SUCCESS_STATUS="restored"
write_receipt "$SUCCESS_STATUS" true true "$BUILD_HASH" "$SOURCE_COMMIT" "$BACKUP_PREVIOUS" ""

if [[ -e "$OLD_STAGE" || -L "$OLD_STAGE" ]]; then
  safe_remove_temp "$OLD_STAGE"
fi
SWAP_ACTIVE=0
log "receipt: $RECEIPT (status=$SUCCESS_STATUS)"
printf '%s\n' "$RECEIPT"
