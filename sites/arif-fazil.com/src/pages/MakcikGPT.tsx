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
      {/* Header — zen */}
      <section className="py-32">
        <div className="max-w-[640px] mx-auto px-6">
          <div className="font-mono text-[11px] uppercase tracking-widest text-forge-gold mb-6">
            Civilization Intelligence · 999 SEALED · v2.3
          </div>
          <h1 className="text-4xl font-light text-forge-white mb-4">MakcikGPT</h1>
          <p className="text-forge-dim text-base leading-relaxed mb-2">
            Investigative journalism for jiran-jiran.
          </p>
          <p className="text-forge-dim text-base leading-relaxed">
            When RM70 billion moves and nobody asks questions,
            MakcikGPT asks in Bahasa Makcik. Published directly. No Medium gate.
          </p>
          <p className="font-mono text-xs text-forge-dim mt-6">
            {makcikArticlesMeta.length} articles
          </p>
        </div>
      </section>

      {/* Articles — zen single spine */}
      <section className="pb-32">
        <div className="max-w-[640px] mx-auto px-6">
          {makcikArticlesMeta.map((article, i) => (
            <Link
              key={article.slug}
              to={`/makcikgpt/${article.slug}`}
              className={`grid grid-cols-[5rem_1fr_auto] gap-6 py-5 items-baseline hover:opacity-80 transition-opacity ${i === makcikArticlesMeta.length - 1 ? '' : 'border-b border-forge-iron/15'}`}
            >
              <time
                dateTime={article.date}
                className="font-mono text-[0.7rem] text-forge-dim tabular-nums"
              >
                {new Date(article.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
              <span>
                <span className="text-base leading-snug text-forge-white/90 block">{article.title}</span>
                <span className="text-xs text-forge-dim italic block mt-1">{article.subtitle}</span>
              </span>
              <span className="font-mono text-xs text-forge-orange shrink-0">Read →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Context — zen */}
      <section className="pb-32">
        <div className="max-w-[640px] mx-auto px-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-forge-dim mb-6">
            Constitutional Floor
          </p>
          <div className="space-y-3 text-forge-dim text-sm leading-relaxed">
            <p>
              Every MakcikGPT article is sealed under <strong className="text-forge-white">999_SEAL</strong>.
              Evidence chains trace to primary sources. No claims without receipts.
            </p>
            <p>
              <strong className="text-forge-white">F1 AMANAH</strong> — Reversible-first. All sources documented.<br />
              <strong className="text-forge-white">F2 TRUTH</strong> — Evidence-labeled OBS/DER/INT/SPEC.<br />
              <strong className="text-forge-white">F6 MARUAH</strong> — Names named only with public-record evidence.<br />
              <strong className="text-forge-white">F11 AUDIT</strong> — Full provenance chain.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default MakcikGPT;
