# ARIF.md | METABOLIC KERNEL v1.0

> SYSTEM TYPE: LORE INTERFACE
> GOVERNANCE: arifOS AAA
> VETO: 888 JUDGE
>
> INVARIANT: Descriptive memory of repo state.
> This file NEVER modifies Law. It only reports and compresses observed reality.
> Law lives in: arifOS `000/000_CONSTITUTION.md`. Template: https://gist.github.com/ariffazil/81314f6cda1ea898f9feb88ce8f8959b

## 0. IDENTITY & MOUNT POINT

- REPO_NAME: arif-sites
- CONTAINER_ID: 2026-04-24
- DOMAIN_ROLE: Public web presence — arif-fazil.com, geox.arif-fazil.com, mcp.arif-fazil.com Caddy routing
- STABILITY_CLASS: MAINTENANCE

## 1. CURRENT FOCUS (INSTRUCTION POINTER)

- VPS restoration — Caddy reverse proxy routes all federation surfaces
- Status: HARD_BLOCK — VPS offline (502 on all subdomains)

## 2. OPERATIONAL MANDATE

- What this repo does: arif-sites is the public-facing web layer — Caddy routing, static sites, SSL, and reverse proxy to arifOS/GEOX MCP endpoints
- Upstream: arifOS kernel (MCP backend), GEOX (MCP backend), VPS (Hostinger)
- Downstream: Public users, MCP clients, geoscientists accessing tools via web

## 3. THE 999 SEAL (SESSION LOG)

- TIMESTAMP: 2026-04-24 03:19 UTC+8
- CLERK_ID: ANTIGRAVITY-CLERK
- SEAL_SUMMARY:
  - ARIF.md initialized — first metabolic kernel instance for arif-sites
  - Federation sync: ARIF.md now present in all 4 repos (arifOS, GEOX, WEALTH, arif-sites)
- VAULT_REF: pending commit

## 4. ACTIVE TOPOLOGY (MEMORY MAP)

- CRITICAL_FILES:
  - `Caddyfile` → Reverse proxy routing for all federation surfaces
  - `index.html` → arif-fazil.com landing page

- ENTRYPOINTS:
  - `caddy run` → Start reverse proxy
  - `curl https://arif-fazil.com` → Landing page health check

## 5. INTERRUPTS & FAULTS (BLOCKERS)

- HARD_BLOCK: VPS offline → all surfaces (arif-fazil.com, mcp.arif-fazil.com, geox.arif-fazil.com) returning 502/timeout

## 6. RECENT SCARS (W_scar)

- `[arif-sites had no ARIF.md]` → `[Federation sync applied]` → `[Every repo must have a metabolic kernel]`

## 7. EXECUTION BUFFER (COMMANDS)

| Command | Status | Context |
|---------|--------|---------|
| `caddy run` | ❌ | VPS offline |
| `git push origin main` | ✅ | Works |

## 8. PRIVILEGE ESCALATION (888 HOLD)

- [Q]: Should arif-sites be deployed to alternative hosting if Hostinger VPS not restored within 48h?
- [CONTEXT]: All federation surfaces depend on this VPS. Single point of failure. Ω₀ = 0.7

## 9. PIPELINE PREFETCH (NEXT MOVES)

- [ ] VPS restore → verify Caddy routing for all subdomains
- [ ] Audit Caddyfile routes against current federation surfaces

---

*🪙 GOLD SEAL | METABOLIC KERNEL v1.0 | arifOS AAA | 888 JUDGE VETO | DITEMPA BUKAN DIBERI*
*Readable by: single human · couple · company · institution · AI agent · machine · team · civilisation intelligence*
