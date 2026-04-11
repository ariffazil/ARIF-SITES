// ARIF-OS Design Tokens v2.0
// Human-Facing + AI-Ingestible
// Authority: 888_APEX → 999_SEAL

export const tokens = {
  // 5-Ring Chromatic System
  colors: {
    soul: {
      primary: '#c4791a',      // Earth Ochre - Malaysian soil
      secondary: '#f0e6d3',    // Bone
      accent: '#e8a838',       // Gold highlight
      void: '#0f0c08',         // Deep earth
      surface: '#1a1510',      // Rich soil
    },
    mind: {
      primary: '#d4a853',      // Sovereign Gold
      secondary: '#1a1a2e',    // Void Navy
      accent: '#f0d878',       // Light gold
      void: '#0a0a14',         // Absolute void
      surface: '#151528',      // Deep navy
    },
    body: {
      primary: '#00d4aa',      // Electric Teal - Petronas green
      secondary: '#0a0a0f',    // Absolute Void
      accent: '#00ffcc',       // Bright teal
      void: '#050508',         // Deepest void
      surface: '#0f1418',      // Dark surface
    },
    extension: {
      primary: '#ff6b35',      // Agent Orange
      secondary: '#2d1b4e',    // Deep Purple
      accent: '#ff9f6b',       // Light orange
      void: '#1a0f2e',         // Deep purple void
      surface: '#2d1b4e',      // Purple surface
    },
    field: {
      primary: '#6b8cae',      // Steel Azure - Ocean
      secondary: '#c9b037',    // Quantum Gold
      accent: '#8bb0d0',       // Light azure
      void: '#0a1018',         // Deep ocean
      surface: '#1a2532',      // Ocean surface
    }
  },

  // Typography - Human Readable + AI Parseable
  fonts: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
    serif: '"Source Serif 4", Georgia, serif',
  },

  // 13-Floor Scale
  scale: {
    xs: '0.75rem',     // 12px
    sm: '0.875rem',    // 14px
    base: '1rem',      // 16px
    lg: '1.125rem',    // 18px
    xl: '1.25rem',     // 20px
    '2xl': '1.5rem',   // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem',  // 36px
    '5xl': '3rem',     // 48px
    '6xl': '3.75rem',  // 60px
    '7xl': '4.5rem',   // 72px
    '8xl': '6rem',     // 96px
  },

  // Animation Timing
  motion: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    slower: '800ms',
  },

  // 5-Ring Identity
  rings: {
    soul: { id: 'Ψ', name: 'SOUL', domain: 'arif-fazil.com', role: 'Human Anchor' },
    mind: { id: 'Ω', name: 'MIND', domain: 'arifos.arif-fazil.com', role: 'Theory & Law' },
    body: { id: 'Δ', name: 'BODY', domain: 'arifosmcp.arif-fazil.com', role: 'Execution' },
    extension: { id: 'Ξ', name: 'EXTENSION', domain: 'aaa.arif-fazil.com', role: 'Agent Interface' },
    field: { id: 'Φ', name: 'FIELD', domain: 'civ.arif-fazil.com', role: 'Civilization Intelligence' },
  },

  // Professional Identity
  identity: {
    name: 'Muhammad Arif bin Fazil',
    title: 'Senior Exploration Geoscientist',
    company: 'PETRONAS Carigali',
    experience: '13+ years',
    location: 'Peninsular Malaysia',
    education: 'University of Wisconsin-Madison',
    motto: 'Ditempa Bukan Diberi — Forged, Not Given',
  },

  // Discoveries
  discoveries: [
    { name: 'BEKANTAN-1', type: 'Structural', significance: 'Hydrocarbon discovery in mature basin' },
    { name: 'PUTERI BASEMENT-1', type: 'Fractured Basement', significance: 'Pre-Tertiary reservoir viability' },
    { name: 'LEBAH EMAS-1', type: 'New Play Concept', significance: 'Opened new geological play' },
    { name: 'BUNGA TASBIH-1', type: 'Structural/Stratigraphic', significance: 'MBR+ Round I Award' },
  ],

  // Contact
  contact: {
    telegram: 'ariffazil',
    linkedin: 'Muhammad Arif bin Fazil',
    email: 'arifbfazil@gmail.com',
    github: 'ariffazil',
  }
} as const;

export type Domain = 'soul' | 'mind' | 'body' | 'extension' | 'field';
export default tokens;
