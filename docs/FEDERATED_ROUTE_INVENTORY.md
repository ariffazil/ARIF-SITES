# Federated Route Inventory

**Branch:** `forge/federated-site-navigation`  
**Observed:** 2026-07-17  
**Scope:** `ariffazil/arif-sites` · root SPA + Caddy commodity apps + organ domains  

## Classification legend

| Class | Meaning |
|-------|---------|
| CANONICAL_ROUTE | Intended public URL |
| ALIAS | Human typo / legacy path → canonical |
| REDIRECT | Server or router redirect |
| HASH_SECTION | In-page anchor |
| CONTENT_WITHOUT_ROUTE | Content exists, no stable human route |
| ORPHAN_PAGE | Reachable but not linked from nav |
| DUPLICATE | Same content multi-URL without canonical |
| STALE | Wrong tool counts / release |
| BROKEN | 404 or empty SPA shell |
| PRIVATE | Operator-only |
| ARCHIVED | Historical |

## VERIFIED EXISTING ROUTES (React SPA)

| Path | Class | Notes |
|------|-------|-------|
| `/` | CANONICAL_ROUTE | Home |
| `/000`, `/000/` | CANONICAL_ROUTE | Genesis |
| `/wealth`, `/wealth/` | CANONICAL_ROUTE | Markets surface |
| `/wealth/article/:slug` | CANONICAL_ROUTE | Wealth articles |
| `/wealth/makcikgpt` | ALIAS (was CANONICAL) | Now aliases to `/makcikgpt` |
| `/discoveries` | CANONICAL_ROUTE | Discoveries page |
| `/constellation` | CANONICAL_ROUTE | Ecosystem |
| `/canon` | CANONICAL_ROUTE | Canon |
| `/essays`, `/essays/:slug` | CANONICAL_ROUTE | Writing |
| `/arifos/` | CANONICAL_ROUTE | Static human overview (Caddy) |
| `/federation/` | CANONICAL_ROUTE | Static federation explainer |
| `/organs/{geox,wealth,well}/` | CANONICAL_ROUTE | Static organ explainers |
| `/999/` | CANONICAL_ROUTE | Proof chamber (static) |
| `/verify/` | ALIAS | Points to verification UX |

## MISSING BEFORE THIS BRANCH (SPA)

| Path | Class before | Evidence |
|------|--------------|----------|
| `/oil` | BROKEN / CONTENT_WITHOUT_ROUTE | SPA shell, no React route; Caddy commodity app only under `/oil/*` |
| `/gas` | BROKEN / CONTENT_WITHOUT_ROUTE | Same pattern |
| `/gold` | BROKEN / CONTENT_WITHOUT_ROUTE | Same pattern |
| `/wells` | MISSING | Portfolio only on Home `#wells` |
| `/makcikgpt` | REDIRECT chain | Caddy 301 → `/writings/makcikgpt/` (prod); React only had `/wealth/makcikgpt` |
| `/gass` | BROKEN | Typo not handled |
| `/makcikpgt` | BROKEN | Typo not handled |

## Caddy / ops surfaces (separate from SPA)

| Path | Class | Notes |
|------|-------|-------|
| `/oil/*` | CANONICAL_ROUTE (ops dashboard) | `/var/www/html/oil` commodity app |
| `/gas/*` | CANONICAL_ROUTE (ops dashboard) | `/var/www/html/gas` |
| `/gold/*` | CANONICAL_ROUTE (ops dashboard) | `/var/www/html/gold` |
| `/writings/makcikgpt/*` | CANONICAL_ROUTE (publish) | Civic pipeline |
| `geox.arif-fazil.com` | CANONICAL_ROUTE | GEOX organ |
| `wealth.arif-fazil.com` | CANONICAL_ROUTE | WEALTH organ |
| `well.arif-fazil.com` | CANONICAL_ROUTE | WELL organ |
| `mcp.arif-fazil.com` | CANONICAL_ROUTE | MCP gateway |
| `arifos.arif-fazil.com` | CANONICAL_ROUTE | Observatory |

## STALE (pre-repair notes)

| Surface | Issue |
|---------|-------|
| WELL HTML | Previously ~22 tools (fixed live earlier) |
| GEOX HTML | Previously 30 tools / v0.1.0 (fixed live earlier) |
| llms.txt | Claimed 13 MCP tools; public facade is 8 |

## ORPHAN / DUPLICATE risks

| Item | Class | Resolution in this branch |
|------|-------|---------------------------|
| Commodity dashboards vs human landings | DUPLICATE risk | Human `/oil|/gas|/gold` explain; ops apps remain under `/*` paths for apps |
| MakcikGPT multi-URL | DUPLICATE | Canonical `/makcikgpt`; aliases preserve legacy |

## PRIVATE (do not surface)

AAA operator controls, A-FORGE execution, seal operator tokens, vault write paths.
