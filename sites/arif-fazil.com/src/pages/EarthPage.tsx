import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import BucketStrip from '@/components/BucketStrip'
import MCPGateway from '@/components/MCPGateway'
import SectionHeader from '@/components/SectionHeader'

const earthSubnav = [
  { label: 'Dynamic Planet', href: '/earth/',        desc: 'Interactive Macrostrat globe — plate tectonics, earthquakes, deep time', external: true },
  { label: 'GEOX Cockpit',   href: '/geox/cockpit/',  desc: 'GEOX platform — seismic viewer, well context desk, webmcp', external: true },
  { label: 'Well Portfolio', href: '/work/wells/',    desc: 'Four exploration wells. Four flows. The record, plainly.', external: false },
  { label: 'GEOX Theory',    href: '/geox/theory/',   desc: 'Malay Basin & Sabah seismic theory — amplitude envelope, edge maps', external: true },
  { label: 'GEOX Tools',     href: '/geox/tools/',    desc: 'MCP tool catalog — petrophysics, basin, seismic, prospect', external: true },
] as const

const stats = [
  { n: 13, label: 'Years geoscience', unit: 'at PETRONAS' },
  { n: 4, label: 'Wells led', unit: '4/4 flowed' },
  { n: 2, label: 'Basins', unit: 'Malay + Sabah' },
  { n: 1, label: 'GEOX organ', unit: 'physics-gated' },
] as const

const pulseItems = [
  { label: 'GEOX /health', href: 'https://geox.arif-fazil.com/health', external: true },
  { label: 'GEOX MCP tools', href: 'https://geox.arif-fazil.com/mcp', external: true },
  { label: 'Well desk', href: '/geox/viewer/', external: true },
  { label: 'Seismic viewer', href: '/geox/cockpit/seismic_viewer/', external: true },
  { label: 'Macrostrat globe', href: '/earth/', external: true },
]

export default function EarthPage() {
  return (
    <div className="relative min-h-screen" style={{ background: '#0A1210', color: '#EDEAE2' }}>
      {/* ── HERO — deep earth with amber accent ── */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(ellipse at 30% 20%, rgba(212,168,83,0.15) 0%, transparent 50%), radial-gradient(ellipse at 70% 60%, rgba(26,90,60,0.12) 0%, transparent 50%)'
        }} />
        <div className="relative mx-auto max-w-[1280px] px-6 py-20 md:py-28">
          {/* 5-bucket nav strip */}
          <div className="mb-12">
            <BucketStrip current="Earth" />
          </div>

          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-amber-400/80">
            PHYSICS-GATED EARTH INTELLIGENCE
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-4 font-display text-[clamp(40px,8vw,80px)] leading-[0.95] tracking-[-0.02em]"
            style={{ color: '#D4A853' }}
          >
            EARTH
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-4 max-w-[48ch] font-body text-[19px] leading-[1.6] text-[#7A9080]"
          >
            Evidence before narrative. Every geological claim must survive physics. 
            GEOX computes, arifOS judges, the rocks have the final word.
          </motion.p>

          {/* Stat bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-[#2A3A30] md:grid-cols-4"
            style={{ background: '#2A3A30' }}
          >
            {stats.map((s) => (
              <div key={s.label} className="flex flex-col justify-center px-6 py-5" style={{ background: '#0D1A15' }}>
                <div className="font-mono text-3xl tabular-nums font-bold tracking-[-0.02em] md:text-4xl" style={{ color: '#D4A853' }}>
                  {s.n}
                </div>
                <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.04em] text-[#7A9080]">{s.label}</div>
                <div className="mt-0.5 font-mono text-[10px] text-[#7A9080]/60">{s.unit}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── GEOX SUB-NAV ── */}
      <section className="border-t" style={{ borderColor: '#2A3A30' }}>
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <SectionHeader number="01" title="GEOX SURFACES" />
          <p className="mt-2 mb-8 max-w-[52ch] font-body text-[16px] leading-[1.6] text-[#7A9080]">
            Every GEOX surface is compute-only. The organ computes evidence. The kernel judges. 
            The sovereign decides.
          </p>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {earthSubnav.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                {s.external ? (
                  <a
                    href={s.href}
                    className="group flex flex-col gap-2 rounded-md border p-5 transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,168,83,0.1)]"
                    style={{ borderColor: '#2A3A30', background: '#0D1A15' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#D4A853'
                      e.currentTarget.style.background = '#111F1A'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#2A3A30'
                      e.currentTarget.style.background = '#0D1A15'
                    }}
                  >
                    <span className="font-mono text-[13px] font-medium uppercase tracking-[0.04em] text-[#D4A853] transition-transform group-hover:translate-x-1">{s.label} ↗</span>
                    <span className="font-body text-[14px] leading-[1.5] text-[#7A9080]">{s.desc}</span>
                  </a>
                ) : (
                  <Link
                    to={s.href}
                    className="group flex flex-col gap-2 rounded-md border p-5 transition-all duration-200 hover:shadow-[0_0_20px_rgba(212,168,83,0.1)]"
                    style={{ borderColor: '#2A3A30', background: '#0D1A15' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#D4A853'
                      e.currentTarget.style.background = '#111F1A'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#2A3A30'
                      e.currentTarget.style.background = '#0D1A15'
                    }}
                  >
                    <span className="font-mono text-[13px] font-medium uppercase tracking-[0.04em] text-[#D4A853] transition-transform group-hover:translate-x-1">{s.label} →</span>
                    <span className="font-body text-[14px] leading-[1.5] text-[#7A9080]">{s.desc}</span>
                  </Link>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE PULSE ── */}
      <section className="border-t" style={{ borderColor: '#2A3A30' }}>
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <SectionHeader number="02" title="LIVE PULSE" />
          <div className="mt-8 flex flex-wrap gap-2">
            {pulseItems.map((p) => (
              <a
                key={p.label}
                href={p.href}
                target={p.external ? '_blank' : undefined}
                rel={p.external ? 'noreferrer' : undefined}
                className="inline-flex items-center gap-2 rounded-sm border px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.04em] transition-all duration-200"
                style={{ borderColor: '#2A3A30', color: '#7A9080' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#D4A853'; e.currentTarget.style.color = '#D4A853' }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2A3A30'; e.currentTarget.style.color = '#7A9080' }}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: '#D4A853' }} />
                {p.label} {p.external ? '↗' : '→'}
              </a>
            ))}
          </div>
          <p className="mt-6 font-mono text-[11px] text-[#7A9080]/50">
            GEOX is a COMPUTE_ONLY organ. Compute evidence, route to arifOS for judgment, await sovereign decision.
          </p>
        </div>
      </section>

      {/* ── DYNAMIC PLANET ── */}
      <section className="border-t" style={{ borderColor: '#2A3A30' }}>
        <div className="mx-auto max-w-[1280px] px-6 py-16">
          <a
            href="/earth/"
            className="group relative block overflow-hidden rounded-md border p-8 transition-all duration-300 md:p-12"
            style={{ borderColor: '#2A3A30', background: '#0D1A15' }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#D4A853' }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#2A3A30' }}
          >
            <h2 className="font-display text-[32px] leading-[1.05] tracking-[-0.02em] transition-colors group-hover:text-[#D4A853] md:text-[44px]">
              The Dynamic Planet →
            </h2>
            <p className="mt-3 max-w-[52ch] font-body text-[17px] leading-[1.6] text-[#7A9080]">
              Interactive globe built with globe.gl and Macrostrat data. 
              Tectonic plates, earthquakes, deep-time paleogeography. 
              The earth is not decorative — it is evidence.
            </p>
            <div aria-hidden className="absolute -right-8 -top-8 h-48 w-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #D4A853, transparent 70%)' }} />
          </a>
        </div>
      </section>
      <MCPGateway />
    </div>
  )
}
