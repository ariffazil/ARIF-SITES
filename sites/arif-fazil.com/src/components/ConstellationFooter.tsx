import { Link } from 'react-router-dom';
import { contactLinks, civicLinks } from '@/data/siteContent';

const quietLink =
  'font-mono text-[0.7rem] text-forge-dim hover:text-forge-white transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forge-orange';

export function ConstellationFooter() {
  return (
    <footer className="border-t border-forge-iron bg-forge-black py-12 mt-auto">
      <div className="site-frame max-w-3xl mx-auto text-center">
        {/* Canon line */}
        <p className="font-body text-sm text-forge-dim leading-relaxed">
          WEALTH computes · arifOS frames · Human decides.
        </p>
        <p className="font-body text-sm text-forge-dim/70 leading-relaxed mt-2 mb-8">
          This page is for humans.{' '}
          <a href="/000/" className="text-forge-orange/90 hover:text-forge-white transition-colors">/000</a>
          {' '}is for agents — scars and context.{' '}
          <a href="/999/" className="text-forge-orange/90 hover:text-forge-white transition-colors">/999</a>
          {' '}is verification.
        </p>

        {/* Civic shelf — live sovereign surfaces reachable from every page */}
        <nav aria-label="Civic surfaces" className="flex flex-wrap justify-center items-center gap-x-6 gap-y-2 mb-8">
          {civicLinks.map((item) => (
            <Link key={item.label} to={item.href} className={quietLink}>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Contact */}
        <nav aria-label="Contact" className="flex justify-center items-center gap-6 mb-10">
          {contactLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              target="_blank"
              rel="noreferrer"
              className={quietLink}
            >
              {item.label} ↗
            </a>
          ))}
        </nav>

        {/* Colophon */}
        <div className="border-t border-forge-iron/40 pt-6 flex flex-col md:flex-row justify-between items-center gap-2">
          <span className="font-mono text-[0.62rem] text-forge-dim/70 uppercase tracking-[0.14em]">
            Arif Fazil · Ditempa Bukan Diberi
          </span>
          <a
            href="/999/"
            className="font-mono text-[0.62rem] text-forge-orange/90 hover:text-forge-white transition-colors uppercase tracking-[0.14em] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-forge-orange"
          >
            verify at /999
          </a>
        </div>
      </div>
    </footer>
  );
}
