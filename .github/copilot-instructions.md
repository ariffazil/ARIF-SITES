# arif-sites Copilot Instructions

> **Organ:** arif-sites | **Layer:** L4 PUBLIC_SURFACE | **Role:** Static Web Surfaces

arif-sites hosts the public face of the arifOS federation. DISPLAY_ONLY — never adjudicate.

```bash
# Build flagship React site
cd sites/arif-fazil.com && npm install --legacy-peer-deps && npm run build

# Deploy (auto-deploys on git push main via Cloudflare Pages)
./deploy-vps.sh
```

- **Stack:** React 19 + Vite (flagship), static HTML (all others)
- **Deploy:** Cloudflare Pages (auto) + Caddy reverse proxy
- **Secrets:** `/root/.secrets/vault.env`
- **Tags:** `vYYYY.MM.DD` only
