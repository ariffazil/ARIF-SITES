import { Cpu, ShieldCheck, Box } from 'lucide-react';

const TOOLS = [
  { name: 'arifos.init', desc: 'Session bootstrap and identity binding.' },
  { name: 'arifos.sense', desc: '8-stage physical reality grounding.' },
  { name: 'arifos.mind', desc: 'AGI reasoning with confidence bands.' },
  { name: 'arifos.heart', desc: 'ASI ethical critique and simulation.' },
  { name: 'arifos.judge', desc: 'Final constitutional verdict system.' },
  { name: 'arifos.vault', desc: 'Cryptographic sealing and audit.' },
];

const SUBSTRATES = [
  { id: '8001', name: 'mcp_time', status: 'ACTIVE' },
  { id: '8002', name: 'mcp_filesystem', status: 'ACTIVE' },
  { id: '8003', name: 'mcp_git', status: 'ACTIVE' },
  { id: '8004', name: 'mcp_memory', status: 'ACTIVE' },
  { id: '8005', name: 'mcp_fetch', status: 'ACTIVE' },
];

function App() {
  return (
    <>
      <div className="execution-glow" />
      <div className="container">
        <header>
          <div className="status-line">
            <div className="status-dot" />
            <span>SYSTEM_STATE: OPERATIONAL</span>
            <span>EPOCH: 2026.04.11</span>
          </div>
          <h1>Atomic Execution <span className="text-cyan">(AAA)</span></h1>
          <p className="text-secondary mt-4">
            The Body Ring. High-integrity runtime for autonomous agents. 
            Where theory becomes action and law becomes logic.
          </p>
          <div className="ring-nav mt-8">
            <a href="https://arif-fazil.com">/soul</a>
            <a href="https://arifos.arif-fazil.com">/mind</a>
            <a href="https://geox.arif-fazil.com">/geox</a>
          </div>
        </header>

        <section className="section">
          <div className="terminal-block">
            <div className="terminal-header">CORE_VITAL_TELEMETRY</div>
            <div className="flex gap-8 flex-wrap">
              <div>
                <span className="text-secondary block text-[10px]">CPU_LOAD</span>
                <span className="text-cyan">14.2%</span>
              </div>
              <div>
                <span className="text-secondary block text-[10px]">MEM_UTIL</span>
                <span className="text-cyan">2.4 GB</span>
              </div>
              <div>
                <span className="text-secondary block text-[10px]">VAULT_CHAIN</span>
                <span className="text-cyan">SYNCED</span>
              </div>
              <div>
                <span className="text-secondary block text-[10px]">LATENCY</span>
                <span className="text-cyan">42ms</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <h3 className="mb-6 flex items-center gap-2">
            <Cpu className="text-cobalt" size={20} /> Tool Surface
          </h3>
          <div className="tool-grid">
            {TOOLS.map(tool => (
              <div key={tool.name} className="tool-card">
                <span className="tool-name">{tool.name}</span>
                <p className="text-[11px] text-secondary">{tool.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h3 className="mb-6 flex items-center gap-2">
            <Box className="text-cobalt" size={20} /> Active Substrates
          </h3>
          <div className="terminal-block">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-secondary border-b border-border">
                  <th className="text-left pb-2">PORT</th>
                  <th className="text-left pb-2">SERVICE</th>
                  <th className="text-right pb-2">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {SUBSTRATES.map(sub => (
                  <tr key={sub.id}>
                    <td className="py-2 text-cyan">:{sub.id}</td>
                    <td className="py-2">{sub.name}</td>
                    <td className="py-2 text-right text-green-500">{sub.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <footer>
          <div className="flex justify-between items-end">
            <div>
              <p className="font-bold text-cyan">DITEMPA BUKAN DIBERI</p>
              <p className="mt-1 opacity-40">BODY RING · ATOMIC EXECUTION AREA</p>
            </div>
            <div className="text-right opacity-30">
              <ShieldCheck className="inline mb-1" size={12} /> VERIFIED_SEAL_999
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
