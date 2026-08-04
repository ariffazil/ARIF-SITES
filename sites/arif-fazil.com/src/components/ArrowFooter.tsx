export default function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto max-w-[1280px] px-6 py-16">
        {/* Row 1 — creed */}
        <p className="font-display text-5xl tracking-[-0.02em] md:text-6xl">Forged, not given.</p>

        {/* Row 2 — human contact */}
        <div className="mt-10 flex flex-wrap gap-x-10 gap-y-3 font-body text-[18px] text-ink-soft">
          <a className="underline decoration-ink/30 underline-offset-4 hover:decoration-ember" href="mailto:arifos@arif-fazil.com">
            arifos@arif-fazil.com
          </a>
          <a className="underline decoration-ink/30 underline-offset-4 hover:decoration-ember" href="https://github.com/ariffazil" target="_blank" rel="noreferrer">
            GitHub — ariffazil
          </a>
          <a className="underline decoration-ink/30 underline-offset-4 hover:decoration-ember" href="https://t.me/ariffazil" target="_blank" rel="noreferrer">
            Telegram — @ariffazil
          </a>
        </div>

        {/* Row 3 — for machines (quiet) */}
        <div className="mt-12 border-t hairline pt-5">
          <p className="eyebrow mb-3 text-[11px] text-ink-soft/70">For machines</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 font-mono text-[12px] tracking-[0.04em] text-ink-soft/80">
            <a href="/llms.txt" className="hover:text-ink">llms.txt</a>
            <span aria-hidden className="text-ink/30">·</span>
            <a href="/arifos.json" className="hover:text-ink">arifos.json</a>
            <span aria-hidden className="text-ink/30">·</span>
            <a href="/.well-known/did.json" className="hover:text-ink">/.well-known/did.json</a>
            <span aria-hidden className="text-ink/30">·</span>
            <a href="https://mcp.arif-fazil.com/mcp" className="hover:text-ink" target="_blank" rel="noreferrer">
              mcp.arif-fazil.com/mcp
            </a>
            <span aria-hidden className="text-ink/30">·</span>
            <a href="https://pypi.org/project/arifos/" className="hover:text-ink" target="_blank" rel="noreferrer">
              PyPI arifos
            </a>
          </div>
          <p className="mt-6 font-mono text-[12px] tracking-[0.04em] text-ink-soft/60">
            © 2026 Muhammad Arif bin Fazil
          </p>
        </div>
      </div>
    </footer>
  )
}
