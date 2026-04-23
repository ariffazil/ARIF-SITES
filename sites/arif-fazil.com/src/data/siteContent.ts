export type LinkItem = {
  label: string;
  href: string;
  external?: boolean;
};

export type WorkItem = {
  title: string;
  role: string;
  problem: string;
  value: string;
  href?: string;
};

export type WisdomEntry = {
  number: string;
  category: string;
  wisdom: string;
  meaning: string;
  whyItBuiltArifos: string;
};

export type ProofItem = {
  title: string;
  description: string;
  href: string;
};

export const primaryLinks: LinkItem[] = [
  { label: 'Selected work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: '/000', href: '/000/' },
  { label: '/999', href: '/999/' },
  { label: 'Contact', href: '#contact' },
];

export const trustStrip = [
  'Senior Exploration Geoscientist',
  'AI systems architect',
  'Builder of arifOS',
  'Malay Basin and Southeast Asian offshore basins',
  'Evidence-first governance',
];

export const selectedWork: WorkItem[] = [
  {
    title: 'Exploration geology',
    role: 'Senior Exploration Geoscientist',
    problem: 'Turn basin uncertainty into drillable, defensible decisions.',
    value:
      'Worked across Southeast Asian offshore basins and contributed to discoveries including Bekantan-1, Puteri Basement-1, Lebah Emas-1, and Bunga Tasbih-1.',
  },
  {
    title: 'arifOS',
    role: 'Architect and builder',
    problem: 'Make AI systems auditable, bounded, and human-sovereign instead of improvisational.',
    value:
      'Forged a constitutional runtime that forces evidence, reversibility, and accountable delegation into tool-calling systems.',
    href: 'https://mcp.arif-fazil.com',
  },
  {
    title: 'AAA protocol cockpit',
    role: 'System topology and protocol design',
    problem: 'Expose how tools, transports, and agent workflows actually connect without vague platform branding.',
    value:
      'Structured the operator-facing cockpit for MCP, protocol surfaces, and runtime orientation under one governed entry.',
    href: 'https://aaa.arif-fazil.com',
  },
  {
    title: 'GEOX',
    role: 'Earth intelligence product architecture',
    problem: 'Bridge spatial reasoning, runtime contracts, and public trust for geoscience applications.',
    value:
      'Defined the app shell, manifest posture, and evidence-led direction for a geospatial intelligence surface.',
    href: 'https://geox.arif-fazil.com',
  },
];

export const workingStyle = [
  'Evidence before narrative.',
  'Calm interfaces over symbolic overload.',
  'Clear contracts between humans, tools, and runtime.',
  'Surgical architecture instead of platform sprawl.',
];

export const collaborationOffers = [
  'Exploration and subsurface framing where uncertainty must be named honestly.',
  'AI system architecture where governance, safety, and auditability matter.',
  'Geospatial and machine-readable products that need a trustworthy information architecture.',
];

export const ecosystemLinks: LinkItem[] = [
  { label: '/000 — genesis and wisdom', href: '/000/' },
  { label: '/999 — trust and proof', href: '/999/' },
  { label: 'wiki — docs shell', href: 'https://wiki.arif-fazil.com', external: true },
  { label: 'aaa — protocol cockpit', href: 'https://aaa.arif-fazil.com', external: true },
  { label: 'mcp — tools and runtime', href: 'https://mcp.arif-fazil.com', external: true },
  { label: 'geox — earth apps', href: 'https://geox.arif-fazil.com', external: true },
];

export const contactLinks: LinkItem[] = [
  { label: 'GitHub / ariffazil', href: 'https://github.com/ariffazil', external: true },
  { label: 'Proof and credentials', href: '/999/' },
  { label: 'Machine-readable index', href: '/llms.txt' },
];

export const wisdomEntries: WisdomEntry[] = [
  {
    number: '0001',
    category: 'Field law',
    wisdom: 'Uncertainty named early is cheaper than certainty invented late.',
    meaning: 'Good work starts by stating what is unknown before momentum hardens around a story.',
    whyItBuiltArifos:
      'arifOS treats unknowns explicitly so agents do not fabricate confidence just to keep moving.',
  },
  {
    number: '0002',
    category: 'Field law',
    wisdom: 'A quiet well decision beats a dramatic post-mortem.',
    meaning: 'Discipline matters more than performance theatre when consequences are real.',
    whyItBuiltArifos:
      'The system prefers reversible, evidence-led actions over spectacular but brittle moves.',
  },
  {
    number: '0003',
    category: 'Systems law',
    wisdom: 'Every interface teaches behaviour.',
    meaning: 'Buttons, routes, and labels shape how people and agents think the system works.',
    whyItBuiltArifos:
      'Public surfaces are governed because misleading architecture creates misleading action.',
  },
  {
    number: '0004',
    category: 'Human law',
    wisdom: 'Authority should stay visible.',
    meaning: 'If a human owns the consequence, the human must remain legible in the chain.',
    whyItBuiltArifos:
      'Human sovereignty is built into the runtime as a first principle, not a late disclaimer.',
  },
  {
    number: '0005',
    category: 'Systems law',
    wisdom: 'A map is honest only when its scale is obvious.',
    meaning: 'People need to know the level of abstraction they are seeing.',
    whyItBuiltArifos:
      'The site split between `/`, `/000`, and `/999` keeps biography, origin, and proof from collapsing together.',
  },
  {
    number: '0006',
    category: 'Field law',
    wisdom: 'Ground truth outranks elegance.',
    meaning: 'A clean theory loses if the evidence says otherwise.',
    whyItBuiltArifos:
      'The governance spine favors verifiable state over polished but unsupported claims.',
  },
  {
    number: '0007',
    category: 'Human law',
    wisdom: 'Dignity survives precision.',
    meaning: 'Being exact does not require becoming cold or deceptive.',
    whyItBuiltArifos:
      'The system aims for humane clarity rather than fear, mysticism, or manipulation.',
  },
  {
    number: '0008',
    category: 'Systems law',
    wisdom: 'Names are part of the architecture.',
    meaning: 'If naming drifts, ownership drifts, then trust drifts.',
    whyItBuiltArifos:
      'Hostname law and repo law exist to stop semantic sprawl before it becomes operational sprawl.',
  },
  {
    number: '0009',
    category: 'Field law',
    wisdom: 'Signal without calibration is only noise wearing a badge.',
    meaning: 'Data becomes useful only when its limitations are understood.',
    whyItBuiltArifos:
      'Every proof and status surface should show what is real, partial, or still uncertain.',
  },
];

export const proofItems: ProofItem[] = [
  {
    title: 'Geologist credential',
    description: 'Signed credential artifact anchoring the professional geology claim.',
    href: '/proof/geologist-credential.json',
  },
  {
    title: 'Signature',
    description: 'Detached signature for the published credential artifact.',
    href: '/proof/geologist-credential.json.sig',
  },
  {
    title: 'DID document',
    description: 'Public identity and verification document exposed under `.well-known`.',
    href: '/.well-known/did.json',
  },
  {
    title: 'Agent card',
    description: 'Machine-readable surface describing the site role for agents and verifiers.',
    href: '/.well-known/agent.json',
  },
];
