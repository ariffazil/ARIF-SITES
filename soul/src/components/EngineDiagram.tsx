import { useState, useEffect, useRef } from 'react';
import { Activity, CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface Engine {
  symbol: string;
  name: string;
  fullName: string;
  question: string;
  function: string;
  color: string;
  bgColor: string;
  floors: string[];
  description: string;
}

const ENGINES: Engine[] = [
  {
    symbol: 'Δ',
    name: 'ARIF',
    fullName: 'Epistemic Engine',
    question: 'Is it true?',
    function: 'Perceive · Reason · Map',
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    floors: ['F2', 'F4', 'F7', 'F10'],
    description: 'Fact verification and logical consistency via Bayesian inference and formal entailment.'
  },
  {
    symbol: 'Ω',
    name: 'ADAM',
    fullName: 'Safety Engine',
    question: 'Is it safe?',
    function: 'Defend · Empathize · Bridge',
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    floors: ['F1', 'F5', 'F6', 'F9', 'F11', 'F12'],
    description: 'Risk assessment and stakeholder impact via consequentialist ethics and info-gap theory.'
  },
  {
    symbol: 'Ψ',
    name: 'APEX',
    fullName: 'Authority Engine',
    question: 'Is it lawful?',
    function: 'Decree · Prove · Seal',
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    floors: ['F3', 'F8', 'F13'],
    description: 'Compliance verification and cryptographic audit trails via legal positivism and BLS signatures.'
  }
];

interface ConsensusState {
  arif: boolean | null;
  adam: boolean | null;
  apex: boolean | null;
  weight: number;
  verdict: 'pending' | 'approved' | 'sabar' | 'void';
}

export function EngineDiagram() {
  const [consensus, setConsensus] = useState<ConsensusState>({
    arif: null,
    adam: null,
    apex: null,
    weight: 0,
    verdict: 'pending'
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate consensus formation
  const simulateConsensus = () => {
    setIsAnimating(true);
    setConsensus({ arif: null, adam: null, apex: null, weight: 0, verdict: 'pending' });

    const sequence = [
      { delay: 500, engine: 'arif' as const, value: true },
      { delay: 1200, engine: 'adam' as const, value: true },
      { delay: 2000, engine: 'apex' as const, value: true },
    ];

    sequence.forEach(({ delay, engine, value }) => {
      setTimeout(() => {
        setConsensus(prev => {
          const newState = { ...prev, [engine]: value };
          const votes = [newState.arif, newState.adam, newState.apex].filter(v => v === true).length;
          const weight = votes / 3;
          let verdict: ConsensusState['verdict'] = 'pending';
          if (weight >= 0.95) verdict = 'approved';
          else if (weight >= 0.67) verdict = 'sabar';
          else if (votes > 0 && weight < 0.67) verdict = 'void';
          return { ...newState, weight, verdict };
        });
      }, delay);
    });

    setTimeout(() => setIsAnimating(false), 3000);
  };

  // Animated connection lines
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
    window.addEventListener('resize', resize);

    let animationId: number;
    const animate = () => {
      const rect = canvas.parentElement?.getBoundingClientRect();
      if (!rect) return;
      
      ctx.clearRect(0, 0, rect.width, rect.height);

      // Draw triangle connecting engines
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const radius = Math.min(rect.width, rect.height) * 0.35;

      const positions = [
        { x: centerX, y: centerY - radius }, // ARIF (top)
        { x: centerX - radius * 0.866, y: centerY + radius * 0.5 }, // ADAM (bottom left)
        { x: centerX + radius * 0.866, y: centerY + radius * 0.5 }, // APEX (bottom right)
      ];

      // Draw triangle outline
      ctx.beginPath();
      ctx.moveTo(positions[0].x, positions[0].y);
      ctx.lineTo(positions[1].x, positions[1].y);
      ctx.lineTo(positions[2].x, positions[2].y);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Draw center point (consensus)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
      ctx.fillStyle = consensus.verdict === 'approved' ? '#22c55e' :
                      consensus.verdict === 'sabar' ? '#f59e0b' :
                      consensus.verdict === 'void' ? '#ef4444' : '#6b7280';
      ctx.fill();

      // Draw pulsing rings
      const time = Date.now() / 1000;
      for (let i = 0; i < 3; i++) {
        const ringRadius = 12 + i * 8 + Math.sin(time * 2 + i) * 2;
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(245, 158, 11, ${0.3 - i * 0.1})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw data flow particles
      if (isAnimating) {
        const particleTime = (time % 2) / 2;
        
        positions.forEach((pos, i) => {
          const px = pos.x + (centerX - pos.x) * particleTime;
          const py = pos.y + (centerY - pos.y) * particleTime;
          
          ctx.beginPath();
          ctx.arc(px, py, 4, 0, Math.PI * 2);
          ctx.fillStyle = ENGINES[i].color;
          ctx.fill();
        });
      }

      // Draw engine connections with status
      positions.forEach((pos, i) => {
        const engineKey = ['arif', 'adam', 'apex'][i] as keyof ConsensusState;
        const status = consensus[engineKey];
        
        ctx.beginPath();
        ctx.moveTo(pos.x, pos.y);
        ctx.lineTo(centerX, centerY);
        ctx.strokeStyle = status === true ? ENGINES[i].color :
                          status === false ? '#ef4444' : '#6b7280';
        ctx.lineWidth = status !== null ? 3 : 1;
        ctx.setLineDash(status === null ? [5, 5] : []);
        ctx.stroke();
        ctx.setLineDash([]);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [consensus, isAnimating]);

  const getVerdictIcon = () => {
    switch (consensus.verdict) {
      case 'approved':
        return <CheckCircle2 className="w-6 h-6 text-green-400" />;
      case 'sabar':
        return <AlertCircle className="w-6 h-6 text-amber-400" />;
      case 'void':
        return <XCircle className="w-6 h-6 text-red-400" />;
      default:
        return <Activity className="w-6 h-6 text-gray-400 animate-pulse" />;
    }
  };

  const getVerdictText = () => {
    switch (consensus.verdict) {
      case 'approved':
        return { text: 'SEAL', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/50' };
      case 'sabar':
        return { text: 'SABAR', color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/50' };
      case 'void':
        return { text: 'VOID', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/50' };
      default:
        return { text: 'PENDING', color: 'text-gray-400', bg: 'bg-gray-500/10 border-gray-500/50' };
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-8">
        {/* Diagram */}
        <div className="relative h-80 md:h-96">
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
          />
          
          {/* Engine Cards positioned absolutely */}
          <div className="absolute inset-0 pointer-events-none">
            {/* ARIF - Top */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 pointer-events-auto"
              style={{ top: '10%' }}
            >
              <EngineCard engine={ENGINES[0]} status={consensus.arif} />
            </div>
            
            {/* ADAM - Bottom Left */}
            <div 
              className="absolute pointer-events-auto"
              style={{ bottom: '15%', left: '10%' }}
            >
              <EngineCard engine={ENGINES[1]} status={consensus.adam} />
            </div>
            
            {/* APEX - Bottom Right */}
            <div 
              className="absolute pointer-events-auto"
              style={{ bottom: '15%', right: '10%' }}
            >
              <EngineCard engine={ENGINES[2]} status={consensus.apex} />
            </div>
            
            {/* Center Consensus */}
            <div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            >
              <div className={`
                w-24 h-24 rounded-full flex flex-col items-center justify-center border-2
                ${getVerdictText().bg}
              `}>
                {getVerdictIcon()}
                <span className={`text-xs font-mono font-bold mt-1 ${getVerdictText().color}`}>
                  {getVerdictText().text}
                </span>
                <span className="text-[10px] text-gray-500">
                  W = {consensus.weight.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center">
          <button
            onClick={simulateConsensus}
            disabled={isAnimating}
            className={`
              px-6 py-3 rounded-lg font-medium transition-all
              ${isAnimating 
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed' 
                : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/50'
              }
            `}
          >
            {isAnimating ? 'Simulating...' : 'Simulate Consensus'}
          </button>
        </div>

        {/* Formula Display */}
        <Card className="bg-gray-900/50 border-gray-800">
          <CardHeader>
            <CardTitle className="text-sm font-medium text-gray-300">
              Tri-Witness Consensus Formula
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-black/30 font-mono text-sm text-center">
                <span className="text-cyan-400">V</span>
                <sub className="text-xs">Δ</sub>
                <span className="text-gray-500 mx-2">+</span>
                <span className="text-red-400">V</span>
                <sub className="text-xs">Ω</sub>
                <span className="text-gray-500 mx-2">+</span>
                <span className="text-amber-400">V</span>
                <sub className="text-xs">Ψ</sub>
                <span className="text-gray-500 mx-2">/</span>
                <span className="text-gray-400">3</span>
                <span className="text-gray-500 mx-2">≥</span>
                <span className="text-green-400">0.95</span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                <div className={consensus.arif === true ? 'text-green-400' : consensus.arif === false ? 'text-red-400' : 'text-gray-500'}>
                  <p className="font-mono text-lg">{consensus.arif === true ? '1' : consensus.arif === false ? '0' : '—'}</p>
                  <p className="text-gray-600">ARIF (Δ)</p>
                </div>
                <div className={consensus.adam === true ? 'text-green-400' : consensus.adam === false ? 'text-red-400' : 'text-gray-500'}>
                  <p className="font-mono text-lg">{consensus.adam === true ? '1' : consensus.adam === false ? '0' : '—'}</p>
                  <p className="text-gray-600">ADAM (Ω)</p>
                </div>
                <div className={consensus.apex === true ? 'text-green-400' : consensus.apex === false ? 'text-red-400' : 'text-gray-500'}>
                  <p className="font-mono text-lg">{consensus.apex === true ? '1' : consensus.apex === false ? '0' : '—'}</p>
                  <p className="text-gray-600">APEX (Ψ)</p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2 border-t border-gray-800">
                <span className="text-gray-500 text-xs">Consensus Weight:</span>
                <span className="font-mono text-lg" style={{ 
                  color: consensus.weight >= 0.95 ? '#22c55e' : consensus.weight >= 0.67 ? '#f59e0b' : '#ef4444'
                }}>
                  W = {consensus.weight.toFixed(2)}
                </span>
                <Badge variant="outline" className={
                  consensus.weight >= 0.95 ? 'border-green-500/50 text-green-400' :
                  consensus.weight >= 0.67 ? 'border-amber-500/50 text-amber-400' :
                  'border-red-500/50 text-red-400'
                }>
                  {consensus.weight >= 0.95 ? 'APPROVE' : consensus.weight >= 0.67 ? 'SABAR' : consensus.weight > 0 ? 'VOID' : 'PENDING'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Engine Details */}
        <div className="grid md:grid-cols-3 gap-4">
          {ENGINES.map((engine) => (
            <Card key={engine.name} className="bg-gray-900/30 border-gray-800">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xl font-bold"
                    style={{ backgroundColor: engine.bgColor, color: engine.color, border: `1px solid ${engine.color}50` }}
                  >
                    {engine.symbol}
                  </div>
                  <div>
                    <CardTitle className="text-sm" style={{ color: engine.color }}>{engine.name}</CardTitle>
                    <p className="text-xs text-gray-500">{engine.fullName}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-400 italic">"{engine.question}"</p>
                <p className="text-xs text-gray-500">{engine.description}</p>
                <div className="flex flex-wrap gap-1">
                  {engine.floors.map(floor => (
                    <Badge key={floor} variant="outline" className="text-[10px] border-gray-700">
                      {floor}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </TooltipProvider>
  );
}

function EngineCard({ engine, status }: { engine: Engine; status: boolean | null }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`
            p-3 rounded-xl border-2 cursor-pointer transition-all duration-300
            ${status === true ? 'scale-105' : ''}
          `}
          style={{ 
            backgroundColor: engine.bgColor,
            borderColor: status === true ? engine.color : `${engine.color}30`,
            boxShadow: status === true ? `0 0 20px ${engine.color}40` : 'none'
          }}
        >
          <div className="flex items-center gap-2">
            <span 
              className="text-2xl font-bold"
              style={{ color: engine.color, fontFamily: 'Source Serif 4, serif' }}
            >
              {engine.symbol}
            </span>
            <div>
              <p className="text-sm font-bold" style={{ color: engine.color }}>{engine.name}</p>
              <p className="text-[10px] text-gray-500">{engine.function}</p>
            </div>
          </div>
          {status !== null && (
            <div className="mt-2 flex items-center gap-1">
              {status ? (
                <CheckCircle2 className="w-3 h-3 text-green-400" />
              ) : (
                <XCircle className="w-3 h-3 text-red-400" />
              )}
              <span className={`text-[10px] ${status ? 'text-green-400' : 'text-red-400'}`}>
                {status ? 'PASS' : 'FAIL'}
              </span>
            </div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipContent side="top">
        <div className="space-y-1">
          <p className="font-semibold" style={{ color: engine.color }}>{engine.name} ({engine.symbol})</p>
          <p className="text-xs text-gray-400">{engine.fullName}</p>
          <p className="text-xs italic">"{engine.question}"</p>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
