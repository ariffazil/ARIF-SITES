# arif-sites — Deployment Doctrine
**Static-First | Constitutional | Observable**

---

## 1. The Four Deployment Lanes

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      DEPLOYMENT LANE DECISION FLOW                          │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  START: What kind of surface are you deploying?                             │
│       │                                                                     │
│       ▼                                                                     │
│  ┌─────────────┐    YES    ┌─────────────────────────┐                     │
│  │ Is it fully │──────────▶│ LANE 1: STATIC          │                     │
│  │ static HTML │           │ Cloudflare Pages        │                     │
│  │ with no API │           │ Build → Deploy → Cache  │                     │
│  └─────────────┘           └─────────────────────────┘                     │
│       │ NO                                                                  │
│       ▼                                                                     │
│  ┌─────────────┐    YES    ┌─────────────────────────┐                     │
│  │ Does it use │──────────▶│ LANE 2: WEBMCP          │                     │
│  │ WebMCP for  │           │ Static host + MCP bridge│                     │
│  │ API calls?  │           │ Browser ↔ MCP server    │                     │
│  └─────────────┘           └─────────────────────────┘                     │
│       │ NO                                                                  │
│       ▼                                                                     │
│  ┌─────────────┐    YES    ┌─────────────────────────┐                     │
│  │ Does it need│──────────▶│ LANE 3: EDGE            │                     │
│  │ edge compute│           │ Cloudflare Workers      │                     │
│  │ (lightweight│           │ Vercel Edge Functions   │                     │
│  │ runtime)?   │           │ Deno Deploy             │                     │
│  └─────────────┘           └─────────────────────────┘                     │
│       │ NO                                                                  │
│       ▼                                                                     │
│  ┌─────────────┐           ┌─────────────────────────┐                     │
│  │ Full runtime│──────────▶│ LANE 4: MCP RUNTIME     │                     │
│  │ required    │           │ VPS Docker (Traefik)    │                     │
│  │ (persistent │           │ arifOS MCP gateway      │                     │
│  │ state, DB,  │           │ GEOX Earth Intelligence │                     │
│  │ heavy comp) │           └─────────────────────────┘                     │
│  └─────────────┘                                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Lane Specifications

### Lane 1: STATIC

**Use when:** Pure HTML/CSS/JS, no server-side logic, no API calls

**Targets:**
- Cloudflare Pages (primary)
- GitHub Pages (mirror)
- VPS nginx (fallback)

**Build:**
```bash
npm run build  # or equivalent
# Output: dist/ folder with static assets
```

**Deploy:**
```bash
# Cloudflare Pages — automatic on git push
git push origin main

# Or manual: wrangler pages deploy dist/
```

**Check:**
```bash
curl -sI https://<site> | grep -E "(HTTP|cf-cache-status)"
```

---

### Lane 2: WEBMCP

**Use when:** Static UI needs to call MCP tools via browser

**Architecture:**
```
Browser ──▶ Static HTML/JS (CDN)
    │
    └── WebSocket/SSE ──▶ MCP Server (VPS/Cloud)
```

**Configuration:**
```json
{
  "mcp_endpoint": "https://mcp.arif-fazil.com/mcp",
  "transport": "sse",
  "auth": "bearer"
}
```

**Security:**
- CORS preflight required
- Token scoped to specific tools only
- No secrets in static bundle

**Deploy:**
```bash
# Static part → Cloudflare Pages
# MCP bridge → VPS (arifosmcp)
```

---

### Lane 3: EDGE

**Use when:** Lightweight compute at edge, short-lived, stateless

**Targets:**
- Cloudflare Workers
- Vercel Edge Functions
- Deno Deploy

**Constraints:**
- < 50ms CPU time
- < 128MB memory
- No persistent state (use KV/D1 for storage)

**Example:**
```typescript
// Cloudflare Worker
export default {
  async fetch(request, env, ctx) {
    // Lightweight transform, routing, or auth
    return new Response("Hello from edge");
  }
};
```

**Deploy:**
```bash
wrangler deploy
```

---

### Lane 4: MCP RUNTIME / GATEWAY

**Use when:** Persistent state, heavy computation, database, full MCP server

**Targets:**
- VPS Docker (nginx reverse proxy)
- Fly.io
- Railway

**Characteristics:**
- Long-running containers
- Full arifOS MCP server
- Database connections (Postgres, Redis)
- Heavy compute (ML inference, geospatial)

**Deploy:**
```bash
# VPS path
cd /root/arifOS/deployments/af-forge
docker compose build && docker compose up -d

# Or via deploy script
./scripts/deploy-runtime.sh <service>
```

**Health check:**
```bash
curl https://<service>/health
```

### mcp.arif-fazil.com Gateway Architecture

Single public endpoint routing to multiple internal MCP backends:

```
external agent ──▶ https://mcp.arif-fazil.com/mcp (nginx)
                                        │
                    ┌─────────────────────┴─────────────────────┐
                    ▼                                           ▼
           arifOS MCP (:8080)                          GEOX MCP (:8765)
           arifos_* tools                               geox_* tools
```

**Nginx routing rules:**
- `/mcp` → `127.0.0.1:8080/mcp` (arifOS MCP)
- `/geox/mcp` → `127.0.0.1:8765/mcp` (GEOX MCP)
- `/health` → `127.0.0.1:8080/health`

**⚠️ Critical nginx rules (learned 2026-04-15):**
1. Use `proxy_set_header Host $proxy_host` NOT `$host` — backends reject non-local Host headers
2. Always kill and restart nginx fresh: `killall nginx; sleep 2; nginx` — never trust `-s reload` during debugging
3. Config edit: use `cat > file << 'EOF'` not `tee -a`
4. After any nginx change, purge Cloudflare cache immediately

**CF Token location:** `/opt/arifos/secrets/cloudflare_token`

---

## 3. Site-to-Lane Mapping

| Site | Lane | Target | Notes |
|------|------|--------|-------|
| arif-fazil.com | STATIC | Cloudflare Pages | SOUL ring — human anchor |
| arifos.arif-fazil.com | DELETED | — | MIND ring — merged into apex + arifosmcp |
| aaa.arif-fazil.com | STATIC | Cloudflare Pages | BODY ring — protocols |
| wiki.arif-fazil.com | STATIC | Cloudflare Pages | Knowledge base |
| apex.arif-fazil.com | STATIC | VPS nginx | 13 Floors (MIND ring) |
| forge.arif-fazil.com | WEBMCP | Pages + VPS | Tool execution via MCP |
| waw.arif-fazil.com | WEBMCP | Pages + VPS | State of machine |
| mcp.arif-fazil.com | MCP GATEWAY | VPS nginx → Docker | Public unified gateway (arifOS + GEOX) |
| arifosmcp.arif-fazil.com | MCP RUNTIME | VPS Docker | Legacy — redirects to mcp.arif-fazil.com |
| geox.arif-fazil.com | MCP RUNTIME | VPS Docker | GEOX Earth Intelligence (internal, :8765) |

---

## 4. Deployment Checklist

### Pre-Deploy

```
□ Read AGENTS.md for role permissions
□ Verify skill permission level matches agent
□ Check decision-matrix.yaml for routing
□ Run pre-deploy tests: npm test
□ Build locally and verify: npm run build && npx serve dist/
□ Check no secrets in build output: grep -r "sk-" dist/ || echo "OK"
```

### Deploy

```
□ Set deployment lane in config/deployment-target.yaml
□ Run deployment: npm run deploy (or equivalent)
□ Verify health endpoint: curl -s https://<site>/health
□ Check SSL: curl -sI https://<site> | grep "HTTP/2 200"
□ Verify Trinity nav: curl -s https://<site> | grep "Ψ SOUL"

# VPS/MCP-only steps:
□ For nginx config changes: sudo killall nginx; sleep 2; sudo nginx
□ Test locally BEFORE public: curl http://127.0.0.1:80/<path>
□ Purge Cloudflare cache after any backend change:
  TOKEN=$(cat /opt/arifos/secrets/cloudflare_token)
  ZONE_ID=$(curl -s "https://api.cloudflare.com/client/v4/zones" -H "Authorization: Bearer $TOKEN" | python3 -c "import sys,json; print(json.load(sys.stdin)['result'][0]['id'])")
  curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/cache/purge" -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d '{"purge_everything": true}'
```

### Post-Deploy

```
□ Run smoke tests: curl key endpoints
□ Check logs: docker logs <container> | tail -20
□ Verify CORS (if WebMCP): curl -sI -X OPTIONS https://<site>
□ Confirm rollback path is ready
□ Update deployment log in docs/deployments/
```

---

## 5. Rollback Protocol

### Trigger Conditions

- Health check fails for > 60 seconds
- Error rate > 5% for 5 minutes
- User reports critical breakage
- arifOS 888_HOLD issued

### Rollback Steps

```bash
# 1. Identify last known good version
git log --oneline -10

# 2. Revert to last good
git revert HEAD  # or git reset --hard <commit>

# 3. Force redeploy
git push origin main --force-with-lease

# 4. Verify rollback
curl -s https://<site>/health

# 5. Log incident
echo "$(date): Rollback to <commit> due to <reason>" >> docs/deployments/incidents.log
```

---

## 6. Constitutional Gates

### F1 Amanah (Reversibility)

Every deployment must be reversible within 5 minutes.
- Static: Git revert + push
- Edge: wrangler rollback
- Runtime: Docker image tag + redeploy

### F2 Truth (Grounding)

Deploy only what was built from committed code.
- No local modifications in production
- Build must be reproducible: lock files committed
- Source maps included for debugging

### F7 Humility (Uncertainty)

Deploy with known uncertainty bounds.
- Canary: 1% → 10% → 100% traffic
- Monitor error rates at each stage
- Auto-rollback on threshold breach

### F9 Anti-Hantu (No Deception)

No hidden state or credential leakage.
- All env vars in infra/configs/, never in repo
- No secrets in build artifacts
- Health endpoint must not expose internals

### F11 Auditability

Every deploy is logged and traceable.
- Git commit SHA in /health response
- Deployment timestamp logged
- Change summary in commit message

---

## 7. Seal

**DITEMPA BUKAN DIBERI** — Forged, Not Given

Deploy with discipline. Deploy with reversibility. Deploy with truth.

---

*Last updated: 2026-04-15*
*Update: 2026-04-15 — Added mcp.arif-fazil.com gateway, CF cache purge workflow, nginx $proxy_host rule*
