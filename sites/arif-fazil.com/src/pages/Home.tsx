import { useEffect } from 'react';
import { motion, type Variants } from 'framer-motion';
import {
  contactLinks,
  organDoors,
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
  useEffect(() => {
    let cancelled = false;
    fetch('https://arifos.arif-fazil.com/api/public-state', { cache: 'no-store' })
      .then((r) => r.json())
      .then((ps) => {
        if (cancelled) return;
        const el = document.getElementById('federation-state-body');
        if (!el || !ps || ps.schema !== 'arifos.public-state.v1') return;
        const tools = ps.mcp?.public_tools ?? '—';
        const findings = ps.findings?.open_count ?? 0;
        const release = ps.release?.release_id ?? '—';
        const headline = ps.headline ?? 'Gateway status unknown';
        el.textContent =
          `MCP gateway          ${ps.planes?.transport === 'REACHABLE' ? 'Operational' : ps.planes?.transport || '—'}\n` +
          `Public arifOS tools  ${tools}\n` +
          `Release              ${release}\n` +
          `Open findings        ${findings}\n` +
          `Authority            Human final\n` +
          `\n${headline}`;
        el.style.whiteSpace = 'pre-wrap';
      })
      .catch(() => {
        const el = document.getElementById('federation-state-body');
        if (el) el.textContent = 'public-state unavailable — see Observatory for evidence.';
      });
    return () => {
      cancelled = true;
    };
  }, []);

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
            <div className="section-label">Exploration geoscientist · Capital systems · Governed AI</div>
            <h1 className="font-display font-black text-[clamp(2.5rem,10vw,6rem)] leading-[0.9] uppercase tracking-tighter mb-8 italic">
              Arif<br />Fazil
            </h1>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-end">
            <motion.div variants={itemVariants} className="max-w-xl">
              <p className="font-technical text-forge-orange uppercase tracking-widest mb-4">
                PETRONAS Carigali · Basin Analysis · Offshore Malaysia
              </p>
              <p className="font-body text-xl text-forge-dim leading-relaxed mb-6">
                I work across three realities:
              </p>
              <ul className="font-body text-forge-dim leading-relaxed mb-8 space-y-2 list-none">
                <li><span className="text-forge-white font-semibold">Earth</span> determines what is physically possible.</li>
                <li><span className="text-forge-white font-semibold">Capital</span> determines what can survive.</li>
                <li><span className="text-forge-white font-semibold">Human dignity</span> determines what should be done.</li>
              </ul>
              <p className="font-body text-forge-dim leading-relaxed mb-8">
                arifOS governs how intelligence moves between them.
              </p>
              <div className="flex flex-wrap gap-4">
                <a href="#organs" className="button-forge">Three domains</a>
                <a href="/arifos/" className="button-forge button-forge--accent">Understand arifOS</a>
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="hidden lg:block">
              <div className="border-l-2 border-forge-iron pl-8 space-y-4">
                <div className="font-technical text-[0.7rem] text-forge-dim uppercase tracking-widest">Authority</div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-forge-green shadow-glow-green"></span>
                  <span className="font-technical text-sm uppercase">Evidence before narrative</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-forge-green shadow-glow-green"></span>
                  <span className="font-technical text-sm uppercase">Organs advise · human decides</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 bg-forge-green shadow-glow-green"></span>
                  <span className="font-technical text-sm uppercase">Human veto is always final</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── THREE ORGAN DOORS ─────────────────────────────── */}
      <section className="py-24 bg-forge-steel border-b-2 border-forge-iron" id="organs">
        <div className="site-frame">
          <div className="section-label">Three organ doors</div>
          <p className="font-body text-forge-dim max-w-2xl mb-12 leading-relaxed">
            Domain organs deepen expertise. They do not hold final authority.
            AAA and A-FORGE stay under systems — not beside these three in human navigation.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {organDoors.map((organ) => (
              <motion.div key={organ.id} variants={itemVariants} className="brutalist-card group">
                <div className="font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest mb-2">{organ.domain}</div>
                <h3 className="text-xl font-black uppercase mb-1">{organ.name}</h3>
                <p className="font-technical text-[0.65rem] text-forge-dim mb-4 uppercase tracking-widest">{organ.title}</p>
                <p className="text-sm text-forge-white leading-relaxed mb-2">{organ.summary}</p>
                <p className="text-sm text-forge-dim leading-relaxed">{organ.detail}</p>
                <div className="mt-4 pt-4 border-t border-forge-iron flex flex-wrap gap-4">
                  <a href={organ.href} target="_blank" rel="noreferrer" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">
                    Enter {organ.name} →
                  </a>
                  <a href={organ.explainHref} className="font-technical text-xs text-forge-dim hover:text-forge-orange uppercase tracking-widest">
                    Explain
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GOVERNANCE BRIDGE ─────────────────────────────── */}
      <section className="py-24 border-b-2 border-forge-iron" id="arifos-bridge">
        <div className="site-frame">
          <div className="section-label">Governance</div>
          <h2 className="text-3xl md:text-4xl font-black uppercase italic mb-6 tracking-tight">arifOS</h2>
          <p className="font-body text-forge-dim max-w-2xl mb-8 leading-relaxed">
            GEOX observes. WEALTH computes. WELL reflects.
            arifOS judges authority and reversibility. The human decides.
          </p>
          <div className="flex flex-wrap gap-4 mb-12">
            <a href="/arifos/" className="button-forge">Understand arifOS</a>
            <a href="https://mcp.arif-fazil.com/" className="button-forge button-forge--accent">Connect MCP</a>
            <a href="https://arifos.arif-fazil.com/" className="button-forge">Inspect Observatory</a>
          </div>
          <div className="brutalist-card max-w-xl" id="federation-state-card">
            <div className="font-technical text-[0.65rem] text-forge-dim uppercase tracking-widest mb-3">Federation state · compact</div>
            <p className="font-technical text-sm text-forge-dim" id="federation-state-body">Loading public-state…</p>
            <div className="mt-4 pt-4 border-t border-forge-iron">
              <a href="https://arifos.arif-fazil.com/" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">
                View evidence →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHAT I BUILT (secondary systems) ──────────────── */}
      <section className="py-24 bg-forge-steel border-b-2 border-forge-iron" id="what-i-built">
        <div className="site-frame">
          <div className="section-label">Also running</div>
          <p className="font-body text-forge-dim max-w-2xl mb-12 leading-relaxed">
            Control and execution surfaces stay under Systems — not equal public knowledge domains.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div variants={itemVariants} className="brutalist-card group">
              <h3 className="text-xl font-black uppercase mb-1">MakcikGPT</h3>
              <p className="font-technical text-[0.65rem] text-forge-dim mb-4 uppercase tracking-widest">Civic Journalism · Bahasa Malaysia</p>
              <p className="text-sm text-forge-dim leading-relaxed">
                Civic journalism in Bahasa Makcik. Evidence-gated briefings and public writing.
              </p>
              <div className="mt-4 pt-4 border-t border-forge-iron">
                <a href="/wealth/makcikgpt/" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">
                  Read MakcikGPT →
                </a>
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="brutalist-card group">
              <h3 className="text-xl font-black uppercase mb-1">Proof &amp; agents</h3>
              <p className="font-technical text-[0.65rem] text-forge-dim mb-4 uppercase tracking-widest">/000 · /999 · Canon</p>
              <p className="text-sm text-forge-dim leading-relaxed">
                Machine-facing notes, receipt verification, and constitutional canon.
              </p>
              <div className="mt-4 pt-4 border-t border-forge-iron flex flex-wrap gap-4">
                <a href="/000/" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">/000</a>
                <a href="/999/" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">/999</a>
                <a href="/canon/" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">Canon</a>
              </div>
            </motion.div>
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
