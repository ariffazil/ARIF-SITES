import type { MouseEvent } from 'react';

const navLinks = [
  { href: '#rings', label: 'rings' },
  { href: '#rules', label: 'rules' },
  { href: '#surfaces', label: 'surfaces' },
  { href: '#order', label: 'order' },
];

export default function TrinityNav() {
  const handleEnter = (e: MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    document.getElementById('rings')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <>
      <div className="unified-trinity-strip">
        <a href="https://arif-fazil.com" className="utn-node utn-human">HUMAN</a>
        <span className="utn-div">·</span>
        <a href="https://apex.arif-fazil.com" className="utn-node utn-theory">THEORY</a>
        <span className="utn-div">·</span>
        <a href="https://arifos.arif-fazil.com" className="utn-node utn-apps">APPS</a>
        <span className="utn-div">·</span>
        <span className="utn-node utn-active" style={{ color: '#e5e7eb' }}>FORGE</span>
        <span className="utn-sep" />
        <span className="utn-sig">PORTAL LAYER · DITEMPA BUKAN DIBERI</span>
      </div>
      <nav className="unified-nav">
        <div className="unified-nav-inner">
          <a href="/" className="unified-logo"><span className="unified-logo-mark">forge<span className="unified-logo-dot">.</span>arif</span></a>
          <div className="unified-nav-links">
            {navLinks.map((link) => <a key={link.href} href={link.href} className="unified-nav-link">{link.label}</a>)}
          </div>
          <div className="unified-nav-right">
            <a href="https://github.com/ariffazil/arif-sites" target="_blank" rel="noopener noreferrer" className="unified-nav-ghost">Repo</a>
            <a href="#rings" className="unified-nav-cta" onClick={handleEnter}>Open map</a>
          </div>
        </div>
      </nav>
    </>
  );
}