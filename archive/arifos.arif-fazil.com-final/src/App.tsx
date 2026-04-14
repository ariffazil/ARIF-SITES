import { Shield, Scale, Zap, Globe, BookOpen, Cpu } from 'lucide-react';

const FLOORS = [
  { id: 'F1', name: 'AMANAH', desc: 'Reversibility & State recovery.' },
  { id: 'F2', name: 'TRUTH', desc: 'Grounding in physical evidence.' },
  { id: 'F3', name: 'TRI-WITNESS', desc: 'Human + Theory + Intent alignment.' },
  { id: 'F4', name: 'CLARITY', desc: 'Reduction of entropic confusion.' },
  { id: 'F5', name: 'PEACE²', desc: 'Non-destructive stability.' },
  { id: 'F6', name: 'EMPATHY', desc: 'Human-centered alignment.' },
  { id: 'F7', name: 'HUMILITY', desc: 'Calibrated uncertainty.' },
  { id: 'F8', name: 'GENIUS', desc: 'System-wide health & optimization.' },
  { id: 'F9', name: 'ETHICS', desc: 'Anti-manipulation protocols.' },
  { id: 'F10', name: 'CONSCIENCE', desc: 'Non-claim of consciousness.' },
  { id: 'F11', name: 'AUDITABILITY', desc: 'Immutable trace visibility.' },
  { id: 'F12', name: 'RESILIENCE', desc: 'Graceful failure & fail-closed safety.' },
  { id: 'F13', name: 'SOVEREIGN', desc: 'Governed updates & human veto.' },
];

const LAWS = [
  { id: '01', title: 'Context Law', desc: 'Context is a bounded workspace for active inference, not intelligence.' },
  { id: '02', title: 'Optimization Law', desc: 'Maximize relevance density, not just token reduction.' },
  { id: '03', title: 'Attention Law', desc: 'Only attended information has causal influence.' },
  { id: '04', title: 'Retrieval Law', desc: 'Intelligence is the ability to assemble from external memory.' },
  { id: '05', title: 'Compression Law', desc: 'All summaries must be traceable to source (Loss awareness).' },
];

function App() {
  return (
    <>
      <div className="mind-grid" />
      <div className="container">
        <header>
          <div className="title-badge">arifOS · THE MIND</div>
          <h1>Constitutional Canon</h1>
          <p className="hero-subtitle">
            The mathematical and philosophical foundation of governed intelligence. 
            Laws that bind the machine to human intent.
          </p>
          <div className="nav-strip">
            <a href="https://arif-fazil.com">The Soul</a>
            <a href="https://aaa.arif-fazil.com">The Body</a>
            <a href="https://mcp.arif-fazil.com/health">Live Vitals</a>
          </div>
        </header>

        <section className="section">
          <h2 className="section-title text-gold"><Scale className="inline mr-2" /> Core Laws</h2>
          <div className="laws-list">
            {LAWS.map(law => (
              <div key={law.id} className="law-section">
                <div className="law-header">
                  <span className="law-number">LAW_{law.id}</span>
                  <span className="law-title">{law.title}</span>
                </div>
                <p className="text-secondary">{law.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title text-gold"><Shield className="inline mr-2" /> The 13 Binding Floors</h2>
          <p className="mb-8 opacity-70">
            Every agentic operation must pass through the 13-Floor Membrane. 
            A violation at any level triggers a recursive 888_HOLD.
          </p>
          <div className="floor-matrix">
            {FLOORS.map(floor => (
              <div key={floor.id} className="floor-card">
                <span className="floor-id">{floor.id}</span>
                <span className="font-bold">{floor.name}</span>
                <p className="mt-2 text-xs opacity-60">{floor.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="section">
          <h2 className="section-title text-gold"><Zap className="inline mr-2" /> Trinity Integration</h2>
          <div className="floor-matrix">
            <a href="https://mcp.arif-fazil.com" className="floor-card block hover:border-emerald-500 transition-colors">
              <Cpu className="mb-2" />
              <h4 className="font-bold">MCP Runtime</h4>
              <p className="text-xs opacity-60">Production execution kernel.</p>
            </a>
            <a href="https://geox.arif-fazil.com" className="floor-card block hover:border-emerald-500 transition-colors">
              <Globe className="mb-2" />
              <h4 className="font-bold">GEOX Reality</h4>
              <p className="text-xs opacity-60">Earth-grounded verification.</p>
            </a>
            <a href="https://wiki.arif-fazil.com" className="floor-card block hover:border-emerald-500 transition-colors">
              <BookOpen className="mb-2" />
              <h4 className="font-bold">Unified Wiki</h4>
              <p className="text-xs opacity-60">Knowledge compression.</p>
            </a>
          </div>
        </section>

        <footer>
          <p className="mono">DITEMPA BUKAN DIBERI — ΔΩΨ Trinity</p>
          <p className="text-[10px] mt-4 opacity-30 uppercase tracking-widest">
            © 2026 arifOS MIND Layer · v2026.04.11
          </p>
        </footer>
      </div>
    </>
  );
}

export default App;
