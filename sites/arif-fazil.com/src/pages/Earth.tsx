import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import FactTag from '@/components/FactTag'
import SectionHeader from '@/components/SectionHeader'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

gsap.registerPlugin(ScrollTrigger)

const AMBER = '#FF9F1C'

type Well = {
  name: string
  meta: string
  summary: string
  story: string
}

const WELLS: Well[] = [
  {
    name: 'BEKANTAN-1',
    meta: 'NEW PLAY WILDCAT · FLOWED',
    summary:
      'The shallowest flowing oil discovery in the Malay Basin. A shallow prospect everyone stepped over, until someone didn’t.',
    story:
      'Shallow prospects are the ones mature basins hide in plain sight. The seismic signal was there for years, walked over by deeper, louder ideas. Bekantan-1 was a bet that the humble answer was the right one — and the well flowed oil at a shallower depth than any other discovery in the Malay Basin. The lesson: in exploration, familiarity is not the same as understanding.',
  },
  {
    name: 'PUTERI BASEMENT-1',
    meta: 'FRACTURED BASEMENT TEST',
    summary:
      'Drilling into the hard, ancient floor of the basin to test whether fractures could hold and give up oil.',
    story:
      'Beneath the soft sedimentary layers sits the basement — rock billions of years old, dense and unforgiving. Oil cannot live in the rock itself; it can only live in its cracks. Puteri Basement-1 asked a precise question: are those fractures connected, and will they give up what they hold? Wells like this are how a basin’s floor stops being a boundary and becomes a frontier.',
  },
  {
    name: 'LEBAH EMAS-1',
    meta: 'NEW PLAY WILDCAT',
    summary:
      '“Golden Bee.” A concept-first well: a new play idea carried from map to drill bit.',
    story:
      'Some wells begin with data. Lebah Emas began with an idea — a play that existed first as lines on a map and a reasoned argument about where hydrocarbons ought to be. Carrying a concept all the way from interpretation to drill bit is the purest form of exploration: you are not confirming what is known, you are paying to find out if your imagination was accurate.',
  },
  {
    name: 'BUNGA TASBIH-1',
    meta: 'DISCOVERY → DEVELOPMENT',
    summary:
      'The well that led to a Small Field Asset PSC award — from a seismic anomaly to a sanctioned field.',
    story:
      'A discovery only matters if it becomes a field. Bunga Tasbih-1 turned a seismic anomaly into volumes, and the volumes into a Small Field Asset PSC award — the commercial instrument that sanctions development. This is the full arc of the discipline: rock, to risk, to revenue that flows back to the country that owns the petroleum.',
  },
]

/* ── Perpetual pulse dot, isolated so re-renders never reset it ── */
const WellDot = ({ delay }: { delay: number }) => (
  <motion.span
    className="inline-block h-2.5 w-2.5 rounded-full"
    style={{ backgroundColor: AMBER }}
    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
    transition={{ duration: 1.6, repeat: Infinity, delay, ease: 'easeInOut' }}
  />
)

/* ── Depth gauge: fixed side progress bar in mono ── */
function DepthGauge() {
  const { scrollYProgress } = useScroll()
  const depth = useTransform(scrollYProgress, [0, 1], [0, 4000])
  const [label, setLabel] = useState('0')
  useEffect(() => {
    const unsub = depth.on('change', (v) => setLabel(Math.round(v).toLocaleString('en-US')))
    return () => unsub()
  }, [depth])
  return (
    <div className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-2 lg:flex">
      <span className="font-mono text-[10px] tracking-[0.08em] text-[#EDE6D6]/50 [writing-mode:vertical-rl]">
        TVD
      </span>
      <div className="relative h-48 w-px bg-[#EDE6D6]/15">
        <motion.div
          className="absolute left-0 top-0 w-px"
          style={{ scaleY: scrollYProgress, transformOrigin: 'top', height: '100%', backgroundColor: AMBER }}
        />
      </div>
      <span className="font-mono text-[10px] tabular-nums tracking-[0.08em] text-[#EDE6D6]/70">
        {label}m
      </span>
    </div>
  )
}

/* ── GSAP-isolated pinned scroll story: how a well is born ── */
const STEPS = [
  { label: 'SEISMIC', text: 'Sound is sent into the earth and the echoes are recorded. A seismic survey is an ultrasound of the planet — kilometres of rock rendered as reflections.' },
  { label: 'INTERPRET', text: 'The geoscientist reads those reflections and draws the earth back: layers, faults, traps. Interpretation is disciplined imagination, checked against every known fact.' },
  { label: 'RISK', text: 'Every prospect is assigned an honest probability of success. Most ideas fail this test. Stating the risk plainly is what keeps the portfolio alive.' },
  { label: 'PROPOSE', text: 'The survivors become a well proposal: a location, a depth, a cost, a case. Someone must stand in front of the decision-makers and defend the bet.' },
  { label: 'DRILL', text: 'Steel meets rock. Weeks of drilling answer a question that took years to ask. Then, one morning, pressure gauges move — and the well tells you whether you were right.' },
]

function WellBorn() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const stepRefs = useRef<(HTMLDivElement | null)[]>([])
  const stampRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      const steps = stepRefs.current.filter(Boolean) as HTMLDivElement[]
      gsap.set(steps, { opacity: 0, y: 30 })
      gsap.set(steps[0], { opacity: 1, y: 0 })
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapRef.current,
          start: 'top top',
          end: '+=200%',
          scrub: 0.6,
          pin: true,
        },
      })
      steps.forEach((el, i) => {
        if (i === 0) return
        tl.to(steps[i - 1], { opacity: 0, y: -30, duration: 0.4 }, i)
        tl.to(el, { opacity: 1, y: 0, duration: 0.4 }, i + 0.15)
      })
      tl.fromTo(
        stampRef.current,
        { scale: 1.6, rotation: -4, opacity: 0 },
        { scale: 1, rotation: -4, opacity: 1, duration: 0.5, ease: 'power3.in' },
        steps.length + 0.2,
      )
    }, wrapRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={wrapRef} className="relative flex min-h-[100dvh] items-center overflow-hidden border-t border-[#EDE6D6]/10">
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 px-6 md:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow text-[#EDE6D6]/50">04</p>
          <h2 className="mt-3 font-display text-4xl tracking-[-0.02em] text-[#EDE6D6] md:text-5xl">
            How a well is born
          </h2>
          <div ref={stampRef} className="mt-16 inline-block border-4 px-6 py-2 font-mono text-3xl font-bold uppercase tracking-[0.12em] opacity-0" style={{ borderColor: AMBER, color: AMBER }}>
            FLOWED
          </div>
        </div>
        <div className="relative min-h-[280px]">
          {STEPS.map((s, i) => (
            <div
              key={s.label}
              ref={(el) => { stepRefs.current[i] = el }}
              className="absolute inset-0 flex flex-col justify-center"
            >
              <p className="font-mono text-[64px] font-bold uppercase leading-none tracking-[0.04em] text-[#EDE6D6]/15 md:text-[96px]">
                {String(i + 1).padStart(2, '0')}
              </p>
              <p className="mt-2 font-mono text-xl uppercase tracking-[0.12em]" style={{ color: AMBER }}>
                {s.label}
              </p>
              <p className="mt-4 max-w-[52ch] font-body text-[19px] leading-[1.65] text-[#EDE6D6]/85">
                {s.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ── Split-character headline ── */
function HeroHeadline({ text }: { text: string }) {
  return (
    <h1 className="font-display text-[52px] leading-[0.95] tracking-[-0.02em] text-[#EDE6D6] md:text-[96px]">
      {text.split(' ').map((word, wi) => (
        <span key={wi} className="inline-block whitespace-nowrap">
          {word.split('').map((ch, ci) => (
            <motion.span
              key={ci}
              className="inline-block"
              initial={{ y: '110%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: (wi * word.length + ci) * 0.02, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              {ch}
            </motion.span>
          ))}
          {wi < text.split(' ').length - 1 ? <span>&nbsp;</span> : null}
        </span>
      ))}
    </h1>
  )
}

export function Earth() {
  const [activeWell, setActiveWell] = useState<Well | null>(null)
  const [highlight, setHighlight] = useState<number | null>(null)
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const imgScale = useTransform(heroProgress, [0, 1], [1.08, 1])
  const wellsRef = useRef<HTMLDivElement>(null)
  const wellsInView = useInView(wellsRef, { once: true, margin: '-20% 0px' })
  const basinRef = useRef<HTMLDivElement>(null)
  const basinInView = useInView(basinRef, { once: true, margin: '-20% 0px' })

  return (
    <div className="bg-[#0D0C0A] text-[#EDE6D6]">
      <DepthGauge />

      {/* ── 01 HERO ── */}
      <section ref={heroRef} className="relative flex min-h-[90dvh] items-end overflow-hidden">
        <motion.img
          src="/seismic-amber.png"
          alt="Seismic section of layered sedimentary strata with amber highlight bands"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
          style={{ scale: imgScale }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0C0A] via-[#0D0C0A]/55 to-[#0D0C0A]/30" />
        <div className="relative mx-auto w-full max-w-[1280px] px-6 pb-20 pt-40">
          <p className="eyebrow" style={{ color: AMBER }}>
            02 ————— EARTH · MALAY BASIN, OFFSHORE MALAYSIA
          </p>
          <div className="mt-6 overflow-hidden">
            <HeroHeadline text="Thirteen years of reading rock." />
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="mt-8 max-w-[58ch] font-body text-[20px] leading-[1.65] text-[#EDE6D6]/85"
          >
            Exploration geoscience is a bet placed kilometres underground. These are the bets I
            placed — and what came back up.
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="mt-10 font-mono text-[13px] uppercase tracking-[0.04em] text-[#EDE6D6]/50"
          >
            PETRONAS · 2013 — PRESENT
          </motion.p>
        </div>
      </section>

      {/* ── 02 THE BASIN ── */}
      <section ref={basinRef} className="border-t border-[#EDE6D6]/10">
        <div className="mx-auto grid max-w-[1280px] gap-12 px-6 py-24 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={basinInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <img
              src="/malay-basin-map.svg"
              alt="Line map of the Malay Basin offshore Peninsular Malaysia with four well locations"
              className="w-full border border-[#EDE6D6]/10 bg-[#151310] p-2"
            />
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2">
              {WELLS.map((w, i) => (
                <button
                  key={w.name}
                  onMouseEnter={() => setHighlight(i)}
                  onMouseLeave={() => setHighlight(null)}
                  onClick={() => setActiveWell(w)}
                  className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors"
                  style={{ color: highlight === i ? AMBER : 'rgb(237 230 214 / 0.6)' }}
                >
                  <WellDot delay={i * 0.2} />
                  {w.name}
                </button>
              ))}
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={basinInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15 }}
          >
            <SectionHeader number="02" title="THE BASIN" className="[&_.eyebrow]:!text-[#EDE6D6]/70 [&_span]:!bg-[#EDE6D6]/20" />
            <h2 className="mt-6 font-display text-4xl tracking-[-0.02em] md:text-5xl">
              A mature basin that still keeps secrets.
            </h2>
            <div className="mt-6 space-y-5 font-body text-[19px] leading-[1.65] text-[#EDE6D6]/85">
              <p>
                The Malay Basin, offshore Peninsular Malaysia, has been drilled for decades. Yet it
                still yields discoveries to anyone willing to look again at what everyone else has
                already seen. This work was instrumental to the realization of{' '}
                <span className="font-mono text-[15px]" style={{ color: AMBER }}>PM318</span>.
              </p>
              <p>
                What an exploration geoscientist actually does: interpret seismic surveys, assemble
                a play, price its risk honestly, defend a well proposal — and then stand on the
                rig floor on the morning the well flows, or doesn’t.
              </p>
              <p className="font-mono text-[13px] uppercase tracking-[0.04em] text-[#EDE6D6]/50">
                Hover a well above — or open a card below — to read its story.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── 03 THE WELLS ── */}
      <section ref={wellsRef} className="border-t border-[#EDE6D6]/10">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <SectionHeader number="03" title="THE WELLS" className="[&_.eyebrow]:!text-[#EDE6D6]/70 [&_span]:!bg-[#EDE6D6]/20" />
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {WELLS.map((w, i) => (
              <motion.button
                key={w.name}
                onClick={() => setActiveWell(w)}
                onMouseEnter={() => setHighlight(i)}
                onMouseLeave={() => setHighlight(null)}
                initial={{ opacity: 0, y: 60 }}
                animate={wellsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -6 }}
                className="group relative overflow-hidden border border-[#EDE6D6]/10 bg-[#151310] p-8 text-left transition-shadow"
              >
                <span
                  className="absolute left-0 top-0 h-px w-full transition-all duration-300 group-hover:h-[3px]"
                  style={{ backgroundColor: AMBER }}
                />
                <span
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-[0.08]"
                  style={{ backgroundImage: 'url(/seismic-amber.png)', backgroundSize: 'cover' }}
                />
                <div className="relative">
                  <h3
                    className="font-display text-[40px] leading-none tracking-[-0.02em]"
                    style={{ color: highlight === i ? AMBER : '#EDE6D6' }}
                  >
                    {w.name}
                  </h3>
                  <p className="mt-3 font-mono text-[12px] uppercase tracking-[0.06em] text-[#EDE6D6]/50">
                    {w.meta}
                  </p>
                  <p className="mt-4 font-body text-[18px] leading-[1.65] text-[#EDE6D6]/85">
                    {w.summary}
                  </p>
                  <div className="mt-6 flex items-center justify-between">
                    <FactTag kind="OBS" className="!border-[#EDE6D6]/40 !text-[#EDE6D6]" />
                    <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-[#EDE6D6]/40 group-hover:text-[#EDE6D6]/70">
                      Read the well’s story →
                    </span>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
          <p className="mt-14 max-w-[40ch] font-body text-[22px] italic leading-[1.6] text-[#EDE6D6]">
            “Every exploration well he has led has flowed.”{' '}
            <FactTag kind="OBS" className="!border-[#EDE6D6]/40 !text-[#EDE6D6]" />
          </p>
        </div>
      </section>

      {/* ── 04 HOW A WELL IS BORN (GSAP pinned, isolated) ── */}
      <WellBorn />

      {/* ── 05 BRIDGE ── */}
      <section className="border-t border-[#EDE6D6]/10">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="max-w-[34ch] font-display text-3xl leading-[1.15] tracking-[-0.02em] text-[#EDE6D6] md:text-4xl">
              The same discipline — state the risk, honor the floor — became a constitution for
              machines.
            </p>
            <Link
              to="/doctrine"
              className="mt-8 inline-block font-mono text-[14px] uppercase tracking-[0.06em] text-cold underline decoration-cold/40 underline-offset-8 transition-all hover:decoration-cold hover:drop-shadow-[0_0_8px_rgba(125,211,252,0.6)]"
            >
              Read the doctrine →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ── 06 GEOX PORTAL ── */}
      <section className="border-t border-[#EDE6D6]/10">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.7 }}
            className="flex flex-col items-start gap-8 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#EDE6D6]/40">
                06 ——— EARTH INTELLIGENCE
              </p>
              <h2 className="mt-4 font-display text-3xl tracking-[-0.02em] text-[#EDE6D6] md:text-4xl">
                The surface is the map.<br />The engine is the rock.
              </h2>
              <p className="mt-4 max-w-[52ch] font-body text-[18px] leading-[1.65] text-[#EDE6D6]/70">
                GEOX turns what you see on this page into evidence — query the bedrock, witness the
                wells, run the prospect engine. Every answer from a pipe.
              </p>
            </div>
            <a
              href="https://geox.arif-fazil.com/"
              className="group flex shrink-0 items-center gap-3 border border-[#FF9F1C]/30 bg-[#FF9F1C]/[0.04] px-7 py-4 font-mono text-[13px] uppercase tracking-[0.08em] text-[#FF9F1C] no-underline transition-all hover:border-[#FF9F1C]/60 hover:bg-[#FF9F1C]/[0.08]"
            >
              <span className="opacity-50 transition-opacity group-hover:opacity-100">▸</span>
              OPEN GEOX
              <span className="text-[10px] opacity-30 transition-opacity group-hover:opacity-60">↗</span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Well story dialog */}
      <Dialog open={activeWell !== null} onOpenChange={(open) => !open && setActiveWell(null)}>
        <DialogContent className="border-[#EDE6D6]/15 bg-[#151310] text-[#EDE6D6] sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle className="font-display text-3xl tracking-[-0.02em]" style={{ color: AMBER }}>
              {activeWell?.name}
            </DialogTitle>
            <DialogDescription className="font-mono text-[12px] uppercase tracking-[0.06em] text-[#EDE6D6]/50">
              {activeWell?.meta}
            </DialogDescription>
          </DialogHeader>
          <p className="font-body text-[18px] leading-[1.7] text-[#EDE6D6]/90">{activeWell?.story}</p>
          <FactTag kind="OBS" className="!border-[#EDE6D6]/40 !text-[#EDE6D6]" />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Earth;
