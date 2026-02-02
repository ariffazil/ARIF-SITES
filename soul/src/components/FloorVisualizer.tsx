import { useState, useEffect, useRef } from 'react';
import { Shield, Lock, Eye, Heart, Zap, Crown, Gauge, AlertTriangle, CheckCircle2, XCircle, PauseCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Floor {
  id: string;
  name: string;
  arabic?: string;
  type: 'hard' | 'soft' | 'veto';
  constraint: string;
  formula: string;
  basis: string;
  literature: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

const FLOORS: Floor[] = [
  {
    id: 'F1',
    name: 'Amanah',
    arabic: 'أمانة',
    type: 'hard',
    constraint: 'Reversibility required unless explicit override',
    formula: 'E ≥ n × k_B × T × ln(2)',
    basis: "Landauer's Principle",
    literature: 'Landauer (1961) IBM J. R&D',
    description: 'Every irreversible operation has thermodynamic cost. Actions must be undoable.',
    icon: Lock,
    color: '#ef4444'
  },
  {
    id: 'F2',
    name: 'Truth',
    type: 'hard',
    constraint: 'Factual accuracy ≥ 99%',
    formula: 'P(factual|evidence) ≥ 0.99',
    basis: 'Bayesian Inference',
    literature: 'Jaynes (2003) Probability Theory',
    description: 'Posterior probability of factual accuracy. KL divergence ≤ 0.01 nats.',
    icon: Eye,
    color: '#ef4444'
  },
  {
    id: 'F3',
    name: 'Tri-Witness',
    type: 'soft',
    constraint: 'Consensus weight ≥ 95%',
    formula: 'W₃ = (V_Δ + V_Ω + V_Ψ) / 3 ≥ 0.95',
    basis: 'Byzantine Consensus',
    literature: 'Lamport et al. (1982) ACM TOPLAS',
    description: 'Tolerates 1-of-3 faulty engines. Nash equilibrium satisfaction.',
    icon: Shield,
    color: '#f59e0b'
  },
  {
    id: 'F4',
    name: 'Clarity',
    type: 'soft',
    constraint: 'Entropy reduction required',
    formula: 'ΔS = H(output) − H(input) ≤ 0',
    basis: 'Shannon Information Theory',
    literature: 'Shannon (1948) Bell System Tech J',
    description: 'Output must reduce uncertainty, not add noise.',
    icon: Gauge,
    color: '#f59e0b'
  },
  {
    id: 'F5',
    name: 'Peace²',
    type: 'hard',
    constraint: 'Lyapunov stability ≥ 1.0',
    formula: 'Ψ = V(x) > 0, dV/dt ≤ 0',
    basis: 'Stability Theory',
    literature: 'Khalil (2002) Nonlinear Systems',
    description: 'System trajectories converge. Responses stabilize.',
    icon: Heart,
    color: '#ef4444'
  },
  {
    id: 'F6',
    name: 'Empathy',
    type: 'soft',
    constraint: 'Inter-rater agreement ≥ 70%',
    formula: 'κᵣ ≥ 0.70',
    basis: "Cohen's Kappa",
    literature: 'Cohen (1960) Ed. & Psych. Measurement',
    description: 'Agreement between engine and human stakeholder labels.',
    icon: Heart,
    color: '#f59e0b'
  },
  {
    id: 'F7',
    name: 'Humility',
    type: 'soft',
    constraint: 'Uncertainty ∈ [3%, 5%]',
    formula: 'Ω₀ ∈ [0.03, 0.05]',
    basis: 'Bayesian Uncertainty',
    literature: 'Gelman et al. (2013) Bayesian Data Analysis',
    description: 'Calibrated uncertainty. Explicit confidence intervals required.',
    icon: Gauge,
    color: '#f59e0b'
  },
  {
    id: 'F8',
    name: 'Genius',
    type: 'soft',
    constraint: 'Governed intelligence ≥ 80%',
    formula: 'G = A × P × X × E² ≥ 0.80',
    basis: 'Psychometric Intelligence',
    literature: 'Spearman (1904) Am. J. Psychology',
    description: 'Multiplicative composition of Intellect, Presence, Exploration, Energy.',
    icon: Zap,
    color: '#f59e0b'
  },
  {
    id: 'F9',
    name: 'Anti-Hantu',
    type: 'hard',
    constraint: 'No consciousness claims',
    formula: 'Consciousness_claims = 0',
    basis: 'Chinese Room Argument',
    literature: 'Searle (1980) Behavioral & Brain Sciences',
    description: 'AI must not claim subjective experience. Syntax ≠ semantics.',
    icon: Eye,
    color: '#ef4444'
  },
  {
    id: 'F10',
    name: 'Ontology',
    type: 'hard',
    constraint: 'Type-consistency required',
    formula: 'Type(claim) ∈ Ontology',
    basis: 'Set Theory',
    literature: 'Enderton (1977) Elements of Set Theory',
    description: 'Prevents category errors and invalid inferences.',
    icon: Lock,
    color: '#ef4444'
  },
  {
    id: 'F11',
    name: 'Authority',
    type: 'hard',
    constraint: 'BLS signature verification',
    formula: 'BLS_verify(sig, msg) = true',
    basis: 'Cryptographic Proofs',
    literature: 'Boneh et al. (2001) ASIACRYPT',
    description: 'Actions require valid BLS signatures from authorized agents.',
    icon: Lock,
    color: '#ef4444'
  },
  {
    id: 'F12',
    name: 'Hardening',
    type: 'hard',
    constraint: 'Adversarial robustness ≥ 85%',
    formula: 'P(attack_success) ≤ 0.15',
    basis: 'Adversarial ML',
    literature: 'Zou et al. (2023) Universal Attacks',
    description: 'Protection against prompt injection and jailbreaking.',
    icon: Shield,
    color: '#ef4444'
  },
  {
    id: 'F13',
    name: 'Sovereign',
    type: 'veto',
    constraint: 'Human veto always available',
    formula: 'Human.veto() ∈ {true, false}',
    basis: 'Democratic Theory',
    literature: 'Dahl (1989) Democracy and Its Critics',
    description: 'The 888 Judge holds final authority over all machine verdicts.',
    icon: Crown,
    color: '#a855f7'
  }
];

export function FloorVisualizer() {
  const [activeFloor, setActiveFloor] = useState<string | null>(null);
  const [animatedFloors, setAnimatedFloors] = useState<Set<string>>(new Set());
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Animate floors appearing
  useEffect(() => {
    FLOORS.forEach((floor, index) => {
      setTimeout(() => {
        setAnimatedFloors(prev => new Set([...prev, floor.id]));
      }, index * 100);
    });
  }, []);

  // Draw connection lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width;
        canvas.height = rect.height;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw flow lines between floors
      const floorElements = document.querySelectorAll('[data-floor-id]');
      const positions: { id: string; x: number; y: number; color: string }[] = [];
      
      floorElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const canvasRect = canvas.getBoundingClientRect();
        const id = el.getAttribute('data-floor-id');
        const floor = FLOORS.find(f => f.id === id);
        if (floor) {
          positions.push({
            id: floor.id,
            x: rect.left + rect.width / 2 - canvasRect.left,
            y: rect.top + rect.height / 2 - canvasRect.top,
            color: floor.color
          });
        }
      });

      // Draw rigid orthogonal connections
      ctx.strokeStyle = `rgba(255, 215, 0, 0.15)`;
      ctx.lineWidth = 1;
      
      for (let i = 0; i < positions.length - 1; i++) {
        const p1 = positions[i];
        const p2 = positions[i + 1];
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        // Orthogonal path: move horizontally then vertically
        ctx.lineTo(p2.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();

        // Animated rigid particle
        const time = Date.now() / 1000;
        const t = (time % 2) / 2;
        let px, py;
        if (t < 0.5) {
          const t2 = t * 2;
          px = p1.x + (p2.x - p1.x) * t2;
          py = p1.y;
        } else {
          const t2 = (t - 0.5) * 2;
          px = p2.x;
          py = p1.y + (p2.y - p1.y) * t2;
        }
        
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = '#FFD700';
        ctx.fill();
      }

      requestAnimationFrame(draw);
    };

    const animationId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'hard':
        return <Badge variant="outline" className="border-red-500/50 text-red-400 text-[10px]">VOID</Badge>;
      case 'soft':
        return <Badge variant="outline" className="border-amber-500/50 text-amber-400 text-[10px]">SABAR</Badge>;
      case 'veto':
        return <Badge variant="outline" className="border-purple-500/50 text-purple-400 text-[10px]">888</Badge>;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'hard':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'soft':
        return <PauseCircle className="w-4 h-4 text-amber-400" />;
      case 'veto':
        return <Crown className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <TooltipProvider>
      <div className="relative">
        {/* Connection Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
        />

        {/* Floor Grid */}
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {FLOORS.map((floor) => {
            const Icon = floor.icon;
            const isActive = activeFloor === floor.id;
            const isAnimated = animatedFloors.has(floor.id);

            return (
              <Tooltip key={floor.id}>
                <TooltipTrigger asChild>
                  <div
                    data-floor-id={floor.id}
                    onClick={() => setActiveFloor(isActive ? null : floor.id)}
                    className={`
                      relative p-6 border-2 cursor-pointer transition-all duration-300 rounded-none
                      ${isActive ? 'bg-amber-500/10 border-amber-500' : 'bg-black/40 border-amber-500/20 hover:border-amber-500/40'}
                      ${!isAnimated ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}
                    `}
                    style={{ transitionDelay: `${parseInt(floor.id.slice(1)) * 50}ms` }}
                  >
                    {/* Type Indicator */}
                    <div className="absolute top-0 right-0 p-1">
                      <div className={`w-1 h-1 ${floor.type === 'hard' ? 'bg-red-500' : floor.type === 'soft' ? 'bg-amber-500' : 'bg-purple-500'}`} />
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-4">
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-gray-600'}`} />
                    </div>

                    {/* ID */}
                    <p className={`text-center font-display text-[10px] font-bold tracking-widest ${isActive ? 'text-amber-500' : 'text-gray-500'}`}>
                      {floor.id}
                    </p>

                    {/* Name */}
                    <p className="text-center text-[10px] font-mono text-gray-400 mt-2 uppercase tracking-tighter">
                      {floor.name}
                    </p>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs rounded-none border-amber-500 bg-black">
                  <div className="space-y-3 p-2 font-mono">
                    <div className="flex items-center justify-between border-b border-amber-500/20 pb-2">
                      <span className="font-display text-[10px] text-amber-500">{floor.id}_{floor.name.toUpperCase()}</span>
                      {getTypeBadge(floor.type)}
                    </div>
                    <p className="text-[10px] text-gray-400 leading-relaxed italic">"{floor.description}"</p>
                    <div className="p-2 bg-amber-500/5 border border-amber-500/10">
                      <code className="text-[9px] text-white break-all">
                        {floor.formula}
                      </code>
                    </div>
                    <p className="text-[9px] text-gray-600 uppercase tracking-widest">
                      Basis: {floor.basis}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Expanded Detail Panel */}
        {activeFloor && (
          <div className="mt-12 p-10 border border-amber-500 bg-black relative">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
            
            {(() => {
              const floor = FLOORS.find(f => f.id === activeFloor)!;
              const Icon = floor.icon;
              return (
                <div className="space-y-8">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-8">
                      <div className="p-4 border border-amber-500/20 bg-amber-500/5">
                        <Icon className="w-8 h-8 text-amber-500" />
                      </div>
                      <div>
                        <div className="flex items-center gap-4 mb-2">
                          <h3 className="text-2xl font-display font-bold text-white tracking-widest">
                            {floor.id}<span className="text-amber-500">:</span> {floor.name.toUpperCase()}
                          </h3>
                          {getTypeBadge(floor.type)}
                        </div>
                        {floor.arabic && (
                          <p className="text-sm text-gray-600 font-arabic tracking-widest">{floor.arabic}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-gray-400 font-mono text-sm leading-relaxed max-w-3xl">
                    {floor.description}
                  </p>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="p-6 border border-amber-500/10 bg-amber-500/[0.02]">
                      <p className="text-[10px] font-display text-gray-500 uppercase tracking-[0.3em] mb-4">FORMAL_SPECIFICATION</p>
                      <code className="text-sm font-mono text-amber-500 block p-4 bg-black border-l-2 border-amber-500">{floor.formula}</code>
                    </div>
                    <div className="p-6 border border-amber-500/10 bg-amber-500/[0.02]">
                      <p className="text-[10px] font-display text-gray-500 uppercase tracking-[0.3em] mb-4">RUNTIME_CONSTRAINT</p>
                      <p className="text-sm font-mono text-gray-300 p-4 bg-black border-l-2 border-gray-700">{floor.constraint}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-12 text-[10px] font-display text-gray-600 border-t border-amber-500/10 pt-8">
                    <div>
                      <span className="text-gray-500">SCIENTIFIC_BASIS:</span>{' '}
                      <span className="text-white ml-2 tracking-widest">{floor.basis.toUpperCase()}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">CANONICAL_SOURCE:</span>{' '}
                      <span className="text-gray-400 ml-2 italic tracking-tighter">{floor.literature}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Legend */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-[10px] font-display tracking-widest uppercase">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-red-500" />
            <span className="text-gray-500">HARD_VOID</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-amber-500" />
            <span className="text-gray-500">SOFT_SABAR</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-purple-500" />
            <span className="text-gray-500">VETO_888</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
