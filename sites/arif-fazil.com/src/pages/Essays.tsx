import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { curatedEssays } from '@/data/essays';
import { useWebMCP } from '@/hooks/useWebMCP';

const essaysTools = [
  {
    name: 'get_essays_list',
    description: 'Get curated list of 33 essays by Arif Fazil, organized by knowledge domain',
    execute() {
      const metadata = curatedEssays.map((e) => ({
        slug: e.slug,
        title: e.title,
        date: e.date,
        excerpt: e.excerpt,
        tags: e.tags,
        domain: e.domain,
      }));
      return {
        content: [{
          type: 'text',
          text: JSON.stringify(metadata, null, 2)
        }]
      };
    }
  }
];

export function Essays() {
  useWebMCP(essaysTools);
  useEffect(() => {
    document.title = 'Essays — Arif Fazil | arifOS';
  }, []);

  // Group by domain
  const grouped = curatedEssays.reduce<Record<string, typeof curatedEssays>>((acc, essay) => {
    const d = essay.domain || 'Other';
    if (!acc[d]) acc[d] = [];
    acc[d].push(essay);
    return acc;
  }, {});

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
            33 essays across 7 domains — geology, AI governance, constitutional physics,
            and the discipline of signing your name to irreversible decisions.
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
                Follow on Medium
              </div>
              <div className="font-mono text-xs text-forge-dim mt-0.5">
                medium.com/@arifbfazil · 50+ articles
              </div>
            </div>
            <span className="ml-auto text-forge-dim group-hover:text-forge-gold transition-colors">↗</span>
          </a>
        </div>
      </section>

      {/* Essay List — grouped by domain */}
      <section className="py-16">
        <div className="site-frame space-y-16">
          {Object.entries(grouped).map(([domain, domainEssays]) => (
            <div key={domain}>
              <div className="section-label mb-6">{domain}</div>
              <div className="grid gap-4">
                {domainEssays.map((essay) => (
                  <Link
                    key={essay.slug}
                    to={`/essays/${essay.slug}`}
                    className="brutalist-card border border-forge-iron hover:border-forge-gold/40 px-8 py-6 transition-all group block"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2 mb-3">
                      <h2 className="text-xl font-black uppercase tracking-tight text-forge-white group-hover:text-forge-gold transition-colors leading-tight">
                        {essay.title}
                      </h2>
                      <time
                        dateTime={essay.date}
                        className="font-mono text-xs text-forge-dim whitespace-nowrap"
                      >
                        {new Date(essay.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>

                    <p className="font-body text-forge-dim text-sm leading-relaxed line-clamp-2 mb-3">
                      {essay.excerpt}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      {essay.tags?.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="font-mono text-xs uppercase tracking-wider px-2 py-0.5 border border-forge-iron text-forge-dim"
                        >
                          {tag}
                        </span>
                      ))}
                      {essay.mediumUrl ? (
                        <span className="font-mono text-xs text-forge-dim ml-auto">Medium ↗</span>
                      ) : (
                        <span className="font-mono text-xs text-forge-gold ml-auto">Full text →</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export const ssgOptions = {
  slug: "essays",
  routeUrl: "/essays/",
};

export default Essays;
