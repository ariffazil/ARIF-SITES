import { useEffect, useState } from 'react';
import {
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// ─────────────────────────────────────────────────
// Three Pillars of Meta-Intelligence
// ─────────────────────────────────────────────────

const THREE_PILLARS = [
  {
    symbol: 'Phi',
    name: 'Physics',
    subtitle: 'The Foundation of Reality',
    description: 'Thermodynamics, information theory, and the physical constraints that govern all computation.',
    floors: ['F4', 'F5', 'F7'],
  },
  {
    symbol: 'Sum',
    name: 'Mathematics',
    subtitle: 'The Language of Measurement',
    description: 'Bayesian inference, game theory, and formal systems that enable precise reasoning under uncertainty.',
    floors: ['F2', 'F3', 'F8'],
  },
  {
    symbol: 'Lambda',
    name: 'Language',
    subtitle: 'The Bridge of Knowledge',
    description: 'Natural language as the compression mechanism for human knowledge. Wittgenstein, Austin, and the pragmatics of meaning.',
    floors: ['F4', 'F6', 'F9'],
  },
];

// ─────────────────────────────────────────────────
// Constitutional Floors
// ─────────────────────────────────────────────────

const FLOORS = [
  { id: 'F1', name: 'Amanah', type: 'hard', desc: 'Reversible/Auditable' },
  { id: 'F2', name: 'Truth', type: 'hard', desc: 'Factuality >= 0.99' },
  { id: 'F3', name: 'Tri-Witness', type: 'soft', desc: 'Consensus >= 0.95' },
  { id: 'F4', name: 'Clarity', type: 'soft', desc: 'Entropy Reduction' },
  { id: 'F5', name: 'Peace', type: 'hard', desc: 'Stability >= 1.0' },
  { id: 'F6', name: 'Empathy', type: 'soft', desc: 'Protect weakest' },
  { id: 'F7', name: 'Humility', type: 'soft', desc: 'Uncertainty 3-5%' },
  { id: 'F8', name: 'Genius', type: 'soft', desc: 'Audit trails' },
  { id: 'F9', name: 'Anti-Hantu', type: 'hard', desc: 'No consciousness claims' },
  { id: 'F10', name: 'Ontology', type: 'hard', desc: 'Type safety' },
  { id: 'F11', name: 'Authority', type: 'hard', desc: 'Verified identity' },
  { id: 'F12', name: 'Defense', type: 'hard', desc: 'Injection resistance' },
  { id: 'F13', name: 'Sovereign', type: 'veto', desc: 'Human override' },
];

// ─────────────────────────────────────────────────
// Main App
// ─────────────────────────────────────────────────

function App() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [expandedPillar, setExpandedPillar] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#1A1810] text-gray-100 relative overflow-x-hidden">
      {/* ═══════════════════════════════════════ */}
      {/* NAVIGATION */}
      {/* ═══════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-[#1A1810]/95 backdrop-blur-md border-b border-gray-800/50' : ''}`}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <a href="#" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <div>
                <span className="font-semibold text-lg">APEX</span>
                <span className="text-xs text-gray-500 ml-2 hidden sm:inline">THEORY</span>
              </div>
            </a>

            <div className="hidden md:flex items-center gap-6">
              <a href="#pillars" className="text-sm text-gray-400 hover:text-white transition-colors">Three Pillars</a>
              <a href="#floors" className="text-sm text-gray-400 hover:text-white transition-colors">13 Floors</a>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <a href="https://arif-fazil.com" className="px-3 py-1.5 rounded text-red-400 text-xs font-medium hover:bg-red-900/20 transition-colors">HUMAN</a>
              <a href="https://apex.arif-fazil.com" className="px-3 py-1.5 rounded bg-yellow-500/20 text-yellow-400 text-xs font-medium border border-yellow-500/40">THEORY</a>
              <a href="https://arifos.arif-fazil.com" className="px-3 py-1.5 rounded text-cyan-400 text-xs font-medium hover:bg-cyan-900/20 transition-colors">APPS</a>
            </div>

            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#1A1810] border-b border-gray-800 px-4 py-4 space-y-3">
            <a href="#pillars" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>Three Pillars</a>
            <a href="#floors" className="block text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>13 Floors</a>
            <div className="border-t border-gray-800 pt-3 flex gap-2">
              <a href="https://arif-fazil.com" className="px-3 py-1.5 rounded text-red-400 text-xs">HUMAN</a>
              <a href="https://apex.arif-fazil.com" className="px-3 py-1.5 rounded bg-yellow-500/20 text-yellow-400 text-xs">THEORY</a>
              <a href="https://arifos.arif-fazil.com" className="px-3 py-1.5 rounded text-cyan-400 text-xs">APPS</a>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════ */}
      {/* HERO */}
      {/* ═══════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          {/* Trinity Logo */}
          <div className="flex justify-center mb-6">
            <img 
              src="/images/arifos-logo.webp" 
              alt="arifOS Trinity" 
              className="w-48 h-48 object-contain drop-shadow-[0_0_40px_rgba(212,175,55,0.4)]"
            />
          </div>

          {/* Ditempa Badge */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-yellow-500/30 bg-yellow-950/20 text-yellow-400 text-xs font-mono tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
              DITEMPA BUKAN DIBERI
            </div>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-500/10 border border-yellow-500/20 mb-8">
            <Shield className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-yellow-400">THEORY - Constitutional Canon</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold mb-6">
            <span className="text-white">APEX</span><span className="text-yellow-400">.</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-400 mb-4 max-w-2xl mx-auto">
            The Law Behind the Machine
          </p>

          <p className="text-sm text-gray-500 mb-3 font-mono">
            13 Immutable Floors - Delta Omega Psi Trinity - Scientific Foundations
          </p>

          <p className="max-w-3xl mx-auto text-gray-300 leading-relaxed mb-10">
            The constitutional canon for arifOS. This is the theory of constitutional AI, not its implementation.
            For deployment details, see <a href="https://arifos.arif-fazil.com" className="text-cyan-400 hover:underline">arifOS APPS</a>.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#pillars">
              <Button className="rounded-none bg-yellow-400 hover:bg-yellow-300 text-black px-10 py-6 text-sm font-bold">
                READ THE CANON
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* THREE PILLARS */}
      {/* ═══════════════════════════════════════ */}
      <section id="pillars" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Phase 00</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">Three Pillars of Meta-Intelligence</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Physics provides the foundation. Mathematics enables measurement. Language transmits knowledge.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {THREE_PILLARS.map((pillar) => (
              <div 
                key={pillar.name}
                className="p-8 border border-yellow-500/20 bg-black/40 hover:bg-yellow-500/5 transition-all cursor-pointer"
                onClick={() => setExpandedPillar(expandedPillar === pillar.name ? null : pillar.name)}
              >
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-4xl font-bold text-yellow-400">{pillar.symbol}</span>
                  <div>
                    <h3 className="text-xl font-bold text-white">{pillar.name}</h3>
                    <p className="text-xs text-yellow-400/60 uppercase tracking-wider">{pillar.subtitle}</p>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed mb-6">{pillar.description}</p>
                
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-gray-500">Floors:</span>
                  {pillar.floors.map(floor => (
                    <span key={floor} className="px-2 py-0.5 bg-yellow-500/10 text-yellow-400 text-xs font-mono">{floor}</span>
                  ))}
                </div>

                {expandedPillar === pillar.name && (
                  <div className="mt-6 pt-6 border-t border-yellow-500/10 text-sm text-gray-300">
                    <p>Click to collapse</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="p-8 border border-yellow-500/20 bg-black/40 text-center">
            <p className="text-gray-300 max-w-2xl mx-auto">
              <strong className="text-white">Physics</strong> tells us what is possible.{" "}
              <strong className="text-white">Mathematics</strong> tells us what is probable.{" "}
              <strong className="text-white">Language</strong> tells us what is meaningful.
              Together they constrain intelligence within constitutional bounds.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* 13 CONSTITUTIONAL FLOORS */}
      {/* ═══════════════════════════════════════ */}
      <section id="floors" className="py-24 relative bg-gradient-to-b from-[#1A1810] via-yellow-950/10 to-[#1A1810]">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-xs font-mono text-gray-500 uppercase tracking-widest">Phase 05</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-4 mb-6">The 13 Constitutional Floors</h2>
            <p className="text-gray-400 max-w-3xl mx-auto">
              Immutable constraints that govern AI behavior. All operations must satisfy these floors.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FLOORS.map((floor) => (
              <Card key={floor.id} className={`bg-gray-900/50 border-gray-800 ${
                floor.type === 'hard' ? 'hover:border-red-500/50' : 
                floor.type === 'veto' ? 'hover:border-purple-500/50' : 
                'hover:border-yellow-500/50'
              } transition-all`}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={`rounded-none text-xs ${
                      floor.type === 'hard' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                      floor.type === 'veto' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                      'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                    }`}>
                      {floor.id}
                    </Badge>
                    <span className="text-xs text-gray-500 uppercase">{floor.type}</span>
                  </div>
                  <CardTitle className="text-lg text-white mt-2">{floor.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-400">{floor.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════ */}
      {/* FOOTER */}
      {/* ═══════════════════════════════════════ */}
      <footer className="py-16 border-t border-gray-800/50">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="flex justify-center mb-6">
            <img 
              src="/images/arifos-logo.webp" 
              alt="arifOS" 
              className="w-12 h-12 object-contain"
            />
          </div>
          
          <p className="text-xl font-bold mb-1">DITEMPA BUKAN DIBERI</p>
          <p className="text-gray-500 mb-4 text-sm">Forged, Not Given</p>
          
          <div className="flex items-center justify-center gap-4 mb-6 text-xs text-gray-400">
            <a href="https://arif-fazil.com" className="flex items-center gap-1 hover:text-red-400"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>Human</a>
            <span className="text-gray-700">|</span>
            <a href="https://apex.arif-fazil.com" className="flex items-center gap-1 text-yellow-400"><span className="w-1.5 h-1.5 rounded-full bg-yellow-400"></span>Theory</a>
            <span className="text-gray-700">|</span>
            <a href="https://arifos.arif-fazil.com" className="flex items-center gap-1 hover:text-cyan-400"><span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>Apps</a>
          </div>
          
          <p className="text-gray-600 text-sm">Muhammad Arif bin Fazil - Penang, Malaysia</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
