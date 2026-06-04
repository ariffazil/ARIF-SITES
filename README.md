<!-- SOT-MANIFEST
owner: Arif
last_verified: 2026-06-04
valid_from: 2026-05-19
valid_until: 2026-06-19
confidence: high
scope: /root/arif-sites
epistemic_status: CLAIM
-->

# arif-sites — Static Surfaces & Domain Hosts

> **Status:** OPERATIONAL | **Organ:** SURFACE | **Authority:** arifOS
> **Domains:** `arif-fazil.com`, `arifos.arif-fazil.com`, `wiki.arif-fazil.com`, etc.

## 🏛️ What this repo is

The static site hosting layer for the arifOS federation. Each subsite is aligned to a domain name and hosted via Cloudflare Pages (auto-deploy on `git push main`). VPS-hosted dynamic services use Caddy as a reverse proxy.

**arif-sites owns the SURFACE — the observable face of every federation domain.**

## ⚡ Quick Start

```bash
cd /root/arif-sites
# Build React subsites
cd src/arif && npm install && npm run build
# Caddy routes: see deploy/Caddyfile
# Sites: https://arif-fazil.com, https://aaa.arif-fazil.com
```

## 📦 Ownership

- **Owns**: All static site content, React subsite builds, Cloudflare Pages deployment, VPS Caddy routing.
- **Does NOT own**: Application logic (AAA, GEOX), Kernel logic (arifOS).

## 🏗️ Current Structure

```
arif-sites/
├── sites/                    # Static frontends (hostname-aligned)
│   ├── arif-fazil.com/       # React 19 + Vite (builds to dist/)
│   ├── travel.arif-fazil.com/ # React + Vite + MapLibre (has dev proxy)
│   ├── aaa.arif-fazil.com/   # Static HTML
│   ├── arifos.arif-fazil.com/# Static docs
│   ├── arifosmcp.arif-fazil.com/ # Legacy redirect → mcp.arif-fazil.com (do not use)
│   ├── forge.arif-fazil.com/ # Static CI/CD surface
│   ├── wiki.arif-fazil.com/  # Static constitutional wiki
│   ├── geox.arif-fazil.com/  # Static lab/field GUI
│   ├── apex.arif-fazil.com/  # Apex landing
│   ├── waw.arif-fazil.com/   # WAW subsite
│   └── wawa.arif-fazil.com/  # WAWA subsite
├── apps/                   # Dynamic product UIs (VPS Docker)
├── services/              # Backend MCP kernel surfaces
├── infra/                # Constitutional manifests, domains map
│   └── config/           # Domain and routing configuration
├── scripts/             # Deployment and audit scripts
├── config/
│   └── opencode.json   # OpenCode agent configuration
└── deploy-vps.sh       # VPS deployment script
```

## 🚀 Verified Commands

```bash
# Static sites: no build step required

# React subsites:
cd sites/arif-fazil.com && npm install && npm run build
cd sites/travel.arif-fazil.com && npm install && npm run build

# Deploy: git push main → Cloudflare Pages auto-deploy
# VPS deploy (Caddy):
./deploy-vps.sh
scripts/deploy-site.sh <site-dir>
```

## 🔗 Federation Loop

- [arifOS](https://github.com/ariffazil/arifOS) — Kernel (docs hosted at arifos.arif-fazil.com)
- [GEOX](https://github.com/ariffazil/geox) — Field (lab/field GUI at geox.arif-fazil.com)
- [AAA](https://github.com/ariffazil/AAA) — Body (session at aaa.arif-fazil.com)

---


---

## 🏛️ Federation

| Organ | Repository | Role | Port |
|-------|-----------|------|------|
| **arifOS** | [ariffazil/arifOS](https://github.com/ariffazil/arifOS) | Constitutional Kernel · F1-F13 | 8088 |
| **AAA** | [ariffazil/AAA](https://github.com/ariffazil/AAA) | Reality Console · A2A Gateway | 3001 |
| **A-FORGE** | [ariffazil/A-FORGE](https://github.com/ariffazil/A-FORGE) | Execution Shell | 7071 |
| **GEOX** | [ariffazil/geox](https://github.com/ariffazil/geox) | Earth Intelligence | 8081 |
| **WEALTH** | [ariffazil/wealth](https://github.com/ariffazil/wealth) | Capital Intelligence | 18082 |
| **WELL** | [ariffazil/well](https://github.com/ariffazil/well) | Human Readiness | 18083 |
| **arif-sites** | [ariffazil/arif-sites](https://github.com/ariffazil/arif-sites) | Public Surfaces | 443 |

> **Constitutional authority:** F1-F13 floors, 888_JUDGE, and VAULT999 live in `ariffazil/arifOS`.  
> **Live federation status:** See `ariffazil/arifOS/FEDERATION_STATUS.md`.
## 📄 Contributing

This repository operates under the arifOS Federation constitution (F1–F13).  
See [AGENTS.md](AGENTS.md) for the canonical boot sequence and agent operating rules.

## 📜 License

AGPL-3.0. See [LICENSE](LICENSE).

---

**DITEMPA BUKAN DIBERI** — Forged, Not Given.
