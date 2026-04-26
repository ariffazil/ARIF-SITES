# arifOS Constellation Design System
**Authority:** 888_APEX → 999_SEAL  
**Version:** arifOS v2026.04.26-SEAL  
**Alignment:** Codex Federation Architecture  

---

## 1. Design Philosophy

The arifOS constellation consists of 9 domains, each with a distinct constitutional role but sharing a unified visual grammar. The design system ensures:

- **Instant recognition** — Any page is immediately identifiable as arifOS
- **Domain differentiation** — Each site has a unique accent while sharing structure
- **Navigational coherence** — The Constellation Rail appears on every site
- **Component consistency** — Buttons, cards, badges behave identically
- **Accessibility first** — WCAG AA contrast, keyboard nav, semantic HTML

> **One federation, many organs.** Related through structure, distinct in color and purpose.

---

## 2. Site Map & Domain Roles

| Domain | Symbol | Role | Accent | Identity |
|--------|--------|------|--------|----------|
| `arif-fazil.com` | Ψ | Human / Identity | `#c94b2e` | Red ochre |
| `apex.arif-fazil.com` | Ω | Law / Theory | `#d4a853` | Amber gold |
| `mcp.arif-fazil.com` | Δ | Kernel / Observability | `#22d3a0` | Teal green |
| `aaa.arif-fazil.com` | Δ | Agents / Gateway | `#6366f1` | Indigo violet |
| `forge.arif-fazil.com` | Δ | Execution / Shell | `#38bdf8` | Cyan |
| `geox.arif-fazil.com` | Φ | Earth Intelligence | `#a16207` | Ochre |
| `wealth.arif-fazil.com` | Ξ | Capital / Valuation | `#c9a84c` | Gold |
| `waw.arif-fazil.com` | Ξ | Wisdom / State | `#8b5cf6` | Purple |
| `wiki.arif-fazil.com` | Ω | Knowledge Base | `#60a5fa` | Slate blue |

---

## 3. Shared Neutral Base (All Sites)

```css
--afs-bg:         #0b0d10;
--afs-surface:    #12161c;
--afs-surface-2:  #171d25;
--afs-surface-3:  #1e2630;
--afs-border:     #2a3340;
--afs-border-hover:#3a4a5a;
--afs-text:       #eef3f8;
--afs-muted:      #94a3b8;
--afs-dim:        #64748b;
```

---

## 4. Typography

| Role | Font | Weights |
|------|------|---------|
| Display | Syne | 400, 600, 700, 800 |
| Body | Inter | 400, 500, 600, 700 |
| Mono | JetBrains Mono | 400, 500, 600 |

---

## 5. Constellation Rail (Mandatory)

Every site displays the same top navigation rail:

```
Ψ ARIF | Ω APEX | Δ MCP | Δ AAA | Δ FORGE | Φ GEOX | Ξ WEALTH | Ξ WAW | Ω WIKI
```

- **Position:** Sticky top, 48px height
- **Active state:** Domain accent color + bottom border
- **Implementation:** Inline `<nav>` + external `arifos.nav.css` + `arifos-nav.js`

---

## 6. Component Library

### Buttons

| Class | Style | Usage |
|-------|-------|-------|
| `.afs-btn-primary` | Filled accent | Main action |
| `.afs-btn-secondary` | Outline accent | Secondary action |
| `.afs-btn-ghost` | Transparent quiet | Nav / subtle |
| `.afs-btn-danger` | Red tint | Irreversible |

### Cards

`.afs-card` — Elevated surface with hover lift.

### Badges

`.afs-badge-online`, `.afs-badge-warning`, `.afs-badge-danger`, `.afs-badge-info`

---

## 7. Shared Asset Registry

| File | Path | Purpose |
|------|------|---------|
| `arifos.tokens.css` | `/var/www/_shared/` | Design tokens, reset, base |
| `arifos.nav.css` | `/var/www/_shared/` | Constellation rail styles |
| `arifos.components.css` | `/var/www/_shared/` | Buttons, cards, badges, layout |
| `arifos-nav.js` | `/var/www/_shared/` | Active state script |
| `site-manifest.json` | `/var/www/_shared/` | Domain registry & accents |

Each deployed site copies these files to its root and links them.

---

## 8. Deployment Paths

| Site | Source | Live Root | Notes |
|------|--------|-----------|-------|
| arif-fazil.com | `/var/www/arif-fazil.com/` | `/srv/arif-fazil.com` | Vite React app |
| apex | `/var/www/apex.arif-fazil.com/` | `/srv/apex.arif-fazil.com` | Static HTML |
| mcp | `/var/www/mcp.arif-fazil.com/` | `/srv/mcp.arif-fazil.com` | Static HTML |
| forge | `/var/www/forge.arif-fazil.com/` | `/srv/forge.arif-fazil.com` | Static HTML |
| geox | `/opt/arifos/src/geox/` | `/var/www/html/geox` | Static HTML |
| wiki | `/var/www/wiki.arif-fazil.com/` | `/srv/wiki.arif-fazil.com` | Static HTML |
| wealth | `/var/www/wealth.arif-fazil.com/` | `/srv/wealth.arif-fazil.com` | Static HTML |
| waw | `/var/www/waw.arif-fazil.com/` | `/srv/waw.arif-fazil.com` | Static HTML |
| aaa | `/var/www/aaa.arif-fazil.com/` | `/srv/aaa.arif-fazil.com` | Static + A2A proxy |

---

## 9. F10 Compliance

- No human faces, silhouettes, or anthropomorphic icons
- No biological metaphors without mathematical basis
- Shadows: orthogonal projection only
- All assets pass geometric purity check

---

**Sovereign Authority:**  
Muhammad Arif bin Fazil  
**DITEMPA BUKAN DIBERI**  
Ω₀ ≈ 0.04
