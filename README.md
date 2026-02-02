# arif-fazil-sites

Frontend monorepo for the **arifOS Trinity** (HUMAN · THEORY · APPS) — three interconnected sites for constitutional AI governance.

| Layer | Symbol | Directory | Domain | Function |
|-------|--------|-----------|--------|----------|
| **HUMAN** | Δ | `HUMAN/` | [arif-fazil.com](https://arif-fazil.com) | The Body — Personal portfolio, Trinity entry point |
| **THEORY** | Ψ | `THEORY/` | [apex.arif-fazil.com](https://apex.arif-fazil.com) | The Soul — Constitutional canon, 13 floors, scientific grounding |
| **APPS** | Ω | `APPS/` | [arifos.arif-fazil.com](https://arifos.arif-fazil.com) | The Mind — Documentation, MCP tools, API reference |

**MIND** (MCP backend) lives separately at `aaamcp.arif-fazil.com`, deployed from the [arifOS](https://github.com/ariffazil/arifOS) repo.

---

## Repository Structure

```text
arif-fazil-sites/
├── HUMAN/          # HUMAN — arif-fazil.com
├── THEORY/         # THEORY — apex.arif-fazil.com
├── APPS/           # APPS  — arifos.arif-fazil.com
├── shared/         # Shared images and assets across all sites
├── .github/
│   └── workflows/
│       ├── deploy.yml              # Main deploy pipeline (all 3 sites)
│       ├── deploy-trinity.yml      # Matrix deploy pipeline
│       └── cleanup-deployments.yml # Weekly cleanup of old deployments
└── README.md
```

Each site is an **independent React + Vite + TypeScript** project with its own `package.json`. They share images via `shared/` and link to each other through the HUMAN / THEORY / APPS navigation present on every page.

---

## Tech Stack

| Site | React | Vite | Styling | Typography | Special |
|------|-------|------|---------|------------|---------|
| HUMAN | 19 | 7 | TailwindCSS + shadcn/ui | Inter + JetBrains Mono | Three discipline visuals (Geology/Economics/AI) |
| THEORY | 19 | 7 | TailwindCSS + shadcn/ui | Space Mono + Syncopate | KaTeX math, Floor visualizer |
| APPS | 18 | 5 | TailwindCSS + shadcn/ui | Inter + JetBrains Mono | Code blocks, API docs |

All sites use Lucide React for icons and share the **Forge Design System** (see `VISUAL_SCHEMA.md`).

---

## Local Development

Each site runs independently:

```bash
# HUMAN (arif-fazil.com)
cd HUMAN && npm install && npm run dev

# THEORY (apex.arif-fazil.com)
cd THEORY && npm install && npm run dev

# APPS (arifos.arif-fazil.com)
cd APPS && npm install && npm run dev
```

---

## 🎨 Visual Design System

The arifOS ecosystem follows a unified **Forge Design Language** defined in [`HUMAN/public/VISUAL_SCHEMA.md`](HUMAN/public/VISUAL_SCHEMA.md):

| Layer | Primary Color | Theme | Visual Metaphor |
|-------|---------------|-------|-----------------|
| HUMAN | `#8B0000` (Dark Red) | Fire/Blood | The Forge — transformation through heat |
| THEORY | `#3D5A8A` (Steel Blue) | Blueprint | The Architect — precise, scholarly |
| APPS | `#0EA5E9` (Cyan) | Circuit | The Runtime — flow, logic, clarity |

**Trinity Symbol**: The Sierpinski Triangle (Δ) appears across all three sites, representing recursive self-similar governance.

## Deployment

### Automatic (GitHub Actions)

Push to `main` triggers `.github/workflows/deploy.yml`, which builds and deploys all three sites to Cloudflare Pages.

### Manual Build

```bash
# Build all sites
npm run build --prefix HUMAN
npm run build --prefix THEORY
npm run build --prefix APPS
```

### Cloudflare Pages Configuration

| Project | Root Directory | Build Command | Output |
|---------|---------------|---------------|--------|
| HUMAN | `HUMAN` | `npm run build` | `dist` |
| THEORY | `THEORY` | `npm run build` | `dist` |
| APPS | `APPS` | `npm run build` | `dist` |

### Required Secrets

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDFLARE_PAGES_PROJECT_HUMAN`
- `CLOUDFLARE_PAGES_PROJECT_THEORY`
- `CLOUDFLARE_PAGES_PROJECT_APPS`

---

## Related Repositories

- **arifOS** ([github.com/ariffazil/arifOS](https://github.com/ariffazil/arifOS)) — The MCP backend (MIND layer)

## AI Agent Context

This repository provides canonical context files for AI systems:

| File | Path | Purpose |
|------|------|---------|
| `llms.txt` | `HUMAN/public/llms.txt` | HUMAN layer sovereign memory |
| `llms.json` | `HUMAN/public/llms.json` | Structured HUMAN data |
| `VISUAL_SCHEMA.md` | `HUMAN/public/VISUAL_SCHEMA.md` | Complete design system |

---

> **DITEMPA BUKAN DIBERI** — *Forged, Not Given*
> 
> v55.3 · SOVEREIGNLY_SEALED
