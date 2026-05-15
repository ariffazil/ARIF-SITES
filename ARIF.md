# ARIF.md | METABOLIC KERNEL v1.0

> SYSTEM TYPE: LORE INTERFACE
> GOVERNANCE: arifOS AAA
> VETO: 888 JUDGE
>
> INVARIANT: Descriptive memory of repo state.
> This file NEVER modifies Law. It only reports and compresses observed reality.
> Law lives in: arifOS `000/000_CONSTITUTION.md`. Template: https://gist.github.com/ariffazil/81314f6cda1ea898f9feb88ce8f8959b

## 0. IDENTITY & MOUNT POINT

- REPO_NAME: arif-sites
- CONTAINER_ID: 2026-05-15
- DOMAIN_ROLE: Public web presence — 6 canonical hostnames, ΔΩΨ Trinity Ring design system, Caddy routing, static site source
- STABILITY_CLASS: ACTIVE
- VERSION: v2026.05.15-FORGED


## 1. CURRENT FOCUS (INSTRUCTION POINTER)

- ΔΩΨ Trinity Ring design system deployed: SOUL (arif-fazil.com, blood red), MIND (arifos.arif-fazil.com, teal), BODY (aaa.arif-fazil.com, amber/gold).
- arifos governance dashboard source created: `sites/arifos.arif-fazil.com/index.html` — organ census, F1-F13 floors, tool registry, federation map.
- WebMCP adapter library deployed: `sites/shared/webmcp/` — constitutional browser tool surface with F1-F13 floor guards.
- DESIGN.md rewritten: 9-domain constellation → Trinity Ring system. Gap analysis + fix plan documented.
- Caddy healthy: Let's Encrypt ACME auto-TLS. 6 canonical hostnames active. `arifosmcp.arif-fazil.com` removed (dead redirect).
- Machine canon aligned: `/etc/arifos/README.md` — 6 canonical hostnames.
- VPS: ONLINE. All surfaces healthy. 24 containers running.
- Deploy: `git push main` → Cloudflare Pages auto-deploy for static sites. VPS Docker for dynamic services.


## 2. OPERATIONAL MANDATE

- arif-sites is the public-facing web layer — static site source, Caddy routing, SSL, reverse proxy.
- 6 canonical hostnames: arif-fazil.com, arifos.arif-fazil.com, aaa.arif-fazil.com, mcp.arif-fazil.com, geox.arif-fazil.com, wiki.arif-fazil.com.
- Retired aliases (redirect-only): arifosmcp, forge, apex, waw, wawa.
- Static sites: Cloudflare Pages auto-deploy on `git push main`.
- Dynamic subsites (React + Vite): arif-fazil.com, travel.arif-fazil.com. Build separately.
- Shared design system: `sites/shared/design-system/tokens.css` (610 lines, v2026.04.11-SEAL).
- Upstream: arifOS kernel (MCP backend), GEOX, WEALTH, WELL (MCP backends).
- Downstream: Public users, MCP clients, Claude/ChatGPT/VS Code connectors.


## 3. THE 999 SEAL (SESSION LOG)

- 2026-05-15 | Omega | Trinity Ring alignment (DESIGN.md, data-ring, tokens.css on all 3 main sites). arifos governance dashboard source created. WebMCP adapter library deployed. Caddy cleaned (arifosmcp removed). Machine canon aligned. All repos clean, all pushed.
- 2026-05-14 | OpenCode | arifosmcp federation status + WELL node. arifos deploy path aligned with Caddy root.
- 2026-05-11 | Kimi Code | WEALTH daily briefing. arif-sites Caddy TLS repair (ACME restored).
- 2026-05-09 | Kimi Code | arif-sites restored to Cloudflare Pages auto-deploy. VPS online.
- 2026-04-24 | ANTIGRAVITY-CLERK | ARIF.md initialized. Federation sync. (NOTE: VPS was offline at this time — resolved weeks ago.)


## 4. ACTIVE TOPOLOGY (MEMORY MAP)

- CRITICAL_FILES:
  - `DESIGN.md` → ΔΩΨ Trinity Ring design system (SOT)
  - `sites/arif-fazil.com/index.html` → SOUL (Ψ) — human landing
  - `sites/arifos.arif-fazil.com/index.html` → MIND (Ω) — governance dashboard
  - `sites/aaa.arif-fazil.com/index.html` → BODY (Δ) — control plane
  - `sites/shared/design-system/tokens.css` → Single-source design tokens
  - `sites/shared/webmcp/arifos-webmcp-adapter.js` → Constitutional browser MCP
  - `/etc/caddy/Caddyfile` → Reverse proxy routing (runtime, not in repo)

- ENTRYPOINTS:
  - `git push origin main` → Cloudflare Pages auto-deploy
  - `./deploy-vps.sh` → VPS rsync + Caddy reload

- DATA_FLOWS:
  - arif-sites source → git push → Cloudflare Pages → static sites
  - Caddy → reverse_proxy → arifOS (8080), GEOX (8081), WEALTH (8082), WELL (8083)


## 5. INTERRUPTS & FAULTS (BLOCKERS)

- HARD_BLOCK: None. VPS online. All surfaces healthy.
- SOFT_FRICTION: 3 sites still need tokens.css linked (arif-fazil.com React app, aaa static, arifos static). Phase 2 token migration pending.
- SOFT_FRICTION: DESIGN.md gap analysis recorded — Phase 2/3 pending (token migration, content audit).


## 6. RECENT SCARS (W_scar)

- [2026-05-12] → [Caddy TLS: corrupt Cloudflare origin cert] → [Fixed: Let's Encrypt ACME auto-TLS restored]
- [2026-05-09] → [VPS offline, all surfaces 502] → [RESOLVED: VPS restored, Caddy healthy]
- [2026-04-24] → [arif-sites had no ARIF.md] → [Federation sync applied]


## 7. EXECUTION BUFFER (COMMANDS)

| Command | Status | Context |
|---------|--------|---------|
| `caddy validate --config /etc/caddy/Caddyfile` | ✅ | Valid config |
| `git push origin main` | ✅ | Cloudflare Pages auto-deploy |
| `./deploy-vps.sh` | ✅ | VPS deploy |
| `curl https://arif-fazil.com` | ✅ | 200 |


## 8. PRIVILEGE ESCALATION (888 HOLD)

- [Q]: Full Trinity Ring Phase 2/3 — migrate all sites to tokens.css + replace inline CSS?
- [CONTEXT]: 3 sites don't link tokens.css. DESIGN.md fix plan documented. Ω₀ = 0.3 (low uncertainty — mechanical work).
- [Q]: Retired aliases (forge, apex, waw, wawa) — keep as redirect or remove DNS?
- [CONTEXT]: Currently no Caddy blocks. DNS still points to VPS. Ω₀ = 0.2 (low uncertainty — cleanup).


## 9. PIPELINE PREFETCH (NEXT MOVES)

- [ ] Phase 2: Token migration — replace inline CSS with tokens.css classes across all 3 main sites
- [ ] Phase 3: Content audit — verify factual claims, update version stamps
- [ ] Add travel.arif-fazil.com to canonical hostname list if active
- [ ] Archive retired alias DNS records (forge, apex, waw, wawa)


---

*🪙 GOLD SEAL | METABOLIC KERNEL v1.0 | arifOS AAA | 888 JUDGE VETO | DITEMPA BUKAN DIBERI*
*Readable by: single human · couple · company · institution · AI agent · machine · team · civilisation intelligence*
