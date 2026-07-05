export interface Discovery {
  id: string;
  title: string;
  year: string;
  location: string;
  summary: string;
  evidence: string[];
  link?: string;
  linkLabel?: string;
}

export const discoveries: Discovery[] = [
  {
    id: 'bekantan-1',
    title: 'BEKANTAN‑1',
    year: '2018',
    location: 'Offshore Sarawak, Malaysia',
    summary: 'A material gas discovery in the Central Luconia Province. The well proved a working petroleum system in a structurally complex carbonate build-up, validating a play concept that had been debated for years.',
    evidence: [
      'Wireline logs confirmed 90+ m net gas pay',
      'Pressure data indicated overpressured reservoir',
      'Seismic amplitude conformance supported volumetrics'
    ],
    link: 'https://geox.arif-fazil.com',
    linkLabel: 'Explore GEOX →'
  },
  {
    id: 'puteri-basement',
    title: 'PUTERI BASEMENT‑1',
    year: '2020',
    location: 'Malay Basin, Peninsular Malaysia',
    summary: 'A basement-involved structural play that tested the hypothesis of fractured granite reservoirs beneath the main basin fill. The well encountered hydrocarbons in fractured basement and overlying sands.',
    evidence: [
      'Image logs identified open fracture networks',
      'Basement lithology confirmed granite to granodiorite',
      'Fluid samples showed light oil and associated gas'
    ],
    link: 'https://geox.arif-fazil.com/viewer/',
    linkLabel: 'Open Viewer →'
  },
  {
    id: 'lebah-emas-1',
    title: 'LEBAH EMAS‑1',
    year: '2025',
    location: 'Western hinge fault zone, Malay Basin margin · Block PM6/12',
    summary: 'Wildcat exploration well at the western hinge fault zone of the Malay Basin margin. The well encountered multiple hydrocarbon-bearing reservoirs, confirming a working petroleum system in a frontier area previously written off. It opened a new play fairway along the margin.',
    evidence: [
      '11 hydrocarbon-bearing intervals logged (gas and oil)',
      'P50 recoverable resources estimated at ~235 Bscf gas equivalent',
      'Sidetrack required; post-drill seismic expanded the prospect inventory in the margin play',
      'Block PM6/12 subsequently included in 2026 farm-out arrangements (30% to EnQuest as "mature asset" in US$833M deal)',
      'Discovery legacy treated as transaction footnote — new play opened but reframed for quick monetization'
    ],
    link: 'https://geox.arif-fazil.com',
    linkLabel: 'Explore GEOX →'
  },
  {
    id: 'bunga-tasbih-1',
    title: 'BUNGA TASBIH‑1',
    year: '2024',
    location: 'Malaysia Bid Round Plus · Offshore Malaysia',
    summary: 'Contribution to a discovered resource opportunity in the Malaysia Bid Round Plus (MBR+) Round I. Structural and stratigraphic evaluation supported the field\'s commercial case, leading to a successful Small Field Asset PSC award.',
    evidence: [
      'Structural / stratigraphic trap evaluation completed',
      'Resource assessment supported commercial viability',
      'Field awarded under Small Field Asset PSC in MBR+ Round I, 2024'
    ],
    link: 'https://geox.arif-fazil.com',
    linkLabel: 'Explore GEOX →'
  },
  {
    id: 'malay-basin',
    title: 'Malay Basin Regional',
    year: '2014–Present',
    location: 'Peninsular Malaysia & Adjacent Waters',
    summary: 'A decade-long regional synthesis of the Malay Basin pull-apart rift system. Mapped key play fairways, decline-rate distributions, and the structural controls on reservoir quality across deltaic sandstone targets.',
    evidence: [
      'Mapped 350,000 boepd depletion plateau dynamics',
      'Identified Sabah deepwater as only near-term growth path',
      'Applied Bond (2007) bias audit to all structural maps'
    ],
    link: 'https://geox.arif-fazil.com/map/',
    linkLabel: 'Open Map →'
  }
];
