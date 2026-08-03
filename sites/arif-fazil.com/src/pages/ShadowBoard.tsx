import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QuoteCard } from '@/components/QuoteCard';
import { useWebMCP } from '@/hooks/useWebMCP';

/**
 * SHADOW BOARD — Org-Chart Instrument
 * Part of PRIMER-1 page-instruments system.
 * 
 * Hero: shadow-board — each "kerusi" (seat) = a dossier link.
 * Seats: 9 PMs (via ShadowPMs page) + DERITA map + Constitutional Doctrine link.
 * 
 * "Shadow Board = org-chart instrument, setiap kerusi = dossier link"
 * "RASA DERITA = satu kerusi dalam board tu"
 * 
 * Δ-ONLY · Instrument — bukan poster, bukan navigasi.
 */

interface BoardSeat {
  id: string;
  label: string;
  subtitle: string;
  href: string;
  color: 'gold' | 'cyan' | 'red' | 'amber' | 'emerald' | 'slate';
  icon: string;
  description: string;
}

const BOARD_SEATS: BoardSeat[] = [
  {
    id: 'tunku',
    label: 'Tunku Abdul Rahman',
    subtitle: 'PM 1 · 1957–1970',
    href: '/politics/shadow',
    color: 'amber',
    icon: '👑',
    description: 'Bapa Kemerdekaan — persona putera raja, bayang: ekonomi kekal di tangan asing.'
  },
  {
    id: 'razak',
    label: 'Tun Abdul Razak',
    subtitle: 'PM 2 · 1970–1976',
    href: '/politics/shadow',
    color: 'emerald',
    icon: '🏗️',
    description: 'Bapa Pembangunan — DEB, FELDA. Meninggal sebelum tengok DEB jadi alat.'
  },
  {
    id: 'hussein',
    label: 'Tun Hussein Onn',
    subtitle: 'PM 3 · 1976–1981',
    href: '/politics/shadow',
    color: 'emerald',
    icon: '⚖️',
    description: 'Bapa Perpaduan — PM paling bersih. Bayang: yang bersih tak bertahan.'
  },
  {
    id: 'mahathir',
    label: 'Tun Dr. Mahathir',
    subtitle: 'PM 4 · 1981–2003, 2018–2020',
    href: '/politics/shadow',
    color: 'red',
    icon: '🏛️',
    description: 'Bapa Pemodenan — bina Menara, robohkan institusi. Megalomania bersalut nasionalisme.'
  },
  {
    id: 'badawi',
    label: 'Tun Abdullah Badawi',
    subtitle: 'PM 5 · 2003–2009',
    href: '/politics/shadow',
    color: 'amber',
    icon: '🕌',
    description: 'Islam Hadhari — orang baik dalam sistem yang tak boleh dibaiki.'
  },
  {
    id: 'najib',
    label: 'Dato\' Sri Najib Razak',
    subtitle: 'PM 6 · 2009–2018',
    href: '/politics/shadow',
    color: 'red',
    icon: '💼',
    description: '1MDB — anak sistem yang minum sistem tu sampai habis.'
  },
  {
    id: 'muhyiddin',
    label: 'Tan Sri Muhyiddin Yassin',
    subtitle: 'PM 7 · 2020–2021',
    href: '/politics/shadow',
    color: 'red',
    icon: '🚪',
    description: 'PM pintu belakang — kuasa tanpa legitimacy melalui Langkah Sheraton.'
  },
  {
    id: 'ismail',
    label: 'Dato\' Sri Ismail Sabri',
    subtitle: 'PM 8 · 2021–2022',
    href: '/politics/shadow',
    color: 'amber',
    icon: '🔄',
    description: 'PM default — naik sebab semua orang lain penat bergaduh.'
  },
  {
    id: 'anwar',
    label: 'Dato\' Seri Anwar Ibrahim',
    subtitle: 'PM 9 · 2022–sekarang',
    href: '/politics/shadow',
    color: 'red',
    icon: '🔥',
    description: 'Reformis yang tak jumpa bayang sendiri. Lawan sistem — sekarang sistem tu jadi dia.'
  },
  {
    id: 'derita',
    label: 'RASA DERITA',
    subtitle: 'Kerusi Khas · Trauma Generasi',
    href: '/politics/shadow/derita',
    color: 'cyan',
    icon: '💔',
    description: '6-Cohort Generational Trauma Map. Lantai F1-F13 sebagai parut — bukan metafora.'
  },
  {
    id: 'doctrine',
    label: 'Doctrine Floors',
    subtitle: 'F1–F13 · Constitutional Scars',
    href: '/doctrine',
    color: 'cyan',
    icon: '📜',
    description: 'Lantai perlembagaan penuh. Setiap lantai adalah ingatan terhadap apa yang telah pecah.'
  },
];

const seatColorClasses: Record<BoardSeat['color'], string> = {
  gold: 'border-forge-gold hover:border-forge-gold bg-forge-gold/5',
  cyan: 'border-cyan-500/60 hover:border-cyan-400 bg-cyan-500/5',
  red: 'border-red-500/40 hover:border-red-400 bg-red-500/5',
  amber: 'border-amber-500/40 hover:border-amber-400 bg-amber-500/5',
  emerald: 'border-emerald-500/40 hover:border-emerald-400 bg-emerald-500/5',
  slate: 'border-slate-500/40 hover:border-slate-400 bg-slate-500/5',
};

const seatAccentColors: Record<BoardSeat['color'], string> = {
  gold: 'text-forge-gold',
  cyan: 'text-cyan-400',
  red: 'text-red-400',
  amber: 'text-amber-400',
  emerald: 'text-emerald-400',
  slate: 'text-slate-400',
};

export function ShadowBoard() {
  const boardTools = [
    {
      name: 'get_shadow_board',
      description: 'Shadow Board — Org-chart instrument: 9 PM seats + DERITA map + Doctrine link. Each seat is a dossier link. Instrument class: shadow-board.',
      execute() {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              instrument: 'shadow-board',
              doctrine: 'Hero as instrument. The route registry declares the hero. A page cannot choose its own hero.',
              seats: BOARD_SEATS.map(s => ({
                id: s.id, label: s.label, subtitle: s.subtitle, href: s.href
              })),
              design_note: 'Shadow Board = org-chart instrument, setiap kerusi = dossier link. RASA DERITA = satu kerusi dalam board tu.',
              status: 'PROPOSED · PRIMER-1 · pending 999_SEAL'
            }, null, 2)
          }]
        };
      }
    }
  ];

  useWebMCP(boardTools);

  useEffect(() => {
    document.title = 'Shadow Board — Org-Chart Instrument · arifOS Federation';
    document.querySelector('link[rel=canonical]')?.setAttribute('href', 'https://arif-fazil.com/politics/shadow/board');
  }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      {/* HERO */}
      <section className="py-20 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">INSTRUMENT · SHADOW BOARD · ORG-CHART</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div>
              <h1 className="text-5xl md:text-7xl font-black italic uppercase leading-[0.85] tracking-tighter mb-6 text-forge-white">
                Shadow<br />Board
              </h1>
              <p className="font-body text-lg text-forge-dim max-w-2xl leading-relaxed mb-4">
                Org-chart instrument — setiap <strong>kerusi</strong> (seat) adalah <strong>dossier link</strong>.
                Bukan poster. Bukan navigasi. Ini papan pemetaan bayangan kepimpinan Malaysia —
                9 Perdana Menteri, 1 peta trauma generasi, 1 perlembagaan parut.
              </p>
              <div className="flex items-center gap-3 mt-4">
                <Link to="/politics/shadow"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-forge-iron text-forge-dim hover:text-forge-white hover:border-forge-orange/60 transition-colors">
                  Lihat Semua PM →
                </Link>
                <Link to="/politics/shadow/derita"
                  className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-cyan-500/40 text-cyan-400 hover:bg-cyan-500/20 transition-colors">
                  Peta DERITA ↗
                </Link>
              </div>
            </div>
            <div>
              <QuoteCard
                topic="On Shadow Governance"
                quote="A Shadow Cabinet is not opposition theatre — it is a constitutional instrument. In Westminster systems, the Shadow exists so that when power shifts, the machine does not have to be rebuilt from memory. Malaysia has no such instrument. This board is a hypothesis: what if we built one?"
                author="Shadow Board Doctrine"
                source="PRIMER-1 Design Proposal"
              />
            </div>
          </div>
        </div>
      </section>

      {/* SHADOW CABINET HYPOTHESIS */}
      <section className="py-10 border-b border-forge-iron bg-[#1a1a2e]">
        <div className="site-frame">
          <div className="flex items-start gap-3">
            <span className="text-amber-400 text-xl shrink-0 mt-1">💡</span>
            <div>
              <div className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold mb-1">
                HYPOTHESIS [INT] · Confidence 0.40
              </div>
              <p className="font-body text-sm text-forge-dim leading-relaxed max-w-3xl">
                Malaysia tidak mempunyai Shadow Cabinet formal. Di UK, Shadow Cabinet adalah instrumen perlembagaan —
                apabila kuasa bertukar, mesin kerajaan tidak perlu dibina semula dari ingatan.
                Shadow Board ini adalah <strong>hipotesis</strong>: jika Malaysia membina instrumen shadow governance,
                apakah bentuknya? Setiap kerusi adalah dossier — analisis, bukan jawatan.
              </p>
              <p className="font-mono text-[0.55rem] text-forge-dim/60 mt-2 uppercase tracking-widest">
                CONFIDENCE 0.40 PROVENANCE: [OBS] Malaysia has no formal Shadow Cabinet (verifiable). [OBS] UK Shadow Cabinet is constitutional convention (verifiable). [INT] Instrument design pattern proven by PRIMER-1 registry. [SPEC] Political hypothesis — untested. Net: 0.40 (conservative for mixed OBS+INT+SPEC). Ω₀ bound: 0.04 → cap 0.96 (F7).
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BOARD SEATS GRID */}
      <section className="py-16">
        <div className="site-frame">
          <div className="section-label">KERUSI · SEATS · DOSSIER LINKS</div>
          <h2 className="text-3xl font-black uppercase italic mb-2 tracking-tight">
            The Board
          </h2>
          <p className="font-body text-sm text-forge-dim mb-8">
            Klik mana-mana kerusi untuk buka dossier penuh. Setiap kerusi membawa analisis tersendiri —
            dari bayang Perdana Menteri ke peta trauma generasi.
          </p>

          {/* PM Seats */}
          <div className="mb-8">
            <div className="font-mono text-[0.65rem] text-forge-gold uppercase tracking-widest mb-4">
              9 KERUSI PERDANA MENTERI
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {BOARD_SEATS.slice(0, 9).map((seat, idx) => (
                <motion.div
                  key={seat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link
                    to={seat.href}
                    className={`block p-5 border-2 rounded-lg transition-all group ${seatColorClasses[seat.color]}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{seat.icon}</span>
                      <div>
                        <div className={`font-mono text-[0.55rem] uppercase tracking-widest ${seatAccentColors[seat.color]}`}>
                          {seat.subtitle}
                        </div>
                        <h3 className="text-lg font-black uppercase text-forge-white group-hover:text-forge-orange transition-colors leading-tight">
                          {seat.label}
                        </h3>
                      </div>
                    </div>
                    <p className="font-body text-xs text-forge-dim mt-2 leading-relaxed">
                      {seat.description}
                    </p>
                    <div className={`mt-3 pt-2 border-t border-forge-iron/50 font-mono text-[0.55rem] uppercase tracking-wider ${seatAccentColors[seat.color]}`}>
                      Buka Dossier →
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Special Seats */}
          <div className="mb-8">
            <div className="font-mono text-[0.65rem] text-cyan-400 uppercase tracking-widest mb-4">
              2 KERUSI KHAS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BOARD_SEATS.slice(9).map((seat, idx) => (
                <motion.div
                  key={seat.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + idx * 0.06 }}
                >
                  <Link
                    to={seat.href}
                    className={`block p-6 border-2 rounded-lg transition-all group ${seatColorClasses[seat.color]}`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-2xl">{seat.icon}</span>
                      <div>
                        <div className={`font-mono text-[0.55rem] uppercase tracking-widest ${seatAccentColors[seat.color]}`}>
                          {seat.subtitle}
                        </div>
                        <h3 className="text-lg font-black uppercase text-forge-white group-hover:text-forge-orange transition-colors leading-tight">
                          {seat.label}
                        </h3>
                      </div>
                    </div>
                    <p className="font-body text-sm text-forge-dim mt-2 leading-relaxed">
                      {seat.description}
                    </p>
                    <div className={`mt-3 pt-2 border-t border-forge-iron/50 font-mono text-[0.55rem] uppercase tracking-wider ${seatAccentColors[seat.color]}`}>
                      Buka Kerusi →
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* INSTRUMENT ARCHITECTURE */}
      <section className="py-16 border-t-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">SENIBINA INSTRUMEN</div>
          <h2 className="text-3xl font-black uppercase italic mb-6 tracking-tight">
            How This Instrument Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="brutalist-card">
              <div className="font-mono text-2xl mb-2">🔗</div>
              <h3 className="font-bold text-forge-white mb-2">Dossier Links</h3>
              <p className="font-body text-sm text-forge-dim">
                Setiap kerusi adalah link ke halaman analisis penuh — bukan ringkasan, bukan card.
                Shadow Board adalah <strong>peta</strong>, bukan destinasi.
              </p>
            </div>
            <div className="brutalist-card">
              <div className="font-mono text-2xl mb-2">📊</div>
              <h3 className="font-bold text-forge-white mb-2">APEX Scorecard</h3>
              <p className="font-body text-sm text-forge-dim">
                Setiap PM + DERITA dinilai dengan APEX 4-huruf scorecard (Akal, Kuasa, Entropi, Penerokaan) —
                corak yang sama digunakan di seluruh sistem.
              </p>
            </div>
            <div className="brutalist-card">
              <div className="font-mono text-2xl mb-2">⚖️</div>
              <h3 className="font-bold text-forge-white mb-2">Constitutional Floors</h3>
              <p className="font-body text-sm text-forge-dim">
                Setiap kerusi bersambung ke lantai F1–F13 di Doctrine.
                Lantai bukan metafora — ia adalah ingatan berperlembagaan terhadap apa yang telah pecah.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <section className="py-16 border-t-2 border-forge-iron">
        <div className="site-frame text-center">
          <p className="font-body text-forge-dim text-sm max-w-xl mx-auto leading-relaxed">
            Ini adalah instrumen — bukan poster. Bukan kempen. Bukan propaganda.
            Shadow Board wujud untuk memetakan apa yang tersembunyi dalam sistem politik Malaysia.
            Setiap dossier adalah analisis, bukan serangan. Setiap parut adalah pengajaran, bukan dendam.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-6">
            <Link to="/politics"
              className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-forge-iron text-forge-dim hover:text-forge-white transition-colors">
              ← Politics Hub
            </Link>
            <Link to="/politics/shadow"
              className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-forge-orange/40 text-forge-orange hover:bg-forge-orange hover:text-forge-black transition-colors">
              PM Bayang Dossiers ↗
            </Link>
            <Link to="/doctrine"
              className="font-mono text-xs uppercase tracking-wider px-4 py-2 border border-[#00D4AA]/40 text-[#00D4AA] hover:bg-[#00D4AA] hover:text-forge-black transition-colors">
              Doctrine Floors ↗
            </Link>
          </div>
          <p className="mt-8 font-mono text-[0.55rem] text-forge-dim uppercase tracking-widest">
            DITEMPA BUKAN DIBERI — Shadow Board · PRIMER-1 · Instrument Registry
          </p>
        </div>
      </section>
    </motion.div>
  );
}
