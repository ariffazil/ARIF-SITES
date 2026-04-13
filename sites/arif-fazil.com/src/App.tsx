// SOUL Ring - arif-fazil.com
// THEORY OF ANOMALOUS CONTRAST - v4.0
// Blood Red + Earth Tones · Igneous · Strata · Human Sovereignty

import React, { useState, useEffect, useRef } from 'react';
import { Target, ChevronDown, ExternalLink } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import tokens from '@/constitution/tokens';

// ==================== ANOMALOUS COLOR SYSTEM (SOUL) ====================
// Blood Red + Earth Tones — Human Life, Igneous Core, Gold Sovereignty
// Toned down for reduced eye strain while maintaining identity
const SOUL = {
  blood: '#6B2020',      // Primary - Muted blood red, life
  arterial: '#8B3030',   // Secondary - Softer arterial red
  gold: '#B8962E',       // Accent - Muted gold, F13 sovereignty
  earth: '#5A3D25',      // Earth brown - grounding, strata
  terracotta: '#A06035', // Terracotta - clay, human craft
  ochre: '#A07840',      // Ochre - discovery, fossil
  void: '#0F0D0D',       // Background - soft dark (reduced contrast)
  text: '#D8D0D0',      // Primary text - soft warm gray
  dim: '#6B6B6B',        // Secondary text - muted
} as const;

// ==================== FRACTAL BIOLOGICAL CLOCK ====================
const AgeClock: React.FC = () => {
  const [age, setAge] = useState<string>('');
  const [pulsePhase, setPulsePhase] = useState(0);
  
  useEffect(() => {
    const birthDate = new Date(tokens.identity.birthdate);
    const updateAge = () => {
      const now = new Date();
      const diff = now.getTime() - birthDate.getTime();
      const ageInYears = diff / (1000 * 60 * 60 * 24 * 365.25);
      setAge(ageInYears.toFixed(9));
    };
    updateAge();
    const interval = setInterval(updateAge, 50);
    return () => clearInterval(interval);
  }, []);

  // Fractal pulse animation
  useEffect(() => {
    let t = 0;
    const animate = () => {
      t += 0.05;
      setPulsePhase(Math.sin(t) * 0.5 + 0.5);
      requestAnimationFrame(animate);
    };
    animate();
  }, []);

  return (
    <div 
      className="font-mono text-xs tracking-[0.2em] uppercase px-5 py-2 relative overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${SOUL.blood}20 0%, ${SOUL.earth}15 50%, ${SOUL.gold}08 100%)`,
        border: `1px solid ${SOUL.blood}`,
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
      }}
    >
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${30 + pulsePhase * 40}% ${50 + Math.sin(pulsePhase * Math.PI) * 20}%, ${SOUL.arterial}25 0%, transparent 50%)`,
        }}
      />
      <div className="relative flex items-center gap-3">
        <div 
          className="w-2 h-2"
          style={{
            background: SOUL.gold,
            clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            transform: `scale(${0.8 + pulsePhase * 0.4})`,
            transition: 'transform 0.1s ease-out',
            boxShadow: `0 0 ${8 + pulsePhase * 8}px ${SOUL.gold}`,
          }}
        />
        <span style={{ color: SOUL.text }}>{age}</span>
        <span style={{ color: SOUL.dim, fontSize: '0.7em' }}>YEARS</span>
      </div>
    </div>
  );
};

// ==================== JAGGED STRATIGRAPHIC CANVAS ====================
const FractalStrata: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    let time = 0;
    let animationId: number;

    // Fractal noise function
    const noise = (x: number, y: number, t: number) => {
      return Math.sin(x * 0.01 + t) * Math.cos(y * 0.01 + t * 0.5) * 0.5 +
             Math.sin(x * 0.02 - t * 0.3) * 0.25 +
             Math.cos(y * 0.015 + t * 0.7) * 0.25;
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      // Deep void background - blood black
      ctx.fillStyle = SOUL.void;
      ctx.fillRect(0, 0, w, h);

      // Anomalous color layers - jagged fractal strata (Earth tones)
      const layers = [
        { color: SOUL.blood, amp: 80, freq: 0.008, speed: 0.001, yOffset: 0.3, alpha: 0.25 },
        { color: SOUL.earth, amp: 60, freq: 0.012, speed: 0.0008, yOffset: 0.5, alpha: 0.18 },
        { color: SOUL.terracotta, amp: 40, freq: 0.015, speed: 0.0012, yOffset: 0.7, alpha: 0.12 },
        { color: SOUL.ochre, amp: 100, freq: 0.006, speed: 0.0005, yOffset: 0.4, alpha: 0.08 },
      ];

      layers.forEach((layer, idx) => {
        ctx.beginPath();
        const yBase = h * layer.yOffset;
        
        // Jagged fractal path
        ctx.moveTo(0, h);
        
        for (let x = 0; x <= w; x += 5) {
          const n = noise(x, yBase, time * layer.speed);
          const jagged = Math.sin(x * layer.freq * 3 + time * layer.speed * 2) * 20 * (idx % 2 === 0 ? 1 : -1);
          const y = yBase + n * layer.amp + jagged;
          ctx.lineTo(x, y);
        }
        
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        
        ctx.fillStyle = layer.color;
        ctx.globalAlpha = layer.alpha;
        ctx.fill();
      });

      // Fractal drift particles - earth tones with gold
      ctx.globalAlpha = 0.6;
      for (let i = 0; i < 50; i++) {
        const x = (Math.sin(i * 137.5 + time * 0.001) * 0.5 + 0.5) * w;
        const y = (Math.cos(i * 73.3 + time * 0.0008) * 0.5 + 0.5) * h;
        const size = (Math.sin(i + time * 0.01) + 1) * 1.5;
        
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        // Cycle through: blood, earth, gold
        ctx.fillStyle = i % 3 === 0 ? SOUL.blood : (i % 3 === 1 ? SOUL.earth : SOUL.gold);
        ctx.fill();
      }

      time++;
      animationId = requestAnimationFrame(draw);
    };
    
    draw();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.8 }}
    />
  );
};

// ==================== JAGGED BUTTON COMPONENT ====================
const JaggedButton: React.FC<{ 
  children: React.ReactNode; 
  href?: string; 
  variant?: 'solid' | 'outline' | 'ghost';
  onClick?: () => void;
}> = ({ children, href, variant = 'solid', onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const getClipPath = () => {
    const jitter = isHovered ? 2 : 0;
    return `polygon(
      0 ${4 + jitter}px, 
      ${4 + jitter}px 0, 
      calc(100% - ${8 - jitter}px) 0, 
      100% ${8 - jitter}px, 
      100% calc(100% - ${4 + jitter}px), 
      calc(100% - ${4 + jitter}px) 100%, 
      ${8 - jitter}px 100%, 
      0 calc(100% - ${8 - jitter}px)
    )`;
  };

  const variants = {
    solid: {
      bg: isHovered 
        ? `linear-gradient(135deg, ${SOUL.blood} 0%, ${SOUL.earth} 100%)`
        : SOUL.blood,
      color: '#000',
      border: 'none',
    },
    outline: {
      bg: isHovered ? `${SOUL.blood}15` : 'transparent',
      color: SOUL.blood,
      border: `2px solid ${SOUL.blood}`,
    },
    ghost: {
      bg: 'transparent',
      color: SOUL.dim,
      border: 'none',
    },
  };

  const style = variants[variant];
  
  const ButtonContent = (
    <span
      className="px-8 py-4 text-xs font-bold tracking-[0.25em] uppercase transition-all duration-200 flex items-center gap-3 relative overflow-hidden"
      style={{
        background: style.bg,
        color: style.color,
        border: variant === 'outline' ? style.border : undefined,
        clipPath: getClipPath(),
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {isHovered && variant === 'solid' && (
        <span 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent 0%, ${SOUL.gold}40 50%, transparent 100%)`,
            transform: 'translateX(-100%)',
            animation: 'shimmer 0.6s ease-out',
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </span>
  );

  if (href) {
    return <a href={href} className="inline-block">{ButtonContent}</a>;
  }
  return <button onClick={onClick} className="inline-block">{ButtonContent}</button>;
};

// ==================== DISCOVERY CARD WITH JAGGED EDGES ====================
const DiscoveryCard: React.FC<{
  name: string;
  type: string;
  significance: string;
  index: number;
}> = ({ name, type, significance, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = [SOUL.blood, SOUL.earth, SOUL.gold];
  const accentColor = colors[index % 3];

  return (
    <div
      className="group p-8 transition-all duration-500 relative overflow-hidden"
      style={{
        background: isHovered ? `${accentColor}08` : 'transparent',
        border: `1px solid ${isHovered ? accentColor : 'rgba(255,255,255,0.1)'}`,
        clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px))',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated accent line */}
      <div 
        className="absolute top-0 left-0 h-[2px] transition-all duration-500"
        style={{
          background: accentColor,
          width: isHovered ? '100%' : '0%',
          boxShadow: isHovered ? `0 0 20px ${accentColor}` : 'none',
        }}
      />
      
      <div className="flex justify-between items-start mb-6">
        <h3 className="text-2xl font-bold tracking-tight">{name}</h3>
        <Target 
          size={20} 
          style={{ 
            color: accentColor,
            opacity: isHovered ? 1 : 0.3,
            transform: isHovered ? 'rotate(45deg)' : 'rotate(0deg)',
            transition: 'all 0.3s ease',
          }} 
        />
      </div>
      
      <div 
        className="text-xs font-mono mb-4 tracking-[0.2em]"
        style={{ color: accentColor }}
      >
        {type}
      </div>
      
      <p className="opacity-50 text-sm leading-relaxed">{significance}</p>
      
      {/* Corner accent */}
      <div 
        className="absolute bottom-0 right-0 w-12 h-12 transition-all duration-500"
        style={{
          background: `linear-gradient(135deg, transparent 50%, ${accentColor}${isHovered ? '30' : '10'} 50%)`,
        }}
      />
    </div>
  );
};

// ==================== ANOMALOUS DIVIDER ====================
const JaggedDivider: React.FC<{ color?: string }> = ({ color = SOUL.blood }) => (
  <div className="flex items-center gap-4 my-16">
    <div 
      className="h-[2px] flex-1"
      style={{
        background: `linear-gradient(90deg, ${color} 0%, transparent 100%)`,
        clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 100%, 0 100%)',
      }}
    />
    <span 
      className="text-2xl"
      style={{ color }}
    >
      ◈
    </span>
    <div 
      className="h-[2px] flex-1"
      style={{
        background: `linear-gradient(90deg, transparent 0%, ${color} 100%)`,
        clipPath: 'polygon(8px 0, 100% 0, 100% 100%, 0 100%)',
      }}
    />
  </div>
);

// ==================== MAIN SITE ====================
const SoulSite: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.2], [0, 100]);

  return (
    <div 
      className="min-h-screen overflow-x-hidden selection:bg-[#FF3333] selection:text-black"
      style={{ background: SOUL.void, color: SOUL.text }}
    >
      {/* Background with fractal strata */}
      <FractalStrata />

      {/* FIXED HEADER - Jagged styling */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 p-8 flex flex-col md:flex-row justify-between items-center gap-6"
        style={{
          background: 'linear-gradient(180deg, rgba(5,5,5,0.95) 0%, transparent 100%)',
        }}
      >
        <div className="flex items-center gap-4 group cursor-pointer">
          <div
            className="w-12 h-12 flex items-center justify-center text-black font-bold text-2xl transition-transform duration-500 group-hover:scale-110"
            style={{
              background: SOUL.blood,
              clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
            }}
          >
            Λ
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-[0.3em] uppercase">ARIF-FAZIL</span>
            <span className="text-[10px] tracking-[0.2em] uppercase" style={{ color: SOUL.dim }}>Lead Geoscientist</span>
          </div>
        </div>
        <AgeClock />
        {/* arifOS Constellation Vitality Ring — live from MCP /health */}
        <div className="hidden md:flex items-center gap-2 ml-6">
          <div style="width:36px;height:36px;position:relative;display:inline-block">
            <svg viewBox="0 0 44 44" style="width:100%;height:100%;transform:rotate(-90deg)">
              <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(0,180,160,0.2)" strokeWidth="3"/>
              <circle id="vit-ring" cx="22" cy="22" r="20" fill="none" stroke="#3DBE8A" strokeWidth="3" strokeLinecap="round" strokeDasharray="125.7" strokeDashoffset="21.4" transform="rotate(-90 22 22)"/>
            </svg>
            <span id="vit-num" style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-family:monospace;font-size:0.55rem;font-weight:700;color:#3DBE8A">0.82</span>
          </div>
          <span id="verdict-badge" style="font-family:monospace;font-size:0.7rem;font-weight:700;color:#3DBE8A;border:1px solid rgba(61,190,138,0.3);padding:2px 6px;border-radius:4px;">SEAL</span>
          <span style="font-family:monospace;font-size:0.75rem;color:#00B4A0;font-weight:700;letter-spacing:0.05em;">ΔΩΨ</span>
        </div>
      </nav>

      {/* HERO SECTION - Anomalous presence */}
      <motion.section 
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative h-screen flex flex-col justify-center items-center text-center px-6"
      >
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Trinity symbol */}
            <div 
              className="text-xs font-bold tracking-[0.5em] uppercase mb-8 flex items-center justify-center gap-4"
            >
              <span style={{ color: SOUL.blood }}>Ψ</span>
              <span style={{ color: SOUL.dim }}>—</span>
              <span style={{ color: SOUL.earth }}>Ω</span>
              <span style={{ color: SOUL.dim }}>—</span>
              <span style={{ color: SOUL.gold }}>Δ</span>
            </div>
            
            <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter leading-[0.85] mb-8">
              <span style={{ color: SOUL.text }}>ARIF</span>
              <br />
              <span 
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${SOUL.blood} 0%, ${SOUL.earth} 50%, ${SOUL.gold} 100%)`,
                }}
              >
                FAZIL
              </span>
            </h1>
            
            <p className="text-lg md:text-xl font-medium max-w-3xl mx-auto opacity-60 leading-relaxed mb-6">
              Senior Exploration Geoscientist @ PETRONAS
            </p>
            <p className="text-sm md:text-base opacity-40 max-w-2xl mx-auto leading-relaxed mb-16">
              Translating subsurface uncertainty into governed decisions. Building AI systems that remain accountable.
              <br />
              <span style={{ color: SOUL.blood }}>Ditempa Bukan Diberi</span> — Forged through experience, not given as theory.
            </p>
            
            <div className="flex flex-wrap justify-center gap-6">
              <JaggedButton href="#discoveries">Field Discoveries</JaggedButton>
              <JaggedButton href="#theory" variant="outline">Constitutional Theory</JaggedButton>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 12, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-12 opacity-30"
        >
          <ChevronDown size={32} style={{ color: SOUL.blood }} />
        </motion.div>
      </motion.section>

      {/* MAIN CONTENT */}
      <main className="relative z-10" style={{ background: SOUL.void }}>
        
        {/* DISCOVERIES SECTION */}
        <section id="discoveries" className="py-32 px-6 md:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="h-[1px] w-16"
                style={{ background: SOUL.blood }}
              />
              <div 
                className="text-xs font-bold tracking-[0.3em] uppercase"
                style={{ color: SOUL.blood }}
              >
                Major Discoveries
              </div>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-16 leading-tight max-w-2xl">
              Listening to the{' '}
              <span style={{ color: SOUL.blood }}>Earth</span>.
              <br />
              Interpreting the{' '}
              <span style={{ color: SOUL.earth }}>Subsurface</span>.
            </h2>
            
            <div className="grid md:grid-cols-2 gap-4">
              {tokens.discoveries.map((d, i) => (
                <DiscoveryCard
                  key={i}
                  name={d.name}
                  type={d.type}
                  significance={d.significance}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        <JaggedDivider />

        {/* THEORY SECTION */}
        <section id="theory" className="py-32 px-6 md:px-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24 items-start">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div 
                  className="h-[1px] w-16"
                  style={{ background: SOUL.earth }}
                />
                <div 
                  className="text-xs font-bold tracking-[0.3em] uppercase"
                  style={{ color: SOUL.earth }}
                >
                  Constitutional AI
                </div>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-12 leading-tight">
                From{' '}
                <span style={{ color: SOUL.earth }}>Strata</span>
                <br />
                to{' '}
                <span style={{ color: SOUL.gold }}>Systems</span>.
              </h2>
              
              <div className="space-y-8 text-lg opacity-70 leading-relaxed">
                <p>
                  The discipline of rigorous verification and calibrated humility 
                  born from 13+ years in the Malay Basin gave rise to{' '}
                  <span 
                    className="font-bold border-b-2"
                    style={{ borderColor: SOUL.blood, color: SOUL.text }}
                  >
                    arifOS
                  </span>
                  —a constitutional framework for agentic safety.
                </p>
                <p>
                  13 binding floors. Thermodynamic governance. 
                  Human sovereignty preserved through{' '}
                  <span style={{ color: SOUL.gold }}>F13 KHILAFAH</span>.
                </p>
              </div>
            </div>
            
            {/* Stats with jagged cards */}
            <div className="grid grid-cols-1 gap-6">
              {[
                { value: '100%', label: 'Discovery Rate', color: SOUL.blood },
                { value: '13+', label: 'Years Experience', color: SOUL.earth },
                { value: '17+', label: 'Governed Tools (live)', color: SOUL.gold },
                { value: '13', label: 'Constitutional Floors', color: SOUL.blood },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-8 transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: `${stat.color}08`,
                    border: `1px solid ${stat.color}30`,
                    clipPath: 'polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px))',
                  }}
                >
                  <div 
                    className="text-5xl font-bold mb-2"
                    style={{ color: stat.color }}
                  >
                    {stat.value}
                  </div>
                  <div className="text-xs font-bold tracking-widest uppercase opacity-40">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <JaggedDivider color={SOUL.gold} />

        {/* WRITINGS SECTION */}
        <section className="py-32 px-6 md:px-24">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-4 mb-4">
              <div 
                className="h-[1px] w-16"
                style={{ background: SOUL.gold }}
              />
              <div 
                className="text-xs font-bold tracking-[0.3em] uppercase"
                style={{ color: SOUL.gold }}
              >
                Theory & Writings
              </div>
            </div>
            
            <div className="space-y-4 mt-12">
              {tokens.articles.map((a, i) => (
                <a 
                  key={i} 
                  href={a.url} 
                  className="flex flex-col md:flex-row md:items-center justify-between p-8 border border-white/10 transition-all group relative overflow-hidden"
                  style={{
                    clipPath: 'polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))',
                  }}
                >
                  <div className="relative z-10 flex-1">
                    <div 
                      className="text-[10px] font-mono mb-2 opacity-30"
                    >
                      0{i+1}
                    </div>
                    <h3 
                      className="text-xl font-medium transition-colors group-hover:text-[#FF3333]"
                    >
                      {a.title}
                    </h3>
                  </div>
                  <ExternalLink 
                    className="relative z-10 opacity-20 group-hover:opacity-100 transition-all mt-4 md:mt-0" 
                    style={{ color: SOUL.text }}
                  />
                  {/* Hover fill */}
                  <div 
                    className="absolute inset-0 transition-transform duration-500 opacity-5"
                    style={{
                      background: SOUL.blood,
                      transform: 'translateY(100%)',
                    }}
                  />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-24 px-6 border-t border-white/5 text-center">
          <div 
            className="text-6xl font-bold mb-8"
            style={{
              background: `linear-gradient(135deg, ${SOUL.blood} 0%, ${SOUL.earth} 50%, ${SOUL.gold} 100%)`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            ΔΩΨ
          </div>
          <p className="text-sm opacity-40 tracking-widest uppercase mb-8">
            Ditempa Bukan Diberi — Forged, Not Given
          </p>
          <div className="flex justify-center gap-8 text-xs opacity-30">
            <span style={{ color: SOUL.blood }}>Ψ SOUL</span>
            <span>·</span>
            <span style={{ color: SOUL.earth }}>Ω MIND</span>
            <span>·</span>
            <span style={{ color: SOUL.gold }}>Δ BODY</span>
          </div>
        </footer>
      </main>

      {/* arifOS Constellation Section */}
      <div style="padding:3rem 2rem 2rem;text-align:center;border-top:1px solid rgba(0,180,160,0.12);margin:0 1rem;">
        <p style="font-family:monospace;font-size:0.65rem;color:#6B7280;letter-spacing:0.1em;margin-bottom:0.75rem">ARIFOS CONSTELLATION</p>
        <p style="color:#9CA3AF;font-size:0.8rem;margin-bottom:1.5rem">arifOS MCP · 13 constitutional floors · 888_HOLD human veto · VAULT999 sealed audit</p>
        <div style="display:flex;justify-content:center;gap:0.75rem;flex-wrap:wrap;margin-bottom:1rem">
          <a href="https://arifosmcp.arif-fazil.com/" style="background:rgba(0,180,160,0.1);border:1px solid rgba(0,180,160,0.3);color:#00B4A0;padding:8px 14px;border-radius:6px;font-size:0.75rem;font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">🔱 arifOS MCP Runtime</a>
          <a href="https://geox.arif-fazil.com/" style="background:rgba(0,180,160,0.05);border:1px solid rgba(0,180,160,0.2);color:#9CA3AF;padding:8px 14px;border-radius:6px;font-size:0.75rem;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">🌏 GEOX Earth Intelligence</a>
          <a href="https://aaa.arif-fazil.com/" style="background:rgba(0,180,160,0.05);border:1px solid rgba(0,180,160,0.2);color:#9CA3AF;padding:8px 14px;border-radius:6px;font-size:0.75rem;text-decoration:none;display:inline-flex;align-items:center;gap:6px;">Δ AAA Wire</a>
        </div>
        <p style="font-family:monospace;font-size:0.6rem;color:#4B5563;margin-top:1rem">DITEMPA BUKAN DIBERI · MCP: arifos://ecosystem/context-v1</p>
      </div>

      {/* arifOS MCP Vitality Ring JS */}
      <script async>
      (function() {
        async function loadArifOSSeal() {
          try {
            const res = await fetch('https://arifosmcp.arif-fazil.com/health');
            const d = await res.json();
            const vit = d.thermodynamic?.vitality_index ?? 0.82;
            const verd = d.thermodynamic?.verdict || d.verdict || 'SEAL';
            const ring = document.getElementById('vit-ring');
            const num = document.getElementById('vit-num');
            if (ring) {
              const circ = 2 * Math.PI * 20;
              ring.style.strokeDashoffset = circ * (1 - vit);
            }
            if (num) num.textContent = (typeof vit === 'number' ? vit.toFixed(2) : vit);
            const badge = document.getElementById('verdict-badge');
            if (badge) {
              badge.textContent = verd;
              badge.style.color = verd === 'SEAL' ? '#3DBE8A' : verd === 'HOLD' ? '#f59e0b' : '#ef4444';
              badge.style.borderColor = verd === 'SEAL' ? 'rgba(61,190,138,0.3)' : verd === 'HOLD' ? 'rgba(245,158,11,0.3)' : 'rgba(239,68,68,0.3)';
            }
          } catch(e) {}
        }
        loadArifOSSeal();
        setInterval(loadArifOSSeal, 30000);
      })();
      </script>

      {/* Trinity Navigation Footer */}
      <footer 
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3"
        style={{
          background: 'linear-gradient(0deg, rgba(15,13,13,0.98) 0%, rgba(15,13,13,0.85) 100%)',
          borderTop: `1px solid ${SOUL.blood}30`,
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2">
          {[
            { label: 'Ψ SOUL', href: 'https://arif-fazil.com', color: SOUL.blood },
            { label: 'Ω MIND', href: 'https://apex.arif-fazil.com', color: SOUL.earth },
            { label: 'Δ BODY', href: 'https://aaa.arif-fazil.com', color: SOUL.gold },
            { label: 'Δ MCP', href: 'https://arifosmcp.arif-fazil.com', color: SOUL.gold },
            { label: '◉ FORGE', href: 'https://forge.arif-fazil.com', color: SOUL.dim },
            { label: '◎ WAW', href: 'https://waw.arif-fazil.com', color: SOUL.dim },
            { label: 'Ω WIKI', href: 'https://wiki.arif-fazil.com', color: SOUL.dim },
            { label: 'Φ GEOX', href: 'https://geox.arif-fazil.com', color: SOUL.earth },
          ].map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-[10px] font-mono tracking-wider transition-all duration-200 hover:brightness-125"
              style={{ color: link.color }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </footer>

      {/* CSS Keyframes */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  );
};

export default SoulSite;
