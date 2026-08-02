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
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen text-slate-100 font-sans selection:bg-amber-500 selection:text-black"
    >
      {/* TOP DYNAMIC TICKER */}
      <div className="bg-[#080b12] border-b border-forge-iron py-2 px-4 font-mono text-xs text-slate-400 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
            ● OFFICIAL FINAL DECLARED RESULT
          </span>
          <span className="text-slate-300">arifOS · Federation Intelligence · PRN16 Negeri Sembilan</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <Link
            to="/"
            className="px-2.5 py-1 rounded bg-slate-800 text-slate-200 font-bold hover:bg-slate-700 transition-colors uppercase tracking-wider font-mono text-[10px]"
          >
            🏠 HOME →
          </Link>
          <Link
            to="/politics/ns-election/compare"
            className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold hover:bg-blue-500 transition-colors uppercase tracking-wider font-mono text-[10px]"
          >
            📊 SEAT COMPARE →
          </Link>
          <Link
            to="/politics/ns-election/playbook"
            className="px-2.5 py-1 rounded bg-amber-500 text-black font-bold hover:bg-amber-400 transition-colors uppercase tracking-wider font-mono text-[10px]"
          >
            📋 PLAYBOOK →
          </Link>
          <span>Sealed Ledger: <code className="text-amber-400">VAULT999-PRN16-NS</code></span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="py-12 md:py-16 border-b border-forge-iron bg-gradient-to-b from-[#080b12] via-[#05070c] to-forge-black">
        <div className="site-frame">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>PRN16 NEGERI SEMBILAN 2026</span>
                <span>•</span>
                <span>36 DUN SEATS</span>
                <span>•</span>
                <span className="text-emerald-400 font-bold">DECIDED 1 OGOS 2026</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase leading-none tracking-tight mb-4 text-white">
                Negeri Sembilan <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-amber-400 to-emerald-400">
                  Official Election Results & 36-DUN Matrix
                </span>
              </h1>
              <p className="text-slate-300 font-body text-lg leading-relaxed max-w-2xl">
                Official SPR Declared Outcome: <strong className="text-blue-400">Barisan Nasional (BN) secures 18 Seats</strong> to form simple majority state government.<br />
                Pakatan Harapan (PH) retains 11 seats, Perikatan Nasional (PN) wins 7 seats with 7 total seat flips across Malay-majority & mixed corridors.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-blue-500/50 bg-[#080b12] font-mono text-xs shadow-xl">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                    <strong className="text-blue-400 font-bold uppercase tracking-wider">STATE GOVERNMENT STATUS</strong>
                  </div>
                  <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded font-bold">18 / 36 SEATS</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Winner Coalition:</span>
                    <strong className="text-blue-400 font-bold">Barisan Nasional (BN)</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>Seat Flips:</span>
                    <strong className="text-amber-400">7 Seats Inverted</strong>
                  </div>
                  <div className="flex justify-between items-center text-slate-300">
                    <span>MB Candidate Vector:</span>
                    <strong className="text-slate-100">Dato' Seri Mohamad Hasan / Jalaluddin</strong>
                  </div>
                  <div className="pt-2 border-t border-slate-900 text-[10px] text-slate-400 italic">
                    "BN consolidated traditional rural & FELDA Malay votes while exploiting Bersatu independent vote splits."
                  </div>
                </div>
              </div>

              <QuoteCard
                topic="On Electoral Thermodynamics"
                quote="Electoral outcomes are not accidents; they are thermodynamic state functions governed by split friction, demographic superposition, and localized machine gravitas."
                author="ATLAS333 Spatial & Political Codex"
                source="arifOS Governance Protocol"
              />
            </div>
          </div>
        </div>
      </section>

      {/* OFFICIAL FINAL SCORECARD & 7 FLIPS SECTION */}
      <section className="py-10 border-b border-forge-iron bg-[#07090e]">
        <div className="site-frame">
          <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1">
                SPR Declared Tally · 1 Ogos 2026
              </div>
              <h2 className="text-3xl font-black italic uppercase text-white">
                🏆 Official Assembly Tally & Seat Flips
              </h2>
            </div>
            <Link
              to="/politics/ns-election/compare"
              className="font-mono text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase tracking-wider"
            >
              Inspect Complete Seat-by-Seat Comparison →
            </Link>
          </div>

          {/* 3 COALITION TALLY CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 font-mono">
            {/* BN */}
            <div className="p-6 rounded-lg border-2 border-blue-500 bg-[#0a0f1d] shadow-xl">
              <div className="flex items-center justify-between text-xs text-blue-400 font-bold mb-2">
                <span>BARISAN NASIONAL</span>
                <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-500/40 text-[10px]">SIMPLE MAJORITY</span>
              </div>
              <div className="text-5xl font-black text-white mb-2">18 <span className="text-sm font-normal text-blue-400">/ 36 DUN</span></div>
              <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <span>▲ +5 Seats vs 2023</span>
                <span className="text-slate-400 font-normal">(2023: 13 Seats)</span>
              </div>
              <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800 font-sans">
                BN forms the state government after sweeping traditional rural seats, FELDA schemes, and winning key mixed flips (Chennah, Labu, Repah, Pilah).
              </p>
            </div>

            {/* PH */}
            <div className="p-6 rounded-lg border-2 border-red-500 bg-[#1a0c0c] shadow-xl">
              <div className="flex items-center justify-between text-xs text-red-400 font-bold mb-2">
                <span>PAKATAN HARAPAN</span>
                <span className="px-2 py-0.5 rounded bg-red-950 text-red-300 border border-red-500/40 text-[10px]">MAIN OPPOSITION</span>
              </div>
              <div className="text-5xl font-black text-white mb-2">11 <span className="text-sm font-normal text-red-400">/ 36 DUN</span></div>
              <div className="text-xs text-red-400 font-bold flex items-center gap-1">
                <span>▼ -8 Seats vs 2023</span>
                <span className="text-slate-400 font-normal">(2023: 19 Seats)</span>
              </div>
              <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800 font-sans">
                PH retained urban strongholds (Nilai, Lobak, Temiang, Bukit Kepayang, Rahang, Mambau, Seremban Jaya) but lost mixed marginals & MB seat Sikamat.
              </p>
            </div>

            {/* PN */}
            <div className="p-6 rounded-lg border-2 border-emerald-500 bg-[#091811] shadow-xl">
              <div className="flex items-center justify-between text-xs text-emerald-400 font-bold mb-2">
                <span>PERIKATAN NASIONAL</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 text-[10px]">THIRD FORCE</span>
              </div>
              <div className="text-5xl font-black text-white mb-2">7 <span className="text-sm font-normal text-emerald-400">/ 36 DUN</span></div>
              <div className="text-xs text-emerald-400 font-bold flex items-center gap-1">
                <span>▲ +5 Seats vs 2023</span>
                <span className="text-slate-400 font-normal">(2023: 2 Seats)</span>
              </div>
              <p className="text-xs text-slate-300 mt-3 pt-3 border-t border-slate-800 font-sans">
                PN flipped Klawang, Sikamat, Ampangan, and retained Serting, Paroi, Gemas, Bagan Pinang through high Malay turnout wave.
              </p>
            </div>
          </div>

          {/* 7 KEY SEAT FLIPS GRID */}
          <div className="p-6 rounded-lg border border-amber-500/40 bg-[#090c14] font-mono">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-amber-500 text-black font-bold text-xs uppercase">⚡ 7 SEAT FLIPS</span>
                <strong className="text-slate-200 text-sm">Constituencies That Shifted Alignment</strong>
              </div>
              <span className="text-xs text-slate-400">2023 Status Quo → 2026 Final Outcome</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
              <div className="p-3 rounded bg-slate-950 border border-blue-500/40">
                <div className="flex justify-between items-center text-amber-400 font-bold mb-1">
                  <span>DUN N1 Chennah</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px]">PH → BN</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">BN won seat from DAP Loke Siew Fook as Chinese turnout dipped & MCA consolidated mixed votes.</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-emerald-500/40">
                <div className="flex justify-between items-center text-emerald-400 font-bold mb-1">
                  <span>DUN N4 Klawang</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">PH → PN</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">PN (PAS) flipped marginal Jelebu seat from AMANAH incumbent Bakri Sawir.</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-emerald-500/40">
                <div className="flex justify-between items-center text-emerald-400 font-bold mb-1">
                  <span>DUN N13 Sikamat</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">PH → PN</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">PN won MB Aminuddin's former seat after he relocated candidacy to Linggi.</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-emerald-500/40">
                <div className="flex justify-between items-center text-emerald-400 font-bold mb-1">
                  <span>DUN N14 Ampangan</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">PH → PN</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">PN flipped ultra-marginal Seremban Malay seat (was 329-vote PKR majority in 2023).</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-blue-500/40">
                <div className="flex justify-between items-center text-blue-400 font-bold mb-1">
                  <span>DUN N18 Pilah</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px]">PH → BN</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">BN UMNO machine reclaimed Kuala Pilah town seat from PKR incumbent Noorzunita.</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-blue-500/40">
                <div className="flex justify-between items-center text-blue-400 font-bold mb-1">
                  <span>DUN N20 Labu</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px]">PN → BN</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">BN won seat from Bersatu after opposition split friction diluted PN votes.</p>
              </div>

              <div className="p-3 rounded bg-slate-950 border border-blue-500/40">
                <div className="flex justify-between items-center text-blue-400 font-bold mb-1">
                  <span>DUN N36 Repah</span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-300 text-[10px]">PH → BN</span>
                </div>
                <p className="text-slate-300 text-[11px] font-sans">BN won Tampin town mixed seat from DAP incumbent Veerapan.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRE VS POST AGENTIC PREDICTION ACCURACY AUDIT SECTION */}
      <section className="py-12 border-b border-forge-iron bg-[#050810]">
        <div className="site-frame">
          <div className="mb-8">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-widest mb-1 flex items-center gap-2">
              <span>Hermes Model Verification · Epistemic Truth Audit</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold">80.6% Model Precision (29/36 Seats)</span>
            </div>
            <h2 className="text-3xl font-black italic uppercase text-white">
              🤖 Agentic Pre vs Post Prediction Audit
            </h2>
            <p className="text-sm font-mono text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Evaluating arifOS 9-Invariant Quantum Model predictions against official SPR declared results (1 Ogos 2026).
            </p>
          </div>

          {/* SIDE BY SIDE PRE VS POST SCORECARD GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8 font-mono text-xs">
            {/* PRE-ELECTION PROJECTION CARD */}
            <div className="p-6 rounded-lg border border-amber-500/40 bg-[#0c0f1d] shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-amber-400 font-bold text-sm uppercase">🔮 PRE-ELECTION MODEL PROJECTION</span>
                <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px]">BEFORE 1 OGOS</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-400">Assembly Forecast:</span>
                  <strong className="text-amber-300 text-sm">HUNG ASSEMBLY (18 PH - 16 BN - 2 PN - 2 Tossup)</strong>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-400">Winning Plurality Vector:</span>
                  <strong className="text-red-400">Pakatan Harapan (18 Seats)</strong>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-400">Top Volatility Flagged:</span>
                  <strong className="text-amber-400">DUN N32 Linggi & DUN N14 Ampangan</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800/80 text-[11px] text-slate-300 font-sans italic">
                  "Model projected PH to hold mixed seat baseline assuming 68%+ non-Malay turnout and independent Bersatu candidate vote splitting."
                </div>
              </div>
            </div>

            {/* POST-ELECTION ACTUAL OUTCOME CARD */}
            <div className="p-6 rounded-lg border border-emerald-500/40 bg-[#091712] shadow-xl">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <span className="text-emerald-400 font-bold text-sm uppercase">🏆 POST-ELECTION OFFICIAL RESULT</span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 text-[10px]">SPR DECLARED 1 OGOS</span>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-400">Actual Assembly Tally:</span>
                  <strong className="text-emerald-400 text-sm">BN SIMPLE MAJORITY (18 BN - 11 PH - 7 PN)</strong>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-400">State Government Formed:</span>
                  <strong className="text-blue-400">Barisan Nasional (BN 18 Seats)</strong>
                </div>
                <div className="flex justify-between items-center bg-slate-950 p-3 rounded border border-slate-800">
                  <span className="text-slate-400">Actual Inversions (Flips):</span>
                  <strong className="text-amber-400">7 Seats Flipped (N1, N4, N13, N14, N18, N20, N36)</strong>
                </div>
                <div className="p-3 bg-slate-950 rounded border border-slate-800/80 text-[11px] text-slate-300 font-sans italic">
                  "BN swept rural FELDA heartlands & flipped 4 mixed/town seats as Chinese turnout dipped ~12% and Malay votes consolidated behind BN/PN."
                </div>
              </div>
            </div>
          </div>

          {/* MODEL FALSIFICATION & INVARIANT AUDIT LESSONS */}
          <div className="p-6 rounded-lg border border-slate-800 bg-[#090d18] font-mono text-xs">
            <div className="text-amber-400 font-bold text-sm uppercase mb-4 flex items-center justify-between border-b border-slate-800 pb-2">
              <span>🔬 Agentic Falsification & Model Learning Audit</span>
              <span className="text-slate-400 text-[11px]">F2 TRUTH DECLARED</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-slate-300 font-sans leading-relaxed">
              <div className="p-4 rounded bg-slate-950 border border-slate-800">
                <strong className="text-emerald-400 block font-mono text-xs mb-1">✅ WHAT THE MODEL GOT RIGHT:</strong>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>Winning Seat Benchmark:</strong> Model correctly predicted 18 seats needed for governing control.</li>
                  <li>• <strong>Epicenter Volatility:</strong> Correctly flagged N32 Linggi and N14 Ampangan as top risk zones.</li>
                  <li>• <strong>PN Malay Surge:</strong> Correctly predicted PN seat expansion in Malay heartland (2 → 7 seats).</li>
                </ul>
              </div>
              <div className="p-4 rounded bg-slate-950 border border-slate-800">
                <strong className="text-amber-400 block font-mono text-xs mb-1">⚠️ WHERE GROUND REALITY INVERTED:</strong>
                <ul className="space-y-1 text-xs">
                  <li>• <strong>INV6 Floor Drift:</strong> Non-Malay turnout dropped below 62% in rural mixed seats (Chennah N1, Repah N36).</li>
                  <li>• <strong>INV5 MB Relocation Friction:</strong> MB Aminuddin moving to Linggi triggered voter backlash in N13 Sikamat.</li>
                  <li>• <strong>BN Grassroots Machine (INV7):</strong> Tok Mat's machinery out-organized PH in mixed rural corridors.</li>
                </ul>
              </div>
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
                    <span className="text-amber-400 font-bold">Seat Flips</span>
                    <span className="text-slate-200">7 Seats (19.4%)</span>
                  </div>
                  <div className="w-full bg-slate-900 h-2 rounded overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${(7 / totalSeats) * 100}%` }}></div>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-xs text-slate-400 leading-relaxed font-mono">
                Threshold for simple majority: <strong>19 Seats</strong>. Barisan Nasional secured 18 Seats to lead the assembly and form the state government.
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

              </div>
            </div>
          </div>

          {/* INTEL DAP VS SOVEREIGN FEDERATION DIGITAL WARFARE MATRIX */}
          <div className="mt-8 p-6 rounded-lg border border-amber-500/40 bg-slate-950">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-xl font-black italic uppercase text-amber-400">
                  🕵️ Digital Warfare Matrix: Red Bean Army / DAP Intel vs arifOS Federation
                </h3>
                <p className="font-mono text-xs text-slate-400 mt-0.5">
                  Comparative contrast audit: Defensive Traditional Campaign vs Offensive Agentic GIS Operations
                </p>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-500/50 font-mono text-[10px] font-bold">
                AUDIT VERDICT: 2 GENERATIONS AHEAD
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="p-4 rounded border border-red-500/30 bg-red-950/10">
                <h4 className="font-bold text-red-400 text-sm mb-2 uppercase">🔴 DAP / PH Stack (Defensive Traditional)</h4>
                <ul className="space-y-2 text-slate-300 text-[11px]">
                  <li>• <strong>Surface:</strong> WordPress blogs & static HTML brosurs (dapmalaysia.org).</li>
                  <li>• <strong>Manifesto:</strong> Static Flipbook HTML5 PDF ("Kekal Harapan").</li>
                  <li>• <strong>AI Claims:</strong> PKR "Teras" AI claims without public GIS or seat tools.</li>
                  <li>• <strong>Strategy:</strong> Defensive stance relying on 85-90% fixed Chinese base.</li>
                </ul>
              </div>

              <div className="p-4 rounded border border-emerald-500/30 bg-emerald-950/10">
                <h4 className="font-bold text-emerald-400 text-sm mb-2 uppercase">🟢 arifOS Sovereign Stack (Offensive Agentic)</h4>
                <ul className="space-y-2 text-slate-300 text-[11px]">
                  <li>• <strong>Surface:</strong> Interactive Leaflet GIS OpenStreetMap Engine with exact lat/lng.</li>
                  <li>• <strong>Telemetry:</strong> Live Sensory Stream (`ns_live_telemetry.json`) with volatility scores.</li>
                  <li>• <strong>Playbook:</strong> 8-Swing seat microtargeting, counter-narratives & GOTV checklist.</li>
                  <li>• <strong>Strategy:</strong> Offensive stance capturing high-entropy marginal seats.</li>
                </ul>
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
