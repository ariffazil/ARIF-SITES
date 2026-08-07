import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'

const buckets = [
  { label: 'Home',  href: '/',        emoji: '⌂', color: '#E4572E', bg: '#1A1210', ring: 'rgba(228,87,46,0.3)' },
  { label: 'Earth', href: '/earth',   emoji: '🌍', color: '#D4A853', bg: '#1A1810', ring: 'rgba(212,168,83,0.3)' },
  { label: 'World', href: '/world',   emoji: '📰', color: '#C8102E', bg: '#1A1012', ring: 'rgba(200,16,46,0.3)' },
  { label: 'Words', href: '/words',   emoji: '✎', color: '#9AA0A8', bg: '#141416', ring: 'rgba(154,160,168,0.3)' },
  { label: 'Work',  href: '/work',    emoji: '⚒', color: '#D4A853', bg: '#1A1612', ring: 'rgba(212,168,83,0.3)' },
] as const

export default function BucketStrip({ current }: { current?: string }) {
  const location = useLocation()
  const currentPath = location.pathname

  return (
    <nav aria-label="5-bucket navigation" className="flex flex-wrap gap-1.5 sm:gap-2">
      {buckets.map((b) => {
        const isActive = current === b.label || (b.href === '/' && currentPath === '/')
        const isCurrentPage = b.href === currentPath || (b.href === '/' && currentPath === '/')
        
        const buttonStyle = (hover: boolean) => ({
          borderColor: hover ? b.color : isActive ? b.color : 'rgb(237 234 226 / 0.15)',
          background: hover ? b.bg : isActive ? b.bg : 'transparent',
          color: hover ? b.color : isActive ? b.color : '#9AA0A8',
          boxShadow: hover ? `inset 0 0 0 1px ${b.ring}` : isActive ? `inset 0 0 0 1px ${b.ring}` : 'none',
        })

        const className = "group relative flex items-center gap-2 rounded-md border px-3.5 py-2 sm:px-4 sm:py-2.5 font-mono text-[11px] sm:text-[12px] font-medium uppercase tracking-[0.06em] transition-all duration-200 select-none touch-manipulation"

        // If already on this page, don't navigate — just scroll to top
        if (isCurrentPage && b.href === '/') {
          return (
            <span
              key={b.href}
              className={className}
              style={buttonStyle(true)}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              <span className="text-[14px]" aria-hidden>{b.emoji}</span>
              <span>{b.label}</span>
              {isActive && (
                <motion.span
                  layoutId="bucket-indicator"
                  className="absolute -bottom-px left-2 right-2 h-[2px]"
                  style={{ background: b.color }}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
            </span>
          )
        }

        return (
          <Link
            key={b.href}
            to={b.href}
            className={className}
            style={buttonStyle(false)}
            onMouseEnter={(e) => {
              const s = e.currentTarget.style
              s.borderColor = b.color; s.color = b.color; s.background = b.bg; s.boxShadow = `inset 0 0 0 1px ${b.ring}`
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                const s = e.currentTarget.style
                s.borderColor = 'rgb(237 234 226 / 0.15)'; s.color = '#9AA0A8'; s.background = 'transparent'; s.boxShadow = 'none'
              }
            }}
          >
            <span className="text-[14px]" aria-hidden>{b.emoji}</span>
            <span>{b.label}</span>
            {isActive && (
              <motion.span
                layoutId="bucket-indicator"
                className="absolute -bottom-px left-2 right-2 h-[2px]"
                style={{ background: b.color }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </Link>
        )
      })}
    </nav>
  )
}
