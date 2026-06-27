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
    artifactHref: 'https://arifos.arif-fazil.com/constitution.json',
    surfaceLabel: 'Observatory',
    surfaceHref: 'https://arifos.arif-fazil.com',
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
      'Decision-quality intelligence for capital allocation under uncertainty. NPV, EMV, cascade risk detection, Makcik² relational credit scoring. 23 tools — streamable-http + JSON-RPC. Daily briefing: Bursa, Ringgit, oil, politics — all evidence-gated. Computes, never allocates — arifOS judges, Arif decides.',
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
      'How the trinity stays operational. Health monitoring, MCP endpoint registry, session continuity, and the operator console for the full federation stack. Not a chatbot wrapper — the operating surface for governed agentic work.',
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
      'Universal substrate vitality mirror. 21 tools — streamable-http + JSON-RPC. Reflects operator cognitive pressure, thermodynamic state, and machine governance health. H-WELL, M-WELL, G-WELL, C-WELL, U-WELL substrates. Holds a mirror, not a veto — operator sovereignty invariant.',
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
      'Deployment orchestration and agent engine loop. Plans, simulates, executes, and rolls back — only after arifOS SEAL. Cross-organ mesh protocol. The engineering arm of the federation. Executes, never legislates, never self-authorizes.',
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
  { label: 'GEOX', href: 'https://geox.arif-fazil.com', external: true },
  { label: 'AAA Cockpit', href: 'https://aaa.arif-fazil.com', external: true },
  { label: 'WEALTH Briefing', href: '/wealth/' },
  { label: 'WELL Vitality', href: 'https://well.arif-fazil.com', external: true },
  { label: 'A-FORGE', href: 'https://forge.arif-fazil.com', external: true },
];

export const contactLinks: LinkItem[] = [
  { label: 'GitHub / ariffazil', href: 'https://github.com/ariffazil', external: true },
  { label: 'Telegram / ariffazil', href: 'https://t.me/ariffazil', external: true },
  { label: 'Email', href: 'mailto:arifbfazil@gmail.com', external: true },
];