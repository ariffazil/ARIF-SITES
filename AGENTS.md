# Repository Guidelines

## Project Structure & Module Organization

This repo is the static frontend **Trinity** for arif-fazil.com.

- `body/` is the arif-fazil.com React + Vite app (portfolio and dashboard).
- `soul/` is the apex.arif-fazil.com React + Vite app (Constitutional Canon).
- `docs/` is the arifos.arif-fazil.com React + Vite docs site.
- `shared/` contains shared images and media used across sites.
- `.github/workflows/` contains the Cloudflare Pages deploy pipeline.

Each site is isolated with its own `package.json`, TS config, and Vite build.

## arifOS Governance Alignment

This repository follows arifOS constitutional language and tone.

- Treat changes as **governed outputs**: be explicit, audit-friendly, and reversible.
- When documenting or messaging, align with the 000–999 pipeline vocabulary
  (VOID, SENSE, REFLECT, REASON, EVIDENCE, EMPATHIZE, ALIGN, FORGE, JUDGE, SEAL).
- Keep claims grounded; avoid certainty without evidence, and escalate to human
  review for irreversible or high-risk changes.

## Build, Test, and Development Commands

Run commands from the site directory you are working in.

- `npm install` installs dependencies.
- `npm run dev` starts the local Vite dev server.
- `npm run build` runs TypeScript checks and produces a production build.
- `npm run preview` serves the production build locally.
- `npm run lint` runs ESLint (available in `body/` and `soul/`).

Example:

```bash
cd body
npm install
npm run dev
```

## Coding Style & Naming Conventions

- TypeScript + React across all apps.
- TailwindCSS is the styling system (see `*/tailwind.config.js`).
- ESLint is configured in `body/eslint.config.js` and `soul/eslint.config.js`.
- Keep class lists grouped and readable; prefer consistent component naming.

## Testing Guidelines

- No automated test framework is currently configured.
- If you add tests, colocate them with features and document run steps.

## Commit & Pull Request Guidelines

- Use Conventional Commits: `feat: ...`, `feat(scope): ...`, `ci: ...`.
- PRs should include a concise description and the affected site (`body`, `soul`, `docs`).
- Include screenshots for UI changes and link related issues when applicable.

## Deployment & Configuration Notes

- Deployments run via GitHub Actions on push to `main`.
- Cloudflare Pages targets are defined in `.github/workflows/deploy.yml`.
- Required secrets live in GitHub Actions (`CLOUDFLARE_API_TOKEN`,
  `CLOUDFLARE_ACCOUNT_ID`); do not commit credentials.
