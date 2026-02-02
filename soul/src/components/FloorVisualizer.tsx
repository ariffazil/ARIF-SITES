import { useState, useEffect, useRef } from 'react';
import { Shield, Lock, Eye, Heart, Zap, Crown, Gauge, XCircle, PauseCircle } from 'lucide-react';
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

      // Draw connections
      for (let i = 0; i < positions.length - 1; i++) {
        const p1 = positions[i];
        const p2 = positions[i + 1];
        
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        
        // Curved line
        const cpX = (p1.x + p2.x) / 2;
        const cpY = Math.min(p1.y, p2.y) - 30;
        ctx.quadraticCurveTo(cpX, cpY, p2.x, p2.y);
        
        ctx.strokeStyle = `rgba(245, 158, 11, 0.2)`;
        ctx.lineWidth = 1;
        ctx.setLineDash([5, 5]);
        ctx.stroke();
        ctx.setLineDash([]);

        // Animated particle
        const time = Date.now() / 1000;
        const t = (time % 2) / 2;
        const particleX = (1 - t) * (1 - t) * p1.x + 2 * (1 - t) * t * cpX + t * t * p2.x;
        const particleY = (1 - t) * (1 - t) * p1.y + 2 * (1 - t) * t * cpY + t * t * p2.y;
        
        ctx.beginPath();
        ctx.arc(particleX, particleY, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#f59e0b';
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
        <div className="relative z-10 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
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
                      relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300
                      ${isActive ? 'scale-105 shadow-lg' : 'hover:scale-102'}
                      ${floor.type === 'hard' ? 'border-red-500/30 bg-red-500/5 hover:border-red-500/50' : ''}
                      ${floor.type === 'soft' ? 'border-amber-500/30 bg-amber-500/5 hover:border-amber-500/50' : ''}
                      ${floor.type === 'veto' ? 'border-purple-500/30 bg-purple-500/5 hover:border-purple-500/50' : ''}
                      ${!isAnimated ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}
                    `}
                    style={{ transitionDelay: `${parseInt(floor.id.slice(1)) * 50}ms` }}
                  >
                    {/* Type Badge */}
                    <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                      {getTypeBadge(floor.type)}
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-2">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${floor.color}20`, border: `1px solid ${floor.color}50` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: floor.color }} />
                      </div>
                    </div>

                    {/* ID */}
                    <p className="text-center font-mono text-sm font-bold" style={{ color: floor.color }}>
                      {floor.id}
                    </p>

                    {/* Name */}
                    <p className="text-center text-xs text-gray-400 mt-1">
                      {floor.name}
                    </p>

                    {floor.arabic && (
                      <p className="text-center text-[10px] text-gray-600 mt-0.5 font-arabic">
                        {floor.arabic}
                      </p>
                    )}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {getTypeIcon(floor.type)}
                      <span className="font-semibold">{floor.id}: {floor.name}</span>
                    </div>
                    <p className="text-xs text-gray-400">{floor.description}</p>
                    <code className="text-[10px] bg-black/50 px-1.5 py-0.5 rounded block">
                      {floor.formula}
                    </code>
                    <p className="text-[10px] text-gray-500">
                      <span className="text-gray-400">Basis:</span> {floor.basis}
                    </p>
                  </div>
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        {/* Expanded Detail Panel */}
        {activeFloor && (
          <div className="mt-6 p-6 rounded-xl border border-gray-700 bg-gray-900/50">
            {(() => {
              const floor = FLOORS.find(f => f.id === activeFloor)!;
              const Icon = floor.icon;
              return (
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: `${floor.color}20`, border: `2px solid ${floor.color}50` }}
                    >
                      <Icon className="w-7 h-7" style={{ color: floor.color }} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold" style={{ color: floor.color }}>
                          {floor.id}: {floor.name}
                        </h3>
                        {getTypeBadge(floor.type)}
                      </div>
                      {floor.arabic && (
                        <p className="text-sm text-gray-500 font-arabic mt-1">{floor.arabic}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-gray-400">{floor.description}</p>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-black/30">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Formula</p>
                      <code className="text-sm" style={{ color: floor.color }}>{floor.formula}</code>
                    </div>
                    <div className="p-3 rounded-lg bg-black/30">
                      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Constraint</p>
                      <p className="text-sm text-gray-300">{floor.constraint}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Scientific Basis:</span>{' '}
                      <span className="text-gray-300">{floor.basis}</span>
                    </div>
                    <div className="text-gray-600">|</div>
                    <div>
                      <span className="text-gray-500">Source:</span>{' '}
                      <span className="text-gray-400 text-xs">{floor.literature}</span>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50" />
            <span className="text-gray-400">Hard Floor (VOID on fail)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50" />
            <span className="text-gray-400">Soft Floor (SABAR on fail)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500/30 border border-purple-500/50" />
            <span className="text-gray-400">Veto Floor (888 JUDGE)</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
