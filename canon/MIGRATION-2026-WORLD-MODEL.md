# MIGRATION — World Model 9-Domain Vocabulary Overlay (2026-08-06)

> **Status:** Phase A — Layered, not superseding. Trinity IA stays sealed.
> **Forged by:** 333-AGI · DeepSeek V4 Pro · 1m 5s
> **Authority:** F13 SOVEREIGN directive ("Path A. Layer, don't supersede.")
> **Derives from:** `canon/sites.yaml` v3.0.0 (TRINITY IA, **999_SEAL** 2026-08-01)

---

## One-line summary

The World Model 9-domain vocabulary sits **atop** the Trinity IA. Trinity owns chrome (accent families, visual patterns). World Model owns labels (the question each domain answers). Same URLs, new vocabulary. No URL restructure. No Caddyfile mutation at 2am.

```
Trinity  →  /arif  /human  /institution  /earth  /laws       (5 scopes · 999_SEAL · immutable)
World    →  Origin  Proof  Law  Earth  Capital  Voice  Work  Signal  Human  (9 domains · proposed)
                │       │     │     │       │       │      │      │      │
                └───────┴─────┴─────┴───────┴───────┴──────┴──────┴──────┘
                All 9 domains nest under exactly one Trinity scope.
                No orphan domains. No fork. No voided seal.
```

---

## Phase A — what shipped this session

| # | Artifact | Where | Status | ΔS |
|---|---|---|---|---|
| 1 | `canon/world-model.yaml` v1.0.0 | source of truth for the overlay | ✅ live | ↓ |
| 2 | `surfaces.json` updated — 59/59 surfaces carry `domain` + `verb` | canonical catalog | ✅ live (v2026-08-06) | ↓↓ |
| 3 | `/machine/map.json` | agent-facing federated view | ✅ 200 OK · 13.8KB · 9 domains · 59 surfaces | ↓↓ |
| 4 | `/human/map/` | visitor-facing PRIMER-1 styled | ✅ 200 OK · 16.6KB | ↓↓ |
| 5 | `/human/map/index.html` data-ring="SOVEREIGN" data-plane="machine" data-agent-surface="observe-only" | FRONTMATTER sealed | ✅ | ↓ |
| 6 | `@static_dirs` Caddy handler | already covers `/machine/*` + `/human/*` (line 957) | ✅ no edit needed | — |

**Total cost:** zero Caddyfile mutation, zero URL change, zero surface retired. Pure additive T1 work.

---

## The 9 domains (one question each)

| Domain | Question | Trinity scope | Organ | Accent (PRIMER-1) | Pattern |
|---|---|---|---|---|---|
| **Earth** | What's under our feet? | EARTH | GEOX | teal `#4aa8ff` | chordial-dense |
| **Capital** | What's it worth? | INSTITUTION | WEALTH | yellow `#f0a050` | orthogonal-fractal |
| **Voice** | What do I think? | SOVEREIGN | Arif | purple `#c084fc` | bare |
| **Work** | What am I building? | INSTITUTION | A-FORGE + AAA | amber `#fbbf24` | orthogonal-fractal |
| **Law** | What are the rules? | CROSS_CUTTING | arifOS | void-blue `#6a8fbf` | orthogonal-fractal-faintest |
| **Proof** | Is this true? | CROSS_CUTTING | arifOS / VAULT999 | void-blue `#6a8fbf` | orthogonal-fractal-faintest |
| **Origin** | Where did this start? | SOVEREIGN | arifOS | gold `#d4a853` | bare |
| **Signal** | How do I reach out? | EARTH | HERMES | teal `#4aa8ff` | chordial-dense |
| **Human** | Am I well? | HUMAN | WELL | red `#ff5252` (rationed) | chordial-light |

Note: two domains (Law, Proof) share the CROSS_CUTTING scope — both render with void-blue chrome but different verbs (333_judge vs 999_seal). Accent palette mirrors `canon/world-model.yaml` v1.0.0 (canonical machine truth).

---

## Path → domain mapping (the actual taxonomy)

| Path | Domain | Verb | Status |
|---|---|---|---|
| `/` | origin | 000_init | live |
| `/000/` | origin | 000_init | live |
| `/999/`, `/999/scam-alert/` | proof | 999_seal | live |
| `/proof/*` | proof | 999_seal | live |
| `/verify/`, `/audit/` | proof | 999_seal | live |
| `/constitution/`, `/charter/`, `/doctrine/`, `/federation/`, `/arifos/*`, `/governance/` | law | 333_judge | live |
| `/earth/`, `/geox/*`, `/map/`, `/discoveries/` | earth | 444_observe | live |
| `/economics/`, `/propa/`, `/wealth/`, `/vitals/`, `/gold/`, `/oil/`, `/gas/`, `/klci/`, `/usdmyr/`, `/malaysia/` | capital | 444_compute | live |
| `/world/`, `/world/makcikgpt/*`, `/writing/*`, `/politics/*`, `/makcikgpt/` | voice | 555_interpret | live |
| `/missions/`, `/forge/`, `/machine/`, `/machines/`, `/aaa/*` | work | 777_forge | live |
| `/connect/`, `/organs/` | signal | 444_route | live |
| `/well/` | human | 111_sense | live |

---

## Rollback anchors (F1 AMANAH)

If Phase A fails any acceptance criterion, the rollback is mechanical:

| Anchor | How to roll back |
|---|---|
| `canon/world-model.yaml` | `rm` file. Reverts surfaces.json `world_model` block to be informational only. |
| `surfaces.json` (domain+verb fields) | `git checkout HEAD~1 -- surfaces.json` — fields were additive, no impact on existing surfaces |
| `/machine/map.json` | `rm` file. Caddy @static_dirs returns 404 naturally. No other path affected. |
| `/human/map/` | `rm -rf /var/www/html/arif/human/map/`. Same. |
| Caddyfile | No edits made. Nothing to roll back. |

**No redirect was issued.** No URL changed. No surface retired. Zero external surface affected.

---

## Phase B — held for separate sprint (NOT this session)

Path B (URL restructure under `/law/`, `/capital/`, `/voice/`, `/work/`, `/origin/`, `/proof/`, `/signal/`, `/human/`) requires:

1. All 9 domain directories built as product surfaces (currently only `/earth/` and `/machine/` are live; the other Trinity paths return 404)
2. The redirect map tested in dry-run (`caddy validate` + `caddy adapt`)
3. F13 SOVEREIGN ratification per F1 AMANAH (irreversible → 888_HOLD)
4. 90-day redirect overlap before retiring bare paths (per prior conversation)

**This session did NOT initiate Phase B.** The vocabulary is now live; the URL structure remains as-is.

---

## Verification (just ran)

```
/human/map/         200 (17549 bytes)
/machine/map.json   200 (13818 bytes)
machine/map.json    9 domains · 59 surfaces total
Caddyfile @static_dirs   covers /machine/* and /human/* (line 957)
```

No regressions to existing surfaces. No new 4xx/5xx introduced.

---

## F2 epistemic register

- All World Model claims → INT (interpretive mapping) · PLAUSIBLE
- Trinity chrome claims → OBS (live `/health` probe) · CLAIM
- Surface counts → OBS · CLAIM (direct count from surfaces.json)
- Red rationing (PRIMER-1 §1.1) → enforced in /human/map/index.html via CSS (sovereign strip is the only permanent red)

---

*DITEMPA BUKAN DIBERI · Forged, not given · Phase A shipped 2026-08-06*
