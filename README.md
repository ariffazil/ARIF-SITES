# arif-sites

One repo. Four Trinity sites. Cloudflare Pages.

Previously split across `arif-fazil-sites` (React apps) and `arif-sites` (vanilla HTML).  
**Unified here.** `arif-fazil-sites` is archived.

---

## Sites

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
