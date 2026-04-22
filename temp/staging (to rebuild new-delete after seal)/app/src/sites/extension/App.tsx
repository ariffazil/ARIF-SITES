// EXTENSION Ring - aaa.arif-fazil.com
// Agent Apps AI Interface - AAA Orchestration

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Bot, Play, Pause, RefreshCw, CheckCircle, 
  Terminal, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

// Cellular Automata Background
const CellularAutomata: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gridRef = useRef<boolean[][]>([]);
  const animationRef = useRef<number | null>(null);

  const cellSize = 10;
  const cols = 80;
  const rows = 40;

  const initializeGrid = useCallback(() => {
    const grid: boolean[][] = [];
    for (let i = 0; i < cols; i++) {
      grid[i] = [];
      for (let j = 0; j < rows; j++) {
        grid[i][j] = Math.random() > 0.85;
      }
    }
    return grid;
  }, []);

  const countNeighbors = useCallback((grid: boolean[][], x: number, y: number) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const col = (x + i + cols) % cols;
        const row = (y + j + rows) % rows;
        if (grid[col]?.[row]) count++;
      }
    }
    return count;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = cols * cellSize;
    canvas.height = rows * cellSize;

    gridRef.current = initializeGrid();

    let frameCount = 0;
    const draw = () => {
      frameCount++;
      if (frameCount % 4 === 0) {
        const newGrid: boolean[][] = [];
        for (let i = 0; i < cols; i++) {
          newGrid[i] = [];
          for (let j = 0; j < rows; j++) {
            const neighbors = countNeighbors(gridRef.current, i, j);
            if (gridRef.current[i][j]) {
              newGrid[i][j] = neighbors === 2 || neighbors === 3;
            } else {
              newGrid[i][j] = neighbors === 3;
            }
          }
        }
        gridRef.current = newGrid;
      }

      ctx.fillStyle = '#1a0f2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          if (gridRef.current[i]?.[j]) {
            const age = Math.random();
            ctx.fillStyle = age > 0.7 ? '#ff9f6b' : '#ff6b35';
            ctx.fillRect(i * cellSize, j * cellSize, cellSize - 1, cellSize - 1);
          }
        }
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [initializeGrid, countNeighbors]);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full opacity-30"
      style={{ imageRendering: 'pixelated' }}
    />
  );
};

// Geometric Agent Avatar
const AgentAvatar: React.FC<{ type: 'architect' | 'auditor' | 'agent'; size?: number }> = ({ 
  type, size = 60 
}) => {
  const shapes = {
    architect: (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon
          points={`${size/2},${size*0.15} ${size*0.85},${size*0.85} ${size*0.15},${size*0.85}`}
          fill="none"
          stroke="#ff6b35"
          strokeWidth="2"
        />
        <circle cx={size/2} cy={size*0.55} r={size*0.15} fill="#ff6b35" opacity="0.5" />
      </svg>
    ),
    auditor: (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <rect
          x={size*0.2}
          y={size*0.2}
          width={size*0.6}
          height={size*0.6}
          fill="none"
          stroke="#ff6b35"
          strokeWidth="2"
        />
        <circle cx={size/2} cy={size/2} r={size*0.15} fill="#ff6b35" opacity="0.5" />
      </svg>
    ),
    agent: (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <polygon
          points={`${size/2},${size*0.1} ${size*0.9},${size*0.3} ${size*0.9},${size*0.7} ${size/2},${size*0.9} ${size*0.1},${size*0.7} ${size*0.1},${size*0.3}`}
          fill="none"
          stroke="#ff6b35"
          strokeWidth="2"
        />
        <circle cx={size/2} cy={size/2} r={size*0.15} fill="#ff6b35" opacity="0.5" />
      </svg>
    ),
  };

  return (
    <div className="relative" style={{ filter: 'drop-shadow(0 0 10px #ff6b3540)' }}>
      {shapes[type]}
    </div>
  );
};

// Main EXTENSION Site
const ExtensionSite: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'architect' | 'auditor' | 'agent'>('architect');
  const [agents] = useState([
    { id: 1, type: 'architect', status: 'idle', task: 'Awaiting instruction' },
    { id: 2, type: 'auditor', status: 'running', task: 'F10 compliance scan' },
    { id: 3, type: 'agent', status: 'complete', task: 'Tool registry update' },
  ]);

  const panels = {
    architect: {
      title: 'Architect',
      symbol: 'Δ',
      desc: 'Designs constitutional structures and agent workflows',
      capabilities: ['Constitutional design', 'Pipeline architecture', 'Floor planning'],
    },
    auditor: {
      title: 'Auditor',
      symbol: 'Ω',
      desc: 'Verifies compliance with F1-F13 constitutional constraints',
      capabilities: ['F10 compliance check', 'Truth verification', 'Safety audit'],
    },
    agent: {
      title: 'Agent',
      symbol: 'Ξ',
      desc: 'Executes tasks within constitutional boundaries',
      capabilities: ['Tool execution', 'Task delegation', 'State management'],
    },
  };

  return (
    <div className="min-h-screen bg-[#1a0f2e] text-[#ff9f6b] font-sans relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <CellularAutomata />
      </div>

      {/* Header */}
      <header className="relative z-10 bg-[#1a0f2e]/90 backdrop-blur-xl border-b border-[#ff6b35]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#ff6b35] flex items-center justify-center text-[#1a0f2e] font-bold text-xl">
              Ξ
            </div>
            <div>
              <div className="font-bold text-[#ff6b35]">AAA Interface</div>
              <div className="text-xs text-[#ff9f6b]/50">Agent Apps AI</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ff6b35]/10 border border-[#ff6b35]/30">
              <Sparkles className="w-4 h-4 text-[#ff6b35]" />
              <span className="text-xs">F3 Tri-Witness Active</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#ff6b35]/10 border border-[#ff6b35]/30 mb-8"
          >
            <Bot className="w-4 h-4 text-[#ff6b35]" />
            <span className="text-sm text-[#ff6b35]">Ξ EXTENSION Ring — Agentic Surface</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            AAA <span className="text-[#ff6b35]">Triptych</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#ff9f6b]/70 max-w-2xl mx-auto"
          >
            Three agents. One consensus. The Tri-Witness protocol ensuring 
            every action is architected, audited, and executed with constitutional integrity.
          </motion.p>
        </div>
      </section>

      {/* AAA Interface */}
      <section className="relative z-10 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Agent Selector */}
            <div className="space-y-3">
              {(Object.keys(panels) as Array<keyof typeof panels>).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`
                    w-full p-4 rounded-xl border transition-all text-left
                    ${activeTab === key 
                      ? 'bg-[#ff6b35]/20 border-[#ff6b35] ring-1 ring-[#ff6b35]' 
                      : 'bg-[#2d1b4e]/50 border-[#ff6b35]/20 hover:border-[#ff6b35]/50'
                    }
                  `}
                >
                  <div className="flex items-center gap-4">
                    <AgentAvatar type={key} size={40} />
                    <div>
                      <div className="font-bold text-[#ff6b35]">{panels[key].title}</div>
                      <div className="text-xs text-[#ff9f6b]/70">{panels[key].symbol} Agent Type</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Active Panel */}
            <div className="lg:col-span-2 p-6 rounded-2xl bg-[#2d1b4e]/50 border border-[#ff6b35]/20">
              <div className="flex items-center gap-4 mb-6">
                <AgentAvatar type={activeTab} size={60} />
                <div>
                  <h2 className="text-2xl font-bold text-[#ff6b35]">{panels[activeTab].title}</h2>
                  <p className="text-[#ff9f6b]/70">{panels[activeTab].desc}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="text-xs text-[#ff6b35]/60 uppercase tracking-wider">Capabilities</div>
                {panels[activeTab].capabilities.map((cap, i) => (
                  <div 
                    key={i}
                    className="flex items-center gap-3 p-3 rounded-lg bg-[#ff6b35]/10"
                  >
                    <CheckCircle className="w-4 h-4 text-[#ff6b35]" />
                    <span className="text-sm text-[#ff9f6b]">{cap}</span>
                  </div>
                ))}
              </div>

              {/* Tri-Witness Indicator */}
              <div className="mt-6 p-4 rounded-xl bg-[#ff6b35]/10 border border-[#ff6b35]/20">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-[#ff6b35]/60">F3 TRI-WITNESS CONSENSUS</span>
                  <div className="flex gap-1">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-2 h-2 rounded-full bg-[#ff6b35]" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.1 }}
                      className="w-2 h-2 rounded-full bg-[#ff6b35]" 
                    />
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2 h-2 rounded-full bg-[#ff6b35]" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Smolagent Workspace */}
      <section className="relative z-10 py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#2d1b4e]/50 border border-[#ff6b35]/20">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Terminal className="w-5 h-5 text-[#ff6b35]" />
                <h2 className="font-bold text-[#ff6b35]">Smolagent Workspace</h2>
              </div>
              <button className="px-4 py-2 rounded-lg bg-[#ff6b35] text-[#1a0f2e] text-sm font-bold hover:bg-[#ff9f6b] transition-colors">
                + Spawn Agent
              </button>
            </div>

            <div className="space-y-2">
              {agents.map((agent) => (
                <div 
                  key={agent.id}
                  className="flex items-center gap-4 p-3 rounded-lg bg-[#1a0f2e] border border-[#ff6b35]/10"
                >
                  <AgentAvatar type={agent.type as any} size={32} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm text-[#ff6b35]">{agent.type.toUpperCase()}-{agent.id}</span>
                      <span className={`
                        text-[10px] px-1.5 py-0.5 rounded
                        ${agent.status === 'running' ? 'bg-[#ff6b35]/30 text-[#ff6b35]' :
                          agent.status === 'complete' ? 'bg-[#00d4aa]/30 text-[#00d4aa]' :
                          'bg-[#d4a853]/30 text-[#d4a853]'
                        }
                      `}>
                        {agent.status.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-[#ff9f6b]/70">{agent.task}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {agent.status === 'running' && <Pause className="w-4 h-4 text-[#ff6b35]" />}
                    {agent.status === 'idle' && <Play className="w-4 h-4 text-[#00d4aa]" />}
                    {agent.status === 'complete' && <RefreshCw className="w-4 h-4 text-[#d4a853]" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-8 px-6 border-t border-[#ff6b35]/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold text-[#ff6b35] mb-2">Ditempa Bukan Diberi</div>
          <div className="text-sm text-[#ff9f6b]/50 mb-4">Forged, Not Given — ΔΩΨ | ARIF</div>
          <div className="text-xs text-[#ff9f6b]/30">
            arifOS v54.1-SEAL • Ω₀ ≈ 0.04 • F3 Tri-Witness
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ExtensionSite;
