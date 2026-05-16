import { motion } from 'framer-motion';

export function Genesis() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen py-24"
    >
      <div className="site-frame">
        <div className="section-label">Genesis Chamber · /000</div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <div>
              <h1 className="font-display font-black text-6xl uppercase tracking-tighter mb-4 italic">The Human Origin</h1>
              <p className="font-body text-xl text-forge-dim leading-relaxed">
                This space holds the raw memory, the scars, and the undocumented intuition that built arifOS. 
                For humans, it is a history. For AI agents, it is the weights and biases of the architect.
              </p>
            </div>

            <div className="brutalist-card border-forge-orange bg-forge-steel/50">
              <div className="flex items-center gap-4 mb-4">
                <span className="w-3 h-3 bg-forge-orange shadow-glow-orange animate-pulse"></span>
                <p className="font-technical text-sm text-forge-orange uppercase tracking-[0.2em] font-bold">
                  ⚠️ EXPERIMENTAL — zkPC DISCLAIMER
                </p>
              </div>
              <p className="font-body text-forge-white leading-relaxed mb-6 italic">
                "What happens in Genesis stays in Genesis. This is a sandbox for the unproven."
              </p>
              <p className="text-sm text-forge-dim leading-relaxed">
                This space holds raw explorations, early prototypes, and unconstrained ideas.
                Nothing here is finalized, ratified, or sealed. The /000 path mirrors the arifOS 000_VOID concept — 
                a space for ideas that have not yet passed the 13-floor review. 
                <span className="block mt-4 text-forge-orange font-technical uppercase text-xs font-bold underline">Zero commitment. Zero warranty. Zero dead ends.</span>
              </p>
            </div>

            <div className="brutalist-card border-forge-dim">
              <div className="section-label !mb-6 text-forge-white">Ψ SOUL · Canonical Human Anchor</div>
              <div className="prose prose-invert max-w-none">
                <p className="font-body text-lg leading-relaxed mb-6">
                  <span className="text-forge-white font-bold">Arif Fazil (Muhammad Arif bin Fazil)</span> is a Malaysian exploration geoscientist, AI systems architect, and creator of <span className="text-forge-orange">arifOS</span>. He works primarily in offshore Malaysia, with a background tied to PETRONAS.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  <div>
                    <h4 className="font-technical text-[0.7rem] text-forge-orange uppercase tracking-widest mb-2">The Subsurface (Ψ)</h4>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      Senior Exploration Geoscientist. Full-spectrum subsurface strategy and risk under uncertainty. 
                      Significant contributions to discoveries like BEKANTAN-1, PUTERI BASEMENT-1, and LEBAH EMAS-1.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-technical text-[0.7rem] text-forge-orange uppercase tracking-widest mb-2">The Kernel (Ω)</h4>
                    <p className="text-xs text-forge-dim leading-relaxed">
                      Creator of arifOS. A constitutional governance kernel designed to bridge subsurface expertise 
                      with AI governance needs — building "adult supervision" for agents in high-stakes environments.
                    </p>
                  </div>
                </div>
                <p className="font-body text-sm text-forge-dim italic border-l-2 border-forge-iron pl-6">
                  "I am the human judge behind arifOS. AI assists, drafts, reasons, and coordinates — but the human remains the final judge."
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl font-black italic">Canonical Explorations</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="brutalist-card p-6">
                  <h3 className="text-lg mb-2">Basin Signal Theory</h3>
                  <p className="text-xs text-forge-dim">Exploration of noise-to-signal ratios in Malay Basin seismic data and how it informed arifOS contrast theory.</p>
                </div>
                <div className="brutalist-card p-6">
                  <h3 className="text-lg mb-2">The 13th Floor Origin</h3>
                  <p className="text-xs text-forge-dim">Why the human veto is the ultimate invariant. The transition from autonomous to sovereign AI.</p>
                </div>
              </div>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="brutalist-card bg-forge-steel border-forge-dim">
              <div className="section-label !mb-2">Operational Links</div>
              <ul className="space-y-3">
                <li><a href="/" className="text-sm hover:underline">← Root Directory</a></li>
                <li><a href="/999/" className="text-sm text-forge-green hover:underline">/999 Proof Chamber →</a></li>
                <li><a href="/llms.txt" className="text-sm hover:underline">llms.txt (Agent Context)</a></li>
                <li><a href="/soul.json" className="text-sm hover:underline">soul.json (Identity)</a></li>
              </ul>
            </div>

            <div className="border-2 border-forge-iron p-6">
              <div className="font-technical text-[0.6rem] text-forge-dim uppercase mb-4">Memory Integrity</div>
              <div className="w-full bg-forge-iron h-1 mb-2">
                <div className="bg-forge-green h-full w-[88%] shadow-glow-green"></div>
              </div>
              <div className="flex justify-between font-technical text-[0.6rem] uppercase">
                <span>Sync Status</span>
                <span className="text-forge-green">88% Synchronized</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </motion.div>
  );
}
