# Cloudflare Pages Deployment Guide: The Constellation

This guide operationalizes **Phase 1-4** and **Phase 6** of the Master Deployment Guide.

## 1. Repository Setup
Ensure your GitHub repository `arif-sites` is pushed to your `ariffazil` organization.
All 5 sites exist as subdirectories within `/sites/`.

## 2. Cloudflare Pages Configuration

You will create **4 separate Pages projects** linked to the exact same repository, but with different build directories.

### Project 1: Ψ Identity (arif-fazil.com)
- **Framework:** Vite / React
- **Build Command:** `npm run build`
- **Build Output Directory:** `sites/arif-fazil.com/dist`
- **Custom Domain:** `arif-fazil.com` and `www.arif-fazil.com`

### Project 2: Δ Governance Cockpit (aaa.arif-fazil.com)
- **Framework:** None (Static HTML)
- **Build Command:** *(Leave empty)*
- **Build Output Directory:** `sites/aaa.arif-fazil.com`
- **Custom Domain:** `aaa.arif-fazil.com`

### Project 3: Φ Earth Intelligence (geox.arif-fazil.com)
- **Framework:** None (Static HTML)
- **Build Command:** *(Leave empty)*
- **Build Output Directory:** `sites/geox.arif-fazil.com`
- **Custom Domain:** `geox.arif-fazil.com`

### Project 4: Ω Wealth-as-Wisdom (waw.arif-fazil.com)
- **Framework:** None (Static HTML)
- **Build Command:** *(Leave empty)*
- **Build Output Directory:** `sites/waw.arif-fazil.com`
- **Custom Domain:** `waw.arif-fazil.com`

---

## 3. Security & Caching Rules (Cloudflare Dashboard)

1. **Page Rule: Block /999 Indexing**
   - URL: `arif-fazil.com/999/*`
   - Setting: Custom Cache Key (Bypass Cache for .enc files to ensure local decryption works flawlessly).
   - *Note: `robots.txt` already handles search engine blocking.*

2. **CORS Headers for WebMCP**
   - Ensure `mcp.arif-fazil.com` (VPS) allows cross-origin requests from the 4 Cloudflare Pages domains so the WebMCP client can fetch the `.well-known` manifest and execute tools.
