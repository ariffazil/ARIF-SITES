# MIGRATION-2026-WORLD-MODEL — World Model Vocabulary Overlay

> **Forged:** 2026-08-06 · **333-AGI Δ MIND** · **Path A (Layer, not supersede)**
> **Derives from:** canon/sites.yaml v3.0.0 (TRINITY IA, 999_SEAL 2026-08-01)
> **Overlay:** canon/world-model.yaml v1.0.0
> **Status:** IN_PROGRESS — Phase 1 (vocabulary only, no URL change)

---

## 0. THE THREE-LAYER REALITY

The deployed site has **three** different taxonomies, not two. The prior analysis correctly identified Trinity vs World Model, but missed that the live navigation (navigation.json v4.0.0, 2026-08-04) uses an **Arrow Hybrid** taxonomy that differs from both.

```
LAYER 1 ─ TRINITY IA (sites.yaml v3.0.0, 999_SEAL 2026-08-01)
          5 scopes: SOVEREIGN · HUMAN · INSTITUTION · EARTH · CROSS_CUTTING
          Drives: design chrome, accent families, visual patterns
          Status: SEALED — immutable structure
          Live paths: 0/5 (all 404 — DRAFT_FUTURE)

LAYER 2 ─ ARROW HYBRID (navigation.json v4.0.0, 2026-08-04)
          7 primary items: Earth · Economics · World · Writing · Doctrine · Missions · 999
          Drives: navbar, breadcrumbs, SPA routes, keyboard shortcuts
          Status: LIVE — serving 200 on all primary paths
          Source: /root/arif-fazil.com/canon/navigation.json

LAYER 3 ─ WORLD MODEL C (world-model.yaml v1.0.0, 2026-08-06)
          9 domains: Earth · Capital · Voice · Work · Law · Proof · Origin (+ Signal · Human)
          Drives: proposed nav vocabulary (not yet deployed)
          Status: DRAFT — vocabulary overlay, no URL change
          Source: /root/arif-fazil.com/canon/world-model.yaml
```

### Reconciliation Matrix

| Arrow Hybrid (LIVE) | World Model (PROPOSED) | Trinity Scope | Notes |
|---|---|---|---|
| Earth | Earth | EARTH | Aligned |
| Economics | Capital | INSTITUTION | Arrow=Economics, World=Capital — label only |
| World | — | — | Arrow has World; WM folds into Voice/Signal/Earth |
| Writing | Voice | SOVEREIGN | Arrow=Writing, World=Voice — label only |
| Doctrine | Law + Proof | CROSS_CUTTING | Arrow=Doctrine; WM splits into Law+Proof |
| Missions | Work | INSTITUTION | Arrow=Missions; World=Work — label only |
| 999 | Proof | CROSS_CUTTING | Arrow=999; World=Proof — label only |
| — | Origin | SOVEREIGN | WM only (no Arrow equivalent) |
| — | Signal | EARTH | WM only (secondary) |
| — | Human | HUMAN | WM only (secondary) |

### Key Finding

The Arrow Hybrid nav and World Model C are **closer than they appear**. Five of seven Arrow primary items have direct World Model equivalents under different labels. Only `/world` (Arrow) has no clean WM mapping. And WM adds Origin/Signal/Human as secondary items.

**The clean migration**: rewrite Arrow labels to World Model labels in navigation.json, keep URLs unchanged (Path A), add Origin as a new primary item. World content gets mapped into Voice/Signal/Earth per the domain scope.

---

## 1. MIGRATION PHASES

### Phase 1 — Vocabulary (NOW, Path A)
**Goal:** World Model labels on existing Arrow Hybrid URLs. No URL change. No redirects.

| Step | Action | Risk | Status |
|------|--------|------|--------|
| 1.1 | Write world-model.yaml (overlay doc) | None | ✅ DONE |
| 1.2 | Add domain+verb fields to surfaces.json | None | ✅ DONE (v2026-08-06) |
| 1.3 | Generate machine/map.json | None | ✅ DONE |
| 1.4 | Generate human/map/index.html | None | ✅ DONE |
| 1.5 | Deploy surfaces.json to webroot | None | ⬜ PENDING |
| 1.6 | Wire /machine/map.json in Caddyfile | Low (new route) | ⬜ PENDING |
| 1.7 | Wire /human/map/ in Caddyfile | Low (new route) | ⬜ PENDING |
| 1.8 | Rewrite navigation.json labels → World Model | Low (label change) | ⬜ PENDING |
| 1.9 | Deploy + `make verify-pages` | Low | ⬜ PENDING |

**Rollback:** Revert navigation.json + Caddyfile. Zero data loss. Fully reversible.

### Phase 2 — Content (after Phase 1 green, 72h observation)
**Goal:** Build content pages under Trinity paths using World Model vocabulary.

| Step | Action | Risk | Status |
|------|--------|------|--------|
| 2.1 | Build `/earth/` landing (GEOX + membrane) | Low | ⬜ |
| 2.2 | Build `/institution/capital/` (WEALTH) | Low | ⬜ |
| 2.3 | Build `/institution/work/` (A-FORGE + AAA) | Low | ⬜ |
| 2.4 | Build `/arif/voice/` (sovereign writing) | Low | ⬜ |
| 2.5 | Build `/laws/` (F1-F13 + doctrine) | Low | ⬜ |
| 2.6 | Build `/arif/origin/` (genesis) | Low | ⬜ |
| 2.7 | Build `/human/` (WELL vitality) | Low | ⬜ |

### Phase 3 — URL Restructure (F13 gated, Path B equivalent)
**Goal:** Trinity paths become canonical URLs. Legacy paths → 301 redirects. Requires F13 ratification.

| Step | Action | Risk | Status |
|------|--------|------|--------|
| 3.1 | Activate caddy-redirects-v9.conf (staged) | MEDIUM | ⬜ HOLD |
| 3.2 | 72h canary on `/human/well/` first (D6) | MEDIUM | ⬜ HOLD |
| 3.3 | Full redirect activation | HIGH | ⬜ HOLD |

**Phase 3 trigger:** F13 SOVEREIGN approval ONLY.

---

## 2. ROLLBACK PLAN

### Phase 1 Rollback (vocabulary only)
```bash
# Revert navigation.json to previous commit
git -C /root/arif-fazil.com checkout HEAD~1 -- canon/navigation.json

# Remove new Caddyfile routes
# Restore: remove /human/map/ and /machine/map.json handle blocks

# Redeploy
cd /root/arif-fazil.com && make deploy
```

**Time to rollback:** < 120 seconds. **Data loss:** zero.

### Phase 2 Rollback (content pages)
```bash
# Remove content pages (git revert the content commits)
# Caddyfile routes stay (harmless: 404 on removed pages)
```

### Phase 3 Rollback (URL restructure)
```bash
# Disable caddy-redirects-v9.conf include
# Reload Caddy
sudo systemctl reload caddy
```

**Time to rollback:** < 30 seconds. **Cache window:** stale redirects may persist in browser cache for up to 24h. Acceptable per D3 (one-hop, no chains).

---

## 3. INVARIANTS (never break these)

1. **Trinity sites.yaml is immutable.** World Model is an OVERLAY, not a replacement. Trinity scopes remain the canonical chrome driver.
2. **D3 — one-hop redirects only.** No redirect chains. Each legacy path lands directly on its canonical Trinity path.
3. **D7 — tombstones stay.** 410 Gone for internal-only services. Never repurpose tombstoned hosts.
4. **D1 — MCP exempt.** Protocol endpoints dual-serve on both subdomain and canonical path. Never 301-redirect MCP endpoints.
5. **Red is rationed.** Only HUMAN scope + verdict chips + seals use red accent.
6. **F11 AUDITABILITY.** Every change committed with `chore:` or `feat:` prefix. Every deploy verified with `make verify-pages`.

---

## 4. GAPS & DEBT (discovered 2026-08-06)

| # | Gap | Severity | Fix |
|---|-----|----------|-----|
| G1 | navigation.json v4.0.0 not reflected in sites.yaml | MEDIUM | Phase 2: update sites.yaml to v4.0.0 reflecting Arrow Hybrid as the live nav layer under Trinity structure |
| G2 | Generated artifacts not deployed to webroot | HIGH | Phase 1 steps 1.5-1.7 — deploy immediately |
| G3 | surfaces.json webroot stale (v2026-07-31 vs v2026-08-06) | MEDIUM | Phase 1 step 1.5 |
| G4 | Trinity paths all 404 — DRAFT_FUTURE still | LOW | Phase 2 builds content; Phase 3 activates redirects |
| G5 | `/earth` returns 308 redirect loop | LOW | Debug Caddyfile earth route — likely trailing slash issue |
| G6 | World Model `origin` domain has no Arrow equivalent | LOW | New nav item — Phase 1 step 1.8 adds it |

---

## 5. COMMANDS REFERENCE

```bash
# Verify all pages after deploy
cd /root/arif-fazil.com && make verify-pages

# Deploy (gate-protected)
cd /root/arif-fazil.com && make deploy

# Rollback Caddyfile
sudo cp /etc/caddy/Caddyfile.bak-$(date +%Y%m%d) /etc/caddy/Caddyfile
sudo systemctl reload caddy

# Check what's deployed vs what's in repo
diff <(ls /var/www/html/arif/) <(ls /root/arif-fazil.com/public/) 2>/dev/null
```

---

## 6. DECISION LOG

| Date | Decision | By | Path |
|------|----------|----|------|
| 2026-08-01 | Trinity IA ratified (sites.yaml v3.0.0, 999_SEAL) | F13 | — |
| 2026-08-04 | Arrow Hybrid nav deployed (navigation.json v4.0.0) | F13 | — |
| 2026-08-06 | World Model Path A chosen (layer, not supersede) | F13 | A |
| 2026-08-06 | world-model.yaml forged (overlay doc) | 333-AGI | A |
| 2026-08-06 | MIGRATION doc forged (this file) | 333-AGI | A |

---

*DITEMPA BUKAN DIBERI — layered, not voided.*
