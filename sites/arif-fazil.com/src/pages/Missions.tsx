import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BucketStrip from '@/components/BucketStrip';
import MCPGateway from '@/components/MCPGateway';
import { MISSIONS, MISSION_DOCTRINE } from '@/data/missions';

/**
 * /work — WORK bucket. Missions cockpit + proof chamber + forge.
 * Humans land here. Machines read /missions.json.
 */
export function Missions() {
  useEffect(() => {
    document.title = 'WORK — Missions · Proof · Forge · Arif Fazil';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen"
      style={{ background: '#0A0A0C', color: '#EDEAE2' }}
    >
      {/* ── WORK HERO ── */}
      <section className="relative overflow-hidden border-b" style={{ borderColor: '#2A2A30' }}>
        <div aria-hidden className="absolute inset-0 opacity-15" style={{
          background: 'radial-gradient(ellipse at 60% 30%, rgba(212,168,83,0.2) 0%, transparent 50%), radial-gradient(ellipse at 40% 70%, rgba(228,87,46,0.1) 0%, transparent 50%)'
        }} />
        <div className="relative mx-auto max-w-[1280px] px-6 py-20 md:py-28">
          <div className="mb-12">
            <BucketStrip current="Work" />
          </div>
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-amber-400/80">
            COCKPIT · NOT ENGINE ROOM
          </p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mt-4 font-display text-[clamp(40px,8vw,80px)] leading-[0.95] tracking-[-0.02em]"
            style={{ color: '#D4A853' }}
          >
            WORK
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-4 max-w-[48ch] font-body text-[19px] leading-[1.6] text-[#7A7880]"
          >
            {MISSION_DOCTRINE.thesis}
          </motion.p>
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: 'Missions', to: '/work/missions/', href: '', color: '#E4572E', external: false },
              { label: 'Proof Chamber', to: '/work/proof/', href: '', color: '#9AA0A8', external: false },
              { label: 'Resume', to: '/work/resume/', href: '', color: '#D4A853', external: false },
              { label: 'Well Portfolio', to: '/work/wells/', href: '', color: '#D4A853', external: false },
              { label: 'A-FORGE', to: '', href: 'https://forge.arif-fazil.com/', color: '#E4572E', external: true },
            ].map((b) => (
              b.external ? (
                <a key={b.label} href={b.href} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-sm border px-4 py-2.5 font-mono text-[13px] font-medium uppercase tracking-[0.04em] transition-all duration-200"
                  style={{ borderColor: 'rgba(237,234,226,0.15)', color: '#7A7880' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = b.color; e.currentTarget.style.color = b.color }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(237,234,226,0.15)'; e.currentTarget.style.color = '#7A7880' }}
                >
                  {b.label} ↗
                </a>
              ) : (
                <Link key={b.label} to={b.to}
                  className="inline-flex items-center gap-2 rounded-sm border px-4 py-2.5 font-mono text-[13px] font-medium uppercase tracking-[0.04em] transition-all duration-200"
                  style={{ borderColor: 'rgba(237,234,226,0.15)', color: '#7A7880' }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = b.color; e.currentTarget.style.color = b.color }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(237,234,226,0.15)'; e.currentTarget.style.color = '#7A7880' }}
                >
                  {b.label} →
                </Link>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ── SIX MISSIONS ── */}
      <section className="py-16 border-b" style={{ borderColor: '#2A2A30' }} aria-label="Six missions">
        <div className="mx-auto max-w-[1280px] px-6">
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-[#7A7880] mb-6">
            SIX VERBS — INVESTIGATE · INTERPRET · DECIDE · BUILD · MONITOR · REMEMBER
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MISSIONS.map((m) => (
              <article
                key={m.id}
                id={m.id}
                className="group rounded-md border p-6 transition-all duration-200 hover:border-amber-400/40"
                style={{ borderColor: '#2A2A30', background: '#111116' }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-mono text-[11px] uppercase tracking-[0.08em] text-[#7A7880] mb-1">{m.id}</p>
                    <h2 className="text-2xl font-bold uppercase tracking-[-0.01em] text-[#EDEAE2] group-hover:text-[#D4A853] transition-colors">{m.verb}</h2>
                  </div>
                  <span className="font-mono text-[11px] text-[#D4A853]">{m.oneLine}</span>
                </div>
                <p className="mt-3 font-body text-[15px] leading-[1.55] text-[#7A7880]">
                  <span className="text-[#9AA0A8]">You ask: </span>{m.humanSays}
                </p>
                <p className="mt-1 font-body text-[14px] leading-[1.5] text-[#7A7880]/70">
                  <span className="text-[#9AA0A8]">Federation: </span>{m.federationDoes}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                  <span className="font-mono text-[10px] uppercase tracking-[0.06em] text-[#7A7880]/50">
                    {m.organs.join(' · ')}
                  </span>
                </div>
                <nav aria-label={`${m.verb} surfaces`} className="mt-3 flex flex-wrap gap-x-3 gap-y-1">
                  {m.surfaces.map((s) =>
                    s.href.startsWith('http') ? (
                      <a key={s.href} href={s.href} target="_blank" rel="noreferrer"
                        className="font-mono text-[12px] text-[#D4A853] hover:text-[#EDEAE2] transition-colors">
                        {s.label} ↗
                      </a>
                    ) : (
                      <Link key={s.href} to={s.href ?? '/'}
                        className="font-mono text-[12px] text-[#D4A853] hover:text-[#EDEAE2] transition-colors">
                        {s.label} →
                      </Link>
                    ),
                  )}
                </nav>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <section className="py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <p className="font-mono text-[11px] text-[#7A7880]/50">
            Sealed {MISSION_DOCTRINE.sealed} · This page classifies intent. Agents route. arifOS judges. Arif decides.
          </p>
        </div>
      </section>
      <MCPGateway />
    </motion.div>
  );
}
