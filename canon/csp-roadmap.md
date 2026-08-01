# CSP Roadmap — arif-fazil.com
# DITEMPA BUKAN DIBERI
# Author: arif-fazil.com audit session SEAL-41bb759b81b24c92 · 2026-08-01

## Current state (as of 2026-08-01 audit)

The apex site uses `Content-Security-Policy` with `'unsafe-inline'` and `'unsafe-eval'`
permitted for scripts. This is acknowledged in `/etc/caddy/Caddyfile` lines 29-35 as
REQUIRED for React SPA bundles (Vite, shadcn/ui, MapLibre GL JS). The `/earth` page
(line 555 of Caddyfile) already runs a TIGHTER CSP without `'unsafe-eval'` because
it is hand-rolled vanilla JS — useful as a proof point.

CSP violations are now reported to:
  `https://arifos.arif-fazil.com/api/csp-report` (report-uri)
  `report-to csp-endpoint` (Reporting API v1, will 404 silently until arifOS lands the endpoint)

## Path forward (M1)

1. **Vite middleware for nonce emission.** Add a `transformIndexHtml` hook in
   `sites/arif-fazil.com/vite.config.ts` that:
   - Reads `res.getHeader('x-csp-nonce')` (set by arifOS middleware)
   - Replaces `script-src 'unsafe-inline'` with `script-src 'nonce-XXX'`
   - Replaces `<script>` tags lacking a nonce with `nonce="XXX"`
   Reference: https://vitejs.dev/guide/api-plugin.html#transformindexhtml

2. **arifOS nonce mint.** Add a middleware that mints a per-request nonce and
   sets the response header. The nonce is signed with the session SCT so attackers
   cannot forge it.

3. **Drop `'unsafe-eval'`** once Vite production builds no longer require it.
   Modern Vite + esbuild output should not need eval — verify by setting
   `build.minify: 'esbuild'` and removing `'unsafe-eval'` from CSP.

4. **Caddy header rewrite.** Replace the static `Content-Security-Policy` line in
   the `(tls_origin)` snippet with a dynamic header that pulls the nonce from
   the upstream response.

## Reference: Cloudflare beacon (M5)

Cloudflare Web Analytics beacon token (`98d9b4d0...` rendered by Cloudflare at
the edge, not in source HTML) is a **per-page public ID**, not a secret. Origin
TLS cert: `/root/.secrets/cloudflare-origin.pem` (mode 600, root only).

## Reference: arifOS /api/csp-report (M2 stub)

Until this endpoint exists on arifOS, CSP reports POST to a 404. This is acceptable:
- We want the header in place so future XSS attempts are captured when the endpoint ships.
- The browser logs a console error on each report, but no data leaks.

When the endpoint lands, it should accept `application/csp-report` and `application/reports+json`,
validate the report, and route to VAULT999 as `INT_SEAL=csp_violation`.

## Sealed references
- Source: /root/arif-fazil.com/sites/arif-fazil.com/index.html (comment block at line ~7)
- Caddyfile: /etc/caddy/Caddyfile (comment lines 29-43, CSP line ~37)
- This roadmap: /root/arif-fazil.com/canon/csp-roadmap.md