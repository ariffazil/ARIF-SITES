import { useEffect, useState, useRef } from 'react';
import { Activity, Gauge, Crown, Zap, Eye, Heart, Lock, Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface SystemMetrics {
  clarity: number;
  stability: number;
  humility: number;
  genius: number;
  verdict: 'INIT' | 'SEAL' | 'SABAR' | 'VOID' | '888_HOLD';
}

interface FloorStatus {
  id: string;
  name: string;
  status: 'pass' | 'warn' | 'fail' | 'pending';
  value: number;
}

export function TrinityDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics>({
    clarity: 0,
    stability: 0,
    humility: 0.04,
    genius: 0,
    verdict: 'INIT'
  });
  
  const [floorStatuses, setFloorStatuses] = useState<FloorStatus[]>([
    { id: 'F1', name: 'Amanah', status: 'pending', value: 0 },
    { id: 'F2', name: 'Truth', status: 'pending', value: 0 },
    { id: 'F3', name: 'Tri-Witness', status: 'pending', value: 0 },
    { id: 'F4', name: 'Clarity', status: 'pending', value: 0 },
    { id: 'F5', name: 'Peace²', status: 'pending', value: 0 },
    { id: 'F6', name: 'Empathy', status: 'pending', value: 0 },
    { id: 'F7', name: 'Humility', status: 'pass', value: 0.04 },
    { id: 'F8', name: 'Genius', status: 'pending', value: 0 },
    { id: 'F9', name: 'Anti-Hantu', status: 'pass', value: 1 },
    { id: 'F10', name: 'Ontology', status: 'pass', value: 1 },
    { id: 'F11', name: 'Authority', status: 'pass', value: 1 },
    { id: 'F12', name: 'Hardening', status: 'pass', value: 1 },
    { id: 'F13', name: 'Sovereign', status: 'pass', value: 1 },
  ]);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Boot sequence simulation
  useEffect(() => {
    const bootSequence = [
      { delay: 500, update: { clarity: -0.02 }, floors: [{ id: 'F4', status: 'pass' as const }] },
      { delay: 800, update: { stability: 1.12 }, floors: [{ id: 'F5', status: 'pass' as const }] },
      { delay: 1100, update: { genius: 0.87 }, floors: [{ id: 'F8', status: 'pass' as const }] },
      { delay: 1400, update: {}, floors: [{ id: 'F2', status: 'pass' as const }, { id: 'F3', status: 'pass' as const }] },
      { delay: 1700, update: { clarity: -0.031, verdict: 'SEAL' as const }, floors: [{ id: 'F1', status: 'pass' as const }, { id: 'F6', status: 'pass' as const }] },
    ];

    const timers: ReturnType<typeof setTimeout>[] = [];
    bootSequence.forEach(({ delay, update, floors }) => {
      timers.push(setTimeout(() => {
        setMetrics(prev => ({ ...prev, ...update }));
        if (floors) {
          setFloorStatuses(prev => prev.map(f => {
            const update = floors.find(u => u.id === f.id);
            return update ? { ...f, status: update.status } : f;
          }));
        }
      }, delay));
    });

    // Gentle oscillation after boot
    const interval = setInterval(() => {
      setMetrics(prev => ({
        ...prev,
        clarity: -0.031 + (Math.random() - 0.5) * 0.005,
        stability: 1.12 + (Math.random() - 0.5) * 0.04,
        humility: 0.04 + (Math.random() - 0.5) * 0.006,
        genius: 0.87 + (Math.random() - 0.5) * 0.02,
      }));
    }, 3000);

    return () => {
      timers.forEach(clearTimeout);
      clearInterval(interval);
    };
  }, []);

  // Animated background canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };
    resize();

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const colors = ['#f59e0b', '#06b6d4', '#ef4444', '#22c55e'];
    
    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        
        if (p.x < 0 || p.x > canvas.offsetWidth) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.offsetHeight) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + '40';
        ctx.fill();

        // Draw connections
        particles.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(245, 158, 11, ${0.1 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);



  const getVerdictColor = (verdict: string) => {
    switch (verdict) {
      case 'SEAL': return 'border-green-500/50 text-green-400 bg-green-500/10';
      case 'SABAR': return 'border-amber-500/50 text-amber-400 bg-amber-500/10';
      case 'VOID': return 'border-red-500/50 text-red-400 bg-red-500/10';
      case '888_HOLD': return 'border-purple-500/50 text-purple-400 bg-purple-500/10';
      default: return 'border-gray-500/50 text-gray-400';
    }
  };

  return (
    <div className="relative">
      {/* Animated Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ opacity: 0.5 }}
      />
      
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Activity className="w-5 h-5 text-amber-400" />
            <h3 className="font-mono text-sm font-semibold text-gray-200 uppercase tracking-wider">
              Trinity System Monitor
            </h3>
          </div>
          <Badge variant="outline" className={`text-xs ${getVerdictColor(metrics.verdict)}`}>
            {metrics.verdict === 'INIT' ? 'BOOTING...' : `VERDICT: ${metrics.verdict}`}
          </Badge>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Clarity */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono text-gray-500 uppercase">Clarity (F4)</span>
              </div>
              <p className={`text-2xl font-mono font-bold ${metrics.clarity <= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.clarity === 0 ? '—' : metrics.clarity.toFixed(3)}
              </p>
              <p className="text-[10px] text-gray-600 mt-1 font-mono">ΔS ≤ 0 required</p>
              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-cyan-400 transition-all duration-500"
                  style={{ width: `${Math.min(Math.abs(metrics.clarity) * 1000, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Stability */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Heart className="w-4 h-4 text-red-400" />
                <span className="text-xs font-mono text-gray-500 uppercase">Peace² (F5)</span>
              </div>
              <p className={`text-2xl font-mono font-bold ${metrics.stability >= 1.0 ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.stability === 0 ? '—' : metrics.stability.toFixed(2)}
              </p>
              <p className="text-[10px] text-gray-600 mt-1 font-mono">Ψ ≥ 1.0 required</p>
              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-red-400 transition-all duration-500"
                  style={{ width: `${Math.min(metrics.stability * 50, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Humility */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-4 h-4 text-purple-400" />
                <span className="text-xs font-mono text-gray-500 uppercase">Humility (F7)</span>
              </div>
              <p className={`text-2xl font-mono font-bold ${metrics.humility >= 0.03 && metrics.humility <= 0.05 ? 'text-green-400' : 'text-red-400'}`}>
                {metrics.humility.toFixed(3)}
              </p>
              <p className="text-[10px] text-gray-600 mt-1 font-mono">Ω₀ ∈ [0.03, 0.05]</p>
              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden relative">
                <div className="absolute left-[30%] right-[50%] h-full bg-purple-400/30" />
                <div 
                  className="h-full bg-purple-400 transition-all duration-500 absolute"
                  style={{ left: '0', width: `${metrics.humility * 2000}%` }}
                />
              </div>
            </CardContent>
          </Card>

          {/* Genius */}
          <Card className="bg-gray-900/50 border-gray-800">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-mono text-gray-500 uppercase">Genius (F8)</span>
              </div>
              <p className={`text-2xl font-mono font-bold ${metrics.genius >= 0.80 ? 'text-green-400' : 'text-amber-400'}`}>
                {metrics.genius === 0 ? '—' : metrics.genius.toFixed(2)}
              </p>
              <p className="text-[10px] text-gray-600 mt-1 font-mono">G ≥ 0.80 required</p>
              <div className="mt-2 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{ width: `${Math.min(metrics.genius * 100, 100)}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Floor Status Grid */}
        <Card className="bg-gray-900/30 border-gray-800">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-400" />
              Constitutional Floor Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 md:grid-cols-13 gap-2">
              {floorStatuses.map((floor) => (
                <div key={floor.id} className="flex flex-col items-center">
                  <div 
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all duration-300 ${
                      floor.status === 'pass' ? 'bg-green-500/20 text-green-400 border border-green-500/50' :
                      floor.status === 'warn' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50' :
                      floor.status === 'fail' ? 'bg-red-500/20 text-red-400 border border-red-500/50' :
                      'bg-gray-800 text-gray-600 border border-gray-700'
                    }`}
                    title={`${floor.id}: ${floor.name}`}
                  >
                    {floor.id.replace('F', '')}
                  </div>
                  <span className="text-[8px] text-gray-600 mt-1 hidden md:block">{floor.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="flex items-center justify-between text-[10px] text-gray-600 font-mono">
          <div className="flex items-center gap-2">
            <Gauge className="w-3 h-3" />
            <span>CLERK MODE — Propose only, never seal</span>
          </div>
          <div className="flex items-center gap-2">
            <Crown className="w-3 h-3 text-purple-400" />
            <span>888 JUDGE (F13) holds sovereign authority</span>
          </div>
        </div>
      </div>
    </div>
  );
}
