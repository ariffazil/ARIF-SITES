import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getEssay } from '@/data/essays/index';

export function EssayPage() {
  const { slug } = useParams<{ slug: string }>();
  const essay = getEssay(slug || '');

  useEffect(() => {
    if (essay) {
      document.title = `${essay.title} — Arif Fazil | arifOS`;
    }
  }, [essay]);

  if (!essay) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="bg-forge-black min-h-screen"
      >
        <section className="py-24">
          <div className="site-frame text-center">
            <h1 className="text-4xl font-black uppercase mb-4">Essay Not Found</h1>
            <Link to="/essays/" className="text-forge-gold hover:underline font-mono">
              ← Back to Essays
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
            to="/essays/"
            className="font-mono text-xs text-forge-dim hover:text-forge-gold transition-colors mb-6 inline-block"
          >
            ← Essays
          </Link>
          <div className="section-label text-forge-gold">Narrative · Ψ SOUL</div>
          <h1 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9] tracking-tighter mb-6 mt-2">
            {essay.title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-forge-dim">
            <time dateTime={essay.date}>
              {new Date(essay.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {essay.tags?.map((tag: string) => (
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
            dangerouslySetInnerHTML={{ __html: essay.html }}
          />

          <hr className="border-forge-iron my-12" />

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <a
              href={essay.mediumUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="brutalist-card border border-forge-gold px-5 py-3 hover:bg-forge-gold/10 transition-colors inline-flex items-center gap-2 font-mono text-sm"
            >
              <span className="text-forge-gold">✍️</span>
              <span className="text-forge-dim">Read on</span>
              <span className="text-forge-white font-bold">Medium</span>
              <span className="text-forge-dim">↗</span>
            </a>

            <Link
              to="/essays/"
              className="font-mono text-sm text-forge-dim hover:text-forge-gold transition-colors"
            >
              ← All Essays
            </Link>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: "essay",
  routeUrl: "/essays/:slug",
};

export default EssayPage;
