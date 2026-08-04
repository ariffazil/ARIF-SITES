# World — `/world` — "MAKCIKGPT: Civic Journalism in Bahasa Makcik"

**Register**: Newsprint white `#FBF9F4` with `newsprint-texture.png`, civic red `#C8102E`, ink black. A newspaper, not a tech page. Contrast: loud editorial voice after the ledger's quiet order.

---

## Section 1 — HERO: THE MASTHEAD (80vh)

**Layout**: Broadsheet composition. Top: hairline rule with mono dateline `KUALA LUMPUR · EDISI TERKINI · RSS: /world/makcikgpt/feed.xml`. Center: `makcik-masthead.svg` (huge, full-width). Below, a red kicker line in Fraunces Italic 28px: *"Berita tenaga untuk rakyat — jujur, jelas, dan berbudi."*

English gloss line (Newsreader italic, small, ink-soft): *"MakcikGPT is civic journalism written in Bahasa Makcik — the warm, direct Malay of the aunties — about PETRONAS, the Petroleum Development Act 1974, and who Malaysia's energy belongs to."*

**Animation**: masthead scales 1.05→1 and fades in over 0.8s; dateline types in character-by-character (mono, 30ms/char); red kicker underlines draw.

---

## Section 2 — TODAY'S COLUMNS (article grid)

**Layout**: Newspaper grid — one lead story (60% width, Fraunces 44px headline, Newsreader lede, red drop cap) + two side stories stacked (40%). Below: a 3-column index of recent MakcikGPT pieces with mono dates and section tags (`TENAGA`, `POLISI`, `RAKYAT`). Each card links to `/world/makcikgpt/`.

**Honesty bar**: under every headline, a small mono fact-tag strip: `[OBS] [DER] [INT] [SPEC]` with the applicable ones lit red, others grey — the paper's standing honesty doctrine, visible at a glance.

**Animation**: lead story fades in first; side stories slide from right staggered 0.15s; index cards rise with 0.06s stagger (trigger 25%); hover: headline turns civic red, card gains newsprint shadow.

---

## Section 3 — VITALS: THE PETRONAS SIGNAL (teaser band)

**Layout**: Full-width red-on-white band with black hairlines, styled like a market page. Title (Fraunces 40px): **/vitals/ — Isyarat Institusi PETRONAS**. Three doors rendered as three clickable cards:

- **KEPALA** — *The Head*: leadership, appointments, direction.
- **DALAM** — *The Inside*: finances, flows, the 70.5% extraction arithmetic `[OBS]`.
- **MESIN** — *The Machine*: operations, assets, production.

Each door card: mono name, one-line description, red arrow. Clicking leads to `/vitals/`.

Standing disclaimer strip (mono 12px): *"70.5% ialah aritmetik [OBS]. $750M ialah simulasi [SPEC]. 'Collapse' TIDAK DISOKONG."*

**Animation**: the three doors slide open (clip-path) on enter with 0.2s stagger; hover: door interior fills red, text turns newsprint white.

---

## Section 4 — WHY BAHASA MAKCIK (manifesto)

**Layout**: Centered prose column, Fraunces pull-quote style. Text:

> "Language decides who gets to understand. Energy policy written only in boardroom English belongs to the boardroom. MakcikGPT writes it in the language of the pasar — because the petroleum belongs to the rakyat."

**Animation**: quote marks oversized in red at 10% opacity behind text; words fade in line-by-line on scroll (word-level, 0.03s stagger).

---

## Section 5 — SUBSCRIBE / RSS

**Layout**: simple mono row: `RSS → /world/makcikgpt/feed.xml · Telegram → t.me/ariffazil` plus an email input + red "Langgan" button (animated success state: button stamps `DITERIMA ✓`).

**Animation**: button scales 0.96 on tap, success stamp springs in.

**Assets**: `makcik-masthead.svg`, `newsprint-texture.png`.
