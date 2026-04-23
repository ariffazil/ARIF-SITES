import { primaryLinks } from '@/data/siteContent';

export function ConstellationNav() {
  return (
    <header className="site-topbar">
      <div className="site-frame site-topbar__inner">
        <a className="site-brand" href="/">
          <span className="site-brand__mark">AF</span>
          <span>
            <strong>Arif Fazil</strong>
            <span className="site-brand__sub">geologist · ai systems architect</span>
          </span>
        </a>

        <nav aria-label="Primary">
          <ul className="site-nav">
            {primaryLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href}>{item.label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
