import { Link } from 'react-router-dom';
import { federationFooterRoles } from '@/data/federationRoutes';

export function ConstellationFooter() {
  return (
    <footer className="border-t-2 border-forge-iron bg-forge-black py-16 mt-auto">
      <div className="site-frame">
        <div className="section-label mb-6">Federation roles</div>
        <ul className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {federationFooterRoles.map((row) => (
            <li key={row.domain}>
              <div className="font-technical text-[0.55rem] text-forge-dim uppercase tracking-widest mb-1">
                {row.domain}
              </div>
              {row.href.startsWith('http') ? (
                <a
                  href={row.href}
                  className="font-technical text-[0.8rem] uppercase text-forge-dim hover:text-forge-white transition-colors"
                  target={row.href.includes('arif-fazil.com') && !row.href.includes('https://arif-fazil.com') ? '_blank' : undefined}
                  rel="noreferrer"
                >
                  {row.name}
                </a>
              ) : (
                <Link
                  to={row.href}
                  className="font-technical text-[0.8rem] uppercase text-forge-dim hover:text-forge-white transition-colors"
                >
                  {row.name}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <p className="font-body text-sm text-forge-dim max-w-xl leading-relaxed mb-8">
          Governed by arifOS. Domain organs advise or witness. The human remains the final authority.
          AAA and A-FORGE are control and execution surfaces — not primary public destinations.
        </p>

        <div className="pt-8 border-t border-forge-iron flex flex-col md:flex-row justify-between gap-4">
          <div className="font-technical text-[0.6rem] text-forge-dim uppercase tracking-widest">
            DITEMPA BUKAN DIBERI · arif-fazil.com
          </div>
          <div className="flex flex-wrap gap-4">
            <a href="/llms.txt" className="font-technical text-[0.65rem] text-forge-dim hover:text-forge-orange uppercase">
              llms.txt
            </a>
            <a href="/.well-known/routes.json" className="font-technical text-[0.65rem] text-forge-dim hover:text-forge-orange uppercase">
              routes.json
            </a>
            <a href="/sitemap.xml" className="font-technical text-[0.65rem] text-forge-dim hover:text-forge-orange uppercase">
              sitemap
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
