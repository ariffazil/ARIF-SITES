import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { searchRoutes, type FederationRoute } from '@/data/federationRoutes';

export function SiteSearch({ compact = false }: { compact?: boolean }) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const results = searchRoutes(q).slice(0, 10);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  function go(r: FederationRoute) {
    setOpen(false);
    setQ('');
    if (r.external) {
      window.location.href = r.path;
    } else {
      navigate(r.path);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`font-technical text-[0.65rem] uppercase tracking-widest border border-forge-iron text-forge-dim hover:text-forge-orange hover:border-forge-orange transition-colors ${
          compact ? 'px-2 py-2 min-h-[44px]' : 'px-3 py-2'
        }`}
        aria-label="Search federation routes"
      >
        {compact ? 'Find' : 'Search ⌘K'}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] bg-black/70 flex items-start justify-center pt-[10vh] px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Command search"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="w-full max-w-lg border-2 border-forge-iron bg-forge-black shadow-2xl">
            <label className="sr-only" htmlFor="fed-search">
              Search routes
            </label>
            <input
              id="fed-search"
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="oil · gas · gold · makcik · mcp · wells…"
              className="w-full bg-forge-black border-b-2 border-forge-iron px-4 py-3 font-technical text-sm text-forge-white outline-none"
            />
            <ul className="max-h-80 overflow-y-auto">
              {results.length === 0 && q && (
                <li className="px-4 py-3 text-sm text-forge-dim">No matching public routes.</li>
              )}
              {results.map((r) => (
                <li key={r.id}>
                  <button
                    type="button"
                    className="w-full text-left px-4 py-3 hover:bg-forge-steel border-b border-forge-iron/50"
                    onClick={() => go(r)}
                  >
                    <div className="font-technical text-[0.65rem] text-forge-orange uppercase">
                      {r.domain} · {r.organ}
                    </div>
                    <div className="font-display font-bold uppercase text-sm">{r.shortTitle}</div>
                    <div className="text-xs text-forge-dim mt-0.5">{r.path}</div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="px-4 py-2 font-technical text-[0.55rem] text-forge-dim uppercase tracking-widest border-t border-forge-iron">
              Esc close · Enter select · Canon-driven index
            </div>
          </div>
        </div>
      )}
    </>
  );
}
