// TrinityLogo.tsx - Shared across all three sites
// The "A" logo with blue (APPS), yellow (THEORY), red (HUMAN) segments

/** @jsxImportSource react */
import React from 'react';

interface TrinityLogoProps {
  variant: 'human' | 'theory' | 'apps';
  size?: number;
  className?: string;
}

export function TrinityLogo({ variant, size = 120, className = '' }: TrinityLogoProps) {
  const colors = {
    human: {
      top: '#8B0000',
      left: '#FF2D2D', 
      right: '#CC0000',
      center: '#FF2D2D',
      glow: 'rgba(255, 45, 45, 0.4)',
    },
    theory: {
      top: '#FFD700',
      left: '#D4AF37',
      right: '#B8860B', 
      center: '#FFD700',
      glow: 'rgba(255, 215, 0, 0.4)',
    },
    apps: {
      top: '#06B6D4',
      left: '#0891B2',
      right: '#0E7490',
      center: '#22D3EE',
      glow: 'rgba(6, 182, 212, 0.4)',
    },
  };

  const c = colors[variant];

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 200 200" 
      className={className}
      style={{ filter: `drop-shadow(0 0 20px ${c.glow})` }}
    >
      <defs>
        <linearGradient id={`top-${variant}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={c.top} />
          <stop offset="100%" stopColor={c.center} />
        </linearGradient>
        <linearGradient id={`left-${variant}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={c.left} />
          <stop offset="100%" stopColor={c.center} />
        </linearGradient>
        <linearGradient id={`right-${variant}`} x1="100%" y1="0%" x2="0%" y2="0%">
          <stop offset="0%" stopColor={c.right} />
          <stop offset="100%" stopColor={c.center} />
        </linearGradient>
        <linearGradient id={`center-${variant}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={c.top} />
          <stop offset="50%" stopColor={c.center} />
          <stop offset="100%" stopColor={c.left} />
        </linearGradient>
        <filter id={`glow-${variant}`}>
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      
      {/* Outer A shape - stylized */}
      <path 
        d="M100 15 L180 170 L140 170 L120 130 L80 130 L60 170 L20 170 Z" 
        fill="none" 
        stroke={`url(#center-${variant})`} 
        strokeWidth="3"
        opacity="0.8"
      />
      
      {/* Inner A - solid */}
      <path 
        d="M100 40 L150 150 L125 150 L110 120 L90 120 L75 150 L50 150 Z" 
        fill={`url(#center-${variant})`}
        opacity="0.9"
      />
      
      {/* Center hexagon - the nexus */}
      <polygon 
        points="100,75 115,95 115,115 100,125 85,115 85,95" 
        fill={`url(#center-${variant})`}
        filter={`url(#glow-${variant})`}
      >
        <animate 
          attributeName="opacity" 
          values="0.8;1;0.8" 
          dur="3s" 
          repeatCount="indefinite"
        />
      </polygon>
      
      {/* Circuit lines - tech aesthetic */}
      <line x1="100" y1="125" x2="100" y2="150" stroke={c.center} strokeWidth="2" opacity="0.6" />
      <line x1="85" y1="115" x2="60" y2="130" stroke={c.left} strokeWidth="2" opacity="0.6" />
      <line x1="115" y1="115" x2="140" y2="130" stroke={c.right} strokeWidth="2" opacity="0.6" />
      
      {/* Trinity dots */}
      <circle cx="100" cy="100" r="4" fill={c.center}>
        <animate attributeName="r" values="4;6;4" dur="2s" repeatCount="indefinite" />
      </circle>
      <circle cx="85" cy="105" r="3" fill={c.left} opacity="0.8" />
      <circle cx="115" cy="105" r="3" fill={c.right} opacity="0.8" />
      
      {/* Binary accent */}
      <text x="145" y="165" fontSize="8" fill={c.right} opacity="0.4" fontFamily="JetBrains Mono">101</text>
      <text x="40" y="165" fontSize="8" fill={c.left} opacity="0.4" fontFamily="JetBrains Mono">010</text>
    </svg>
  );
}

export function DitempaBadge({ variant }: { variant: 'human' | 'theory' | 'apps' }) {
  const colors = {
    human: 'text-red-400 border-red-500/30 bg-red-950/20',
    theory: 'text-yellow-400 border-yellow-500/30 bg-yellow-950/20',
    apps: 'text-cyan-400 border-cyan-500/30 bg-cyan-950/20',
  };

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${colors[variant]} text-xs font-mono tracking-wider`}>
      <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ 
        backgroundColor: variant === 'human' ? '#FF2D2D' : variant === 'theory' ? '#FFD700' : '#06B6D4'
      }} />
      DITEMPA BUKAN DIBERI
    </div>
  );
}

export function SiteSwitcher({ current }: { current: 'human' | 'theory' | 'apps' }) {
  const sites = [
    { id: 'human', label: 'HUMAN', href: 'https://arif-fazil.com', color: 'red' },
    { id: 'theory', label: 'THEORY', href: 'https://apex.arif-fazil.com', color: 'yellow' },
    { id: 'apps', label: 'APPS', href: 'https://arifos.arif-fazil.com', color: 'cyan' },
  ];

  const colorClasses: Record<string, { active: string; inactive: string }> = {
    red: {
      active: 'bg-red-500/20 text-red-400 border-red-500/30',
      inactive: 'text-red-400/60 hover:bg-red-950/20 hover:text-red-400 border-transparent',
    },
    yellow: {
      active: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      inactive: 'text-yellow-400/60 hover:bg-yellow-950/20 hover:text-yellow-400 border-transparent',
    },
    cyan: {
      active: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      inactive: 'text-cyan-400/60 hover:bg-cyan-950/20 hover:text-cyan-400 border-transparent',
    },
  };

  return (
    <div className="flex items-center gap-1 bg-black/30 rounded-full px-1.5 py-1.5 border border-gray-800">
      {sites.map((site) => {
        const isActive = current === site.id;
        const classes = colorClasses[site.color];
        return (
          <a
            key={site.id}
            href={site.href}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
              isActive ? classes.active : classes.inactive
            }`}
          >
            {site.label}
          </a>
        );
      })}
    </div>
  );
}
