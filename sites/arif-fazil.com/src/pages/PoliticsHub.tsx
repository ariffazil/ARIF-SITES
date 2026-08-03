import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QuoteCard } from '@/components/QuoteCard';
import { useWebMCP } from '@/hooks/useWebMCP';

export interface GeopoliticalVector {
  id: string;
  code: string;
  name: string;
  region: string;
  color: string;
  thesis: string;
  frictionPoints: string[];
  keyLevers: string[];
}

export const GEOPOLITICAL_VECTORS: GeopoliticalVector[] = [
  {
    id: 'V1',
    code: 'WEST-MARITIME',
    name: 'Western Maritime Alliance',
    region: 'United States, NATO, G7, Anglosphere',
    color: '#3b82f6',
    thesis: 'Blue-water naval dominance, USD reserve currency, advanced semiconductor IP, and international contract law enforcement.',
    frictionPoints: ['South China Sea freedom of navigation', 'Taiwan Strait defense', 'Ukraine Eastern European frontier'],
    keyLevers: ['USD FX Clearing', 'Chip Export Bans', 'NATO Article 5']
  },
  {
    id: 'V2',
    code: 'EURASIA-LAND',
    name: 'Eurasian Continental Bloc',
    region: 'Russia, Central Asian Steppe, Belarus',
    color: '#ef4444',
    thesis: 'Vast territorial depth, energy & grain export, buffer state security, and nuclear strategic parity.',
    frictionPoints: ['NATO Eastern expansion', 'Central Asian trade routes', 'Caucasus regional stability'],
    keyLevers: ['Pipeline Hydrocarbons', 'Nuclear Parity', 'Fertilizer & Grain']
  },
  {
    id: 'V3',
    code: 'SINIC-CORE',
    name: 'Sinic Industrial Capacity',
    region: 'China, East Asian Supply Chain',
    color: '#eab308',
    thesis: 'Manufacturing supremacy, rare-earth processing monopoly, infrastructure export via Belt & Road, state-directed capitalism.',
    frictionPoints: ['Taiwan unification claim', 'Nine-Dash Line maritime EEZ', 'US tech embargoes'],
    keyLevers: ['Rare Earth Metals', 'BRI Loans', 'Global Manufacturing Share']
  },
  {
    id: 'V4',
    code: 'INDIC-CORE',
    name: 'Indo-Pacific Democratic Core',
    region: 'India, Subcontinent, Indian Ocean Rim',
    color: '#f97316',
    thesis: 'Demographic scale, strategic non-alignment (Multi-alignment), IT/pharma export, Indian Ocean maritime security.',
    frictionPoints: ['Himalayan border friction (LAC)', 'Malacca Strait balance', 'Pakistan border tension'],
    keyLevers: ['IT/Services Supply', 'QUAD Participation', 'Strategic Non-Alignment']
  },
  {
    id: 'V5',
    code: 'MENA-ENERGY',
    name: 'Middle East Energy & Islamic Hub',
    region: 'GCC, Iran, Levant, North Africa',
    color: '#10b981',
    thesis: 'Global crude & LNG reserves, sovereign wealth fund capital deployment, Islamic cultural leadership, maritime chokepoints.',
    frictionPoints: ['Red Sea / Bab-el-Mandeb drone threats', 'Strait of Hormuz transit security', 'Israel-Palestine escalation'],
    keyLevers: ['OPEC+ Quotas', 'SWF Capital ($3T+)', 'LNG & Crude Exports']
  },
  {
    id: 'V6',
    code: 'GLOBAL-SOUTH',
    name: 'Global South & Critical Minerals',
    region: 'Sub-Saharan Africa, Latin America',
    color: '#d97706',
    thesis: 'Energy-transition raw materials (Lithium, Cobalt, Copper, Nickel), massive youth demographic, post-colonial non-aligned voting block.',
    frictionPoints: ['Value-chain extraction vs local refining', 'Debt restructuring', 'Resource sovereignty'],
    keyLevers: ['Lithium & Cobalt Reserves', 'UN Voting Block', 'Youth Labor Force']
  },
  {
    id: 'V7',
    code: 'NUSANTARA-PIVOT',
    name: 'Nusantara Archipelagic Strait Pivot',
    region: 'Malaysia, Indonesia, Singapore, Philippines, Brunei',
    color: '#06b6d4',
    thesis: 'The Crossroads of World Trade: Control over Malacca, Sunda, and Lombok straits. Refracts global trade without taking military sides.',
    frictionPoints: ['South China Sea EEZ encroachment', 'US-China dual dependency', 'Sarawak/Sabah PDA1974 gas rights'],
    keyLevers: ['Strait of Malacca Transit (~30% global trade)', 'Penang Chip Packaging', 'ASEAN Neutrality']
  }
];

export const MARITIME_CHOKEPOINTS = [
  { name: 'Strait of Malacca', location: 'Malaysia / Indonesia / Singapore', impact: '~30% of global trade, 80% China crude' },
  { name: 'Taiwan Strait', location: 'Taiwan / China', impact: 'Key semiconductor supply lane' },
  { name: 'Strait of Hormuz', location: 'Oman / Iran', impact: '21 million barrels/day oil transit' },
  { name: 'Bab-el-Mandeb & Red Sea', location: 'Yemen / Djibouti', impact: 'Red Sea - Suez maritime channel' },
  { name: 'Sunda & Lombok Straits', location: 'Indonesia', impact: 'Deepwater supertanker & submarine route' }
];

export function PoliticsHub() {
  const [selectedVector, setSelectedVector] = useState<GeopoliticalVector>(GEOPOLITICAL_VECTORS[6]); // Default to Nusantara Pivot

  const mcpTools = [
    {
      name: 'get_geopolitics_hub_data',
      description: 'Retrieve the 7 Geopolitical Vectors, Maritime Chokepoints, and Nusantara Pivot analysis',
      execute() {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({ vectors: GEOPOLITICAL_VECTORS, chokepoints: MARITIME_CHOKEPOINTS }, null, 2)
          }]
        };
      }
    }
  ];

  useWebMCP(mcpTools);

  useEffect(() => {
    document.title = 'Geopolitics & Spatial Power — Arif Fazil | arifOS';
    document.querySelector('link[rel=canonical]')?.setAttribute('href', 'https://arif-fazil.com/politics');

    const schemaId = 'politics-jsonld';
    let script = document.getElementById(schemaId) as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.id = schemaId;
      script.type = 'application/ld+json';
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebPage',
            '@id': 'https://arif-fazil.com/politics/#webpage',
            'url': 'https://arif-fazil.com/politics/',
            'name': 'Geopolitics & Spatial Power Mechanics — 7 Vectors & Nusantara Pivot',
            'description': 'Global geopolitics hub mapping the 7 Geopolitical Power Vectors, maritime chokepoints (Malacca, Taiwan Strait, Hormuz), and domestic Malaysian power cartography.',
            'isPartOf': {
              '@type': 'WebSite',
              '@id': 'https://arif-fazil.com/#website',
              'url': 'https://arif-fazil.com/',
              'name': 'arif-fazil.com'
            }
          },
          {
            '@type': 'Dataset',
            '@id': 'https://arif-fazil.com/data/nusantara_atlas.geojson#dataset',
            'name': 'NUSANTARA 7-Vector Geopolitical Atlas',
            'description': '41-feature spatial dataset containing 7 civilizational vector zones, 7 vector centroid labels, 8 maritime chokepoints, 7 trade/energy spines, 7 shatterbelt fault lines, and 5 hinge seam nodes.',
            'url': 'https://arif-fazil.com/data/nusantara_atlas.geojson',
            'license': 'https://creativecommons.org/licenses/by/4.0/',
            'dateModified': '2026-08-03',
            'keywords': [
              'geopolitics',
              'Nusantara',
              'maritime chokepoints',
              'Strait of Malacca',
              'spatial power',
              'arifOS'
            ],
            'spatialCoverage': {
              '@type': 'Place',
              'geo': {
                '@type': 'GeoShape',
                'box': '-50 -180 75 180'
              }
            },
            'distribution': [
              {
                '@type': 'DataDownload',
                'encodingFormat': 'application/geo+json',
                'contentUrl': 'https://arif-fazil.com/data/nusantara_atlas.geojson'
              }
            ],
            'creator': {
              '@type': 'Person',
              'name': 'Muhammad Arif bin Fazil',
              'url': 'https://arif-fazil.com/'
            }
          }
        ]
      });
      document.head.appendChild(script);
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#05070c] min-h-screen text-slate-100 font-sans"
    >
      {/* TOP STATUS BAR */}
      <div className="bg-[#020408] border-b border-slate-800/80 px-6 py-2 text-xs font-mono text-slate-400 flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-cyan-400 font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            SOVEREIGN POLITICS HUB
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">7 POWER VECTORS × NUSANTARA PIVOT</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <Link to="/politics/ns-election" className="text-blue-400 hover:text-blue-300 transition-colors font-bold">
            🇲🇾 NS PRN16 MATRIX →
          </Link>
          <Link to="/politics/shadow" className="text-amber-400 hover:text-amber-300 transition-colors font-bold">
            🏛 PM BAYANG (SHADOW PMs) →
          </Link>
        </div>
      </div>

      {/* ── 3D GEOPOLITICAL HEAT ATLAS HERO ─────────────────── */}
      <section className="relative border-b border-slate-800 bg-black">
        <div className="site-frame py-3 flex items-center justify-between">
          <div className="font-mono text-xs text-amber-400 uppercase tracking-widest flex items-center gap-2">
            <span>🌐 GEOPOLITICAL HEAT ATLAS</span>
            <span>•</span>
            <span className="text-cyan-400 font-bold">7 VECTORS + MARITIME CHOKEPOINTS</span>
          </div>
          <a href="/data/geopolitics_vectors.json" target="_blank" rel="noreferrer" className="font-mono text-[11px] text-cyan-400 hover:underline">
            View Spatial GeoJSON ↗
          </a>
        </div>
        <div className="w-full h-[520px] md:h-[620px] relative bg-[#020408] border-t border-slate-800">
          <iframe
            src="/politics/atlas.html"
            title="NUSANTARA 7-Vector Interactive Geopolitical Atlas"
            className="w-full h-full border-0"
            loading="eager"
          />
          <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden md:block max-w-sm bg-slate-950/90 border border-slate-800 p-3 rounded text-xs font-mono backdrop-blur-md">
            <div className="text-amber-400 font-bold mb-1">PIVOT PRINCIPLE:</div>
            <div className="text-slate-300">"Power is a thermodynamic state function. Nusantara holds the straits that touch every vector's trade bloodstream."</div>
          </div>
        </div>
      </section>

      {/* HERO TITLE & THESIS */}
      <section className="py-12 border-b border-slate-800 bg-gradient-to-b from-[#080c16] to-[#05070c]">
        <div className="site-frame">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-2">
                GLOBAL POWER VECTORS × GLOCAL SUBSTRATE
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tight text-white mb-4 leading-none">
                Geopolitics & <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400">
                  Spatial Power Mechanics
                </span>
              </h1>
              <p className="text-slate-300 text-lg leading-relaxed max-w-2xl font-body">
                The world is not a collection of flat voting blocs. It is <strong>3 major power oppositions</strong> circling one central maritime pivot: <strong>Nusantara</strong>.
              </p>
            </div>
            <div>
              <QuoteCard
                topic="On Maritime Pivot Sovereignty"
                quote="Whoever controls the Straits of Malacca, Sunda, and Lombok commands the energy and commodity bloodstream between the West, East Asia, and the Global South."
                author="ATLAS333 Spatial & Geopolitical Codex"
                source="arifOS Governance Protocol"
              />
            </div>
          </div>
        </div>
      </section>

      {/* THE 7 GEOPOLITICAL VECTORS MATRIX */}
      <section className="py-16 border-b border-slate-800">
        <div className="site-frame">
          <div className="mb-8">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">7 POWER VECTORS PROFILE</div>
            <h2 className="text-2xl md:text-3xl font-black italic uppercase text-white">Select Vector to Inspect Power Mechanics</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* VECTOR BUTTONS */}
            <div className="space-y-2">
              {GEOPOLITICAL_VECTORS.map((v) => {
                const isSelected = selectedVector.id === v.id;
                return (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVector(v)}
                    className={`w-full text-left p-3.5 rounded-lg border transition-all flex items-center justify-between font-mono text-xs ${
                      isSelected
                        ? 'bg-slate-900 border-cyan-400 text-white shadow-lg shadow-cyan-950/50'
                        : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:bg-slate-900/80 hover:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: v.color }}></span>
                      <span className="font-bold">{v.code}</span>
                      <span className="text-slate-300 font-sans text-sm line-clamp-1">{v.name}</span>
                    </div>
                    {isSelected && <span className="text-cyan-400">◄</span>}
                  </button>
                );
              })}
            </div>

            {/* DETAILED VECTOR INSPECTOR */}
            <div className="lg:col-span-2 bg-[#080c16] border border-slate-800 rounded-xl p-6 md:p-8 font-mono relative overflow-hidden">
              <div
                className="absolute top-0 left-0 right-0 h-1"
                style={{ backgroundColor: selectedVector.color }}
              ></div>

              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div>
                  <span className="text-xs text-amber-400 uppercase tracking-widest font-bold">VECTOR ID: {selectedVector.id} ({selectedVector.code})</span>
                  <h3 className="text-2xl font-black text-white font-sans mt-1">{selectedVector.name}</h3>
                  <div className="text-xs text-slate-400 mt-1">{selectedVector.region}</div>
                </div>
                <div
                  className="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-black"
                  style={{ backgroundColor: selectedVector.color }}
                >
                  ACTIVE LAYER
                </div>
              </div>

              <div className="space-y-6 text-sm font-sans">
                <div>
                  <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 font-bold">Strategic Thesis & Power Base:</h4>
                  <p className="text-slate-200 leading-relaxed bg-slate-950/80 p-4 rounded-lg border border-slate-800/80 font-body text-base">
                    {selectedVector.thesis}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-mono text-red-400 uppercase tracking-wider mb-2 font-bold">Primary Friction Points:</h4>
                    <ul className="space-y-2">
                      {selectedVector.frictionPoints.map((fp, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-900">
                          <span className="text-red-400">⚡</span>
                          <span>{fp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 font-bold">Key Geopolitical Levers:</h4>
                    <ul className="space-y-2">
                      {selectedVector.keyLevers.map((kl, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-slate-300 bg-slate-950/40 p-2 rounded border border-slate-900">
                          <span className="text-cyan-400">⚙</span>
                          <span>{kl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MARITIME CHOKEPOINTS & GLOCAL MODULES */}
      <section className="py-16 bg-[#020408]">
        <div className="site-frame">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* CHOKEPOINTS */}
            <div>
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">MARITIME FUNNELS</div>
              <h3 className="text-2xl font-black italic uppercase text-white mb-6">Global Maritime Chokepoints</h3>
              <div className="space-y-3 font-mono text-xs">
                {MARITIME_CHOKEPOINTS.map((cp, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-[#080c16] border border-slate-800 hover:border-cyan-500/50 transition-colors">
                    <div className="flex justify-between items-center mb-1">
                      <strong className="text-white font-bold text-sm">{cp.name}</strong>
                      <span className="text-slate-400 text-[10px]">{cp.location}</span>
                    </div>
                    <p className="text-slate-300 text-xs font-sans mt-1">{cp.impact}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* GLOCAL SUBSTRATE CONNECTORS */}
            <div className="space-y-6">
              <div>
                <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">GLOCAL SUBSTRATE MODULES</div>
                <h3 className="text-2xl font-black italic uppercase text-white mb-6">Domestic Power Cartography</h3>
              </div>

              <Link
                to="/politics/ns-election"
                className="block p-6 rounded-xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-800/50 hover:border-blue-400 transition-all group"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-blue-400 uppercase font-bold">PRN16 NEGERI SEMBILAN MATRIX</span>
                  <span className="text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <h4 className="text-xl font-bold text-white font-sans group-hover:text-blue-300 transition-colors mb-2">
                  36-DUN Interactive Electoral Cartography Map
                </h4>
                <p className="text-slate-300 text-sm font-body">
                  Deep analysis of the 9 electoral invariants, DUN seat comparison matrix, and Malay split friction.
                </p>
              </Link>

              <Link
                to="/politics/shadow"
                className="block p-6 rounded-xl bg-gradient-to-r from-amber-950/40 to-slate-900 border border-amber-800/50 hover:border-amber-400 transition-all group"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-amber-400 uppercase font-bold">JUNGIAN LEADERSHIP ANALYSIS</span>
                  <span className="text-amber-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <h4 className="text-xl font-bold text-white font-sans group-hover:text-amber-300 transition-colors mb-2">
                  PM Bayang — Shadow Prime Ministers of Malaysia
                </h4>
                <p className="text-slate-300 text-sm font-body">
                  Persona, Bayang, Tragedi, dan Legasi of all 9 Malaysian Prime Ministers from Tunku Abdul Rahman to Anwar Ibrahim.
                </p>
              </Link>

              <Link
                to="/politics/shadow/derita"
                className="block p-6 rounded-xl bg-gradient-to-r from-cyan-950/40 to-slate-900 border border-cyan-800/50 hover:border-cyan-400 transition-all group mt-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase font-bold">FRAMEWORK ANALYSIS · HOLD</span>
                  <span className="text-cyan-400 group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <h4 className="text-xl font-bold text-white font-sans group-hover:text-cyan-300 transition-colors mb-2">
                  RASA DERITA — 6-Cohort Generational Trauma Map
                </h4>
                <p className="text-slate-300 text-sm font-body">
                  Framework analysis mapping Malaysia's institutional trauma (13 Mei → 1MDB → Sheraton) onto constitutional floors as SCARS.
                </p>
              </Link>

              <Link
                to="/politics/shadow/board"
                className="block p-6 rounded-xl bg-gradient-to-r from-slate-900 to-slate-900 border border-slate-700/50 hover:border-forge-orange/60 transition-all group mt-3"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-forge-orange uppercase font-bold">INSTRUMENT · PRIMER-1</span>
                  <span className="text-forge-orange group-hover:translate-x-1 transition-transform">→</span>
                </div>
                <h4 className="text-xl font-bold text-white font-sans group-hover:text-forge-orange transition-colors mb-2">
                  Shadow Board — Org-Chart Instrument
                </h4>
                <p className="text-slate-300 text-sm font-body">
                  Complete board of seats: 9 PM dossiers, DERITA trauma map, constitutional floors. Setiap kerusi = dossier link.
                </p>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
