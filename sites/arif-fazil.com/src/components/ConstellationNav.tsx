import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
  federationRoutes,
  getDomainRoutes,
  primaryNavDomains,
  type FederationDomain,
  type FederationRoute,
} from '@/data/federationRoutes';
import { SiteSearch } from '@/components/SiteSearch';

function RouteItem({ route, onNavigate }: { route: FederationRoute; onNavigate?: () => void }) {
  if (route.external) {
    return (
      <a
        href={route.path}
        className="block px-3 py-2 font-technical text-[0.7rem] uppercase tracking-widest text-forge-dim hover:text-forge-orange hover:bg-forge-steel rounded"
        target="_blank"
        rel="noreferrer"
        onClick={onNavigate}
      >
        {route.shortTitle} <span className="text-[0.55rem] opacity-60">↗</span>
      </a>
    );
  }
  return (
    <NavLink
      to={route.path}
      className={({ isActive }) =>
        `block px-3 py-2 font-technical text-[0.7rem] uppercase tracking-widest rounded ${
          isActive ? 'text-forge-orange bg-forge-steel' : 'text-forge-dim hover:text-forge-orange hover:bg-forge-steel'
        }`
      }
      onClick={onNavigate}
    >
      {route.shortTitle}
    </NavLink>
  );
}

function DomainMenu({
  domain,
  label,
  open,
  onOpen,
  onClose,
}: {
  domain: FederationDomain;
  label: string;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
}) {
  const items = getDomainRoutes(domain);
  const home = primaryNavDomains.find((d) => d.domain === domain);
  const homeRoute = federationRoutes.find((r) => r.id === home?.homeId);

  if (domain === 'ARIF') {
    return (
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `font-technical text-[0.7rem] uppercase tracking-widest px-2 py-2 ${
            isActive ? 'text-forge-orange' : 'text-forge-dim hover:text-forge-orange'
          }`
        }
      >
        {label}
      </NavLink>
    );
  }

  if (domain === 'WRITING') {
    return (
      <NavLink
        to="/essays"
        className={({ isActive }) =>
          `font-technical text-[0.7rem] uppercase tracking-widest px-2 py-2 ${
            isActive ? 'text-forge-orange' : 'text-forge-dim hover:text-forge-orange'
          }`
        }
      >
        {label}
      </NavLink>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onClose}
    >
      <button
        type="button"
        className={`font-technical text-[0.7rem] uppercase tracking-widest px-2 py-2 ${
          open ? 'text-forge-orange' : 'text-forge-dim hover:text-forge-orange'
        }`}
        aria-expanded={open}
        aria-haspopup="true"
        onClick={() => (open ? onClose() : onOpen())}
      >
        {label}
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-50 min-w-[12rem] border-2 border-forge-iron bg-forge-black py-2 shadow-lg"
          role="menu"
        >
          {homeRoute && !homeRoute.external && (
            <NavLink
              to={homeRoute.path}
              className="block px-3 py-2 font-technical text-[0.65rem] uppercase text-forge-orange border-b border-forge-iron mb-1"
              onClick={onClose}
            >
              {homeRoute.shortTitle} home
            </NavLink>
          )}
          {items.map((item) => (
            <RouteItem key={item.id} route={item} onNavigate={onClose} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ConstellationNav() {
  const [openDomain, setOpenDomain] = useState<FederationDomain | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <header className="border-b-2 border-forge-iron bg-forge-black py-3 sticky top-0 z-50">
      <div className="site-frame flex items-center justify-between gap-3">
        <Link className="flex items-center gap-3 group shrink-0" to="/">
          <div className="w-10 h-10 border-2 border-forge-white flex items-center justify-center font-technical font-bold text-lg group-hover:bg-forge-white group-hover:text-forge-black transition-all">
            AF
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-black text-xl leading-none uppercase tracking-tighter">Arif Fazil</div>
            <div className="font-technical text-[0.55rem] text-forge-dim uppercase tracking-[0.15em] mt-1">
              Sovereign root
            </div>
          </div>
        </Link>

        {/* Desktop */}
        <nav className="hidden lg:flex items-center gap-1 flex-1 justify-end" aria-label="Primary">
          {primaryNavDomains.map((d) => (
            <DomainMenu
              key={d.domain}
              domain={d.domain}
              label={d.label}
              open={openDomain === d.domain}
              onOpen={() => setOpenDomain(d.domain)}
              onClose={() => setOpenDomain(null)}
            />
          ))}
          <div className="ml-3">
            <SiteSearch />
          </div>
        </nav>

        {/* Mobile trigger */}
        <div className="flex lg:hidden items-center gap-2">
          <SiteSearch compact />
          <button
            ref={triggerRef}
            type="button"
            className="border-2 border-forge-iron px-3 py-2 font-technical text-[0.65rem] uppercase tracking-widest text-forge-dim hover:text-forge-orange min-h-[44px] min-w-[44px]"
            aria-expanded={mobileOpen}
            aria-controls={menuId}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? 'Close' : 'Menu'}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div
          id={menuId}
          className="lg:hidden border-t border-forge-iron bg-forge-black max-h-[70vh] overflow-y-auto"
          role="dialog"
          aria-label="Mobile navigation"
        >
          <div className="site-frame py-4 space-y-4">
            {primaryNavDomains.map((d) => {
              const items = getDomainRoutes(d.domain);
              const home = federationRoutes.find((r) => r.id === d.homeId);
              return (
                <div key={d.domain}>
                  <div className="font-technical text-[0.65rem] text-forge-orange uppercase tracking-widest mb-2">
                    {d.label}
                  </div>
                  <div className="space-y-1">
                    {home && <RouteItem route={home} onNavigate={() => setMobileOpen(false)} />}
                    {items
                      .filter((i) => i.id !== home?.id)
                      .map((item) => (
                        <RouteItem key={item.id} route={item} onNavigate={() => setMobileOpen(false)} />
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
