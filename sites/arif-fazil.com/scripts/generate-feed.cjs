#!/usr/bin/env node
/**
 * generate-feed.cjs — MakcikGPT RSS feed generator
 *
 * Renders /feed.xml from the single source of truth: src/data/essays.json.
 * Filters to BM (Bahasa Makcik) makcikgpt pieces (M-series, dest.type=onsite),
 * sorts by date desc, and emits RSS 2.0 with canonical /world/makcikgpt/ URLs.
 *
 * Single Source of Truth rule (F4 CLARITY):
 *   - essays.json  → page (React) + feed.xml + llms.txt listings
 *
 * Run from site root:  node scripts/generate-feed.cjs
 * Output:              public/feed.xml  (vite copies → dist/ on build)
 */

const fs = require("fs");
const path = require("path");

const SITE_ROOT = path.resolve(__dirname, "..");
const ESSAYS_JSON = path.join(SITE_ROOT, "src/data/essays.json");
const FEED_OUT = path.join(SITE_ROOT, "public/feed.xml");

const SITE_BASE = "https://arif-fazil.com";
const CANONICAL_LANDING = `${SITE_BASE}/world/makcikgpt/`;
const SELF_URL = `${SITE_BASE}/feed.xml`;

function loadEssays() {
  const raw = fs.readFileSync(ESSAYS_JSON, "utf8");
  return JSON.parse(raw);
}

function pickMakcikPieces(essays) {
  // MakcikGPT feed = all BM essays (Bahasa Makcik voice), in publish-date order.
  // Covers M-series civic journalism (onsite) + S7-BM philosophy (Medium) — both
  // are BM-authored by Arif and belong on the Bahasa Makcik subscription surface.
  return essays
    .filter((e) => e.lang === "bm" && e.dest)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

function toRfc822(dateStr) {
  // YYYY-MM-DD → RFC 822 representing 00:00 MYT on that date.
  // Build the string manually so the offset label is consistent with the displayed time.
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const [y, m, d] = dateStr.split("-").map(Number);
  // What day-of-week is 00:00 MYT on (y,m,d)? Equivalent to 16:00 UTC on (y,m,d-1).
  const utcMs = Date.UTC(y, m - 1, d) - 8 * 3600 * 1000;
  const dt = new Date(utcMs);
  const dow = days[dt.getUTCDay()];
  const mon = months[m - 1];
  const dd = String(d).padStart(2, "0");
  // Two-digit year (RFC 822 historically; we use 4-digit per RFC 2822 which is fine)
  return `${dow}, ${dd} ${mon} ${y} 00:00:00 +0800`;
}

function escapeXml(s) {
  return String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildItem(e) {
  // onsite → canonical /world/makcikgpt/<slug> (or the path as-is);
  // medium → external Medium URL.
  let url;
  if (e.dest.type === "onsite") {
    url = `${SITE_BASE}${e.dest.path}`;
  } else {
    url = e.dest.url;
  }
  const desc =
    (e.tags && e.tags.length ? e.tags.join(", ") : "Civic intelligence — Bahasa Makcik") +
    ` · Series ${e.series.id}#${e.series.n}`;
  return `    <item>
      <title>${escapeXml(e.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(desc)}</description>
      <pubDate>${toRfc822(e.date)}</pubDate>
    </item>`;
}

function buildRss(items) {
  const lastBuild = new Date();
  // lastBuildDate: emit current moment in MYT offset
  const lastBuildStr = lastBuild.toUTCString().replace("GMT", "+0800");
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>MakcikGPT — Civic Intelligence | Arif Fazil</title>
    <link>${CANONICAL_LANDING}</link>
    <description>Civic journalism in Bahasa Makcik. Malaysian sovereignty, resource governance, institutional integrity, and technology accountability.</description>
    <language>ms-my</language>
    <atom:link href="${SELF_URL}" rel="self" type="application/rss+xml"/>
    <lastBuildDate>${lastBuildStr}</lastBuildDate>
${items.map(buildItem).join("\n")}
  </channel>
</rss>
`;
}

function main() {
  const essays = loadEssays();
  const pieces = pickMakcikPieces(essays);
  if (pieces.length === 0) {
    console.error("ERROR: No BM makcikgpt pieces found in essays.json");
    process.exit(1);
  }
  const xml = buildRss(pieces);
  fs.mkdirSync(path.dirname(FEED_OUT), { recursive: true });
  fs.writeFileSync(FEED_OUT, xml, "utf8");
  console.log(`✓ Wrote ${pieces.length} items → ${path.relative(SITE_ROOT, FEED_OUT)}`);
  // Emit canonical slug list to stdout for visibility / CI
  pieces.forEach((p) => console.log(`  - ${p.id} ${p.date} ${p.dest.path}`));
}

main();