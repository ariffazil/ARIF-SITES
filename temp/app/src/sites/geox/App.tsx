// GEOX Earth Witness — AGI-Level Geological Intelligence Platform
// Constitutional Geoscience with 3D Earth Visualization
// Authority: 888_APEX → 999_SEAL
// Ω₀: 0.04

import React, { useState, useEffect, useRef, Suspense } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';
import {
  Activity, Layers, Shield, Globe, Database, Cpu, Scale, Terminal,
  Play, CheckCircle, AlertCircle, Map, BarChart3,
  Settings, FileCode, Waves, Mountain, Target, GitBranch,
  RefreshCw, ChevronDown, Sparkles, Droplets
} from 'lucide-react';

// ==================== 3D EARTH VISUALIZATION ====================
const GeologicalEarth: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.05;
    }
  });

  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} color="#4a7c59" intensity={0.5} />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <mesh
        ref={meshRef}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        scale={hovered ? 1.05 : 1}
      >
        <sphereGeometry args={[2, 128, 128]} />
        <MeshDistortMaterial
          color="#1a3a2a"
          emissive="#0f2a1a"
          emissiveIntensity={0.3}
          roughness={0.8}
          metalness={0.2}
          distort={0.15}
          speed={2}
        />
      </mesh>
      
      {/* Inner Core Glow */}
      <mesh scale={1.8}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial
          color="#4a7c59"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>
      
      {/* Data Points - Reservoir Locations */}
      {[
        { lat: 5.5, lon: 104.5, size: 0.08 }, // Malay Basin
        { lat: 4.2, lon: 114.0, size: 0.06 }, // Sabah Basin
        { lat: 3.0, lon: 103.0, size: 0.05 }, // PM302
        { lat: 6.0, lon: 102.5, size: 0.04 }, // PM311
      ].map((point, i) => {
        const phi = (90 - point.lat) * (Math.PI / 180);
        const theta = (point.lon + 180) * (Math.PI / 180);
        const x = -(2.1 * Math.sin(phi) * Math.cos(theta));
        const z = 2.1 * Math.sin(phi) * Math.sin(theta);
        const y = 2.1 * Math.cos(phi);
        
        return (
          <mesh key={i} position={[x, y, z]}>
            <sphereGeometry args={[point.size, 16, 16]} />
            <meshBasicMaterial color="#5a9c69" />
          </mesh>
        );
      })}
      
      <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

// ==================== SEISMIC WAVE ANIMATION ====================
const SeismicWave: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * 2;
    canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    let time = 0;
    let animationId: number;

    const draw = () => {
      const w = canvas.offsetWidth;
      const h = canvas.offsetHeight;
      
      ctx.fillStyle = 'rgba(10, 21, 16, 0.1)';
      ctx.fillRect(0, 0, w, h);

      // Draw multiple seismic traces
      for (let trace = 0; trace < 5; trace++) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(74, 124, 89, ${0.3 + trace * 0.1})`;
        ctx.lineWidth = 1.5;

        for (let x = 0; x < w; x++) {
          const frequency = 0.02 + trace * 0.005;
          const amplitude = 20 + trace * 10;
          const phase = time * 0.05 + trace * 0.5;
          const y = h / 2 + Math.sin(x * frequency + phase) * amplitude * Math.exp(-x / w * 2);
          
          if (x === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      time++;
      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return <canvas ref={canvasRef} className="w-full h-32" />;
};

// ==================== WELL LOG VISUALIZATION ====================
const WellLogDisplay: React.FC = () => {
  const tracks = [
    { name: 'GR', color: '#4a7c59', unit: 'API', max: 150 },
    { name: 'RHOB', color: '#5a9c69', unit: 'g/cc', max: 2.7 },
    { name: 'NPHI', color: '#6abc79', unit: 'v/v', max: 0.45 },
    { name: 'RT', color: '#8cdc99', unit: 'ohmm', max: 100 },
  ];

  return (
    <div className="flex gap-1 h-64 bg-black/40 rounded-lg overflow-hidden border border-emerald-500/20">
      {tracks.map((track, i) => (
        <div key={i} className="flex-1 relative border-r border-emerald-500/10 last:border-r-0">
          {/* Header */}
          <div className="absolute top-0 left-0 right-0 p-2 bg-emerald-500/10 border-b border-emerald-500/20">
            <div className="text-xs font-bold text-emerald-400">{track.name}</div>
            <div className="text-[10px] text-emerald-400/60">{track.unit}</div>
          </div>
          
          {/* Log Curve Animation */}
          <svg className="absolute inset-0 pt-10" viewBox="0 0 100 200" preserveAspectRatio="none">
            <motion.path
              d={`M50,0 ${Array.from({ length: 20 }, (_, j) => {
                const y = j * 10;
                const x = 50 + Math.sin(j * 0.5 + i) * 30 + Math.random() * 10;
                return `L${Math.max(5, Math.min(95, x))},${y}`;
              }).join(' ')}`}
              fill="none"
              stroke={track.color}
              strokeWidth="2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
            />
          </svg>
          
          {/* Grid Lines */}
          {Array.from({ length: 5 }, (_, j) => (
            <div
              key={j}
              className="absolute w-full border-t border-emerald-500/10"
              style={{ top: `${20 + j * 20}%` }}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

// ==================== LIVE METRICS DASHBOARD ====================
const LiveMetrics: React.FC = () => {
  const metrics = [
    { label: 'Grounding', value: 92, unit: '%', icon: Target, iconColor: 'text-emerald-400', barColor: 'bg-emerald-400' },
    { label: 'Confidence', value: 0.87, unit: 'σ', icon: Shield, iconColor: 'text-cyan-400', barColor: 'bg-cyan-400' },
    { label: 'Entropy', value: 0.04, unit: 'bits', icon: Activity, iconColor: 'text-amber-400', barColor: 'bg-amber-400' },
    { label: 'Reversibility', value: 99.9, unit: '%', icon: RefreshCw, iconColor: 'text-purple-400', barColor: 'bg-purple-400' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {metrics.map((metric, i) => (
        <motion.div
          key={metric.label}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="p-4 rounded-xl bg-black/40 border border-emerald-500/20 backdrop-blur-sm"
        >
          <div className="flex items-center gap-2 mb-2">
            <metric.icon className={`w-4 h-4 ${metric.iconColor}`} />
            <span className="text-xs text-white/50 uppercase tracking-wider">{metric.label}</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{metric.value}</span>
            <span className="text-xs text-white/40">{metric.unit}</span>
          </div>
          <div className="mt-2 h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className={`h-full ${metric.barColor}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${Math.min(100, metric.value)}%` }}
              transition={{ duration: 1, delay: i * 0.2 }}
              viewport={{ once: true }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ==================== MCP TOOL CARD ====================
const ToolCard: React.FC<{
  name: string;
  description: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  index: number;
}> = ({ name, description, category, icon: Icon, index }) => {
  const categoryColors: Record<string, string> = {
    foundation: 'from-emerald-500/20 to-emerald-900/20 border-emerald-500/30',
    physics: 'from-cyan-500/20 to-cyan-900/20 border-cyan-500/30',
    demo: 'from-amber-500/20 to-amber-900/20 border-amber-500/30',
    system: 'from-purple-500/20 to-purple-900/20 border-purple-500/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, scale: 1.02 }}
      className={`
        relative p-5 rounded-xl border bg-gradient-to-br ${categoryColors[category] || categoryColors.foundation}
        backdrop-blur-sm cursor-pointer group overflow-hidden
      `}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
            <Icon className="w-5 h-5 text-emerald-400" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-white/40 px-2 py-1 rounded bg-white/5">
            {category}
          </span>
        </div>
        
        <h3 className="font-mono text-sm text-emerald-400 mb-2">{name}</h3>
        <p className="text-xs text-white/60 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

// ==================== CONSTITUTIONAL FLOOR ====================
const ConstitutionalFloor: React.FC<{
  num: string;
  name: string;
  desc: string;
  active: boolean;
  index: number;
}> = ({ num, name, desc, active, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      viewport={{ once: true }}
      className={`
        flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all
        ${active 
          ? 'bg-emerald-500/10 border-emerald-500/40' 
          : 'bg-white/5 border-white/10 hover:bg-white/10'
        }
      `}
    >
      <div className={`
        w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm
        ${active ? 'bg-emerald-500 text-black' : 'bg-white/10 text-white/40'}
      `}>
        {num}
      </div>
      <div className="flex-1">
        <div className={`font-medium ${active ? 'text-white' : 'text-white/60'}`}>{name}</div>
        <div className="text-xs text-white/40">{desc}</div>
      </div>
      {active && <CheckCircle className="w-4 h-4 text-emerald-400" />}
    </motion.div>
  );
};

// ==================== MAIN APP ====================
function App() {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);
  
  const [activeTab, setActiveTab] = useState<'foundation' | 'physics' | 'demo' | 'system'>('foundation');
  const isConnected = true;

  const tools = {
    foundation: [
      { name: 'geox_load_seismic_line', description: 'Visual mode ignition with P wave analysis and velocity modeling', icon: Waves },
      { name: 'geox_build_structural_candidates', description: 'Inverse modelling constraints for structural interpretation', icon: Mountain },
      { name: 'geox_evaluate_prospect', description: 'Governed prospect verdicts: DRO/DRIL/HOLD with confidence caps', icon: Target },
      { name: 'geox_feasibility_check', description: 'Physical possibility firewall against impossible scenarios', icon: Shield },
      { name: 'geox_verify_geospatial', description: 'CRS & jurisdiction verification for coordinate integrity', icon: Globe },
      { name: 'geox_calculate_saturation', description: 'Monte Carlo Sw calculations with uncertainty quantification', icon: BarChart3 },
      { name: 'geox_query_memory', description: 'Geological memory retrieval from vector database', icon: Database },
    ],
    physics: [
      { name: 'geox_select_sw_model', description: 'SW model admissibility from log QC and core analysis', icon: Settings },
      { name: 'geox_compute_petrophysics', description: 'Full petrophysics property pipeline with cutoffs', icon: Cpu },
      { name: 'geox_validate_cutoffs', description: 'Apply CutoffPolicy schema with F7 confidence caps', icon: Scale },
      { name: 'geox_petrophysical_hold_check', description: 'Trigger 888_HOLD on constitutional violations', icon: AlertCircle },
    ],
    demo: [
      { name: 'geox_malay_basin_pilot', description: 'Malay Basin petroleum exploration with live metrics', icon: Map },
    ],
    system: [
      { name: 'geox_health', description: 'Server health & constitutional status monitoring', icon: Activity },
    ]
  };

  const floors = [
    { num: 'F1', name: 'AMANAH', desc: 'Reversible, audited operations', active: true },
    { num: 'F2', name: 'TRUTH', desc: 'Verdict-based outputs', active: true },
    { num: 'F3', name: 'TRI-WITNESS', desc: 'Human × AI × System consensus', active: true },
    { num: 'F4', name: 'CLARITY', desc: 'Zero entropy decisions', active: true },
    { num: 'F5', name: 'PEACE', desc: 'Non-adversarial reasoning', active: false },
    { num: 'F6', name: 'EMPATHY', desc: 'Care envelope', active: false },
    { num: 'F7', name: 'HUMILITY', desc: 'Confidence caps at 0.90', active: true },
    { num: 'F8', name: 'GENIUS', desc: 'Multiplicative wisdom', active: false },
    { num: 'F9', name: 'ANTI-HANTU', desc: 'Ghost pattern detection', active: true },
    { num: 'F10', name: 'ONTOLOGY', desc: 'Knowledge graph grounded', active: false },
    { num: 'F11', name: 'AUDIT', desc: 'Transaction logging', active: true },
    { num: 'F12', name: 'INJECTION', desc: 'Input sanitization', active: false },
    { num: 'F13', name: 'SOVEREIGN', desc: 'Human emergency override', active: true },
  ];

  return (
    <div className="min-h-screen bg-[#0a1510] text-white font-sans overflow-x-hidden">
      {/* ==================== HERO SECTION WITH 3D EARTH ==================== */}
      <section className="relative h-screen">
        {/* 3D Canvas */}
        <div className="absolute inset-0">
          <Canvas camera={{ position: [0, 0, 6], fov: 45 }}>
            <Suspense fallback={null}>
              <GeologicalEarth />
            </Suspense>
          </Canvas>
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1510]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a1510]/80 via-transparent to-[#0a1510]/80" />

        {/* Navigation */}
        <nav className="absolute top-0 left-0 right-0 z-20 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center backdrop-blur-sm">
              <Mountain className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-white">GEOX</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Earth Witness</div>
            </div>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <a href="#tools" className="text-white/60 hover:text-white transition-colors">Tools</a>
            <a href="#metrics" className="text-white/60 hover:text-white transition-colors">Metrics</a>
            <a href="#constitution" className="text-white/60 hover:text-white transition-colors">Constitution</a>
            <a href="#api" className="text-white/60 hover:text-white transition-colors">API</a>
            
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-emerald-500/30 backdrop-blur-sm">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-xs font-mono uppercase tracking-wider text-white/70">
                {isConnected ? 'A-FORGE ONLINE' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="text-center max-w-4xl px-6">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8 backdrop-blur-sm">
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400">Constitutional Geoscience Platform v0.6.1</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
                <span className="text-white">GEOX</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  Earth Witness
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/60 mb-8 max-w-2xl mx-auto">
                Governed, agentic geological intelligence coprocessor.
                <br />
                <span className="text-emerald-400">13 MCP tools</span> with tri-witness consensus.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4">
                <a 
                  href="https://geox.arif-fazil.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl bg-emerald-500 text-black font-bold hover:bg-emerald-400 transition-all hover:scale-105"
                >
                  <Play className="w-5 h-5" />
                  Launch Platform
                </a>
                <a 
                  href="https://github.com/ariffazil/GEOX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl border border-white/20 text-white hover:bg-white/5 transition-all"
                >
                  <GitBranch className="w-5 h-5" />
                  View Source
                </a>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <ChevronDown className="w-8 h-8 text-white/30" />
        </motion.div>
      </section>

      {/* ==================== SEISMIC WAVE SECTION ==================== */}
      <section className="py-16 px-6 border-y border-emerald-500/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-white/50 uppercase tracking-wider">Live Seismic Telemetry</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/40">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Real-time P-wave analysis
            </div>
          </div>
          <SeismicWave />
        </div>
      </section>

      {/* ==================== MALAY BASIN DASHBOARD ==================== */}
      <section id="metrics" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Target className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400">Malay Basin Pilot</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Live <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400">Exploration Metrics</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Real-time petroleum exploration data from Malaysia's most prolific basin.
              Constitutional governance with 92% grounding.
            </p>
          </motion.div>

          {/* Metrics Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Cumulative Reserves', value: '500+', unit: 'MMBOE', icon: Droplets, color: 'text-cyan-400' },
              { label: 'Active Play Types', value: '4', unit: 'Types', icon: Layers, color: 'text-emerald-400' },
              { label: 'Wells Analyzed', value: '50+', unit: 'Wells', icon: Target, color: 'text-amber-400' },
              { label: 'Constitutional Grounding', value: '92', unit: '%', icon: Shield, color: 'text-purple-400' },
            ].map((metric, i) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-sm"
              >
                <div className={`w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4`}>
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
                <div className="text-4xl font-bold text-white mb-1">{metric.value}</div>
                <div className="text-sm text-white/50">{metric.unit}</div>
                <div className="text-xs text-white/30 uppercase tracking-wider mt-2">{metric.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Live Metrics */}
          <LiveMetrics />
        </div>
      </section>

      {/* ==================== WELL LOG VISUALIZATION ==================== */}
      <section className="py-24 px-6 bg-gradient-to-b from-[#0a1510] to-[#0f1a14]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
              <BarChart3 className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">Well Log Analysis</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Multi-Track <span className="text-cyan-400">Log Display</span>
            </h2>
          </motion.div>

          <WellLogDisplay />
          
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/40">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-500/50" />
              <span>GR (Gamma Ray)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-400/50" />
              <span>RHOB (Density)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-300/50" />
              <span>NPHI (Porosity)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-emerald-200/50" />
              <span>RT (Resistivity)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MCP TOOLS ==================== */}
      <section id="tools" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
              <Terminal className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">13 MCP Tools Available</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Constitutional <span className="text-purple-400">Tool Suite</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Host-agnostic geological intelligence accessible via FastMCP, 
              Claude Desktop, or any MCP-compatible client.
            </p>
          </motion.div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {(['foundation', 'physics', 'demo', 'system'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`
                  px-6 py-3 rounded-xl text-sm font-medium transition-all
                  ${activeTab === cat 
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' 
                    : 'bg-white/5 text-white/50 border border-transparent hover:bg-white/10'
                  }
                `}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>

          {/* Tools Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <AnimatePresence mode="wait">
              {tools[activeTab].map((tool, i) => (
                <ToolCard
                  key={tool.name}
                  name={tool.name}
                  description={tool.description}
                  category={activeTab}
                  icon={tool.icon}
                  index={i}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* ==================== CONSTITUTIONAL FLOORS ==================== */}
      <section id="constitution" className="py-24 px-6 bg-gradient-to-b from-[#0f1a14] to-[#0a1510]">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-sm text-red-400">13-Floor Governance</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Constitutional <span className="text-emerald-400">Floors</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              All GEOX operations are governed by 13 constitutional floors.
              <span className="text-red-400 font-bold"> 888_HOLD</span> triggers on any violation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-3">
            {floors.map((floor, i) => (
              <ConstitutionalFloor
                key={floor.num}
                num={floor.num}
                name={floor.name}
                desc={floor.desc}
                active={floor.active}
                index={i}
              />
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-8 p-6 rounded-2xl bg-red-500/10 border border-red-500/30"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <div className="font-mono text-lg text-red-400 font-bold">888_HOLD</div>
                <div className="text-white/60">
                  Emergency safety veto — triggers on any constitutional floor violation
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== API DOCUMENTATION ==================== */}
      <section id="api" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/30 mb-6">
              <FileCode className="w-4 h-4 text-orange-400" />
              <span className="text-sm text-orange-400">API Reference</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Connect to <span className="text-orange-400">GEOX</span>
            </h2>
          </motion.div>

          <div className="space-y-3 mb-8">
            {[
              { method: 'GET', path: '/health', desc: 'Server health check' },
              { method: 'GET', path: '/api/v1/vitals', desc: 'Live system metrics' },
              { method: 'GET', path: '/api/v1/tools', desc: 'List available tools' },
              { method: 'POST', path: '/api/v1/tools/{name}', desc: 'Execute MCP tool' },
              { method: 'GET', path: '/mcp', desc: 'MCP SSE endpoint' },
            ].map((endpoint, i) => (
              <motion.div
                key={endpoint.path}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="flex items-center gap-4 p-4 rounded-xl bg-black/40 border border-white/10 font-mono"
              >
                <span className={`
                  px-3 py-1 rounded text-xs font-bold
                  ${endpoint.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}
                `}>
                  {endpoint.method}
                </span>
                <span className="text-emerald-300">{endpoint.path}</span>
                <span className="text-white/40 text-sm ml-auto">{endpoint.desc}</span>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-2xl bg-black/60 border border-emerald-500/20"
          >
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-5 h-5 text-emerald-400" />
              <span className="text-sm text-white/60">Claude Desktop Configuration</span>
            </div>
            <pre className="text-sm text-emerald-300/80 overflow-x-auto bg-black/40 p-4 rounded-lg">
{`{
  "mcpServers": {
    "geox": {
      "command": "fastmcp",
      "args": ["run", "https://geox.arif-fazil.com/mcp"]
    }
  }
}`}
            </pre>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-16 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Mountain className="w-7 h-7 text-emerald-400" />
              </div>
              <div>
                <div className="text-2xl font-bold text-white">GEOX</div>
                <div className="text-sm text-white/50">Earth Witness v0.6.1</div>
              </div>
            </div>

            <div className="flex items-center gap-8 text-sm">
              <a href="https://arif-fazil.com" className="text-white/40 hover:text-white transition-colors">arif-fazil.com</a>
              <a href="https://arifos.arif-fazil.com" className="text-white/40 hover:text-white transition-colors">arifOS</a>
              <a href="https://wiki.arif-fazil.com" className="text-white/40 hover:text-white transition-colors">Ω-Wiki</a>
              <a href="https://github.com/ariffazil/GEOX" className="text-white/40 hover:text-white transition-colors">GitHub</a>
            </div>

            <div className="text-center md:text-right">
              <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Ditempa Bukan Diberi
              </div>
              <div className="text-sm text-white/40">Forged, Not Given — ΔΩΞ | ARIF</div>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 text-center text-xs text-white/30">
            Constitutional Version: arifOS v54.1-SEAL • Ω₀ ≈ 0.04 • AGPL-3.0 License
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

