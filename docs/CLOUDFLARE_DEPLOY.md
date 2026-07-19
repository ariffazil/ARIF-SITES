# arif-sites — Deployment Architecture
**Truth as of: 2026-05-21**
**Seal: DITEMPA BUKAN DIBERI**

---

## Ground Truth

`arif-fazil.com` is **NOT on Cloudflare Pages**.

The deployment pipeline is:

```
GitHub (ariffazil/arif-sites, main branch)
        │
        ▼
rsync to /var/www/html/arif/ on VPS (72.62.71.199)
        │
        ▼
Caddy (VPS, reverse proxy, ports 80/443)
        │
        ▼
Cloudflare CDN (DNS + routing shim only)
        │
        ▼
End user
```

**What Cloudflare is doing:**
- DNS for `arif-fazil.com` → Cloudflare nameservers
- CDN/proxy (orange cloud) → caches DYNAMIC responses
- `arif-headers-fix` Worker (created 2026-04-02) → routing shim in front of VPS origin
- SSL/TLS full mode

**What Cloudflare is NOT doing:**
- NOT building the site
- NOT serving static files from Pages
- NOT running a CI/CD pipeline for this domain

---

## How to Deploy arif-fazil.com

### Step 1: Build locally (or on any machine with the repo)

```bash
cd /root/arif-sites/sites/arif-fazil.com
npm run build
```

Output: `dist/` folder

### Step 2: Sync to VPS web root

```bash
rsync -av --delete /root/arif-sites/sites/arif-fazil.com/dist/ www-data@172.67.134.76:/var/www/html/arif/
```

Or, if running ON the VPS directly:

```bash
rsync -av --delete /root/arif-sites/sites/arif-fazil.com/dist/ /var/www/html/arif/
```

Caddy picks up changes immediately — no service restart needed.

### Step 3: Verify

```bash
curl -sI https://arif-fazil.com/ | grep -E "cf-cache-status|HTTP/"
# cf-cache-status: DYNAMIC = Cloudflare is proxying, not serving from cache
# HTTP/2 200 = live
```

### How the rsync mechanism works

The rsync can be triggered by:
1. **Direct SSH** — `rsync` from any machine with SSH access to the VPS
2. **GitHub webhook** — if configured, GitHub pushes trigger a deploy script on the VPS
3. **CI/CD runner** — a GitHub Actions workflow or similar that runs on the VPS

If no automatic trigger is set up: manually run `rsync` from a machine that has SSH access to the VPS, or run it directly on the VPS if you have console access.

---

## Why This Matters

Agents and humans have been confused for months:
- `CLOUDFLARE_DEPLOY.md` (old) described a Cloudflare Pages pipeline that doesn't exist
- Previous diagnoses said "site is stuck on April 4" — WRONG
- VPS filesystem proves files are current (May 19 12:47 UTC)

**The Caddyfile on VPS confirms:**

```
arif-fazil.com {
    root * /var/www/html/arif
    file_server
    ...
}
```

`/var/www/html/arif/` is the canonical web root. Not Cloudflare Pages.

---

## Other Sites — Correct Deployment Paths

| Site | Deploy To | Mechanism |
|------|-----------|-----------|
| `arif-fazil.com` | `/var/www/html/arif/` | rsync → VPS Caddy |
| `aaa.arif-fazil.com` | `/var/www/html/aaa/` | rsync → VPS Caddy |
| `arifos.arif-fazil.com` | `/var/www/html/arifos/` | rsync → VPS Caddy |
| `geox.arif-fazil.com` | VPS Docker (:8765) | docker compose |
| `mcp.arif-fazil.com` | VPS Docker (:8080) | docker compose |
| `apex.arif-fazil.com` | VPS Docker | docker compose |

Static sites (aaa, arifos, arif-fazil.com) are all served by Caddy from `/var/www/html/` on the VPS. None are on Cloudflare Pages.

---

## Cloudflare Pages — What Actually Uses It

Nothing in the current constellation uses Cloudflare Pages as an active deployment target. The `CLOUDFLARE_DEPLOY.md` architecture (4 Pages projects linked to the same repo) was planned but never activated.

Cloudflare is used for:
- DNS management
- CDN caching
- SSL/TLS termination
- Workers (routing shim)

---

## How to Tell What's Actually Happening

```bash
# Check if Cloudflare is proxying or serving from Pages
curl -sI https://arif-fazil.com/ | grep cf-cache-status
# DYNAMIC = proxied to origin (VPS)
# HIT/HIT = served from Cloudflare cache
# MISS = Cloudflare fetched from origin, first request

# Check VPS web root directly (if on VPS)
ls -la /var/www/html/arif/ | head -5

# Check last modified
curl -sI https://arif-fazil.com/ | grep last-modified

# Check which Worker is active
curl -sI https://arif-fazil.com/ | grep -i "server\|cf-"
# server: cloudflare = CDN layer
```

---

## Rollback

If new deploy is broken:

```bash
# Re-rsync previous known-good build
rsync -av --delete /root/arif-sites/sites/arif-fazil.com/dist/ /var/www/html/arif/
```

Backup copies exist on VPS:
```
/var/www/html/arif.bak.*  (timestamped backups)
```

---

## For Agents

Before answering deployment questions about arif-sites domains:

1. Check `/var/www/html/<domain>/` on VPS — that's the canonical source
2. Check `curl -sI https://<domain>/ | grep cf-cache-status` — DYNAMIC means VPS origin
3. Do NOT assume Cloudflare Pages is involved
4. The deploy mechanism is rsync to VPS, not GitHub → Pages

---

**DITEMPA BUKAN DIBERI — Forged, Not Given**

*Updated: 2026-05-21 — Corrected after VPS filesystem inspection*
