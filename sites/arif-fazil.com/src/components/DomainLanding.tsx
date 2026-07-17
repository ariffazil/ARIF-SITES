import { Link } from 'react-router-dom';
import { Breadcrumb } from '@/components/Breadcrumb';
import { RelatedRoutes } from '@/components/RelatedRoutes';
import { getRouteById, type FederationRoute } from '@/data/federationRoutes';

type LinkCard = {
  title: string;
  description: string;
  href: string;
  cta: string;
  external?: boolean;
};

type Props = {
  routeId: string;
  purpose: string;
  sections: LinkCard[];
  children?: import("react").ReactNode;
};

export function DomainLanding({ routeId, purpose, sections, children }: Props) {
  const route = getRouteById(routeId) as FederationRoute;
  const path = route?.path || '/';

  return (
    <div className="site-frame py-12 md:py-16">
      <Breadcrumb pathname={path} />
      <p className="section-label mb-3">{route?.domain} · {route?.organ}</p>
      <h1 className="font-display font-black text-4xl md:text-5xl uppercase italic tracking-tight mb-4">
        {route?.title || routeId}
      </h1>
      <p className="font-body text-xl text-forge-dim max-w-2xl leading-relaxed mb-10">{purpose}</p>

      {children}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {sections.map((s) =>
          s.external ? (
            <a
              key={s.href + s.title}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="brutalist-card group block"
            >
              <h2 className="text-lg font-black uppercase mb-2 group-hover:text-forge-orange transition-colors">
                {s.title}
              </h2>
              <p className="text-sm text-forge-dim leading-relaxed mb-4">{s.description}</p>
              <span className="font-technical text-xs text-forge-orange uppercase tracking-widest">
                {s.cta} ↗
              </span>
            </a>
          ) : (
            <Link key={s.href + s.title} to={s.href} className="brutalist-card group block">
              <h2 className="text-lg font-black uppercase mb-2 group-hover:text-forge-orange transition-colors">
                {s.title}
              </h2>
              <p className="text-sm text-forge-dim leading-relaxed mb-4">{s.description}</p>
              <span className="font-technical text-xs text-forge-orange uppercase tracking-widest">
                {s.cta} →
              </span>
            </Link>
          ),
        )}
      </div>

      <div className="mt-10 flex flex-wrap gap-4">
        <Link to="/" className="button-forge text-xs py-2">
          Return to Sovereign Root
        </Link>
        {route?.evidenceUrl && (
          <a href={route.evidenceUrl} className="button-forge button-forge--accent text-xs py-2" target="_blank" rel="noreferrer">
            Inspect Organ Evidence
          </a>
        )}
      </div>

      <RelatedRoutes routeId={routeId} />
    </div>
  );
}
