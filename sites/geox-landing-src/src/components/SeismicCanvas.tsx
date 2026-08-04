import { memo, useEffect, useRef } from 'react'

/**
 * Live seismic wiggle-trace canvas: thin telemetry-green polylines drifting
 * horizontally over a faint amber depth grid. Continuous gentle drift with
 * amplitude breathing. Isolated + memoized (perpetual animation rule).
 */
const SeismicCanvas = memo(function SeismicCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      w = canvas.clientWidth
      h = canvas.clientHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    // Precompute trace parameters (stable layouts)
    const traces = Array.from({ length: 14 }, (_, i) => ({
      yc: (i + 0.5) / 14,
      amp: 10 + Math.random() * 26,
      f1: 0.004 + Math.random() * 0.004,
      f2: 0.02 + Math.random() * 0.02,
      ph: Math.random() * 10,
      bursts: Array.from({ length: 4 }, () => ({ c: Math.random(), s: 0.03 + Math.random() * 0.08 })),
      green: i % 3 !== 0,
    }))

    let raf = 0
    let visible = true
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0 })
    io.observe(canvas)

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if (!visible || w === 0) return
      const time = t / 1000
      const drift = (time * 12) % w // 40s-ish linear drift
      const breathe = 1 + 0.06 * Math.sin((time * 2 * Math.PI) / 6)

      ctx.clearRect(0, 0, w, h)
      // amber depth grid
      ctx.strokeStyle = 'rgba(217,164,65,0.07)'
      ctx.lineWidth = 1
      for (let gx = 0; gx < w; gx += 120) {
        ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, h); ctx.stroke()
      }
      for (let gy = 0; gy < h; gy += 90) {
        ctx.beginPath(); ctx.moveTo(0, gy); ctx.lineTo(w, gy); ctx.stroke()
      }

      for (const tr of traces) {
        ctx.strokeStyle = tr.green ? 'rgba(95,214,138,0.55)' : 'rgba(59,175,102,0.4)'
        ctx.lineWidth = 1.2
        ctx.beginPath()
        for (let x = 0; x <= w; x += 4) {
          const u = (x + drift) / w
          let env = 0
          for (const b of tr.bursts) {
            const dd = (u - b.c) / b.s
            env += Math.exp(-dd * dd)
          }
          const y =
            tr.yc * h +
            tr.amp * breathe * env * (Math.sin(u * tr.f1 * 2000 + tr.ph) + 0.4 * Math.sin(u * tr.f2 * 2000 + tr.ph * 2))
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.stroke()
      }
    }
    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0 }}
      aria-hidden
    />
  )
})

export default SeismicCanvas
