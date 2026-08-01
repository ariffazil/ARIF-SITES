---
title: WEB_CANON_README
version: ATLAS-1.0
epoch: SEAL-2026-08-01-f13-batch-ack
actor: kimi-code/FI-008
sovereign: ARIF (F13)
doctrine: DITEMPA BUKAN DIBERI
---

# WEB_CANON_README — The Atlas Index

> **Authority:** Supreme. Every page, route, design, content, and verification decision
> in the arif-fazil.com federation defers to this folder.

If you are a **human coder** → you ship when the build is green and the agent has
shown a diff.

If you are an **agent** → you begin here. You do not invent structure. You do not
invent pages. You do not invent colors. You read this folder, consult the Atlas,
propose a change, and wait for ARIF.

If you are a **sovereign** → you decide. The Atlas tells you what is canonical. You
tell the Atlas what changes.

## 1. The One Law

> **No page may define its own identity, navigation, route, color, or proof status.
> It must inherit from Atlas.**

If you are tempted to add a one-off navigation, a unique link, a new color, or a
copy variant — STOP. The Atlas already has an answer. Find it. Use it.

## 2. The Atlas Hierarchy

```
/canon/atlas.json                  ← The supreme machine-readable map (START)
        │
        ├── /canon/WEB_ATLAS.md            ← Human-readable constitution (this is the soul)
        │
        ├── /canon/sites.yaml              ← Trinity IA: paths, organs, redirects, tombstones
        ├── /canon/navigation.json         ← Universal frame: strip, trinity tiles, breadcrumb, footer
        ├── /canon/redirects.yaml          ← 301 redirects, aliases, tombstones, canary gate
        ├── /canon/design-tokens.json      ← PRIMER-1 colors, semantic, contrast
        ├── /canon/typography.json         ← IBM Plex superfamily, √2 scale, 3 voices
        ├── /canon/geometry.json           ← 16x16 unit cell, chordials, ONE torus per page
        ├── /canon/components.json         ← BOP panel physics, SEAL/HOLD/VOID button grades
        ├── /canon/templates.json           ← 3 templates + agent override + build pipeline
        ├── /canon/federation.json         ← Trinitate scopes, organs, postures, F1-F13 alignment
        ├── /canon/tool-surfaces.json      ← MCP surface per organ
        ├── /canon/releases.json           ← Version history (sealed)
        ├── /canon/public-state.schema.json ← JSON Schema for the public state
        │
        ├── /canon/WEB-FEDERATION-MAP.md    ← Repo-to-territory map (12 files)
        ├── /canon/WEB_CANON_README.md      ← THIS FILE (entry point)
        │
        ├── /canon/content-model.schema.json   ← Content model for every page (NEW)
        └── /canon/verification-checklist.yaml  ← Deploy gates (NEW)
```

## 3. The Read Order for an Agent

If you are an AI agent and want to make a change, read in this order:

1. **`atlas.json`** — the machine-readable pointer. Tells you which documents matter.
2. **`sites.yaml`** — every route, organ, redirect, tombstone, canary, alias.
3. **`navigation.json`** — the universal frame. The strip, tiles, breadcrumb, footer.
4. **`redirects.yaml`** — D3 (one-hop), D1 (MCP exempt), D7 (tombstones), D6 (canary).
5. **`design-tokens.json`** — colors. Red is rationed. Amber is AAA only.
6. **`typography.json`** — IBM Plex only. Three voices (human, doctrine, machine).
7. **`geometry.json`** — 16x16 unit cell. ONE torus per page (trinity-ring OR mission-wheel).
8. **`components.json`** — Button grades: SEAL solid, HOLD dashed, VOID red (hold-to-confirm).
9. **`templates.json`** — Three templates: trinity-tile-page, organ-page, surface-page.
10. **`federation.json`** — Organ postures: JUDGE_ONLY, EXECUTE_AFTER_SEAL, DISPLAY_ONLY, METABOLIZE_ONLY, COMPUTE_ONLY, REFLECT_ONLY.
11. **`content-model.schema.json`** — Every page has an `audience`, `intent`, `ring`, `primaryAction`, `proofAction`.
12. **`verification-checklist.yaml`** — Run before any deploy.

You do not need to read other docs. The Atlas references them.

## 4. The Read Order for a Human Coder

Same as above. The hierarchy is doctrine-neutral.

## 5. The Read Order for the Sovereign

You decide. The Atlas tells you what is canonical. If you want to change canon,
you issue a **999_SEAL** with the affected files. The canon-sync.sh gate validates
schema, builds, and updates the live mirror.

## 6. Operative Rules (from FLOOR_TABLE)

| Floor | Rule | How the Atlas enforces |
|---|---|---|
| F1 AMANAH | Every change is reversible | `--delete` is forbidden in canon-sync.sh |
| F2 TRUTH | P(truth) ≥ 0.99 | Every claim has evidence label (OBS · DER · INT · SPEC) |
| F3 TRI-WITNESS | Human × AI × Verifier ≥ 0.75 | Build lints + Playwright + Visual QA |
| F4 CLARITY | ΔS ≤ 0 | Atlas lowers entropy by being THE source |
| F5 PEACE² | Non-destructive | One torus per page, red rationed |
| F6 DUAL-REGISTER | MARUAH on kernel, EMPATHY on human | templates.json agent_overrides |
| F7 HUMILITY | Ω₀ ∈ [0.03, 0.05] | Atlas admits its own gaps |
| F8 GENIUS | G = (A·P·E·X)^(¼) ≥ 0.80 | Components.json lint rules |
| F9 ANTIHANTU | No deception | Red rationed, three surfaces only |
| F10 ONTOLOGY | AI ≠ being | Federation.json postures never claim sentience |
| F11 AUDITABILITY | Every change is in git | F11 WAJIB gate in canon-sync.sh |
| F12 RESILIENCE | Injection defense | One-hop redirect, no chaining |
| F13 SOVEREIGN | Human veto final | SOVEREIGN_BARE / SOVEREIGN_BLANK invariants |

## 7. The Agent Workflow

```
1.  Read atlas.json
2.  Identify affected routes (sites.yaml)
3.  Identify affected components (components.json)
4.  Identify affected tokens (design-tokens.json, geometry.json)
5.  Propose change (use content-model.schema.json)
6.  Show diff (must be reviewable on a single page)
7.  Run build (npm run build, caddy validate)
8.  Run route checks (every canonical URL returns 200; retired URLs redirect)
9.  Run visual checks (Playwright + design-token lint)
10. Produce receipt (forge_vault mode=receipt)
11. WAIT for ARIF SEAL
```

If you skip a step, the result is BANGANG.

## 8. The Forbidden Patterns

| Pattern | Why forbidden |
|---|---|
| Hard-coded colors | design-tokens.json is the only source |
| Self-invented navigation | navigation.json is the only source |
| One-off page templates | templates.json is the only source |
| Magic numbers | Use --var(--token-…) from design-tokens.json |
| Two torus on one page | geometry.json says one per page |
| New red surface | design-tokens.json says rationed (3 surfaces only) |
| Chained redirects | redirects.yaml says one-hop |
| Inline content not in content model | content-model.schema.json is the only source |
| Invented layout | templates.json defines three templates |
| Invented component | components.json defines the library |

## 9. The Atlas Sync

The Atlas is the supreme map. The sync gate is `canon-sync.sh` which:

1. Reads `canon/*.json` and `canon/*.yaml` from `/root/arif-fazil.com/canon/`
2. Validates each against `public-state.schema.json`
3. Copies to `/var/www/html/canon/` (live mirror)
4. Copies to `/root/web-canon/canon/` (GitHub source of truth)
5. Verifies md5 parity across all 3 copies

If parity fails, the build halts. There is no graceful degradation.

## 10. Maintenance

| Document | Updated when | Owner |
|---|---|---|
| atlas.json | New canon file added, role changed | sovereign (F13) |
| WEB_ATLAS.md | Major scope change | sovereign (F13) |
| sites.yaml | New organ, new route, redirect change | operator + sovereign |
| navigation.json | Frame component added/changed | sovereign (F13) |
| redirects.yaml | New redirect, alias, tombstone | operator |
| design-tokens.json | New color, contrast verified | sovereign (F13) |
| typography.json | New font, new scale, new voice | sovereign (F13) |
| geometry.json | New pattern, new torus | sovereign (F13) |
| components.json | New component, new grade | sovereign (F13) |
| templates.json | New template, new agent override | sovereign (F13) |
| federation.json | Organ posture change | sovereign (F13) |
| content-model.schema.json | New content field | sovereign (F13) |
| verification-checklist.yaml | New gate, new rule | sovereign (F13) |

— DITEMPA BUKAN DIBERI
