import { DomainLanding } from '@/components/DomainLanding';

export function ArifosOverview() {
  return (
    <DomainLanding
      routeId="arifos-overview"
      purpose="GEOX observes. WEALTH computes. WELL reflects. arifOS judges authority and reversibility. The human decides."
      sections={[
        {
          title: 'Connect MCP',
          description: 'Public governance connection door for agents and tools.',
          href: 'https://mcp.arif-fazil.com/',
          cta: 'Connect arifOS MCP',
          external: true,
        },
        {
          title: 'Observatory',
          description: 'Public evidence room — prove what is running.',
          href: 'https://arifos.arif-fazil.com/',
          cta: 'Inspect Observatory',
          external: true,
        },
        {
          title: 'Federation map',
          description: 'How Earth, Capital, Human and Governance relate.',
          href: '/federation',
          cta: 'View Federation Map',
        },
        {
          title: 'Verify a receipt',
          description: 'Permanent verification surface.',
          href: '/999',
          cta: 'Verify a Receipt',
        },
        {
          title: 'Canon',
          description: 'Constitutional and doctrinal surfaces.',
          href: '/canon',
          cta: 'Read Canon',
        },
      ]}
    />
  );
}
