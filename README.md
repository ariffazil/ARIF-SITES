# arifOS Trinity Network — arif-sites

> **Ditempa Bukan Diberi** — Intelligence is forged, not given
> **Seal:** 999 SEAL | **Version:** 2026.05.02-KANON

---

## Trinity Web Architecture

Three flagship surfaces. Domain organs remain internal.

| Ring | Domain | Role |
|------|--------|------|
| **Ψ SOUL** | `arif-fazil.com` | Human anchor — identity, portfolio, `/000` genesis, `/999` validation |
| **Ω MIND** | `arifos.arif-fazil.com` | arifOS docs, tool registry, observatory |
| **Ξ MIND** | `mcp.arif-fazil.com` | Canonical MCP API endpoint — `/mcp`, `/health`, `/tools`, `/.well-known/agent.json` |
| **Δ BODY** | `aaa.arif-fazil.com` | AAA + A-FORGE — agent workspace, operator cockpit |

**Legacy:** `arifosmcp.arif-fazil.com` → 302 redirect to `mcp.arif-fazil.com`. Do not use.

**Domain organs** (WELL, WEALTH, GEOX) are internal services behind arifOS and A-FORGE. No first-class public hostnames yet. Narrative surfaces: `/labs/well`, `/labs/wealth`, `/labs/geox` on flagship domains.

---

## Repository

This repo (`ariffazil/arif-sites`) is the **single GitHub source** for all Cloudflare Pages static surfaces. Each Pages project points here with its own output directory.

| Pages Project | Domain | Output Directory |
|---------------|--------|------------------|
| `arif-fazil` | `arif-fazil.com` | `sites/arif-fazil.com/` |
| `arifos-docs` | `arifos.arif-fazil.com` | `sites/arifos.arif-fazil.com/` |
| `aaa-agents` | `aaa.arif-fazil.com` | `sites/aaa.arif-fazil.com/` |

Dynamic services (MCP, GEOX GUI) deploy via VPS Docker and are routed through Caddy.

---

## Repo Structure

```
/sites/          — Public frontends (Static, hostname-aligned)
  arif-fazil.com/        Ψ SOUL
  arifos.arif-fazil.com/  Ω MIND docs
  aaa.arif-fazil.com/     Δ BODY
  forge.arif-fazil.com/   Forge CI/CD surface
  wiki.arif-fazil.com/    Constitutional wiki
  geox.arif-fazil.com/    GEOX field/lab GUI
/apps/           — Dynamic product UIs (VPS Docker)
/services/        — Backend MCP kernels (VPS)
/infra/           — Constitutional manifests, domains map, deployment configs
/archive/         — Legacy content (preserved, not active)
```

---

## Deployment

- **Static:** Cloudflare Pages — auto-deploys on `git push main`
- **Dynamic:** VPS Docker + Caddy reverse proxy
- Target mapping: `/infra/domains.yaml`

---

## Cloudflare Pages

All static sites deploy from **this repo** (`ariffazil/arif-sites`), branch `main`.

| Domain | Build Output |
|---------|-------------|
| `arif-fazil.com` | `sites/arif-fazil.com/` |
| `arifos.arif-fazil.com` | `sites/arifos.arif-fazil.com/` |
| `aaa.arif-fazil.com` | `sites/aaa.arif-fazil.com/` |
| `forge.arif-fazil.com` | `sites/forge.arif-fazil.com/` |
| `wiki.arif-fazil.com` | `sites/wiki.arif-fazil.com/` |

Domain routing and target folders are declared in `/infra/domains.yaml`.

---

## Active Domains

| Ring | Hostname | Type | Role |
|------|----------|------|------|
| **Ψ SOUL** | `arif-fazil.com` | Static | Human anchor, portfolio |
| **Ω MIND** | `arifos.arif-fazil.com` | Static | arifOS docs + observatory |
| **Ξ MIND** | `mcp.arif-fazil.com` | Dynamic | Canonical MCP API |
| **Δ BODY** | `aaa.arif-fazil.com` | Static | AAA + A-FORGE surface |
| **Φ FIELD** | `geox.arif-fazil.com` | Dynamic | GEOX field/lab GUI |

---

## Deprecated / Archived

| Hostname | Status |
|----------|--------|
| `arifosmcp.arif-fazil.com` | **Deprecated** → 302 redirect to `mcp.arif-fazil.com` |
| `apex.arif-fazil.com` | Legacy — superseded by `arifos.arif-fazil.com` |
| `waw.arif-fazil.com` | Archived — absorbed into BODY/forge surfaces |
| `wawa.arif-fazil.com` | Archived — absorbed into BODY/forge surfaces |

---

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for full system design, connection maps, and data flow.

---

**DITEMPA BUKAN DIBERI — 999 SEAL ALIVE**
