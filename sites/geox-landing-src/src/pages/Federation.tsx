import { motion } from 'framer-motion'
import { Mountain, Scale, Stamp } from 'lucide-react'

const DISPLAY = "font-['Sora',sans-serif]"
const MONO = "font-['JetBrains_Mono',monospace]"
const BODY = "font-['Inter',sans-serif]"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${MONO} text-xs uppercase tracking-[0.18em] text-[#E8733B] mb-4`}>{children}</p>
  )
}

/* ---------------- organ table ---------------- */
const ORGANS = [
  { name: 'arifOS', role: 'Constitutional Kernel', port: ':8088' },
  { name: 'A-FORGE', role: 'Governed Execution', port: ':7071/:7072' },
  { name: 'AAA', role: 'Control Plane / A2A', port: ':3001' },
  { name: 'GEOX', role: 'Earth Intelligence', port: ':8081', here: true },
  { name: 'WEALTH', role: 'Capital Intelligence', port: ':18082' },
  { name: 'WELL', role: 'Vitality Guard', port: ':18083' },
  { name: 'HERMES', role: 'Bridge / Telegram', port: ':8644' },
]

/* ---------------- floors ---------------- */
const FLOORS = [
  { id: 'F1', name: 'Amanah', desc: 'Truthfulness in representation.' },
  { id: 'F2', name: 'Non-harm', desc: 'No output may enable destruction.' },
  { id: 'F3', name: 'Evidence', desc: 'Claims require OBS anchoring.' },
  { id: 'F4', name: 'Proportionality', desc: 'Response scale matches stakes.' },
  { id: 'F5', name: 'Transparency', desc: 'Reasoning surfaces are inspectable.' },
  { id: 'F6', name: 'Reversibility', desc: 'Prefer reversible actions.' },
  { id: 'F7', name: 'Humility', desc: 'RASA capped at 0.90.' },
  { id: 'F8', name: 'Consent', desc: 'Human data sovereignty.' },
  { id: 'F9', name: 'Jurisdiction', desc: 'Respect legal boundaries.' },
  { id: 'F10', name: 'Stewardship', desc: 'Intergenerational duty.' },
  { id: 'F11', name: 'Auditability', desc: 'Ledger everything material.' },
  { id: 'F12', name: 'Pluralism', desc: 'No single voice adjudicates.' },
]

/* ---------------- sovereign bridge ---------------- */
const BRIDGE = [
  {
    icon: Mountain,
    word: 'SEDIMENT',
    text: 'The Earth records everything. GEOX reads it without flinching.',
    accent: '#5FD68A',
  },
  {
    icon: Scale,
    word: 'GOVERNANCE',
    text: 'Evidence becomes governed decisions through constitutional floors — not through confidence.',
    accent: '#D9A441',
  },
  {
    icon: Stamp,
    word: 'SOVEREIGNTY',
    text: 'Wealth, health, and territory decisions sealed by sovereign humans, for civilization.',
    accent: '#E8733B',
  },
]

export default function Federation() {
  return (
    <div className={`${BODY} bg-[#0A0B0D] text-[#EDEAE2] min-h-[100dvh]`}>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-[#2A2F37]">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: 'url(/federation-map.png)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0B0D] via-[#0A0B0D]/80 to-[#0A0B0D]/30" />
        <div className="relative max-w-[1280px] mx-auto px-5 md:px-8 py-28 md:py-40">
          <motion.div initial="hidden" animate="show" variants={fadeUp}>
            <Eyebrow>ARIFOS FEDERATION // CONSTITUTIONAL LAYER</Eyebrow>
            <h1 className={`${DISPLAY} text-[42px] md:text-[72px] font-extrabold leading-[1.02] tracking-[-0.02em] mb-6 max-w-3xl`}>
              One constitution. Seven organs.
            </h1>
            <p className="text-[15px] md:text-[17px] leading-[1.65] text-[#9AA0A8] max-w-xl">
              GEOX does not rule alone. It is the Earth Intelligence organ of a federation where
              every decision is witnessed, bounded, and sealed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Organ table */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-t border-[#2A2F37]">
        <Eyebrow>THE ORGAN TABLE</Eyebrow>
        <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-12`}>
          Seven organs, one ledger.
        </h2>
        <div className="rounded-lg border border-[#2A2F37] bg-[#111318] overflow-hidden">
          <div className={`${MONO} hidden md:grid grid-cols-[1fr_2fr_1fr_1fr] gap-4 px-6 py-3 text-[10px] uppercase tracking-[0.18em] text-[#5C636C] border-b border-[#2A2F37]`}>
            <span>ORGAN</span><span>ROLE</span><span>PORT</span><span>STATUS</span>
          </div>
          {ORGANS.map((o, i) => (
            <motion.div
              key={o.name}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className={`grid md:grid-cols-[1fr_2fr_1fr_1fr] gap-1 md:gap-4 px-6 py-4 border-b border-[#2A2F37] last:border-0 items-center transition-colors hover:bg-[#1A1E24] ${
                o.here ? 'border-l-2 border-l-[#E8733B] bg-[#E8733B]/[0.04]' : 'border-l-2 border-l-transparent'
              }`}
            >
              <span className={`${MONO} text-sm font-semibold ${o.here ? 'text-[#E8733B]' : 'text-[#EDEAE2]'}`}>
                {o.name}
                {o.here && (
                  <span className={`${MONO} ml-2 text-[9px] uppercase tracking-widest text-[#5C636C]`}>you are here</span>
                )}
              </span>
              <span className="text-sm text-[#9AA0A8]">{o.role}</span>
              <span className={`${MONO} text-sm text-[#D9A441]`}>{o.port}</span>
              <span className={`${MONO} inline-flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-[#5FD68A]`}>
                <span className="w-1.5 h-1.5 rounded-full bg-[#5FD68A] animate-pulse" /> LIVE
              </span>
            </motion.div>
          ))}
          <div className={`${MONO} px-6 py-3 text-[11px] text-[#5C636C] bg-[#0A0B0D]`}>
            arif-fazil.com · arifos.arif-fazil.com
          </div>
        </div>
      </section>

      {/* Floors */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-t border-[#2A2F37]">
        <Eyebrow>CONSTITUTIONAL FLOORS F1–F13</Eyebrow>
        <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-12`}>
          The floors no organ may break.
        </h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {FLOORS.map((f, i) => (
            <motion.div
              key={f.id}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="rounded-lg border border-[#2A2F37] bg-[#111318] p-5 hover:border-[#D9A441]/50 transition-colors"
            >
              <span className={`${MONO} text-sm font-semibold text-[#D9A441]`}>{f.id}</span>
              <h3 className={`${DISPLAY} text-lg font-bold mt-1 mb-1.5`}>{f.name}</h3>
              <p className="text-sm text-[#9AA0A8] leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 1.05, y: 40 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.7, delay: FLOORS.length * 0.08, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-lg border border-[#E05252]/60 bg-gradient-to-br from-[#E05252]/10 to-[#E8733B]/10 p-5 sm:col-span-2 shadow-[0_0_40px_#E0525222]"
          >
            <div className="flex items-center justify-between">
              <span className={`${MONO} text-sm font-semibold text-[#E05252]`}>F13</span>
              <span className={`${MONO} text-[10px] uppercase tracking-[0.18em] text-[#E05252] border border-[#E05252]/50 rounded px-2 py-0.5`}>
                LOAD-BEARING
              </span>
            </div>
            <h3 className={`${DISPLAY} text-xl font-bold mt-1 mb-1.5`}>Sovereign Human Veto</h3>
            <p className="text-sm text-[#9AA0A8] leading-relaxed">
              888_HOLD — a human can always stop it. The floor on which all other floors stand.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Sovereign Bridge */}
      <section className="border-t border-[#2A2F37]">
        <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20">
          <Eyebrow>THE SOVEREIGN BRIDGE</Eyebrow>
          <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-4`}>
            Sediment → Governance → Sovereignty.
          </h2>
        </div>
        {BRIDGE.map((p, i) => (
          <motion.div
            key={p.word}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-100px' }}
            variants={fadeUp}
            className="border-t border-[#2A2F37] relative overflow-hidden"
          >
            <div className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 md:py-28 flex flex-col md:flex-row md:items-center gap-8">
              <p.icon className="w-10 h-10 shrink-0" style={{ color: p.accent }} />
              <div>
                <h3
                  className={`${DISPLAY} text-[56px] md:text-[110px] font-extrabold leading-none tracking-[-0.02em]`}
                  style={{ color: p.accent }}
                >
                  {p.word}
                </h3>
                <p className="text-[15px] md:text-[17px] leading-[1.65] text-[#9AA0A8] max-w-xl mt-4">{p.text}</p>
              </div>
              <span className={`${MONO} md:ml-auto text-xs text-[#5C636C]`}>{`0${i + 1} / 03`}</span>
            </div>
            <div className="absolute bottom-0 left-0 h-px" style={{ width: `${((i + 1) / 3) * 100}%`, background: p.accent }} />
          </motion.div>
        ))}
      </section>

      {/* Creed */}
      <section className="border-t border-[#2A2F37]">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
          className="max-w-[1280px] mx-auto px-5 md:px-8 py-28 md:py-40 text-center"
        >
          <h2
            className={`${DISPLAY} italic text-4xl md:text-6xl font-bold mb-6`}
            style={{ textShadow: '0 0 40px #E8733B44' }}
          >
            DITEMPA BUKAN DIBERI
          </h2>
          <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#E8733B] to-transparent mx-auto mb-6" />
          <p className="text-[15px] md:text-[17px] text-[#9AA0A8] mb-4">
            Forged, not given. Truth must cool before it rules.
          </p>
          <p className={`${MONO} text-[11px] uppercase tracking-[0.18em] text-[#5C636C]`}>
            Ω₀ ≈ 0.04 · SEALED · AAA-GRADE
          </p>
        </motion.div>
      </section>
    </div>
  )
}
