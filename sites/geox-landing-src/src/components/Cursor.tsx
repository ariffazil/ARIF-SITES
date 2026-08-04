import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Custom crosshair cursor: 12px bone-400 reticle that expands to a 40px ring
 * with a mono label (OPEN / READ / HOLD) over interactive elements.
 * Disabled on touch devices.
 */
export default function Cursor() {
  const [enabled, setEnabled] = useState(false)
  const [label, setLabel] = useState<string | null>(null)
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 })

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    setEnabled(true)
    const move = (e: MouseEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const t = (e.target as HTMLElement | null)?.closest?.('a,button,[data-cursor]') as HTMLElement | null
      setLabel(t ? (t.dataset.cursor ?? 'OPEN') : null)
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      className="pointer-events-none fixed left-0 top-0 z-[100]"
      style={{ x: sx, y: sy }}
      aria-hidden
    >
      <div
        className={`flex -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border transition-all duration-200 ${
          label ? 'h-10 w-10 border-magma-500/80' : 'h-3 w-3 border-bone-400'
        }`}
      >
        {!label && (
          <span className="block h-px w-3 bg-bone-400 absolute" />
        )}
        {!label && (
          <span className="block h-3 w-px bg-bone-400 absolute" />
        )}
        {label && (
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-magma-400">{label}</span>
        )}
      </div>
    </motion.div>
  )
}
