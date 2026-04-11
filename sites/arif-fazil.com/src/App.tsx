// SOUL Ring - arif-fazil.com
// THE RED REDESIGN - v3.0
// High Contrast | Aligned | Professional

import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, ChevronDown, ExternalLink, Globe, Shield
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
    <div className="font-mono text-sm tracking-widest text-[#FF3333] border border-[#FF3333]/30 px-4 py-1 rounded-full bg-[#FF3333]/5 flex items-center gap-3">
      <div className="w-2 h-2 rounded-full bg-[#FF3333] animate-pulse" />
      <span>{age}</span>
    </div>
  );
};

// ==================== RED STRATA BACKGROUND ====================
const RedStrata: React.FC = () => {
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
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);

      // Red Igneous Layers
      const layers = [
        { color: '#FF0000', amp: 50, freq: 0.001, speed: 0.0005, alpha: 0.15 },
        { color: '#CC0000', amp: 70, freq: 0.0015, speed: 0.0003, alpha: 0.1 },
        { color: '#990000', amp: 40, freq: 0.002, speed: 0.0006, alpha: 0.12 },
        { color: '#FF3333', amp: 90, freq: 0.0008, speed: 0.0002, alpha: 0.08 },
      ];

      layers.forEach((layer) => {
        ctx.beginPath();
        const yBase = h * 0.5;
        ctx.moveTo(0, yBase);
        for (let x = 0; x <= w; x += 10) {
          const noise = Math.sin(x * layer.freq + time * layer.speed) * layer.amp;
          ctx.lineTo(x, yBase + noise + (layers.indexOf(layer) * 100));
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fillStyle = layer.color;
        ctx.globalAlpha = layer.alpha;
        ctx.fill();
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

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-40 pointer-events-none" />;
};

// ==================== ALIGNED RED BUTTON ====================
const RedButton: React.FC<{ children: React.ReactNode; href?: string; variant?: 'solid' | 'outline'; onClick?: () => void }> = ({ children, href, variant = 'solid', onClick }) => {
  const baseClass = "px-8 py-4 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center gap-3 active:scale-95";
  const variants = {
    solid: "bg-[#FF3333] text-black hover:bg-white hover:text-black",
    outline: "border border-[#FF3333] text-[#FF3333] hover:bg-[#FF3333] hover:text-black"
  };

  if (href) {
    return <a href={href} className={`${baseClass} ${variants[variant]}`}>{children}</a>;
  }
  return <button onClick={onClick} className={`${baseClass} ${variants[variant]}`}>{children}</button>;
};

// ==================== MAIN SITE ====================
const SoulSite: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-[#FF3333] selection:text-black overflow-x-hidden">
      <RedStrata />

      {/* FIXED HEADER */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-8 flex flex-col md:flex-row justify-between items-center gap-6 mix-blend-difference">
        <div className="flex items-center gap-4 group cursor-pointer">
          <div className="w-10 h-10 bg-[#FF3333] flex items-center justify-center text-black font-bold text-xl group-hover:rotate-180 transition-transform duration-500">
            Λ
          </div>
          <span className="text-sm font-bold tracking-[0.3em] uppercase">ARIF-FAZIL</span>
        </div>
        <AgeClock />
      </nav>

      {/* HERO SECTION */}
      <motion.section 
        style={{ opacity: heroOpacity }}
        className="relative h-screen flex flex-col justify-center items-center text-center px-6"
      >
        <div className="max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="text-[#FF3333] text-xs font-bold tracking-[0.5em] uppercase mb-8">
              Forged, Not Given — ΔΩΨ
            </div>
            <h1 className="text-7xl md:text-[12rem] font-bold tracking-tighter leading-[0.8] mb-12">
              ARIF <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-b from-[#FF3333] to-[#660000]">FAZIL</span>
            </h1>
            <p className="text-lg md:text-xl font-medium tracking-tight max-w-3xl mx-auto opacity-60 leading-relaxed mb-16">
              Senior Exploration Geoscientist @ PETRONAS. <br />
              Architect of Constitutional AI Governance. Founder of arifOS.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <RedButton href="#about">The Human Anchor</RedButton>
              <RedButton href="#discoveries" variant="outline">Field Discoveries</RedButton>
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-12 opacity-20"
        >
          <ChevronDown size={32} />
        </motion.div>
      </motion.section>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 bg-black border-t border-white/5">
        
        {/* NARRATIVE SECTION */}
        <section id="about" className="py-32 px-6 md:px-24">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-24 items-start">
            <div>
              <div className="text-[#FF3333] text-xs font-bold tracking-[0.3em] uppercase mb-12 flex items-center gap-4">
                <div className="w-12 h-[1px] bg-[#FF3333]" />
                Identity
              </div>
              <h2 className="text-4xl md:text-6xl font-bold mb-12 leading-tight">
                Listening to the <span className="text-[#FF3333]">Earth</span>.
              </h2>
              <div className="space-y-8 text-xl opacity-70 leading-relaxed">
                <p>
                  I bridge the physical truth of the subsurface with digital governance. 
                  13+ years interpreting the Malay Basin has taught me one thing: 
                  <strong> truth is hard-won.</strong>
                </p>
                <p>
                  This discipline of rigorous verification and calibrated humility gave birth to 
                  <span className="text-white border-b border-[#FF3333]"> arifOS</span>—a constitutional 
                  framework for agentic safety.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-12">
              <div className="p-8 border border-[#FF3333]/20 bg-[#FF3333]/5">
                <div className="text-5xl font-bold text-[#FF3333] mb-2">100%</div>
                <div className="text-xs font-bold tracking-widest uppercase opacity-40">Discovery Rate</div>
              </div>
              <div className="p-8 border border-white/10 bg-white/5">
                <div className="text-5xl font-bold mb-2">13+</div>
                <div className="text-xs font-bold tracking-widest uppercase opacity-40">Years Experience</div>
              </div>
            </div>
          </div>
        </section>

        {/* DISCOVERIES SECTION */}
        <section id="discoveries" className="py-32 px-6 md:px-24 border-t border-white/5 bg-[#050505]">
          <div className="max-w-6xl mx-auto">
            <div className="text-[#FF3333] text-xs font-bold tracking-[0.3em] uppercase mb-16">
              Major Discoveries
            </div>
            <div className="grid md:grid-cols-2 gap-1">
              {tokens.discoveries.map((d, i) => (
                <div key={i} className="group p-12 border border-white/5 hover:border-[#FF3333]/50 transition-all duration-500 hover:bg-[#FF3333]/5">
                  <div className="flex justify-between items-start mb-8">
                    <h3 className="text-2xl font-bold tracking-tight">{d.name}</h3>
                    <Target size={20} className="text-[#FF3333] opacity-40 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-xs font-mono text-[#FF3333] mb-4 tracking-[0.2em]">{d.type}</div>
                  <p className="opacity-50 text-sm leading-relaxed">{d.significance}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WRITINGS SECTION */}
        <section className="py-32 px-6 md:px-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-[#FF3333] text-xs font-bold tracking-[0.3em] uppercase mb-16">
              Theory & Writings
            </div>
            <div className="space-y-4">
              {tokens.articles.map((a, i) => (
                <a key={i} href={a.url} className="flex flex-col md:flex-row md:items-center justify-between p-10 border border-white/5 hover:border-[#FF3333] transition-all group relative overflow-hidden">
                  <div className="relative z-10">
                    <div className="text-[10px] font-mono opacity-30 mb-2">0{i+1}</div>
                    <h3 className="text-2xl font-medium group-hover:text-[#FF3333] transition-colors">{a.title}</h3>
                  </div>
                  <ExternalLink className="relative z-10 opacity-20 group-hover:opacity-100 group-hover:text-[#FF3333] transition-all" />
                  <div className="absolute inset-0 bg-[#FF3333] translate-y-full group-hover:translate-y-[98%] transition-transform duration-500 opacity-10" />
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* TRINITY PORTAL */}
        <section className="py-32 px-6 md:px-24 bg-[#FF3333] text-black">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-5xl md:text-8xl font-bold tracking-tighter mb-12">
              DITEMPA <br /> BUKAN DIBERI
            </h2>
            <p className="text-xl font-bold uppercase tracking-widest mb-16 opacity-70">
              Forged, Not Given. The arifOS Trinity.
            </p>
            <div className="flex flex-wrap justify-center gap-8">
              <a href="https://arifos.arif-fazil.com" className="flex items-center gap-4 px-10 py-6 border-2 border-black hover:bg-black hover:text-[#FF3333] transition-all font-bold uppercase text-sm tracking-widest">
                <Globe size={20} /> Mind Ring (Emerald)
              </a>
              <a href="https://aaa.arif-fazil.com" className="flex items-center gap-4 px-10 py-6 border-2 border-black hover:bg-black hover:text-[#FF3333] transition-all font-bold uppercase text-sm tracking-widest">
                <Shield size={20} /> Body Ring (Cobalt)
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="p-12 text-center text-[10px] font-mono tracking-[0.4em] opacity-30 uppercase border-t border-white/5">
        © 2026 MUHAMMAD ARIF BIN FAZIL // Constitutional Version: arifOS v54.1-SEAL
      </footer>
    </div>
  );
};

export default SoulSite;
