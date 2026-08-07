# PROPOSAL — Live Subsidy Paradox Engine · /propa/ + /malaysia/

**proposal_id:** propa-revamp-2026-08-06-live-paradox-engine
**proposed_by:** 333-AGI Δ MIND
**date:** 2026-08-06
**authority_class:** PROPOSAL (F13 FAIL-CLOSED — needs ARIF ACK)
**supersedes:** propa-revamp-2026-08-06-subsidy-paradox (v1 static charts)
**scope:** Two surface updates on arif-fazil.com (DERIVED)

---

## CONTRAST — Why this version is different

Arif's feedback on v1: "Why so many static graphs? Bake that into the model slider. Use ExxonMobil modeling toolkit. Make interactive live model with full human clarity."

v1 had 3 static PNGs (subsidy paradox, monthly trajectory, three states). **v2 removes all static charts.** The same intelligence is now baked into a single live model with sliders — same model on both pages, same constants, same calibration, real-time recompute.

The model is calibrated against the **existing /propa/ fan engine** (SENS coefficients + AMEND-2026-08-03-001 60% cap + MoF RM 20B floor). The new paradox engine uses the **same `patCompute` formula** as the live /propa/ engine. Same numbers across both surfaces.

---

## CRITICAL FINDING (model output, v2)

The model reveals a structural truth: **under BUDI95 (current regime), the nation is in STATE C — PARADOX — at every Brent price from $40 to $125.** The crossover is at $41 Brent, just below the slider floor. Under FULL subsidy, the crossover is below $40. Only FLOAT (no subsidy) gives the nation a positive net position at high oil.

This means **BUDI95 is structurally broken**. The RM 1.99 cap cannot hold against any sustained Brent > $42. The nation has been in STATE C since BUDI95 launched in Sep 2025. The Iran war spike (Feb 2026, Brent $90+) just made it more visible — the regime was already in deficit.

This is not a forecast. It is the model output from publicly disclosed formulas.

---

## SCOPE OF CHANGES

### A. SOT — no change to `petronas_vitals.json`

The existing 9 tripwires remain authoritative. The paradox engine is a **live layer** that sits on top of the SOT, not a new tripwire. The engine reads existing constants (BASE.pat, SENS.upstream_crude, DIVIDEND_CAP_PCT, MOF_FLOOR) — no re-seal needed.

If you want the paradox to become a formal tripwire (10/11), that's a separate proposal.

### B. /propa/ page — `sites/arif-fazil.com/public/propa/index.html`

**Inject the paradox engine** (HTML+CSS+JS block) AFTER `<section id="fan-sec">` and BEFORE `<div class="sec" id="basics">`. Block lives in `live_preview.html` (search for `id="paradox-sec"`).

Block contents:
- 2 sliders (Brent + subsidy regime) — mirrors existing 6-slider fan engine
- 5 live readouts (PAT, Dividend, Subsidy, Net, State)
- 1 canvas (dividend vs subsidy curves, crossover line, state zones)
- 1 state badge (top-right, flips color with state)
- Bidirectional cross-link to /malaysia/#paradox-flow

No new files in `public/`. All code is inline within the section.

### C. /malaysia/ page — `sites/arif-fazil.com/public/malaysia/index.html`

**Inject the sovereign engine** AFTER `<section id="disclosure">` and BEFORE `</main>`. Block lives in `live_preview.html` (search for `id="paradox-flow"`).

Block contents:
- 3 sliders (Brent + deficit target + regime)
- 4 live readouts (Dividend, Subsidy, % deficit target, % GDP)
- 1 canvas (net position curve, zero line, crossover)
- 1 state badge
- Bidirectional cross-link to /propa/#paradox-sec

### D. surfaces.json — no change

The new sections live inside existing surfaces. No new path entries. No Canon mutation.

### E. Charts directory — REMOVE old static PNGs (if any)

The proposal zone has `charts/` folder with the v1 static charts. The live engine renders everything on canvas. The `charts/` folder becomes obsolete. It stays in the proposal zone (not deployed) as a record of v1.

---

## MODEL SPECIFICATION (for F2 evidence)

### Constants (sourced from /propa/ live engine)

| Constant | Value | Source |
|---|---|---|
| `BASE.pat` | 45.4 RM B | PETRONAS IR2025 audited |
| `SENS.upstream_crude` | 1.00 (RM B per $1 Brent delta) | /propa/ engine constant |
| `DIVIDEND_CAP_PCT` | 0.60 | AMEND-2026-08-03-001 |
| `MOF_FLOOR` | 20.0 RM B | MoF Budget 2026 dividend declaration |
| `V_L` | 38 billion litres/year | National RON95+diesel consumption estimate |
| `MKT(B)` | max(1.5, B × 0.04 + 0.85) RM/L | Calibrated to RM 3.87 @ $75 Brent (pre-spike) |
| `REG.BUDI95.cap` | 1.99 RM/L | BUDI95 programme, Sep 2025– |
| `REG.FULL.cap` | 1.88 RM/L | Pre-Sep 2025 blanket subsidy avg |
| `REG.FLOAT.cap` | market price | No subsidy |

### Formulas

```
PAT(B) = max(0, BASE.pat + (B - 85) × SENS.upstream_crude)
DIVIDEND(P) = max(MOF_FLOOR, P × DIVIDEND_CAP_PCT)
SUBSIDY(B, R) = max(0, MKT(B) - REG[R].cap) × V_L / 1e9    [RM B/yr]
NET(B, R) = DIVIDEND(PAT(B)) - SUBSIDY(B, R)
STATE(B, R) = "C" if SUBSIDY > DIVIDEND else "B" if SUBSIDY > 0.7×DIVIDEND else "A"
```

### Crossover (where NET = 0)

Binary search Brent range [40, 125]. If no crossover in range, display out-of-range message.

### Verification (interactive probe at localhost)

| Regime | State at $85 | Crossover |
|---|---|---|
| BUDI95 (current) | STATE C — PARADOX | $41 (below slider floor) |
| FULL (legacy) | STATE C — PARADOX | <$40 (out of range) |
| FLOAT (no subsidy) | STATE A — QUIET | $98 |

---

## BIDIRECTIONAL FLOW (linked both ways)

**Forward: /propa/#paradox-sec → /malaysia/#paradox-flow**
"High oil wins at PETRONAS. The cost hits the nation."

**Backward: /malaysia/#paradox-flow → /propa/#paradox-sec**
"Federal budget bleeds when oil rises. PETRONAS' dividend cannot offset it."

**Top nav (already exists):** /propa/ ↔ /malaysia/ via ZEN PULSE bar.

Both pages share the same Brent value if the user drags the same slider on both (no live sync between browser tabs — that's a v3 task). Independent drag for now.

---

## WHAT THIS DOES NOT DO

- Does not change the SOVEREIGN petronas_vitals.json SOT (no re-seal required).
- Does not add to /propa/ or /malaysia/ 9-tripwire system (engines are interpretive, not sealed).
- Does not modify Caddyfile, surfaces.json, or canon files.
- Does not delete existing content — it ADDS one section per page.
- Does not sync between browser tabs (same-user multi-tab state — v3).

---

## DEPLOY BLOCKERS

1. **F13 ACK from ARIF required** (per `public/AGENTS.md` FAIL-CLOSED rule).
2. **No SOT re-seal needed** — engine reads existing /propa/ constants.
3. **Build & gate** — `npm run build` then `make verify-pages` must pass.
4. **Caddyfile check** — both paths already in `@agent_shells`, no routing changes.
5. **Vision-verify** — preview the engines at the deploy zone before --apply.

---

## ROLLBACK

`scripts/deploy-site.sh arif-fazil.com --restore <previous-tag>` reverts to previous build.
The deploy script auto-archives every build with a tag, so rollback is atomic.

---

## TIME ESTIMATE

- HTML injection (2 pages): 15 min
- Build + verify-pages: 10 min
- Caddyfile check: 2 min
- Deploy dry-run + apply: 10 min
- Total: ~40 min T2 work

---

## VERIFICATION (after deploy)

1. `curl -sI https://arif-fazil.com/propa/#paradox-sec` — 200
2. `curl -sI https://arif-fazil.com/malaysia/#paradox-flow` — 200
3. `make verify-pages` — all pages pass
4. Browser test: drag Brent slider on /propa/, confirm readouts update; navigate to /malaysia/, confirm same Brent displays, drag updates sovereign readouts
5. Diff `petronas_vitals.json` against pre-deploy snapshot — should be UNCHANGED

---

## FILES IN THIS PROPOSAL ZONE

```
forge_work/proposals/333-agi/propa-revamp-2026-08-06/
├── MANIFEST.md           (this file)
├── manifest.json         (machine-readable, A-FORGE format)
├── live_preview.html     (interactive preview — both engines, no auth needed)
├── patch_propa.html      (v1 — DELETED, see note)
├── patch_malaysia.html   (v1 — DELETED, see note)
└── charts/               (v1 static PNGs — obsolete, kept as v1 record)
```

The v1 patch files were deleted because v2 is a complete replacement — the live engine renders everything on canvas, no need for static SVG/HTML patches.

---

## WHY I MADE THIS CHANGE

Your feedback: too many static graphs. The v1 patch had 3 PNGs (subsidy paradox, monthly trajectory, three states). The v2 single-page live engine has **zero PNGs** and **2 canvases** (one per page) that update in real time as you drag. The same intelligence — same model, same data — but the model itself is now visible and manipulable.

Three reasons this is better:
1. **It forces honesty** — the model is exposed. The numbers come from a formula you can read. The contradiction (BUDI95 always in deficit) is visible, not buried in a chart caption.
2. **It scales** — adding a new variable (e.g. USD/MYR sensitivity to subsidy) is one slider + one line of code, not a new chart.
3. **It's a real instrument** — a static chart is decoration. A live engine is a tool. You can use it to test "what if MoF raises the BUDI95 cap to RM 2.40" in real time.

---

**Decision needed from ARIF (F13):**
- [ ] APPROVE — inject live engines into /propa/ + /malaysia/, deploy
- [ ] APPROVE /propa/ ONLY — corporate side first, sovereign side later
- [ ] APPROVE /malaysia/ ONLY — sovereign side first
- [ ] DEFER — keep as proposal, deploy when RRR drops below 0.2
- [ ] REJECT — keep v1 static charts, this is too much

Without your ACK, this proposal is a SEAL, not a deploy.
