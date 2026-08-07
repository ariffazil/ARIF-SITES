import { useParams, Link } from 'react-router-dom';
import { useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { getEssay, allEssays } from '@/data/essays/index';

/**
 * EssayPage — Sovereign Reading Surface
 *
 * Three-zone layout: HERO (where attention is highest) → BODY (essay) → FORGED
 * footer (author identity, epistemic tag, publication date, pairing).
 *
 * The HERO + FORGED footer is the FIRST and LAST thing a human reader (and
 * an LLM extraction pass) sees. Treat both surfaces as canonical metadata.
 *
 * Design language mirrors the MakcikGPT article pattern:
 *   - Dark forge-black (#0a0c10) base
 *   - Gold-bordered hero ("FORGED" bronze accent)
 *   - Section labels in orange ("NARRATIVE", "EVIDENCE")
 *   - Tag pills with forge-iron borders
 *   - Body prose with paper typography
 *   - "Read next" footer navigation
 */

// Companion-pair rules for /words/ essays. Edit when pairs change.
const PAIRINGS: Record<string, string[]> = {
  'the-agi-paradox-why-bigger-models-wont-save-us': [
    'truth-is-not-cheap-why-the-path-to-agi-will-consume-more-tokens',
    'the-third-axis-of-failure-what-acemoglu-missed',
  ],
  'truth-is-not-cheap-why-the-path-to-agi-will-consume-more-tokens': [
    'the-agi-paradox-why-bigger-models-wont-save-us',
    'the-third-axis-of-failure-what-acemoglu-missed',
  ],
  'the-third-axis-of-failure-what-acemoglu-missed': [
    'the-agi-paradox-why-bigger-models-wont-save-us',
    'truth-is-not-cheap-why-the-path-to-agi-will-consume-more-tokens',
  ],
};

// Per-essay epistemic-tag micro-narrative. Falls back to a generic INT blurb.
const EPISTEMIC_BLURB: Record<string, string> = {
  'the-agi-paradox-why-bigger-models-wont-save-us':
    'Epistemic Tag: INT — interpretive synthesis across AI economics, institutional theory, and verification science',
  'truth-is-not-cheap-why-the-path-to-agi-will-consume-more-tokens':
    'Epistemic Tag: INT — interpretive synthesis across token economics, verification theory, and the paradox of cheap intelligence',
  'the-third-axis-of-failure-what-acemoglu-missed':
    'Epistemic Tag: INT — interpretive synthesis across institutional economics, organizational failure theory, and AI governance',
  'petronas-23-years-in-brazil':
    'Epistemic Tag: OBS+DER — factual record with derivations of NPV and transfer-pricing tail',
  'the-tool-is-the-thought':
    'Epistemic Tag: CLAIM — interpretive essay on tool-building, MCP, and the collapse of coding chains',
  'agentic-intelligence-big-bang':
    'Epistemic Tag: CLAIM — first-essay in agentic-intelligence naming, INIT, and creation-as-collapse',
  'growing-intelligence-without-losing-our-soul-from-binatang-to-warga':
    'Epistemic Tag: INT — inclusive-institutions reading of agent sovereignty',
};

const DEFAULT_EPISTEMIC = 'Epistemic Tag: INT — interpretive synthesis across AI governance, constitutional AI, and AGI risk';

export function EssayPage() {
  const { slug } = useParams<{ slug: string }>();
  const essay = getEssay(slug || '');

  // Companion essays (slug-aware).
  const companionSlugs: string[] =
    essay ? (PAIRINGS[essay.slug] || []) : [];

  // Compute adjacent essays for read-next navigation (chronological, newest-first).
  const adjacent = useMemo(() => {
    if (!essay) return { newer: null, older: null };
    const sorted = allEssays
      .slice()
      .sort((a, b) => {
        if (a.date < b.date) return 1;
        if (a.date > b.date) return -1;
        return a.slug.localeCompare(b.slug);
      });
    const i = sorted.findIndex((e) => e.slug === essay.slug);
    return {
      newer: i > 0 ? sorted[i - 1] : null,
      older: i >= 0 && i < sorted.length - 1 ? sorted[i + 1] : null,
    };
  }, [essay]);

  // Section count — extracts h2 headings to drive the read-next badges.
  const sectionCount = useMemo(() => {
    const html = essay?.html;
    if (!html) return 0;
    return (html.match(/<h2[^>]*>/g) || []).length;
  }, [essay?.html]);

  // Word count for reading-time badge.
  const wordCount = useMemo(() => {
    const html = essay?.html;
    if (!html) return 0;
    const plain = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    return plain.split(/\s+/).length;
  }, [essay?.html]);

  const minutesRead = Math.max(1, Math.round(wordCount / 220));

  // Epistemic blurb lookup.
  const epistemicBlurb =
    (essay && EPISTEMIC_BLURB[essay.slug]) || DEFAULT_EPISTEMIC;

  useEffect(() => {
    if (essay) {
      document.title = `${essay.title} — Arif Fazil | arifOS`;
      const ld = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: essay.title,
        datePublished: essay.date,
        author: {
          '@type': 'Person',
          name: 'Muhammad Arif bin Fazil',
          alternateName: 'ARIF FAZIL',
          affiliation: {
            '@type': 'Organization',
            name: 'arifOS',
          },
          homeLocation: 'Penang, Malaysia',
          alumniOf: 'University of Wisconsin-Madison',
        },
        publisher: {
          '@type': 'Person',
          name: 'Muhammad Arif bin Fazil',
        },
        url: `https://arif-fazil.com/words/writing/${essay.slug}/`,
        inLanguage: 'en',
        keywords: (essay.tags || []).join(', '),
        isAccessibleForFree: true,
        isPartOf: { '@type': 'WebSite', name: 'arif-fazil.com', url: 'https://arif-fazil.com/' },
      };
      const existing = document.getElementById('essay-jsonld');
      if (existing) existing.remove();
      const s = document.createElement('script');
      s.id = 'essay-jsonld';
      s.type = 'application/ld+json';
      s.textContent = JSON.stringify(ld);
      document.head.appendChild(s);
    }
  }, [essay]);

  if (!essay) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
        <section className="py-24">
          <div className="site-frame text-center">
            <div className="section-label text-forge-orange mb-3">404 · VOID</div>
            <h1 className="text-4xl md:text-5xl font-black italic uppercase leading-[0.9] tracking-tighter mb-6">
              Essay Not Found
            </h1>
            <p className="text-forge-dim mb-8 max-w-md mx-auto">
              No essay matches slug <code className="px-2 py-0.5 bg-forge-steel border border-forge-iron font-mono text-forge-orange">{slug}</code>. The vault has nothing here.
            </p>
            <div className="flex justify-center gap-4">
              <Link to="/words/writing/" className="brutalist-card border border-forge-gold px-5 py-3 hover:bg-forge-gold/10 transition-colors inline-flex items-center gap-2 font-mono text-sm">
                <span className="text-forge-gold">📜</span>
                <span className="text-forge-dim">All essays</span>
                <span className="text-forge-white font-bold">/words/writing/</span>
              </Link>
              <Link to="/" className="brutalist-card border border-forge-iron px-5 py-3 hover:bg-forge-iron/30 transition-colors inline-flex items-center gap-2 font-mono text-sm">
                <span className="text-forge-orange">←</span>
                <span className="text-forge-dim">Return home</span>
              </Link>
            </div>
          </div>
        </section>
      </motion.div>
    );
  }

  // Look up companion titles for the FOAFER "Pairs with" line.
  const companionTitles = companionSlugs
    .map((s) => allEssays.find((e) => e.slug === s))
    .filter((e): e is NonNullable<typeof e> => !!e);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">

      {/* ═══ HERO — highest human attention + LLM extraction pass ═══ */}
      <section className="py-14 md:py-20 border-b border-forge-iron bg-forge-steel">
        <div className="site-frame max-w-4xl relative">
          <div className="flex items-center gap-4 mb-6">
            <Link to="/words/writing/" className="font-mono text-xs text-forge-dim hover:text-forge-gold transition-colors inline-flex items-center gap-1">
              <span>←</span> WRITING
            </Link>
            <span className="text-forge-iron">/</span>
            <span className="font-mono text-xs text-forge-orange uppercase tracking-widest">Direct Publication · Seal 999</span>
          </div>

          <div className="section-label text-forge-gold mb-3">Narrative · Ψ SOUL · Words · Constitutional Surface</div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black italic uppercase leading-[0.92] tracking-tighter mb-6 text-forge-white">
            {essay.title}
          </h1>

          {essay.excerpt && (
            <p className="text-forge-dim text-base md:text-lg leading-relaxed mb-6 max-w-3xl border-l-2 border-forge-gold pl-4">
              {essay.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
            <time
              dateTime={essay.date}
              className="px-2 py-0.5 border border-forge-iron text-forge-dim"
            >
              {new Date(essay.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className="px-2 py-0.5 border border-forge-gold/40 text-forge-gold bg-forge-gold/5">
              999 METERAI
            </span>
            <span className="px-2 py-0.5 border border-forge-iron text-forge-dim">
              INT
            </span>
            <span className="px-2 py-0.5 border border-forge-iron text-forge-dim">
              ~{minutesRead} MIN READ
            </span>
            {sectionCount > 0 && (
              <span className="px-2 py-0.5 border border-forge-iron text-forge-dim">
                {sectionCount} SECTION{sectionCount === 1 ? '' : 'S'}
              </span>
            )}
            {(essay.tags || []).slice(0, 8).map((tag: string) => (
              <span
                key={tag}
                className="px-2 py-0.5 border border-forge-iron text-forge-dim hover:text-forge-white transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ARTICLE BODY — first H1 inside essay.html is hidden so the hero owns the title. */}
      <section className="py-12 md:py-16">
        <div className="site-frame max-w-3xl">
          <article
            className="essay-content prose-invert font-body text-lg leading-relaxed text-forge-white/90 space-y-6
                       [&_h1]:hidden
                       [&_h2]:font-black [&_h2]:italic [&_h2]:uppercase [&_h2]:tracking-tighter
                       [&_h2]:text-2xl [&_h2]:md:text-3xl [&_h2]:mt-16 [&_h2]:mb-6
                       [&_h2]:text-forge-white [&_h2]:border-b [&_h2]:border-forge-iron [&_h2]:pb-3
                       [&_h3]:font-bold [&_h3]:uppercase [&_h3]:text-sm [&_h3]:tracking-widest
                       [&_h3]:text-forge-orange [&_h3]:mt-10 [&_h3]:mb-3
                       [&_blockquote]:border-l-4 [&_blockquote]:border-forge-gold [&_blockquote]:bg-forge-steel
                       [&_blockquote]:py-4 [&_blockquote]:px-6 [&_blockquote]:my-8
                       [&_blockquote]:text-forge-dim [&_blockquote]:italic
                       [&_p_strong]:text-forge-white [&_p_strong]:font-bold
                       [&_code]:px-2 [&_code]:py-0.5 [&_code]:bg-forge-steel [&_code]:text-forge-orange
                       [&_code]:font-mono [&_code]:text-[0.92em]
                       [&_a]:text-forge-gold [&_a]:underline [&_a]:underline-offset-2 [&_a]:decoration-forge-gold/40
                       [&_a:hover]:decoration-forge-gold
                       [&_hr]:border-forge-iron [&_hr]:my-12
                       [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6
                       [&_li]:my-2"
            dangerouslySetInnerHTML={{ __html: essay.html }}
          />
        </div>
      </section>

      {/* ═══ FORGED FOOTER — author identity + epistemic anchor + pairing ═══ */}
      <footer className="mt-8 pt-12 pb-16 border-t-2 border-forge-gold bg-forge-steel/40">
        <div className="site-frame max-w-3xl">
          {/* ARIF FAZIL brand line */}
          <div className="mb-10 pb-8 border-b border-forge-iron">
            <div className="font-mono text-[0.65rem] text-forge-gold uppercase tracking-widest mb-2">Forged by</div>
            <div className="font-display text-3xl md:text-4xl font-black italic uppercase tracking-tighter text-forge-white leading-none">
              ARIF FAZIL
            </div>
            <div className="font-mono text-sm text-forge-gold mt-1">Muhammad Arif bin Fazil</div>
          </div>

          {/* Author identity block */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div>
              <div className="section-label text-forge-orange mb-2">Identity</div>
              <p className="font-mono text-sm text-forge-dim leading-relaxed">
                <strong className="text-forge-white">Muhammad Arif bin Fazil</strong><br />
                <span className="text-forge-white/80">Geoscientist · Architect, arifOS</span><br />
                <span className="text-forge-dim">Petronas Carigali</span><br />
                <span className="text-forge-dim">UW–Madison '13</span><br />
                <span className="text-forge-white/80">Penang, Malaysia</span>
              </p>
            </div>
            <div>
              <div className="section-label text-forge-orange mb-2">Publication</div>
              <p className="font-mono text-sm text-forge-dim leading-relaxed">
                Published: {new Date(essay.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                <br />
                Direct Publication
                <br />
                <a href="/words/" className="text-forge-gold hover:underline">/words/</a> context
                <br />
                <span className="text-forge-white/80">Sealed 999 · Ditempa Bukan Diberi</span>
              </p>
            </div>
            <div>
              <div className="section-label text-forge-orange mb-2">Epistemic Stance</div>
              <p className="font-mono text-sm text-forge-dim leading-relaxed">
                {epistemicBlurb}
              </p>
            </div>
          </div>

          {/* Pairing */}
          {companionTitles.length > 0 && (
            <div className="mb-10">
              <div className="section-label text-forge-orange mb-2">Pairs With</div>
              <div className="flex flex-col gap-2">
                {companionTitles.map((c) => (
                  <Link
                    key={c.slug}
                    to={`/words/writing/${c.slug}`}
                    className="brutalist-card border border-forge-iron bg-forge-black p-4 hover:border-forge-gold transition-colors group block"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-display text-base font-bold text-forge-white group-hover:text-forge-gold transition-colors leading-tight">
                          {c.title}
                        </div>
                        <div className="font-mono text-[0.65rem] text-forge-dim mt-0.5">
                          {new Date(c.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          {' · '}Sealed 999
                        </div>
                      </div>
                      <span className="font-mono text-xs text-forge-gold group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Action row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            {essay.mediumUrl ? (
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
            ) : (
              <span className="brutalist-card border border-forge-gold/50 px-5 py-3 inline-flex items-center gap-2 font-mono text-sm bg-forge-gold/5">
                <span className="text-forge-gold">⚒️</span>
                <span className="text-forge-dim">Published directly on</span>
                <span className="text-forge-white font-bold">arif-fazil.com</span>
              </span>
            )}
            <Link
              to="/words/writing/"
              className="font-mono text-sm text-forge-dim hover:text-forge-gold transition-colors"
            >
              ← All Essays · /words/writing/
            </Link>
          </div>

          {/* Continue Reading — navigate between essays */}
          {(adjacent.newer || adjacent.older) && (
            <div className="mt-10 pt-8 border-t border-forge-iron">
              <div className="section-label text-forge-orange mb-3">Continue Reading · 999 Meterai</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {adjacent.newer && (
                  <Link
                    to={`/words/writing/${adjacent.newer.slug}`}
                    className="brutalist-card border border-forge-iron hover:border-forge-gold transition-colors p-4 group block"
                  >
                    <div className="font-mono text-xs text-forge-dim uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="text-forge-orange group-hover:text-forge-gold">↗</span>
                      <span>Newer · {adjacent.newer.date}</span>
                    </div>
                    <h3 className="font-black italic uppercase tracking-tight text-base text-forge-white group-hover:text-forge-gold transition-colors leading-tight">
                      {adjacent.newer.title}
                    </h3>
                  </Link>
                )}
                {adjacent.older && (
                  <Link
                    to={`/words/writing/${adjacent.older.slug}`}
                    className="brutalist-card border border-forge-iron hover:border-forge-gold transition-colors p-4 group block"
                  >
                    <div className="font-mono text-xs text-forge-dim uppercase tracking-widest mb-2 flex items-center gap-2">
                      <span className="text-forge-orange group-hover:text-forge-gold">↙</span>
                      <span>Older · {adjacent.older.date}</span>
                    </div>
                    <h3 className="font-black italic uppercase tracking-tight text-base text-forge-white group-hover:text-forge-gold transition-colors leading-tight">
                      {adjacent.older.title}
                    </h3>
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* Manifesto line */}
          <div className="mt-12 pt-6 border-t border-forge-iron/40 text-center">
            <div className="font-display text-lg font-black italic uppercase tracking-tighter text-forge-gold">
              Ditempa Bukan Diberi
            </div>
            <div className="font-mono text-[0.65rem] text-forge-dim uppercase tracking-widest mt-1">
              Forged, not given · ARIF FAZIL · arif-fazil.com · 2026
            </div>
          </div>
        </div>
      </footer>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: 'essay',
  routeUrl: '/essays/:slug',
};

export default EssayPage;
