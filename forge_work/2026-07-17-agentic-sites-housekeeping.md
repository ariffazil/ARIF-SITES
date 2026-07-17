# 🧹 SITES

Observed: 2026-07-17 UTC

Scope: `/root/ARIF-SITES` repository and public hostname probes

Status: repository housekeeping applied; live routing unchanged

## Evidence

- HTTP 200: `arif-fazil.com`, `arifos.arif-fazil.com`, `aaa.arif-fazil.com`, `geox.arif-fazil.com`, `wealth.arif-fazil.com`, `mcp.arif-fazil.com`.
- HTTP 301: `wiki.arif-fazil.com` to `arifos.arif-fazil.com/wiki/`.
- DNS absent: `arifosmcp.arif-fazil.com`.
- Cloudflare 525: `makcikgpt.arif-fazil.com`; its articles already live under the main human surface.
- `/etc/caddy/Caddyfile` differs from `deploy/Caddyfile`; no routing file was applied.

## Applied

- One registry: `config/sites.json`.
- One deployment implementation: `deploy-vps.sh`; two old scripts reduced to wrappers.
- One shared asset tree: `sites/shared/`.
- Legacy wiki knowledge moved from a second top-level tree into `content/wiki/`.
- Removed unused source trees for `wiki`, `arifosmcp`, and standalone `makcikgpt`.
- Removed tracked 2026-04-23 build snapshot; Git history remains the recovery path.

## Hold

Live Caddy still exposes obsolete APEX routing and the `wiki` redirect currently targets a path without a dedicated renderer. Changing either requires a separately approved Caddy validation and reload.
