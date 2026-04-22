// MIND Ring - arifos.arif-fazil.com
// Theory & Law - Constitutional Documentation

import React, { useState } from 'react';
import { 
  Book, Layers, Shield, Eye, Scale, Heart, Brain, 
  Lock, FileCheck, Activity, Globe, ChevronRight, 
  ChevronDown, ExternalLink, Cpu, Zap, Anchor
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// 13 Constitutional Floors
const FLOORS = [
  { num: 1, name: 'Amanah', symbol: 'الأمانة', desc: 'Sacred Trust & Reversibility', icon: Anchor },
  { num: 2, name: 'Truth', symbol: 'الحق', desc: 'Canonical Verification', icon: Scale },
  { num: 3, name: 'Tri-Witness', symbol: 'ثلاثة شهود', desc: 'Consensus Protocol', icon: Eye },
  { num: 4, name: 'Clarity', symbol: 'الوضوح', desc: 'Unambiguous Expression', icon: Book },
  { num: 5, name: 'Peace²', symbol: 'السلام', desc: 'Non-violent Operation', icon: Heart },
  { num: 6, name: 'Empathy', symbol: 'التعاطف', desc: 'User Respect & Accessibility', icon: Activity },
  { num: 7, name: 'Humility', symbol: 'التواضع', desc: 'Epistemic Limits', icon: Brain },
  { num: 8, name: 'Genius', symbol: 'العبقرية', desc: 'Elegant Solutions', icon: Zap },
  { num: 9, name: 'Anti-Hantu', symbol: 'لا أشباح', desc: 'No Human Imagery', icon: Shield },
  { num: 10, name: 'Wall', symbol: 'الجدار', desc: 'Safety Boundaries', icon: Lock },
  { num: 11, name: 'Auditability', symbol: 'القابلية للتدقيق', desc: 'Transparent Process', icon: FileCheck },
  { num: 12, name: 'Wall²', symbol: 'الجدار²', desc: 'Double Safety', icon: Lock },
  { num: 13, name: 'Sovereign', symbol: 'السيادة', desc: 'Ultimate Authority', icon: Globe },
];

// Pipeline Stages
const PIPELINE = [
  { stage: '000', name: 'INIT', desc: 'Territorial Mapping' },
  { stage: '111', name: 'SENSE', desc: 'Visual Grammar Canon' },
  { stage: '333', name: 'MIND', desc: 'Architectural Specifications' },
  { stage: '444', name: 'ROUT', desc: 'Domain-Specific Contrasts' },
  { stage: '555', name: 'MEM', desc: 'Technical Stack' },
  { stage: '666', name: 'HEART', desc: 'Safety & F10 Wall' },
  { stage: '777', name: 'OPS', desc: 'Deployment Architecture' },
  { stage: '888', name: 'JUDGE', desc: 'Deliverables Checklist' },
  { stage: '999', name: 'SEAL', desc: 'Invocation Complete' },
];

// Floor Card Component
const FloorCard: React.FC<{ floor: typeof FLOORS[0]; index: number }> = ({ floor, index }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className="relative"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full p-4 rounded-xl border transition-all duration-300 text-left
          ${isOpen 
            ? 'bg-[#d4a853]/20 border-[#d4a853]' 
            : 'bg-[#151528]/50 border-[#d4a853]/20 hover:border-[#d4a853]/50'
          }
        `}
      >
        <div className="flex items-center gap-4">
          <div className={`
            w-12 h-12 rounded-xl flex items-center justify-center
            ${isOpen ? 'bg-[#d4a853] text-[#0a0a14]' : 'bg-[#d4a853]/20 text-[#d4a853]'}
          `}>
            <floor.icon className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#d4a853]/60">F{floor.num}</span>
              <span className="font-bold text-[#f0d878]">{floor.name}</span>
            </div>
            <div className="text-sm text-[#f0d878]/60">{floor.symbol}</div>
          </div>
          <ChevronDown className={`w-5 h-5 text-[#d4a853] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="pt-4 mt-4 border-t border-[#d4a853]/20">
                <p className="text-[#f0d878]/80 text-sm">{floor.desc}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </motion.div>
  );
};

// Main MIND Site
const MindSite: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a0a14] text-[#f0d878] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a0a14]/90 backdrop-blur-xl border-b border-[#d4a853]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d4a853] flex items-center justify-center text-[#0a0a14] font-bold text-xl">
              Ω
            </div>
            <div>
              <div className="font-bold text-[#f0d878]">arifOS</div>
              <div className="text-xs text-[#f0d878]/50">Constitutional Kernel</div>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <a href="#floors" className="hover:text-[#d4a853] transition-colors">13 Floors</a>
            <a href="#pipeline" className="hover:text-[#d4a853] transition-colors">Pipeline</a>
            <a href="#trinity" className="hover:text-[#d4a853] transition-colors">Trinity</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-24 px-6 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, #d4a853 1px, transparent 1px),
              linear-gradient(#d4a853 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/30 mb-8"
          >
            <Book className="w-4 h-4 text-[#d4a853]" />
            <span className="text-sm text-[#d4a853]">Ω MIND Ring — Theory & Law</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            The <span className="text-[#d4a853]">Constitution</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#f0d878]/70 max-w-2xl mx-auto mb-8"
          >
            Philosophical axioms, mathematical definitions of governance, 
            and the 13-Floor architecture that binds the arifOS ecosystem.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#151528] border border-[#d4a853]/30"
          >
            <span className="text-xs text-[#f0d878]/50">Version:</span>
            <span className="text-sm font-mono text-[#d4a853]">arifOS v54.1-SEAL</span>
            <span className="mx-2 text-[#f0d878]/30">|</span>
            <span className="text-xs text-[#f0d878]/50">Ω₀ ≈ 0.04</span>
          </motion.div>
        </div>
      </section>

      {/* 13 Floors */}
      <section id="floors" className="py-24 px-6 bg-[#07070a]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/30 mb-6">
              <Layers className="w-4 h-4 text-[#d4a853]" />
              <span className="text-sm text-[#d4a853]">The Architecture</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              13 <span className="text-[#d4a853]">Constitutional Floors</span>
            </h2>
            <p className="text-[#f0d878]/60 max-w-xl mx-auto">
              Each floor represents a fundamental constraint or principle 
              that governs the behavior of the arifOS ecosystem.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-4">
            {FLOORS.map((floor, i) => (
              <FloorCard key={floor.num} floor={floor} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* Pipeline */}
      <section id="pipeline" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#d4a853]/10 border border-[#d4a853]/30 mb-6">
              <Cpu className="w-4 h-4 text-[#d4a853]" />
              <span className="text-sm text-[#d4a853]">Execution Flow</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              000-999 <span className="text-[#d4a853]">Pipeline</span>
            </h2>
            <p className="text-[#f0d878]/60 max-w-xl mx-auto">
              The execution pipeline that transforms intent into constitutional reality.
            </p>
          </motion.div>

          <div className="relative">
            {/* Pipeline Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-gradient-to-b from-[#d4a853]/50 via-[#d4a853]/30 to-transparent" />
            
            <div className="space-y-6">
              {PIPELINE.map((step, i) => (
                <motion.div
                  key={step.stage}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="relative flex items-center gap-6 pl-16"
                >
                  {/* Node */}
                  <div className={`
                    absolute left-0 w-12 h-12 rounded-full flex items-center justify-center
                    border-2 transition-all
                    ${i === PIPELINE.length - 1 
                      ? 'bg-[#d4a853] border-[#d4a853] text-[#0a0a14]' 
                      : 'bg-[#0a0a14] border-[#d4a853]/50 text-[#d4a853]'
                    }
                  `}>
                    <span className="text-xs font-mono font-bold">{step.stage}</span>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-4 rounded-xl bg-[#151528]/50 border border-[#d4a853]/20">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-[#f0d878]">{step.name}</span>
                      <ChevronRight className="w-4 h-4 text-[#d4a853]/50" />
                      <span className="text-sm text-[#f0d878]/60">{step.desc}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trinity */}
      <section id="trinity" className="py-24 px-6 bg-[#07070a]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">
              The <span className="text-[#d4a853]">Trinity Matrix</span>
            </h2>
            <p className="text-[#f0d878]/60 max-w-xl mx-auto">
              The arifOS ecosystem is decentralized across three hubs of metabolism.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                symbol: 'Ψ', name: 'SOUL', role: 'Human Anchor', 
                domain: 'arif-fazil.com', color: '#c4791a',
                desc: 'The professional identity of Muhammad Arif bin Fazil' 
              },
              { 
                symbol: 'Ω', name: 'MIND', role: 'Theory & Law', 
                domain: 'arifos.arif-fazil.com', color: '#d4a853',
                desc: 'Philosophical axioms and constitutional definitions' 
              },
              { 
                symbol: 'Δ', name: 'BODY', role: 'Execution', 
                domain: 'arifosmcp.arif-fazil.com', color: '#00d4aa',
                desc: 'Production runtime and metabolic execution kernel' 
              },
            ].map((ring, i) => (
              <motion.a
                key={ring.name}
                href={`https://${ring.domain}`}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="group p-6 rounded-2xl bg-[#151528]/50 border border-[#d4a853]/20 hover:border-[#d4a853]/50 transition-all"
              >
                <div 
                  className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl font-bold mb-4 transition-all"
                  style={{ backgroundColor: `${ring.color}20`, color: ring.color }}
                >
                  {ring.symbol}
                </div>
                <h3 className="text-xl font-bold text-[#f0d878] mb-1">{ring.name}</h3>
                <p className="text-sm text-[#d4a853] mb-3">{ring.role}</p>
                <p className="text-sm text-[#f0d878]/60 mb-4">{ring.desc}</p>
                <div className="flex items-center gap-2 text-xs text-[#f0d878]/40">
                  <span>{ring.domain}</span>
                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#d4a853]/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold text-[#d4a853] mb-2">Ditempa Bukan Diberi</div>
          <div className="text-sm text-[#f0d878]/50 mb-4">Forged, Not Given — ΔΩΨ | ARIF</div>
          <div className="text-xs text-[#f0d878]/30">
            Constitutional Version: arifOS v54.1-SEAL • Ω₀ ≈ 0.04
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MindSite;
