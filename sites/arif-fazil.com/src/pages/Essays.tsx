import { motion } from 'framer-motion';
import { essays } from '../data/essays';

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
          {/* Essay cards */}
          <div className="space-y-8">
            {essays.map((essay, i) => (
              <motion.article
                key={essay.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="brutalist-card border-forge-iron p-8 hover:border-forge-gold/50 transition-colors group"
              >
                <div className="flex flex-col md:flex-row md:items-start gap-6">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <time className="font-mono text-xs text-forge-dim">
                        {new Date(essay.date).toLocaleDateString('en-MY', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </time>
                      <div className="flex flex-wrap gap-2">
                        {essay.tags.map(tag => (
                          <span
                            key={tag}
                            className="font-mono text-xs px-2 py-0.5 bg-forge-surface border border-forge-iron text-forge-dim"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <h2 className="font-display font-black text-2xl md:text-3xl text-forge-white group-hover:text-forge-gold transition-colors mb-4 leading-tight">
                      {essay.title}
                    </h2>

                    <p className="font-body text-forge-dim leading-relaxed">
                      {essay.excerpt}
                    </p>
                  </div>

                  <a
                    href={`https://medium.com/@arifbfazil`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 self-center brutalist-card border border-forge-iron px-4 py-2 font-mono text-sm text-forge-dim hover:text-forge-gold hover:border-forge-gold transition-colors"
                  >
                    Read ↗
                  </a>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </motion.div>
  );
}
