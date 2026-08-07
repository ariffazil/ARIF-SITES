<!-- SOT-MANIFEST
federation_release: v2026.08.04
last_verified: 2026-08-04T20:23:33Z
live_commit: pending
scope: /root/arif-fazil.com → ariffazil/arif-fazil.com
epistemic_status: OBS
truth_rule: live git push + Cloudflare deploy beat any static count in prose
doctrine: Satu domain. Satu web surface. Banyak organ, tetap bersempadan.
-->

# 🌐 arif-fazil.com — Unified Federation Web Surface

[![Site Integrity](https://github.com/ariffazil/arif-fazil.com/actions/workflows/audit.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-fazil.com/actions)
[![Build](https://github.com/ariffazil/arif-fazil.com/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-fazil.com/actions)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](./LICENSE)

> **arif-fazil.com is the surface. One domain. Many organs. One truth.**
> **DITEMPA BUKAN DIBERI — Forged, Not Given.**

**arif-fazil.com** is the unified public **human world model** for the arifOS Federation — one entry point for humans, agents, and scrapers.

**Organ domains** (`geox` · `wealth` · `well` · `mcp` · `arifos` …) are **agent doors and MCP edges**, not rival human home pages. Link them from machine footer / Federation / Connect; do not put them on the primary nav. Full map: [`docs/AGENTIC_WEB_WORLD_MODEL.md`](./docs/AGENTIC_WEB_WORLD_MODEL.md). Narrative organ paths stay under the apex (`/arifos/`, `/geox/`, …). Legacy subdomains redirect or serve protocol doors — never delete, never break.

---

## 🏛️ What This Repo Owns

This repo owns the **SURFACE** — the observable face of every federation organ:

```
One domain. One web surface. All federation organs exposed as paths.
```

```mermaid
graph TB
    subgraph EDGE [☁️ Cloudflare Edge]
        CF[Cloudflare Pages<br/>Auto-deploy on git push]
    end
    CF -->|routes| CADDY[🔄 Caddy :443<br/>Reverse Proxy]
    subgraph VPS [🖥️ VPS af-forge]
        CADDY --> ROOT[arif-fazil.com/<br/>React 19 Cockpit]
        CADDY --> ARIFOS[/arifos/ — Observatory]
        CADDY --> AAA[/aaa/ — Control Plane]
        CADDY --> GEOX[/geox/ — Earth Lab]
        CADDY --> WEALTH[/wealth/ — Capital]
        CADDY --> WELL[/well/ — Readiness]
        CADDY --> FORGE[/forge/ — Execution]
        CADDY --> MCP[/mcp/ — Gateway]
        CADDY --> WIKI[/wiki/ — Knowledge]
    end
```

---

## 🌐 Unified Path Structure

```
https://arif-fazil.com/
├── /               ← React 19 Cockpit (SPA)
├── /000/           ← Genesis / Identity
├── /999/           ← Seal Verification
├── /arifos/        ← Observatory & Proof
├── /aaa/           ← Control Plane Cockpit
├── /geox/          ← Earth Intelligence Lab
├── /wealth/        ← Capital Intelligence
├── /well/          ← Human Readiness
├── /forge/         ← Execution Surface
├── /mcp/           ← MCP Connection Guide
├── /wiki/          ← Constitutional Wiki
├── /oil/ /gas/ /gold/ ← Commodity Dashboards
├── /earth/         ← Earth Evidence
├── /essays/        ← Sovereign Essays
├── /federation/    ← Federation State
├── /proof/         ← Proof Pack
└── /_shared/       ← Design System & Assets
```

---

## 🔄 Legacy Subdomain Redirects

| Legacy | → | Unified |
|--------|---|---------|
| `arifos.arif-fazil.com` | → | `/arifos/` |
| `aaa.arif-fazil.com` | → | `/aaa/` |
| `geox.arif-fazil.com` | → | `/geox/` |
| `wealth.arif-fazil.com` | → | `/wealth/` |
| `well.arif-fazil.com` | → | `/well/` |
| `forge.arif-fazil.com` | → | `/forge/` |
| `mcp.arif-fazil.com` | → | `/mcp/` |
| `wiki.arif-fazil.com` | → | `/wiki/` |

---

## 🏗️ Repository Structure

```
arif-fazil.com/
├── sites/                    # Static frontends
│   ├── arif-fazil.com/       # React 19 + Vite 8 Cockpit
│   ├── aaa.arif-fazil.com/   # Control Plane surface
│   ├── arifos.arif-fazil.com/ # Observatory docs
│   ├── geox.arif-fazil.com/  # Earth Lab GUI
│   ├── wealth.arif-fazil.com/ # Capital surface
│   ├── wiki.arif-fazil.com/  # Constitutional wiki
│   └── shared/               # Design system assets
├── apps/                     # Dynamic product UIs
├── infra/                    # Constitutional manifests, domain routing
├── scripts/                  # Deployment & audit scripts
├── deploy-vps.sh             # VPS deployment script
└── verify-pages.sh           # ⛔ Deploy gate — must pass before seal
```

---

## 🏛️ Federation Navigation

| Organ | Role | Port | Repo | MCP | Health | LLMs |
|:---|:---|:---:|:---|:---|:---|:---|
| **⚖️ arifOS** | Constitutional Kernel — judges, seals | 8088 | [repo](https://github.com/ariffazil/arifos) | [mcp](https://mcp.arif-fazil.com/mcp) | [health](https://arifos.arif-fazil.com/health) | [llms.txt](https://arifos.arif-fazil.com/llms.txt) |
| **⚒️ A-FORGE** | Execution Engine — builds, deploys | 7071/72 | [repo](https://github.com/ariffazil/A-FORGE) | [mcp](https://forge.arif-fazil.com/mcp) | [health](https://forge.arif-fazil.com/health) | [llms.txt](https://forge.arif-fazil.com/llms.txt) |
| **🏛️ AAA** | Control Plane — A2A gateway, cockpit | 3001 | [repo](https://github.com/ariffazil/AAA) | — | [health](https://aaa.arif-fazil.com/health) | [llms.txt](https://aaa.arif-fazil.com/llms.txt) |
| **🌍 GEOX** | Earth Intelligence — seismic, wells | 8081 | [repo](https://github.com/ariffazil/GEOX) | [mcp](https://geox.arif-fazil.com/mcp) | [health](https://geox.arif-fazil.com/health) | [llms.txt](https://geox.arif-fazil.com/llms.txt) |
| **💰 WEALTH** | Capital Intelligence — NPV, risk | 18082 | [repo](https://github.com/ariffazil/WEALTH) | [mcp](https://wealth.arif-fazil.com/mcp) | [health](https://wealth.arif-fazil.com/health) | [llms.txt](https://wealth.arif-fazil.com/llms.txt) |
| **🫀 WELL** | Vitality Guard — human readiness | 18083 | [repo](https://github.com/ariffazil/WELL) | [mcp](https://well.arif-fazil.com/mcp) | [health](https://well.arif-fazil.com/health) | [llms.txt](https://well.arif-fazil.com/llms.txt) |
| **🔮 HERMES** | Multi-Modal Bridge — Telegram relay | 8644 | [repo](https://github.com/ariffazil/HERMES) | — | — | — |
| **🌐 arif-fazil.com** | Public Web Surface — one domain | 443 | [repo](https://github.com/ariffazil/arif-fazil.com) | — | [verify](https://arif-fazil.com/999/verify) | — |

---

## 🏛️ Separation of Powers

| Layer | Role | Can | Cannot |
|-------|------|-----|--------|
| **ARIF** | Sovereign | Veto, approve, decide | Be overridden |
| **arifOS** | Judge | Issue SEAL/HOLD/VOID/SABAR | Execute mutations |
| **AAA** | State / Cockpit | Display, route, queue, register | Judge, execute, seal |
| **Domain Organs** | Witnesses | Compute and reflect evidence | Decide alone |
| **A-FORGE** | Executor | Build, deploy, mutate | Self-authorize |
| **arif-fazil.com** | Public Surface | Host surfaces, route domains | Adjudicate, compute |
| **VAULT999** | Ledger | Record immutable seals | Edit or delete history |

> AAA routes and displays. arifOS judges. Domain organs witness. A-FORGE executes. arif-fazil.com hosts the surface. VAULT999 records. ARIF decides.

---

## 📜 Sovereignty & License

- **License:** GNU Affero General Public License v3.0 (**AGPL-3.0**)
- **Sovereign:** **Muhammad Arif bin Fazil** (F13 SOVEREIGN)

> *DITEMPA BUKAN DIBERI — Forged, Not Given.*  
> *Satu domain. Satu web surface. Banyak organ, tetap bersempadan. 999 SEAL ALIVE.*
