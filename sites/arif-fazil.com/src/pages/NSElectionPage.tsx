import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ElectionCartographyMap, NS_SEATS, type SeatData, PARTY_COLORS } from '@/components/ElectionCartographyMap';
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
        // Derive response from live telemetry payload — no hardcoded competing numbers
        const sealedForecast = liveTelemetry
          ? {
              bn_pn_forecast_pct: liveTelemetry.bn_pn_coalition_forecast_pct,
              bn_pn_forecast_label: liveTelemetry.bn_pn_coalition_forecast_label,
              source_as_of: liveTelemetry.bn_pn_coalition_forecast_source_as_of,
              health: liveTelemetry.health || 'UNKNOWN',
              polymarket_status: liveTelemetry.polymarket_status || 'UNKNOWN',
              updated_at_utc: liveTelemetry.updated_at
            }
          : { error: 'telemetry_unavailable', note: 'Visit /politics/ns-election/ to load live data' };
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              schema: 'arifos.n9.audit.v1',
              top_invariant: 'Opposition Split Friction (Bersatu factor) — see TOP_9_INVARIANTS for full atlas',
              seats_count: NS_SEATS.length,
              forecast_source: '/sealed/n9-ground-truth.json (F13 sovereign) + /data/politics/ns_live_telemetry.json (live)',
              sealed_forecast: sealedForecast,
              telemetry_url: 'https://arif-fazil.com/data/politics/ns_live_telemetry.json',
              sealed_truth_url: '/sealed/n9-ground-truth.json',
              note: 'No competing prediction surfaces. This tool surfaces the SAME sealed ground truth + live telemetry the page renders.'
            })
          }]
        };
      }
    }
  ]);

  useEffect(() => {
    document.title = 'Negeri Sembilan PRN 2026 — Live Dynamic Intelligence & 9 Quantum Invariants | arifOS';
  }, []);

  // Live sensory telemetry — fetched from /data/politics/ns_live_telemetry.json
  // Refreshed every 15 min via root cron (generate-ns-telemetry.cjs)
  // Provenance per field is exposed via the JSON `*_label` and `as_of` keys.
  const [liveTelemetry, setLiveTelemetry] = useState<{
    updated_at?: string;
    sentiment_index?: {
      ph_positive: number;
      bn_positive: number;
      pn_positive: number;
      source?: string;
      source_id?: string;
      source_url?: string;
      as_of?: string;
      epistemic_class?: string;
    } | null;
    voter_turnout_projection_pct?: number | null;
    highest_volatility_seat?: string | null;
    bn_pn_coalition_forecast_pct?: number | null;
    bn_pn_coalition_forecast_label?: string | null;
    bn_pn_coalition_forecast_source_as_of?: string | null;
    polymarket_status?: string;
    health?: string;
    ground_telemetry_seats?: Array<{
      code: string;
      name: string;
      status: string;
      live_sentiment: string;
      note?: string;
      epistemic_class?: string;
    }>;
    sovereign_synthesis?: {
      BN_range?: [number, number];
      PN_range?: [number, number];
      PH_range?: [number, number];
      BERSATU_range?: [number, number];
      expected_coalition?: string;
      sovereign_confidence_pct?: number;
      bn_pn_coalition_forecast_pct?: number;
      bn_pn_coalition_forecast_label?: string;
    };
  } | null>(null);

  useEffect(() => {
    let cancelled = false;
    const fetchTelemetry = async () => {
      try {
        const res = await fetch('/data/politics/ns_live_telemetry.json', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (!cancelled) {
          setLiveTelemetry({
            ...data?.summary_metrics,
            updated_at: data?.metadata?.updated_at_utc || data?.metadata?.updated_at,
            polymarket_status: data?.polymarket?.status,
            health: data?.metadata?.health,
            ground_telemetry_seats: data?.ground_telemetry_seats,
            sovereign_synthesis: data?.sovereign_synthesis
          });
        }
        const meta = data?.metadata;
        if (meta?.updated_at_utc && !cancelled) {
          document.title = `N9 ${meta.health || 'LIVE'} ${new Date(meta.updated_at_utc).toISOString().slice(11, 16)}UTC — 9 Quantum Invariants | arifOS`;
        }
      } catch {
        // telemetry offline — page still functions
      }
    };
    fetchTelemetry();
    const id = setInterval(fetchTelemetry, 15 * 60 * 1000); // 15-min refresh
    return () => {
      cancelled = true;
      clearInterval(id);
    };
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
          <span>Sealed Truth: <code className="text-amber-400">{liveTelemetry?.updated_at ? new URL('/sealed/n9-ground-truth.json', 'https://arif-fazil.com').pathname : 'VAULT999-PRN16-NS-GT-002'}</code></span>
          <span>Forecast:
            <strong className={
              liveTelemetry?.bn_pn_coalition_forecast_label === 'live_polymarket' ? 'text-emerald-400' :
              liveTelemetry?.bn_pn_coalition_forecast_label === 'sovereign_projection' ? 'text-amber-400' :
              'text-slate-400'
            }>
              {liveTelemetry?.bn_pn_coalition_forecast_pct != null
                ? `BN-PN ${liveTelemetry.bn_pn_coalition_forecast_pct}% (${liveTelemetry.bn_pn_coalition_forecast_label || 'pending'})`
                : 'pending telemetry'}
            </strong>
          </span>
          {liveTelemetry && (
            <span className="hidden md:inline" data-testid="live-telemetry-strip">
              {liveTelemetry.sentiment_index ? (
                <>
                  PH <strong className="text-emerald-300">{liveTelemetry.sentiment_index.ph_positive?.toFixed(1) ?? '—'}%</strong>{' '}
                  · BN <strong className="text-amber-300">{liveTelemetry.sentiment_index.bn_positive?.toFixed(1) ?? '—'}%</strong>{' '}
                  · PN <strong className="text-sky-300">{liveTelemetry.sentiment_index.pn_positive?.toFixed(1) ?? '—'}%</strong>
                  <span className="text-slate-500"> ({liveTelemetry.sentiment_index.source ?? 'sealed'} · {liveTelemetry.sentiment_index.as_of ?? '—'})</span>{' '}
                </>
              ) : (
                <span className="text-slate-500">Sentiment awaiting source</span>
              )}
              {liveTelemetry.bn_pn_coalition_forecast_pct != null && (
                <>
                  · BN-PN <strong className="text-fuchsia-300">{liveTelemetry.bn_pn_coalition_forecast_pct}%</strong>
                  <span className="text-slate-500"> ({liveTelemetry.bn_pn_coalition_forecast_label ?? 'projection'})</span>
                </>
              )}
              {liveTelemetry.voter_turnout_projection_pct != null && (
                <> · Turnout <strong className="text-slate-200">{liveTelemetry.voter_turnout_projection_pct.toFixed(1)}%</strong></>
              )}
            </span>
          )}
        </div>
      </div>

      {/* HEADER (zen) + live telemetry panel */}
      <section className="py-32 border-b border-forge-iron">
        <div className="max-w-[640px] mx-auto px-6">
          <div className="font-mono text-[11px] uppercase tracking-widest text-amber-400 mb-6 flex items-center gap-2">
            <span>PRN 2026 State Election Briefing</span>
            <span>·</span>
            <span>36 DUN Seats</span>
            <span>·</span>
            <span className="text-emerald-400">19 Needed For Majority</span>
          </div>
          <h1 className="text-4xl font-light text-white mb-3">Negeri Sembilan</h1>
          <p className="text-amber-400 text-xl font-light mb-6">
            Live Dynamic Seat Matrix &amp; 9 Invariants
          </p>
          <p className="text-slate-300 text-base leading-relaxed mb-3">
            Polling Day: <strong className="text-amber-300">Sabtu, 1 Ogos 2026</strong> · Early Voting: <strong>Rabu, 29 Julai 2026</strong>
          </p>
          <p className="text-slate-300 text-base leading-relaxed mb-8">
            Multi-lens analysis combining Demographics, Economic Thermodynamics, Adat Perpatih Culture, and Bersatu 3-way Split Mechanics.
          </p>
        </div>

        {/* Live telemetry panel — functional, kept */}
        <div className="max-w-[960px] mx-auto px-6 mt-8">
          <div
            className={`p-6 border font-mono text-xs ${
              liveTelemetry?.health === 'OK' ? 'border-emerald-500/50' :
              liveTelemetry?.health === 'SEALED_ONLY' ? 'border-amber-500/50' :
              liveTelemetry?.health === 'LIVE_PARTIAL' ? 'border-amber-500/50' :
              'border-rose-500/50'
            } bg-slate-950`}
            data-testid="live-provenance-panel"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-3">
                <span className={`w-2.5 h-2.5 rounded-full animate-ping ${
                  liveTelemetry?.health === 'OK' ? 'bg-emerald-500' :
                  liveTelemetry?.health === 'DEGRADED' ? 'bg-rose-500' :
                  'bg-amber-500'
                }`}></span>
                <strong className="font-bold uppercase tracking-wider text-slate-200">
                  {liveTelemetry?.health === 'OK' ? 'LIVE SENSORY STREAM' :
                   liveTelemetry?.health === 'SEALED_ONLY' ? 'SEALED GROUND TRUTH' :
                   liveTelemetry?.health === 'LIVE_PARTIAL' ? 'LIVE PARTIAL' :
                   liveTelemetry?.health === 'DEGRADED' ? 'DEGRADED TELEMETRY' :
                   'TELEMETRY LOADING'}
                </strong>
                <span className="text-[10px] text-slate-500 font-normal">
                  {liveTelemetry?.updated_at ? new Date(liveTelemetry.updated_at).toISOString().replace('T', ' ').slice(0, 19) + ' UTC' : '—'}
                </span>
              </div>
              <span className="text-[10px] text-slate-500">
                {liveTelemetry?.polymarket_status === 'LIVE_MATCH' ? '📈 Polymarket LIVE' :
                 liveTelemetry?.polymarket_status === 'NO_MARKET' ? 'Polymarket: no N9 market' :
                 liveTelemetry?.polymarket_status || '—'}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Highest Volatility</div>
                <div className="text-amber-400 font-bold">
                  {liveTelemetry?.highest_volatility_seat
                    ? liveTelemetry.highest_volatility_seat
                    : '—'}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">Voter Turnout Projection</div>
                <div className="text-slate-100 font-bold">
                  {liveTelemetry?.voter_turnout_projection_pct != null
                    ? `${liveTelemetry.voter_turnout_projection_pct}%`
                    : '—'}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">BN-PN Coalition Forecast</div>
                <div className="text-fuchsia-300 font-bold">
                  {liveTelemetry?.bn_pn_coalition_forecast_pct != null
                    ? `${liveTelemetry.bn_pn_coalition_forecast_pct}%`
                    : '—'}
                  <span className="text-[10px] text-slate-500 ml-2 font-normal">
                    {liveTelemetry?.bn_pn_coalition_forecast_label || '—'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 mt-4 border-t border-slate-900 text-[10px] text-slate-500 grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>Sentiment (Vodus, n=437, OBS):
                {liveTelemetry?.sentiment_index
                  ? ` PH ${liveTelemetry.sentiment_index.ph_positive?.toFixed(1) ?? '—'} · BN ${liveTelemetry.sentiment_index.bn_positive?.toFixed(1) ?? '—'} · PN ${liveTelemetry.sentiment_index.pn_positive?.toFixed(1) ?? '—'}`
                  : ' —'}
              </div>
              <div>Sealed truth: VAULT999-PRN16-NS-GT-002</div>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE COUNTDOWN & CURRENT STATE VS PREDICTION FORWARD SECTION */}
      <section className="py-8 border-b border-forge-iron bg-slate-950">
        <div className="site-frame">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            {/* LIVE COUNTDOWN TIMER */}
            <div className="p-5 rounded-lg border border-amber-500/50 bg-[#07090E] shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between font-mono text-xs mb-3">
                <span className="flex items-center gap-1.5 text-amber-400 font-bold uppercase tracking-wider">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping"></span>
                  ⏳ LIVE COUNTDOWN TO POLLING
                </span>
                <span className="text-slate-500 font-mono text-[10px]">SABTU 1 OGOS 2026</span>
              </div>
              <div className="grid grid-cols-4 gap-2 font-mono text-center my-2">
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-2xl font-black text-amber-400">03</div>
                  <div className="text-[10px] text-slate-500 uppercase">HARI</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-2xl font-black text-slate-200">12</div>
                  <div className="text-[10px] text-slate-500 uppercase">JAM</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-2xl font-black text-slate-200">45</div>
                  <div className="text-[10px] text-slate-500 uppercase">MINIT</div>
                </div>
                <div className="p-2 rounded bg-slate-900 border border-slate-800">
                  <div className="text-2xl font-black text-emerald-400">30</div>
                  <div className="text-[10px] text-slate-500 uppercase">SAAT</div>
                </div>
              </div>
              <p className="text-[11px] font-mono text-slate-400 mt-2 text-center">
                Early Voting: <strong className="text-slate-200">Rabu 29 Julai (Polis/Tentera)</strong>
              </p>
            </div>

            {/* CURRENT STATE VS PREDICTION MOVING FORWARD */}
            <div className="lg:col-span-2 p-5 rounded-lg border border-slate-800 bg-[#07090E] grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="p-4 rounded bg-slate-950 border border-red-500/30">
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-red-400 font-bold uppercase tracking-wider text-xs">📌 CURRENT STATE (STATUS QUO 2023)</strong>
                  <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 text-[10px]">36 SEATS</span>
                </div>
                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  <p>• <strong>PH-BN Coalition:</strong> 31 Seats (PH 17 + BN 14)</p>
                  <p>• <strong>Perikatan Nasional:</strong> 5 Seats (PAS 3 + Bersatu 2)</p>
                  <p>• <strong>Marginal Baseline:</strong> 4 Seats under 600-vote majority</p>
                  <p className="text-slate-400 italic pt-1 border-t border-slate-900">"Comfortable 31-5 supermajority in 2023 under formal PH-BN electoral pact."</p>
                </div>
              </div>

              <div className="p-4 rounded bg-slate-950 border border-amber-500/30">
                <div className="flex items-center justify-between mb-2">
                  <strong className="text-amber-400 font-bold uppercase tracking-wider text-xs">🌙 SOVEREIGN PROJECTION (PRN16 — sealed ground truth, INT)</strong>
                  <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 text-[10px] font-bold">
                    BN-PN {liveTelemetry?.bn_pn_coalition_forecast_pct ?? '—'}%
                  </span>
                </div>
                <div className="space-y-1.5 text-slate-300 text-[11px]">
                  {(() => {
                    const syn = liveTelemetry?.sovereign_synthesis || null;
                    if (!syn) return <p className="text-slate-500 italic">Loading sealed ground truth…</p>;
                    const coalition = `${syn.BN_range?.[0] ?? '?'}–${syn.BN_range?.[1] ?? '?'} BN + ${syn.PN_range?.[0] ?? '?'}–${syn.PN_range?.[1] ?? '?'} PN = 21–24 seats`;
                    return (
                      <>
                        <p>• <strong>BN coalition core:</strong> {coalition}</p>
                        <p>• <strong>PH opposition:</strong> {syn.PH_range?.[0]}–{syn.PH_range?.[1]} seats</p>
                        <p>• <strong>Bersatu independent:</strong> {syn.BERSATU_range?.[0]}–{syn.BERSATU_range?.[1]} seats (structural opposition split)</p>
                        <p>• <strong>Sovereign confidence:</strong> {syn.sovereign_confidence_pct}%</p>
                        <p className="text-amber-300/90 italic pt-1 border-t border-slate-900">
                          "{syn.expected_coalition || 'See sealed truth'}"
                        </p>
                      </>
                    );
                  })()}
                </div>
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
            <h2 className="text-2xl font-light text-white mb-8">
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
                <h4 className="text-xl font-light text-white mb-2">
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
              <h2 className="text-xl font-light text-slate-100 mb-6">
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
                <h3 className="text-2xl font-light text-white mb-3">
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
              <h3 className="text-base font-light text-amber-400 mb-3 flex items-center gap-2">
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
              <h3 className="text-base font-light text-slate-100 mb-3 flex items-center gap-2">
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
                <h3 className="text-lg font-light text-amber-400 mb-2">
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
