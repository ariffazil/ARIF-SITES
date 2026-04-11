# SOUL — Human Anchor Architecture

> **Ring 1: Ψ** | arif-fazil.com | Ditempa Bukan Diberi [ΔΩΨ | ARIF]

## Role in Trinity

SOUL is the **human grounding layer** — the personal identity surface that anchors all AI activity to a real human being (Muhammad Arif bin Fazil, Senior Exploration Geoscientist @ PETRONAS).

```
         Human (Arif)
              │
              ▼
    ┌─────────────────┐
    │   SOUL (Ψ)     │ ← Identity, grounding, scars
    │ arif-fazil.com  │
    └─────────────────┘
              │
    Trinity Links ▼
    ┌─────────┴─────────┐
    │  Ω MIND            │  Δ BODY
    │  arifOS            │  AAA Protocols
    └────────────────────┘
```

## Stack

| Layer | Technology |
|-------|------------|
| Framework | React 19 + TypeScript |
| Build | Vite 7 |
| Styling | Tailwind CSS v3.4 + shadcn/ui |
| Deployment | Cloudflare Pages (ariffazil project) |

## Project Structure

```
arif-fazil.com/
├── src/
│   ├── sections/       # Page sections (Hero, About, etc.)
│   ├── hooks/          # Custom React hooks
│   └── types/          # TypeScript definitions
├── public/
│   └── assets/         # Images, fonts
├── index.html
├── tailwind.config.js
├── vite.config.ts
├── package.json
├── .well-known/
│   ├── soul.json       # Identity metadata
│   ├── scar.json       # Institutional scars
│   └── human.md        # Professional narrative
└── docs/
    └── ARCHITECTURE.md # This file
```

## Grounding Files

### soul.json
Identity metadata following the arifOS SOUL ring specification.
```json
{
  "ring": "SOUL",
  "name": "Muhammad Arif bin Fazil",
  "role": "Senior Exploration Geoscientist",
  "affiliation": "PETRONAS",
  "seal": "VAULT999"
}
```

### scar.json
Institutional and personal lessons learned — what went wrong, what was learned.
```json
{
  "ring": "SOUL",
  "scars": [
    {
      "event": "...",
      "lesson": "...",
      "date": "..."
    }
  ]
}
```

### human.md
Professional narrative — who Arif is, his trajectory, his work.

## Trinity Navigation

Footer includes mandatory Trinity links:
```html
<nav class="trinity-nav">
  <a href="https://arif-fazil.com" class="ring-soil">Ψ SOUL</a>
  <a href="https://arifos.arif-fazil.com" class="ring-mind">Ω MIND</a>
  <a href="https://aaa.arif-fazil.com" class="ring-body">Δ BODY</a>
</nav>
```

## Design Tokens

SOUL uses **Blood Red + Earth tones + Gold sovereignty glow**:

```css
:root {
  --soul-primary: #8B1A1A;     /* Blood red */
  --soul-secondary: #2D1B1B;   /* Deep earth */
  --soul-accent: #D4AF37;      /* Gold sovereignty */
  --soul-bg: #0D0D0D;           /* Dark ground */
  --soul-text: #F5E6D3;         /* Warm white */
}
```

Import shared tokens:
```css
@import url('https://arif-fazil.com/shared/design-system/tokens.css');
```

## Deployment

```bash
npm run build    # Builds to dist/
git push main     # Triggers Cloudflare Pages deploy
```

Cloudflare Pages project: `ariffazil`  
Source: `/sites/arif-fazil.com`

## External References

| Resource | URL |
|----------|-----|
| MIND (arifOS) | https://arifos.arif-fazil.com |
| BODY (AAA) | https://aaa.arif-fazil.com |
| MCP Gateway | https://arifosmcp.arif-fazil.com |
| arifOS Kernel | https://github.com/ariffazil/arifOS |

---

**Seal:** VAULT999 | **Status:** ACTIVE
