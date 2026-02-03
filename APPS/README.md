# arifOS APPS — Documentation Site

**The APPS Layer** — Documentation, API Reference, and MCP Tools for the arifOS Constitutional AI Framework.

Live at [arifos.arif-fazil.com](https://arifos.arif-fazil.com)

## Trinity Architecture

Three grounded layers, each with its own domain, color identity, and visual geometry:

| Layer | Label | Domain | Purpose | Color | Geometry |
|-------|-------|--------|---------|-------|----------|
| **BODY** | HUMAN | arif-fazil.com | Identity, personal brand | Red `hsl(0 84% 40%)` on Black `#050505` | Sierpinski triangles, fractal SVG noise |
| **SOUL** | THEORY | apex.arif-fazil.com | Theory, canon, grounding | Gold `hsl(45 100% 50%)` on Black | Metabolic loop, citation blocks, engine diagrams |
| **MIND** | APPS | arifos.arif-fazil.com | Documentation, API, tools | Cyan `hsl(199 89% 48%)` on Black | Fractal grid, toroidal ring, mesh blobs |

### Color Assignments (HSL)

```
HUMAN  — Red:  hsl(0 84% 40%)    → #8B0000  (dark crimson)
THEORY — Gold: hsl(45 100% 50%)  → #FFD700  (pure gold)
APPS   — Cyan: hsl(199 89% 48%)  → #0EA5E9  (sky-500)
```

## Features

- **9 Floors Visualization** — Interactive constitutional safety floor cards with semantic colors
- **9 MCP Tools Reference** — v55.1 explicit tool architecture (agi_sense → apex_verdict)
- **Trinity Parallel Pipeline** — Visual diagram of async AGI || ASI collapsing at APEX
- **API Endpoints** — Live status for /health, /mcp, /sse, /dashboard, /docs
- **Code Examples** — Python SDK usage with copy-to-clipboard
- **Constitutional Equations** — W₃ tri-witness, G genius index, Ω₀ Gödel uncertainty
- **Layered Background** — Fractal grid + toroidal ring + mesh gradients + fractal radial drift
- **Responsive Design** — Mobile-optimized with dark theme

## Technology Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- Lucide React (icons)
- shadcn/ui components (Card, Badge, Button, Separator)

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Deployment

Deployed to **Cloudflare Pages** via GitHub Actions CI.

- Global CDN (300+ PoPs)
- Cloudflare Universal SSL
- Security headers: HSTS, CSP, X-Frame-Options
- Build provenance at `/build-info.json`

## Design System

### Colors
- Background: `#0a0a0a` (near black)
- Primary: Cyan `hsl(199 89% 48%)` — APPS identity
- Gradient text: `#0ea5e9` → `#06b6d4` → `#e0f2fe` (cyan → teal → ice)
- Selection: `rgba(14, 165, 233, 0.3)`
- Floor card colors: Red → Orange → Yellow → Cyan → Green (semantic, not branding)
- Text: Gray scale with white highlights

### Typography
- Font: System UI stack
- Mono: JetBrains Mono / Fira Code

### Background Layers (bottom → top)
1. **Mesh blobs** — Three animated radial gradients (cyan, indigo, teal) with 20s drift
2. **Toroidal ring** — Perspective-transformed donut, 45s rotation + 20s opacity pulse
3. **Fractal grid** — 3 nested orthogonal scales (200px / 50px / 12.5px) in cyan
4. **Fractal radial** — 4 nested radial gradients with 60s diagonal drift

### Effects
- Glass morphism: `backdrop-blur(12px)`
- Glow: `glow-cyan-primary` (sky-500), `glow-cyan` (cyan-500)
- Torus glow: 8s pulsing box-shadow keyframe
- Mesh move: 20s ease-in-out position animation

---

**Ditempa Bukan Diberi** — Forged, Not Given
# Build trigger 1770115394
