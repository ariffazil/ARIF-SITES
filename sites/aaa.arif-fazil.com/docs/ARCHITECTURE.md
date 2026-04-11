# BODY — Protocol Execution Architecture

> **Ring 3: Δ** | aaa.arif-fazil.com | Ditempa Bukan Diberi [ΔΩΨ | ARIF]

## Role in Trinity

BODY is the **protocol specification and tool execution layer** — defining how agents communicate (MCP, WebMCP, A2A) and how tools are invoked through the MCP gateway.

```
         MIND (Constitutional)
              │
              ▼
    ┌───────────────────────────┐
    │        BODY (Δ)           │
    │   aaa.arif-fazil.com      │
    │                           │
    │   Protocol Specifications │
    │   MCP • WebMCP • A2A      │
    └───────────────────────────┘
              │
         Uses ▼
    ┌────────────────────────────────┐
    │  arifosmcp.arif-fazil.com     │
    │  MCP Gateway (17 tools)        │
    └────────────────────────────────┘
```

## Protocol Specifications

### MCP — Model Context Protocol
Tool bridging standard for connecting AI models to external tools.

| Path | Description |
|------|-------------|
| `mcp/index.html` | MCP protocol overview |
| `mcp/tools.md` | Tool schema definitions |
| `mcp/transport.md` | HTTP + SSE transport specs |

### WebMCP — Web-based MCP
Browser-native governance via WebSocket for client-side tool execution.

| Path | Description |
|------|-------------|
| `webmcp/index.html` | WebMCP console spec |
| `webmcp/websocket.md` | WebSocket protocol |

### A2A — Agent-to-Agent
Tri-witness consensus protocol for multi-agent coordination.

| Path | Description |
|------|-------------|
| `a2a/index.html` | A2A protocol overview |
| `a2a/consensus.md` | Tri-witness consensus |

## Trinity Navigation

Footer includes mandatory Trinity links:
```html
<nav class="trinity-nav">
  <a href="https://arif-fazil.com">Ψ SOUL</a>
  <a href="https://apex.arif-fazil.com">Ω MIND</a>
  <span>Δ BODY</span>
</nav>
```

## Design Tokens

BODY uses **Amber/Gold + Rounded (12px radius)**:

```css
:root {
  --body-primary: #D4A853;     /* Gold */
  --body-secondary: #C4791A;   /* Amber */
  --body-accent: #E3B341;     /* Bright gold */
  --body-bg: #1A1612;          /* Dark amber-black */
  --body-text: #F5F0E8;        /* Warm white */
  --body-radius: 12px;         /* Rounded corners */
}
```

## Deployment

Static HTML served from VPS:
```
/opt/arifos/sites/aaa.arif-fazil.com/
```

## MCP Gateway Integration

BODY references the live MCP gateway:

| Endpoint | Purpose |
|----------|---------|
| `https://arifosmcp.arif-fazil.com/health` | System status |
| `https://arifosmcp.arif-fazil.com/mcp` | Tool invocation |
| `https://arifosmcp.arif-fazil.com/tools` | Tool manifest |

## External References

| Resource | URL |
|----------|-----|
| SOUL (arif-fazil) | https://arif-fazil.com |
| MIND (arifOS) | https://apex.arif-fazil.com |
| MCP Gateway | https://arifosmcp.arif-fazil.com |
| GEOX (Domain) | https://geox.arif-fazil.com |

---

**Seal:** VAULT999 | **Status:** ACTIVE
