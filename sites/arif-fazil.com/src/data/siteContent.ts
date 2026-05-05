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
  { label: 'Wells', href: '#wells' },
  { label: 'Systems', href: '#systems' },
  { label: 'Practice', href: '#practice' },
  { label: 'Contact', href: '#contact' },
  { label: '/000', href: '/000/' },
  { label: '/999', href: '/999/' },
  { label: '/wealth', href: '/wealth/' },
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
    summary: 'Wildcat in a place nobody was betting on.',
    role: 'Prospect framing and discovery support.',
    impact: 'Opened a new play in a basin everyone had written off.',
    publicStatus: 'public record',
    sourceLabel: 'GitHub',
    sourceHref: 'https://github.com/ariffazil',
    placeholderLabel: 'Internal ranking material withheld',
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
      'A sovereign AI governance kernel. 13 constitutional floors enforce truth, reversibility, and bounded action. Every tool call is traced to a floor. Every outcome is sealed to VAULT999. Built because the geology work demanded tools that don\'t hallucinate or hide their reasoning.',
    artifactLabel: 'Constitution',
    artifactHref: 'https://mcp.arif-fazil.com/constitution.json',
    surfaceLabel: 'Runtime surface',
    surfaceHref: 'https://mcp.arif-fazil.com',
  },
  {
    title: 'GEOX',
    role: 'Earth intelligence · Physics-9 witness',
    status: 'LIVE',
    summary:
      'Geology and geophysics tools that take physics seriously. Basin analysis, well log interpretation, seismic section reasoning — all evidence-gated through contrast theory. Reads like a geoscientist, verifies like an engineer.',
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
      'Decision-quality intelligence for capital allocation under uncertainty. NPV, EMV, cascade risk detection, Makcik² relational credit scoring. 79 MCP endpoints for valuation, risk triage, and portfolio logic.',
    artifactLabel: 'Endpoint manifest',
    artifactHref: 'https://mcp.arif-fazil.com/tools/list',
    surfaceLabel: 'WEALTH surface',
    surfaceHref: 'https://mcp.arif-fazil.com',
  },
  {
    title: 'AAA',
    role: 'Operations surface · Agent gateway',
    status: 'LIVE',
    summary:
      'How the trinity stays operational. Health monitoring, MCP endpoint registry, session continuity, and the operator console for the full federation stack. Not a product — the way the work actually runs.',
    artifactLabel: 'Endpoint metadata',
    artifactHref: 'https://aaa.arif-fazil.com/mcp/endpoint.json',
    surfaceLabel: 'AAA cockpit',
    surfaceHref: 'https://aaa.arif-fazil.com',
  },
];

export const ecosystemLinks: LinkItem[] = [
  { label: '/ — human page', href: '/' },
  { label: '/000 — notes for AI', href: '/000/' },
  { label: '/999 — verification for AI', href: '/999/' },
  { label: 'wiki', href: 'https://wiki.arif-fazil.com', external: true },
  { label: 'mcp', href: 'https://mcp.arif-fazil.com', external: true },
  { label: 'geox', href: 'https://geox.arif-fazil.com', external: true },
];

export const contactLinks: LinkItem[] = [
  { label: 'GitHub / ariffazil', href: 'https://github.com/ariffazil', external: true },
  { label: 'Telegram / ariffazil', href: 'https://t.me/ariffazil', external: true },
  { label: 'Email', href: 'mailto:arifbfazil@gmail.com', external: true },
];