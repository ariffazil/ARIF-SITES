# Agent Discovery Contract

## Machine surfaces

| URL | Schema |
|-----|--------|
| `/.well-known/routes.json` | `arifos.routes.v1` |
| `/.well-known/arifos-federation.json` | `arifos.federation.v1` |
| `/llms.txt` | text |
| `/llms.json` | `arifos.llms.v1` |
| `/sitemap.xml` | sitemap 0.9 |
| `https://arifos.arif-fazil.com/api/public-state` | `arifos.public-state.v1` |

## Required agreement

These must list the same public canonical URLs:

1. `federationRoutes.ts`
2. `sitemap.xml`
3. `llms.txt` / `llms.json`
4. `routes.json`
5. Primary/secondary navigation

## Agent Q&A map

| Question | Answer surface |
|----------|----------------|
| Where is the oil page? | `/oil` |
| Who owns gold intelligence? | WEALTH · `/gold` + wealth.arif-fazil.com |
| Where is MakcikGPT? | `/makcikgpt` |
| Where is governance? | `/arifos` + mcp.arif-fazil.com |
| Where verify receipts? | `/999` |

## Authority boundary labels

Each route carries `organ` + `domain`. Agents must not treat GEOX/WEALTH/WELL as final authority.
