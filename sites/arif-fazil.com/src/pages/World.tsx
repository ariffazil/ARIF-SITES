import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWebMCP } from '@/hooks/useWebMCP';

type Market = {
  slug: string;
  name: string;
  ticker: string;
  desc: string;
  accent: string;
};

const markets: Market[] = [
  {
    slug: 'oil',
    name: 'Oil',
    ticker: 'Brent Crude',
    desc: 'Brent crude cognitive-clarity dashboard. Technical levels plus world context in one scan. Evidence-gated, human-decided.',
    accent: 'text-forge-orange',
  },
  {
    slug: 'gas',
    name: 'Gas',
    ticker: 'Natural Gas',
    desc: 'Natural gas synthesis — price structure and macro drivers. The energy leg of the commodity read.',
    accent: 'text-[#00D4AA]',
  },
  {
    slug: 'gold',
    name: 'Gold',
    ticker: 'XAU / USD',
    desc: 'Sovereign gold trading synthesis. Technical + macro in one view. Risk-off barometer for the whole board.',
    accent: 'text-[#D4A853]',
  },
];

const worldTools = [
  {
    name: 'get_world_markets',
    description:
      'List the commodity market dashboards published on arif-fazil.com/world (oil/Brent, gas/natural gas, gold/XAUUSD) with their live dashboard URLs.',
    execute() {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              markets.map((m) => ({
                market: m.name,
                ticker: m.ticker,
                dashboard: `https://arif-fazil.com/${m.slug}/`,
              })),
              null,
              2
            ),
          },
        ],
      };
    },
  },
];

export function World() {
  useWebMCP(worldTools);
  useEffect(() => {
    document.title = 'World Markets — Oil · Gas · Gold | Arif Fazil';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen"
    >
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">Commodities · World Context · Evidence-Gated</div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
            The<br />World
          </h1>
          <p className="font-body text-xl text-forge-dim max-w-2xl leading-relaxed">
            Oil, gas, and gold — read in one scan. Technical structure plus the
            macro story behind the number. Dashboards inform; the human decides.
          </p>
        </div>
      </section>

      {/* ── MARKETS ──────────────────────────────────────── */}
      <section className="py-24">
        <div className="site-frame">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {markets.map((m) => (
              <motion.a
                key={m.slug}
                href={`/${m.slug}/`}
                whileInView={{ y: [20, 0], opacity: [0, 1] }}
                viewport={{ once: true }}
                className="brutalist-card group block hover:border-forge-orange transition-colors"
              >
                <div className="section-label !mb-4">{m.ticker}</div>
                <h2
                  className={`text-5xl font-black uppercase italic mb-6 tracking-tight group-hover:text-forge-orange transition-colors ${m.accent}`}
                >
                  {m.name}
                </h2>
                <p className="font-body text-forge-dim leading-relaxed mb-8">
                  {m.desc}
                </p>
                <span className="button-forge text-[0.7rem] py-2 px-4 inline-block">
                  Open Dashboard →
                </span>
              </motion.a>
            ))}
          </div>

          <p className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mt-16 max-w-2xl leading-relaxed">
            Dashboards are cognitive aids, not signals. Data is evidence-labeled;
            no dashboard issues a buy or sell. Sovereignty over the decision stays
            with the human.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
