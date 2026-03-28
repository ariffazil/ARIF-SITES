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
  Github,
  Zap,
  Heart
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
  { symbol: 'Δ', name: 'Delta', meaning: 'Human Identity' },
  { symbol: 'Ψ', name: 'Psi', meaning: 'Governance Law' },
  { symbol: 'Ω', name: 'Omega', meaning: 'Machine Action' },
];

function App() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-[#F7F8FA] font-sans selection:bg-[#F5B700]/30 selection:text-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#0B0F14]/90 backdrop-blur-md border-b border-[#212B36] py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <a href="#" className="flex items-center gap-4">
            <div className="w-10 h-10 border border-[#F5B700] flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(245,183,0,0.2)]">Ψ</div>
            <span className="font-bold text-lg tracking-widest text-white uppercase">arifOS</span>
          </a>
          <div className="hidden md:flex items-center gap-10 text-[10px] font-mono tracking-widest uppercase">
            <a href="#kernel" className="hover:text-[#F5B700] transition-colors">Kernel</a>
            <a href="#floors" className="hover:text-[#F5B700] transition-colors">Constitutional Floors</a>
            <a href="#stack" className="hover:text-[#F5B700] transition-colors">Implementation</a>
            <div className="h-4 w-px bg-[#212B36]"></div>
            <a href="https://arif-fazil.com" className="text-[#697077] hover:text-[#E11D2E] transition-colors">Ring 1: HUMAN</a>
            <a href="https://aaa.arif-fazil.com" className="text-[#697077] hover:text-[#1167D8] transition-colors">Ring 3: APPS</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden border-b border-[#212B36]">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-3 px-4 py-2 mb-10 text-[10px] font-mono uppercase tracking-[0.3em] border border-[#F5B700]/30 bg-[#F5B700]/10 text-[#F5B700]">
            <span className="w-1.5 h-1.5 bg-[#F5B700] rounded-full animate-pulse"></span>
            Ring 2 — Constitutional Theory
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter text-white">
            THE PHYSICS OF<br />
            <span className="text-[#F5B700] italic">GOVERNED</span><br />
            INTELLIGENCE.
          </h1>

          <p className="max-w-2xl mx-auto text-lg text-[#697077] mb-16 font-light leading-relaxed">
            arifOS is a thermodynamic framework for AI safety. 
            A constitutional kernel that enforces invariants (ΔΩΨ) and 13 structural floors 
            to ensure absolute human sovereignty.
          </p>

          <div className="flex justify-center gap-4">
            <a href="#floors" className="px-8 py-4 bg-[#F5B700] hover:bg-[#F5B700]/90 text-black font-bold text-xs uppercase tracking-widest transition-all">
              Initialize Floors
            </a>
            <a href="#stack" className="px-8 py-4 border border-[#212B36] hover:border-[#F5B700] text-white font-bold text-xs uppercase tracking-widest transition-all">
              Stack Analysis
            </a>
          </div>
        </div>
      </section>

      {/* Invariants Section */}
      <section id="kernel" className="py-32 bg-[#0d1117]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <h2 className="text-sm font-mono uppercase tracking-widest text-[#F5B700] mb-4">Constitutional Meta-Axioms</h2>
            <p className="text-3xl font-bold text-white">The Triple Invariants (ΔΩΨ)</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            {INVARIANTS.map((inv, i) => (
              <div key={i} className="p-12 border border-[#212B36] bg-[#121212] relative group hover:border-[#F5B700]/50 transition-all">
                <div className="text-6xl font-bold text-[#F5B700]/10 group-hover:text-[#F5B700]/20 transition-colors absolute top-4 right-8 select-none">{inv.symbol}</div>
                <div className="text-4xl font-bold text-[#F5B700] mb-4">{inv.symbol}</div>
                <h3 className="text-xl font-bold text-white mb-2">{inv.name}</h3>
                <p className="text-sm text-[#697077] italic">{inv.meaning}</p>
                <div className="mt-8 pt-8 border-t border-[#212B36] text-xs text-[#697077] leading-relaxed font-mono">
                  Invariant Status: LOCKED<br />
                  Drift Warning: &lt; 0.0001%
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 13 Floors Section */}
      <section id="floors" className="py-32 bg-[#0B0F14]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-xl">
              <h2 className="text-sm font-mono uppercase tracking-widest text-[#F5B700] mb-4">The Floors of Sovereignty</h2>
              <p className="text-4xl font-bold text-white mb-6 leading-tight">13 layers sitting between prompt and execution.</p>
              <p className="text-[#697077]">Each floor is a rigorous hard-coded validator. Together, they form the "Airlock" that protects human reality from machine entropy.</p>
            </div>
            <div className="text-right">
              <div className="text-7xl font-black text-[#212B36] leading-none mb-2">13/13</div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-[#F5B700]">Floors Implemented</div>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FLOORS.map((floor, i) => {
              const Icon = floor.icon;
              return (
                <div key={i} className="p-8 border border-[#212B36] bg-[#121212] hover:bg-[#121212]/50 transition-all flex flex-col items-start min-h-[280px] group hover:border-[#F5B700]/30">
                  <div className="w-12 h-12 rounded bg-[#F5B700]/10 flex items-center justify-center text-[#F5B700] mb-8 border border-[#F5B700]/20 group-hover:bg-[#F5B700]/20">
                    <Icon size={20} />
                  </div>
                  <div className="text-xs font-mono text-[#F5B700]/50 mb-2 uppercase tracking-widest">{floor.id}</div>
                  <h3 className="text-xl font-bold text-white mb-4 uppercase tracking-tighter">{floor.name}</h3>
                  <p className="text-sm text-[#697077] leading-relaxed mb-auto">{floor.desc}</p>
                  <div className="mt-8 flex items-center gap-2 text-[10px] font-mono text-[#F5B700]/50 uppercase tracking-widest group-hover:text-[#F5B700] transition-colors cursor-pointer">
                    View Logic <ChevronRight size={10} />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-20 p-12 bg-[#F5B700]/5 border border-[#F5B700]/10 text-center">
            <p className="text-[#697077] italic font-light mb-8 max-w-2xl mx-auto">
              "The constitutional airlock is only complete when ontology, authority, injection defense, and sovereign veto are enforced together."
            </p>
            <a href="/theory.html" className="text-[#F5B700] text-xs font-mono uppercase tracking-[0.2em] border-b border-[#F5B700]/30 pb-1 hover:border-[#F5B700]">Access Theory Canon</a>
          </div>
        </div>
      </section>

      {/* The Stack Section */}
      <section id="stack" className="py-32 bg-[#010411] border-t border-[#212B36]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-24 items-center">
            <div>
              <h2 className="text-sm font-mono uppercase tracking-widest text-[#F5B700] mb-8">Implementation Stack</h2>
              <div className="space-y-4">
                {[
                  { l: 'L1', n: 'SOUL', s: 'Identity & Signal', c: 'arif-fazil.com', color: '#E11D2E' },
                  { l: 'L2', n: 'MIND', s: 'Governance & Logic', c: 'arifos.arif-fazil.com', color: '#F5B700' },
                  { l: 'L3', n: 'BODY', s: 'Operational Wire', c: 'aaa.arif-fazil.com', color: '#1167D8' },
                  { l: 'L4', n: 'THEORY', s: 'Scientific Canon', c: 'arifos.arif-fazil.com/theory', color: '#F5B700' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 border border-[#212B36] group hover:border-[#F5B700] transition-all bg-[#121212]">
                    <div className="text-xl font-bold transition-colors" style={{ color: item.color }}>{item.l}</div>
                    <div>
                      <div className="text-white font-bold text-lg">{item.n}</div>
                      <div className="text-xs text-[#697077] uppercase tracking-widest">{item.s}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
               <div className="p-8 border border-[#212B36] bg-black font-mono text-[10px] text-[#F5B700]/70 overflow-hidden shadow-2xl relative">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#F5B700] to-amber-600"></div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    </div>
                    <span>kernel.bin — 4.2 MB</span>
                  </div>
                  <pre className="space-y-1">
                    <div className="text-[#F5B700]/40">$ arifos boot --init --safe</div>
                    <div>[000] IGNITION_PROTOCOL_v55.4... <span className="text-green-500">OK</span></div>
                    <div>[F01] AMANAH_VALIDATOR_INIT... <span className="text-green-500">OK</span></div>
                    <div>[F02] TRUTH_GROUNDING_READY... <span className="text-green-500">OK</span></div>
                    <div>[F09] ANTI_HANTU_ENFORCED... <span className="text-green-500">LOCKED</span></div>
                    <div>[Ψ] THEORY_SYNC_COMPLETE (APEX)... <span className="text-green-500">OK</span></div>
                    <div className="py-4 text-white">System State: SOVEREIGNLY_SEALED</div>
                    <div className="animate-pulse">_</div>
                  </pre>
               </div>
               {/* Trinity Graphic Placeholder */}
               <div className="mt-8 flex justify-center gap-4">
                  <div className="w-12 h-12 rounded-full border border-[#E11D2E]/20 flex items-center justify-center text-[#E11D2E]/40">Δ</div>
                  <div className="w-12 h-12 rounded-full border border-[#F5B700]/20 flex items-center justify-center text-[#F5B700] shadow-[0_0_15px_rgba(245,183,0,0.2)]">Ψ</div>
                  <div className="w-12 h-12 rounded-full border border-[#1167D8]/20 flex items-center justify-center text-[#1167D8]/40">Ω</div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-[#212B36] bg-[#0B0F14]">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <div className="flex justify-center gap-6 mb-8 text-[#697077]">
               <Github size={18} strokeWidth={1} />
               <Terminal size={18} strokeWidth={1} />
               <Database size={18} strokeWidth={1} />
            </div>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#697077]">arifOS Constitutional Kernel — 2026.3.28.2</p>
            <p className="text-[10px] font-mono uppercase tracking-[0.4em] text-[#697077] mt-2">Muhammad Arif bin Fazil — Sovereign Architect</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
