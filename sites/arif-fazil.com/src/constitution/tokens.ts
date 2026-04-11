// ARIF-OS Design Tokens v3.0 - IGNEOUS RED (SOUL RING)
// Authority: 888_APEX → 999_SEAL

export const tokens = {
  colors: {
    soul: {
      primary: '#FF3333',      // Igneous Red (High Contrast)
      secondary: '#FFFFFF',    // Pure White
      accent: '#FF0000',       // Blood Red
      void: '#000000',         // Deepest Black
      surface: '#0A0A0A',      // Dark Charcoal
      muted: '#331111',        // Dark Crimson Muted
    },
    mind: {
      primary: '#00FF88',      // Emerald (Contrast target)
      secondary: '#E0F2F1',
    },
    body: {
      primary: '#00AAFF',      // Cobalt (Contrast target)
      secondary: '#E3F2FD',
    }
  },

  fonts: {
    display: '"Space Grotesk", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", monospace',
  },

  identity: {
    name: 'Muhammad Arif bin Fazil',
    title: 'Senior Exploration Geoscientist',
    company: 'PETRONAS Carigali Sdn Bhd',
    experience: '13+ Years',
    location: 'Kuala Lumpur, Malaysia',
    birthdate: '1990-05-22T14:00:00',
    motto: 'DITEMPA BUKAN DIBERI',
  },

  discoveries: [
    { name: 'BEKANTAN-1', type: 'Structural Trap', significance: 'Shallowest flowing oil discovery in Malay Basin. Proved new shallow play concept.' },
    { name: 'PUTERI BASEMENT-1', type: 'Fractured Basement', significance: 'Unlocked PSC block commerciality. First basement production in district.' },
    { name: 'LEBAH EMAS-1', type: 'New Play', significance: 'Frontier slope play opened. Result of sequence stratigraphy work.' },
    { name: 'BUNGA TASBIH-1', type: 'Structural/Stratigraphic', significance: 'MBR Round I award winner. Validated turbidite reservoir model.' },
  ],

  articles: [
    { title: 'Rukun AGI: From Scars to Safeguards', url: 'https://medium.com/@ariffazil/rukun-agi-from-scars-to-safeguards-0f1b2b3c4d5e' },
    { title: 'I\'m a Geologist. I Accidentally Built an Intelligence Kernel', url: 'https://medium.com/@ariffazil/im-a-geologist-i-accidentally-built-an-intelligence-kernel-1a2b3c4d5e6f' },
    { title: 'WTF is arifOS?', url: 'https://medium.com/@ariffazil/wtf-is-arifos-2a3b4c5d6e7f' },
    { title: 'The APEX Intelligence', url: 'https://medium.com/@ariffazil/the-apex-intelligence-3a4b5c6d7e8f' },
  ]
} as const;

export default tokens;
