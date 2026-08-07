# TASK — Reorganize arif-fazil.com to 5-item nav (WORLD = organ surfaces)

**Sovereign directive (F13):** Nav collapses to 5. Organs belong to agents, so all organ surfaces live under /world/. Human writing under /words/. Human work under /work/.

## Target navigation (ONLY these 5)

```
HOME  → /
EARTH → /earth/
WORDS → /words/
WORLD → /world/
WORK  → /work/
```

## Path mapping (old → new)

| Old path | New path | Type |
|---|---|---|
| `/` | `/` | identity (keep) |
| `/earth/` | `/earth/` | earth science (keep) |
| `/writing/` | `/words/writing/` | human writing |
| `/doctrine/` | `/words/doctrine/` | law/constitution |
| `/essays/` | `/words/essays/` | essays |
| `/propa/` | `/world/propa/` | PETRONAS organ surface |
| `/malaysia/` | `/world/malaysia/` | sovereign pulse organ |
| `/politics/` | `/world/politics/` | geopolitics organ |
| `/politics/ns-election/` | `/world/politics/ns-election/` | election map |
| `/politics/shadow/` | `/world/politics/shadow/` | shadow PMs |
| `/politics/shadow/board/` | `/world/politics/shadow/board/` | board |
| `/politics/shadow/derita/` | `/world/politics/shadow/derita/` | derita map |
| `/economics/` | `/world/economics/` | capital hub |
| `/oil/` | `/world/economics/oil/` | oil terminal |
| `/gas/` | `/world/economics/gas/` | gas terminal |
| `/gold/` | `/world/economics/gold/` | gold terminal |
| `/klci/` | `/world/economics/klci/` | klci terminal |
| `/usdmyr/` | `/world/economics/usdmyr/` | usdmyr terminal |
| `/missions/` | `/work/missions/` | missions |
| `/999/` | `/work/proof/` | vault proof |
| `/world/makcikgpt/` | `/world/makcikgpt/` | keep (already in world) |
| `/world/sot/` | `/world/sot/` | keep (already in world) |

## Files to change (in order)

1. **`/root/web-canon/canon/navigation.json`** — source of truth. 5 primaryNav items. Regenerate navCanon via `generate-nav-canom.cjs` (find exact script name first).
2. **`sites/arif-fazil.com/src/data/navCanon.ts`** — regenerate (DERIVED, never hand-edit).
3. **`sites/arif-fazil.com/src/App.tsx`** — remap all `<Route>` paths. Add redirects for old paths.
4. **`surfaces.json`** — update all paths. Run `node scripts/verify-surfaces.cjs`.
5. **`/etc/caddy/Caddyfile`** — add 308 redirects old→new; update `@agent_shells` + `@spa_routes`; validate with `sudo caddy validate`; `sudo systemctl reload caddy`.
6. **`public/_redirects`** — keep in sync (Cloudflare Pages syntax).
7. **`sitemap.xml`** — regenerate (build postbuild).
8. **Move public dirs**: `public/writing` → `public/words/writing`, `public/doctrine` → `public/words/doctrine`, `public/essays` → `public/words/essays`, `public/propa` → `public/world/propa`, `public/malaysia` → `public/world/malaysia`, `public/politics` → `public/world/politics`, `public/oil|gas|gold|klci|usdmyr` → `public/world/economics/*`, `public/missions` → `public/work/missions`, `public/999` → `public/work/proof`.

## Hard constraints

- **Backup FIRST**: every moved dir gets `.bak-20260806-<path>` alongside or a tarball in `/root/arif-fazil.com/backups/2026-08-06-nav-reorg/`.
- **308 permanent redirects** for every old path (SEO + agent bookmarks survive).
- **verify-pages gate must pass**: `bash scripts/verify-pages.sh` — every `dist/*/index.html` live 200. If a path fails → HOLD, fix routing, re-run.
- **verify-surfaces.cjs must pass** — surfaces.json must match live HTTP.
- Do NOT touch: `/_shared/`, `_redirects` root syntax, canon files except navigation.json (with lease note).
- Do NOT deploy until ALL of: build green → gate green → Caddy validate green.
- Rollback: restore `.bak-20260806-*` dirs + `sudo systemctl reload caddy` (3 seconds).

## Verification checklist (run and report each)

```
curl -sI https://arif-fazil.com/world/economics/gold/        → 200
curl -sI https://arif-fazil.com/gold/                        → 308 → /world/economics/gold/
curl -sI https://arif-fazil.com/world/propa/                 → 200
curl -sI https://arif-fazil.com/propa/                       → 308 → /world/propa/
curl -sI https://arif-fazil.com/words/doctrine/              → 200
curl -sI https://arif-fazil.com/doctrine/                    → 308 → /words/doctrine/
curl -sI https://arif-fazil.com/work/proof/                  → 200
curl -sI https://arif-fazil.com/999/                         → 308 → /work/proof/
curl -s  https://arif-fazil.com/ | grep -oE 'href="/[a-z]+"' | sort -u   → 5 items only: / /earth /words /world /work
bash scripts/verify-pages.sh                                 → ALL PASS
node scripts/verify-surfaces.cjs                             → ALL PASS
```

## Report back (exact format)

1. List of every file moved + backup path
2. Caddyfile diff summary (redirects added)
3. navCanon.ts new 5-item array
4. verify-pages + verify-surfaces output
5. Any path that FAILED + why

DITEMPA BUKAN DIBERI. F1 reversible-first. F11 audit trail. If anything is ambiguous, STOP and report — do not invent.
