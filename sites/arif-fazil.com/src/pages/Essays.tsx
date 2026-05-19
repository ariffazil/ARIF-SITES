import { motion } from 'framer-motion';

export function Essays() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen"
    >
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">Narrative · Ψ SOUL · Reflection</div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
            The<br />Essays
          </h1>
          <p className="font-body text-xl text-forge-dim max-w-2xl leading-relaxed">
            Long-form writing on geology, AI governance, and the discipline of
            signing your name to irreversible decisions.
          </p>

          {/* Medium CTA */}
          <a
            href="https://medium.com/@arifbfazil"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 mt-8 brutalist-card border border-forge-gold px-6 py-4 hover:bg-forge-gold/10 transition-colors group"
          >
            <span className="text-forge-gold text-2xl">✍️</span>
            <div>
              <div className="font-display font-bold text-base text-forge-white group-hover:text-forge-gold transition-colors">
                Read stories from ARIF FAZIL on Medium
              </div>
              <div className="font-mono text-xs text-forge-dim mt-0.5">
                medium.com/@arifbfazil
              </div>
            </div>
            <span className="ml-auto text-forge-dim group-hover:text-forge-gold transition-colors">↗</span>
          </a>
        </div>
      </section>

      <section className="py-24">
        <div className="site-frame">
          <div className="brutalist-card border-dashed p-12 text-center">
            <h2 className="text-2xl font-black uppercase mb-4 italic">Coming Soon.</h2>
            <p className="font-mono text-sm text-forge-dim">
              Essays are linked directly to Medium. Share your first essay URL and I'll wire it up properly.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
