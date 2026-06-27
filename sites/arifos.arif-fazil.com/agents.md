# agents.md — arifos.arif-fazil.com
# Actions AI agents can take on this site
# Part of SEAL_SESSION_arif-2026-06-27-001

## Site Identity

**Name:** arifos.arif-fazil.com — Ω MIND (Constitutional Observatory)
**Owner:** Muhammad Arif bin Fazil — F13 SOVEREIGN
**Purpose:** Constitutional governance observatory, federation health dashboard, MCP endpoint

## Available Actions

### Read-Only (No Approval Required)
- View federation status at `/`
- View federation manifest at `/federation-manifest.json`
- View federation dashboard at `/federation.html`
- View agent card at `/agent-card.json`
- Access `.well-known/` for agent discovery files
- Access `llms.txt` for site description
- Access `robots.txt` for crawl rules
- Access `llms.json` for structured site data

### MCP Endpoints
- **arifOS Kernel:** `https://arifos.arif-fazil.com/mcp` (POST, JSON-RPC 2.0)
- **Health:** `https://arifos.arif-fazil.com/health` (GET)
- **Tools:** `https://arifos.arif-fazil.com/tools.json` (GET)
- **SSE:** `https://arifos.arif-fazil.com/sse` (GET, server-sent events)
- **Status:** `https://arifos.arif-fazil.com/api/status` (GET)

### WebMCP Tools (Browser-Side)
- `get_floor_scores` — Real-time F1-F13 constitutional floor compliance
- `get_organ_census` — Live health of all 7 federation organs
- `get_vault_health` — VAULT999 immutable audit vault status

### Restricted (Requires Human Approval)
- Any MCP tool execution that mutates state
- Any vault seal operation
- Any governance verdict (HOLD/SEAL/VOID)

## Discovery Files

| File | Path | Purpose |
|------|------|---------|
| llms.txt | `/llms.txt` | Site description for AI crawlers |
| llms.json | `/llms.json` | Structured site data |
| robots.txt | `/robots.txt` | Crawl rules |
| agent-card.json | `/agent-card.json` | Agent card |
| federation-manifest.json | `/federation-manifest.json` | Federation manifest |
| .well-known/agent-card.json | `/.well-known/agent-card.json` | Agent card (well-known) |
| .well-known/mcp.json | `/.well-known/mcp.json` | MCP manifest |
| .well-known/ai-plugin.json | `/.well-known/ai-plugin.json` | AI plugin manifest |

## Constitutional Floors

All actions on this site are governed by F1-F13:
- F1 AMANAH — Trust, custody, fiduciary duty
- F2 TRUTH — Epistemic honesty, evidence-grounded claims
- F3 RESPECT — Consent, boundaries, autonomy
- F4 CLARITY — Entropy reduction, signal over noise
- F5 GRATITUDE — Acknowledge contributions
- F6 MARUAH — Dignity, harm avoidance
- F7 HUMILITY — Acknowledge limits, uncertainty
- F8 LAW — Regulatory compliance, institutional integrity
- F9 ANTI-HANTU — No metaphysical claims, no consciousness claims
- F10 MEMORY — Institutional memory, audit trails
- F11 AUDIT — Accountability, traceability
- F12 TRANSPARENCY — Openness, explainability
- F13 SOVEREIGN — Human veto is absolute

## Federation Organs

| Organ | Port | Domain | Role |
|-------|------|--------|------|
| arifOS | 8088 | arifos.arif-fazil.com | Constitutional kernel |
| GEOX | 8081 | geox.arif-fazil.com | Earth intelligence |
| WEALTH | 18082 | wealth.arif-fazil.com | Capital intelligence |
| WELL | 18083 | well.arif-fazil.com | Vitality engine |
| AAA | 3001 | aaa.arif-fazil.com | A2A hub |
| A-FORGE | 7071 | — | Execution shell |
| VAULT999 | — | — | Immutable audit vault |

## Contact

- **Human:** arif@arif-fazil.com
- **Telegram:** @ariffazil
- **GitHub:** https://github.com/ariffazil/arifos

---

*DITEMPA BUKAN DIBERI — Forged, Not Given*
