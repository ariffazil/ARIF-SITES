import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { makcikArticlesMeta } from '@/data/makcikgpt/index';

export function MakcikGPT() {
  useEffect(() => {
    document.title = 'MakcikGPT — Civilization Intelligence | arifOS';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen"
    >
      {/* Hero */}
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">Civilization Intelligence · Ξ WEALTH · MakcikGPT</div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
            Makcik<br />GPT
          </h1>
          <p className="font-body text-xl text-forge-dim max-w-2xl leading-relaxed">
            Investigative journalism for jiran-jiran. When RM70 billion moves
            and nobody asks questions, MakcikGPT asks in Bahasa Makcik.
            Published directly. No Medium gate.
          </p>
          <div className="mt-8 flex gap-4">
            <span className="badge-status badge-status--live">999 SEALED</span>
            <span className="badge-status badge-status--live">16 ARTICLES</span>
            <span className="badge-status badge-status--live">v2.3</span>
          </div>
        </div>
      </section>

      {/* Articles */}
      <section className="py-16">
        <div className="site-frame space-y-8">
          {makcikArticlesMeta.map((article) => (
            <Link
              key={article.slug}
              to={`/world/makcikgpt/${article.slug}`}
              className="brutalist-card border border-forge-iron px-8 py-8 block hover:border-forge-gold transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-4">
                <div>
                  <div className="font-technical text-[0.6rem] text-forge-gold uppercase tracking-widest mb-2">
                    {article.domain} · {article.language === 'ms' ? 'Bahasa Makcik' : 'English'} · Sealed {article.seal}
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-forge-white leading-tight">
                    {article.title}
                  </h2>
                </div>
                <time
                  dateTime={article.date}
                  className="font-mono text-xs text-forge-dim whitespace-nowrap"
                >
                  {new Date(article.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </time>
              </div>

              <p className="font-technical text-sm text-forge-orange mb-3">
                {article.subtitle}
              </p>

              <p className="font-body text-forge-dim text-sm leading-relaxed mb-6">
                {article.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-2">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="font-mono text-xs uppercase tracking-wider px-2 py-0.5 border border-forge-iron text-forge-dim"
                  >
                    {tag}
                  </span>
                ))}
                <span className="font-mono text-xs text-forge-gold ml-auto">
                  Read article →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Context */}
      <section className="py-16 border-t-2 border-forge-iron">
        <div className="site-frame max-w-2xl">
          <div className="section-label mb-6">Constitutional Floor</div>
          <div className="space-y-4 text-forge-dim text-sm leading-relaxed">
            <p>
              Every MakcikGPT article is sealed under <strong className="text-forge-white">999_SEAL</strong>.
              Evidence chains trace to primary sources. No claims without receipts.
            </p>
            <p>
              <strong className="text-forge-white">F1 AMANAH:</strong> Reversible-first. All sources documented.
              <br />
              <strong className="text-forge-white">F2 TRUTH:</strong> Evidence-labeled OBS/DER/INT/SPEC.
              <br />
              <strong className="text-forge-white">F6 MARUAH:</strong> Names named only with public-record evidence.
              <br />
              <strong className="text-forge-white">F11 AUDIT:</strong> Full provenance chain in SEARAH-TRUTH-DB.md.
            </p>
          </div>

          <div className="mt-12 flex gap-4">
            <Link to="/economics" className="button-forge text-xs py-2">
              ← Back to WEALTH
            </Link>
            <a
              href="https://medium.com/@arifbfazil"
              target="_blank"
              rel="noreferrer"
              className="button-forge button-forge--accent text-xs py-2"
            >
              Medium ↗
            </a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default MakcikGPT;
