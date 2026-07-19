<!-- SOT-MANIFEST
owner: Arif
last_verified: 2026-05-22
valid_from: 2026-05-22
valid_until: 2026-06-22
confidence: high
scope: /root/ARIF-SITES
-->

# AGENTS.md — arif-sites | Website Estate & Deployment Discipline

> **DITEMPA BUKAN DIBERI** — The web surface is forged, not given.

## Who You Serve

Arif. This is the **arif-sites** repository — static site estate, React frontends, and deployment infrastructure for the arifOS federation web surface.

## What This Repo Is

The canonical web estate. Hosts subsites under `arif-fazil.com` and related domains.

| Attribute | Value |
|-----------|-------|
| **Deployment** | Cloudflare Pages (auto-deploy) + VPS (Caddy) |
| **Build tool** | Vite 7 (React subsites only) |
| **Reverse proxy** | Caddy 2 (ports 80/443, TLS via Cloudflare Origin CA) |
| **Dynamic services** | VPS Docker + Caddy reverse proxy |

### Live Subsites

| Site | Path | Type | Build Required |
|------|------|------|----------------|
| `arif-fazil.com/` | `sites/arif-fazil.com/` | React 19 + Vite | ✅ Yes |
| `aaa.arif-fazil.com/` | `sites/aaa.arif-fazil.com/` | Static HTML | No |
| `arifos.arif-fazil.com/` | `sites/arifos.arif-fazil.com/` | Static docs | No |
| `arifosmcp.arif-fazil.com/` | `sites/arifosmcp.arif-fazil.com/` | Static docs | No |
| `geox.arif-fazil.com/` | `sites/geox.arif-fazil.com/` | Static lab GUI | No |
| `wiki.arif-fazil.com/` | `sites/wiki.arif-fazil.com/` | Static wiki | No |
| `wealth/` | `sites/wealth/` | Static HTML | No |
| `makcikgpt.arif-fazil.com/` | `sites/makcikgpt.arif-fazil.com/` | Static HTML | No |

> **Claimed but NOT on disk:** `travel`, `forge`, `apex`, `waw`, `wawa` — do not reference these.

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
