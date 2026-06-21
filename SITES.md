# SITES.md — arifOS Federation Canonical Routing Table
> **DITEMPA BUKAN DIBERI** — Single source of truth. Generated from live Caddyfile.
> **Last reconciled:** 2026-06-20
> **Replaces:** ARCHITECTURE.md, ARIF_FAZIL_COM_TRINITY_MAP.md, INVARIANTS.md, ROUTING_INVARIANTS.md, DEPLOYMENT.md (sections on routing)

---

## TRINITY — The Three Rings

| Ring | Domain | Upstream | Role |
|------|--------|----------|------|
| **Ψ SOUL** | `arif-fazil.com` | `/var/www/html/arif` (static, React SPA) | Human identity, portfolio, genesis, validation |
| **Ω MIND** | `arifos.arif-fazil.com` | `127.0.0.1:8088` (arifOS kernel) | Governance docs, MCP endpoint, observatory |
| **Δ BODY** | `aaa.arif-fazil.com` | `127.0.0.1:3001` (AAA A2A) | Agent cockpit, A2A gateway, protocol specs |

---

## ORGAN MCP — API-only surfaces (not human sites)

| Domain | Upstream | Port | Status |
|--------|----------|------|--------|
| `geox.arif-fazil.com` | `127.0.0.1:8081` | GEOX daemon | ✅ LIVE — future own repo |
| `wealth.arif-fazil.com` | `127.0.0.1:18082` | WEALTH organ | ✅ LIVE — future own repo |
| `well.arif-fazil.com` | `127.0.0.1:18083` | WELL organ | ✅ LIVE (MCP only; root → arifos) |
| `forge.arif-fazil.com` | `127.0.0.1:7071` | A-FORGE | ✅ LIVE — future own repo |

> **ChatGPT-registered at these domains. DO NOT MOVE without updating ChatGPT MCP configs.**

---

## SECONDARY — Theory + Reference

| Domain | Upstream | Role |
|--------|----------|------|
| `apex.arif-fazil.com` | `127.0.0.1:3002` (APEX) | Theory surface, A2A tasks |

---

## LEGACY REDIRECTS — 301 → Trinity

| Domain | Redirects to |
|--------|-------------|
| `www.arif-fazil.com` | `https://arif-fazil.com` |
| `arifosmcp.arif-fazil.com` | `https://arifos.arif-fazil.com` |
| `mcp.arif-fazil.com` | `https://arifos.arif-fazil.com` (MCP paths preserved) |
| `wiki.arif-fazil.com` | `https://arifos.arif-fazil.com/wiki` |

---

## INFRASTRUCTURE — Internal, not public surfaces

| Domain | Upstream | Service |
|--------|----------|---------|
| `ollama.arif-fazil.com` | `127.0.0.1:11434` | Local LLM inference |
| `openclaw.arif-fazil.com` | `127.0.0.1:18789` | OpenClaw gateway |
| `claw.arif-fazil.com` | `127.0.0.1:18789` | OpenClaw Telegram webhook |
| `deploy.arif-fazil.com` | `127.0.0.1:18000` | Deploy webhook receiver |
| `vault999.arif-fazil.com` | `127.0.0.1:8100` | VAULT999 viewer |
| `ai.arif-fazil.com` | `127.0.0.1:8091` | AI gateway |
| `grafana.arif-fazil.com` | `127.0.0.1:3000` | Metrics dashboard |
| `prometheus.arif-fazil.com` | `127.0.0.1:9090` | Metrics collector |
| `temporal.arif-fazil.com` | `127.0.0.1:8233` | Workflow engine UI |
| `nats.arif-fazil.com` | `127.0.0.1:8222` | NATS monitoring |
| `monitor.arif-fazil.com` | `127.0.0.1:3000` | → Grafana |

---

## DELETED / ARCHIVED

| Domain | Status |
|--------|--------|
| `travel.arif-fazil.com` | Removed — redirects to arif-fazil.com |
| `waw.arif-fazil.com` | Archived |
| `wawa.arif-fazil.com` | Archived |
| `hermes.arif-fazil.com` | Never deployed |
| `copilot.arif-fazil.com` | Never deployed |

---

## PORT MAP

| Service | Port | Process |
|---------|------|---------|
| arifOS kernel | 8088 | python (arifos.main) |
| GEOX daemon | 18081 | python3 (geoxd.py) |
| WEALTH organ | 18082 | python3 (internal.monolith) |
| WELL organ | 18083 | python3 |
| AAA A2A | 3001 | node |
| A-FORGE | 7071 | node |
| APEX | 3002 | archived (read-only) |
| Caddy | 80, 443 | reverse proxy |

---

## HEALTH CHECKS

```bash
curl https://arif-fazil.com/           # Ψ SOUL → 200
curl https://arifos.arif-fazil.com/health  # Ω MIND → 200
curl https://aaa.arif-fazil.com/health     # Δ BODY → 200
curl https://geox.arif-fazil.com/health    # GEOX → 200
curl https://wealth.arif-fazil.com/health  # WEALTH → 200
curl https://well.arif-fazil.com/health    # WELL → 200
```

---

## SOURCE OF TRUTH

- **Caddyfile:** `/etc/caddy/Caddyfile` (live runtime)
- **arif-sites repo:** `github.com/ariffazil/arif-sites` (static content)
- **Verification:** `ss -ltnp | grep <port>` for process ownership
- **This document:** Regenerate from Caddyfile on any routing change

---

*Sealed 2026-06-20. Trinity consolidation — 5 conflicting docs replaced by 1.*
*DITEMPA BUKAN DIBERI — Forged, Not Given.*
