# MAKCIKGPT PUBLISH SESSION — Init Prompt

> **Next OpenCode session: read this file first.**

## Context

MakcikGPT is scaffolded at `https://arif-fazil.com/wealth/makcikgpt/`. Route works. Footer link works. Page renders 3 article cards with excerpts and tags. But the cards currently say "Full text on disk →" because the article HTML content hasn't been embedded into the SPA yet.

## What's Done

- [x] `/wealth/makcikgpt` route in App.tsx
- [x] `src/data/makcikgpt.ts` — 3 articles with metadata
- [x] `src/pages/MakcikGPT.tsx` — page component (hero + article cards + constitutional floor)
- [x] Footer link added (arifOS Federation section)
- [x] Build + deploy live

## What's Needed

### Priority 1: Embed article content

The 3 source files are on disk:

1. **Cerita Makcik** (Bahasa): `/root/searah-forge-2026-06-07/v2.1/SEARAH-CERITA-MAKCIK-v2.3-2026-06-07.md`
2. **Expose WSJ** (English): `/root/searah-forge-2026-06-07/v2.1/SEARAH-EXPOSE-WSJ-v2.3-2026-06-07.md`
3. **Siasatan Harakah** (Bahasa): `/root/searah-forge-2026-06-07/v2.1/SEARAH-SIASATAN-HARAKAH-v2.3-2026-06-07.md`

**Task:** Convert each MD to HTML and embed into the page component (like the essays pattern). Either:
- Option A: Create individual article pages at `/wealth/makcikgpt/:slug` (like EssayPage.tsx pattern)
- Option B: Embed full HTML inline on the MakcikGPT page with expand/scroll

**Preferred:** Option A — individual pages. Pattern already exists in `src/pages/EssayPage.tsx`.

### Priority 2: Additional content (if ready)

Arif mentioned these are also available:
- "Bila Amanah PETRONAS Dikhianati" — Lembaga Pengarah, PETROS gas Sarawak, VSS/MSS ~5,000
- "Dulu Permata Bursa, Kini Retak" — PCHEM rugi RM1.03B, impairment Perstorp, rightsizing ~5,000
- Harakah article — pending full OCR

These should be added to `makcikgpt.ts` as new entries.

### Priority 3: MakcikGPT landing page polish

- Add a "MakcikGPT" link to the main nav (optional — Arif may prefer footer-only)
- Add structured data (schema.org) for the articles
- Consider adding a `get_makcikgpt_articles` WebMCP tool (like essays)

## Key Files

| File | Purpose |
|------|---------|
| `src/data/makcikgpt.ts` | Article metadata |
| `src/pages/MakcikGPT.tsx` | Page component |
| `src/App.tsx` | Routes (already has /wealth/makcikgpt) |
| `src/data/siteContent.ts` | Footer links (already has MakcikGPT) |
| `/root/searah-forge-2026-06-07/v2.1/` | Source MD files |

## Build & Deploy

```bash
cd /root/arif-sites/sites/arif-fazil.com && npm run build
cd /root/arif-sites && ./deploy-vps.sh
```

## Constitutional

- F1 AMANAH: Backup before edit. All changes reversible.
- F2 TRUTH: Source content is 999-sealed. Do not modify article text.
- F4 CLARITY: Keep the page clean. No clutter.
- F11 AUDIT: Log changes to forge_work/.

---

*DITEMPA BUKAN DIBERI — Scaffold sealed 2026-06-30*
