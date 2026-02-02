import { useState, useEffect, useRef } from 'react';
import { 
  Play, Pause, RotateCcw, ChevronRight, 
  Bot, User, Shield, Eye, Heart, Zap, Crown, Lock, Gauge
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
  { stage: '000', name: 'INIT', engine: null, function: 'Session initialization, injection scan', icon: Play, color: '#FFD700' },
  { stage: '111', name: 'SENSE', engine: 'Δ', function: 'Parse input, extract claims', icon: Eye, color: '#FFD700' },
  { stage: '222', name: 'THINK', engine: 'Δ', function: 'Logical reasoning, Bayesian update', icon: Bot, color: '#FFD700' },
  { stage: '333', name: 'ATLAS', engine: 'Δ', function: 'Model selection, knowledge grounding', icon: Gauge, color: '#FFD700' },
  { stage: '444', name: 'EVIDENCE', engine: 'Δ+Ω', function: 'Trinity sync, Delta+Omega bundles', icon: Shield, color: '#FFD700' },
  { stage: '555', name: 'EMPATHY', engine: 'Ω', function: 'Stakeholder impact analysis', icon: Heart, color: '#FFD700' },
  { stage: '666', name: 'BRIDGE', engine: 'Ω', function: 'Alignment verification', icon: Lock, color: '#FFD700' },
  { stage: '777', name: 'EUREKA', engine: 'Ψ', function: 'Insight synthesis', icon: Zap, color: '#FFD700' },
  { stage: '888', name: 'JUDGE', engine: 'Ψ', function: 'Final verdict', icon: Crown, color: '#FFD700' },
  { stage: '889', name: 'PROOF', engine: 'Ψ', function: 'Cryptographic sealing', icon: Shield, color: '#FFD700' },
  { stage: '999', name: 'SEAL', engine: 'Ψ', function: 'Merkle DAG commit, audit trail', icon: Lock, color: '#FFD700' },
];

// ... (rest of logic preserved)

  return (
    <TooltipProvider>
      <div className="space-y-12">
        {/* Controls and Entropy */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border border-amber-500/20 bg-black/40 p-8">
          <div className="flex items-center gap-4">
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              variant="outline"
              className="rounded-none border-amber-500 text-amber-500 hover:bg-amber-500/10 font-display text-[10px] tracking-widest px-8"
            >
              {isPlaying ? <Pause className="w-3 h-3 mr-3" /> : <Play className="w-3 h-3 mr-3" />}
              {isPlaying ? 'PAUSE_FLOW' : 'INITIATE_FLOW'}
            </Button>
            <Button
              onClick={reset}
              variant="outline"
              className="rounded-none border-gray-800 text-gray-500 hover:bg-gray-900 font-display text-[10px] tracking-widest px-8"
            >
              <RotateCcw className="w-3 h-3 mr-3" />
              RESET
            </Button>
          </div>
          
          <div className="flex items-center gap-12">
            <div className="text-right">
              <p className="text-[10px] font-display text-gray-600 mb-2 tracking-widest">SYSTEM_ENTROPY</p>
              <p className={`font-mono text-3xl font-bold ${entropy <= 50 ? 'text-white' : 'text-amber-500'}`}>
                {entropy.toFixed(0)}%
              </p>
            </div>
            <div className="space-y-3">
              <div className="w-48 h-1 bg-gray-900 overflow-hidden">
                <div 
                  className="h-full bg-amber-500 transition-all duration-500"
                  style={{ width: `${100 - entropy}%` }}
                />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[8px] font-display text-gray-700 tracking-tighter">ΔS_REDUCTION_TARGET</span>
                <Badge variant="outline" className={`rounded-none px-3 py-0 text-[10px] font-mono ${entropy <= 0 ? 'border-green-500 text-green-400' : 'border-amber-500/40 text-amber-500'}`}>
                  ΔS = {(entropy / 100 - 1).toFixed(2)}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Stage Pipeline */}
        <div className="relative border border-amber-500/10 bg-black/20 p-8">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30"
          />
          
          <div className="overflow-x-auto pb-4 custom-scrollbar">
            <div className="flex gap-4 min-w-max">
              {STAGES.map((stage, index) => {
                const status = getStageStatus(index);
                const Icon = stage.icon;
                
                return (
                  <Tooltip key={stage.stage}>
                    <TooltipTrigger asChild>
                      <div
                        className={`
                          relative flex flex-col items-center p-6 border-2 min-w-[110px] transition-all duration-500 cursor-pointer rounded-none
                          ${status === 'active' ? 'bg-amber-500/10 border-amber-500 scale-105' : 
                            status === 'completed' ? 'border-amber-500/40 bg-black/40' : 
                            'border-amber-500/5 bg-black/60 opacity-40'}
                        `}
                      >
                        {/* Stage Number */}
                        <span className={`text-[10px] font-display font-bold mb-4 tracking-widest ${status === 'active' ? 'text-white' : 'text-gray-600'}`}>
                          {stage.stage}
                        </span>
                        
                        {/* Icon */}
                        <div className={`p-3 mb-4 transition-colors ${status === 'active' ? 'bg-amber-500 text-black' : 'text-gray-700'}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        {/* Name */}
                        <span className={`text-[10px] font-display tracking-widest ${status === 'active' ? 'text-amber-500' : 'text-gray-600'}`}>{stage.name}</span>
                        
                        {/* Active Indicator Bar */}
                        {status === 'active' && (
                          <div className="absolute top-0 left-0 w-full h-[2px] bg-white animate-pulse" />
                        )}
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="top" className="rounded-none border-amber-500 bg-black p-4">
                      <div className="space-y-2 font-mono">
                        <p className="font-display text-[10px] text-amber-500 tracking-widest">
                          STG_{stage.stage}: {stage.name}
                        </p>
                        <p className="text-xs text-gray-400 italic">"{stage.function}"</p>
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
          <div className="border border-amber-500 bg-black relative p-10">
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white" />
            
            <div className="flex items-start gap-12">
              {(() => {
                const stage = STAGES[currentStage];
                const Icon = stage.icon;
                return (
                  <>
                    <div className="p-6 border border-amber-500/20 bg-amber-500/5">
                      <Icon className="w-10 h-10 text-amber-500" />
                    </div>
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center gap-6">
                        <h4 className="text-2xl font-display font-bold text-white tracking-widest">
                          {stage.stage}<span className="text-amber-500">_</span>{stage.name}
                        </h4>
                        <Badge variant="outline" className="rounded-none border-green-500 text-green-500 text-[10px] font-display tracking-widest bg-green-500/5 px-4 py-1">
                          METABOLIZING...
                        </Badge>
                      </div>
                      <p className="text-lg font-mono text-gray-400 italic">{stage.function}</p>
                      
                      <div className="p-6 border border-amber-500/10 bg-amber-500/[0.02] font-mono text-sm leading-relaxed text-gray-500">
                        {currentStage === 0 && "Initializing session context, scanning for injection attempts (F12), establishing cryptographic session keys."}
                        {currentStage >= 1 && currentStage <= 3 && "ARIF (Δ) epistemic processing: Bayesian belief updating, logical entailment verification, knowledge graph navigation."}
                        {currentStage === 4 && "Trinity synchronization: DeltaBundle (evidence) meets OmegaBundle (safety constraints)."}
                        {currentStage >= 5 && currentStage <= 6 && "ADAM (Ω) safety analysis: Stakeholder impact assessment, harm boundary verification, empathy computation (κᵣ)."}
                        {currentStage >= 7 && "APEX (Ψ) authority layer: Cryptographic sealing, Merkle DAG commitment, VAULT-999 audit trail generation."}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

        {/* Completion Message */}
        {currentStage === STAGES.length - 1 && (
          <div className="p-8 border border-green-500 bg-green-500/5 relative">
            <div className="absolute top-0 left-0 w-2 h-2 bg-green-500" />
            <p className="text-green-400 font-display text-[10px] font-bold mb-2 tracking-widest uppercase">Metabolic_Loop_Complete</p>
            <p className="text-sm font-mono text-gray-400 leading-relaxed italic">
              Output sealed with Merkle signature. Entropy reduced from 100% to {entropy.toFixed(0)}%.
              Audit trail committed to VAULT-999.
            </p>
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-12 text-[10px] font-display text-gray-600 border-t border-amber-500/10 pt-8 tracking-widest">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-amber-500" />
            <span>ARIF (Δ)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-amber-500/60" />
            <span>ADAM (Ω)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-amber-500/30" />
            <span>APEX (Ψ)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 bg-white" />
            <span>TRINITY_SYNC</span>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
