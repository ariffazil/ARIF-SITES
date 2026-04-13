// arif-fazil.com — Rewritten 2026-04-13
// Proof first. Philosophy second. Human first. arifOS second.

import React, { useState, useEffect, useRef } from 'react';
import { Target, ChevronDown, ExternalLink } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';
import tokens from '@/constitution/tokens';

// ==================== SOUL COLOR SYSTEM ====================
// Simplified: gold as single accent, earth as secondary, blood as structural only
const SOUL = {
  gold:        '#C9A84C',   // Primary accent — used sparingly
  goldDim:     '#8B7440',   // Subdued gold — hover states, borders
  earth:       '#6B4D2E',   // Earth brown — headings, structural
  earthLight:  '#8B6B42',   // Lighter earth — secondary text
  blood:       '#5C2A2A',   // Muted blood — structural only (not primary)
  bloodLight:  '#7A3A3A',   // Softer red — tertiary accents
  bg:          '#0C0E12',   // Primary surface
  bgSecondary: '#141620',   // Elevated surface
  bgTertiary:  '#1A1D26',   // Card backgrounds
  border:      '#2A2E3A',   // Structural lines
  text:        '#E8E4DF',   // Primary text
  textMuted:   '#8B8880',   // Secondary text
  textDim:     '#5A5850',   // Tertiary text
} as const;

// ==================== FRACTAL BIOLOGICAL CLOCK ====================
const AgeClock: React.FC = () => {
  const [age, setAge] = useState<string>('');
  
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

  return (
    <div 
      className="font-mono text-xs tracking-[0.2em] uppercase px-4 py-2"
      style={{
        background: `${SOUL.goldDim}15`,
        border: `1px solid ${SOUL.goldDim}40`,
        color: SOUL.textMuted,
      }}
    >
      <span>{age}</span>
      <span className="ml-2 opacity-50">YEARS</span>
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

    const noise = (x: number, y: number, t: number) => {
      return Math.sin(x * 0.01 + t) * 0.5 +
             Math.sin(x * 0.02 - t * 0.3) * 0.25 +
             Math.cos(y * 0.015 + t * 0.7) * 0.25;
    };

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      
      ctx.fillStyle = SOUL.bg;
      ctx.fillRect(0, 0, w, h);

      // Subtle earth-tone strata layers — reduced opacity, not dominant
      const layers = [
        { color: SOUL.earth,     amp: 60,  freq: 0.008, speed: 0.0008, yOffset: 0.35, alpha: 0.06 },
        { color: SOUL.earthLight, amp: 45, freq: 0.012, speed: 0.001,  yOffset: 0.55, alpha: 0.05 },
        { color: SOUL.goldDim,   amp: 80,  freq: 0.006, speed: 0.0005, yOffset: 0.45, alpha: 0.03 },
      ];

      layers.forEach((layer) => {
        ctx.beginPath();
        const yBase = h * layer.yOffset;
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 5) {
          const n = noise(x, yBase, time * layer.speed);
          const jagged = Math.sin(x * layer.freq * 3 + time * layer.speed * 2) * 15;
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

      // Sparse gold particles — restrained
      ctx.globalAlpha = 0.4;
      for (let i = 0; i < 20; i++) {
        const x = (Math.sin(i * 137.5 + time * 0.001) * 0.5 + 0.5) * w;
        const y = (Math.cos(i * 73.3 + time * 0.0008) * 0.5 + 0.5) * h;
        const size = (Math.sin(i + time * 0.01) + 1) * 1.2;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = SOUL.goldDim;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
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
      style={{ opacity: 0.7 }}
    />
  );
};

// ==================== JAGGED BUTTON ====================
const JaggedButton: React.FC<{ 
  children: React.ReactNode; 
  href?: string; 
  variant?: 'solid' | 'outline' | 'ghost';
  onClick?: () => void;
}> = ({ children, href, variant = 'solid', onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const variants = {
    solid: {
      bg: isHovered ? SOUL.goldDim : SOUL.gold,
      color: '#0C0E12',
    },
    outline: {
      bg: isHovered ? `${SOUL.goldDim}15` : 'transparent',
      color: SOUL.gold,
    },
    ghost: {
      bg: 'transparent',
      color: SOUL.textMuted,
    },
  };

  const style = variants[variant];
  
  const content = (
    <span
      className="px-6 py-3 text-xs font-bold tracking-[0.2em] uppercase transition-all duration-200 inline-block"
      style={{
        background: style.bg,
        color: style.color,
        border: variant === 'outline' ? `1px solid ${SOUL.goldDim}` : undefined,
        clipPath: 'polygon(0 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 6px 100%, 0 calc(100% - 6px))',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}
    </span>
  );

  if (href) return <a href={href} className="inline-block no-underline">{content}</a>;
  return <button onClick={onClick} className="inline-block border-none cursor-pointer">{content}</button>;
};

// ==================== DISCOVERY CARD ====================
const DiscoveryCard: React.FC<{
  name: string;
  playType: string;
  role: string;
  significance: string;
  capability: string;
  index: number;
}> = ({ name, playType, role, significance, capability, index }) => {
  const [isHovered, setIsHovered] = useState(false);
  const colors = [SOUL.gold, SOUL.earth, SOUL.goldDim, SOUL.earthLight];
  const accent = colors[index % colors.length];

  return (
    <div
      className="p-6 md:p-8 transition-all duration-300 relative"
      style={{
        background: isHovered ? `${accent}08` : SOUL.bgTertiary,
        border: `1px solid ${isHovered ? accent : SOUL.border}`,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div 
        className="absolute top-0 left-0 h-[2px] transition-all duration-300"
        style={{
          background: accent,
          width: isHovered ? '100%' : '0%',
        }}
      />
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-base font-bold tracking-tight" style={{ color: SOUL.text }}>
          {name}
        </h3>
        <Target 
          size={16} 
          style={{ color: accent, opacity: isHovered ? 1 : 0.4 }} 
        />
      </div>
      
      <div className="text-[10px] font-mono tracking-widest uppercase mb-3" style={{ color: accent }}>
        {playType}
      </div>
      
      <p className="text-sm leading-relaxed mb-4" style={{ color: SOUL.textMuted }}>
        {significance}
      </p>

      <div className="pt-4 border-t" style={{ borderColor: `${accent}20` }}>
        <div className="text-[10px] tracking-widest uppercase mb-1" style={{ color: SOUL.textDim }}>
          Role
        </div>
        <div className="text-xs mb-3" style={{ color: SOUL.textMuted }}>
          {role}
        </div>
        <div className="text-[10px] tracking-widest uppercase mb-1" style={{ color: SOUL.textDim }}>
          Capability proven
        </div>
        <div className="text-xs" style={{ color: accent }}>
          {capability}
        </div>
      </div>
    </div>
  );
};

// ==================== STAT ROW ====================
const StatRow: React.FC<{ value: string; label: string; accent?: string }> = ({ 
  value, label, accent = SOUL.gold 
}) => (
  <div className="flex items-baseline gap-4 py-3 border-b" style={{ borderColor: SOUL.border }}>
    <span className="text-3xl font-bold" style={{ color: accent }}>{value}</span>
    <span className="text-sm" style={{ color: SOUL.textMuted }}>{label}</span>
  </div>
);

// ==================== EXPERIENCE ITEM ====================
const ExperienceItem: React.FC<{
  company: string; period: string; summary: string; skills: readonly string[];
}> = ({ company, period, summary, skills }) => (
  <div className="mb-10">
    <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-3 gap-2">
      <h3 className="text-base font-bold" style={{ color: SOUL.text }}>{company}</h3>
      <span className="text-xs font-mono" style={{ color: SOUL.goldDim }}>{period}</span>
    </div>
    <p className="text-sm leading-relaxed mb-4" style={{ color: SOUL.textMuted }}>{summary}</p>
    <div className="flex flex-wrap gap-2">
      {skills.map((skill) => (
        <span 
          key={skill}
          className="text-[10px] px-2 py-1 font-mono tracking-wider"
          style={{ 
            background: `${SOUL.goldDim}10`, 
            color: SOUL.goldDim,
            border: `1px solid ${SOUL.goldDim}30`,
          }}
        >
          {skill}
        </span>
      ))}
    </div>
  </div>
);

// ==================== ARTICLE ROW ====================
const ArticleRow: React.FC<{ title: string; url: string; index: number }> = ({ 
  title, url, index 
}) => (
  <a 
    href={url} 
    target="_blank" 
    rel="noopener noreferrer"
    className="flex items-center justify-between p-5 transition-all duration-200 group no-underline"
    style={{
      border: `1px solid ${SOUL.border}`,
      background: 'transparent',
    }}
    onMouseEnter={e => {
      (e.currentTarget as HTMLElement).style.background = `${SOUL.goldDim}08`;
      (e.currentTarget as HTMLElement).style.borderColor = SOUL.goldDim;
    }}
    onMouseLeave={e => {
      (e.currentTarget as HTMLElement).style.background = 'transparent';
      (e.currentTarget as HTMLElement).style.borderColor = SOUL.border;
    }}
  >
    <div className="flex items-center gap-4">
      <span className="text-xs font-mono" style={{ color: SOUL.textDim }}>
        {String(index).padStart(2, '0')}
      </span>
      <span className="text-sm" style={{ color: SOUL.text }}>{title}</span>
    </div>
    <ExternalLink size={14} style={{ color: SOUL.goldDim, opacity: 0.5 }} />
  </a>
);

// ==================== SECTION HEADER ====================
const SectionHeader: React.FC<{ 
  label: string; 
  title: React.ReactNode;
  accent?: string;
}> = ({ label, title, accent = SOUL.gold }) => (
  <div className="mb-12">
    <div className="flex items-center gap-3 mb-4">
      <div className="h-[1px] w-8" style={{ background: accent }} />
      <span className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: accent }}>
        {label}
      </span>
    </div>
    <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{ color: SOUL.text }}>
      {title}
    </h2>
  </div>
);

// ==================== MAIN SITE ====================
const SoulSite: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.15], [0, 60]);

  return (
    <div 
      className="min-h-screen overflow-x-hidden"
      style={{ background: SOUL.bg, color: SOUL.text }}
    >
      <FractalStrata />

      {/* ==================== NAV ==================== */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 px-6 py-5 flex justify-between items-center"
        style={{
          background: `linear-gradient(180deg, ${SOUL.bg} 0%, transparent 100%)`,
        }}
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold tracking-[0.2em] uppercase" style={{ color: SOUL.text }}>
            {tokens.identity.name}
          </span>
          <span className="text-xs hidden sm:inline" style={{ color: SOUL.textDim }}>
            ·
          </span>
          <span className="text-xs hidden sm:inline" style={{ color: SOUL.textMuted }}>
            {tokens.identity.title}
          </span>
        </div>
        <AgeClock />
      </nav>

      {/* ==================== HERO ==================== */}
      <motion.section 
        style={{ opacity: heroOpacity, y: heroY }}
        className="relative min-h-screen flex flex-col justify-center px-6 md:px-12 lg:px-24"
      >
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Label */}
            <div className="flex items-center gap-3 mb-6">
              <div className="h-[1px] w-8" style={{ background: SOUL.gold }} />
              <span className="text-[10px] font-mono tracking-[0.3em] uppercase" style={{ color: SOUL.gold }}>
                {tokens.identity.subtitle}
              </span>
            </div>
            
            {/* Name */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[0.9] mb-8" style={{ color: SOUL.text }}>
              {tokens.identity.name}
            </h1>
            
            {/* Proof line */}
            <p className="text-lg md:text-xl leading-relaxed mb-6 max-w-xl" style={{ color: SOUL.textMuted }}>
              {tokens.atAGlance[0]}. Built track record across structural, stratigraphic, basement, and frontier plays.
            </p>
            
            {/* Tagline */}
            <p 
              className="text-sm mb-10 font-medium"
              style={{ color: SOUL.gold }}
            >
              Ditempa Bukan Diberi — Forged through experience, not given as theory.
            </p>
            
            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <JaggedButton href="#discoveries">Exploration Work</JaggedButton>
              <JaggedButton href="#arifos" variant="outline">arifOS Framework</JaggedButton>
              <JaggedButton href="#writings" variant="ghost">Theory & Writings</JaggedButton>
            </div>
          </motion.div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <ChevronDown size={20} style={{ color: SOUL.textDim }} />
        </motion.div>
      </motion.section>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="relative z-10" style={{ background: SOUL.bg }}>

        {/* ==================== AT A GLANCE ==================== */}
        <section className="py-24 px-6 md:px-12 lg:px-24 border-t" style={{ borderColor: SOUL.border }}>
          <div className="max-w-3xl">
            <SectionHeader 
              label="At a Glance" 
              title={
                <span style={{ color: SOUL.text }}>13+ years in exploration geoscience.</span>
              }
            />
            <div className="space-y-4">
              {tokens.atAGlance.map((item, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-xs mt-1" style={{ color: SOUL.gold }}>◆</span>
                  <p className="text-sm leading-relaxed" style={{ color: SOUL.textMuted }}>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ==================== SELECTED DISCOVERIES ==================== */}
        <section id="discoveries" className="py-24 px-6 md:px-12 lg:px-24 border-t" style={{ borderColor: SOUL.border }}>
          <div className="max-w-5xl">
            <SectionHeader 
              label="Selected Discoveries" 
              title={
                <>
                  <span style={{ color: SOUL.text }}>What the work </span>
                  <span style={{ color: SOUL.gold }}>proves.</span>
                </>
              }
            />
            <div className="grid md:grid-cols-2 gap-4">
              {tokens.discoveries.map((d, i) => (
                <DiscoveryCard
                  key={i}
                  name={d.name}
                  playType={d.playType}
                  role={d.role}
                  significance={d.significance}
                  capability={d.capability}
                  index={i}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FROM GEOLOGY TO GOVERNANCE ==================== */}
        <section className="py-24 px-6 md:px-12 lg:px-24 border-t" style={{ borderColor: SOUL.border }}>
          <div className="max-w-3xl">
            <SectionHeader 
              label="The Bridge" 
              title={
                <>
                  <span style={{ color: SOUL.text }}>From Subsurface to </span>
                  <span style={{ color: SOUL.earth }}>Systems.</span>
                </>
              }
            />
            <div className="space-y-6 text-base leading-relaxed" style={{ color: SOUL.textMuted }}>
              <p>
                Geology taught me something that didn't transfer to software engineering culture:
              </p>
              <p style={{ color: SOUL.text }}>
                <strong>Uncertainty is not a weakness to be hidden.</strong> It is the condition you work in. 
                The discipline is in knowing what your models still can't tell you.
              </p>
              <p>
                Every basin I've worked: incomplete data, conflicting interpretations, high stakes on 
                decisions that can't be unmade. The only professional integrity move is to expose the 
                uncertainty rather than paper over it.
              </p>
              <p>
                When I started building AI systems, I applied the same pressure: don't tell me what 
                the model wants. Tell me what it doesn't know. Don't give me a confident answer when the 
                confidence interval is wider than the question.
              </p>
              <p>
                <span style={{ color: SOUL.gold }}>arifOS started as that discipline in code.</span> Then it 
                became a framework. Then something other people could use.
              </p>
              <p className="text-sm" style={{ color: SOUL.textDim }}>
                The 13 floors are not rules. They are calibrated constraints — the geological equivalent 
                of "I need a pressure gradient and a seismic tie before I'll sign off on this prospect."
              </p>
            </div>
          </div>
        </section>

        {/* ==================== WHAT I'M BUILDING NOW ==================== */}
        <section id="arifos" className="py-24 px-6 md:px-12 lg:px-24 border-t" style={{ borderColor: SOUL.border }}>
          <div className="max-w-5xl">
            <SectionHeader 
              label="What I'm Building Now" 
              title={
                <>
                  <span style={{ color: SOUL.text }}>arifOS: </span>
                  <span style={{ color: SOUL.gold }}>Governed AI Runtime.</span>
                </>
              }
            />
            <div className="grid md:grid-cols-2 gap-16 items-start">
              {/* Left: explanation */}
              <div className="space-y-5 text-sm leading-relaxed" style={{ color: SOUL.textMuted }}>
                <p>
                  arifOS is a self-hosted AI agent framework built around explicit constraints, 
                  not implicit guardrails.
                </p>
                <p>
                  The core design pressure:
                </p>
                <ul className="space-y-2 pl-4">
                  <li>— decisions must be reversible where possible</li>
                  <li>— uncertainty must be stated, not performed</li>
                  <li>— human authority is architectural, not advisory</li>
                  <li>— every action is auditable against an immutable record</li>
                </ul>
                <p>
                  13 constitutional floors (F1–F13) enforce these constraints at runtime. 
                  They are not rules language — they are calibrated enforcement points.
                </p>
                <div className="pt-4">
                  <code className="text-xs font-mono px-3 py-2 block" 
                    style={{ background: SOUL.bgSecondary, color: SOUL.gold, border: `1px solid ${SOUL.border}` }}>
                    pip install arifos
                  </code>
                </div>
                <p className="text-xs" style={{ color: SOUL.textDim }}>
                  arifOS is the consequence of working in high-stakes subsurface decisions. 
                  It is not a startup product. It is a discipline, shipped.
                </p>
              </div>
              
              {/* Right: stats */}
              <div className="space-y-0">
                <StatRow value="17" label="MCP-native tools" accent={SOUL.gold} />
                <StatRow value="13" label="Constitutional floors (F1–F13)" accent={SOUL.earth} />
                <StatRow value="VAULT999" label="Immutable SHA-256 audit ledger" accent={SOUL.goldDim} />
                <StatRow value="AGPL-3.0" label="License · Self-hosted" accent={SOUL.textDim} />
                <div className="pt-4">
                  <div className="flex flex-wrap gap-3">
                    <JaggedButton href="https://arifosmcp.arif-fazil.com" variant="outline">
                      Live Runtime
                    </JaggedButton>
                    <JaggedButton href="https://github.com/ariffazil/arifOS" variant="ghost">
                      GitHub
                    </JaggedButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== EXPERIENCE ==================== */}
        <section className="py-24 px-6 md:px-12 lg:px-24 border-t" style={{ borderColor: SOUL.border }}>
          <div className="max-w-3xl">
            <SectionHeader 
              label="Experience" 
              title={
                <span style={{ color: SOUL.text }}>Where the discipline came from.</span>
              }
            />
            <ExperienceItem
              company={tokens.experience.company}
              period={tokens.experience.period}
              summary={tokens.experience.summary}
              skills={tokens.experience.skills}
            />
            <p className="text-sm italic" style={{ color: SOUL.textDim }}>
              {tokens.experience.closing}
            </p>
          </div>
        </section>

        {/* ==================== EDUCATION ==================== */}
        <section className="py-24 px-6 md:px-12 lg:px-24 border-t" style={{ borderColor: SOUL.border }}>
          <div className="max-w-3xl">
            <SectionHeader 
              label="Education" 
              title={
                <span style={{ color: SOUL.text }}>The dual training.</span>
              }
            />
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-2 mb-2">
                <h3 className="text-base font-bold" style={{ color: SOUL.text }}>
                  {tokens.education.school}
                </h3>
                <span className="text-xs font-mono" style={{ color: SOUL.goldDim }}>
                  {tokens.education.period}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {tokens.education.degrees.map((d) => (
                  <span 
                    key={d}
                    className="text-xs px-2 py-1"
                    style={{ 
                      background: `${SOUL.earth}15`, 
                      color: SOUL.earth,
                      border: `1px solid ${SOUL.earth}30`,
                    }}
                  >
                    {d}
                  </span>
                ))}
              </div>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: SOUL.textMuted }}>
              {tokens.education.summary}
            </p>
          </div>
        </section>

        {/* ==================== THEORY & WRITINGS ==================== */}
        <section id="writings" className="py-24 px-6 md:px-12 lg:px-24 border-t" style={{ borderColor: SOUL.border }}>
          <div className="max-w-3xl">
            <SectionHeader 
              label="Theory & Writings" 
              title={
                <>
                  <span style={{ color: SOUL.text }}>Depth for those who </span>
                  <span style={{ color: SOUL.gold }}>scrolled.</span>
                </>
              }
            />
            <div className="space-y-3">
              {tokens.articles.map((a, i) => (
                <ArticleRow key={i} title={a.title} url={a.url} index={i + 1} />
              ))}
            </div>
          </div>
        </section>

        {/* ==================== FOOTER ==================== */}
        <footer className="py-16 px-6 md:px-12 lg:px-24 border-t" style={{ borderColor: SOUL.border }}>
          <div className="max-w-3xl">
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-8 mb-12">
              <div>
                <div className="text-xl font-bold tracking-tight mb-2" style={{ color: SOUL.text }}>
                  {tokens.identity.name}
                </div>
                <div className="text-sm" style={{ color: SOUL.textMuted }}>
                  {tokens.identity.title}
                </div>
              </div>
              <div className="flex flex-wrap gap-6">
                {[
                  { label: 'GitHub', href: tokens.contact.github },
                  { label: 'arifOS MCP', href: 'https://arifosmcp.arif-fazil.com' },
                  { label: 'GEOX', href: 'https://geox.arif-fazil.com' },
                  { label: 'Medium', href: tokens.contact.medium },
                ].map((link) => (
                  <a 
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs tracking-widest uppercase no-underline transition-opacity hover:opacity-100"
                    style={{ color: SOUL.textDim, opacity: 0.6 }}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            
            <div className="pt-8 border-t" style={{ borderColor: SOUL.border }}>
              <p className="text-xs leading-relaxed max-w-xl" style={{ color: SOUL.textDim }}>
                <strong style={{ color: SOUL.textMuted }}>Disclaimer:</strong> arifOS is a personal 
                initiative. The views and systems presented here are my own and not official statements 
                of my employer.
              </p>
              <div className="flex items-center gap-4 mt-6">
                <span className="text-xs" style={{ color: SOUL.goldDim }}>
                  Ditempa Bukan Diberi
                </span>
                <span style={{ color: SOUL.textDim }}>·</span>
                <span className="text-xs" style={{ color: SOUL.textDim }}>
                  © Muhammad Arif bin Fazil
                </span>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* ==================== FIXED BOTTOM NAV ==================== */}
      <footer 
        className="fixed bottom-0 left-0 right-0 z-50 px-4 py-3"
        style={{
          background: `linear-gradient(0deg, ${SOUL.bg}F5 0%, ${SOUL.bg}CC 100%)`,
          borderTop: `1px solid ${SOUL.border}`,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div className="max-w-7xl mx-auto flex flex-wrap justify-center gap-x-6 gap-y-2">
          {tokens.trinity.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-mono tracking-wider transition-all duration-200 hover:brightness-125 no-underline"
              style={{ color: link.color }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </footer>
    </div>
  );
};

export default SoulSite;
