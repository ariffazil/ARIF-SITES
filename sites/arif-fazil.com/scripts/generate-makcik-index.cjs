#!/usr/bin/env node
/**
 * generate-makcik-index.cjs — MakcikGPT article index (markdown surface)
 *
 * Renders public/makcikgpt-md/index.html from the single source of truth:
 * src/data/essays.json, via scripts/lib/makcik-source.cjs.
 *
 * The /makcikgpt-md/ directory is the "agentic web optimization" surface
 * — its .md siblings are bot-bypass payloads for AI crawlers, and this
 * index.html is the canonical entry that lists every piece in the order
 * they appear in /makcikgpt/.
 *
 * Single Source of Truth rule (F4 CLARITY):
 *   - essays.json → scripts/lib/makcik-source.cjs → makcikgpt-md/index.html
 *
 * Run from site root:  node scripts/generate-makcik-index.cjs
 * Output:              public/makcikgpt-md/index.html
 */

const fs = require("fs");
const path = require("path");
const {
  getMakcikSource,
  SITE_ROOT,
} = require("./lib/makcik-source.cjs");

const OUT_PATH = path.join(SITE_ROOT, "public/makcikgpt-md/index.html");
const SITE_BASE = "https://arif-fazil.com";

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function dateParts(iso) {
  const [y, m, d] = iso.split("-");
  return { y, m, d };
}

// Series metadata — single source of truth for the chips at the top of the TOC.
// (Cognitive-flow improvement 2026-07-29 — series grouping + filter chips.)
const SERIES_META = {
  M1: { label: "Energy",             emoji: "⚡", topic: "PETRONAS, oil, gas, rightsizing" },
  M2: { label: "Governance",         emoji: "🏛", topic: "Sarawak gas, SEARAH, Bernama, sovereignty" },
  M3: { label: "Tech & Sovereignty", emoji: "🛡", topic: "YTL, ILMU, AI, monopoli" },
  M4: { label: "Economy",            emoji: "📈", topic: "Johor, daily prices, rakyat" },
  M5: { label: "Politics",           emoji: "🗳", topic: "DAP, Anwar, Loke, Sam Altman" },
};

function buildIndexHtml(pieces) {
  const today = new Date().toISOString().slice(0, 10);
  const presentSeries = Array.from(new Set(pieces.map((p) => p.series.id))).sort();

  // Flat list — kept for backwards compatibility & feed parity.
  const listItems = pieces
    .map((p) => {
      const { y, m, d } = dateParts(p.date);
      return `    <li><a href="${escapeHtml(p.dest.path)}">${escapeHtml(p.title)}</a> <span class="date">— Series ${escapeHtml(p.series.id)}#${escapeHtml(p.series.n)}, ${y}-${m}-${d}${p.seal ? ` · seal ${escapeHtml(p.seal)}` : ""}</span></li>`;
    })
    .join("\n");

  // Grouped list — sections per series, newest first within each.
  const grouped = pieces.reduce((acc, p) => {
    (acc[p.series.id] ||= []).push(p);
    return acc;
  }, {});
  const sectionsHtml = presentSeries
    .map((sid) => {
      const meta = SERIES_META[sid] || { label: sid, emoji: "📰", topic: "" };
      const items = grouped[sid]
        .map((p) => {
          const { y, m, d } = dateParts(p.date);
          return `      <li><a href="${escapeHtml(p.dest.path)}">${escapeHtml(p.title)}</a> <span class="date">${y}-${m}-${d}${p.seal ? ` · seal ${escapeHtml(p.seal)}` : ""}</span></li>`;
        })
        .join("\n");
      return `    <details class="zen-reveal" open id="series-${escapeHtml(sid)}">
      <summary><span class="series-emoji">${meta.emoji}</span> <strong>Series ${escapeHtml(sid)} — ${escapeHtml(meta.label)}</strong> <span class="series-count">(${grouped[sid].length} ${grouped[sid].length === 1 ? "article" : "articles"})</span></summary>
      <p class="series-topic">${escapeHtml(meta.topic)}</p>
      <ul class="series-list">
${items}
      </ul>
    </details>`;
    })
    .join("\n");

  // Series filter chips — anchor links to each section's id.
  const chipsHtml = presentSeries
    .map((sid) => {
      const meta = SERIES_META[sid] || { label: sid, emoji: "📰" };
      return `  <a class="chip" href="#series-${escapeHtml(sid)}">${meta.emoji} ${escapeHtml(sid)} ${escapeHtml(meta.label)}</a>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MakcikGPT — Civic Intelligence in Bahasa Makcik | arif-fazil.com</title>
<meta name="description" content="Civic journalism in Bahasa Makcik. ${pieces.length} canonical articles on Malaysian sovereignty, resource governance, institutional integrity, and technology accountability.">
<link rel="canonical" href="${SITE_BASE}/makcikgpt/">
<style>
  body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; background: #0d1117; color: #c9d1d9; }
  h1 { color: #58a6ff; border-bottom: 1px solid #30363d; padding-bottom: 0.5rem; }

  /* Zen Pulse — 3-second pattern (AGENTS.md §14.3) */
  .zen-pulse { display: flex; flex-wrap: wrap; gap: 0.75rem; padding: 0.75rem; margin: 1rem 0; background: #161b22; border: 1px solid #30363d; border-radius: 8px; font-size: 0.85rem; }
  .zen-pulse .zp-item { display: flex; flex-direction: column; gap: 0.15rem; min-width: 180px; flex: 1 1 180px; }
  .zen-pulse .zp-ask { color: #6e7681; text-transform: uppercase; letter-spacing: 1px; font-size: 0.65rem; }
  .zen-pulse .zp-val { color: #c9d1d9; }
  .zen-pulse .zp-val.gold { color: #ffd700; }

  /* Series filter chips */
  .chips { display: flex; flex-wrap: wrap; gap: 0.5rem; margin: 1.25rem 0 0.5rem; }
  .chip { display: inline-block; padding: 0.35rem 0.75rem; border: 1px solid #30363d; border-radius: 999px; background: #161b22; color: #58a6ff; font-size: 0.8rem; text-decoration: none; }
  .chip:hover { border-color: #58a6ff; text-decoration: none; }

  /* Series sections — collapsible <details> */
  .zen-reveal { margin: 0.75rem 0; padding: 0.5rem 0.75rem; background: #0d1117; border-left: 2px solid #30363d; border-radius: 4px; }
  .zen-reveal summary { cursor: pointer; color: #c9d1d9; padding: 0.25rem 0; }
  .zen-reveal summary:hover { color: #58a6ff; }
  .series-emoji { font-size: 1.05rem; margin-right: 0.25rem; }
  .series-count { color: #6e7681; font-size: 0.8rem; font-weight: normal; }
  .series-topic { color: #8b949e; font-size: 0.85rem; font-style: italic; margin: 0.5rem 0 0.25rem; }
  .series-list { list-style: none; padding: 0; margin: 0.25rem 0 0; }
  .series-list li { margin: 0.4rem 0; padding: 0.25rem 0; border-bottom: 1px solid #21262d; font-size: 0.92rem; }

  a { color: #58a6ff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .date { color: #8b949e; font-size: 0.85rem; }
  .meta { color: #6e7681; font-size: 0.8rem; margin-top: 2rem; }

  /* Flat list (legacy / feed parity) — hidden by default; surfaced for RSS readers */
  .flat-list { display: none; }
</style>
</head>
<body>

<!-- Top cognitive anchor — back to sovereign surface -->
<nav aria-label="Breadcrumb" style="font-size: 0.85rem; padding: 0.5rem 0;">
  <a href="/">← arif-fazil.com</a> &middot; <a href="/world/">/world/</a> &middot; <strong>MakcikGPT</strong>
</nav>

<h1>🌍 MakcikGPT — Civic Intelligence</h1>
<p>Civic journalism in Bahasa Makcik. Malaysian sovereignty, resource governance, institutional integrity, and technology accountability.</p>
<p>Canonical landing: <a href="/makcikgpt/">/makcikgpt/</a> · ${pieces.length} articles · updated ${escapeHtml(today)}</p>

<!-- ZEN PULSE — answers 3 questions in 3 seconds. Required by AGENTS.md §14.3. -->
<aside class="zen-pulse" aria-label="Sacred navigation">
  <div class="zp-item">
    <span class="zp-ask">Where am I?</span>
    <span class="zp-val">MakcikGPT · Civic Intelligence</span>
  </div>
  <div class="zp-item">
    <span class="zp-ask">Why care?</span>
    <span class="zp-val gold">Civic journalism in Bahasa Makcik · seal 999</span>
  </div>
  <div class="zp-item">
    <span class="zp-ask">What next?</span>
    <span class="zp-val">Pick a series · read the latest article</span>
  </div>
</aside>

<!-- SERIES FILTER — verb-led, not noun-led -->
<nav class="chips" aria-label="Filter by series">
${chipsHtml}
</nav>

<!-- GROUPED LIST — collapsible by series (verbs > nouns) -->
<section>
${sectionsHtml}
</section>

<!-- FLAT LIST — kept for parity with feed readers / RSS / llms.txt crawlers -->
<ul class="flat-list" aria-hidden="true">
${listItems}
</ul>

<p class="meta">Source of truth: <code>src/data/essays.json</code>. Rendered by <code>scripts/generate-makcik-index.cjs</code>. <em>Ditempa bukan diberi.</em></p>
</body>
</html>
`;
}

function main() {
  const { pieces } = getMakcikSource();
  const html = buildIndexHtml(pieces);
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, html, "utf8");
  console.log(`✓ Wrote ${pieces.length} entries → ${path.relative(SITE_ROOT, OUT_PATH)}`);
}

main();
