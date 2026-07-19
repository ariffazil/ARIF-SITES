# PROTOCOL_CONFORMANCE.md — arif-sites (L4 PUBLIC)

```yaml
organ: arif-sites
layer: L4 PUBLIC
role: Public Web Surface
hosting: Cloudflare Pages
last_verified: 2026-07-19T17:30Z
```

## Protocol Status

| Protocol | Status | Notes |
|----------|--------|-------|
| **HTTPS** | ✅ OPERATIONAL | Cloudflare TLS termination |
| **MCP Apps (XMCP)** | ⚠️ CONSUMER | Consumes MCP App manifests from organs |
| **llms.txt** | ✅ PRESENT | AI discovery at `/llms.txt` |
| **RSS/Atom** | N/A | Not applicable |
| **WebSub** | N/A | Not applicable |

## Public Endpoints

| Path | Purpose | Protocol |
|------|---------|----------|
| `arif-fazil.com` | Main site | HTTPS |
| `arifos.arif-fazil.com` | Kernel surface | HTTPS + MCP |
| `mcp.arif-fazil.com` | Federation MCP door | HTTPS + SSE |
| `geox.arif-fazil.com` | Earth intelligence | HTTPS + MCP |
| `wealth.arif-fazil.com` | Capital intelligence | HTTPS + MCP |
| `well.arif-fazil.com` | Vitality surface | HTTPS + MCP |
| `aaa.arif-fazil.com` | Cockpit | HTTPS |
| `/llms.txt` | AI discovery | HTTPS |

## Constraints

- NEVER call MCP endpoints directly in production builds
- All dynamic data must come from static sources or edge functions
- Federation data from AAA/arifOS only (not domain organs directly)

## Gaps to Close

1. **XMCP consumer**: Consume XMCP app manifests from all organs
2. **Federation dashboard**: Live organ status from health endpoints
