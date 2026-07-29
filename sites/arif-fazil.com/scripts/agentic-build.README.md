# Agentic Build — Reproducible Federation Regeneration

> **For agents (Kimi Code, OpenCode, ChatGPT, etc.) working on `sites/arif-fazil.com/`.**

When you change source files (essays, content, dossiers, pages), the federation
needs to be **regenerated** end-to-end and re-deployed. A single command does this.

## TL;DR

```bash
cd /root/arif-fazil.com/sites/arif-fazil.com
./scripts/agentic-build.sh
```

That single script does, in order:

| # | Step | What | Why |
|---|------|------|-----|
| 1 | `npm run build` | prebuild + tsc + vite + postbuild | Regenerates all auto-generated files (`llms.txt`, `sitemap.xml`, `feed.xml`, `llms.json`, `page.json`, `makcikgpt-md/index.html`, `data/wealth/archive_index.json`, `data/politics/ns_live_telemetry.json`) and builds the React SPA into `dist/` |
| 2 | Inject dossier fragments | Appends `scripts/dossier-llms-additions.md` to both `public/llms.txt` AND `dist/llms.txt`; same for `dossier-sitemap-additions.xml` → `public/sitemap.xml` + `dist/sitemap.xml` | Vite has already built by step 2, so additions must land in BOTH `public/` (source) and `dist/` (served) |
| 3 | `rsync dist/ → /var/www/html/arif/` | Mirror built output to the Caddy live root | The live site Caddy serves from `/var/www/html/arif/` |
| 4 | HTTP probe | Verify 9 critical surfaces return 200 | Catch broken builds before they reach the user |
| 5 | Hashes | Print sha256 of every auto-generated file | F11 AUDIT trail — you can diff to know what changed |

If the build fails or any surface 404s, **the script does not commit anything** —
the live site stays at its last known-good state.

## File Layout

```
scripts/
  agentic-build.sh                       ← one-shot build + deploy + verify
  agentic-build.README.md               ← this file
  dossier-llms-additions.md             ← manual additions to llms.txt (post-build)
  dossier-sitemap-additions.xml         ← manual additions to sitemap.xml (post-build)
  generate-feed.cjs                     ← (auto) src/data/essays.json → public/feed.xml
  generate-discovery.cjs                ← (auto) src/data/essays.json → sitemap + llms + page
  generate-makcik-index.cjs             ← (auto) → public/makcikgpt-md/index.html
  generate-wealth-archive-index.cjs     ← (auto) → public/data/wealth/archive_index.json
  generate-ns-telemetry.cjs             ← (auto) → public/data/politics/ns_live_telemetry.json
  copy-static-html.js                   ← (auto) postbuild: canon/ + 999/ → dist/

src/data/essays.json                    ← single source of truth (MakcikGPT)
```

## What gets auto-generated vs hand-curated

**Auto-generated (overwritten on every build):**

| File | Source | Generator |
|---|---|---|
| `public/feed.xml` | `src/data/essays.json` | `generate-feed.cjs` |
| `public/sitemap.xml` | `src/data/essays.json` | `generate-discovery.cjs` |
| `public/llms.txt` | `src/data/essays.json` | `generate-discovery.cjs` |
| `public/llms.json` | `src/data/essays.json` | `generate-discovery.cjs` |
| `public/page.json` | `src/data/essays.json` | `generate-discovery.cjs` |
| `public/makcikgpt-md/index.html` | `src/data/essays.json` | `generate-makcik-index.cjs` |
| `public/data/wealth/archive_index.json` | `public/data/wealth/*` | `generate-wealth-archive-index.cjs` |
| `public/data/politics/ns_live_telemetry.json` | live data | `generate-ns-telemetry.cjs` |
| `dist/*` (full Vite build) | `src/*` + `public/*` | `vite build` |

**Hand-curated, persisted via the agentic-build.sh post-build hook:**

| Fragment | Appends to |
|---|---|
| `scripts/dossier-llms-additions.md` | `public/llms.txt` + `dist/llms.txt` |
| `scripts/dossier-sitemap-additions.xml` | `public/sitemap.xml` + `dist/sitemap.xml` |

**Hand-curated, persistent in source:**

- All files under `public/earth/`, `public/000/`, `public/999/`, etc. (static HTML)
- `public/_shared/zen-all.js`, `public/_shared/trinity-nav.js`
- All `src/pages/*.tsx` (React source)

## When to run

Run `agentic-build.sh` when you change:

- `src/data/essays.json` (any new MakcikGPT piece)
- Any file under `src/pages/`, `src/App.tsx`, `src/components/`
- `public/earth/*` (new dossier or cross-section)
- `public/_shared/*` (federation chrome)
- `scripts/dossier-*.md` or `*.xml` (dossier additions)
- `vite.config.ts` or `package.json` (build config)

## If the build fails

The script does NOT auto-rollback. If a surface 404s after the build:

1. Check the build log: `npm run build 2>&1 | tail -30`
2. If a generator errored, the file will be empty or stale — check the source
3. The live root is at `/var/www/html/arif/` — to manually revert:
   `cd /root/arif-fazil.com && git checkout HEAD~1 -- sites/arif-fazil.com/dist/ sites/arif-fazil.com/public/`
4. If a `set -e` failure broke the script before the mirror, the live site is
   unchanged from the last successful build

## Common failures

### "Surface 404s but the static file is on disk"

Likely cause: a Caddy `@spa_routes` block in `/etc/caddy/Caddyfile` matches
the path before `try_files {path} /index.html` falls through to find the file.
Caddy's `try_files` only checks `{path}` as a literal file — NOT `{path}/index.html` —
so directory-style URLs (`/constitution/`) are skipped and the Vite SPA shell
at `/var/www/html/arif/dist/index.html` is served instead. The React app then
shows its own 404 page (HTTP 200) because the route isn't in the SPA.

**Fix:** add a specific `handle` block for the path BEFORE `@spa_routes`. Example
for `/constitution/`:

```caddyfile
@constitution_static path /constitution /constitution/
handle @constitution_static {
    root * /var/www/html/arif
    file_server
}
```

Then `caddy validate --config /etc/caddy/Caddyfile` and
`systemctl reload caddy`. Verify with `curl -sI https://arif-fazil.com/constitution/`.

This pattern applies to any path with a real static file that's being shadowed
by the SPA fallback. As of 2026-07-29, the four pages that need(ed) this
treatment are `/constitution/`, `/charter/`, `/audit/`, `/aaa/`.

## Commit pattern

After a successful build:

```bash
git add scripts/agentic-build.sh \
        scripts/agentic-build.README.md \
        scripts/dossier-llms-additions.md \
        scripts/dossier-sitemap-additions.xml \
        public/llms.txt public/llms.json public/page.json \
        public/feed.xml public/sitemap.xml \
        public/makcikgpt-md/index.html \
        public/data/wealth/archive_index.json \
        public/data/politics/ns_live_telemetry.json
git commit -m "chore: agentic build — $(date -u +%Y-%m-%dT%H:%M:%SZ)"
```

**Do not commit** changes to `dist/` directly — `dist/` is generated from `public/` + `src/`.
The live root `/var/www/html/arif/` is the served Caddy target; updates flow through
`agentic-build.sh`.

## Federation doctrine

This pattern respects the F1-F13 constitutional floors:

- **F1 AMANAH** — reversible, idempotent, dry-runnable (`--no-mirror`, `--no-build`)
- **F2 TRUTH** — only commits after HTTP probes return 200; never fabricates state
- **F4 CLARITY** — every output file has a known source; every source is documented here
- **F11 AUDIT** — every run prints hashes; failure is loud, not silent
- **F13 SOVEREIGN** — no agent auto-pushes; humans commit after review

If you change this pattern, update this file. If you break the build, run
`git revert` and let the federation restore itself.
