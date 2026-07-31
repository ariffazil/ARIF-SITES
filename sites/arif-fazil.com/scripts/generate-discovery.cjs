#!/usr/bin/env node
/**
 * generate-discovery.cjs — Single source of truth for sitemap + llms parity.
 *
 * Architecture (2026-07-31, post-autonomy pass):
 *   PRIMARY SOURCE:  /root/arif-fazil.com/sealed/federation-topology.json
 *                    (F13 sovereign file — drives routes, redirects, mission
 *                     surfaces, machine endpoints, freshness tiers)
 *   SECONDARY:       src/data/essays.json + scripts/lib/makcik-source.cjs
 *                    (MakcikGPT article set — bm + onsite canonical)
 *   RENDERS:         public/sitemap.xml
 *                    public/llms.txt
 *                    public/llms.json
 *                    public/page.json
 *                    + root copies of llms.json / page.json
 *
 * To add a new surface: edit federation-topology.json, run this script.
 * To add a new MakcikGPT article: edit essays.json, run this script + build.
 *
 * Single Source of Truth rule (F4 CLARITY):
 *   topology.json → this script → sitemap.xml + llms.{txt,json} + page.json
 *   essays.json   → lib/makcik-source.cjs → adds article URLs to sitemap
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
const CANONICAL_LANDING = `${SITE_BASE}/world/makcikgpt/`;
const LLMS_TXT_PATH = `${SITE_BASE}/llms.txt`;
const TOPOLOGY_PATH = "/root/arif-fazil.com/sealed/federation-topology.json";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function loadTopology() {
  if (!fs.existsSync(TOPOLOGY_PATH)) {
    console.error(`✗ FATAL: federation topology missing at ${TOPOLOGY_PATH}`);
    process.exit(1);
  }
  try {
    return JSON.parse(fs.readFileSync(TOPOLOGY_PATH, "utf8"));
  } catch (e) {
    console.error(`✗ FATAL: topology JSON parse failed: ${e.message}`);
    process.exit(1);
  }
}

// ── sitemap.xml ─────────────────────────────────────────────────────────
function buildSitemap(pieces, topology) {
  const today = todayISO();
  const urls = [];

  // 1. Home — highest priority
  urls.push({ loc: `${SITE_BASE}/`, priority: 1.0, changefreq: "monthly", lastmod: today });

  // 2. Topology-driven human surfaces (depth ≤ 2: domains, depth 3: leaves handled separately below)
  const topoEntries = Object.entries(topology.human_surfaces || {});
  for (const [key, surface] of topoEntries) {
    if (surface.path.includes(':slug')) continue; // slug templates not in sitemap
    if (surface.access_class === 'sovereign_only' && surface.path.includes('playbook')) {
      // include but lower priority (operations lane)
    }
    const priority =
      surface.click_depth_from_home === 1 ? 1.0 :
      surface.click_depth_from_home === 2 ? 0.8 :
      surface.click_depth_from_home === 3 ? 0.6 : 0.5;
    const changefreq =
      surface.kind === 'live_audit' ? 'daily' :
      surface.kind === 'commodity' ? 'daily' :
      surface.kind === 'civic_intelligence' ? 'daily' :
      surface.kind === 'civic_article' ? 'monthly' :
      surface.kind === 'cockpit' ? 'weekly' :
      surface.kind === 'constitutional_text' ? 'monthly' :
      surface.kind === 'essay_index' ? 'weekly' :
      'monthly';
    urls.push({ loc: `${SITE_BASE}${surface.path}`, priority, changefreq });
    // Trailing-slash duplicate for paths that end in /<slug> (avoid dup for /, /missions etc)
    if (!surface.path.endsWith('/') && !surface.path.includes(':slug')) {
      urls.push({ loc: `${SITE_BASE}${surface.path}/`, priority, changefreq });
    }
  }

  // 3. MakcikGPT canonical landing (alias of /world/makcikgpt)
  // Already added via topology; skip duplicate

  // 4. Every onsite MakcikGPT BM piece
  urls.push({ loc: CANONICAL_LANDING, priority: 0.85, changefreq: "daily" });
  for (const p of pieces) {
    urls.push({
      loc: `${SITE_BASE}${p.dest.path}`,
      priority: 0.7,
      changefreq: "monthly",
    });
  }

  // 5. Topology-driven machine surfaces
  const machineEntries = Object.entries(topology.machine_surfaces || {});
  for (const [key, m] of machineEntries) {
    const priority = m.priority || 0.5;
    const changefreq = m.changefreq || 'monthly';
    // Omit raw live telemetry endpoint from sitemap (privacy/SEO hygiene)
    if (key === 'ns_live_telemetry') continue;
    urls.push({ loc: `${SITE_BASE}${m.path}`, priority, changefreq });
  }

  // 6. Federation subdomains (cross-domain federation map)
  const subs = topology.federation_subdomains || {};
  for (const [key, sub] of Object.entries(subs)) {
    if (sub.url) urls.push({ loc: sub.url, priority: 0.5, changefreq: 'monthly' });
  }

  // Deduplicate by loc
  const seen = new Set();
  const deduped = urls.filter((u) => {
    if (seen.has(u.loc)) return false;
    seen.add(u.loc);
    return true;
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Auto-generated from /root/arif-fazil.com/sealed/federation-topology.json (as_of ${topology.as_of || today}) -->
  <!-- Human surface -->
${deduped
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
function buildLlmsTxt(pieces, topology) {
  // Section: "MakcikGPT — Civic Intelligence" with link list under
  // /world/makcikgpt/<slug> (the canonical landing path).
  const linkLines = pieces
    .map((p) => `- [${p.title}](${SITE_BASE}${p.dest.path})`)
    .join("\n");

  // Topology-driven Key Pages list (replace the hand-maintained section)
  const keyPages = Object.values(topology.human_surfaces || {})
    .filter((s) => s.click_depth_from_home <= 3 && !s.path.includes(':slug') && !s.access_class)
    .sort((a, b) => a.click_depth_from_home - b.click_depth_from_home)
    .map((s) => {
      const desc = s.label || s.kind || '';
      const alias = s.canonical_alias ? ` (alias of ${s.canonical_alias})` : '';
      const note = s.note ? ` — ${s.note}` : '';
      return `- \`${s.path}\` — ${desc}${alias}${note}`;
    })
    .join("\n");

  // Topology-driven machine surfaces
  const machineSurfaces = Object.entries(topology.machine_surfaces || {})
    .map(([key, m]) => `- \`${m.path}\` — ${m.kind}${m.rendered_by ? ` (${m.rendered_by})` : ''}`)
    .join("\n");

  // Freshness tier list
  const freshnessTiers = (topology.freshness_hierarchy?.tiers || [])
    .map((t) => `${t.tier}. ${t.label} — \`${t.example}\` (${t.refresh})`)
    .join("\n");

  return `# arif-fazil.com — Site Overview for AI Agents

## Auto-generated from /root/arif-fazil.com/sealed/federation-topology.json (as_of ${topology.as_of || todayISO()})

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

## Key Pages (auto-generated from topology — depth ≤ 3)
${keyPages}

## arifOS MCP Endpoint
- **Public MCP**: \`https://mcp.arif-fazil.com/mcp\` (streamable HTTP)
- **Health**: \`https://arifos.arif-fazil.com/health\`
- **Tools**: 8 canonical + diagnostics
- **Protocol**: MCP 2025-11-25
- **Constitution**: \`https://arifos.arif-fazil.com/constitution.json\`

## Machine-Readable Discovery (auto-generated from topology)
${machineSurfaces}

## Freshness Hierarchy (when timestamps disagree, newer overrides older)
${freshnessTiers}
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
function buildLlmsJson(pieces, topology) {
  const routeRoles = {};
  // Topology-driven routes (depth 1-2 only — deeper leaves go in page.json)
  for (const [key, surface] of Object.entries(topology.human_surfaces || {})) {
    if (surface.path.includes(':slug')) continue; // skip templates
    const alias = surface.canonical_alias ? ` (alias ${surface.canonical_alias})` : '';
    routeRoles[surface.path] = `${surface.label || surface.kind}${alias} — verb ${surface.verb}, organ ${surface.organ}${surface.note ? ' — ' + surface.note : ''}`;
  }
  // MakcikGPT BM pieces
  for (const p of pieces) {
    routeRoles[p.dest.path] = `MakcikGPT article — ${p.title}`;
  }
  // Legacy / alias paths — explicit notes so agents know the redirects
  routeRoles["/wealth/"] = "DEPRECATED ALIAS → /economics/ (still served via redirect)";
  routeRoles["/discoveries/"] = "DEPRECATED ALIAS → /earth/";
  routeRoles["/essays/"] = "DEPRECATED ALIAS → /writing/";
  routeRoles["/canon/"] = "DEPRECATED ALIAS → /doctrine/ (merged 2026-07-29)";
  routeRoles["/constellation/"] = "DEPRECATED ALIAS → /doctrine/";
  routeRoles["/federation/"] = "DEPRECATED ALIAS → /doctrine/";
  routeRoles["/verify/"] = "DEPRECATED ALIAS → /institution/";
  routeRoles["/compliance/"] = "DEPRECATED ALIAS → /institution/";
  routeRoles["/vitals/"] = "DEPRECATED ALIAS → /politics/ns-election/ (was wealth subdomain pre-2026-07-31)";
  routeRoles["/malaysia/"] = "DEPRECATED ALIAS → /politics/ns-election/";

  return {
    site_name: "arif-fazil.com",
    domain: "arif-fazil.com",
    role: "human homepage with genesis, proof, capital briefing, and civic intelligence subroutes",
    canonical: LLMS_TXT_PATH,
    repository: "https://github.com/ariffazil/arif-sites",
    route_roles: routeRoles,
    related_sites: Object.values(topology.federation_subdomains || {}).map((s) => s.url),
    machine_surfaces: Object.values(topology.machine_surfaces || {}).map((m) => `${SITE_BASE}${m.path}`),
    topology_source: "/root/arif-fazil.com/sealed/federation-topology.json",
    topology_as_of: topology.as_of,
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
      topology_driven: true,
    },
    last_updated: todayISO(),
  };
}

// ── page.json ───────────────────────────────────────────────────────────
function buildPageJson(topology) {
  const routeModel = {};
  for (const [key, surface] of Object.entries(topology.human_surfaces || {})) {
    if (surface.path.includes(':slug')) continue;
    routeModel[surface.path] = `${surface.kind || 'surface'} — ${surface.label || ''}`;
  }
  return {
    name: "arif-fazil.com",
    purpose:
      "Professional homepage for Arif Fazil, with canonical deeper layers for genesis, proof, and civic intelligence. Single source of truth: /root/arif-fazil.com/sealed/federation-topology.json.",
    audience: ["humans", "collaborators", "agents", "verifiers"],
    canonical_url: "https://arif-fazil.com/",
    topology_as_of: topology.as_of,
    route_model: routeModel,
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
    related_sites: Object.entries(topology.federation_subdomains || {}).map(([name, sub]) => ({
      name,
      url: sub.url,
      relationship: sub.role || '',
    })),
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
  const topology = loadTopology();
  console.log(`✓ topology loaded: as_of=${topology.as_of} (${Object.keys(topology.human_surfaces || {}).length} human + ${Object.keys(topology.machine_surfaces || {}).length} machine surfaces)`);

  const { pieces } = getMakcikSource();
  console.log(`✓ ${pieces.length} canonical MakcikGPT pieces (bm + onsite)`);

  // Write all four files
  writeIfChanged(
    path.join(SITE_ROOT, "public/sitemap.xml"),
    buildSitemap(pieces, topology),
  );
  writeIfChanged(
    path.join(SITE_ROOT, "public/llms.txt"),
    buildLlmsTxt(pieces, topology),
  );
  writeIfChanged(
    path.join(SITE_ROOT, "public/llms.json"),
    JSON.stringify(buildLlmsJson(pieces, topology), null, 2) + "\n",
  );
  writeIfChanged(
    path.join(SITE_ROOT, "public/page.json"),
    JSON.stringify(buildPageJson(topology), null, 2) + "\n",
  );

  // Keep the existing root-level JSON sources in sync for site tooling.
  for (const name of ["llms.json", "page.json"]) {
    const src = path.join(SITE_ROOT, `public/${name}`);
    const dst = path.join(SITE_ROOT, name);
    writeIfChanged(dst, fs.readFileSync(src, "utf8"));
  }
}

main();