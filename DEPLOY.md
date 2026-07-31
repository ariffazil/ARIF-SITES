# DEPLOY.md — arif-fazil.com Deploy Runbook for Agents

> **One command: `make deploy`. That's the contract. Everything below is the explanation.**

## Quick Start

```bash
cd /var/www/html
make deploy
```

That verifies surfaces, builds the SPA, validates Caddy, and reloads. All gates must pass.

## What `make deploy` does

```
verify → build → reload
  │        │        └── Validate Caddy config + systemctl reload caddy
  │        └── npm build + regenerate discovery catalogs
  └── verify-surfaces.cjs (every live surface must return 200)
```

If any gate fails, the deploy stops. **Fail-closed.**

## Repository Map

| Path | Role |
|------|------|
| `/var/www/html/` | **DEPLOYED SITE** — this is what Caddy serves. Also a git repo (`arif-sites`). |
| `/root/arif-fazil.com/` | **CANONICAL SOURCE** — the authoritative repo (`arif-fazil.com`). Deploy scripts here. |
| `/etc/caddy/Caddyfile` | **CADDY CONFIG** — on the VPS, not in git. Edit here, validate with `caddy validate`. |
| `/var/www/html/arif/` | **SPA ROOT** — Caddy serves React app + static files from here. |

## Key Files

| File | Purpose | Agent Must |
|------|---------|------------|
| `surfaces.json` | **CANONICAL** route catalog | Read before adding/removing any route |
| `scripts/verify-surfaces.cjs` | Pre-deploy truth check | Run before every deploy |
| `scripts/generate-discovery.cjs` | Generate sitemap + llms from essays | Run after content changes |
| `sites/arif-fazil.com/` | React SPA source | Build with `npm run build` |
| `arif/robots.txt` | Crawler policy + AI directives | Update when bot policy changes |
| `arif/rsl.xml` | RSL 1.0 license | Update when licensing changes |
| `llms.txt` | AI site overview | Generated, never hand-edit |
| `llms-full.txt` | Full content for AI agents | Generated from MD sources |
| `AGENTS.md` | Coding agent instructions | Read before touching any file |

## Adding a New Page

1. Add the route to `sites/arif-fazil.com/src/App.tsx`
2. Add the surface entry to `surfaces.json` with `status: "live"`
3. Run `make verify` — if it passes, the route resolves
4. Run `make deploy`
5. Commit: `git commit -m "feat: add /new-page"`

## Removing a Page

1. Change status to `"gone"` in `surfaces.json` (never delete the entry)
2. Remove the route from `App.tsx`
3. Run `make verify` — gone surfaces are excluded from verification
4. Run `make deploy`
5. Commit with `fix:` or `chore:` prefix

## Modifying Caddy Config

```bash
vim /etc/caddy/Caddyfile
caddy validate --config /etc/caddy/Caddyfile  # MUST pass
systemctl reload caddy                          # apply
make verify                                     # confirm surfaces still resolve
```

## Emergency Rollback

```bash
git log --oneline -5              # find the last good commit
git revert <bad-commit>           # or git reset --hard <good-commit>
make deploy                       # re-deploy the last good state
```

## Agent Contract

Every agent that touches this site must:

1. **Read `surfaces.json` first** — it's the constitution of what exists
2. **Run `make verify` before deploy** — never ship a lying catalog
3. **Never hand-edit generated files** — `llms.txt`, `llms.json`, `page.json`, `sitemap.xml`, `missions.json` are generated views
4. **Status `gone`, never delete** — historical surfaces document what was removed
5. **Fail-closed** — a 404 from a live surface blocks deploy. Fix the surface or update its status.
6. **Commit after deploy** — the repo must reflect what's live

## Common Tasks

```bash
make status         # "is everything up?"
make dry-run        # "will deploy succeed?"
make verify         # "are all surfaces truthful?"
make build          # "just rebuild the SPA"
make reload         # "just reload Caddy"
make help           # "what commands are available?"
```

## Secrets & Environment

- All secrets live in `/root/.secrets/vault.env` — never in this repo
- Caddy uses Cloudflare Origin CA for TLS — not Let's Encrypt
- No `.env` files in the web root

## Federation Context

This site is part of the arifOS federation. Related deploys:

| Organ | Deploy Command | Health Check |
|-------|---------------|--------------|
| arifOS | `cd /root/arifOS && make deploy-local` | `curl :8088/health` |
| A-FORGE | `cd /root/A-FORGE && systemctl restart a-forge` | `curl :7071/health` |
| GEOX | `cd /root/geox && systemctl restart geox-mcp` | `curl :8081/health` |
| WEALTH | `cd /root/WEALTH && systemctl restart wealth-organ` | `curl :18082/health` |
| WELL | `cd /root/WELL && systemctl restart well` | `curl :18083/health` |

---

*DITEMPA BUKAN DIBERI — Forged, Not Given.*
*Last updated: 2026-07-31. Canonical source: /var/www/html/DEPLOY.md*
