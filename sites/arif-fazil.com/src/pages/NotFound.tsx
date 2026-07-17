import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <div className="site-frame py-24 text-center">
      <p className="section-label mb-4">404</p>
      <h1 className="font-display font-black text-4xl uppercase italic mb-4">Page not found</h1>
      <p className="text-forge-dim mb-8 max-w-md mx-auto">
        That path is not in the federation route canon. Try Oil, Gas, Gold, MakcikGPT or return home.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/" className="button-forge">
          Sovereign Root
        </Link>
        <Link to="/oil" className="button-forge">
          Explore Oil Work
        </Link>
        <Link to="/makcikgpt" className="button-forge button-forge--accent">
          Open MakcikGPT
        </Link>
      </div>
    </div>
  );
}
