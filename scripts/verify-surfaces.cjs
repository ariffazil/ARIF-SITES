#!/usr/bin/env node
/**
 * verify-surfaces.cjs — CI truth-check for surface catalogs.
 *
 * Reads surfaces.json and fetches every status:live path on the deployed site.
 * Any path returning non-200 fails the build. Status:redirect paths must
 * return 301/302/307/308. Status:gone paths must return 404 or 410.
 *
 * Fail-closed doctrine: a catalog entry that doesn't resolve never ships.
 *
 * Usage:  node scripts/verify-surfaces.cjs [--base=https://arif-fazil.com]
 * Exit:   0 = all surfaces verified, 1 = one or more surfaces failed
 */

const fs = require("fs");
const path = require("path");

const SITE_ROOT = path.resolve(__dirname, "..");
const SURFACES_JSON = path.join(SITE_ROOT, "surfaces.json");
const BASE = process.argv.find((a) => a.startsWith("--base="))?.split("=")[1]
  || process.env.VERIFY_BASE
  || "http://localhost:5173";

const TIMEOUT_MS = 15_000;

function loadSurfaces() {
  if (!fs.existsSync(SURFACES_JSON)) {
    console.error(`FATAL: ${SURFACES_JSON} not found.`);
    process.exit(2);
  }
  return JSON.parse(fs.readFileSync(SURFACES_JSON, "utf8"));
}

async function fetchStatus(url, expectedStatusFamily) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    // Follow redirects: false — we want the raw status code
    const resp = await fetch(url, {
      method: "GET",
      redirect: "manual",
      signal: controller.signal,
      headers: { 
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) arifOS-verify-surfaces/1.0 (CI truth-check)",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8"
      },
    });
    clearTimeout(timer);
    return { status: resp.status, ok: expectedStatusFamily.includes(Math.floor(resp.status / 100)) };
  } catch (err) {
    clearTimeout(timer);
    return { status: 0, ok: false, error: err.message };
  }
}

function buildTestUrl(surfacePath) {
  // Replace :slug / :param dynamic segments with a test slug
  const testPath = surfacePath.replace(/\/:[\w-]+/g, "/__verify_test__");
  return `${BASE}${testPath}`;
}

function expectedFamily(surface) {
  switch (surface.status) {
    case "live": return [2];                                    // 2xx
    case "redirect": return [3];                                // 3xx
    case "gone": return [4];                                    // 404 or 410
    default: return [2, 3, 4];                                  // anything but 5xx
  }
}

async function main() {
  const catalog = loadSurfaces();
  const surfaces = catalog.surfaces || [];

  console.log(`Verifying ${surfaces.length} surfaces against ${BASE}...\n`);

  const results = [];
  for (const s of surfaces) {
    // Skip dynamic pages — they need real params to resolve
    if (s.type === "dynamic_page") {
      console.log(`  SKIP (dynamic): ${s.path} — needs real params`);
      continue;
    }
    const url = buildTestUrl(s.path);
    const family = expectedFamily(s);
    const { status, ok, error } = await fetchStatus(url, family);

    const familyLabel = family.map((f) => `${f}xx`).join("/");
    const icon = ok ? "✓" : "✗";
    const detail = status === 0 ? `ERROR: ${error}` : `HTTP ${status}`;

    console.log(`  ${icon} ${s.path} → ${detail}  [expected: ${familyLabel}]`);

    results.push({ path: s.path, status, ok, expected: familyLabel });
  }

  const failed = results.filter((r) => !r.ok);
  const skipped = surfaces.filter((s) => s.type === "dynamic_page").length;

  console.log(`\n───`);
  console.log(`Verified: ${results.length} | Passed: ${results.length - failed.length} | Failed: ${failed.length} | Skipped: ${skipped}`);

  if (failed.length > 0) {
    console.log(`\nFAILED SURFACES:`);
    for (const f of failed) {
      console.log(`  ✗ ${f.path} → HTTP ${f.status} (expected ${f.expected})`);
    }
    console.log(`\nFail-closed: build blocked. Fix the catalog or the surface.`);
    process.exit(1);
  }

  console.log(`All verifiable surfaces pass. Catalog is truthful.`);
  process.exit(0);
}

main();
