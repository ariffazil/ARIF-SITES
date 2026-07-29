import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { QuoteCard } from '@/components/QuoteCard';
import { ZenPulse } from '@/components/ZenPulse';
import {
  contactLinks,
  wellsPortfolio,
} from '@/data/siteContent';

// Shape of /data/wealth/latest.json (fields actually rendered — no invention).
type WealthBriefing = {
  meta?: { date?: string };
  bursa?: { klci_quote?: { value?: number } };
  ringgit?: { usd_myr?: number; trend?: string };
  oil_energy?: { brent_price?: number };
};

// Dominant above-the-fold answer block. Fetches the WEALTH daily briefing
// client-side; falls back to curated copy when the snapshot is unreachable.
function CurrentAnswer() {
  const [briefing, setBriefing] = useState<WealthBriefing | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch('/data/wealth/latest.json')
      .then((res) => {
        if (!res.ok) throw new Error('briefing snapshot unavailable');
        return res.json();
      })
      .then((data: WealthBriefing) => {
        if (!cancelled) setBriefing(data);
      })
      .catch(() => {
        if (!cancelled) setBriefing(null);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signals: string[] = [];
  const klci = briefing?.bursa?.klci_quote?.value;
  const myr = briefing?.ringgit?.usd_myr;
  const brent = briefing?.oil_energy?.brent_price;
  if (klci != null) signals.push(`KLCI ${klci.toLocaleString()}`);
  if (myr != null) signals.push(`USD/MYR ${myr}`);
  if (brent != null) signals.push(`Brent $${brent}`);

  return (
    <section className="border-b-2 border-forge-iron bg-forge-steel">
      <div className="site-frame py-10">
        <div className="section-label">What matters now</div>
        {briefing ? (
          <>
            <p className="font-body text-lg md:text-xl text-forge-white leading-relaxed mb-3">
              WEALTH daily briefing · {briefing.meta?.date ?? 'latest'}
            </p>
            {signals.length > 0 && (
              <p className="font-technical text-sm text-forge-dim uppercase tracking-widest mb-3">
                {signals.join(' · ')}
              </p>
            )}
            {briefing.ringgit?.trend && (
              <p className="font-body text-sm text-forge-dim leading-relaxed mb-6 max-w-2xl">
                {briefing.ringgit.trend}
              </p>
            )}
            <div className="flex flex-wrap gap-6">
              <a href="/economics" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">
                Read today's briefing →
              </a>
              <a href="/world/makcikgpt/" className="font-technical text-xs text-forge-dim hover:text-forge-orange transition-colors uppercase tracking-widest">
                Read the latest MakcikGPT →
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="font-body text-lg md:text-xl text-forge-white leading-relaxed mb-6 max-w-2xl">
              The WEALTH briefing tracks Malaysia's money — Bursa, ringgit, oil.
              MakcikGPT asks the questions nobody else asks. The wells are the proof of work.
            </p>
            <div className="flex flex-wrap gap-6">
              <a href="/economics" className="font-technical text-xs text-forge-orange hover:underline uppercase tracking-widest">
                Analyze the economy →
              </a>
              <a href="/world/makcikgpt/" className="font-technical text-xs text-forge-dim hover:text-forge-orange transition-colors uppercase tracking-widest">
                Read the latest MakcikGPT →
              </a>
              <a href="#wells" className="font-technical text-xs text-forge-dim hover:text-forge-orange transition-colors uppercase tracking-widest">
                See the wells →
              </a>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

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
      {/* ── ZEN PULSE — orientation in 3 seconds ─────────── */}
      <ZenPulse
        whereAmI="arif-fazil.com · Home — one human page"
        whyCare="Evidence before narrative. Every claim here is verifiable."
        whatNext="Pick a verb in the nav, or read the current answer below."
      />

      {/* ── WHAT MATTERS NOW — dominant answer ───────────── */}
      <CurrentAnswer />

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
