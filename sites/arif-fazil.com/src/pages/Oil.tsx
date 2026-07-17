import { DomainLanding } from '@/components/DomainLanding';
import { wellsPortfolio } from '@/data/siteContent';

export function Oil() {
  const oilWells = wellsPortfolio.slice(0, 3);
  return (
    <DomainLanding
      routeId="oil"
      purpose="Read physical oil reality before capital commitment. This page unifies exploration work, GEOX evidence, and WEALTH oil consequence — it is not a full GEOX or WEALTH application."
      sections={[
        {
          title: 'GEOX Earth evidence',
          description: 'Subsurface physics, prospect reasoning and geological uncertainty for oil systems.',
          href: 'https://geox.arif-fazil.com/',
          cta: 'Inspect GEOX Evidence',
          external: true,
        },
        {
          title: 'WEALTH oil consequence',
          description: 'Capital and energy price consequence of oil systems. Computation only — not investment advice.',
          href: 'https://wealth.arif-fazil.com/',
          cta: 'Open WEALTH Organ',
          external: true,
        },
        {
          title: 'Wells portfolio',
          description: 'Public well records under real uncertainty.',
          href: '/wells',
          cta: 'See Wells Portfolio',
        },
        {
          title: 'MakcikGPT petroleum reporting',
          description: 'Civic journalism on national oil and gas questions.',
          href: '/makcikgpt',
          cta: 'Open MakcikGPT',
        },
      ]}
    >
      <div className="brutalist-card mb-8">
        <div className="section-label mb-4">Highlighted wells</div>
        <ul className="space-y-3">
          {oilWells.map((w) => (
            <li key={w.name} className="border-b border-forge-iron pb-3 last:border-0">
              <div className="font-display font-bold uppercase">{w.name}</div>
              <p className="text-sm text-forge-dim">{w.summary}</p>
            </li>
          ))}
        </ul>
      </div>
    </DomainLanding>
  );
}
