# ⛔ SUPERSEDED by SITES.md — 2026-06-20. Do not update this file. See SITES.md for canonical routing truth.
# ⛔ This document is preserved for historical reference only.

# ROUTING_INVARIANTS — arifOS Federation
> **DITEMPA BUKAN DIBERI** — Federated routing truth. Last verified: 2026-05-25.

This document is the **canonical public routing table** for the arifOS federation.
All site manifests, health dashboards, and agent configs MUST match this table.
If you edit any routing here, you must update the corresponding Caddyfile on the VPS.
If you update the Caddyfile, you must update this document.

## Live Public Routes

| Domain | Public HTTPS | Local Upstream | Process | Status |
|--------|-------------|----------------|---------|--------|
| `arifos.arif-fazil.com` | `https://arifos.arif-fazil.com` | `127.0.0.1:8088` | `arifos.main` (python) | ✅ LIVE |
| `geox.arif-fazil.com` | `https://geox.arif-fazil.com` | `127.0.0.1:18081` | `geoxd.py` (python3) | ✅ LIVE |
| `wealth.arif-fazil.com` | `https://wealth.arif-fazil.com` | `127.0.0.1:18082` | `internal.monolith` (python3) | ✅ LIVE |

## Disabled / Intentional 404 Routes

| Domain | Reason |
|--------|--------|
| `well.arif-fazil.com` | WELL not deployed. Service does not exist on VPS. Returns 404. |
| `copilot.arif-fazil.com` | copilot-gateway not deployed. Returns 404. |
| `openclaw.arif-fazil.com` | openclaw-gateway not deployed. Returns 404. |

## Port Map

| Service | Internal Port | Note |
|---------|--------------|------|
| arifOS kernel | 8088 | F1-F13 governance active |
| GEOX daemon | 18081 | Earth intelligence organ |
| WEALTH organ | 18082 | Capital intelligence organ, governance active |
| WELL organ | 18083 | Reserved — not deployed |
| AAA A2A | 3001 | Control plane gateway |
| APEX | 3002 | Archived — read only |
| Vaultwarden | 8085 | Password manager |
| Uptime Kuma | 8086 | Service monitoring |
| Ollama | 11434 | Local LLM inference |

## Invariants (MUST NOT CHANGE without 888_JUDGE)

1. `arifOS` MUST NOT be routed to port 8080 in any config (8080 is dead).
2. `GEOX` MUST NOT be routed to port 8081 in any config (8081 is dead).
3. `WEALTH` public route MUST use port 18082 (organ-standard).
4. `WELL` public route MUST return 404 until a live service exists on 18083.
5. No `arifOS MCP config` may point to `localhost:8080` — correct port is `8088`.
6. No `GEOX MCP config` may point to `localhost:8081` — correct port is `18081`.

## Health Check URLs

| Service | URL |
|---------|-----|
| arifOS | `https://arifos.arif-fazil.com/health` |
| GEOX | `https://geox.arif-fazil.com/health` |
| WEALTH | `https://wealth.arif-fazil.com/health` |

## MCP Server Endpoints

| Service | MCP URL |
|---------|---------|
| arifOS | `https://mcp.arif-fazil.com/mcp` |
| GEOX | `https://geox.arif-fazil.com/mcp` |
| WEALTH | `https://wealth.arif-fazil.com/mcp` |

## Source of Truth

- **Caddyfile:** `/root/arifOS/Caddyfile` (VPS runtime)
- **Verification:** `ss -ltnp | grep <port>` to confirm process ownership
- **Health:** `curl https://<domain>/health`
