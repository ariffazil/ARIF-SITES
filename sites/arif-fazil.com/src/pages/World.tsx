import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWebMCP } from '@/hooks/useWebMCP';
import { QuoteCard } from '@/components/QuoteCard';

const commodityMarkets = [
  { slug: 'oil', name: 'Oil (Brent)', accent: 'text-forge-orange' },
  { slug: 'gas', name: 'Natural Gas', accent: 'text-[#00D4AA]' },
  { slug: 'gold', name: 'Gold (XAU/USD)', accent: 'text-[#D4A853]' },
];

const worldTools = [
  {
    name: 'get_world_surface',
    description: 'List MakcikGPT civic journalism articles and commodity dashboards on arif-fazil.com/world.',
    execute() {
      return {
        content: [{ type: 'text', text: 'World hub: MakcikGPT civic journalism + Oil/Gas/Gold dashboards. Route: /world/makcikgpt/ for articles, /oil/ /gas/ /gold/ for market dashboards.' }]
      };
    }
  },
];

export function World() {
  useWebMCP(worldTools);
  useEffect(() => { document.title = 'World — MakcikGPT · Commodities | Arif Fazil'; }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      {/* HERO */}
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">Civic Journalism · Commodity Markets · World Context</div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-end mb-8">
            <div>
              <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
                The<br />World
              </h1>
              <p className="font-body text-xl text-forge-dim leading-relaxed">
                What's actually happening. MakcikGPT civic journalism in Bahasa Malaysia — covering
                sovereignty, resources, and power. Plus the commodity dashboards that track what the
                ground is doing.
              </p>
            </div>
            <div>
              <QuoteCard
                topic="On Understanding"
                quote="The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking."
                author="Albert Einstein"
                source="attributed to Albert Einstein"
              />
            </div>
          </div>
        </div>
      </section>

      {/* MAKCIKGPT — primary content */}
      <section className="py-24 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">📰 Civic Journalism · Bahasa Makcik</div>
          <h2 className="text-4xl font-black uppercase italic mb-4 tracking-tight">MakcikGPT</h2>
          <p className="font-body text-forge-dim max-w-2xl leading-relaxed mb-8">
            When RM70 billion moves and nobody asks questions, MakcikGPT asks. Published directly,
            no gatekeepers. Every article carries the 999 Meterai seal.
          </p>
          <Link
            to="/world/makcikgpt/"
            className="inline-flex items-center gap-2 font-mono text-sm uppercase tracking-wider px-6 py-3 bg-forge-orange text-forge-black border-2 border-forge-orange hover:opacity-80 transition-opacity"
          >
            Browse All Articles →
          </Link>
        </div>
      </section>

      {/* COMMODITY DASHBOARDS — secondary */}
      <section className="py-24 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">📊 Market Dashboards</div>
          <h2 className="text-4xl font-black uppercase italic mb-8 tracking-tight">Commodities</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {commodityMarkets.map((m) => (
              <a key={m.slug} href={`/world/${m.slug}`}
                 className="brutalist-card group block hover:border-forge-orange transition-colors">
                <h3 className={`text-3xl font-black uppercase italic mb-4 tracking-tight group-hover:text-forge-orange transition-colors ${m.accent}`}>
                  {m.name}
                </h3>
                <span className="font-technical text-[0.7rem] uppercase tracking-widest text-forge-dim">
                  Open Dashboard →
                </span>
              </a>
            ))}
          </div>
          <p className="font-technical text-[0.6rem] text-forge-dim uppercase tracking-widest mt-12 max-w-xl leading-relaxed">
            Dashboards are cognitive aids, not signals. Every number carries an epistemic label.
            Sovereignty over decisions stays with the human.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
