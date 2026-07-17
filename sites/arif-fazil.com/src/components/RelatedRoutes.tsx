import { Link } from 'react-router-dom';
import { getRelated, type FederationRoute } from '@/data/federationRoutes';

export function RelatedRoutes({ routeId }: { routeId: string }) {
  const related = getRelated(routeId, 4);
  if (!related.length) return null;
  return (
    <section className="mt-12 pt-8 border-t-2 border-forge-iron" aria-labelledby="related-heading">
      <h2 id="related-heading" className="section-label mb-6">Related destinations</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {related.map((r: FederationRoute) => (
          <li key={r.id}>
            {r.external ? (
              <a
                href={r.path}
                className="brutalist-card block hover:border-forge-orange transition-colors"
                target="_blank"
                rel="noreferrer"
              >
                <div className="font-technical text-[0.65rem] text-forge-dim uppercase mb-1">{r.domain}</div>
                <div className="font-display font-bold uppercase">{r.shortTitle}</div>
                <p className="text-sm text-forge-dim mt-2">{r.description}</p>
                <span className="font-technical text-xs text-forge-orange mt-3 inline-block">
                  {r.ctaLabel || `Open ${r.shortTitle}`} ↗
                </span>
              </a>
            ) : (
              <Link to={r.path} className="brutalist-card block hover:border-forge-orange transition-colors">
                <div className="font-technical text-[0.65rem] text-forge-dim uppercase mb-1">{r.domain}</div>
                <div className="font-display font-bold uppercase">{r.shortTitle}</div>
                <p className="text-sm text-forge-dim mt-2">{r.description}</p>
                <span className="font-technical text-xs text-forge-orange mt-3 inline-block">
                  {r.ctaLabel || `Open ${r.shortTitle}`} →
                </span>
              </Link>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
