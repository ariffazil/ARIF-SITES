export function Constellation() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5E8E8]">
      <section className="max-w-4xl mx-auto px-4 pt-32 pb-12">
        <h1 className="text-5xl font-bold text-[#FF3333] mb-4">Constellation</h1>
        <p className="text-[#F5E8E8]/60">
          The arifOS ecosystem — constitutional AI runtime, sovereign infrastructure, and trusted agents.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-6">
          <a href="https://mcp.arif-fazil.com" target="_blank" rel="noopener noreferrer" className="block p-6 border border-[#00D4AA]/30 rounded hover:border-[#00D4AA]/50 transition-colors">
            <h2 className="text-xl font-bold text-[#00D4AA] mb-2">Ω arifOS</h2>
            <p className="text-sm text-[#F5E8E8]/50">The constitutional kernel — 13 floors, human sovereignty, verifiable constraints.</p>
          </a>
          <a href="https://aaa.arif-fazil.com" target="_blank" rel="noopener noreferrer" className="block p-6 border border-[#D4A853]/30 rounded hover:border-[#D4A853]/50 transition-colors">
            <h2 className="text-xl font-bold text-[#D4A853] mb-2">Δ AAA Wire</h2>
            <p className="text-sm text-[#F5E8E8]/50">MCP/A2A protocol specifications and agent runtime.</p>
          </a>
        </div>
      </section>
    </div>
  );
}