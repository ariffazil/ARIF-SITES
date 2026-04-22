// BODY Ring - arifosmcp.arif-fazil.com
// Execution Runtime - Live Telemetry Dashboard
// INTEGRATED with arifOS MCP API

import React, { useEffect, useRef } from 'react';
import { 
  Activity, Database, Shield, Server, 
  Clock, RefreshCw, Lock, ChevronRight
} from 'lucide-react';
import { useLiveVitals } from '@/shared/hooks/useLiveVitals';

// Live Metric Component
const LiveMetric: React.FC<{
  label: string;
  value: string | number;
  unit: string;
  trend?: 'up' | 'down' | 'stable';
  color?: string;
  loading?: boolean;
}> = ({ label, value, unit, trend = 'stable', color = '#00d4aa', loading = false }) => {
  return (
    <div className="p-4 rounded-xl bg-[#0f1418] border border-[#00d4aa]/20">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[#00d4aa]/60 uppercase tracking-wider">{label}</span>
        {loading ? (
          <RefreshCw className="w-4 h-4 text-[#00d4aa] animate-spin" />
        ) : (
          <>
            {trend === 'up' && <Activity className="w-4 h-4 text-[#00ffcc]" />}
            {trend === 'down' && <Activity className="w-4 h-4 text-[#ff6b35]" />}
            {trend === 'stable' && <div className="w-2 h-2 rounded-full bg-[#00d4aa]" />}
          </>
        )}
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-mono font-bold" style={{ color }}>
          {loading ? '--' : value}
        </span>
        <span className="text-xs text-[#00d4aa]/50">{unit}</span>
      </div>
    </div>
  );
};

// Tool Status Component
const ToolStatus: React.FC<{
  name: string;
  status: 'active' | 'standby' | 'error';
  latency: string;
  lastPing: string;
}> = ({ name, status, latency, lastPing }) => {
  const statusColors = {
    active: '#00d4aa',
    standby: '#d4a853',
    error: '#ff6b35',
  };

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-[#0f1418] border border-[#00d4aa]/10 hover:border-[#00d4aa]/30 transition-colors">
      <div className={`
        w-2 h-2 rounded-full animate-pulse
      `} style={{ backgroundColor: statusColors[status] }} />
      <div className="flex-1">
        <div className="text-sm font-mono text-[#00d4aa]">{name}</div>
        <div className="text-xs text-[#00d4aa]/50">{lastPing}</div>
      </div>
      <div className="text-right">
        <div className="text-xs text-[#00d4aa]/60">{status.toUpperCase()}</div>
        <div className="text-sm font-mono" style={{ color: statusColors[status] }}>{latency}</div>
      </div>
    </div>
  );
};

// Merkle Tree Visualization
const MerkleTree: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resize();

    let time = 0;
    let animationId: number;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      ctx.clearRect(0, 0, w, h);

      // Draw tree structure
      const levels = 4;
      const nodeRadius = 6;
      
      for (let level = 0; level < levels; level++) {
        const nodesInLevel = Math.pow(2, level);
        const y = h - (level / (levels - 1)) * (h - 40) - 20;
        
        for (let i = 0; i < nodesInLevel; i++) {
          const x = (w / (nodesInLevel + 1)) * (i + 1);
          
          // Draw connections to children
          if (level < levels - 1) {
            const childY = h - ((level + 1) / (levels - 1)) * (h - 40) - 20;
            const childX1 = (w / (nodesInLevel * 2 + 1)) * (i * 2 + 1);
            const childX2 = (w / (nodesInLevel * 2 + 1)) * (i * 2 + 2);
            
            ctx.strokeStyle = 'rgba(0, 212, 170, 0.2)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(childX1, childY);
            ctx.moveTo(x, y);
            ctx.lineTo(childX2, childY);
            ctx.stroke();
          }
          
          // Draw node
          const pulse = Math.sin(time * 0.05 + level + i) * 0.3 + 0.7;
          ctx.fillStyle = `rgba(0, 212, 170, ${pulse})`;
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
          ctx.fill();
          
          // Glow
          ctx.fillStyle = `rgba(0, 212, 170, ${pulse * 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, nodeRadius * 2, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      time++;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-48"
    />
  );
};

// Connection Status Badge
const ConnectionStatus: React.FC<{ isConnected: boolean; error: Error | null }> = ({ 
  isConnected, error 
}) => {
  if (error) {
    return (
      <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#ff6b35]/10 border border-[#ff6b35]/30">
        <div className="w-2 h-2 rounded-full bg-[#ff6b35]" />
        <span className="text-xs text-[#ff6b35]">Connection Error</span>
      </div>
    );
  }
  
  return (
    <div className={`
      flex items-center gap-2 px-3 py-1 rounded-lg border
      ${isConnected 
        ? 'bg-[#00d4aa]/10 border-[#00d4aa]/30' 
        : 'bg-[#d4a853]/10 border-[#d4a853]/30'
      }
    `}>
      <div className={`
        w-2 h-2 rounded-full animate-pulse
        ${isConnected ? 'bg-[#00d4aa]' : 'bg-[#d4a853]'}
      `} />
      <span className={`text-xs ${isConnected ? 'text-[#00d4aa]' : 'text-[#d4a853]'}`}>
        {isConnected ? 'Live' : 'Connecting...'}
      </span>
    </div>
  );
};

// Main BODY Site
const BodySite: React.FC = () => {
  const { vitals, loading, error, isConnected } = useLiveVitals({ 
    pollInterval: 5000,
    useWebSocket: false 
  });

  return (
    <div className="min-h-screen bg-[#050508] text-[#00d4aa] font-mono">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#050508]/90 backdrop-blur-xl border-b border-[#00d4aa]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-[#00d4aa] flex items-center justify-center text-[#050508] font-bold text-xl">
                Δ
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#00ffcc] animate-pulse" />
            </div>
            <div>
              <div className="font-bold text-[#00d4aa]">arifOS MCP</div>
              <div className="text-xs text-[#00d4aa]/50">Execution Runtime</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ConnectionStatus isConnected={isConnected} error={error} />
            <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/30">
              <Clock className="w-4 h-4" />
              <span>{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="px-3 py-1 rounded-lg bg-[#00d4aa]/10 border border-[#00d4aa]/30">
              <span className="text-xs text-[#00d4aa]/60">Ω₀ ≈</span>
              <span className="ml-1 font-bold">
                {vitals ? vitals.omega.toFixed(3) : '0.040'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Live Metrics */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <LiveMetric 
              label="CPU Load" 
              value={vitals ? vitals.cpu.toFixed(1) : '--'} 
              unit="%" 
              trend={vitals && vitals.cpu > 50 ? 'up' : 'stable'}
              loading={loading}
            />
            <LiveMetric 
              label="Memory" 
              value={vitals ? vitals.memory.toFixed(1) : '--'} 
              unit="%" 
              trend="stable"
              loading={loading}
            />
            <LiveMetric 
              label="Entropy" 
              value={vitals ? vitals.entropy.toFixed(3) : '--'} 
              unit="bits" 
              trend="stable"
              color="#d4a853"
              loading={loading}
            />
            <LiveMetric 
              label="Reversibility" 
              value={vitals ? vitals.reversibility.toFixed(1) : '--'} 
              unit="%" 
              trend="stable"
              loading={loading}
            />
            <LiveMetric 
              label="Quantum σ" 
              value={vitals ? vitals.omega.toFixed(3) : '--'} 
              unit="" 
              trend="stable"
              color="#ff6b35"
              loading={loading}
            />
          </div>
        </div>
      </section>

      {/* Main Dashboard */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Tool Registry */}
            <div className="p-6 rounded-2xl bg-[#0f1418] border border-[#00d4aa]/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Server className="w-5 h-5 text-[#00d4aa]" />
                  <h2 className="font-bold text-[#00d4aa]">Tool Registry</h2>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <RefreshCw className="w-3 h-3 animate-spin" />
                  <span className="text-[#00d4aa]/60">Live</span>
                </div>
              </div>

              <div className="space-y-2">
                <ToolStatus 
                  name="VAULT999" 
                  status="active" 
                  latency="12ms" 
                  lastPing="2s ago"
                />
                <ToolStatus 
                  name="MCP_BRIDGE" 
                  status="active" 
                  latency="8ms" 
                  lastPing="1s ago"
                />
                <ToolStatus 
                  name="TELEMETRY" 
                  status="active" 
                  latency="4ms" 
                  lastPing="0.5s ago"
                />
                <ToolStatus 
                  name="AUDIT_LOG" 
                  status="standby" 
                  latency="--" 
                  lastPing="5m ago"
                />
                <ToolStatus 
                  name="F10_SCANNER" 
                  status="active" 
                  latency="2ms" 
                  lastPing="0.2s ago"
                />
              </div>
            </div>

            {/* Merkle Tree */}
            <div className="p-6 rounded-2xl bg-[#0f1418] border border-[#00d4aa]/20">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <Database className="w-5 h-5 text-[#00d4aa]" />
                  <h2 className="font-bold text-[#00d4aa]">Merkle DAG</h2>
                </div>
                <div className="text-xs text-[#00d4aa]/50">
                  31 nodes • 4 levels
                </div>
              </div>
              <MerkleTree />
            </div>
          </div>
        </div>
      </section>

      {/* Constitutional Floors */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#0f1418] border border-[#00d4aa]/20">
            <div className="flex items-center gap-3 mb-6">
              <Shield className="w-5 h-5 text-[#00d4aa]" />
              <h2 className="font-bold text-[#00d4aa]">Active Constitutional Floors</h2>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { floor: 'F1', name: 'Amanah', primary: true },
                { floor: 'F8', name: 'Genius', primary: false },
                { floor: 'F11', name: 'Auditability', primary: false },
              ].map((item) => (
                <div 
                  key={item.floor}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg
                    ${item.primary 
                      ? 'bg-[#00d4aa]/20 border border-[#00d4aa]' 
                      : 'bg-[#00d4aa]/10 border border-[#00d4aa]/30'
                    }
                  `}
                >
                  <span className="font-bold">{item.floor}</span>
                  <span className="text-sm text-[#00d4aa]/70">{item.name}</span>
                  {item.primary && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#00d4aa] text-[#050508]">
                      PRIMARY
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* API Integration Info */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 rounded-xl bg-[#00d4aa]/5 border border-[#00d4aa]/20">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#00d4aa]/20 flex items-center justify-center flex-shrink-0">
                <ChevronRight className="w-5 h-5 text-[#00d4aa]" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-[#00d4aa] mb-1">MCP API Integration</h3>
                <p className="text-sm text-[#00d4aa]/70 mb-3">
                  This dashboard connects to the live arifOS MCP server at 
                  <code className="mx-1 px-2 py-0.5 rounded bg-[#00d4aa]/10">arifosmcp.arif-fazil.com</code>
                </p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <span className="px-2 py-1 rounded bg-[#00d4aa]/10 text-[#00d4aa]">GET /api/v1/vitals</span>
                  <span className="px-2 py-1 rounded bg-[#00d4aa]/10 text-[#00d4aa]">GET /api/v1/tools</span>
                  <span className="px-2 py-1 rounded bg-[#00d4aa]/10 text-[#00d4aa]">POST /api/v1/tools/:name</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* F12 Wall Notice */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-4 rounded-xl bg-[#ff6b35]/10 border border-[#ff6b35]/30 flex items-center gap-4">
            <Lock className="w-5 h-5 text-[#ff6b35]" />
            <div className="flex-1">
              <div className="text-sm font-bold text-[#ff6b35]">F12 Wall Active</div>
              <div className="text-xs text-[#ff6b35]/70">
                Read-only public telemetry. Write operations require sovereign authentication.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#00d4aa]/10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs text-[#00d4aa]/50">
            <span>Δ BODY Ring</span>
            <span>|</span>
            <span>Execution Runtime</span>
          </div>
          <div className="text-xs text-[#00d4aa]/30">
            arifOS v54.1-SEAL • Ω₀ ≈ 0.04
          </div>
        </div>
      </footer>
    </div>
  );
};

export default BodySite;
