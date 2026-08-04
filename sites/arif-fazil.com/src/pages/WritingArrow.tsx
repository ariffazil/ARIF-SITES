import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import SectionHeader from '@/components/SectionHeader'
import FactTag from '@/components/FactTag'
import type { FactKind } from '@/components/FactTag'

type Domain = 'EARTH' | 'ECONOMICS' | 'MACHINES' | 'PERSONAL'

interface Essay {
  date: string
  title: string
  abstract: string
  minutes: number
  domain: Domain
  tag?: FactKind
}

const ESSAYS: Essay[] = [
  {
    date: '2026-01-04',
    title: 'What a well teaches you about risk',
    abstract: 'Thirteen years of drilling decisions, and the one habit that keeps you honest: write down what you expect before you look.',
    minutes: 9,
    domain: 'EARTH',
    tag: 'INT',
  },
  {
    date: '2025-11-18',
    title: 'The price of honesty in AI',
    abstract: 'An AI that can say "I do not know" is cheaper to trust than one that cannot. The accounting of the 13 Floors.',
    minutes: 12,
    domain: 'MACHINES',
    tag: 'DER',
  },
  {
    date: '2025-09-30',
    title: 'Loghat Utara',
    abstract: 'On the northern dialect I grew up hearing in Penang, and why machines should learn to listen to it before they learn to speak.',
    minutes: 7,
    domain: 'PERSONAL',
  },
  {
    date: '2025-08-12',
    title: 'Notes on PM318',
    abstract: 'What realising a block actually takes — years of seismic, dry spreadsheets, and the discipline to keep showing up.',
    minutes: 11,
    domain: 'EARTH',
    tag: 'OBS',
  },
  {
    date: '2025-06-21',
    title: 'Truth must cool before it rules',
    abstract: 'The sentence arifOS is built around. Hot takes are cheap; cooled verdicts are load-bearing.',
    minutes: 8,
    domain: 'MACHINES',
  },
  {
    date: '2025-05-22',
    title: 'On turning thirty-five at a drilling rig',
    abstract: 'A birthday note on pressure, patience, and why oil and people both need time to become useful.',
    minutes: 6,
    domain: 'PERSONAL',
  },
  {
    date: '2025-03-08',
    title: 'The Malay Basin is a teacher',
    abstract: 'BEKANTAN-1 flowed shallow — shallower than anyone in the basin had flowed before. What the rocks were trying to say.',
    minutes: 10,
    domain: 'EARTH',
    tag: 'OBS',
  },
  {
    date: '2024-12-15',
    title: 'Incentives are the invisible geology',
    abstract: 'Economics and geophysics are the same discipline at different depths: both map pressures you cannot see directly.',
    minutes: 9,
    domain: 'ECONOMICS',
    tag: 'INT',
  },
  {
    date: '2024-10-02',
    title: 'Why PETRONAS Scholar kids owe the country essays, not just years',
    abstract: 'A scholarship is a debt of clarity. Thirteen years in, I am still paying it — in wells and in words.',
    minutes: 8,
    domain: 'PERSONAL',
  },
  {
    date: '2024-07-19',
    title: 'The Makcik test',
    abstract: 'If your AI cannot survive a conversation with a Penang makcik — sceptical, funny, unimpressed — it is not ready.',
    minutes: 7,
    domain: 'MACHINES',
  },
  {
    date: '2024-04-11',
    title: 'Pricing the unpriced: what energy economics misses',
    abstract: 'Markets price barrels beautifully and patience terribly. A double major’s grudge, ten years on.',
    minutes: 10,
    domain: 'ECONOMICS',
    tag: 'INT',
  },
]

const FILTERS: Array<'ALL' | Domain> = ['ALL', 'EARTH', 'ECONOMICS', 'MACHINES', 'PERSONAL']

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-60px' },
}

export function Writing() {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('ALL')

  const essays = useMemo(
    () => ESSAYS.filter((e) => filter === 'ALL' || e.domain === filter),
    [filter],
  )

  return (
    <div className="relative bg-[#FAF7EF] text-[#3E3A30]">
      {/* Decorative pencil margin — right side, desktop only */}
      <div
        aria-hidden
        className="pointer-events-none fixed right-0 top-0 hidden h-full w-[150px] bg-cover bg-left opacity-60 lg:block"
        style={{
          backgroundImage: 'url(/pencil-margin.png)',
          maskImage: 'linear-gradient(to right, transparent, black 40%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)',
        }}
      />

      {/* 1 — HERO */}
      <section className="mx-auto flex min-h-[50vh] max-w-[1280px] flex-col justify-center px-6 py-20">
        <SectionHeader number="05" title="WRITING" />
        <h1 className="mt-10 font-display text-[52px] leading-[0.95] tracking-[-0.02em] text-[#3E3A30] md:text-[72px]">
          {'Essays, in no hurry.'.split(' ').map((w, i) => (
            <motion.span
              key={i}
              className="inline-block"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.5 }}
            >
              {w}&nbsp;
            </motion.span>
          ))}
        </h1>
        <motion.p
          className="mt-8 max-w-[62ch] font-body text-[19px] leading-[1.65] text-[#5C5546]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Long-form pieces on earth, economics, and machines. Written by a person, for
          people. Drafts included — thinking in public means showing the pencil marks.
        </motion.p>
        <motion.p
          className="eyebrow mt-8 text-[#5C5546]/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
        >
          {ESSAYS.length} pieces · updated as they cool
        </motion.p>
      </section>

      {/* 2 — THE INDEX */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <motion.div {...fadeUp}>
          <SectionHeader number="02" title="THE INDEX" />
        </motion.div>

        <div className="mt-10 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`border px-3 py-1.5 font-mono text-[12px] uppercase tracking-[0.04em] transition-colors ${
                filter === f
                  ? 'border-[#5C5546] bg-[#5C5546] text-[#FAF7EF]'
                  : 'border-[#5C5546]/30 text-[#5C5546] hover:border-[#5C5546]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <motion.div layout="position" className="mt-8 border-t border-[#5C5546]/20">
          <AnimatePresence mode="popLayout">
            {essays.map((e, i) => (
              <motion.article
                key={e.title}
                layout="position"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ delay: i * 0.04, duration: 0.35 }}
                className="group border-b border-[#5C5546]/20 py-6"
              >
                <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1">
                  <span className="font-mono text-[13px] tabular-nums tracking-[0.04em] text-[#5C5546]/70">
                    {e.date}
                  </span>
                  <h3 className="font-display text-[26px] leading-tight tracking-[-0.01em] text-[#3E3A30] transition-transform duration-200 group-hover:translate-x-2 md:text-[30px]">
                    <span className="mr-2 inline-block opacity-0 transition-opacity group-hover:opacity-100">
                      ✎
                    </span>
                    {e.title}
                  </h3>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-1 md:pl-[7.5rem]">
                  <p className="max-w-[60ch] font-body text-[16px] leading-[1.6] text-[#5C5546]">
                    {e.abstract}
                  </p>
                  <span className="font-mono text-[12px] uppercase tracking-[0.04em] text-[#5C5546]/60">
                    {e.minutes} min · {e.domain.toLowerCase()}
                  </span>
                  {e.tag && <FactTag kind={e.tag} />}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 3 — 000 GENESIS ARCHIVE */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <motion.div
          {...fadeUp}
          className="relative border border-[#5C5546]/30 bg-[#FAF7EF] p-8 pl-16 transition-transform duration-300 hover:-rotate-1 hover:shadow-[0_20px_50px_-20px_rgba(92,85,70,0.4)] md:p-12 md:pl-24"
        >
          {/* punched binder holes */}
          <div aria-hidden className="absolute left-6 top-0 flex h-full flex-col justify-evenly md:left-9">
            {[0, 1, 2, 3, 4].map((i) => (
              <motion.span
                key={i}
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.12, type: 'spring', stiffness: 400, damping: 15 }}
                className="block h-4 w-4 rounded-full border border-[#5C5546]/40 bg-[#EFEAE0]"
              />
            ))}
          </div>
          <p className="eyebrow text-[#5C5546]/70">/000/</p>
          <h2 className="mt-4 font-display text-[34px] leading-[1] tracking-[-0.02em] text-[#3E3A30] md:text-[44px]">
            000 — The Genesis Archive.
          </h2>
          <p className="mt-5 max-w-[60ch] font-body text-[18px] leading-[1.65] text-[#5C5546]">
            Where the earliest drafts, founding documents, and first principles of arifOS
            live — the raw ore before the forging. Everything on this site started as a
            pencil mark in here.
          </p>
          <a
            href="/000/"
            className="mt-7 inline-block font-mono text-[13px] uppercase tracking-[0.04em] text-[#3E3A30] underline decoration-[#5C5546]/50 underline-offset-8 hover:decoration-[#3E3A30]"
          >
            Enter the archive →
          </a>
        </motion.div>
      </section>

      {/* 4 — HOW I WRITE */}
      <section className="mx-auto max-w-[1280px] px-6 py-20">
        <motion.div {...fadeUp}>
          <SectionHeader number="04" title="HOW I WRITE" />
        </motion.div>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {[
            { n: '01', head: 'DRAFT', line: 'pencil first, badly', gloss: 'The first version is allowed to be wrong. It is not allowed to be hidden.' },
            { n: '02', head: 'COOL', line: 'truth must cool before it rules', gloss: 'Nothing publishes hot. Drafts sit until the heat leaves them.' },
            { n: '03', head: 'SEAL', line: 'publish only what survives', gloss: 'If a sentence cannot survive cooling, it was never true enough.' },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.2, duration: 0.5 }}
              className="border-t border-[#5C5546]/30 pt-5"
            >
              <p className="font-mono text-[13px] tracking-[0.04em] text-[#5C5546]/70">{s.n}</p>
              <p className="mt-2 font-display text-[28px] tracking-[-0.01em] text-[#3E3A30]">{s.head}</p>
              <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.04em] text-[#5C5546]/80">{s.line}</p>
              <p className="mt-4 font-body text-[16px] leading-[1.6] text-[#5C5546]">{s.gloss}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 5 — BRIDGE */}
      <section className="mx-auto max-w-[1280px] px-6 pb-28 pt-8 text-center">
        <motion.p {...fadeUp} className="font-display text-[26px] tracking-[-0.01em] text-[#5C5546]">
          The essays end. The doctrine holds.
        </motion.p>
        <motion.div {...fadeUp} transition={{ delay: 0.15 }}>
          <Link
            to="/doctrine"
            className="mt-4 inline-block font-mono text-[13px] uppercase tracking-[0.04em] text-[#38BDF8] underline decoration-[#38BDF8]/40 underline-offset-8 hover:decoration-[#38BDF8]"
          >
            Continue to Doctrine →
          </Link>
        </motion.div>
      </section>
    </div>
  )
}

export default Writing;
