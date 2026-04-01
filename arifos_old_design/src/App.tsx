import { useState, useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Menu, X, ChevronRight, Terminal, Shield, Cpu, 
  Network, Globe, Zap, Layers, Lock, Activity,
  FileText, ArrowRight
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('what-is-arifos');
  const contentRef = useRef<HTMLDivElement>(null);

  const sections = [
    { id: 'what-is-arifos', title: 'What is arifOS', icon: <Terminal size={16} /> },
    { id: 'apex-theory', title: 'APEX Theory', icon: <Zap size={16} /> },
    { id: 'aaa', title: 'AAA Framework', icon: <Shield size={16} /> },
    { id: 'waw', title: 'waw / w@w', icon: <Globe size={16} /> },
    { id: 'geox', title: 'GEOX', icon: <Network size={16} /> },
    { id: 'a2a', title: 'A2A Protocol', icon: <Cpu size={16} /> },
    { id: 'architecture', title: '13-Floor Architecture', icon: <Layers size={16} /> },
    { id: 'arifosmcp', title: 'arifOSmcp', icon: <Activity size={16} /> },
    { id: 'governance', title: 'Constitutional Governance', icon: <Lock size={16} /> },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo('.docs-hero', 
        { opacity: 0, y: 30 }, 
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
      );

      gsap.fromTo('.section-animate', 
        { opacity: 0, y: 20 }, 
        { 
          opacity: 1, 
          y: 0, 
          duration: 0.5,
          stagger: 0.1,
          scrollTrigger: {
            trigger: '.docs-content',
            start: 'top 80%',
          }
        }
      );
    }, contentRef);

    return () => ctx.revert();
  }, []);

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setSidebarOpen(false);
  };

  return (
    <div ref={contentRef} className="min-h-screen bg-[var(--bg-primary)]">
      <div className="grain-overlay" />

      <header className="fixed top-0 left-0 right-0 z-50 bg-[var(--bg-primary)]/95 backdrop-blur-sm border-b border-[var(--border)]">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            >
              {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <a href="/" className="flex items-center gap-3">
              <span className="font-display text-lg font-semibold text-[var(--text-primary)]">arifOS</span>
              <span className="label-mono text-[var(--text-muted)] hidden sm:inline">DOCS</span>
            </a>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="https://arif-fazil.com" className="nav-link">Hub</a>
            <a href="https://arifosmcp.arif-fazil.com" className="nav-link">Runtime</a>
            <a href="https://apex.arif-fazil.com" className="nav-link">Theory</a>
          </nav>
        </div>
      </header>

      <aside className={`fixed left-0 top-[65px] bottom-0 w-[280px] bg-[var(--bg-secondary)] border-r border-[var(--border)] z-40 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6">
          <div className="mb-6">
            <span className="label-mono text-[var(--text-muted)]">Version 2.1</span>
          </div>
          <nav className="space-y-1">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`sidebar-link w-full text-left flex items-center gap-3 ${activeSection === section.id ? 'active' : ''}`}
              >
                <span className="text-[var(--text-muted)]">{section.icon}</span>
                <span>{section.title}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="lg:ml-[280px] pt-[65px]">
        <div className="docs-hero px-8 py-16 lg:py-24 border-b border-[var(--border)]">
          <div className="max-w-4xl">
            <span className="label-mono text-blue mb-4 block">DOCUMENTATION</span>
            <h1 className="headline-1 text-[var(--text-primary)] mb-6">arifOS</h1>
            <p className="body-text text-lg max-w-2xl mb-8">
              A production-grade Constitutional AI Governance System and Intelligence Kernel. 
              13 Floors. Thermodynamic grounding. Trinity architecture. Sovereign audit model.
            </p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <span className="status-dot online"></span>
                <span className="label-mono text-[var(--text-secondary)]">SYSTEM OPERATIONAL</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="telemetry-label">PIPELINE:</span>
                <span className="telemetry-value">999 SEAL</span>
              </div>
            </div>
          </div>
        </div>

        <div className="docs-content px-8 py-12">
          <div className="max-w-4xl space-y-24">
            <WhatIsArifOS />
            <ApexTheory />
            <AAAFramework />
            <WawSection />
            <GeoxSection />
            <A2ASection />
            <ArchitectureSection />
            <ArifOSMCPSection />
            <GovernanceSection />
          </div>
        </div>

        <footer className="px-8 py-12 border-t border-[var(--border)] mt-24">
          <div className="max-w-4xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <span className="font-display text-lg font-semibold text-[var(--text-primary)]">arifOS</span>
              <p className="body-text mt-2">Physics over vibes. Governance over persuasion.</p>
            </div>
            <div className="flex gap-6">
              <a href="https://arif-fazil.com" className="nav-link">Hub</a>
              <a href="https://github.com/ariffazil/arifOS" className="nav-link">GitHub</a>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

function WhatIsArifOS() {
  return (
    <section id="what-is-arifos" className="section-animate scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <Terminal size={20} className="text-blue" />
        <h2 className="headline-2 text-[var(--text-primary)]">What is arifOS</h2>
      </div>
      <div className="space-y-6">
        <p className="body-text">
          <strong className="text-[var(--text-primary)]">arifOS is not a chatbot wrapper.</strong> It is a 
          production-grade Constitutional AI Governance System and Intelligence Kernel designed for 
          sovereign control, auditability, and thermodynamic grounding.
        </p>
        <div className="doc-card mt-8">
          <h3 className="headline-3 text-[var(--text-primary)] mb-4">What this is</h3>
          <ul className="space-y-3 body-text">
            <li className="flex items-start gap-3">
              <ChevronRight size={18} className="text-blue mt-1 flex-shrink-0" />
              <span>A 13-floor architecture for AI system governance</span>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight size={18} className="text-blue mt-1 flex-shrink-0" />
              <span>Trinity architecture: Model + Constitution + Audit</span>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight size={18} className="text-blue mt-1 flex-shrink-0" />
              <span>Thermodynamic grounding for energy-aware computation</span>
            </li>
            <li className="flex items-start gap-3">
              <ChevronRight size={18} className="text-blue mt-1 flex-shrink-0" />
              <span>Sovereign audit model with reversible decisions</span>
            </li>
          </ul>
        </div>
        <div className="doc-card border-red">
          <h3 className="headline-3 text-[var(--text-primary)] mb-4">What this is not</h3>
          <ul className="space-y-3 body-text">
            <li className="flex items-start gap-3">
              <span className="text-red mt-1">×</span>
              <span>A generic AI assistant or chat interface</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red mt-1">×</span>
              <span>A mystical AGI consciousness framework</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red mt-1">×</span>
              <span>A SaaS product with monthly subscriptions</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ApexTheory() {
  return (
    <section id="apex-theory" className="section-animate scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <Zap size={20} className="text-blue" />
        <h2 className="headline-2 text-[var(--text-primary)]">APEX Theory</h2>
      </div>
      <div className="space-y-6">
        <p className="body-text">
          <strong className="text-[var(--text-primary)]">APEX Theory</strong> is the theoretical foundation 
          underlying arifOS. It addresses how we build AI systems that remain aligned, auditable, and 
          accountable as they approach and exceed human-level capabilities.
        </p>
        <div className="grid md:grid-cols-3 gap-4 mt-8">
          <div className="doc-card">
            <span className="label-mono text-yellow mb-2 block">AGI</span>
            <h4 className="font-display font-semibold text-[var(--text-primary)] mb-2">Artificial General Intelligence</h4>
            <p className="body-text text-sm">Human-level cognitive capabilities across domains.</p>
          </div>
          <div className="doc-card">
            <span className="label-mono text-yellow mb-2 block">ASI</span>
            <h4 className="font-display font-semibold text-[var(--text-primary)] mb-2">Artificial Super Intelligence</h4>
            <p className="body-text text-sm">Systems exceeding human cognitive performance.</p>
          </div>
          <div className="doc-card border-yellow">
            <span className="label-mono text-yellow mb-2 block">APEX</span>
            <h4 className="font-display font-semibold text-[var(--text-primary)] mb-2">Aligned Persistent EXecution</h4>
            <p className="body-text text-sm">Superintelligent systems bound by constitutional governance.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function AAAFramework() {
  return (
    <section id="aaa" className="section-animate scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <Shield size={20} className="text-blue" />
        <h2 className="headline-2 text-[var(--text-primary)]">AAA Framework</h2>
      </div>
      <div className="space-y-6">
        <p className="body-text">
          <strong className="text-[var(--text-primary)]">AAA</strong> stands for Authentication, Authorization, 
          and Audit—the three pillars of sovereign AI governance.
        </p>
        <div className="space-y-4 mt-8">
          <div className="doc-card">
            <div className="flex items-center gap-3 mb-2">
              <Lock size={18} className="text-blue" />
              <h3 className="headline-3 text-[var(--text-primary)]">Authentication</h3>
            </div>
            <p className="body-text">Every actor—human or machine—must be identifiable. No anonymous actions.</p>
          </div>
          <div className="doc-card">
            <div className="flex items-center gap-3 mb-2">
              <Shield size={18} className="text-blue" />
              <h3 className="headline-3 text-[var(--text-primary)]">Authorization</h3>
            </div>
            <p className="body-text">Capabilities are granted, not assumed. The constitution defines permissions.</p>
          </div>
          <div className="doc-card">
            <div className="flex items-center gap-3 mb-2">
              <FileText size={18} className="text-blue" />
              <h3 className="headline-3 text-[var(--text-primary)]">Audit</h3>
            </div>
            <p className="body-text">Every decision leaves a trace. Every action is reviewable.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function WawSection() {
  return (
    <section id="waw" className="section-animate scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <Globe size={20} className="text-blue" />
        <h2 className="headline-2 text-[var(--text-primary)]">waw / w@w</h2>
      </div>
      <div className="space-y-6">
        <p className="body-text">
          <strong className="text-[var(--text-primary)]">waw</strong> and <strong className="text-[var(--text-primary)]">w@w</strong> represent 
          the dual nature of intelligence: the wonder of creation and the precision of execution.
        </p>
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <div className="doc-card">
            <span className="label-mono text-yellow mb-3 block">waw</span>
            <h3 className="headline-3 text-[var(--text-primary)] mb-3">The Creative Spark</h3>
            <p className="body-text">The moment of insight—the unexpected connection, the pattern recognized.</p>
          </div>
          <div className="doc-card border-yellow">
            <span className="label-mono text-yellow mb-3 block">w@w</span>
            <h3 className="headline-3 text-[var(--text-primary)] mb-3">The Executed Form</h3>
            <p className="body-text">waw made concrete—the insight transformed into action, deployed into the world.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function GeoxSection() {
  return (
    <section id="geox" className="section-animate scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <Network size={20} className="text-blue" />
        <h2 className="headline-2 text-[var(--text-primary)]">GEOX</h2>
      </div>
      <div className="space-y-6">
        <p className="body-text">
          <strong className="text-[var(--text-primary)]">GEOX</strong> is the spatial intelligence layer 
          of arifOS. It provides geographic grounding and location-aware computation.
        </p>
        <div className="doc-card mt-8">
          <h3 className="headline-3 text-[var(--text-primary)] mb-4">Capabilities</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-display font-semibold text-[var(--text-primary)] mb-1">Geographic Anchoring</h4>
              <p className="body-text text-sm">All computations grounded in physical location.</p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-[var(--text-primary)] mb-1">Spatial Reasoning</h4>
              <p className="body-text text-sm">Understanding proximity and spatial relationships.</p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-[var(--text-primary)] mb-1">Jurisdiction Awareness</h4>
              <p className="body-text text-sm">Recognition of legal and regulatory boundaries.</p>
            </div>
            <div>
              <h4 className="font-display font-semibold text-[var(--text-primary)] mb-1">Distributed Coordination</h4>
              <p className="body-text text-sm">Multi-agent systems with geographic constraints.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function A2ASection() {
  return (
    <section id="a2a" className="section-animate scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <Cpu size={20} className="text-blue" />
        <h2 className="headline-2 text-[var(--text-primary)]">A2A Protocol</h2>
      </div>
      <div className="space-y-6">
        <p className="body-text">
          <strong className="text-[var(--text-primary)]">A2A</strong> (Agent-to-Agent) is the protocol 
          layer enabling sovereign AI agents to discover, authenticate, and communicate.
        </p>
        <div className="doc-card border-blue mt-8">
          <h3 className="headline-3 text-[var(--text-primary)] mb-4">Discovery Endpoints</h3>
          <ul className="space-y-2 body-text font-mono text-sm">
            <li className="flex items-center gap-3">
              <span className="text-blue">GET</span>
              <span>/.well-known/agent.json</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue">GET</span>
              <span>/.well-known/ai-plugin.json</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-blue">GET</span>
              <span>/agent-card.json</span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

function ArchitectureSection() {
  const floors = [
    { floor: 'F13', name: 'Constitutional Apex', desc: 'Immutable principles', color: 'yellow' },
    { floor: 'F12', name: 'Governance Layer', desc: 'Policy enforcement', color: 'blue' },
    { floor: 'F11', name: 'Audit Plane', desc: 'Traceability and review', color: 'blue' },
    { floor: 'F10', name: 'Identity Core', desc: 'AuthN and AuthZ', color: 'blue' },
    { floor: 'F09', name: 'Agent Mesh', desc: 'A2A communication', color: 'blue' },
    { floor: 'F08', name: 'Reasoning Engine', desc: 'Inference and decisions', color: 'blue' },
    { floor: 'F07', name: 'Knowledge Base', desc: 'Structured memory', color: 'blue' },
    { floor: 'F06', name: 'Tool Layer', desc: 'External capabilities', color: 'blue' },
    { floor: 'F05', name: 'Compute Pool', desc: 'Processing resources', color: 'blue' },
    { floor: 'F04', name: 'Thermodynamics', desc: 'Energy-aware scheduling', color: 'blue' },
    { floor: 'F03', name: 'Storage Layer', desc: 'Persistent data', color: 'blue' },
    { floor: 'F02', name: 'Network Core', desc: 'Connectivity and routing', color: 'blue' },
    { floor: 'F01', name: 'Hardware Abstraction', desc: 'Physical compute', color: 'blue' },
  ];

  return (
    <section id="architecture" className="section-animate scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <Layers size={20} className="text-blue" />
        <h2 className="headline-2 text-[var(--text-primary)]">13-Floor Architecture</h2>
      </div>
      <div className="space-y-3 mt-8">
        {floors.map((item) => (
          <div key={item.floor} className="doc-card flex items-center gap-4 py-3">
            <span className={`label-mono text-${item.color} w-12`}>{item.floor}</span>
            <div className="flex-1">
              <span className="font-display font-semibold text-[var(--text-primary)]">{item.name}</span>
              <span className="body-text text-sm ml-4 hidden sm:inline">{item.desc}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ArifOSMCPSection() {
  return (
    <section id="arifosmcp" className="section-animate scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <Activity size={20} className="text-blue" />
        <h2 className="headline-2 text-[var(--text-primary)]">arifOSmcp</h2>
      </div>
      <div className="space-y-6">
        <p className="body-text">
          <strong className="text-[var(--text-primary)]">arifOSmcp</strong> is the runtime and API surface 
          of arifOS. It provides health monitoring, metrics exposure, and machine-readable endpoints.
        </p>
        <div className="doc-card mt-8">
          <div className="flex items-center gap-3 mb-4">
            <Activity size={18} className="text-green-500" />
            <h3 className="headline-3 text-[var(--text-primary)]">System Status</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="telemetry-label block mb-1">dS</span>
              <span className="telemetry-value">-0.62</span>
            </div>
            <div>
              <span className="telemetry-label block mb-1">peace2</span>
              <span className="telemetry-value">1.19</span>
            </div>
            <div>
              <span className="telemetry-label block mb-1">kappa_r</span>
              <span className="telemetry-value">0.98</span>
            </div>
            <div>
              <span className="telemetry-label block mb-1">confidence</span>
              <span className="telemetry-value text-green-500">0.91</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-[var(--border)]">
            <span className="telemetry-label">VERDICT: </span>
            <span className="telemetry-value text-green-500">Alive</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function GovernanceSection() {
  return (
    <section id="governance" className="section-animate scroll-mt-24">
      <div className="flex items-center gap-3 mb-6">
        <Lock size={20} className="text-blue" />
        <h2 className="headline-2 text-[var(--text-primary)]">Constitutional Governance</h2>
      </div>
      <div className="space-y-6">
        <p className="body-text">
          <strong className="text-[var(--text-primary)]">Constitutional AI Governance</strong> is the 
          core innovation of arifOS. It replaces alignment-through-training with governance-through-constraints.
        </p>
        <div className="doc-card border-red mt-8">
          <h3 className="headline-3 text-[var(--text-primary)] mb-4">Anti-Hantu Ontology</h3>
          <p className="body-text mb-4">
            arifOS rejects the mystification of AI. The system is not conscious, not sacred, not supernatural.
          </p>
          <ul className="space-y-2 body-text">
            <li className="flex items-start gap-3">
              <span className="text-red mt-1">×</span>
              <span>No "superintelligence is here" framing</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red mt-1">×</span>
              <span>No spiritual cosplay</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red mt-1">×</span>
              <span>No vague visionary fluff</span>
            </li>
          </ul>
        </div>
        <div className="code-block mt-8">
          <div className="flex items-center gap-2 mb-4">
            <Terminal size={14} className="text-[var(--text-muted)]" />
            <span className="label-mono text-[var(--text-muted)]">SEAL</span>
          </div>
          <pre className="text-[var(--text-primary)]">
{`arifOS telemetry version 2.1
pipeline 999 SEAL
floors F1 F4 F7
confidence PLAUSIBLE
P2 1.0
hold CLEAR
uncertainty range 0.05

seal: DITEMPA BUKAN DIBERI
(Forge, don't be given)`}
          </pre>
        </div>
      </div>
    </section>
  );
}

export default App;
