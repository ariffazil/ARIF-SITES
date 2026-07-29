import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useWebMCP } from '@/hooks/useWebMCP';
import { QuoteCard } from '@/components/QuoteCard';
import { ZenPulse } from '@/components/ZenPulse';

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

const linkFocus =
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forge-orange';

export function World() {
  useWebMCP(worldTools);
  useEffect(() => { document.title = 'World — MakcikGPT · Commodities | Arif Fazil'; }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      {/* ZEN PULSE — orientation in 3 seconds */}
      <ZenPulse
        whereAmI="arif-fazil.com · World"
        whyCare="Civic journalism + commodity intelligence, evidence-gated"
        whatNext="Read MakcikGPT or open a dashboard"
      />

      {/* HERO — calm, editorial */}
      <section className="py-20 md:py-24 border-b border-forge-iron">
        <div className="site-frame">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-forge-dim mb-6">
            Civic journalism · commodity context
          </p>
          <h1 className="font-serif font-normal normal-case tracking-normal text-forge-white text-[2.5rem] leading-tight mb-6">
            The World
          </h1>
          <p className="font-body text-lg text-forge-dim leading-relaxed max-w-2xl">
            What's actually happening — MakcikGPT civic journalism in Bahasa Malaysia on sovereignty,
            resources, and power, plus the commodity dashboards that track what the ground is doing.
          </p>
        </div>
      </section>

      {/* TWO PATHWAYS */}
      <section className="py-16 md:py-20 border-b border-forge-iron" aria-label="Pathways">
        <div className="site-frame grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* MakcikGPT */}
          <Link
            to="/world/makcikgpt/"
            className={`group block border border-forge-iron rounded-lg p-8 md:p-10 transition-colors hover:border-forge-orange/60 ${linkFocus}`}
          >
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-forge-dim mb-4">
              Civic journalism · Bahasa Makcik
            </p>
            <h2 className="font-serif font-normal normal-case tracking-normal text-2xl text-forge-white mb-4">
              MakcikGPT
            </h2>
            <p className="font-body text-forge-dim leading-relaxed mb-8">
              When RM70 billion moves and nobody asks questions, MakcikGPT asks. Published directly,
              no gatekeepers — every article carries the 999 Meterai seal.
            </p>
            <span className="font-mono text-xs text-forge-orange group-hover:text-forge-white transition-colors">
              Browse articles →
            </span>
          </Link>

          {/* Commodity dashboards */}
          <div className="border border-forge-iron rounded-lg p-8 md:p-10 transition-colors hover:border-forge-orange/40">
            <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-forge-dim mb-4">
              Sovereign market read
            </p>
            <h2 className="font-serif font-normal normal-case tracking-normal text-2xl text-forge-white mb-4">
              Commodity dashboards
            </h2>
            <p className="font-body text-forge-dim leading-relaxed mb-8">
              Daily reads on the commodities that set the region's terms — verdict, key levels, and
              invalidation, with an epistemic label on every number.
            </p>
            <nav aria-label="Commodity dashboards" className="flex flex-wrap items-center gap-x-6 gap-y-2 mb-4">
              <a href="/gold/" className={`font-mono text-sm text-forge-white hover:text-forge-orange transition-colors ${linkFocus}`}>
                Gold
              </a>
              <a href="/gas/" className={`font-mono text-sm text-forge-white hover:text-forge-orange transition-colors ${linkFocus}`}>
                Gas
              </a>
              <a href="/oil/" className={`font-mono text-sm text-forge-white hover:text-forge-orange transition-colors ${linkFocus}`}>
                Oil
              </a>
            </nav>
            <nav aria-label="National dashboards" className="flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.7rem] uppercase tracking-wider text-forge-dim">
              <a href="/wealth/vitals/" className={`hover:text-forge-white transition-colors ${linkFocus}`}>
                PETRONAS
              </a>
              <span aria-hidden="true" className="text-forge-iron">·</span>
              <a href="/wealth/malaysia/" className={`hover:text-forge-white transition-colors ${linkFocus}`}>
                MALAYSIA
              </a>
            </nav>
          </div>
        </div>
      </section>

      {/* WORLDVIEW — quiet, secondary */}
      <section className="py-12 border-b border-forge-iron" aria-label="Worldview">
        <div className="site-frame max-w-3xl">
          <QuoteCard
            quote="The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking."
            author="Albert Einstein"
            source="attributed"
            className="my-0"
          />
        </div>
      </section>

      {/* FOOTNOTE */}
      <section className="py-10" aria-label="Scope note">
        <div className="site-frame">
          <p className="font-mono text-[0.7rem] text-forge-dim/80 leading-relaxed max-w-xl">
            Dashboards are cognitive aids, not signals. Not trading advice — the human decides.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
