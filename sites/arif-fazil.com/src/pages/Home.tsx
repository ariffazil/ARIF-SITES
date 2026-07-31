import { useEffect, useState } from 'react';
import { motion, type Variants } from 'framer-motion';
import { ZenPulse } from '@/components/ZenPulse';
import {
  contactLinks,
  wellsPortfolio,
} from '@/data/siteContent';
import { MISSIONS, MISSION_DOCTRINE } from '@/data/missions';
import { Link } from 'react-router-dom';

type WealthBriefing = {
  meta?: { date?: string };
  bursa?: { klci_quote?: { value?: number } };
  ringgit?: { usd_myr?: number; trend?: string };
  oil_energy?: { brent_price?: number };
};

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
    <section className="border-b border-forge-iron bg-forge-steel">
      <div className="max-w-[640px] mx-auto px-6 py-8">
        <div className="text-xs text-forge-dim uppercase tracking-widest mb-3">What matters now</div>
        {briefing ? (
          <>
            <p className="text-lg text-forge-white leading-relaxed mb-2">
              WEALTH daily briefing · {briefing.meta?.date ?? 'latest'}
            </p>
            {signals.length > 0 && (
              <p className="text-sm text-forge-dim uppercase tracking-widest mb-2">
                {signals.join(' · ')}
              </p>
            )}
            {briefing.ringgit?.trend && (
              <p className="text-sm text-forge-dim leading-relaxed mb-5 max-w-xl">
                {briefing.ringgit.trend}
              </p>
            )}
            <div className="flex flex-wrap gap-5">
              <a href="/economics" className="text-xs text-forge-orange hover:underline uppercase tracking-widest">
                Read today's briefing →
              </a>
              <a href="/makcikgpt/" className="text-xs text-forge-dim hover:text-forge-orange transition-colors uppercase tracking-widest">
                Read the latest MakcikGPT →
              </a>
            </div>
          </>
        ) : (
          <>
            <p className="text-lg text-forge-white leading-relaxed mb-5 max-w-xl">
              The WEALTH briefing tracks Malaysia's money — Bursa, ringgit, oil.
              MakcikGPT asks the questions nobody else asks.
            </p>
            <div className="flex flex-wrap gap-5">
              <a href="/economics" className="text-xs text-forge-orange hover:underline uppercase tracking-widest">
                Analyze the economy →
              </a>
              <a href="/makcikgpt/" className="text-xs text-forge-dim hover:text-forge-orange transition-colors uppercase tracking-widest">
                Read MakcikGPT →
              </a>
              <a href="#wells" className="text-xs text-forge-dim hover:text-forge-orange transition-colors uppercase tracking-widest">
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
      {/* ── STATUS BAR — orientation + live clock ─────────── */}
      <ZenPulse />

      {/* ── WHAT MATTERS NOW ─────────────────────────────── */}
      <CurrentAnswer />

      {/* ── HERO — clean, no foreign quotes ───────────────── */}
      <section className="py-24 md:py-32 bg-forge-black border-b border-forge-iron">
        <div className="max-w-[640px] mx-auto px-6">
          <motion.div variants={itemVariants}>
            <div className="text-xs text-forge-dim uppercase tracking-widest mb-3">Geoscientist · Kuala Lumpur</div>
            <h1 className="text-[clamp(2.5rem,10vw,6rem)] font-black leading-[0.9] uppercase tracking-tighter mb-8">
              Arif<br />Fazil
            </h1>
          </motion.div>

          <motion.div variants={itemVariants}>
            <p className="text-sm text-forge-orange uppercase tracking-widest mb-4">
              PETRONAS Carigali · Basin Analysis · Offshore Malaysia
            </p>
            <p className="text-lg text-forge-dim leading-relaxed mb-8 max-w-xl">
              I find oil and gas in places people said were finished.
              I also build the systems that keep AI honest.
              Both are the same kind of work: reading what the ground actually says, not what the model wants it to say.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/missions" className="button-forge button-forge--accent">Six Missions</Link>
              <a href="#wells" className="button-forge">See the Wells</a>
              <Link to="/writing" className="button-forge">Read Essays</Link>
            </div>

            <div className="mt-10 pt-8 border-t border-forge-iron/50 space-y-2">
              <div className="text-xs text-forge-dim uppercase tracking-widest mb-3">What I Believe</div>
              <div className="text-sm text-forge-dim">Evidence before narrative</div>
              <div className="text-sm text-forge-dim">F1–F13 Constitutional law</div>
              <div className="text-sm text-forge-dim">Ditempa bukan diberi</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── SIX MISSIONS — cockpit ────────────────────────── */}
      <section className="py-20 bg-forge-black border-b border-forge-iron" id="missions">
        <div className="max-w-[640px] mx-auto px-6">
          <div className="text-xs text-forge-dim uppercase tracking-widest mb-3">How to work with this system</div>
          <h2 className="text-3xl font-black uppercase tracking-tight mb-2">
            {MISSION_DOCTRINE.title}
          </h2>
          <p className="text-sm text-forge-dim mb-8 leading-relaxed">
            {MISSION_DOCTRINE.thesis} Value is not tool count. Value is one hard mission completed without dragging you into the engine room.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
            {MISSIONS.map((m) => (
              <Link
                key={m.id}
                to={`/missions#${m.id}`}
                className="block p-4 border border-forge-iron hover:border-forge-orange/50 transition-colors group"
              >
                <div className="text-base font-black uppercase text-forge-orange group-hover:underline">
                  {m.verb}
                </div>
                <p className="text-[0.65rem] text-forge-dim uppercase tracking-widest mt-1">{m.oneLine}</p>
              </Link>
            ))}
          </div>
          <Link to="/missions" className="button-forge button-forge--accent text-sm">
            Open mission cockpit →
          </Link>
        </div>
      </section>

      {/* ── WHAT I BUILT — organs ─────────────────────────── */}
      <section className="py-20 bg-forge-steel border-b border-forge-iron" id="what-i-built">
        <div className="max-w-[640px] mx-auto px-6">
          <div className="text-xs text-forge-dim uppercase tracking-widest mb-3">Organs · plumbing under the missions</div>
          <p className="text-sm text-forge-dim mb-10 leading-relaxed">
            Organs are not a menu of 128 tools. They are specialist systems the federation
            routes to after you state a mission. AI executes. You decide.
          </p>

          <div className="space-y-4">
            {/* arifOS */}
            <motion.div variants={itemVariants} className="border border-forge-iron p-5 group hover:border-forge-orange/30 transition-colors">
              <h3 className="text-lg font-black uppercase mb-1">arifOS</h3>
              <p className="text-[0.65rem] text-forge-dim mb-3 uppercase tracking-widest">The Law Layer · arifos.arif-fazil.com</p>
              <p className="text-sm text-forge-dim leading-relaxed mb-3">
                The rule book for AI systems. 13 floors that every tool call must pass.
                Nothing gets executed without a human-verifiable trail.
              </p>
              <a href="https://arifos.arif-fazil.com" target="_blank" rel="noreferrer" className="text-xs text-forge-orange hover:underline uppercase tracking-widest">
                Open Observatory →
              </a>
            </motion.div>

            {/* WEALTH */}
            <motion.div variants={itemVariants} className="border border-forge-iron p-5 group hover:border-forge-orange/30 transition-colors">
              <h3 className="text-lg font-black uppercase mb-1">WEALTH</h3>
              <p className="text-[0.65rem] text-forge-dim mb-3 uppercase tracking-widest">Capital Intelligence · arif-fazil.com/economics</p>
              <p className="text-sm text-forge-dim leading-relaxed mb-3">
                Daily briefings on what Malaysia's money is doing — Bursa, ringgit, oil prices, political economy.
                Evidence-gated. No vibes.
              </p>
              <a href="/economics" className="text-xs text-forge-orange hover:underline uppercase tracking-widest">
                Read Today's Briefing →
              </a>
            </motion.div>

            {/* GEOX */}
            <motion.div variants={itemVariants} className="border border-forge-iron p-5 group hover:border-forge-orange/30 transition-colors">
              <h3 className="text-lg font-black uppercase mb-1">GEOX</h3>
              <p className="text-[0.65rem] text-forge-dim mb-3 uppercase tracking-widest">Earth Intelligence · geox.arif-fazil.com</p>
              <p className="text-sm text-forge-dim leading-relaxed mb-3">
                Subsurface physics. Basin analysis, seismic, well logs.
                Physics-grounded — what the ground says, not what the model predicts.
              </p>
              <a href="https://geox.arif-fazil.com" target="_blank" rel="noreferrer" className="text-xs text-forge-orange hover:underline uppercase tracking-widest">
                Open GEOX →
              </a>
            </motion.div>

            {/* MakcikGPT */}
            <motion.div variants={itemVariants} className="border border-forge-iron p-5 group hover:border-forge-orange/30 transition-colors">
              <h3 className="text-lg font-black uppercase mb-1">MakcikGPT</h3>
              <p className="text-[0.65rem] text-forge-dim mb-3 uppercase tracking-widest">Civic Journalism · Bahasa Malaysia</p>
              <p className="text-sm text-forge-dim leading-relaxed mb-3">
                Civic journalism in Bahasa Makcik. When RM70 billion moves and nobody asks questions,
                MakcikGPT asks. Published directly, no gatekeepers.
              </p>
              <a href="/makcikgpt/" className="text-xs text-forge-orange hover:underline uppercase tracking-widest">
                Read MakcikGPT →
              </a>
            </motion.div>
          </div>

          <div className="mt-10 pt-8 border-t border-forge-iron flex flex-wrap gap-3 items-center">
            <Link to="/missions" className="button-forge button-forge--accent text-sm">Missions</Link>
            <a href="/000/" className="button-forge text-sm">/000 — For Agents</a>
            <a href="/999/" className="button-forge text-sm">/999 — Proof</a>
          </div>
        </div>
      </section>

      {/* ── WELLS ─────────────────────────────────────────── */}
      <section className="py-20 border-b border-forge-iron" id="wells">
        <div className="max-w-[640px] mx-auto px-6">
          <div className="text-xs text-forge-dim uppercase tracking-widest mb-3">Wells Portfolio</div>
          <h2 className="text-3xl font-black uppercase mb-10 tracking-tight">
            The actual work.
          </h2>
          <div className="space-y-6">
            {wellsPortfolio.map((well) => (
              <motion.div
                key={well.name}
                variants={itemVariants}
                whileHover={{ x: 4 }}
                className="border-l-4 border-forge-orange pl-5 py-1"
              >
                <div className="flex items-baseline gap-3 mb-1 flex-wrap">
                  <h3 className="text-lg font-black">{well.name}</h3>
                  <span className="text-[0.65rem] text-forge-dim uppercase">{well.playType} · {well.basin}</span>
                </div>
                <p className="text-sm text-forge-dim leading-relaxed mb-3">{well.summary}</p>
                <div className="bg-forge-steel p-3 border border-forge-iron">
                  <span className="text-[0.6rem] text-forge-orange uppercase block mb-1">Result</span>
                  <p className="text-[0.7rem] leading-tight text-forge-white uppercase">{well.impact}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRACTICE & CONTACT ────────────────────────────── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-b border-forge-iron bg-forge-steel">
        <div id="practice" className="p-12 md:p-20 border-b lg:border-b-0 lg:border-r border-forge-iron">
          <div className="max-w-[440px]">
            <div className="text-xs text-forge-dim uppercase tracking-widest mb-3">What I Do</div>
            <h2 className="text-3xl font-black uppercase mb-10 leading-none tracking-tighter">Decisions under noise.</h2>
            <ul className="space-y-5">
              <li className="flex gap-3">
                <span className="text-xs text-forge-orange font-mono">01</span>
                <p className="text-sm text-forge-dim">Basin analysis and prospect work under real-world uncertainty, not textbook models.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-xs text-forge-orange font-mono">02</span>
                <p className="text-sm text-forge-dim">Finding signals in noisy data — the kind that don't show up in the first pass.</p>
              </li>
              <li className="flex gap-3">
                <span className="text-xs text-forge-orange font-mono">03</span>
                <p className="text-sm text-forge-dim">Building reflexes, not instrument menus — tools exist only when a mission requires them.</p>
              </li>
            </ul>
          </div>
        </div>

        <div id="contact" className="p-12 md:p-20 bg-forge-black">
          <div className="max-w-[440px]">
            <div className="text-xs text-forge-dim uppercase tracking-widest mb-3">Get In Touch</div>
            <h2 className="text-3xl font-black uppercase mb-10 leading-none tracking-tighter">Reach out.</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {contactLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? '_blank' : undefined}
                  rel={link.external ? 'noreferrer' : undefined}
                  className="border border-forge-iron p-4 hover:border-forge-orange/50 transition-all group"
                >
                  <div className="text-xs uppercase tracking-widest text-forge-dim mb-2">Channel</div>
                  <div className="text-base font-bold uppercase">{link.label}</div>
                </a>
              ))}
            </div>
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
