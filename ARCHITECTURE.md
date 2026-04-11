# Trinity Sites Architecture

> **Ditempa Bukan Diberi** — Intelligence is forged, not given [ΔΩΨ | ARIF]

## Overview

The Trinity Sites form a **constitutional ecosystem** where three rings (SOUL/MIND/BODY) operate in concert under arifOS governance, with supporting infrastructure sites for documentation, MCP access, and domain-specific tools.

---

## Trinity Rings

```
                    ┌─────────────────────────────────────┐
                    │         ΔΩΨ TRINITY RINGS            │
                    │                                     │
    Ψ SOUL ─────────│─────────────────────────────────────│─── Human Anchor
                    │                                     │
    Ω MIND ─────────│── arifOS Constitutional Kernel ──────│── AI Governance
                    │                                     │
    Δ BODY ─────────│── AAA Protocol Suite ───────────────│── Tool Execution
                    │     (MCP + WebMCP + A2A)            │
                    │                                     │
                    └─────────────────────────────────────┘
```

### Ring 1: SOUL (Ψ) — Human Anchor
**Domain:** [arif-fazil.com](https://arif-fazil.com)  
**Stack:** React 19 + TypeScript + Vite + Tailwind CSS (shadcn/ui)  
**Role:** Personal identity layer, human grounding, institutional scar tissue

| File | Purpose |
|------|---------|
| `soul.json` | Identity metadata (name, role, affiliations) |
| `scar.json` | Institutional/personal scars (lessons learned) |
| `human.md` | Professional narrative (geoscientist @ PETRONAS) |

**Seals:** soul.json signed, VAULT999 active

---

### Ring 2: MIND (Ω) — Constitutional Kernel
**Domain:** [arifos.arif-fazil.com](https://arifos.arif-fazil.com)  
**Stack:** React 18 + TypeScript + Vite + Tailwind CSS  
**Role:** arifOS governance documentation, 13 Floors implementation, constitutional AI reference

**Core Resources:**
| Path | Purpose |
|------|---------|
| `/.well-known/arifOS/floors.json` | F1-F13 constitutional floor definitions |
| `/.well-known/arifOS/health.json` | System health and capability map |

**External Integration:**
- References: [arifOS GitHub](https://github.com/ariffazil/arifOS) (kernel source of truth)
- Health data sourced from: `arifosmcp.arif-fazil.com/health`

---

### Ring 3: BODY (Δ) — Protocol Execution
**Domain:** [aaa.arif-fazil.com](https://aaa.arif-fazil.com)  
**Stack:** Static HTML + JavaScript (lightweight, fast)  
**Role:** Protocol specifications (MCP, WebMCP, A2A), agent communication patterns

**Protocols:**
| Directory | Specification |
|-----------|---------------|
| `mcp/` | Model Context Protocol — tool bridging |
| `webmcp/` | WebMCP — browser-native governance via WebSocket |
| `a2a/` | Agent-to-Agent — tri-witness consensus protocol |

---

## Supporting Infrastructure

### MCP Gateway
**Domain:** [arifosmcp.arif-fazil.com](https://arifosmcp.arif-fazil.com)  
**Stack:** FastMCP (Python) + uvicorn + nginx  
**Role:** Constitutional AI gateway — 17 tools, 13 Floors, human sovereignty

**Endpoints:**
| Endpoint | Transport | Purpose |
|----------|-----------|---------|
| `/health` | HTTP/JSON | Live system status |
| `/mcp` | streamable-http | MCP tool calls |
| `/sse` | SSE | A2A agent connections |
| `/tools` | HTTP/JSON | Tool manifest |
| `/.well-known/mcp/server.json` | JSON | MCP server capabilities |

**Runtime:** Docker container on VPS port 8080 (HTTP) + 8089 (SSE)

---

### Forge Portal
**Domain:** [forge.arif-fazil.com](https://forge.arif-fazil.com)  
**Stack:** Static HTML + JavaScript  
**Role:** Agent deployment interface, CI/CD pipeline status

---

### WAW — State of the Machine
**Domain:** [waw.arif-fazil.com](https://waw.arif-fazil.com)  
**Stack:** Static HTML + JavaScript  
**Role:** Runtime state monitoring, agent workspace registry

---

### Ω-Wiki — Constitutional Knowledge Base
**Domain:** [wiki.arif-fazil.com](https://wiki.arif-fazil.com)  
**Stack:** Static HTML + JavaScript  
**Role:** arifOS documentation, governance references, decision records

---

### GEOX — Earth Witness
**Domain:** [geox.arif-fazil.com](https://geox.arif-fazil.com)  
**Stack:** FastMCP (Python) + uvicorn + React frontend  
**Role:** Geoscience domain tools, geological data access, earth science protocols

**Endpoints:**
| Endpoint | Purpose |
|----------|---------|
| `/health` | GEOX service health |
| `/mcp` | GEOX tool access |
| `/geox/*` | Geological data APIs |

---

## Connection Map

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         HUMAN (Arif)                                     │
│                    arif-fazil.com (SOUL)                                 │
└──────────────────────────────────────────────────────────────────────────┘
                    │
                    │ Trinity Navigation Links
                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                      arifOS MIND                                         │
│              arifos.arif-fazil.com                                        │
│    Constitutional 13 Floors • Governance Reference                        │
└──────────────────────────────────────────────────────────────────────────┘
                    │
                    │ References
                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                    AAA BODY                                              │
│              aaa.arif-fazil.com                                          │
│    MCP • WebMCP • A2A Protocol Specifications                            │
└──────────────────────────────────────────────────────────────────────────┘
                    │
                    │ Uses
        ┌───────────┴───────────┐
        ▼                       ▼
┌───────────────────┐   ┌───────────────────────────────────────────────┐
│  arifosmcp        │   │  geox                                          │
│  arif-fazil.com   │   │  geox.arif-fazil.com                          │
│  (MCP Gateway)    │   │  (Domain Tools)                                │
│  17 tools         │   │  Geoscience MCP                                │
│  Constitutional    │   │                                               │
└───────────────────┘   └───────────────────────────────────────────────┘
        │
        │ Powers
        ▼
┌───────────────────┐   ┌───────────────────┐   ┌───────────────────────────┐
│  forge            │   │  waw              │   │  wiki                     │
│  forge.arif-fazil │   │  waw.arif-fazil   │   │  wiki.arif-fazil.com     │
│  (Deploy)         │   │  (Runtime State)  │   │  (Knowledge Base)         │
└───────────────────┘   └───────────────────┘   └───────────────────────────┘
```

---

## Data Flow

### 1. Human → SOUL (Identity)
```
Human → arif-fazil.com → soul.json/human.md/scar.json
         ↓
    Trinity Nav → Ω MIND or Δ BODY
```

### 2. Agent → MIND (Constitutional Check)
```
Agent → arifos.arif-fazil.com/.well-known/arifOS/floors.json
        ↓
    Read F1-F13 definitions
        ↓
    Apply governance before action
```

### 3. Agent → BODY (Protocol Execution)
```
Agent → aaa.arif-fazil.com/mcp/ → Read MCP spec
      → aaa.arif-fazil.com/webmcp/ → Read WebMCP spec
      → aaa.arif-fazil.com/a2a/ → Read A2A spec
        ↓
    Execute via arifosmcp.arif-fazil.com/mcp
```

### 4. Agent → MCP Gateway (Tool Execution)
```
Agent → arifosmcp.arif-fazil.com/health (capability check)
      → arifosmcp.arif-fazil.com/mcp (tool invocation)
        ↓
    arifOS 13 Floors governance
        ↓
    Tool execution + VAULT999 sealing
```

---

## Security Boundaries

| Zone | Access | Governance |
|------|--------|------------|
| SOUL (arif-fazil.com) | Public | Static content, identity only |
| MIND (arifos.arif-fazil.com) | Public | Read-only reference |
| BODY (aaa.arif-fazil.com) | Public | Protocol specs, no exec |
| MCP Gateway | Authenticated | arifOS F1-F13 + 888_HOLD |
| GEOX | Authenticated | Domain-specific governance |
| Forge/WAW/Wiki | Restricted | Operational controls |

---

## Deployment Topology

```
Cloudflare (DNS + Pages)
     │
     ├── arif-fazil.com ──────► Cloudflare Pages (ariffazil project)
     │                              └── /sites/arif-fazil.com
     │
     ├── arifos.arif-fazil.com ──► Cloudflare Pages (arifos project)
     │                              └── /sites/arifos.arif-fazil.com
     │
     ├── aaa.arif-fazil.com ────► VPS: /opt/arifos/sites/aaa
     ├── arifosmcp.arif-fazil.com ► VPS: /opt/arifos/sites/arifosmcp
     ├── forge.arif-fazil.com ───► VPS: /opt/arifos/sites/forge
     ├── waw.arif-fazil.com ─────► VPS: /opt/arifos/sites/waw
     ├── wiki.arif-fazil.com ─────► VPS: /opt/arifos/sites/wiki
     │
     └── geox.arif-fazil.com ────► VPS: geox_eic container (port 8000)
```

---

## Shared Resources

### Design System
```css
https://arif-fazil.com/shared/design-system/tokens.css
```

### Trinity Navigation (Footer on all sites)
```html
<a href="https://arif-fazil.com">Ψ SOUL</a>
<a href="https://arifos.arif-fazil.com">Ω MIND</a>
<span>Δ BODY</span>
```

### MCP Server Discovery
```json
/.well-known/mcp/server.json
```

---

## Version & Seal Registry

| Site | Version | Seal | Last Verified |
|------|---------|------|--------------|
| arif-fazil.com | — | VAULT999 | 2026-04-11 |
| arifos.arif-fazil.com | — | VAULT999 | 2026-04-11 |
| aaa.arif-fazil.com | — | VAULT999 | 2026-04-11 |
| arifosmcp.arif-fazil.com | 2026.04.07 | SEAL | 2026-04-11 |
| forge.arif-fazil.com | — | VAULT999 | 2026-04-11 |
| waw.arif-fazil.com | — | VAULT999 | 2026-04-11 |
| wiki.arif-fazil.com | — | VAULT999 | 2026-04-11 |
| geox.arif-fazil.com | v2026.04.11 | DITEMPA | 2026-04-11 |

---

**Seal:** VAULT999 | **Status:** ACTIVE  
**Last Updated:** 2026-04-11