#!/usr/bin/env node
/**
 * generate-essays-json.cjs — Emits src/data/essays.json from the typed canon
 *
 * Law 1 (F4 CLARITY):
 *   makcikgpt/*.ts is CANON. essays.json is GENERATED.
 */

const fs = require("fs");
const path = require("path");

const SITE_ROOT = path.resolve(__dirname, "..");
const ESSAYS_OUT = path.join(SITE_ROOT, "src/data/essays.json");

// Read current essays.json to preserve S-series (non-Makcik) items while regenerating M-series from canon
const currentEssays = JSON.parse(fs.readFileSync(ESSAYS_OUT, "utf8"));
const nonMakcikEssays = currentEssays.filter(e => !e.dest || !e.dest.path || !e.dest.path.startsWith("/world/makcikgpt/"));

// We load the compiled TS or parse metadata from makcikArticlesMeta
// For the build script, we extract the metadata directly from makcikArticlesMeta
const makcikMetaFile = path.join(SITE_ROOT, "src/data/makcikgpt/index.ts");
const content = fs.readFileSync(makcikMetaFile, "utf8");

// Parse makcikArticlesMeta dynamically by requiring or evaluating
// For clean node execution without ts-node dependency, we transform the metadata
const { makcikArticlesMeta } = require(path.join(SITE_ROOT, "dist-tools/data/makcikgpt/index.js"));

const generatedMakcikEssays = makcikArticlesMeta.map((m, idx) => ({
  id: `m-gen-${m.slug}`,
  title: m.title,
  date: m.date,
  lang: m.language === 'ms' ? 'bm' : m.language,
  series: {
    id: m.domain.includes("PETRONAS") || m.domain.includes("SEARAH") ? "M2" : "M1",
    n: makcikArticlesMeta.length - idx
  },
  tags: m.tags,
  dest: {
    type: "onsite",
    path: `/world/makcikgpt/${m.slug}`
  },
  seal: m.seal,
  provenance_status: m.provenance_status || "legacy",
  claim_register: m.claim_register || [],
  source_ledger: m.source_ledger || [],
  counter_evidence: m.counter_evidence || [],
  version_lineage: m.version_lineage || { version: "1.0", published: m.date, last_updated: m.date }
}));

const combined = [...nonMakcikEssays, ...generatedMakcikEssays];
const header = "// AUTO-GENERATED — DO NOT EDIT DIRECTLY (CANON: src/data/makcikgpt/*.ts)\n";
fs.writeFileSync(ESSAYS_OUT, header + JSON.stringify(combined, null, 2) + "\n");
console.log(`✓ Auto-generated essays.json from typed canon (${combined.length} total essays).`);
