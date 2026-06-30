# WEALTH Subsite Architecture — Zen

> **Status:** LIVE + EVOLVING  
> **Last updated:** 2026-06-30

---

## Current Structure

```
arif-fazil.com/wealth/
│
├── [Landing] ──────────────────────────────────────
│   Daily Briefing page
│   → Live data from mcp.arif-fazil.com/briefing
│   → KLCI, USD/MYR, Brent, So-What analysis
│   → Constitutional acknowledgment gate
│   → WAW (Wealth-as-Wisdom) section
│
├── /wealth/article/:slug ──────────────────────────
│   English formal articles (WSJ-grade)
│   → Currently: expose-wsj (RM70B Question)
│   → Future: English investigative pieces
│
└── /wealth/makcikgpt/ ────────────────────────────
    BM Makcik voice articles
    → Landing: 3 cards (clickable)
    → /wealth/makcikgpt/cerita-makcik
    → /wealth/makcikgpt/siasatan-harakah
    → /wealth/makcikgpt/iran-hormuz
    → Future: daily auto-published briefs
```

## The Two Voices

| Voice | Audience | Language | Tone | Route |
|-------|----------|----------|------|-------|
| **WEALTH Formal** | Analysts, policymakers, journalists | EN | WSJ-grade, evidence-labeled | `/wealth/article/` |
| **MakcikGPT** | Rakyat, makcik-makcik, WhatsApp groups | BM | Warm, direct, jiran-friendly | `/wealth/makcikgpt/` |

Both voices cover the **same ground truth** — just different lenses.

## Data Flow

```
External signals (Reuters, BNM, BURSA, Al Jazeera)
    ↓
WEALTH engine (mcp.arif-fazil.com/briefing)
    ↓
┌───────────────────┬───────────────────┐
│                   │                   │
▼                   ▼                   ▼
Wealth.tsx          MakcikGPT           Essays
(daily briefing)    (BM translation)    (deep dives)
```

## Future: Daily Auto-Pipeline

```
Hermes 21:30 → WEALTH brief → MakcikGPT kernel → auto-publish → deploy
```

See: `forge_work/MAKCIKGPT-DAILY-PIPELINE.md`

---

## Design Principles

1. **One truth, two voices.** English formal + BM Makcik cover the same signals.
2. **Evidence-first.** Every claim has a source. No vibes.
3. **Jiran-friendly.** If makcik can't understand it, rewrite it.
4. **999 sealed.** Published articles are immutable. Corrections are new versions.
5. **Daily rhythm.** Brief at 21:30, MakcikGPT translation by 22:00.

---

*DITEMPA BUKAN DIBERI*
