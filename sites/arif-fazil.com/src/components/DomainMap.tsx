import { motion } from 'framer-motion';

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring' as const, stiffness: 100 },
  },
};

type Domain = {
  name: string;
  href: string;
  description: string;
  category: string;
  external?: boolean;
};

const domains: Domain[] = [
  {
    name: 'Earth Intelligence',
    href: '/earth',
    description: 'Basin analysis, seismic, well logs. Subsurface physics.',
    category: 'Geoscience',
  },
  {
    name: 'Kinabalu Basin',
    href: '/earth/kinabalu-basin/',
    description: 'Case study: tectonic reconstruction, deep-time geology.',
    category: 'Geoscience',
  },
  {
    name: 'Economics',
    href: '/economics',
    description: 'Daily briefings. Bursa, ringgit, oil. Evidence-gated.',
    category: 'Analysis',
  },
  {
    name: 'Wealth Dashboard',
    href: '/wealth/malaysia/',
    description: 'Malaysia capital flows, commodity prices, political economy.',
    category: 'Analysis',
  },
  {
    name: 'MakcikGPT',
    href: '/makcikgpt/',
    description: 'Civic journalism in Bahasa Makcik. 22 articles, 5 series.',
    category: 'Writing',
  },
  {
    name: 'N9 Election',
    href: '/politics/ns-election/',
    description: 'Live telemetry, 9 invariants, swing-seat playbook.',
    category: 'Politics',
  },
  {
    name: 'Wells Portfolio',
    href: '/world',
    description: 'Bekantan-1, Puteri Basement-1, Berantai. Proof of work.',
    category: 'Geoscience',
  },
  {
    name: 'Doctrine',
    href: '/doctrine',
    description: 'ABCD framework. Constitution F1-F13. Organ topology.',
    category: 'Governance',
  },
  {
    name: 'Writing',
    href: '/writing',
    description: 'Essays on AI, trust, institutional decay.',
    category: 'Writing',
  },
  {
    name: 'GEOX Observatory',
    href: 'https://geox.arif-fazil.com',
    description: 'Subsurface physics lab. Basin explorer, well logs, seismic.',
    category: 'Geoscience',
    external: true,
  },
  {
    name: 'arifOS Observatory',
    href: 'https://arifos.arif-fazil.com',
    description: 'Constitutional observatory. 13 floors, 9 organs, audit trail.',
    category: 'Governance',
    external: true,
  },
];

export function DomainMap() {
  const categories = Array.from(new Set(domains.map((d) => d.category)));

  return (
    <section className="py-24 bg-forge-black border-b-2 border-forge-iron">
      <div className="site-frame">
        <motion.div variants={itemVariants}>
          <div className="section-label">Main Map</div>
          <h2 className="text-3xl md:text-4xl font-black uppercase mb-4 tracking-tight">
            Every Domain, One Click Away
          </h2>
          <p className="font-body text-forge-dim max-w-2xl mb-12 leading-relaxed">
            You're at the homepage. Here's everything you can reach. Pick a domain — each one is a self-contained surface with its own data, analysis, and navigation.
          </p>
        </motion.div>

        {categories.map((category) => (
          <motion.div key={category} variants={itemVariants} className="mb-12">
            <h3 className="font-technical text-xs text-forge-orange uppercase tracking-widest mb-4">
              {category}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {domains
                .filter((d) => d.category === category)
                .map((domain) => (
                  <a
                    key={domain.href}
                    href={domain.href}
                    target={domain.external ? '_blank' : undefined}
                    rel={domain.external ? 'noopener noreferrer' : undefined}
                    className="brutalist-card group block"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h4 className="text-lg font-black uppercase mb-1 group-hover:text-forge-orange transition-colors">
                          {domain.name}
                          {domain.external && (
                            <span className="ml-2 font-technical text-[0.6rem] text-forge-dim">↗</span>
                          )}
                        </h4>
                        <p className="text-sm text-forge-dim leading-relaxed">
                          {domain.description}
                        </p>
                      </div>
                      <div className="font-technical text-xs text-forge-dim group-hover:text-forge-orange transition-colors">
                        →
                      </div>
                    </div>
                  </a>
                ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
