#!/usr/bin/env node
/**
 * generate-makcik-articles.cjs — Rebuild all /makcikgpt-md/<slug>.html
 * with the same pattern as the writing articles (/words/writing/<slug>/index.html).
 *
 * Pattern: ARIF FAZIL top bar → breadcrumb → kicker (domain · SEALED 999) →
 * h1 title → subtitle → byline → tag pills → hr → article body → footer block.
 *
 * Reads:
 *   - src/data/essays.json (metadata: slug, title, subtitle, date, tags, etc.)
 *   - src/data/makcikgpt/<slug>.ts (html: field = article body)
 *
 * Output:
 *   public/makcikgpt-md/<slug>.html
 *   public/makcikgpt-md/index.html (unchanged — handled by generate-makcik-index.cjs)
 */

const fs = require("fs");
const path = require("path");
const { getMakcikSource } = require("./lib/makcik-source.cjs");

const SITE_ROOT = "/root/arif-fazil.com/sites/arif-fazil.com";
const OUT_DIR = path.join(SITE_ROOT, "public/makcikgpt-md");
const TS_DIR = path.join(SITE_ROOT, "src/data/makcikgpt");

// ─── helpers ────────────────────────────────────────────────────────────────

function escapeHtml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function stripTags(html) {
  return html
    .replace(/<[^>]+>/g, " ")
    .replace(/&[^;]+;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readMin(html) {
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 250));
}

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00Z");
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  const day = d.getUTCDate();
  const mon = months[d.getUTCMonth()];
  const yr = d.getUTCFullYear();
  return `${String(day).padStart(2, "0")} ${mon} ${yr}`;
}

function extractHtmlFromTs(tsPath) {
  const raw = fs.readFileSync(tsPath, "utf8");
  // Match: html: `...` (backtick template string, possibly multi-line)
  const m = raw.match(/html:\s*`([\s\S]*?)`(?:\s*[,}])/);
  if (!m) {
    console.warn(`  ⚠ Could not extract html from ${tsPath}`);
    return null;
  }
  // Unescape template literal: \` → " and \\ → \
  return m[1].replace(/\\"/g, '"').replace(/\\'/g, "'").replace(/\\\\/g, "\\");
}

/**
 * Strip the leading <div class="cover">...</div> block from the article body.
 * Uses depth tracking to handle nested divs (e.g. cover-byline).
 * Also strips duplicate title / subtitle / byline lines that appear right after.
 */
function stripCoverBlock(html) {
  let body = html;

  // Match the leading <div class="cover">...</div> with depth tracking
  const openRe = /^\s*(?:\n\s*)*<div\s+class=["']cover["']>/i;
  if (openRe.test(body)) {
    let depth = 0;
    let i = body.indexOf("<div", 0);
    // Find the start of the cover div (the "class=cover" one)
    const openMatch = body.match(openRe);
    if (openMatch) {
      const start = openMatch.index;
      // Walk forward from start, track div depth
      let j = start;
      depth = 0;
      while (j < body.length) {
        const openDiv = body.indexOf("<div", j);
        const closeDiv = body.indexOf("</div>", j);
        if (closeDiv === -1) break;
        if (openDiv !== -1 && openDiv < closeDiv) {
          depth++;
          j = openDiv + 4;
        } else {
          depth--;
          j = closeDiv + 6;
          if (depth === 0) {
            body = body.slice(j).replace(/^\s*\n+/, "");
            break;
          }
        }
      }
    }
  }

  // Strip trailing duplicate title, subtitle, byline lines that many articles
  // have immediately after the cover block. Patterns:
  //   <hr /> separator (cover block always has one)
  //   <h1>...title...</h1>
  //   <p><strong>...subtitle...</strong></p>
  //   <p><strong>...date/byline/meterai info...</strong></p>
  for (let i = 0; i < 8; i++) {
    // Skip orphan <hr /> that separates cover from body
    body = body.replace(/^\s*(?:\n\s*)*<hr\s*\/>\s*\n?/i, "");
    // Skip duplicate <h1> or <h2> (title repeat)
    body = body.replace(/^\s*(?:\n\s*)*<h[12][^>]*>.*?<\/h[12]>\s*\n?/i, "");
    // Skip bold subtitle/byline paragraphs
    body = body.replace(
      /^\s*(?:\n\s*)*<p>\s*<strong>[^<]*999\s*Meterai[^<]*<\/strong>\s*<\/p>\s*\n?/i,
      ""
    );
  }

  return body.trim();
}

// ─── page template ──────────────────────────────────────────────────────────

function buildPage(meta, articleBody) {
  const title = escapeHtml(meta.title);
  const subtitle = escapeHtml(meta.subtitle);
  const domain = escapeHtml(meta.domain);
  const dateFmt = formatDate(meta.date);
  const readMinVal = readMin(articleBody);
  const slug = meta.slug;
  const tags = (meta.tags || []).map(
    (t) =>
      `<span class="font-mono text-xs uppercase tracking-wider px-2 py-0.5 border border-forge-iron text-forge-dim">${escapeHtml(t)}</span>`
  );

  const bodyHtml = articleBody;

  return `<!doctype html>
<html lang="ms" data-ring="SOUL">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} — MakcikGPT | ARIF FAZIL</title>
  <meta name="theme-color" content="#0A0B0D" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400..900;1,9..144,400..900&family=Newsreader:ital,opsz,wght@0,6..72,400..700;1,6..72,400..700&family=IBM+Plex+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
  <link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@400,700,800&f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>Ψ</text></svg>" />
  <link rel="stylesheet" href="/_shared/design-system/tokens.css" />
  <link rel="stylesheet" href="/assets/index-Dte6gqTG.css" />
  <meta name="description" content="${subtitle}" />
  <link rel="canonical" href="https://arif-fazil.com/world/makcikgpt/${slug}" />
</head>
<body class="bg-forge-black">
<div class="site-frame max-w-4xl mx-auto px-4">
  <header class="flex items-center justify-between py-6 border-b border-forge-iron mb-10">
    <a href="/" class="font-display text-2xl text-forge-white hover:text-forge-gold transition-colors">ARIF FAZIL</a>
    <nav class="flex gap-6 font-mono text-xs text-forge-dim uppercase tracking-widest">
      <a href="/" class="hover:text-forge-gold transition-colors">Home</a>
      <a href="/earth/" class="hover:text-forge-gold transition-colors">Earth</a>
      <a href="/words/" class="hover:text-forge-gold transition-colors">Words</a>
      <a href="/world/" class="text-forge-gold">World</a>
      <a href="/work/" class="hover:text-forge-gold transition-colors">Work</a>
    </nav>
  </header>

  <a href="/world/makcikgpt/" class="font-mono text-xs text-forge-red hover:text-forge-white transition-colors mb-8 inline-block">← MakcikGPT</a>
  <div class="font-mono text-[0.65rem] text-forge-red uppercase tracking-widest mb-4">${domain} · SEALED 999</div>
  <h1 class="font-display text-4xl md:text-6xl font-black uppercase leading-[0.95] tracking-tighter mb-6 text-forge-white">${title}</h1>
  <p class="font-body text-lg md:text-xl text-forge-white/70 mb-8 leading-snug max-w-3xl">${subtitle}</p>
  <div class="flex flex-wrap items-center gap-3 font-mono text-xs text-forge-dim mb-3">
    <span class="px-2 py-0.5 border border-forge-iron text-forge-white/90">By Arif Fazil</span>
    <span class="px-2 py-0.5 border border-forge-red text-forge-red">Sealed 999</span>
    <time datetime="${meta.date}">${dateFmt}</time>
    <span>· ${readMinVal} min read</span>
  </div>
  <div class="flex flex-wrap items-center gap-2 mb-12">
${tags.map((t) => "    " + t).join("\n")}
  </div>
  <hr class="border-forge-iron mb-12" />
  <article class="font-body text-lg leading-relaxed text-forge-white/85 space-y-5 max-w-3xl">
${bodyHtml}
  </article>
  <footer class="mt-24 pt-8 border-t border-forge-iron font-mono text-xs text-forge-dim">
    <p class="text-forge-white mb-4 font-display italic text-base">"Ditempa bukan diberi — Forged, not given."</p>
    <p class="mb-2">Published directly on <a href="/" class="text-forge-red hover:text-forge-white transition-colors">arif-fazil.com</a> · Constitutional surface: <a href="/world/" class="text-forge-red hover:text-forge-white transition-colors">/world/</a> · MakcikGPT: <a href="/world/makcikgpt/" class="text-forge-red hover:text-forge-white transition-colors">/world/makcikgpt/</a></p>
    <p class="mb-4">
      <a href="/words/writing/" class="text-forge-red hover:text-forge-white transition-colors">Writing</a> ·
      <a href="/doctrine/" class="text-forge-red hover:text-forge-white transition-colors">Doctrine</a> ·
      <a href="/feed.xml" class="text-forge-red hover:text-forge-white transition-colors">/feed.xml</a>
    </p>
    <p class="text-forge-dim/60">Agents: polite crawl, no mass-email, cite with rsl.xml. Do no harm.</p>
    <p class="mt-2">
      <a href="/llms.txt" class="text-forge-red hover:text-forge-white transition-colors">llms.txt</a> ·
      <a href="/missions.json" class="text-forge-red hover:text-forge-white transition-colors">missions.json</a> ·
      <a href="/surfaces.json" class="text-forge-red hover:text-forge-white transition-colors">surfaces.json</a>
    </p>
  </footer>
</div>
</body>
</html>
`;
}

// ─── main ───────────────────────────────────────────────────────────────────

function extractCoverMeta(tsRaw) {
  // Extract from the .ts file's cover block: cover-title, cover-subtitle, cover-byline
  const title = (tsRaw.match(/<h1\s+class=["']cover-title["']>([\s\S]*?)<\/h1>/i) || [, ""])[1]
    .replace(/<br\s*\/?>/gi, " ")
    .trim();
  const subtitle = (tsRaw.match(/<p\s+class=["']cover-subtitle["']>([\s\S]*?)<\/p>/i) || [, ""])[1]
    .trim();
  const kicker = (tsRaw.match(/<p\s+class=["']cover-kicker["']>([\s\S]*?)<\/p>/i) || [, ""])[1]
    .trim();
  return { title, subtitle, kicker };
}

function extractMetaFromIndex(slug, rawIndex) {
  // Find the object for this slug in makcikArticlesMeta and pull title, subtitle, date, domain, tags
  const slugIdx = rawIndex.indexOf(`slug: '${slug}'`);
  if (slugIdx === -1) return null;
  // Walk backward to find the opening {
  let start = slugIdx;
  while (start > 0 && rawIndex[start] !== "{") start--;
  // Walk forward to find the matching close }
  let depth = 0;
  let end = start;
  for (; end < rawIndex.length; end++) {
    if (rawIndex[end] === "{") depth++;
    else if (rawIndex[end] === "}") {
      depth--;
      if (depth === 0) break;
    }
  }
  const objText = rawIndex.slice(start, end + 1);

  // Extract simple key-value pairs with regex
  function pick(re) {
    const m = objText.match(re);
    return m ? m[1].replace(/\\'/g, "'").trim() : null;
  }
  const title = pick(/title:\s*'([\s\S]*?)'(?=,)/);
  const subtitle = pick(/subtitle:\s*'([\s\S]*?)'(?=,)/);
  const date = pick(/date:\s*'([\s\S]*?)'(?=,)/);
  const domain = pick(/domain:\s*'([\s\S]*?)'(?=,)/);

  // tags: ['a', 'b', 'c']
  const tagsMatch = objText.match(/tags:\s*\[([\s\S]*?)\]/);
  const tags = tagsMatch
    ? [...tagsMatch[1].matchAll(/'([^']+)'/g)].map((m) => m[1])
    : [];

  return { title, subtitle, date, domain, tags };
}

function main() {
  const rawIndex = fs.readFileSync(path.join(TS_DIR, "index.ts"), "utf8");

  // Get list of slugs from essays.json (it's the canonical ordering)
  const { pieces } = getMakcikSource();
  const slugs = pieces.map((p) =>
    p.dest.path.replace(/^\/world\/makcikgpt\//, "").replace(/\/$/, "")
  );

  let count = 0;
  let skipped = 0;

  for (const slug of slugs) {
    const tsPath = path.join(TS_DIR, `${slug}.ts`);
    if (!fs.existsSync(tsPath)) {
      console.warn(`  ⚠ ${slug}.ts not found — skipping`);
      skipped++;
      continue;
    }

    const tsRaw = fs.readFileSync(tsPath, "utf8");
    const rawHtml = extractHtmlFromTs(tsPath);
    if (!rawHtml) {
      skipped++;
      continue;
    }

    const articleBody = stripCoverBlock(rawHtml);

    // Prefer meta from makcikArticlesMeta (the rich index), fall back to cover block
    const metaObj = extractMetaFromIndex(slug, rawIndex) || {};
    const coverMeta = extractCoverMeta(tsRaw);

    const meta = {
      slug,
      title: metaObj.title || coverMeta.title || slug,
      subtitle: metaObj.subtitle || coverMeta.subtitle || "",
      date: metaObj.date || "",
      domain: metaObj.domain || "MAKCIKGPT × CIVIC",
      tags: metaObj.tags && metaObj.tags.length > 0 ? metaObj.tags : [],
      seal: "999",
    };

    const html = buildPage(meta, articleBody);
    const outPath = path.join(OUT_DIR, `${slug}.html`);
    fs.writeFileSync(outPath, html, "utf8");
    count++;
    console.log(`  ✓ ${slug}.html (${readMin(articleBody)} min read)`);
  }

  console.log(`\n✓ Wrote ${count} article pages, skipped ${skipped}`);
}

main();
