# Navigation Decision Record

## Decisions

1. **Single route canon** — `src/data/federationRoutes.ts` owns all public paths, aliases, domains and CTAs.
2. **Human landings for oil/gas/gold** — Discoverability pages on the root SPA; do not replace GEOX/WEALTH apps.
3. **MakcikGPT canonical = `/makcikgpt`** — Preserve `/wealth/makcikgpt` and typos as aliases.
4. **`/gass` → `/gas`** — Compatibility alias.
5. **AAA / A-FORGE** — Footer systems only; not primary nav.
6. **Search palette** — Canon-driven; no separate hard-coded link lists.
7. **No production deploy on this branch** — Router aliases only; Caddy permanent redirects documented separately.

## Rejected alternatives

| Idea | Why rejected |
|------|----------------|
| Only add homepage buttons | Leaves aliases, sitemap, agents and 404s broken |
| Merge oil into GEOX only | Root users cannot find oil without knowing GEOX |
| Investment CTAs on /gold | Violates advisory boundary |

## Open holds

- Production Caddy still 301 `/makcikgpt` → `/writings/makcikgpt/` — needs coordinated redirect flip after PR seal.
- Commodity dashboards at `/oil/*` vs human `/oil` need clear “open dashboard” links post-deploy without path collision.
