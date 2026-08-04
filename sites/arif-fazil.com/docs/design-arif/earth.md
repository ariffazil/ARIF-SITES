# Earth — `/earth` — "Pressure Makes Petroleum"

**Register**: Deep basalt `#0D0C0A` background, bone text `#EDE6D6`, seismic amber `#FF9F1C` accent. Dark, heavy, pressurized — strong contrast against home's light paper.

---

## Section 1 — HERO (90vh)

**Layout**: Full-bleed `seismic-amber.png` background, darkened 40%, slow parallax. Over it:
- Mono top-line: `02 ————— EARTH · MALAY BASIN, OFFSHORE MALAYSIA`
- Headline (Fraunces 96px, bone): **"Thirteen years of reading rock."**
- Sub (Newsreader 20px): *"Exploration geoscience is a bet placed kilometres underground. These are the bets I placed — and what came back up."*
- Depth gauge on the right edge: vertical mono scale 0–4,000m TVD that fills with amber as the user scrolls the page (persists through the page as a side progress bar).

**Animation**: headline characters split-animate up (character level, stagger 0.02s); seismic image scales 1.08→1.0 over 80vh scroll (parallax); depth gauge needle ticks down mechanically.

---

## Section 2 — THE BASIN (map + intro)

**Layout**: Left: `malay-basin-map.svg` — coastline hairlines, four pulsing amber well dots; hovering a dot highlights the matching well card below (cross-linked hover). Right: prose column.

**Text**: The Malay Basin, offshore Peninsular Malaysia — a mature basin that still keeps secrets. Instrumental to the realization of **PM318**. Brief plain-language explanation of what an exploration geoscientist actually does: seismic interpretation, play risking, well proposals, and the morning the well flows.

**Animation**: map draws coastline strokes on enter (2s); dots fade in with 0.2s stagger and pulse indefinitely (scale 1→1.4, 1.6s loop); prose blocks fade staggered.

---

## Section 3 — THE WELLS (four well cards)

**Layout**: 2×2 grid (stack on mobile). Each card: basalt card `#151310`, hairline amber top rule, well name in Fraunces 40px, mono metadata row (type · year · status), plain-language description, fact tag `[OBS]`.

1. **BEKANTAN-1** — *New play wildcat · Flowed* — The shallowest flowing oil discovery in the Malay Basin. A shallow prospect everyone stepped over, until someone didn't.
2. **PUTERI BASEMENT-1** — *Fractured basement test* — Drilling into the hard, ancient floor of the basin to test whether fractures could hold and give up oil.
3. **LEBAH EMAS-1** — *New play wildcat* — "Golden Bee." A concept-first well: a new play idea carried from map to drill bit.
4. **BUNGA TASBIH-1** — *Discovery → development* — The well that led to a Small Field Asset PSC award — from a seismic anomaly to a sanctioned field.

Closing line (Newsreader italic): *"Every exploration well he has led has flowed."* `[OBS]`

**Animation**: cards rise 60px and fade in with 0.15s stagger (trigger 20%); hover: card lifts -6px, amber rule thickens 1→3px, seismic texture overlay slides in at 8% opacity; clicking a card opens a dialog with a longer plain-language story of the well.

---

## Section 4 — HOW A WELL IS BORN (scroll story, pinned)

**Layout**: Pinned 200vh scroll sequence, five steps: `SEISMIC → INTERPRET → RISK → PROPOSE → DRILL`. Each step: giant mono step label left, 2-sentence plain explanation right, and a simple line illustration that draws itself as scroll progresses (SVG stroke animation driven by ScrollTrigger scrub).

**Animation**: steps crossfade sequentially tied to scroll progress; final step ends with an ember "flow" pulse and the word `FLOWED` stamping in (scale 1.6→1, rotation -4°, like a rubber stamp).

---

## Section 5 — TRANSITION TO DOCTRINE

**Layout**: Short bridge strip on basalt: *"The same discipline — state the risk, honor the floor — became a constitution for machines."* Link `Read the doctrine →` in cold blue `#7DD3FC`, pre-announcing the next page's register.

**Animation**: text fades in; the blue link glows subtly on hover.

**Assets**: `seismic-amber.png`, `malay-basin-map.svg`.
