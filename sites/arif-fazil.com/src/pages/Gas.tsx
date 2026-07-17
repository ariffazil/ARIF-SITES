import { DomainLanding } from '@/components/DomainLanding';

export function Gas() {
  return (
    <DomainLanding
      routeId="gas"
      purpose="Gas exploration and petroleum-system context, with GEOX evidence and WEALTH energy consequence. Alias /gass resolves here."
      sections={[
        {
          title: 'GEOX Earth evidence',
          description: 'Geological and basin framing for gas systems and infrastructure corridors.',
          href: 'https://geox.arif-fazil.com/',
          cta: 'Inspect GEOX Evidence',
          external: true,
        },
        {
          title: 'WEALTH gas & energy',
          description: 'Capital consequence of gas and LNG systems. Computation — not allocation authority.',
          href: 'https://wealth.arif-fazil.com/',
          cta: 'Open WEALTH Organ',
          external: true,
        },
        {
          title: 'Discoveries',
          description: 'Public discovery records that touch petroleum systems.',
          href: '/discoveries',
          cta: 'Read Discoveries',
        },
        {
          title: 'MakcikGPT gas reporting',
          description: 'Civic coverage of national gas aggregation, JV and sovereignty questions.',
          href: '/makcikgpt',
          cta: 'Open MakcikGPT',
        },
      ]}
    >
      <div className="brutalist-card mb-8 text-sm text-forge-dim leading-relaxed">
        Live commodity dashboard surfaces (when deployed) sit under the WEALTH/energy ops plane.
        This human page is the discovery entry — not a price terminal.
      </div>
    </DomainLanding>
  );
}
