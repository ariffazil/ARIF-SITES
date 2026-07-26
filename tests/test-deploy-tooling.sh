#!/usr/bin/env bash
# Behavioral tests for deployment tooling. All apply paths are redirected to a
# temporary webroot; this test never touches /var/www/html or production Caddy.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd -P)"
DEPLOY_SITE="$ROOT/scripts/deploy-site.sh"
DEPLOY_BATCH="$ROOT/deploy-vps.sh"
TMP_ROOT="$(mktemp -d)"

cleanup() {
  set +e
  find -P "$TMP_ROOT" -depth -delete
}
trap cleanup EXIT

fail() {
  printf 'FAIL: %s\n' "$*" >&2
  exit 1
}
pass() {
  printf 'PASS: %s\n' "$*"
}
assert_file_contains() {
  local file="$1"
  local expected="$2"
  grep -Fq -- "$expected" "$file" || fail "$file does not contain $expected"
}
assert_empty_dir() {
  local dir="$1"
  [[ -d "$dir" ]] || return 0
  [[ -z "$(find "$dir" -mindepth 1 -print -quit)" ]] || fail "$dir is not empty"
}
latest_receipt() {
  local site="$1"
  find "$ARIF_SITES_ARCHIVE_ROOT/$site" -name receipt.json -printf '%T@ %p\n' \
    | sort -n \
    | tail -1 \
    | cut -d' ' -f2-
}
reset_fakes() {
  : >"$TEST_COMMAND_LOG"
  printf '0\n' >"$TEST_STATE/probe-count"
  export FAKE_PROBE_CODES="${1:-200}"
  export FAKE_CADDY_MODE="${2:-ok}"
  export FAKE_MKDOCS_MODE="${3:-ok}"
}

FAKE_BIN="$TMP_ROOT/bin"
TEST_STATE="$TMP_ROOT/state"
TEST_COMMAND_LOG="$TMP_ROOT/commands.log"
mkdir -p "$FAKE_BIN" "$TEST_STATE"
: >"$TEST_COMMAND_LOG"

cat >"$FAKE_BIN/npm" <<'FAKE_NPM'
#!/usr/bin/env bash
set -euo pipefail
printf 'npm %s\n' "$*" >>"$TEST_COMMAND_LOG"
case "${1:-}" in
  ci)
    mkdir -p node_modules
    printf 'temporary dependency\n' >node_modules/fixture.txt
    ;;
  run)
    [[ "${2:-}" == "build" ]] || exit 2
    mkdir -p dist
    cp template.html dist/index.html
    ;;
  *) exit 2 ;;
esac
FAKE_NPM

cat >"$FAKE_BIN/mkdocs" <<'FAKE_MKDOCS'
#!/usr/bin/env bash
set -euo pipefail
printf 'mkdocs %s\n' "$*" >>"$TEST_COMMAND_LOG"
if [[ "${1:-}" == "--version" ]]; then
  if [[ "${FAKE_MKDOCS_MODE:-ok}" == "wrong-version" ]]; then
    printf 'mkdocs, version 0.0.0\n'
  else
    printf 'mkdocs, version 1.6.1\n'
  fi
  exit 0
fi
[[ "${FAKE_MKDOCS_MODE:-ok}" != "fail" ]] || exit 19
site_dir=""
while (($#)); do
  if [[ "$1" == "--site-dir" ]]; then
    site_dir="$2"
    shift 2
  else
    shift
  fi
done
[[ -n "$site_dir" ]] || exit 2
mkdir -p "$site_dir"
cat >"$site_dir/index.html" <<'HTML'
<meta name="generator" content="mkdocs-1.6.1, mkdocs-material-9.7.7">
WIKI_BUILD_OK
HTML
printf '<urlset/>\n' >"$site_dir/sitemap.xml"
FAKE_MKDOCS

cat >"$FAKE_BIN/caddy" <<'FAKE_CADDY'
#!/usr/bin/env bash
set -euo pipefail
printf 'caddy %s\n' "$*" >>"$TEST_COMMAND_LOG"
case "${FAKE_CADDY_MODE:-ok}:${1:-}" in
  validate-fail:validate|reload-fail:reload) exit 23 ;;
  *) exit 0 ;;
esac
FAKE_CADDY

cat >"$FAKE_BIN/curl" <<'FAKE_CURL'
#!/usr/bin/env bash
set -euo pipefail
printf 'curl %s\n' "$*" >>"$TEST_COMMAND_LOG"
count="$(<"$TEST_STATE/probe-count")"
IFS=',' read -r -a codes <<<"${FAKE_PROBE_CODES:-200}"
if ((count >= ${#codes[@]})); then
  index=$((${#codes[@]} - 1))
else
  index="$count"
fi
printf '%s\n' "$((count + 1))" >"$TEST_STATE/probe-count"
code="${codes[$index]}"
[[ "$code" != "ERR" ]] || exit 7
printf '%s' "$code"
FAKE_CURL
chmod +x "$FAKE_BIN/npm" "$FAKE_BIN/mkdocs" "$FAKE_BIN/caddy" "$FAKE_BIN/curl"

REGISTRY="$TMP_ROOT/runtime-overlays.json"
cat >"$REGISTRY" <<'JSON'
{
  "schema_version": 1,
  "canonical_repo_root": "/root/arif-sites",
  "defaults": {
    "probe_attempts": 3,
    "caddy_attempts": 3,
    "retry_delay_seconds": 0
  },
  "sites": [
    {
      "site": "static.test",
      "source": "tests/fixtures/static-site",
      "webroot": "static",
      "owner": "arif-sites-test",
      "batch": true,
      "batch_order": 10,
      "required_artifacts": ["index.html"],
      "probe": {"url": "https://static.test/", "accepted_codes": [200]},
      "overlays": [
        {"path": "runtime/state.json", "owner": "fixture-runtime", "strategy": "preserve-live"}
      ]
    },
    {
      "site": "build.test",
      "source": "tests/fixtures/build-site",
      "webroot": "build",
      "owner": "arif-sites-test",
      "batch": true,
      "batch_order": 20,
      "build": {
        "kind": "npm",
        "install": ["npm", "ci", "--quiet"],
        "command": ["npm", "run", "build"],
        "output": "dist"
      },
      "required_artifacts": ["index.html"],
      "probe": {"url": "https://build.test/", "accepted_codes": [200]},
      "overlays": []
    },
    {
      "site": "wiki.test",
      "source": "tests/fixtures/wiki-site",
      "webroot": "wiki",
      "owner": "arif-sites-test",
      "batch": true,
      "batch_order": 30,
      "build": {
        "kind": "mkdocs",
        "command": ["mkdocs", "build", "--strict", "--config-file", "mkdocs.yml", "--site-dir", "site"],
        "output": "site",
        "pinned": true,
        "version_command": ["mkdocs", "--version"],
        "version_contains": "1.6.1",
        "output_markers": [
          {"path": "index.html", "contains": "mkdocs-1.6.1, mkdocs-material-9.7.7"}
        ]
      },
      "required_artifacts": ["index.html", "sitemap.xml"],
      "probe": {"url": "https://wiki.test/", "accepted_codes": [200]},
      "overlays": []
    }
  ]
}
JSON

export PATH="$FAKE_BIN:$PATH"
export TEST_STATE TEST_COMMAND_LOG
export ARIF_SITES_OVERLAY_REGISTRY="$REGISTRY"
export ARIF_SITES_HTML_ROOT="$TMP_ROOT/html"
export ARIF_SITES_ARCHIVE_ROOT="$TMP_ROOT/archive"
export ARIF_SITES_STAGING_ROOT="$TMP_ROOT/staging"
export ARIF_SITES_BUILD_TMP_ROOT="$TMP_ROOT/build-tmp"
export ARIF_SITES_CADDYFILE="$TMP_ROOT/Caddyfile"
export ARIF_SITES_SKIP_CHOWN=1
export ARIF_SITES_RETRY_DELAY=0
printf '{}\n' >"$ARIF_SITES_CADDYFILE"

fixture_hash_before="$(sha256sum "$ROOT/tests/fixtures/build-site/"* | sha256sum)"
reset_fakes
plan="$TMP_ROOT/plan.json"
"$DEPLOY_SITE" build.test --dry-run >"$plan"
jq -e '.mode == "dry-run" and .mutation == false and .build.kind == "npm"' "$plan" >/dev/null
[[ ! -e "$ARIF_SITES_HTML_ROOT" ]] || fail "dry-run created the webroot"
[[ ! -e "$ARIF_SITES_ARCHIVE_ROOT" ]] || fail "dry-run created an archive"
[[ ! -e "$ARIF_SITES_STAGING_ROOT" ]] || fail "dry-run created staging"
[[ ! -e "$ARIF_SITES_BUILD_TMP_ROOT" ]] || fail "dry-run created a build directory"
[[ ! -s "$TEST_COMMAND_LOG" ]] || fail "dry-run executed npm, Caddy, or curl"
fixture_hash_after="$(sha256sum "$ROOT/tests/fixtures/build-site/"* | sha256sum)"
[[ "$fixture_hash_before" == "$fixture_hash_after" ]] || fail "dry-run changed build fixture source"
"$DEPLOY_BATCH" --dry-run >"$TMP_ROOT/batch-plan.json"
jq -e '.mode == "dry-run" and .mutation == false and (.sites | length == 3)' "$TMP_ROOT/batch-plan.json" >/dev/null
[[ ! -s "$TEST_COMMAND_LOG" ]] || fail "batch dry-run executed a mutating command"
pass "dry-run is mutation-free for per-site and batch paths"

if "$DEPLOY_SITE" unknown.test --dry-run >/dev/null 2>&1; then
  fail "unknown site did not fail closed"
fi
ambiguous_registry="$TMP_ROOT/ambiguous.json"
jq '.sites += [(.sites[0] | .site = "duplicate-owner.test")]' "$REGISTRY" >"$ambiguous_registry"
if ARIF_SITES_OVERLAY_REGISTRY="$ambiguous_registry" "$DEPLOY_SITE" static.test --dry-run >/dev/null 2>&1; then
  fail "ambiguous webroot ownership did not fail closed"
fi
pass "unknown and ambiguous owners fail closed"

reset_fakes
"$DEPLOY_SITE" build.test --validate-build >/dev/null
assert_file_contains "$TEST_COMMAND_LOG" "npm ci --quiet"
assert_file_contains "$TEST_COMMAND_LOG" "npm run build"
[[ ! -e "$ROOT/tests/fixtures/build-site/node_modules" ]] || fail "isolated install polluted source"
[[ ! -e "$ROOT/tests/fixtures/build-site/dist" ]] || fail "isolated build polluted source"
assert_empty_dir "$ARIF_SITES_BUILD_TMP_ROOT"
[[ ! -e "$ARIF_SITES_HTML_ROOT" ]] || fail "build validation touched webroot"
[[ ! -e "$ARIF_SITES_ARCHIVE_ROOT" ]] || fail "build validation created archive"
pass "build validation runs only in a cleaned temporary copy"

mkdir -p "$ARIF_SITES_HTML_ROOT/wiki"
printf 'WIKI_OLD\n' >"$ARIF_SITES_HTML_ROOT/wiki/index.html"
reset_fakes 200 ok fail
if "$DEPLOY_SITE" wiki.test --apply >/dev/null 2>&1; then
  fail "wiki apply succeeded after failed pinned build"
fi
assert_file_contains "$ARIF_SITES_HTML_ROOT/wiki/index.html" "WIKI_OLD"
assert_empty_dir "$ARIF_SITES_BUILD_TMP_ROOT"
assert_empty_dir "$ARIF_SITES_STAGING_ROOT"
reset_fakes 200 ok wrong-version
if "$DEPLOY_SITE" wiki.test --validate-build >/dev/null 2>&1; then
  fail "wiki accepted the wrong pinned tool version"
fi
reset_fakes 200 ok ok
"$DEPLOY_SITE" wiki.test --validate-build >/dev/null
assert_empty_dir "$ARIF_SITES_BUILD_TMP_ROOT"
pass "wiki apply requires a successful pinned build"

mkdir -p "$ARIF_SITES_HTML_ROOT/static/runtime"
printf 'STATIC_OLD\n' >"$ARIF_SITES_HTML_ROOT/static/index.html"
printf '{"runtime":"keep"}\n' >"$ARIF_SITES_HTML_ROOT/static/runtime/state.json"
reset_fakes 503,503,200 ok ok
receipt="$($DEPLOY_SITE static.test --apply)"
jq -e '.schema == "arif-sites.deploy-receipt.v1" and .status == "live" and .probe.ok == true and .caddy.ok == true' "$receipt" >/dev/null
assert_file_contains "$ARIF_SITES_HTML_ROOT/static/index.html" "STATIC_FIXTURE_NEW"
assert_file_contains "$ARIF_SITES_HTML_ROOT/static/runtime/state.json" '"runtime":"keep"'
assert_file_contains "$(dirname "$receipt")/previous/index.html" "STATIC_OLD"
[[ "$(<"$TEST_STATE/probe-count")" == "3" ]] || fail "probe was not retried to success"
assert_empty_dir "$ARIF_SITES_STAGING_ROOT"
if find "$ARIF_SITES_HTML_ROOT" -mindepth 1 -maxdepth 1 \( -name '*.pre-swap*' -o -name '*.tmp.*' \) -print -quit | grep -q .; then
  fail "pre-swap or temp tree leaked under the HTML root"
fi
pass "apply preserves overlays, retries probes, and writes jq-valid receipt"

printf 'ROLLBACK_SENTINEL\n' >"$ARIF_SITES_HTML_ROOT/static/index.html"
reset_fakes 503,503,503 ok ok
if "$DEPLOY_SITE" static.test --apply >/dev/null 2>&1; then
  fail "probe failure did not fail the apply"
fi
assert_file_contains "$ARIF_SITES_HTML_ROOT/static/index.html" "ROLLBACK_SENTINEL"
failed_receipt="$(latest_receipt static.test)"
jq -e '.status == "rolled_back" and .probe.ok == false' "$failed_receipt" >/dev/null
assert_empty_dir "$ARIF_SITES_STAGING_ROOT"
pass "exhausted probe retries roll back and fail closed"

printf 'CADDY_RELOAD_SENTINEL\n' >"$ARIF_SITES_HTML_ROOT/static/index.html"
reset_fakes 200 reload-fail ok
if "$DEPLOY_SITE" static.test --apply >/dev/null 2>&1; then
  fail "Caddy reload failure did not fail the apply"
fi
assert_file_contains "$ARIF_SITES_HTML_ROOT/static/index.html" "CADDY_RELOAD_SENTINEL"
failed_receipt="$(latest_receipt static.test)"
jq -e '.status == "rolled_back" and .caddy.ok == false' "$failed_receipt" >/dev/null
reload_calls="$(grep -c '^caddy reload' "$TEST_COMMAND_LOG" || true)"
((reload_calls >= 3)) || fail "Caddy reload was not retried"
assert_empty_dir "$ARIF_SITES_STAGING_ROOT"
pass "Caddy reload errors retry, roll back, and fail closed"

printf 'CADDY_VALIDATE_SENTINEL\n' >"$ARIF_SITES_HTML_ROOT/static/index.html"
reset_fakes 200 validate-fail ok
if "$DEPLOY_SITE" static.test --apply >/dev/null 2>&1; then
  fail "Caddy validation failure did not fail the apply"
fi
assert_file_contains "$ARIF_SITES_HTML_ROOT/static/index.html" "CADDY_VALIDATE_SENTINEL"
failed_receipt="$(latest_receipt static.test)"
jq -e '.status == "failed_pre_swap" and .caddy.ok == false' "$failed_receipt" >/dev/null
validate_calls="$(grep -c '^caddy validate' "$TEST_COMMAND_LOG" || true)"
((validate_calls == 3)) || fail "Caddy validation did not exhaust configured retries"
assert_empty_dir "$ARIF_SITES_STAGING_ROOT"
pass "Caddy validation errors fail before swap"

ln -s "$ROOT" "$TMP_ROOT/ARIF-SITES"
if "$TMP_ROOT/ARIF-SITES/scripts/deploy-site.sh" static.test --dry-run >/dev/null 2>&1; then
  fail "uppercase repository execution was accepted"
fi
pass "uppercase repository execution is rejected"

printf 'All deployment-tooling behavioral tests passed.\n'
