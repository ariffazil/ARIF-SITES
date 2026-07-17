import { Link } from 'react-router-dom';
import { getBreadcrumb } from '@/data/federationRoutes';

export function Breadcrumb({ pathname }: { pathname: string }) {
  const chain = getBreadcrumb(pathname);
  if (chain.length <= 1) return null;
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-2 font-technical text-[0.65rem] uppercase tracking-widest text-forge-dim">
        {chain.map((item, i) => {
          const isLast = i === chain.length - 1;
          return (
            <li key={item.id} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true" className="text-forge-iron">/</span>}
              {isLast || item.external ? (
                <span className={isLast ? 'text-forge-orange' : ''} aria-current={isLast ? 'page' : undefined}>
                  {item.shortTitle}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-forge-orange transition-colors">
                  {item.shortTitle}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
