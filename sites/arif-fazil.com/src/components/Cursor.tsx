import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Custom cursor: a 12px dot ring that turns into a crosshair over
 * interactive elements. Disabled on touch devices.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [active, setActive] = useState(false)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.35 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    setEnabled(true)
    document.body.classList.add('custom-cursor')
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = (e.target as HTMLElement | null)?.closest?.('a,button,[data-cursor]')
      setActive(!!t)
    }
    window.addEventListener('mousemove', move)
    return () => {
      window.removeEventListener('mousemove', move)
      document.body.classList.remove('custom-cursor')
    }
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      style={{ x: sx, y: sy }}
      className="pointer-events-none fixed left-0 top-0 z-[9999]"
    >
      <div
        className={
          active
            ? 'relative -translate-x-1/2 -translate-y-1/2 transition-all duration-150'
            : 'relative -translate-x-1/2 -translate-y-1/2 transition-all duration-150'
        }
      >
        {active ? (
          /* crosshair */
          <svg width="28" height="28" viewBox="0 0 28 28" className="-ml-3.5 -mt-3.5">
            <circle cx="14" cy="14" r="10" fill="none" stroke="#E4572E" strokeWidth="1.5" />
            <line x1="14" y1="0" x2="14" y2="8" stroke="#E4572E" strokeWidth="1.5" />
            <line x1="14" y1="20" x2="14" y2="28" stroke="#E4572E" strokeWidth="1.5" />
            <line x1="0" y1="14" x2="8" y2="14" stroke="#E4572E" strokeWidth="1.5" />
            <line x1="20" y1="14" x2="28" y2="14" stroke="#E4572E" strokeWidth="1.5" />
          </svg>
        ) : (
          /* 12px dot ring */
          <div className="-ml-1.5 -mt-1.5 h-3 w-3 rounded-full border-[1.5px] border-ink" />
        )}
      </div>
    </motion.div>
  )
}
