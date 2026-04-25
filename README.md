# arifOS Trinity Network
**Single Source of Truth Repository**

<!-- SOT:version_info -->
| Field | Value |
|-------|-------|
| REPO_TYPE | Static + Docusaurus site monorepo |
| SITES_COUNT | 9 active sites |
| SERVICES | 1 (arifosmcp) |
| DEPLOY_STATIC | Cloudflare Pages |
| DEPLOY_DYNAMIC | VPS Docker + Traefik |
| ARCHIVE_SIZE | Large (legacy content preserved) |

_Auto-generated — run generate.py to refresh_
<!-- /SOT:version_info -->

## 🏛️ Repository Ontology
- `/sites/` - Public Frontends (Static, Hostname-aligned)
- `/apps/` - Dynamic Product UIs (VPS-hosted)
- `/services/` - Backends & MCP Kernels
- `/infra/` - Constitutional Manifests & Deployment Logic
- `/archive/` - Legacy Chaos (Purged & Preserved)

## 🌐 Active Sites

<!-- SOT:sites_inventory -->
| Domain | Type | Role |
|--------|------|------|
| `arif-fazil.com` | Static | Human anchor / professional portfolio |
| `apex.arif-fazil.com` | Static | Constitutional law / 13 Floors |
| `aaa.arif-fazil.com` | Static | Atomic execution / wire protocol |
| `arifosmcp.arif-fazil.com` | Dynamic | MCP runtime endpoint |
| `geox.arif-fazil.com` | Dynamic | Earth witness GUI |
| `forge.arif-fazil.com` | Static | Forge docs |
| `waw.arif-fazil.com` | Static | WAW site |
| `wawa.arif-fazil.com` | Static | Wawa site |
| `wiki.arif-fazil.com` | Static | arifOS wiki |

<!-- /SOT:sites_inventory -->


## 🌐 Active Domains
| Ring | Hostname | Type | Role |
|------|----------|------|------|
| **Ψ SOUL** | `arif-fazil.com` | Static | Human Anchor / Professional Portfolio |
| **Ω MIND** | `apex.arif-fazil.com` | VPS | Constitutional Law / 13 Floors |
| **Δ BODY** | `aaa.arif-fazil.com` | Static | Atomic Execution / Wire Protocol |
| **Ξ EXT** | `arifosmcp.arif-fazil.com` | Dynamic | MCP Runtime Endpoint |
| **Φ FIELD** | `geox.arif-fazil.com` | Dynamic | Earth Witness GUI |

## 📐 Architecture
See [ARCHITECTURE.md](./ARCHITECTURE.md) for full system design, connection maps, and data flow.

## 🚀 Deployment
Targets are defined in `/infra/domains.yaml`.
- **Static**: Cloudflare Pages (Auto-deploy on git push)
- **Dynamic**: VPS Docker (Traefik-routed)

**DITEMPA BUKAN DIBERI — 999_SEAL**
