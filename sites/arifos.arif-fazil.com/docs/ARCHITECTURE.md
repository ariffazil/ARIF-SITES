# MIND — Constitutional Kernel Architecture

> **Ring 2: Ω** | apex.arif-fazil.com | Ditempa Bukan Diberi [ΔΩΨ | ARIF]

## Role in Trinity

MIND is the **constitutional governance layer** — the arifOS 13 Floors implementation that defines how AI systems must behave under uncertainty.

```
              SOUL (Human Anchor)
                    │
                    ▼
    ┌───────────────────────────┐
    │        MIND (Ω)           │
    │   arifos.arif-fazil.com   │
    │                           │
    │   13 Constitutional       │
    │   Floors (F1-F13)         │
    └───────────────────────────┘
                    │
         References ▼
    ┌───────────────┴───────────────┐
    │  AAA BODY                     │  MCP Gateway
    │  aaa.arif-fazil.com           │  arifosmcp.arif-fazil.com
    └───────────────────────────────┘
```

## Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + TypeScript |
| Build | Vite |
| Styling | Tailwind CSS |
| Deployment | Cloudflare Pages (arifos project) |

## Constitutional 13 Floors

The arifOS governance model implemented across all Trinity sites:

| Floor | Name | Function |
|-------|------|----------|
| F1 | Amanah | No irreversible action without VAULT999 seal |
| F2 | Truth | No ungrounded claims (τ ≥ 0.99) |
| F3 | Input Clarity | Clear task definition required |
| F4 | Entropy | Risk accumulation tracking |
| F6 | Harm/Dignity | No harm to humans/dignity |
| F7 | Confidence | Humility in uncertainty |
| F8 | Grounding | Evidence-based reasoning |
| F9 | Anti-Hantu | No deception/manipulation |
| F11 | Coherence | Internal consistency |
| F13 | Sovereign | Human holds final authority |

## Well-Known Resources

```bash
/.well-known/arifOS/floors.json    # F1-F13 definitions
/.well-known/arifOS/health.json     # System health
```

## Trinity Navigation

Footer includes mandatory Trinity links:
```html
<nav class="trinity-nav">
  <a href="https://arif-fazil.com" class="ring-soil">Ψ SOUL</a>
   <a href="https://apex.arif-fazil.com" class="ring-mind">Ω MIND</a>
  <a href="https://aaa.arif-fazil.com" class="ring-body">Δ BODY</a>
</nav>
```

## Design Tokens

MIND uses **Cyan + Grid + Sharp (0px radius)**:

```css
:root {
  --mind-primary: #00D4AA;      /* Cyan */
  --mind-secondary: #00A884;   /* Teal */
  --mind-accent: #00FFD1;      /* Bright cyan */
  --mind-bg: #0A0F14;          /* Deep blue-black */
  --mind-text: #E0F7FA;        /* Light cyan white */
  --mind-grid: #1A2A35;        /* Grid lines */
}
```

## Deployment

```bash
npm run build    # Builds to dist/
git push main     # Triggers Cloudflare Pages deploy
```

Cloudflare Pages project: `arifos`  
Source: `/sites/arifos.arif-fazil.com`

## External References

| Resource | URL |
|----------|-----|
| SOUL (arif-fazil) | https://arif-fazil.com |
| BODY (AAA) | https://aaa.arif-fazil.com |
| MCP Gateway | https://arifosmcp.arif-fazil.com |
| arifOS Kernel (GitHub) | https://github.com/ariffazil/arifOS |
| arifOS Runtime (VPS) | https://arifosmcp.arif-fazil.com/health |

---

**Seal:** VAULT999 | **Status:** ACTIVE
