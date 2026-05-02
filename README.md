# arifOS Trinity Network — arif-sites

> **Ditempa Bukan Diberi** — Intelligence is forged, not given
> **Seal:** 999 SEAL | **Version:** 2026.05.02-KANON

---

## Trinity Web Architecture (Target)

| Domain | Ring | Role |
|--------|------|------|
| **arif-fazil.com** | **Ψ SOUL** | Human anchor — identity, portfolio, `/000` genesis, `/999` validation |
| **arifos.arif-fazil.com** | **Ω MIND** | arifOS docs, tool registry, observatory |
| **aaa.arif-fazil.com** | **Δ BODY** | AAA + A-FORGE — agent workspace, operator cockpit entry |
| **mcp.arif-fazil.com** | **Ξ MIND** | Canonical machine/API MCP endpoint |

**Legacy:** `arifosmcp.arif-fazil.com` → 302 redirect to `mcp.arif-fazil.com`.

**Site Roles (Details):**
- **arif-fazil.com (SOUL):** Human site. `/000` (Genesis / Experiment), `/999` (Validation / zkPC).
- **arifos.arif-fazil.com (MIND):** arifOS docs + observatory.
- **aaa.arif-fazil.com (BODY):** AAA agent workspace + A-FORGE operator surface.
- **mcp.arif-fazil.com (MIND):** Canonical MCP endpoint (/mcp, /health, /tools, etc).
- **geox.arif-fazil.com (FIELD):** Lab GUI (not a Trinity pillar).

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
---

## Secondary / Field

| Hostname | Type | Role |
|----------|------|------|
| `geox.arif-fazil.com` | Dynamic | GEOX field/lab GUI |
| `wiki.arif-fazil.com` | Static | Constitutional wiki |
| `forge.arif-fazil.com` | Static | Forge CI/CD surface |

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
