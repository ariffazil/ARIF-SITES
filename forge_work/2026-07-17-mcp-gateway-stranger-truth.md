# MCP Gateway — stranger-truth redesign

**Date:** 2026-07-17  
**Host:** mcp.arif-fazil.com  
**Rule:** Show the minimum a stranger needs to understand, connect, test and trust.

## Done (live)

### P0
- Replaced hero with product value: *Govern AI actions before they change the world.*
- Connect box first: ChatGPT | Claude | Cursor | Generic MCP tabs + copy.
- Safe HOLD demo (client-side simulation; no mutation): unauthorized destructive action → HOLD + receipt.
- Health banner split from federation inventory; live release/commit/manifest from `/health`.
- Explained 8 public vs internal/declared tools without the “declared 48” suspicion string.
- Canonical URL stays `https://mcp.arif-fazil.com/`.

### P1
- Collapsed global unified header to five sections: Arif · Work · arifOS (dropdown) · Writing · Contact.
- Organs (GEOX/WEALTH/WELL/AAA/A-FORGE) no longer top-level nav; live under arifOS → Federation / organ cards.
- `/000` and `/999` labeled Genesis / Verification inside arifOS menu.
- Product pages (`data-header="product"`) use compact chronometer: `DD MON YYYY · HH:MM MYT · EPOCH YYYY-MM`.

### SEO / single public truth
- `aaa.arif-fazil.com/mcp-gui` and `/mcp`: `noindex` + canonical → mcp.arif-fazil.com.
- `arif-fazil.com/mcp` stub: `noindex` + redirect to canonical gateway.
- AAA robots Disallow diagnostic MCP explorers.
- Stale “13 tools” claims corrected in wiki map, cheatsheet, log, GEOX status, AAA meta.

### Deploy
- `deploy-vps.sh` always syncs MCP landing + proof (no `--delete` on runtime `.well-known`).
- Shared assets version `?v=20260718`.

## Remaining (operator)

| Item | Owner |
|------|--------|
| Google Search Console / Bing URL inspection recrawl for mcp + arifos | Arif (external) |
| Full `arif-fazil.com` rebuild so ConstellationNav primaryLinks match five-section model | next sites deploy with npm build |
| Optional: permanent Caddy redirect `arif-fazil.com/mcp` → `mcp.arif-fazil.com` | 888 if Caddy change desired |
| Signed judgment receipt from live `arif_judge` (not only client demo) | when OAuth demo session is wired |

## Live probe (T₁)

- Release: `v2026.07.17-ZEN-SURVIVAL`
- Public tools: 8
- Declared total (internal): 48 (40 diagnostic — not public wire)
- Canonical: https://mcp.arif-fazil.com/

DITEMPA BUKAN DIBERI
