# CLOUDFLARE PAGES DEPLOYMENT PROMPT
## Deploy APEX Site Upgrade to https://apex.arif-fazil.com

**Target:** SOUL — https://apex.arif-fazil.com  
**Source:** arif-fazil-sites/soul/  
**Platform:** Cloudflare Pages  
**Version:** v55.2-TRINITY

---

## EXECUTIVE SUMMARY

Deploy the upgraded APEX Constitutional Canon site with Trinity enhancements (Human visual, AI llms.txt, Institutions validity) to Cloudflare Pages under the apex.arif-fazil.com subdomain.

---

## PRE-DEPLOYMENT CHECKLIST

Before starting, verify:
- [ ] Local repository is at `arif-fazil-sites/`
- [ ] Cloudflare CLI (`wrangler`) is installed
- [ ] Authenticated with Cloudflare: `wrangler whoami`
- [ ] Node.js v18+ installed
- [ ] npm or pnpm available

---

## STEP 1: SETUP & PREPARATION

### 1.1 Navigate to Repository

```bash
cd /path/to/arif-fazil-sites
pwd  # Should show: .../arif-fazil-sites
```

### 1.2 Backup Current soul/ Directory

```bash
# Create backup
cp -r soul soul-backup-$(date +%Y%m%d-%H%M%S)
ls -la | grep soul
```

### 1.3 Verify Current Structure

```bash
tree -L 2 soul/ 2>/dev/null || find soul/ -maxdepth 2 -type f | head -20
```

Expected structure:
```
soul/
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── components.json
├── public/
│   ├── llms.txt (if exists)
│   └── ...
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── App.css
│   ├── components/
│   │   └── ui/ (shadcn components)
│   ├── hooks/
│   └── lib/
└── ...
```

---

## STEP 2: COPY UPGRADE FILES

### 2.1 Copy Public Files (M2M Endpoints)

```bash
# Copy all public endpoint files
cp /path/to/soul-upgrade/public/llms.txt soul/public/llms.txt
cp /path/to/soul-upgrade/public/floors.json soul/public/floors.json
cp /path/to/soul-upgrade/public/references.json soul/public/references.json
cp /path/to/soul-upgrade/public/manifest.json soul/public/manifest.json
cp /path/to/soul-upgrade/public/robots.txt soul/public/robots.txt

# Verify
cat soul/public/llms.txt | head -20
cat soul/public/floors.json | head -10
```

### 2.2 Copy New Components

```bash
# Create components directory if needed
mkdir -p soul/src/components

# Copy Trinity components
cp /path/to/soul-upgrade/src/components/TrinityDashboard.tsx soul/src/components/
cp /path/to/soul-upgrade/src/components/FloorVisualizer.tsx soul/src/components/
cp /path/to/soul-upgrade/src/components/EngineDiagram.tsx soul/src/components/
cp /path/to/soul-upgrade/src/components/MetabolicLoop.tsx soul/src/components/
cp /path/to/soul-upgrade/src/components/CitationBlock.tsx soul/src/components/

# Verify
ls -la soul/src/components/*.tsx
```

### 2.3 Update index.html

```bash
# Backup original
cp soul/index.html soul/index.html.backup

# Copy enhanced index.html
cp /path/to/soul-upgrade/index.html soul/index.html

# Verify Trinity links in meta tags
grep -A2 "trinity-" soul/index.html
```

---

## STEP 3: UPDATE App.tsx

### 3.1 Read Current App.tsx

```bash
cat soul/src/App.tsx | head -100
```

### 3.2 Add Component Imports

Add these imports at the TOP of `soul/src/App.tsx` (after existing imports):

```typescript
// Trinity Components
import { TrinityDashboard } from '@/components/TrinityDashboard';
import { FloorVisualizer } from '@/components/FloorVisualizer';
import { EngineDiagram } from '@/components/EngineDiagram';
import { MetabolicLoop } from '@/components/MetabolicLoop';
import { CitationBlock } from '@/components/CitationBlock';
```

### 3.3 Add New Sections

Add these sections to the main content area of App.tsx:

**After System Health Dashboard section, add:**
```tsx
{/* Trinity Dashboard */}
<section className="py-12 relative">
  <div className="max-w-4xl mx-auto px-4">
    <TrinityDashboard />
  </div>
</section>
```

**After Three-Engine Architecture section, add:**
```tsx
{/* Engine Diagram */}
<section className="py-24 relative">
  <div className="max-w-6xl mx-auto px-4">
    <div className="text-center mb-12">
      <span className="text-xs font-mono text-amber-400/60 tracking-widest uppercase">
        Interactive
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-3 text-gray-100">
        Tri-Witness Consensus Simulation
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Visualize how the three engines (ΔΩΨ) reach Byzantine fault-tolerant consensus.
      </p>
    </div>
    <EngineDiagram />
  </div>
</section>
```

**After 13 Floors section, add:**
```tsx
{/* Floor Visualizer */}
<section className="py-24 relative bg-gradient-to-b from-[#0a0a0a] via-gray-900/20 to-[#0a0a0a]">
  <div className="max-w-6xl mx-auto px-4">
    <div className="text-center mb-12">
      <span className="text-xs font-mono text-amber-400/60 tracking-widest uppercase">
        Interactive
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-3 text-gray-100">
        13 Constitutional Floors
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Click any floor to explore its constraint, scientific basis, and implementation.
      </p>
    </div>
    <FloorVisualizer />
  </div>
</section>
```

**After Metabolic Loop section, add:**
```tsx
{/* Metabolic Loop Animation */}
<section className="py-24 relative">
  <div className="max-w-6xl mx-auto px-4">
    <div className="text-center mb-12">
      <span className="text-xs font-mono text-amber-400/60 tracking-widest uppercase">
        Animation
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-3 text-gray-100">
        000–999 Metabolic Loop
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        Watch how every query traverses the 11-stage constitutional pipeline.
      </p>
    </div>
    <MetabolicLoop />
  </div>
</section>
```

**Before References section, add:**
```tsx
{/* Citation Block */}
<section className="py-24 relative bg-gradient-to-b from-[#0a0a0a] via-gray-900/20 to-[#0a0a0a]">
  <div className="max-w-4xl mx-auto px-4">
    <div className="text-center mb-12">
      <span className="text-xs font-mono text-amber-400/60 tracking-widest uppercase">
        Academic Rigor
      </span>
      <h2 className="text-3xl sm:text-4xl font-bold mt-2 mb-3 text-gray-100">
        Scientific Foundation
      </h2>
      <p className="text-gray-400 max-w-2xl mx-auto">
        All claims grounded in peer-reviewed literature with explicit citations.
      </p>
    </div>
    <CitationBlock />
  </div>
</section>
```

### 3.4 Verify App.tsx Changes

```bash
# Check for new imports
grep -n "TrinityDashboard\|FloorVisualizer\|EngineDiagram\|MetabolicLoop\|CitationBlock" soul/src/App.tsx
```

---

## STEP 4: INSTALL DEPENDENCIES

### 4.1 Navigate to soul Directory

```bash
cd soul
pwd  # Should show: .../arif-fazil-sites/soul
```

### 4.2 Install Dependencies

```bash
# Clean install
rm -rf node_modules package-lock.json
npm install

# Or use pnpm
# pnpm install
```

### 4.3 Verify shadcn Components

```bash
# Check if all UI components exist
ls -la src/components/ui/

# If missing, install them
npx shadcn add button card badge tooltip
```

---

## STEP 5: BUILD & TEST

### 5.1 Development Build

```bash
npm run dev
```

Open http://localhost:5173 and verify:
- [ ] Trinity Dashboard shows live metrics
- [ ] Floor Visualizer displays 13 floors
- [ ] Engine Diagram shows ΔΩΨ
- [ ] Metabolic Loop animates stages
- [ ] Citation Block shows references

### 5.2 Production Build

```bash
# Stop dev server (Ctrl+C), then:
npm run build

# Verify build output
ls -la dist/
ls -la dist/llms.txt 2>/dev/null || echo "llms.txt not in dist"
ls -la dist/floors.json 2>/dev/null || echo "floors.json not in dist"
```

### 5.3 Verify Public Files in Build

```bash
# Check if public files are copied to dist
cat dist/llms.txt | head -5
cat dist/floors.json | head -5
cat dist/references.json | head -5
```

If missing, copy manually:
```bash
cp public/llms.txt dist/
cp public/floors.json dist/
cp public/references.json dist/
cp public/manifest.json dist/
cp public/robots.txt dist/
```

---

## STEP 6: CLOUDFLARE PAGES DEPLOYMENT

### 6.1 Verify Wrangler Authentication

```bash
wrangler whoami
```

If not authenticated:
```bash
wrangler login
```

### 6.2 Check Existing Cloudflare Pages Project

```bash
# List existing projects
wrangler pages project list

# Should show: apex-arif-fazil-com or similar
```

### 6.3 Deploy to Cloudflare Pages

```bash
# Deploy from dist directory
wrangler pages deploy dist --project-name=apex-arif-fazil-com

# Or if using a different project name:
# wrangler pages deploy dist --project-name=<your-project-name>
```

### 6.4 Alternative: Git Integration Deployment

If using Git integration instead of direct upload:

```bash
# Commit changes
git add .
git commit -m "feat(soul): Trinity upgrade v55.2 — Dashboard, Visualizers, M2M endpoints

- Add TrinityDashboard: Real-time system health monitor
- Add FloorVisualizer: Interactive 13-floor diagram
- Add EngineDiagram: ΔΩΨ consensus simulation
- Add MetabolicLoop: 000-999 stage animation
- Add CitationBlock: Academic citations with BibTeX export
- Add M2M endpoints: /llms.txt, /floors.json, /references.json
- Update index.html with Trinity meta tags
- Enhance SEO with manifest.json, robots.txt

DITEMPA BUKAN DIBERI"

# Push to trigger Cloudflare Pages build
git push origin main
```

---

## STEP 7: POST-DEPLOYMENT VERIFICATION

### 7.1 Verify Site Loads

```bash
# Check site is accessible
curl -s -o /dev/null -w "%{http_code}" https://apex.arif-fazil.com
# Should return: 200
```

### 7.2 Verify Trinity Components

Open https://apex.arif-fazil.com in browser and verify:
- [ ] System Health Dashboard shows live metrics
- [ ] Trinity Dashboard displays floor status
- [ ] Floor Visualizer shows 13 interactive floors
- [ ] Engine Diagram simulates consensus
- [ ] Metabolic Loop animates 000-999 stages
- [ ] Citation Block shows 50 references

### 7.3 Verify M2M Endpoints

```bash
# Test llms.txt
curl -s https://apex.arif-fazil.com/llms.txt | head -20

# Test floors.json
curl -s https://apex.arif-fazil.com/floors.json | jq '.version'
# Expected: "v55.1-TRINITY"

# Test references.json
curl -s https://apex.arif-fazil.com/references.json | jq '.total_citations'
# Expected: 50

# Test manifest.json
curl -s https://apex.arif-fazil.com/manifest.json | jq '.name'
# Expected: "APEX — Constitutional Canon for AI Governance"
```

### 7.4 Verify Trinity Navigation

On the deployed site, verify:
- [ ] BODY link (orange) points to https://arif-fazil.com
- [ ] MIND link (cyan) points to https://arifos.arif-fazil.com
- [ ] SOUL link (amber) is highlighted as current

### 7.5 Verify Meta Tags

```bash
# Check Open Graph tags
curl -s https://apex.arif-fazil.com | grep -o '<meta[^>]*og:[^>]*>' | head -5

# Check Trinity discovery
curl -s https://apex.arif-fazil.com | grep -o 'trinity-[body|mind|soul]'
```

---

## STEP 8: ROLLBACK (IF NEEDED)

If deployment fails:

```bash
# Restore from backup
cd /path/to/arif-fazil-sites
rm -rf soul
cp -r soul-backup-<timestamp> soul

# Or restore specific files
cp soul/index.html.backup soul/index.html

# Redeploy
wrangler pages deploy soul/dist --project-name=apex-arif-fazil-com
```

---

## TROUBLESHOOTING

### Build Errors

```bash
# Clear all caches
rm -rf node_modules package-lock.json .vite
cd soul && npm install

# Check TypeScript errors
npx tsc --noEmit

# Check for missing dependencies
npm ls
```

### Missing Components

```bash
# Install shadcn components
npx shadcn add button card badge tooltip

# Verify lucide-react icons
npm list lucide-react
```

### Cloudflare Deployment Issues

```bash
# Check wrangler version
wrangler --version

# Update wrangler
npm install -g wrangler@latest

# Re-authenticate
wrangler logout
wrangler login
```

### Public Files Not Deployed

If `/llms.txt` returns 404:
```bash
# Verify files in dist
ls -la dist/*.txt dist/*.json

# Copy manually if needed
cp soul/public/* dist/

# Redeploy
wrangler pages deploy dist --project-name=apex-arif-fazil-com
```

---

## DEPLOYMENT SUMMARY

After successful deployment:

| Component | URL | Status |
|-----------|-----|--------|
| Main Site | https://apex.arif-fazil.com | ✅ |
| llms.txt | https://apex.arif-fazil.com/llms.txt | ✅ |
| floors.json | https://apex.arif-fazil.com/floors.json | ✅ |
| references.json | https://apex.arif-fazil.com/references.json | ✅ |
| manifest.json | https://apex.arif-fazil.com/manifest.json | ✅ |

| Trinity Site | URL | Color |
|--------------|-----|-------|
| BODY | https://arif-fazil.com | 🟠 Orange |
| MIND | https://arifos.arif-fazil.com | 🔵 Cyan |
| SOUL | https://apex.arif-fazil.com | 🟡 Amber |

---

## VERIFICATION COMMANDS

Quick verification script:

```bash
#!/bin/bash
DOMAIN="https://apex.arif-fazil.com"

echo "=== APEX Deployment Verification ==="
echo ""

echo "1. Main Site:"
curl -s -o /dev/null -w "Status: %{http_code}\n" $DOMAIN

echo ""
echo "2. M2M Endpoints:"
for endpoint in llms.txt floors.json references.json manifest.json; do
  status=$(curl -s -o /dev/null -w "%{http_code}" $DOMAIN/$endpoint)
  echo "  /$endpoint: $status"
done

echo ""
echo "3. Trinity Navigation:"
curl -s $DOMAIN | grep -o 'href="https://arif-fazil.com"' | head -1
curl -s $DOMAIN | grep -o 'href="https://arifos.arif-fazil.com"' | head -1

echo ""
echo "=== Verification Complete ==="
```

---

## CONTACT

**Author:** Muhammad Arif bin Fazil  
**Email:** arif@arif-fazil.com  
**GitHub:** https://github.com/ariffazil

---

**DITEMPA BUKAN DIBERI** — Forged, Not Given.
**Status:** SOVEREIGNLY_SEALED
