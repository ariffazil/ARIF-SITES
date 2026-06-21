# ⛔ SUPERSEDED by SITES.md — 2026-06-20. Do not update this file. See SITES.md for canonical routing truth.
# ⛔ This document is preserved for historical reference only.

# INVARIANTS.md — arif-sites Public Federation Surface
> **DITEMPA BUKAN DIBERI** — Federated Source of Truth.
> **Owner:** arif-sites
> **Last verified:** 2026-05-25

## Owns
- Public federation surface (arif-fazil.com)
- Federation manifests and agent cards
- Static site content for all subdomains
- MCP endpoint documentation

## Does NOT Own
- Kernel logic (→ arifOS)
- Execution shell (→ A-FORGE)
- GEOX/WEALTH/WELL computation (→ respective organs)

## Live Public Routes (VERIFIED 2026-05-25)

| Domain | Local target | Status |
|--------|-------------|--------|
| `arif-fazil.com` | static site | ✅ LIVE |
| `arifos.arif-fazil.com` | `127.0.0.1:8088` | ✅ LIVE |
| `geox.arif-fazil.com` | `127.0.0.1:18081` | ✅ LIVE |
| `wealth.arif-fazil.com` | `127.0.0.1:18082` | ✅ LIVE |
| `well.arif-fazil.com` | disabled | ⛔ 404 |
| `aaa.arif-fazil.com` | 127.0.0.1:3001 | ⛔ DEAD (AAA not live) |
| `apex.arif-fazil.com` | redirect to AAA | ✅ redirect |
| `hermes.arif-fazil.com` | redirect to AAA | ✅ redirect |
| `ollama.arif-fazil.com` | `127.0.0.1:11434` | ✅ LIVE |
| `vault.arif-fazil.com` | `127.0.0.1:8085` | ✅ LIVE |
| `status.arif-fazil.com` | `127.0.0.1:8086` | ✅ LIVE |
| `wiki.arif-fazil.com` | static | ✅ LIVE |

## Deprecated / Historical Routes

| Domain | Note |
|--------|------|
| `arifosmcp.arif-fazil.com` | Redirects to arifos.arif-fazil.com |
| `mcp.arif-fazil.com` | Partial MCP proxy, redirects to arifos |
| `travel.arif-fazil.com` | Redirects to arif-fazil.com |

## Forbidden Stale Assumptions
- ❌ Claiming arifOS is on `8080` — it is `8088`
- ❌ Claiming GEOX is on `8081` — it is `18081`
- ❌ Claiming WEALTH is disabled — it is LIVE on `18082`
- ❌ Claiming WELL is live — it is NOT DEPLOYED
- ❌ Listing `arifosmcp.arif-fazil.com` as primary — `arifos.arif-fazil.com` is canonical

## Required Health Checks
```bash
curl https://arifos.arif-fazil.com/health
curl https://geox.arif-fazil.com/health
curl https://wealth.arif-fazil.com/health
```

## Related Files
- `ROUTING_INVARIANTS.md` — canonical routing table
- `AGENT_KERNEL_START.md` — estate entry ritual
