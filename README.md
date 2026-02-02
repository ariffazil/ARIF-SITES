# arif-fazil-sites

Frontend monorepo for the **HUMAN THEORY APPS** (HTA) ecosystem — three interconnected sites for AI constitutional governance.

| Layer | Site | Domain | What it does |
|-------|------|--------|--------------|
| **HUMAN** | `body/` | [arif-fazil.com](https://arif-fazil.com) | Personal portfolio, background, ecosystem entry point |
| **THEORY** | `THEORY/` | [apex.arif-fazil.com](https://apex.arif-fazil.com) | Constitutional canon — 13 floors, three engines, scientific grounding |
| **APPS** | `docs/` | [arifos.arif-fazil.com](https://arifos.arif-fazil.com) | Documentation — 7-layer stack, MCP tools, API reference, implementation guides |

**MIND** (MCP backend) lives separately at `aaamcp.arif-fazil.com`, deployed from the [arifOS](https://github.com/ariffazil/arifOS) repo.

---

## Repository Structure

```text
arif-fazil-sites/
├── body/           # HUMAN — arif-fazil.com
├── THEORY/         # THEORY — apex.arif-fazil.com
├── docs/           # APPS  — arifos.arif-fazil.com
├── shared/         # Shared images and assets across all sites
├── .github/
│   └── workflows/
│       ├── deploy-trinity.yml       # Main deploy pipeline (all 3 sites)
│       └── cleanup-deployments.yml  # Weekly cleanup of old deployments
└── README.md
```

Each site is an **independent React + Vite + TypeScript** project with its own `package.json`. They share images via `shared/` and link to each other through the HUMAN / THEORY / APPS navigation present on every page.

---

## Tech Stack

| Site | React | Vite | Styling | Special |
|------|-------|------|---------|---------|
| HUMAN (`body/`) | 19 | 7 | TailwindCSS + 50+ shadcn/ui components | React Hook Form, Zod |
| THEORY (`THEORY/`) | 19 | 7 | TailwindCSS + 50+ shadcn/ui components | KaTeX (math rendering) |
| APPS (`docs/`) | 18 | 5 | TailwindCSS + minimal shadcn/ui | — |

All sites use Lucide React for icons.

---

## How It Works

### The Three Layers

**HUMAN** is the front door. It introduces Arif Fazil, links to published writing, and points visitors to either THEORY (if evaluating the framework) or APPS (if integrating).

**THEORY** is the constitutional canon. It documents the 13 formal floors (F1–F13), the three engines (ARIF/ADAM/APEX), the metabolic loop (stages 000–999), the EMD protection relay, and the scientific basis with 44+ academic citations rendered with KaTeX.

**APPS** is the builder's reference. It covers the 7-layer deployment stack (from copy-paste system prompts to full agent federations), the 9 MCP tools in production, the API specification, and integration architecture.

### Navigation Flow

Every page has a unified navigation bar with three buttons:

```
HUMAN → THEORY → APPS
```

- On HUMAN: HUMAN is highlighted (current page)
- On THEORY: THEORY is highlighted
- On APPS: APPS is highlighted

This lets visitors move between layers without losing context.

---

## Local Development

Each site runs independently:

```bash
# HUMAN (arif-fazil.com)
cd body && npm install && npm run dev

# THEORY (apex.arif-fazil.com)
cd THEORY && npm install && npm run dev

# APPS (arifos.arif-fazil.com)
cd docs && npm install && npm run dev
```

---

## Deployment

### Automatic (GitHub Actions)

Push to `main` triggers `.github/workflows/deploy-trinity.yml`, which:

1. Builds all three sites in parallel (`body/`, `THEORY/`, `docs/`)
2. Deploys each to its Cloudflare Pages project via `cloudflare/pages-action`

### Required GitHub Secrets

| Secret | Purpose |
|--------|---------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API authentication |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account identifier |
| `CLOUDFLARE_PAGES_PROJECT_BODY` | Pages project name for arif-fazil.com |
| `CLOUDFLARE_PAGES_PROJECT_THEORY` | Pages project name for apex.arif-fazil.com |
| `CLOUDFLARE_PAGES_PROJECT_DOCS` | Pages project name for arifos.arif-fazil.com |

### Cloudflare Pages Configuration

Each site has a corresponding Cloudflare Pages project. The **Root directory** in each project's dashboard settings must match the repo folder:

| Pages Project | Root Directory | Build Command | Output Directory |
|---------------|---------------|---------------|------------------|
| Body project | `body` | `npm run build` | `body/dist` |
| APEX project | `THEORY` | `npm run build` | `THEORY/dist` |
| Docs project | `docs` | `npm run build` | `docs/dist` |

> **Note:** If you renamed a folder (e.g. `soul` → `THEORY`), you must also update the Root Directory in the Cloudflare Pages dashboard for that project. The GitHub Actions workflow handles this correctly, but the Cloudflare auto-build uses the dashboard setting.

### Cleanup

A weekly scheduled workflow (`cleanup-deployments.yml`) runs every Sunday at 2 AM UTC and deletes inactive deployments, keeping the last 10 for each project.

---

## Related Repositories

- **arifOS** ([github.com/ariffazil/arifOS](https://github.com/ariffazil/arifOS)) — The MCP backend (MIND layer), deployed to Railway at `aaamcp.arif-fazil.com`

---

> DITEMPA BUKAN DIBERI — Forged, Not Given
