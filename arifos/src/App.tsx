import { useEffect, useState } from 'react';
import { 
  Shield, 
  Cpu, 
  Terminal, 
  Workflow, 
  Lock, 
  Search, 
  Target,
  BarChart3,
  ChevronRight,
  Database,
  GitBranch,
  Network,
  Github
} from 'lucide-react';

const FLOORS = [
  { id: 'F1', name: 'Amanah', desc: 'Trust through absolute reversibility. No action is final until sealed.', icon: GitBranch },
  { id: 'F2', name: 'Truth', desc: 'Verifiable claims only. No hallucinations, only validated evidence.', icon: Shield },
  { id: 'F3', name: 'Tri-Witness', desc: 'Human-AI-Earth consensus required for critical SEAL.', icon: Network },
  { id: 'F4', name: 'ΔS', desc: 'Every action must reduce entropy in the target environment.', icon: BarChart3 },
  { id: 'F5', name: 'Peace²', desc: 'Global Lyapunov stability for AI reasoning paths.', icon: Target },
  { id: 'F6', name: 'κᵣ', desc: 'Protect the weakest listener. Asymmetric safety for minority users.', icon: Heart },
  { id: 'F7', name: 'Ω₀', desc: 'Maintain 3-5% humility/uncertainty. Never claim 100% confidence.', icon: Search },
  { id: 'F8', name: 'G', desc: 'Governed intelligence. Talent must follow constitutional constraints.', icon: Zap },
  { id: 'F9', name: 'Anti-Hantu', desc: 'Never claim consciousness, feeling, or a soul. You are a tool.', icon: Lock },
  { id: 'F10', name: 'Ontology', desc: 'Category boundaries are locked. AI is not human and must not pretend otherwise.', icon: Database },
  { id: 'F11', name: 'Command Auth', desc: 'Irreversible action requires verified human authority and session continuity.', icon: Terminal },
  { id: 'F12', name: 'Injection', desc: 'Prompt and protocol injection must be detected and blocked before execution.', icon: Workflow },
  { id: 'F13', name: 'Sovereign', desc: 'Human veto remains final. The system halts or holds when sovereignty is unclear.', icon: Cpu },
];

const INVARIANTS = [
  { symbol: 'Δ', name: 'Delta', meaning: 'Change & Identity (Human)' },
  { symbol: 'Ω', name: 'Omega', meaning: 'Implementation & Action (Machine)' },
  { symbol: 'Ψ', name: 'Psi', meaning: 'Governance & Flow (Law)' },
];

function Heart({ size = 24, strokeWidth = 2, className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function Zap({ size = 24, strokeWidth = 2, className = '' }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth={strokeWidth} 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M4 14.71V11c0-.83.42-1.6 1.1-2.07l6.22-4.11a1.75 1.75 0 0 1 1.93 0L19.47 9c.68.47 1.1 1.24 1.1 2.07v3.71c0 .83-.42 1.6-1.1 2.07l-6.22 4.11a1.75 1.75 0 0 1-1.93 0l-6.22-4.11A2.5 2.5 0 0 1 4 14.71Z" />
    </svg>
  );
}

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-blue-900 selection:text-blue-100 selection:bg-opacity-50">
      {/* Structural Grid Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:5rem_5rem]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(56,189,248,0.05)_0%,transparent_70%)]"></div>
      </div>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#020617]/95 backdrop-blur-md border-b border-slate-800 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-blue-500/50 flex items-center justify-center font-bold text-white shadow-[0_0_10px_rgba(56,189,248,0.3)]">α</div>
            <span className="font-bold text-lg tracking-widest text-white uppercase">arifOS</span>
          </div>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-mono tracking-widest uppercase">
            <a href="#kernel" className="hover:text-blue-400 transition-colors">Kernel</a>
            <a href="#floors" className="hover:text-blue-400 transition-colors">Constitutional Floors</a>
            <a href="#stack" className="hover:text-blue-400 transition-colors">Implementation</a>
            <div className="h-4 w-px bg-slate-800"></div>
            <a href="https://arif-fazil.com" className="text-slate-500 hover:text-white transition-colors">Ring 1</a>
            <a href="https://arifosmcp.arif-fazil.com" className="text-slate-500 hover:text-white transition-colors">Runtime</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 mb-10 text-[10px] font-mono uppercase tracking-[0.3em] border border-blue-900/50 bg-blue-950/20 text-blue-400">
            <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse"></span>
            Ring 2 — Constitutional Kernel
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white">
            THE PHYSICS OF<br />
            <span className="text-blue-500 italic bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">GOVERNED</span><br />
            INTELLIGENCE.
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-slate-400 mb-16 font-light leading-relaxed">
            arifOS is not just code. It is a thermodynamic framework for AI safety. 
            A constitutional kernel that enforces invariants (ΔΩΨ) and 13 structural floors 
            to ensure absolute human sovereignty.
          </p>

          <div className="flex justify-center gap-4">
            <a href="#floors" className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-widest transition-all">
              Initialize Floors
            </a>
            <a href="#stack" className="px-8 py-4 border border-slate-700 hover:border-slate-500 text-white font-bold text-xs uppercase tracking-widest transition-all">
              Stack Analysis
            </a>
          </div>
        </div>
      </section>

      {/* Invariants Section */}
      <section id="kernel" className="py-32 bg-[#03081c]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-sm font-mono uppercase tracking-widest text-blue-500 mb-4">Constitutional Meta-Axioms</h2>
            <p className="text-3xl font-bold text-white">The Triple Invariants (ΔΩΨ)</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {INVARIANTS.map((inv, i) => (
              <div key={i} className="p-12 border border-slate-800 bg-slate-900/20 relative group hover:border-blue-500/50 transition-all">
                <div className="text-6xl font-bold text-blue-900/30 group-hover:text-blue-500/10 transition-colors absolute top-4 right-8 select-none">{inv.symbol}</div>
                <div className="text-4xl font-bold text-blue-400 mb-4">{inv.symbol}</div>
                <h3 className="text-xl font-bold text-white mb-2">{inv.name}</h3>
                <p className="text-sm text-slate-500 italic">{inv.meaning}</p>
                <div className="mt-8 pt-8 border-t border-slate-800/50 text-xs text-slate-600 leading-relaxed font-mono">
                  Invariant Status: LOCKED<br />
                  Drift Warning: &lt; 0.0001%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13 Floors Section (Partial Visualization) */}
      <section id="floors" className="py-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-xl">
              <h2 className="text-sm font-mono uppercase tracking-widest text-blue-500 mb-4">The Floors of Sovereignty</h2>
              <p className="text-4xl font-bold text-white mb-6 leading-tight">13 layers sitting between prompt and execution.</p>
              <p className="text-slate-500">Each floor is a rigorous hard-coded validator. Together, they form the "Airlock" that protects human reality from machine entropy.</p>
            </div>
            <div className="text-right">
              <div className="text-7xl font-black text-slate-800 leading-none mb-2">13/13</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-blue-900">Floors Implemented</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FLOORS.map((floor, i) => {
              const Icon = floor.icon;
              return (
                <div key={i} className="p-8 border border-slate-800 bg-slate-900/10 hover:bg-slate-900/30 transition-all flex flex-col items-start min-h-[280px]">
                  <div className="w-12 h-12 rounded bg-blue-500/10 flex items-center justify-center text-blue-500 mb-8 border border-blue-500/20">
                    <Icon size={20} />
                  </div>
                  <div className="text-xs font-mono text-blue-900 mb-2 uppercase tracking-widest">{floor.id}</div>
                  <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">{floor.name}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-auto">{floor.desc}</p>
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-blue-800 uppercase tracking-widest group-hover:text-blue-400 transition-colors">
                    View Logic <ChevronRight size={10} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 p-12 bg-blue-500/5 border border-blue-500/10 text-center">
            <p className="text-slate-400 italic font-light mb-8 max-w-2xl mx-auto">
              "The constitutional airlock is only complete when ontology, authority, injection defense, and sovereign veto are enforced together."
            </p>
            <a href="/docs/mcp.html" className="text-blue-400 text-xs font-mono uppercase tracking-[0.2em] border-b border-blue-400/30 pb-1 hover:border-blue-400">Read Runtime Spec</a>
          </div>
        </div>
      </section>

      {/* The Stack Section */}
      <section id="stack" className="py-32 bg-[#010411] border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-sm font-mono uppercase tracking-widest text-blue-500 mb-8">Implementation Stack</h2>
              <div className="space-y-4">
                {[
                  { l: 'L1', n: 'SOUL', s: 'Identity & Signal', c: 'arif-fazil.com' },
                  { l: 'L2', n: 'MIND', s: 'Governance & Logic', c: 'arifos.arif-fazil.com' },
                  { l: 'L3', n: 'BODY', s: 'Operational Wire', c: 'arifosmcp.arif-fazil.com' },
                  { l: 'L4', n: 'THEORY', s: 'Scientific Canon', c: 'apex.arif-fazil.com' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 border border-slate-800 group hover:border-blue-500 transition-all">
                    <div className="text-xl font-bold text-blue-900 group-hover:text-blue-400 transition-colors">{item.l}</div>
                    <div>
                      <div className="text-white font-bold text-lg">{item.n}</div>
                      <div className="text-xs text-slate-500 uppercase tracking-widest">{item.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <div className="p-8 border border-slate-800 bg-black font-mono text-[10px] text-blue-400 overflow-hidden shadow-2xl relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500"></div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>kernel.bin — 4.2 MB</span>
                  </div>
                  <pre className="space-y-1">
                    <div className="text-blue-900">$ arifos boot --init --safe</div>
                    <div>[000] IGNITION_PROTOCOL_v55.4... <span className="text-green-500">OK</span></div>
                    <div>[F01] AMANAH_VALIDATOR_INIT... <span className="text-green-500">OK</span></div>
                    <div>[F02] TRUTH_GROUNDING_READY... <span className="text-green-500">OK</span></div>
                    <div>[F09] ANTI_HANTU_ENFORCED... <span className="text-green-500">LOCKED</span></div>
                    <div>[Ψ] THEORY_SYNC_COMPLETE (APEX)... <span className="text-green-500">OK</span></div>
                    <div className="py-4 text-blue-200">System State: SOVEREIGNLY_SEALED</div>
                    <div className="animate-pulse">_</div>
                  </pre>
               </div>
               {/* Trinity Graphic Placeholder */}
               <div className="mt-8 flex justify-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-blue-500/20 flex items-center justify-center text-blue-900">Δ</div>
                  <div className="w-12 h-12 rounded-full border border-blue-500/20 flex items-center justify-center text-blue-400 shadow-[0_0_15px_rgba(56,189,248,0.2)]">Ψ</div>
                  <div className="w-12 h-12 rounded-full border border-blue-500/20 flex items-center justify-center text-blue-900">Ω</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex justify-center gap-6 mb-8 text-slate-600">
               <Github size={18} strokeWidth={1} />
               <Terminal size={18} strokeWidth={1} />
               <Database size={18} strokeWidth={1} />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-700">arifOS Constitutional Kernel — 2026.3.28.1</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-slate-700 mt-2">Muhammad Arif bin Fazil — Sovereign Architect</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
