<!-- SOT-MANIFEST
federation_release: v2026.07.26
last_verified: 2026-07-26T08:00Z
live_commit: pending
scope: /root/arif-sites → ariffazil/arif-fazil.com
epistemic_status: CLAIM
truth_rule: live git push + Cloudflare deploy beat any static count in prose
doctrine: Satu domain. Satu web surface. Banyak organ, tetap bersempadan.
-->

# arif-fazil.com — Unified Federation Web Surface

> **Status:** UNIFYING | **Organ:** SURFACE | **Authority:** arifOS / F13 SOVEREIGN
> **Domain:** `https://arif-fazil.com/` — single sovereign public surface
> **Legacy repo:** `ariffazil/arif-sites` (archived as `v2026.07.26-legacy`)

[![Site Integrity](https://github.com/ariffazil/arif-sites/actions/workflows/audit.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-sites/actions/workflows/audit.yml)
[![Build — Trinity Sites](https://github.com/ariffazil/arif-sites/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-sites/actions/workflows/deploy.yml)
[![Playwright Audit](https://github.com/ariffazil/arif-sites/actions/workflows/playwright-audit.yml/badge.svg?branch=main)](https://github.com/ariffazil/arif-sites/actions/workflows/playwright-audit.yml)
[![License](https://img.shields.io/github/license/ariffazil/arif-sites?label=License)](LICENSE)

## 🏛️ What this repo is

**One domain. One web surface.** All federation organs are exposed as paths under `arif-fazil.com`. Legacy subdomains are preserved as 301 redirects — never deleted, never broken.

**This repo owns the SURFACE — the observable face of every federation organ.**

```mermaid
graph TB
    subgraph EDGE [☁️ Cloudflare Edge]
        CF[Cloudflare Pages<br/>Auto-deploy on git push]
    end
    CF -->|routes| CADDY[🔄 Caddy :443<br/>Reverse Proxy]
    subgraph VPS [🖥️ VPS af-forge]
        CADDY --> ROOT[arif-fazil.com/<br/>React 19 Cockpit]
        CADDY --> ARIFOS[/arifos/ — Observatory]
        CADDY --> AAA[/aaa/ — Control Plane]
        CADDY --> GEOX[/geox/ — Earth Lab]
        CADDY --> WEALTH[/wealth/ — Capital]
        CADDY --> WELL[/well/ — Readiness]
        CADDY --> FORGE[/forge/ — Execution]
        CADDY --> MCP[/mcp/ — Gateway]
        CADDY --> WIKI[/wiki/ — Knowledge]
    end
    MCP -->|proxy| ARIFOS_K[⚖️ arifOS :8088]
    MCP -->|proxy| AFORGE[🔥 A-FORGE :7071]
    MCP -->|proxy| GEOX_K[🌍 GEOX :8081]
```

## 🌐 Unified Path Structure

```
https://arif-fazil.com/
├── /               ← React 19 Cockpit (SPA)
├── /000/           ← Genesis / Identity
├── /999/           ← Seal Verification
├── /arifos/        ← Observatory & Proof
├── /aaa/           ← Control Plane Cockpit
├── /geox/          ← Earth Intelligence Lab
├── /wealth/        ← Capital Intelligence
├── /well/          ← Human Readiness
├── /forge/         ← Execution Surface
├── /mcp/           ← MCP Connection Guide
├── /wiki/          ← Constitutional Wiki
├── /oil/ /gas/ /gold/ ← Commodity Dashboards
├── /earth/         ← Earth Evidence
├── /essays/        ← Sovereign Essays
├── /federation/    ← Federation State
├── /proof/         ← Proof Pack
└── /_shared/       ← Design System & Assets
```

## ⚡ Quick Start

```bash
cd /root/arif-sites
# Build flagship React cockpit
cd sites/arif-fazil.com && npm install --legacy-peer-deps && npm run build
# Deploy (see deploy-vps.sh)
./deploy-vps.sh --dry-run
```

## 🔄 Legacy Subdomain Redirects

Old subdomains redirect to unified paths (301 — never deleted):

| Legacy | → | Unified |
|--------|---|---------|
| `arifos.arif-fazil.com` | → | `/arifos/` |
| `aaa.arif-fazil.com` | → | `/aaa/` |
| `geox.arif-fazil.com` | → | `/geox/` |
| `wealth.arif-fazil.com` | → | `/wealth/` |
| `well.arif-fazil.com` | → | `/well/` |
| `forge.arif-fazil.com` | → | `/forge/` |
| `mcp.arif-fazil.com` | → | `/mcp/` |
| `wiki.arif-fazil.com` | → | `/wiki/` |
| `makcikgpt.arif-fazil.com` | → | `/wealth/makcikgpt/` |

## 📦 Ownership

- **Owns**: All static site content, React cockpit build, Cloudflare Pages deployment, VPS Caddy routing.
- **Does NOT own**: Application logic (AAA, GEOX), Kernel logic (arifOS) — those are separate runtime repos.
- **Canon**: `ariffazil/web-canon` — single source of truth for registries and navigation.

## 🏗️ Current Structure

```
arif-sites/
├── sites/                    # Static frontends (hostname-aligned)
│   ├── arif-fazil.com/       # React 19 + Vite 8 (builds to dist/)
│   ├── aaa.arif-fazil.com/   # Static HTML
│   ├── arifos.arif-fazil.com/ # Static docs
│   ├── arifosmcp.arif-fazil.com/ # Legacy redirect → mcp.arif-fazil.com (do not use)
│   ├── geox.arif-fazil.com/  # Static lab/field GUI
│   ├── makcikgpt.arif-fazil.com/ # Static MakcikGPT surface
│   ├── wealth.arif-fazil.com/ # Static WEALTH surface
│   ├── wiki.arif-fazil.com/  # Static constitutional wiki
│   └── shared/               # Shared design system assets
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

# Deploy: git push main → Cloudflare Pages auto-deploy
# VPS deploy (Caddy):
./deploy-vps.sh
scripts/deploy-site.sh <site-dir>
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

## Federation Separation of Powers

| Layer | Role | Can | Cannot |
|-------|------|-----|--------|
| **ARIF** | Sovereign | Veto, approve, decide | Be overridden |
| **AAA** | State / Cockpit | Display, route, queue, register | Judge, execute, seal |
| **arifOS** | Judge | Issue SEAL/HOLD/VOID/SABAR | Execute mutations |
| **Domain Organs** | Witnesses | Compute and reflect evidence | Decide alone |
| **A-FORGE** | Executor | Build, deploy, mutate | Self-authorize |
| **arif-sites** | Public Surface | Host static surfaces, route domains | Adjudicate, compute |
| **VAULT999** | Ledger | Record immutable seals | Edit or delete history |

> AAA routes and displays. arifOS judges. Domain organs witness. A-FORGE executes. arif-sites hosts the surface. VAULT999 records. ARIF decides.

> **SOT:** 2026-07-24 — live surfaces match README claims
> **F13 authority:** F1-F13 floors, 888_JUDGE, and VAULT999 in `ariffazil/arifos`.

## 📄 Contributing

This repository operates under the arifOS Federation constitution (F1–F13).  
See [AGENTS.md](AGENTS.md) for the canonical boot sequence and agent operating rules.

## 📜 License

AGPL-3.0. See [LICENSE](LICENSE).

---

**DITEMPA BUKAN DIBERI** — Forged, Not Given.
