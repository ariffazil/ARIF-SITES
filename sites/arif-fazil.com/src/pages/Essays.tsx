import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useWebMCP } from '@/hooks/useWebMCP';
import essaysData from '@/data/essays.json';

type Essay = typeof essaysData[number];

function DestLink({ e }: { e: Essay }) {
  const href = e.dest.type === 'onsite' ? e.dest.path : e.dest.url;
  return <a href={href} target={e.dest.type === 'medium' ? '_blank' : undefined} rel={e.dest.type === 'medium' ? 'noreferrer' : undefined}
          className="text-forge-orange hover:text-forge-white transition-colors text-sm">Read →</a>;
}

function SpineView({ entries }: { entries: Essay[] }) {
  const sorted = [...entries].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="max-w-[640px] mx-auto px-6">
      {sorted.map((e, i) => (
        <div key={e.id} className={`grid grid-cols-[5rem_1fr_auto] gap-6 py-5 items-baseline ${i === sorted.length - 1 ? '' : ''}`}>
          <span className="font-mono text-[0.7rem] text-forge-dim tabular-nums">{e.date}</span>
          <span className="text-base leading-snug text-forge-white/90">{e.title}</span>
          <span className="shrink-0"><DestLink e={e} /></span>
        </div>
      ))}
      <div className="border-b border-forge-iron/30 mt-2"></div>
    </div>
  );
}

export function Essays() {
  useEffect(() => {
    document.title = 'Writing — Arif Fazil';
  }, []);

  const en = essaysData.filter((e: Essay) => e.lang === 'en');
  const bm = essaysData.filter((e: Essay) => e.lang === 'bm');
  const total = en.length + bm.length;

  const writingTools = useMemo(() => [
    {
      name: 'get_writing_index',
      description: `Full writing index: ${en.length} EN + ${bm.length} BM = ${total} pieces.`,
      execute() { return { content: [{ type: 'text', text: JSON.stringify(essaysData.map((e: Essay) => ({ id: e.id, title: e.title, date: e.date, series: e.series?.id, lang: e.lang })), null, 2) }] }; }
    },
  ], [en.length, bm.length, total]);

  useWebMCP(writingTools);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      <section className="py-32">
        <div className="max-w-[640px] mx-auto px-6">
          <h1 className="text-4xl font-light text-forge-white/90 mb-2">Writing</h1>
          <p className="text-forge-dim text-sm">{total} pieces · {en.length} EN + {bm.length} BM · newest first</p>
        </div>
      </section>
      <section className="pb-32">
        <SpineView entries={essaysData} />
      </section>
    </motion.div>
  );
}
