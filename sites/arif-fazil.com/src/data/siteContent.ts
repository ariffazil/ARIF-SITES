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
  { label: 'Practice', href: '#practice' },
  { label: 'Systems', href: '#systems' },
  { label: '/000', href: '/000/' },
  { label: '/999', href: '/999/' },
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
    role: 'Constitutional AI runtime',
    status: 'LIVE',
    summary:
      'A set of principles and tools that keep AI systems honest — grounded, reversible, and bounded. Built for my own work, shared because that\'s how systems hold up.',
    artifactLabel: 'Constitution',
    artifactHref: 'https://mcp.arif-fazil.com/constitution.json',
    surfaceLabel: 'Runtime surface',
    surfaceHref: 'https://mcp.arif-fazil.com',
  },
  {
    title: 'AAA',
    role: 'Operations surface',
    status: 'LIVE',
    summary:
      'How I keep track of what\'s running, what\'s health, and where the system stands. Not a product — just the way I work.',
    artifactLabel: 'Endpoint metadata',
    artifactHref: 'https://aaa.arif-fazil.com/mcp/endpoint.json',
    surfaceLabel: 'Cockpit',
    surfaceHref: 'https://aaa.arif-fazil.com',
  },
  {
    title: 'GEOX',
    role: 'Earth intelligence',
    status: 'MIXED',
    summary:
      'Geology tools that take physics seriously. Some parts are working, some are in progress. It\'s a workbench, not a showcase.',
    artifactLabel: 'App registry',
    artifactHref: 'https://geox.arif-fazil.com/apps.json',
    surfaceLabel: 'GEOX surface',
    surfaceHref: 'https://geox.arif-fazil.com',
    placeholderLabel: 'Preview paths intentionally quiet',
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