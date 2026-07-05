export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type WellItem = {
  name: string;
  playType: string;
  basin: string;
  summary: string;
  role: string;
  impact: string;
  publicStatus: string;
  sourceLabel: string;
  sourceHref: string;
  placeholderLabel?: string;
};

export type SystemProject = {
  title: string;
  role: string;
  status: 'LIVE' | 'MIXED' | 'SCAFFOLD';
  summary: string;
  artifactLabel: string;
  artifactHref: string;
  surfaceLabel: string;
  surfaceHref: string;
  placeholderLabel?: string;
};

export const primaryLinks: LinkItem[] = [
  { label: 'Wells', href: '/#wells' },
  { label: 'Systems', href: '/#systems' },
  { label: 'Practice', href: '/#practice' },
  { label: 'Contact', href: '/#contact' },
  { label: '/000', href: '/000/' },
  { label: '/999', href: '/999/' },
  { label: '/wealth', href: '/wealth/' },
  { label: 'Writing', href: '/essays/' },
];

// Plain — no scores, no stats, no framing
export const trustStrip = [
  'PETRONAS Carigali, offshore Malaysia',
  'Geology, geophysics, and a bit of economics',
  'I build things when the work calls for it',
];

export const scaleLegend = [
  'This page is for humans',
  '/000 is for AI and agents — notes and context',
  '/999 is verification and machine-facing content',
];

export const wellsPortfolio: WellItem[] = [
  {
    name: 'BEKANTAN-1',
    playType: 'Structural',
    basin: 'Malay Basin',
    summary: 'Structural test in a basin people said was played out.',
    role: 'Prospect evaluation and structural framing.',
    impact: 'Flowed oil — among the shallowest in the basin. Made people reconsider what was left.',
    publicStatus: 'public record',
    sourceLabel: 'GitHub',
    sourceHref: 'https://github.com/ariffazil',
    placeholderLabel: 'Technical pack withheld',
  },
  {
    name: 'PUTERI BASEMENT-1',
    playType: 'Fractured basement',
    basin: 'Malay Basin',
    summary: 'First test of pre-Tertiary reservoirs in the area.',
    role: 'Basement prospect maturation and structural analysis.',
    impact: 'Showed the play could work. Later tied to PM318 PSC value.',
    publicStatus: 'public record',
    sourceLabel: 'GitHub',
    sourceHref: 'https://github.com/ariffazil',
    placeholderLabel: 'Subsurface sections withheld',
  },
  {
    name: 'LEBAH EMAS-1',
    playType: 'New play concept',
    basin: 'Offshore Terengganu · Block PM6/12',
    summary: 'Wildcat in a place nobody was betting on. 11 hydrocarbon-bearing reservoirs confirmed a working petroleum system.',
    role: 'Prospect framing and discovery support.',
    impact: 'Opened a new play in a basin everyone had written off. Block later reframed as "mature asset"; 30% interest in PM6/12 farmed out to EnQuest (2026 US$833M deal). Discovery legacy folded into transaction — footnote in others\' slide decks.',
    publicStatus: 'public record — scar documented',
    sourceLabel: 'GitHub',
    sourceHref: 'https://github.com/ariffazil',
    placeholderLabel: 'Full technical pack and internal ranking withheld',
  },
  {
    name: 'BUNGA TASBIH-1',
    playType: 'Structural / stratigraphic',
    basin: 'Malaysia Bid Round Plus',
    summary: 'Contribution to a discovered resource opportunity.',
    role: 'Opportunity evaluation and risk assessment.',
    impact: 'Field awarded under a Small Field Asset PSC in MBR+ Round I, 2024.',
    publicStatus: 'public record',
    sourceLabel: 'GitHub',
    sourceHref: 'https://github.com/ariffazil',
    placeholderLabel: 'Award-phase details withheld',
  },
];

export const practiceAreas = [
  'Basin analysis and prospect work under real uncertainty.',
  'Structural interpretation and reading signals in noisy data.',
  'Decisions where knowing what you don\'t know matters more than the model.',
];

export const publicRecord = [
  'Worked in Sabah and Malay Basin at PETRONAS Carigali.',
  'Education: geology/geophysics and economics, UW–Madison.',
  'Built arifOS because the geology work demanded it.',
];

export const systemProjects: SystemProject[] = [
  {
    title: 'arifOS',
    role: 'Constitutional AI kernel · F1–F13 floors',
    status: 'LIVE',
    summary:
      'Philosophy: Sovereign human veto must be absolute. Engineering: Pre-execution constraints validate all dynamic tool leases. Verification: Live cognitive test harness verifies 42/42 validation floors.',
    artifactLabel: 'Constitution',
    artifactHref: 'https://arifos.arif-fazil.com/constitution.json',
    surfaceLabel: 'Observatory',
    surfaceHref: 'https://arifos.arif-fazil.com',
  },
  {
    title: 'GEOX',
    role: 'Earth intelligence · Physics-9 witness',
    status: 'LIVE',
    summary:
      'Philosophy: Subsurface evidence precedes model confidence. Engineering: Contrast theory heatmaps process raw seismic and well-log payloads. Verification: Core lithology classification tests validated against public basin records.',
    artifactLabel: 'App registry',
    artifactHref: 'https://geox.arif-fazil.com/apps.json',
    surfaceLabel: 'GEOX surface',
    surfaceHref: 'https://geox.arif-fazil.com',
  },
  {
    title: 'WEALTH',
    role: 'Capital intelligence · NPV / EMV engine',
    status: 'LIVE',
    summary:
      'Philosophy: Capital obeys thermodynamic limits, not narratives. Engineering: NPV/EMV valuation engine built on 13 cash flow primitives. Verification: Historical pipeline runs audited against verified bursa financial statements.',
    artifactLabel: 'Tool registry',
    artifactHref: 'https://aaa.arif-fazil.com/mcp/tools.json',
    surfaceLabel: 'Daily briefing',
    surfaceHref: '/wealth/',
  },
  {
    title: 'AAA',
    role: 'Operations surface · Agent gateway',
    status: 'LIVE',
    summary:
      'Philosophy: Trust must be explicit and structural, not ambient. Engineering: A2A gateways require valid bearer credentials and issue HOLD/SEAL tokens. Verification: Dynamic-state checks verify process live port bounds.',
    artifactLabel: 'Endpoint metadata',
    artifactHref: 'https://aaa.arif-fazil.com/mcp/endpoint.json',
    surfaceLabel: 'AAA cockpit',
    surfaceHref: 'https://aaa.arif-fazil.com',
  },
  {
    title: 'WELL',
    role: 'Vitality mirror · Substrate health monitor',
    status: 'LIVE',
    summary:
      'Philosophy: Technology must protect operator dignity, not bypass it. Engineering: Passive telemetry surfaces cognitive and metabolic pressure trends. Verification: Read-only check guarantees prevent any automated feedback execution.',
    artifactLabel: 'Health endpoint',
    artifactHref: 'https://well.arif-fazil.com/health',
    surfaceLabel: 'WELL surface',
    surfaceHref: 'https://well.arif-fazil.com',
  },
  {
    title: 'A-FORGE',
    role: 'Metabolic shell · Engineering actuator',
    status: 'LIVE',
    summary:
      'Philosophy: Execution has no independent legislative authority. Engineering: Strict task graphs execute mutations only when a valid SEAL is present. Verification: Local git status and build checks run automatically before deployment.',
    artifactLabel: 'Health endpoint',
    artifactHref: 'https://forge.arif-fazil.com/health',
    surfaceLabel: 'A-FORGE surface',
    surfaceHref: 'https://forge.arif-fazil.com',
  },
];

export const ecosystemLinks: LinkItem[] = [
  { label: '/ — home', href: '/' },
  { label: '/000 — genesis', href: '/000/' },
  { label: '/999 — proof', href: '/999/' },
  { label: '/discoveries', href: '/discoveries/' },
  { label: '/constellation', href: '/constellation/' },
  { label: '/wealth', href: '/wealth/' },
  { label: '/canon', href: '/canon/' },
  { label: '/essays', href: '/essays/' },
  { label: 'wiki', href: 'https://wiki.arif-fazil.com', external: true },
];

export const arifosLinks: LinkItem[] = [
  { label: 'Observatory', href: 'https://arifos.arif-fazil.com', external: true },
  { label: 'MCP Gateway', href: 'https://mcp.arif-fazil.com', external: true },
  { label: 'GEOX', href: 'https://geox.arif-fazil.com', external: true },
  { label: 'AAA Cockpit', href: 'https://aaa.arif-fazil.com', external: true },
  { label: 'WEALTH Briefing', href: '/wealth/' },
  { label: 'MakcikGPT', href: '/wealth/makcikgpt/' },
  { label: 'WELL Vitality', href: 'https://well.arif-fazil.com', external: true },
  { label: 'A-FORGE', href: 'https://forge.arif-fazil.com', external: true },
];

export const contactLinks: LinkItem[] = [
  { label: 'GitHub / ariffazil', href: 'https://github.com/ariffazil', external: true },
  { label: 'Telegram / ariffazil', href: 'https://t.me/ariffazil', external: true },
  { label: 'Email', href: 'mailto:arifbfazil@gmail.com', external: true },
];