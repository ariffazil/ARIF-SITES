import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import FactTag from '@/components/FactTag'
import SectionHeader from '@/components/SectionHeader'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

const GREEN = '#1E6F50'
const BRASS = '#B08D3E'

/* ── Ticking ledger tally: approximate barrels consumed globally today [DER] ── */
function LedgerTally() {
  const [barrels, setBarrels] = useState(0)
  useEffect(() => {
    // ~100 million barrels/day globally ≈ 1,157 barrels per second (derived estimate)
    const PER_SECOND = 100_000_000 / 86_400
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const tick = () => setBarrels(Math.floor(((Date.now() - startOfDay.getTime()) / 1000) * PER_SECOND))
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [])
  return (
    <div className="mt-8 flex flex-wrap items-baseline justify-center gap-3 font-mono text-[15px] tracking-[0.04em]">
      <span className="tabular-nums" style={{ color: BRASS }}>
        {barrels.toLocaleString('en-US')}
      </span>
      <span className="uppercase text-ink-soft">barrels of oil consumed worldwide, today</span>
      <FactTag kind="DER" />
    </div>
  )
}

const LENSES = [
  {
    n: '01',
    title: 'Incentive structures',
    body: [
      'People and institutions do what they are paid to do. Not what they say they do, not what their mission statement says — what their incentives pay for.',
      'Read the incentive before you read the press release. A subsidy, a bonus, a mandate: each one is a quiet instruction, and behaviour follows instructions. When an outcome surprises you, it is usually because you were listening to words instead of prices.',
    ],
  },
  {
    n: '02',
    title: 'Risk pricing',
    body: [
      'An exploration well is a priced option on the unknown. You pay a certain cost today for the chance — never the certainty — of a flow tomorrow. Expected value is just arithmetic: what you might win, times how likely it is, minus what it costs to find out.',
      'The discipline is not in finding the courage to drill. It is in walking away when the price of the option exceeds what the unknown is worth. Most wells that should never have been drilled were drilled because someone fell in love with their own map.',
    ],
  },
  {
    n: '03',
    title: 'Value under constraint',
    body: [
      'The Petroleum Development Act 1974 vested Malaysia’s petroleum in PETRONAS. That makes a national oil company something more specific than a business: it is the custodian of a resource that belongs to the rakyat, operating under a legal and moral constraint no private firm carries.',
      'So the question is never only “is it profitable?” It is also “what is it for?” Sovereignty over energy is not a slogan — it is a balance-sheet decision made on behalf of people who were not in the room.',
    ],
  },
]

const FACTS: { claim: string; figure: string; tag: 'OBS' | 'SPEC' | null; note?: string }[] = [
  {
    claim: 'Approximate share of PETRONAS extraction economics flowing to the government (dividends, tax, royalty)',
    figure: '~70.5%',
    tag: 'OBS',
    note: 'arithmetic',
  },
  {
    claim: 'Simulated sovereign-wealth scenario value',
    figure: '$750M',
    tag: 'SPEC',
    note: 'simulation, not a forecast',
  },
  {
    claim: '“PETRONAS is collapsing”',
    figure: 'Not supported by the evidence',
    tag: null,
    note: 'a claim this site refuses to print as fact',
  },
]

const ESSAYS = [
  { title: 'The Price of a Risk', summary: 'What an exploration well teaches you about expected value — and about yourself.' },
  { title: 'Subsidies Are Sentences', summary: 'Fuel subsidy design as a grammatical problem: who is the subject, and who pays the verb.' },
  { title: 'What a National Oil Company Is For', summary: 'The Petroleum Development Act 1974, read as an economic argument about custody.' },
  { title: 'The Arithmetic of 70.5%', summary: 'Following extraction economics from the wellhead to the national budget, in plain numbers.' },
  { title: 'Options on the Unknown', summary: 'Portfolio discipline: why the best exploration decision is often the well you decline.' },
]

export function Economics() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroInView = useInView(heroRef, { once: true })
  const tableRef = useRef<HTMLDivElement>(null)
  const tableInView = useInView(tableRef, { once: true, margin: '-20% 0px' })
  const essaysRef = useRef<HTMLDivElement>(null)
  const essaysInView = useInView(essaysRef, { once: true, margin: '-20% 0px' })

  return (
    <div className="bg-[#F7F3E8] text-ink">
      {/* ── 01 HERO ── */}
      <section ref={heroRef} className="relative flex min-h-[70dvh] items-center overflow-hidden">
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 h-[40%] -translate-y-1/2 opacity-[0.18]"
          style={{ backgroundImage: 'url(/ledger-texture.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}
        />
        <div className="relative mx-auto w-full max-w-[1280px] px-6 py-24 text-center">
          <p className="eyebrow" style={{ color: GREEN }}>
            03 ————— ECONOMICS
          </p>
          <h1
            className="mx-auto mt-6 max-w-[16ch] font-display text-[48px] leading-[0.98] tracking-[-0.02em] md:text-[88px]"
            style={{ color: GREEN }}
          >
            {'Everything is an incentive.'.split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ y: 40, opacity: 0 }}
                animate={heroInView ? { y: 0, opacity: 1 } : {}}
                transition={{ delay: i * 0.09, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                {word}
                {i < 3 ? '\u00A0' : ''}
              </motion.span>
            ))}
          </h1>
          <motion.div
            initial={{ scaleX: 0 }}
            animate={heroInView ? { scaleX: 1 } : {}}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mx-auto mt-8 h-px max-w-[420px] origin-left"
            style={{ backgroundColor: BRASS }}
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mx-auto mt-8 max-w-[56ch] font-body text-[20px] leading-[1.65] text-ink-soft"
          >
            My second degree, and my second lens. Economics is how I price risk — in barrels, in
            policies, and in machine decisions.
          </motion.p>
          <LedgerTally />
        </div>
      </section>

      {/* ── 02 THREE LENSES ── */}
      <section className="border-t border-ink/10">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <SectionHeader number="02" title="THREE LENSES" />
          <div className="mt-12">
            <Accordion type="single" collapsible defaultValue="lens-0" className="w-full">
              {LENSES.map((lens, i) => (
                <AccordionItem key={lens.n} value={`lens-${i}`} className="border-ink/15">
                  <AccordionTrigger className="group py-7 hover:no-underline">
                    <span className="flex items-baseline gap-6 text-left">
                      <span
                        className="font-mono text-[15px] tracking-[0.04em] transition-colors group-data-[state=open]:font-semibold"
                        style={{ color: BRASS }}
                      >
                        {lens.n}
                      </span>
                      <span className="font-display text-3xl tracking-[-0.02em] md:text-4xl" style={{ color: GREEN }}>
                        {lens.title}
                      </span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="max-w-[65ch] space-y-4 pb-4 pl-0 md:pl-14">
                      {lens.body.map((p, j) => (
                        <motion.p
                          key={j}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: j * 0.1, duration: 0.4 }}
                          className="font-body text-[19px] leading-[1.65] text-ink-soft"
                        >
                          {p}
                        </motion.p>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* ── 03 ENERGY, IN PLAIN NUMBERS ── */}
      <section ref={tableRef} className="border-t border-ink/10">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <SectionHeader number="03" title="ENERGY, IN PLAIN NUMBERS" />
          <div className="mt-12 border-y border-ink/15">
            {FACTS.map((f, i) => (
              <motion.div
                key={f.claim}
                initial={{ opacity: 0, x: 60 }}
                animate={tableInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="grid gap-3 border-b border-ink/10 px-2 py-6 last:border-b-0 md:grid-cols-[1.6fr_1fr_auto] md:items-center md:gap-8"
              >
                <p className="font-body text-[18px] leading-[1.55] text-ink">{f.claim}</p>
                <p
                  className="text-right font-mono text-[17px] tabular-nums tracking-[0.02em] md:text-left"
                  style={{ color: f.tag === 'SPEC' ? BRASS : GREEN }}
                >
                  {f.figure}
                  {f.note && (
                    <span className="ml-2 font-body text-[14px] italic text-ink-soft">({f.note})</span>
                  )}
                </p>
                <motion.span
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={tableInView ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: i * 0.08 + 0.25, type: 'spring', stiffness: 300, damping: 18 }}
                  className="justify-self-end md:justify-self-start"
                >
                  {f.tag ? (
                    <FactTag kind={f.tag} className={f.tag === 'SPEC' ? 'animate-pulse' : undefined} />
                  ) : (
                    <span className="inline-block rounded-sm border border-ink/25 px-1.5 py-0.5 font-mono text-[11px] uppercase leading-none tracking-[0.04em] text-ink-soft">
                      REFUTED
                    </span>
                  )}
                </motion.span>
              </motion.div>
            ))}
          </div>
          <p className="mt-8 max-w-[52ch] font-body text-[18px] italic leading-[1.65] text-ink-soft">
            Speculation is labelled speculation. Arithmetic is labelled arithmetic. That is the
            whole trick.
          </p>
        </div>
      </section>

      {/* ── 04 ESSAYS ── */}
      <section ref={essaysRef} className="border-t border-ink/10">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <SectionHeader number="04" title="ESSAYS" />
          <div className="mt-12">
            {ESSAYS.map((e, i) => (
              <motion.div
                key={e.title}
                initial={{ opacity: 0, y: 24 }}
                animate={essaysInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.08 }}
              >
                <Link
                  to="/writing"
                  className="group flex items-baseline gap-6 border-b border-ink/10 py-6 transition-all duration-300 hover:border-l-2 hover:pl-3"
                  style={{ borderLeftColor: GREEN }}
                >
                  <span className="font-mono text-[13px] tabular-nums tracking-[0.04em]" style={{ color: BRASS }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-display text-[28px] tracking-[-0.02em] transition-colors group-hover:text-[#1E6F50]">
                      {e.title}
                    </h3>
                    <p className="mt-1 font-body text-[17px] leading-[1.55] text-ink-soft">{e.summary}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 05 BRIDGE ── */}
      <section className="border-t-2" style={{ borderColor: BRASS }}>
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20% 0px' }}
            transition={{ duration: 0.7 }}
          >
            <p className="max-w-[30ch] font-display text-3xl leading-[1.15] tracking-[-0.02em] md:text-4xl" style={{ color: GREEN }}>
              Incentives explain nations. They also explain machines.
            </p>
            <Link
              to="/doctrine"
              className="mt-8 inline-block font-mono text-[14px] uppercase tracking-[0.06em] text-cold underline decoration-cold/40 underline-offset-8 transition-all hover:decoration-cold"
            >
              Read the doctrine →
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default Economics;
