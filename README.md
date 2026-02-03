# arif-fazil-sites

Frontend monorepo for the **arifOS Trinity** (HUMAN · THEORY · APPS) — three interconnected sites for constitutional AI governance.

| Layer | Symbol | Directory | Domain | Function |
|-------|--------|-----------|--------|----------|
| **HUMAN** | Δ | `HUMAN/` | [arif-fazil.com](https://arif-fazil.com) | The Body — Personal portfolio, Trinity entry point |
| **THEORY** | Ψ | `THEORY/` | [apex.arif-fazil.com](https://apex.arif-fazil.com) | The Soul — Constitutional canon, Three Pillars (Physics·Math·Language) |
| **APPS** | Ω | `APPS/` | [arifos.arif-fazil.com](https://arifos.arif-fazil.com) | The Mind — System prompts, MCP tools, API reference |

**MIND** (MCP backend) lives separately at `aaamcp.arif-fazil.com`, deployed from the [arifOS](https://github.com/ariffazil/arifOS) repo.

---

## Repository Structure

```text
arif-fazil-sites/
├── HUMAN/          # HUMAN — arif-fazil.com (Red theme)
├── THEORY/         # THEORY — apex.arif-fazil.com (Gold/Yellow theme)
├── APPS/           # APPS  — arifos.arif-fazil.com (Cyan theme)
├── shared/         # Shared images and assets (Trinity logo)
├── .github/
│   └── workflows/
│       ├── deploy.yml              # Main deploy pipeline (all 3 sites)
│       ├── deploy-trinity.yml      # Matrix deploy pipeline
│       └── cleanup-deployments.yml # Weekly cleanup of old deployments
└── README.md
```

Each site is an **independent React + Vite + TypeScript** project with its own `package.json`. They share the **Trinity Logo** (`shared/components/TrinityLogo.tsx`) and link to each other through unified HUMAN / THEORY / APPS navigation.

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

The arifOS ecosystem follows a unified **Trinity Design System**:

| Layer | Primary Color | Theme | Visual Identity |
|-------|---------------|-------|-----------------|
| HUMAN | `#FF2D2D` (Crimson) | Red/Fire | The Body — personal, grounded |
| THEORY | `#FFD700` (Gold) | Yellow/Scholar | The Soul — canonical, foundational |
| APPS | `#06B6D4` (Cyan) | Blue/Technical | The Mind — implementation, runtime |

### Unified Trinity Logo
All three sites share the **mechanical "A" logo** with Trinity color coding:
- **Yellow segment** (THEORY/Authority)
- **Cyan segment** (APPS/Safety)
- **Red segment** (HUMAN/Body)

The logo appears in the hero section of each site with color-appropriate glow effects.

### Navigation
Every page includes the **Trinity Site Switcher** for cross-navigation:
- 🔴 **HUMAN** — arif-fazil.com
- 🟡 **THEORY** — apex.arif-fazil.com
- 🔵 **APPS** — arifos.arif-fazil.com

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

## Build Status

| Site | Status | URL |
|------|--------|-----|
| HUMAN | ✅ Deployed | https://arif-fazil.com |
| THEORY | ✅ Deployed | https://apex.arif-fazil.com |
| APPS | ✅ Deployed | https://arifos.arif-fazil.com |

All sites auto-deploy on push to `main` via GitHub Actions → Cloudflare Pages.

---

> **DITEMPA BUKAN DIBERI** — *Forged, Not Given*
> 
> v55.3 · Trinity Architecture · ΔΩΨ
