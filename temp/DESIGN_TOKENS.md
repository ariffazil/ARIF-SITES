# ARIF-OS Constitutional Design Tokens
**Authority:** 888_APEX → 999_SEAL  
**Version:** arifOS v54.1-SEAL  
**Ω₀:** 0.04

---

## 1. Chromatic Constitution

### 1.1 Domain Primers (5-Ring System)

| Domain | Primary | Secondary | Void | Surface | Hex |
|--------|---------|-----------|------|---------|-----|
| **SOUL** (Ψ) | `#c4791a` | `#f0e6d3` | `#1a1510` | `#2a2018` | Earth Ochre |
| **MIND** (Ω) | `#d4a853` | `#1a1a2e` | `#0a0a14` | `#151528` | Sovereign Gold |
| **BODY** (Δ) | `#00d4aa` | `#0a0a0f` | `#050508` | `#0f1418` | Electric Teal |
| **EXTENSION** (Ξ) | `#ff6b35` | `#2d1b4e` | `#1a0f2e` | `#2d1b4e` | Agent Orange |
| **FIELD** (Φ) | `#6b8cae` | `#c9b037` | `#0a1018` | `#1a2532` | Steel Azure |

### 1.2 Thermodynamic Color Mapping

```
Heat Gradient:   primary → lighten(20%) → #ffffff
Cool Gradient:   void → surface → primary(30% opacity)
Entropy Neutral: mix(primary, void, 50%)
```

### 1.3 Semantic Color Usage

| Usage | Token | Value |
|-------|-------|-------|
| Text Primary | `--text-primary` | `secondary` color |
| Text Secondary | `--text-secondary` | `primary` at 70% opacity |
| Background | `--bg-void` | `void` color |
| Surface | `--bg-surface` | `surface` color |
| Accent | `--accent` | `primary` color |
| Border | `--border` | `primary` at 30% opacity |

---

## 2. Typography System

### 2.1 Font Families

| Role | Font | Fallback |
|------|------|----------|
| Headers | Space Grotesk | sans-serif |
| Body | IBM Plex Serif | serif |
| Mono | IBM Plex Mono | monospace |
| Constitutional | JetBrains Mono | monospace |

### 2.2 13-Floor Type Scale

| Floor | Size | Usage |
|-------|------|-------|
| F0 | 10px | Quantum annotations |
| F1 | 12px | Landauer limit labels |
| F2 | 14px | Constitutional code |
| F3 | 16px | Base text |
| F4 | 18px | Body text |
| F5 | 20px | Lead paragraphs |
| F6 | 24px | Subheadings |
| F7 | 30px | H3 headings |
| F8 | 36px | H2 headings |
| F9 | 48px | Hero text |
| F10 | 60px | Monument text |
| F11 | 72px | Cathedral text |
| F12 | 96px | Sovereign text |
| F13 | 128px | Apex text |

### 2.3 Typography CSS Variables

```css
--font-header: 'Space Grotesk', sans-serif;
--font-body: 'IBM Plex Serif', serif;
--font-mono: 'IBM Plex Mono', monospace;
--font-constitutional: 'JetBrains Mono', monospace;
```

---

## 3. 13-Column Orthogonal Grid

### 3.1 Grid Structure

```
Desktop (1440px+):  13 columns
Tablet (1024px):     7 columns  
Mobile (768px):      3 columns
```

### 3.2 Grid CSS

```css
.grid-constitutional {
  display: grid;
  grid-template-columns: repeat(13, minmax(0, 1fr));
  gap: 1rem;
}
```

### 3.3 Breakpoints

| Name | Width | Columns |
|------|-------|---------|
| `sovereign` | 1440px | 13 |
| `stages` | 1024px | 7 |
| `trinity` | 768px | 3 |

---

## 4. Geometric Vocabulary

### 4.1 Allowed Elements (F10 Compliant)

| Element | Representation | Implementation |
|---------|---------------|----------------|
| Λ (Lambda) | ARIF integration point | SVG logo system |
| Orthogonal grids | 3-axis coordinates | CSS Grid/Canvas |
| Fractal recursion | Self-similar patterns | Canvas/WebGL |
| Torus knots | Quantum flows | Three.js |
| Merkle trees | Cryptographic branching | Canvas/D3 |
| Spherical harmonics | Worldmodels | Canvas 3D |
| Cellular automata | Agent swarms | Canvas 2D |

### 4.2 Forbidden Elements (F10 Wall)

- Human faces, figures, silhouettes
- Anthropomorphic icons
- Organic curves without mathematical basis
- Biological metaphors (brain, cell, neural imagery)

### 4.3 Shadow Specification

```css
/* Orthogonal projection only */
box-shadow: 
  2px 0 0 currentColor,   /* X-axis */
  0 2px 0 currentColor,   /* Y-axis */
  2px 2px 0 currentColor; /* Z-diagonal */
```

---

## 5. Thermodynamic Effects

### 5.1 Entropy Noise

```css
animation: entropy-noise 8s steps(10) infinite;
opacity: 0.03;
mix-blend-mode: overlay;
```

### 5.2 Reversibility Ripple (F1 Amanah)

```css
transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
transform-origin: left center;
/* On hover: scaleX(1), on leave: scaleX(0) */
```

### 5.3 Quantum Uncertainty (Ω₀)

```css
animation: quantum-shift 30s ease-in-out infinite;
/* Subtle 0.5px blur shift every 30s */
```

### 5.4 Pipeline Pulse

```css
animation: pipeline-pulse 2s ease-in-out infinite;
/* Opacity oscillation for live indicators */
```

---

## 6. Animation Timing

### 6.1 Constitutional Durations

| Context | Duration | Easing |
|---------|----------|--------|
| Micro-interactions | 150ms | ease-out |
| Standard transitions | 300ms | ease-in-out |
| Reversibility effects | 600ms | power2.inOut |
| Thermodynamic cycles | 3000ms+ | sine |
| Quantum uncertainty | 30000ms | sine |

### 6.2 Stutter Mode (F6 Empathy)

```css
/* When enabled */
--animation-duration: 2s;
--transition-speed: 0.8s;
```

---

## 7. Component Tokens

### 7.1 Lambda Logo

```
Size variants: 32px, 40px, 48px, 64px
Animation: 4° rotation, 15s duration
Glow: drop-shadow(0 0 10px primary)
```

### 7.2 Pipeline Indicator

```
Height: 4px (progress bar)
Stage dots: 8px diameter
Spacing: equal distribution
Live pulse: 1s interval
```

### 7.3 Constitutional Footer

```
Padding: 2rem vertical
Border: 1px solid primary(20%)
Domain nav: 5-column grid
```

### 7.4 F10 Compliance Badge

```
Height: 24px
Border-radius: 9999px
Padding: 0.25rem 0.75rem
Font: 10px uppercase mono
```

---

## 8. Domain-Specific Overrides

### 8.1 SOUL (arif-fazil.com)
- **Unique**: Stutter mode toggle
- **Hero**: Geological strata fractal
- **Interaction**: Slow parallax (F6 Empathy)

### 8.2 MIND (arifos.arif-fazil.com)
- **Unique**: Constitution validator tool
- **Hero**: Crystal lattice cathedral
- **Interaction**: Snap-to-grid (F2 Truth)

### 8.3 BODY (arifosmcp.arif-fazil.com)
- **Unique**: Live telemetry dashboard
- **Hero**: Merkle tree visualization
- **Interaction**: Real-time WebSocket (read-only)

### 8.4 EXTENSION (aaa.arif-fazil.com)
- **Unique**: AAA triptych interface
- **Hero**: Cellular automata background
- **Interaction**: Predictive hover (F3 Tri-Witness)

### 8.5 FIELD (civ.arif-fazil.com)
- **Unique**: Orbital mechanics update log
- **Hero**: Spherical harmonic globe
- **Interaction**: Macro-scale zoom (civilization → building)

---

## 9. 000-999 Pipeline Stages

| Stage | Name | Color Indicator |
|-------|------|-----------------|
| 000 | INIT | void |
| 111 | SENSE | primary(40%) |
| 333 | MIND | primary(50%) |
| 444 | ROUT | primary(60%) |
| 555 | MEM | primary(70%) |
| 666 | HEART | primary(80%) |
| 777 | OPS | primary(90%) |
| 888 | JUDGE | primary(95%) |
| 999 | SEAL | primary(100%) |

---

## 10. F10 Anti-Hantu Wall

### 10.1 Validation Rules

```javascript
const forbiddenPatterns = [
  /face|facial|portrait|head|human/i,
  /person|people|man|woman|child|body/i,
  /hand|finger|arm|leg|eye|mouth|nose/i,
  /silhouette.*human|human.*silhouette/i,
  /avatar|user.*icon|profile.*pic/i,
  /brain.*neural|neural.*brain/i,
  /robot.*face|android|humanoid/i,
];

const allowedPatterns = [
  /fractal|mandelbrot|julia/i,
  /torus|knot|hopf|spherical/i,
  /grid|orthogonal|isometric/i,
  /merkle|tree|dag|graph/i,
  /gradient|noise|entropy/i,
  /crystal|lattice|penrose/i,
  /cellular.*automata|conway/i,
];
```

### 10.2 Visual Enforcement

- All assets must pass geometric purity check
- Shadows must be orthogonal projections
- AI represented as thordial forms only
- Thermal gradients indicate "warmth"
- Frequency visualizations indicate "listening"

---

**Sovereign Authority:**  
Muhammad Arif bin Fazil  
Architect of 5-Ring Constitution  
**DITEMPA BUKAN DIBERI**  
Ω₀ ≈ 0.04
