import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, 
  Bot, Shield, Eye, Heart, Zap, Crown, Lock, Gauge
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Stage {
  stage: string;
  name: string;
  engine: string | null;
  function: string;
  icon: React.ElementType;
  color: string;
}

const STAGES: Stage[] = [
  { stage: '000', name: 'INIT', engine: null, function: 'Session initialization, injection scan', icon: Play, color: '#6b7280' },
  { stage: '111', name: 'SENSE', engine: 'Δ', function: 'Parse input, extract claims', icon: Eye, color: '#06b6d4' },
  { stage: '222', name: 'THINK', engine: 'Δ', function: 'Logical reasoning, Bayesian update', icon: Bot, color: '#06b6d4' },
  { stage: '333', name: 'ATLAS', engine: 'Δ', function: 'Model selection, knowledge grounding', icon: Gauge, color: '#06b6d4' },
  { stage: '444', name: 'EVIDENCE', engine: 'Δ+Ω', function: 'Trinity sync, Delta+Omega bundles', icon: Shield, color: '#8b5cf6' },
  { stage: '555', name: 'EMPATHY', engine: 'Ω', function: 'Stakeholder impact analysis', icon: Heart, color: '#ef4444' },
  { stage: '666', name: 'BRIDGE', engine: 'Ω', function: 'Alignment verification', icon: Lock, color: '#ef4444' },
  { stage: '777', name: 'EUREKA', engine: 'Ψ', function: 'Insight synthesis', icon: Zap, color: '#f59e0b' },
  { stage: '888', name: 'JUDGE', engine: 'Ψ', function: 'Final verdict', icon: Crown, color: '#f59e0b' },
  { stage: '889', name: 'PROOF', engine: 'Ψ', function: 'Cryptographic sealing', icon: Shield, color: '#f59e0b' },
  { stage: '999', name: 'SEAL', engine: 'Ψ', function: 'Merkle DAG commit, audit trail', icon: Lock, color: '#f59e0b' },
];

export function MetabolicLoop() {
  const [currentStage, setCurrentStage] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [completedStages, setCompletedStages] = useState<Set<number>>(new Set());
  const [entropy, setEntropy] = useState(100);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | undefined>(undefined);

  // Animation loop
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentStage(prev => {
        if (prev >= STAGES.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        const next = prev + 1;
        setCompletedStages(s => new Set([...s, next]));
        // Reduce entropy as we progress
        setEntropy(e => Math.max(0, e - 8));
        return next;
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // Canvas animation for entropy flow
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (rect) {
        canvas.width = rect.width * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    };
    resize();

    let particles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    const animate = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Spawn particles from active stage
      if (currentStage >= 0 && Math.random() < 0.3) {
        const stageWidth = rect.width / STAGES.length;
        const x = currentStage * stageWidth + stageWidth / 2;
        const y = rect.height / 2;
        particles.push({
          x,
          y: y + (Math.random() - 0.5) * 40,
          vx: 2 + Math.random(),
          vy: (Math.random() - 0.5) * 0.5,
          life: 1
        });
      }

      // Update and draw particles
      particles = particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.02;

        if (p.life > 0) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(245, 158, 11, ${p.life * 0.6})`;
          ctx.fill();
          return true;
        }
        return false;
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [currentStage]);

  const reset = () => {
    setCurrentStage(-1);
    setCompletedStages(new Set());
    setEntropy(100);
    setIsPlaying(false);
  };

  const getStageStatus = (index: number) => {
    if (index === currentStage) return 'active';
    if (completedStages.has(index)) return 'completed';
    return 'pending';
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
            >
              {isPlaying ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              {isPlaying ? 'Pause' : 'Play'}
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              className="border-gray-600 text-gray-400 hover:bg-gray-800"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
          
          {/* Entropy Display */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase">System Entropy</p>
              <p className={`font-mono text-xl font-bold ${entropy <= 50 ? 'text-green-400' : 'text-amber-400'}`}>
                {entropy.toFixed(0)}%
              </p>
            </div>
            <div className="w-32 h-2 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-green-500 transition-all duration-500"
                style={{ width: `${100 - entropy}%` }}
              />
            </div>
            <Badge variant="outline" className={entropy <= 0 ? 'border-green-500/50 text-green-400' : 'border-amber-500/50 text-amber-400'}>
              ΔS = {entropy <= 0 ? '-' : (entropy / 100 - 1).toFixed(2)}
            </Badge>
          </div>
        </div>

        {/* Stage Pipeline */}
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10"
          />
          
          <div className="overflow-x-auto pb-4">
            <div className="flex gap-2 min-w-max">
              {STAGES.map((stage, index) => {
                const status = getStageStatus(index);
                const Icon = stage.icon;
                
                return (
                  <Tooltip key={stage.stage}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          relative flex flex-col items-center p-3 rounded-xl border-2 min-w-[80px] transition-all duration-300 cursor-pointer
                          ${status === 'active' ? 'scale-105 shadow-lg shadow-' + stage.color + '/20' : ''}
                          ${status === 'completed' ? 'opacity-70' : ''}
                        `}
                        style={{
                          backgroundColor: status === 'active' ? stage.color + '20' : status === 'completed' ? stage.color + '10' : 'transparent',
                          borderColor: status === 'active' ? stage.color : status === 'completed' ? stage.color + '50' : '#374151',
                        }}
                      >
                        {/* Stage Number */}
                        <span 
                          className="text-[10px] font-mono mb-1"
                          style={{ color: status === 'pending' ? '#6b7280' : stage.color }}
                        >
                          {stage.stage}
                        </span>
                        
                        {/* Icon */}
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                          style={{ 
                            backgroundColor: status === 'pending' ? '#374151' : stage.color + '30',
                          }}
                        >
                          <Icon 
                            className="w-4 h-4" 
                            style={{ color: status === 'pending' ? '#6b7280' : stage.color }}
                          />
                        </div>
                        
                        {/* Name */}
                        <span className="text-[10px] text-gray-400 text-center">{stage.name}</span>
                        
                        {/* Engine Badge */}
                        {stage.engine && (
                          <span 
                            className="text-[8px] mt-1 px-1.5 py-0.5 rounded"
                            style={{ 
                              backgroundColor: stage.color + '20',
                              color: stage.color
                            }}
                          >
                            {stage.engine}
                          </span>
                        )}
                        
                        {/* Active Indicator */}
                        {status === 'active' && (
                          <div 
                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse"
                            style={{ backgroundColor: stage.color }}
                          />
                        )}
                        
                        {/* Completed Check */}
                        {status === 'completed' && (
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                            <div className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center">
                              <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          </div>
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <div className="space-y-1">
                        <p className="font-semibold" style={{ color: stage.color }}>
                          {stage.stage}: {stage.name}
                        </p>
                        <p className="text-xs text-gray-400">{stage.function}</p>
                        {stage.engine && (
                          <p className="text-[10px] text-gray-500">Engine: {stage.engine}</p>
                        )}
                      </div>
                    </TooltipContent>
                  </Tooltip>
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Stage Detail */}
        {currentStage >= 0 && (
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                {(() => {
                  const stage = STAGES[currentStage];
                  const Icon = stage.icon;
                  return (
                    <>
                      <div 
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: stage.color + '20', border: `1px solid ${stage.color}50` }}
                      >
                        <Icon className="w-6 h-6" style={{ color: stage.color }} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="font-bold" style={{ color: stage.color }}>
                            {stage.stage}: {stage.name}
                          </h4>
                          {stage.engine && (
                            <Badge variant="outline" style={{ borderColor: stage.color + '50', color: stage.color }}>
                              {stage.engine}
                            </Badge>
                          )}
                          <Badge variant="outline" className="border-green-500/50 text-green-400 animate-pulse">
                            ACTIVE
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-400 mt-1">{stage.function}</p>
                        
                        {/* Stage-specific info */}
                        <div className="mt-3 p-3 rounded-lg bg-black/30">
                          {currentStage === 0 && (
                            <p className="text-xs text-gray-500">
                              Initializing session context, scanning for injection attempts (F12), 
                              establishing cryptographic session keys.
                            </p>
                          )}
                          {currentStage >= 1 && currentStage <= 3 && (
                            <p className="text-xs text-gray-500">
                              ARIF (Δ) epistemic processing: Bayesian belief updating, 
                              logical entailment verification, knowledge graph navigation.
                            </p>
                          )}
                          {currentStage === 4 && (
                            <p className="text-xs text-gray-500">
                              Trinity synchronization: DeltaBundle (evidence) meets OmegaBundle (safety constraints).
                            </p>
                          )}
                          {currentStage >= 5 && currentStage <= 6 && (
                            <p className="text-xs text-gray-500">
                              ADAM (Ω) safety analysis: Stakeholder impact assessment, 
                              harm boundary verification, empathy computation (κᵣ).
                            </p>
                          )}
                          {currentStage >= 7 && (
                            <p className="text-xs text-gray-500">
                              APEX (Ψ) authority layer: Cryptographic sealing, Merkle DAG commitment, 
                              VAULT-999 audit trail generation.
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Completion Message */}
        {currentStage === STAGES.length - 1 && (
          <div className="p-4 rounded-xl border border-green-500/30 bg-green-500/10 text-center">
            <p className="text-green-400 font-semibold mb-1">Metabolic Loop Complete</p>
            <p className="text-sm text-gray-400">
              Output sealed with Merkle signature. Entropy reduced from 100% to {entropy.toFixed(0)}%.
              Audit trail committed to VAULT-999.
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-500/30 border border-cyan-500/50" />
            <span>ARIF (Δ) — Epistemic</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/30 border border-red-500/50" />
            <span>ADAM (Ω) — Safety</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500/30 border border-amber-500/50" />
            <span>APEX (Ψ) — Authority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-500/30 border border-purple-500/50" />
            <span>Sync — Trinity</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
