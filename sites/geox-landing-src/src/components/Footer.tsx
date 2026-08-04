import { Link } from 'react-router'

const ORGANS = [
  { name: 'arifOS', port: ':8088' },
  { name: 'A-FORGE', port: ':7071' },
  { name: 'AAA', port: ':3001' },
  { name: 'GEOX', port: ':8081' },
  { name: 'WEALTH', port: ':18082' },
  { name: 'WELL', port: ':18083' },
  { name: 'HERMES', port: ':8644' },
]

const COLUMNS: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: 'Platform',
    links: [
      { label: 'Platform', to: '/platform' },
      { label: 'MCP Apps', to: '/mcp-apps' },
      { label: 'WebMCP', to: '/webmcp' },
      { label: 'Deploy', to: '/deploy' },
    ],
  },
  {
    title: 'Agents',
    links: [
      { label: 'llms.txt', to: '/llms.txt' },
      { label: 'mcp.json', to: '/.well-known/mcp.json' },
      { label: 'sitemap-agents.xml', to: '/sitemap-agents.xml' },
      { label: '/profile', to: '/profile' },
      { label: '/health', to: '/health' },
    ],
  },
  {
    title: 'Institution',
    links: [
      { label: 'Federation', to: '/federation' },
      { label: 'Access Tiers', to: '/deploy' },
      { label: 'Case File LC-001', to: '/platform' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'BSL-1.1 → Apache 2.0', to: '/deploy' },
      { label: 'Change date 2029-06-29', to: '/deploy' },
    ],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-strata-700 bg-basalt-950">
      {/* Federation strip */}
      <div className="border-b border-strata-700">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-8 gap-y-3 px-8 py-5 max-md:px-5">
          <span className="eyebrow text-bone-600">Federation</span>
          {ORGANS.map((o) => (
            <span key={o.name} className="flex items-center gap-2 font-mono text-[12px] text-bone-400">
              <span className="h-1.5 w-1.5 rounded-full bg-telemetry-400 animate-pulse-dot" />
              {o.name}
              <span className="text-bone-600">{o.port}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Link columns + agent affordances */}
      <div className="mx-auto grid max-w-[1280px] gap-10 px-8 py-14 max-md:px-5 md:grid-cols-4">
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h4 className={`eyebrow mb-4 ${col.title === 'Agents' ? 'text-telemetry-400' : 'text-bone-600'}`}>
              {col.title === 'Agents' ? 'For Agents' : col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    to={l.to}
                    data-cursor="OPEN"
                    className="font-mono text-[13px] text-bone-400 transition-colors hover:text-magma-400"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Creed line */}
      <div className="border-t border-strata-700">
        <div className="mx-auto flex max-w-[1280px] flex-wrap items-center justify-between gap-3 px-8 py-6 max-md:px-5">
          <p className="font-body text-sm italic text-bone-400">
            DITEMPA BUKAN DIBERI — truth must cool before it rules.
          </p>
          <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-bone-600">
            Ω₀ ≈ 0.04 · SEALed AAA-grade · © arifOS Federation
          </p>
        </div>
      </div>
    </footer>
  )
}
