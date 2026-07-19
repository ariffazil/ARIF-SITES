import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getWealthArticle, getWealthMeta } from '@/data/wealth/index';

export function WealthArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = getWealthArticle(slug || '');
  const meta = getWealthMeta(slug || '');

  useEffect(() => {
    if (meta) {
      document.title = `${meta.title} — WEALTH | arifOS`;
    }
  }, [meta]);

  if (!article || !meta) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-forge-black min-h-screen"
      >
        <section className="py-24">
          <div className="site-frame text-center">
            <h1 className="text-4xl font-black uppercase mb-4">Article Not Found</h1>
            <Link to="/wealth/" className="text-forge-gold hover:underline font-mono">
              ← Back to WEALTH
            </Link>
          </div>
        </section>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-forge-black min-h-screen"
    >
      {/* Header */}
      <section className="py-16 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <Link
            to="/wealth/"
            className="font-mono text-xs text-forge-dim hover:text-forge-gold transition-colors mb-6 inline-block"
          >
            ← WEALTH
          </Link>
          <div className="flex justify-between items-start flex-wrap gap-4 mt-2">
            <div className="section-label text-forge-gold">
              Capital Intelligence · Ξ WEALTH · {meta.domain}
            </div>
            <a 
              href="https://wealth.arif-fazil.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-forge-orange/10 border border-forge-orange/30 text-forge-orange hover:bg-forge-orange/20 font-mono text-[0.65rem] uppercase tracking-wider transition-all"
            >
              Open the live WEALTH cockpit → wealth.arif-fazil.com
            </a>
          </div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-[0.9] tracking-tighter mb-4 mt-2">
            {meta.title}
          </h1>
          <p className="font-technical text-sm text-forge-orange mb-4">
            {meta.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-forge-dim">
            <span className="px-2 py-0.5 border border-forge-iron">
              English
            </span>
            <span className="px-2 py-0.5 border border-forge-gold text-forge-gold">
              Sealed {meta.seal}
            </span>
            <time dateTime={meta.date}>
              {new Date(meta.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {meta.tags?.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 border border-forge-iron text-forge-dim"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Article body */}
      <section className="py-16">
        <div className="site-frame max-w-3xl">
          <article
            className="essay-content prose-invert font-body text-lg leading-relaxed text-forge-white/90 space-y-6"
            dangerouslySetInnerHTML={{ __html: article.html }}
          />

          <hr className="border-forge-iron my-12" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="brutalist-card border border-forge-gold/50 px-5 py-3 inline-flex items-center gap-2 font-mono text-sm bg-forge-gold/5">
              <span className="text-forge-gold">🔐</span>
              <span className="text-forge-dim">999 Sealed · Published directly on</span>
              <span className="text-forge-white font-bold">arif-fazil.com</span>
            </span>

            <Link
              to="/wealth/"
              className="font-mono text-sm text-forge-dim hover:text-forge-gold transition-colors"
            >
              ← WEALTH
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default WealthArticle;
