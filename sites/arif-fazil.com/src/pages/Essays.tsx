import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWebMCP } from '@/hooks/useWebMCP';
import { QuoteCard } from '@/components/QuoteCard';
import essaysData from '@/data/essays.json';

type Essay = typeof essaysData[number];

const SERIES_LABELS: Record<string, string> = {
  S1: 'S1 · ORIGIN — The Accident',
  S2: 'S2 · THE NAMING DIPTYCH',
  S3: 'S3 · MCP WEEK — The July 2026 Tetrad',
  S4: 'S4 · GOVERNANCE CANON',
  S5: 'S5 · CONSTITUTIONAL PHYSICS',
  S6: 'S6 · EUREKA TRILOGY',
  S7: 'S7 · BAHASA & MALAYSIA',
  S8: 'S8 · THE FORGE — Field Notes',
  S9: 'S9 · REFLECTIONS',
  M1: 'M1 · PETRONAS DNA',
  M2: 'M2 · SEARAH — Gas Sarawak',
  M3: 'M3 · YTL & ILMU',
  M4: 'M4 · RAKYAT',
  M5: 'M5 · AKAL',
};

function DestLink({ e }: { e: Essay }) {
  const label = e.dest.type === 'onsite' ? '⌁ Read' : '↗ Medium';
  const href = e.dest.type === 'onsite' ? e.dest.path : e.dest.url;
  return <a href={href} target={e.dest.type === 'medium' ? '_blank' : undefined} rel={e.dest.type === 'medium' ? 'noreferrer' : undefined}
          className="font-mono text-[0.65rem] text-forge-orange hover:text-forge-white transition-colors">{label} →</a>;
}

function SeriesHeader({ label, n }: { label: string; n?: number }) {
  return (
    <div className="col-span-full mt-12 mb-6 first:mt-0 border-b border-forge-iron pb-3">
      <h2 className="text-xl font-black uppercase italic tracking-tight">{label}</h2>
      {n && <span className="font-mono text-[0.6rem] text-forge-dim uppercase tracking-widest">{n} pieces</span>}
    </div>
  );
}

function SeriesView({ entries }: { entries: Essay[] }) {
  const sorted = [...entries].sort((a, b) => a.series.n - b.series.n);
  return (
    <div className="font-technical text-[0.75rem] leading-relaxed">
      {sorted.map(e => (
        <div key={e.id} className="grid grid-cols-[2.5rem_1fr_3.5rem] gap-2 py-1.5 border-b border-forge-iron/15 items-baseline">
          <span className="text-forge-dim">#{e.series.n}</span>
          <span>
            {e.title}
            {e.note && <span className="block text-[0.6rem] text-forge-orange/70 italic mt-0.5">⚠ {e.note}</span>}
          </span>
          <span className="text-right"><DestLink e={e} /></span>
        </div>
      ))}
    </div>
  );
}

function SpineView({ entries }: { entries: Essay[] }) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div>
      {sorted.map(e => (
        <div key={e.id} className="grid grid-cols-[6rem_1fr_0.5fr] gap-3 py-2 border-b border-forge-iron/20 items-baseline text-sm">
          <span className="font-mono text-[0.65rem] text-forge-dim">{e.date}</span>
          <span className="font-body leading-snug">
            {e.title}
            {e.lang === 'bm' ? <span className="ml-1.5 text-[0.55rem] bg-forge-steel px-1 text-forge-dim uppercase">BM</span> : ''}
            {e.seal === '999' ? <span className="ml-1.5 text-[0.5rem] text-forge-gold uppercase">999</span> : ''}
          </span>
          <div className="flex items-center justify-end gap-2">
            <span className="font-mono text-[0.55rem] text-forge-dim uppercase">{e.series.id}#{e.series.n}</span>
            <DestLink e={e} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function Essays() {
  useEffect(() => {
    document.title = 'Writing — Essays · Series · MakcikGPT | Arif Fazil';
  }, []);

  const en = essaysData.filter(e => e.lang === 'en');
  const bm = essaysData.filter(e => e.lang === 'bm');

  const seriesGroups = useMemo(() => {
    const groups: Record<string, Essay[]> = {};
    for (const e of essaysData) {
      if (e.series) {
        if (!groups[e.series.id]) groups[e.series.id] = [];
        groups[e.series.id].push(e);
      }
    }
    return groups;
  }, []);

  const envTotal = en.length;
  const bmTotal = bm.length;

  const writingTools = useMemo(() => [
    {
      name: 'get_writing_index',
      description: `Get the full writing index: ${envTotal} EN essays + ${bmTotal} BM MakcikGPT = ${envTotal + bmTotal} total pieces, organized by series.`,
      execute() { return { content: [{ type: 'text', text: JSON.stringify(essaysData.map(e => ({ id: e.id, title: e.title, date: e.date, series: e.series?.id, lang: e.lang })), null, 2) }] }; }
    },
  ], []);

  useWebMCP(writingTools);

  const doors = [
    {
      label: 'You are a geoscientist / energy reader',
      picks: ['s6-11', 's1-3', 'm1-5'],
      ids: ['S6 EUREKA I', 'S1 Origin', 'M1 PETRONAS'],
    },
    {
      label: 'You build AI systems',
      picks: ['s4-9', 's3-1', 's8-3'],
      ids: ['S4 Constitution', 'S3 MCP Week', 'S8 FORGE'],
    },
    {
      label: 'You are jiran Malaysia (BM)',
      picks: ['m2-1', 'm4-2', 's7-5'],
      ids: ['M2 SEARAH', 'M4 RAKYAT', 'S7 Soul'],
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      {/* HERO */}
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">WRITING · {envTotal + bmTotal} pieces · {envTotal} EN + {bmTotal} BM</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end">
            <div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-6">The<br />Writing</h1>
              <p className="font-body text-xl text-forge-dim leading-relaxed">
                Essays, technical writing, civic journalism. One data file, three doors in.
              </p>
            </div>
            <div>
              <QuoteCard
                topic="On Discovery"
                quote="I write because I don't know what I think until I read what I say."
                author="Flannery O'Connor"
                source="attributed to Flannery O'Connor"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MASUK SINI — three doors */}
      <section className="py-20 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">MASUK SINI — three reading paths</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {doors.map((door) => (
              <div key={door.label} className="brutalist-card">
                <h3 className="font-mono text-[0.6rem] uppercase tracking-widest text-forge-dim mb-4">{door.label}</h3>
                <ul className="space-y-3">
                  {door.picks.map((pid, i) => {
                    const e = essaysData.find(x => x.id === pid);
                    if (!e) return null;
                    return (
                      <li key={pid} className="flex items-start gap-2">
                        <span className="font-mono text-[0.55rem] text-forge-orange mt-0.5 shrink-0">{door.ids[i]}</span>
                        <span className="text-xs leading-snug">{e.title}</span>
                      </li>
                    );
                  })}
                </ul>
                <div className="mt-4 font-mono text-[0.6rem] text-forge-dim italic">— masuk sini, ikut jalan masing-masing</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* THE SERIES — journey order */}
      <section className="py-20 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">THE SERIES — the journeys</div>
          {Object.entries(seriesGroups).map(([sid, entries]) => (
            <div key={sid}>
              <SeriesHeader label={SERIES_LABELS[sid] || sid} n={entries.length} />
              <SeriesView entries={entries} />
            </div>
          ))}
        </div>
      </section>

      {/* THE SPINE — chronological */}
      <section className="py-20 bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">THE SPINE — newest first</div>
          <SpineView entries={essaysData} />
        </div>
      </section>
    </motion.div>
  );
}
