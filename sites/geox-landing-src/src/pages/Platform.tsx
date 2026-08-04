import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'
import { Copy, Check, ShieldAlert, Lock, FileCheck, ArrowRight, Activity } from 'lucide-react'

/* ---------------------------------- design tokens ---------------------------------- */

const FONT_DISPLAY = "'Sora','Inter',system-ui,sans-serif"
const FONT_MONO = "'JetBrains Mono','SFMono-Regular',Menlo,monospace"
const FONT_BODY = "'Inter',system-ui,sans-serif"

const C = {
  bg: '#0A0B0D',
  panel: '#111318',
  raised: '#1A1E24',
  border: '#2A2F37',
  magma: '#E8733B',
  magmaHover: '#F09A62',
  amber: '#D9A441',
  telemetry: '#5FD68A',
  telemetryDim: '#3BAF66',
  red: '#E05252',
  bone: '#EDEAE2',
  boneMid: '#9AA0A8',
  boneDim: '#5C636C',
  spec: '#8FA8C8',
}

type EpiLayer = 'OBS' | 'DER' | 'INT' | 'SPEC' | 'META' | 'GOV'

const EPI_COLOR: Record<EpiLayer, string> = {
  OBS: C.telemetry,
  DER: C.amber,
  INT: C.magma,
  SPEC: C.spec,
  META: C.boneMid,
  GOV: C.red,
}

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ---------------------------------- data ---------------------------------- */

type Domain =
  | 'WELL LOG & PETROPHYSICS'
  | 'SEISMIC'
  | 'STRUCTURAL & BASIN'
  | 'GEOMECHANICS'
  | 'VOLUMETRICS & POS'
  | 'EARTH SURFACE & EVIDENCE'
  | 'EMV BRIDGE'

interface Tool {
  name: string
  desc: string
  domain: Domain
  layers: EpiLayer[]
}

const TOOLS: Tool[] = [
  { name: 'geox.well_ingest', desc: 'Load well log data from LAS, SEG-Y, DST, deviation, or tops files. Auto-detects format.', domain: 'WELL LOG & PETROPHYSICS', layers: ['OBS'] },
  { name: 'geox.petrophysics', desc: 'Unified petrophysics: Vsh, porosity, Sw, permeability, net pay, LEM inference, QC. Modes:…', domain: 'WELL LOG & PETROPHYSICS', layers: ['OBS'] },
  { name: 'geox.seismic_ingest', desc: 'SEG-Y I/O, header inspection, export.', domain: 'SEISMIC', layers: ['OBS'] },
  { name: 'geox.seismic_compute', desc: 'Seismic computation: forward model, well tie, attributes, wavelet extraction, inversion.', domain: 'SEISMIC', layers: ['DER'] },
  { name: 'geox.seismic_interpret', desc: 'One semantic capability — propose geometry, physics-gate, compare hypotheses (NOT…', domain: 'SEISMIC', layers: ['OBS'] },
  { name: 'geox.subsurface_model', desc: 'Subsurface model building: joint inversion, gravity/magnetic forward, MT forward.', domain: 'STRUCTURAL & BASIN', layers: ['INT'] },
  { name: 'geox.basin', desc: 'Unified basin intelligence: profile, resolve, macrostrat, backstrip, mass balance,…', domain: 'STRUCTURAL & BASIN', layers: ['DER'] },
  { name: 'geox.sequence', desc: 'Unified stratigraphy: sequence analysis, biostratigraphic parsing and falsification.…', domain: 'STRUCTURAL & BASIN', layers: ['INT'] },
  { name: 'geox.geomechanics', desc: 'Geomechanical analysis: bulk/shear/young modulus, poisson ratio, acoustic impedance,…', domain: 'GEOMECHANICS', layers: ['DER'] },
  { name: 'geox.deep_time_state', desc: 'Earth State Vector through deep time: GPTS, CO2, sea level, temperature, paleogeography.', domain: 'STRUCTURAL & BASIN', layers: ['DER', 'INT'] },
  { name: 'geox.claim', desc: 'Unified claim lifecycle: create, validate, challenge, seal, evidence, consequence,…', domain: 'VOLUMETRICS & POS', layers: ['INT', 'GOV'] },
  { name: 'geox.prospect', desc: 'Prospect evaluation: volumetrics, POS, EVOI, risk assessment. Modes: screen, evaluate.', domain: 'VOLUMETRICS & POS', layers: ['INT', 'GOV'] },
  { name: 'geox.well_desk', desc: 'Well desk: interactive view, publish rendered panel, render well panel. Modes: open,…', domain: 'WELL LOG & PETROPHYSICS', layers: ['DER', 'INT'] },
  { name: 'geox.well_qc', desc: 'Quality control for well data: depth monotonicity, null %, physical range checks.', domain: 'WELL LOG & PETROPHYSICS', layers: ['OBS'] },
  { name: 'geox.well_view', desc: 'Well Witness View — hydrate real LAS curves into interactive tracks for WellDesk/Well…', domain: 'WELL LOG & PETROPHYSICS', layers: ['OBS'] },
  { name: 'geox.surface_status', desc: 'Federation-standard registry probe: tool discovery and health status.', domain: 'EARTH SURFACE & EVIDENCE', layers: ['DER', 'INT'] },
  { name: 'geox.evidence', desc: 'Unified evidence synthesis: discover, synthesize, abduct, contradict, spatial_block,…', domain: 'EARTH SURFACE & EVIDENCE', layers: ['OBS'] },
  { name: 'geox.basin_backstrip', desc: '1D basin backstripping: Steckler & Watts 1978 + Sclater & Christie 1980. Reconstruct…', domain: 'STRUCTURAL & BASIN', layers: ['DER'] },
  { name: 'geox.thermal_maturity_history', desc: 'Burial + heat flow + maturity modeling through time. EasyRo + TTI.', domain: 'STRUCTURAL & BASIN', layers: ['DER'] },
  { name: 'geox.falsify', desc: 'Popperian falsification engine — Kill Matrix K001-K007 + contradiction scan. GENESIS/015…', domain: 'VOLUMETRICS & POS', layers: ['SPEC', 'GOV'] },
  { name: 'geox.contradiction_scan', desc: 'Scan claims for contradictions using13-type ontology. Classifies severity…', domain: 'VOLUMETRICS & POS', layers: ['OBS', 'GOV'] },
  { name: 'geox.lem_predict', desc: 'LEM inference — predict rock properties (porosity, Sw, lithology) from well log curves.…', domain: 'WELL LOG & PETROPHYSICS', layers: ['DER'] },
  { name: 'geox.physical_reality_interpret', desc: 'Multi-attribute physical reality gate plus horizon and fault extraction from seismic…', domain: 'SEISMIC', layers: ['INT'] },
  { name: 'geox.well_tie_compute', desc: 'Well-to-seismic tie computation: cross-correlation and wavelet extraction for time-depth…', domain: 'SEISMIC', layers: ['DER'] },
  { name: 'geox.forbidden_claims_scan', desc: 'Scan claims repository for forbidden or invalid geological assertions.', domain: 'VOLUMETRICS & POS', layers: ['SPEC'] },
  { name: 'geox.egs_query_uncertainty', desc: 'geox_egs_query_uncertainty — GEOX canonical surface tool.', domain: 'EARTH SURFACE & EVIDENCE', layers: ['DER', 'INT'] },
  { name: 'geox.egs_rock_physics', desc: 'geox_egs_rock_physics — GEOX canonical surface tool.', domain: 'EARTH SURFACE & EVIDENCE', layers: ['DER', 'INT'] },
  { name: 'geox.egs_data_qc_bundle', desc: 'geox_egs_data_qc_bundle — GEOX canonical surface tool.', domain: 'EARTH SURFACE & EVIDENCE', layers: ['OBS'] },
  { name: 'geox.egs_scenario_audit', desc: 'geox_egs_scenario_audit — GEOX canonical surface tool.', domain: 'EARTH SURFACE & EVIDENCE', layers: ['DER', 'INT'] },
  { name: 'geox.visual_understand', desc: 'Extract visual patterns from seismic section images using deep learning.', domain: 'SEISMIC', layers: ['INT'] },
  { name: 'geox.map_layers_list', desc: 'List available map layers and their spatial extents.', domain: 'EARTH SURFACE & EVIDENCE', layers: ['INT'] },
  { name: 'geox.map_scene_plan', desc: 'Plan map scene composition: layer ordering, zoom, and annotation layout.', domain: 'EARTH SURFACE & EVIDENCE', layers: ['INT'] },
  { name: 'geox.map_render_preview', desc: 'Render preview of map scene for quality review before export.', domain: 'EARTH SURFACE & EVIDENCE', layers: ['INT'] },
  { name: 'geox.workspace', desc: 'GEOX Workspace — persistent geological context across all tools. Set basin/play/well…', domain: 'EARTH SURFACE & EVIDENCE', layers: ['INT'] },
  { name: 'geox.well_seismic_mistie_rms', desc: 'Well-seismic mistie analysis: compute RMS mistie between well markers and seismic…', domain: 'SEISMIC', layers: ['DER'] },
  { name: 'geox.wavelet_extract_least_squares', desc: 'Wavelet extraction: derive source wavelet from well tie using least-squares method. [ZEN…', domain: 'SEISMIC', layers: ['DER'] },
  { name: 'geox.geological_model_generate', desc: 'Deterministic geological model renderer. Generates 2D cross-sections from structural…', domain: 'STRUCTURAL & BASIN', layers: ['DER'] },
  { name: 'geox.gempy_implicit_3d', desc: 'GemPy implicit 3D structural modeling via universal cokriging scalar potential fields.…', domain: 'STRUCTURAL & BASIN', layers: ['INT'] },
  { name: 'geox.h3_spatial_index', desc: 'H3 hexagonal spatial indexing toolkit. Convert lat/lng to H3 cells, aggregate points,…', domain: 'GEOMECHANICS', layers: ['DER', 'INT'] },
  { name: 'geox.lancedb_embed_store', desc: 'LanceDB embedded vector store for earth embeddings. Store/search AlphaEarth/Clay/custom…', domain: 'EARTH SURFACE & EVIDENCE', layers: ['DER'] },
  { name: 'geox.stac_discover', desc: 'STAC catalog discovery for cloud-native geospatial assets. Query COG/GeoParquet/Zarr…', domain: 'EARTH SURFACE & EVIDENCE', layers: ['OBS'] },
  { name: 'geox.dde_reason', desc: 'DDE Ontology + Macrostrat neuro-symbolic reasoner. Query knowledge graph for…', domain: 'EARTH SURFACE & EVIDENCE', layers: ['SPEC'] },
]

const DOMAINS: Array<'ALL' | Domain> = [
  'ALL',
  'WELL LOG & PETROPHYSICS',
  'SEISMIC',
  'STRUCTURAL & BASIN',
  'GEOMECHANICS',
  'VOLUMETRICS & POS',
  'EARTH SURFACE & EVIDENCE',
  'EMV BRIDGE',
]

const KILL_ROWS = [
  { id: 'K001', test: 'Seal capacity < hydrocarbon column height', verdict: 'KILL', tone: 'red' as const },
  { id: 'K002', test: 'Charge timing post-dates trap formation', verdict: 'KILL', tone: 'red' as const },
  { id: 'K003', test: 'Reservoir deliverability below economic cutoff', verdict: 'KILL', tone: 'red' as const },
  { id: 'K004', test: 'Porosity-perm transform fails blind test', verdict: 'KILL', tone: 'red' as const },
  { id: 'K005', test: 'Source maturity insufficient at kitchen', verdict: 'KILL', tone: 'red' as const },
  { id: 'K006', test: 'Migration pathway breached by late faulting', verdict: 'ESCALATE', tone: 'amber' as const },
  { id: 'K007', test: 'No valid OBS anchor in evidence chain', verdict: 'ESCALATE 888_HOLD', tone: 'amber' as const },
]

const ENDPOINTS = [
  { path: '/health', status: 'LIVE', tone: C.telemetry },
  { path: '/mcp', status: 'PARTIAL', tone: C.amber },
  { path: '/profile', status: 'LIVE', tone: C.telemetry },
  { path: '/scenarios', status: 'LIVE', tone: C.telemetry },
]

/* ---------------------------------- shared bits ---------------------------------- */

function MonoLabel({ children, color = C.boneDim, className = '' }: { children: React.ReactNode; color?: string; className?: string }) {
  return (
    <span
      className={`text-[11px] uppercase ${className}`}
      style={{ fontFamily: FONT_MONO, letterSpacing: '0.18em', color }}
    >
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

function SeismicDivider({ red = false }: { red?: boolean }) {
  const color = red ? C.red : C.telemetry
  const pts = useMemo(() => {
    let d = 'M0 20'
    for (let x = 0; x <= 1200; x += 12) {
      const spike = x % 180 < 24 ? 14 : 4
      d += ` L${x} ${20 + (Math.random() - 0.5) * spike * 2}`
    }
    return d
  }, [])
  return (
    <div className="relative h-10 w-full overflow-hidden" aria-hidden>
      <svg viewBox="0 0 1200 40" preserveAspectRatio="none" className="h-full w-full">
        <motion.path
          d={pts}
          fill="none"
          stroke={color}
          strokeWidth="1"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        />
      </svg>
      <div className="absolute inset-x-0 top-1/2 h-px" style={{ background: C.border }} />
    </div>
  )
}

function WordReveal({ text, className = '', style = {} }: { text: string; className?: string; style?: React.CSSProperties }) {
  const words = text.split(' ')
  return (
    <span className={className} style={style}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.7 }}
          transition={{ duration: 0.7, delay: i * 0.06, ease: EASE }}
        >
          {w}
          {i < words.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}

/* ---------------------------------- tool tile ---------------------------------- */

function ToolTile({ tool, index }: { tool: Tool; index: number }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${tool.name}()`)
      setCopied(true)
      setTimeout(() => setCopied(false), 1200)
    } catch { /* clipboard unavailable */ }
  }
  return (
    <motion.button
      type="button"
      layout
      onClick={copy}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, delay: index * 0.04, ease: EASE }}
      whileHover={{ y: -3 }}
      className="group relative rounded-lg border p-4 text-left"
      style={{ background: C.panel, borderColor: C.border }}
    >
      <div className="flex items-start justify-between gap-2">
        <span
          className="text-[12px] font-medium transition-colors duration-200 group-hover:text-[#5FD68A]"
          style={{ fontFamily: FONT_MONO, color: C.bone }}
        >
          {tool.name}()
        </span>
        <span className="opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          {copied
            ? <Check className="h-3.5 w-3.5" style={{ color: C.telemetry }} />
            : <Copy className="h-3.5 w-3.5" style={{ color: C.boneDim }} />}
        </span>
      </div>
      <p className="mt-2 text-[12px] leading-snug" style={{ fontFamily: FONT_BODY, color: C.boneMid }}>
        {tool.desc}
      </p>
      <div className="mt-3 flex items-center justify-between">
        <EpiDots layers={tool.layers} />
        {copied && (
          <span className="text-[9px] uppercase" style={{ fontFamily: FONT_MONO, color: C.telemetry, letterSpacing: '0.18em' }}>
            COPIED
          </span>
        )}
      </div>
      <span className="pointer-events-none absolute inset-0 rounded-lg border border-transparent transition-colors duration-200 group-hover:border-[#E8733B66]" />
    </motion.button>
  )
}

/* ---------------------------------- sections ---------------------------------- */

function HeroSection() {
  return (
    <section className="relative overflow-hidden" style={{ background: C.bg, minHeight: '70vh' }}>
      {/* faint depth ticks rail */}
      <div className="pointer-events-none absolute right-6 top-0 hidden h-full flex-col justify-between py-16 lg:flex" aria-hidden>
        {['-0m', '-900m', '-1800m', '-2700m', '-3600m', '-4500m'].map((t) => (
          <span key={t} className="text-[10px]" style={{ fontFamily: FONT_MONO, color: C.boneDim }}>{t}</span>
        ))}
      </div>
      <div className="mx-auto grid max-w-[1280px] items-center gap-12 px-8 py-28 lg:grid-cols-2 lg:py-36">
        <div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-3"
          >
            <span className="h-2 w-2 animate-pulse rounded-full" style={{ background: C.telemetry }} />
            <MonoLabel color={C.telemetry}>EARTH INTELLIGENCE ORGAN // :8081</MonoLabel>
          </motion.div>
          <h1
            className="mt-6 text-[42px] font-extrabold leading-[1.02] md:text-[64px]"
            style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em', color: C.bone }}
          >
            <WordReveal text="An Evidence-First Subsurface Coprocessor." />
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: EASE }}
            className="mt-6 max-w-xl text-[15px] leading-[1.65] md:text-[17px]"
            style={{ fontFamily: FONT_BODY, color: C.boneMid }}
          >
            GEOX computes geological evidence — never adjudicates. Every number it
            returns carries its epistemic layer, its uncertainty, and its kill
            conditions.
          </motion.p>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="mt-8 flex flex-wrap items-center gap-3"
          >
            {['SYSTEM_LIVE', 'VAULT_999_CONNECTED', 'Ω₀ 0.04'].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] uppercase"
                style={{ fontFamily: FONT_MONO, borderColor: C.border, color: C.boneMid, letterSpacing: '0.12em' }}
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: C.telemetry }} />
                {chip}
              </span>
            ))}
          </motion.div>
        </div>
        <div className="relative">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.3, ease: EASE }}
            className="relative"
          >
            {/* ember under-glow */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1.2 }}
              className="absolute -inset-8 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(ellipse at center, #E8733B22 0%, transparent 70%)' }}
              aria-hidden
            />
            <motion.img
              src="/epistemic-core.png"
              alt="Epistemic core sample — four glowing layers: observed, derived, interpreted, speculated"
              className="relative w-full rounded-lg border"
              style={{ borderColor: C.border }}
              animate={{ rotate: [-2, 2, -2] }}
              transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            />
            <div className="mt-3 flex justify-between">
              <MonoLabel>agent: geox.rasa_score()</MonoLabel>
              <MonoLabel color={C.boneDim}>fig. 01 — epistemic core</MonoLabel>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function ToolsSection() {
  const [filter, setFilter] = useState<'ALL' | Domain>('ALL')
  const visible = useMemo(
    () => (filter === 'ALL' ? TOOLS : TOOLS.filter((t) => t.domain === filter)),
    [filter],
  )
  return (
    <section className="py-20 md:py-[120px]" style={{ background: C.bg }}>
      <div className="mx-auto max-w-[1280px] px-8">
        <MonoLabel color={C.magma}>THE CANONICAL SURFACE</MonoLabel>
        <h2
          className="mt-4 text-[32px] font-bold leading-[1.08] md:text-5xl"
          style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em', color: C.bone }}
        >
          <WordReveal text="42 tools. Live surface." />
        </h2>
        <p className="mt-4 max-w-2xl text-[15px] leading-[1.65]" style={{ fontFamily: FONT_BODY, color: C.boneMid }}>
          Every tile is a live affordance — click any tool to copy its invocation.
          Colored dots mark the epistemic layers the tool is allowed to emit.
        </p>

        {/* filter tabs */}
        <div className="mt-10 flex flex-wrap gap-2">
          {DOMAINS.map((d) => {
            const active = filter === d
            return (
              <button
                key={d}
                type="button"
                onClick={() => setFilter(d)}
                className="relative rounded-full border px-4 py-2 text-[11px] uppercase transition-colors"
                style={{
                  fontFamily: FONT_MONO,
                  letterSpacing: '0.14em',
                  borderColor: active ? C.magma : C.border,
                  color: active ? C.bone : C.boneMid,
                  background: active ? '#E8733B14' : 'transparent',
                }}
              >
                {d}
                {active && (
                  <motion.span
                    layoutId="tool-tab-underline"
                    className="absolute inset-x-4 -bottom-px h-px"
                    style={{ background: C.magma }}
                  />
                )}
              </button>
            )
          })}
        </div>

        {/* grid */}
        <motion.div layout className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <AnimatePresence mode="popLayout">
            {visible.map((t, i) => (
              <ToolTile key={t.name} tool={t} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="mt-6 flex items-center justify-between border-t pt-4" style={{ borderColor: C.border }}>
          <MonoLabel>agent: tools/list → 42 canonical tools</MonoLabel>
          <MonoLabel color={C.boneDim}>{visible.length} / 42 shown</MonoLabel>
        </div>
      </div>
    </section>
  )
}

function KillMatrixSection() {
  return (
    <section className="py-20 md:py-[120px]" style={{ background: '#0D0A0B' }}>
      <div className="mx-auto max-w-[1280px] px-8">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <ShieldAlert className="h-4 w-4" style={{ color: C.red }} />
              <MonoLabel color={C.red}>FALSIFICATION-FIRST</MonoLabel>
            </div>
            <h2
              className="mt-4 text-[32px] font-bold leading-[1.08] md:text-5xl"
              style={{ fontFamily: FONT_DISPLAY, letterSpacing: '-0.02em', color: C.bone }}
            >
              <WordReveal text="The Kill Matrix." />
            </h2>
            <p className="mt-6 text-[15px] leading-[1.65]" style={{ fontFamily: FONT_BODY, color: C.boneMid }}>
              Optimism is cheap. GEOX runs the Kill Matrix before any synthesis:
              seven falsification batteries that try to destroy the prospect.
              Survivors may be spoken of. The dead are sealed, honestly, in
              VAULT999.
            </p>
            <div className="mt-8">
              <MonoLabel>agent: geox.kill_matrix(K001…K007)</MonoLabel>
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="overflow-hidden rounded-lg border" style={{ borderColor: C.border, background: C.panel }}>
              <div className="flex items-center gap-2 border-b px-4 py-2.5" style={{ borderColor: C.border, background: C.raised }}>
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.red }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.amber }} />
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: C.telemetry }} />
                <span className="ml-3 text-[11px]" style={{ fontFamily: FONT_MONO, color: C.boneDim }}>
                  geox://kill_matrix/battery
                </span>
              </div>
              <div>
                {KILL_ROWS.map((row, i) => (
                  <motion.div
                    key={row.id}
                    initial={{ opacity: 0, x: 48 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                    className="grid grid-cols-[64px_1fr_auto] items-center gap-4 border-b px-4 py-3.5 last:border-b-0"
                    style={{ borderColor: C.border }}
                  >
                    <span className="text-[12px] font-semibold" style={{ fontFamily: FONT_MONO, color: C.red }}>
                      {row.id}
                    </span>
                    <span className="text-[12px]" style={{ fontFamily: FONT_MONO, color: C.boneMid }}>
                      {row.test}
                    </span>
                    <span
                      className="inline-flex items-center gap-2 rounded border px-2.5 py-1 text-[10px] uppercase"
                      style={{
                        fontFamily: FONT_MONO,
                        letterSpacing: '0.12em',
                        color: row.tone === 'red' ? C.red : C.amber,
                        borderColor: row.tone === 'red' ? '#E0525244' : '#D9A44144',
                        background: row.tone === 'red' ? '#E0525210' : '#D9A44110',
                      }}
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.08 + 0.4, type: 'spring', stiffness: 300, damping: 18 }}
                        className="h-1.5 w-1.5 rounded-full"
                        style={{ background: row.tone === 'red' ? C.red : C.amber }}
                      />
                      {row.verdict}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-16">
          <SeismicDivider red />
        </div>
      </div>
    </section>
  )
}

function HoldVaultSection() {
  const holdLines = [
    '$ geox.hold_888(prospect="SB-ALPHA", irreversible=true)',
    '> HOLD 888 engaged',
    '> F13 SOVEREIGN_VETO — floor active',
    '> awaiting sovereign signature…',
  ]
  const chain = ['0x9f3a…c41d', '0x71be…88f0', '0x55aa…e207', 'SEALED']
  return (
    <section className="py-20 md:py-[120px]" style={{ background: C.bg }}>
      <div className="mx-auto grid max-w-[1280px] gap-12 px-8 lg:grid-cols-2">
        {/* 888_HOLD */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <Lock className="h-4 w-4" style={{ color: C.amber }} />
            <MonoLabel color={C.amber}>888_HOLD</MonoLabel>
          </div>
          <h3 className="mt-4 text-2xl font-bold md:text-3xl" style={{ fontFamily: FONT_DISPLAY, color: C.bone }}>
            Sovereign hands on the brake.
          </h3>
          <p className="mt-4 text-[15px] leading-[1.65]" style={{ fontFamily: FONT_BODY, color: C.boneMid }}>
            High-risk and irreversible outputs freeze into a hold state. A sovereign
            human must release them. F13 — the Sovereign Human Veto — is not a
            feature flag; it is load-bearing.
          </p>
          <div className="mt-6 overflow-hidden rounded-md border" style={{ borderColor: C.border, background: C.raised }}>
            <div className="flex items-center gap-2 border-b px-4 py-2" style={{ borderColor: C.border }}>
              <span className="h-2 w-2 rounded-full" style={{ background: C.red }} />
              <span className="h-2 w-2 rounded-full" style={{ background: C.amber }} />
              <span className="h-2 w-2 rounded-full" style={{ background: C.telemetry }} />
              <span className="ml-2 text-[11px]" style={{ fontFamily: FONT_MONO, color: C.boneDim }}>hold/888</span>
            </div>
            <div className="p-4">
              {holdLines.map((line, i) => (
                <motion.div
                  key={line}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, amount: 0.4 }}
                  transition={{ delay: 0.4 + i * 0.55, duration: 0.3 }}
                  className="flex items-center gap-2 py-1 text-[12px]"
                  style={{ fontFamily: FONT_MONO, color: i === 0 ? C.boneMid : i === holdLines.length - 1 ? C.amber : C.bone }}
                >
                  {i === holdLines.length - 1 && (
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                      className="h-2 w-2 rounded-full"
                      style={{ background: C.amber }}
                    />
                  )}
                  {line}
                </motion.div>
              ))}
              <motion.span
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="mt-1 inline-block h-3.5 w-2"
                style={{ background: C.bone }}
              />
            </div>
          </div>
        </motion.div>

        {/* VAULT999 */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
        >
          <div className="flex items-center gap-3">
            <FileCheck className="h-4 w-4" style={{ color: C.telemetry }} />
            <MonoLabel color={C.telemetry}>VAULT999</MonoLabel>
          </div>
          <h3 className="mt-4 text-2xl font-bold md:text-3xl" style={{ fontFamily: FONT_DISPLAY, color: C.bone }}>
            Sealed. Immutable. Honest.
          </h3>
          <p className="mt-4 text-[15px] leading-[1.65]" style={{ fontFamily: FONT_BODY, color: C.boneMid }}>
            Every adjudicated decision is sealed to an immutable ledger: inputs,
            epistemic tags, RASA score, kill results, signature.
          </p>
          <div className="mt-6 rounded-md border p-5" style={{ borderColor: C.border, background: C.panel }}>
            <MonoLabel>ledger.chain — latest seals</MonoLabel>
            <div className="mt-4 flex flex-wrap items-center gap-2">
              {chain.map((h, i) => (
                <div key={h} className="flex items-center gap-2">
                  <motion.span
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.3, duration: 0.4, ease: EASE }}
                    className="rounded border px-3 py-1.5 text-[11px]"
                    style={{
                      fontFamily: FONT_MONO,
                      borderColor: i === chain.length - 1 ? C.telemetry : C.border,
                      color: i === chain.length - 1 ? C.telemetry : C.boneMid,
                      background: i === chain.length - 1 ? '#5FD68A10' : C.raised,
                    }}
                  >
                    {h}
                  </motion.span>
                  {i < chain.length - 1 && (
                    <motion.span
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.45 + i * 0.3, duration: 0.25 }}
                      className="h-px w-4 origin-left"
                      style={{ background: C.border }}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-4 border-t pt-3" style={{ borderColor: C.border }}>
              <MonoLabel>agent: geox.seal_vault999(entry)</MonoLabel>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function RasaSection() {
  const formula = 'RASA = evidence_credit × (1 − u_ambiguity) ≤ 0.90'
  return (
    <section className="py-20 md:py-[120px]" style={{ background: C.panel }}>
      <div className="mx-auto max-w-[900px] px-8 text-center">
        <MonoLabel color={C.amber}>RASA & HUMILITY</MonoLabel>
        <div
          className="mt-8 rounded-lg border p-8 md:p-12"
          style={{ borderColor: C.border, background: C.bg }}
        >
          <div className="text-[16px] md:text-2xl" style={{ fontFamily: FONT_MONO, color: C.bone }}>
            {formula.split('').map((ch, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ delay: i * 0.02, duration: 0.05 }}
                className={formula.slice(i).startsWith('0.90') || (i >= formula.indexOf('0.90') && i < formula.indexOf('0.90') + 4) ? 'font-semibold' : ''}
                style={i >= formula.indexOf('0.90') && i < formula.indexOf('0.90') + 4 ? { color: C.amber } : undefined}
              >
                {ch}
              </motion.span>
            ))}
          </div>
          <motion.div
            initial={{ scale: 1 }}
            whileInView={{ scale: [1, 1.3, 1] }}
            viewport={{ once: true }}
            transition={{ delay: formula.length * 0.02 + 0.3, duration: 0.6, ease: EASE }}
            className="mt-4 inline-block text-[11px] uppercase"
            style={{ fontFamily: FONT_MONO, letterSpacing: '0.18em', color: C.amber }}
          >
            hard cap — no score exceeds 0.90
          </motion.div>
        </div>
        <div className="mt-10 grid gap-6 text-left md:grid-cols-3">
          {[
            {
              t: 'Why the cap (F7)',
              b: 'Certainty is a lie the Earth never signs. F7 bounds every confidence at 0.90 so the remaining tenth is always a standing invitation to falsify.',
            },
            {
              t: 'Ω₀ ≈ 0.04',
              b: 'The calibration humility band: GEOX expects to be wrong roughly four times in a hundred, and prices that expectation into every score it emits.',
            },
            {
              t: 'Provenance',
              b: 'GEOX is built on Marmousi, validated on Volve. Open benchmark data, reproducible pipelines — no miracle curves trained on ghosts.',
            },
          ].map((p, i) => (
            <motion.div
              key={p.t}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.7, delay: i * 0.15, ease: EASE }}
              className="rounded-lg border p-5"
              style={{ borderColor: C.border, background: C.bg }}
            >
              <h4 className="text-[16px] font-bold" style={{ fontFamily: FONT_DISPLAY, color: C.bone }}>{p.t}</h4>
              <p className="mt-2 text-[13px] leading-[1.65]" style={{ fontFamily: FONT_BODY, color: C.boneMid }}>{p.b}</p>
            </motion.div>
          ))}
        </div>
        <div className="mt-8">
          <MonoLabel>agent: geox.rasa_score(evidence_chain)</MonoLabel>
        </div>
      </div>
    </section>
  )
}

function EndpointsSection() {
  return (
    <section className="py-16 md:py-24" style={{ background: C.bg }}>
      <div className="mx-auto max-w-[1280px] px-8">
        <motion.div
          initial={{ clipPath: 'inset(0 100% 0 0)' }}
          whileInView={{ clipPath: 'inset(0 0% 0 0)' }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="flex flex-col items-start justify-between gap-6 rounded-lg border p-6 md:flex-row md:items-center"
          style={{ borderColor: C.border, background: C.raised }}
        >
          <div className="flex flex-wrap items-center gap-3">
            <Activity className="h-4 w-4" style={{ color: C.telemetry }} />
            {ENDPOINTS.map((e, i) => (
              <motion.span
                key={e.path}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[11px]"
                style={{ fontFamily: FONT_MONO, borderColor: C.border, color: C.boneMid }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${e.status === 'LIVE' ? 'animate-pulse' : ''}`}
                  style={{ background: e.tone }}
                />
                {e.path}
                <span style={{ color: e.tone }}>· {e.status}</span>
              </motion.span>
            ))}
          </div>
          <Link
            to="/deploy"
            className="inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-[12px] font-semibold uppercase transition-shadow duration-300 hover:shadow-[0_0_24px_#E8733B55]"
            style={{ fontFamily: FONT_MONO, letterSpacing: '0.14em', background: C.magma, color: C.bg }}
          >
            SEE DEPLOYMENT <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

/* ---------------------------------- page ---------------------------------- */

export default function Platform() {
  return (
    <main style={{ background: C.bg, minHeight: '100dvh' }}>
      <HeroSection />
      <SeismicDivider />
      <ToolsSection />
      <KillMatrixSection />
      <HoldVaultSection />
      <RasaSection />
      <EndpointsSection />
    </main>
  )
}
