/**
 * MCPGateway — Constitutional agent access portal.
 * Appears at the bottom of every 5-bucket page.
 * One door per federation organ. DITEMPA BUKAN DIBERI.
 */

const organs: Array<{ label: string; desc: string; href: string; color: string; ring: string; internal?: boolean }> = [
  { label: 'arifOS',      desc: 'Constitutional kernel · init→judge→seal',    href: 'https://arifos.arif-fazil.com/mcp',   color: '#9AA0A8', ring: 'rgba(154,160,168,0.2)' },
  { label: 'GEOX',        desc: 'Earth intelligence · 42 MCP tools',           href: 'https://geox.arif-fazil.com/mcp',     color: '#D4A853', ring: 'rgba(212,168,83,0.2)' },
  { label: 'WEALTH',      desc: 'Capital intelligence · NPV/EMV/risk',         href: 'https://wealth.arif-fazil.com/mcp',   color: '#C9A227', ring: 'rgba(201,162,39,0.2)' },
  { label: 'WELL',        desc: 'Vitality mirror · human + machine readiness', href: 'https://well.arif-fazil.com/mcp',     color: '#38BEC9', ring: 'rgba(56,190,201,0.2)' },
  { label: 'A-FORGE',     desc: 'Governed execution shell · build/deploy',     href: 'https://mcp.arif-fazil.com/mcp',      color: '#E4572E', ring: 'rgba(228,87,46,0.2)' },
  { label: '000·Genesis', desc: 'Origin archive · /000/',                       href: '/000/',                                 color: '#9AA0A8', ring: 'rgba(154,160,168,0.2)', internal: true },
  { label: '999·Verify',  desc: 'Vault proof chain · /999/verify',              href: '/999/verify',                           color: '#EDEAE2', ring: 'rgba(237,234,226,0.2)', internal: true },
] as const

export default function MCPGateway() {
  return (
    <section className="border-t" style={{ borderColor: 'rgb(237 234 226 / 0.1)' }}>
      <div className="mx-auto max-w-[1280px] px-6 py-14">
        <div className="mb-6 flex items-center gap-3">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-ember" aria-hidden />
          <p className="font-mono text-[12px] uppercase tracking-[0.08em] text-ink-soft">Agent Access — MCP Gateway</p>
        </div>
        <p className="mb-6 max-w-[48ch] font-body text-[15px] leading-[1.6] text-ink-soft/70">
          Federation organs expose governed MCP surfaces. Each organ computes evidence.
          arifOS judges. Arif decides. <span className="text-ember">DITEMPA BUKAN DIBERI.</span>
        </p>
        <div className="flex flex-wrap gap-2">
          {organs.map((o) => (
            o.internal ? (
              <a
                key={o.label}
                href={o.href}
                className="inline-flex items-center gap-2 rounded-sm border px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.04em] transition-all duration-200"
                style={{ borderColor: 'rgb(237 234 226 / 0.12)', color: '#7A7880' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = o.color; e.currentTarget.style.color = o.color; e.currentTarget.style.boxShadow = `0 0 12px ${o.ring}` }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(237 234 226 / 0.12)'; e.currentTarget.style.color = '#7A7880'; e.currentTarget.style.boxShadow = 'none' }}
                title={o.desc}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: o.color }} />
                {o.label} →
              </a>
            ) : (
              <a
                key={o.label}
                href={o.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-sm border px-4 py-2.5 font-mono text-[12px] uppercase tracking-[0.04em] transition-all duration-200"
                style={{ borderColor: 'rgb(237 234 226 / 0.12)', color: '#7A7880' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = o.color; e.currentTarget.style.color = o.color; e.currentTarget.style.boxShadow = `0 0 12px ${o.ring}` }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgb(237 234 226 / 0.12)'; e.currentTarget.style.color = '#7A7880'; e.currentTarget.style.boxShadow = 'none' }}
                title={o.desc}
              >
                <span className="inline-block h-1.5 w-1.5 rounded-full" style={{ background: o.color }} />
                {o.label} ↗
              </a>
            )
          ))}
        </div>
        <p className="mt-4 font-mono text-[10px] text-ink-soft/40">
          arifOS 8 canonical verbs: arif_init → arif_observe → arif_think → arif_route → arif_memory → arif_judge → arif_forge → arif_seal
        </p>
      </div>
    </section>
  )
}
