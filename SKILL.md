# SKILL: arif-fazil-site — Site Management for All Agents

> **Load this skill** before any operation on the arif-fazil.com React site.
> Any agent (FORGE, OpenCode, Hermes, AUDITOR, PLAN) must read this before adding articles, editing routes, or deploying.
> **DITEMPA BUKAN DIBERI** — the web surface is forged, not given.

---

## 1. WHAT THIS IS

The flagship React site at `arif-fazil.com`, built with **React 19 + Vite 7 + TypeScript + Tailwind + Framer Motion**.

| Attribute | Value |
|-----------|-------|
| **Repo** | `/root/arif-sites` |
| **Site root** | `/root/arif-sites/sites/arif-fazil.com/` |
| **Build tool** | Vite 7 (`npm run build`) |
| **Deploy** | `./deploy-vps.sh` (rsync → Caddy → reload) |
| **Web root** | `/var/www/html/arif/` |
| **Domain** | `arif-fazil.com` (Caddy + Cloudflare Origin CA) |

---

## 2. ROUTE MAP (as of 2026-06-30)

```
/                              → Home (landing)
/000/                           → Genesis (federation origin)
/wealth/                        → WEALTH daily briefing (live data)
/wealth/article/:slug           → EN formal articles (WSJ-grade)
/wealth/makcikgpt/              → BM Makcik landing (cards)
/wealth/makcikgpt/:slug         → BM Makcik article pages
/discoveries/                   → Discoveries
/constellation/                 → Constellation
/canon/                         → Canon
/essays/                        → Essays landing
/essays/:slug                   → Individual essay
```

**Router:** `src/App.tsx` — React Router v6, all routes declared here.

---

## 3. THE TWO VOICES — ONE TRUTH

| Voice | Audience | Language | Tone | Route prefix |
|-------|----------|----------|------|--------------|
| **WEALTH Formal** | Analysts, journalists, policymakers | EN | WSJ-grade, evidence-labeled | `/wealth/article/` |
| **MakcikGPT** | Rakyat, makcik-makcik, WhatsApp groups | BM | Warm, direct, jiran-friendly | `/wealth/makcikgpt/` |

Both cover the same ground truth. MakcikGPT translates WEALTH signals into BM that a makcik at pasar malam can understand and forward on WhatsApp.

---

## 4. FILE STRUCTURE

```
sites/arif-fazil.com/
├── src/
│   ├── App.tsx                          — Router (ALL routes here)
│   ├── pages/
│   │   ├── Wealth.tsx                   — Daily briefing page
│   │   ├── WealthArticle.tsx            — EN article renderer
│   │   ├── MakcikGPT.tsx                — BM landing (cards)
│   │   ├── MakcikGptArticle.tsx         — BM article renderer
│   │   └── EssayPage.tsx                — Essay renderer (similar pattern)
│   ├── data/
│   │   ├── makcikgpt/                   — BM article modules
│   │   │   ├── types.ts                 — ArticleContent + MakcikArticleMeta
│   │   │   ├── index.ts                 — Registry (modules array + meta array + getters)
│   │   │   ├── cerita-makcik.ts         — Article 1
│   │   │   ├── siasatan-harakah.ts      — Article 2
│   │   │   └── iran-hormuz.ts           — Article 3
│   │   ├── wealth/                      — EN article modules
│   │   │   ├── types.ts                 — WealthArticleContent + WealthArticleMeta
│   │   │   ├── index.ts                 — Registry
│   │   │   └── expose-wsj.ts            — Article 1
│   │   └── essays.ts                    — Essays data
│   ├── components/                      — Shared UI (nav, footer, etc.)
│   └── styles/                          — Tailwind + custom CSS
├── public/                              — Static assets (copied to dist)
├── vite.config.ts                       — Vite config (@ alias → src/)
└── package.json
```

---

## 5. ADDING A MAKCIK ARTICLE (BM) — Step by Step

**This is the primary recipe. Follow exactly.**

### Step 1: Create the data module

Create `src/data/makcikgpt/<slug>.ts`:

```typescript
import type { ArticleContent } from './types';

const content: ArticleContent = {
  slug: 'my-article-slug',          // MUST match filename (minus .ts)
  html: `<h1>Tajuk Artikel</h1>
<p>Isi kandungan dalam Bahasa Makcik...</p>
<h2>Penutup</h2>
<p>...</p>`,                        // Raw HTML string
};

export default content;
```

**HTML rules:**
- Use raw HTML in template literal (backtick string)
- Tags allowed: h1, h2, h3, p, ul, ol, li, blockquote, strong, em, a, hr, table
- Links: `<a href="URL">text</a>` — use external sources as references
- Always end with a rujukan (references) section if citing sources
- Always close with `<em>DITEMPA BUKAN DIBERI</em>` footer

### Step 2: Register in index.ts

Edit `src/data/makcikgpt/index.ts`:

1. Add import at top:
```typescript
import myArticle from './my-article-slug';
```

2. Add to `makcikArticleModules` array:
```typescript
export const makcikArticleModules: ArticleContent[] = [
  ceritaMakcik,
  siasatanHarakah,
  iranHormuz,
  myArticle,                         // ADD HERE
];
```

3. Add metadata to `makcikArticlesMeta` array:
```typescript
{
  slug: 'my-article-slug',
  title: 'Tajuk Penuh Artikel',
  subtitle: 'Subtitle yang menarik untuk makcik-makcik',
  date: '2026-07-01',                // ISO date
  domain: 'MAKCIKGPT × TOPIC',      // e.g. MAKCIKGPT × PETRONAS
  language: 'ms',
  excerpt: 'Ringkasan 1-2 ayat untuk kad depan.',
  tags: ['petronas', 'topic', 'malaysia'],
  seal: '999',                       // Always 999 for sealed articles
},
```

### Step 3: NO route changes needed for articles

Routes are already registered in App.tsx:
```typescript
<Route path="/wealth/makcikgpt/:slug" element={<MakcikGptArticle />} />
```

The `:slug` param auto-resolves via `getMakcikArticle(slug)` in the page component. As long as the data module is registered, the article is live.

### Step 4: Build + Deploy

```bash
cd /root/arif-sites/sites/arif-fazil.com
npm run build                        # Verify clean build (no errors)
cd /root/arif-sites
./deploy-vps.sh                      # Build + rsync + Caddy reload
```

### Step 5: Verify

```bash
curl -sf https://arif-fazil.com/wealth/makcikgpt/my-article-slug | head -5
# Should return HTML, not 404
```

---

## 6. ADDING A WEALTH ARTICLE (EN) — Step by Step

Same pattern, different directory.

### Step 1: Create `src/data/wealth/<slug>.ts`

```typescript
import type { WealthArticleContent } from './types';

const content: WealthArticleContent = {
  slug: 'my-en-article',
  html: `<h1>Article Title</h1>
<p>WSJ-grade English content...</p>`,
};

export default content;
```

### Step 2: Register in `src/data/wealth/index.ts`

Same pattern as MakcikGPT — import + add to `wealthArticleModules` + add meta to `wealthArticlesMeta`.

### Step 3: No route changes needed

Route already exists: `/wealth/article/:slug` → `WealthArticle.tsx`

### Step 4–5: Build + Deploy + Verify (same as MakcikGPT)

---

## 7. BUILD & DEPLOY

### Single-command deploy (recommended)

```bash
cd /root/arif-sites && ./deploy-vps.sh
```

This does: npm build → rsync shared assets → rsync all sites → chown → Caddy reload.

### Build-only (no deploy)

```bash
cd /root/arif-sites/sites/arif-fazil.com && npm run build
```

### Deploy without rebuild

```bash
cd /root/arif-sites && rsync -avz --delete sites/arif-fazil.com/dist/ /var/www/html/arif/
caddy reload --config /etc/caddy/Caddyfile
```

### Verify deployment

```bash
# Check the SPA returns HTML (React loads client-side)
curl -sf https://arif-fazil.com/ | grep -o '<title>[^<]*</title>'
# Should return: <title>Arif Fazil — Exploration Geoscientist, Offshore Malaysia</title>
```

---

## 8. CONVENTIONS

### Slug naming
- **Kebab-case**, lowercase: `iran-hormuz`, `expose-wsj`, `cerita-makcik`
- Matches filename in `src/data/<collection>/<slug>.ts`
- Used directly in URL path

### Tags
- Always lowercase, single words: `petronas`, `sarawak`, `gas`
- Max 8 tags per article
- Used for display + future search/filter

### Seal
- Always `'999'` for published articles (999_SEAL = immutable record)
- Displayed as badge in article header

### Domain badge
- Format: `COLLECTION × TOPIC`
- MakcikGPT: `MAKCIKGPT × PETRONAS`, `MAKCIKGPT × HORMUZ`
- WEALTH EN: `SEARAH × PETROS`, `WEALTH × INVESTIGATION`

### Language
- MakcikGPT: `'ms'` (Bahasa Malaysia / Bahasa Makcik)
- WEALTH: `'en'` (English)
- Bilingual: `'bilingual'` (rare)

### Article HTML conventions
- MakcikGPT: Start with `<h1>`, include `<blockquote>` hook, end with rujukan + DITEMPA footer
- WEALTH EN: Start with `<h1>`, evidence-labeled claims, end with sources

---

## 9. DAILY PIPELINE (scaffolded — Phase 1 next)

```
Hermes 21:30 → /data/wealth/latest.json → WEALTH engine → MakcikGPT kernel → auto-publish
```

**Architecture doc:** `/root/arif-sites/forge_work/MAKCIKGPT-DAILY-PIPELINE.md`
**Future script:** `/root/arif-sites/scripts/makcikgpt-daily-publish.py` (not yet built)

**Pipeline phases:**
1. **Hermes Malam Brief** (21:30 UTC+8) — generates raw data
2. **WEALTH engine** — processes signals, computes scores
3. **MakcikGPT kernel** — translates to BM Makcik voice (DITING ≥ 1.5, SABAR cooling)
4. **Script** — writes TS module + updates index + builds + deploys

When building Phase 1 script, follow the **Step 1–2 of adding MakcikGPT article** above. The script generates the data module and registers it programmatically.

---

## 10. OTHER SUBSITES

The arif-sites repo also hosts static subsites (NOT part of the React site):

| Subsite | Path | Type | Update method |
|---------|------|------|---------------|
| `aaa.arif-fazil.com` | `sites/aaa.arif-fazil.com/` | Static HTML | Edit HTML directly |
| `arifos.arif-fazil.com` | `sites/arifos.arif-fazil.com/` | Static docs | Edit HTML directly |
| `arifosmcp.arif-fazil.com` | `sites/arifosmcp.arif-fazil.com/` | Static docs | Edit HTML directly |
| `geox.arif-fazil.com` | `sites/geox.arif-fazil.com/` | Static lab GUI | Edit HTML directly |
| `wiki.arif-fazil.com` | `sites/wiki.arif-fazil.com/` | Static wiki | Edit HTML directly |
| `makcikgpt.arif-fazil.com` | `sites/makcikgpt.arif-fazil.com/` | Static HTML | Edit HTML directly |

These are synced by `./deploy-vps.sh` — no build step required.

---

## 11. CONSTITUTIONAL GUARDS

| Floor | Applies to | How |
|-------|-----------|-----|
| F1 AMANAH | All edits | Git-tracked, reversible |
| F2 TRUTH | Article content | Evidence-labeled OBS/DER/INT/SPEC |
| F4 CLARITY | Site structure | Two voices, clear routing |
| F6 MARUAH | Article naming | Names only with public-record evidence |
| F9 ANTI-HANTU | No consciousness claims | MakcikGPT is a kernel, not a person |
| F11 AUDIT | All deploys | Receipt in forge_work/ |
| F13 SOVEREIGN | Domain/DNS changes | 888_HOLD required |

---

## 12. QUICK REFERENCE CHEAT SHEET

```bash
# Add MakcikGPT article:
# 1. Create: src/data/makcikgpt/<slug>.ts
# 2. Register: import + add to index.ts (modules + meta)
# 3. Build: npm run build
# 4. Deploy: cd /root/arif-sites && ./deploy-vps.sh

# Add WEALTH EN article:
# 1. Create: src/data/wealth/<slug>.ts
# 2. Register: import + add to index.ts
# 3. Build + Deploy as above

# Check live:
curl -sf https://arif-fazil.com/wealth/makcikgpt/<slug> | head -5

# Architecture docs:
# /root/arif-sites/forge_work/WEALTH-SUBSITE-ZEN.md
# /root/arif-sites/forge_work/MAKCIKGPT-DAILY-PIPELINE.md
# /root/arif-sites/forge_work/2026-06-30-makcikgpt-session-seal.md
```

---

*Created: 2026-06-30 · Author: FORGE (000Ω) · Sovereign: Arif (F13)*
*DITEMPA BUKAN DIBERI*
