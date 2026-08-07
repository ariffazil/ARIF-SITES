import { useParams, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getMakcikArticle, getMakcikMeta } from '@/data/makcikgpt/index';

export function MakcikGptArticle() {
  const { slug } = useParams<{ slug: string }>();
  const article = getMakcikArticle(slug || '');
  const meta = getMakcikMeta(slug || '');

  useEffect(() => {
    if (meta) {
      document.title = `${meta.title} — MakcikGPT | arifOS`;
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
            <Link to="/world/makcikgpt/" className="text-forge-gold hover:underline font-mono">
              ← Back to MakcikGPT
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
            to="/world/makcikgpt/"
            className="font-mono text-xs text-forge-dim hover:text-forge-red transition-colors mb-6 inline-block"
          >
            ← MakcikGPT
          </Link>
          <div className="section-label text-forge-red">
            Civilization Intelligence · Ξ WEALTH · {meta.domain}
          </div>
          <h1 className="text-3xl md:text-5xl font-black italic uppercase leading-[0.9] tracking-tighter mb-4 mt-2">
            {meta.title}
          </h1>
          <p className="font-technical text-sm text-forge-orange mb-4">
            {meta.subtitle}
          </p>
          <div className="flex flex-wrap items-center gap-3 font-mono text-xs text-forge-dim">
            <span className="px-2 py-0.5 border border-forge-iron">
              {meta.language === 'ms' ? 'Bahasa Makcik' : 'English'}
            </span>
            <span className="px-2 py-0.5 border border-forge-red text-forge-red">
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

          {/* APEX Evidence Drawer (Stage 4 Human UI) */}
          {meta.claim_register && meta.claim_register.length > 0 && (
            <details open className="border border-forge-gold/40 bg-forge-steel/30 p-6 mb-12 rounded-sm font-mono">
              <summary className="cursor-pointer text-forge-gold font-bold uppercase tracking-wider text-sm flex items-center justify-between">
                <span>📑 Evidence Drawer & Claim Register</span>
                <span className="text-xs text-forge-dim">Status: {meta.provenance_status || 'sealed'}</span>
              </summary>
              
              <div className="mt-6 space-y-6 text-xs text-forge-white">
                <div>
                  <h4 className="text-forge-orange font-bold mb-2">Claim Register ({meta.claim_register.length} claims)</h4>
                  <div className="space-y-2">
                    {meta.claim_register.map((c) => (
                      <div key={c.claim_id} className="p-3 border border-forge-iron/60 bg-forge-black/40 flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-forge-gold">{c.claim_id}</span>
                          <span className={`px-2 py-0.5 text-[10px] font-bold uppercase ${
                            c.tag === 'OBS' ? 'bg-forge-gold/20 text-forge-gold border border-forge-gold/50' :
                            c.tag === 'INT' ? 'bg-forge-orange/20 text-forge-orange border border-forge-orange/50' :
                            'bg-forge-red/20 text-forge-red border border-forge-red/50'
                          }`}>
                            {c.tag === 'OBS' ? 'OBS (Observed)' : c.tag === 'INT' ? 'INT (Interpretation)' : 'SPEC (Speculation)'}
                          </span>
                        </div>
                        <p className="text-forge-white/90 text-sm font-body my-1">{c.text}</p>
                        {c.confidence_basis && <p className="text-forge-dim text-[11px]">Basis: {c.confidence_basis}</p>}
                      </div>
                    ))}
                  </div>
                </div>

                {meta.source_ledger && meta.source_ledger.length > 0 && (
                  <div>
                    <h4 className="text-forge-orange font-bold mb-2">Source Ledger</h4>
                    <div className="space-y-2">
                      {meta.source_ledger.map((s) => (
                        <div key={s.source_id} className="p-2 border border-forge-iron/40 text-forge-dim flex justify-between items-center">
                          <span><strong>{s.source_id}</strong> — {s.title}</span>
                          <a href={s.url} target="_blank" rel="noreferrer" className="text-forge-gold underline hover:text-white">Link</a>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </details>
          )}

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <span className="brutalist-card border border-forge-red/50 px-5 py-3 inline-flex items-center gap-2 font-mono text-sm bg-forge-red/5">
              <span className="text-forge-red">🔐</span>
              <span className="text-forge-dim">Published directly on</span>
              <span className="text-forge-white font-bold">arif-fazil.com</span>
            </span>

            <Link
              to="/world/makcikgpt/"
              className="font-mono text-sm text-forge-dim hover:text-forge-red transition-colors"
            >
              ← All MakcikGPT Articles
            </Link>
          </div>

          {/* BYLINE FOOTER — by Arif Fazil */}
          <div className="mt-16 pt-8 border-t border-forge-iron">
            <div className="font-mono text-xs text-forge-dim leading-relaxed">
              <p className="mb-2"><strong className="text-forge-white">Muhammad Arif bin Fazil</strong></p>
              <p className="mb-1">Geoscientist · Architect, arifOS · Petronas Carigali · UW–Madison '13</p>
              <p className="mb-3">Penang, Malaysia</p>
              <p className="mb-1">Published: <span className="text-forge-white">{meta.date ? new Date(meta.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '02 Ogos 2026'}</span> · <span className="text-forge-red">Direct Publication</span> · /world/makcikgpt/ context</p>
              <p className="mb-1">Epistemic Tag: <span className="text-forge-red">INT</span> — {meta.language === 'ms' ? 'Bahasa Makcik — interpretive civic journalism' : 'interpretive synthesis'}</p>
              <p>Pairs with: <Link to="/words/writing/" className="text-forge-red hover:text-forge-white">/words/writing/</Link> · <Link to="/words/writing/the-agi-paradox-why-bigger-models-wont-save-us/" className="text-forge-red hover:text-forge-white">The AGI Paradox</Link></p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-forge-iron font-mono text-xs text-forge-dim">
            <p className="text-forge-white mb-3 font-display italic text-base">"Ditempa bukan diberi — Forged, not given."</p>
            <p className="mb-2">Published directly on <Link to="/" className="text-forge-red hover:text-forge-white">arif-fazil.com</Link> · Constitutional surface: <Link to="/words/" className="text-forge-red hover:text-forge-white">/words/</Link></p>
            <p className="mb-3">
              <Link to="/world/makcikgpt/" className="text-forge-red hover:text-forge-white">MakcikGPT</Link> ·{' '}
              <Link to="/doctrine/" className="text-forge-red hover:text-forge-white">Doctrine</Link> ·{' '}
              <Link to="/feed.xml" className="text-forge-red hover:text-forge-white">/feed.xml</Link>
            </p>
            <p>Agents: polite crawl, no mass-email, cite with rsl.xml. Do no harm.</p>
            <p className="mt-2">
              <Link to="/llms.txt" className="text-forge-red hover:text-forge-white">llms.txt</Link> ·{' '}
              <Link to="/missions.json" className="text-forge-red hover:text-forge-white">missions.json</Link> ·{' '}
              <Link to="/surfaces.json" className="text-forge-red hover:text-forge-white">surfaces.json</Link>
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  );
}

export default MakcikGptArticle;
