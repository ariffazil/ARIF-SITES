#!/usr/bin/env node
/**
 * render-words-essays.cjs — Generate /words/writing/ landing only.
 *
 * Per-essay HTML is rendered by the React SPA EssayPage (src/pages/EssayPage.tsx)
 * which provides the proper hero, tag pills, claim register, and Direct Publication
 * CTA — design language mirrors MakcikGPT. Caddy @agent_shells + @writing_spa
 * rewrite /words/writing/<slug>/ → SPA shell → EssayPage resolves the slug.
 *
 * This script's job: produce the listing surface only.
 *   - public/words/writing/index.html   (zen GitHub index, collapsible details)
 *   - public/words/writing/index.json   (machine-readable index, llms.txt parity)
 *   - public/words/writing.llms.txt     (compact LLM discoverability surface)
 *
 * Run from site root:  node scripts/render-words-essays.cjs
 */

const fs = require("fs");
const path = require("path");

const SITE_ROOT = path.resolve(__dirname, "..");
const ARTICLES_JSON = path.join(SITE_ROOT, "src/data/essays/articles.json");
const ESSAYS_TS_DIR = path.join(SITE_ROOT, "src/data/essays");
const OUT_DIR = path.join(SITE_ROOT, "public/words/writing");
const SITE_BASE = "https://arif-fazil.com";

const TODAY = new Date().toISOString().slice(0, 10);

/* ── utilities ─────────────────────────────────────────────────────────── */

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function extractHtmlField(text) {
  const m = text.match(/html:\s*`([\s\S]*?)`\s*,\s*\n\};/);
  if (!m) return "";
  return m[1];
}

/* ── load essay sources ───────────────────────────────────────────────── */

function loadEssaysFromTs() {
  const files = fs
    .readdirSync(ESSAYS_TS_DIR)
    .filter((f) => f.endsWith(".ts") && !f.startsWith("generated") && f !== "types.ts" && f !== "index.ts");
  files.sort((a, b) => a.length - b.length || a.localeCompare(b));

  const bySlug = new Map();
  for (const f of files) {
    const text = fs.readFileSync(path.join(ESSAYS_TS_DIR, f), "utf8");
    const titleM = text.match(/title:\s*`([^`]+)`/);
    const dateM = text.match(/date:\s*['"]([^'"]+)['"]/);
    const slugM = text.match(/slug:\s*['"]([^'"]+)['"]/);
    const excerptM = text.match(/excerpt:\s*`([^`]+)`/);

    const html = extractHtmlField(text);
    if (!html || html.length < 200) continue;
    if (!/isDirectPublication:\s*true/.test(text)) continue;
    if (!titleM || !slugM) continue;
    const slug = slugM[1];
    if (bySlug.has(slug)) continue;

    bySlug.set(slug, {
      title: titleM[1],
      date: dateM ? dateM[1] : TODAY,
      slug,
      excerpt: excerptM ? excerptM[1] : "",
      html,
    });
  }
  return bySlug;
}

function loadArticlesJson() {
  const raw = fs.readFileSync(ARTICLES_JSON, "utf8");
  const jsonText = raw.startsWith("[") ? raw : raw.slice(raw.indexOf("\n") + 1);
  return JSON.parse(jsonText);
}

/* ── top-level index.html (zen GitHub, mirrors MakcikGPT design) ──────── */

function buildIndexHtml(items) {
  const list = items.map((it) => `      <li><a href="/words/writing/${escapeHtml(it.slug)}">${escapeHtml(it.title)}</a> <span class="date">${escapeHtml(it.date)} · seal 999 · INT</span></li>`).join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Writing — Constitutional Essays · arif-fazil.com</title>
<meta name="description" content="Sovereign reading room — long-form essays by Muhammad Arif bin Fazil on AI governance, institutions, and the path to AGI.">
<link rel="canonical" href="${SITE_BASE}/words/writing/">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif; max-width: 740px; margin: 2rem auto; padding: 0 1.25rem; line-height: 1.65; background: #0d1117; color: #c9d1d9; }
  h1 { color: #58a6ff; border-bottom: 1px solid #30363d; padding-bottom: 0.5rem; font-size: 1.85rem; }
  h2 { color: #58a6ff; border-bottom: 1px solid #21262d; padding-bottom: 0.4rem; margin-top: 2.5rem; font-size: 1.3rem; }

  .zen-pulse { display: flex; flex-wrap: wrap; gap: 0.75rem; padding: 0.75rem; margin: 1rem 0; background: #161b22; border: 1px solid #30363d; border-radius: 8px; font-size: 0.85rem; }
  .zen-pulse .zp-item { display: flex; flex-direction: column; gap: 0.15rem; min-width: 180px; flex: 1 1 180px; }
  .zen-pulse .zp-ask { color: #6e7681; text-transform: uppercase; letter-spacing: 1px; font-size: 0.65rem; }
  .zen-pulse .zp-val { color: #c9d1d9; }
  .zen-pulse .zp-val.gold { color: #ffd700; }

  .zen-reveal { margin: 0.75rem 0; padding: 0.5rem 0.75rem; background: #0d1117; border-left: 2px solid #30363d; border-radius: 4px; }
  .zen-reveal summary { cursor: pointer; color: #c9d1d9; padding: 0.25rem 0; }
  .zen-reveal summary:hover { color: #58a6ff; }
  .series-emoji { font-size: 1.05rem; margin-right: 0.25rem; }
  .series-count { color: #6e7681; font-size: 0.8rem; font-weight: normal; }
  .series-topic { color: #8b949e; font-size: 0.85rem; font-style: italic; margin: 0.5rem 0 0.25rem; }
  .essay-list { list-style: none; padding: 0; margin: 0.25rem 0 0; }
  .essay-list li { margin: 0.4rem 0; padding: 0.25rem 0; border-bottom: 1px solid #21262d; font-size: 0.92rem; }

  a { color: #58a6ff; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .date { color: #8b949e; font-size: 0.85rem; }
  .meta { color: #6e7681; font-size: 0.8rem; margin-top: 2rem; }

  /* Thesis epigraph — keystone of the trilogy */
  .epigraph { margin: 1.5rem 0; padding: 1rem 1.25rem; border-left: 3px solid #ffd700; background: #161b22; border-radius: 8px; }
  .epigraph p { margin: 0 0 0.5rem; color: #e6edf3; font-size: 1.05rem; font-style: italic; line-height: 1.55; }
  .epigraph cite { display: block; color: #8b949e; font-size: 0.78rem; font-style: normal; }

  .flat-list { display: none; }
</style>
</head>
<body>

<nav aria-label="Breadcrumb" style="font-size: 0.85rem; padding: 0.5rem 0;">
  <a href="/">← arif-fazil.com</a> · <a href="/words/">/words/</a> · <strong>Writing</strong>
</nav>

<h1>📜 Writing — Constitutional Essays</h1>
<p>Sovereign reading room — long-form essays by <a href="/"><strong>Muhammad Arif bin Fazil</strong></a> on AI governance, institutions, and the path to AGI.</p>
<p>Canonical index: <a href="/words/writing/">/words/writing/</a> · ${items.length} essays · updated ${TODAY}</p>

<blockquote class="epigraph">
  <p>Humans, institutions, and AI do not become evil because they are malicious. They become evil when they get better at protecting narratives than correcting themselves with reality.</p>
  <cite>— Arif Fazil · AGI Paradox trilogy · 2026-08-07</cite>
</blockquote>

<aside class="zen-pulse" aria-label="Sacred navigation">
  <div class="zp-item">
    <span class="zp-ask">Where am I?</span>
    <span class="zp-val">Writing · /words/</span>
  </div>
  <div class="zp-item">
    <span class="zp-ask">Why care?</span>
    <span class="zp-val gold">Intelligence scales · governance determines survival</span>
  </div>
  <div class="zp-item">
    <span class="zp-ask">What next?</span>
    <span class="zp-val">Read the AGI Paradox trilogy · or jump by series</span>
  </div>
</aside>

<section>
    <details class="zen-reveal" open>
      <summary><span class="series-emoji">📜</span> <strong>All Essays</strong> <span class="series-count">(${items.length} entries, newest first)</span></summary>
      <p class="series-topic">AI Governance, AGI, institutions, truth, AGI Paradox trilogy (Aug 2026)</p>
      <ul class="essay-list">
${list}
      </ul>
    </details>
</section>

<ul class="flat-list" aria-hidden="true">
${items.map((it) => `    <li><a href="/words/writing/${escapeHtml(it.slug)}">${escapeHtml(it.title)}</a> <span class="date">— ${escapeHtml(it.date)} · seal 999 · INT</span></li>`).join("\n")}
</ul>

<p class="meta">Source of truth: <code>src/data/essays/articles.json</code> + <code>src/data/essays/index.ts</code> · Per-essay pages rendered by SPA <code>src/pages/EssayPage.tsx</code>. <em>Ditempa bukan diberi.</em></p>
</body>
</html>
`;
}

/* ── index.json (machine-readable) ─────────────────────────────────────── */

function buildIndexJson(items) {
  return {
    schema: "arifos.writing_index.v1",
    as_of: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
    count: items.length,
    human_index: "/words/writing",
    feed: "/feed.xml",
    items: items.map((it) => ({
      title: it.title,
      slug: it.slug,
      href: `/words/writing/${it.slug}`,
      date: it.date,
      territory: "writing",
      language: "en",
      tags: it.tags || [],
      risk_level: "INT",
      epoch: it.date,
    })),
  };
}

/* ── llms.txt-style flat surface for crawlers ─────────────────────────── */

function buildLlmsTxt(items) {
  return `# /words/writing — Long-form Essays by Arif Fazil

Sovereign reading room for constitutional essays on AI governance, institutions, and the path to AGI.
${items.length} direct publications.

${items.map((it) => `- [${it.title}](${SITE_BASE}/words/writing/${it.slug}/) — ${it.date}\n  ${escapeHtml(it.excerpt)}`).join("\n")}

# Canonical keystone
"Humans, institutions, and AI do not become evil because they are malicious.
 They become evil when they get better at protecting narratives than correcting themselves with reality." — Arif Fazil · AGI Paradox trilogy · 2026-08-07

# Source of truth
- src/data/essays/articles.json
- src/data/essays/*.ts

Ditempa bukan diberi.
`;
}

/* ── main ─────────────────────────────────────────────────────────────── */

function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const articles = loadArticlesJson();
  const articlesBySlug = new Map(articles.map((a) => [a.slug, a]));
  const bySlug = loadEssaysFromTs();

  const items = [];
  for (const [slug, content] of bySlug) {
    const meta = articlesBySlug.get(slug);
    items.push({
      slug,
      title: content.title || (meta && meta.title) || slug,
      date: content.date || (meta && meta.date) || TODAY,
      excerpt: content.excerpt || (meta && meta.title) || "",
      tags: meta && Array.isArray(meta.categories) ? meta.categories.slice(0, 5) : [],
    });
  }
  items.sort((a, b) => {
    if (a.date < b.date) return 1;
    if (a.date > b.date) return -1;
    return a.slug.localeCompare(b.slug);
  });

  fs.writeFileSync(path.join(OUT_DIR, "index.html"), buildIndexHtml(items), "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "index.json"), JSON.stringify(buildIndexJson(items), null, 2) + "\n", "utf8");
  fs.writeFileSync(path.join(OUT_DIR, "llms.txt"), buildLlmsTxt(items), "utf8");

  console.log(`✓ Wrote ${items.length} essays to SPA index → ${path.relative(SITE_ROOT, OUT_DIR)}`);
  console.log(`  · ${path.relative(SITE_ROOT, path.join(OUT_DIR, "index.html"))}`);
  console.log(`  · ${path.relative(SITE_ROOT, path.join(OUT_DIR, "index.json"))}`);
  console.log(`  · ${path.relative(SITE_ROOT, path.join(OUT_DIR, "llms.txt"))}`);
}

main();
