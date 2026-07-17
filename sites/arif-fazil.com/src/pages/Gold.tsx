import { DomainLanding } from '@/components/DomainLanding';

export function Gold() {
  return (
    <DomainLanding
      routeId="gold"
      purpose="Gold belongs to WEALTH — capital intelligence, not investment advice. Freshness and evidence labels live on the organ surface."
      sections={[
        {
          title: 'WEALTH organ',
          description: 'Canonical capital domain for gold, markets and commodity consequence.',
          href: 'https://wealth.arif-fazil.com/',
          cta: 'Open WEALTH Organ',
          external: true,
        },
        {
          title: 'Root markets surface',
          description: 'Human-facing capital briefings on the sovereign root.',
          href: '/wealth',
          cta: 'Open Markets Surface',
        },
        {
          title: 'Observatory evidence',
          description: 'Prove current federation state before trusting a capital computation.',
          href: 'https://arifos.arif-fazil.com/',
          cta: 'Inspect Observatory',
          external: true,
        },
        {
          title: 'Verify a receipt',
          description: 'Permanent verification of sealed decisions.',
          href: '/999',
          cta: 'Verify a Receipt',
        },
      ]}
    >
      <div className="brutalist-card mb-8 border-forge-orange/40">
        <p className="font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest mb-2">
          Not investment advice
        </p>
        <p className="text-sm text-forge-dim leading-relaxed">
          This page explains ownership and routing. WEALTH computes; arifOS judges authority;
          the human decides. No allocation, no solicitation, no predictive guarantee.
        </p>
      </div>
    </DomainLanding>
  );
}
