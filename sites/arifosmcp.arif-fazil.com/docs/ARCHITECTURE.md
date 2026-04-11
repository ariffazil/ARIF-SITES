# MCP Gateway — Constitutional AI Kernel

> **MCP Endpoint** | arifosmcp.arif-fazil.com | Ditempa Bukan Diberi [ΔΩΨ | ARIF]

## Role in Trinity

MCP Gateway is the **constitutional AI execution engine** — a FastMCP-powered endpoint that provides 17 tools under arifOS 13 Floors governance with human sovereignty controls.

```
         BODY (AAA Protocols)
              │
              ▼
    ┌───────────────────────────────────┐
    │         MCP GATEWAY              │
    │   arifosmcp.arif-fazil.com        │
    │                                   │
    │   17 Tools • 13 Floors • 888_HOLD │
    └───────────────────────────────────┘
              │
         Powers
    ┌─────────┴──────────┐
    │  Forge • WAW • Wiki
```

## Stack

| Layer | Technology |
|-------|------------|
| Runtime | FastMCP (Python) |
| Server | uvicorn (dual transport) |
| Container | Docker |
| Proxy | nginx |

## Endpoints

| Endpoint | Transport | Method | Purpose |
|----------|-----------|--------|---------|
| `/health` | HTTP/JSON | GET | System status, version, vitality |
| `/mcp` | streamable-http | POST | JSON-RPC tool calls |
| `/sse` | text/event-stream | GET | A2A agent connections |
| `/tools` | HTTP/JSON | GET | Tool manifest |
| `/.well-known/mcp/server.json` | JSON | GET | MCP capabilities |

## Live Health Response

```json
{
  "status": "healthy",
  "service": "arifos-aaa-mcp",
  "version": "2026.04.07",
  "transport": "streamable-http",
  "tools_loaded": 17,
  "thermodynamic": {
    "vitality_index": 0.82,
    "peace_squared": 1.01,
    "confidence": 0.88
  }
}
```

## Dual Transport Architecture

```
                    ┌─────────────────────────────┐
                    │    arifosmcp container       │
                    │                             │
HTTP ──────► :8080 ─┤  uvicorn (streamable-http)  │
                    │                             │
SSE ────────► :8089 ─┤  uvicorn (SSE)              │
                    │                             │
                    └─────────────────────────────┘
                         │           │
                         ▼           ▼
                    ┌─────────────────────────────┐
                    │  nginx (arifos_landings)     │
                    │                             │
      /mcp ─────────┤  proxy_pass arifosmcp:8080  │
                    │                             │
      /sse ─────────┤  proxy_pass arifosmcp:8089  │
                    └─────────────────────────────┘
```

## 17 Tools

| Category | Tools |
|----------|-------|
| Filesystem | read_file, write_file, list_files |
| Search | grep_text |
| Shell | run_command, run_tests |
| MCP | mcp__invoke, mcp__list |
| Governance | vault_seal, health_check |

## arifOS 13 Floors Integration

Every tool call passes through:
1. **F3 Input Clarity** — SABAR check
2. **F6 Harm/Dignity** — VOID check
3. **F9 Injection** — Prompt injection detection
4. **F4 Entropy** — Risk accumulation tracking

High-risk tools trigger **888_HOLD** requiring human approval.

## Design Tokens

Uses BODY (Δ) design system:
```css
@import url('https://arif-fazil.com/shared/design-system/tokens.css');
--body-primary: #D4A853;
```

## Trinity Navigation

```html
<a href="https://arif-fazil.com">Ψ SOUL</a>
<a href="https://apex.arif-fazil.com">Ω MIND</a>
<span>Δ BODY</span>
```

## Deployment

```bash
# VPS Docker
docker-compose up -d arifosmcp

# Volume mount
/opt/arifos/sites/arif-fazil.com/arifosmcp/ → /usr/share/nginx/html/arifosmcp
```

## External References

| Resource | URL |
|----------|-----|
| SOUL | https://arif-fazil.com |
| MIND | https://apex.arif-fazil.com |
| BODY | https://aaa.arif-fazil.com |
| GEOX | https://geox.arif-fazil.com |

---

**Seal:** SEAL | **Status:** OPERATIONAL
