import { Link } from 'react-router-dom';
import { DomainLanding } from '@/components/DomainLanding';
import { wellsPortfolio } from '@/data/siteContent';

export function Wells() {
  return (
    <DomainLanding
      routeId="wells"
      purpose="Public well portfolio — structural, basement and new-play tests under real uncertainty."
      sections={[
        {
          title: 'Oil work',
          description: 'Human oil landing that bridges wells to GEOX and WEALTH.',
          href: '/oil',
          cta: 'Explore Oil Work',
        },
        {
          title: 'Discoveries',
          description: 'Discovery records and public evidence.',
          href: '/discoveries',
          cta: 'Read Discoveries',
        },
        {
          title: 'GEOX',
          description: 'Earth organ for subsurface evidence.',
          href: 'https://geox.arif-fazil.com/',
          cta: 'Inspect GEOX Evidence',
          external: true,
        },
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {wellsPortfolio.map((w) => (
          <article key={w.name} className="brutalist-card">
            <h2 className="font-display font-black uppercase text-xl mb-1">{w.name}</h2>
            <p className="font-technical text-[0.65rem] text-forge-dim uppercase mb-3">
              {w.playType} · {w.basin}
            </p>
            <p className="text-sm text-forge-dim leading-relaxed mb-2">{w.summary}</p>
            <p className="text-sm text-forge-white leading-relaxed">{w.impact}</p>
          </article>
        ))}
      </div>
      <p className="text-sm text-forge-dim mb-4">
        Full discovery narrative:{' '}
        <Link to="/discoveries" className="text-forge-orange hover:underline">
          /discoveries
        </Link>
      </p>
    </DomainLanding>
  );
}
