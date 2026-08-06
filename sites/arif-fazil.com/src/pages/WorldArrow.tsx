import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import SectionHeader from '@/components/SectionHeader'

const RED = '#C8102E'
type FactKind = 'OBS' | 'DER' | 'INT' | 'SPEC'

/* ── Standing honesty bar: applicable tags lit red, others grey ── */
function HonestyBar({ lit }: { lit: FactKind[] }) {
  const all: FactKind[] = ['OBS', 'DER', 'INT', 'SPEC']
  return (
    <div className="flex gap-1.5">
      {all.map((k) => (
        <span
          key={k}
          title={
            k === 'OBS'
              ? 'Observed — directly verified'
              : k === 'DER'
                ? 'Derived — computed from observed data'
                : k === 'INT'
                  ? 'Interpretation — expert judgment'
                  : 'Speculative — unverified estimate'
          }
          className="border px-1.5 py-0.5 font-mono text-[10px] leading-none tracking-[0.04em]"
          style={
            lit.includes(k)
              ? { borderColor: RED, color: RED, fontWeight: 600 }
              : { borderColor: 'rgb(20 17 12 / 0.2)', color: 'rgb(20 17 12 / 0.35)' }
          }
        >
          [{k}]
        </span>
      ))}
    </div>
  )
}

/* ── Typing dateline ── */
function Dateline() {
  const text = 'KUALA LUMPUR · EDISI TERKINI · RSS: /world/makcikgpt/feed.xml'
  const [n, setN] = useState(0)
  useEffect(() => {
    if (n >= text.length) return
    const id = setTimeout(() => setN(n + 1), 30)
    return () => clearTimeout(id)
  }, [n, text.length])
  return (
    <span className="font-mono text-[12px] uppercase tracking-[0.06em] text-ink-soft">
      {text.slice(0, n)}
      <span className="animate-pulse">▌</span>
    </span>
  )
}

const ARTICLES = {
  lead: {
    section: 'TENAGA',
    date: '2026-02-14',
    title: 'Minyak kita, siapa punya? Membaca Akta Pembangunan Petroleum 1974 dengan mata rakyat.',
    gloss: 'Our oil, whose is it? Reading the Petroleum Development Act 1974 with the people’s eyes.',
    lede: 'Makcik di pasar tahu harga minyak masak. Tetapi minyak bumi Malaysia — siapa sebenarnya pemiliknya, dan ke mana perginya hasilnya? Kami kira semula, sen demi sen.',
    ledeGloss:
      'The aunties at the market know the price of cooking oil. But Malaysia’s petroleum — who truly owns it, and where does the money go? We recount it, sen by sen.',
    lit: ['OBS', 'DER'] as FactKind[],
  },
  side: [
    {
      section: 'POLISI',
      date: '2026-02-11',
      title: '70.5%: aritmetik yang jujur tentang aliran PETRONAS kepada kerajaan.',
      gloss: '70.5%: the honest arithmetic of PETRONAS flows to government. [OBS]',
      lit: ['OBS'] as FactKind[],
    },
    {
      section: 'RAKYAT',
      date: '2026-02-08',
      title: '$750 juta itu simulasi, bukan ramalan — dan perbezaannya penting.',
      gloss: 'That $750M is a simulation, not a forecast — and the difference matters. [SPEC]',
      lit: ['SPEC', 'INT'] as FactKind[],
    },
  ],
}

const INDEX = [
  { date: '2026-02-05', section: 'TENAGA', title: 'Apa itu PSC Small Field Asset, dan mengapa Bunga Tasbih penting.' },
  { date: '2026-02-01', section: 'POLISI', title: 'Subsidi minyak: siapa dibantu, siapa membayar.' },
  { date: '2026-01-28', section: 'RAKYAT', title: 'Kenapa “collapse” tidak disokong oleh bukti — berhenti sebarkan.' },
  { date: '2026-01-24', section: 'TENAGA', title: 'Lembah Melayu: bumi yang masih menyimpan rahsia.' },
  { date: '2026-01-20', section: 'POLISI', title: 'Akta 1974, dibaca perlahan-lahan, dalam bahasa pasar.' },
  { date: '2026-01-16', section: 'RAKYAT', title: 'Surat dari makcik: “Terangkan sekali lagi, dik.”' },
]

const DOORS = [
  { name: 'KEPALA', gloss: 'The Head', desc: 'Kepimpinan, perlantikan, hala tuju. — Leadership, appointments, direction.' },
  { name: 'DALAM', gloss: 'The Inside', desc: 'Kewangan, aliran dana, aritmetik 70.5% [OBS]. — Finances, flows, the extraction arithmetic.' },
  { name: 'MESIN', gloss: 'The Machine', desc: 'Operasi, aset, pengeluaran. — Operations, assets, production.' },
]

export function World() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const gridInView = useInView(gridRef, { once: true, margin: '-15% 0px' })
  const doorsRef = useRef<HTMLDivElement>(null)
  const doorsInView = useInView(doorsRef, { once: true, margin: '-20% 0px' })
  const manifestoRef = useRef<HTMLDivElement>(null)
  const manifestoInView = useInView(manifestoRef, { once: true, margin: '-20% 0px' })

  const quote =
    'Language decides who gets to understand. Energy policy written only in boardroom English belongs to the boardroom. MakcikGPT writes it in the language of the pasar — because the petroleum belongs to the rakyat.'

  return (
    <div
      className="text-ink"
      style={{ backgroundColor: '#0A0B0D', backgroundImage: 'url(/newsprint-texture.png)' }}
    >
      {/* ── 01 MASTHEAD ── */}
      <section className="flex min-h-[80dvh] flex-col justify-center">
        <div className="mx-auto w-full max-w-[1280px] px-6 py-20">
          <div className="flex items-center justify-between border-y border-ink/25 py-3">
            <Dateline />
            <span className="hidden font-mono text-[12px] uppercase tracking-[0.06em] text-ink-soft md:block">
              HARGA: PERCUMA — UNTUK RAKYAT
            </span>
          </div>
          <motion.img
            src="/makcik-masthead.svg"
            alt="MakcikGPT masthead in bold editorial serif with a red hibiscus"
            className="mt-10 w-full"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 font-display text-[26px] italic leading-[1.25] tracking-[-0.01em] md:text-[28px]"
            style={{ color: RED }}
          >
            “Berita tenaga untuk rakyat — jujur, jelas, dan berbudi.”
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="mt-5 max-w-[62ch] font-body text-[17px] italic leading-[1.6] text-ink-soft"
          >
            MakcikGPT is civic journalism written in Bahasa Makcik — the warm, direct Malay of the
            aunties — about PETRONAS, the Petroleum Development Act 1974, and who Malaysia’s
            energy belongs to.
          </motion.p>
        </div>
      </section>

      {/* ── 02 TODAY'S COLUMNS ── */}
      <section ref={gridRef} className="border-t-2 border-ink/70">
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <SectionHeader number="02" title="TODAY’S COLUMNS · RUANGAN HARI INI" />
          <div className="mt-12 grid gap-10 lg:grid-cols-[3fr_2fr]">
            {/* Lead story */}
            <motion.article
              initial={{ opacity: 0, y: 30 }}
              animate={gridInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7 }}
              className="group border-b-2 border-ink/70 pb-10"
            >
              <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.06em]">
                <span className="border border-ink/60 px-2 py-0.5" style={{ color: RED, borderColor: RED }}>
                  {ARTICLES.lead.section}
                </span>
                <span className="tabular-nums text-ink-soft">{ARTICLES.lead.date}</span>
              </div>
              <Link to="/world/makcikgpt/">
                <h2 className="mt-5 font-display text-[36px] leading-[1.05] tracking-[-0.02em] transition-colors group-hover:text-[#C8102E] md:text-[44px]">
                  {ARTICLES.lead.title}
                </h2>
              </Link>
              <p className="mt-3 font-body text-[16px] italic text-ink-soft">{ARTICLES.lead.gloss}</p>
              <p className="mt-6 max-w-[60ch] font-body text-[19px] leading-[1.7]">
                <span
                  className="float-left mr-3 mt-1 font-display text-[64px] font-bold leading-[0.8]"
                  style={{ color: RED }}
                >
                  {ARTICLES.lead.lede.charAt(0)}
                </span>
                {ARTICLES.lead.lede.slice(1)}
              </p>
              <p className="mt-3 max-w-[60ch] font-body text-[16px] italic leading-[1.6] text-ink-soft">
                {ARTICLES.lead.ledeGloss}
              </p>
              <div className="mt-6">
                <HonestyBar lit={ARTICLES.lead.lit} />
              </div>
            </motion.article>

            {/* Side stories */}
            <div className="flex flex-col gap-10">
              {ARTICLES.side.map((a, i) => (
                <motion.article
                  key={a.title}
                  initial={{ opacity: 0, x: 40 }}
                  animate={gridInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.15 * (i + 1) }}
                  className="group border-b border-ink/20 pb-8"
                >
                  <div className="flex items-center gap-4 font-mono text-[11px] uppercase tracking-[0.06em]">
                    <span className="border px-2 py-0.5" style={{ color: RED, borderColor: RED }}>
                      {a.section}
                    </span>
                    <span className="tabular-nums text-ink-soft">{a.date}</span>
                  </div>
                  <Link to="/world/makcikgpt/">
                    <h3 className="mt-4 font-display text-[24px] leading-[1.15] tracking-[-0.02em] transition-colors group-hover:text-[#C8102E]">
                      {a.title}
                    </h3>
                  </Link>
                  <p className="mt-2 font-body text-[15px] italic text-ink-soft">{a.gloss}</p>
                  <div className="mt-4">
                    <HonestyBar lit={a.lit} />
                  </div>
                </motion.article>
              ))}
            </div>
          </div>

          {/* Recent index */}
          <div className="mt-16 grid gap-x-10 gap-y-2 md:grid-cols-3">
            {INDEX.map((a, i) => (
              <motion.div
                key={a.title}
                initial={{ opacity: 0, y: 24 }}
                animate={gridInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.4 + i * 0.06 }}
              >
                <Link
                  to="/world/makcikgpt/"
                  className="group block border-b border-ink/15 py-4 transition-shadow hover:shadow-[4px_4px_0_rgba(20,17,12,0.15)]"
                >
                  <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.06em] text-ink-soft">
                    <span className="tabular-nums">{a.date}</span>
                    <span style={{ color: RED }}>{a.section}</span>
                  </div>
                  <p className="mt-2 font-display text-[18px] leading-[1.25] tracking-[-0.01em] transition-colors group-hover:text-[#C8102E]">
                    {a.title}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 03 VITALS: THREE DOORS ── */}
      <section ref={doorsRef} className="border-y-2 border-ink/70" style={{ backgroundColor: RED }}>
        <div className="mx-auto max-w-[1280px] px-6 py-24">
          <p className="eyebrow text-white/80">03 ————— THE PETRONAS SIGNAL</p>
          <h2 className="mt-4 font-display text-4xl tracking-[-0.02em] text-[#111318] md:text-[40px]">
            /propa/ — Isyarat Institusi PETRONAS
          </h2>
          <div className="mt-12 grid gap-px border border-black/60 bg-black/60 md:grid-cols-3">
            {DOORS.map((d, i) => (
              <motion.div
                key={d.name}
                initial={{ clipPath: 'inset(0 100% 0 0)' }}
                animate={doorsInView ? { clipPath: 'inset(0 0% 0 0)' } : {}}
                transition={{ duration: 0.7, delay: i * 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to="/propa/"
                  className="group flex h-full flex-col bg-[#111318] p-8 transition-colors duration-300 hover:bg-[#C8102E]"
                >
                  <p className="font-mono text-2xl font-bold uppercase tracking-[0.08em] text-ink transition-colors group-hover:text-[#111318]">
                    {d.name}
                  </p>
                  <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-ink-soft transition-colors group-hover:text-[#111318]/70">
                    {d.gloss}
                  </p>
                  <p className="mt-5 flex-1 font-body text-[17px] leading-[1.6] text-ink-soft transition-colors group-hover:text-[#111318]/90">
                    {d.desc}
                  </p>
                  <span className="mt-6 font-mono text-[16px]" style={{ color: RED }}>
                    → <span className="text-[12px] uppercase tracking-[0.06em] group-hover:text-[#111318]">Masuk / Enter</span>
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="mt-10 border border-[#111318]/40 px-4 py-3 text-center font-mono text-[12px] uppercase tracking-[0.06em] text-[#111318]">
            70.5% ialah aritmetik [OBS] · $750M ialah simulasi [SPEC] · “Collapse” TIDAK DISOKONG
          </p>
        </div>
      </section>

      {/* ── 04 WHY BAHASA MAKCIK ── */}
      <section ref={manifestoRef}>
        <div className="relative mx-auto max-w-[880px] px-6 py-32">
          <span
            aria-hidden
            className="pointer-events-none absolute left-2 top-8 select-none font-display text-[240px] leading-none"
            style={{ color: 'rgba(200,16,46,0.10)' }}
          >
            “
          </span>
          <blockquote className="relative font-display text-[26px] leading-[1.4] tracking-[-0.01em] md:text-[32px]">
            {quote.split(' ').map((word, i) => (
              <motion.span
                key={i}
                className="inline-block"
                initial={{ opacity: 0.15 }}
                animate={manifestoInView ? { opacity: 1 } : {}}
                transition={{ delay: i * 0.03, duration: 0.3 }}
              >
                {word}
                {'\u00A0'}
              </motion.span>
            ))}
          </blockquote>
          <p className="mt-8 font-body text-[17px] italic text-ink-soft">
            — The MakcikGPT manifesto. Bahasa Makcik first, English gloss always.
          </p>
        </div>
      </section>

      {/* ── 05 SUBSCRIBE / RSS ── */}
      <section className="border-t-2 border-ink/70">
        <div className="mx-auto max-w-[1280px] px-6 py-20">
          <SectionHeader number="05" title="LANGGAN · SUBSCRIBE" />
          <div className="mt-8 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div className="font-mono text-[13px] uppercase tracking-[0.06em] text-ink-soft">
              <p>
                RSS →{' '}
                <a href="/world/makcikgpt/feed.xml" className="underline underline-offset-4 hover:text-[#C8102E]">
                  /world/makcikgpt/feed.xml
                </a>
              </p>
              <p className="mt-2">
                Telegram →{' '}
                <a href="https://t.me/ariffazil" target="_blank" rel="noreferrer" className="underline underline-offset-4 hover:text-[#C8102E]">
                  t.me/ariffazil
                </a>
              </p>
            </div>
            {subscribed ? (
              <motion.div
                initial={{ scale: 1.4, opacity: 0, rotate: -4 }}
                animate={{ scale: 1, opacity: 1, rotate: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                className="inline-block border-4 px-6 py-2 font-mono text-xl font-bold uppercase tracking-[0.12em]"
                style={{ borderColor: RED, color: RED }}
              >
                DITERIMA ✓
              </motion.div>
            ) : (
              <form
                className="flex w-full max-w-[420px] gap-0 border-2 border-ink"
                onSubmit={(e) => {
                  e.preventDefault()
                  if (email.trim()) setSubscribed(true)
                }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="emel@anda.my"
                  className="w-full bg-transparent px-4 py-3 font-mono text-[14px] outline-none placeholder:text-ink-soft/50"
                />
                <motion.button
                  type="submit"
                  whileTap={{ scale: 0.96 }}
                  className="shrink-0 px-6 py-3 font-mono text-[13px] font-bold uppercase tracking-[0.08em] text-[#111318] transition-opacity hover:opacity-90"
                  style={{ backgroundColor: RED }}
                >
                  Langgan
                </motion.button>
              </form>
            )}
          </div>
          <p className="mt-10 font-body text-[15px] italic text-ink-soft">
            For machines: the MakcikGPT feed is plain RSS. Humans first — but agents are welcome
            to read along, honestly.
          </p>
        </div>
      </section>
    </div>
  )
}

export default World;
