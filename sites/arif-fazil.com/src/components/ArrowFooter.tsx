import { brand, machineNav, secondaryNav, type NavItem } from '@/data/navCanon'

function FootLink({ item }: { item: NavItem }) {
  const cls =
    'underline decoration-ink/25 underline-offset-4 transition-colors hover:text-ink hover:decoration-ember'
  if (item.mode === 'external' || item.external || item.href.startsWith('http')) {
    return (
      <a className={cls} href={item.href} target="_blank" rel="noreferrer">
        {item.label}
      </a>
    )
  }
  return (
    <a className={cls} href={item.href}>
      {item.label}
    </a>
  )
}

export default function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto max-w-[1280px] px-6 py-14 md:py-16">
        <p className="font-display text-4xl tracking-[-0.02em] text-ink md:text-5xl lg:text-6xl">
          {brand.creed}
        </p>

        {/* Human secondary — real live surfaces */}
        <div className="mt-10">
          <p className="eyebrow mb-3 text-[11px] text-ink-soft/70">Explore</p>
          <div className="flex flex-wrap gap-x-8 gap-y-3 font-body text-[16px] text-ink-soft md:text-[17px]">
            {secondaryNav.map((item) => (
              <FootLink key={item.href + item.label} item={item} />
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-8 flex flex-wrap gap-x-10 gap-y-3 font-body text-[16px] text-ink-soft md:text-[17px]">
          <a
            className="underline decoration-ink/30 underline-offset-4 hover:decoration-ember"
            href="mailto:arifos@arif-fazil.com"
          >
            arifos@arif-fazil.com
          </a>
          <a
            className="underline decoration-ink/30 underline-offset-4 hover:decoration-ember"
            href="https://github.com/ariffazil"
            target="_blank"
            rel="noreferrer"
          >
            GitHub — ariffazil
          </a>
          <a
            className="underline decoration-ink/30 underline-offset-4 hover:decoration-ember"
            href="https://t.me/ariffazil"
            target="_blank"
            rel="noreferrer"
          >
            Telegram — @ariffazil
          </a>
        </div>

        {/* Machines — quiet doors */}
        <div className="mt-12 border-t hairline pt-5">
          <p className="eyebrow mb-3 text-[11px] text-ink-soft/70">
            For machines ·{' '}
            <a href="/machines/" className="normal-case tracking-normal text-ink-soft hover:text-ink">
              ops guide
            </a>
            {' · '}
            <a
              href="/.well-known/territories.json"
              className="normal-case tracking-normal text-ink-soft hover:text-ink"
            >
              territories.json
            </a>
          </p>
          <p className="mb-3 max-w-[52ch] font-mono text-[11px] text-ink-soft/60">
            Agents: polite crawl, no mass-email, cite with rsl.xml. Do no harm.
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-2 font-mono text-[11px] tracking-[0.04em] text-ink-soft/80 sm:text-[12px]">
            {machineNav.map((item, i) => (
              <span key={item.href + item.label} className="inline-flex items-center gap-x-4">
                {i > 0 && (
                  <span aria-hidden className="text-ink/25">
                    ·
                  </span>
                )}
                <a
                  href={item.href}
                  className="hover:text-ink"
                  {...(item.href.startsWith('http')
                    ? { target: '_blank', rel: 'noreferrer' }
                    : {})}
                >
                  {item.label}
                </a>
              </span>
            ))}
          </div>
          <p className="mt-6 font-mono text-[11px] tracking-[0.04em] text-ink-soft/55 sm:text-[12px]">
            © 2026 Muhammad Arif bin Fazil · Ditempa Bukan Diberi
          </p>
        </div>
      </div>
    </footer>
  )
}
