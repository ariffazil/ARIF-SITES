#!/usr/bin/env node
/**
 * generate-md-mirrors.cjs — Generates agentic markdown mirrors under public/makcikgpt-md/
 *
 * Law 1 & Law 3:
 * Reads typed canon via makcik-source.cjs and emits frontmatter + claim matrix.
 */

const fs = require("fs");
const path = require("path");
const { getMakcikSource, computeCanonicalPayloadHash, SITE_ROOT } = require("./lib/makcik-source.cjs");

const OUT_DIR = path.join(SITE_ROOT, "public/makcikgpt-md");
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const { pieces } = getMakcikSource();

for (const p of pieces) {
  const slug = p.dest.path.replace("/world/makcikgpt/", "");
  const outFile = path.join(OUT_DIR, `${slug}.md`);

  const payloadHash = computeCanonicalPayloadHash(p);
  const claimReg = p.claim_register || [];
  const sourceLedger = p.source_ledger || [];

  const obsCount = claimReg.filter(c => c.tag === "OBS").length;
  const intCount = claimReg.filter(c => c.tag === "INT").length;
  const specCount = claimReg.filter(c => c.tag === "SPEC").length;
  const derCount = claimReg.filter(c => c.tag === "DER").length;

  let claimsTable = "";
  if (claimReg.length > 0) {
    claimsTable = `\n## Claim Register\n\n| claim_id | tag | text | source_id | maruah |\n|---|---|---|---|---|\n` +
      claimReg.map(c => `| ${c.claim_id} | ${c.tag} | ${c.text.replace(/\|/g, "\\|")} | ${c.source_id || "-"} | ${c.maruah_review || "n/a"} |`).join("\n") + "\n";
  }

  let sourcesTable = "";
  if (sourceLedger.length > 0) {
    sourcesTable = `\n## Source Ledger\n\n| source_id | type | title | url |\n|---|---|---|---|\n` +
      sourceLedger.map(s => `| ${s.source_id} | ${s.type} | ${s.title.replace(/\|/g, "\\|")} | ${s.url} |`).join("\n") + "\n";
  }

  const frontmatter = `---
article_id: ${p.id}
canonical_url: https://arif-fazil.com${p.dest.path}
seal: ${p.seal || "null"}
provenance_status: ${p.provenance_status || "legacy"}
version: ${p.version_lineage ? p.version_lineage.version : "1.0"}
merkle_leaf: ${payloadHash}
epistemic_summary:
  obs_count: ${obsCount}
  der_count: ${derCount}
  int_count: ${intCount}
  spec_count: ${specCount}
---

# ${p.title}

> ${p.excerpt || p.title}
> 
> Canonical URL: https://arif-fazil.com${p.dest.path}
${claimsTable}${sourcesTable}`;

  fs.writeFileSync(outFile, frontmatter);
}

console.log(`✓ Generated ${pieces.length} agentic markdown mirrors under public/makcikgpt-md/`);
