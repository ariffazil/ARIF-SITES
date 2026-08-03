import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWebMCP } from '@/hooks/useWebMCP';
import { SevenAxisGlobe } from '@/components/SevenAxisGlobe';
import essaysData from '@/data/essays.json';

type Essay = typeof essaysData[number];

// ═══ THE 7 AXIS COMPASS ═══
interface Axis {
  id: number;
  code: string;
  sees: string;
  color: string;
  angle: number; // degrees from east (0 = right)
  mirror: number; // which axis does this mirror?
}

const AXES: Axis[] = [
  { id: 1, code: 'ATLANTIC', sees: 'Language as Code', color: '#3b82f6', angle: 0, mirror: 2 },
  { id: 2, code: 'HEARTLAND', sees: 'Language as Territory', color: '#ef4444', angle: 60, mirror: 1 },
  { id: 3, code: 'SINIC', sees: 'Language as Harmony', color: '#eab308', angle: 120, mirror: 4 },
  { id: 4, code: 'BHARAT', sees: 'Language as Vibration', color: '#f97316', angle: 180, mirror: 3 },
  { id: 5, code: 'DAR', sees: 'Language as Revelation', color: '#10b981', angle: 240, mirror: 6 },
  { id: 6, code: 'GONDWANA', sees: 'Language as Resistance', color: '#d97706', angle: 300, mirror: 5 },
];

function SevenAxisCompass() {
  const cx = 200, cy = 200, r = 170, innerR = 55, labelR = 155;

  return (
    <svg viewBox="0 0 400 400" className="w-full max-w-[400px] h-auto" aria-label="7-Axis Language Compass — Nusantara at the center">
      {/* Subtle outer rings */}
      <circle cx={cx} cy={cy} r={r + 10} fill="none" stroke="#1e293b" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={innerR + 8} fill="none" stroke="#334155" strokeWidth="0.5" strokeDasharray="3 3" />

      {/* Mirror arcs */}
      {[[1, 2], [3, 4], [5, 6]].map(([a, b]) => {
        const axisA = AXES.find(x => x.id === a)!;
        const axisB = AXES.find(x => x.id === b)!;
        const midAngle = (axisA.angle + axisB.angle) / 2;
        const ax = cx + (r - 30) * Math.cos((axisA.angle * Math.PI) / 180);
        const ay = cy + (r - 30) * Math.sin((axisA.angle * Math.PI) / 180);
        const bx = cx + (r - 30) * Math.cos((axisB.angle * Math.PI) / 180);
        const by = cy + (r - 30) * Math.sin((axisB.angle * Math.PI) / 180);
        return (
          <path key={`mirror-${a}-${b}`}
            d={`M${ax},${ay} Q${cx + 60 * Math.cos((midAngle * Math.PI) / 180)},${cy + 60 * Math.sin((midAngle * Math.PI) / 180)} ${bx},${by}`}
            fill="none" stroke="#334155" strokeWidth="0.8" strokeDasharray="4 4" opacity="0.5" />
        );
      })}

      {/* Radiating arms from center to each axis */}
      {AXES.map(a => {
        const ex = cx + r * Math.cos((a.angle * Math.PI) / 180);
        const ey = cy + r * Math.sin((a.angle * Math.PI) / 180);
        return (
          <line key={`arm-${a.id}`} x1={cx} y1={cy} x2={ex} y2={ey}
            stroke={a.color} strokeWidth="1" opacity="0.4" />
        );
      })}

      {/* Axis endpoint dots + labels */}
      {AXES.map(a => {
        const ex = cx + r * Math.cos((a.angle * Math.PI) / 180);
        const ey = cy + r * Math.sin((a.angle * Math.PI) / 180);
        const lx = cx + labelR * Math.cos((a.angle * Math.PI) / 180);
        const ly = cy + labelR * Math.sin((a.angle * Math.PI) / 180);
        const align = a.angle > 90 && a.angle < 270 ? 'end' : 'start';
        const dx = a.angle > 90 && a.angle < 270 ? -14 : 14;
        return (
          <g key={`point-${a.id}`}>
            <circle cx={ex} cy={ey} r="5" fill={a.color} opacity="0.9" />
            <circle cx={ex} cy={ey} r="8" fill={a.color} opacity="0.15" />
            <text x={lx + dx} y={ly - 2} textAnchor={align} fill={a.color}
              fontFamily="monospace" fontSize="8" fontWeight="bold">{a.code}</text>
            <text x={lx + dx} y={ly + 8} textAnchor={align} fill="#94a3b8"
              fontFamily="system-ui" fontSize="7">{a.sees}</text>
          </g>
        );
      })}

      {/* Nusantara center — the pivot */}
      <circle cx={cx} cy={cy} r={innerR} fill="#020408" stroke="#06b6d4" strokeWidth="2" />
      <circle cx={cx} cy={cy} r={innerR - 5} fill="none" stroke="#06b6d4" strokeWidth="0.5" opacity="0.4" />
      <text x={cx} y={cy - 8} textAnchor="middle" fill="#06b6d4"
        fontFamily="monospace" fontSize="10" fontWeight="900">NUSANTARA</text>
      <text x={cx} y={cy + 8} textAnchor="middle" fill="#64748b"
        fontFamily="system-ui" fontSize="7" fontStyle="italic">Language as Flow</text>
      <text x={cx} y={cy + 20} textAnchor="middle" fill="#475569"
        fontFamily="system-ui" fontSize="6">the default, not the only</text>

      {/* Animated pulse ring on center */}
      <circle cx={cx} cy={cy} r={innerR + 4} fill="none" stroke="#06b6d4" strokeWidth="1" opacity="0.5">
        <animate attributeName="r" from={innerR + 4} to={innerR + 16} dur="4s" repeatCount="indefinite" />
        <animate attributeName="opacity" from="0.5" to="0" dur="4s" repeatCount="indefinite" />
      </circle>
    </svg>
  );
}

const SERIES_MAP: Record<string, { label: string; n: number }> = {};

for (const e of essaysData) {
  const sid = e.series?.id ?? 'UNSERIES';
  if (!SERIES_MAP[sid]) SERIES_MAP[sid] = { label: sid, n: 0 };
  SERIES_MAP[sid].n++;
}

const DOORS = [
  {
    label: 'THE 7-AXIS FRAMEWORK',
    slug: 'geopolitics',
    href: '/politics',
    accent: 'cyan',
    desc: 'Civilizational linguistics: how each global axis sees language, power, and meaning. The Nusantara Pivot as default, not only.',
    stat: '7 vectors · 5 chokepoints · 1 atlas',
  },
  {
    label: 'ESSAYS & SERIES',
    slug: 'essays',
    href: '/writing',
    accent: 'orange',
    desc: '58 pieces across 14 series: from the Origin accident to Constitutional Physics, EUREKA Trilogy, and Bahasa Malaysia soul-work.',
    stat: '58 essays · 14 series · 34 EN + 24 BM',
  },
  {
    label: 'MAKCIKGPT — Civic Journalism',
    slug: 'makcikgpt',
    href: '/world/makcikgpt',
    accent: 'emerald',
    desc: 'Petronas DNA, SEARAH Gas Sarawak, YTL & ILMU, RAKYAT, AKAL. Malaysian civic journalism in Bahasa Malaysia. Suara makcik, akal rakyat.',
    stat: '5 series · 24 BM pieces',
  },
  {
    label: 'POLITICAL CARTOGRAPHY',
    slug: 'politics',
    href: '/politics/ns-election',
    accent: 'amber',
    desc: 'NS PRN16 electoral matrix, 9 Shadow Prime Ministers, DERITA generational trauma map, Shadow Board org-chart. Power mapped to seats.',
    stat: '5 modules · 36 DUN · 9 PM dossiers',
  },
  {
    label: 'DOCTRINE & CONSTITUTION',
    slug: 'doctrine',
    href: '/doctrine',
    accent: 'purple',
    desc: 'F1–F13 constitutional floors, Agency Levels L0–L6, EUREKA 6-plane execution loop, QQQ recommendation protocol. The governed intelligence canon.',
    stat: '13 floors · 7 invariants · 1 kernel',
  },
];

function SpineRow({ e }: { e: Essay }) {
  const label = e.dest.type === 'onsite' ? '⌁' : '↗';
  const href = e.dest.type === 'onsite' ? e.dest.path : e.dest.url;
  const target = e.dest.type === 'medium' ? '_blank' : undefined;
  const rel = e.dest.type === 'medium' ? 'noreferrer' : undefined;

  return (
    <div className="grid grid-cols-[5.5rem_1fr_3rem] gap-3 py-2 border-b border-forge-iron/15 items-baseline text-sm hover:bg-forge-steel/30 transition-colors">
      <span className="font-mono text-[0.6rem] text-forge-dim whitespace-nowrap">{e.date}</span>
      <span className="font-body leading-snug text-forge-white/85 text-[0.8rem]">
        {e.title}
        {e.lang === 'bm' && <span className="ml-1.5 text-[0.5rem] bg-forge-steel px-1 text-forge-dim uppercase align-middle">BM</span>}
        {e.seal === '999' && <span className="ml-1 text-[0.5rem] text-forge-gold uppercase align-middle">999</span>}
      </span>
      <a href={href} target={target} rel={rel}
         className="font-mono text-[0.6rem] text-forge-orange hover:text-forge-white transition-colors text-right">
        {label}
      </a>
    </div>
  );
}

export function ReadHub() {
  useEffect(() => {
    document.title = 'Read — All Writings | Arif Fazil';
  }, []);

  const totalPieces = essaysData.length;
  const enCount = essaysData.filter(e => e.lang === 'en').length;
  const bmCount = essaysData.filter(e => e.lang === 'bm').length;
  const seriesCount = Object.keys(SERIES_MAP).length;

  const spineEntries = useMemo(() =>
    [...essaysData].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 20),
  []);

  const readingTools = useMemo(() => [
    {
      name: 'get_reading_room_index',
      description: `Arif's complete writing index: ${totalPieces} pieces (${enCount} EN + ${bmCount} BM), 14 series, 5 doors.`,
      execute() {
        return {
          content: [{
            type: 'text',
            text: JSON.stringify({
              total: totalPieces,
              en: enCount,
              bm: bmCount,
              series: seriesCount,
              doors: DOORS.map(d => ({ label: d.label, href: d.href, desc: d.desc })),
            }, null, 2)
          }]
        };
      }
    }
  ], [totalPieces, enCount, bmCount, seriesCount]);

  useWebMCP(readingTools);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen text-forge-white">

      {/* TOP BAR */}
      <div className="bg-[#020408] border-b border-forge-iron px-6 py-2 text-xs font-mono text-forge-dim flex flex-wrap justify-between items-center gap-4">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-forge-orange font-bold">
            <span className="w-2 h-2 rounded-full bg-forge-orange animate-pulse"></span>
            THE READING ROOM
          </span>
          <span className="text-forge-iron">|</span>
          <span>{totalPieces} PIECES · {seriesCount} SERIES · {enCount} EN + {bmCount} BM</span>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <Link to="/writing" className="text-forge-orange hover:text-forge-white transition-colors font-bold">
            SERIES VIEW →
          </Link>
          <Link to="/politics" className="text-cyan-400 hover:text-cyan-300 transition-colors font-bold">
            POLITICS →
          </Link>
        </div>
      </div>

      {/* HERO — COMPASS OVER ARCHIPELAGO */}
      <section className="relative py-16 md:py-24 border-b-2 border-forge-iron bg-forge-black overflow-hidden">
        {/* Background Hero Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/reading_room_hero.jpg"
            alt="Compass over Nusantara archipelago symbolizing language as the foundation and intelligence as orientation."
            className="w-full h-full object-cover object-center opacity-40 mix-blend-luminosity filter brightness-90 contrast-110"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020408]/90 via-[#020408]/60 to-[#020408]/95" />
        </div>

        <div className="site-frame relative z-10">
          {/* Section label */}
          <div className="font-mono text-[0.6rem] text-forge-orange uppercase tracking-[0.2em] mb-6 text-center">
            SOVEREIGN READING ROOM · THE COMPASS
          </div>

          {/* Title */}
          <h1 className="text-center text-5xl md:text-7xl lg:text-8xl font-black italic uppercase leading-[0.85] tracking-tighter mb-4">
            The<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-forge-orange via-amber-400 to-forge-gold">
              Reading Room
            </span>
          </h1>

          {/* Thesis */}
          <p className="text-center font-mono text-sm md:text-base text-cyan-400 font-bold max-w-2xl mx-auto mb-3 tracking-wide">
            "The foundation of language and compass of intelligence."
          </p>

          <p className="text-center font-body text-base md:text-lg text-forge-dim max-w-2xl mx-auto mb-12 leading-relaxed">
            Every axis of civilization sees language differently. Nusantara sits at the crossroads — 
            not because it alone sees the bridge, but because the bridge is its mother tongue.
          </p>
        </div>
      </section>

      {/* LINGUISTIC AXIS EXPLAINER — BELOW THE FOLD */}
      <section className="py-12 border-b border-forge-iron bg-[#020408]">
        <div className="site-frame">
          <div className="font-mono text-[0.6rem] text-cyan-400 uppercase tracking-[0.2em] mb-4 text-center">
            INTERACTIVE LINGUISTIC AXES · THE PIVOT
          </div>
          <h2 className="text-center text-2xl md:text-3xl font-black uppercase tracking-tight mb-8">
            The 7-Axis Civilizational Matrix
          </h2>

          {/* COMPASS SVG */}
          <div className="flex justify-center mb-8">
            <SevenAxisCompass />
          </div>

          {/* Compass legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-w-4xl mx-auto font-mono text-[0.55rem]">
            {AXES.map(a => (
              <div key={a.id} className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-forge-steel/50 transition-colors">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: a.color }}></span>
                <span className="text-forge-dim">{a.code}</span>
                <span className="text-forge-iron hidden md:inline">—</span>
                <span className="text-forge-white/60 hidden md:inline truncate">{a.sees}</span>
              </div>
            ))}
            <div className="flex items-center gap-1.5 px-2 py-1 rounded col-span-2 md:col-span-3 justify-center">
              <span className="w-2.5 h-2.5 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: '#06b6d4' }}></span>
              <span className="text-cyan-400 font-bold">NUSANTARA</span>
              <span className="text-forge-iron">—</span>
              <span className="text-forge-white/60">Language as Flow — the default, not the only</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS STRIP */}
      <section className="py-6 border-b border-forge-iron bg-forge-steel/50">
        <div className="site-frame">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono text-xs">
            {[
              { label: 'Total Pieces', value: String(totalPieces), sub: 'across all streams' },
              { label: 'Series', value: String(seriesCount), sub: 'S1–S9 + M1–M5' },
              { label: 'Languages', value: 'EN + BM', sub: `${enCount} English · ${bmCount} BM` },
              { label: 'Latest', value: essaysData[essaysData.length - 1]?.date ?? '—', sub: 'most recent piece' },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-black text-forge-orange">{s.value}</div>
                <div className="text-[0.6rem] text-forge-dim uppercase tracking-wider mt-1">{s.label}</div>
                <div className="text-[0.55rem] text-forge-iron mt-0.5">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7-AXIS MEANING COMPASS — the shared skeleton, linguistics lens */}
      <SevenAxisGlobe
        lens="meaning"
        label="7 LINGUISTIC AXES — THE SHARED SKELETON"
        heading="Select Axis to Inspect Language Philosophy"
      />

      {/* FIVE DOORS */}
      <section className="py-20 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label font-mono text-[0.65rem] text-forge-dim uppercase tracking-[0.15em] mb-6">
            MASUK SINI — five reading doors
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DOORS.map(door => (
              <Link
                key={door.slug}
                to={door.href}
                className="block brutalist-card group hover:border-forge-orange/60 transition-all"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-2 h-2 rounded-full bg-${door.accent === 'cyan' ? 'cyan' : door.accent === 'orange' ? 'forge-orange' : door.accent === 'emerald' ? 'emerald' : door.accent === 'amber' ? 'amber' : 'purple'}-400`}
                    style={{
                      backgroundColor:
                        door.accent === 'cyan' ? '#06b6d4' :
                        door.accent === 'orange' ? '#f97316' :
                        door.accent === 'emerald' ? '#10b981' :
                        door.accent === 'amber' ? '#f59e0b' : '#a855f7'
                    }}
                  ></span>
                  <span className="font-mono text-[0.6rem] uppercase tracking-widest text-forge-dim">{door.label}</span>
                </div>
                <p className="text-sm text-forge-dim leading-relaxed mb-3 font-body">{door.desc}</p>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-[0.55rem] text-forge-iron">{door.stat}</span>
                  <span className="font-mono text-[0.65rem] text-forge-orange group-hover:text-forge-white transition-colors">→ Enter</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* THE SPINE — latest 20 */}
      <section className="py-20 bg-forge-steel/30">
        <div className="site-frame">
          <div className="flex justify-between items-end mb-8">
            <div>
              <div className="section-label font-mono text-[0.65rem] text-forge-dim uppercase tracking-[0.15em] mb-1">
                THE SPINE
              </div>
              <h2 className="text-2xl font-black italic uppercase text-forge-white">Latest 20 · Chronological</h2>
            </div>
            <Link to="/writing" className="font-mono text-[0.65rem] text-forge-orange hover:text-forge-white transition-colors">
              Full spine (all {totalPieces}) →
            </Link>
          </div>
          <div className="font-technical text-[0.75rem]">
            {spineEntries.map(e => (
              <SpineRow key={e.id} e={e} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER CTA */}
      <section className="py-16 border-t-2 border-forge-iron bg-forge-black">
        <div className="site-frame text-center">
          <div className="font-mono text-[0.6rem] text-forge-dim uppercase tracking-[0.2em] mb-3">
            THE READING ROOM
          </div>
          <p className="font-body text-lg text-forge-dim max-w-xl mx-auto leading-relaxed">
            This library will grow. Every essay, every political map, every MakcikGPT piece — one room, many doors.
          </p>
          <div className="mt-6 flex justify-center gap-4 font-mono text-[0.6rem] text-forge-dim">
            <Link to="/writing" className="hover:text-forge-orange transition-colors">ESSAYS</Link>
            <span className="text-forge-iron">·</span>
            <Link to="/politics" className="hover:text-cyan-400 transition-colors">POLITICS</Link>
            <span className="text-forge-iron">·</span>
            <Link to="/world/makcikgpt" className="hover:text-emerald-400 transition-colors">MAKCIKGPT</Link>
            <span className="text-forge-iron">·</span>
            <Link to="/doctrine" className="hover:text-purple-400 transition-colors">DOCTRINE</Link>
          </div>
        </div>
      </section>

    </motion.div>
  );
}
