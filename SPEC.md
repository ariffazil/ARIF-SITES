# arif-sites — Master Architecture Spec
> Ditempa Bukan Diberi — Forged, Not Given  
> Version: 1.0 | Status: APPROVED | Date: 2026-04-04

---

## Governance

- Source of truth: `arif-sites` git repo (github.com/ariffazil/arif-sites)
- Deploy target: VPS at `/opt/arifos/sites/arif-fazil.com/`
- Cloudflare role: DNS + CDN proxy ONLY — NOT hosting
- One deploy command: `bash deploy.sh`
- All sites serve from VPS nginx, proxied by Cloudflare

---

## Site Taxonomy

| Site | Ring | Domain | Purpose |
|------|------|--------|---------|
| arif | Ring 1 — THE SOUL | arif-fazil.com | Human identity, founder bio, philosophy |
| arifos | Ring 2 — THE MIND | arifos.arif-fazil.com | Constitutional kernel, 13 floors, ΔΩΨ |
| aaa | Ring 3 — THE BODY | aaa.arif-fazil.com | Runtime, agents, API, tools |
| forge | Portal | forge.arif-fazil.com | Trinity entry portal |
| apex | Theory | apex.arif-fazil.com | APEX constitutional text |
| geox | Science | geox.arif-fazil.com | Earth physics, RATLAS, petrophysics |

---

## Per-Site Requirements

Every site MUST have:
- `llms.txt` — human context for AI agents
- `llms.json` — structured machine metadata
- `page.json` — this site's machine summary
- `.well-known/agent.json` — A2A Agent Card
- `robots.txt` — crawler rules

Sites with tools (WebMCP only when real tools exist):
- `aaa` — runtime tools
- `geox` — earth data tools

---

## Archived / Orphaned

These Pages projects had no DNS and no active content — ARCHIVED 2026-04-04:
- theory
- runtime
- makcikgpt
- arifosmcp-truth-claim

---

## Phase Status

- [x] Phase 1: Inventory and freeze
- [ ] Phase 2: Architecture and content model
- [ ] Phase 3: Migration and redirects
- [ ] Phase 4: Machine-readable intelligence layer
- [ ] Phase 5: Visual cleanup
- [ ] Phase 6: Deploy automation and monitoring
