# Home — `/` — "The Arrow of Time"

**Register**: Bone paper `#F4F0E6`, warm ink `#14110C`, ember `#E4572E`. The ticking present. Human, warm, precise.

---

## Section 1 — HERO: THE LIVE CLOCK (100vh, pinned)

The entire first viewport is a working timepiece. This is the site's statement: time moves one way; spend it honestly.

**Layout**
- Full viewport. Center: a large analog clock built from `clock-face.svg` dial + three live hands (SVG/divs rotated via `requestAnimationFrame`; second hand moves with a **mechanical tick** — discrete 6° steps each second, with a 2° overshoot-and-settle spring, and a subtle ember glow pulse each tick).
- Clock diameter: min(70vh, 640px). Hour/minute hands in ink; second hand in ember, extra-long, counterweight tail.
- Behind the clock: faint radial grain (Three.js shader optional — CSS radial-gradient + noise fallback), and a huge, ghostly Fraunces numeral of the current hour, 40vh tall, at 4% opacity, drifting 2px per minute.
- Top-left (mono 13px): `KUALA LUMPUR — UTC+8` + live digital readout `HH:MM:SS`.
- Top-right: live **entropy counter** in mono: `SECONDS SINCE 22.05.1990 — n,nnn,nnn,nnn` ticking up every second (computed from birth date). This is the "arrow of time" made literal: one life, one direction.
- Bottom-center headline (Fraunces 88px, ink): **"The arrow of time only flies forward."** Sub-line (Newsreader 20px, ink-soft): *"I'm Arif Fazil. I spend mine reading the earth, pricing risk, and teaching machines to tell the truth."*
- Scroll cue: thin vertical line with a ticking dot descending, label `SCROLL ↓` mono.

**Animation**
- On load: clock dial draws in (SVG stroke-dashoffset, 1.2s); hands snap to real time with a tick sound-free spring; headline words reveal word-by-word (GSAP SplitText word level, stagger 0.08s, y 24px→0, opacity 0→1).
- Continuous: second hand ticks; entropy counter increments; ghost hour-numeral drifts.
- Scroll (pin 100vh → 150vh): scroll progress zooms the clock to 140% scale and fades it to 0 opacity while the next section slides up over it — time "passes into" the content.

---

## Section 2 — THE PERSON (two-column)

**Layout**: Left 45%: `portrait-arif.png` in a hairline frame with mono caption `PENANG, 1990 —`. Right 55%: prose.

**Text**
> Section header: `01 ————— THE PERSON`
>
> **Forged, not given.** (Fraunces 48px)
>
> Muhammad Arif bin Fazil. Born in Penang on 22 May 1990, raised on the northern Malay tongue. PETRONAS scholar. Double major in Geology & Geophysics and Economics at the University of Wisconsin–Madison. Thirteen years an exploration geoscientist at PETRONAS — and, in parallel, the author of arifOS, a constitution for machines.
>
> *Ditempa bukan diberi* — forged, not given. Heat, pressure, time. It is how oil forms, and how people do.

**Animation**: portrait clip-path reveals bottom→top on enter (trigger 20% viewport); body paragraphs block-fade staggered 0.15s; the italic creed line gets an ember underline that draws left→right.

---

## Section 3 — THREE DOMAINS (interactive triptych)

**Layout**: Three full-width rows, each a hover-expanding panel (desktop: flex row, hovered panel grows 55%). Each row: mono index, Fraunces title 56px, one-line human description, arrow link, and a thin accent bar in the destination page's color — previewing the site's page contrast.

1. **EARTH** — *Thirteen years reading the Malay Basin. Four wells, one record.* → `/earth` (amber bar)
2. **ECONOMICS** — *Incentives, risk, and what energy is really worth.* → `/economics` (green bar)
3. **MACHINES** — *arifOS: a constitution so AI must tell the truth — or stop.* → `/doctrine` (blue bar)

**Animation**: rows slide in from left with stagger 0.12s (trigger 25%); hover: panel expands with `framer-motion` layout spring (stiffness 200, damping 26), title shifts to page accent color, arrow translates 8px.

---

## Section 4 — THE RECORD (fact strip, ticking numbers)

**Layout**: hairline-ruled horizontal strip, four stat cells in mono, each with a fact tag chip.

- `13` — YEARS AT PETRONAS `[OBS]`
- `4` — EXPLORATION WELLS LED `[OBS]`
- `13` — CONSTITUTIONAL FLOORS, F1–F13 `[OBS]`
- `8` — CANONICAL MCP TOOLS `[OBS]`

Footnote line (Newsreader italic, ink-soft): *"Every exploration well he has led has flowed. The record speaks plainly; it doesn't need adjectives."*

**Animation**: numbers count up from 0 on enter (1.2s, ease-out); chips pop in with 80ms stagger.

---

## Section 5 — LATEST WORDS (writing preview)

**Layout**: section header `04 ————— LATEST WORDS`; three article rows (title Fraunces 32px, date + domain tag mono, 2-line excerpt Newsreader). Rows from `/writing` and `/world/makcikgpt/`. Right-aligned link: `All writing →`.

**Animation**: rows fade/slide up staggered 0.1s; hover: row background fills paper-dark, title gains ember caret `▸`.

---

## Section 6 — CLOSING: THE QUIET MACHINE ROW

**Layout**: centered short statement (Fraunces 40px): *"This site is written for people. Machines are welcome too — politely, and in the footer."* Then the standard Footer with its "For machines" row (llms.txt, did.json, arifos.json, MCP endpoint, PyPI).

**Animation**: statement letter-spaces open slightly on scroll (tracking 0→0.06em tied to scroll progress over 60vh).

**Assets**: `clock-face.svg`, `portrait-arif.png`.
