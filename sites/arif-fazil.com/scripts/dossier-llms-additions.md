/*
 * dossier-llms-additions.md
 *
 * Post-build fragment appended to /llms.txt by agentic-build.sh.
 * This file holds human-curated dossier entries that the build pipeline
 * does NOT auto-generate from src/data/essays.json.
 *
 * The pattern: keep auto-generated files pure, route all manual additions
 * through a single visible hook (this file) so the build stays reproducible.
 *
 * To add a new basin dossier: append a section here and re-run agentic-build.sh.
 */
## /earth/kinabalu-basin/ — Kinabalu Basin Dossier
- `/earth/kinabalu-basin/` — Full 6-section geological dossier on the Kinabalu Basin (NW Sabah, offshore Malaysia). Tectonic evolution, stratigraphy, petroleum system, cross-section, recent discoveries, open questions. Sources: Balaguru & Hall 2009, Balaguru et al. 2003, Bait 2003, Madon & Jong 2022, PETRONAS MPM 2025, TGS Choi EAGE 2026, Ab Ghani EAGE 2026, Cornwell JGR 2025.
- `/earth/kinabalu-basin.pdf` — 10-section PDF reference (21 KB).
- `/earth/kinabalu-cross-section.html` — Geological-grade cross-section with USGS-standard lithology patterns, 5 well sticks (Megah-1, Tepat-1, Well A, Well B, Zoisit Deep-1), W-vergent imbricated thrust sheets T1-T4, angular DRU/BMU + SRU unconformities, listric normal faults, ophiolite obduction.

## /earth/malay-basin/ — Malay Basin Dossier
- `/earth/malay-basin/` — Full 6-section geological dossier on the Malay Basin (founder's home waters, 13+ years). Group A–M stratigraphy, 4 founder wells (BEKANTAN-1, PUTERI BASEMENT-1, LEBAH EMAS-1, BUNGA TASBIH-1), 3 plays at 3 risk levels (proven/emerging/frontier), Western Hinge Fault 2025 new play.
- `/earth/malay-basin-cross-section.html` — Geological-grade cross-section with USGS-standard lithology patterns, anticlinal closures, 4 founder wells at correct positions, Western Hinge Fault, fractured-granite play (PUTERI BASEMENT-1).

## Federation Zen Bootstrap
- `/_shared/zen-all.js` — Runtime injector (skip-link, <main>, trinity-nav, zen-pulse, back-home, doctrine footer, ARIA). Idempotent. Include via `<script src="/_shared/zen-all.js" defer></script>` before `</body>` to auto-zen any page. 12/13 served federation pages already use it.
- `/_shared/trinity-nav.js` — Federation cross-link nav (Ψ SOUL · Ω MIND · Δ BODY · Φ GEOX · Σ WEALTH · Ω★ WELL · ⚒ FORGE · ○ MCP · ⚣ HERMES).
- `/_shared/zen.css` — Federation zen stylesheet (43 KB).
