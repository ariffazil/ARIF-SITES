import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useNow } from '@/hooks/useNow'

type Status = 'SEALED' | 'UNSEALED' | 'REFUTED'

interface Claim {
  claim: string
  status: Status
  tag: 'OBS' | 'SPEC'
  evidence: string
  href?: string
  note?: string
}

const CLAIMS: Claim[] = [
  {
    claim: '13 years at PETRONAS (2013–present), exploration geoscientist',
    status: 'SEALED',
    tag: 'OBS',
    evidence: 'Public record · career history',
  },
  {
    claim: 'BEKANTAN-1 — shallowest flowing oil discovery in the Malay Basin',
    status: 'SEALED',
    tag: 'OBS',
    evidence: 'Malay Basin scope · well record',
  },
  {
    claim: 'Every exploration well he has led has flowed',
    status: 'SEALED',
    tag: 'OBS',
    evidence: 'Well ledger · /earth',
    href: '/earth',
  },
  {
    claim: 'arifOS v2026.08.01 — 13 Constitutional Floors, 8 MCP tools',
    status: 'SEALED',
    tag: 'OBS',
    evidence: 'PyPI · GitHub · MCP registry',
    href: 'https://pypi.org/project/arifos/',
  },
  {
    claim: '$750M scenario — labelled simulation',
    status: 'UNSEALED',
    tag: 'SPEC',
    evidence: 'Speculative by design — never presented as fact',
  },
  {
    claim: '“PETRONAS collapse” — claim found circulating online',
    status: 'REFUTED',
    tag: 'OBS',
    evidence: 'Not supported by any record. Never print it.',
  },
]

const ARTIFACTS = [
  {
    name: '/.well-known/did.json',
    href: '/.well-known/did.json',
    plain: 'did:web:arif-fazil.com — this file tells machines who I am, in a format they can check.',
  },
  {
    name: '/.well-known/arifos.json',
    href: '/.well-known/arifos.json',
    plain: 'The federation manifest: organs, trinity, and the version of the constitution.',
  },
  {
    name: '/llms.txt',
    href: '/llms.txt',
    plain: 'Plain instructions for language models visiting this site — human-written.',
  },
  {
    name: 'mcp.arif-fazil.com/mcp',
    href: 'https://mcp.arif-fazil.com/mcp',
    plain: 'The public MCP endpoint: the 8 tools, governed by the 13 floors, open to inspection.',
  },
  {
    name: 'pypi.org/project/arifos',
    href: 'https://pypi.org/project/arifos/',
    plain: 'The arifOS package. If the code disagrees with this page, the code is wrong — tell me.',
  },
  {
    name: 'github.com/ariffazil',
    href: 'https://github.com/ariffazil',
    plain: 'The source. arifOS, A-FORGE, AAA, GEOX, WEALTH, WELL — in the open.',
  },
]

function StatusChip({ status }: { status: Status }) {
  const styles =
    status === 'SEALED'
      ? 'border-gold bg-gold/10 text-gold'
      : status === 'UNSEALED'
        ? 'border-[#8A8378] text-[#8A8378]'
        : 'border-[#B05555] bg-[#B05555]/10 text-[#D98A8A]'
  return (
    <motion.span
      initial={{ scale: 1.8, rotate: -6, opacity: 0 }}
      whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 300, damping: status === 'REFUTED' ? 10 : 16 }}
      className={`inline-block border px-2 py-1 font-mono text-[11px] font-medium tracking-[0.08em] ${styles}`}
    >
      {status}
    </motion.span>
  )
}

export function Proof() {
  const now = useNow()
  const dateStr = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kuala_Lumpur',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(now)

  return (
    <div className="bg-[#030303] text-[#EDEAE2]">
      {/* 1 — HERO: THE SEAL */}
      <section className="relative mx-auto flex min-h-[100dvh] max-w-[1280px] flex-col items-center justify-center px-6 py-24 text-center">
        <p className="eyebrow text-gold">07 ————— 999 · THE PROOF CHAMBER</p>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="mt-10"
        >
          <motion.img
            src="/seal-999.svg"
            alt="Gold proof seal of arif-fazil.com"
            className="h-56 w-56 md:h-72 md:w-72"
            animate={{ rotate: 360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            style={{ filter: 'drop-shadow(0 0 40px rgba(201,162,39,0.25))' }}
          />
        </motion.div>
        <p className="mt-6 font-mono text-[12px] tracking-[0.12em] text-gold/70">
          ΔΩ∞ · EVERY CLAIM SEALED · arif-fazil.com ·
        </p>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-10 font-display text-[40px] leading-[1] tracking-[-0.02em] text-[#EDEAE2] md:text-[64px]"
        >
          Don't trust this site. Verify it.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="mt-6 max-w-[56ch] font-body text-[18px] leading-[1.65] text-[#9AA0A8]"
        >
          Everything claimed on these pages can be checked — against public records,
          machine-readable documents, and the seals below.
        </motion.p>
      </section>

      {/* 2 — CLAIMS LEDGER */}
      <section className="mx-auto max-w-[1280px] px-6 py-24">
        <div className="flex items-center gap-4">
          <span className="eyebrow text-gold">02</span>
          <span aria-hidden className="h-px flex-1 bg-gold/20" />
          <span className="eyebrow text-[#9AA0A8]">THE CLAIMS LEDGER</span>
        </div>
        <p className="mt-6 max-w-[62ch] font-body text-[18px] leading-[1.65] text-[#9AA0A8]">
          Each claim carries a fact tag — <span className="font-mono text-[13px] text-[#EDEAE2]">[OBS]</span> observed,{' '}
          <span className="font-mono text-[13px] text-[#EDEAE2]">[SPEC]</span> speculative — and a status. Speculation is
          allowed; disguising it as fact is not.
        </p>
        <div className="mt-10 border-t border-gold/20">
          {CLAIMS.map((c, i) => (
            <motion.div
              key={c.claim}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className="flex flex-wrap items-center gap-x-6 gap-y-3 border-b border-gold/20 py-6"
            >
              <p className="max-w-[52ch] flex-1 font-body text-[17px] leading-[1.6] text-[#EDEAE2]">{c.claim}</p>
              <span className="font-mono text-[11px] tracking-[0.04em] text-[#9AA0A8]">[{c.tag}]</span>
              <StatusChip status={c.status} />
              <span className="w-full font-mono text-[12px] tracking-[0.04em] text-[#9AA0A8] md:w-auto md:text-right">
                {c.href ? (
                  <a
                    href={c.href}
                    target={c.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="text-gold/80 underline decoration-gold/30 underline-offset-4 hover:text-gold"
                  >
                    {c.evidence} ↗
                  </a>
                ) : (
                  c.evidence
                )}
              </span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3 — MACHINE-READABLE IDENTITY */}
      <section className="mx-auto max-w-[1280px] px-6 py-24">
        <div className="flex items-center gap-4">
          <span className="eyebrow text-gold">03</span>
          <span aria-hidden className="h-px flex-1 bg-gold/20" />
          <span className="eyebrow text-[#9AA0A8]">MACHINE-READABLE IDENTITY</span>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {ARTIFACTS.map((a, i) => (
            <motion.a
              key={a.name}
              href={a.href}
              target={a.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="group border border-gold/25 bg-[#0A0A08] p-6 transition-all hover:-translate-y-1 hover:border-gold/70"
            >
              <p className="font-mono text-[13px] tracking-[0.04em] text-gold">{a.name}</p>
              <p className="mt-3 font-body text-[15px] leading-[1.6] text-[#9AA0A8]">{a.plain}</p>
              <p className="mt-4 font-mono text-[11px] tracking-[0.08em] text-gold/60 group-hover:text-gold">
                OPEN ↗
              </p>
            </motion.a>
          ))}
        </div>
      </section>

      {/* 4 — THE VETO */}
      <section className="mx-auto max-w-[900px] px-6 py-32 text-center">
        <motion.blockquote
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.9 }}
          className="font-display text-[30px] leading-[1.2] tracking-[-0.01em] text-gold md:text-[46px]"
        >
          “Floor 13: SOVEREIGN. The human veto is absolute. Every system on this site —
          including this site — answers to a person.”
        </motion.blockquote>
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="mt-10 font-mono text-[13px] tracking-[0.06em] text-[#9AA0A8]"
        >
          — ARIF FAZIL · KUALA LUMPUR · SEALED THIS DAY, {dateStr.toUpperCase()}
        </motion.p>
      </section>

      {/* 5 — RETURN */}
      <section className="mx-auto max-w-[1280px] px-6 pb-28 text-center">
        <Link
          to="/"
          className="inline-block font-mono text-[13px] uppercase tracking-[0.04em] text-gold underline decoration-gold/40 underline-offset-8 hover:decoration-gold"
        >
          <motion.span
            className="mr-2 inline-block"
            animate={{ x: [0, -6, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
          >
            ←
          </motion.span>
          Return to the ticking clock
        </Link>
      </section>
    </div>
  )
}

export default Proof;
