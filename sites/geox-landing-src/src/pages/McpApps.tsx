import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'
import { Copy, Check, Eye, Lock, FileCheck, ArrowRight, ExternalLink, MessageSquare } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

/* ---------------------------------- tokens ---------------------------------- */

const FONT_DISPLAY = "'Sora','Inter',system-ui,sans-serif"
const FONT_MONO = "'JetBrains Mono','SFMono-Regular',Menlo,monospace"
const FONT_BODY = "'Inter',system-ui,sans-serif"

const C = {
  bg: '#0A0B0D',
  panel: '#111318',
  raised: '#1A1E24',
  border: '#2A2F37',
  magma: '#E8733B',
  amber: '#D9A441',
  telemetry: '#5FD68A',
  red: '#E05252',
  bone: '#EDEAE2',
  boneMid: '#9AA0A8',
  boneDim: '#5C636C',
  spec: '#8FA8C8',
}

type EpiLayer = 'OBS' | 'DER' | 'INT' | 'SPEC'
const EPI_COLOR: Record<EpiLayer, string> = { OBS: C.telemetry, DER: C.amber, INT: C.magma, SPEC: C.spec }

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ---------------------------------- data ---------------------------------- */

type Category = 'LOGS' | 'SEISMIC' | '3D & MAPS' | 'RISK' | 'GOVERNANCE' | 'UTILITIES'

interface Widget {
  name: string
  slug: string
  category: Category
  desc: string
  layers: EpiLayer[]
  featured?: boolean
  preview?: string
  invocation: { well?: string; prospect?: string; basin?: string; tracks?: string[]; extra?: Record<string, unknown> }
}

const HOSTS = ['CHATGPT', 'CLAUDE', 'VSCODE']

const WIDGETS: Widget[] = [
  {
    name: 'WellDesk', slug: 'geox.app.welldesk', category: 'LOGS', featured: true, preview: '/cockpit-welldesk.png',
    desc: '1D log witness stand — GR / RES / DEN tracks with OBS/DER coloring down to the metre.',
    layers: ['OBS', 'DER'],
    invocation: { well: 'VOLVE-15/9-F-9', tracks: ['GR', 'RHOB', 'NPHI'] },
  },
  {
    name: 'Seismic Vision', slug: 'geox.app.seismic', category: 'SEISMIC', featured: true, preview: '/basin-kinabalu.png',
    desc: '2D / 3D seismic viewer with attribute overlays — envelope, similarity, sweetening.',
    layers: ['OBS', 'DER'],
    invocation: { basin: 'SABAH-DEEPWATER', extra: { inline: 4420, attributes: ['envelope', 'similarity'] } },
  },
  {
    name: 'Earth Volume', slug: 'geox.app.earthvolume', category: '3D & MAPS', featured: true, preview: '/cockpit-earth-volume.png',
    desc: 'Cesium globe of basins, wells, and prospects — night-side evidence rendering.',
    layers: ['OBS', 'INT'],
    invocation: { basin: 'GLOBAL', extra: { layers: ['basins', 'wells', 'prospects'] } },
  },
  {
    name: 'Risk Console', slug: 'geox.app.riskconsole', category: 'RISK', featured: true, preview: '/cockpit-risk.png',
    desc: 'Kill Matrix live board — K001–K007 batteries streaming verdicts in real time.',
    layers: ['INT', 'SPEC'],
    invocation: { prospect: 'SB-ALPHA', extra: { battery: 'K001..K007' } },
  },
  {
    name: 'Judge Console', slug: 'geox.app.judgeconsole', category: 'GOVERNANCE', featured: true, preview: '/cockpit-judge.png',
    desc: 'Verdicts, HOLD states, and sovereign signatures — the F13 floor made visible.',
    layers: ['INT'],
    invocation: { prospect: 'SB-ALPHA', extra: { include_holds: true } },
  },
  {
    name: 'Basin Explorer', slug: 'geox.app.basinexplorer', category: '3D & MAPS',
    desc: 'PSCS-style basin synthesis explorer — play types, kitchens, and fetch areas.',
    layers: ['INT'],
    invocation: { basin: 'KINABALU', extra: { synthesis: 'PSCS' } },
  },
  {
    name: 'Earth Map', slug: 'geox.app.earthmap', category: '3D & MAPS',
    desc: 'Flat-earth cartography of every tagged evidence layer, queryable by polygon.',
    layers: ['OBS', 'INT'],
    invocation: { basin: 'GLOBAL', extra: { projection: 'EPSG:3857' } },
  },
  {
    name: 'Prospect Studio', slug: 'geox.app.prospectstudio', category: 'RISK',
    desc: 'Full prospect synthesis — volumetrics, POS chain, and RASA score in one frame.',
    layers: ['INT', 'SPEC'],
    invocation: { prospect: 'SB-ALPHA', extra: { volumetrics: 'P10/P50/P90' } },
  },
  {
    name: 'GravMag Studio', slug: 'geox.app.gravmag', category: 'SEISMIC',
    desc: 'Gravity & magnetic screening studio — basement architecture before the survey.',
    layers: ['OBS', 'DER'],
    invocation: { basin: 'SABAH-DEEPWATER', extra: { surveys: ['gravity', 'magnetics'] } },
  },
  {
    name: 'Visual Hub', slug: 'geox.app.visualhub', category: 'UTILITIES', preview: '/epistemic-core.png',
    desc: 'Cross-widget evidence hub — pin any layer, compare any epoch, export any view.',
    layers: ['OBS', 'DER', 'INT'],
    invocation: { well: 'VOLVE-15/9-F-9', extra: { mode: 'compare' } },
  },
  {
    name: 'GeoProbe', slug: 'geox.app.geoprobe', category: 'SEISMIC',
    desc: 'Point-and-ask seismic interrogation — click a reflector, get its tagged evidence.',
    layers: ['OBS', 'DER'],
    invocation: { basin: 'SABAH-DEEPWATER', extra: { probe: { x: 4420, twt_ms: 2380 } } },
  },
  {
    name: 'Analog Digitizer', slug: 'geox.app.analogdigitizer', category: 'LOGS',
    desc: 'Scan paper logs to LAS — raster trace recovery with OBS-grade provenance.',
    layers: ['OBS'],
    invocation: { well: 'LEGACY-1', extra: { source: 'raster', output: 'LAS-2.0' } },
  },
  {
    name: 'Well Witness', slug: 'geox.app.wellwitness', category: 'LOGS',
    desc: 'Per-well evidence affidavit — what was observed, what was derived, what was assumed.',
    layers: ['OBS', 'DER'],
    invocation: { well: 'VOLVE-15/9-F-9', extra: { affidavit: true } },
  },
  {
    name: 'Workspace', slug: 'geox.app.workspace', category: 'UTILITIES',
    desc: 'Session evidence workspace — every artifact pinned, hashed, and replayable.',
    layers: ['OBS', 'DER', 'INT'],
    invocation: { extra: { session: 'current' } },
  },
  {
    name: 'Skills Catalog', slug: 'geox.app.skillscatalog', category: 'UTILITIES',
    desc: 'Browse the 42 canonical tools as installable agent skills with contracts.',
    layers: ['DER'],
    invocation: { extra: { list: 'skills', format: 'contract' } },
  },
  {
    name: 'Physics Panel', slug: 'geox.app.physicspanel', category: 'UTILITIES',
    desc: 'Rock-physics sandbox — crossplots, templates, and forward models on demand.',
    layers: ['DER'],
    invocation: { well: 'VOLVE-15/9-F-9', extra: { models: ['Gassmann', 'Hertz-Mindlin'] } },
  },
  {
    name: 'Timeline View', slug: 'geox.app.timeline', category: 'GOVERNANCE',
    desc: 'Geological time against decision time — charge timing vs trap formation, audited.',
    layers: ['INT'],
    invocation: { basin: 'KINABALU', extra: { events: ['charge', 'trap', 'seal'] } },
  },
  {
    name: 'Hazard Triage', slug: 'geox.app.hazardtriage', category: 'RISK',
    desc: 'Drilling hazard triage — overpressure, shallow gas, and instability ranked by evidence.',
    layers: ['DER', 'INT'],
    invocation: { well: 'PLANNED-A1', extra: { hazards: ['pore_pressure', 'shallow_gas', 'stability'] } },
  },
]

const CATEGORIES: Array<'ALL' | Category> = ['ALL', 'LOGS', 'SEISMIC', '3D & MAPS', 'RISK', 'GOVERNANCE', 'UTILITIES']

/* ---------------------------------- shared bits ---------------------------------- */

function MonoLabel({ children, color = C.boneDim, className = '' }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <span className={`text-[11px] uppercase ${className}`} style={{ fontFamily: FONT_MONO, letterSpacing: '0.18em', color }}>
      {children}
    </span>
  )
}

function EpiDots({ layers }: { layers: EpiLayer[] }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {layers.map((l) => (
        <span key={l} className="inline-flex items-center gap-1">
          <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: EPI_COLOR[l] }} />
          <span className="text-[9px] uppercase" style={{ fontFamily: FONT_MONO, color: EPI_COLOR[l] }}>{l}</span>
        </span>
      ))}
    </span>
  )
}

function WordReveal({ text }: { text: string }) {
  return (
    <>
      {text.split(' ').map((w, i, arr) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
        >
          {w}
          {i < arr.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </>
  )
}

function invocationJson(w: Widget) {
  return JSON.stringify(
    { tool: w.slug, input: { ...(w.invocation.well ? { well: w.invocation.well } : {}), ...(w.invocation.prospect ? { prospect: w.invocation.prospect } : {}), ...(w.invocation.basin ? { basin: w.invocation.basin } : {}), ...(w.invocation.tracks ? { tracks: w.invocation.tracks } : {}), ...(w.invocation.extra ?? {}) } },
    null,
    2,
  )
}

/* ---------------------------------- hero chat mock ---------------------------------- */

function ChatMock() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-md overflow-hidden rounded-lg border"
      style={{ borderColor: C.border, background: C.panel }}
    >
      <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: C.border, background: C.raised }}>
        <MessageSquare className="h-3.5 w-3.5" style={{ color: C.boneDim }} />
        <span className="text-[11px]" style={{ fontFamily: FONT_MONO, color: C.boneDim }}>agent.session — inline widget</span>
        <span className="ml-auto rounded border px-1.5 py-0.5 text-[9px] uppercase" style={{ fontFamily: FONT_MONO, color: C.telemetry, borderColor: '#5FD68A44' }}>SEP-1865</span>
      </div>
      <div className="space-y-3 p-4">
        <div className="max-w-[85%] rounded-md p-3 text-[12px]" style={{ background: C.raised, color: C.boneMid, fontFamily: FONT_BODY }}>
          Show me the GR / RHOB / NPHI tracks for VOLVE-15/9-F-9.
        </div>
        <div className="ml-auto max-w-[92%] rounded-md border p-3" style={{ borderColor: C.border, background: C.bg }}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-[10px]" style={{ fontFamily: FONT_MONO, color: C.telemetry }}>geox.app.welldesk</span>
            <EpiDots layers={['OBS', 'DER']} />
          </div>
          {/* skeleton shimmer resolving into curves */}
          <div className="relative h-36 overflow-hidden rounded border" style={{ borderColor: C.border }}>
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ delay: 1.6, duration: 0.8 }}
              className="absolute inset-0 z-10"
              style={{ background: `linear-gradient(110deg, ${C.raised} 30%, #242A33 50%, ${C.raised} 70%)`, backgroundSize: '200% 100%' }}
            >
              <motion.div
                animate={{ backgroundPosition: ['200% 0', '-200% 0'] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                className="h-full w-full"
                style={{ background: 'linear-gradient(110deg, transparent 30%, #2A2F3755 50%, transparent 70%)', backgroundSize: '200% 100%' }}
              />
            </motion.div>
            <svg viewBox="0 0 300 144" className="h-full w-full" preserveAspectRatio="none">
              {[75, 150, 225].map((x) => (
                <line key={x} x1={x} y1="0" x2={x} y2="144" stroke={C.border} strokeWidth="1" />
              ))}
              <path d="M0 120 Q20 110 35 118 T70 90 T110 100 T150 60" fill="none" stroke={C.telemetry} strokeWidth="1.5" />
              <path d="M75 130 Q95 122 110 128 T150 118 T190 122 T225 100" fill="none" stroke={C.amber} strokeWidth="1.5" />
              <path d="M150 132 Q170 126 185 130 T225 124 T260 126 T300 112" fill="none" stroke={C.telemetry} strokeWidth="1.2" opacity="0.7" />
              <path d="M0 60 Q30 50 55 66 T120 40" fill="none" stroke={C.magma} strokeWidth="1" opacity="0.6" strokeDasharray="3 3" />
            </svg>
          </div>
          <div className="mt-2 flex justify-between text-[9px]" style={{ fontFamily: FONT_MONO, color: C.boneDim }}>
            <span>GR · OBS</span><span>RHOB · OBS</span><span>NPHI · OBS</span><span>PHIE · DER</span>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

/* ---------------------------------- widget card ---------------------------------- */

function MiniMock({ w }: { w: Widget }) {
  // live-rendered mini-mock for widgets without a preview image
  return (
    <div className="relative flex h-full w-full items-center justify-center" style={{ background: C.bg }}>
      <svg viewBox="0 0 200 120" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
        {[0, 1, 2, 3, 4].map((i) => (
          <line key={`h${i}`} x1="0" y1={24 * i + 12} x2="200" y2={24 * i + 12} stroke={C.border} strokeWidth="0.5" />
        ))}
        {[0, 1, 2, 3, 4, 5].map((i) => (
          <line key={`v${i}`} x1={40 * i} y1="0" x2={40 * i} y2="120" stroke={C.border} strokeWidth="0.5" />
        ))}
        <path d="M0 90 Q25 70 50 84 T100 60 T150 74 T200 44" fill="none" stroke={EPI_COLOR[w.layers[0]]} strokeWidth="1.5" />
        <path d="M0 100 Q30 95 60 99 T120 92 T200 84" fill="none" stroke={EPI_COLOR[w.layers[w.layers.length - 1]]} strokeWidth="1" opacity="0.6" strokeDasharray="4 3" />
      </svg>
      <span className="absolute bottom-2 right-3 text-[9px] uppercase" style={{ fontFamily: FONT_MONO, color: C.boneDim, letterSpacing: '0.14em' }}>
        live render
      </span>
    </div>
  )
}

function WidgetCard({ w, index, onOpen }: { w: Widget; index: number; onOpen: (w: Widget) => void }) {
  return (
    <motion.button
      type="button"
      layout
      onClick={() => onOpen(w)}
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease: EASE }}
      whileHover={{ y: -4 }}
      className={`group relative overflow-hidden rounded-lg border text-left ${w.featured ? 'md:col-span-2' : ''}`}
      style={{ background: C.panel, borderColor: C.border }}
    >
      <div className={`relative overflow-hidden ${w.featured ? 'h-56 md:h-64' : 'h-40'}`}>
        <motion.div className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]">
          {w.preview ? (
            <img src={w.preview} alt={`${w.name} widget preview`} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <MiniMock w={w} />
          )}
        </motion.div>
        <div className="absolute inset-x-0 bottom-0 h-16" style={{ background: `linear-gradient(to top, ${C.panel}, transparent)` }} />
        <span
          className="absolute bottom-2 left-3 translate-y-3 text-[10px] uppercase opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
          style={{ fontFamily: FONT_MONO, letterSpacing: '0.18em', color: C.magma }}
        >
          OPEN SPEC ↗
        </span>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <h3 className="text-lg font-bold" style={{ fontFamily: FONT_DISPLAY, color: C.bone }}>{w.name}</h3>
          <EpiDots layers={w.layers} />
        </div>
        <div className="mt-1 text-[11px]" style={{ fontFamily: FONT_MONO, color: C.telemetry }}>{w.slug}</div>
        <p className="mt-2 text-[13px] leading-snug" style={{ fontFamily: FONT_BODY, color: C.boneMid }}>{w.desc}</p>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {HOSTS.map((h) => (
            <span key={h} className="rounded border px-1.5 py-0.5 text-[9px] uppercase" style={{ fontFamily: FONT_MONO, letterSpacing: '0.12em', borderColor: C.border, color: C.boneDim }}>
              {h}
            </span>
          ))}
        </div>
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-lg border border-transparent transition-colors duration-200 group-hover:border-[#E8733B66]" />
    </motion.button>
  )
}

/* ---------------------------------- detail modal ---------------------------------- */

function WidgetModal({ w, onClose }: { w: Widget | null; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const json = w ? invocationJson(w) : ''
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(json)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard unavailable */ }
  }
  return (
    <Dialog open={!!w} onOpenChange={(open) => { if (!open) onClose() }}>
      <DialogContent
        className="max-h-[90dvh] w-[90vw] max-w-3xl overflow-y-auto border p-0 sm:max-w-3xl"
        style={{ background: C.panel, borderColor: C.border }}
      >
        {w && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
          >
            {/* terminal title bar */}
            <div className="flex items-center gap-2 border-b px-5 py-3" style={{ borderColor: C.border, background: C.raised }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.red }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.amber }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.telemetry }} />
              <span className="ml-3 text-[11px]" style={{ fontFamily: FONT_MONO, color: C.boneDim }}>{w.slug} — widget spec</span>
              <span className="ml-auto rounded border px-1.5 py-0.5 text-[9px] uppercase" style={{ fontFamily: FONT_MONO, color: C.telemetry, borderColor: '#5FD68A44' }}>SEP-1865</span>
            </div>
            <div className="p-5 md:p-6">
              <div className="relative h-52 overflow-hidden rounded-md border md:h-64" style={{ borderColor: C.border }}>
                {w.preview ? (
                  <img src={w.preview} alt={`${w.name} preview`} className="h-full w-full object-cover" />
                ) : (
                  <MiniMock w={w} />
                )}
              </div>
              <DialogHeader className="mt-5 text-left">
                <DialogTitle className="text-2xl font-bold" style={{ fontFamily: FONT_DISPLAY, color: C.bone }}>
                  {w.name}
                </DialogTitle>
                <DialogDescription className="text-[14px] leading-[1.65]" style={{ fontFamily: FONT_BODY, color: C.boneMid }}>
                  {w.desc}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-3 flex flex-wrap items-center gap-3">
                <EpiDots layers={w.layers} />
                {HOSTS.map((h) => (
                  <span key={h} className="rounded border px-1.5 py-0.5 text-[9px] uppercase" style={{ fontFamily: FONT_MONO, letterSpacing: '0.12em', borderColor: C.border, color: C.boneDim }}>
                    {h}
                  </span>
                ))}
              </div>

              <div className="mt-5">
                <MonoLabel>sample MCP invocation</MonoLabel>
                <div className="relative mt-2 overflow-hidden rounded-md border" style={{ borderColor: C.border, background: C.bg }}>
                  <pre className="overflow-x-auto p-4 text-[12px] leading-relaxed" style={{ fontFamily: FONT_MONO, color: C.bone }}>
                    {json.split('').map((ch, i) => (
                      <motion.span key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 + i * 0.008, duration: 0.02 }}>
                        {ch}
                      </motion.span>
                    ))}
                  </pre>
                  <button
                    type="button"
                    onClick={copy}
                    className="absolute right-2 top-2 rounded border p-1.5 transition-colors"
                    style={{ borderColor: C.border, background: C.raised }}
                    aria-label="Copy invocation"
                  >
                    {copied ? <Check className="h-3.5 w-3.5" style={{ color: C.telemetry }} /> : <Copy className="h-3.5 w-3.5" style={{ color: C.boneMid }} />}
                  </button>
                </div>
              </div>

              <div className="mt-4 rounded-md border p-3 text-[12px] leading-relaxed" style={{ borderColor: '#8FA8C844', background: '#8FA8C80D', fontFamily: FONT_BODY, color: C.spec }}>
                Epistemic contract: widget renders OBS/DER only. INT/SPEC layers require 888_HOLD release.
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={copy}
                  className="inline-flex items-center gap-2 rounded-md px-4 py-2 text-[11px] font-semibold uppercase transition-shadow hover:shadow-[0_0_24px_#E8733B55]"
                  style={{ fontFamily: FONT_MONO, letterSpacing: '0.14em', background: C.magma, color: C.bg }}
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'COPIED' : 'COPY INVOCATION'}
                </button>
                <a
                  href="/llms.txt"
                  className="inline-flex items-center gap-2 rounded-md border px-4 py-2 text-[11px] uppercase transition-colors hover:border-[#E8733B88]"
                  style={{ fontFamily: FONT_MONO, letterSpacing: '0.14em', borderColor: C.border, color: C.bone }}
                >
                  VIEW IN LLMS.TXT <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}

/* ---------------------------------- sections ---------------------------------- */

function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: C.bg, minHeight: '65vh' }}>
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-8 py-28 lg:grid-cols-2 lg:py-32">
        <div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }} className="flex items-center gap-3">
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: C.telemetry }} />
            <MonoLabel color={C.telemetry}>SEP-1865 // MCP APPS WITH GUI</MonoLabel>
          </motion.div>
          <h1
            className="mt-6 text-[42px] font-extrabold leading-[1.02] md:text-[64px]"
            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em', color: C.bone }}
          >
            <WordReveal text="Tools you can see." />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mt-6 max-w-xl text-[15px] leading-[1.65] md:text-[17px]"
            style={{ fontFamily: FONT_BODY, color: C.boneMid }}
          >
            Eighteen widgets that render inline where agents already live — ChatGPT,
            Claude, VS Code Copilot. Every widget is read-only evidence: beautiful
            for humans, structured for machines.
          </motion.p>
        </div>
        <div className="flex justify-center lg:justify-end">
          <ChatMock />
        </div>
      </div>
    </section>
  )
}

function GallerySection({ onOpen }: { onOpen: (w: Widget) => void }) {
  const [cat, setCat] = useState<'ALL' | Category>('ALL')
  const visible = useMemo(() => (cat === 'ALL' ? WIDGETS : WIDGETS.filter((w) => w.category === cat)), [cat])
  return (
    <section className="py-20 md:py-[120px]" style={{ background: C.bg }}>
      <div className="mx-auto max-w-[1280px] px-8">
        <MonoLabel color={C.magma}>THE WIDGET GALLERY</MonoLabel>
        <h2
          className="mt-4 text-[32px] font-bold leading-[1.08] md:text-5xl"
          style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em', color: C.bone }}
        >
          18 widgets. Six surfaces.
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.65]" style={{ fontFamily: FONT_BODY, color: C.boneMid }}>
          Click any card to open its full spec — preview, epistemic contract, and a
          copyable MCP invocation.
        </p>
        <div className="mt-10 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const active = cat === c
            return (
              <button
                key={c}
                type="button"
                onClick={() => setCat(c)}
                className="relative rounded-full border px-4 py-2 text-[11px] uppercase transition-colors"
                style={{
                  fontFamily: FONT_MONO,
                  letterSpacing: '0.14em',
                  borderColor: active ? C.magma : C.border,
                  color: active ? C.bone : C.boneMid,
                  background: active ? '#E8733B14' : 'transparent',
                }}
              >
                {c}
                {active && (
                  <motion.span layoutId="widget-tab-underline" className="absolute inset-x-4 -bottom-px h-px" style={{ background: C.magma }} />
                )}
              </button>
            )
          })}
        </div>
        <motion.div layout className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {visible.map((w, i) => (
              <WidgetCard key={w.slug} w={w} index={i} onOpen={onOpen} />
            ))}
          </AnimatePresence>
        </motion.div>
        <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: C.border }}>
          <MonoLabel>agent: ui://geox/widgets → 18 SEP-1865 apps</MonoLabel>
          <MonoLabel color={C.boneDim}>{visible.length} / 18 shown</MonoLabel>
        </div>
      </div>
    </section>
  )
}

function HonestySection() {
  const items = [
    {
      icon: Eye,
      title: 'Evidence-only rendering',
      body: 'Widgets visualize tagged layers; speculation is visually quarantined — rendered in cool blue with hatched borders, never blended into observation.',
    },
    {
      icon: Lock,
      title: 'Hold-aware',
      body: 'Irreversible outputs render as sealed cards until a sovereign signature releases them. The F13 veto is visible in the GUI, not buried in logs.',
    },
    {
      icon: FileCheck,
      title: 'Ledger-linked',
      body: 'Every widget state can be written to VAULT999 with one click — the seal glyph button hashes inputs, tags, and verdict into the immutable ledger.',
    },
  ]
  return (
    <section className="py-20 md:py-[120px]" style={{ background: C.panel }}>
      <div className="mx-auto max-w-[1280px] px-8">
        <MonoLabel color={C.telemetry}>HOW APPS STAY HONEST</MonoLabel>
        <h2
          className="mt-4 text-[32px] font-bold leading-[1.08] md:text-5xl"
          style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em', color: C.bone }}
        >
          Pretty, but never dishonest.
        </h2>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.12, ease: EASE }}
              whileHover={{ y: -4 }}
              className="rounded-lg border p-6"
              style={{ borderColor: C.border, background: C.bg }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 + 0.2, duration: 0.5, ease: EASE }}
                className="inline-flex rounded-md border p-2.5"
                style={{ borderColor: C.border, background: C.raised }}
              >
                <it.icon className="h-5 w-5" style={{ color: C.magma }} />
              </motion.div>
              <h3 className="mt-4 text-xl font-bold" style={{ fontFamily: FONT_DISPLAY, color: C.bone }}>{it.title}</h3>
              <p className="mt-2 text-[14px] leading-[1.65]" style={{ fontFamily: FONT_BODY, color: C.boneMid }}>{it.body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

function EmbedSection() {
  const [copied, setCopied] = useState(false)
  const snippet = 'npx @geox/mcp-apps register'
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(snippet)
      setCopied(true)
      setTimeout(() => setCopied(false), 1400)
    } catch { /* clipboard unavailable */ }
  }
  return (
    <section className="py-20 md:py-[120px]" style={{ background: C.bg }}>
      <div className="mx-auto max-w-[800px] px-8 text-center">
        <MonoLabel color={C.magma}>EMBED</MonoLabel>
        <h2
          className="mt-4 text-[32px] font-bold leading-[1.08] md:text-5xl"
          style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em', color: C.bone }}
        >
          Render Earth intelligence inside your agent.
        </h2>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="relative mx-auto mt-10 flex max-w-lg items-center justify-between gap-4 rounded-md border px-5 py-4"
          style={{ borderColor: C.border, background: C.raised }}
        >
          <code className="text-[14px]" style={{ fontFamily: FONT_MONO, color: C.telemetry }}>
            $ {snippet}
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              className="ml-1 inline-block h-4 w-2 translate-y-0.5"
              style={{ background: C.telemetry }}
            />
          </code>
          <button type="button" onClick={copy} className="rounded border p-1.5" style={{ borderColor: C.border }} aria-label="Copy install command">
            {copied ? <Check className="h-4 w-4" style={{ color: C.telemetry }} /> : <Copy className="h-4 w-4" style={{ color: C.boneMid }} />}
          </button>
        </motion.div>
        <div className="mt-8">
          <Link
            to="/webmcp"
            className="inline-flex items-center gap-2 rounded-md px-6 py-3 text-[12px] font-semibold uppercase transition-shadow duration-300 hover:shadow-[0_0_24px_#E8733B55]"
            style={{ fontFamily: FONT_MONO, letterSpacing: '0.14em', background: C.magma, color: C.bg }}
          >
            READ THE WEBMCP MANIFEST <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export default function McpApps() {
  const [selected, setSelected] = useState<Widget | null>(null)
  return (
    <main style={{ background: C.bg, minHeight: '100dvh' }}>
      <HeroSection />
      <GallerySection onOpen={setSelected} />
      <HonestySection />
      <EmbedSection />
      <WidgetModal w={selected} onClose={() => setSelected(null)} />
    </main>
  )
}
