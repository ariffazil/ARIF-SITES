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
        </div>
      </section>

      <section className="py-24">
        <div className="site-frame">
          <div className="brutalist-card border-dashed p-12 text-center">
            <h2 className="text-2xl font-black uppercase mb-4 italic">Drafts in Progress.</h2>
            <p className="font-mono text-sm text-forge-dim">Essays are being migrated from the legacy Medium archive.</p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
