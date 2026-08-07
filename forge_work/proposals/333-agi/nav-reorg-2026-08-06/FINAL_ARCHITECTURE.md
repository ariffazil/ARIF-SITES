# arif-fazil.com — FINAL SITE ARCHITECTURE (5-Lane Organ Map)

**Ratified:** 2026-08-06 · F13 SOVEREIGN (Arif)
**Principle:** Organs belong to agents. Every organ posts to its own site lane. Nav = 5, human-facing. HERMES is the bridge (medium, not destination).

---

## The One Rule

> **Every site lane is the output surface of exactly one organ.**
> If it is not an organ's output, it does not get a lane.

| Organ | Lane | What it posts |
|---|---|---|
| **AAA** | HOME | Cockpit — binds sovereign (principal) to all agents |
| **GEOX** | EARTH | Seismic, basin, geology, earth science |
| **arifOS** | WORDS | Law — constitution, doctrine, F1–F13 floors, governance |
| **Arif (human)** | WORDS | Essays, writing, voice |
| **WEALTH** | WORLD | Capital — commodities, PETRONAS, Malaysia, politics, makcikgpt, sot |
| **WELL** | WORK | Exploration wells, resume, missions, proof |
| **HERMES** | *(infra)* | Telegram gateway — the bridge that delivers, not a destination |

---

## The 5-Lane Nav (final)

```
┌──────┬───────┬───────┬───────┬───────┐
│ HOME │ EARTH │ WORDS │ WORLD │ WORK  │
│  /   │/earth │/words │/world │/work  │
└──────┴───────┴───────┴───────┴───────┘
```

### Hero Core (each top-level page carries ONE centered symbol at top)

| Lane | Hero | Symbol | Meaning |
|---|---|---|---|
| **HOME** `/` | ⏰ | Arrow of Time | time, origin, the sovereign's line |
| **EARTH** `/earth/` | 🌎 | Globe | earth, GEOX, geology |
| **WORDS** `/words/` | 🧭 | Compass | law, doctrine, orientation |
| **WORLD** `/world/` | 🗺️ | Map | WEALTH output, agent atlas |
| **WORK** `/work/` | ❤️‍🩹 | Mending heart | WELL, vitality, wells |

Each page: hero symbol centered at top, then content below. Content-first, dark, mono kickers.

- **HOME `/`** — AAA cockpit. The sovereign opens the site and sees all organs, all agents, all pulses. Principal ↔ agents binding surface.
- **EARTH `/earth/`** — GEOX output. Globe, seismic, basin, wells context.
- **WORDS `/words/`** — arifOS law + Arif's human writing.
- **WORLD `/world/`** — WEALTH output. Capital, commodities, geopolitics, agent journalism.
- **WORK `/work/`** — WELL output. Exploration wells, resume, missions, proof/vault.

---

## Full Path Map (old → new)

### HOME lane
| Old | New | Notes |
|---|---|---|
| `/` | `/` | AAA cockpit (rebuild from current home) |

### EARTH lane
| Old | New | Notes |
|---|---|---|
| `/earth/` | `/earth/` | GEOX — already correct, keep |

### WORDS lane
| Old | New | Notes |
|---|---|---|
| `/writing/` | `/words/writing/` | Arif's essays |
| `/essays/` | `/words/essays/` | alias → /words/writing/ |
| `/doctrine/` | `/words/doctrine/` | arifOS doctrine |
| `/constitution/` | `/words/constitution/` | arifOS constitution, F1–F13 |
| `/canon/` | `/words/canon/` | governance canon (if public) |
| `/laws/` | `/words/law/` | if exists |

### WORLD lane (WEALTH output)
| Old | New | Notes |
|---|---|---|
| `/world/` | `/world/` | hub — WEALTH surface index |
| `/propa/` | `/world/propa/` | PETRONAS VITALS |
| `/malaysia/` | `/world/malaysia/` | sovereign pulse |
| `/economics/` | `/world/economics/` | capital hub |
| `/oil/` | `/world/economics/oil/` | oil terminal |
| `/gas/` | `/world/economics/gas/` | gas terminal |
| `/gold/` | `/world/economics/gold/` | gold terminal |
| `/klci/` | `/world/economics/klci/` | KLCI terminal |
| `/usdmyr/` | `/world/economics/usdmyr/` | USD/MYR terminal |
| `/politics/` | `/world/politics/` | geopolitics |
| `/politics/ns-election/` | `/world/politics/ns-election/` | election map (Leaflet) |
| `/politics/shadow/` | `/world/politics/shadow/` | shadow PMs |
| `/politics/shadow/board/` | `/world/politics/shadow/board/` | shadow board |
| `/politics/shadow/derita/` | `/world/politics/shadow/derita/` | derita map |
| `/world/makcikgpt/` | `/world/makcikgpt/` | keep (WEALTH journalism) |
| `/world/sot/` | `/world/sot/` | keep (WEALTH atlas) |
| `/world/atlas/` | `/world/atlas/` | BUILD — globe index to world content |

### WORK lane (WELL output)
| Old | New | Notes |
|---|---|---|
| `/work/` | `/work/` | BUILD — WELL surface index |
| `/resume/` | `/work/resume/` | Arif's CV (if exists) |
| `/wells/` | `/work/wells/` | exploration wells |
| `/missions/` | `/work/missions/` | missions catalog |
| `/999/` | `/work/proof/` | vault proof |

### Legacy redirects (308 permanent)
```
/oil/        → /world/economics/oil/
/gas/        → /world/economics/gas/
/gold/       → /world/economics/gold/
/klci/       → /world/economics/klci/
/usdmyr/     → /world/economics/usdmyr/
/economics/  → /world/economics/
/politics/   → /world/politics/
/politics/*  → /world/politics/$path
/propa/      → /world/propa/
/vitals/     → /world/propa/
/malaysia/   → /world/malaysia/
/writing/    → /words/writing/
/essays/     → /words/essays/
/doctrine/   → /words/doctrine/
/constitution/ → /words/constitution/
/missions/   → /work/missions/
/999/        → /work/proof/
```

---

## File Change Order (executor checklist)

1. `/root/web-canon/canon/navigation.json` — 5 primaryNav items (source of truth)
2. `sites/arif-fazil.com/src/data/navCanon.ts` — regenerate (DERIVED)
3. `sites/arif-fazil.com/src/App.tsx` — remap routes, add legacy redirects
4. `surfaces.json` — update paths, `node scripts/verify-surfaces.cjs`
5. `/etc/caddy/Caddyfile` — 308 redirects + `@agent_shells` + `@spa_routes`; `sudo caddy validate`; `systemctl reload caddy`
6. `public/_redirects` — sync Cloudflare syntax
7. Move public dirs (backup FIRST: `.bak-20260806-*` + tarball in `/root/arif-fazil.com/backups/2026-08-06-nav-reorg/`)
8. `npm run build` → `bash scripts/verify-pages.sh` (ALL PASS)
9. `node scripts/verify-surfaces.cjs` (ALL PASS)
10. Deploy: `bash scripts/deploy-site.sh arif-fazil.com --dry-run` → `--apply`

---

## Verification (executor must run each)

```
curl -sI https://arif-fazil.com/            → 200 (AAA cockpit)
curl -sI https://arif-fazil.com/earth/      → 200 (GEOX)
curl -sI https://arif-fazil.com/words/      → 200 (arifOS law + Arif writing)
curl -sI https://arif-fazil.com/world/      → 200 (WEALTH)
curl -sI https://arif-fazil.com/work/       → 200 (WELL)
curl -sI https://arif-fazil.com/gold/       → 308 → /world/economics/gold/
curl -sI https://arif-fazil.com/propa/      → 308 → /world/propa/
curl -sI https://arif-fazil.com/writing/    → 308 → /words/writing/
curl -sI https://arif-fazil.com/999/        → 308 → /work/proof/
curl -s  https://arif-fazil.com/ | grep -oE 'href="/[a-z]+"' | sort -u  → exactly: / /earth /words /world /work
bash scripts/verify-pages.sh                → ALL PASS
node scripts/verify-surfaces.cjs            → ALL PASS
```

---

## What does NOT change

- `/_shared/` design tokens — shared, not organ output
- `llms.txt`, `llms.json`, `page.json`, `missions.json`, `sitemap.xml` — machine files, regenerated by build
- MCP endpoints (`mcp.arif-fazil.com`, organ ports) — infra, not site surface
- `/rsl.xml` — rights statement, root-level
- `surfaces.json` doctrine — "not in file → not served" still binds

---

## HERMES note (per sovereign)

HERMES is **the agent**, not a lane. It is the Telegram bridge that delivers content from all lanes. It does not get a nav item. It is the medium through which the sovereign talks to the federation. AAA (HOME) is where the sovereign **sees** the federation; HERMES is where the sovereign **talks** to it.

---

*Ratified by F13 · 2026-08-06 · DITEMPA BUKAN DIBERI*
