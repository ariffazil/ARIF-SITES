---
name: static-deploy-check
description: Verify static site is ready for deployment
description: Run pre-deploy checks on static sites
version: 1.0.0
permission: static
---

# static-deploy-check

Verify a static site is ready for deployment by running build, test, and validation checks.

## When to Use

Before deploying any static site (Lane 1).

## Checks Performed

1. **Build Check**
   - `npm ci` succeeds
   - `npm run build` produces output
   - No build errors or warnings

2. **Secret Scan**
   - No `sk-` patterns in dist/
   - No `.env` files in dist/
   - No hardcoded passwords

3. **Asset Validation**
   - All linked assets exist
   - No 404s in main pages
   - Trinity nav present

4. **Config Check**
   - `_routes.json` valid (if Cloudflare)
   - `wrangler.toml` present (if using Wrangler)

## Output

```yaml
status: [PASS|FAIL|WARN]
checks:
  build: { status: [PASS|FAIL], details: "..." }
  secrets: { status: [PASS|WARN], findings: [...] }
  assets: { status: [PASS|FAIL], missing: [...] }
  config: { status: [PASS|WARN], issues: [...] }
  
deploy_ready: boolean
blockers: ["Reason deployment should not proceed"]
```

## On Failure

If `deploy_ready: false`, do not deploy. Fix blockers first.
