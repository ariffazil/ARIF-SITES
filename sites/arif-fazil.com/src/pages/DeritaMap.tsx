import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QuoteCard } from '@/components/QuoteCard';
import { useWebMCP } from '@/hooks/useWebMCP';

/**
 * RASA DERITA — 6-Cohort Generational Trauma Map
 * Framework Analysis. HYPOTHESIS — confidence 0.20. BUKAN FAKTA.
 * 
 * Purpose: Map Malaysia's institutional trauma across 6 cohorts,
 * connecting each to constitutional floors (F1-F13) as SCARS, not metaphors.
 * Integrated into Shadow Board as one "kerusi" (dossier).
 * 
 * Δ-ONLY · Framework analysis — bukan ramalan, bukan fakta.
 * Confidence cap: 0.90 (F7). All claims tagged [INT]/[SPEC].
 */

/* ── TRAUMA COHORT DATA ── */
interface TraumaCohort {
  id: string;
  era: string;
  event: string;
  year: string;
  thesis: string;
  floorScars: string[];   // Constitutional floors scarred
  apexScore: { A: number; P: number; E: number; X: number };  // APEX letter scores
  generationalImpact: string;
}

const COHORTS: TraumaCohort[] = [
  {
    id: 'T0',
    era: 'PEMBENTUKAN',
    event: '13 Mei 1969',
    year: '1969',
    thesis: 'Rusuhan kaum sebagai foundational trauma — kontrak sosial yang dibina atas ketakutan, bukan kepercayaan. Tunku tidak nampak ia datang. Sistem dibina atas race line.',
    floorScars: ['F1 AMANAH — amanah antara kaum pecah', 'F5 PEACE² — kuasa digunakan secara destruktif', 'F6 MARUAH — maruah komuniti terjejas'],
    apexScore: { A: 0.35, P: 0.40, E: 0.55, X: 0.20 },
    generationalImpact: 'Gen pertama pasca-Merdeka belajar: keamanan adalah gencatan senjata, bukan perpaduan.'
  },
  {
    id: 'T1',
    era: 'AUTORITARIANISME',
    event: 'Reformasi 1998',
    year: '1998',
    thesis: 'Penangkapan Anwar Ibrahim memecahkan ilusi demokrasi. Mahathir buang hakim, kunci lawan, ubah sistem — semuanya atas nama "pembangunan." Bayang Mahathir: megalomania bersalut nasionalisme.',
    floorScars: ['F2 TRUTH — naratif rasmi vs realiti', 'F3 TRI-WITNESS — hanya satu versi kebenaran diterima', 'F13 SOVEREIGN — kedaulatan rakyat ditolak'],
    apexScore: { A: 0.25, P: 0.30, E: 0.65, X: 0.15 },
    generationalImpact: 'Generasi Reformasi belajar: institusi boleh dibeli. Keadilan adalah privilege, bukan hak.'
  },
  {
    id: 'T2',
    era: 'KORUPSI SISTEMIK',
    event: 'Skandal 1MDB',
    year: '2015',
    thesis: 'USD 4.5 billion hilang. Bukan sekadar curi duit — ia pendedahan bahawa sistem Malaysia dibina atas lubang. Najib adalah result logik: anak PM, dibesarkan dalam kuasa, tak pernah kena "tidak."',
    floorScars: ['F7 HUMILITY — arrogance of untouchability', 'F11 AUDITABILITY — buku dimasak, audit digagalkan', 'F4 CLARITY — maklumat sengaja dikaburkan'],
    apexScore: { A: 0.20, P: 0.25, E: 0.70, X: 0.10 },
    generationalImpact: 'Generasi 1MDB belajar: pencuri boleh jadi PM. Sistem melindungi yang atas.'
  },
  {
    id: 'T3',
    era: 'RAMPASAN KUASA',
    event: 'Langkah Sheraton',
    year: '2020',
    thesis: 'Kerajaan PH ditumbangkan bukan melalui pilihan raya — tetapi melalui lompat parti. Muhyiddin naik takhta dari pintu belakang. Bayang Muhyiddin: kuasa tanpa legitimacy. Preseden paling bahaya dalam demokrasi Malaysia.',
    floorScars: ['F13 SOVEREIGN — mandat rakyat dirompak', 'F3 TRI-WITNESS — konsensus demokratik diabaikan', 'F8 GENIUS — keputusan dibuat tanpa evidence'],
    apexScore: { A: 0.20, P: 0.15, E: 0.80, X: 0.10 },
    generationalImpact: 'Generasi Sheraton belajar: undi anda tak bermakna. Sesiapa boleh jadi PM tanpa menang.'
  },
  {
    id: 'T4',
    era: 'VAKUM KERAJAAN',
    event: 'Ketidakstabilan Era COVID',
    year: '2021–2022',
    thesis: 'Tiga PM dalam tiga tahun — Muhyiddin, Ismail Sabri, Anwar. Pandemik mendedahkan governance vacuum. Ismail Sabri naik bukan kerana hebat, tapi kerana semua orang lain terlalu letih bergaduh. PM default.',
    floorScars: ['F8 GENIUS — governance by default, bukan merit', 'F12 RESILIENCE — sistem gagal dalam krisis', 'F4 CLARITY — rakyat kebingungan'],
    apexScore: { A: 0.30, P: 0.20, E: 0.75, X: 0.15 },
    generationalImpact: 'Generasi COVID belajar: kerajaan adalah afterthought. Survival sendiri.'
  },
  {
    id: 'T5',
    era: 'PARADOKS',
    event: 'Reformis dalam Sistem UMNO',
    year: '2022–sekarang',
    thesis: 'Anwar Ibrahim — pejuang reformasi 20 tahun akhirnya jadi PM. Tapi bila dapat kuasa, dia pakai sistem yang sama. UMNO yang dia lawan sekarang jadi kawan sekantor. Bayang Anwar: pemimpin yang tak jumpa bayang sendiri. Dulu lawan sistem — sekarang sistem tu jadi dia.',
    floorScars: ['F9 ANTI-HANTU — persona terlalu cantik, bayang tak dihadapi', 'F1 AMANAH — amanah reformasi', 'F7 HUMILITY — tak pernah cakap "saya silap"'],
    apexScore: { A: 0.25, P: 0.35, E: 0.60, X: 0.20 },
    generationalImpact: 'Generasi sekarang belajar: reformis boleh menjadi sistem yang dia lawan. Perubahan mengambil masa lebih dari satu penggal — atau satu nyawa.'
  }
];

/* ── FLOOR SCAR LEGEND ── */
const FLOOR_MAP: Record<string, { name: string; desc: string; type: 'HARD' | 'SOFT' | 'DERIVED' }> = {
  'F1': { name: 'AMANAH', desc: 'Trust, custody, fiduciary duty', type: 'HARD' },
  'F2': { name: 'TRUTH', desc: 'Epistemic honesty, evidence-grounded', type: 'HARD' },
  'F3': { name: 'TRI-WITNESS', desc: 'Human × AI × Earth ≥ 0.75', type: 'DERIVED' },
  'F4': { name: 'CLARITY', desc: 'ΔS ≤ 0 — entropy reduction', type: 'HARD' },
  'F5': { name: 'PEACE²', desc: 'Non-destructive power', type: 'SOFT' },
  'F6': { name: 'MARUAH', desc: 'Dignity, protect weakest', type: 'SOFT' },
  'F7': { name: 'HUMILITY', desc: 'Ω₀ ∈ [0.03, 0.05]', type: 'HARD' },
  'F8': { name: 'GENIUS', desc: 'G ≥ 0.80 for complex actions', type: 'DERIVED' },
  'F9': { name: 'ANTI-HANTU', desc: 'No deception, C_dark < 0.30', type: 'HARD' },
  'F11': { name: 'AUDITABILITY', desc: 'Every decision logged', type: 'HARD' },
  'F12': { name: 'RESILIENCE', desc: 'Injection defense, Risk < 0.85', type: 'HARD' },
  'F13': { name: 'SOVEREIGN', desc: 'Human veto FINAL', type: 'HARD' },
};

export function DeritaMap() {
  const deritaTools = [
    {
      name: 'get_derita_map',
      description: 'RASA DERITA — 6-Cohort Generational Trauma Map: Malaysia\'s institutional trauma mapped onto arifOS constitutional floors. Framework analysis (HYPOTHESIS, confidence 0.20), bukan fakta.',
      execute() {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              framework: 'RASA DERITA — 6-Cohort Generational Trauma Map',
              epistemic_status: 'HYPOTHESIS · confidence 0.20 · BUKAN FAKTA',
              purpose: 'Framework analysis of Malaysian institutional trauma through the lens of arifOS constitutional floors (F1-F13). Each cohort represents a generational experience of institutional failure. Floors are SCARS — constitutional memory of what broke.',
              cohorts: COHORTS.map(c => ({
                id: c.id, era: c.era, event: c.event, thesis: c.thesis, floorScars: c.floorScars
              })),
              verdict: 'FRAMEWORK_ANALYSIS · HOLD · pending VAULT999 seal'
            }, null, 2)
          }]
        };
      }
    }
  ];

  useWebMCP(deritaTools);

  useEffect(() => {
    document.title = 'RASA DERITA — Generational Trauma Map · arifOS Shadow Board';
    document.querySelector('link[rel=canonical]')?.setAttribute('href', 'https://arif-fazil.com/politics/shadow/derita');
  }, []);

  /* APEX grade string from scores */
  const apexGrade = (s: { A: number; P: number; E: number; X: number }) => {
    const g = Math.pow(s.A * s.P * s.E * s.X, 0.25);
    if (g < 0.15) return { label: 'KRITIKAL', color: 'text-red-400', bg: 'bg-red-500/10' };
    if (g < 0.25) return { label: 'PARAH', color: 'text-orange-400', bg: 'bg-orange-500/10' };
    if (g < 0.35) return { label: 'TERLUKA', color: 'text-amber-400', bg: 'bg-amber-500/10' };
    return { label: 'PULIH', color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  };

  const cohortColor = (era: string) => {
    switch (era) {
      case 'PEMBENTUKAN': return 'border-l-red-500';
      case 'AUTORITARIANISME': return 'border-l-orange-500';
      case 'KORUPSI SISTEMIK': return 'border-l-amber-500';
      case 'RAMPASAN KUASA': return 'border-l-yellow-500';
      case 'VAKUM KERAJAAN': return 'border-l-slate-500';
      case 'PARADOKS': return 'border-l-cyan-500';
      default: return 'border-l-forge-iron';
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      {/* HERO — Framework Warning Banner */}
      <section className="bg-red-950/30 border-b-2 border-red-800/60">
        <div className="site-frame py-4">
          <div className="flex items-start gap-3">
            <span className="text-red-400 text-2xl shrink-0 mt-0.5">⚠</span>
            <div>
              <div className="font-mono text-xs text-red-400 uppercase tracking-widest font-bold">
                FRAMEWORK ANALYSIS — BUKAN FAKTA · BUKAN RAMALAN
              </div>
              <p className="font-body text-sm text-red-300/80 mt-1 leading-relaxed">
                RASA DERITA adalah kerangka analisis generasi, bukan fakta sejarah muktamad.
                Confidence: <strong>0.20 [SPEC]</strong>. Semua claim adalah hipotesis kerja.
                Framework ini belum seal VAULT999. Gunakan sebagai lensa analisis, bukan kebenaran.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* HERO */}
      <section className="py-20 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">SHADOW BOARD · KERUSI DERITA · KERANGKA ANALISIS GENERASI</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.85] tracking-tighter mb-6 text-forge-white">
                RASA<br />DERITA
              </h1>
              <p className="font-body text-lg text-forge-dim max-w-2xl leading-relaxed mb-4">
                Enam kohort generasi Malaysia — dari 13 Mei 1969 ke Reformasi, 1MDB, Sheraton, dan paradoks 2022.
                Setiap trauma adalah parut pada perlembagaan — <strong>bukan metafora</strong>.
                Lantai F1–F13 wujud sebagai <strong>ingatan berperlembagaan</strong> terhadap apa yang telah pecah.
              </p>
              <p className="font-mono text-[0.6rem] text-forge-dim uppercase tracking-widest">
                Δ-ONLY · Framework Analysis · [INT]/[SPEC] · Confidence 0.20 · HOLD
              </p>
            </div>
            <div>
              <QuoteCard
                topic="On Institutional Scars"
                quote="The floors are not philosophy. They are scars. Each floor was written because something broke. F1 exists because trust was broken. F13 exists because sovereignty was stolen. The constitution is a scar map of institutional trauma."
                author="arifOS GENESIS/000"
                source="KERNEL CANON · v2026.07"
              />
            </div>
          </div>
        </div>
      </section>

      {/* THE 6 COHORTS TIMELINE */}
      <section className="py-16 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">ENAM KOHORT · TRAUMA MAP</div>
          <h2 className="text-3xl font-black uppercase italic mb-2 tracking-tight">
            Generational Trauma Timeline
          </h2>
          <p className="font-body text-sm text-forge-dim mb-8">
            Setiap kohort mewakili satu generasi pengalaman institusi yang gagal.
            APEX scorecard mengukur tahap parut mengikut empat dimensi: Akal, Kuasa, Entropi, dan Penerokaan.
          </p>

          {/* Cohort Cards */}
          <div className="space-y-6">
            {COHORTS.map((cohort, idx) => {
              const grade = apexGrade(cohort.apexScore);
              return (
                <motion.div
                  key={cohort.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.08 }}
                  className={`brutalist-card border-l-4 ${cohortColor(cohort.era)}`}
                >
                  <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                    {/* Cohort Identity */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-2xl font-black text-forge-orange">{cohort.id}</span>
                        <span className="font-mono text-[0.55rem] text-forge-dim uppercase tracking-widest">{cohort.era}</span>
                      </div>
                      <h3 className="text-xl font-black uppercase text-forge-white leading-tight">{cohort.event}</h3>
                      <span className="font-mono text-xs text-forge-gold">{cohort.year}</span>
                    </div>

                    {/* Thesis */}
                    <div className="lg:col-span-2">
                      <span className="font-mono text-[0.5rem] text-forge-orange uppercase tracking-widest">Thesis</span>
                      <p className="font-body text-sm text-forge-dim leading-relaxed mt-1">{cohort.thesis}</p>
                    </div>

                    {/* Floor Scars */}
                    <div className="lg:col-span-1">
                      <span className="font-mono text-[0.5rem] text-red-400 uppercase tracking-widest">Floor Scars</span>
                      <ul className="mt-1 space-y-1">
                        {cohort.floorScars.map((scar, i) => (
                          <li key={i} className="font-mono text-[0.6rem] text-forge-dim leading-tight">
                            <span className="text-red-400/70">◈</span> {scar}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* APEX Scorecard */}
                    <div className="lg:col-span-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-mono text-[0.5rem] text-forge-orange uppercase tracking-widest">APEX Score</span>
                        <span className={`font-mono text-[0.55rem] px-1.5 py-0.5 rounded ${grade.bg} ${grade.color} font-bold`}>
                          {grade.label}
                        </span>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        {(['A', 'P', 'E', 'X'] as const).map(letter => (
                          <div key={letter} className="text-center">
                            <div className="font-mono text-[0.55rem] text-forge-dim">{letter}</div>
                            <div className="font-mono text-xs text-forge-white font-bold">
                              {cohort.apexScore[letter].toFixed(2)}
                            </div>
                            <div className="w-full h-1 bg-forge-steel mt-0.5 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-forge-orange rounded-full"
                                style={{ width: `${cohort.apexScore[letter] * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FLOOR SCAR MAPPING — Constitutional Memory */}
      <section className="py-16 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">LANTAI PERLEMBAGAAN SEBAGAI PARUT</div>
          <h2 className="text-3xl font-black uppercase italic mb-2 tracking-tight">
            Scars, Not Metaphors
          </h2>
          <p className="font-body text-sm text-forge-dim mb-8 max-w-3xl leading-relaxed">
            Setiap lantai F1–F13 wujud kerana <strong>sesuatu telah pecah</strong> dalam sejarah institusi.
            Ia bukan falsafah abstrak — ia adalah <strong>ingatan berperlembagaan</strong>.
            Lantai bukan metafora. Lantai adalah kod parut — direka untuk menghalang pengulangan.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {Object.entries(FLOOR_MAP).map(([id, floor]) => {
              const typeColor = floor.type === 'HARD' ? 'border-red-500 bg-red-500/5' :
                               floor.type === 'DERIVED' ? 'border-blue-500 bg-blue-500/5' :
                               'border-yellow-600 bg-yellow-600/5';
              const typeText = floor.type === 'HARD' ? 'text-red-400' :
                              floor.type === 'DERIVED' ? 'text-blue-400' : 'text-yellow-500';
              // Find which cohorts scarred this floor
              const scarredCohorts = COHORTS.filter(c => 
                c.floorScars.some(s => s.startsWith(id))
              );
              
              return (
                <div key={id} className={`brutalist-card border-l-4 ${typeColor}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-lg font-black text-forge-orange">{id}</span>
                    <span className={`font-mono text-[0.5rem] uppercase tracking-widest px-1.5 py-0.5 ${typeText} bg-forge-black/50`}>
                      {floor.type}
                    </span>
                  </div>
                  <div className="font-bold text-forge-white text-sm">{floor.name}</div>
                  <div className="font-body text-xs text-forge-dim mt-1">{floor.desc}</div>
                  {scarredCohorts.length > 0 && (
                    <div className="mt-2 pt-2 border-t border-forge-iron/50">
                      <span className="font-mono text-[0.5rem] text-red-400/70 uppercase tracking-widest">
                        Scarred by: {scarredCohorts.map(c => c.id).join(' · ')}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Link
            to="/doctrine"
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider px-6 py-3 border-2 border-forge-orange text-forge-orange hover:bg-forge-orange hover:text-forge-black transition-colors"
          >
            Lihat Lantai Penuh di Doctrine ↗
          </Link>
        </div>
      </section>

      {/* GENERATIONAL IMPACT SUMMARY */}
      <section className="py-16 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">IMPAK GENERASI</div>
          <h2 className="text-3xl font-black uppercase italic mb-8 tracking-tight">
            What Each Generation Learned
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {COHORTS.map((cohort, idx) => (
              <motion.div
                key={cohort.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.06 }}
                className="brutalist-card bg-forge-steel"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="font-mono text-lg font-black text-forge-orange">{cohort.id}</span>
                  <span className="font-bold text-forge-white text-sm">{cohort.event}</span>
                </div>
                <p className="font-body text-sm text-forge-dim leading-relaxed italic">
                  "{cohort.generationalImpact}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER — Epistemic Disclaimer */}
      <section className="py-16">
        <div className="site-frame">
          <div className="max-w-3xl mx-auto text-center">
            <div className="section-label mb-4">STATUS EPISTEMIK</div>
            <div className="p-6 bg-forge-steel border border-forge-iron">
              <p className="font-body text-sm text-forge-dim leading-relaxed mb-3">
                <strong className="text-forge-white">RASA DERITA adalah framework analysis.</strong> Bukan fakta. Bukan ramalan.
              </p>
              <p className="font-body text-xs text-forge-dim/70 leading-relaxed mb-3">
                Hypotesis [INT]/[SPEC]. Confidence: 0.20. Belum seal VAULT999.
                Dua blocker audit (rujukan seal salah + 0.91 unreproducible) belum difix.
                Semua kandungan di sini adalah <strong>spekulatif</strong> — sesuai untuk Shadow Board (shadow ≠ official line).
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/politics/shadow"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-forge-iron text-forge-dim hover:text-forge-white hover:border-forge-orange/60 transition-colors">
                  ← Kembali ke PM Bayang
                </Link>
                <Link to="/politics/shadow/board"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-forge-orange/40 text-forge-orange hover:bg-forge-orange hover:text-forge-black transition-colors">
                  Shadow Board Org-Chart ↗
                </Link>
                <Link to="/doctrine"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[#00D4AA]/40 text-[#00D4AA] hover:bg-[#00D4AA] hover:text-forge-black transition-colors">
                  Doctrine Floors ↗
                </Link>
              </div>
            </div>
            <p className="mt-8 font-mono text-[0.55rem] text-forge-dim uppercase tracking-widest">
              DITEMPA BUKAN DIBERI — Yang benar dikarang, bukan diberi
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
