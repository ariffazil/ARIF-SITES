import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { primaryNav } from '@/data/navCanon';
import { LiveClock } from '@/components/LiveClock';

const linkBase =
  'font-mono text-[0.7rem] uppercase tracking-[0.12em] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forge-orange';

export function ConstellationNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  const linkClass = (href: string) =>
    isActive(href)
      ? `${linkBase} text-forge-orange underline underline-offset-8 decoration-forge-orange/60`
      : `${linkBase} text-forge-dim hover:text-forge-white`;

  return (
    <header className="border-b border-forge-iron bg-forge-black/85 backdrop-blur py-3 sticky top-0 z-50">
      <div className="site-frame flex items-center justify-between gap-4">
        <Link
          className="flex items-center gap-3 group focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forge-orange shrink-0"
          to="/"
          title="/"
          onClick={() => setOpen(false)}
        >
          <div className="w-9 h-9 rounded-md border border-forge-iron flex items-center justify-center font-mono text-sm text-forge-white group-hover:border-forge-orange/60 group-hover:text-forge-orange transition-colors">
            AF
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-bold text-base leading-none tracking-tight">Arif Fazil</div>
          </div>
        </Link>

        {/* Desktop nav — ONE LINE, no redundancy (canon/navigation.json primary_links) */}
        <nav aria-label="Primary navigation" className="hidden lg:block flex-1">
          <ul className="flex items-center justify-center gap-6">
            {primaryNav.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    title={item.href}
                    className={`${linkBase} text-forge-dim hover:text-forge-white`}
                  >
                    {item.label} ↗
                  </a>
                ) : (
                  <Link to={item.href} title={item.href} className={linkClass(item.href)}>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Live clock — temporal intelligence for humans AND agents */}
        <div className="hidden md:block shrink-0">
          <LiveClock withDate withIso />
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forge-orange"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className={`w-5 h-px bg-forge-white transition-transform ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`w-5 h-px bg-forge-white transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`w-5 h-px bg-forge-white transition-transform ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu — single column, no redundancy */}
      {open && (
        <nav aria-label="Mobile navigation" className="md:hidden border-t border-forge-iron mt-3">
          <ul className="site-frame flex flex-col py-4">
            {primaryNav.map((item) => (
              <li key={item.label} className="py-2 border-b border-forge-iron/40 last:border-0">
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    title={item.href}
                    className={`${linkBase} text-forge-dim hover:text-forge-white`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label} ↗
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    title={item.href}
                    className={linkClass(item.href)}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
            <li className="pt-3">
              <LiveClock withDate withIso />
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
