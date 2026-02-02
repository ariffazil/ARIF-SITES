# Trinity Deployment Documentation

## GitHub Actions Automated Deployment

Your repo now has **automatic deployment** for all three sites using GitHub Actions.

### 🔧 Setup Required (One-time)

#### 1. Get Netlify Site IDs

For each site, run:
```bash
netlify sites:list
```

Or visit: https://app.netlify.com

You'll find the Site IDs for:
- **BODY** (arif-fazil.com)
- **SOUL** (apex.arif-fazil.com) - currently: `elegant-zuccutto-d2f535`
- **DOCS** (arifos.arif-fazil.com)

#### 2. Add GitHub Secrets

Go to: https://github.com/ariffazil/arif-fazil-sites/settings/secrets/actions

Add these secrets:
- `NETLIFY_AUTH_TOKEN` - Your Netlify personal access token
- `NETLIFY_SITE_ID_BODY` - Body site ID
- `NETLIFY_SITE_ID_SOUL` - Soul site ID (e.g., `elegant-zuccutto-d2f535`)
- `NETLIFY_SITE_ID_DOCS` - Docs site ID

#### 3. How to get Netlify Auth Token

Visit: https://app.netlify.com/user/applications/personal-access-tokens

Click "New access token" → Copy → Add to GitHub Secrets as `NETLIFY_AUTH_TOKEN`

### 🚀 How It Works

**Automatic deployment triggers on:**
- ✅ Every push to `main` branch
- ✅ Manual trigger via GitHub Actions UI

**What happens:**
1. Each site is built independently
2. All three deploy in parallel
3. Summary posted when complete

### 📊 Monitor Deployments

Go to: https://github.com/ariffazil/arif-fazil-sites/actions

Click the latest workflow run to see:
- Build status for each site
- Deploy timestamps
- Any errors

### ⚡ Manual Trigger

No need to push - trigger manually:
1. Go to Actions tab
2. Select "Deploy Trinity Sites"
3. Click "Run workflow"

---

## Site Configurations

Each site has its own `package.json` and build config:

- **body/** - arif-fazil.com (Portfolio)
  - Build: `npm run build`
  - Deploy to: Netlify

- **soul/** - apex.arif-fazil.com (APEX Constitutional Canon)
  - Build: `npm run build`
  - Deploy to: Netlify

- **docs/** - arifos.arif-fazil.com (arifOS Documentation)
  - Build: `npm run build`
  - Deploy to: Netlify

---

## Troubleshooting

If deployment fails:
1. Check Actions tab for error logs
2. Verify GitHub Secrets are set correctly
3. Ensure Netlify Site IDs are correct
4. Check that each site's `npm run build` works locally

**Test locally:**
```bash
cd body && npm run build
cd ../soul && npm run build
cd ../docs && npm run build
```

