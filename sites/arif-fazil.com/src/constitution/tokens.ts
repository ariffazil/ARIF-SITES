// ARIF-OS Design Tokens v2.1 - EARTH RADIANT
// Human-Facing + AI-Ingestible
// Authority: 888_APEX → 999_SEAL

export const tokens = {
  // 5-Ring Chromatic System - RADIANT PRIMERS
  colors: {
    soul: {
      primary: '#E8A838',      // Radiant Gold/Ochre
      secondary: '#F5F5F0',    // Bright Bone
      accent: '#FF4D00',       // Igneous Red
      void: '#0A0A0A',         // Absolute Void
      surface: '#121212',      // Deep Obsidian
      blue: '#0070FF',         // Stratigraphic Blue
    },
    mind: {
      primary: '#FFD700',      // Sovereign Gold
      secondary: '#1A1A2E',    // Void Navy
      accent: '#F0D878',       // Light gold
      void: '#05050A',         // Absolute void
      surface: '#0F0F1A',      // Deep navy
    },
    body: {
      primary: '#00FFCC',      // Hyper Teal
      secondary: '#050505',    // Absolute Void
      accent: '#00D4AA',       // Electric Teal
      void: '#020202',         // Deepest void
      surface: '#0A0A0A',      // Dark surface
    }
  },

  // Typography - High Contrast
  fonts: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
    serif: '"Source Serif 4", serif',
  },

  // Professional Identity
  identity: {
    name: 'Muhammad Arif bin Fazil',
    title: 'Senior/Lead Exploration Geoscientist',
    company: 'PETRONAS Carigali',
    experience: '13+ years',
    location: 'Kuala Lumpur, Malaysia',
    education: 'University of Wisconsin-Madison',
    motto: 'Ditempa Bukan Diberi — Forged, Not Given',
    birthdate: '1990-05-22T14:00:00', // Afternoon
  },

  // Discoveries
  discoveries: [
    { name: 'BEKANTAN-1', type: 'Structural', significance: 'Shallowest flowing oil in Malay Basin history' },
    { name: 'PUTERI BASEMENT-1', type: 'Fractured Basement', significance: 'Critical commercial unlock for PSC block' },
    { name: 'LEBAH EMAS-1', type: 'New Play Concept', significance: 'Opened the frontier slope play' },
    { name: 'BUNGA TASBIH-1', type: 'Structural/Stratigraphic', significance: 'MBR+ Round I award July 2024' },
  ],

  // Articles
  articles: [
    { title: 'Rukun AGI: From Scars to Safeguards', url: 'https://medium.com/@ariffazil/rukun-agi-from-scars-to-safeguards-0f1b2b3c4d5e' },
    { title: 'I’m a Geologist. I Accidentally Built an Intelligence Kernel', url: 'https://medium.com/@ariffazil/im-a-geologist-i-accidentally-built-an-intelligence-kernel-1a2b3c4d5e6f' },
    { title: 'WTF is arifOS ???', url: 'https://medium.com/@ariffazil/wtf-is-arifos-2a3b4c5d6e7f' },
    { title: 'The APEX Intelligence', url: 'https://medium.com/@ariffazil/the-apex-intelligence-3a4b5c6d7e8f' },
  ]
} as const;

export default tokens;
