# AGENTS.md — arif-fazil.com Ψ Human Surface

> **Canonical:** /root/AGENTS.md
> **SOT:** 2026-08-03 | **seal_seq:** SEAL-8a8e064d1fe34443
> This file is a pointer, not a constitution. Load /root/AGENTS.md for full doctrine.

## ⛔ SITE DEPLOY GATE — NON-BYPASSABLE (2026-08-03)

**Every agent that touches arif-fazil.com MUST run this gate before sealing work.**

```
make verify-pages
```

This probes every `dist/*/index.html` against the live site and asserts HTTP 200.
**If the gate fails → HOLD. Do not seal. Fix routing first.**

### Why this exists

On 2026-08-03, 49 pages were built in `dist/` but returning 404 on the live site.
The root cause: agents built pages in their own repos (AAA, GEOX) but nobody checked
whether those pages actually served on arif-fazil.com. The Caddy `@spa_routes` list
was a hardcoded allowlist that silently excluded new paths.

This gate makes that class of failure **impossible**. Any future agent who adds a page
but doesn't wire the routing will be caught at deploy time.

### The deploy contract

```
make deploy = verify → sync-aaa → build → verify-pages → reload
                                          ↑
                                    THIS GATE MUST PASS
```

### What to do if verify-pages fails

1. Read the gap report — it tells you exactly which pages are broken
2. Fix one of:
   - Add a `handle` block to `/etc/caddy/Caddyfile` for the path
   - Add the path prefix to `@spa_routes` in the Caddyfile  
   - Add the path to `public/_redirects` (Cloudflare Pages routing)
3. Run `make verify-pages` again
4. Only proceed when **all pages pass**

### Intentional exclusions

Some paths are intentionally NOT served as static pages. These are declared in
`scripts/verify-pages.sh` under `INTENTIONAL_EXCLUSIONS`. If you create a
non-browser surface (API endpoint, bot-only page, MCP gateway), add it there
with a comment explaining why.

### DITEMPA BUKAN DIBERI

The site rots when agents build without verifying. This gate ensures every page
that exists in `dist/` is reachable by a human with a browser. No exceptions.

---

This organ operates under the arifOS Federation. For constitutional floors (F1-F13), organ topology, build/test/deploy conventions, autonomy tiers, and memory architecture — read `/root/AGENTS.md`.
