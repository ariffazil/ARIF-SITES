import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView, useScroll, useTransform, animate } from 'framer-motion'
import SectionHeader from '@/components/SectionHeader'
import FactTag from '@/components/FactTag'
import { useNow, formatKL, secondsSinceBirth } from '@/hooks/useNow'

/* ------------------------------------------------------------------ */
/* Hero: the live clock — "The Arrow of Time"                          */
/* ------------------------------------------------------------------ */

function useClockHands() {
  const hourRef = useRef<HTMLDivElement>(null)
  const minuteRef = useRef<HTMLDivElement>(null)
  const secondRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    // second-hand spring state
    let angle = 0
    let vel = 0
    let target = 0
    let lastSecond = -1

    const tick = () => {
      const now = new Date()
      // KL time parts
      const kl = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }))
      const s = kl.getSeconds()
      const m = kl.getMinutes()
      const h = kl.getHours() % 12

      if (s !== lastSecond) {
        lastSecond = s
        // mechanical stepped target: 6° per second + 2° overshoot handled by spring
        target = s * 6
        // ember glow pulse each tick
        if (glowRef.current) {
          glowRef.current.style.opacity = '0.55'
        }
      }

      // spring toward target (overshoot-and-settle)
      const stiffness = 0.22
      const damping = 0.72
      vel += (target - angle) * stiffness
      vel *= damping
      angle += vel

      const secondDeg = angle + (2 * Math.max(0, vel)) // subtle overshoot bias
      const minuteDeg = (m + s / 60) * 6
      const hourDeg = (h + m / 60) * 30

      if (secondRef.current) secondRef.current.style.transform = `translateX(-50%) rotate(${secondDeg}deg)`
      if (minuteRef.current) minuteRef.current.style.transform = `translateX(-50%) rotate(${minuteDeg}deg)`
      if (hourRef.current) hourRef.current.style.transform = `translateX(-50%) rotate(${hourDeg}deg)`
      if (glowRef.current) {
        const cur = parseFloat(glowRef.current.style.opacity || '0')
        glowRef.current.style.opacity = String(Math.max(0, cur - 0.02))
      }

      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  return { hourRef, minuteRef, secondRef, glowRef }
}

function GhostHour() {
  // huge ghostly numeral of the current hour, drifting 2px per minute
  const [, force] = useState(0)
  useEffect(() => {
    const id = setInterval(() => force((n) => n + 1), 30000)
    return () => clearInterval(id)
  }, [])
  const kl = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Kuala_Lumpur' }))
  const h = kl.getHours() % 12 || 12
  const drift = kl.getMinutes() * 2
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute left-1/2 top-1/2 select-none font-display font-black"
      style={{
        fontSize: '40vh',
        lineHeight: 1,
        opacity: 0.04,
        transform: `translate(calc(-50% + ${drift}px), calc(-50% - ${drift}px))`,
      }}
    >
      {h}
    </div>
  )
}

function Hero() {
  const now = useNow()
  const { hourRef, minuteRef, secondRef, glowRef } = useClockHands()
  const wrapRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ['start start', 'end start'] })
  const clockScale = useTransform(scrollYProgress, [0, 1], [1, 1.4])
  const clockOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0])

  const headline = 'The arrow of time only flies forward.'.split(' ')

  return (
    <div ref={wrapRef} className="relative h-[150vh]">
      <section className="sticky top-16 flex h-[calc(100dvh-4rem)] flex-col overflow-hidden">
        {/* faint radial grain backdrop */}
        <div
          aria-hidden
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at 50% 45%, rgba(228,87,46,0.06), transparent 55%), radial-gradient(circle at 50% 50%, rgba(20,17,12,0.05), transparent 70%)',
          }}
        />
        <GhostHour />

        {/* top row: location + entropy */}
        <div className="relative z-10 mx-auto flex w-full max-w-[1280px] items-start justify-between px-6 pt-6">
          <div className="font-mono text-[13px] tracking-[0.04em]">
            <div className="text-ink-soft">KUALA LUMPUR — UTC+8</div>
            <div className="mt-1 text-[15px] tabular-nums text-ink">{formatKL(now)}</div>
          </div>
          <div className="text-right font-mono text-[13px] tracking-[0.04em]">
            <div className="text-ink-soft">SECONDS SINCE 22.05.1990</div>
            <div className="mt-1 text-[15px] tabular-nums text-ember">
              {secondsSinceBirth(now).toLocaleString('en-US')}
            </div>
          </div>
        </div>

        {/* the clock */}
        <motion.div
          style={{ scale: clockScale, opacity: clockOpacity }}
          className="relative z-10 flex flex-1 items-center justify-center"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="relative"
            style={{ width: 'min(58vh, 560px)', height: 'min(58vh, 560px)' }}
          >
            {/* ember glow pulse */}
            <div
              ref={glowRef}
              aria-hidden
              className="absolute inset-[-12%] rounded-full"
              style={{
                opacity: 0,
                background: 'radial-gradient(circle, rgba(228,87,46,0.18), transparent 60%)',
              }}
            />
            <img
              src="/clock-face.svg"
              alt="Clock dial"
              className="absolute inset-0 h-full w-full"
              draggable={false}
            />
            {/* hour hand */}
            <div
              ref={hourRef}
              className="absolute bottom-1/2 left-1/2 origin-bottom"
              style={{ width: 8, height: '24%', marginBottom: 0, background: '#14110C', borderRadius: 4 }}
            />
            {/* minute hand */}
            <div
              ref={minuteRef}
              className="absolute bottom-1/2 left-1/2 origin-bottom"
              style={{ width: 5, height: '36%', background: '#14110C', borderRadius: 3 }}
            />
            {/* second hand: ember, extra-long, counterweight tail */}
            <div
              ref={secondRef}
              className="absolute bottom-1/2 left-1/2 origin-bottom"
              style={{ width: 2.5, height: '44%', background: '#E4572E' }}
            >
              <div
                className="absolute left-1/2 top-full -translate-x-1/2"
                style={{ width: 10, height: '22%', background: '#E4572E', borderRadius: 5 }}
              />
            </div>
            {/* center cap */}
            <div className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-paper bg-ember" />
          </motion.div>
        </motion.div>

        {/* bottom: headline + sub + scroll cue */}
        <div className="relative z-10 mx-auto w-full max-w-[1280px] px-6 pb-8">
          <h1 className="max-w-[14ch] font-display text-[44px] leading-[0.95] tracking-[-0.02em] md:text-[64px] lg:text-[88px]">
            {headline.map((w, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: 24, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  delay: 0.5 + i * 0.08,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
                }}
              >
                {w}&nbsp;
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3, duration: 0.8 }}
            className="mt-4 max-w-[52ch] font-body text-[20px] leading-[1.65] text-ink-soft"
          >
            I'm Arif Fazil. I spend mine reading the earth, pricing risk, and teaching machines to tell
            the truth.
          </motion.p>

          <div className="mt-6 flex items-center gap-3">
            <div className="relative h-12 w-px overflow-hidden bg-ink/20">
              <div
                className="absolute left-0 top-0 h-2 w-px bg-ember"
                style={{ animation: 'scroll-cue-descend 1.6s steps(12) infinite' }}
              />
            </div>
            <span className="eyebrow text-ink-soft">Scroll ↓</span>
          </div>
        </div>
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* Section 2 — The Person                                              */
/* ------------------------------------------------------------------ */

function Person() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  return (
    <section ref={ref} className="mx-auto max-w-[1280px] px-6 py-24">
      <SectionHeader number="01" title="THE PERSON" />
      <div className="mt-12 grid gap-12 md:grid-cols-[45%_55%]">
        <motion.figure
          initial={{ clipPath: 'inset(100% 0 0 0)' }}
          animate={inView ? { clipPath: 'inset(0% 0 0 0)' } : {}}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
          className="border p-3 hairline"
        >
          <img src="/portrait-arif.png" alt="Portrait illustration of Arif Fazil" className="w-full" />
          <figcaption className="mt-3 font-mono text-[12px] tracking-[0.04em] text-ink-soft">
            PENANG, 1990 —
          </figcaption>
        </motion.figure>

        <div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="font-display text-[36px] leading-none tracking-[-0.02em] md:text-5xl"
          >
            Forged, not given.
          </motion.h2>
          {[
            'Muhammad Arif bin Fazil. Born in Penang on 22 May 1990, raised on the northern Malay tongue. PETRONAS scholar. Double major in Geology & Geophysics and Economics at the University of Wisconsin–Madison. Thirteen years an exploration geoscientist at PETRONAS — and, in parallel, the author of arifOS, a constitution for machines.',
            'Ditempa bukan diberi — forged, not given. Heat, pressure, time. It is how oil forms, and how people do.',
          ].map((p, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2 + i * 0.15, duration: 0.6 }}
              className={
                i === 0
                  ? 'mt-8 max-w-[62ch] font-body text-[19px] leading-[1.65] text-ink'
                  : 'relative mt-6 max-w-[62ch] font-body text-[19px] italic leading-[1.65] text-ink-soft'
              }
            >
              {i === 1 ? (
                <span className="relative inline-block">
                  {p}
                  <motion.span
                    aria-hidden
                    initial={{ scaleX: 0 }}
                    animate={inView ? { scaleX: 1 } : {}}
                    transition={{ delay: 0.7, duration: 0.9, ease: 'easeOut' }}
                    className="absolute -bottom-1 left-0 h-[2px] w-full origin-left bg-ember"
                  />
                </span>
              ) : (
                p
              )}
            </motion.p>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 3 — Three Domains                                           */
/* ------------------------------------------------------------------ */

const domains = [
  {
    index: '01',
    title: 'EARTH',
    desc: 'Thirteen years reading the Malay Basin. Four wells, one record.',
    to: '/earth',
    bar: 'bg-earth',
    hover: '#FF9F1C',
  },
  {
    index: '02',
    title: 'ECONOMICS',
    desc: 'Incentives, risk, and what energy is really worth.',
    to: '/economics',
    bar: 'bg-ledger',
    hover: '#1E6F50',
  },
  {
    index: '03',
    title: 'MACHINES',
    desc: 'arifOS: a constitution so AI must tell the truth — or stop.',
    to: '/doctrine',
    bar: 'bg-cold',
    hover: '#7DD3FC',
  },
]

function Domains() {
  const [hovered, setHovered] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-25% 0px' })

  return (
    <section ref={ref} className="border-y hairline">
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        <SectionHeader number="02" title="THREE DOMAINS" className="mb-12" />
        <div onMouseLeave={() => setHovered(null)}>
          {domains.map((dm, i) => (
            <motion.div
              key={dm.title}
              initial={{ opacity: 0, x: -48 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.12, duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            >
              <Link
                to={dm.to}
                onMouseEnter={() => setHovered(i)}
                className="group block border-t py-10 hairline last:border-b"
              >
                <motion.div
                  layout="position"
                  animate={{ scale: hovered === i ? 1.01 : 1 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 26 }}
                  className="flex items-center gap-8"
                >
                  <span className="eyebrow text-ink-soft">{dm.index}</span>
                  <div className="flex-1">
                    <h3
                      className="font-display text-4xl tracking-[-0.02em] transition-colors duration-300 md:text-[56px] md:leading-none"
                      style={{ color: hovered === i ? dm.hover : undefined }}
                    >
                      {dm.title}
                    </h3>
                    <p className="mt-3 font-body text-[18px] italic text-ink-soft">{dm.desc}</p>
                  </div>
                  <span
                    className="font-mono text-2xl transition-transform duration-300"
                    style={{ transform: hovered === i ? 'translateX(8px)' : 'none' }}
                    aria-hidden
                  >
                    →
                  </span>
                </motion.div>
                <div className={`mt-6 h-[3px] w-24 ${dm.bar}`} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 4 — The Record                                              */
/* ------------------------------------------------------------------ */

const stats = [
  { n: 13, label: 'YEARS AT PETRONAS' },
  { n: 4, label: 'EXPLORATION WELLS LED' },
  { n: 13, label: 'CONSTITUTIONAL FLOORS, F1–F13' },
  { n: 8, label: 'CANONICAL MCP TOOLS' },
]

function StatCell({ n, label, start }: { n: number; label: string; start: boolean }) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start) return
    const controls = animate(0, n, {
      duration: 1.2,
      ease: 'easeOut',
      onUpdate: (v) => setVal(Math.round(v)),
    })
    return () => controls.stop()
  }, [start, n])
  return (
    <div className="border-l px-6 py-8 hairline first:border-l-0">
      <div className="font-mono text-5xl tabular-nums tracking-[-0.02em] md:text-6xl">{val}</div>
      <div className="mt-3 font-mono text-[12px] uppercase tracking-[0.04em] text-ink-soft">{label}</div>
      <FactTag kind="OBS" className="mt-3" />
    </div>
  )
}

function Record() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  return (
    <section ref={ref} className="mx-auto max-w-[1280px] px-6 py-24">
      <SectionHeader number="03" title="THE RECORD" />
      <div className="mt-12 grid grid-cols-2 border-y hairline md:grid-cols-4">
        {stats.map((s) => (
          <StatCell key={s.label} n={s.n} label={s.label} start={inView} />
        ))}
      </div>
      <p className="mt-8 max-w-[62ch] font-body text-[18px] italic leading-[1.65] text-ink-soft">
        "Every exploration well he has led has flowed. The record speaks plainly; it doesn't need
        adjectives."
      </p>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 5 — Latest Words                                            */
/* ------------------------------------------------------------------ */

const posts = [
  {
    title: 'What a well teaches you about waiting',
    date: '2026-01-14',
    tag: 'WRITING',
    excerpt:
      'Fourteen months of planning, three weeks of drilling, and one moment when the mud logger goes quiet. Patience is not passive — it is pressure, held.',
    to: '/writing',
  },
  {
    title: 'Harga minyak, harga nasi: satu ekonomi, dua meja',
    date: '2026-01-06',
    tag: 'MAKCIKGPT',
    excerpt:
      'Makcik explains fuel subsidies at the pasar table: who pays, who saves, and why the ringgit in your purse is an energy question.',
    to: '/world',
  },
  {
    title: 'Truth must cool before it rules',
    date: '2025-12-20',
    tag: 'DOCTRINE',
    excerpt:
      'Why arifOS holds its verdicts until the evidence settles — F2 TRUTH is not a feature flag; it is a cooling tower for hot claims.',
    to: '/doctrine',
  },
]

function LatestWords() {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-20% 0px' })
  return (
    <section ref={ref} className="mx-auto max-w-[1280px] px-6 py-24">
      <div className="flex items-end justify-between gap-6">
        <SectionHeader number="04" title="LATEST WORDS" className="flex-1" />
        <Link
          to="/writing"
          className="whitespace-nowrap font-mono text-[13px] uppercase tracking-[0.04em] text-ink-soft hover:text-ink"
        >
          All writing →
        </Link>
      </div>
      <div className="mt-12">
        {posts.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.1, duration: 0.6 }}
          >
            <Link
              to={p.to}
              className="group block border-t px-4 py-8 transition-colors hairline last:border-b hover:bg-paper-dark"
            >
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="font-display text-[26px] tracking-[-0.02em] md:text-[32px]">
                  <span className="mr-2 inline-block text-ember opacity-0 transition-opacity group-hover:opacity-100">
                    ▸
                  </span>
                  {p.title}
                </h3>
                <div className="font-mono text-[12px] uppercase tracking-[0.04em] text-ink-soft">
                  {p.date} · {p.tag}
                </div>
              </div>
              <p className="mt-3 line-clamp-2 max-w-[65ch] font-body text-[17px] leading-[1.65] text-ink-soft">
                {p.excerpt}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

/* ------------------------------------------------------------------ */
/* Section 6 — Closing statement                                       */
/* ------------------------------------------------------------------ */

function Closing() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end center'] })
  const tracking = useTransform(scrollYProgress, [0, 1], ['0em', '0.06em'])
  return (
    <section ref={ref} className="mx-auto max-w-[1280px] px-6 pb-28 pt-8 text-center">
      <motion.p
        style={{ letterSpacing: tracking }}
        className="mx-auto max-w-[26ch] font-display text-[30px] leading-[1.15] tracking-[-0.02em] md:text-[40px]"
      >
        This site is written for people. Machines are welcome too — politely, and in the footer.
      </motion.p>
    </section>
  )
}

export function Home() {
  return (
    <div className="grain">
      <Hero />
      <Person />
      <Domains />
      <Record />
      <LatestWords />
      <Closing />
    </div>
  )
}

export default Home;
