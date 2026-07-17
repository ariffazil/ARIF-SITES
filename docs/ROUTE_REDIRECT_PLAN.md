# Route Redirect Plan (production — do not apply on this branch)

## Router aliases implemented (reversible)

| From | To |
|------|-----|
| `/gass`, `/gass/` | `/gas` |
| `/oil/` | `/oil` (normalize) |
| `/gas/` | `/gas` |
| `/gold/` | `/gold` |
| `/makcikgpt/`, `/makcik-gpt`, `/makcikpgt` | `/makcikgpt` |
| `/wealth/makcikgpt` | `/makcikgpt` |
| `/mcp` | external `https://mcp.arif-fazil.com/` |

## Intended Caddy permanent rules (post-seal)

```caddy
redir /gass /gas 301
redir /gass/ /gas 301
redir /makcik-gpt /makcikgpt 301
redir /makcikpgt /makcikgpt 301
# Flip current makcikgpt redirect:
# redir /makcikgpt* /writings/makcikgpt/  →  redir /writings/makcikgpt* /makcikgpt 301  (or keep publish path + SPA)
```

Preserve query strings: `redir * /gas{query} 301` pattern.

## Rollback

1. Revert SPA routes to previous `App.tsx`.
2. Restore Caddy makcikgpt redirect if flipped.
3. No data loss — static content untouched.
