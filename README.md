<<<<<<< HEAD
﻿# arif-sites — The Trinity Forge (AAA Level)

Frontend monorepo for the arifOS Trinity (SOUL · MIND · BODY) — four interconnected layers of constitutional AI governance.

## The Trinity Manifest (ΔΩΨ)

| Layer | Designation | Site | Directory | Tech | Function |
|-------|-------------|------|-----------|------|----------|
| **L1: SOUL** | **SIGNAL** | [arif-fazil.com](https://arif-fazil.com) | sites/arif-fazil.com | React + Vite | The "Why." Human identity & sovereign intent. |
| **L2: MIND** | **KERNEL** | [arifos.arif-fazil.com](https://arifos.arif-fazil.com) | sites/arifos | React + Vite | The "How." Documentation of the 13 Floors & logic. |
| **L3: BODY** | **AAA WIRE** | [aaa.arif-fazil.com](https://aaa.arif-fazil.com) | sites/aaa | Static HTML | The "What." Execution & Transport for AGI/ASI/APEX. |
| **L4: THEORY** | **CANON** | [apex.arif-fazil.com](https://apex.arif-fazil.com) | sites/apex | React + Vite | The Scientific theory and axiomatic foundations. |
=======
# arif-sites

One repo. Four Trinity sites. Cloudflare Pages.

Previously split across `arif-fazil-sites` (React apps) and `arif-sites` (vanilla HTML).  
**Unified here.** `arif-fazil-sites` is archived.
>>>>>>> da89b20d25c577dfe4c513dfe4894f7f6714292a

---

## Sites

<<<<<<< HEAD
`
arif-sites/
├── sites/
│   ├── arif-fazil.com/       # L1: SOUL — arif-fazil.com (Red)
│   ├── arifos/               # L2: MIND — arifos.arif-fazil.com (Cyan)
│   ├── aaa/                  # L3: BODY — aaa.arif-fazil.com (Blue)
│   ├── apex/                 # L4: THEORY — apex.arif-fazil.com (Gold)
│   └── shared/               # Shared assets and components
└── .github/
    └── workflows/            # Cloudflare Pages deployment pipelines
`

---

## Governance & The AAA Level
The L3 site acts as the **AAA Hub** (AGI, ASI, APEX), serving three distinct agent classes:
- **ARCHITECTS:** Plan and deconstruct (AGI).
- **AGENTS:** Implement and forge (ASI).
- **AUDITORS:** Critique and void (APEX).

*Ditempa Bukan Diberi — Forged, Not Given*
=======
| Layer | Folder | Domain | Tech | CF Project |
|-------|--------|--------|------|------------|
| L1 SIGNAL | `sites/arif-fazil.com` | arif-fazil.com | React + Vite | `ariffazil` |
| L2 MIND | `sites/arifos` | arifos.arif-fazil.com | React + Vite | `arifos` |
| L3 BODY | `sites/arifosmcp` | arifosmcp.arif-fazil.com | Static HTML | `arifosmcp` |
| L4 THEORY | `sites/apex` | apex.arif-fazil.com | React + Vite | `apex` |

---

## Structure

```
arif-sites/
├── sites/
│   ├── arif-fazil.com/     L1 SIGNAL — identity, writing, human face
│   │   ├── src/            React app
│   │   ├── public/         Static assets (llms.txt, robots.txt, images)
│   │   └── package.json
│   │
│   ├── arifos/             L2 MIND — governance docs, 13 floors
│   │   ├── src/            React app
│   │   ├── public/
│   │   └── package.json
│   │
│   ├── arifosmcp/          L3 BODY — MCP runtime, A2A/WebMCP specs
│   │   ├── index.html      Static HTML (no build step)
│   │   ├── specs/          mcp.html, a2a.html
│   │   ├── llms.txt
│   │   ├── robots.txt
│   │   └── site.json
│   │
│   ├── apex/               L4 THEORY — APEX canon, 13 floors deep theory
│   │   ├── src/            React app
│   │   ├── public/
│   │   └── package.json
│   │
│   └── shared/             Shared images, design tokens
│
├── .github/workflows/
│   ├── deploy.yml          Build + deploy all 4 sites to Cloudflare Pages
│   └── audit.yml           Required file checks on every PR
│
├── DEPLOY.md               Cloudflare Pages setup guide
├── TRINITY_ARCHITECTURE.md Why four sites, not one
└── README.md
```

---

## Deploy

Push to `main` → GitHub Actions builds and deploys all four sites automatically.

Required secrets in this repo:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

See [DEPLOY.md](./DEPLOY.md) for Cloudflare Pages project setup.

---

## Local Dev

```bash
# L1 SIGNAL
cd sites/arif-fazil.com && npm install && npm run dev

# L2 MIND
cd sites/arifos && npm install && npm run dev

# L3 BODY (static — just open in browser)
open sites/arifosmcp/index.html

# L4 THEORY
cd sites/apex && npm install && npm run dev
```

---

## Governance

- PRs require audit.yml to pass before merge
- Rollback: CF Dashboard → Project → Deployments → select SHA → Rollback
- F1 Amanah: every deploy is reversible in ~10 seconds via CF instant rollback

---

*Ditempa Bukan Diberi — G = A × P × X × E²*
>>>>>>> da89b20d25c577dfe4c513dfe4894f7f6714292a
