# APEX_MAKCIKGPT_PREFLIGHT.md — Federation Runbook & Contract

> **DITEMPA BUKAN DIBERI** — Forged, not given.
> F13 Sovereign (Arif) controls the seal. Machines compute the graph. Makcik speaks the truth.

---

## 1. Pre-Flight Checklist (P1–P5)

| Code | Check | Status | Verification Command |
|---|---|---|---|
| **P1** | Feature Branch Isolation | ✅ PASSED | `git branch` (on `feat/apex-provenance`) |
| **P2** | Pre-APEX Baseline Snapshot | ✅ PASSED | `cp essays.json /tmp/essays.pre-apex.json` |
| **P3** | Legacy URL Baseline Count | ✅ PASSED | `grep -rc "wealth/makcikgpt" scripts/` |
| **P4** | Verification Baseline | ✅ PASSED | `make verify` (with BypassSandbox for live Caddy/HTTPS) |
| **P5** | Migration Debt Audit | ✅ PASSED | `grep -rl "seal.*999" src/data/makcikgpt/ \| wc -l` |

---

## 2. The 5 Laws of APEX Provenance

1. **Law 1: Typed Canon, Generated Exhaust** — `src/data/makcikgpt/*.ts` is Canon. `src/data/essays.json` carries `// AUTO-GENERATED — DO NOT EDIT`. Hand-edits break `make verify`.
2. **Law 2: Graduated Fail-Closed Enforcement** — `provenance_status`: `"legacy"` emits `WARN`. `"sealed"` emits `ERROR` if `claim_register` is missing or `maruah_review === "pending"`.
3. **Law 3: Canonical Payload Hashing** — Hash **ONLY** `stable_stringify({sorted_claims, sorted_sources})`. Exclude layout, mtimes, rendering code, and CSS.
4. **Law 4: MARUAH Human Gate** — Claims referencing named individuals without an `OBS` source flag `maruah_review: "pending"`. **Only Arif (F13) can approve.**
5. **Law 5: Gated Cryptographic Signing** — Compute is open to builds; signing & `VAULT999` writes are restricted to F13 sovereign deploy runs.

---

## 3. Stage Decision Matrix & Governance Gates

| Stage | Name | Risk | Reversible | Gate Action |
|---|---|---|---|---|
| **Stage 1** | Schema & Canon Definition | None | Yes | ✅ **COMPLETED** (branch commit `2421161`) |
| **Stage 2** | Source Contract & Payload Hash | Low | Yes | ✅ **COMPLETED** (branch commit `a505ef8`) |
| **--- HARD GATE ---** | **F13 Sovereign Review** | — | — | 🛑 **HALT FOR ARIF RE-APPROVAL** |
| **Stage 3** | Generators & SEO URL Clean | Medium | Partial | 🔒 GATED |
| **Stage 4** | Human UI Surface (`EvidenceDrawer`) | Low | Yes (flag) | 🔒 GATED |
| **Stage 4.5** | Legacy Article Backfill | HIGH | No (sealed) | 🔒 F13 PER-ARTICLE APPROVAL |
| **Stage 5** | Gated VAULT999 Seal | Irreversible | No | 🔒 F13 SIGN ONLY |

---

## 4. Rollback Matrix

- **Stage 1 & 2 Rollback**: `git checkout main && git branch -D feat/apex-provenance`
- **Stage 3 Rollback**: `git revert <commit>` + Purge CDN/prerender static cache (`rm -rf dist/`).
- **Stage 4 Rollback**: Toggle `<EvidenceDrawer />` feature flag to `false`.
- **Stage 5 Rollback**: **NONE** (`VAULT999` is append-only). Requires a superseding version receipt (`v1.1` with `supersedes: v1.0`).

---

## 5. Automated Guard Gates for `make verify`

```bash
# G1: Canonical URL purity
grep -rq "wealth/makcikgpt" scripts/ && exit 1

# G2: AUTO-GENERATED header check
head -1 src/data/essays.json | grep -q "AUTO-GENERATED" || exit 1

# G3: Payload Hash Idempotency
node scripts/lib/makcik-source.cjs --test-hash-idempotency || exit 1

# G4: Graduated Sealed Article Gate
node scripts/lib/makcik-source.cjs --enforce-sealed-gate || exit 1

# G6: Full Pipeline Generation Idempotency
make build && sha256sum dist/makcikgpt-md/*.md > /tmp/run1.sum
make build && sha256sum dist/makcikgpt-md/*.md > /tmp/run2.sum
diff /tmp/run1.sum /tmp/run2.sum || exit 1
```
