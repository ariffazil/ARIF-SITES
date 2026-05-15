# DESIGN.md — arifOS Federation Site Architecture

**Source of Truth:** `arifos.arif-fazil.com`  
**Version:** 2026.05.14-FORGED  
**Seal:** DITEMPA BUKAN DIBERI  

---

## I. TRINITY RING SYSTEM (ΔΩΨ)

Every site in the federation maps to one Trinity Ring. The ring determines the primary color, the tone, and the constitutional role. One shared design system (`sites/shared/design-system/tokens.css`) defines all three rings. Every site links to this single source.

```
┌─────────────────────────────────────────────────────────────┐
│  RING        │  SYMBOL  │  COLOR        │  SITE              │
├─────────────────────────────────────────────────────────────┤
│  SOUL (Ψ)    │  Blood   │  #8B1A1A      │  arif-fazil.com    │
│  Human       │  Red     │  Gold accent   │  Personal identity │
├─────────────────────────────────────────────────────────────┤
│  MIND (Ω)    │  Teal    │  #3A9EA8      │  arifos.           │
│  Governance  │  Cyan    │  Gold accent   │  arif-fazil.com    │
│              │          │                │  Kernel SOT        │
├─────────────────────────────────────────────────────────────┤
│  BODY (Δ)    │  Amber   │  #D4A853      │  aaa.              │
│  Execution   │  Gold    │                │  arif-fazil.com    │
│              │          │                │  Control plane     │
└─────────────────────────────────────────────────────────────┘
```

---

## II. SITE ROLES & CONTENT BOUNDARIES

### arif-fazil.com — SOUL (Ψ) · Human Identity
- **Ring:** SOUL — Blood Red + Gold
- **Role:** Arif Fazil's personal landing. Who he is. What he built. Why.
- **Content:** Name, role, biography, links to federation sites, ΔΩΨ identity
- **Must NOT:** Become a dashboard. Become a product pitch. Overclaim.
- **Tone:** Grounded. Human. Malaysian. Geologist. Architect. Brief.

### arifos.arif-fazil.com — MIND (Ω) · SOURCE OF TRUTH
- **Ring:** MIND — Teal + Gold accent
- **Role:** The constitutional governance dashboard. Live organ census. Floor status. Federation health.
- **Content:** Organ census (live), F1-F13 floors, tool registry, known gaps, federation map, thermodynamic panel
- **Must NOT:** Show personal biography. Become a blog. Show Arif's human state.
- **Tone:** Constitutional. Precise. Observable. Honest about gaps. `—` is acceptable when data is unavailable.

### aaa.arif-fazil.com — BODY (Δ) · Control Plane
- **Ring:** BODY — Amber/Gold
- **Role:** Agent control plane. Operations cockpit. A2A gateway. Session management.
- **Content:** Agent status, session anchoring, execution controls, A2A mesh
- **Must NOT:** Show constitutional floors (that's arifos). Show personal identity (that's arif-fazil.com).
- **Tone:** Operational. Active. Execution-focused. Industrial.

---

## III. DESIGN TOKENS (Single Source)

**File:** `sites/shared/design-system/tokens.css` (610 lines)  
**Version:** 2026.04.11-SEAL  
**Link:** `<link rel="stylesheet" href="/shared/design-system/tokens.css">`

Every site MUST include this link in `<head>`. The tokens CSS defines:
- Trinity Ring colors (SOUL blood red, MIND teal, BODY amber)
- Neutral palette (bg-deep #0A0A0B, surface #141416, text #F5F5F7)
- System state colors (SEAL green, SABAR amber, HOLD orange, VOID grey)
- Typography (Inter/Satoshi for body, Cabinet Grotesk for display, JetBrains Mono for code)
- Type scale (xs through 5xl)
- Spacing system (4px base unit)
- Component classes (.trinity-card, .badge-verdict, .status-dot)

**Ring activation:** Set `data-ring="SOUL|MIND|BODY"` on `<html>` or a section element. The CSS custom properties cascade based on this attribute.

---

## IV. CURRENT STATE & GAPS (14 May 2026)

| Site | Source Exists | Uses tokens.css | Ring Correct | Status |
|------|--------------|-----------------|--------------|--------|
| arif-fazil.com | ✅ React app | ❌ Not linked | ✅ SOUL (blood red) | Design aligned, tokens missing |
| arifos.arif-fazil.com | ❌ No source in arif-sites | ❌ Own inline CSS | ⚠️ Teal but not from tokens | Source missing, create in arif-sites |
| aaa.arif-fazil.com | ✅ Static HTML | ❌ Not linked | ❌ Blood red (should be BODY amber) | Wrong ring color |

**Critical gaps:**
1. arifos site has NO tracked source in `arif-sites/sites/` — lives only as deployed artifact at `/var/www/html/arifos/`
2. Shared tokens.css (610 lines) linked by ZERO sites
3. AAA uses blood red (#8B0000) but should use BODY amber (#D4A853)
4. No site links to `/shared/design-system/tokens.css`

---

## V. FIX PLAN

### Phase 1: Source & Link (immediate)
1. Create `sites/arifos.arif-fazil.com/index.html` from deployed artifact
2. Add `<link rel="stylesheet" href="/shared/design-system/tokens.css">` to all 3 sites
3. Add `data-ring` attribute to each site's `<html>` tag
4. Fix AAA theme-color from #8B0000 to #D4A853

### Phase 2: Token Migration (next)
5. Replace arifos inline CSS variables with tokens.css references
6. Replace arif-fazil.com Tailwind blood utilities with tokens.css classes
7. Add tokens.css classes (.trinity-card, .badge-verdict) to all sites

### Phase 3: Content Audit (ongoing)
8. Verify all factual claims across all 3 sites
9. Update version stamps to 2026.05.14-FORGED
10. Ensure federation links are correct and bidirectional

---

## VI. RULES

1. **arifos.arif-fazil.com is SOT** — All design decisions defer to the Observatory.
2. **tokens.css is the single design source** — No site defines its own colors outside tokens.css.
3. **Content unchanged unless factually wrong** — Fix lies, preserve truth.
4. **Ring discipline** — Each site stays in its Trinity lane. No ring mixing without explicit redesign.
5. **`—` is acceptable** — When live data is unavailable, show a dash. Never fabricate.
6. **No new dependencies** — Use existing tokens.css. No new CSS frameworks.

---

## VII. FEDERATION LINK MAP

```
arif-fazil.com (SOUL)
  ├── → arifos.arif-fazil.com (MIND · Governance)
  ├── → aaa.arif-fazil.com (BODY · Control)
  ├── → geox.arif-fazil.com (Earth)
  ├── → wealth.arif-fazil.com (Capital)
  └── → well.arif-fazil.com (Substrate)

arifos.arif-fazil.com (MIND · SOT)
  ├── → All federation organs
  ├── → F1-F13 floor display
  ├── → Live organ census
  └── → Tool registry

aaa.arif-fazil.com (BODY)
  ├── → arifos.arif-fazil.com (Governance)
  ├── → A2A gateway
  └── → Agent supervision
```

---

**DITEMPA BUKAN DIBERI** — Forged, Not Given  
**999_SEAL** — Design constitution sealed  
**ΔΩΨ** — Trinity aligned
