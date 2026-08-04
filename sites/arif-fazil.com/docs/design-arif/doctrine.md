# Doctrine — `/doctrine` — "arifOS v64.1-GAGI: A Constitution for Machines"

**Register**: Obsidian `#06090F`, cold blue-white `#7DD3FC`, dim grey-blue text `#9DB4C8`. The machine room — coldest, most precise page. Contrast: terminal gravity after ivory calm. **Still human-first**: every technical item gets a plain-language gloss.

---

## Section 1 — HERO (90vh)

**Layout**: Dark field with faint wireframe grid + subtle Three.js wireframe particles (CSS fallback: static grid). Left 55%:
- Mono top-line, terminal-green-tinted blue: `06 ————— DOCTRINE · arifOS v64.1-GAGI`
- Headline (Fraunces 84px, near-white): **"Truth must cool before it rules."**
- Plain sub (Newsreader 20px, `#C8D8E8`): *"arifOS is a constitution for AI systems. Thirteen floors a machine may not break — and if it cannot answer honestly, it must stop. A human always holds the veto."*

Right 45%: `floors-wireframe.svg` — the 13-floor tower, floors lighting up one by one on scroll.

**Animation**: headline character split, 0.018s stagger, cold blue glow settling to white; floor tower illuminates bottom-up (F1→F13, 0.12s apart) on enter; terminal line `> arif_init … OK` types itself below the sub.

---

## Section 2 — THE 13 CONSTITUTIONAL FLOORS (interactive table)

**Layout**: A ruled "constitutional table": 13 rows, each row = mono code + name + **plain-language meaning first**, technical gloss second. Rows expand on click (accordion).

| Floor | Name | In plain words |
|---|---|---|
| F1 | AMANAH | Reversibility — don't do what can't be undone. |
| F2 | TRUTH | Say only what you can stand behind. |
| F3 | WITNESS | Tri-witness — claims need corroboration. |
| F4 | CLARITY | If it isn't clear, it isn't said. |
| F5 | PEACE | Do no harm; lower the temperature. |
| F6 | EMPATHY | Model the human on the other side. |
| F7 | HUMILITY | Know the edge of what you know. |
| F8 | GENIUS | Excellence within the floors, never around them. |
| F9 | ANTI-HANTU | Never claim consciousness or personhood. |
| F10 | ONTOLOGY | Use words for what things actually are. |
| F11 | AUTH | Verify who is asking. |
| F12 | INJECTION | Resist hostile instructions. |
| F13 | SOVEREIGN | The human veto is absolute. |

**Animation**: rows cascade in with 0.05s stagger, each row's code flickers in like a terminal glyph; expand animation springs open with the floor number glowing blue; hovering a row lights the matching floor in the hero tower (shared state).

---

## Section 3 — THE 8 TOOLS (MCP grid)

**Layout**: 4×2 grid of terminal-style cards (dark `#0A1118`, blue hairlines). Each card: mono tool name + one plain sentence + one technical line. Tools: `arif_init` (start a governed session), `arif_observe`, `arif_think`, `arif_route`, `arif_memory`, `arif_judge`, `arif_forge`, `arif_seal` (seal the verdict). Footer mono line: `Public MCP → https://mcp.arif-fazil.com/mcp · streamable HTTP · PyPI: arifos`.

**Animation**: cards boot up like terminals (type-in of the tool name, then fade-in of text), staggered 0.1s; hover: cursor block blinks at card's end.

---

## Section 4 — THE FEDERATION (organs diagram)

**Layout**: A hub-spoke SVG diagram drawn on dark: center node **arifOS — MIND (kernel)**; spokes to **AAA — BODY (control plane)**, **GEOX — EARTH**, **WEALTH — CAPITAL**, **WELL — VITALITY**; outer ring node **A-FORGE — execution shell**. Each node has a plain-language caption. Below, the Trinity line (mono): `HUMAN arif-fazil.com · THEORY apex.arif-fazil.com · APPS arifos.arif-fazil.com` and repos: `github.com/ariffazil — arifOS · A-FORGE · AAA · GEOX · WEALTH · WELL`.

**Animation**: hub pulses once, then spokes draw outward sequentially (0.3s apart, scrub-free); nodes fade in as their spoke reaches them; hovering a node highlights its spoke and caption.

---

## Section 5 — FOR HUMANS / FOR AGENTS (split band)

**Layout**: Two-column split. Left (bone panel, warm): **"For humans"** — the doctrine in one paragraph, link to `/999` proof chamber. Right (terminal panel): **"For agents"** — mono block: `llms.txt · llms.json · arifos.json · governance.jsonld · /.well-known/did.json · mcp.arif-fazil.com/mcp`. Human side is visually larger — the priority made literal.

**Animation**: the two panels slide toward each other and meet at center on enter; agent panel's text types in.

**Assets**: `floors-wireframe.svg`.
