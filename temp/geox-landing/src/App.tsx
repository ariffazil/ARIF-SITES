// GEOX Earth Witness — Constitutional Geoscience Platform
// Landing Page for MCP Apps
// Authority: 888_APEX → 999_SEAL
// Ω₀: 0.04

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity, Layers, Shield, Zap, Globe, Database,
  Cpu, Eye, Scale, Terminal, ChevronRight, ExternalLink,
  Play, Pause, CheckCircle, AlertCircle, Server,
  Map, BarChart3, Settings, FileCode, Lock,
  Radio, Waves, Mountain, Pickaxe, Target,
  Send, BookOpen, GitBranch, Clock, RefreshCw
} from 'lucide-react';

// ==================== ANIMATED GEOLOGICAL HERO ====================
const GeologicalHero: React.FC = () => {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Deep earth gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a1510] via-[#0f1a12] to-[#1a2520]" />
      
      {/* Animated strata layers */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="strata1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1a3a2a" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#0f2a1a" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="strata2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2a4a3a" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#1a3a2a" stopOpacity="0.4" />
          </linearGradient>
          <linearGradient id="reservoir" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4a7c59" stopOpacity="0" />
            <stop offset="50%" stopColor="#5a9c69" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#4a7c59" stopOpacity="0" />
          </linearGradient>
        </defs>
        
        {/* Animated wave layers */}
        {[...Array(8)].map((_, i) => (
          <motion.path
            key={i}
            d={`M0,${150 + i * 80} Q${250},${120 + i * 80 + Math.sin(i) * 30} ${500},${150 + i * 80} T${1000},${150 + i * 80} T${1500},${150 + i * 80} T${2000},${150 + i * 80} V${800} H0 Z`}
            fill={i % 2 === 0 ? "url(#strata1)" : "url(#strata2)"}
            initial={{ x: -100, opacity: 0 }}
            animate={{ 
              x: 0, 
              opacity: 0.3 + i * 0.05,
            }}
            transition={{ 
              duration: 2, 
              delay: i * 0.15,
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 3
            }}
          />
        ))}
        
        {/* Reservoir glow */}
        <motion.ellipse
          cx="70%"
          cy="60%"
          rx="200"
          ry="80"
          fill="url(#reservoir)"
          animate={{ 
            opacity: [0.3, 0.6, 0.3],
            rx: [180, 220, 180]
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        
        {/* Data flow lines */}
        {[...Array(5)].map((_, i) => (
          <motion.path
            key={`flow-${i}`}
            d={`M${100 + i * 200},800 Q${150 + i * 200},600 ${200 + i * 200},400 T${300 + i * 200},200`}
            stroke="#4a7c59"
            strokeWidth="1"
            fill="none"
            strokeDasharray="5,10"
            animate={{ 
              strokeDashoffset: [0, -30],
              opacity: [0.2, 0.5, 0.2]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity,
              delay: i * 0.5
            }}
          />
        ))}
      </svg>
      
      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-5" style={{
        backgroundImage: `
          linear-gradient(90deg, #4a7c59 1px, transparent 1px),
          linear-gradient(#4a7c59 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px'
      }} />
    </div>
  );
};

// ==================== LIVE STATUS BADGE ====================
const LiveStatus: React.FC = () => {
  const [status, setStatus] = useState<'online' | 'degraded' | 'offline'>('online');
  
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch('https://geox.arif-fazil.com/health', { 
          method: 'HEAD',
          mode: 'no-cors'
        });
        setStatus('online');
      } catch {
        setStatus('offline');
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const colors = {
    online: 'bg-emerald-500',
    degraded: 'bg-amber-500',
    offline: 'bg-red-500'
  };

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10">
      <div className={`w-2 h-2 rounded-full ${colors[status]} animate-pulse`} />
      <span className="text-xs font-mono uppercase tracking-wider text-white/70">
        {status === 'online' ? 'A-FORGE ONLINE' : 'CHECKING...'}
      </span>
    </div>
  );
};

// ==================== CONSTITUTIONAL FLOOR BADGE ====================
const FloorBadge: React.FC<{ floor: string; name: string; active?: boolean }> = ({ 
  floor, name, active = false 
}) => (
  <motion.div 
    whileHover={{ scale: 1.05 }}
    className={`
      flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono
      ${active 
        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' 
        : 'bg-white/5 border-white/10 text-white/50'
      }
    `}
  >
    <span className="font-bold">{floor}</span>
    <span>{name}</span>
    {active && <CheckCircle className="w-3 h-3" />}
  </motion.div>
);

// ==================== MCP TOOL CARD ====================
const ToolCard: React.FC<{
  name: string;
  description: string;
  category: 'foundation' | 'physics' | 'demo' | 'system';
  icon: React.ElementType;
  index: number;
}> = ({ name, description, category, icon: Icon, index }) => {
  const categoryColors = {
    foundation: 'from-emerald-500/20 to-emerald-900/20 border-emerald-500/30',
    physics: 'from-cyan-500/20 to-cyan-900/20 border-cyan-500/30',
    demo: 'from-amber-500/20 to-amber-900/20 border-amber-500/30',
    system: 'from-purple-500/20 to-purple-900/20 border-purple-500/30'
  };

  const categoryLabels = {
    foundation: 'Foundation',
    physics: 'Physics Engine',
    demo: 'Demo',
    system: 'System'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`
        relative p-5 rounded-xl border bg-gradient-to-br ${categoryColors[category]}
        backdrop-blur-sm group cursor-pointer overflow-hidden
      `}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-3">
          <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white/80" />
          </div>
          <span className="text-[10px] uppercase tracking-wider text-white/40 px-2 py-1 rounded bg-white/5">
            {categoryLabels[category]}
          </span>
        </div>
        
        <h3 className="font-mono text-sm text-emerald-400 mb-2">{name}</h3>
        <p className="text-xs text-white/60 leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

// ==================== MALAY BASIN PILOT CARD ====================
const MalayBasinPilot: React.FC = () => {
  const metrics = [
    { label: 'Cumulative Reserves', value: '500+', unit: 'MMBOE' },
    { label: 'Play Types', value: '4', unit: 'Active' },
    { label: 'Wells', value: '50+', unit: 'Analyzed' },
    { label: 'Grounding', value: '92', unit: '%' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="relative p-8 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-900/30 to-black/50 overflow-hidden"
    >
      {/* Background map pattern */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `radial-gradient(circle at 30% 70%, #4a7c59 0%, transparent 50%)`
      }} />
      
      <div className="relative">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Map className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Malay Basin Pilot</h3>
            <p className="text-sm text-white/50">Live Petroleum Exploration Demo</p>
          </div>
          <div className="ml-auto">
            <LiveStatus />
          </div>
        </div>

        <p className="text-white/70 mb-6 max-w-2xl">
          Real-time exploration metrics from the Malay Basin, Malaysia's most prolific 
          petroleum province. Features creaming curve analysis, play type distribution, 
          and constitutional governance verification.
        </p>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {metrics.map((m, i) => (
            <div key={i} className="p-4 rounded-lg bg-black/30 border border-white/10">
              <div className="text-2xl font-bold text-emerald-400">{m.value}</div>
              <div className="text-xs text-white/50">{m.unit}</div>
              <div className="text-[10px] text-white/30 uppercase tracking-wider mt-1">{m.label}</div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <a 
            href="https://geox.arif-fazil.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors"
          >
            <Play className="w-4 h-4" />
            Launch Pilot
          </a>
          <div className="flex items-center gap-2 text-xs text-white/40">
            <Target className="w-4 h-4" />
            <span>5.5°N, 104.5°E</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== CONSTITUTIONAL FLOORS ====================
const ConstitutionalFloors: React.FC = () => {
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
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
      {floors.map((floor, i) => (
        <motion.div
          key={floor.num}
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.03 }}
          viewport={{ once: true }}
          className={`
            p-3 rounded-lg border text-center cursor-pointer transition-all
            ${floor.active 
              ? 'bg-emerald-500/10 border-emerald-500/40 hover:bg-emerald-500/20' 
              : 'bg-white/5 border-white/10 hover:bg-white/10'
            }
          `}
        >
          <div className={`text-lg font-bold ${floor.active ? 'text-emerald-400' : 'text-white/40'}`}>
            {floor.num}
          </div>
          <div className={`text-[10px] uppercase tracking-wider ${floor.active ? 'text-white/70' : 'text-white/30'}`}>
            {floor.name}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// ==================== API ENDPOINT ====================
const ApiEndpoint: React.FC<{
  method: 'GET' | 'POST';
  path: string;
  description: string;
}> = ({ method, path, description }) => (
  <div className="flex items-center gap-4 p-3 rounded-lg bg-black/30 border border-white/10 font-mono text-sm">
    <span className={`
      px-2 py-0.5 rounded text-xs font-bold
      ${method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}
    `}>
      {method}
    </span>
    <span className="text-emerald-300/80">{path}</span>
    <span className="text-white/40 text-xs ml-auto">{description}</span>
  </div>
);

// ==================== MAIN APP ====================
function App() {
  const [activeTab, setActiveTab] = useState<'foundation' | 'physics' | 'demo' | 'system'>('foundation');

  const tools = {
    foundation: [
      { name: 'geox_load_seismic_line', description: 'Visual mode ignition with P wave analysis', icon: Waves },
      { name: 'geox_build_structural_candidates', description: 'Inverse modelling constraints', icon: Layers },
      { name: 'geox_evaluate_prospect', description: 'Governed prospect verdicts (DRO/DRIL/HOLD)', icon: Target },
      { name: 'geox_feasibility_check', description: 'Physical possibility firewall', icon: Shield },
      { name: 'geox_verify_geospatial', description: 'CRS & jurisdiction verification', icon: Globe },
      { name: 'geox_calculate_saturation', description: 'Monte Carlo Sw calculations', icon: BarChart3 },
      { name: 'geox_query_memory', description: 'Geological memory retrieval', icon: Database },
    ],
    physics: [
      { name: 'geox_select_sw_model', description: 'SW model admissibility from log QC', icon: Settings },
      { name: 'geox_compute_petrophysics', description: 'Full petrophysics property pipeline', icon: Cpu },
      { name: 'geox_validate_cutoffs', description: 'Apply CutoffPolicy schema', icon: Scale },
      { name: 'geox_petrophysical_hold_check', description: 'Trigger 888_HOLD on violations', icon: AlertCircle },
    ],
    demo: [
      { name: 'geox_malay_basin_pilot', description: 'Malay Basin petroleum exploration data', icon: Map },
    ],
    system: [
      { name: 'geox_health', description: 'Server health & constitutional status', icon: Activity },
    ]
  };

  return (
    <div className="min-h-screen bg-[#0a1510] text-white font-sans overflow-x-hidden">
      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex flex-col">
        <GeologicalHero />
        
        {/* Navigation */}
        <nav className="relative z-10 px-6 py-4 flex items-center justify-between border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <Mountain className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="font-bold text-white">GEOX</div>
              <div className="text-[10px] text-white/50 uppercase tracking-wider">Earth Witness</div>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <a href="#tools" className="text-white/60 hover:text-white transition-colors">Tools</a>
            <a href="#pilot" className="text-white/60 hover:text-white transition-colors">Pilot</a>
            <a href="#constitution" className="text-white/60 hover:text-white transition-colors">Constitution</a>
            <a href="#api" className="text-white/60 hover:text-white transition-colors">API</a>
            <LiveStatus />
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-10 flex-1 flex items-center justify-center px-6 py-20">
          <div className="max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 mb-8">
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span className="text-sm text-emerald-400">Constitutional Geoscience Platform v0.6.1</span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                <span className="text-white">GEOX</span>
                <span className="block text-emerald-400">Earth Witness</span>
              </h1>

              <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
                Governed, agentic geological intelligence coprocessor. 
                Multi-agent architecture with tri-witness consensus for verified interpretations.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
                <a 
                  href="https://geox.arif-fazil.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 text-black font-medium hover:bg-emerald-400 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Launch Platform
                </a>
                <a 
                  href="https://github.com/ariffazil/GEOX"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 rounded-lg border border-white/20 text-white hover:bg-white/5 transition-colors"
                >
                  <GitBranch className="w-4 h-4" />
                  View Source
                </a>
              </div>

              {/* Trinity Ring Indicator */}
              <div className="flex items-center justify-center gap-8">
                {[
                  { symbol: 'Ψ', name: 'SOUL', url: 'https://arif-fazil.com', active: false },
                  { symbol: 'Ω', name: 'MIND', url: 'https://arifos.arif-fazil.com', active: false },
                  { symbol: 'Δ', name: 'BODY', url: 'https://arifosmcp.arif-fazil.com', active: false },
                  { symbol: 'Ξ', name: 'GEOX', url: '#', active: true },
                ].map((ring, i) => (
                  <a
                    key={ring.symbol}
                    href={ring.url}
                    className={`flex flex-col items-center gap-2 transition-opacity ${ring.active ? '' : 'opacity-50 hover:opacity-80'}`}
                  >
                    <div className={`
                      w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold
                      ${ring.active 
                        ? 'bg-emerald-500 text-black' 
                        : 'bg-white/10 text-white/60'
                      }
                    `}>
                      {ring.symbol}
                    </div>
                    <span className="text-xs text-white/40">{ring.name}</span>
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="relative z-10 pb-8 text-center text-white/30"
        >
          <ChevronRight className="w-6 h-6 mx-auto rotate-90" />
        </motion.div>
      </section>

      {/* ==================== MALAY BASIN PILOT ==================== */}
      <section id="pilot" className="py-24 px-6 bg-gradient-to-b from-[#0a1510] to-[#0f1a14]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6">
              <Target className="w-4 h-4 text-amber-400" />
              <span className="text-sm text-amber-400">Live Demo</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Malay Basin <span className="text-emerald-400">Pilot</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Full-stack petroleum exploration demonstration with real-time metrics 
              and constitutional governance verification.
            </p>
          </motion.div>

          <MalayBasinPilot />
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
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 mb-6">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span className="text-sm text-cyan-400">13 MCP Tools Available</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Constitutional <span className="text-emerald-400">Tool Suite</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              Host-agnostic geological intelligence tools accessible via FastMCP, 
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
                  px-4 py-2 rounded-lg text-sm font-medium transition-all
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
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/30 mb-6">
              <Shield className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-400">13-Floor Governance</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Constitutional <span className="text-emerald-400">Floors</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto">
              All GEOX operations are governed by 13 constitutional floors. 
              <span className="text-emerald-400"> 888_HOLD</span> triggers on any violation.
            </p>
          </motion.div>

          <ConstitutionalFloors />

          <div className="mt-8 p-6 rounded-xl bg-red-500/10 border border-red-500/30">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400" />
              <span className="font-mono text-red-400">888_HOLD</span>
              <span className="text-white/60 text-sm">
                Emergency safety veto — triggers on any floor violation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ARCHITECTURE ==================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/30 mb-6">
              <Layers className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-400">Host-Agnostic Design</span>
            </div>
            <h2 className="text-4xl font-bold mb-4">
              Three-Layer <span className="text-emerald-400">Architecture</span>
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { 
                title: 'Host Platforms', 
                items: ['Claude Desktop', 'Copilot Studio', 'Custom MCP Client', 'FastMCP Horizon'],
                color: 'from-blue-500/20 to-blue-900/20 border-blue-500/30'
              },
              { 
                title: 'Transport Adapters', 
                items: ['FastMCP (SSE/HTTP)', 'Copilot (Teams/365)', 'OpenAI (planned)'],
                color: 'from-purple-500/20 to-purple-900/20 border-purple-500/30'
              },
              { 
                title: 'Core Domain', 
                items: ['Tool Logic (12+ tools)', 'Type Contracts', 'App Manifest', 'Constitutional Services'],
                color: 'from-emerald-500/20 to-emerald-900/20 border-emerald-500/30'
              },
            ].map((layer, i) => (
              <motion.div
                key={layer.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className={`p-6 rounded-xl border bg-gradient-to-br ${layer.color}`}
              >
                <h3 className="font-bold text-white mb-4">{layer.title}</h3>
                <ul className="space-y-2">
                  {layer.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-white/60">
                      <ChevronRight className="w-4 h-4 text-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== API DOCUMENTATION ==================== */}
      <section id="api" className="py-24 px-6 bg-gradient-to-b from-[#0a1510] to-[#0f1a14]">
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
            <h2 className="text-4xl font-bold mb-4">
              Connect to <span className="text-emerald-400">GEOX</span>
            </h2>
          </motion.div>

          <div className="space-y-4 mb-8">
            <ApiEndpoint method="GET" path="/health" description="Server health check" />
            <ApiEndpoint method="GET" path="/api/v1/vitals" description="Live system metrics" />
            <ApiEndpoint method="GET" path="/api/v1/tools" description="List available tools" />
            <ApiEndpoint method="POST" path="/api/v1/tools/{name}" description="Execute MCP tool" />
            <ApiEndpoint method="GET" path="/mcp" description="MCP SSE endpoint" />
          </div>

          <div className="p-6 rounded-xl bg-black/40 border border-white/10">
            <div className="flex items-center gap-2 mb-4">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-white/60">Claude Desktop Config</span>
            </div>
            <pre className="text-xs text-emerald-300/80 overflow-x-auto">
{`{
  "mcpServers": {
    "geox": {
      "command": "fastmcp",
      "args": ["run", "https://geox.arif-fazil.com/mcp"]
    }
  }
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 px-6 border-t border-white/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
                <Mountain className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="font-bold text-white">GEOX</div>
                <div className="text-[10px] text-white/50">Earth Witness v0.6.1</div>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-white/40">
              <a href="https://arif-fazil.com" className="hover:text-white transition-colors">arif-fazil.com</a>
              <a href="https://arifos.arif-fazil.com" className="hover:text-white transition-colors">arifOS</a>
              <a href="https://wiki.arif-fazil.com" className="hover:text-white transition-colors">Ω-Wiki</a>
              <a href="https://github.com/ariffazil/GEOX" className="hover:text-white transition-colors">GitHub</a>
            </div>

            <div className="text-center md:text-right">
              <div className="text-lg font-bold text-emerald-400">Ditempa Bukan Diberi</div>
              <div className="text-xs text-white/40">Forged, Not Given — ΔΩΞ | ARIF</div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center text-xs text-white/30">
            Constitutional Version: arifOS v54.1-SEAL • Ω₀ ≈ 0.04 • AGPL-3.0 License
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

