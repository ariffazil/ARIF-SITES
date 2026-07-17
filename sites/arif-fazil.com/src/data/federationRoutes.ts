/**
 * Single route canon for arif-fazil.com human + agent discovery.
 * Navigation, sitemap, breadcrumbs, aliases and tests derive from this file.
 */

export type FederationDomain =
  | 'ARIF'
  | 'EARTH'
  | 'CAPITAL'
  | 'HUMAN'
  | 'ARIFOS'
  | 'WRITING';

export type FederationOrgan =
  | 'ROOT'
  | 'GEOX'
  | 'WEALTH'
  | 'WELL'
  | 'ARIFOS'
  | 'MAKCIKGPT';

export type NavVisibility = 'primary' | 'secondary' | 'related' | 'hidden';

export type FederationRoute = {
  id: string;
  title: string;
  shortTitle: string;
  path: string;
  aliases: string[];
  parentId: string | null;
  domain: FederationDomain;
  organ: FederationOrgan;
  audience: Array<'human' | 'agent' | 'developer' | 'institution'>;
  description: string;
  keywords: string[];
  canonicalUrl: string;
  external: boolean;
  public: boolean;
  navVisibility: NavVisibility;
  evidenceUrl?: string;
  status: 'live' | 'preview' | 'archived';
  ctaLabel?: string;
};

const ROOT = 'https://arif-fazil.com';

export const federationRoutes: FederationRoute[] = [
  {
    id: 'home',
    title: 'Arif Fazil — Sovereign Root',
    shortTitle: 'Arif',
    path: '/',
    aliases: [],
    parentId: null,
    domain: 'ARIF',
    organ: 'ROOT',
    audience: ['human', 'agent', 'developer', 'institution'],
    description: 'Human sovereign root: identity, three domains, and federation routing.',
    keywords: ['arif', 'fazil', 'home', 'sovereign'],
    canonicalUrl: `${ROOT}/`,
    external: false,
    public: true,
    navVisibility: 'primary',
    status: 'live',
  },
  // EARTH
  {
    id: 'oil',
    title: 'Oil — Earth Exploration & Capital Consequence',
    shortTitle: 'Oil',
    path: '/oil',
    aliases: ['/oil/'],
    parentId: 'home',
    domain: 'EARTH',
    organ: 'GEOX',
    audience: ['human', 'agent', 'institution'],
    description:
      'Oil exploration work, wells and discoveries, GEOX Earth evidence, and WEALTH oil-price consequence.',
    keywords: ['oil', 'petroleum', 'crude', 'wells', 'exploration', 'petronas'],
    canonicalUrl: `${ROOT}/oil`,
    external: false,
    public: true,
    navVisibility: 'secondary',
    evidenceUrl: 'https://geox.arif-fazil.com/',
    status: 'live',
    ctaLabel: 'Explore Oil Work',
  },
  {
    id: 'gas',
    title: 'Gas — Petroleum Systems & Energy Consequence',
    shortTitle: 'Gas',
    path: '/gas',
    aliases: ['/gas/', '/gass', '/gass/'],
    parentId: 'home',
    domain: 'EARTH',
    organ: 'GEOX',
    audience: ['human', 'agent', 'institution'],
    description:
      'Gas exploration and petroleum-system context, GEOX evidence, and WEALTH gas and energy consequence.',
    keywords: ['gas', 'gass', 'lng', 'natural gas', 'petroleum system'],
    canonicalUrl: `${ROOT}/gas`,
    external: false,
    public: true,
    navVisibility: 'secondary',
    evidenceUrl: 'https://geox.arif-fazil.com/',
    status: 'live',
    ctaLabel: 'Explore Gas Work',
  },
  {
    id: 'wells',
    title: 'Wells Portfolio',
    shortTitle: 'Wells',
    path: '/wells',
    aliases: ['/wells/'],
    parentId: 'home',
    domain: 'EARTH',
    organ: 'GEOX',
    audience: ['human', 'agent'],
    description: 'Public well portfolio and exploration work under real uncertainty.',
    keywords: ['wells', 'portfolio', 'bekantan', 'puteri', 'lebah'],
    canonicalUrl: `${ROOT}/wells`,
    external: false,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'See Wells Portfolio',
  },
  {
    id: 'discoveries',
    title: 'Discoveries',
    shortTitle: 'Discoveries',
    path: '/discoveries',
    aliases: ['/discoveries/'],
    parentId: 'home',
    domain: 'EARTH',
    organ: 'GEOX',
    audience: ['human', 'agent'],
    description: 'Subsurface discoveries and public evidence records.',
    keywords: ['discoveries', 'prospects', 'subsurface'],
    canonicalUrl: `${ROOT}/discoveries`,
    external: false,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'Read Discoveries',
  },
  {
    id: 'geox',
    title: 'GEOX — Earth Evidence Organ',
    shortTitle: 'GEOX',
    path: 'https://geox.arif-fazil.com/',
    aliases: [],
    parentId: 'home',
    domain: 'EARTH',
    organ: 'GEOX',
    audience: ['human', 'agent', 'developer'],
    description: 'Earth intelligence organ: wells, seismic, petrophysics. Evidence only.',
    keywords: ['geox', 'earth', 'geology', 'seismic'],
    canonicalUrl: 'https://geox.arif-fazil.com/',
    external: true,
    public: true,
    navVisibility: 'secondary',
    evidenceUrl: 'https://arifos.arif-fazil.com/',
    status: 'live',
    ctaLabel: 'Inspect GEOX Evidence',
  },
  // CAPITAL
  {
    id: 'gold',
    title: 'Gold — Capital Intelligence',
    shortTitle: 'Gold',
    path: '/gold',
    aliases: ['/gold/'],
    parentId: 'home',
    domain: 'CAPITAL',
    organ: 'WEALTH',
    audience: ['human', 'agent', 'institution'],
    description:
      'Why gold belongs to WEALTH. Capital intelligence surface — not investment advice.',
    keywords: ['gold', 'xau', 'bullion', 'capital', 'wealth'],
    canonicalUrl: `${ROOT}/gold`,
    external: false,
    public: true,
    navVisibility: 'secondary',
    evidenceUrl: 'https://wealth.arif-fazil.com/',
    status: 'live',
    ctaLabel: 'Read Gold Intelligence',
  },
  {
    id: 'wealth-organ',
    title: 'WEALTH — Capital Organ',
    shortTitle: 'WEALTH',
    path: 'https://wealth.arif-fazil.com/',
    aliases: [],
    parentId: 'home',
    domain: 'CAPITAL',
    organ: 'WEALTH',
    audience: ['human', 'agent', 'developer'],
    description: 'Capital intelligence organ. Computes value and risk. Does not allocate.',
    keywords: ['wealth', 'capital', 'npv', 'markets'],
    canonicalUrl: 'https://wealth.arif-fazil.com/',
    external: true,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'Open WEALTH Organ',
  },
  {
    id: 'wealth-page',
    title: 'Wealth Terminal (Root Surface)',
    shortTitle: 'Markets',
    path: '/wealth',
    aliases: ['/wealth/'],
    parentId: 'home',
    domain: 'CAPITAL',
    organ: 'WEALTH',
    audience: ['human', 'agent'],
    description: 'Root-domain capital surface and market briefings.',
    keywords: ['markets', 'briefing', 'wealth'],
    canonicalUrl: `${ROOT}/wealth`,
    external: false,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'Open Markets Surface',
  },
  // HUMAN
  {
    id: 'well',
    title: 'WELL — Human Substrate Organ',
    shortTitle: 'WELL',
    path: 'https://well.arif-fazil.com/',
    aliases: [],
    parentId: 'home',
    domain: 'HUMAN',
    organ: 'WELL',
    audience: ['human', 'agent'],
    description: 'Human and machine readiness. Reflect-only. Never a diagnostic authority.',
    keywords: ['well', 'vitality', 'readiness', 'human'],
    canonicalUrl: 'https://well.arif-fazil.com/',
    external: true,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'Open WELL Organ',
  },
  {
    id: 'makcikgpt',
    title: 'MakcikGPT — Civic Journalism',
    shortTitle: 'MakcikGPT',
    path: '/makcikgpt',
    aliases: [
      '/makcikgpt/',
      '/wealth/makcikgpt',
      '/wealth/makcikgpt/',
      '/makcik-gpt',
      '/makcik-gpt/',
      '/makcikpgt',
      '/makcikpgt/',
    ],
    parentId: 'home',
    domain: 'HUMAN',
    organ: 'MAKCIKGPT',
    audience: ['human', 'agent'],
    description: 'Civic journalism in Bahasa Malaysia. Public interpretation under evidence.',
    keywords: ['makcikgpt', 'makcik', 'bahasa', 'journalism', 'civic', 'petronas'],
    canonicalUrl: `${ROOT}/makcikgpt`,
    external: false,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'Open MakcikGPT',
  },
  // ARIFOS
  {
    id: 'arifos-overview',
    title: 'arifOS Overview',
    shortTitle: 'Overview',
    path: '/arifos',
    aliases: ['/arifos/'],
    parentId: 'home',
    domain: 'ARIFOS',
    organ: 'ARIFOS',
    audience: ['human', 'agent', 'developer', 'institution'],
    description: 'How GEOX, WEALTH and WELL relate under arifOS judgment.',
    keywords: ['arifos', 'governance', 'constitution'],
    canonicalUrl: `${ROOT}/arifos`,
    external: false,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'Understand arifOS',
  },
  {
    id: 'mcp',
    title: 'MCP Gateway — Connect arifOS',
    shortTitle: 'Connect MCP',
    path: 'https://mcp.arif-fazil.com/',
    aliases: ['/mcp', '/mcp/'],
    parentId: 'arifos-overview',
    domain: 'ARIFOS',
    organ: 'ARIFOS',
    audience: ['human', 'agent', 'developer'],
    description: 'Public governance MCP connection door.',
    keywords: ['mcp', 'connect', 'gateway', 'tools'],
    canonicalUrl: 'https://mcp.arif-fazil.com/',
    external: true,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'Connect arifOS MCP',
  },
  {
    id: 'observatory',
    title: 'Observatory — Reality Witness',
    shortTitle: 'Observatory',
    path: 'https://arifos.arif-fazil.com/',
    aliases: [],
    parentId: 'arifos-overview',
    domain: 'ARIFOS',
    organ: 'ARIFOS',
    audience: ['human', 'agent', 'developer'],
    description: 'Public evidence room. Proves what is running; does not execute tools.',
    keywords: ['observatory', 'evidence', 'witness'],
    canonicalUrl: 'https://arifos.arif-fazil.com/',
    external: true,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'Inspect Observatory',
  },
  {
    id: 'federation',
    title: 'Federation Map',
    shortTitle: 'Federation',
    path: '/federation',
    aliases: ['/federation/'],
    parentId: 'arifos-overview',
    domain: 'ARIFOS',
    organ: 'ARIFOS',
    audience: ['human', 'agent'],
    description: 'How Earth, Capital, Human and Governance domains relate.',
    keywords: ['federation', 'organs', 'map'],
    canonicalUrl: `${ROOT}/federation`,
    external: false,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'View Federation Map',
  },
  {
    id: 'canon',
    title: 'Canon',
    shortTitle: 'Canon',
    path: '/canon',
    aliases: ['/canon/'],
    parentId: 'arifos-overview',
    domain: 'ARIFOS',
    organ: 'ARIFOS',
    audience: ['human', 'agent', 'developer'],
    description: 'Constitutional and doctrinal canon.',
    keywords: ['canon', 'floors', 'constitution'],
    canonicalUrl: `${ROOT}/canon`,
    external: false,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'Read Canon',
  },
  {
    id: 'verify-999',
    title: 'Verify Receipt — /999',
    shortTitle: 'Verify Receipt',
    path: '/999',
    aliases: ['/999/', '/verify', '/verify/'],
    parentId: 'arifos-overview',
    domain: 'ARIFOS',
    organ: 'ARIFOS',
    audience: ['human', 'agent', 'developer', 'institution'],
    description: 'Permanent receipt verification surface.',
    keywords: ['999', 'receipt', 'verify', 'vault'],
    canonicalUrl: `${ROOT}/999`,
    external: false,
    public: true,
    navVisibility: 'secondary',
    status: 'live',
    ctaLabel: 'Verify a Receipt',
  },
  {
    id: 'genesis-000',
    title: 'Genesis /000 — Agent Notes',
    shortTitle: '/000',
    path: '/000',
    aliases: ['/000/'],
    parentId: 'home',
    domain: 'ARIFOS',
    organ: 'ARIFOS',
    audience: ['agent', 'developer'],
    description: 'Machine-facing scars, lessons and sovereign attestation.',
    keywords: ['000', 'genesis', 'agents'],
    canonicalUrl: `${ROOT}/000`,
    external: false,
    public: true,
    navVisibility: 'related',
    status: 'live',
  },
  // WRITING
  {
    id: 'essays',
    title: 'Writing & Essays',
    shortTitle: 'Writing',
    path: '/essays',
    aliases: ['/essays/'],
    parentId: 'home',
    domain: 'WRITING',
    organ: 'ROOT',
    audience: ['human', 'agent'],
    description: 'Essays and public writing.',
    keywords: ['essays', 'writing', 'papers'],
    canonicalUrl: `${ROOT}/essays`,
    external: false,
    public: true,
    navVisibility: 'primary',
    status: 'live',
    ctaLabel: 'Read Writing',
  },
  {
    id: 'constellation',
    title: 'Constellation',
    shortTitle: 'Constellation',
    path: '/constellation',
    aliases: ['/constellation/'],
    parentId: 'home',
    domain: 'ARIF',
    organ: 'ROOT',
    audience: ['human'],
    description: 'Ecosystem constellation map.',
    keywords: ['constellation', 'ecosystem'],
    canonicalUrl: `${ROOT}/constellation`,
    external: false,
    public: true,
    navVisibility: 'related',
    status: 'live',
  },
];

/** Primary top-level domains for desktop/mobile nav */
export const primaryNavDomains: Array<{
  domain: FederationDomain;
  label: string;
  homeId: string;
}> = [
  { domain: 'ARIF', label: 'Arif', homeId: 'home' },
  { domain: 'EARTH', label: 'Earth', homeId: 'oil' },
  { domain: 'CAPITAL', label: 'Capital', homeId: 'gold' },
  { domain: 'HUMAN', label: 'Human', homeId: 'makcikgpt' },
  { domain: 'ARIFOS', label: 'arifOS', homeId: 'arifos-overview' },
  { domain: 'WRITING', label: 'Writing', homeId: 'essays' },
];

export function getRouteById(id: string): FederationRoute | undefined {
  return federationRoutes.find((r) => r.id === id);
}

export function getRouteByPath(pathname: string): FederationRoute | undefined {
  const clean = pathname.replace(/\/+$/, '') || '/';
  return federationRoutes.find((r) => {
    if (r.external) return false;
    const p = r.path.replace(/\/+$/, '') || '/';
    if (p === clean) return true;
    return r.aliases.some((a) => (a.replace(/\/+$/, '') || '/') === clean);
  });
}

export function getChildren(parentId: string): FederationRoute[] {
  return federationRoutes.filter(
    (r) => r.parentId === parentId && r.navVisibility !== 'hidden' && r.public,
  );
}

export function getDomainRoutes(domain: FederationDomain): FederationRoute[] {
  return federationRoutes.filter(
    (r) => r.domain === domain && r.navVisibility === 'secondary' && r.public,
  );
}

export function getPrimaryNavItems(): FederationRoute[] {
  return primaryNavDomains
    .map((d) => getRouteById(d.homeId))
    .filter((r): r is FederationRoute => Boolean(r));
}

export function getBreadcrumb(pathname: string): FederationRoute[] {
  const route = getRouteByPath(pathname);
  if (!route) return [getRouteById('home')!].filter(Boolean);
  const chain: FederationRoute[] = [route];
  let cur: FederationRoute | undefined = route;
  while (cur?.parentId) {
    const parent = getRouteById(cur.parentId);
    if (!parent) break;
    chain.unshift(parent);
    cur = parent;
  }
  if (chain[0]?.id !== 'home') {
    const home = getRouteById('home');
    if (home) chain.unshift(home);
  }
  return chain;
}

export function getRelated(routeId: string, limit = 3): FederationRoute[] {
  const route = getRouteById(routeId);
  if (!route) return [];
  return federationRoutes
    .filter(
      (r) =>
        r.id !== routeId &&
        r.public &&
        r.navVisibility !== 'hidden' &&
        (r.domain === route.domain || r.organ === route.organ || r.domain === 'ARIFOS'),
    )
    .slice(0, limit);
}

/** Alias map for React Router Navigate */
export function getAliasRedirects(): Array<{ from: string; to: string }> {
  const out: Array<{ from: string; to: string }> = [];
  for (const r of federationRoutes) {
    if (r.external && r.aliases.length) {
      // external canonical — aliases still land on internal redirect pages when possible
      for (const a of r.aliases) {
        out.push({ from: a, to: r.path });
      }
      continue;
    }
    for (const a of r.aliases) {
      const from = a.endsWith('/') && a.length > 1 ? a.slice(0, -1) : a;
      const to = r.path.endsWith('/') && r.path.length > 1 ? r.path.slice(0, -1) : r.path;
      if (from !== to) out.push({ from, to });
      // also register trailing slash form
      if (!a.endsWith('/')) out.push({ from: a + '/', to });
    }
  }
  // dedupe
  const seen = new Set<string>();
  return out.filter((x) => {
    const k = x.from;
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

export function searchRoutes(query: string): FederationRoute[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return federationRoutes
    .filter((r) => r.public)
    .map((r) => {
      const hay = [r.title, r.shortTitle, r.description, r.path, ...r.keywords, ...r.aliases]
        .join(' ')
        .toLowerCase();
      let score = 0;
      if (r.shortTitle.toLowerCase() === q) score += 100;
      if (r.path.replace(/^\//, '') === q) score += 90;
      if (r.keywords.some((k) => k === q)) score += 80;
      if (hay.includes(q)) score += 20;
      q.split(/\s+/).forEach((part) => {
        if (hay.includes(part)) score += 5;
      });
      return { r, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.r);
}

export const federationFooterRoles = [
  { domain: 'EARTH', name: 'GEOX', href: 'https://geox.arif-fazil.com/' },
  { domain: 'CAPITAL', name: 'WEALTH', href: 'https://wealth.arif-fazil.com/' },
  { domain: 'READINESS', name: 'WELL', href: 'https://well.arif-fazil.com/' },
  { domain: 'GOVERNANCE', name: 'arifOS', href: '/arifos' },
  { domain: 'CONNECTION', name: 'MCP Gateway', href: 'https://mcp.arif-fazil.com/' },
  { domain: 'PROOF', name: 'Observatory · /999', href: 'https://arifos.arif-fazil.com/' },
  { domain: 'SOVEREIGN', name: 'Arif Fazil', href: '/' },
] as const;

/** Two-click targets from homepage */
export const twoClickTargets = [
  'oil',
  'gas',
  'gold',
  'makcikgpt',
  'geox',
  'wealth-organ',
  'well',
  'mcp',
  'observatory',
  'verify-999',
] as const;
