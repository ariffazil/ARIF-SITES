import { useState } from 'react'
import { Link, NavLink } from 'react-router'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import StatusChip from './StatusChip'

const LINKS = [
  { to: '/platform', label: 'Platform' },
  { to: '/mcp-apps', label: 'MCP Apps' },
  { to: '/webmcp', label: 'WebMCP' },
  { to: '/federation', label: 'Federation' },
  { to: '/deploy', label: 'Deploy' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-strata-700 bg-basalt-950/85 backdrop-blur">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between px-8 max-md:px-5">
          <Link to="/" className="flex items-center gap-3" data-cursor="OPEN">
            <motion.img
              src="/logo-strata.svg"
              alt="GEOX strata mark"
              className="h-8 w-8"
              animate={{ rotate: 360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            />
            <span className="font-display text-lg font-extrabold tracking-tight">GEOX</span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                data-cursor="OPEN"
                className={({ isActive }) =>
                  `font-mono text-[12px] uppercase tracking-[0.18em] transition-colors ${
                    isActive ? 'text-magma-500' : 'text-bone-400 hover:text-bone-100'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-4 md:flex">
            <StatusChip variant="live" label="SYS 8081 LIVE" />
            <StatusChip variant="sealed" label="VAULT_999" />
            <Link
              to="/deploy"
              data-cursor="OPEN"
              className="bg-magma-500 px-4 py-2 font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-basalt-950 transition-shadow hover:shadow-[0_0_24px_#E8733B55]"
            >
              Get Access
            </Link>
          </div>

          <button
            className="text-bone-100 md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            data-cursor="OPEN"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col justify-center bg-basalt-950 md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="pointer-events-none absolute inset-0 opacity-40">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className={`h-[8.33%] border-b border-strata-700/40 ${i % 2 ? 'bg-basalt-900' : 'bg-basalt-800'}`}
                />
              ))}
            </div>
            <nav className="relative flex flex-col gap-6 px-8">
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ x: -24, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.07 * i, duration: 0.4 }}
                >
                  <NavLink
                    to={l.to}
                    onClick={() => setOpen(false)}
                    className="font-display text-3xl font-bold text-bone-100"
                  >
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
