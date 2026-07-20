import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export function NotFound() {
  useEffect(() => {
    document.title = '404 — Not Found | Arif Fazil';
  }, []);

  return (
    <section className="py-32 bg-forge-black min-h-screen flex items-center">
      <div className="site-frame text-center max-w-xl mx-auto">
        <h1 className="text-8xl font-black italic uppercase text-forge-iron mb-6">404</h1>
        <p className="font-body text-lg text-forge-dim mb-8 leading-relaxed">
          This route doesn't exist in the federation. Maps are finite.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/" className="font-mono text-sm uppercase tracking-wider px-6 py-3 bg-forge-orange text-forge-black border-2 border-forge-orange hover:opacity-80 transition-opacity">
            ← Home
          </Link>
          <Link to="/doctrine" className="font-mono text-sm uppercase tracking-wider px-6 py-3 bg-transparent text-forge-dim border-2 border-forge-iron hover:text-forge-white transition-colors">
            Doctrine
          </Link>
        </div>
      </div>
    </section>
  );
}
