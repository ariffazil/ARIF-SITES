import { motion, type Variants } from 'framer-motion';
import { QuoteCard } from '@/components/QuoteCard';
import {
  contactLinks,
  wellsPortfolio,
} from '@/data/siteContent';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 },
  },
};

export function Home() {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b-2 border-forge-iron py-24 md:py-32 bg-forge-black">
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #F0F0F0 1px, transparent 0)`,
            backgroundSize: '40px 40px',
          }}
        />

        <div className="site-frame relative z-10">
          <motion.div variants={itemVariants}>
            <div className="section-label">Geoscientist · Kuala Lumpur</div>
            <h1 className="font-display font-black text-[clamp(2.5rem,10vw,6rem)] leading-[0.9] uppercase tracking-tighter mb-8 italic">
              Arif<br />Fazil
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <motion.div variants={itemVariants} className="max-w-xl">
              <p className="font-technical text-forge-orange uppercase tracking-widest mb-4">
                PETRONAS Carigali · Basin Analysis · Offshore Malaysia
              </p>
              <p className="font-body text-xl text-forge-dim leading-relaxed mb-8">
                I find oil and gas in places people said were finished.
                I also build the systems that keep AI honest.
                Both are the same kind of work: reading what the ground actually says, not what the model wants it to say.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#wells" className="button-forge">See the Wells</a>
                <a href="#what-i-built" className="button-forge button-forge--accent">What I Built</a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <QuoteCard
                topic="Personal Philosophy"
                quote="Accept everything about yourself – I mean everything. You are you and that is the beginning and the end – no apologies, no regrets."
                author="Henry Kissinger"
                source="attributed to Henry Kissinger"
              />
              <div className="border-l-2 border-forge-iron pl-8 space-y-4 mt-6">
                <div className="font-technical text-[0.7rem] text-forge-dim uppercase tracking-widest">What I Believe</div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-forge-green shadow-glow-green"></span>
                  <span className="font-technical text-sm uppercase">Evidence before narrative</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-forge-orange shadow-glow-orange"></span>
                  <span className="font-technical text-sm uppercase">F1–F13 Constitutional law</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-forge-[#00D4AA] shadow-glow-[#00D4AA]"></span>
                  <span className="font-technical text-sm uppercase">Ditempa bukan diberi</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── WHAT I BUILT ──────────────────────────────────── */}
      <section className="py-24 bg-forge-steel border-b-2 border-forge-iron" id="what-i-built">
        <div className="site-frame">
          <div className="section-label">The Systems</div>
          <p className="font-body text-forge-dim max-w-2xl mb-12 leading-relaxed">
            Four systems running under one rule: AI executes, humans decide.
            No black boxes. Every consequential action is logged and reversible.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* arifOS */}
            <motion.div variants={itemVariants} className="brutalist-card group">
              <div className="text-3xl mb-3 group-hover:text-forge-orange transition-colors">⚖️</div>
              <h3 className="text-xl font-black uppercase mb-1">arifOS</h3>
              <p className="font-technical text-[0.65rem] text-forge-dim mb-4 uppercase tracking-widest">The Law Layer · arifos.arif-fazil.com</p>
              <p className="text-sm text-forge-dim leading-relaxed">
                The rule book for AI systems. 13 floors that every tool call must pass.
                Nothing gets executed without a human-verifiable trail.
                Think of it as the immune system that keeps autonomous agents from going off-road.
              </p>
              <div className="mt-4 pt-4 border-t border-forge-iron">
                <a href="https://arifos.arif-fazil.com" target="_blank" rel="noreferrer" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">
                  Open Observatory →
                </a>
              </div>
            </motion.div>

            {/* WEALTH */}
            <motion.div variants={itemVariants} className="brutalist-card group">
              <div className="text-3xl mb-3 group-hover:text-forge-orange transition-colors">📊</div>
              <h3 className="text-xl font-black uppercase mb-1">WEALTH</h3>
              <p className="font-technical text-[0.65rem] text-forge-dim mb-4 uppercase tracking-widest">Capital Intelligence · arif-fazil.com/economics</p>
              <p className="text-sm text-forge-dim leading-relaxed">
                Daily briefings on what Malaysia's money is doing — Bursa, ringgit, oil prices, political economy.
                Evidence-gated. No vibes. Written in plain signal, not analyst-speak.
              </p>
              <div className="mt-4 pt-4 border-t border-forge-iron">
                <a href="/economics" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">
                  Read Today's Briefing →
                </a>
              </div>
            </motion.div>

            {/* GEOX */}
            <motion.div variants={itemVariants} className="brutalist-card group">
              <div className="text-3xl mb-3 group-hover:text-forge-orange transition-colors">🗺️</div>
              <h3 className="text-xl font-black uppercase mb-1">GEOX</h3>
              <p className="font-technical text-[0.65rem] text-forge-dim mb-4 uppercase tracking-widest">Earth Intelligence · geox.arif-fazil.com</p>
              <p className="text-sm text-forge-dim leading-relaxed">
                Subsurface physics. Basin analysis, seismic, well logs.
                Physics-grounded — what the ground says, not what the model predicts.
              </p>
              <div className="mt-4 pt-4 border-t border-forge-iron">
                <a href="https://geox.arif-fazil.com" target="_blank" rel="noreferrer" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">
                  Open GEOX →
                </a>
              </div>
            </motion.div>

            {/* MakcikGPT */}
            <motion.div variants={itemVariants} className="brutalist-card group">
              <div className="text-3xl mb-3 group-hover:text-forge-orange transition-colors">📰</div>
              <h3 className="text-xl font-black uppercase mb-1">MakcikGPT</h3>
              <p className="font-technical text-[0.65rem] text-forge-dim mb-4 uppercase tracking-widest">Civic Journalism · Bahasa Malaysia</p>
              <p className="text-sm text-forge-dim leading-relaxed">
                Civic journalism in Bahasa Makcik. When RM70 billion moves and nobody asks questions,
                MakcikGPT asks. Published directly, no gatekeepers.
              </p>
              <div className="mt-4 pt-4 border-t border-forge-iron">
                <a href="/world/makcikgpt/" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">
                  Read MakcikGPT →
                </a>
              </div>
            </motion.div>
          </div>

          <div className="mt-12 pt-8 border-t border-forge-iron">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
              <p className="font-body text-forge-dim max-w-2xl text-sm italic">
                "Every tool here was built because the work demanded it — not because AI is fashionable."
              </p>
              <div className="flex gap-4 flex-shrink-0">
                <a href="/000/" className="button-forge text-xs py-2">/000 — For Agents</a>
                <a href="/999/" className="button-forge button-forge--accent text-xs py-2">/999 — Proof</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── WELLS ─────────────────────────────────────────── */}
      <section className="py-24 border-b-2 border-forge-iron" id="wells">
        <div className="site-frame">
          <div className="section-label">Wells Portfolio</div>
          <h2 className="text-4xl font-black uppercase italic mb-12 tracking-tight">
            The actual work.
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {wellsPortfolio.map((well) => (
              <motion.div
                key={well.name}
                variants={itemVariants}
                whileHover={{ x: 5 }}
                className="border-l-4 border-forge-orange pl-6 py-2"
              >
                <div className="flex items-baseline gap-4 mb-2 flex-wrap">
                  <h3 className="text-xl font-black italic">{well.name}</h3>
                  <span className="font-technical text-[0.6rem] text-forge-dim uppercase">{well.playType} · {well.basin}</span>
                </div>
                <p className="font-body text-forge-dim text-sm leading-relaxed mb-4">{well.summary}</p>
                <div className="bg-forge-steel p-3 border border-forge-iron">
                  <span className="font-technical text-[0.6rem] text-forge-orange uppercase block mb-1">Result</span>
                  <p className="font-technical text-[0.7rem] leading-tight text-forge-white uppercase">{well.impact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRACTICE & CONTACT ────────────────────────────── */}
      <section className="py-24 bg-forge-steel grid grid-cols-1 lg:grid-cols-2 gap-0 border-b-2 border-forge-iron">
        <div id="practice" className="p-12 md:p-24 border-b-2 lg:border-b-0 lg:border-r-2 border-forge-iron">
          <div className="section-label">What I Do</div>
          <h2 className="text-4xl font-black uppercase mb-12 italic leading-none tracking-tighter">Decisions under noise.</h2>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <span className="font-technical text-forge-orange">01</span>
              <p className="text-forge-dim">Basin analysis and prospect work under real-world uncertainty, not textbook models.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-technical text-forge-orange">02</span>
              <p className="text-forge-dim">Finding signals in noisy data — the kind that don't show up in the first pass.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-technical text-forge-orange">03</span>
              <p className="text-forge-dim">Building tools only when the work actually needs them. No technology for technology's sake.</p>
            </li>
          </ul>
        </div>

        <div id="contact" className="p-12 md:p-24 bg-forge-black">
          <div className="section-label">Get In Touch</div>
          <h2 className="text-4xl font-black uppercase mb-12 italic leading-none tracking-tighter">Reach out.</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {contactLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? '_blank' : undefined}
                rel={link.external ? 'noreferrer' : undefined}
                className="brutalist-card p-6 flex flex-col justify-between hover:bg-forge-white hover:text-forge-black transition-all group"
              >
                <div className="font-technical text-xs uppercase tracking-widest text-forge-dim group-hover:text-forge-black mb-4">Channel</div>
                <div className="text-xl font-bold uppercase">{link.label}</div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: "home",
  routeUrl: "/",
};

export default Home;
