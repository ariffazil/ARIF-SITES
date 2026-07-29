/**
 * tests/makcik-source.test.cjs — focused parity test for MakcikGPT source of truth.
 *
 * Run with:  node --test tests/makcik-source.test.cjs
 * Or via:    npm run test:makcik
 *
 * Compares the canonical slug set (derived from src/data/essays.json via
 * scripts/lib/makcik-source.cjs) against the slug sets actually emitted by
 * every generator into:
 *   - public/makcikgpt-md/index.html
 *   - public/feed.xml
 *   - public/sitemap.xml
 *   - public/llms.txt
 *   - public/llms.json
 *
 * The test fails closed if any generator drifts. It does NOT touch deploy,
 * prerender, or any other dirty file in the working tree.
 */

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const {
  getMakcikSource,
  CANONICAL_PREFIX,
  SITE_ROOT,
} = require("../scripts/lib/makcik-source.cjs");

const PUBLIC_DIR = path.join(SITE_ROOT, "public");
const CANONICAL_PREFIX_RE = /^\/makcikgpt\/(.+)$/;

function readUtf8(p) {
  return fs.readFileSync(p, "utf8");
}

/**
 * Extract slugs under /makcikgpt/ from arbitrary text by matching
 * every occurrence of the canonical prefix and capturing what follows.
 * The matcher is intentionally simple — it tolerates any surrounding URL
 * scheme or attribute delimiter because the canonical prefix is unique.
 */
function extractSlugs(text) {
  const slugs = new Set();
  // Build a regex that finds the prefix with optional URL scheme/host in front.
  // We match either "/makcikgpt/<slug>" (path form, slug = non-/" or whitespace)
  // or "https://arif-fazil.com/makcikgpt/<slug>" (absolute form).
  const re = /(?:https:\/\/arif-fazil\.com)?\/makcikgpt\/([A-Za-z0-9._\-/]+)/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const slugish = m[1];
    // The canonical landing has an empty slug ("/makcikgpt/" → captures ""),
    // which we exclude — landing is never a piece.
    if (!slugish || slugish.endsWith("/")) continue;
    slugs.add(slugish);
  }
  return slugs;
}

function extractSlugsFromJsonRouteRoles(jsonText) {
  let parsed;
  try {
    parsed = JSON.parse(jsonText);
  } catch (err) {
    throw new Error(`malformed JSON: ${err.message}`);
  }
  const routeRoles = parsed && parsed.route_roles;
  if (!routeRoles || typeof routeRoles !== "object") {
    throw new Error("llms.json has no route_roles object");
  }
  const slugs = new Set();
  for (const key of Object.keys(routeRoles)) {
    const m = key.match(CANONICAL_PREFIX_RE);
    if (!m) continue;
    if (!m[1]) continue; // skip the canonical landing "/makcikgpt/"
    slugs.add(m[1]);
  }
  return slugs;
}

function assertSameSet(label, actual, expected) {
  const expectedSorted = [...expected].sort();
  const actualSorted = [...actual].sort();
  const missing = expectedSorted.filter((s) => !actual.has(s));
  const extra = actualSorted.filter((s) => !expected.has(s));
  if (missing.length === 0 && extra.length === 0) {
    return; // parity
  }
  const details = [];
  if (missing.length) {
    details.push(`missing in ${label}:\n    - ${missing.join("\n    - ")}`);
  }
  if (extra.length) {
    details.push(`extra in ${label} (not in canonical):\n    - ${extra.join("\n    - ")}`);
  }
  assert.fail(`Parity drift in ${label}.\n${details.join("\n")}`);
}

test("MakcikGPT canonical subset is non-empty", () => {
  const { pieces, count } = getMakcikSource();
  assert.ok(count >= 1, `expected ≥1 piece, got ${count}`);
  assert.ok(Array.isArray(pieces) && pieces.length === count);
});

test("Helper enforces canonical-prefix discipline", () => {
  const { pieces } = getMakcikSource();
  for (const p of pieces) {
    assert.ok(
      p.dest.path.startsWith(CANONICAL_PREFIX),
      `${p.id} dest.path "${p.dest.path}" must start with ${CANONICAL_PREFIX}`,
    );
  }
});

test("Helper produces deterministic order (date desc, id desc tiebreaker)", () => {
  const { pieces } = getMakcikSource();
  for (let i = 1; i < pieces.length; i++) {
    const prev = pieces[i - 1];
    const cur = pieces[i];
    if (cur.date === prev.date) {
      assert.ok(prev.id >= cur.id, `tiebreaker broken at index ${i}: ${prev.id} < ${cur.id}`);
    } else {
      assert.ok(prev.date >= cur.date, `date order broken at index ${i}: ${prev.date} < ${cur.date}`);
    }
  }
});

test("Helper rejects duplicates and missing metadata", () => {
  // Build a deliberately broken subset and confirm the validator catches it.
  const broken = [
    {
      id: "dup-1",
      title: "x",
      date: "2026-01-01",
      lang: "bm",
      series: { id: "Z", n: 1 },
      tags: ["x"],
      dest: { type: "onsite", path: "/makcikgpt/foo" },
      seal: null,
    },
    {
      id: "dup-1",
      title: "y",
      date: "2026-01-02",
      lang: "bm",
      series: { id: "Z", n: 2 },
      tags: ["y"],
      dest: { type: "onsite", path: "/makcikgpt/foo" },
      seal: null,
    },
  ];
  const { validateMakcikPieces } = require("../scripts/lib/makcik-source.cjs");
  const result = validateMakcikPieces(broken, { throwOnError: false });
  assert.equal(result.ok, false);
  const joined = result.violations.join("\n");
  assert.match(joined, /duplicate id "dup-1"/);
  assert.match(joined, /duplicate dest\.path "\/makcikgpt\/foo"/);
});

test("Generated makcikgpt-md/index.html contains every canonical slug", () => {
  const { pieces } = getMakcikSource();
  const canonical = new Set(pieces.map((p) => p.dest.path.slice(CANONICAL_PREFIX.length)));
  const indexPath = path.join(PUBLIC_DIR, "makcikgpt-md/index.html");
  const html = readUtf8(indexPath);
  const actual = extractSlugs(html);
  assertSameSet("public/makcikgpt-md/index.html", actual, canonical);
});

test("Every canonical MakcikGPT slug has generated HTML", () => {
  const { pieces } = getMakcikSource();
  for (const piece of pieces) {
    const slug = piece.dest.path.slice(CANONICAL_PREFIX.length);
    const htmlPath = path.join(PUBLIC_DIR, "makcikgpt-md", `${slug}.html`);
    assert.ok(fs.existsSync(htmlPath), `missing generated HTML for ${piece.dest.path}`);
  }
});

test("Generated public/feed.xml contains every canonical slug", () => {
  const { pieces } = getMakcikSource();
  const canonical = new Set(pieces.map((p) => p.dest.path.slice(CANONICAL_PREFIX.length)));
  const feedPath = path.join(PUBLIC_DIR, "feed.xml");
  const xml = readUtf8(feedPath);
  const actual = extractSlugs(xml);
  assertSameSet("public/feed.xml", actual, canonical);
});

test("Generated public/sitemap.xml contains every canonical slug", () => {
  const { pieces } = getMakcikSource();
  const canonical = new Set(pieces.map((p) => p.dest.path.slice(CANONICAL_PREFIX.length)));
  const sitemapPath = path.join(PUBLIC_DIR, "sitemap.xml");
  const xml = readUtf8(sitemapPath);
  const actual = extractSlugs(xml);
  assertSameSet("public/sitemap.xml", actual, canonical);
});

test("Generated public/llms.txt lists every canonical slug", () => {
  const { pieces } = getMakcikSource();
  const canonical = new Set(pieces.map((p) => p.dest.path.slice(CANONICAL_PREFIX.length)));
  const llmsPath = path.join(PUBLIC_DIR, "llms.txt");
  const txt = readUtf8(llmsPath);
  const actual = extractSlugs(txt);
  assertSameSet("public/llms.txt", actual, canonical);
});

test("Generated public/llms.json route_roles lists every canonical slug", () => {
  const { pieces } = getMakcikSource();
  const canonical = new Set(pieces.map((p) => p.dest.path.slice(CANONICAL_PREFIX.length)));
  const llmsJsonPath = path.join(PUBLIC_DIR, "llms.json");
  const json = readUtf8(llmsJsonPath);
  const actual = extractSlugsFromJsonRouteRoles(json);
  assertSameSet("public/llms.json", actual, canonical);
});