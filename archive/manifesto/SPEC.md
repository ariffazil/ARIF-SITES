# arif-sites — Intelligence Layer + Navigation SPEC
> Ditempa Bukan Diberi · v2 · Status: SEALED
> Phase 2 complete, Phase 3+ pending

---

## CONFIRMED FACTS (2026-04-04 17:32 UTC)

| Site | llms.txt | sitemap | robots | A2A card | Nav |
|------|---|---|---|---|---|
| arif-fazil.com | ✅ 200 | ✅ | ✅ | ✅ | ✅ footer nav |
| aaa.arif-fazil.com | ✅ 200 | ✅ | ✅ | ✅ | ✅ footer nav |
| arifOS.arif-fazil.com | ✅ 200 | ✅ | ✅ | ✅ | ✅ footer nav |
| forge.arif-fazil.com | ✅ 200 | ✅ | ✅ | ✅ | ✅ footer nav |
| geox.arif-fazil.com | ✅ 200 | ✅ | ✅ | pending | ✅ |
| apex.arif-fazil.com | ✅ proxied | ✅ proxied | ✅ | pending | ✅ |

**A2A cards:** arifOS.arif-fazil.com + forge/arifOS routing confirmed working (CNAME → VPS nginx → arifOS SPA)
**A2A card:** arifOS subdomain routing verified working (nginx `server_name arifOS.arif-fazil.com`)
**Deploy system:** `bash deploy.sh` works end-to-end

---

## OPEN QUESTIONS

1. **A2A card on geox:** pending
2. **apex 301 from CF Pages edge:** awaiting CF Dashboard action (Arif confirmed)
3. **specs/ page:** live at /specs/ but not yet linked from site nav

---

## SEALED INDEXING SPEC

### Robots.txt Rules Per Site

Every site gets `robots.txt` at root:

```
User-agent: *
Allow: /

# Machine files — ALWAYS allowed
Allow: /llms.txt
Allow: /sitemap.xml
Allow: /page.json
Allow: /.well-known/agent.json

# No disallow for any public content
Sitemap: https://{site}/sitemap.xml
```

### Sitemap Strategy

Canonical sitemap lives at VPS root — submitted to Google Search Console + Bing Webmaster. No index sitemap needed (6 sites only). Each sitemap entry uses absolute canonical URLs.

### Sitemap Entries

All 6 sites + all machine files. Format: priority 0.8–1.0, changefreq monthly.

### Search Console Submission

Once apex is live:
1. Google Search Console → URL Inspection → submit https://arif-fazil.com/ + 5 subdomains
2. Bing Webmaster Tools → Add site → Sitemap auto-discovery

---

## SEALED NAVIGATION + TEMPLATE SPEC

### Cross-Site Link Map

```
Ring 1 (arif-fazil.com)
  → links to: arifOS (Ring 2), aaa (Ring 3), forge, geox
  ← linked from: arifOS, aaa, forge, geox, apex

Ring 2 (arifOS.arif-fazil.com)
  → links to: arif (Ring 1), aaa (Ring 3), forge, geox
  ← linked from: arif, aaa, forge, geox, apex

Ring 3 (aaa.arif-fazil.com)
  → links to: arifOS (Ring 2), forge, geox
  ← linked from: arif, arifOS, forge, geox

Forge Portal
  → links to: all 4 rings + geox
  ← linked from: arif, arifOS, aaa, apex

APEX Theory
  → links to: arifOS Ring 2
  ← linked from: arif, arifOS, aaa, forge, geox

GEOX Earth
  → links to: aaa (Ring 3), arifOS, arif
  ← linked from: arif, arifOS, aaa, forge
```

### Navigation Footer Template (ALL sites)

```
[arifOS Estate] | [Ring 1 THE SOUL] | [Ring 2 THE MIND] | [Ring 3 THE BODY]
[Forge] | [GEOX Earth] | [APEX] | [Machine Files]
```

### Page Title Format

`{Page Name} · {Site} | arifOS`
Exceptions: Root SPA pages use `{Page Name} | arifOS`

### Breadcrumb Rules

Home > Ring > Section > Page — Use JSON-LD or microdata.

### Structured Data

Use `<link rel="canonical">` on every page.
Use `<meta name="robots" content="index, follow">` on all pages.
JSON-LD for geox datasets only (NOT generic pages).

---

## SEALED MACHINE CONTEXT SPEC

### llms.txt Rules

Each site gets its own llms.txt — sparse, factual, links to canonical URLs. Format: markdown, human-first.
llms.txt is NOT a sitemap — do NOT list every page. List only high-value entry points.

### page.json Per Site

Metadata: name, ring, canonical_url, machine_summary, human_summary, webmcp (yes/no), a2a (yes/no), linked_sites.

### WebMCP Rules

WebMCP only on:
- aaa.arif-fazil.com (MCP tools)
- geox.arif-fazil.com (earth data resources)

Never on: arif-fazil.com, arifOS.arif-fazil.com, forge, apex

### A2A Card Rules

Every site needs agent.json if it exposes a public endpoint.
geox.arif-fazil.com needs agent.json even as science-only site.
apex needs agent.json only if it exposes /api or /agent endpoint.

---

## SEALED IMPLEMENTATION TASKLIST

### Phase 3 — SEO + Indexing

| Task | Site | Reversible | 888 HOLD | Check |
|------|------|---|---|---|
| Submit to Google Search Console | All | N | NO | console.google.com |
| Submit to Bing Webmaster | All | N | NO | bing.com/webmaster |
| Add canonical links to all pages | arif | Y | NO | curl |
| Add JSON-LD breadcrumb schema | arifOS | Y | NO | curl |
| Validate sitemap.xml format | All | N | NO | sitemap validator |
| Verify robots.txt coverage | All | N | NO | curl |

### Phase 4 — Cross-Link Audit

| Task | Site | Reversible | 888 HOLD | Check |
|------|------|---|---|---|
| Verify all cross-links 200 | All | N | NO | curl -I |
| Add geox agent.json | geox | Y | NO | curl |
| Add apex agent.json (if API) | apex | Y | NO | curl |
| Check sXO Auth for A2A | arifOS | N | NO | web search |

### Phase 5 — Machine Readability

| Task | Site | Reversible | 888 HOLD | Check |
|------|------|---|---|---|
| Add llms.txt to apex (if missing) | apex | Y | NO | curl |
| Add llms.txt to geox (if missing) | geox | Y | NO | curl |
| Add page.json to apex | apex | Y | NO | curl |
| Add page.json to geox | geox | Y | NO | curl |

---

## 888 HOLD REGISTER

| Action | Why HOLD | Arif Action |
|--------|----------|-------------|
| Delete any public page | Irreversible | Confirm first |
| Change canonical domain | URL structure breaks | CF Dashboard |
| Remove cross-links | Navigation breaks | Confirm first |
| Publish new A2A endpoint | Security exposure | Review first |
| WebMCP on new site | Tool registry change | Confirm first |
| Modify sitemap priority | SEO impact | Review first |

---

Last sealed: 2026-04-04 · Confidence: HIGH · Uncertainty: LOW · Ω < 0.03

---

## 2026-04-05 — Phase 4: Unified Path Architecture

### Target Architecture
All submodules under `arif-fazil.com/(submodule)`:
```
arif-fazil.com/           → Ring 1 THE SOUL (SPA)
arif-fazil.com/aaa/       → Ring 3 THE BODY
arif-fazil.com/arifOS/    → Ring 2 THE MIND
arif-fazil.com/forge/     → Trinity Portal
arif-fazil.com/geox/      → Earth Physics
arif-fazil.com/apex/      → APEX Theory
```

### VPS Nginx Config (unified)
Written to: `/opt/arifos/sites/arifOS-FAZIL.COM/nginx.conf`
- `server_name _` catch-all → unified path routing
- `alias` directives for each `/path/` → correct site root
- `proxy_pass` for geox → Python app on port 8000

### Status: PENDING VPS REBOOT
- Nginx config updated ✅
- Container overlay caching old config ❌
- Requires VPS reboot to clear overlay and load new config
- Subdomains still work as fallback

### Pending Actions
1. [VPS] Reboot to clear overlay cache
2. [DNS] Update subdomains to point to arif-fazil.com paths (or retire)
3. [CF Pages] Update custom domains or retire
4. [Deploy] Update deploy.sh to deploy all sites to unified path structure
