import { useEffect } from 'react';
import { motion } from 'framer-motion';

export function Constellation() {
  useEffect(() => {
    document.title = 'Federation Constellation — Arif Fazil | arifOS';
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
          <div className="section-label">The Ecosystem · ΔΩΨ Constellation</div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
            The<br />Constellation
          </h1>
          <p className="font-body text-xl text-forge-dim max-w-2xl leading-relaxed">
            The arifOS ecosystem — constitutional AI runtime, sovereign infrastructure, and trusted agents. 
            A federation of intelligence rings working in unison.
          </p>
        </div>
      </section>

      {/* ── NODES ────────────────────────────────────────── */}
      <section className="py-24">
        <div className="site-frame">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              whileHover={{ translate: '-4px -4px' }}
              className="brutalist-card border-forge-orange/50"
            >
              <div className="section-label !mb-6 text-forge-orange">Ω MIND · Kernel</div>
              <h2 className="text-3xl font-black uppercase mb-4 italic">arifOS</h2>
              <p className="text-forge-dim leading-relaxed mb-8">
                The constitutional kernel. 13 floors of invariants keeping AI systems grounded and bounded. 
                Human sovereignty enforced at the machine level.
              </p>
              <a href="https://arifos.arif-fazil.com" target="_blank" rel="noreferrer" className="button-forge button-forge--accent w-full">
                Kernel Surface ↗
              </a>
            </motion.div>

            <motion.div 
              whileHover={{ translate: '-4px -4px' }}
              className="brutalist-card border-forge-dim"
            >
              <div className="section-label !mb-6 text-forge-white">Δ BODY · Identity</div>
              <h2 className="text-3xl font-black uppercase mb-4 italic">AAA Wire</h2>
              <p className="text-forge-dim leading-relaxed mb-8">
                MCP/A2A protocol specifications and agent runtime. The operational cockpit for the federation stack. 
                Identity verification and secure handoffs.
              </p>
              <a href="https://aaa.arif-fazil.com" target="_blank" rel="noreferrer" className="button-forge w-full">
                Operations Deck ↗
              </a>
            </motion.div>

            <motion.div 
              whileHover={{ translate: '-4px -4px' }}
              className="brutalist-card border-forge-dim"
            >
              <div className="section-label !mb-6 text-forge-white">Φ EARTH · GEOX</div>
              <h2 className="text-3xl font-black uppercase mb-4 italic">GEOX</h2>
              <p className="text-forge-dim leading-relaxed mb-8">
                Earth intelligence. G&G tools that take physics seriously. 
                Basin signals, well logs, seismic interpretation — all evidence-gated.
              </p>
              <a href="https://geox.arif-fazil.com" target="_blank" rel="noreferrer" className="button-forge w-full">
                GEOX Surface ↗
              </a>
            </motion.div>

            <motion.div 
              whileHover={{ translate: '-4px -4px' }}
              className="brutalist-card border-forge-dim"
            >
              <div className="section-label !mb-6 text-forge-white">Ξ CAPITAL · WEALTH</div>
              <h2 className="text-3xl font-black uppercase mb-4 italic">WEALTH</h2>
              <p className="text-forge-dim leading-relaxed mb-8">
                The value layer. Decision-quality intelligence for capital allocation 
                under extreme uncertainty. NPV/EMV risk engines.
              </p>
              <a href="/wealth/" className="button-forge w-full">
                Daily Briefing ↗
              </a>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ────────────────────────────────────────── */}
      <section className="py-24 border-t-2 border-forge-iron">
        <div className="site-frame">
          <div className="brutalist-card bg-forge-steel/30 text-center">
            <h3 className="text-xl font-bold uppercase mb-4 italic">Protocol Integrity</h3>
            <p className="text-sm text-forge-dim max-w-xl mx-auto leading-relaxed">
              All constellation nodes communicate via the arifOS federation manifest and are 
              cryptographically signed by the sovereign root key.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: "constellation",
  routeUrl: "/constellation/",
};

export default Constellation;
