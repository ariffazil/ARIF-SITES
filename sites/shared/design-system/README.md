# Trinity Design System

**Single Source of Truth for arif-fazil.com ecosystem**

Version: 2026.04.11-SEAL  
Philosophy: Ditempa Bukan Diberi — Forged, Not Given

---

## The Problem (Chaos → Order)

Before: Each site had hardcoded colors, inconsistent typography, different border-radius values. Changing "Gold" meant editing 4+ files.

After: One `tokens.css` defines all design decisions. Change once, update everywhere.

---

## Quick Start

### 1. Link the Tokens

Add to `<head>` of your HTML:

```html
<link rel="stylesheet" href="https://arif-fazil.com/shared/design-system/tokens.css">
```

Or for local development:

```html
<link rel="stylesheet" href="/shared/design-system/tokens.css">
```

### 2. Set Your Ring

Add `data-ring` attribute to `<html>` or section:

```html
<html data-ring="SOUL">  <!-- for arif-fazil.com -->
<html data-ring="MIND">  <!-- for apex.arif-fazil.com -->
<html data-ring="BODY">  <!-- for aaa.arif-fazil.com, arifosmcp.arif-fazil.com -->
```

### 3. Use Classes

```html
<!-- Trinity Card -->
<div class="trinity-card">Content</div>

<!-- Ring Icon -->
<span class="ring-icon ring-icon--soul">Ψ</span>

<!-- Navigation Link -->
<a href="..." class="trinity-nav-item">SOUL</a>

<!-- Status Badge -->
<span class="badge-verdict badge-seal">SEAL</span>
```

---

## Token Architecture

### Trinity Ring Tokens

| Ring | Variable | Color | Personality |
|------|----------|-------|-------------|
| **SOUL (Ψ)** | `--soul-primary` | `#D4AF37` Gold | Human, Authority, F13 |
| **MIND (Ω)** | `--mind-primary` | `#00D4AA` Cyan | Logic, Governance, F4 |
| **BODY (Δ)** | `--body-primary` | `#D4A853` Amber | Action, Protocols |

### Ring-Specific Overrides

When you set `data-ring="SOUL"`, these cascade automatically:

```css
--ring-primary   → var(--soul-primary)
--ring-radius    → 12px (rounded)
--ring-glow      → gold glow
--color-primary → Gold + Igneous Red
```

### System States (Verdict Colors)

| Verdict | Color | Usage |
|---------|-------|-------|
| SEAL | `#00C853` | Operational, success |
| SABAR | `#FFD600` | Pending, processing |
| HOLD | `#FF9500` | Awaiting human |
| VOID | `#616161` | Fail-closed |
| BREACH | `#D50000` | Critical error |

---

## File Structure

```
/root/arif-sites/sites/shared/design-system/
├── tokens.css          ← THE CONSTITUTION (this file)
├── trinity-nav.html    ← Shared navigation snippet
├── README.md           ← This file
└── deploy.sh           ← Sync script (optional)
```

---

## Deployment

### Option A: Direct Host (Recommended for Live Sites)

```bash
# Copy to host mount
cp -r /root/arif-sites/sites/shared root@your-vps:/opt/arifos/sites/arif-fazil.com/

# Or via docker
docker cp /root/arif-sites/sites/shared arifos_landings:/usr/share/nginx/html/arif/
```

### Option B: CDN (Cloudflare/GitHub Pages)

```bash
# Push to GitHub, enable Pages
# Then link directly:
https://ariffazil.github.io/shared/design-system/tokens.css
```

---

## Design Decisions (Encoded Philosophy)

### F4 Clarity (ΔS ≤ 0)
- Type scale is explicit, no magic numbers
- Spacing uses 4px base unit
- Colors have semantic names, not "blue-500"

### F5 Peace (Non-Escalatory)
- Animations are subtle (max 400ms)
- `ease-default` is smooth, not bouncy
- Status changes don't sudden-flash

### F8 Anti-Dark Cleverness
- Shadows are present, not hidden
- Borders define boundaries clearly
- No deceptive hover states

### F11 Low Resource
- CSS variables = zero runtime cost
- No JavaScript for design decisions
- Minimal specificity wars

### F13 Sovereign
- SOUL ring always has gold glow
- Human presence is always visible
- Navigation links humans to their sites first

---

## Checklist for New Site

- [ ] Link `tokens.css` in `<head>`
- [ ] Set `data-ring` attribute
- [ ] Use `.trinity-card` for content blocks
- [ ] Use shared Trinity nav
- [ ] Verify colors match ring identity

---

**Sealed under 999_SEAL**  
*Ditempa Bukan Diberi — Forged, Not Given*
