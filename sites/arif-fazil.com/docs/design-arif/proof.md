# 999 — `/999` — "The Proof Chamber"

**Register**: Void black `#030303`, gold `#C9A227`, bone text. A vault — the darkest, most ceremonial page. The cursor becomes a gold seal stamp here.

---

## Section 1 — HERO: THE SEAL (100vh, centered)

**Layout**: Dead-center `seal-999.svg` (gold, engraved), rotating infinitely slowly (1 rotation / 120s). Around it, a ring of mono text (circular text path): `ΔΩ∞ · EVERY CLAIM SEALED · arif-fazil.com ·`. Above the seal, mono: `07 ————— 999 · THE PROOF CHAMBER`. Below, headline (Fraunces 64px, bone): **"Don't trust this site. Verify it."** Sub (Newsreader): *"Everything claimed on these pages can be checked — against public records, machine-readable documents, and the seals below."*

**Animation**: seal engraves in (stroke draw, 2.5s) then begins its slow rotation; circular text rotates counter to the seal; headline fades in last, gold shimmer sweep across the words once.

---

## Section 2 — THE CLAIMS LEDGER (verifiable claims table)

**Layout**: Vault-ledger table on black, gold hairlines. Each row: claim (Newsreader, bone), status chip (gold `SEALED` / grey `UNSEALED`), evidence link (mono), fact tag. Rows:

- 13 years at PETRONAS (2013–present) `[OBS]` — SEALED
- BEKANTAN-1: shallowest flowing discovery in the Malay Basin `[OBS]` — SEALED
- Every exploration well he has led has flowed `[OBS]` — SEALED
- arifOS v64.1-GAGI; 13 Floors; 8 MCP tools `[OBS]` — SEALED (PyPI, Glama registry, GitHub)
- $750M scenario `[SPEC]` — UNSEALED by design: *labelled simulation, never presented as fact*
- "PETRONAS collapse" — **REFUTED** chip in red-grey: not supported

**Animation**: rows stamp in one by one — each `SEALED` chip slams (scale 1.8→1, rotate -6°→0) with a gold flash on scroll; the REFUTED row's chip stamps harder (longer settle).

---

## Section 3 — MACHINE-READABLE IDENTITY (artifact grid)

**Layout**: Six small vault-drawer cards (dark, gold hairline, mono):
- `/.well-known/did.json` — did:web:arif-fazil.com
- `arifos.json` — agent card
- `governance.jsonld` — structured governance data
- `llms.txt / llms.json` — instructions for language models
- `mcp.arif-fazil.com/mcp` — public MCP endpoint
- `github.com/ariffazil` — source

Each card: name, one plain sentence ("This file tells machines who I am, in a format they can check."), and `OPEN ↗`.

**Animation**: drawers slide open (translateY) with 0.1s stagger; hover: gold hairline brightens, card lifts.

---

## Section 4 — THE VETO (closing statement)

**Layout**: Centered, vast whitespace. Fraunces 56px, gold:

> "Floor 13: SOVEREIGN. The human veto is absolute. Every system on this site — including this site — answers to a person."

Below, mono: `— Arif Fazil · Kuala Lumpur · sealed this day, {live date}` (date rendered live, tying the chamber back to the home clock's arrow of time).

**Animation**: statement words rise slowly (0.15s stagger, 30px); the live date ticks into place digit by digit.

---

## Section 5 — RETURN

**Layout**: Single gold link: `← Return to the ticking clock` → `/`.

**Animation**: link's arrow pulses left rhythmically (matching the home second-hand tick — 1Hz).

**Assets**: `seal-999.svg`.
