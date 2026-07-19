import { Link } from 'react-router-dom';
import { primaryLinks } from '@/data/siteContent';

export function ConstellationNav() {
  return (
    <header className="border-b-2 border-forge-iron bg-forge-black py-4 sticky top-0 z-50">
      <div className="site-frame flex items-center justify-between">
        <Link className="flex items-center gap-4 group" to="/">
          <div className="w-10 h-10 border-2 border-forge-white flex items-center justify-center font-technical font-bold text-lg group-hover:bg-forge-white group-hover:text-forge-black transition-all">
            AF
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-black text-xl leading-none uppercase tracking-tighter">Arif Fazil</div>
            <div className="font-technical text-[0.6rem] text-forge-dim uppercase tracking-[0.2em] mt-1">Geoscientist · ΔΩΨ Architect</div>
          </div>
        </Link>

        <nav aria-label="Primary navigation">
          <ul className="flex items-center gap-6">
            {primaryLinks.map((item) => (
              <li key={item.label}>
                <Link 
                  to={item.href} 
                  className="font-technical text-[0.7rem] uppercase tracking-widest text-forge-dim hover:text-forge-orange transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
