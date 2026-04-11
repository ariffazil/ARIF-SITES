# Ω-Wiki — Constitutional Knowledge Base Architecture

> arif-fazil.com | Ditempa Bukan Diberi [ΔΩΨ | ARIF]

## Role in Trinity

Wiki is the **constitutional knowledge repository** — documenting arifOS governance, 13 Floors implementation, decision records, and operational runbooks.

```
         MIND (arifOS)
              │
              ▼
    ┌───────────────────────────┐
    │         WIKI              │
    │   wiki.arif-fazil.com      │
    │                           │
    │   Knowledge Base          │
    │   Decision Records        │
    │   Governance Docs         │
    └───────────────────────────┘
              │
         Documents
    ┌──────────────────────────────────┐
    │  All Trinity Sites               │
    └──────────────────────────────────┘
```

## Stack

| Layer | Technology |
|-------|------------|
| Frontend | Static HTML + JavaScript |
| Content | Markdown-based |
| Deployment | VPS nginx |

## Trinity Navigation

```html
<a href="https://arif-fazil.com">Ψ SOUL</a>
<a href="https://apex.arif-fazil.com">Ω MIND</a>
<a href="https://aaa.arif-fazil.com">Δ BODY</a>
```

## Content Structure

```
wiki.arif-fazil.com/
├── index.html           # Wiki home
├── docs/
│   ├── governance/      # 13 Floors docs
│   ├── decisions/      # Decision records
│   └── runbooks/       # Operational runbooks
└── .well-known/
    └── arifOS/         # arifOS references
```

## Deployment

Static files served from:
```
/opt/arifos/sites/wiki.arif-fazil.com/
```

## External References

| Resource | URL |
|----------|-----|
| arifOS Kernel | https://github.com/ariffazil/arifOS |
| MIND (arifOS) | https://apex.arif-fazil.com |
| MCP Gateway | https://arifosmcp.arif-fazil.com |

---

**Seal:** VAULT999 | **Status:** ACTIVE
