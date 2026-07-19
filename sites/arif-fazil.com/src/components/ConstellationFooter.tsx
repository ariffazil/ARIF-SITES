import { Link } from 'react-router-dom';
import { ecosystemLinks, arifosLinks } from '@/data/siteContent';

export function ConstellationFooter() {
  return (
    <footer className="border-t-2 border-forge-iron bg-forge-black py-16 mt-auto">
      <div className="site-frame grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="section-label">Root Domain</div>
          <h2 className="font-display font-black text-2xl uppercase leading-none italic">One human page. Two AI pages.</h2>
          <p className="font-body text-forge-dim leading-relaxed max-w-md">
            The homepage is written for human observation. <code className="text-forge-orange bg-forge-steel px-1">/000</code> holds scars, hard
            lessons, and wisdom for AI agents. <code className="text-forge-green bg-forge-steel px-1">/999</code> holds verification and machine-facing weight.
          </p>
          <div className="pt-3 mt-1 border-t border-forge-iron/50">
            <span className="font-technical text-[0.55rem] text-forge-dim/60 uppercase tracking-widest block mb-2">Machine surface</span>
            <div className="flex gap-4">
              <a href="/llms.txt" className="badge-status badge-status--live">llms.txt</a>
              <a href="/soul.json" className="badge-status badge-status--live">soul.json</a>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="section-label">arifOS Federation</div>
          <ul className="grid grid-cols-2 gap-y-3">
            {arifosLinks.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-technical text-[0.8rem] uppercase text-forge-dim hover:text-forge-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-forge-gold"></span>
                    {item.label}
                    <span className="text-[0.6rem]">↗</span>
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className="font-technical text-[0.8rem] uppercase text-forge-dim hover:text-forge-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-forge-gold"></span>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <div className="section-label" style={{marginTop:'1.5rem'}}>Ecosystem</div>
          <ul className="grid grid-cols-2 gap-y-3">
            {ecosystemLinks.map((item) => (
              <li key={item.label}>
                {item.external ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-technical text-[0.8rem] uppercase text-forge-dim hover:text-forge-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-forge-iron"></span>
                    {item.label}
                    <span className="text-[0.6rem]">↗</span>
                  </a>
                ) : (
                  <Link
                    to={item.href}
                    className="font-technical text-[0.8rem] uppercase text-forge-dim hover:text-forge-white transition-colors flex items-center gap-2"
                  >
                    <span className="w-1.5 h-1.5 bg-forge-iron"></span>
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      
      <div className="site-frame mt-16 pt-8 border-t border-forge-iron flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="font-technical text-[0.6rem] text-forge-dim uppercase tracking-widest">
          © 2026 Arif Fazil · Canon mark · <a href="/999/" className="text-forge-orange hover:text-forge-white transition-colors">verify at /999</a>
        </div>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="font-technical text-[0.6rem] text-forge-dim uppercase tracking-widest">
            Live state: <a href="https://arifos.arif-fazil.com" className="text-forge-orange hover:text-forge-white transition-colors">Observatory</a> · <a href="https://wiki.arif-fazil.com" className="text-forge-orange hover:text-forge-white transition-colors">Ω-Wiki</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
