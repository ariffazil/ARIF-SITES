<!-- SOT-MANIFEST
owner: Arif
last_verified: 2026-07-17
valid_from: 2026-07-17
valid_until: 2026-08-17
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
| **Deployment** | VPS static webroots + Caddy |
| **Build tool** | Vite 7 (React subsites only) |
| **Reverse proxy** | Caddy 2 (ports 80/443, TLS via Cloudflare Origin CA) |
| **Dynamic services** | VPS Docker + Caddy reverse proxy |

### Canonical static sources

| Site | Path | Type | Build Required |
|------|------|------|----------------|
| `arif-fazil.com/` | `sites/arif-fazil.com/` | React 19 + Vite | ✅ Yes |
| `aaa.arif-fazil.com/` | `sites/aaa.arif-fazil.com/` | Static HTML | No |
| `arifos.arif-fazil.com/` | `sites/arifos.arif-fazil.com/` | Static docs | No |
| `geox.arif-fazil.com/` | `sites/geox.arif-fazil.com/` | Static lab GUI | No |
| `wealth.arif-fazil.com/` | `sites/wealth.arif-fazil.com/` | Static organ surface | No |

Runtime-owned surfaces and redirects are listed in `config/sites.json`. Never create a hostname directory without adding it to that registry. All `/_shared/*` assets belong only in `sites/shared/`.

## Authority & Autonomy

### Autonomous
- Build static sites, update HTML/CSS/JS
- Update `sites/arif-fazil.com/` React source
- Run builds and the registry-backed deployer

### Requires 888_HOLD
- Domain/DNS changes
- Caddy routing changes or reload
- `.env` or secret exposure in static files
- `rm -rf sites/` or deletion of live subsites

## Build & Test

```bash
cd /root/ARIF-SITES

# Only the flagship site requires a build:
cd sites/arif-fazil.com && npm install && npm run build

# Deploy to VPS
./deploy-vps.sh
./deploy-vps.sh --site arifos.arif-fazil.com
```

## Key Files

| File | Purpose |
|------|---------|
| `config/sites.json` | Canonical machine-readable site registry |
| `/etc/caddy/Caddyfile` | Live reverse proxy config |
| `deploy/Caddyfile` | Unreconciled reference snapshot; do not apply directly |
| `sites/shared/` | Design-system + WebMCP (synced to `/var/www/html/_shared/`) |
| `deploy-vps.sh` | Sole deploy implementation |

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

*DITEMPA BUKAN DIBERI — 999 SEAL ALIVE*
