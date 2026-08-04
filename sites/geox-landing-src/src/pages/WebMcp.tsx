import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Copy, Check, FileText, Globe, Cpu, Network, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'

/* ---------------- tokens ---------------- */
const DISPLAY = "font-['Sora',sans-serif]"
const MONO = "font-['JetBrains_Mono',monospace]"
const BODY = "font-['Inter',sans-serif]"

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className={`${MONO} text-xs uppercase tracking-[0.18em] text-[#E8733B] mb-4`}>{children}</p>
  )
}

/* ---------------- copy button ---------------- */
function CopyButton({ text, label = 'COPY' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard?.writeText(text).catch(() => {})
        setCopied(true)
        setTimeout(() => setCopied(false), 1600)
      }}
      className={`${MONO} inline-flex items-center gap-2 text-[11px] uppercase tracking-widest border border-[#2A2F37] px-3 py-1.5 rounded text-[#9AA0A8] hover:text-[#5FD68A] hover:border-[#5FD68A]/50 transition-colors`}
    >
      {copied ? <Check className="w-3.5 h-3.5 text-[#5FD68A]" /> : <Copy className="w-3.5 h-3.5" />}
      {copied ? 'COPIED' : label}
    </button>
  )
}

/* ---------------- hero terminal ---------------- */
const MANIFEST_LINES = [
  '$ GET /.well-known/mcp.json',
  '{',
  '  "name": "geox",',
  '  "version": "1.0.0",',
  '  "endpoint": "https://geox.arif-fazil.com/mcp",',
  '  "transport": "sse",',
  '  "capabilities": ["tools", "prompts", "resources"],',
  '  "tools": 42,',
  '  "apps": 18,',
  '  "auth": { "scheme": "none", "governed": "AAA :3001" },',
  '  "epistemic_contract": "OBS/DER/INT/SPEC",',
  '  "rasa_cap": 0.90,',
  '  "hold": "888_HOLD // F13"',
  '}',
]

function ManifestTerminal() {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (count >= MANIFEST_LINES.length) return
    const t = setTimeout(() => setCount((c) => c + 1), count === 0 ? 700 : 90)
    return () => clearTimeout(t)
  }, [count])
  return (
    <div className="rounded-md border border-[#2A2F37] bg-[#111318] overflow-hidden shadow-2xl">
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[#2A2F37] bg-[#1A1E24]">
        <span className="w-2.5 h-2.5 rounded-full bg-[#E05252]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#D9A441]/70" />
        <span className="w-2.5 h-2.5 rounded-full bg-[#5FD68A]/70" />
        <span className={`${MONO} ml-3 text-[11px] text-[#5C636C]`}>geox://.well-known/mcp.json</span>
      </div>
      <div className={`${MONO} p-5 text-[13px] leading-relaxed min-h-[340px]`}>
        {MANIFEST_LINES.slice(0, count).map((l, i) => (
          <div key={i} className={i === 0 ? 'text-[#5FD68A]' : 'text-[#9AA0A8]'}>
            {l}
          </div>
        ))}
        <span className="inline-block w-2 h-4 bg-[#5FD68A] animate-pulse" />
      </div>
    </div>
  )
}

/* ---------------- agent files ---------------- */
const AGENT_FILES = [
  {
    file: '/llms.txt',
    desc: 'Curated map of every surface, tool, and scenario in plain markdown. The front door for any LLM.',
    snippet: '# GEOX — Earth Intelligence\n> MCP: geox.arif-fazil.com/mcp\n> 42 tools · 18 apps · F1–F13',
    action: 'VIEW FILE',
    href: '/llms.txt',
  },
  {
    file: '/llms-full.txt',
    desc: 'The complete corpus: schemas, epistemic rules, kill matrix definitions.',
    snippet: '## Epistemic Contract\nE1 epistemic_layer: OBS|DER|INT|SPEC\nE2 RASA ≤ 0.90 on SPEC',
    action: 'VIEW FILE',
    href: '/llms-full.txt',
  },
  {
    file: '/.well-known/mcp.json',
    desc: 'WebMCP manifest. Declares transport, auth, tool catalog, and the 18 GUI apps.',
    snippet: '{ "name": "geox",\n  "transport": "sse",\n  "widget_spec": "SEP-1865" }',
    action: 'VIEW FILE',
    href: '/.well-known/mcp.json',
  },
  {
    file: '/sitemap.xml',
    desc: 'Crawl map weighted by agent relevance, not page rank.',
    snippet: '<urlset>\n  <url>/webmcp 0.8</url>\n  <url>/deploy 0.8</url>\n</urlset>',
    action: 'VIEW FILE',
    href: '/sitemap.xml',
  },
]

/* ---------------- quickstart ---------------- */
const CLIENT_TABS: Record<string, string> = {
  'Claude Desktop': `// claude_desktop_config.json
{
  "mcpServers": {
    "geox": {
      "url": "https://geox.arif-fazil.com/mcp",
      "transport": "sse"
    }
  }
}`,
  ChatGPT: `# ChatGPT — MCP connector
# Settings → Connectors → Add MCP server
name:      GEOX
endpoint:  https://geox.arif-fazil.com/mcp
transport: SSE
widgets:   SEP-1865 (18 inline apps)`,
  'VS Code Copilot': `// .vscode/mcp.json
{
  "servers": {
    "geox": {
      "type": "sse",
      "url": "https://geox.arif-fazil.com/mcp"
    }
  }
}`,
  curl: `# discover tools
curl -N https://geox.arif-fazil.com/mcp \\
  -H "Accept: text/event-stream"

# sanity check
curl https://geox.arif-fazil.com/health`,
}

const TOOL_CALL = `> geox.stoiip({ prospect: "KINABALU-N", p50_area_km2: 42 })

{
  "p10_mmbbl": 184.2,
  "p50_mmbbl": 96.7,
  "p90_mmbbl": 41.3,
  "epistemic_layer": "DER",
  "rasa": 0.84,
  "provenance": ["OBS: seismic_attr.kin_n"],
  "hold": null
}`

const APP_SNIPPET = `// register an SEP-1865 inline widget
await session.registerApp({
  id: "geox.app.welldesk",
  widget: "sep-1865",
  source: "https://geox.arif-fazil.com/mcp"
})
// → 1D well log renders inline in the client GUI`

function Quickstart() {
  const clients = Object.keys(CLIENT_TABS)
  const [tab, setTab] = useState(clients[0])
  const ref = useRef<HTMLPreElement>(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const [typed, setTyped] = useState(0)
  useEffect(() => {
    if (!inView) return
    if (typed >= TOOL_CALL.length) return
    const t = setTimeout(() => setTyped((c) => Math.min(c + 6, TOOL_CALL.length)), 24)
    return () => clearTimeout(t)
  }, [inView, typed])

  const steps = [
    {
      n: '01',
      title: 'Point your client',
      body: (
        <div>
          <div className="flex flex-wrap gap-1 mb-3">
            {clients.map((c) => (
              <button
                key={c}
                onClick={() => setTab(c)}
                className={`${MONO} text-[11px] uppercase tracking-widest px-3 py-1.5 rounded border transition-colors ${
                  tab === c
                    ? 'border-[#E8733B] text-[#E8733B] bg-[#E8733B]/10'
                    : 'border-[#2A2F37] text-[#5C636C] hover:text-[#9AA0A8]'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.pre
              key={tab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
              className={`${MONO} text-[12.5px] leading-relaxed text-[#9AA0A8] bg-[#111318] border border-[#2A2F37] rounded-md p-4 overflow-x-auto whitespace-pre`}
            >
              {CLIENT_TABS[tab]}
            </motion.pre>
          </AnimatePresence>
        </div>
      ),
    },
    {
      n: '02',
      title: 'Call a tool',
      body: (
        <pre
          ref={ref}
          className={`${MONO} text-[12.5px] leading-relaxed text-[#9AA0A8] bg-[#111318] border border-[#2A2F37] rounded-md p-4 overflow-x-auto whitespace-pre min-h-[240px]`}
        >
          {TOOL_CALL.slice(0, typed)}
          <span className="inline-block w-2 h-3.5 bg-[#5FD68A] animate-pulse align-middle" />
        </pre>
      ),
    },
    {
      n: '03',
      title: 'Render an app',
      body: (
        <pre
          className={`${MONO} text-[12.5px] leading-relaxed text-[#9AA0A8] bg-[#111318] border border-[#2A2F37] rounded-md p-4 overflow-x-auto whitespace-pre`}
        >
          {APP_SNIPPET}
        </pre>
      ),
    },
  ]

  return (
    <div className="relative pl-8 md:pl-12">
      <div className="absolute left-2 md:left-4 top-2 bottom-2 w-px bg-gradient-to-b from-[#D9A441] via-[#D9A441]/40 to-transparent" />
      {steps.map((s, i) => (
        <motion.div
          key={s.n}
          variants={fadeUp}
          custom={i}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-60px' }}
          className="relative mb-14 last:mb-0"
        >
          <span
            className={`${MONO} absolute -left-8 md:-left-12 top-0 w-8 md:w-12 text-right text-[11px] text-[#D9A441] pt-1`}
          >
            {s.n}
          </span>
          <span className="absolute -left-[26px] md:-left-[42px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#D9A441] shadow-[0_0_12px_#D9A44188]" />
          <h3 className={`${DISPLAY} text-xl md:text-2xl font-bold text-[#EDEAE2] mb-4`}>{s.title}</h3>
          {s.body}
        </motion.div>
      ))}
    </div>
  )
}

/* ---------------- four surfaces ---------------- */
const SURFACES = [
  { icon: Globe, name: 'SITE', desc: 'Humans read. Every page dual-authored with agent annotations.', status: 'LIVE' },
  { icon: FileText, name: 'WebMCP', desc: 'Agents discover. Manifest, llms.txt, crawl map.', status: 'LIVE' },
  { icon: Cpu, name: 'MCP', desc: 'Agents compute. 42 tools over SSE at :8081.', status: 'LIVE' },
  { icon: Network, name: 'A2A', desc: 'Organs negotiate. AAA :3001 control plane.', status: 'LIVE' },
]

/* ---------------- epistemic rules ---------------- */
const RULES = [
  { id: 'E1', text: 'Every response includes epistemic_layer: OBS | DER | INT | SPEC.' },
  { id: 'E2', text: 'SPEC outputs are capped by RASA ≤ 0.90 and labeled hypothesis.' },
  { id: 'E3', text: 'Irreversible/high-risk calls return status: 888_HOLD until sovereign human release (F13).' },
  { id: 'E4', text: 'Agents may seal any result to VAULT999 via geox.seal_vault999().' },
  { id: 'E5', text: 'Ω₀ ≈ 0.04 — the Earth keeps its humility band; your model should too.' },
]

/* ---------------- page ---------------- */
export default function WebMcp() {
  return (
    <div className={`${BODY} bg-[#0A0B0D] text-[#EDEAE2] min-h-[100dvh]`}>
      {/* Hero */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 pt-20 md:pt-28 pb-24 grid lg:grid-cols-2 gap-12 items-center">
        <motion.div initial="hidden" animate="show" variants={fadeUp}>
          <Eyebrow>AGENTIC WEB // SURFACE 2 OF 4</Eyebrow>
          <h1 className={`${DISPLAY} text-[42px] md:text-[64px] font-extrabold leading-[1.02] tracking-[-0.02em] mb-6`}>
            Built for the machine readers.
          </h1>
          <p className="text-[15px] md:text-[17px] leading-[1.65] text-[#9AA0A8] max-w-xl mb-6">
            Every GEOX surface is dual-authored: rendered for human eyes, enumerated for agents.
            Manifests, tool schemas, and epistemic contracts are first-class citizens.
          </p>
          <div className={`${MONO} inline-flex items-center gap-2 text-[11px] uppercase tracking-widest border border-[#2A2F37] rounded px-3 py-1.5 text-[#5C636C]`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5FD68A] animate-pulse" />
            agent detected? ua: curious
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.9 }}>
          <ManifestTerminal />
        </motion.div>
      </section>

      {/* Agent files */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-t border-[#2A2F37]">
        <Eyebrow>THE AGENT FILES</Eyebrow>
        <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-12`}>
          Four files. Whole surface.
        </h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {AGENT_FILES.map((f, i) => (
            <motion.div
              key={f.file}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="group rounded-lg border border-[#2A2F37] bg-[#111318] p-6 flex flex-col hover:border-[#5FD68A]/40 transition-colors"
            >
              <h3 className={`${MONO} text-sm text-[#EDEAE2] group-hover:text-[#5FD68A] transition-colors mb-3 break-all`}>
                {f.file}
              </h3>
              <p className="text-sm text-[#9AA0A8] leading-relaxed mb-4 flex-1">{f.desc}</p>
              <pre className={`${MONO} text-[11px] text-[#5C636C] bg-[#0A0B0D] border border-[#2A2F37] rounded p-3 mb-4 overflow-hidden h-20 whitespace-pre-wrap`}>
                {f.snippet}
              </pre>
              <div className="flex items-center justify-between">
                <a
                  href={f.href}
                  target="_blank"
                  rel="noreferrer"
                  className={`${MONO} text-[11px] uppercase tracking-widest text-[#E8733B] hover:text-[#F09A62] inline-flex items-center gap-1`}
                >
                  {f.action} <ArrowRight className="w-3 h-3" />
                </a>
                <CopyButton text={`https://geox.arif-fazil.com${f.file}`} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Quickstart */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-t border-[#2A2F37]">
        <Eyebrow>CONNECT IN 60 SECONDS</Eyebrow>
        <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-14`}>
          Agent quickstart.
        </h2>
        <div className="max-w-3xl">
          <Quickstart />
        </div>
      </section>

      {/* Four surfaces */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-t border-[#2A2F37]">
        <Eyebrow>FOUR SURFACES, ONE CONTRACT</Eyebrow>
        <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-12`}>
          Same Earth. Four doors.
        </h2>
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {SURFACES.map((s, i) => (
            <motion.div
              key={s.name}
              variants={fadeUp}
              custom={i}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-60px' }}
              className="rounded-lg border border-[#2A2F37] bg-[#111318] p-6 hover:border-[#E8733B]/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-4">
                <s.icon className="w-5 h-5 text-[#E8733B]" />
                <span className={`${MONO} inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-[#5FD68A]`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5FD68A] animate-pulse" /> {s.status}
                </span>
              </div>
              <h3 className={`${DISPLAY} text-xl font-bold mb-2`}>{s.name}</h3>
              <p className="text-sm text-[#9AA0A8] leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Epistemic contract */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-20 border-t border-[#2A2F37]">
        <Eyebrow>EPISTEMIC CONTRACT FOR AGENTS</Eyebrow>
        <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-12`}>
          Rules that travel with every call.
        </h2>
        <div className="rounded-lg border border-[#2A2F37] bg-[#111318] p-6 md:p-10">
          {RULES.map((r, i) => (
            <motion.div
              key={r.id}
              variants={fadeUp}
              custom={i * 2}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              className="flex gap-5 items-baseline py-4 border-b border-[#2A2F37] last:border-0"
            >
              <span className={`${MONO} text-sm font-semibold text-[#D9A441] shrink-0`}>{r.id}</span>
              <p className={`${MONO} text-sm md:text-[15px] text-[#9AA0A8] leading-relaxed`}>{r.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-[1280px] mx-auto px-5 md:px-8 py-24 border-t border-[#2A2F37] text-center">
        <h2 className={`${DISPLAY} text-3xl md:text-5xl font-bold leading-[1.08] mb-8`}>
          Give your agent geological judgment.
        </h2>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <CopyButton text="https://geox.arif-fazil.com/.well-known/mcp.json" label="COPY MANIFEST URL" />
          <Link
            to="/platform"
            className={`${MONO} inline-flex items-center gap-2 text-[11px] uppercase tracking-widest bg-[#E8733B] text-[#0A0B0D] px-5 py-2.5 rounded font-semibold hover:shadow-[0_0_24px_#E8733B55] transition-shadow`}
          >
            EXPLORE THE TOOLS <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  )
}
