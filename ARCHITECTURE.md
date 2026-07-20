# arif-fazil.com — Site Architecture (Zen Cut)

## Principle
The human site is a **federation portal**. Every top-level page is a doorway to a federation organ.
One purpose per page. One canonical address per system.

## Navigation (7 items, 1:1 with systems)

```
Home       →     Ψ sovereign identity (Arif's bio, wells, scar portfolio)
               ↗ https://arif-fazil.com
Earth      →  Φ doorway to GEOX (subsurface physics, well portfolio)
               ↗ https://geox.arif-fazil.com
Economics  →  Ξ doorway to WEALTH (daily briefing + capital context)
               ↗ https://wealth.arif-fazil.com
World      →  🌍 MakcikGPT + commodities (civic journalism, rakyat-facing)
               no organ link — it IS the organ
Writing    →  📝 essays + series (human narrative)
               no organ link — it IS the human surface
Doctrine   →  ⚖️ doorway to arifOS (constitution, federation topology)
               ↗ https://arifos.arif-fazil.com
Federation →  ⊆ all organs + MCP gateway (built-in nav)
               ↗ https://arifos.arif-fazil.com
```

## The doorways — what each page IS

### /earth → geox.arif-fazil.com
- Purpose: "What I find underground"
- Content: Wells portfolio (LEBAH EMAS-1, BEKANTAN-1, etc.) — the actual work
- Link: "Open GEOX Cockpit → geox.arif-fazil.com"
- NOT a geoscience app. The app lives at geox.arif-fazil.com

### /economics → wealth.arif-fazil.com
- Purpose: "What Malaysia's money is doing"
- Content: Daily Briefing (KLCI, USD/MYR, Brent, So What analysis)
- Link: "Open WEALTH Cockpit → wealth.arif-fazil.com"
- NOT a capital engine. The engine lives at wealth.arif-fazil.com

### /world (standalone — no organ link needed)
- Purpose: "What's happening to the rakyat"
- Content: MakcikGPT civic journalism + commodity Δ-pages
- Own content: no organ link needed (it IS the civic journalism surface)

### /writing (standalone)
- Purpose: "What I think"
- Content: Essays, series, MakcikGPT index
- Own content: no organ link needed (it IS the human narrative)

### /doctrine → arifos.arif-fazil.com
- Purpose: "The rules"
- Content: F1-F13 summary, federation topology, manifesto
- Link: "Open arifOS Observatory → arifos.arif-fazil.com"
- NOT the full constitution. The kernel lives at arifos.arif-fazil.com

### Footer (clean)
GitHub · Telegram · Email | Observatory · MCP Gateway | llms.txt · soul.json · rss

## Organ domains (separate, full capability)

| Domain | Purpose | Handles |
|--------|---------|---------|
| geox.arif-fazil.com | Earth intelligence | Basin, seismic, petrophysics, wells |
| wealth.arif-fazil.com | Capital intelligence | NPV, EMV, markets, briefing API |
| well.arif-fazil.com | Human vitality | Biometrics, readiness, fatigue |
| arifos.arif-fazil.com | Constitutional kernel | Observatory, health, floor state |
| aaa.arif-fazil.com | Agent control plane | A2A gateway, cockpit, agent registry |
| forge.arif-fazil.com | Governed execution | A-FORGE tools, OpenCode IDE |
| mcp.arif-fazil.com | MCP gateway | Connection config, registry listings |

## What this fixes
1. Every organ has ONE doorway on the human site — no scattered paths
2. Each doorway points to the organ's canonical domain — no address confusion
3. Human content stays human (writing, MakcikGPT) — not mixed with organ content
4. Machine surfaces stay separate (MCP, forge) — not cluttering the human page
