# arif-fazil-sites

Static frontend **Trinity** for the arif-fazil.com domain ecosystem, extracted from the [arifOS](https://github.com/ariffazil/arifOS) monorepo.

- **BODY** → `arif-fazil.com` — Personal portfolio, status, and ops dashboard.
- **SOUL** → `apex.arif-fazil.com` — Constitutional Canon (Apex layer of arifOS).
- **DOCS** → `arifos.arif-fazil.com` — arifOS documentation site.

MIND (MCP backend) lives separately at `aaamcp.arif-fazil.com` and is deployed from the arifOS repo.

---

## Structure

```text
arif-fazil-sites/
├── body/    # arif-fazil.com (Portfolio & Dashboard)
├── soul/    # apex.arif-fazil.com (Constitutional Canon)
├── docs/    # arifos.arif-fazil.com (arifOS Documentation)
└── shared/  # Deduplicated image assets, shared styling/media.
```

Each app is an isolated React/Vite project with its own `package.json` and build config, sharing assets via `shared/`.

---

## Tech Stack

| Site  | Framework              | Build Tool | Deploy Target                   |
|-------|------------------------|-----------|---------------------------------|
| BODY  | React 19 + TypeScript  | Vite 7    | Cloudflare Pages (`arif-fazil`) |
| SOUL  | React 19 + TypeScript  | Vite 7    | Cloudflare Pages (`apex-dpf`)   |
| DOCS  | React 18 + TypeScript  | Vite 5    | Cloudflare Pages (`arifos-docs`) |

All sites use TailwindCSS for styling.

---

## Local Development

Each site can be developed independently.

```bash
# BODY
cd body
npm install
npm run dev

# SOUL
cd soul
npm install
npm run dev

# DOCS
cd docs
npm install
npm run dev
```

---

## Deployment

Deployments are automated via GitHub Actions on push to `main`.
See `.github/workflows/deploy.yml` for the Cloudflare Pages pipeline.

Required GitHub secrets:

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

---

## Related

- **MIND** (MCP backend): from [arifOS](https://github.com/ariffazil/arifOS), deployed to Railway at `aaamcp.arif-fazil.com`.

---

> DITEMPA BUKAN DIBERI — Forged, Not Given
