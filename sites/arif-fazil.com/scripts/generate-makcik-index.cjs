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
 * they appear in /world/makcikgpt/.
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

function buildIndexHtml(pieces) {
  const today = new Date().toISOString().slice(0, 10);
  const listItems = pieces
    .map((p) => {
      const { y, m, d } = dateParts(p.date);
      // Use the canonical dest.path verbatim — it already lives under
      // /world/makcikgpt/<slug> (the helper enforces this prefix).
      return `    <li><a href="${escapeHtml(p.dest.path)}">${escapeHtml(p.title)}</a> <span class="date">— Series ${escapeHtml(p.series.id)}#${escapeHtml(p.series.n)}, ${y}-${m}-${d}${p.seal ? ` · seal ${escapeHtml(p.seal)}` : ""}</span></li>`;
    })
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>MakcikGPT — Civic Intelligence in Bahasa Makcik | arif-fazil.com</title>
<meta name="description" content="Civic journalism in Bahasa Makcik. ${pieces.length} canonical articles on Malaysian sovereignty, resource governance, institutional integrity, and technology accountability.">
<link rel="canonical" href="${SITE_BASE}/world/makcikgpt/">
<style>
  body { font-family: system-ui, sans-serif; max-width: 720px; margin: 2rem auto; padding: 0 1rem; line-height: 1.6; background: #0d1117; color: #c9d1d9; }
  h1 { color: #58a6ff; border-bottom: 1px solid #30363d; padding-bottom: 0.5rem; }
  a { color: #58a6ff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  ul { list-style: none; padding: 0; }
  li { margin: 0.75rem 0; padding: 0.5rem 0; border-bottom: 1px solid #21262d; }
  .date { color: #8b949e; font-size: 0.85rem; }
  .meta { color: #6e7681; font-size: 0.8rem; margin-top: 2rem; }
</style>
</head>
<body>
<h1>🌍 MakcikGPT — Civic Intelligence</h1>
<p>Civic journalism in Bahasa Makcik. Malaysian sovereignty, resource governance, institutional integrity, and technology accountability.</p>
<p>Canonical landing: <a href="/world/makcikgpt/">/world/makcikgpt/</a> &middot; ${pieces.length} articles &middot; updated ${escapeHtml(today)}</p>
<ul>
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