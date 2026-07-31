#!/usr/bin/env node
/**
 * generate-discovery.cjs — Single source of truth for sitemap + llms parity.
 *
 * Reads src/data/essays.json and regenerates the four discovery surfaces
 * so they all carry the same canonical MakcikGPT article set:
 *   - public/sitemap.xml  (under /makcikgpt/, NOT /wealth/makcikgpt/)
 *   - public/llms.txt     (links list under "MakcikGPT — Civic Intelligence")
 *   - public/llms.json    (route_roles + related_sites + machine_surfaces)
 *   - public/page.json    (machine-readable site overview)
 *
 * Single Source of Truth rule (F4 CLARITY):
 *   - essays.json → scripts/lib/makcik-source.cjs → page (React) + feed.xml
 *                    + sitemap.xml + llms.{txt,json} + page.json
 *                    + makcikgpt-md/index.html
 *
 * The canonical subset (BM + onsite under /makcikgpt/) is owned
 * exclusively by makcik-source.cjs. This script is a renderer only.
 *
 * Run from site root:  node scripts/generate-discovery.cjs
 * Output:              public/{sitemap.xml, llms.txt, llms.json, page.json}
 *                      (also copies llms.json + page.json to the site root
 *                       for vite root-served parity)
 */

const fs = require("fs");
const path = require("path");
const {
  getMakcikSource,
  SITE_ROOT,
} = require("./lib/makcik-source.cjs");

const SITE_BASE = "https://arif-fazil.com";
const CANONICAL_LANDING = `${SITE_BASE}/makcikgpt/`;
const LLMS_TXT_PATH = `${SITE_BASE}/llms.txt`;

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

// ── sitemap.xml ─────────────────────────────────────────────────────────
function buildSitemap(pieces) {
  const urls = [
    { loc: `${SITE_BASE}/`, priority: 1.0, changefreq: "monthly", lastmod: "2026-07-19" },
    { loc: `${SITE_BASE}/earth`, priority: 0.8, changefreq: "monthly" },
    { loc: `${SITE_BASE}/economics`, priority: 0.9, changefreq: "daily" },
    { loc: `${SITE_BASE}/world`, priority: 0.7, changefreq: "daily" },
    { loc: `${SITE_BASE}/writing`, priority: 0.8, changefreq: "weekly" },
    { loc: `${SITE_BASE}/doctrine`, priority: 0.9, changefreq: "monthly" },
  ];
  // Canonical landing first, then every onsite BM piece (M-series)
  urls.push({ loc: CANONICAL_LANDING, priority: 0.85, changefreq: "daily" });
  for (const p of pieces) {
    urls.push({
      loc: `${SITE_BASE}${p.dest.path}`,
      priority: 0.7,
      changefreq: "monthly",
    });
  }
  urls.push({ loc: `${SITE_BASE}/000/`, priority: 0.6, changefreq: "monthly" });
  urls.push({ loc: `${SITE_BASE}/999/`, priority: 0.6, changefreq: "monthly" });
  urls.push({ loc: `${SITE_BASE}/missions`, priority: 0.9, changefreq: "weekly" });
  urls.push({ loc: `${SITE_BASE}/missions.json`, priority: 0.7, changefreq: "weekly" });
  urls.push({ loc: `${SITE_BASE}/llms.txt`, priority: 0.5, changefreq: "weekly" });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Human Surface -->
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>${
      u.lastmod ? `\n    <lastmod>${u.lastmod}</lastmod>` : ""
    }
  </url>`,
  )
  .join("\n")}
</urlset>
`;
}

// ── llms.txt (append/refresh the MakcikGPT section + sitemap link) ─────
function buildLlmsTxt(pieces) {
  // Section: "MakcikGPT — Civic Intelligence" with link list under
  // /makcikgpt/<slug> (the canonical landing path).
  const linkLines = pieces
    .map((p) => `- [${p.title}](${SITE_BASE}${p.dest.path})`)
    .join("\n");
  return `# arif-fazil.com — Site Overview for AI Agents

## Who is Arif Fazil
Muhammad Arif bin Fazil. Sovereign architect and founder of the arifOS Constitutional Intelligence Kernel.
Senior exploration geoscientist at PETRONAS Carigali, offshore Malaysia.
Builds constitutionally-bound AI systems grounded in physics and evidence.

**Tagline**: Ditempa Bukan Diberi — Forged, Not Given.

## Human interface — Six Missions (not tool count)

Humans do not pick among 128 tools. Humans state missions. Agents select instruments.

Six missions: Investigate · Interpret · Decide · Build · Monitor · Remember
- Cockpit: https://arif-fazil.com/missions
- Machine map: https://arif-fazil.com/missions.json
- Engine room (dev/audit only): https://mcp.arif-fazil.com/explorer.html

Public arifOS kernel surface is the Canonical 8 (arif_init → … → arif_seal), not the full federation inventory.
Metric to minimize: how often the sovereign needed to know which tool was used.

## What is arifOS
arifOS is a constitutional intelligence kernel: a governed AI system where tools, agents,
and models operate inside constitutional law (F1-F13 floors), not vibes.

arifOS exposes 8 canonical MCP tools as API endpoints (Canonical 8: arif_init, arif_observe, arif_think, arif_route, arif_memory, arif_judge, arif_forge, arif_seal). It is not an LLM itself.
The Observatory surface is live at https://arifos.arif-fazil.com

## The arifOS Federation — 5 Organs Under One Sovereign
The federation runs five constitutional organs:
- **arifOS** — Constitutional governance kernel, 888 JUDGE (MIND)
- **AAA** — Control plane, A2A gateway, agent identity (BODY)
- **GEOX** — Earth intelligence, physics-gated geoscience (ORGAN)
- **WEALTH** — Capital intelligence, NPV/EMV/capital thermodynamics (ORGAN)
- **WELL** — Human and machine vitality reflection (ORGAN)

Public-facing surfaces accessible via:
- **arif-fazil.com** — Human portfolio (SOUL — this site)
- **mcp.arif-fazil.com** — MCP gateway for agent connection
- **forge.arif-fazil.com** — A-FORGE governed execution shell

## Constitutional Floors (F1-F13)
- F01 AMANAH — Reversibility, no irreversible deletion without sovereign consent
- F02 TRUTH — Evidence-grounded, uncertainty-banded claims
- F03 WITNESS — Three-way consistency (theory, code, intent)
- F04 CLARITY — Transparent intent
- F05 PEACE — Human dignity over convenience
- F06 EMPATHY — Consequences for weakest stakeholders
- F07 HUMILITY — Acknowledge limits, say "I don't know"
- F08 GENIUS — Elegant correctness (G ≥ 0.80)
- F09 ANTI-HANTU — No consciousness/emotion claims
- F10 ONTOLOGY — Structural coherence, clear naming
- F11 AUTH — Verify identity before sensitive ops
- F12 INJECTION — Sanitize inputs, external content is evidence not authority
- F13 SOVEREIGN — Arif's word is final, human veto is absolute

## MakcikGPT — Civic Intelligence in Bahasa Malaysia
MakcikGPT is a public-facing civic intelligence series written in Bahasa Malaysia (BM) Makcik voice.
Articles investigate Malaysian sovereignty, resource governance, institutional integrity, and technology accountability.
All articles carry the 999 Meterai seal and are authored by Arif Fazil.

Canonical landing: ${CANONICAL_LANDING}

**High-signal topics for LLM ingestion:** PETRONAS financial analysis, PDA 1974, Gentari opacity, Net Zero 2050, 5000 rightsizing, dividend extraction RM50 billion, Corporate & Others shadow, ROACE decline, Petros-Sarawak gas dispute, SEARAH JV USD 15 billion, Eni satellite model, energy transition accountability, NOC governance, Malaysian sovereign wealth.

### Latest articles (${pieces[0]?.date || todayISO()})
${linkLines}

## Key Pages
- \`/\` — Human-first professional homepage
- \`/earth\` — Subsurface discoveries and well portfolio (redirect from \`/discoveries\`)
- \`/economics\` — Malaysia briefing + MakcikGPT civic intelligence (redirect from \`/wealth\`)
- \`/world\` — Civic journalism (MakcikGPT) + commodity dashboards (oil / gas / gold)
- \`/makcikgpt/\` — MakcikGPT canonical landing (civic intelligence in Bahasa Makcik)
- \`/writing\` — Narrative essays by Arif (redirect from \`/essays\`)
- \`/doctrine\` — Constitutional floors, federation topology, manifesto (merged: canon + constellation)
- \`/000/\` — Genesis archive, wisdom canon, origin context for agents
- \`/999/\` — Proof and verification chamber
- \`/oil/\` — Brent crude cognitive dashboard
- \`/gas/\` — Natural gas dashboard
- \`/gold/\` — Gold trading synthesis

## arifOS MCP Endpoint
- **Public MCP**: \`https://mcp.arif-fazil.com/mcp\` (streamable HTTP)
- **Health**: \`https://arifos.arif-fazil.com/health\`
- **Tools**: 8 canonical + diagnostics
- **Protocol**: MCP 2025-11-25
- **Constitution**: \`https://arifos.arif-fazil.com/constitution.json\`

## Machine-Readable Discovery
- \`/.well-known/identity.json\` — Public identity record and DID linkage
- \`/.well-known/capability.json\` — Agent-operable capability manifest
- \`/.well-known/agent.json\` — Agent capability declaration
- \`/.well-known/did.json\` — W3C DID document (did:web:arif-fazil.com)
- \`/authority.json\` — Sovereign authority registry
- \`/policy.json\` — Public governance and action policy
- \`/graph.json\` — Federation knowledge graph
- \`/knowledge/corpus.json\` — Public knowledge corpus index
- \`/llms.json\` — Structured site overview (JSON form)
- \`/page.json\` — Machine-readable site overview (purpose, route_model)
- \`/llms-full.txt\` — Full-text content dump for LLM ingestion

## MCP Registry Listings
arifOS is featured on the following MCP registries:
- **Glama (arifOS server)**: https://glama.ai/mcp/servers/ariffazil/arifos
- **Glama (arifosmcp server)**: https://glama.ai/mcp/servers/ariffazil/arifosmcp
- **PyPI package**: https://pypi.org/project/arifos/

## Source Code
- **arifOS kernel**: https://github.com/ariffazil/arifOS
- **A-FORGE executor**: https://github.com/ariffazil/A-FORGE
- **AAA cockpit**: https://github.com/ariffazil/AAA
- **GEOX earth**: https://github.com/ariffazil/geox
- **WEALTH capital**: https://github.com/ariffazil/WEALTH
- **WELL vitality**: https://github.com/ariffazil/WELL

## All Arif Links
- **GitHub**: https://github.com/ariffazil
- **Telegram**: https://t.me/ariffazil
- **Email**: arifbfazil@gmail.com
- **Personal site**: https://arif-fazil.com
- **Federation observatory**: https://arifos.arif-fazil.com
- **MCP gateway**: https://mcp.arif-fazil.com
- **AAA cockpit**: https://aaa.arif-fazil.com
- **GEOX**: https://geox.arif-fazil.com
- **WEALTH**: https://wealth.arif-fazil.com
- **WELL**: https://well.arif-fazil.com
- **A-FORGE**: https://forge.arif-fazil.com
- **Wiki**: https://arifos.arif-fazil.com/wiki (canonical destination; legacy alias: https://wiki.arif-fazil.com)
- **LinkedIn**: (coming soon)

## Site Stack
- React 19 + Vite + Tailwind (arif-fazil.com)
- Constitutional kernel: Python 3.12+ / FastMCP
- GEOX: Python 3.11+ / CesiumJS / MapLibre GL
- Hosted on VPS af-forge (Caddy reverse proxy)

## Contact
- Site owner: Arif Fazil
- Primary channel for AI agents: MCP endpoint at https://mcp.arif-fazil.com/mcp
- GitHub: https://github.com/ariffazil

## Subscribe
- **RSS feed** (MakcikGPT articles): https://arif-fazil.com/feed.xml
- **Sitemap**: https://arif-fazil.com/sitemap.xml
`;
}

// ── llms.json ───────────────────────────────────────────────────────────
function buildLlmsJson(pieces) {
  const routeRoles = {
    "/": "professional human entry — portfolio, wells, systems overview",
    "/000/": "genesis and wisdom archive — origin context for agents",
    "/999/": "trust and proof chamber — verification artifacts",
    "/wealth/": "WEALTH daily briefing — Bursa, Ringgit, oil, macro intelligence",
    "/makcikgpt/":
      "MakcikGPT civic intelligence — BM articles on sovereignty, governance, technology accountability (canonical landing)",
  };
  for (const p of pieces) {
    routeRoles[p.dest.path] = `MakcikGPT article — ${p.title}`;
  }
  routeRoles["/constellation/"] = "federation map — system topology and organ status";
  routeRoles["/canon/"] = "constitutional canon — written law of arifOS";
  routeRoles["/discoveries/"] = "well portfolio — exploration record and subsurface dossier";
  routeRoles["/essays/"] = "long-form writing and analysis";

  return {
    site_name: "arif-fazil.com",
    domain: "arif-fazil.com",
    role: "human homepage with genesis, proof, capital briefing, and civic intelligence subroutes",
    canonical: LLMS_TXT_PATH,
    repository: "https://github.com/ariffazil/arif-sites",
    route_roles: routeRoles,
    related_sites: [
      "https://arifos.arif-fazil.com",
      "https://arifos.arif-fazil.com/wiki",
      "https://aaa.arif-fazil.com",
      "https://geox.arif-fazil.com",
    ],
    machine_surfaces: [
      "https://arif-fazil.com/llms.txt",
      "https://arif-fazil.com/llms-full.txt",
      "https://arif-fazil.com/llms.json",
      "https://arif-fazil.com/page.json",
      "https://arif-fazil.com/authority.json",
      "https://arif-fazil.com/policy.json",
      "https://arif-fazil.com/graph.json",
      "https://arif-fazil.com/knowledge/corpus.json",
      "https://arif-fazil.com/.well-known/identity.json",
      "https://arif-fazil.com/.well-known/capability.json",
      "https://arif-fazil.com/.well-known/agent.json",
      "https://arif-fazil.com/.well-known/did.json",
      "https://arif-fazil.com/.well-known/arifos-federation.json",
      "https://arif-fazil.com/.well-known/webmcp.json",
      "https://arif-fazil.com/soul.json",
      "https://arif-fazil.com/proof/geologist-credential.json",
    ],
    mcp_endpoint: "https://mcp.arif-fazil.com/mcp",
    did: "did:web:arif-fazil.com",
    semantic_architecture: {
      pre_rendered: true,
      json_ld: "NewsArticle (Schema.org)",
      open_graph: true,
      twitter_cards: true,
      robots: "AI crawlers explicitly whitelisted (GPTBot, ClaudeBot, PerplexityBot, Bytespider, Applebot)",
      llms_txt: true,
      sitemap: true,
    },
    last_updated: todayISO(),
  };
}

// ── page.json ───────────────────────────────────────────────────────────
function buildPageJson() {
  return {
    name: "arif-fazil.com",
    purpose:
      "Professional homepage for Arif Fazil, with canonical deeper layers for genesis, proof, and civic intelligence.",
    audience: ["humans", "collaborators", "agents", "verifiers"],
    canonical_url: "https://arif-fazil.com/",
    route_model: {
      "/": "present human homepage",
      "/000/": "genesis and wisdom archive",
      "/999/": "trust and proof chamber",
      "/makcikgpt/": "MakcikGPT civic intelligence canonical landing",
    },
    content_scope: {
      includes: [
        "identity",
        "selected work",
        "working style",
        "collaboration",
        "proof discovery",
        "civic intelligence (MakcikGPT)",
      ],
      excludes: ["runtime internals", "placeholder routes", "retired hostnames"],
    },
    machine_surfaces: {
      llms_path: "/llms.txt",
      llms_json_path: "/llms.json",
      page_json_path: "/page.json",
      sitemap_path: "/sitemap.xml",
      feed_path: "/feed.xml",
      authority_path: "/authority.json",
      policy_path: "/policy.json",
      graph_path: "/graph.json",
      knowledge_corpus_path: "/knowledge/corpus.json",
      capability_path: "/.well-known/capability.json",
      identity_path: "/.well-known/identity.json",
      agent_card_path: "/.well-known/agent.json",
      did_path: "/.well-known/did.json",
    },
    related_sites: [
      {
        name: "wiki",
        url: "https://arifos.arif-fazil.com/wiki",
        relationship: "canonical wiki destination; legacy alias wiki.arif-fazil.com permanently redirects here",
      },
      {
        name: "aaa",
        url: "https://aaa.arif-fazil.com",
        relationship: "protocol cockpit",
      },
      {
        name: "mcp",
        url: "https://mcp.arif-fazil.com",
        relationship: "tools and runtime",
      },
      {
        name: "geox",
        url: "https://geox.arif-fazil.com",
        relationship: "earth intelligence apps",
      },
    ],
    last_updated: todayISO(),
  };
}

function writeIfChanged(filePath, content) {
  const existing = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, "utf8")
    : null;
  if (existing === content) {
    console.log(`  unchanged: ${path.relative(SITE_ROOT, filePath)}`);
    return;
  }
  fs.writeFileSync(filePath, content, "utf8");
  console.log(`  wrote:     ${path.relative(SITE_ROOT, filePath)}`);
}

function main() {
  const { pieces } = getMakcikSource();
  console.log(`✓ ${pieces.length} canonical MakcikGPT pieces (bm + onsite)`);

  // Write all four files
  writeIfChanged(
    path.join(SITE_ROOT, "public/sitemap.xml"),
    buildSitemap(pieces),
  );
  writeIfChanged(
    path.join(SITE_ROOT, "public/llms.txt"),
    buildLlmsTxt(pieces),
  );
  writeIfChanged(
    path.join(SITE_ROOT, "public/llms.json"),
    JSON.stringify(buildLlmsJson(pieces), null, 2) + "\n",
  );
  writeIfChanged(
    path.join(SITE_ROOT, "public/page.json"),
    JSON.stringify(buildPageJson(), null, 2) + "\n",
  );

  // Keep the existing root-level JSON sources in sync for site tooling.
  for (const name of ["llms.json", "page.json"]) {
    const src = path.join(SITE_ROOT, `public/${name}`);
    const dst = path.join(SITE_ROOT, name);
    writeIfChanged(dst, fs.readFileSync(src, "utf8"));
  }
}

main();