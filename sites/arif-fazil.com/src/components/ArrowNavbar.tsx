import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useNow, formatKL } from '@/hooks/useNow'

const links = [
  { to: '/earth', label: 'Earth' },
  { to: '/economics', label: 'Economics' },
  { to: '/world', label: 'World' },
  { to: '/writing', label: 'Writing' },
  { to: '/doctrine', label: 'Doctrine' },
  { to: '/missions', label: 'Missions' },
  { to: '/999/', label: '999' },
]

export default function Navbar() {
  const now = useNow()
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-paper/95 backdrop-blur-sm hairline">
      <div className="mx-auto flex h-16 max-w-[1280px] items-center justify-between px-6">
        <div className="flex items-baseline gap-4">
          <Link to="/" className="font-display text-[18px] font-semibold tracking-[-0.02em]">
            ARIF FAZIL
          </Link>
          <span className="font-mono text-[12px] tabular-nums tracking-[0.04em] text-ink-soft">
            {formatKL(now)}
          </span>
        </div>

        <nav className="hidden items-center gap-7 md:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `font-mono text-[13px] uppercase tracking-[0.04em] transition-colors ${
                  isActive
                    ? 'text-ink underline decoration-ember decoration-2 underline-offset-8'
                    : 'text-ink-soft hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <button
          className="font-mono text-[13px] uppercase tracking-[0.04em] md:hidden"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
        >
          Menu
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] flex flex-col bg-paper px-6 py-5 md:hidden"
          >
            <div className="flex items-center justify-between">
              <span className="font-display text-[18px] font-semibold">ARIF FAZIL</span>
              <button
                className="font-mono text-[13px] uppercase tracking-[0.04em]"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                Close
              </button>
            </div>
            <nav className="mt-16 flex flex-col gap-6">
              {[{ to: '/', label: 'Home' }, ...links].map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                >
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-5xl tracking-[-0.02em]"
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
            <div className="mt-auto font-mono text-[12px] tabular-nums text-ink-soft">
              KUALA LUMPUR — UTC+8 · {formatKL(now)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
