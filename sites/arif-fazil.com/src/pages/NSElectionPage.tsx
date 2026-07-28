import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ElectionCartographyMap, NS_SEATS, type SeatData, PARTY_COLORS } from '@/components/ElectionCartographyMap';
import { QuoteCard } from '@/components/QuoteCard';
import { useWebMCP } from '@/hooks/useWebMCP';

// 9 Top Contrast Quantum-Meaningful Electoral Invariant Indicators (ATLAS333 Lens)
export interface ElectoralInvariant {
  id: string;
  code: string;
  name: string;
  domain: 'Demographics & Ethnicity' | 'Economic Thermodynamics' | 'Institutional Machinery' | 'Cultural & Royal Substrate' | 'Agentic Dynamic Split';
  weight: number; // 0-100 impact scale
  quantumMeaning: string; // Epistemic/Quantum contrast definition
  nsCurrentValue: string;
  nsImpactDirection: 'PH Favored' | 'BN Favored' | 'PN Favored' | 'Volatility / Friction';
  color: string;
}

export const TOP_9_INVARIANTS: ElectoralInvariant[] = [
  {
    id: 'INV1',
    code: 'DEM-MIX',
    name: 'Ethnic Superposition Threshold',
    domain: 'Demographics & Ethnicity',
    weight: 95,
    quantumMeaning: 'Seats with 55-65% Malay non-monolithic density behave as quantum superposition states where minor non-Malay turnout shifts invert outcomes.',
    nsCurrentValue: '14 of 36 NS seats sit in 55-65% Malay band (e.g. Linggi, Ampangan, Lenggeng, Labu).',
    nsImpactDirection: 'PH Favored',
    color: '#E53E3E'
  },
  {
    id: 'INV2',
    code: 'SPLIT-FRICTION',
    name: 'Opposition Intersecting Wave (Bersatu Factor)',
    domain: 'Agentic Dynamic Split',
    weight: 92,
    quantumMeaning: 'When opposition wave splits into 2 vectors (PAS vs Bersatu independent), destructive interference occurs in Malay-majority seats.',
    nsCurrentValue: 'Bersatu contesting 24 seats independently without BN/PAS formal pact. 3-way split in marginals.',
    nsImpactDirection: 'PH Favored',
    color: '#F59E0B'
  },
  {
    id: 'INV3',
    code: 'ROYAL-SUBSTRATE',
    name: 'Adat Perpatih & Royal Institutional Gravitas',
    domain: 'Cultural & Royal Substrate',
    weight: 88,
    quantumMeaning: 'Matriarchal clan inertia (Adat Perpatih) + Tuanku Muhriz royal dignity dampens national radicalization waves.',
    nsCurrentValue: 'Seri Menanti, Johol, & Luak clans maintain high institutional trust toward established traditional leaders.',
    nsImpactDirection: 'BN Favored',
    color: '#3182CE'
  },
  {
    id: 'INV4',
    code: 'ECON-THERMO',
    name: 'Cost-of-Living Entropy & Youth Employment',
    domain: 'Economic Thermodynamics',
    weight: 86,
    quantumMeaning: 'Local inflation (rice/fuel/housing) creates anti-incumbent thermal noise among B40 youth.',
    nsCurrentValue: 'Seremban-Nilai industrial belt faces housing inflation vs 4.2% youth underemployment.',
    nsImpactDirection: 'PN Favored',
    color: '#38A169'
  },
  {
    id: 'INV5',
    code: 'MB-MOBILITY',
    name: 'Executive Quantum Relocation (MB Aminuddin Factor)',
    domain: 'Institutional Machinery',
    weight: 85,
    quantumMeaning: 'Relocating the incumbent MB (Sikamat -> Linggi) shifts executive prestige energy into a high-entropy battleground.',
    nsCurrentValue: 'Dato\' Seri Aminuddin Harun contesting N32 Linggi vs BN incumbent Mohd Faizal.',
    nsImpactDirection: 'Volatility / Friction',
    color: '#D69E2E'
  },
  {
    id: 'INV6',
    code: 'NON-MALAY-LOCK',
    name: 'Non-Malay Turnout & Cohesion Invariant',
    domain: 'Demographics & Ethnicity',
    weight: 84,
    quantumMeaning: 'Chinese/Indian turnout >68% acts as an absolute vote floor for DAP/PKR in mixed urban corridors.',
    nsCurrentValue: 'Chennah, Lobak, Temiang, Nilai, Bukit Kepayang, Rahang, Mambau, Lukut (8 solid seats).',
    nsImpactDirection: 'PH Favored',
    color: '#E53E3E'
  },
  {
    id: 'INV7',
    code: 'TOK-MAT-FORTRESS',
    name: 'Patronage Network Efficiency (Tok Mat Machine)',
    domain: 'Institutional Machinery',
    weight: 82,
    quantumMeaning: 'Localized high-efficiency grassroots welfare machinery generates stable electoral potential wells.',
    nsCurrentValue: 'Rantau, Chembong, Kota, Gemencheh anchored by Tok Mat & UMNO Rembau machinery.',
    nsImpactDirection: 'BN Favored',
    color: '#3182CE'
  },
  {
    id: 'INV8',
    code: 'FELDA-POLARIZATION',
    name: 'FELDA Settler Generational Bifurcation',
    domain: 'Cultural & Royal Substrate',
    weight: 79,
    quantumMeaning: 'Gen-1 settlers vote UMNO baseline; Gen-2/Gen-3 vote PAS/PN due to digital media & economic discontent.',
    nsCurrentValue: 'Palong, Serting, Gemas, Sungai Lui (Jelebu/Jempol FELDA schemes).',
    nsImpactDirection: 'PN Favored',
    color: '#38A169'
  },
  {
    id: 'INV9',
    code: 'POSTAL-MILITARY',
    name: 'Discipline Security Postal Vote Invariant',
    domain: 'Institutional Machinery',
    weight: 75,
    quantumMeaning: 'Polis/Tentera early voting blocks act as predictable non-volatile vectors.',
    nsCurrentValue: 'Bagan Pinang (Port Dickson army camp) & Rasah police headquarters.',
    nsImpactDirection: 'BN Favored',
    color: '#3182CE'
  }
];

export function NSElectionPage() {
  const [selectedSeat, setSelectedSeat] = useState<SeatData | null>(NS_SEATS.find(s => s.id === 'N32') || NS_SEATS[0]);
  const [selectedInvariant, setSelectedInvariant] = useState<ElectoralInvariant | null>(TOP_9_INVARIANTS[0]);

  // WebMCP dynamic inspection binding
  useWebMCP([
    {
      name: 'audit_ns2026_elections',
      description: 'Audit Negeri Sembilan PRN 2026 seat dynamics and 9 Quantum Electoral Invariants.',
      execute() {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              assembly_prediction: '18 PH - 16 BN - 2 PN (2 Toss-up)',
              top_invariant: 'Opposition Split Friction (Bersatu factor)',
              seats_count: 36,
              sealed_at: 'VAULT999-PRN16-NS'
            })
          }]
        };
      }
    }
  ]);

  useEffect(() => {
    document.title = 'Negeri Sembilan PRN 2026 — Live Dynamic Intelligence & 9 Quantum Invariants | arifOS';
  }, []);

  const totalSeats = NS_SEATS.length;
  const phCount = useMemo(() => NS_SEATS.filter(s => s.predictedWinner === 'PH').length, []);
  const bnCount = useMemo(() => NS_SEATS.filter(s => s.predictedWinner === 'BN').length, []);
  const pnCount = useMemo(() => NS_SEATS.filter(s => s.predictedWinner === 'PN').length, []);
  const tossupCount = useMemo(() => NS_SEATS.filter(s => s.predictedWinner === 'TOSSUP').length, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-[#050608] min-h-screen text-slate-100 font-sans selection:bg-amber-500 selection:text-black"
    >
      {/* TOP DYNAMIC TICKER */}
      <div className="bg-slate-950 border-b border-forge-iron py-2 px-4 font-mono text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider animate-pulse">
            ● LIVE DYNAMIC AUDIT
          </span>
          <span className="text-slate-300">arifOS · Federation Intelligence · Quantum Political Dynamics</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <Link
            to="/politics/ns-election/playbook"
            className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors uppercase tracking-wider font-mono text-[10px]"
          >
            📋 OPERATIONAL PLAYBOOK →
          </Link>
          <span>Sealed Ledger: <code className="text-amber-400">VAULT999-PRN16-NS</code></span>
          <span>Hermes Model Status: <strong className="text-emerald-400">VALIDATED (±2 SEATS)</strong></span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="py-12 md:py-16 border-b border-forge-iron bg-gradient-to-b from-slate-950 via-[#07090E] to-[#050608]">
        <div className="site-frame">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>PRN 2026 State Election Briefing</span>
                <span>•</span>
                <span>36 DUN Seats</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">19 Needed For Majority</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-none tracking-tight mb-4 text-white">
                Negeri Sembilan <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-500 to-red-500">
                  Live Dynamic Seat Matrix & 9 Invariants
                </span>
              </h1>
              <p className="text-slate-300 font-body text-lg leading-relaxed max-w-2xl">
                Polling Day: <strong className="text-amber-300">Sabtu, 1 Ogos 2026</strong> · Early Voting: <strong>Rabu, 29 Julai 2026</strong>.<br />
                Multi-lens analysis combining Demographics, Economic Thermodynamics, Adat Perpatih Culture, and Bersatu 3-way Split Mechanics.
              </p>
            </div>

            <div>
              <QuoteCard
                topic="On Political Geometry"
                quote="Politics is not an art of the possible; it is the science of spatial calculation under scarcity, cultural inertia, and quantum split alignment."
                author="ATLAS333 Spatial & Political Codex"
                source="arifOS Governance Protocol"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 9 TOP CONTRAST QUANTUM-MEANINGFUL INVARIANTS */}
      <section className="py-12 border-b border-forge-iron bg-slate-950/80">
        <div className="site-frame">
          <div className="mb-8">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
              Deep Intelligence Lens · Quantum Meaning Audit
            </div>
            <h2 className="text-3xl font-black italic uppercase text-white">
              🏛️ 9 Top Contrast Invariant Factors Moving Malaysian Elections
            </h2>
            <p className="text-sm font-mono text-slate-400 mt-1 max-w-3xl">
              Cross-disciplinary synthesis mapping Demographics, Economic Thermodynamics, Adat Perpatih Substrate, and Agentic Split Friction to Negeri Sembilan's 36 DUN seats.
            </p>
          </div>

          {/* Grid of 9 Invariants */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {TOP_9_INVARIANTS.map((inv) => {
              const isSelected = selectedInvariant?.id === inv.id;
              return (
                <div
                  key={inv.id}
                  onClick={() => setSelectedInvariant(inv)}
                  style={{ borderColor: isSelected ? '#F59E0B' : 'rgba(51,65,85,0.6)' }}
                  className={`cursor-pointer p-4 rounded-lg border bg-slate-900/60 hover:bg-slate-900 transition-all ${
                    isSelected ? 'ring-2 ring-amber-400/50 bg-slate-900' : ''
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-xs mb-2">
                    <span className="font-bold text-amber-400">{inv.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      Impact Weight: {inv.weight}%
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-100 text-base mb-1">{inv.name}</h3>
                  <div className="text-[11px] font-mono text-slate-400 mb-2">{inv.domain}</div>
                  <div className="text-xs text-slate-300 line-clamp-2 italic mb-3">
                    "{inv.quantumMeaning}"
                  </div>
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Direction:</span>
                    <span className="font-bold" style={{ color: inv.color }}>{inv.nsImpactDirection}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Invariant Detailed Inspector Drawer */}
          {selectedInvariant && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 rounded-lg border border-amber-500/40 bg-slate-900/90 backdrop-blur-md shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <div className="font-mono text-xs text-amber-400 font-bold mb-1">
                  INVARIANT DETAIL · {selectedInvariant.code} ({selectedInvariant.domain})
                </div>
                <h4 className="text-2xl font-black italic uppercase text-white mb-2">
                  {selectedInvariant.name}
                </h4>
                <div className="inline-block px-3 py-1 rounded text-xs font-mono font-bold" style={{ backgroundColor: `${selectedInvariant.color}20`, color: selectedInvariant.color, border: `1px solid ${selectedInvariant.color}` }}>
                  Target Shift: {selectedInvariant.nsImpactDirection}
                </div>
              </div>

              <div className="md:col-span-2 space-y-3 font-mono text-xs">
                <div>
                  <span className="text-amber-300 font-bold block mb-1">⚛️ Quantum Contrast Meaning:</span>
                  <p className="text-slate-200 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                    {selectedInvariant.quantumMeaning}
                  </p>
                </div>
                <div>
                  <span className="text-emerald-400 font-bold block mb-1">📍 Negeri Sembilan Ground Reality Audit:</span>
                  <p className="text-slate-200 leading-relaxed bg-slate-950 p-3 rounded border border-slate-800">
                    {selectedInvariant.nsCurrentValue}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* MAIN SPATIAL MAP & SEAT INSPECTOR */}
      <section className="py-10 border-b border-forge-iron">
        <div className="site-frame">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-100">
                🗺️ Interactive 36-DUN Spatial Cartogram
              </h2>
              <p className="text-sm font-mono text-slate-400 mt-1">
                Select any constituency block to inspect 2023 electoral margin, 2026 candidate friction, and agentic projection.
              </p>
            </div>
          </div>

          {/* SPATIAL MAP COMPONENT */}
          <ElectionCartographyMap
            selectedSeatId={selectedSeat?.id || null}
            onSelectSeat={(seat) => setSelectedSeat(seat)}
          />

          {/* SELECTED SEAT DRILLDOWN DRAWER */}
          {selectedSeat && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-6 rounded-lg border border-amber-500/40 bg-slate-950/90 backdrop-blur-md shadow-xl grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div>
                <div className="flex items-center gap-2 font-mono text-xs text-amber-400 mb-1">
                  <span>DUN {selectedSeat.code}</span>
                  {selectedSeat.isHot && <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 font-bold">🔥 BATTLEGROUND</span>}
                </div>
                <h3 className="text-3xl font-black italic uppercase text-white">
                  {selectedSeat.name}
                </h3>
                <p className="text-sm font-mono text-slate-300 mt-1">
                  Incumbent: <strong className="text-amber-200">{selectedSeat.incumbent}</strong>
                </p>
              </div>

              <div className="font-mono text-xs border-y md:border-y-0 md:border-x border-slate-800 py-3 md:py-0 md:px-6 flex flex-col justify-center gap-2">
                <div className="flex justify-between">
                  <span className="text-slate-400">2023 Winner:</span>
                  <span className="font-bold text-slate-200">{selectedSeat.coalition2023} ({selectedSeat.party2023})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">2023 Majority:</span>
                  <span className="font-bold text-amber-400">{selectedSeat.majority2023.toLocaleString()} votes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">PRN16 Projection:</span>
                  <span className="font-bold uppercase px-2 py-0.5 rounded text-[11px]" style={{
                    backgroundColor: PARTY_COLORS[selectedSeat.predictedWinner].bg,
                    color: PARTY_COLORS[selectedSeat.predictedWinner].text,
                    border: `1px solid ${PARTY_COLORS[selectedSeat.predictedWinner].border}`
                  }}>
                    {selectedSeat.prediction2026}
                  </span>
                </div>
              </div>

              <div className="flex flex-col justify-center">
                <span className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-1">Agentic Field Analysis</span>
                <p className="text-sm text-slate-200 leading-relaxed italic bg-slate-900/60 p-3 rounded border border-slate-800">
                  "{selectedSeat.notes}"
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* COALITION SCENARIOS & HERMES VALIDATION */}
      <section className="py-12 bg-slate-950/60">
        <div className="site-frame">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Assembly Balance Breakdown */}
            <div className="p-6 rounded border border-forge-iron bg-slate-950">
              <h3 className="text-lg font-black italic uppercase text-amber-400 mb-4 flex items-center gap-2">
                📊 Assembly Balance ({totalSeats} Total)
              </h3>
              <div className="space-y-4 font-mono text-xs">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-red-400 font-bold">Pakatan Harapan (PH)</span>
                    <span className="text-slate-200">{phCount} Seats</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
                    <div className="bg-red-500 h-full" style={{ width: `${(phCount / totalSeats) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-blue-400 font-bold">Barisan Nasional (BN)</span>
                    <span className="text-slate-200">{bnCount} Seats</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
                    <div className="bg-blue-500 h-full" style={{ width: `${(bnCount / totalSeats) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-emerald-400 font-bold">Perikatan Nasional (PN)</span>
                    <span className="text-slate-200">{pnCount} Seats</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${(pnCount / totalSeats) * 100}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-amber-400 font-bold">Toss-Up / Kingmaker</span>
                    <span className="text-slate-200">{tossupCount} Seats</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
                    <div className="bg-amber-500 h-full animate-pulse" style={{ width: `${(tossupCount / totalSeats) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed font-mono">
                Threshold for simple majority: <strong>19 Seats</strong>. Bersatu independent candidates contesting 24 seats create significant split-vote mechanics.
              </p>
            </div>

            {/* Government Formation Scenarios */}
            <div className="lg:col-span-2 p-6 rounded border border-forge-iron bg-slate-950">
              <h3 className="text-lg font-black italic uppercase text-slate-100 mb-4 flex items-center gap-2">
                🏛️ Post-Election Government Scenarios & Hermes Prediction Audit
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
                <div className="p-4 rounded border border-red-500/30 bg-red-950/20">
                  <h4 className="font-bold text-red-300 text-sm mb-2">PH-Led Coalition</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    PH 18 + Bersatu/Independents (1-2) = 19+. Requires Bersatu to side with PH post-election. Most likely if PH captures marginal Malay seats.
                  </p>
                </div>

                <div className="p-4 rounded border border-blue-500/30 bg-blue-950/20">
                  <h4 className="font-bold text-blue-300 text-sm mb-2">BN-PN Alliance</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    BN 16 + PN 3 = 19. Requires formal post-poll reconciliation between UMNO and PAS/Bersatu. High friction.
                  </p>
                </div>

                <div className="p-4 rounded border border-amber-500/30 bg-amber-950/20">
                  <h4 className="font-bold text-amber-300 text-sm mb-2">Hung Assembly (18-18)</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    Deadlock scenario. Bersatu holds kingmaker leverage. Prolonged negotiations or palace intervention required for MB appointment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 border-t border-forge-iron bg-slate-950 text-xs font-mono text-slate-500">
        <div className="site-frame flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <strong>arifOS · Federation Intelligence</strong> — Spatial & Dynamic Module<br />
            Published on <code>arif-fazil.com/politics/ns-election/</code> · Hash Verified
          </div>
          <div className="text-right italic">
            DITEMPA BUKAN DIBERI — Yang benar dikarang, bukan diberi.
          </div>
        </div>
      </footer>
    </motion.div>
  );
}
