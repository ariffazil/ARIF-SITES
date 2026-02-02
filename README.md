# arif-fazil-sites

Frontend monorepo for the **HUMAN THEORY APPS** (HTA) ecosystem — three interconnected sites for AI constitutional governance.

| Layer | Directory | Domain | What it does |
|-------|-----------|--------|--------------|
| **HUMAN** | `HUMAN/` | [arif-fazil.com](https://arif-fazil.com) | Personal portfolio, background, ecosystem entry point |
| **THEORY** | `THEORY/` | [apex.arif-fazil.com](https://apex.arif-fazil.com) | Constitutional canon — 13 floors, three engines, scientific grounding |
| **APPS** | `APPS/` | [arifos.arif-fazil.com](https://arifos.arif-fazil.com) | Documentation — 7-layer stack, MCP tools, API reference, implementation guides |

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

| Site | React | Vite | Styling | Special |
|------|-------|------|---------|---------|
| HUMAN (`HUMAN/`) | 19 | 7 | TailwindCSS + 50+ shadcn/ui components | React Hook Form, Zod |
| THEORY (`THEORY/`) | 19 | 7 | TailwindCSS + 50+ shadcn/ui components | KaTeX (math rendering) |
| APPS (`APPS/`) | 18 | 5 | TailwindCSS + minimal shadcn/ui | — |

All sites use Lucide React for icons.

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

## Deployment

### Automatic (GitHub Actions)

Push to `main` triggers `.github/workflows/deploy.yml`, which:

1. Builds all three sites in parallel (`HUMAN/`, `THEORY/`, `APPS/`)
2. Deploys each to its Cloudflare Pages project via `cloudflare/wrangler-action`

### Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API authentication |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier |
| `CLOUDFLARE_PAGES_PROJECT_HUMAN` | Pages project name for arif-fazil.com |
| `CLOUDFLARE_PAGES_PROJECT_THEORY` | Pages project name for apex.arif-fazil.com |
| `CLOUDFLARE_PAGES_PROJECT_APPS` | Pages project name for arifos.arif-fazil.com |

### Cloudflare Pages Configuration

| Pages Project | Root Directory | Build Command | Output Directory |
|---------------|---------------|---------------|------------------|
| HUMAN project | `HUMAN` | `npm run build` | `HUMAN/dist` |
| APEX project | `THEORY` | `npm run build` | `THEORY/dist` |
| APPS project | `APPS` | `npm run build` | `APPS/dist` |

> **Note:** If you renamed a folder, you must also update the Root Directory in the Cloudflare Pages dashboard for that project.

---

## Related Repositories

- **arifOS** ([github.com/ariffazil/arifOS](https://github.com/ariffazil/arifOS)) — The MCP backend (MIND layer), deployed to Railway at `aaamcp.arif-fazil.com`

---

> DITEMPA BUKAN DIBERI — Forged, Not Given
