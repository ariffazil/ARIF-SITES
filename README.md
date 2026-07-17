<!-- SOT-MANIFEST
owner: Arif
last_verified: 2026-07-10
valid_from: 2026-07-01
valid_until: 2026-07-31
confidence: high
scope: /root/arif-sites
epistemic_status: CLAIM
-->

# arif-sites — Static Surfaces & Domain Hosts

> **Status:** OPERATIONAL | **Organ:** SURFACE | **Authority:** arifOS
> **Registry:** `config/sites.json` | **Shared assets:** `sites/shared/`

[![Site Integrity](https://github.com/ariffazil/arif-sites/actions/workflows/audit.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-sites/actions/workflows/audit.yml)
[![Build — Trinity Sites](https://github.com/ariffazil/arif-sites/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-sites/actions/workflows/deploy.yml)
[![Playwright Audit](https://github.com/ariffazil/arif-sites/actions/workflows/playwright-audit.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-sites/actions/workflows/playwright-audit.yml)
[![License](https://img.shields.io/github/license/ariffazil/arif-sites?label=License)](LICENSE)

## 🏛️ What this repo is

The public surface layer for the arifOS federation. Static sites are deployed to the VPS and served by Caddy; runtime-owned organ and gateway domains are reverse-proxied by Caddy.

**arif-sites owns the SURFACE — the observable face of every federation domain.**

## ⚡ Quick Start

```bash
cd /root/ARIF-SITES
# Build React subsites
cd sites/arif-fazil.com && npm install && npm run build
# Caddy routes: see deploy/Caddyfile
# Sites: https://arif-fazil.com, https://aaa.arif-fazil.com
```

## 📦 Ownership

- **Owns**: Static site content, React builds, shared browser assets, and the registry-backed VPS deployment path.
- **Does NOT own**: Application logic (AAA, GEOX), Kernel logic (arifOS).

## 🏗️ Current Structure

```
arif-sites/
├── sites/                    # Static frontends (hostname-aligned)
│   ├── arif-fazil.com/       # React 19 + Vite (builds to dist/)
│   ├── aaa.arif-fazil.com/   # Static HTML
│   ├── arifos.arif-fazil.com/ # Static docs
│   ├── geox.arif-fazil.com/  # Static lab/field GUI
│   ├── wealth.arif-fazil.com/ # Static WEALTH surface
│   └── shared/               # Shared design system assets
├── content/wiki/             # Retained legacy knowledge; not a deployable hostname
├── config/sites.json         # Canonical hostname/source/role registry
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
# React human surface:
cd sites/arif-fazil.com && npm install && npm run build

# Deploy all registry-approved static surfaces to VPS:
./deploy-vps.sh

# Deploy one surface; Caddy routing is unchanged by default:
./deploy-vps.sh --site arifos.arif-fazil.com
```

## 🔗 Federation Loop

- [arifOS](https://github.com/ariffazil/arifos) — Kernel (docs hosted at arifos.arif-fazil.com)
- [GEOX](https://github.com/ariffazil/geox) — Field (lab/field GUI at geox.arif-fazil.com)
- [AAA](https://github.com/ariffazil/AAA) — Body (session at aaa.arif-fazil.com)

---


---

## 🏛️ Federation

| Organ | Repository | Role | Port |
|-------|-----------|------|------|
| **arifOS** | [ariffazil/arifos](https://github.com/ariffazil/arifos) | Constitutional Kernel · F1-F13 | 8088 |
| **AAA** | [ariffazil/AAA](https://github.com/ariffazil/AAA) | Reality Console · A2A Gateway | 3001 |
| **A-FORGE** | [ariffazil/A-FORGE](https://github.com/ariffazil/A-FORGE) | Execution Shell | 7071 |
| **GEOX** | [ariffazil/geox](https://github.com/ariffazil/geox) | Earth Intelligence | 8081 |
| **WEALTH** | [ariffazil/wealth](https://github.com/ariffazil/wealth) | Capital Intelligence | 18082 |
| **WELL** | [ariffazil/well](https://github.com/ariffazil/well) | Human Readiness | 18083 |
| **arif-sites** | [ariffazil/arif-sites](https://github.com/ariffazil/arif-sites) | Public Surfaces | 443 |

> **Constitutional authority:** F1-F13 floors, 888_JUDGE, and VAULT999 live in `ariffazil/arifos`.  
> **Live federation status:** See `ariffazil/arifos/FEDERATION_STATUS.md`.
## 📄 Contributing

This repository operates under the arifOS Federation constitution (F1–F13).  
See [AGENTS.md](AGENTS.md) for the canonical boot sequence and agent operating rules.

## 📜 License

AGPL-3.0. See [LICENSE](LICENSE).

---

**DITEMPA BUKAN DIBERI** — Forged, Not Given.
