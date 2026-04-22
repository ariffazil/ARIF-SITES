// FIELD Ring - civ.arif-fazil.com
// Civilization Intelligence - Worldmodel

import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Activity, Layers, Wind
} from 'lucide-react';
import { motion } from 'framer-motion';

// Spherical Harmonic Globe
const SphericalGlobe: React.FC = () => {
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

    let rotation = 0;
    let animationId: number;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      const cx = w / 2;
      const cy = h / 2;
      const radius = Math.min(w, h) * 0.35;

      ctx.clearRect(0, 0, w, h);

      // Draw grid lines
      ctx.strokeStyle = 'rgba(107, 140, 174, 0.2)';
      ctx.lineWidth = 0.5;

      // Longitude
      for (let i = 0; i < 12; i++) {
        const phi = (i / 12) * Math.PI * 2 + rotation;
        ctx.beginPath();
        for (let theta = 0; theta <= Math.PI; theta += 0.1) {
          const x = cx + radius * Math.sin(theta) * Math.cos(phi);
          const y = cy + radius * Math.cos(theta);
          if (theta === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Latitude
      for (let i = 1; i < 6; i++) {
        const theta = (i / 6) * Math.PI;
        const r = radius * Math.sin(theta);
        const y = cy + radius * Math.cos(theta);
        ctx.beginPath();
        ctx.ellipse(cx, y, r, r * 0.3, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Data points (simulated civilization metrics)
      const points = [
        { lat: 0.5, lon: 0.2, intensity: 0.9 },
        { lat: 0.3, lon: 0.8, intensity: 0.7 },
        { lat: 0.7, lon: 0.5, intensity: 0.8 },
        { lat: 0.4, lon: 0.3, intensity: 0.6 },
        { lat: 0.6, lon: 0.9, intensity: 0.5 },
      ];

      points.forEach((p, i) => {
        const phi = p.lon * Math.PI * 2 + rotation;
        const theta = p.lat * Math.PI;
        const x = cx + radius * Math.sin(theta) * Math.cos(phi);
        const y = cy + radius * Math.cos(theta);
        
        const pulse = Math.sin(Date.now() * 0.002 + i) * 0.3 + 0.7;
        const size = 4 + p.intensity * 6 * pulse;
        
        ctx.fillStyle = `rgba(201, 176, 55, ${p.intensity * pulse})`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        
        // Glow
        ctx.fillStyle = `rgba(201, 176, 55, ${p.intensity * pulse * 0.3})`;
        ctx.beginPath();
        ctx.arc(x, y, size * 2, 0, Math.PI * 2);
        ctx.fill();
      });

      rotation += 0.003;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-80"
    />
  );
};

// Heat Flow Visualization
const HeatFlow: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const particles: { x: number; y: number; vx: number; vy: number; temp: number }[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        temp: Math.random(),
      });
    }

    let animationId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(10, 16, 24, 0.1)';
      ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.offsetWidth;
        if (p.x > canvas.offsetWidth) p.x = 0;
        if (p.y < 0) p.y = canvas.offsetHeight;
        if (p.y > canvas.offsetHeight) p.y = 0;

        const alpha = 0.2 + p.temp * 0.4;
        ctx.fillStyle = `rgba(107, 140, 174, ${alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2 + p.temp * 3, 0, Math.PI * 2);
        ctx.fill();

        // Connections
        particles.forEach((other) => {
          const dist = Math.hypot(p.x - other.x, p.y - other.y);
          if (dist < 50 && dist > 0) {
            ctx.strokeStyle = `rgba(107, 140, 174, ${(1 - dist / 50) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="w-full h-48 rounded-xl"
    />
  );
};

// Orbital Update Log
const OrbitalLog: React.FC = () => {
  const [updates] = useState([
    { id: 1, title: 'Worldmodel v12.4', stability: 'stable', orbit: 95 },
    { id: 2, title: 'Geopolitical Thermodynamics', stability: 'adjusting', orbit: 78 },
    { id: 3, title: 'Complex Systems Analysis', stability: 'stable', orbit: 92 },
    { id: 4, title: 'Civilization Metrics', stability: 'degrading', orbit: 45 },
    { id: 5, title: 'Emergence Patterns', stability: 'stable', orbit: 88 },
  ]);

  return (
    <div className="space-y-3">
      {updates.map((update) => (
        <div 
          key={update.id}
          className="flex items-center gap-4 p-4 rounded-xl bg-[#0a1018] border border-[#6b8cae]/20"
        >
          {/* Orbit */}
          <div className="relative w-14 h-14 flex-shrink-0">
            <svg viewBox="0 0 56 56" className="w-full h-full">
              <ellipse 
                cx="28" 
                cy="28" 
                rx="24" 
                ry="18" 
                fill="none" 
                stroke="#6b8cae" 
                strokeWidth="1"
                opacity="0.3"
              />
              <circle 
                cx={28 + 24 * Math.cos((update.orbit / 100) * Math.PI * 2)}
                cy={28 + 18 * Math.sin((update.orbit / 100) * Math.PI * 2)}
                r="4"
                fill={
                  update.stability === 'stable' ? '#6b8cae' :
                  update.stability === 'adjusting' ? '#c9b037' : '#ff6b35'
                }
              />
            </svg>
          </div>

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-[#8bb0d0]">{update.title}</span>
              <span className={`
                text-[10px] px-1.5 py-0.5 rounded
                ${update.stability === 'stable' ? 'bg-[#6b8cae]/30 text-[#6b8cae]' :
                  update.stability === 'adjusting' ? 'bg-[#c9b037]/30 text-[#c9b037]' :
                  'bg-[#ff6b35]/30 text-[#ff6b35]'
                }
              `}>
                {update.stability.toUpperCase()}
              </span>
            </div>
            <div className="text-xs text-[#6b8cae]/60">
              Orbital stability: {update.orbit}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Main FIELD Site
const FieldSite: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0a1018] text-[#8bb0d0] font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#0a1018]/90 backdrop-blur-xl border-b border-[#6b8cae]/20">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#6b8cae] flex items-center justify-center text-[#0a1018] font-bold text-xl">
              Φ
            </div>
            <div>
              <div className="font-bold text-[#6b8cae]">CIV Worldmodel</div>
              <div className="text-xs text-[#6b8cae]/50">Civilization Intelligence</div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-[#6b8cae]/10 border border-[#6b8cae]/30">
              <Globe className="w-4 h-4" />
              <span className="text-xs">Global View</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative py-16 px-6 overflow-hidden">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(90deg, #6b8cae 1px, transparent 1px),
              linear-gradient(#6b8cae 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px',
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#6b8cae]/10 border border-[#6b8cae]/30 mb-8"
          >
            <Globe className="w-4 h-4 text-[#6b8cae]" />
            <span className="text-sm text-[#6b8cae]">Φ FIELD Ring — Civilization Intelligence</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Worldmodel <span className="text-[#6b8cae]">Intelligence</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-[#8bb0d0]/70 max-w-2xl mx-auto"
          >
            No political borders—only complexity gradients. 
            Thermodynamic heat flows and emergent patterns of global systems.
          </motion.p>
        </div>
      </section>

      {/* Globe + Complexity */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Globe */}
            <div className="p-6 rounded-2xl bg-[#0a1018] border border-[#6b8cae]/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-[#6b8cae]" />
                  <h2 className="font-bold text-[#6b8cae]">Spherical Harmonic Worldmodel</h2>
                </div>
                <div className="text-xs text-[#6b8cae]/50">Live</div>
              </div>
              <SphericalGlobe />
            </div>

            {/* Complexity Metrics */}
            <div className="space-y-4">
              {[
                { name: 'Global Complexity', value: 95, entropy: 78, color: '#6b8cae' },
                { name: 'Regional Systems', value: 82, entropy: 65, color: '#8bb0d0' },
                { name: 'Urban Networks', value: 91, entropy: 88, color: '#c9b037' },
                { name: 'Network Topology', value: 87, entropy: 72, color: '#6b8cae' },
              ].map((metric, i) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-4 rounded-xl bg-[#0a1018] border border-[#6b8cae]/20"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-[#8bb0d0]">{metric.name}</span>
                    <span className="text-xs text-[#6b8cae]/60">Entropy: {metric.entropy}%</span>
                  </div>
                  <div className="h-2 bg-[#0a1018] rounded-full overflow-hidden border border-[#6b8cae]/20">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${metric.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full rounded-full"
                      style={{ backgroundColor: metric.color }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Heat Flow */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#0a1018] border border-[#6b8cae]/20">
            <div className="flex items-center gap-3 mb-4">
              <Wind className="w-5 h-5 text-[#6b8cae]" />
              <h2 className="font-bold text-[#6b8cae]">Thermodynamic Heat Flows</h2>
            </div>
            <HeatFlow />
          </div>
        </div>
      </section>

      {/* Orbital Update Log */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#0a1018] border border-[#6b8cae]/20">
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-5 h-5 text-[#6b8cae]" />
              <h2 className="font-bold text-[#6b8cae]">Worldmodel Update Log</h2>
            </div>
            <p className="text-sm text-[#8bb0d0]/60 mb-6">
              Each entry is a satellite in stable or unstable orbit around the constitutional kernel.
            </p>
            <OrbitalLog />
          </div>
        </div>
      </section>

      {/* Constitutional Floor */}
      <section className="py-8 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#0a1018] border border-[#6b8cae]/20">
            <div className="flex items-center gap-3 mb-4">
              <Layers className="w-5 h-5 text-[#6b8cae]" />
              <h2 className="font-bold text-[#6b8cae]">Constitutional Floor</h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6b8cae]/20 border border-[#6b8cae]">
                <span className="font-bold">F13</span>
                <span className="text-sm text-[#8bb0d0]/70">Sovereign</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#6b8cae] text-[#0a1018]">PRIMARY</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#6b8cae]/10 border border-[#6b8cae]/30">
                <span className="font-bold">F9</span>
                <span className="text-sm text-[#8bb0d0]/70">Anti-Hantu</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#ff6b35]/30 text-[#ff6b35]">ABSOLUTE</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-[#6b8cae]/10">
        <div className="max-w-6xl mx-auto text-center">
          <div className="text-2xl font-bold text-[#6b8cae] mb-2">Ditempa Bukan Diberi</div>
          <div className="text-sm text-[#8bb0d0]/50 mb-4">Forged, Not Given — ΔΩΨ | ARIF</div>
          <div className="text-xs text-[#8bb0d0]/30">
            arifOS v54.1-SEAL • Ω₀ ≈ 0.04 • F13 Sovereign
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FieldSite;
