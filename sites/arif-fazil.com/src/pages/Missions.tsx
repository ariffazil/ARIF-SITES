import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MISSIONS, MISSION_DOCTRINE } from '@/data/missions';

/**
 * /missions — human cockpit for the six verbs.
 * Machines read /missions.json. Humans land here (not a redirect to home).
 * Doctrine 2026-07-30: missions, not tool menus.
 */
export function Missions() {
  useEffect(() => {
    document.title = 'Missions — Six verbs · Arif Fazil';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen"
    >
      <section className="py-16 md:py-24 border-b border-forge-iron">
        <div className="site-frame max-w-3xl">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-forge-dim mb-4">
            Cockpit · not engine room
          </p>
          <h1 className="font-display font-black text-[clamp(2rem,6vw,3.5rem)] uppercase tracking-tighter italic text-forge-white mb-4">
            {MISSION_DOCTRINE.title}
          </h1>
          <p className="font-body text-lg text-forge-dim leading-relaxed mb-6">
            {MISSION_DOCTRINE.thesis}
          </p>
          <p className="font-mono text-xs text-forge-orange/90 uppercase tracking-widest mb-8">
            {MISSION_DOCTRINE.metric}
          </p>
          <ul className="space-y-2 mb-8">
            {MISSION_DOCTRINE.humanOnly.map((line) => (
              <li
                key={line}
                className="font-body text-sm text-forge-dim flex gap-3"
              >
                <span className="text-forge-orange shrink-0">▸</span>
                {line}
              </li>
            ))}
          </ul>
          <p className="font-body text-sm text-forge-dim/80 border-l-2 border-forge-iron pl-4">
            {MISSION_DOCTRINE.engineRoom}
          </p>
          <p className="mt-4 font-mono text-[0.65rem] text-forge-dim">
            Machine catalog:{' '}
            <a
              href="/missions.json"
              className="text-forge-orange hover:text-forge-white transition-colors"
            >
              /missions.json
            </a>
          </p>
        </div>
      </section>

      <section className="py-16 border-b border-forge-iron" aria-label="Six missions">
        <div className="site-frame">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MISSIONS.map((m) => (
              <article
                key={m.id}
                id={m.id}
                className="brutalist-card border border-forge-iron p-6 md:p-8"
              >
                <p className="font-mono text-[0.65rem] uppercase tracking-[0.14em] text-forge-dim mb-2">
                  {m.id}
                </p>
                <h2 className="text-2xl font-black uppercase text-forge-white mb-2">
                  {m.verb}
                </h2>
                <p className="font-body text-forge-orange text-sm mb-4">
                  {m.oneLine}
                </p>
                <p className="font-body text-sm text-forge-dim leading-relaxed mb-3">
                  <span className="text-forge-white font-medium">You ask: </span>
                  {m.humanSays}
                </p>
                <p className="font-body text-sm text-forge-dim leading-relaxed mb-4">
                  <span className="text-forge-white font-medium">Federation: </span>
                  {m.federationDoes}
                </p>
                <p className="font-mono text-[0.62rem] uppercase tracking-widest text-forge-dim mb-4">
                  Organs · {m.organs.join(' · ')}
                </p>
                <nav
                  aria-label={`${m.verb} surfaces`}
                  className="flex flex-wrap gap-x-4 gap-y-2"
                >
                  {m.surfaces.map((s) =>
                    s.href.startsWith('http') ? (
                      <a
                        key={s.href}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-mono text-xs text-forge-orange hover:text-forge-white transition-colors"
                      >
                        {s.label} ↗
                      </a>
                    ) : (
                      <Link
                        key={s.href}
                        to={s.href}
                        className="font-mono text-xs text-forge-orange hover:text-forge-white transition-colors"
                      >
                        {s.label} →
                      </Link>
                    ),
                  )}
                </nav>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="site-frame max-w-3xl">
          <p className="font-mono text-[0.65rem] text-forge-dim uppercase tracking-widest mb-2">
            Survival rule
          </p>
          <p className="font-body text-sm text-forge-dim leading-relaxed">
            {MISSION_DOCTRINE.survivalRule}
          </p>
          <p className="mt-6 font-mono text-[0.62rem] text-forge-dim/70">
            Sealed {MISSION_DOCTRINE.sealed} · This page classifies intent. Agents
            route. arifOS judges. Arif decides.
          </p>
        </div>
      </section>
    </motion.div>
  );
}
