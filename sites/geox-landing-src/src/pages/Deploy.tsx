import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { User, Landmark, Bot, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { Link } from 'react-router'

const DISPLAY = "font-['Sora',sans-serif]"
const MONO = "font-['JetBrains_Mono',monospace]"
const BODY = "font-['Inter',sans-serif]"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${MONO} text-xs uppercase tracking-[0.18em] text-[#E8733B] mb-4`}>{children}</p>
  )
}

/* ---------------- status board ---------------- */
const STATUS_ROWS = [
  { endpoint: 'GET /health', status: 'LIVE', color: '#5FD68A', base: 12 },
  { endpoint: 'POST /mcp', status: 'PARTIAL', color: '#D9A441', base: 38 },
  { endpoint: 'GET /profile', status: 'LIVE', color: '#5FD68A', base: 9 },
  { endpoint: 'GET /scenarios', status: 'LIVE', color: '#5FD68A', base: 14 },
  { endpoint: 'PORT 8081', status: 'BOUND', color: '#5FD68A', base: 0 },
]

function StatusBoard() {
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setTick((x) => x + 1), 2000)
    return () => clearInterval(t)
  }, [])
  return (
    <div className="rounded-md border border-[#2A2F37] bg-[#111318] overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#2A2F37] bg-[#1A1E24]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E05252]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#D9A441]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#5FD68A]/70" />
        <span className={`${MONO} ml-3 text-[11px] text-[#5C636C]`}>geox:8081 — live status board</span>
      </div>
      <div className="p-4">
        {STATUS_ROWS.map((r, i) => (
          <motion.div
            key={r.endpoint}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
            className="flex items-center justify-between py-2.5 border-b border-[#2A2F37] last:border-0"
          >
            <span className={`${MONO} text-[13px] text-[#EDEAE2]`}>{r.endpoint}</span>
            <span className="flex items-center gap-4">
              <span
                className={`${MONO} inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest`}
                style={{ color: r.color }}
              >
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: r.color }} />
                {r.status}
              </span>
              <span className={`${MONO} text-[11px] text-[#5C636C] tabular-nums w-14 text-right`}>
                {r.base > 0 ? `${r.base + ((tick + i) % 3) - 1}ms` : '—'}
              </span>
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

/* ---------------- doors ---------------- */
const DOORS = [
  {
    icon: User,
    name: 'HUMANS',
    who: 'Analysts, geoscientists, executives.',
    includes: 'Web apps: Basin Explorer, Map Portal, Timeline View.',
    cta: 'ENTER THE SITE →',
    href: '/',
    accent: '#EDEAE2',
    cls: 'border-[#2A2F37] text-[#EDEAE2] hover:border-[#9AA0A8]',
  },
  {
    icon: Landmark,
    name: 'INSTITUTIONS',
    who: 'Ministries, NOCs, funds, regulators.',
    includes: 'Risk Console, Judge Console, Seismic Viewer, Well Context Desk; 888_HOLD, VAULT999 audit exports, deployment support.',
    cta: 'REQUEST INSTITUTIONAL ACCESS →',
    href: '/federation',
    accent: '#D9A441',
    cls: 'border-[#D9A441]/60 text-[#D9A441] hover:shadow-[0_0_24px_#D9A44133]',
  },
  {
    icon: Bot,
    name: 'AGENTIC INTELLIGENCE',
    who: 'LLM clients, agent swarms, A2A organs.',
    includes: 'WebMCP manifest, MCP endpoint, 18 GUI apps, llms.txt.',
    cta: 'CONNECT AN AGENT →',
    href: '/webmcp',
    accent: '#5FD68A',
    cls: 'border-[#5FD68A]/60 text-[#5FD68A] hover:shadow-[0_0_24px_#5FD68A33]',
  },
]

/* ---------------- scenarios ---------------- */
const SCENARIOS = [
  { id: 'SCN-01', name: 'Basin Screening', desc: 'Rank frontier basins from OBS up.', tags: ['SUBSURFACE'] },
  { id: 'SCN-02', name: 'Seismic Review', desc: 'Attribute-driven falsification of a lead.', tags: ['SUBSURFACE'] },
  { id: 'SCN-03', name: 'Flood-Risk Triage', desc: 'Hazard surface, rapid triage.', tags: ['HAZARD', 'TERRAIN'] },
  { id: 'SCN-04', name: 'Route Viability', desc: 'Mobility corridors under terrain constraints.', tags: ['MOBILITY', 'TERRAIN'] },
  { id: 'SCN-05', name: 'Infrastructure Watch', desc: 'Monitoring with escalation states.', tags: ['INFRASTRUCTURE'] },
  { id: 'SCN-06', name: 'Hazard Escalation', desc: 'Full 888_HOLD workflow demo.', tags: ['HAZARD', 'GOVERNANCE'] },
]

function ScenarioRail() {
  const [index, setIndex] = useState(0)
  return (
    <div>
      <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {SCENARIOS.map((s, i) => (
          <motion.div
            key={s.id}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-40px' }}
            onViewportEnter={() => setIndex(i)}
            className="snap-center shrink-0 w-[280px] md:w-[320px] rounded-lg border border-[#2A2F37] bg-[#111318] p-6 hover:border-[#E8733B]/40 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <span className={`${MONO} text-[11px] text-[#D9A441]`}>{s.id}</span>
              <span className={`${MONO} inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#5FD68A]`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#5FD68A] animate-pulse" /> READY
              </span>
            </div>
            <h3 className={`${DISPLAY} text-xl font-bold mb-2`}>{s.name}</h3>
            <p className="text-sm text-[#9AA0A8] leading-relaxed mb-5">{s.desc}</p>
            <div className="flex flex-wrap gap-2">
              {s.tags.map((t) => (
                <span
                  key={t}
                  className={`${MONO} text-[10px] uppercase tracking-widest border border-[#2A2F37] rounded px-2 py-0.5 text-[#5C636C]`}
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
      <div className={`${MONO} mt-2 text-[11px] text-[#5C636C] flex items-center gap-2`}>
        <ChevronLeft className="w-3.5 h-3.5" /> scroll — {Math.min(index + 1, 6)} / 06 <ChevronRight className="w-3.5 h-3.5" />
      </div>
    </div>
  )
}

/* ---------------- topology ---------------- */
const TOPO_LINES = [
  '                 ┌─────────────┐',
  '   SITE/WebMCP ─▶│             │──▶ arifOS :8088   (constitution)',
  '   MCP clients ─▶│  GEOX :8081 │──▶ AAA :3001      (A2A control)',
  '   A2A organs ─▶ │             │──▶ WEALTH :18082  (EMV)',
  '                 └──────┬──────┘',
  '                        ▼',
  '               VAULT999 ledger sidecar (sealed)',
]

const FACTS = [
  'Stateless core — scale horizontally behind the gateway',
  'Sealed ledger sidecar — immutable decision history',
  'SSE transport — streams to any MCP client',
  'Governed by AAA :3001 — constitution enforced by arifOS :8088',
  'License: BSL-1.1 → Apache 2.0 (2029-06-29)',
]

/* ---------------- page ---------------- */
export default function Deploy() {
  return (
    <div className={`${BODY} bg-[#0A0B0D] text-[#EDEAE2] min-h-[100dvh]`}>
      {/* Hero + status */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <Eyebrow>DEPLOYMENT // CIVILIZATION-GRADE</Eyebrow>
          <h1 className={`${DISPLAY} text-[42px] md:text-[64px] font-extrabold leading-[1.02] tracking-[-0.02em] mb-6`}>
            Ready for humans, institutions, and agents.
          </h1>
          <p className="text-[15px] md:text-[17px] leading-[1.65] text-[#9AA0A8] max-w-xl">
            GEOX ships as a service, a manifest, and a set of governed apps. Pick your surface; the
            constitution travels with it.
          </p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.9 }}>
          <StatusBoard />
        </motion.div>
      </section>

      {/* Three doors */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-t border-[#2A2F37]">
        <Eyebrow>THREE DOORS</Eyebrow>
        <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-12`}>
          Choose your surface.
        </h2>
        <div className="grid md:grid-cols-3 gap-5">
          {DOORS.map((d, i) => (
            <motion.div
              key={d.name}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="rounded-lg border border-[#2A2F37] bg-[#111318] p-7 flex flex-col hover:-translate-y-1 transition-transform"
            >
              <d.icon className="w-6 h-6 mb-5" style={{ color: d.accent }} />
              <h3 className={`${DISPLAY} text-2xl font-bold mb-2`}>{d.name}</h3>
              <p className="text-sm text-[#EDEAE2] mb-1">{d.who}</p>
              <p className="text-sm text-[#9AA0A8] leading-relaxed mb-8 flex-1">{d.includes}</p>
              <Link
                to={d.href}
                className={`${MONO} inline-flex items-center justify-center gap-2 text-[11px] uppercase tracking-widest border rounded px-4 py-2.5 transition-shadow ${d.cls}`}
              >
                {d.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Scenarios */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-t border-[#2A2F37]">
        <Eyebrow>SCENARIO GALLERY</Eyebrow>
        <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-12`}>
          Six governed scenarios.
        </h2>
        <ScenarioRail />
      </section>

      {/* Topology */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-t border-[#2A2F37]">
        <Eyebrow>DEPLOY TOPOLOGY</Eyebrow>
        <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-12`}>
          One organ, wired to the federation.
        </h2>
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          <pre className={`${MONO} text-[12px] md:text-[13px] leading-relaxed text-[#9AA0A8] bg-[#111318] border border-[#2A2F37] rounded-md p-6 overflow-x-auto`}>
            {TOPO_LINES.join('\n')}
          </pre>
          <ul>
            {FACTS.map((f, i) => (
              <motion.li
                key={f}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                className="flex gap-3 items-baseline py-3 border-b border-[#2A2F37] last:border-0 text-sm text-[#9AA0A8]"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#E8733B] shrink-0 translate-y-[-2px]" />
                {f}
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* License */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-t border-[#2A2F37]">
        <div className="grid lg:grid-cols-2 gap-12">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
            <Eyebrow>LICENSE &amp; LONGEVITY</Eyebrow>
            <h2 className={`${DISPLAY} text-3xl md:text-4xl font-bold leading-[1.1] mb-6`}>
              Business Source License 1.1 today.
            </h2>
            <p className={`${DISPLAY} text-5xl md:text-6xl font-extrabold text-[#D9A441] mb-4`}>2029-06-29</p>
            <p className="text-[15px] md:text-[17px] leading-[1.65] text-[#9AA0A8]">
              <span className="text-[#EDEAE2] font-medium">Apache 2.0 on 2029-06-29.</span> Built to
              outlive its own restrictions.
            </p>
          </motion.div>
          <div>
            {[
              'Marmousi-built, Volve-validated — benchmarks that outlast marketing.',
              'Immutable decision history — every seal in VAULT999, forever auditable.',
              'Federation governance — no single operator can rewrite the constitution.',
            ].map((c, i) => (
              <motion.p
                key={c}
                variants={fadeUp}
                custom={i}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, margin: '-40px' }}
                className="py-4 border-b border-[#2A2F37] last:border-0 text-sm text-[#9AA0A8] leading-relaxed"
              >
                {c}
              </motion.p>
            ))}
            <p className={`${MONO} mt-6 text-[11px] uppercase tracking-[0.18em] text-[#5C636C]`}>
              DITEMPA BUKAN DIBERI — truth must cool before it rules.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[#2A2F37]">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          className="max-w-[1280px] mx-auto px-5 md:px-8 py-24 md:py-32 text-center"
        >
          <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-10`}>
            The Earth is waiting to be read properly.
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/webmcp"
              className={`${MONO} inline-flex items-center gap-2 text-[11px] uppercase tracking-widest bg-[#E8733B] text-[#0A0B0D] px-5 py-2.5 rounded font-semibold hover:shadow-[0_0_24px_#E8733B55] transition-shadow`}
            >
              GET ACCESS <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <a
              href="/llms.txt"
              target="_blank"
              rel="noreferrer"
              className={`${MONO} inline-flex items-center gap-2 text-[11px] uppercase tracking-widest border border-[#2A2F37] px-5 py-2.5 rounded text-[#9AA0A8] hover:text-[#5FD68A] hover:border-[#5FD68A]/50 transition-colors`}
            >
              READ LLMS.TXT
            </a>
          </div>
        </motion.div>
      </section>
    </div>
  )
}
