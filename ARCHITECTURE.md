# Trinity Sites — Unified Architecture Map

> **Ditempa Bukan Diberi** — Intelligence is forged, not given [ΔΩΨ | ARIF]  
> **Seal:** VAULT999 | **Version:** 2026.04.11

---

## Overview

The Trinity Sites form a **constitutional ecosystem** where three rings (SOUL/MIND/BODY) operate under arifOS governance, with supporting infrastructure for MCP access, domain-specific tools, and operational dashboards.

```
                          ┌─────────────────────────────────────────────────┐
                          │                 ΔΩΨ TRINITY RINGS                │
                          │                                                  │
    Ψ SOUL ──────────────│─────────────────────────────────────────────────│── Human Anchor
                          │                                                  │
    Ω MIND ──────────────│── Constitutional Kernel (F1-F13) ───────────────│── AI Governance
                          │                                                  │
    Δ BODY ──────────────│── Protocol Execution (MCP/WebMCP/A2A) ──────────│── Tool Execution
                          │                                                  │
                          └─────────────────────────────────────────────────┘
```

---

## Active Sites (8 Total)

| Ring | Domain | Status | Purpose |
|------|--------|--------|---------|
| **Ψ SOUL** | [arif-fazil.com](https://arif-fazil.com) | ✅ LIVE | Human anchor, identity, portfolio |
| **Ω MIND** | [apex.arif-fazil.com](https://apex.arif-fazil.com) | ✅ LIVE | Constitutional 13 Floors, governance |
| **Δ BODY** | [aaa.arif-fazil.com](https://aaa.arif-fazil.com) | ✅ LIVE | MCP/WebMCP/A2A protocol specs |
| **Ξ MCP** | [arifosmcp.arif-fazil.com](https://arifosmcp.arif-fazil.com) | ✅ LIVE | Constitutional MCP gateway, 17 tools |
| **Φ GEOX** | [geox.arif-fazil.com](https://geox.arif-fazil.com) | ✅ LIVE | Geoscience domain tools |
| **◉ FORGE** | [forge.arif-fazil.com](https://forge.arif-fazil.com) | ✅ LIVE | Agent deployment, CI/CD |
| **◎ WAW** | [waw.arif-fazil.com](https://waw.arif-fazil.com) | ✅ LIVE | Runtime state monitoring |
| **Ω WIKI** | [wiki.arif-fazil.com](https://wiki.arif-fazil.com) | ✅ LIVE | Constitutional knowledge base |

---

## Trinity Rings (Core)

### Ring 1: SOUL (Ψ) — Human Anchor
**Domain:** [arif-fazil.com](https://arif-fazil.com)  
**Stack:** React 19 + TypeScript + Vite + Tailwind CSS  
**Hosting:** VPS nginx (Cloudflare Pages for static assets)  
**Role:** Personal identity, human grounding, institutional scar tissue

**Key Files:**
- `soul.json` — Identity metadata
- `human.md` — Professional narrative (geoscientist @ PETRONAS)
- `scar.json` — Institutional lessons learned

**Trinity Navigation:** [Ω MIND](https://apex.arif-fazil.com) | [Δ BODY](https://aaa.arif-fazil.com)

---

### Ring 2: MIND (Ω) — Constitutional Kernel
**Domain:** [apex.arif-fazil.com](https://apex.arif-fazil.com)  
**Stack:** Static HTML (VPS + nginx)  
**Hosting:** VPS: `/opt/arifos/sites/arif-fazil.com/apex`  
**Role:** arifOS governance documentation, 13 Floors, constitutional AI reference

**Note:** arifos.arif-fazil.com (Cloudflare Pages) was **deleted 2026-04-11**. Content merged into:
- `apex.arif-fazil.com` — Primary constitutional floor specs
- [arifosmcp/#constitution](https://arifosmcp.arif-fazil.com/#constitution) — Kernel integration

**13 Constitutional Floors:**
| Floor | Principle | Gate |
|-------|-----------|------|
| F1 | AMANAH — No irreversible without VAULT999 | 888_HOLD |
| F2 | TRUTH — No ungrounded claims (τ ≥ 0.99) | SABAR |
| F3 | INPUT CLARITY — Clear task definition | SABAR |
| F4 | ENTROPY — Risk accumulation tracking | HOLD |
| F6 | HARM/DIGNITY — No harm to humans | VOID |
| F7 | CONFIDENCE — Humility in uncertainty | HOLD |
| F8 | GROUNDING — Evidence-based reasoning | HOLD |
| F9 | ANTI-HANTU — No deception/manipulation | VOID |
| F11 | COHERENCE — Internal consistency | HOLD |
| F13 | SOVEREIGN — Human holds final authority | 888_HOLD |

**Trinity Navigation:** [Ψ SOUL](https://arif-fazil.com) | [Δ BODY](https://aaa.arif-fazil.com)

---

### Ring 3: BODY (Δ) — Protocol Execution
**Domain:** [aaa.arif-fazil.com](https://aaa.arif-fazil.com)  
**Stack:** Static HTML + Tailwind CDN + Vanilla JS  
**Hosting:** VPS: `/opt/arifos/sites/arif-fazil.com/aaa`  
**Role:** Protocol specifications, agent communication patterns

**Protocols:**
| Path | Specification |
|------|---------------|
| `mcp/` | Model Context Protocol — tool bridging |
| `webmcp/` | WebMCP — browser-native governance via WebSocket |
| `a2a/` | Agent-to-Agent — tri-witness consensus protocol |

**Trinity Navigation:** [Ψ SOUL](https://arif-fazil.com) | [Ω MIND](https://apex.arif-fazil.com)

---

## MCP Gateway (Ξ)

**Domain:** [arifosmcp.arif-fazil.com](https://arifosmcp.arif-fazil.com)  
**Stack:** FastMCP (Python) + uvicorn + Docker  
**Hosting:** VPS Docker container (port 8080 HTTP + 8089 SSE)  
**Role:** Constitutional AI gateway, 17 tools, 13 Floors, human sovereignty

**Endpoints:**
| Endpoint | Transport | Purpose |
|----------|-----------|---------|
| `/health` | HTTP/JSON | Live system status, vitality, peace² |
| `/mcp` | streamable-http | MCP tool calls |
| `/sse` | text/event-stream | A2A agent connections |
| `/tools` | HTTP/JSON | Tool manifest |
| `/.well-known/mcp/server.json` | JSON | MCP server capabilities |

**Live Metrics (2026-04-11):**
- Tools: 17 loaded
- Vitality: 0.82
- Peace²: 1.01
- Entropy Δ: -0.02
- Verdict: SEAL

**Providers:** anthropic, openai, google, openrouter, ollama_local, brave, jina, perplexity, firecrawl, browserless, venice

**Trinity Navigation:** [Ψ SOUL](https://arif-fazil.com) | [Ω MIND](https://apex.arif-fazil.com) | [Δ BODY](https://aaa.arif-fazil.com) | [Φ GEOX](https://geox.arif-fazil.com)

---

## Supporting Infrastructure

### GEOX — Earth Witness (Φ)
**Domain:** [geox.arif-fazil.com](https://geox.arif-fazil.com)  
**Stack:** FastMCP (Python) + uvicorn + React frontend  
**Hosting:** VPS Docker container (port 8000)  
**Role:** Geoscience domain tools, geological data access, earth science protocols

---

### FORGE — Agent Deployment (◉)
**Domain:** [forge.arif-fazil.com](https://forge.arif-fazil.com)  
**Stack:** Static HTML + JavaScript  
**Hosting:** VPS: `/opt/arifos/sites/arif-fazil.com/forge`  
**Role:** Agent deployment interface, CI/CD pipeline status

---

### WAW — State of the Machine (◎)
**Domain:** [waw.arif-fazil.com](https://waw.arif-fazil.com)  
**Stack:** Static HTML + JavaScript  
**Hosting:** VPS: `/opt/arifos/sites/arif-fazil.com/waw`  
**Role:** Runtime state monitoring, agent workspace registry

---

### WIKI — Constitutional Knowledge Base (Ω)
**Domain:** [wiki.arif-fazil.com](https://wiki.arif-fazil.com)  
**Stack:** Static HTML + JavaScript  
**Hosting:** VPS: `/opt/arifos/sites/arif-fazil.com/wiki`  
**Role:** arifOS documentation, governance references, decision records

---

## Connection Map

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              HUMAN (Arif)                                    │
│                         arif-fazil.com (SOUL)                               │
│                    soul.json | human.md | scar.json                          │
└──────────────────────────────────────────────────────────────────────────────┘
                           │
                           │ Trinity Navigation (ΔΩΨ)
        ┌──────────────────┼──────────────────┐
        ▼                  ▼                  ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  Ω MIND         │ │  Δ BODY         │ │  Ξ MCP Gateway  │
│  apex.arif-fazil│ │  aaa.arif-fazil │ │  arifosmcp      │
│                 │ │                 │ │                 │
│  13 Floors      │ │  MCP/WebMCP/A2A │ │  17 Tools       │
│  F1-F13         │ │  Protocol Specs │ │  Constitutional  │
└─────────────────┘ └─────────────────┘ └─────────────────┘
        │                  │                  │
        │                  │                  │ Powers
        │                  │         ┌────────┴────────┐
        │                  │         ▼                 ▼
        │                  │  ┌──────────┐      ┌──────────┐
        │                  │  │  FORGE   │      │   WAW   │
        │                  │  │  forge   │      │   waw   │
        │                  │  └──────────┘      └──────────┘
        │                  │
        │                  │         ┌────────┐
        │                  │         ▼        ▼
        │                  │  ┌──────────┐ ┌──────────┐
        │                  │  │  WIKI    │ │  GEOX    │
        │                  │  │  wiki    │ │  geox    │
        │                  │  └──────────┘ └──────────┘
        └──────────────────┴──────────────────────────────────────────┘
```

---

## Data Flow

### 1. Human → SOUL (Identity)
```
Human → arif-fazil.com → soul.json/human.md/scar.json
         │
         ▼ Trinity Nav
    Ω MIND or Δ BODY
```

### 2. Agent → MIND (Constitutional Check)
```
Agent → apex.arif-fazil.com/.well-known/arifOS/floors.json
         │
    Read F1-F13 definitions
         │
    Apply governance before action
```

### 3. Agent → BODY (Protocol Execution)
```
Agent → aaa.arif-fazil.com/mcp/ → Read MCP spec
      → aaa.arif-fazil.com/webmcp/ → Read WebMCP spec
      → aaa.arif-fazil.com/a2a/ → Read A2A spec
         │
    Execute via arifosmcp.arif-fazil.com/mcp
```

### 4. Agent → MCP Gateway (Tool Execution)
```
Agent → arifosmcp.arif-fazil.com/health (capability check)
      → arifosmcp.arif-fazil.com/mcp (tool invocation)
         │
    arifOS 13 Floors governance
         │
    Tool execution + VAULT999 sealing
```

---

## Deployment Topology

```
Cloudflare (DNS + Pages)
     │
     ├── arif-fazil.com ──────► Cloudflare Pages (ariffazil)
     │                              └── ariffazil.pages.dev
     │
     └── apex.arif-fazil.com ────► Cloudflare Pages (apex)
                                    └── apex-dpf.pages.dev

VPS (Docker + nginx)
     │
     ├── arif-fazil.com ─────────► /opt/arifos/sites/arif-fazil.com/
     │                                (root: index, llms.txt, soul.json)
     │
     ├── aaa.arif-fazil.com ─────► /opt/arifos/sites/arif-fazil.com/aaa/
     ├── apex.arif-fazil.com ─────► /opt/arifos/sites/arif-fazil.com/apex/
     ├── arifosmcp.arif-fazil.com ► proxy → arifosmcp:8080
     ├── forge.arif-fazil.com ────► /opt/arifos/sites/arif-fazil.com/forge/
     ├── waw.arif-fazil.com ──────► /opt/arifos/sites/arif-fazil.com/waw/
     ├── wiki.arif-fazil.com ─────► /opt/arifos/sites/arif-fazil.com/wiki/
     │
     └── geox.arif-fazil.com ─────► proxy → geox_gui:3000
                                    └── geox_eic:8000 (MCP)
```

---

## Trinity Navigation (All Sites)

Every site includes unified Trinity navigation in footer:

```html
<footer>
    <a href="https://arif-fazil.com">Ψ SOUL</a>
    <a href="https://apex.arif-fazil.com">Ω MIND</a>
    <a href="https://aaa.arif-fazil.com">Δ BODY</a>
    <a href="https://arifosmcp.arif-fazil.com">Δ MCP</a>
    <a href="https://forge.arif-fazil.com">◉ FORGE</a>
    <a href="https://waw.arif-fazil.com">◎ WAW</a>
    <a href="https://wiki.arif-fazil.com">Ω WIKI</a>
    <a href="https://geox.arif-fazil.com">Φ GEOX</a>
</footer>
```

---

## Security Boundaries

| Zone | Access | Governance |
|------|--------|------------|
| SOUL (arif-fazil.com) | Public | Static content, identity only |
| MIND (apex.arif-fazil.com) | Public | Read-only constitutional reference |
| BODY (aaa.arif-fazil.com) | Public | Protocol specs, no execution |
| MCP Gateway | Authenticated | arifOS F1-F13 + 888_HOLD |
| GEOX | Authenticated | Domain-specific governance |
| Forge/WAW/Wiki | Restricted | Operational controls |

---

## Shared Resources

### Design System
```css
@import url('https://arif-fazil.com/shared/design-system/tokens.css');
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
| apex.arif-fazil.com | — | VAULT999 | 2026-04-11 |
| aaa.arif-fazil.com | — | VAULT999 | 2026-04-11 |
| arifosmcp.arif-fazil.com | 2026.04.07 | SEAL | 2026-04-11 |
| forge.arif-fazil.com | — | VAULT999 | 2026-04-11 |
| waw.arif-fazil.com | — | VAULT999 | 2026-04-11 |
| wiki.arif-fazil.com | — | VAULT999 | 2026-04-11 |
| geox.arif-fazil.com | v2026.04.11 | DITEMPA | 2026-04-11 |

---

## Deleted Sites

| Domain | Deleted | Notes |
|--------|---------|-------|
| arifos.arif-fazil.com | 2026-04-11 | Cloudflare Pages project deleted. Content merged into apex + arifosmcp. |

---

**Seal:** VAULT999 | **Status:** ACTIVE  
**Last Updated:** 2026-04-11
