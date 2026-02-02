# APEX Site Upgrade Package
## Trinity Enhancement for https://apex.arif-fazil.com

**Version:** v55.2-TRINITY  
**Date:** 2026-02-02  
**Author:** Muhammad Arif bin Fazil

---

## PACKAGE CONTENTS

This package contains all files needed to upgrade the APEX Constitutional Canon site with enhanced Trinity elements.

### Directory Structure

```
soul-upgrade/
├── README.md                    # This file
├── DEPLOY_PROMPT.md             # AI coder deployment instructions
├── index.html                   # Enhanced HTML with meta tags, Trinity links
├── public/
│   ├── llms.txt                 # Machine-readable constitutional canon
│   ├── floors.json              # M2M endpoint: floor data
│   ├── references.json          # M2M endpoint: academic citations
│   ├── manifest.json            # PWA manifest with Trinity links
│   └── robots.txt               # SEO optimization
└── src/
    └── components/
        ├── TrinityDashboard.tsx   # Interactive system monitor
        ├── FloorVisualizer.tsx    # Animated 13-floor diagram
        ├── EngineDiagram.tsx      # Three-engine (ΔΩΨ) visualization
        ├── MetabolicLoop.tsx      # 000-999 stage animation
        └── CitationBlock.tsx      # Academic citations & BibTeX
```

---

## TRINITY ENHANCEMENTS

### 1. HUMAN (Visual) — Interactive Components

| Component | Purpose | Features |
|-----------|---------|----------|
| **TrinityDashboard** | System health monitor | Live metrics, animated floor status, compliance gauge |
| **FloorVisualizer** | 13 floors display | Interactive grid, hover tooltips, click expansion |
| **EngineDiagram** | ΔΩΨ architecture | Consensus simulation, animated connections |
| **MetabolicLoop** | 000-999 pipeline | Play/pause controls, entropy visualization |
| **CitationBlock** | Academic credibility | BibTeX export, rigor score, DOI links |

### 2. AI (llms.txt) — Machine-Readable Canon

**Endpoints Created:**
- `/llms.txt` — Structured constitutional canon for LLMs
- `/floors.json` — JSON floor data with thresholds and formulas
- `/references.json` — 50 academic citations with metadata
- `/manifest.json` — PWA manifest with Trinity discovery

**Features:**
- Clear hierarchy for LLM parsing
- Bootstrap system prompt included
- Cross-references to canonical documents
- Machine-to-machine accessible

### 3. INSTITUTIONS (Validity) — Academic Credibility

**Enhancements:**
- 50 peer-reviewed citations
- Scientific rigor score: 95/100 (A-Grade)
- BibTeX export functionality
- Peer-review status badges
- DOI links where available
- Citation categories (ML, Physics, Philosophy, etc.)

---

## QUICK START

### For AI Coders

Use the `DEPLOY_PROMPT.md` file with any AI coding assistant:

```
"Please deploy the APEX site upgrade following the instructions in DEPLOY_PROMPT.md"
```

### Manual Deployment

1. Clone the repository:
```bash
git clone https://github.com/ariffazil/arif-fazil-sites.git
cd arif-fazil-sites/soul
```

2. Copy upgrade files:
```bash
# Copy public files
cp /path/to/soul-upgrade/public/* public/

# Copy component files
cp /path/to/soul-upgrade/src/components/* src/components/

# Replace index.html
cp /path/to/soul-upgrade/index.html index.html
```

3. Update App.tsx to import and use new components

4. Build and deploy:
```bash
npm install
npm run build
npm run deploy
```

---

## VERIFICATION

After deployment, verify these URLs:

| URL | Expected Content |
|-----|------------------|
| `https://apex.arif-fazil.com/llms.txt` | Constitutional canon text |
| `https://apex.arif-fazil.com/floors.json` | Floor data JSON |
| `https://apex.arif-fazil.com/references.json` | Citations JSON |
| `https://apex.arif-fazil.com/manifest.json` | PWA manifest |

---

## TRINITY INTEGRATION

All three sites are linked:

| Site | URL | Purpose | Color |
|------|-----|---------|-------|
| **BODY** | https://arif-fazil.com | Personal portfolio | Orange |
| **MIND** | https://arifos.arif-fazil.com | Documentation | Cyan |
| **SOUL** | https://apex.arif-fazil.com | Constitutional Canon | Amber |

---

## CORE EQUATIONS

```
Genius Index:     G = A × P × X × E²
Clarity:          ΔS = H(output) - H(input) ≤ 0
Peace²:           Ψ ≥ 1.0
Humility:         Ω₀ ∈ [0.03, 0.05]
Tri-Witness:      W₃ = (V_Δ + V_Ω + V_Ψ) / 3 ≥ 0.95
```

---

## 13 CONSTITUTIONAL FLOORS

### Hard Floors (VOID on violation)
- F1: Amanah (Reversibility)
- F2: Truth (≥99% confidence)
- F5: Peace² (Lyapunov ≥ 1.0)
- F9: Anti-Hantu (No consciousness claims)
- F10: Ontology (Type-consistency)
- F11: Authority (BLS signatures)
- F12: Hardening (Robustness ≥ 85%)

### Soft Floors (SABAR on violation)
- F3: Tri-Witness (Consensus ≥ 95%)
- F4: Clarity (ΔS ≤ 0)
- F6: Empathy (κᵣ ≥ 0.70)
- F7: Humility (Ω₀ ∈ [0.03, 0.05])
- F8: Genius (G ≥ 0.80)

### Veto Floor
- F13: Sovereign (888 JUDGE override)

---

## LICENSE

CC-BY-SA-4.0

---

**DITEMPA BUKAN DIBERI** — Forged, Not Given.

**Author:** Muhammad Arif bin Fazil  
**Email:** arif@arif-fazil.com  
**GitHub:** https://github.com/ariffazil
