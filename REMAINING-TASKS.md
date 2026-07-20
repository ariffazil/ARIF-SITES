# arif-fazil.com — Remaining Tasks (Open for Next Agent)

> **SOT:** 2026-07-20 | **Architecture:** ARCHITECTURE.md (canon v1)
> **Sealed commit:** 024ea95 + d019b99

## T1 — Quick Fixes (AUTO-DO, same-session)

1. **/essays/:slug → /writing/:slug redirect** — `Essays.tsx` still mounted at `/essays` route. Already redirects, but old component can be retired and `EssayPage` deduplicated.

2. **Commodity dashboards — API server uptime** — `/oil/`, `/gas/`, `/gold/` static dashboards source prices from Node.js APIs (port 3457, 3458, 3459). These may need a `systemctl restart` if stale data persists.

3. **llms.txt MakcikGPT count** — Currently lists 12 articles inline. With 16 now in `essays.json`, consider rendering feed from that data file.

4. **Stale data scan** — Run `refresh_briefing.py` check to confirm TokenRouter + yfinance pipe is producing fresh data daily at 00:00 UTC.

## T2 — Structural (ANNOUNCE before executing)

5. **MCP tool alignment — "Canonical 9" vs live 8 verbs** — The MCP server advertises `arif_critique` and `arif_compose` as part of the Canonical 9, but live `tools/list` shows 8 verbs with `arif_memory` present instead. Either add the two verbs to the MCP server implementation, or update the instructions to match the 8 that exist. This is a code change in `/root/arifOS/arifosmcp/`.

6. **Wiki on the architecture map** — `wiki.arif-fazil.com` (live, 200) is the deep doctrine home. It needs a place in the Federation portal (`/federation`) and in the footer as a discoverable link. Currently not linked from any nav.

7. **SPA per-route `<title>`** — All SPA routes currently share the fallback shell title. React's `document.title` works client-side, but agents doing plain GETs receive the same title everywhere. This is a React Helmet / SSR fix for the next iteration.

8. **Soft-404 to real 404** — `/nonexistent-route` returns 200 (SPA shell). True HTTP 404 would require server-side routing or a Caddy rewrite rule for known paths only.

## T3 — Evidence-Gating (needs briefing engine changes)

9. **Briefing Ω-layer evidence gating** — The daily briefing at `/economics` needs:
   - FOMC/MPC calendar gate (hard-block any mention of future meetings)
   - Per-claim source ID rendering in the UI (currently in JSON, not displayed)
   - Current policy facts auto-injected (BUDI95, diesel, DOSM GDP, Anwar polls)

10. **Commodity Ω layer** — Currently Δ-only. Re-enable when briefing engine audit passes.

## P0 — Open Fires (fix before next deploy)

11. **MakcikGPT HTTP-level 301** — Client-side React redirects work for humans, but agents doing plain GETs receive 200 at `/economics/makcikgpt/` and `/wealth/makcikgpt/`. Need Caddy-level 301 redirects to `/world/makcikgpt/` for true canonical enforcement.

## Calibrated Done list (what's actually fixed)

- ✅ Nav: 7 items, 1:1 with system mapping (Home·Earth·Economics·World·Writing·Doctrine·Federation)
- ✅ Static /000/ and /999/ — agent-readable, not SPA shells (28KB and 11KB, verified)
- ✅ Federation cardinality — 5 organs (arifOS, AAA, GEOX, WEALTH, WELL) + 3 interfaces (forge, mcp, portal)
- ✅ Essays.json — 50 pieces (34 EN + 16 BM), one data file drives all views
- ✅ MakcikGPT at /world/makcikgpt/ — canonical path (client-side redirect from /economics/ and /wealth/)
- ✅ Commodity pages at /world/oil /world/gas /world/gold — Δ-only, no Ω narrative
- ✅ Doorway pattern — Earth→GEOX, Economics→WEALTH, Doctrine→arifOS, Federation→AAA
- ✅ Design system ORGAN ring tokens
- ✅ trinity-nav on all static sites
- ✅ WebMCP on all organ sites
