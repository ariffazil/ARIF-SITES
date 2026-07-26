<!-- SOT-MANIFEST
owner: Arif
last_verified: 2026-07-26
valid_from: 2026-07-26
valid_until: 2026-08-26
confidence: high
scope: /root/arif-sites → ariffazil/arif-fazil.com
doctrine: One domain. One web surface. Many organs, tetap bersempadan.
-->

# AGENTS.md — arif-fazil.com | Unified Federation Web Surface

> **DITEMPA BUKAN DIBERI** — The web surface is forged, not given.

## Who You Serve

Arif. This is the **arif-fazil.com** repository (formerly `arif-sites`) — the unified web surface for the arifOS federation.

## What This Repo Is

The canonical web estate. All organs are exposed as paths under `https://arif-fazil.com/`. Legacy subdomains are preserved as 301 redirects.

| Attribute | Value |
|-----------|-------|
| **Deployment** | Cloudflare Pages (auto-deploy) + VPS (Caddy) |
| **Build tool** | Vite 7 (React cockpit only) |
| **Reverse proxy** | Caddy 2 (ports 80/443, TLS via Cloudflare Origin CA) |
| **Dynamic services** | VPS systemd + Caddy reverse proxy |

### Live Paths (Unified)

| Path | Source | Type | Build Required |
|------|--------|------|----------------|
| `/` | `sites/arif-fazil.com/` | React 19 Cockpit | ✅ Yes |
| `/arifos/` | `sites/arif-fazil.com/public/arifos/` | Static | No |
| `/aaa/` | `sites/arif-fazil.com/public/aaa/` | Static | No |
| `/geox/` | `sites/arif-fazil.com/public/geox/` | Static | No |
| `/wealth/` | `sites/arif-fazil.com/public/wealth/` | Static | No |
| `/well/` | `sites/arif-fazil.com/public/well/` | Static | No |
| `/forge/` | `sites/arif-fazil.com/public/forge/` | Static | No |
| `/mcp/` | `sites/arif-fazil.com/public/mcp/` | Static | No |
| `/wiki/` | `sites/arif-fazil.com/public/wiki/` | Static | No |
| `/000/` `/999/` | `sites/arif-fazil.com/public/000/` `999/` | Static | No |
| `/_shared/` | `sites/shared/` | Design System | No |

### Legacy Subdomain → Path Redirects (NEVER DELETE)

| Legacy Subdomain | → | Unified Path |
|------------------|---|-------------|
| `arifos.arif-fazil.com` | → | `/arifos/` |
| `aaa.arif-fazil.com` | → | `/aaa/` |
| `geox.arif-fazil.com` | → | `/geox/` |
| `wealth.arif-fazil.com` | → | `/wealth/` |
| `well.arif-fazil.com` | → | `/well/` |
| `forge.arif-fazil.com` | → | `/forge/` |
| `mcp.arif-fazil.com` | → | `/mcp/` |
| `wiki.arif-fazil.com` | → | `/wiki/` |
| `makcikgpt.arif-fazil.com` | → | `/wealth/makcikgpt/` |
| `arifosmcp.arif-fazil.com` | → | `/mcp/` |

## Authority & Autonomy

### Autonomous
- Build static sites, update HTML/CSS/JS
- Update `sites/arif-fazil.com/` React source
- Run `./deploy-vps.sh` and `scripts/deploy-site.sh <site-dir>`
- Modify Caddyfile routing (verify with `docker compose restart caddy`)

### Requires 888_HOLD
- Cloudflare Pages production push (auto-deploy on `git push main`)
- Domain/DNS changes
- `.env` or secret exposure in static files
- `rm -rf sites/` or deletion of live subsites

## Build & Test

```bash
cd /root/ARIF-SITES

# Only the flagship site requires a build:
cd sites/arif-fazil.com && npm install && npm run build

# Deploy to VPS
./deploy-vps.sh
scripts/deploy-site.sh <site-dir>

# Cloudflare Pages: git push main -> auto-deploy
```

## Key Files

| File | Purpose |
|------|---------|
| `deploy/Caddyfile` | Reverse proxy config |
| `deploy/docker-compose.yml` | Compose overlay for sites |
| `sites/shared/` | Design-system + WebMCP (synced to `/var/www/html/_shared/`) |
| `scripts/deploy-site.sh` | Per-site VPS deploy script |

## Response Contract

All agent responses must include:

```yaml
STANCE: [CLAIM | PLAUSIBLE | HYPOTHESIS | UNKNOWN | HOLD]
BLOCKING: [true | false]
FLOOR_REPORT:
  F2_Truth: [passed | failed | uncertain]
  F7_Humility: [uncertainty_quantified]
  F9_AntiHantu: [no_deception_detected]
NEXT_ACTION: [proceed | escalate_to_arifos | hold_for_human]
```

---

*DITEMPA BUKAN DIBERI — Forged, Not Given. Verify at /999*
