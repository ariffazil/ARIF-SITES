// SOUL Ring - arif-fazil.com
// The Human Anchor - Professional Portfolio
// Muhammad Arif bin Fazil - Senior/Lead Exploration Geoscientist

import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, ChevronDown, Award, MapPin, Briefcase, 
  ExternalLink, Cpu, Clock
} from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import tokens from '@/constitution/tokens';

// ==================== BIOLOGICAL CLOCK ====================
const AgeClock: React.FC = () => {
  const [age, setAge] = useState<string>('');
  
  useEffect(() => {
    const birthDate = new Date(tokens.identity.birthdate);
    
    const updateAge = () => {
      const now = new Date();
      const diffTime = now.getTime() - birthDate.getTime();
      const ageInYears = diffTime / (1000 * 60 * 60 * 24 * 365.25);
      setAge(ageInYears.toFixed(9));
    };

    const interval = setInterval(updateAge, 50);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-xs md:text-sm tracking-tighter text-soul-primary opacity-80 flex items-center gap-2">
      <Clock size={14} className="animate-pulse" />
      <span>AGE: {age}</span>
    </div>
  );
};

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
      
      // Obsidian Void
      ctx.fillStyle = '#0A0A0A';
      ctx.fillRect(0, 0, w, h);

      // Stratigraphic Layers - RADIANT PRIMERS
      const layers = [
        { color: '#FF4D00', amp: 40, freq: 0.001, speed: 0.0003, alpha: 0.15 }, // Igneous Red
        { color: '#E8A838', amp: 60, freq: 0.0015, speed: 0.0002, alpha: 0.1 }, // Radiant Gold
        { color: '#0070FF', amp: 30, freq: 0.002, speed: 0.0004, alpha: 0.12 }, // Stratigraphic Blue
        { color: '#E8A838', amp: 80, freq: 0.0008, speed: 0.0001, alpha: 0.08 }, // Deep Ochre
      ];

      layers.forEach((layer, i) => {
        const yBase = h * 0.4 + (i * 100);
        ctx.beginPath();
        ctx.moveTo(0, yBase);
        
        for (let x = 0; x <= w; x += 5) {
          const noise = Math.sin(x * layer.freq + time * layer.speed) * layer.amp +
                       Math.cos(x * layer.freq * 0.5 + time * layer.speed * 0.8) * layer.amp * 0.5;
          ctx.lineTo(x, yBase + noise);
        }
        
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        
        ctx.fillStyle = layer.color;
        ctx.globalAlpha = layer.alpha;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      });

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
      style={{ opacity: 0.6 }}
    />
  );
};

// ==================== SECTION HEADER ====================
const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex items-center gap-4 mb-12">
    <h2 className="text-2xl font-bold tracking-tight uppercase border-b-2 border-soul-primary pb-2">
      {children}
    </h2>
    <div className="flex-1 h-[1px] bg-white/10" />
  </div>
);

// ==================== MAIN SOUL SITE ====================
const SoulSite: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F5F0] font-sans selection:bg-soul-primary selection:text-black">
      <GeologicalHero />

      {/* Header / Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 flex justify-between items-start pointer-events-none">
        <div className="pointer-events-auto">
          <div className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-soul-primary flex items-center justify-center text-black font-bold text-sm transition-transform group-hover:rotate-90">
              Λ
            </div>
            <span className="font-bold tracking-widest text-sm uppercase opacity-60 group-hover:opacity-100 transition-opacity">
              ARIF-FAZIL.COM
            </span>
          </div>
        </div>
        <div className="pointer-events-auto text-right">
          <AgeClock />
          <div className="mt-2 flex gap-4 justify-end text-xs opacity-40 hover:opacity-100 transition-opacity">
            <a href="https://t.me/ariffazil" className="hover:text-soul-primary">TELEGRAM</a>
            <a href="https://linkedin.com/in/muhammad-arif-bin-fazil" className="hover:text-soul-primary">LINKEDIN</a>
            <a href="https://github.com/ariffazil" className="hover:text-soul-primary">GITHUB</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <motion.section 
        style={{ opacity: heroOpacity }}
        className="relative h-screen flex flex-col justify-center px-6 md:px-24"
      >
        <div className="max-w-4xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-6xl md:text-9xl font-bold tracking-tighter leading-none mb-6">
              ARIF <br />
              <span className="text-soul-primary">FAZIL</span>
            </h1>
            <p className="text-xl md:text-2xl font-medium tracking-tight max-w-2xl opacity-80 leading-relaxed">
              Senior/Lead Exploration Geoscientist at PETRONAS. <br />
              Founder of arifOS. Architect of Constitutional AI Governance.
            </p>
            <div className="mt-12 flex flex-wrap gap-x-8 gap-y-4 text-sm font-mono text-soul-primary">
              <span className="flex items-center gap-2"><MapPin size={14} /> KUALA LUMPUR, MY</span>
              <span className="flex items-center gap-2"><Briefcase size={14} /> 13+ YEARS EXP</span>
              <span className="flex items-center gap-2"><Award size={14} /> 100% DISCOVERY RATE</span>
            </div>
          </motion.div>
        </div>
        
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-20 animate-bounce">
          <ChevronDown size={32} />
        </div>
      </motion.section>

      {/* Main Content */}
      <main className="relative z-10 px-6 md:px-24 py-24 bg-[#0A0A0A] shadow-[0_-50vh_100vh_#0A0A0A]">
        <div className="max-w-5xl mx-auto">
          
          {/* Bio / Narrative */}
          <section className="mb-32">
            <SectionTitle>The Human Anchor</SectionTitle>
            <div className="grid md:grid-cols-12 gap-12">
              <div className="md:col-span-8 text-xl md:text-2xl leading-relaxed opacity-90 space-y-8">
                <p>
                  I read the Earth's quiet signals. For over a decade, I've interpreted the fragmented 
                  subsurface of Peninsular Malaysia to make high-stakes investment decisions under 
                  profound physical uncertainty.
                </p>
                <p>
                  This discipline—rigorous grounding, calibrated humility, and the necessity of 
                  verifiable truth—is what birthed <span className="text-soul-primary font-bold">arifOS</span>. 
                  I bridge the physical reality of geoscience with the digital governance of autonomous systems.
                </p>
              </div>
              <div className="md:col-span-4 space-y-6">
                <div className="p-6 border border-white/5 bg-white/[0.02]">
                  <h4 className="text-xs font-mono text-soul-primary mb-4 uppercase">Current Focus</h4>
                  <ul className="text-sm space-y-3 opacity-70">
                    <li>Subsurface Prospect Maturation</li>
                    <li>Constitutional AI Governance</li>
                    <li>Event-Sourced Agent Runtimes</li>
                    <li>Subsurface Inverse Modelling</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Discoveries */}
          <section className="mb-32">
            <SectionTitle>Field Discoveries</SectionTitle>
            <div className="grid md:grid-cols-2 gap-px bg-white/5 border border-white/5">
              {tokens.discoveries.map((discovery, i) => (
                <div key={i} className="bg-[#0A0A0A] p-8 hover:bg-white/[0.02] transition-colors group">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold group-hover:text-soul-primary transition-colors">{discovery.name}</h3>
                    <Target size={16} className="text-soul-primary opacity-40" />
                  </div>
                  <p className="text-xs font-mono text-soul-primary mb-4 opacity-60 uppercase">{discovery.type}</p>
                  <p className="text-sm opacity-60 leading-relaxed">{discovery.significance}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Articles */}
          <section className="mb-32">
            <SectionTitle>Writings & Theory</SectionTitle>
            <div className="space-y-4">
              {tokens.articles.map((article, i) => (
                <a 
                  key={i} 
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-6 border border-white/5 hover:border-soul-primary/30 hover:bg-white/[0.01] transition-all group"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-mono text-xs opacity-20">0{i+1}</span>
                    <h3 className="text-lg md:text-xl font-medium group-hover:translate-x-2 transition-transform">{article.title}</h3>
                  </div>
                  <ExternalLink size={18} className="opacity-20 group-hover:opacity-100 group-hover:text-soul-primary transition-all" />
                </a>
              ))}
            </div>
          </section>

          {/* Trinity Call to Action */}
          <section className="mb-32 p-12 border-2 border-soul-primary/20 bg-soul-primary/[0.02] relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 italic">"Ditempa Bukan Diberi"</h2>
              <p className="max-w-2xl text-lg opacity-70 mb-12">
                The arifOS ecosystem is a constitutional network for governed intelligence. 
                Explore the Mind and Body rings.
              </p>
              <div className="flex flex-wrap gap-6">
                <a href="https://arifos.arif-fazil.com" className="px-8 py-4 bg-soul-primary text-black font-bold hover:scale-105 transition-transform flex items-center gap-2">
                  <Cpu size={18} /> EXPLORE MIND RING
                </a>
                <a href="https://aaa.arif-fazil.com" className="px-8 py-4 border border-soul-primary text-soul-primary font-bold hover:bg-soul-primary/10 transition-all">
                  VIEW BODY RUNTIME
                </a>
              </div>
            </div>
            <div className="absolute top-0 right-0 text-[20rem] font-bold text-soul-primary opacity-[0.03] translate-x-1/4 -translate-y-1/4 select-none">
              Λ
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="px-6 md:px-24 py-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-mono opacity-40">
        <div>© 2026 MUHAMMAD ARIF BIN FAZIL. ALL RIGHTS RESERVED.</div>
        <div className="flex gap-8">
          <a href="mailto:arifbfazil@gmail.com" className="hover:text-soul-primary transition-colors">EMAIL</a>
          <a href="https://linkedin.com/in/muhammad-arif-bin-fazil" className="hover:text-soul-primary transition-colors">LINKEDIN</a>
          <a href="https://github.com/ariffazil" className="hover:text-soul-primary transition-colors">GITHUB</a>
        </div>
        <div className="text-soul-primary font-bold uppercase tracking-widest">arifOS v54.1-SEAL</div>
      </footer>
    </div>
  );
};

export default SoulSite;
