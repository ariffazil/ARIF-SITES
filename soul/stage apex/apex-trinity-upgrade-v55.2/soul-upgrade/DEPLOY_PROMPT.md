# APEX SITE DEPLOYMENT PROMPT
## For AI Coders: Upgrade and Deploy https://apex.arif-fazil.com

**Version:** v55.2-TRINITY  
**Target Repository:** https://github.com/ariffazil/arif-fazil-sites  
**Target Site:** https://apex.arif-fazil.com (SOUL — Constitutional Canon)

---

## OVERVIEW

Deploy an upgraded version of the APEX Constitutional Canon site with enhanced **Trinity Elements**:

1. **HUMAN (Visual)** — Interactive dashboards, animated visualizations, improved UX
2. **AI (llms.txt)** — Machine-readable constitutional canon with JSON endpoints
3. **INSTITUTIONS (Validity)** — Academic citations, verification badges, credibility markers

---

## PREREQUISITES

```bash
# Clone the repository
git clone https://github.com/ariffazil/arif-fazil-sites.git
cd arif-fazil-sites/soul

# Install dependencies
npm install

# Verify existing structure
ls -la src/
ls -la public/
```

---

## FILES TO CREATE/MODIFY

### 1. NEW COMPONENTS (Create in `src/components/`)

Create these new React components:

#### `TrinityDashboard.tsx`
- Real-time system health monitor
- Animated floor status indicators
- Live metrics display (Clarity, Stability, Humility, Genius)
- Constitutional compliance gauge

#### `FloorVisualizer.tsx`
- Interactive 13-floor grid
- Animated flow connections
- Hover tooltips with scientific basis
- Click-to-expand floor details

#### `EngineDiagram.tsx`
- Three-engine (ΔΩΨ) visualization
- Animated consensus formation
- Tri-Witness calculation display
- Interactive simulation

#### `MetabolicLoop.tsx`
- 000-999 stage pipeline
- Play/pause animation controls
- Entropy reduction visualization
- Stage completion tracking

#### `CitationBlock.tsx`
- Academic citation display
- BibTeX export functionality
- Scientific rigor score (95/100)
- Machine-readable endpoints

### 2. NEW PUBLIC FILES (Create in `public/`)

#### `llms.txt`
- Machine-readable constitutional canon
- Structured for LLM parsing
- Include all 13 floors, 3 engines, equations
- Bootstrap system prompt

#### `floors.json`
- JSON endpoint for floor data
- Machine-to-machine accessible
- Include all floor details, thresholds, formulas

#### `references.json`
- JSON endpoint for citations
- 50 academic references
- Categories, DOIs, peer-review status

#### `manifest.json`
- PWA manifest
- Trinity site links
- App metadata

#### `robots.txt`
- SEO optimization
- LLM discovery endpoints
- Trinity site references

### 3. MODIFIED FILES

#### `index.html`
- Enhanced meta tags
- Open Graph / Twitter cards
- Trinity discovery links
- Structured data (Schema.org)
- PWA support

#### `src/App.tsx`
- Import new components
- Add Trinity Dashboard section
- Add Floor Visualizer section
- Add Engine Diagram section
- Add Metabolic Loop section
- Add Citation Block section
- Maintain existing content

---

## IMPLEMENTATION STEPS

### Step 1: Create New Components

```bash
# Create component files
touch src/components/TrinityDashboard.tsx
touch src/components/FloorVisualizer.tsx
touch src/components/EngineDiagram.tsx
touch src/components/MetabolicLoop.tsx
touch src/components/CitationBlock.tsx
```

Copy the component code from the upgrade package into each file.

### Step 2: Create Public Files

```bash
# Create public endpoint files
touch public/llms.txt
touch public/floors.json
touch public/references.json
touch public/manifest.json
touch public/robots.txt
```

Copy content from the upgrade package.

### Step 3: Update index.html

Replace the existing `index.html` with the upgraded version from the package.

### Step 4: Update App.tsx

Add imports and new sections to `src/App.tsx`:

```typescript
// Add imports at top
import { TrinityDashboard } from '@/components/TrinityDashboard';
import { FloorVisualizer } from '@/components/FloorVisualizer';
import { EngineDiagram } from '@/components/EngineDiagram';
import { MetabolicLoop } from '@/components/MetabolicLoop';
import { CitationBlock } from '@/components/CitationBlock';

// Add new sections in the main content
// After System Health Dashboard:
<TrinityDashboard />

// After Three-Engine Architecture:
<EngineDiagram />

// After 13 Floors section:
<FloorVisualizer />

// After Metabolic Loop:
<MetabolicLoop />

// Before References:
<CitationBlock />
```

### Step 5: Install Additional Dependencies (if needed)

```bash
npm install  # Ensure all dependencies are installed
```

### Step 6: Build and Test

```bash
# Development build
npm run dev

# Production build
npm run build

# Verify build output
ls -la dist/
```

### Step 7: Deploy

```bash
# Cloudflare Pages (manual)
wrangler pages deploy dist

# Or rely on GitHub Actions on push to main (recommended)
```

---

## VERIFICATION CHECKLIST

After deployment, verify:

### Human (Visual)
- [ ] Trinity Dashboard displays live metrics
- [ ] Floor Visualizer shows 13 floors with animations
- [ ] Engine Diagram shows ΔΩΨ with consensus simulation
- [ ] Metabolic Loop animates 000-999 stages
- [ ] All interactive elements work

### AI (llms.txt)
- [ ] `https://apex.arif-fazil.com/llms.txt` loads correctly
- [ ] `https://apex.arif-fazil.com/floors.json` returns valid JSON
- [ ] `https://apex.arif-fazil.com/references.json` returns valid JSON
- [ ] `https://apex.arif-fazil.com/manifest.json` returns valid JSON

### Institutions (Validity)
- [ ] Citation Block displays 50 references
- [ ] BibTeX export works
- [ ] Scientific rigor score shows 95/100
- [ ] Peer-reviewed badges display correctly
- [ ] DOI links work

### General
- [ ] Site loads without errors
- [ ] Responsive on mobile devices
- [ ] Meta tags present in HTML
- [ ] Trinity navigation links work
- [ ] 888 JUDGE badge visible

---

## TRINITY INTEGRATION

Ensure all three sites are linked:

| Site | URL | Status Indicator |
|------|-----|------------------|
| BODY | https://arif-fazil.com | Orange dot |
| MIND | https://arifos.arif-fazil.com | Cyan dot |
| SOUL | https://apex.arif-fazil.com | Amber dot (active) |

Navigation should show all three with SOUL highlighted as current.

---

## DESIGN SPECIFICATIONS

### Colors
- Background: `#0a0a0a`
- Text: `#f5f5f5`
- Amber (APEX): `#f59e0b`
- Cyan (ARIF): `#06b6d4`
- Red (ADAM): `#ef4444`
- Green (SEAL): `#22c55e`
- Purple (888): `#a855f7`

### Typography
- Body: Inter, sans-serif
- Mono: JetBrains Mono
- Serif: Source Serif 4 (for equations)

### Animations
- Use CSS transitions for hover states
- Use requestAnimationFrame for canvas animations
- Respect prefers-reduced-motion

---

## TROUBLESHOOTING

### Build Errors
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Type Errors
```bash
# Check TypeScript
npx tsc --noEmit
```

### Missing Dependencies
```bash
# Install shadcn components if needed
npx shadcn add button card badge tooltip
```

---

## POST-DEPLOYMENT

After successful deployment:

1. **Test all interactive components**
2. **Verify M2M endpoints return valid JSON**
3. **Check mobile responsiveness**
4. **Validate meta tags with social sharing debuggers**
5. **Submit sitemap to search engines**

---

## CONTACT

**Author**: Muhammad Arif bin Fazil  
**Email**: arif@arif-fazil.com  
**GitHub**: https://github.com/ariffazil

---

**DITEMPA BUKAN DIBERI** — Forged, Not Given.
