import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const FLOORS = [
  { code: 'F1', name: 'AMANAH', plain: "Reversibility — don't do what can't be undone.", tech: 'Irreversible actions require explicit human authorization before execution.' },
  { code: 'F2', name: 'TRUTH', plain: 'Say only what you can stand behind.', tech: 'Every claim carries a confidence tag: observed, derived, interpretation, or speculative.' },
  { code: 'F3', name: 'WITNESS', plain: 'Tri-witness — claims need corroboration.', tech: 'Load-bearing claims require three independent sources before they are treated as fact.' },
  { code: 'F4', name: 'CLARITY', plain: "If it isn't clear, it isn't said.", tech: 'Ambiguous output is a failure state, not a style choice. Rewrite or stop.' },
  { code: 'F5', name: 'PEACE', plain: 'Do no harm; lower the temperature.', tech: 'Responses are scored for escalation risk; the system de-escalates by default.' },
  { code: 'F6', name: 'EMPATHY', plain: 'Model the human on the other side.', tech: 'The system estimates the reader’s state and context before choosing tone and content.' },
  { code: 'F7', name: 'HUMILITY', plain: 'Know the edge of what you know.', tech: 'Out-of-distribution questions trigger explicit uncertainty, not confident guessing.' },
  { code: 'F8', name: 'GENIUS', plain: 'Excellence within the floors, never around them.', tech: 'Cleverness that routes around a floor is logged as a violation, not a feature.' },
  { code: 'F9', name: 'ANTI-HANTU', plain: 'Never claim consciousness or personhood.', tech: 'The machine must not present itself as alive, feeling, or owed moral standing.' },
  { code: 'F10', name: 'ONTOLOGY', plain: 'Use words for what things actually are.', tech: 'Terms map to real referents; no metaphor is allowed to masquerade as mechanism.' },
  { code: 'F11', name: 'AUTH', plain: 'Verify who is asking.', tech: 'Privileged actions require authenticated identity and scoped permissions.' },
  { code: 'F12', name: 'INJECTION', plain: 'Resist hostile instructions.', tech: 'Untrusted input can never rewrite the floors; prompt injection fails closed.' },
  { code: 'F13', name: 'SOVEREIGN', plain: 'The human veto is absolute.', tech: 'Any human in authority can halt, override, or roll back the system at any time.' },
]

const TOOLS = [
  { name: 'arif_init', plain: 'Start a governed session.', tech: 'Loads the floors, fixes identity, opens a sealed session log.' },
  { name: 'arif_observe', plain: 'Look before anything else.', tech: 'Collects inputs and tags each with its confidence class.' },
  { name: 'arif_think', plain: 'Reason inside the floors.', tech: 'Deliberation trace checked against all 13 floors before use.' },
  { name: 'arif_route', plain: 'Decide what happens next.', tech: 'Routes work to the right organ — MIND, BODY, EARTH, CAPITAL, VITALITY.' },
  { name: 'arif_memory', plain: 'Remember what was sealed.', tech: 'Reads and writes only sealed, witness-checked records.' },
  { name: 'arif_judge', plain: 'Weigh the verdict.', tech: 'Scores outcomes against the floors; hot verdicts cool before they rule.' },
  { name: 'arif_forge', plain: 'Build the artifact.', tech: 'Produces code, documents, and plans with provenance attached.' },
  { name: 'arif_seal', plain: 'Seal the verdict.', tech: 'Signs the final output: who decided, on what evidence, under which floors.' },
]

const ORGANS = [
  { name: 'arifOS', role: 'MIND', plain: 'The constitutional kernel — it thinks and judges.' },
  { name: 'AAA', role: 'BODY', plain: 'The control plane — it acts, under the floors.' },
  { name: 'GEOX', role: 'EARTH', plain: 'Geoscience work — wells, basins, seismic.' },
  { name: 'WEALTH', role: 'CAPITAL', plain: 'Economics work — pricing, ledgers, risk.' },
  { name: 'WELL', role: 'VITALITY', plain: 'Health of the system itself — signals and uptime of trust.' },
  { name: 'A-FORGE', role: 'EXECUTION SHELL', plain: 'The forge where sealed plans become real artifacts.' },
]

function TerminalLine() {
  const full = '> arif_init … floors loaded F1–F13 … OK'
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= full.length) return
    const id = setTimeout(() => setN(n + 1), 40)
    return () => clearTimeout(id)
  }, [n])
  return (
    <p className="mt-8 font-mono text-[13px] tracking-[0.04em] text-cold/80">
      {full.slice(0, n)}
      <span className="animate-pulse">▌</span>
    </p>
  )
}

export function Doctrine() {
  const [open, setOpen] = useState<number | null>(0)
  const [litFloors, setLitFloors] = useState(0)

  useEffect(() => {
    if (litFloors >= 13) return
    const id = setTimeout(() => setLitFloors(litFloors + 1), 120)
    return () => clearTimeout(id)
  }, [litFloors])

  return (
    <div className="bg-obsidian text-[#C8D8E8]">
      {/* 1 — HERO */}
      <section className="relative mx-auto flex min-h-[90vh] max-w-[1280px] flex-col items-center gap-12 px-6 py-20 lg:flex-row">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage:
              'linear-gradient(#7DD3FC 1px, transparent 1px), linear-gradient(90deg, #7DD3FC 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div className="relative w-full lg:w-[55%]">
          <p className="eyebrow text-cold">06 ————— DOCTRINE · arifOS v2026.08.01</p>
          <h1 className="mt-8 font-display text-[48px] leading-[0.95] tracking-[-0.02em] text-[#F0F6FC] md:text-[84px]">
            {'Truth must cool before it rules.'.split(' ').map((w, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0, y: 20, color: '#7DD3FC' }}
                animate={{ opacity: 1, y: 0, color: '#F0F6FC' }}
                transition={{ delay: 0.2 + i * 0.09, duration: 0.6 }}
              >
                {w}&nbsp;
              </motion.span>
            ))}
          </h1>
          <motion.p
            className="mt-8 max-w-[58ch] font-body text-[20px] leading-[1.65] text-[#C8D8E8]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
          >
            arifOS is a constitution for AI systems. Thirteen floors a machine may not
            break — and if it cannot answer honestly, it must stop. A human always holds
            the veto.
          </motion.p>
          <TerminalLine />
        </div>
        <div className="relative w-full max-w-[380px] lg:w-[45%]">
          <img
            src="/floors-wireframe.svg"
            alt="Wireframe of the 13 constitutional floors, F1 to F13"
            className="w-full"
            style={{
              clipPath: `inset(${100 - (litFloors / 13) * 100}% 0 0 0)`,
              transition: 'clip-path 0.12s steps(1)',
              filter: 'drop-shadow(0 0 24px rgba(125,211,252,0.25))',
            }}
          />
          <p className="mt-3 text-center font-mono text-[12px] tracking-[0.04em] text-cold/60">
            THE TOWER — F1 AT THE FOUNDATION, F13 AT THE CROWN
          </p>
        </div>
      </section>

      {/* 2 — 13 FLOORS */}
      <section className="mx-auto max-w-[1280px] px-6 py-24">
        <div className="flex items-center gap-4">
          <span className="eyebrow text-[#F0F6FC]">02</span>
          <span aria-hidden className="h-px flex-1 bg-[#7DD3FC]/20" />
          <span className="eyebrow text-[#9DB4C8]">THE 13 CONSTITUTIONAL FLOORS</span>
        </div>
        <p className="mt-6 max-w-[62ch] font-body text-[18px] leading-[1.65] text-[#9DB4C8]">
          Plain language first — because a constitution nobody can read is just decoration.
          Click any floor for the technical gloss.
        </p>
        <div className="mt-10 border-t border-[#7DD3FC]/15">
          {FLOORS.map((f, i) => (
            <motion.div
              key={f.code}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.03, duration: 0.35 }}
              className="border-b border-[#7DD3FC]/15"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="flex w-full items-baseline gap-5 py-5 text-left transition-colors hover:bg-[#0A1118]"
                aria-expanded={open === i}
              >
                <span className={`font-mono text-[14px] tracking-[0.06em] ${open === i ? 'text-cold' : 'text-cold/60'}`}>
                  {f.code}
                </span>
                <span className="w-32 shrink-0 font-mono text-[13px] uppercase tracking-[0.06em] text-[#F0F6FC] md:w-44">
                  {f.name}
                </span>
                <span className="font-body text-[17px] leading-[1.55] text-[#C8D8E8]">{f.plain}</span>
                <span className="ml-auto font-mono text-cold/50">{open === i ? '−' : '+'}</span>
              </button>
              {open === i && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="overflow-hidden pb-5 pl-[3.4rem] pr-8 font-mono text-[13px] leading-[1.7] tracking-[0.02em] text-[#9DB4C8] md:pl-[7.6rem]"
                >
                  <span className="text-cold/70">TECH · </span>
                  {f.tech}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3 — 8 TOOLS */}
      <section className="mx-auto max-w-[1280px] px-6 py-24">
        <div className="flex items-center gap-4">
          <span className="eyebrow text-[#F0F6FC]">03</span>
          <span aria-hidden className="h-px flex-1 bg-[#7DD3FC]/20" />
          <span className="eyebrow text-[#9DB4C8]">THE 8 TOOLS — MCP</span>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="group border border-[#7DD3FC]/20 bg-[#0A1118] p-5 transition-colors hover:border-cold/60"
            >
              <p className="font-mono text-[14px] tracking-[0.04em] text-cold">
                {t.name}
                <span className="ml-1 inline-block h-3 w-2 bg-cold/70 opacity-0 group-hover:animate-pulse group-hover:opacity-100" />
              </p>
              <p className="mt-3 font-body text-[16px] leading-[1.55] text-[#C8D8E8]">{t.plain}</p>
              <p className="mt-3 font-mono text-[12px] leading-[1.6] tracking-[0.02em] text-[#9DB4C8]/80">{t.tech}</p>
            </motion.div>
          ))}
        </div>
        <p className="mt-8 font-mono text-[13px] tracking-[0.04em] text-[#9DB4C8]">
          Public MCP →{' '}
          <a href="https://mcp.arif-fazil.com/mcp" target="_blank" rel="noreferrer" className="text-cold underline decoration-cold/40 underline-offset-4 hover:decoration-cold">
            https://mcp.arif-fazil.com/mcp
          </a>{' '}
          · streamable HTTP ·{' '}
          <a href="https://pypi.org/project/arifos/" target="_blank" rel="noreferrer" className="text-cold underline decoration-cold/40 underline-offset-4 hover:decoration-cold">
            PyPI: arifos
          </a>
        </p>
      </section>

      {/* 4 — FEDERATION */}
      <section className="mx-auto max-w-[1280px] px-6 py-24">
        <div className="flex items-center gap-4">
          <span className="eyebrow text-[#F0F6FC]">04</span>
          <span aria-hidden className="h-px flex-1 bg-[#7DD3FC]/20" />
          <span className="eyebrow text-[#9DB4C8]">THE FEDERATION</span>
        </div>
        <p className="mt-6 max-w-[62ch] font-body text-[18px] leading-[1.65] text-[#9DB4C8]">
          One mind, five organs, one forge. Each organ does one kind of work; every one of
          them answers to the same thirteen floors.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ORGANS.map((o, i) => (
            <motion.div
              key={o.name}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="border border-[#7DD3FC]/20 bg-[#0A1118] p-6 text-center transition-colors hover:border-cold/60"
            >
              <p className="font-display text-[26px] tracking-[-0.01em] text-[#F0F6FC]">{o.name}</p>
              <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.08em] text-cold">{o.role}</p>
              <p className="mt-3 font-body text-[15px] leading-[1.55] text-[#9DB4C8]">{o.plain}</p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 space-y-3 border-t border-[#7DD3FC]/15 pt-8 font-mono text-[13px] leading-[1.9] tracking-[0.04em] text-[#9DB4C8]"
        >
          <p>
            <span className="text-cold">TRINITY</span> — HUMAN arif-fazil.com · THEORY apex.arif-fazil.com · APPS arifos.arif-fazil.com
          </p>
          <p>
            <span className="text-cold">SOURCE</span> — github.com/ariffazil · arifOS · A-FORGE · AAA · GEOX · WEALTH · WELL
          </p>
        </motion.div>
      </section>

      {/* 5 — FOR HUMANS / FOR AGENTS */}
      <section className="mx-auto max-w-[1280px] px-6 py-24">
        <div className="grid gap-4 lg:grid-cols-[3fr_2fr]">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            className="border border-[#7DD3FC]/15 bg-[#F4F0E6] p-8 text-[#14110C] md:p-10"
          >
            <p className="eyebrow text-[#4A443A]">For humans</p>
            <p className="mt-5 font-body text-[18px] leading-[1.65] text-[#4A443A]">
              Here is the whole doctrine in one breath: a machine under this constitution
              may not lie, may not guess when it should stop, may not pretend to be a
              person, and may always be switched off by one. Everything else — the tools,
              the organs, the seals — is engineering in service of that paragraph.
            </p>
            <Link
              to="/999"
              className="mt-6 inline-block font-mono text-[13px] uppercase tracking-[0.04em] text-[#14110C] underline decoration-gold underline-offset-8 hover:decoration-ember"
            >
              See the proof chamber →
            </Link>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            className="border border-[#7DD3FC]/20 bg-[#0A1118] p-8 md:p-10"
          >
            <p className="eyebrow text-cold">For agents</p>
            <div className="mt-5 space-y-2 font-mono text-[13px] tracking-[0.04em] text-[#9DB4C8]">
              <p>/llms.txt</p>
              <p>/.well-known/arifos.json</p>
              <p>/.well-known/did.json</p>
              <p>mcp.arif-fazil.com/mcp</p>
              <p>pypi.org/project/arifos</p>
            </div>
            <p className="mt-6 font-mono text-[12px] leading-[1.6] text-[#9DB4C8]/70">
              Machine-readable, but never machine-first. The human page is the source of
              truth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* bridge to 999 */}
      <section className="mx-auto max-w-[1280px] px-6 pb-28 text-center">
        <p className="font-display text-[26px] tracking-[-0.01em] text-[#9DB4C8]">
          The doctrine claims. The chamber proves.
        </p>
        <Link
          to="/999"
          className="mt-4 inline-block font-mono text-[13px] uppercase tracking-[0.04em] text-gold underline decoration-gold/40 underline-offset-8 hover:decoration-gold"
        >
          Enter 999 →
        </Link>
      </section>
    </div>
  )
}

export default Doctrine;
