# ⛔ SUPERSEDED by SITES.md — 2026-06-20. Do not update this file. See SITES.md for canonical routing truth.
# ⛔ This document is preserved for historical reference only.

# Trinity Network v2 — Architecture Map

> **Ditempa Bukan Diberi** — Intelligence is forged, not given
> **Seal:** 999 SEAL | **Version:** 2026.05.02-KANON

---

## Overview

The Trinity Network is a **constitutional intelligence ecosystem** with three flagship surfaces:

| Ring | Domain | Role |
|------|--------|------|
| **Ψ SOUL** | `arif-fazil.com` | Human anchor — identity, portfolio, `/000` genesis, `/999` validation |
| **Ω MIND** | `arifos.arif-fazil.com` + `mcp.arif-fazil.com` | arifOS docs + canonical MCP API |
| **Δ BODY** | `aaa.arif-fazil.com` | AAA + A-FORGE — agent workspace, operator cockpit |

**Domain organs** (WELL, WEALTH, GEOX) remain **internal services** behind arifOS and A-FORGE. They do not get first-class public hostnames. Near-term public narrative lives at `/labs/*` on `arifos.arif-fazil.com` or `/organs/*` on `aaa.arif-fazil.com`.

---

## Trinity Rings

### Ring 1: SOUL (Ψ) — Human Anchor

**Domain:** `arif-fazil.com`
**Stack:** React 19 + TypeScript + Vite + Tailwind CSS
**Deploy:** Cloudflare Pages → `arif-fazil.com`

**Role:** Total human surface — who Arif is, what arifOS is, institutional scar tissue.

**Special paths:**
- `/000` — Genesis / VOID playground. Raw experiments, prototypes, "zkPC-style disclaimers."
- `/999` — Validation surface. Seals, proofs, verified commitments, "this is what I stand by."

**Trinity navigation:** [Ω MIND](https://arifos.arif-fazil.com) | [Δ BODY](https://aaa.arif-fazil.com)

---

### Ring 2: MIND (Ω) — Constitutional Kernel + MCP

Split across two coordinated surfaces:

#### Ω MIND (Docs + Observatory)

**Domain:** `arifos.arif-fazil.com`
**Stack:** Static/SPA
**Deploy:** Cloudflare Pages

**Role:** arifOS governance documentation, 13 Floors, tool registry browser, observatory dashboards, `/labs` index for domain organs.

#### Ξ MIND (MCP API)

**Domain:** `mcp.arif-fazil.com`
**Stack:** FastMCP (Python) + uvicorn + Docker
**Deploy:** VPS Docker behind Caddy reverse proxy

**Role:** Canonical MCP API — machine-facing tool invocation.

| Endpoint | Transport | Purpose |
|----------|-----------|---------|
| `/mcp` | streamable-http | MCP tool calls |
| `/health` | HTTP/JSON | Live system status |
| `/tools` | HTTP/JSON | Tool manifest |
| `/.well-known/agent.json` | JSON | Agent card |
| `/a2a` | text/event-stream | A2A agent connections |

**Legacy:** `arifosmcp.arif-fazil.com` → 302 redirect to `mcp.arif-fazil.com`. Do not use.

**Trinity navigation:** [Ψ SOUL](https://arif-fazil.com) | [Δ BODY](https://aaa.arif-fazil.com)

---

### Ring 3: BODY (Δ) — Agent Workspace

**Domain:** `aaa.arif-fazil.com`
**Stack:** Static HTML + Tailwind CDN + Vanilla JS
**Deploy:** Cloudflare Pages

**Role:** AAA agent workspace + A-FORGE operator cockpit entry. Public-facing overview of agents, governance patterns, and operator dashboards. Authenticated surfaces for run logs and approvals live behind arifOS/A-FORGE on VPS.

**Trinity navigation:** [Ψ SOUL](https://arif-fazil.com) | [Ω MIND](https://arifos.arif-fazil.com)

---

## Domain Organs (Internal)

| Organ | Role | Public Surface |
|-------|------|---------------|
| **WELL** | Biological substrate, operator cognitive pressure | `/labs/well` on arifos or `/organs/well` on aaa |
| **WEALTH** | Capital intelligence, NPV, EMV, risk | `/labs/wealth` on arifos or `/organs/wealth` on aaa |
| **GEOX** | Earth science, geoscience, subsurface | `geox.arif-fazil.com` (field/lab surface) |

Domain organs are **not** first-class public hostnames. They answer to arifOS and A-FORGE. Public narrative about them lives on the flagship surfaces via `/labs` or `/organs` sections.

---

## Supporting Surfaces

| Surface | Domain | Role |
|---------|--------|------|
| **FORGE** | `forge.arif-fazil.com` | Agent deployment CI/CD |
| **WIKI** | `wiki.arif-fazil.com` | Constitutional knowledge base |

**GEOX GUI:** `geox.arif-fazil.com` — field/lab surface for earth science UI, kept as-is for now.

---

## Site-to-Repo Mapping

```
arif-sites (this repo)
├── sites/arif-fazil.com/     → arif-fazil.com (SOUL)
├── sites/arifos.arif-fazil.com/  → arifos.arif-fazil.com (MIND docs)
├── sites/aaa.arif-fazil.com/ → aaa.arif-fazil.com (BODY)
├── sites/forge.arif-fazil.com/ → forge.arif-fazil.com
├── sites/wiki.arif-fazil.com/ → wiki.arif-fazil.com
├── apps/geox/               → geox.arif-fazil.com (VPS proxy)
└── services/arifosmcp/      → mcp.arif-fazil.com (VPS Docker)
```

Cloudflare Pages projects each point to this same repo (`ariffazil/arif-sites`) with different output directories.

---

## Connection Map

```
                    HUMAN (Arif)
                  arif-fazil.com (SOUL)
                         │
            ┌────────────┼────────────┐
            ▼                         ▼
   arifos.arif-fazil.com      aaa.arif-fazil.com
   (MIND docs + observatory)   (BODY agents + forge)
            │                         │
            └────────────┬────────────┘
                         │
              ┌──────────▼──────────┐
              │   MCP Transport     │
              │  (mcp.arif-fazil.com)│
              │   JSON-RPC / HTTP   │
              └──────────┬──────────┘
                         │
     ┌───────────────────┼───────────────────┐
     ▼                   ▼                   ▼
   WELL               WEALTH               GEOX
  (MCP server)      (MCP server)       (MCP server)
  (internal)         (internal)         (field/lab)
     │                   │                 │
     └───────────────────┴────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │  arifOS Kernel  │
                         │  (F1–F13 +      │
                         │   VAULT999)     │
                         └────────┬────────┘
                                  │
                         ┌────────▼────────┐
                         │ A-FORGE         │
                         │ (orchestration) │
                         └─────────────────┘
```

> **MCP is the transport membrane, not the authority layer.** The MCP endpoint at `mcp.arif-fazil.com` exposes the federation's tool/resource/prompt surfaces to LLM hosts. Constitutional authority lives in the arifOS kernel behind the boundary.

---

## Migration Path

| Phase | Action | Status |
|-------|--------|--------|
| Minimal | Update `domains.yaml` to reflect Trinity v2 | ✅ Done |
| Balanced | Add `/labs` sections for WELL/WEALTH/GEOX on arifos/aaa | Pending |
| Maximal | Move GEOX GUI narrative to `/labs/geox`, keep only `geox.arif-fazil.com` as field surface | Pending |

---

## Deleted / Deprecated

| Domain | Status | Note |
|--------|--------|------|
| `arifosmcp.arif-fazil.com` | **Deprecated** → redirect | Use `mcp.arif-fazil.com` |
| `apex.arif-fazil.com` | Legacy | Superseded by `arifos.arif-fazil.com` |
| `waw.arif-fazil.com` | Archived | Absorbed into BODY/forge surfaces |
| `wawa.arif-fazil.com` | Archived | Absorbed into BODY/forge surfaces |

---

**Seal:** 999 SEAL | **Status:** ACTIVE
**Last Updated:** 2026.05.02
