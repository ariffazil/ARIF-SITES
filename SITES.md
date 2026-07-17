# 🌐 SITES

> Human view of [`config/sites.json`](config/sites.json). Live Caddy and health probes beat this document.
> Observed 2026-07-17. DITEMPA BUKAN DIBERI.

## Canonical public estate

| Door | Role | Ownership | Source |
|---|---|---|---|
| `arif-fazil.com` | SOUL / human | static | `sites/arif-fazil.com` |
| `arifos.arif-fazil.com` | MIND / observatory | static + kernel routes | `sites/arifos.arif-fazil.com` |
| `aaa.arif-fazil.com` | BODY / agent cockpit | static + A2A routes | `sites/aaa.arif-fazil.com` |
| `geox.arif-fazil.com` | EARTH | static + organ routes | `sites/geox.arif-fazil.com` |
| `wealth.arif-fazil.com` | CAPITAL | static + organ routes | `sites/wealth.arif-fazil.com` |
| `well.arif-fazil.com` | READINESS | runtime-owned | WELL |
| `mcp.arif-fazil.com` | capability gateway | runtime-owned | arifOS MCP |
| `forge.arif-fazil.com` | execution | runtime-owned | A-FORGE |

All static doors consume `/_shared/*` from one source: `sites/shared/`.

## Redirects and retired names

| Name | State | Canonical destination |
|---|---|---|
| `www.arif-fazil.com` | redirect | `arif-fazil.com` |
| `wiki.arif-fazil.com` | redirect | `arifos.arif-fazil.com/wiki/`; source knowledge retained in `content/wiki` |
| `arifosmcp.arif-fazil.com` | retired; no DNS observed | `mcp.arif-fazil.com` |
| `makcikgpt.arif-fazil.com` | retired source; endpoint unhealthy | `arif-fazil.com/wealth/makcikgpt` |
| `apex.arif-fazil.com` | runtime decommissioned | route retirement requires Caddy approval |

## Deployment contract

`./deploy-vps.sh` is the sole deploy implementation. `scripts/deploy-vps.sh` and `scripts/deploy-site.sh` are compatibility wrappers. Content deploys do not reload Caddy unless `--reload-caddy` is explicitly supplied.

The live routing source is `/etc/caddy/Caddyfile`. The checked-in `deploy/Caddyfile` is a reference snapshot and must not be applied until reconciled and approved.
