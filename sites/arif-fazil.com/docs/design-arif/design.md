# arif-fazil.com — Global Design Document
**"The Arrow of Time" — Design Architecture v2.0**

A human-first personal site for Arif Fazil — geoscientist, economist, and AI governance architect. The hero of the main site is a **live clock**: a real, ticking timepiece embodying the thermodynamic arrow of time. Every page gets its own visual register ("strong contrast between pages") while one coherent system holds them together. Machine/agent affordances exist but are **subordinate** — human language first, always.

---

## 1. Design Philosophy

**"Forged, Not Given" (DITEMPA BUKAN DIBERI)** — the site should feel *made*, not generated. Typography does the heavy lifting; motion is precise and physical, never decorative noise. Time, entropy, pressure, and cooling are the metaphors: oil forms under heat and pressure; truth must cool before it rules.

**Human-first for the agentic web**: every claim is written in plain, warm, precise English a human can read aloud. Agent affordances (llms.txt, MCP endpoint, DID document) live in a quiet "For machines" footer row and a small terminal-styled corner — present, discoverable, never dominant.

**Contrast between pages**: one skeleton, many skins. Each page shifts palette, texture, and motion temperament:

| Page | Register | Mood |
|---|---|---|
| `/` Home | Bone paper + ink + ember | The ticking present |
| `/earth` | Deep basalt + seismic amber | Pressure, depth, discovery |
| `/economics` | Ledger green + brass | Markets, ledgers, incentives |
| `/world` | Newsprint white + civic red | MakcikGPT journalism, BM voice |
| `/writing` | Ivory + pencil graphite | Margins, drafts, essays |
| `/doctrine` | Obsidian + cold blue-white | Constitutional code, the 13 Floors |
| `/999` | Void black + gold proof-seal | The proof chamber |

---

## 2. Global Tokens

### Color (global base — pages override accent)
- `--paper: #F4F0E6` — warm bone paper (home background)
- `--ink: #14110C` — near-black warm ink (primary text)
- `--ink-soft: #4A443A` — secondary text
- `--ember: #E4572E` — accent: ember orange (time/heat)
- `--gold: #C9A227` — proof/gold accent (999, seals)
- `--line: #14110C` at 12% opacity — hairlines everywhere
- Per-page accents: earth `#FF9F1C` seismic amber · economics `#1E6F50` ledger green + `#B08D3E` brass · world `#C8102E` civic red · writing `#5C5546` graphite · doctrine `#7DD3FC` cold blue on `#06090F`

### Typography
- **Display/Headlines**: `"Fraunces"` (Google Fonts, variable opsz) — an old-style serif with real character. Weights 400–900. Used at 64–140px on heroes, `letter-spacing: -0.02em`, `line-height: 0.95`.
- **Body/Prose**: `"Newsreader"` (Google) — 18–20px, `line-height: 1.65`, max-measure 65ch. Warm and readable.
- **Mono (time, data, agent labels)**: `"IBM Plex Mono"` — the live clock, well names, coordinates, floor codes (F1–F13). 13–15px, `letter-spacing: 0.04em`, uppercase for labels.
- **BM/Makcik voice pullquotes**: Fraunces Italic.

### Spacing & Layout
- 8px base scale: 8/16/24/40/64/96/160.
- Max content width 1280px; prose column 680px.
- Hairline-ruled grid aesthetic: 1px rules, numbered sections (`01`, `02`… in mono), generous whitespace.

### Motion Style
- **Lenis** smooth scroll globally (`lerp: 0.1`).
- **GSAP + ScrollTrigger** for scroll storytelling; **Framer Motion** for micro-interactions and page transitions.
- Signature motion: **mechanical tick** — elements snap in discrete steps (like a clock's second hand) with `steps()` easing in select places, contrasting with buttery Lenis elsewhere. This tick is the site's kinetic identity.
- Page transitions: 500ms curtain wipe in the destination page's accent color.
- Cursor: default arrow + custom 12px dot ring that turns into a crosshair over interactive elements; on `/999` it becomes a gold seal stamp on click.

### Shared Components
- **Navbar**: hairline top bar, 64px. Left: `ARIF FAZIL` in Fraunces 18px + small live HH:MM:SS mono readout (site-wide clock echo). Right: links `Earth · Economics · World · Writing · Doctrine · 999` in mono 13px uppercase, active link underlined in page accent. Mobile: full-screen overlay menu, links stagger in 60ms apart.
- **Footer**: three rows. Row 1: big Fraunces line "Forged, not given." Row 2: human contact — email `arifos@arif-fazil.com`, GitHub `ariffazil`, Telegram `@ariffazil`. Row 3: **"For machines"** hairline-separated quiet row in mono 12px: `llms.txt · arifos.json · /.well-known/did.json · mcp.arif-fazil.com/mcp · PyPI arifos`. © 2026 Muhammad Arif bin Fazil.
- **Fact-tag component**: inline mono chips used site-wide: `[OBS]` observed, `[DER]` derived, `[INT]` interpretation, `[SPEC]` speculative — the honesty doctrine made visual.
- **Section header**: mono number + rule + title, e.g. `02 ————— DISCOVERIES`.

---

## 3. Fact-Checked Content Baseline (all pages must use these)

- Muhammad Arif bin Fazil, b. May 22, 1990, Penang, Malaysia (age 36). Northern Malay heritage.
- **13 years** at PETRONAS (2013–present), exploration geoscientist. *(Corrected from "12+".)*
- Double major: Geology & Geophysics + Economics, UW–Madison. PETRONAS Scholar.
- Wells: **BEKANTAN-1** — shallowest flowing oil discovery in the **Malay Basin** *(scope corrected from "in Malaysia")*; **PUTERI BASEMENT-1** — fractured basement test; **LEBAH EMAS-1** — new play wildcat; **BUNGA TASBIH-1** — led to Small Field Asset PSC award.
- Exploration record phrasing: "Every exploration well he has led has flowed." *(Not "100% success rate".)* Instrumental to PM318 realization.
- arifOS **v64.1-GAGI**; 13 Constitutional Floors F1–F13 (AMANAH, TRUTH, WITNESS, CLARITY, PEACE, EMPATHY, HUMILITY, GENIUS, ANTI-HANTU, ONTOLOGY, AUTH, INJECTION, SOVEREIGN); 8 MCP tools (arif_init, observe, think, route, memory, judge, forge, seal); public MCP at `https://mcp.arif-fazil.com/mcp`.
- Trinity: HUMAN arif-fazil.com · THEORY apex.arif-fazil.com · APPS arifos.arif-fazil.com.
- Federation organs: arifOS (MIND), AAA (BODY), GEOX (EARTH), WEALTH (CAPITAL), WELL (VITALITY); A-FORGE execution shell.
- MakcikGPT: BM civic journalism at `/world/makcikgpt/`; `/vitals/` PETRONAS signal (three doors: Kepala/Dalam/Mesin). Honesty: 70.5% extraction = `[OBS]`; $750M = `[SPEC]`; "collapse" not supported — never print it.
- Primary email: **arifos@arif-fazil.com** (arifbfazil@gmail.com is secondary; use primary).

---

## 4. Page List

| File | Route | Description |
|---|---|---|
| `home.md` | `/` | Hero = **live clock "The Arrow of Time"**; who Arif is; three domains; latest writing; doctrine teaser |
| `earth.md` | `/earth` | Geoscience: Malay Basin discoveries, well cards, seismic aesthetic |
| `economics.md` | `/economics` | Economics: incentives, risk pricing, energy economics essays |
| `world.md` | `/world` | MakcikGPT civic journalism hub in Bahasa Makcik + `/vitals/` teaser |
| `writing.md` | `/writing` | Essays & archive index, including `/000/` genesis archive pointer |
| `doctrine.md` | `/doctrine` | arifOS constitution: 13 Floors, 8 tools, federation organs |
| `proof.md` | `/999` | The proof chamber: seals, DID, verifiable claims, machine-readable artifacts |

---

## 5. Dependencies

`tailwindcss@3.4.19`, `gsap` (+ScrollTrigger, SplitText), `framer-motion`, `lenis`, `three` + `@react-three/fiber` (used only on home hero background grain and doctrine's wireframe), `react`, `react-dom`, `shadcn/ui` (accordion, tabs, dialog, tooltip), Google Fonts: Fraunces, Newsreader, IBM Plex Mono.

---

## 6. Assets Manifest

| Filename | Description | Location | Dimensions | Type |
|---|---|---|---|---|
| `clock-face.svg` | Minimal hand-drawn clock dial: hairline tick marks (60), no numerals except a small "XII", warm ink on bone paper, slightly imperfect artisanal lines | Home hero | 1200×1200 1:1 | SVG |
| `portrait-arif.png` | Warm editorial portrait illustration of a Malaysian man in his mid-30s, side-lit, thoughtful expression, earth-tone background, painterly grain texture, NOT photorealistic-corporate | Home "The person" section | 900×1100 ~4:5 | Image |
| `seismic-amber.png` | Abstract seismic section: layered sedimentary strata in deep charcoal with amber highlight bands, subtle grain, looks like a real vintage seismic print | Earth hero background | 1920×1080 16:9 | Image |
| `malay-basin-map.svg` | Minimal line map of offshore Peninsular Malaysia / Malay Basin with 4 well location dots (Bekantan-1, Puteri Basement-1, Lebah Emas-1, Bunga Tasbih-1), hairline coastlines, mono labels | Earth "The record" | 1400×900 | SVG |
| `ledger-texture.png` | Aged ledger paper texture with faint ruled columns and brass-ink figures, desaturated green cast | Economics background band | 1920×800 | Image |
| `makcik-masthead.svg` | Hand-lettered masthead "MAKCIKGPT" in bold editorial serif with a small red hibiscus accent, newsprint style | World hero | 1600×400 | SVG |
| `newsprint-texture.png` | Subtle off-white newsprint grain texture, very light | World page background | 1600×1600 (tileable) | Image |
| `pencil-margin.png` | Ivory paper with faint pencil margin annotations and underlines, sketchy and human | Writing page side margin | 600×1600 | Image |
| `floors-wireframe.svg` | 13 stacked horizontal floor plates in thin blue-white wireframe on transparent, like an architectural section of a tower, labeled F1–F13 | Doctrine hero | 1000×1400 | SVG |
| `seal-999.svg` | Circular gold proof seal: concentric rings, "ΔΩ∞ · SEALED · arif-fazil.com" on the ring, small trident/tick emblem center, engraved style | Proof chamber | 800×800 1:1 | SVG |
