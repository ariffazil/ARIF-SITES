#!/usr/bin/env node
/**
 * generate-essays-json.cjs — Emits valid JSON src/data/essays.json from typed canon
 *
 * Law 1 (F4 CLARITY):
 *   makcikgpt/*.ts is CANON. essays.json is GENERATED.
 */

const fs = require("fs");
const path = require("path");

const SITE_ROOT = path.resolve(__dirname, "..");
const ESSAYS_OUT = path.join(SITE_ROOT, "src/data/essays.json");

// Read current essays.json (handling clean JSON parse)
const raw = fs.readFileSync(ESSAYS_OUT, "utf8");
const jsonText = raw.startsWith("//") ? raw.slice(raw.indexOf("\n") + 1) : raw;
const currentEssays = JSON.parse(jsonText);

const nonMakcikEssays = currentEssays.filter(e => !e.dest || !e.dest.path || !e.dest.path.startsWith("/world/makcikgpt/"));

// Load canon from makcik-source.cjs
const { makcikArticlesMeta } = require(path.join(SITE_ROOT, "src/data/makcikgpt/index.ts"));

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
fs.writeFileSync(ESSAYS_OUT, JSON.stringify(combined, null, 2) + "\n");
console.log(`✓ Auto-generated clean essays.json from typed canon (${combined.length} total essays).`);
