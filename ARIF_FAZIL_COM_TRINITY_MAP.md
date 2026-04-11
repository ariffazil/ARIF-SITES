# ARIF-FAZIL.COM UNIFIED ARCHITECTURE MAP
## Trinity Sites — Complete Reference v4.0

**Seal**: `999_SEAL` | **Date**: 2026-04-11 | **Status**: OPERATIONAL

---

## I. THE TRINITY RINGS

```
        ╔══════════════════════════════════════════════════════════╗
        ║                    SOVEREIGN TRIAD                         ║
        ║                                                            ║
        ║              Ψ SOUL          Ω MIND          Δ BODY        ║
        ║          arif-fazil.com  arifos.arif-fazil.com  aaa...     ║
        ║               │                │                 │         ║
        ║               └────────────────┼─────────────────┘         ║
        ║                                │                           ║
        ║                         ◉ FORGE (unified)                  ║
        ║                                                            ║
        ╚══════════════════════════════════════════════════════════╝
```

---

## II. SITE INVENTORY

### Ψ SOUL — `arif-fazil.com`
| Attribute | Value |
|-----------|-------|
| **Purpose** | Human anchor / Personal brand / Field geoscientist identity |
| **Theme** | Igneous Red + Fractal + Jagged |
| **Colors** | `#FF3333` (primary), `#3366FF` (strata), `#FFCC00` (discovery) |
| **Geometry** | Jagged clip-paths, polygon edges |
| **Motion** | Fractal noise, drift particles |
| **Typography** | Space Grotesk / System sans |
| **Tech Stack** | React + Vite + Framer Motion |
| **Deployment** | Docker → arifos_landings container |
| **Key Features** | Biological age clock, stratigraphic canvas, discovery cards |
| **Identity** | **The Human** — listening to the earth |

### Ω MIND — `apex.arif-fazil.com` (was `arifos.arif-fazil.com`)
| Attribute | Value |
|-----------|-------|
| **Purpose** | arifOS constitutional kernel documentation |
| **Theme** | Cyan monochrome / Machine precision / Grid |
| **Colors** | `#00D4AA` (primary), `#008866` (secondary) |
| **Geometry** | Rectilinear, grid-based, monospace aesthetics |
| **Motion** | Precise snapping, calculated transitions |
| **Typography** | JetBrains Mono / Monospace |
| **Tech Stack** | Static HTML (VPS + nginx) |
| **Deployment** | VPS: /opt/arifos/sites/apex.arif-fazil.com |
| **Key Features** | 13 floors documentation, F1-F13 principles, constitutional API |
| **Identity** | **The Machine** — constitutional governance |

> **Note:** `arifos.arif-fazil.com` (Cloudflare Pages) was **deleted 2026-04-11**. Content merged into:
> - `apex.arif-fazil.com` — Primary constitutional floor specs
> - `arifosmcp.arif-fazil.com/#constitution` — Kernel integration with MCP

### Δ BODY — `aaa.arif-fazil.com`
| Attribute | Value |
|-----------|-------|
| **Purpose** | AAA Wire — MCP/WebMCP/A2A protocol specifications |
| **Theme** | Gold/Amber / Organic / Rounded / Warm |
| **Colors** | `#D4A853` (gold), `#C4791A` (amber), `#E3B341` (highlight) |
| **Geometry** | Rounded corners, soft edges, warm shadows |
| **Motion** | Smooth easing, organic curves |
| **Typography** | Inter / Sans-serif |
| **Tech Stack** | HTML + Tailwind CDN + Vanilla JS |
| **Deployment** | Docker → arifos_landings container |
| **Key Features** | Protocol specs, A2A architecture, MCP endpoints |
| **Identity** | **The Action** — protocols, execution, deployment |

---

## III. INFRASTRUCTURE SITES

### arifOS MCP Dashboard — `arifosmcp.arif-fazil.com`
| Attribute | Value |
|-----------|-------|
| **Purpose** | Live MCP server health & tool inventory |
| **Type** | Dynamic (API-driven) |
| **Health Endpoint** | `https://arifosmcp.arif-fazil.com/health` |
| **Tools Count** | 33 tools, 6 substrates, 11 providers |
| **Tech Stack** | HTML + Vanilla JS (fetches live data) |
| **Deployment** | Served via arifos_landings nginx, proxied to arifosmcp:8080 |
| **Key Features** | Trinity grid, thermodynamic metrics, SEAL badge |

### GEOX — `geox.arif-fazil.com`
| Attribute | Value |
|-----------|-------|
| **Purpose** | Earth Intelligence Core (GEOX EIC) GUI |
| **Theme** | Deep space / Geoscience data |
| **Colors** | `#C4791A` (gold), `#4A9E8E` (teal) |
| **Tech Stack** | React + Docker |
| **Deployment** | geox_gui container via Traefik |
| **MCP Server** | geox_eic on :8000 |

### FORGE — `forge.arif-fazil.com`
| Attribute | Value |
|-----------|-------|
| **Purpose** | AF-FORGE agent workbench (under construction) |
| **Status** | Placeholder / Future development |
| **Identity** | Unified entry point |

---

## IV. THEORY OF ANOMALOUS CONTRAST

### Visual Differentiation Matrix

| Dimension | SOUL (Ψ) | MIND (Ω) | BODY (Δ) |
|-----------|----------|----------|----------|
| **Primary** | Red `#FF3333` | Cyan `#00D4AA` | Gold `#D4A853` |
| **Secondary** | Blue `#3366FF` | Teal `#008866` | Amber `#C4791A` |
| **Accent** | Yellow `#FFCC00` | Mint `#00FFAA` | Light Gold `#E3B341` |
| **Shape** | Jagged/Polygon | Rectilinear/Grid | Rounded/Organic |
| **Motion** | Fractal drift | Precise snap | Smooth ease |
| **Font** | Space Grotesk | JetBrains Mono | Inter |
| **Persona** | Human/Igneous | Machine/Precise | Warm/Actionable |
| **Metaphor** | Strata/Earth | Code/Governance | Wire/Connection |

### Trinity Symbol Usage
- **Ψ** (Psi) — SOUL — The psyche, the human
- **Ω** (Omega) — MIND — The end, the ultimate system
- **Δ** (Delta) — BODY — Change, the actionable

---

## V. TECHNICAL ARCHITECTURE

### Network Topology
```
┌─────────────────────────────────────────────────────────────┐
│                        INTERNET                              │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    │  Cloudflare  │
                    │   (DNS/SSL)  │
                    └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    │    Traefik   │
                    │  (Reverse    │
                    │   Proxy)     │
                    └──────┬──────┘
                           │
          ┌────────────────┼────────────────┐
          │                │                │
    ┌─────┴─────┐    ┌────┴────┐     ┌─────┴──────┐
    │arifos_    │    │geox_gui │     │arifosmcp   │
    │landings   │    │(:3000)  │     │(:8080)     │
    │(nginx)    │    └─────────┘     └────────────┘
    └─────┬─────┘
          │
    ┌─────┴─────┬─────────────┬─────────────┐
    │           │             │             │
arif-      arifos.       aaa.         arifosmcp.
fazil.com  arif-fazil.com arif-fazil.com arif-fazil.com
(SOUL)     (MIND)         (BODY)        (Dashboard)
```

### Docker Containers
| Container | Image | Ports | Network |
|-----------|-------|-------|---------|
| arifos_landings | nginx:alpine | 80 | arifos_core_network |
| geox_gui | geox/gui:latest | 80 | arifos_core_network, geox_command_center |
| geox_eic | geox/eic:latest | 8000 | geox_command_center |
| arifosmcp | arifos/mcp:latest | 8080 | arifos_core_network |
| traefik | traefik:v3 | 80, 443 | arifos_core_network |

### File System Map
```
/root/arif-sites/
├── sites/
│   ├── arif-fazil.com/          # Ψ SOUL (React + Vite)
│   │   ├── src/
│   │   │   ├── App.tsx          # Main component
│   │   │   └── constitution/
│   │   │       └── tokens.ts    # Identity data
│   │   ├── dist/                # Built assets
│   │   └── package.json
│   ├── arifos.arif-fazil.com/   # Ω MIND (React + Vite)
│   ├── aaa.arif-fazil.com/      # Δ BODY (HTML + Tailwind)
│   └── arifosmcp.arif-fazil.com/# MCP Dashboard (HTML)
├── arifOS/
│   └── infrastructure/
│       └── nginx/
│           └── arifos_landings.conf  # vhost config
└── GEOX/
    └── docker-compose.yml       # GEOX stack
```

---

## VI. API ENDPOINTS

### MCP Server (`arifosmcp.arif-fazil.com`)
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/health` | GET | Health status, tools, substrates, providers |
| `/tools` | GET | Tool inventory (33 tools) |
| `/mcp` | POST | MCP protocol endpoint |

### Health Response Schema
```json
{
  "status": "healthy",
  "tools_loaded": 33,
  "substrates": { "git": "configured", ... },
  "providers": { "openai": "configured", ... },
  "thermodynamic": { "verdict": "999_SEAL", ... },
  "timestamp": "ISO8601"
}
```

---

## VII. DEPLOYMENT PROCEDURES

### Deploy SOUL Ring (arif-fazil.com)
```bash
cd /root/arif-sites/sites/arif-fazil.com
npm run build
docker exec arifos_landings rm -rf /usr/share/nginx/html/arif-fazil.com/*
docker cp dist/. arifos_landings:/usr/share/nginx/html/arif-fazil.com/
```

### Deploy MIND Ring (apex.arif-fazil.com)
```bash
# DEPREATED: arifos.arif-fazil.com Cloudflare Pages deleted 2026-04-11
# MIND content now at apex.arif-fazil.com (VPS) and arifosmcp.arif-fazil.com
cd /root/arif-sites/sites/apex.arif-fazil.com
# Static HTML - no build needed
docker exec arifos_landings rm -rf /usr/share/nginx/html/apex.arif-fazil.com/*
docker cp . arifos_landings:/usr/share/nginx/html/apex.arif-fazil.com/
```

### Deploy BODY Ring (aaa.arif-fazil.com)
```bash
cd /root/arif-sites/sites/aaa.arif-fazil.com
# HTML files - no build needed
docker exec arifos_landings rm -rf /usr/share/nginx/html/aaa.arif-fazil.com/*
docker cp . arifos_landings:/usr/share/nginx/html/aaa.arif-fazil.com/
```

### Deploy MCP Dashboard
```bash
cd /root/arif-sites/sites/arifosmcp.arif-fazil.com
# HTML files - no build needed
docker exec arifos_landings rm -rf /usr/share/nginx/html/arifosmcp.arif-fazil.com/*
docker cp . arifos_landings:/usr/share/nginx/html/arifosmcp.arif-fazil.com/
```

---

## VIII. CONSTITUTIONAL PRINCIPLES

All sites operate under **arifOS F1-F13**:

| Floor | Principle | Application |
|-------|-----------|-------------|
| F1 Amanah | No irreversible action without SEAL | All deployments require 999_SEAL |
| F2 Truth | τ ≥ 0.99 confidence | Health checks verify status |
| F13 Khilafah | Human sovereignty | Trinity navigation always visible |

**Motto**: *Ditempa Bukan Diberi* — Forged, Not Given

---

## IX. AGENT CONTEXT CHEAT SHEET

### Quick Reference Card
```
┌────────────────────────────────────────────────────────────┐
│              ARIF-FAZIL.COM AGENT CHEAT SHEET              │
├────────────────────────────────────────────────────────────┤
│  Ψ SOUL   → arif-fazil.com      → React, Red, Jagged      │
│  Ω MIND   → apex.arif-fazil.com  → HTML, Cyan, Grid       │
│  Δ BODY   → aaa.arif-fazil.com    → HTML, Gold, Rounded   │
├────────────────────────────────────────────────────────────┤
│  INFRASTRUCTURE:                                           │
│  MCP Dashboard → arifosmcp.arif-fazil.com (live API)      │
│  GEOX          → geox.arif-fazil.com (Traefik routed)     │
├────────────────────────────────────────────────────────────┤
│  DEPLOYMENT:                                               │
│  • Build React apps: npm run build                         │
│  • Deploy: docker cp to arifos_landings container         │
│  • Verify: curl https://<site> | head                     │
├────────────────────────────────────────────────────────────┤
│  NAVIGATION FOOTER:                                        │
│  All sites share unified Trinity nav (Ψ|Ω|Δ + FORGE)      │
└────────────────────────────────────────────────────────────┘
```

### Decision Tree
```
Need to update SOUL (human identity)?
  └─→ /sites/arif-fazil.com/ → React + Red theme

Need to update MIND (arifOS docs)?
  └─→ /sites/arifos.arif-fazil.com/ → React + Cyan theme

Need to update BODY (protocols)?
  └─→ /sites/aaa.arif-fazil.com/ → HTML + Gold theme

Need to check system health?
  └─→ curl https://arifosmcp.arif-fazil.com/health

Need to update navigation?
  └─→ All sites have inline <nav id="rn"> in index.html
```

---

## X. STATUS & SEAL

| Component | Status | Last Updated |
|-----------|--------|--------------|
| SOUL (arif-fazil.com) | ✅ OPERATIONAL | 2026-04-11 |
| MIND (apex.arif-fazil.com) | ✅ OPERATIONAL | 2026-04-11 |
| MIND (arifos.arif-fazil.com) | ❌ DELETED | 2026-04-11 |
| BODY (aaa.arif-fazil.com) | ✅ OPERATIONAL | 2026-04-11 |
| MCP Dashboard | ✅ OPERATIONAL | 2026-04-11 |
| GEOX | ✅ OPERATIONAL | 2026-04-11 |
| Traefik | ✅ OPERATIONAL | 2026-04-11 |

**999_SEAL VERDICT**: ALL SYSTEMS OPERATIONAL

---

*Document sealed under 999_SEAL protocol*
*Version 4.0 | Anomalous Contrast Theory applied*
