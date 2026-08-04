# Writing — `/writing` — "The Long Archive"

**Register**: Ivory `#FAF7EF`, graphite `#5C5546`, pencil-underline accents. A desk with margins. Contrast: quietest page — intimate, analog, slow.

---

## Section 1 — HERO (50vh, deliberately small)

**Layout**: Left-aligned, book-page composition with `pencil-margin.png` as a decorative right margin (fixed, fades on mobile). Mono top-line `05 ————— WRITING`. Headline (Fraunces 72px, graphite): **"Essays, in no hurry."** Sub (Newsreader): *"Long-form pieces on earth, economics, and machines. Written by a person, for people. Drafts included — thinking in public means showing the pencil marks."*

**Animation**: headline words stagger in 0.08s; pencil margin annotations "scribble" in via stroke animation; a small mono word-counter ticks up as if typing, then settles.

---

## Section 2 — THE INDEX (filterable list)

**Layout**: Filter tabs (shadcn Tabs) in mono: `ALL · EARTH · ECONOMICS · MACHINES · PERSONAL`. Below, a chronological essay index — each row: mono date, Fraunces 30px title, one-line abstract, reading time, domain tag chip. 8–12 entries spanning site themes (e.g., "What a well teaches you about risk", "The price of honesty in AI", "Loghat Utara", "Notes on PM318").

**Animation**: tab switch triggers layout animation — rows reorder/crossfade with Framer Motion `layout` springs; rows fade up 0.07s stagger on first enter; hover: graphite caret `✎` appears at row start, title shifts 8px right.

---

## Section 3 — 000: THE GENESIS ARCHIVE (feature card)

**Layout**: A single wide card, ivory with graphite hairlines and a punched-hole left edge (archive binder aesthetic). Mono label `/000/`. Title (Fraunces 44px): **"000 — The Genesis Archive."** Prose: where the earliest drafts, founding documents, and first principles of arifOS live — the raw ore before the forging. Link `Enter the archive →`.

**Animation**: card edges draw in (border stroke animation, 1.5s); the punched holes pop in one by one like a stamp; hover tilts card 1° with soft shadow.

---

## Section 4 — HOW I WRITE (short process strip)

**Layout**: Three mono-numbered steps in a row: `01 DRAFT — pencil first, badly` · `02 COOL — truth must cool before it rules` · `03 SEAL — publish only what survives`. Each step with a one-line gloss in Newsreader.

**Animation**: steps reveal sequentially on scroll; step 02's word "COOL" has a subtle blue-tinted cooling animation (color cools from ember to graphite as you scroll past — a nod to the creed).

---

## Section 5 — BRIDGE

**Layout**: Centered line: *"The essays end. The doctrine holds."* → `/doctrine`, cold blue link.

**Animation**: fade; link underline draws on hover.

**Assets**: `pencil-margin.png`.
