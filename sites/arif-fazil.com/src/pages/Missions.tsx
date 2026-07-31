import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ZenPulse } from '@/components/ZenPulse';
import { MISSIONS, MISSION_DOCTRINE } from '@/data/missions';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants: Variants = {
  hidden: { y: 16, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
};

export function Missions() {
  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <ZenPulse
        whereAmI="arif-fazil.com · Missions — human cockpit"
        whyCare="You do not operate tools. You state missions. The machine carries complexity."
        whatNext="Pick a mission · supply evidence · judge the answer"
      />

      <section className="border-b-2 border-forge-iron bg-forge-black py-16 md:py-24">
        <div className="site-frame">
          <motion.div variants={itemVariants}>
            <div className="section-label">Human interface · not tool inventory</div>
            <h1 className="font-display font-black text-[clamp(2rem,8vw,4.5rem)] leading-[0.95] uppercase tracking-tighter mb-6 italic">
              {MISSION_DOCTRINE.title}
            </h1>
            <p className="font-body text-xl text-forge-dim max-w-3xl leading-relaxed mb-8">
              {MISSION_DOCTRINE.thesis}
            </p>
            <p className="font-technical text-xs text-forge-orange uppercase tracking-widest mb-4">
              Your job — four acts only
            </p>
            <ol className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-3xl mb-10">
              {MISSION_DOCTRINE.humanOnly.map((line, i) => (
                <li
                  key={line}
                  className="border border-forge-iron bg-forge-steel px-4 py-3 font-body text-sm text-forge-white flex gap-3"
                >
                  <span className="font-technical text-forge-orange">{String(i + 1).padStart(2, '0')}</span>
                  {line}
                </li>
              ))}
            </ol>
            <p className="font-body text-sm text-forge-dim max-w-2xl leading-relaxed border-l-2 border-forge-orange pl-4">
              Geological analogy: you do not sit down to “use a wavelet extractor.” You ask where the trap
              is, what supports it, what kills it, and whether to drill. The workstation combines methods.
              You judge geological meaning.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-forge-steel border-b-2 border-forge-iron" id="six">
        <div className="site-frame">
          <div className="section-label">The six missions</div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {MISSIONS.map((m) => (
              <motion.article
                key={m.id}
                variants={itemVariants}
                id={m.id}
                className="brutalist-card flex flex-col h-full"
              >
                <div className="font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest mb-2">
                  Mission
                </div>
                <h2 className="font-display font-black text-2xl uppercase italic mb-1">{m.verb}</h2>
                <p className="font-technical text-[0.7rem] text-forge-dim uppercase tracking-widest mb-4">
                  {m.oneLine}
                </p>
                <p className="font-body text-sm text-forge-white leading-relaxed mb-3">
                  <span className="text-forge-orange">You say: </span>
                  {m.humanSays}
                </p>
                <p className="font-body text-sm text-forge-dim leading-relaxed mb-4 flex-1">
                  <span className="text-forge-white/80">Federation: </span>
                  {m.federationDoes}
                </p>
                <div className="font-technical text-[0.6rem] text-forge-dim uppercase tracking-widest mb-2">
                  Organs · {m.organs.join(' · ')}
                </div>
                <div className="flex flex-wrap gap-3 pt-3 border-t border-forge-iron">
                  {m.surfaces.map((s) =>
                    s.href.startsWith('http') ? (
                      <a
                        key={s.href}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="font-technical text-[0.65rem] text-forge-orange hover:underline uppercase tracking-widest"
                      >
                        {s.label} ↗
                      </a>
                    ) : (
                      <Link
                        key={s.href}
                        to={s.href}
                        className="font-technical text-[0.65rem] text-forge-orange hover:underline uppercase tracking-widest"
                      >
                        {s.label} →
                      </Link>
                    ),
                  )}
                </div>
                <details className="mt-3 pt-2 border-t border-forge-iron/50">
                  <summary className="font-technical text-[0.6rem] text-forge-dim uppercase tracking-widest cursor-pointer">
                    Engine room · kernel path
                  </summary>
                  <p className="font-mono text-[0.65rem] text-forge-dim mt-2 leading-relaxed">
                    {m.kernelHint}
                  </p>
                </details>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 border-b-2 border-forge-iron bg-forge-black">
        <div className="site-frame max-w-3xl">
          <div className="section-label">Engine room · not cockpit</div>
          <h2 className="font-display font-black text-2xl uppercase italic mb-4">
            Where tools live
          </h2>
          <p className="font-body text-forge-dim leading-relaxed mb-4">
            {MISSION_DOCTRINE.engineRoom}
          </p>
          <p className="font-body text-sm text-forge-dim leading-relaxed mb-6">
            <strong className="text-forge-white">Tool survival: </strong>
            {MISSION_DOCTRINE.survivalRule}
          </p>
          <p className="font-technical text-xs text-forge-orange uppercase tracking-widest mb-6">
            Final metric · {MISSION_DOCTRINE.metric}
          </p>
          <div className="flex flex-wrap gap-4">
            <a
              href="https://mcp.arif-fazil.com/explorer.html"
              className="button-forge text-xs py-2"
              target="_blank"
              rel="noreferrer"
            >
              Tool Explorer (dev/audit) ↗
            </a>
            <Link to="/doctrine" className="button-forge button-forge--accent text-xs py-2">
              Doctrine →
            </Link>
            <a href="/missions.json" className="button-forge text-xs py-2">
              missions.json (agents)
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: 'missions',
  routeUrl: '/missions',
};

export default Missions;
