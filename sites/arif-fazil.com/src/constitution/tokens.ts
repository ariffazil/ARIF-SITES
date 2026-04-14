// ARIF-OS Design Tokens v4.0 — HUMAN FIRST
// Authority: 888_APEX → 999_SEAL

export const tokens = {
  colors: {
    bg: '#0a0a0a',
    bgSecondary: '#111113',
    bgTertiary: '#1a1a1f',
    border: '#2a2a30',
    borderHover: '#3a3a40',
    text: '#e5e5e5',
    textSecondary: '#888888',
    textMuted: '#555555',
    gold: '#D4A853',
    goldDim: '#a08040',
    cyan: '#00D4AA',
    green: '#22c55e',
    red: '#ef4444',
  },

  fonts: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },

  identity: {
    name: 'ARIF FAZIL',
    fullName: 'Muhammad Arif bin Fazil',
    title: 'Explorationist. Economist. AI Safety Architect.',
    subtitle: 'Northern Malay, Penang-bred, Balakong-rooted.',
    company: 'PETRONAS Carigali Sdn Bhd',
    experience: '13+ Years',
    location: 'Kuala Lumpur, Malaysia',
    birthdate: '1990-05-22T14:00:00',
    motto: 'DITEMPA BUKAN DIBERI',
    mottoEn: 'Forged through experience, not given as theory.',
    archetype: 'INTJ',
    disciplines: ['Geoscience', 'Economics', 'AI Governance'],
  },

  atAGlance: [
    'Senior Exploration Geoscientist working across Malaysia basin subsurface problems',
    'Built track record across structural, stratigraphic, basement, and frontier plays',
    'Dual training in Geology & Geophysics and Economics from University of Wisconsin–Madison',
    'Building arifOS, a constitutional framework for accountable AI systems',
  ],

  discoveries: [
    {
      name: 'PM318',
      playType: '12+ yrs · 100% · Shallowest in Malaysia',
      role: 'Explorationist · Prospect leader',
      significance: 'The 100% success rate is a statistic. The reality: 12 years of frontier basins where most data said \"dry hole.\" PM318 required holding position against negative sentiment for 8 quarters — the shallowest discovery in Malaysia came because we refused to dismiss the anomaly that didn\'t fit the model.',
      capability: 'frontier basin evaluation, conviction-based drilling, anomaly trust',
    },
    {
      name: 'LEBAH EMAS-1',
      playType: 'Frontier play opening',
      role: 'Workflow design / prospect evaluation',
      significance: 'Workflow design and a major confirmed discovery in a slope-basement play. A demonstration that moving beyond template thinking toward system-level geological reasoning opens plays others marked as uneconomic until they flowed.',
      capability: 'frontier play evaluation, sequence stratigraphy, system-level reasoning',
    },
    {
      name: 'BEKANTAN-1',
      playType: 'Shallow-play exploration success',
      role: 'Discovery leader / key contributor',
      significance: 'Proved a new shallow play concept in the Malay Basin — integrating structure, play understanding, and disciplined risking into a defensible drilling decision when the consensus was to walk away.',
      capability: 'structural interpretation, risking, decision quality',
    },
    {
      name: 'PUTERI BASEMENT-1',
      playType: 'Fractured basement play',
      role: 'Key contributor',
      significance: 'A breakthrough basement outcome tied to PSC value uplift. The lesson: unconventional-looking opportunities often require stronger geological conviction, not weaker standards.',
      capability: 'basement evaluation, play fairway mapping, commercial geology',
    },
  ],

  experience: {
    company: 'PETRONAS — Exploration Geoscience',
    period: '2013 – Present',
    summary: 'My work has spanned interpretation, prospect maturation, basin evaluation, well support, and post-drill learning across offshore Malaysian settings. The 12+ year track record looks clean on paper. The reality is 8 quarters of holding a position when the data said no, and 18 months of trusting an anomaly that didn\'t fit the model before it became the shallowest discovery in Malaysia.',
    skills: [
      '2D and 3D seismic interpretation',
      'seismic-to-well integration',
      'depth conversion',
      'structural and play fairway mapping',
      'probabilistic volumetrics',
      'risk analysis',
      'well operations and post-drill evaluation',
    ],
    domains: 'Clastic, carbonate, fractured basement, and deep-water systems.',
    closing: 'What matters most is helping create decisions that remain robust when tested by reality.',
  },

  education: {
    school: 'University of Wisconsin–Madison',
    degrees: ['B.S. Geology & Geophysics', 'B.S. Economics'],
    period: '2009 – 2013',
    summary: 'That dual training shaped the rest of my career. Geoscience taught me how to reason from incomplete physical evidence. Economics taught me that every technical conclusion eventually enters a world of trade-offs, incentives, and consequence.',
  },

  articles: [
    { title: 'Rukun AGI: From Scars to Safeguards', url: 'https://medium.com/@ariffazil/rukun-agi-from-scars-to-safeguards-0f1b2b3c4d5e' },
    { title: 'I\'m a Geologist. I Accidentally Built an Intelligence Kernel', url: 'https://medium.com/@ariffazil/im-a-geologist-i-accidentally-built-an-intelligence-kernel-1a2b3c4d5e6f' },
    { title: 'WTF is arifOS?', url: 'https://medium.com/@ariffazil/wtf-is-arifos-2a3b4c5d6e7f' },
    { title: 'The APEX Intelligence', url: 'https://medium.com/@ariffazil/the-apex-intelligence-3a4b5c6d7e8f' },
  ],

  contact: {
    email: 'arif@arif-fazil.com',
    github: 'https://github.com/ariffazil',
    linkedin: 'https://linkedin.com/in/ariffazil',
    medium: 'https://medium.com/@ariffazil',
  },

  trinity: [
    { label: 'Ψ SOUL', href: 'https://arif-fazil.com', color: '#D4A853' },
    { label: 'Ω MIND', href: 'https://apex.arif-fazil.com', color: '#888888' },
    { label: 'Δ BODY', href: 'https://aaa.arif-fazil.com', color: '#888888' },
    { label: 'Δ MCP', href: 'https://arifosmcp.arif-fazil.com', color: '#00D4AA' },
    { label: '◉ FORGE', href: 'https://forge.arif-fazil.com', color: '#555555' },
    { label: '◎ WAW', href: 'https://waw.arif-fazil.com', color: '#555555' },
    { label: 'Ω WIKI', href: 'https://wiki.arif-fazil.com', color: '#555555' },
    { label: 'Φ GEOX', href: 'https://geox.arif-fazil.com', color: '#D4A853' },
  ],
} as const;

export default tokens;
