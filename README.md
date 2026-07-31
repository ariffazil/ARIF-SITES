<!-- SOT-MANIFEST
federation_release: v2026.07.31
last_verified: 2026-07-31T03:39:00Z
live_commit: 9d59647
scope: /root/arif-sites → ariffazil/arif-fazil.com
epistemic_status: OBS
truth_rule: live git push + Caddy VPS deploy + Cloudflare Pages beat any static prose
doctrine: Satu domain. Satu web surface. Banyak organ, tetap bersempadan.
-->

# 🌐 arif-fazil.com — Unified Sovereign Web Surface & Public Cockpit

[![Site Integrity](https://github.com/ariffazil/arif-sites/actions/workflows/audit.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-sites/actions)
[![Build — Trinity Sites](https://github.com/ariffazil/arif-sites/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-sites/actions)
[![Playwright Audit](https://github.com/ariffazil/arif-sites/actions/workflows/playwright-audit.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-sites/actions)
[![License: AGPL-3.0](https://img.shields.io/badge/License-AGPL--3.0-blue.svg)](./LICENSE)

**arif-fazil.com** (formerly `arif-sites`) is the **Unified Public Surface** of the arifOS Federation. It consolidates all 6 organ UIs, public MCP connection guides, documentation observatories, and executive dashboards under a single sovereign domain with zero broken links and strict path isolation.

---

## 🏛️ One Domain Architecture & Path Structure

All federation organs expose user interfaces via unified paths under `https://arif-fazil.com`. Legacy subdomains are preserved via HTTP 301 redirects:

```mermaid
graph TB
    subgraph Edge Layer [☁️ Cloudflare Edge & Origin CA]
        CF[Cloudflare Pages & DNS<br/>Auto-deploy on main push]
    end

    subgraph Reverse Proxy [🔄 Caddy Proxy :443]
        CADDY[Caddy Web Server]
    end

    subgraph Unified Web Surface [🖥️ VPS Public Routes]
        ROOT[arif-fazil.com/<br/>React 19 Cockpit SPA]
        ARIFOS[/arifos/ — Observatory & Docs]
        AAA[/aaa/ — Control Plane & A2A]
        GEOX[/geox/ — Earth Intelligence Lab]
        WEALTH[/wealth/ — Capital Workbench]
        WELL[/well/ — Substrate Readiness]
        FORGE[/forge/ — Execution Surface]
        MCP[/mcp/ — MCP Connection & Apps]
        WIKI[/wiki/ — Constitutional Wiki]
    end

    CF --> CADDY
    CADDY --> ROOT
    CADDY --> ARIFOS
    CADDY --> AAA
    CADDY --> GEOX
    CADDY --> WEALTH
    CADDY --> WELL
    CADDY --> FORGE
    CADDY --> MCP
    CADDY --> WIKI
```

### Path Inventory

- `/` — Flagship Sovereign Cockpit (React 19 + Vite 8 SPA)
- `/arifos/` — Constitutional Kernel Observatory & Specification
- `/aaa/` — A2A Institution & Control Plane Interface
- `/geox/` — Earth Intelligence & Subsurface Workspace Canvas
- `/wealth/` — Capital Compute & Portfolio Risk Dashboard
- `/well/` — Human Readiness & Vitality Interface
- `/forge/` — Governed Execution & Build Surface
- `/mcp/` — Federation MCP Endpoint Discovery & App Canvas

---

## 🛠️ Build & Deployment Workflow

```bash
# 1. Clone & setup
git clone https://github.com/ariffazil/arif-fazil.com.git /root/arif-fazil.com
cd /root/arif-fazil.com

# 2. Build flagship React 19 Cockpit
cd sites/arif-fazil.com && npm install && npm run build

# 3. VPS Deployment via Caddy sync script
./deploy-vps.sh
```

---

## 🔗 Federation Architecture & Navigation

Every organ maintains distinct boundaries and capabilities within the **arifOS Federation**:

| Organ | Domain Role | Port | Repo | Live MCP | Health Witness | Machine Spec |
|:---|:---|:---:|:---|:---|:---|:---|
| **arifOS** | Constitutional Kernel & Judge | 8088 | [repo](https://github.com/ariffazil/arifos) | [mcp](https://mcp.arif-fazil.com/mcp) | [health](https://arifos.arif-fazil.com/health) | [llms.txt](https://arifos.arif-fazil.com/llms.txt) |
| **A-FORGE** | Governed Execution Engine | 7071 / 7072 | [repo](https://github.com/ariffazil/A-FORGE) | [mcp](https://forge.arif-fazil.com/mcp) | [health](https://forge.arif-fazil.com/health) | [llms.txt](https://forge.arif-fazil.com/llms.txt) |
| **AAA** | Institution, Control Plane & A2A | 3001 | [repo](https://github.com/ariffazil/AAA) | — | [health](https://aaa.arif-fazil.com/health) | [llms.txt](https://aaa.arif-fazil.com/llms.txt) |
| **GEOX** | Earth Intelligence (Subsurface) | 8081 | [repo](https://github.com/ariffazil/GEOX) | [mcp](https://geox.arif-fazil.com/mcp) | [health](https://geox.arif-fazil.com/health) | [llms.txt](https://geox.arif-fazil.com/llms.txt) |
| **WEALTH** | Capital Intelligence (Compute) | 18082 | [repo](https://github.com/ariffazil/WEALTH) | [mcp](https://wealth.arif-fazil.com/mcp) | [health](https://wealth.arif-fazil.com/health) | [llms.txt](https://wealth.arif-fazil.com/llms.txt) |
| **WELL** | Vitality & Readiness Guard | 18083 | [repo](https://github.com/ariffazil/WELL) | [mcp](https://well.arif-fazil.com/mcp) | [health](https://well.arif-fazil.com/health) | [llms.txt](https://well.arif-fazil.com/llms.txt) |
| **HERMES** | Multi-Modal Bridge & Telegram Relay | 8644 | [repo](https://github.com/ariffazil/HERMES) | — | — | — |

**Public Domain:** [arif-fazil.com](https://arif-fazil.com) · **Federation Root:** [arifos.arif-fazil.com](https://arifos.arif-fazil.com)

---

## 📜 License & Sovereignty

- **License:** GNU Affero General Public License v3.0 (**AGPL-3.0**).
- **Sovereign Authority:** **Muhammad Arif bin Fazil** (F13 SOVEREIGN).

---

*DITEMPA BUKAN DIBERI — One domain, one surface, immutable truth.*

