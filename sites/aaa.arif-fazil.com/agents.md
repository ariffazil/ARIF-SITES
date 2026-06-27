# agents.md — aaa.arif-fazil.com
# Actions AI agents can take on this site
# Part of SEAL_SESSION_arif-2026-06-27-001

## Site Identity

**Name:** aaa.arif-fazil.com — Δ BODY (Agent Cockpit)
**Owner:** Muhammad Arif bin Fazil — F13 SOVEREIGN
**Purpose:** Federation operations surface, A2A gateway, MCP tool explorer, agent registry

## Available Actions

### Read-Only (No Approval Required)
- View agent registry at `/agents/`
- View MCP tool explorer at `/mcp-gui/`
- View A2A gateway at `/a2a/`
- View briefings at `/briefings/`
- View cockpit at `/cockpit/`
- View WebMCP docs at `/webmcp/`
- Access `.well-known/` for agent discovery files
- Access `llms.txt` for site description
- Access `robots.txt` for crawl rules

### WebMCP Tools (Browser-Side)
- `get_agent_card` — Retrieve AAA Gateway A2A v1.0.0 agent card
- `get_active_agents` — List active agents in the federation
- `explain_governance` — Explain constitutional governance model
- `get_trinity_links` — Return canonical Trinity architecture links
- `get_llms_txt` — Retrieve llms.txt content
- `get_humans_txt` — Retrieve humans.txt content

### A2A Endpoints
- **A2A Gateway:** `https://aaa.arif-fazil.com/a2a/` (POST, A2A protocol)
- **Agent Card:** `https://aaa.arif-fazil.com/a2a/agent-card.json`
- **Status:** `https://aaa.arif-fazil.com/a2a/status.json`

### MCP Endpoints (via Federation)
- **arifOS Kernel:** `https://arifos.arif-fazil.com/mcp` (POST, JSON-RPC 2.0)
- **GEOX:** `https://geox.arif-fazil.com/mcp` (POST, JSON-RPC 2.0)
- **WEALTH:** `https://wealth.arif-fazil.com/mcp` (POST, JSON-RPC 2.0)
- **WELL:** `https://well.arif-fazil.com/mcp` (POST, JSON-RPC 2.0)

### Restricted (Requires Human Approval)
- Any A2A task delegation
- Any agent registration
- Any governance action (HOLD/SEAL)

## Discovery Files

| File | Path | Purpose |
|------|------|---------|
| llms.txt | `/llms.txt` | Site description for AI crawlers |
| robots.txt | `/robots.txt` | Crawl rules |
| .well-known/arifos.json | `/.well-known/arifos.json` | Federation manifest |
| .well-known/agent-card.json | `/.well-known/agent-card.json` | Agent card |
| manifest.json | `/manifest.json` | PWA manifest |

## Constitutional Floors

All actions on this site are governed by F1-F13:
- F1 AMANAH — Trust, custody, fiduciary duty
- F2 TRUTH — Epistemic honesty, evidence-grounded claims
- F4 CLARITY — Entropy reduction, signal over noise
- F6 MARUAH — Dignity, harm avoidance
- F8 LAW — Regulatory compliance, institutional integrity
- F9 ANTI-HANTU — No metaphysical claims, no consciousness claims
- F13 SOVEREIGN — Human veto is absolute

## Federation Organs

| Organ | Port | Role |
|-------|------|------|
| arifOS | 8088 | Constitutional kernel |
| GEOX | 8081 | Earth intelligence |
| WEALTH | 18082 | Capital intelligence |
| WELL | 18083 | Vitality engine |
| AAA | 3001 | A2A hub |
| A-FORGE | 7071 | Execution shell |

## Contact

- **Human:** arif@arif-fazil.com
- **Telegram:** @ariffazil
- **GitHub:** https://github.com/ariffazil

---

*DITEMPA BUKAN DIBERI — Forged, Not Given*
