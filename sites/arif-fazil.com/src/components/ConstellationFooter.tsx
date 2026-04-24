import { ecosystemLinks } from '@/data/siteContent';

export function ConstellationFooter() {
  return (
    <footer className="site-footer">
      <div className="site-frame site-footer__grid">
        <div>
          <p className="section-eyebrow">root domain</p>
          <h2 className="section-title section-title--sm">One human page, two AI pages.</h2>
          <p className="section-copy">
            The homepage is written in normal human language. <code>/000</code> holds scars, hard
            lessons, and wisdom for AI. <code>/999</code> holds verification and machine-facing weight.
          </p>
        </div>

        <div>
          <p className="section-eyebrow">ecosystem</p>
          <ul className="footer-links">
            {ecosystemLinks.map((item) => (
              <li key={item.label}>
                <a href={item.href} target={item.external ? '_blank' : undefined} rel={item.external ? 'noreferrer' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
