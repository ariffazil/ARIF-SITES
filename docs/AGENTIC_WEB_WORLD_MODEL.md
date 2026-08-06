<!-- SOT-MANIFEST
owner: Arif (F13)
last_verified: 2026-08-04
scope: public constellation · agentic web world model
doctrine: One human surface. Organ domains are agent doors, not rival brands.
epistemic_status: CLAIM (ratified by live hybrid + sealed hybrid IA 2026-08-04)
-->

# Agentic Web World Model

> **DITEMPA BUKAN DIBERI** — One coherent system, three planes. Not eight websites.

## Answer (sovereign)

**Yes — link organ domains. No — do not make them peer human home pages.**

| Plane | What it is | Where |
|-------|------------|--------|
| **Human world model** | Story, missions, economics, earth, writing, doctrine, 999 | `https://arif-fazil.com` only |
| **Agent / MCP doors** | Protocol endpoints, organ landings, tool surfaces | `*.arif-fazil.com` organ hosts |
| **Law** | Nav, redirects, authority, tokens | `web-canon` → generates site `navCanon` |

Primary nav never lists organ subdomains. Machine footer + Federation/Doctrine/Connect pages **do** link them.

## Live dual-plane map (OBS 2026-08-04)

### A. Human narrative (apex paths)

| Path | Role |
|------|------|
| `/earth` · `/economics` · `/world` · `/writing` · `/doctrine` · `/missions` · `/999` | Public hybrid IA (LIVE) |
| `/arifos/` · `/aaa/` · `/geox/` · `/wealth/` · `/well/` · `/wiki/` | Organ **story** under one domain |
| `/vitals/` | PETRONAS VITALS (static sacred) |
| `/000/` · `/999/` | Genesis + vault proof |

### B. Organ domains — when to use which

| Host | Live role | Human should land on |
|------|-----------|----------------------|
| `arifos.arif-fazil.com` | 301 → apex `/arifos/` (or keep MCP/observatory deep links) | `/arifos/` or `/doctrine` |
| `aaa.arif-fazil.com` | 301 → `/aaa/` | `/aaa/` · missions |
| `forge.arif-fazil.com` | → MCP door | `mcp.arif-fazil.com` |
| `geox.arif-fazil.com` | **Agent door** (200 organ UI) | link from Earth; not primary nav |
| `wealth.arif-fazil.com` | **Agent door** (MCP + capital) | link from Economics/VITALS |
| `well.arif-fazil.com` | **Agent door** (vitality) | link from Doctrine/Federation |
| `mcp.arif-fazil.com` | **Membrane** — WebMCP + explorer | machine footer · Connect |
| `wiki.arif-fazil.com` | **must** 301 → `arif-fazil.com/wiki/` | never orphan 404 |

**Rule D1 (MCP exempt):** agent protocol URLs (`/mcp`, health, well-known) stay on organ hosts.  
**Rule D3 (one-hop):** human browser hits on narrative subdomains redirect once to apex paths.  
**Rule F4:** no third map. If README, surfaces.json, and live disagree — live + `surfaces.json` win; fix the other.

## What “one coherent system” means

```
web-canon (law)  →  arif-fazil.com site (body)  →  live VPS (verify only)
       ↑                        ↑
  navigation.json         navCanon + SPA + static
  redirects.yaml          Caddy + public/
  sites.yaml              surfaces.json (catalog)
```

1. **One IA for humans** — hybrid Arrow strip (Earth · Economics · World · Writing · Doctrine · Missions · 999). Trinity remains `DRAFT_FUTURE`.
2. **Six missions, not 128 tools** — `/missions` + `/missions.json`.
3. **Organ domains = federation edges** — agents dock there; humans discover them through apex.
4. **Nothing generated only in live tree** — source → deploy → doctor.

## Do / Don't

| Do | Don't |
|----|--------|
| Link MCP doors in machine footer + connect-src CSP | Put `geox.arif-fazil.com` in primary navbar |
| Redirect dead human paths (`/cockpit`, bare `/proof`) | Sell Trinity `/human` `/institution` as live product |
| Keep Earth portal static sacred on deploy | `rsync --delete` without `web_zen orphan` |
| Catalog every public route in `surfaces.json` | Advertise organ subdomain as a separate “product brand” |

## Residual gates (not world-model redesign)

- GitHub Actions runner assignment (infra, not SPA)
- Dual historical trees under `/var/www/html` collapse
- Canon `redirects.yaml` still names some `/institution/*` targets — **hybrid live paths** (`/arifos/`, agent doors) are truth until trinity is productized

## Verify

```bash
python3 scripts/web-zen/web_zen.py doctor
# human plane
curl -sI https://arif-fazil.com/missions | head -1
# agent plane
curl -sI https://mcp.arif-fazil.com/ | head -1
curl -sI https://geox.arif-fazil.com/ | head -1
```

DITEMPA BUKAN DIBERI.
