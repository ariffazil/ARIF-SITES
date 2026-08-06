# MIGRATION 2026 — 9-DOMAIN WORLD MODEL

> **Status:** PHASE A — Vocabulary overlay (active) · PHASE B — URL restructure (HOLD, F13 gate)
> **Forged:** 2026-08-06 by 333-AGI (Δ MIND)
> **Derives from:** `canon/world-model.yaml` v1.0.0 · `canon/sites.yaml` v3.0.0 (999_SEAL)
> **Relation:** OVERLAY — does not supersede Trinity IA

---

## What changed (2026-08-06)

The arif-fazil.com site now has a **9-domain vocabulary** layered on top of the 5-scope Trinity IA.

| Before | After |
|--------|-------|
| `/doctrine/` — dumping ground for canon, constellation, federation, syedos | `/law/doctrine/` — one of 9 clearly-labeled domains |
| `/vitals/` `/propa/` — two names, same content | `/capital/petronas/` — one canonical home |
| `/geox/` — AI jargon, 27 sub-pages orphaned from nav | `/earth/geox/` — human-readable, Trinity-aligned |
| `/forge/` `/aaa/` — separate islands | `/work/` — unified under "What am I building?" |
| `/world/` `/writing/` `/politics/` — three buckets | `/voice/` — one domain: "What do I think?" |
| No machine-readable site map | `/machine/map.json` — agents read it natively |
| No human-readable site map | `/human/map/` — 9 cards, one question each |

---

## The 9 domains

| Domain | Question | Trinity scope | Organ |
|--------|----------|---------------|-------|
| **Origin** | Where did this start? | SOVEREIGN | arifOS |
| **Proof** | Is this true? | CROSS_CUTTING | arifOS / VAULT999 |
| **Law** | What are the rules? | CROSS_CUTTING | arifOS |
| **Earth** | What's under our feet? | EARTH | GEOX |
| **Capital** | What's it worth? | INSTITUTION | WEALTH |
| **Voice** | What do I think? | SOVEREIGN | Arif |
| **Work** | What am I building? | INSTITUTION | A-FORGE + AAA |
| **Signal** | How do I reach out? | EARTH | HERMES |
| **Human** | Am I well? | HUMAN | WELL |

---

## PHASE A — Vocabulary overlay (CURRENT)

**What it does:** Renames nav labels. Does NOT change URLs.

| Artifact | Status |
|----------|--------|
| `surfaces.json` — domain + verb fields | ✅ Live (v2026-08-06) |
| `canon/world-model.yaml` — overlay declaration | ✅ Written |
| `/machine/map.json` — agent-readable 9-domain map | ✅ Live |
| `/human/map/` — visitor-facing 9-domain page | ✅ Written, needs Caddy wire |
| Nav labels in `navCanon.ts` — `/propa/` already updated | ✅ Done |
| `caddy-redirects-v9.conf` — staged redirect map (commented) | ✅ Staged |
| Caddyfile `/human/map/` wire | ⬜ Pending |

**Rollback:** Revert nav labels. Zero URL changes. Fully reversible.

---

## PHASE B — URL restructure (HOLD, F13 gate)

**What it does:** Moves content to new URL paths. Activates 301 redirect map.

**Prerequisites:**
1. 9 domain directories built under Trinity paths
2. All 103 pages mapped to new homes
3. 301 redirect map tested — dry-run first, verify-pages after
4. F13 SOVEREIGN approval

**Redirect map:** 46 rules in `deploy/caddy-redirects-v9.conf`. All D3-compliant (one-hop, no chains).

**Key paths changing:**

| Old | New | Trinity scope |
|-----|-----|---------------|
| `/000/` | `/arif/origin/` | SOVEREIGN |
| `/999/` | `/laws/proof/` | CROSS_CUTTING |
| `/doctrine/` | `/laws/doctrine/` | CROSS_CUTTING |
| `/propa/` | `/institution/capital/petronas/` | INSTITUTION |
| `/wealth/` | `/institution/capital/` | INSTITUTION |
| `/world/` | `/arif/voice/` | SOVEREIGN |
| `/writing/` | `/arif/voice/essays/` | SOVEREIGN |
| `/geox/` | `/earth/geox/` | EARTH |
| `/aaa/` | `/institution/work/cockpit/` | INSTITUTION |

**Rollback:** Remove `caddy-redirects-v9.conf` include. Revert Caddyfile. 301 cache clears within TTL window. Full reversibility.

---

## Non-goals (what this does NOT touch)

- ❌ Trinity scopes (SOVEREIGN, HUMAN, INSTITUTION, EARTH, CROSS_CUTTING) — sealed, unchanged
- ❌ Design system (accent families, patterns, D1-D9 disciplines) — ratified, unchanged
- ❌ Organ topology (ports, roles, authority ceilings) — kernel-level, unchanged
- ❌ Caddyfile subdomain routing — unchanged
- ❌ surfaces.json core schema (missions, status, type) — unchanged, domain+verb added only

---

## Verification checklist

- [x] `surfaces.json` — 59 surfaces, all carry domain+verb
- [x] `machine/map.json` — 9 domains, agent-readable
- [x] `human/map/index.html` — renders 9-domain grid from surfaces.json
- [ ] `caddy validate` — passes (performed on 2026-08-06 deploy/Caddyfile, PASS)
- [ ] `/human/map/` reachable via Caddy (pending wire)
- [ ] `make verify-pages` — all live surfaces return 200 (pending)
- [ ] `make build` — dist/ corresponds to public/ (pending)

---

*DITEMPA BUKAN DIBERI ⚒️*
