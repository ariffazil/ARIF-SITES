import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const buckets = [
  { label: 'Home',  href: '/',        emoji: '⌂', color: '#E4572E', bg: '#1A1210', ring: 'rgba(228,87,46,0.3)' },
  { label: 'Earth', href: '/earth',   emoji: '🌍', color: '#D4A853', bg: '#1A1810', ring: 'rgba(212,168,83,0.3)' },
  { label: 'World', href: '/world',   emoji: '📰', color: '#C8102E', bg: '#1A1012', ring: 'rgba(200,16,46,0.3)' },
  { label: 'Words', href: '/words',   emoji: '✎', color: '#9AA0A8', bg: '#141416', ring: 'rgba(154,160,168,0.3)' },
  { label: 'Work',  href: '/work',    emoji: '⚒', color: '#D4A853', bg: '#1A1612', ring: 'rgba(212,168,83,0.3)' },
] as const

export default function BucketStrip({ current }: { current?: string }) {
  return (
    <nav aria-label="5-bucket navigation" className="flex flex-wrap gap-1.5 sm:gap-2">
      {buckets.map((b) => {
        const isActive = current === b.label
        return (
          <Link
            key={b.href}
            to={b.href}
            className="group relative flex items-center gap-2 rounded-md border px-4 py-2.5 font-mono text-[12px] font-medium uppercase tracking-[0.06em] transition-all duration-200"
            style={{
              borderColor: isActive ? b.color : 'rgb(237 234 226 / 0.15)',
              background: isActive ? b.bg : 'transparent',
              color: isActive ? b.color : '#9AA0A8',
              boxShadow: isActive ? `inset 0 0 0 1px ${b.ring}` : 'none',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = b.color
              e.currentTarget.style.color = b.color
              e.currentTarget.style.background = b.bg
              e.currentTarget.style.boxShadow = `inset 0 0 0 1px ${b.ring}`
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.borderColor = 'rgb(237 234 226 / 0.15)'
                e.currentTarget.style.color = '#9AA0A8'
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.boxShadow = 'none'
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
