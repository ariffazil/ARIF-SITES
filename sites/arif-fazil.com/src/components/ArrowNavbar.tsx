import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useNow, formatKL } from '@/hooks/useNow'
import { brand, primaryNav, secondaryNav, type NavItem } from '@/data/navCanon'

function isActivePath(pathname: string, href: string): boolean {
  const h = href.replace(/\/$/, '') || '/'
  const p = pathname.replace(/\/$/, '') || '/'
  if (h === '/') return p === '/'
  return p === h || p.startsWith(h + '/')
}

function NavItemLink({
  item,
  className,
  activeClassName,
  onClick,
  mobile,
}: {
  item: NavItem
  className?: string
  activeClassName?: string
  onClick?: () => void
  mobile?: boolean
}) {
  // Territory color system (matches Home FOUR TERRITORIES underlines)
  const territoryAccent: Record<string, string> = {
    '/earth': 'decoration-[#E4572E]',
    '/economics': 'decoration-[#C9A227]',
    '/world': 'decoration-[#EDEAE2]',
    '/doctrine': 'decoration-[#9AA0A8]',
  }
  const accent = territoryAccent[item.href.replace(/\/$/, '')] || 'decoration-ember'
  const base =
    className ??
    'font-mono text-[12px] uppercase tracking-[0.06em] transition-colors text-ink-soft hover:text-ink'
  const active =
    activeClassName ??
    `text-ink underline ${accent} decoration-2 underline-offset-8`

  // Static & external: full document navigation (preserve /999/, /vitals/ reality)
  if (item.mode === 'static' || item.mode === 'external' || item.external) {
    return (
      <a
        href={item.href}
        onClick={onClick}
        className={base}
        {...(item.external || item.mode === 'external'
          ? { target: '_blank', rel: 'noreferrer' }
          : {})}
      >
        {item.label}
      </a>
    )
  }

  return (
    <NavLink
      to={item.href}
      onClick={onClick}
      className={({ isActive }) =>
        `${base} ${isActive ? active : ''} ${mobile ? 'font-display text-4xl tracking-[-0.02em] normal-case no-underline' : ''}`
      }
    >
      {item.label}
    </NavLink>
  )
}

export default function Navbar() {
  const now = useNow()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-paper/95 backdrop-blur-md hairline">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between gap-4 px-6">
        <div className="flex min-w-0 items-baseline gap-3 sm:gap-4">
          <Link
            to={brand.href}
            className="shrink-0 font-display text-[17px] font-semibold tracking-[-0.02em] text-ink hover:text-ember"
          >
            {brand.label}
          </Link>
          <span className="hidden font-mono text-[11px] tabular-nums tracking-[0.04em] text-ink-soft sm:inline">
            {formatKL(now)}
          </span>
        </div>

        <nav className="hidden items-center gap-5 lg:gap-6 md:flex" aria-label="Primary">
          {primaryNav.map((l) => (
            <NavItemLink key={l.href + l.label} item={l} />
          ))}
        </nav>

        <button
          className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-soft hover:text-ink md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          Menu
        </button>
      </div>

      {/* Thin ember rail — signal of live site, not decoration noise */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-ember/40 to-transparent" aria-hidden />

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper px-6 py-5 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-[17px] font-semibold">{brand.label}</span>
              <button
                className="font-mono text-[12px] uppercase tracking-[0.06em]"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                Close
              </button>
            </div>
            <nav className="mt-12 flex flex-col gap-5" aria-label="Primary mobile">
              <NavItemLink
                item={{ label: 'Home', href: '/', mode: 'spa' }}
                mobile
                onClick={() => setOpen(false)}
                className="font-display text-4xl tracking-[-0.02em] text-ink"
              />
              {primaryNav.map((l, i) => (
                <motion.div
                  key={l.href + l.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.25 }}
                >
                  <NavItemLink
                    item={l}
                    mobile
                    onClick={() => setOpen(false)}
                    className="font-display text-4xl tracking-[-0.02em] text-ink"
                  />
                </motion.div>
              ))}
            </nav>
            <div className="mt-10 border-t hairline pt-6">
              <p className="eyebrow mb-3 text-ink-soft/70">Also</p>
              <div className="flex flex-col gap-3">
                {secondaryNav.map((l) => (
                  <NavItemLink
                    key={l.href + l.label}
                    item={l}
                    onClick={() => setOpen(false)}
                    className="font-mono text-[13px] uppercase tracking-[0.05em] text-ink-soft"
                  />
                ))}
              </div>
            </div>
            <div className="mt-auto font-mono text-[11px] tabular-nums text-ink-soft">
              KUALA LUMPUR — UTC+8 · {formatKL(now)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// re-export helper for tests / breadcrumbs if needed
export { isActivePath }
