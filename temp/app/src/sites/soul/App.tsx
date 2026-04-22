// SOUL Ring - arif-fazil.com
// The Human Anchor - Professional Portfolio
// Muhammad Arif bin Fazil - Senior Exploration Geoscientist

import React, { useState, useEffect, useRef } from 'react';
import { 
  Mountain, Pickaxe, Target, Mail, Linkedin, Send, 
  ChevronDown, Award, MapPin, GraduationCap, Briefcase, 
  ExternalLink, Github, Cpu, Activity
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import tokens from '@/constitution/tokens';

// ==================== ANIMATED HERO BACKGROUND ====================
const GeologicalHero: React.FC = () => {
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

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      // Deep earth gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, h);
      gradient.addColorStop(0, '#0f0c08');
      gradient.addColorStop(0.5, '#1a1510');
      gradient.addColorStop(1, '#2a2018');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, w, h);

      // Animated strata layers
      const layers = 8;
      for (let i = 0; i < layers; i++) {
        const y = (i / layers) * h * 0.8 + h * 0.2;
        const amplitude = 30 + i * 10;
        const frequency = 0.002 + i * 0.001;
        const speed = 0.0005 + i * 0.0002;
        
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        for (let x = 0; x <= w; x += 5) {
          const noise = Math.sin(x * frequency + time * speed) * amplitude +
                       Math.sin(x * frequency * 2 + time * speed * 1.5) * amplitude * 0.5;
          ctx.lineTo(x, y + noise);
        }
        
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        
        const alpha = 0.1 + (i / layers) * 0.2;
        const hue = 30 + i * 5;
        ctx.fillStyle = `hsla(${hue}, 60%, ${20 + i * 5}%, ${alpha})`;
        ctx.fill();
      }

      // Oil/gas reservoir glows
      for (let i = 0; i < 5; i++) {
        const x = (Math.sin(time * 0.0003 + i * 1.5) * 0.4 + 0.5) * w;
        const y = (Math.cos(time * 0.0002 + i * 2) * 0.3 + 0.6) * h;
        const radius = 50 + Math.sin(time * 0.001 + i) * 20;
        
        const glow = ctx.createRadialGradient(x, y, 0, x, y, radius);
        glow.addColorStop(0, 'rgba(232, 168, 56, 0.3)');
        glow.addColorStop(0.5, 'rgba(196, 121, 26, 0.1)');
        glow.addColorStop(1, 'rgba(196, 121, 26, 0)');
        
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
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
      className="absolute inset-0 w-full h-full"
      style={{ filter: 'brightness(0.8)' }}
    />
  );
};

// ==================== DISCOVERY CARD ====================
const DiscoveryCard: React.FC<{
  name: string;
  type: string;
  significance: string;
  index: number;
}> = ({ name, type, significance, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative group cursor-pointer"
    >
      <div className={`
        relative p-6 rounded-2xl border transition-all duration-500
        ${isHovered ? 'border-[#e8a838] bg-[#e8a838]/10' : 'border-[#c4791a]/30 bg-[#1a1510]/80'}
      `}>
        {/* Glow effect */}
        <div className={`
          absolute inset-0 rounded-2xl transition-opacity duration-500
          ${isHovered ? 'opacity-100' : 'opacity-0'}
        `}
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(232, 168, 56, 0.2), transparent 70%)',
        }}
        />
        
        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-[#f0e6d3] mb-1">{name}</h3>
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium bg-[#c4791a]/20 text-[#e8a838]">
                <Target className="w-3 h-3" />
                {type}
              </span>
            </div>
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center
              transition-all duration-500
              ${isHovered ? 'bg-[#e8a838] text-[#0f0c08]' : 'bg-[#c4791a]/20 text-[#c4791a]'}
            `}>
              <Pickaxe className="w-6 h-6" />
            </div>
          </div>
          
          <p className="text-[#f0e6d3]/70 text-sm leading-relaxed">
            {significance}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

// ==================== TRINITY RING NAVIGATOR ====================
const TrinityNavigator: React.FC = () => {
  const rings = [
    { id: 'soul', symbol: 'Ψ', name: 'SOUL', desc: 'Human Anchor', color: '#c4791a', active: true },
    { id: 'mind', symbol: 'Ω', name: 'MIND', desc: 'Theory & Law', color: '#d4a853', active: false },
    { id: 'body', symbol: 'Δ', name: 'BODY', desc: 'Execution', color: '#00d4aa', active: false },
  ];

  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      {rings.map((ring, i) => (
        <motion.div
          key={ring.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.2 }}
          className={`
            relative flex flex-col items-center gap-2 p-4 rounded-xl
            transition-all duration-300 cursor-pointer
            ${ring.active ? 'bg-[#c4791a]/20' : 'hover:bg-white/5'}
          `}
        >
          <div 
            className={`
              w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold
              transition-all duration-300
              ${ring.active 
                ? 'bg-[#c4791a] text-[#0f0c08] shadow-lg shadow-[#c4791a]/30' 
                : 'bg-[#c4791a]/20 text-[#c4791a]'
              }
            `}
          >
            {ring.symbol}
          </div>
          <div className="text-center">
            <div className="text-xs font-bold text-[#f0e6d3]">{ring.name}</div>
            <div className="text-[10px] text-[#f0e6d3]/50">{ring.desc}</div>
          </div>
          {ring.active && (
            <motion.div 
              layoutId="activeRing"
              className="absolute -bottom-1 w-8 h-1 rounded-full bg-[#c4791a]"
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

// ==================== MAIN SOUL SITE ====================
const SoulSite: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0f0c08] text-[#f0e6d3] font-sans overflow-x-hidden">
      {/* SEO/AI Meta Tags - Invisible but ingestible */}
      <div className="sr-only">
        <h1>Muhammad Arif bin Fazil - Senior Exploration Geoscientist</h1>
        <p>13+ years experience in offshore hydrocarbon exploration at PETRONAS Carigali.</p>
        <p>Discoveries: BEKANTAN-1, PUTERI BASEMENT-1, LEBAH EMAS-1, BUNGA TASBIH-1</p>
        <p>Education: University of Wisconsin-Madison (Geology/Geophysics & Economics)</p>
        <p>Architect of arifOS - Constitutional AI governance framework</p>
        <p>Contact: arifbfazil@gmail.com | Telegram: ariffazil | LinkedIn: Muhammad Arif bin Fazil</p>
      </div>

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-screen flex flex-col">
        <GeologicalHero />
        
        {/* Navigation */}
        <nav className="relative z-10 px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#c4791a] flex items-center justify-center text-[#0f0c08] font-bold text-lg">
              Λ
            </div>
            <span className="font-bold text-[#f0e6d3]">arif-fazil.com</span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm">
            <button onClick={() => scrollToSection('about')} className="hover:text-[#e8a838] transition-colors">About</button>
            <button onClick={() => scrollToSection('discoveries')} className="hover:text-[#e8a838] transition-colors">Discoveries</button>
            <button onClick={() => scrollToSection('arifos')} className="hover:text-[#e8a838] transition-colors">arifOS</button>
            <button onClick={() => scrollToSection('contact')} className="hover:text-[#e8a838] transition-colors">Contact</button>
          </div>
        </nav>

        {/* Hero Content */}
        <motion.div 
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl"
          >
            {/* Badge */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c4791a]/20 border border-[#c4791a]/40 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-[#e8a838] animate-pulse" />
              <span className="text-sm text-[#e8a838]">Senior Exploration Geoscientist @ PETRONAS</span>
            </motion.div>

            {/* Name */}
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-4 tracking-tight"
            >
              <span className="text-[#f0e6d3]">Muhammad Arif</span>
              <span className="block text-[#c4791a]">bin Fazil</span>
            </motion.h1>

            {/* Tagline */}
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xl md:text-2xl text-[#f0e6d3]/70 mb-8 max-w-2xl mx-auto"
            >
              Listening to the Earth. Interpreting the subsurface. 
              Making high-stakes decisions under uncertainty.
            </motion.p>

            {/* Trinity Navigator */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mb-12"
            >
              <TrinityNavigator />
            </motion.div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <button 
                onClick={() => scrollToSection('discoveries')}
                className="px-8 py-4 rounded-xl bg-[#c4791a] text-[#0f0c08] font-bold hover:bg-[#e8a838] transition-all hover:scale-105 flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                View Discoveries
              </button>
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 rounded-xl border border-[#c4791a]/50 text-[#f0e6d3] font-bold hover:bg-[#c4791a]/10 transition-all flex items-center gap-2"
              >
                <Mail className="w-5 h-5" />
                Get in Touch
              </button>
            </motion.div>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <motion.div 
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="flex flex-col items-center gap-2 text-[#f0e6d3]/50"
            >
              <span className="text-xs">Scroll to explore</span>
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {/* ==================== ABOUT SECTION ==================== */}
      <section id="about" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c4791a]/10 border border-[#c4791a]/30 mb-6">
                <Briefcase className="w-4 h-4 text-[#c4791a]" />
                <span className="text-sm text-[#c4791a]">Professional Journey</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                <span className="text-[#f0e6d3]">13+ Years</span>
                <span className="block text-[#c4791a]">Underground</span>
              </h2>

              <div className="space-y-4 text-[#f0e6d3]/80 leading-relaxed">
                <p>
                  I'm a Senior Exploration Geoscientist at <strong className="text-[#e8a838]">PETRONAS Carigali</strong>, 
                  with over a decade of experience in the offshore hydrocarbon basins of Peninsular Malaysia.
                </p>
                <p>
                  My work involves listening to the Earth—interpreting the subtle, often fragmented signals 
                  of the subsurface to make high-stakes decisions under profound uncertainty.
                </p>
                <p>
                  This same discipline—the constant need for <strong className="text-[#e8a838]">grounding, verification, 
                  and humility</strong> in the face of the unknown—is what birthed <strong className="text-[#e8a838]">arifOS</strong>.
                </p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mt-8">
                {[
                  { value: '13+', label: 'Years Experience' },
                  { value: '4', label: 'Major Discoveries' },
                  { value: '2', label: 'Basins Explored' },
                ].map((stat, i) => (
                  <div key={i} className="text-center p-4 rounded-xl bg-[#1a1510] border border-[#c4791a]/20">
                    <div className="text-3xl font-bold text-[#e8a838]">{stat.value}</div>
                    <div className="text-xs text-[#f0e6d3]/50 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Right: Info Cards */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              className="space-y-4"
            >
              {[
                { icon: Briefcase, label: 'Current Role', value: 'Senior Exploration Geoscientist @ PETRONAS Carigali' },
                { icon: GraduationCap, label: 'Education', value: 'University of Wisconsin-Madison (Geology/Geophysics & Economics)' },
                { icon: MapPin, label: 'Location', value: 'Peninsular Malaysia' },
                { icon: Mountain, label: 'Specialization', value: 'Basin Analysis & Prospect Maturation' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#1a1510] border border-[#c4791a]/20 hover:border-[#c4791a]/50 transition-colors"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#c4791a]/20 flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-[#c4791a]" />
                  </div>
                  <div>
                    <div className="text-xs text-[#f0e6d3]/50">{item.label}</div>
                    <div className="text-sm text-[#f0e6d3]">{item.value}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== DISCOVERIES SECTION ==================== */}
      <section id="discoveries" className="relative py-24 px-6 bg-[#0a0805]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c4791a]/10 border border-[#c4791a]/30 mb-6">
              <Award className="w-4 h-4 text-[#c4791a]" />
              <span className="text-sm text-[#c4791a]">Significant Discoveries</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Wells That <span className="text-[#c4791a]">Mattered</span>
            </h2>
            <p className="text-[#f0e6d3]/60 max-w-2xl mx-auto">
              The quiet successes—wells matured through rigorous collaboration and 
              an uncompromising commitment to factual grounding.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {tokens.discoveries.map((discovery, i) => (
              <DiscoveryCard
                key={discovery.name}
                name={discovery.name}
                type={discovery.type}
                significance={discovery.significance}
                index={i}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ==================== ARIFOS SECTION ==================== */}
      <section id="arifos" className="relative py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-[#1a1510] to-[#2a2018] border border-[#c4791a]/30 p-8 flex items-center justify-center">
                {/* Animated Lambda Logo */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  className="relative w-48 h-48"
                >
                  {/* Outer ring */}
                  <div className="absolute inset-0 rounded-full border-2 border-[#c4791a]/30" />
                  <div className="absolute inset-4 rounded-full border border-[#c4791a]/20" />
                  
                  {/* Lambda symbol */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-8xl font-bold text-[#c4791a]">Λ</span>
                  </div>
                  
                  {/* Orbiting dots */}
                  {[0, 120, 240].map((deg, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full bg-[#e8a838]"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `rotate(${deg}deg) translateX(80px) translateY(-50%)`,
                      }}
                      animate={{ 
                        boxShadow: ['0 0 10px #e8a838', '0 0 20px #e8a838', '0 0 10px #e8a838']
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  ))}
                </motion.div>
              </div>
              
              {/* Floating badges */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -top-4 -right-4 px-4 py-2 rounded-full bg-[#c4791a] text-[#0f0c08] text-sm font-bold"
              >
                13 Floors
              </motion.div>
              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-4 -left-4 px-4 py-2 rounded-full bg-[#1a1510] border border-[#c4791a]/50 text-[#e8a838] text-sm font-bold"
              >
                Constitutional AI
              </motion.div>
            </motion.div>

            {/* Right: Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c4791a]/10 border border-[#c4791a]/30 mb-6">
                <Cpu className="w-4 h-4 text-[#c4791a]" />
                <span className="text-sm text-[#c4791a]">The arifOS Ecosystem</span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                From <span className="text-[#c4791a]">Basins</span> to <span className="text-[#c4791a]">Bits</span>
              </h2>

              <div className="space-y-4 text-[#f0e6d3]/80 leading-relaxed mb-8">
                <p>
                  <strong className="text-[#e8a838]">arifOS</strong> is a constitutional governance framework 
                  for autonomous AI agents—translating offshore safety standards into the execution kernels of tomorrow.
                </p>
                <p>
                  Just as I navigate the complex strata of the Sabah Basin with rigor and humility, 
                  arifOS brings that same discipline to AI governance: <strong className="text-[#e8a838]">stability, 
                  reversibility, and physical grounding</strong>.
                </p>
              </div>

              {/* Trinity Matrix */}
              <div className="space-y-3">
                {[
                  { ring: 'Ψ SOUL', name: 'arif-fazil.com', desc: 'Human Anchor (You are here)', active: true },
                  { ring: 'Ω MIND', name: 'arifos.arif-fazil.com', desc: 'Theory & Law', active: false },
                  { ring: 'Δ BODY', name: 'arifosmcp.arif-fazil.com', desc: 'Execution Runtime', active: false },
                ].map((item, i) => (
                  <a
                    key={i}
                    href={`https://${item.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                      flex items-center gap-4 p-4 rounded-xl border transition-all
                      ${item.active 
                        ? 'bg-[#c4791a]/20 border-[#c4791a]' 
                        : 'bg-[#1a1510] border-[#c4791a]/20 hover:border-[#c4791a]/50'
                      }
                    `}
                  >
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center font-bold
                      ${item.active ? 'bg-[#c4791a] text-[#0f0c08]' : 'bg-[#c4791a]/20 text-[#c4791a]'}
                    `}>
                      {item.ring.split(' ')[0]}
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-bold text-[#f0e6d3]">{item.ring}</div>
                      <div className="text-xs text-[#f0e6d3]/50">{item.desc}</div>
                    </div>
                    {!item.active && <ExternalLink className="w-4 h-4 text-[#f0e6d3]/30" />}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== DYNAMIC INTEGRATION SECTION ==================== */}
      <section id="integration" className="relative py-24 px-6 bg-[#0a0805]">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c4791a]/10 border border-[#c4791a]/30 mb-6">
              <Activity className="w-4 h-4 text-[#c4791a]" />
              <span className="text-sm text-[#c4791a]">Dynamic Integration</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              The <span className="text-[#c4791a]">Extended</span> Ecosystem
            </h2>
            <p className="text-[#f0e6d3]/60 max-w-2xl mx-auto">
              Beyond the Trinity Matrix—specialized domains for geological intelligence 
              and live system execution.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* GEOX Card */}
            <motion.a
              href="https://geox.arif-fazil.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="group p-6 rounded-2xl bg-[#1a1510] border border-[#c4791a]/20 hover:border-[#c4791a]/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4a7c59] to-[#2d5a3d] flex items-center justify-center">
                  <Mountain className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30">
                  <div className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse" />
                  <span className="text-xs text-[#00d4aa]">LIVE</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#f0e6d3] mb-2">GEOX</h3>
              <p className="text-sm text-[#f0e6d3]/60 mb-4">
                Governed, agentic geological intelligence coprocessor. 
                FastMCP-powered well log interpretation and physics calculations.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded bg-[#c4791a]/10 text-[#c4791a] text-xs">FastMCP</span>
                <span className="px-2 py-1 rounded bg-[#c4791a]/10 text-[#c4791a] text-xs">Well Logs</span>
                <span className="px-2 py-1 rounded bg-[#c4791a]/10 text-[#c4791a] text-xs">Physics Engine</span>
              </div>
            </motion.a>

            {/* arifosmcp Card */}
            <motion.a
              href="https://arifosmcp.arif-fazil.com"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="group p-6 rounded-2xl bg-[#1a1510] border border-[#c4791a]/20 hover:border-[#c4791a]/50 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00d4aa] to-[#006b55] flex items-center justify-center">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#00d4aa]/10 border border-[#00d4aa]/30">
                  <div className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse" />
                  <span className="text-xs text-[#00d4aa]">LIVE</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-[#f0e6d3] mb-2">arifOS MCP</h3>
              <p className="text-sm text-[#f0e6d3]/60 mb-4">
                Constitutional MCP kernel with live telemetry, tool registry, 
                and VAULT999 audit logging.
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="px-2 py-1 rounded bg-[#c4791a]/10 text-[#c4791a] text-xs">MCP Server</span>
                <span className="px-2 py-1 rounded bg-[#c4791a]/10 text-[#c4791a] text-xs">Live Metrics</span>
                <span className="px-2 py-1 rounded bg-[#c4791a]/10 text-[#c4791a] text-xs">VAULT999</span>
              </div>
            </motion.a>
          </div>

          {/* API Endpoints */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
            className="mt-8 p-6 rounded-2xl bg-[#1a1510] border border-[#c4791a]/10"
          >
            <h3 className="text-sm font-bold text-[#c4791a] mb-4 uppercase tracking-wider">Available API Endpoints</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm font-mono">
              <div>
                <div className="text-[#f0e6d3]/50 mb-2">arifosmcp.arif-fazil.com</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00d4aa]">GET</span>
                    <span className="text-[#f0e6d3]/70">/api/v1/vitals</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00d4aa]">GET</span>
                    <span className="text-[#f0e6d3]/70">/api/v1/tools</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#d4a853]">POST</span>
                    <span className="text-[#f0e6d3]/70">/api/v1/tools/:name</span>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-[#f0e6d3]/50 mb-2">geox.arif-fazil.com</div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[#00d4aa]">GET</span>
                    <span className="text-[#f0e6d3]/70">/api/v1/materials</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#d4a853]">POST</span>
                    <span className="text-[#f0e6d3]/70">/api/v1/interpret</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[#00d4aa]">GET</span>
                    <span className="text-[#f0e6d3]/70">/api/v1/atlas</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== CONTACT SECTION ==================== */}
      <section id="contact" className="relative py-24 px-6 bg-[#070503]">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#c4791a]/10 border border-[#c4791a]/30 mb-6">
              <Mail className="w-4 h-4 text-[#c4791a]" />
              <span className="text-sm text-[#c4791a]">Get in Touch</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Let's <span className="text-[#c4791a]">Connect</span>
            </h2>
            <p className="text-[#f0e6d3]/60 mb-12 max-w-xl mx-auto">
              If you share an interest in geophysics, the philosophy of systems, 
              or the ethical governance of the tools we create, I would be honored to connect.
            </p>

            {/* Contact Cards */}
            <div className="grid md:grid-cols-3 gap-4 mb-12">
              {[
                { icon: Send, label: 'Telegram', value: '@ariffazil', href: 'https://t.me/ariffazil' },
                { icon: Linkedin, label: 'LinkedIn', value: 'Muhammad Arif bin Fazil', href: 'https://linkedin.com/in/ariffazil' },
                { icon: Mail, label: 'Email', value: 'arifbfazil@gmail.com', href: 'mailto:arifbfazil@gmail.com' },
              ].map((contact, i) => (
                <motion.a
                  key={i}
                  href={contact.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="group p-6 rounded-xl bg-[#1a1510] border border-[#c4791a]/20 hover:border-[#c4791a]/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-[#c4791a]/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-[#c4791a]/30 transition-colors">
                    <contact.icon className="w-6 h-6 text-[#c4791a]" />
                  </div>
                  <div className="text-xs text-[#f0e6d3]/50 mb-1">{contact.label}</div>
                  <div className="text-sm text-[#f0e6d3] font-medium">{contact.value}</div>
                </motion.a>
              ))}
            </div>

            {/* GitHub Link */}
            <motion.a
              href="https://github.com/ariffazil"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a1510] border border-[#c4791a]/20 hover:border-[#c4791a]/50 transition-all"
            >
              <Github className="w-5 h-5 text-[#c4791a]" />
              <span className="text-[#f0e6d3]">github.com/ariffazil</span>
            </motion.a>
          </motion.div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="relative py-12 px-6 border-t border-[#c4791a]/10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#c4791a] flex items-center justify-center text-[#0f0c08] font-bold">
                Λ
              </div>
              <div>
                <div className="text-sm font-bold text-[#f0e6d3]">arif-fazil.com</div>
                <div className="text-xs text-[#f0e6d3]/50">The SOUL Ring of arifOS</div>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-lg font-bold text-[#c4791a]">Ditempa Bukan Diberi</div>
              <div className="text-xs text-[#f0e6d3]/50">Forged, Not Given — ΔΩΨ | ARIF</div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-[#c4791a]/10 text-center text-xs text-[#f0e6d3]/30">
            © 2026 Muhammad Arif bin Fazil. All rights reserved. 
            <span className="mx-2">|</span>
            Constitutional Version: arifOS v54.1-SEAL
          </div>
        </div>
      </footer>
    </div>
  );
};

export default SoulSite;
