# PIPELINE: Daily MakcikGPT Publication

> **Status:** SCAFFOLD — not yet implemented  
> **Owner:** FORGE + Hermes  
> **Created:** 2026-06-30

---

## The Problem

Hermes generates a daily capital briefing at 21:30 UTC+8. It contains:
- BURSA KLCI data
- FX rates (USD/MYR)
- Brent crude price
- Political/social signals
- So-what analysis (Δ → Ω → Ξ → Ψ)

But this briefing is **English-only, data-dense, and technical**. The makcik-makcik at WhatsApp groups can't read it.

## The Pipeline

```
┌─────────────────────────────────────────────────────────────┐
│  HERMES MALAM BRIEF (21:30 UTC+8)                          │
│  → /data/wealth/latest.json                                │
│  → mcp.arif-fazil.com/briefing                             │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  WEALTH ENGINE                                              │
│  → Processes raw signals                                    │
│  → Computes ΔS, Peace², DITING scores                      │
│  → Identifies top 3 signals for rakyat                     │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  MAKCIKGPT KERNEL (DITING + SABAR)                         │
│  → Translates signals to BM Makcik voice                   │
│  → Applies SABAR cooling (no fearmongering)                │
│  → Scores DITING (cultural safety ≥ 1.5)                   │
│  → Generates article with:                                 │
│     - Hook (apa jadi kat duit kita?)                       │
│     - 3 key signals (simple BM)                            │
│     - Makcik commentary (warm, direct)                     │
│     - Call to action (tanya ahli parlimen)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────┐
│  AUTO-PUBLISH                                               │
│  → Write TS module: src/data/makcikgpt/daily-YYYY-MM-DD.ts │
│  → Update index.ts (add to modules + meta)                 │
│  → npm run build                                           │
│  → ./deploy-vps.sh                                         │
│  → Card appears on /wealth/makcikgpt/                      │
└─────────────────────────────────────────────────────────────┘
```

## Implementation (TODO)

### Phase 1: Script (A-FORGE)
- [ ] `scripts/makcikgpt-daily-publish.py`
- [ ] Reads `/data/wealth/latest.json`
- [ ] Calls MakcikGPT kernel for BM translation
- [ ] Writes TS module + updates index
- [ ] Triggers build + deploy

### Phase 2: Cron (Hermes)
- [ ] Add to Hermes cron: after daily brief generation, trigger makcikgpt publish
- [ ] Or: separate cron at 22:00 UTC+8 (30 min after brief)

### Phase 3: Quality Gate
- [ ] DITING score check (cultural safety ≥ 1.5)
- [ ] SABAR cooling check (no fearmongering)
- [ ] Human review flag for first week

## Article Template

```typescript
// src/data/makcikgpt/daily-2026-06-30.ts
import type { ArticleContent } from './types';

const content: ArticleContent = {
  slug: 'daily-2026-06-30',
  html: `
    <h1>MakcikGPT Harian: [Tajuk Signal Utama]</h1>
    <p class="lead">[Hook — 1 ayat, BM makcik]</p>
    
    <h2>Apa Yang Makcik Nampak Hari Ni</h2>
    <ol>
      <li><strong>[Signal 1]</strong> — [penjelasan ringkas]</li>
      <li><strong>[Signal 2]</strong> — [penjelasan ringkas]</li>
      <li><strong>[Signal 3]</strong> — [penjelasan ringkas]</li>
    </ol>
    
    <h2>Kata Makcik</h2>
    <p>[Commentary — warm, direct, no fearmongering]</p>
    
    <h2>Apa Yang Hang Boleh Buat</h2>
    <ul>
      <li>[Action 1]</li>
      <li>[Action 2]</li>
    </ul>
    
    <p class="footer">DITEMPA BUKAN DIBERI — MakcikGPT bersuara untuk rakyat.</p>
  `,
};

export default content;
```

---

*Next: Implement Phase 1 script. DITEMPA BUKAN DIBERI.*
