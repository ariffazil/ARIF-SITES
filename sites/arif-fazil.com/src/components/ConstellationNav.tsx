import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { primaryLinks } from '@/data/siteContent';

export function ConstellationNav() {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="border-b-2 border-forge-iron bg-forge-black py-4 sticky top-0 z-50">
      <div className="site-frame flex items-center justify-between">
        <Link className="flex items-center gap-4 group" to="/" onClick={() => setOpen(false)}>
          <div className="w-10 h-10 border-2 border-forge-white flex items-center justify-center font-technical font-bold text-lg group-hover:bg-forge-white group-hover:text-forge-black transition-all">
            AF
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-black text-xl leading-none uppercase tracking-tighter">Arif Fazil</div>
            <div className="font-technical text-[0.6rem] text-forge-dim uppercase tracking-[0.2em] mt-1">Geoscientist · ΔΩΨ Architect</div>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {primaryLinks.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-technical text-[0.7rem] uppercase tracking-widest text-forge-dim hover:text-forge-orange transition-colors"
                  >
                    {item.label} ↗
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className={`font-technical text-[0.7rem] uppercase tracking-widest transition-colors ${
                      isActive(item.href) ? 'text-forge-orange' : 'text-forge-dim hover:text-forge-orange'
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden flex flex-col gap-1.5 p-2"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        >
          <span className={`w-6 h-0.5 bg-forge-white transition-transform ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`w-6 h-0.5 bg-forge-white transition-opacity ${open ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-forge-white transition-transform ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav aria-label="Mobile navigation" className="md:hidden border-t-2 border-forge-iron mt-4">
          <ul className="site-frame flex flex-col py-4">
            {primaryLinks.map((item) => (
              <li key={item.label} className="py-2 border-b border-forge-iron/40 last:border-0">
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-technical text-sm uppercase tracking-widest text-forge-dim hover:text-forge-orange transition-colors"
                    onClick={() => setOpen(false)}
                  >
                    {item.label} ↗
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className={`font-technical text-sm uppercase tracking-widest transition-colors ${
                      isActive(item.href) ? 'text-forge-orange' : 'text-forge-dim hover:text-forge-orange'
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
