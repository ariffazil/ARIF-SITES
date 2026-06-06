import { motion, type Variants } from 'framer-motion';
import {
  contactLinks,
  wellsPortfolio,
  systemProjects,
} from '@/data/siteContent';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 100,
    },
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
        {/* Topographic Background Placeholder Effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, #F0F0F0 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="site-frame relative z-10">
          <motion.div variants={itemVariants}>
            <div className="section-label">Operational Status: LIVE · Human-gated</div>
            <h1 className="font-display font-black text-[clamp(2.5rem,10vw,6rem)] leading-[0.9] uppercase tracking-tighter mb-8 italic">
              Arif<br />Fazil
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <motion.div variants={itemVariants} className="max-w-xl">
              <p className="font-technical text-forge-orange uppercase tracking-widest mb-4">
                ΔΩΨ Architect · Geoscientist · Forge Master
              </p>
              <p className="font-body text-xl text-forge-dim leading-relaxed mb-8">
                I build sovereign intelligence systems that hold up under real operating conditions — 
                from subsurface exploration logs to constitutional AI kernels. 
                Intelligence is forged, not given.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#systems" className="button-forge">The Systems</a>
                <a href="#wells" className="button-forge button-forge--accent">Wells Portfolio</a>
              </div>
            </motion.div>
            
            <motion.div variants={itemVariants} className="hidden lg:block">
              <div className="border-l-2 border-forge-iron pl-8 space-y-4">
                <div className="font-technical text-[0.7rem] text-forge-dim uppercase tracking-widest">Core Invariants</div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-forge-green shadow-glow-green"></span>
                  <span className="font-technical text-sm uppercase">F1 AMANAH: Reversible-First</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-forge-green shadow-glow-green"></span>
                  <span className="font-technical text-sm uppercase">F7 HUMILITY: Epistemic Clarity</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-forge-green shadow-glow-green"></span>
                  <span className="font-technical text-sm uppercase">F13 SOVEREIGN: Human Veto</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THE FEDERATION (TRINITY) ──────────────────────── */}
      <section className="py-24 bg-forge-steel border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">The Federation Architecture</div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 -space-x-[2px] -space-y-[2px]">
            {/* arifOS */}
            <motion.div variants={itemVariants} className="brutalist-card group">
              <div className="font-display text-4xl mb-4 group-hover:text-forge-orange transition-colors">Ψ</div>
              <h3 className="text-xl mb-2">arifOS</h3>
              <p className="font-technical text-[0.65rem] text-forge-dim mb-4 uppercase tracking-widest">MIND · CONSTITUTIONAL KERNEL</p>
              <p className="text-sm text-forge-dim leading-relaxed">
                The law layer. 13 floors keeping AI systems grounded and bounded.
                Every tool call traces to a floor. Every consequential action is receipt-traced;
                terminal outcomes seal to VAULT999 only after authority checks.
              </p>
            </motion.div>

            {/* GEOX */}
            <motion.div variants={itemVariants} className="brutalist-card group">
              <div className="font-display text-4xl mb-4 group-hover:text-forge-orange transition-colors">Φ</div>
              <h3 className="text-xl mb-2">GEOX</h3>
              <p className="font-technical text-[0.65rem] text-forge-dim mb-4 uppercase tracking-widest">BODY · EARTH INTELLIGENCE</p>
              <p className="text-sm text-forge-dim leading-relaxed">
                The field layer. G&G tools that take physics seriously. 
                Basin signals, well logs, seismic interpretation — all evidence-gated.
              </p>
            </motion.div>

            {/* WEALTH */}
            <motion.div variants={itemVariants} className="brutalist-card group">
              <div className="font-display text-4xl mb-4 group-hover:text-forge-orange transition-colors">Ξ</div>
              <h3 className="text-xl mb-2">WEALTH</h3>
              <p className="font-technical text-[0.65rem] text-forge-dim mb-4 uppercase tracking-widest">CAPITAL · DECISION LOGIC</p>
              <p className="text-sm text-forge-dim leading-relaxed">
                The value layer. NPV, EMV, cascade risk, and relational credit. 
                Decision-quality intelligence for allocation under extreme uncertainty.
              </p>
            </motion.div>

            {/* AAA */}
            <motion.div variants={itemVariants} className="brutalist-card group">
              <div className="font-display text-4xl mb-4 group-hover:text-forge-orange transition-colors">Ω</div>
              <h3 className="text-xl mb-2">AAA</h3>
              <p className="font-technical text-[0.65rem] text-forge-dim mb-4 uppercase tracking-widest">SOUL · OPERATIONAL COCKPIT</p>
              <p className="text-sm text-forge-dim leading-relaxed">
                The identity layer. Control plane for the full federation stack. 
                Health, registry, and human-in-the-loop sovereign veto surface.
              </p>
            </motion.div>
          </div>
          
          <div className="mt-12 flex flex-col md:flex-row gap-8 items-start md:items-center justify-between border-t border-forge-iron pt-8">
            <p className="font-body text-forge-dim max-w-2xl text-sm italic">
              "Context may guide behaviour, but evidence must govern truth claims. 
              We forge systems that remember why they were built."
            </p>
            <div className="flex gap-4">
              <a href="/000/" className="button-forge text-xs py-2">Open /000 (Genesis)</a>
              <a href="/999/" className="button-forge button-forge--accent text-xs py-2">Open /999 (Proof)</a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WELLS ─────────────────────────────────────────── */}
      <section className="py-24 border-b-2 border-forge-iron" id="wells">
        <div className="site-frame">
          <div className="section-label">Subsurface Dossier: Wells Portfolio</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {wellsPortfolio.map((well) => (
              <motion.div 
                key={well.name}
                variants={itemVariants}
                whileHover={{ x: 5 }}
                className="border-l-4 border-forge-orange pl-6 py-2"
              >
                <div className="flex items-baseline gap-4 mb-2">
                  <h3 className="text-xl font-black italic">{well.name}</h3>
                  <span className="font-technical text-[0.6rem] text-forge-dim uppercase">{well.playType} · {well.basin}</span>
                </div>
                <p className="font-body text-forge-dim text-sm leading-relaxed mb-4">{well.summary}</p>
                <div className="bg-forge-steel p-3 border border-forge-iron">
                  <span className="font-technical text-[0.6rem] text-forge-orange uppercase block mb-1">Observation Impact</span>
                  <p className="font-technical text-[0.7rem] leading-tight text-forge-white uppercase">{well.impact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SYSTEMS ────────────────────────────────────────── */}
      <section className="py-24 bg-forge-black" id="systems">
        <div className="site-frame">
          <div className="section-label">Active System Monitors</div>
          <div className="space-y-4">
            {systemProjects.map((sys) => (
              <motion.div 
                key={sys.title}
                variants={itemVariants}
                className="brutalist-card flex flex-col lg:flex-row gap-8 lg:items-center"
              >
                <div className="lg:w-1/4">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-2xl font-black">{sys.title}</h3>
                    <span className={`badge-status ${sys.status === 'LIVE' ? 'badge-status--live' : 'badge-status--hold'}`}>
                      {sys.status}
                    </span>
                  </div>
                  <p className="font-technical text-[0.7rem] text-forge-orange uppercase tracking-widest">{sys.role}</p>
                </div>
                
                <div className="flex-1">
                  <p className="text-sm text-forge-dim leading-relaxed">{sys.summary}</p>
                </div>
                
                <div className="flex gap-4 lg:w-1/4 lg:justify-end">
                  <a
                    href={sys.surfaceHref}
                    {...(sys.surfaceHref.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}
                    className="button-forge text-[0.65rem] px-3 py-2"
                  >
                    {sys.surfaceLabel} ↗
                  </a>
                  <a href={sys.artifactHref} target="_blank" rel="noreferrer" className="button-forge button-forge--accent text-[0.65rem] px-3 py-2">
                    Artifact ↗
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRACTICE & CONTACT ────────────────────────────── */}
      <section className="py-24 bg-forge-steel grid grid-cols-1 lg:grid-cols-2 gap-0 border-b-2 border-forge-iron">
        <div id="practice" className="p-12 md:p-24 border-b-2 lg:border-b-0 lg:border-r-2 border-forge-iron">
          <div className="section-label">The Practice</div>
          <h2 className="text-4xl font-black uppercase mb-12 italic leading-none tracking-tighter">Decisions under noise.</h2>
          <ul className="space-y-6">
            <li className="flex gap-4">
              <span className="font-technical text-forge-orange">01</span>
              <p className="text-forge-dim">Basin analysis and prospect work under real-world uncertainty, not textbook simulations.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-technical text-forge-orange">02</span>
              <p className="text-forge-dim">Structural interpretation in high-entropy data environments—finding signals others ignore.</p>
            </li>
            <li className="flex gap-4">
              <span className="font-technical text-forge-orange">03</span>
              <p className="text-forge-dim">Building tools when the work demands them. Technology follows need, never precedes it.</p>
            </li>
          </ul>
        </div>
        
        <div id="contact" className="p-12 md:p-24 bg-forge-black">
          <div className="section-label">Secure Relay</div>
          <h2 className="text-4xl font-black uppercase mb-12 italic leading-none tracking-tighter">Initiate Handoff.</h2>
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
