# DEPLOY.md — Trinity Sites Deployment Guide

## Overview

This document provides instructions for deploying the redesigned arifOS Trinity sites to Cloudflare Pages.

## Sites

| Site | Domain | Theme | Description |
|------|--------|-------|-------------|
| HUMAN | arif-fazil.com | Red (Primer) | Personal site, writing, identity |
| THEORY | apex.arif-fazil.com | Gold (Primer) | API docs, MCP docs, scientific theory |
| APPS | arifos.arif-fazil.com | Blue (Primer) | Installation, CLI tools, quickstart |
| AAA WIRE | aaa.arif-fazil.com | Multi | MCP, WebMCP, A2A protocol specs |

## File Structure

```
arif-sites-redesign/
├── sites/
│   ├── arif-fazil.com/          # HUMAN — Red theme
│   │   ├── index.html
│   │   └── assets/
│   │
│   ├── apex.arif-fazil.com/     # THEORY — Gold theme
│   │   ├── index.html
│   │   └── assets/
│   │
│   ├── arifos.arif-fazil.com/   # APPS — Blue theme
│   │   ├── index.html
│   │   └── assets/
│   │
│   └── aaa.arif-fazil.com/      # AAA WIRE — Protocol specs
│       ├── index.html
│       ├── mcp/
│       │   └── index.html
│       ├── webmcp/
│       │   └── index.html
│       └── a2a/
│           └── index.html
│
├── DESIGN_AUDIT.md               # Design feedback and improvements
└── DEPLOY.md                     # This file
```

## Deployment Instructions

### Prerequisites

1. Cloudflare account with access to Pages
2. GitHub repository (ariffazil/arif-sites)
3. DNS configured for the domains

### Step 1: Upload to GitHub

Upload the `sites/` directory to your GitHub repository:

```bash
# Clone the repository
git clone https://github.com/ariffazil/arif-sites.git
cd arif-sites

# Copy the new sites
cp -r /path/to/arif-sites-redesign/sites/* .

# Commit and push
git add .
git commit -m "feat: redesigned Trinity sites with Primer theme"
git push origin main
```

### Step 2: Cloudflare Pages Setup

For each site, create a Cloudflare Pages project:

#### 1. arif-fazil.com (HUMAN)

```yaml
Project Name: ariffazil
Build Command: (none — static site)
Output Directory: sites/arif-fazil.com
Root Directory: sites/arif-fazil.com
```

**Custom Domain:**
- Add `arif-fazil.com` as a custom domain
- Ensure DNS CNAME points to `ariffazil.pages.dev`

#### 2. apex.arif-fazil.com (THEORY)

```yaml
Project Name: apex
Build Command: (none — static site)
Output Directory: sites/apex.arif-fazil.com
Root Directory: sites/apex.arif-fazil.com
```

**Custom Domain:**
- Add `apex.arif-fazil.com` as a custom domain
- Ensure DNS CNAME points to `apex.pages.dev`

#### 3. arifos.arif-fazil.com (APPS)

```yaml
Project Name: arifos
Build Command: (none — static site)
Output Directory: sites/arifos.arif-fazil.com
Root Directory: sites/arifos.arif-fazil.com
```

**Custom Domain:**
- Add `arifos.arif-fazil.com` as a custom domain
- Ensure DNS CNAME points to `arifos.pages.dev`

#### 4. aaa.arif-fazil.com (AAA WIRE)

```yaml
Project Name: aaa
Build Command: (none — static site)
Output Directory: sites/aaa.arif-fazil.com
Root Directory: sites/aaa.arif-fazil.com
```

**Custom Domain:**
- Add `aaa.arif-fazil.com` as a custom domain
- Ensure DNS CNAME points to `aaa.pages.dev`

### Step 3: DNS Configuration

In Cloudflare DNS, ensure these records exist:

```
Type    Name                Target                      Proxy
CNAME   arif-fazil.com      ariffazil.pages.dev         Enabled
CNAME   apex                apex.pages.dev              Enabled
CNAME   arifos              arifos.pages.dev            Enabled
CNAME   aaa                 aaa.pages.dev               Enabled
```

### Step 4: Verify Deployment

After deployment, verify each site:

1. **HUMAN:** https://arif-fazil.com
   - Red theme
   - Hero section with "ARIF FAZIL"
   - Three Disciplines section
   - Writing section with Medium links

2. **THEORY:** https://apex.arif-fazil.com
   - Gold theme
   - 5 Axioms section
   - 7 Layers architecture
   - 9 Floors constraints
   - API documentation
   - MCP integration docs

3. **APPS:** https://arifos.arif-fazil.com
   - Blue theme
   - Install commands (pip, npm, docker)
   - CLI tool reference
   - MCP configuration
   - API endpoints

4. **AAA WIRE:** https://aaa.arif-fazil.com
   - Protocol comparison matrix
   - MCP specification at /mcp/
   - WebMCP specification at /webmcp/
   - A2A specification at /a2a/

## Color Reference

### Primer Dark Theme

```css
/* Background */
--bg-primary: #0d1117;
--bg-secondary: #161b22;
--bg-tertiary: #21262d;

/* Text */
--text-primary: #f0f6fc;
--text-secondary: #c9d1d9;
--text-muted: #8b949e;

/* Border */
--border: #30363d;

/* HUMAN (Red) */
--red-primary: #da3633;
--red-secondary: #f85149;
--red-accent: #ff7b72;

/* THEORY (Gold) */
--gold-primary: #d29922;
--gold-secondary: #e3b341;
--gold-accent: #f0883e;

/* APPS (Blue) */
--blue-primary: #58a6ff;
--blue-secondary: #79c0ff;
--blue-accent: #a5d6ff;
```

## Cross-Site Navigation

All sites include the Trinity Toggle in the navigation:

- **HUMAN** (Red) → arif-fazil.com
- **THEORY** (Gold) → apex.arif-fazil.com
- **APPS** (Blue) → arifos.arif-fazil.com

The active site is highlighted with its respective color.

## Post-Deployment Checklist

- [ ] All 4 sites load without errors
- [ ] Trinity navigation works between sites
- [ ] Custom domains are active with SSL
- [ ] Mobile responsiveness verified
- [ ] All links work correctly
- [ ] MCP protocol pages accessible at /mcp/, /webmcp/, /a2a/

## Troubleshooting

### Site not loading
1. Check Cloudflare Pages deployment logs
2. Verify DNS CNAME records
3. Ensure custom domain is active in Pages settings

### Assets not loading
1. Check that all assets are in the correct directory
2. Verify asset paths in HTML files
3. Check browser console for 404 errors

### Styles not applying
1. Verify CSS files are in the assets directory
2. Check that Tailwind CDN is loading (for AAA site)
3. Clear browser cache

## Support

For issues or questions:
- GitHub: https://github.com/ariffazil/arif-sites
- Email: arif@arif-fazil.com

---

**Version:** v55.4  
**Last Updated:** 2025-03-24  
**Status:** READY_FOR_DEPLOYMENT
