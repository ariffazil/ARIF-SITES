import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWebMCP } from '@/hooks/useWebMCP';

const ORGANS = [
  {
    name: 'AAA',
    role: 'Control Plane · A2A Gateway',
    domain: 'aaa.arif-fazil.com',
    description: 'The federation operations surface — agent identity, cockpit dashboard, A2A protocol routing. Where agents dock and the federation state is visible.',
    color: 'text-[#D4A853]',
    href: 'https://aaa.arif-fazil.com',
    ring: 'BODY',
  },
  {
    name: 'MCP Gateway',
    role: 'Agent Connection Gate',
    domain: 'mcp.arif-fazil.com',
    description: 'The connection point for external agents. MCP protocol endpoint, tool discovery, registry listings. Connect any MCP client here.',
    color: 'text-[#7C6FD4]',
    href: 'https://mcp.arif-fazil.com',
    ring: 'ORGAN',
  },
  {
    name: 'A-FORGE',
    role: 'Execution Shell',
    domain: 'forge.arif-fazil.com',
    description: 'Constitutionally governed execution — build, deploy, audit. Every action reversible and hash-chained.',
    color: 'text-[#E3B341]',
    href: 'https://forge.arif-fazil.com',
    ring: 'BODY',
  },
];

const FEDERATION_LINKS = [
  { label: 'arifOS Observatory', href: 'https://arifos.arif-fazil.com', desc: 'Reality witness — constitutional health, live state' },
  { label: 'GEOX', href: 'https://geox.arif-fazil.com', desc: 'Earth intelligence — basin, seismic, wells' },
  { label: 'WEALTH', href: 'https://wealth.arif-fazil.com', desc: 'Capital intelligence — NPV, EMV, markets' },
  { label: 'WELL', href: 'https://well.arif-fazil.com', desc: 'Human & machine vitality reflection' },
  { label: 'MCP Gateway', href: 'https://mcp.arif-fazil.com', desc: 'Agent connection — protocol endpoint, registry' },
  { label: 'A-FORGE', href: 'https://forge.arif-fazil.com', desc: 'Governed execution — build, deploy, audit' },
  { label: 'AAA', href: 'https://aaa.arif-fazil.com', desc: 'Control plane — agent identity, cockpit' },
];

const federationTools = [
  {
    name: 'get_federation_map',
    description: 'Get the complete arifOS federation map: 5 organs (arifOS, AAA, GEOX, WEALTH, WELL) + 3 public interfaces (arif-fazil.com, mcp.arif-fazil.com, forge.arif-fazil.com).',
    execute() { return { content: [{ type: 'text', text: JSON.stringify(ORGANS, null, 2) }] }; }
  },
];

export function Federation() {
  useWebMCP(federationTools);
  useEffect(() => { document.title = 'Federation — arifOS · AAA · MCP | Arif Fazil'; }, []);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-forge-black min-h-screen">
      <section className="py-24 border-b-2 border-forge-iron bg-forge-steel">
        <div className="site-frame">
          <div className="section-label">ΔΩΨ · Federation · Agent Gateway</div>
          <h1 className="text-6xl md:text-8xl font-black italic uppercase leading-[0.8] tracking-tighter mb-8">
            The<br />Federation
          </h1>
          <p className="font-body text-xl text-forge-dim max-w-2xl leading-relaxed">
            Five organs under one sovereign. Three public interfaces. One connection point for agents.
          </p>
        </div>
      </section>

      {/* Primary gateways */}
      <section className="py-20 border-b-2 border-forge-iron">
        <div className="site-frame">
          <div className="section-label">Primary Interfaces</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            {ORGANS.map((o) => (
              <a key={o.name} href={o.href} target="_blank" rel="noreferrer"
                 className="brutalist-card group hover:border-forge-orange transition-colors">
                <div className={`font-mono text-[0.55rem] uppercase tracking-widest mb-2 ${o.color}`}>{o.ring}</div>
                <h2 className={`text-3xl font-black uppercase italic mb-2 group-hover:${o.color} transition-colors`}>{o.name}</h2>
                <p className="font-mono text-[0.65rem] text-forge-dim mb-2">{o.domain}</p>
                <p className="font-body text-sm text-forge-dim leading-relaxed">{o.description}</p>
                <div className="mt-4 font-mono text-[0.6rem] text-forge-orange uppercase tracking-widest">Open →</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* All federation organs */}
      <section className="py-20">
        <div className="site-frame">
          <div className="section-label">5 Organs · 3 Interfaces · 1 Sovereign</div>
          <h2 className="text-3xl font-black uppercase italic mb-8">Full Directory</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FEDERATION_LINKS.map((l) => (
              <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                 className="brutalist-card flex items-center justify-between group">
                <div>
                  <h3 className="font-black uppercase italic text-lg group-hover:text-forge-orange transition-colors">{l.label}</h3>
                  <p className="font-body text-xs text-forge-dim">{l.desc}</p>
                </div>
                <span className="font-mono text-[0.6rem] text-forge-orange">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Connect */}
      <section className="py-20 border-t-2 border-forge-iron bg-forge-steel">
        <div className="site-frame text-center">
          <div className="section-label">Connect Any MCP Client</div>
          <pre className="inline-block text-left font-mono text-xs text-forge-dim bg-forge-black p-4 mt-4 border border-forge-iron max-w-lg" style={{wordBreak: 'break-all'}}>{`{
  "mcpServers": {
    "arifOS": {
      "url": "https://mcp.arif-fazil.com/mcp"
    }
  }
}`}</pre>
          <div className="mt-8 flex justify-center gap-4 flex-wrap">
            <a href="https://glama.ai/mcp/servers/ariffazil/arifos" target="_blank" className="font-mono text-[0.6rem] uppercase px-3 py-2 border border-forge-iron text-forge-dim hover:text-forge-white transition-colors">Glama Registry ↗</a>
            <a href="https://github.com/ariffazil/arifOS" target="_blank" className="font-mono text-[0.6rem] uppercase px-3 py-2 border border-forge-iron text-forge-dim hover:text-forge-white transition-colors">GitHub ↗</a>
            <a href="https://pypi.org/project/arifos/" target="_blank" className="font-mono text-[0.6rem] uppercase px-3 py-2 border border-forge-iron text-forge-dim hover:text-forge-white transition-colors">PyPI ↗</a>
          </div>
        </div>
      </section>
    </motion.div>
  );
}
