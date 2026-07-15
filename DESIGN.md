# DESIGN.md — Agentic Web Builder Doctrine for arifOS Federation

> **DITEMPA BUKAN DIBERI** — The agentic web is forged, not given.
> **Created:** 2026-07-15 | **Author:** FORGE (000Ω) | **Sovereign:** Arif (F13)

---

## 0. What This Document Is

This is the **canonical reference** for every agent that builds, deploys, or manages sites in the arifOS federation web estate. It maps every tool, skill, protocol, library, codebase, and deployment path your agents need — then gives agentic tips for making the web surface itself more agentic.

**Scope:** Do NOT add new sites. Make existing ones sharper.

---

## 1. FULL ARIF-SITES ARCHITECTURE MAP

### 1.1 Directory Topology

```
/root/ARIF-SITES/
├── AGENTS.md                    # Agent operating rules
├── SITES.md                     # CANONICAL routing table (supersedes everything)
├── SKILL.md                     # Site management skill (349 lines)
├── DESIGN.md                    # ← THIS FILE
├── CONSTITUTION.md              # Full blueprint (475 lines)
├── DEPLOYMENT.md                # Four deployment lanes
├── CLOUDFLARE_DEPLOY.md         # Deployment truth (VPS > CF Pages)
├── ARIF_FAZIL_COM_TRINITY_MAP.md # Legacy (superseded by SITES.md)
│
├── deploy/
│   ├── Caddyfile                # 804 lines — THE reverse proxy config
│   ├── Dockerfile.optimized     # Container build
│   └── Dockerfile.patch
│
├── deploy-vps.sh                # Main deploy: build → rsync → Caddy reload
├── deploy/
│
├── scripts/
│   ├── deploy-site.sh           # Atomic single-site deploy (75 lines)
│   ├── deploy-vps.sh            # Full VPS deploy with verification (127 lines)
│   ├── refresh-mcp-proof.sh     # Cron: regenerate /proof/index.json
│   ├── arifosmcp-audit.sh       # Self-audit: TLS, DNS, health, MCP
│   ├── makcikgpt-daily-publish.py  # Pipeline scaffold (not built yet)
│   ├── gen_truth_pdf.py
│   ├── generate-seal-v0.1.mjs
│   ├── sign-did-configuration.py
│   └── verify-arifos.mjs
│
├── config/
│   └── decision-matrix.yaml     # 4 deployment lanes + permission matrix
│
├── sites/
│   ├── arif-fazil.com/          # Ψ SOUL — React 19 + Vite 7 SPA
│   ├── arifos.arif-fazil.com/   # Ω MIND — static observatory + .well-known
│   ├── aaa.arif-fazil.com/      # Δ BODY — A2A gateway (NOT in repo — out of sync)
│   ├── geox.arif-fazil.com/     # GEOX — 5 MCP Apps + cockpit + viewer
│   ├── wealth.arif-fazil.com/   # WEALTH — static HTML (index.html only)
│   ├── mcp.arif-fazil.com/      # MCP proof landing
│   └── shared/                  # ← THE KEY DIRECTORY
│       ├── design-system/
│       │   ├── tokens.css       # 610 lines — SINGLE SOURCE OF TRUTH
│       │   └── README.md
│       ├── trinity-nav.html     # Shared nav HTML snippet
│       ├── trinity-nav.js       # Self-injecting JS nav (46 lines)
│       └── webmcp/
│           ├── arifos-webmcp-adapter.js  # Core adapter v2 (218 lines)
│           ├── soul-tools.js     # SOUL ring tools (3 tools)
│           ├── observatory-tools.js  # MIND ring tools (3 tools)
│           ├── geox-tools.js    # GEOX ring tools (3 tools)
│           └── aaa-tools.js     # BODY ring tools (3 tools)
│
├── content/
│   ├── architecture/
│   ├── essays/
│   └── README.md
│
├── infra/                       # VPS architecture docs
├── forge_work/                  # Working artifacts
├── tools/                       # Essay ingest, migration
├── skills/                      # web-publish-essay skill
└── specs/                       # Routing constitution, spatial intelligence
```

### 1.2 The Six Surfaces (Trinity + Organs)

| Surface | Domain | Source | Deploy | Build | Type |
|---------|--------|--------|--------|-------|------|
| **Ψ SOUL** | `arif-fazil.com` | `/root/ARIF-SITES/sites/arif-fazil.com/` | Atomic swap → `/var/www/html/arif/` | `npm run build` (React 19 + Vite 7) | SPA |
| **Ω MIND** | `arifos.arif-fazil.com` | `/root/ARIF-SITES/sites/arifos.arif-fazil.com/` | rsync → `/var/www/html/arifos/` | None (static) | Static |
| **Δ BODY** | `aaa.arif-fazil.com` | **OUT OF SYNC** — source at `/root/AAA/dist/` | Manual cp | `npm run build` (React 19 + Vite) | SPA |
| **GEOX** | `geox.arif-fazil.com` | `/root/ARIF-SITES/sites/geox.arif-fazil.com/` | rsync → `/var/www/html/geox/` | None (static) | Static + Apps |
| **WEALTH** | `wealth.arif-fazil.com` | `/root/ARIF-SITES/sites/wealth.arif-fazil.com/` | rsync → `/var/www/html/wealth/` | None (static) | Static |
| **MCP** | `mcp.arif-fazil.com` | `/root/ARIF-SITES/sites/mcp.arif-fazil.com/` | rsync → proof dir | None | Static |

### 1.3 Caddy Routing (The 804-Line Gatekeeper)

**Live Caddyfile:** `/etc/caddy/Caddyfile`
**Repo Caddyfile:** `/root/ARIF-SITES/deploy/Caddyfile`

Key snippets:

```
# Snippets (imported by all vhosts)
(tls_origin)     → HSTS, nosniff, SAMEORIGIN headers
(shared_assets)  → /_shared/* → /var/www/html/_shared/
(cors_public)     → CORS for MCP endpoints

# Trinity vhosts
arif-fazil.com           → root /var/www/html/arif, /api/* → :8088, /000 + /999 sub-apps
arifos.arif-fazil.com    → root /var/www/html/arifos, /health → :8088, /mcp → :8088
aaa.arif-fazil.com       → root /var/www/html/aaa, /a2a/* → :3001

# Organ MCP vhosts
geox.arif-fazil.com      → /health + /mcp → :8081
wealth.arif-fazil.com    → /health + /mcp → :18082
well.arif-fazil.com      → /health + /mcp → :18083
forge.arif-fazil.com     → /health + /mcp → :7071, /opencode/* → :4096

# AI Bot Bypass (critical for agentic web)
@ai_bots header_regexp User-Agent (?i)(gptbot|claudebot|anthropic|ccbot|facebookexternalhit)
handle @ai_bots {
    @md path_regexp \.(md|txt)$
    handle @md { file_server }
}
```

### 1.4 Design System (tokens.css)

**610 lines. THE SINGLE SOURCE OF TRUTH for all visual surfaces.**

| Token Category | Key Variables | Purpose |
|----------------|---------------|---------|
| Ring Colors | `--soul-primary`, `--mind-primary`, `--body-primary` | Three-rank theming via `data-ring` attribute |
| System States | `--state-operational`, `--state-hold`, `--state-danger` | SEAL/SABAR/HOLD/VOID/BREACH status |
| Typography | `--font-sans` (Inter), `--font-mono` (JetBrains Mono) | Consistent type |
| Spacing | `--space-1` to `--space-16` | 4px base unit |
| Utility Classes | `.trinity-card`, `.badge-verdict`, `.glass-card` | Ready-made components |

**Ring theming:** Add `data-ring="SOUL|MIND|BODY"` to `<html>` or any ancestor. All child tokens cascade.

### 1.5 WebMCP Adapter (The Agentic Bridge)

**Core:** `arifos-webmcp-adapter.js` (218 lines)
**Pattern:** Every static page can register browser-native MCP tools.

```html
<!-- Include the adapter -->
<script src="/_shared/webmcp/arifos-webmcp-adapter.js"></script>

<!-- Register a read-only tool -->
<script>
arifosWebMCP.registerReadonly('get_status', 'Get federation status',
  {}, async () => fetch('/api/status').then(r => r.json()));
</script>
```

**Current tool inventory (12 tools across 4 rings):**

| Ring | File | Tools |
|------|------|-------|
| SOUL | `soul-tools.js` | `get_sovereign_identity`, `get_federation_map`, `get_humans` |
| MIND | `observatory-tools.js` | `get_floor_scores`, `get_organ_census`, `get_vault_health` |
| GEOX | `geox-tools.js` | `geox_get_health`, `geox_get_tools`, `geox_get_witness_status` |
| BODY | `aaa-tools.js` | `get_agent_card`, `get_active_agents`, `explain_governance` |

**Constitutional guards built into adapter:**
- F8: Blocks `__proto__`/`constructor` injection
- F13: State-changing tools require `requestUserInteraction()` confirmation
- F12: All errors wrapped in VOID verdict envelope

### 1.6 Decision Matrix (Deployment Lanes)

**File:** `/root/ARIF-SITES/config/decision-matrix.yaml`

| Lane | Risk | Target | Criteria |
|------|------|--------|----------|
| Static | LOW | VPS-Caddy | No API, no server state |
| WebMCP | MEDIUM | VPS-Caddy + Docker MCP bridge | Uses MCP, SSE/WebSocket |
| Edge | HIGH | Cloudflare Workers | <50ms CPU, <128MB RAM, stateless |
| Runtime | CRITICAL | VPS-Docker | Persistent state, DB, MCP server |

### 1.7 Git & GitHub

**Repo:** `github.com/ariffazil/arif-sites`
**License:** AGPL-3.0
**Branch:** `main` is production
**Auto-deploy:** Push to `main` → Cloudflare Pages (for CF-hosted surfaces only)

**VPS deploy is canonical.** CF Pages is an optional mirror.

---

## 2. DEPLOYMENT MECHANICS

### 2.1 Atomic Single-Site Deploy

```bash
bash /root/ARIF-SITES/scripts/deploy-site.sh arif-fazil.com
```

**Flow:**
1. Detect `dist/` vs `index.html` as build output
2. If `package.json` exists → `npm ci && npm run build`
3. Copy to temp dir (`/var/www/html/arif.tmp.<timestamp>`)
4. Move old → backup, move new → webroot
5. `chown www-data:www-data`
6. Reload Caddy
7. Health check `curl -s -o /dev/null -w "%{http_code}" https://<site>/`
8. Clean backup on success

### 2.2 Full VPS Deploy

```bash
bash /root/ARIF-SITES/deploy-vps.sh
```

**Flow:**
1. Build arif-fazil.com (React/Vite)
2. Pre-render MakcikGPT articles (Puppeteer)
3. Sync shared design system + WebMCP → `/var/www/html/_shared/`
4. rsync all sites to Caddy-served directories
5. Copy MakcikGPT markdown for AI bot bypass
6. Sync seal chain head to AAA `_state/`
7. Set permissions
8. Reload Caddy

### 2.3 Manual Deploy (for arifOS kernel + organs)

```bash
# arifOS kernel
cd /root/arifOS
rsync -av --exclude='.git' --exclude='.venv' /root/arifOS/ /opt/arifos/app/
systemctl restart arifos

# GEOX / WEALTH / WELL
cd /root/geox && pip install -e ".[dev]" && systemctl restart geox-mcp
cd /root/WEALTH && pip install -e ".[dev]" && systemctl restart wealth-organ
cd /root/WELL && pip install -e . && systemctl restart well

# AAA
cd /root/AAA && npm run build && rsync -av --delete dist/ /var/www/html/aaa/
```

### 2.4 Health Verification

```bash
# Quick probe all surfaces
for svc in arifos:8088 aforge:7071 aaa:3001 geox:8081 wealth:18082 well:18083; do
  n="${svc%%:*}"; p="${svc##*:}"
  curl -sf "http://localhost:$p/health" >/dev/null 2>&1 && echo "✅ $n :$p" || echo "❌ $n :$p"
done
```

---

## 3. AGENTIC TIPS & TRICKS

### 3.1 The Agentic Web Pattern (What You Already Have)

Your federation already implements the **agentic web** — sites that expose machine-readable tool surfaces alongside human UIs. The key insight:

```
Static HTML (for humans) + WebMCP tools (for agents) + MCP server (for programs) = Agentic Site
```

Each surface has THREE audiences:
1. **Humans** → browser renders HTML
2. **AI agents** → WebMCP adapter exposes tools via `navigator.modelContext`
3. **Programs** → MCP Streamable-HTTP at `/mcp` endpoint

### 3.2 Making Existing Sites MORE Agentic

**Principle: Don't add sites. Add tool registrations to existing pages.**

#### Pattern 1: Dynamic Data Injection

Every static page can fetch live data from organ MCPs and inject it as WebMCP tools:

```html
<script src="/_shared/webmcp/arifos-webmcp-adapter.js"></script>
<script>
// Fetch live data on page load, register as tool
async function loadAndRegister() {
  const data = await fetch('https://wealth.arif-fazil.com/health').then(r => r.json());
  arifosWebMCP.registerReadonly(
    'get_gold_price',
    'Get current XAUUSD gold price from WEALTH organ',
    { type: 'object', properties: {}, required: [] },
    async () => ({ content: [{ type: 'text', text: JSON.stringify(data) }] })
  );
}
loadAndRegister();
</script>
```

#### Pattern 2: Cross-Surface Tool Composition

Register tools on SOUL that delegate to MIND, GEOX, or WEALTH:

```javascript
arifosWebMCP.registerReadonly('ask_observatory', 'Query the arifOS observatory',
  { query: { type: 'string', description: 'What to ask' } },
  async (input) => {
    const r = await fetch('https://arifos.arif-fazil.com/api/observatory/v1/snapshot');
    const snapshot = await r.json();
    // Filter snapshot by query, return relevant fields
    return { content: [{ type: 'text', text: JSON.stringify(snapshot, null, 2) }] };
  }
);
```

#### Pattern 3: AI Bot Bypass (Already Working)

Your Caddyfile already serves raw `.md` to GPTBot/ClaudeBot. Extend this:

```bash
# In Caddyfile, serve structured data to AI bots
@ai_bots header_regexp User-Agent (?i)(gptbot|claudebot|anthropic)
handle @ai_bots {
    # Serve JSON-LD structured data
    @jsonld path /api/*
    handle @jsonld { reverse_proxy 127.0.0.1:8088 }
    # Serve raw markdown
    @md path_regexp \.(md|txt)$
    handle @md { file_server }
}
```

#### Pattern 4: `.well-known/` Discovery

Every surface should expose machine-readable discovery:

```
/.well-known/webmcp.json    → WebMCP tool manifest (browser agents)
/.well-known/mcp.json       → MCP server manifest (programmatic agents)
/.well-known/agent.json     → A2A agent card (agent-to-agent)
/.well-known/did.json       → DID document (identity verification)
```

#### Pattern 5: SSE Streams for Live State

For pages that show live federation state:

```javascript
// SSE endpoint on arifOS kernel
const evtSource = new EventSource('/api/federation-probe/stream');
evtSource.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // Update DOM + register as WebMCP tool
  document.getElementById('status').textContent = data.status;
  window.__liveStatus = data; // Expose for WebMCP
};
```

#### Pattern 6: Structured Data for AI Crawlers

Every page should emit JSON-LD:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebAPI",
  "name": "arifOS Federation",
  "description": "Constitutional AI governance substrate",
  "endpoint": "https://mcp.arif-fazil.com/mcp",
  "provider": {
    "@type": "Person",
    "name": "Muhammad Arif bin Fazil"
  }
}
</script>
```

### 3.3 Agent-Ready Patterns (What to Build)

#### Pattern 7: Federated Content Pipeline

```
Hermes (21:30) → WEALTH engine → MakcikGPT kernel → auto-generate .ts module → build → deploy
```

This is already scaffolded in `scripts/makcikgpt-daily-publish.py`. Key ingredients:
- TypeScript data module pattern (see SKILL.md §5)
- `npm run build` → atomic swap
- Seal chain heartbeat sync

#### Pattern 8: Observability Dashboard as WebMCP Surface

Convert the observatory snapshot into a tool-rich page:

```javascript
// On arifos.arif-fazil.com
arifosWebMCP.registerReadonly('get_floors', 'Get F1-F13 scores', {},
  async () => {
    const r = await fetch('/api/observatory/v1/snapshot');
    const snap = await r.json();
    return {
      floors: snap.floors,
      verdict: snap.thermodynamic?.verdict,
      drift: snap.runtime_drift,
      vault: snap.vault999_health
    };
  }
);

arifosWebMCP.registerReadonly('get_seal_chain', 'Get latest VAULT999 seals', {},
  async () => {
    const r = await fetch('/api/observatory/v1/snapshot');
    const snap = await r.json();
    return snap.vault999 || { status: 'unknown' };
  }
);
```

#### Pattern 9: Self-Healing Pages

Pages that detect their own staleness and show a warning:

```javascript
async function checkFreshness() {
  const r = await fetch('/api/build-info');
  const info = await r.json();
  const age = Date.now() - new Date(info.built_at).getTime();
  const days = Math.floor(age / 86400000);
  if (days > 7) {
    document.getElementById('freshness-warning').textContent =
      `⚠️ This page was built ${days} days ago. Data may be stale.`;
  }
}
checkFreshness();
```

#### Pattern 10: WebMCP as API Gateway

Every `.well-known/webmcp.json` tool is a **governed API endpoint** with constitutional floor guards. This is stronger than raw REST because:
- F8 blocks prototype pollution
- F13 requires human confirmation for state changes
- F12 treats all input as untrusted
- Every tool returns a structured `verdict` envelope

### 3.4 Anti-Patterns (Never Do These)

| Anti-Pattern | Why | Fix |
|---|---|---|
| New subdomain for every feature | F4 CLARITY — entropy increases | Add routes under existing surfaces |
| Raw `fetch()` without floor guard | F12 INJECTION — untrusted input | Use `arifosWebMCP.registerReadonly` |
| Hardcoded API keys in HTML | F1 AMANAH — secrets in source | Use Caddy reverse proxy to backend |
| Self-signed JWTs | F2 TRUTH — false authority | Use arifOS kernel session tokens |
| Static HTML claiming live data | F2 TRUTH — fabrication | Use SSE or periodic fetch with timestamp |
| Adding sites without SITES.md update | F11 AUDIT — routing drift | Update SITES.md on every routing change |

---

## 4. COMPLETE TOOL / SKILL / PROTOCOL / LIB INVENTORY

### 4.1 Skills Your Agents Must Load

| Skill | Path | When to Load |
|-------|------|-------------|
| `FORGE-init-intent-classify` | `/root/.agents/skills/FORGE-init-intent-classify/SKILL.md` | Session start, classify intent |
| `FEDERATION-site-deploy` | `/root/.agents/skills/FEDERATION-site-deploy/SKILL.md` | Any deploy operation |
| `FEDERATION-site-health` | `/root/.agents/skills/FEDERATION-site-health/SKILL.md` | Health monitoring |
| `FEDERATION-site-router` | `/root/.agents/skills/FEDERATION-site-router/SKILL.md` | Route tasks to correct surface |
| `KERNEL-mcp-builder` | `/root/.agents/skills/KERNEL-mcp-builder/SKILL.md` | Designing/auditing MCP servers |
| `FORGE-precommit-gate` | `/root/.agents/skills/FORGE-precommit-gate/SKILL.md` | Before any git commit |
| `999-vault-seal-immutable` | `/root/.agents/skills/999-vault-seal-immutable/SKILL.md` | Session end — seal to VAULT999 |

### 4.2 MCP Servers Available

| Server | Port | Key Tools for Web Work |
|--------|------|----------------------|
| arifOS | :8088 | `arif_init`, `arif_observe`, `arif_judge`, `arif_seal` |
| A-FORGE | :7071/:7072 | `forge_shell`, `forge_git`, `forge_filesystem`, `forge_docker` |
| GEOX | :8081 | `geox_basin`, `geox_claim`, `geox_seismic_compute` |
| WEALTH | :18082 | `capital_health`, `capital_market`, `capital_wisdom` |
| WELL | :18083 | `well_assess_homeostasis`, `well_guard_dignity` |
| GitHub | local | `github_create_pull_request`, `github_merge_pull_request` |
| Docker | local | Container lifecycle |
| Supabase | local | DB, Auth, Edge Functions |
| Cloudflare | local | DNS, Workers, R2, Pages |
| Context7 | local | Up-to-date library docs |

### 4.3 Key Files & Paths

| What | Path |
|------|------|
| ARIF-SITES repo | `/root/ARIF-SITES/` |
| Live Caddyfile | `/etc/caddy/Caddyfile` |
| Repo Caddyfile | `/root/ARIF-SITES/deploy/Caddyfile` |
| Design tokens | `/root/ARIF-SITES/sites/shared/design-system/tokens.css` |
| WebMCP adapter | `/root/ARIF-SITES/sites/shared/webmcp/arifos-webmcp-adapter.js` |
| Trinity nav | `/root/ARIF-SITES/sites/shared/trinity-nav.js` |
| Per-ring tool files | `/root/ARIF-SITES/sites/shared/webmcp/{soul,observatory,geox,aaa}-tools.js` |
| Decision matrix | `/root/ARIF-SITES/config/decision-matrix.yaml` |
| SOUL React source | `/root/ARIF-SITES/sites/arif-fazil.com/src/` |
| GEOX apps registry | `/root/ARIF-SITES/sites/geox.arif-fazil.com/apps.json` |
| Federation manifest | `/root/ARIF-SITES/sites/arifos.arif-fazil.com/federation-manifest.json` |
| MCP server card | `/root/ARIF-SITES/sites/arifos.arif-fazil.com/.well-known/mcp/server.json` |
| Seal chain head | `/root/VAULT999/seal_chain_head.json` |
| All deploy scripts | `/root/ARIF-SITES/scripts/` |

### 4.4 Libraries & Dependencies

**SOUL (React site):**
- React 19, Vite 7, TypeScript, Tailwind CSS, Framer Motion
- React Router v6

**Shared (static sites):**
- tokens.css (zero-dependency CSS custom properties)
- arifos-webmcp-adapter.js (zero-dependency IIFE)
- trinity-nav.js (zero-dependency IIFE)

**Infrastructure:**
- Caddy 2 (reverse proxy, TLS, CORS)
- Cloudflare (DNS, CDN, Origin CA SSL)
- Node 22 (A-FORGE, AAA)
- Python 3.12 (arifOS, GEOX, WEALTH, WELL)
- Docker (supporting services: Postgres, Redis, Qdrant, NATS)

### 4.5 GitHub Repos

| Repo | URL | Role |
|------|-----|------|
| arif-sites | `github.com/ariffazil/arif-sites` | Web estate + Caddyfile |
| arifOS | `github.com/ariffazil/arifOS` | Constitutional kernel |
| A-FORGE | `github.com/ariffazil/A-FORGE` | Execution shell |
| AAA | `github.com/ariffazil/AAA` | Control plane |
| GEOX | `github.com/ariffazil/geox` | Earth intelligence |
| WEALTH | `github.com/ariffazil/WEALTH` | Capital intelligence |
| WELL | `github.com/ariffazil/WELL` | Human readiness |

---

## 5. DESIGN PRINCIPLES FOR AGENTIC WEB

### 5.1 The Three-Layer Agent Surface

Every page should work at three levels:

```
Layer 1: HUMAN    → Beautiful HTML, clear typography, readable content
Layer 2: AGENT    → WebMCP tools, structured JSON, .well-known/ discovery
Layer 3: BOT      → Raw markdown, JSON-LD, llms.txt, robots.txt
```

### 5.2 The Agentic Design Rules

| Rule | Implementation |
|------|---------------|
| **Every page is an API** | Register at least one WebMCP tool per page |
| **Data is live, not baked** | Fetch from organ MCPs, don't hardcode |
| **Tools are governed** | Every tool goes through `arifosWebMCP.registerReadonly` with floor guards |
| **Discovery is automatic** | `.well-known/webmcp.json` declares all tools |
| **Bots get raw content** | Caddy bot-bypass serves `.md` to AI crawlers |
| **State changes need consent** | `registerStateful` triggers F13 `requestUserInteraction` |
| **Errors are verdicts** | Every error returns `{ verdict: 'VOID', reason: '...' }` |
| **Freshness is visible** | Show build timestamp, detect staleness |

### 5.3 The Constitutional Web Stack

```
┌─────────────────────────────────────────────────┐
│  HUMAN LAYER (HTML/CSS/JS)                      │
│  React 19 + Vite 7 + Tailwind + Framer Motion   │
│  Design tokens from tokens.css                  │
│  Trinity nav via trinity-nav.js                  │
├─────────────────────────────────────────────────┤
│  AGENT LAYER (WebMCP)                           │
│  arifos-webmcp-adapter.js (F8/F12/F13 guards)   │
│  Per-ring tool files (soul/geox/observatory/aaa) │
│  .well-known/webmcp.json discovery              │
├─────────────────────────────────────────────────┤
│  MCP LAYER (Streamable-HTTP)                    │
│  /mcp → arifOS kernel :8088                     │
│  /mcp → GEOX :8081, WEALTH :18082, WELL :18083 │
│  Canonical gateway: mcp.arif-fazil.com          │
├─────────────────────────────────────────────────┤
│  BOT LAYER (Raw content)                        │
│  llms.txt, humans.txt, robots.txt, sitemap.xml  │
│  AI bot bypass: raw .md for GPTBot/ClaudeBot    │
│  JSON-LD structured data                        │
├─────────────────────────────────────────────────┤
│  GOVERNANCE LAYER (Constitutional)              │
│  F1 AMANAH: every deploy is reversible          │
│  F2 TRUTH: evidence-labeled, no fabrication     │
│  F4 CLARITY: ΔS ≤ 0 on every output            │
│  F9 ANTI-HANTU: no consciousness claims         │
│  F11 AUDIT: every deploy leaves a receipt       │
│  F13 SOVEREIGN: domain/DNS changes gated        │
└─────────────────────────────────────────────────┘
```

### 5.4 The Anti-Entropy Deployment Rule

Every deploy must DECREASE entropy, not increase it:

1. **Before deploy:** `git status` — no uncommitted files
2. **During deploy:** Atomic swap (temp dir → mv)
3. **After deploy:** Health check (curl 200)
4. **Verify:** SITES.md matches Caddyfile matches live state

---

## 6. WHAT NOT TO DO

| Don't | Why | Instead |
|-------|-----|---------|
| Add new subdomains | F4 — max_top_level_sites: 5 | Add routes under existing surfaces |
| Bypass ARIF-SITES deploy | F1 — no atomic swap, no backup | Always use `deploy-site.sh` |
| Edit live Caddyfile directly | F11 — drift between repo and live | Edit repo, then sync |
| Hardcode API keys | F1 — secrets in source | Use Caddy reverse proxy |
| Skip SITES.md update | F2 — routing drift | Update SITES.md on every change |
| Create new design systems | F4 — entropy | Use tokens.css |
| Skip health checks | F2 — false confidence | Always curl after deploy |

---

## 7. QUICK REFERENCE (Cheat Sheet)

```bash
# Deploy single site
bash /root/ARIF-SITES/scripts/deploy-site.sh arif-fazil.com

# Deploy everything
bash /root/ARIF-SITES/deploy-vps.sh

# Health check all surfaces
for svc in arifos:8088 aforge:7071 aaa:3001 geox:8081 wealth:18082 well:18083; do
  n="${svc%%:*}"; p="${svc##*:}"
  curl -sf "http://localhost:$p/health" >/dev/null 2>&1 && echo "✅ $n :$p" || echo "❌ $n :$p"
done

# Check Caddy config validity
caddy validate --config /etc/caddy/Caddyfile --adapter caddyfile

# Sync repo Caddyfile to live
cp /root/ARIF-SITES/deploy/Caddyfile /etc/caddy/Caddyfile
caddy reload --config /etc/caddy/Caddyfile

# Check WebMCP tools on a page
curl -s https://arif-fazil.com/.well-known/webmcp.json | python3 -m json.tool

# Check MCP server card
curl -s https://arifos.arif-fazil.com/.well-known/mcp/server.json | python3 -m json.tool
```

---

*Forged: 2026-07-15 | Author: FORGE (000Ω) | Sovereign: Arif (F13)*
*DITEMPA BUKAN DIBERI*
