/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        // Constitutional Domain Colors
        soul: {
          primary: '#c4791a',
          secondary: '#f0e6d3',
          accent: '#8b5a2b',
          void: '#1a1510',
          surface: '#2a2018',
          heat: '#e8a838',
          cool: '#5a4a3a',
        },
        mind: {
          primary: '#d4a853',
          secondary: '#1a1a2e',
          accent: '#b8941f',
          void: '#0a0a14',
          surface: '#151528',
          heat: '#f0d878',
          cool: '#2a2a4e',
        },
        body: {
          primary: '#00d4aa',
          secondary: '#0a0a0f',
          accent: '#00ffcc',
          void: '#050508',
          surface: '#0f1418',
          heat: '#00ffcc',
          cool: '#006b55',
        },
        extension: {
          primary: '#ff6b35',
          secondary: '#2d1b4e',
          accent: '#ff9f6b',
          void: '#1a0f2e',
          surface: '#2d1b4e',
          heat: '#ff9f6b',
          cool: '#8b3d1f',
        },
        field: {
          primary: '#6b8cae',
          secondary: '#c9b037',
          accent: '#4a6b8c',
          void: '#0a1018',
          surface: '#1a2532',
          heat: '#8bb0d0',
          cool: '#3a5a7a',
        },
      },
      fontFamily: {
        header: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Serif"', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
        constitutional: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        xl: "calc(var(--radius) + 4px)",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xs: "calc(var(--radius) - 6px)",
      },
      boxShadow: {
        xs: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        'orthogonal': '0 0 0 1px currentColor',
        'glow-soul': '0 0 20px rgba(196, 121, 26, 0.3)',
        'glow-mind': '0 0 20px rgba(212, 168, 83, 0.3)',
        'glow-body': '0 0 20px rgba(0, 212, 170, 0.3)',
        'glow-extension': '0 0 20px rgba(255, 107, 53, 0.3)',
        'glow-field': '0 0 20px rgba(107, 140, 174, 0.3)',
      },
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '7': 'repeat(7, minmax(0, 1fr))',
        '3': 'repeat(3, minmax(0, 1fr))',
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        "entropy-noise": {
          "0%, 100%": { transform: "translate(0, 0)" },
          "10%": { transform: "translate(-5%, -5%)" },
          "20%": { transform: "translate(-10%, 5%)" },
          "30%": { transform: "translate(5%, -10%)" },
          "40%": { transform: "translate(-5%, 15%)" },
          "50%": { transform: "translate(-10%, 5%)" },
          "60%": { transform: "translate(15%, 0)" },
          "70%": { transform: "translate(0, 10%)" },
          "80%": { transform: "translate(-15%, 0)" },
          "90%": { transform: "translate(10%, 5%)" },
        },
        "quantum-shift": {
          "0%, 100%": { filter: "blur(0px)" },
          "50%": { filter: "blur(0.5px)" },
        },
        "pipeline-pulse": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        "torus-rotate": {
          "0%": { transform: "rotateX(0deg) rotateY(0deg)" },
          "100%": { transform: "rotateX(360deg) rotateY(180deg)" },
        },
        "metabolic-pulse": {
          "0%, 100%": { transform: "scale(1)", opacity: "0.6" },
          "50%": { transform: "scale(1.05)", opacity: "1" },
        },
        "reversibility-forward": {
          "0%": { transform: "scaleX(0)", transformOrigin: "left" },
          "100%": { transform: "scaleX(1)", transformOrigin: "left" },
        },
        "reversibility-backward": {
          "0%": { transform: "scaleX(1)", transformOrigin: "right" },
          "100%": { transform: "scaleX(0)", transformOrigin: "right" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
        "entropy-noise": "entropy-noise 8s steps(10) infinite",
        "quantum-shift": "quantum-shift 30s ease-in-out infinite",
        "pipeline-pulse": "pipeline-pulse 2s ease-in-out infinite",
        "torus-rotate": "torus-rotate 20s linear infinite",
        "metabolic-pulse": "metabolic-pulse 3s ease-in-out infinite",
      },
      backdropBlur: {
        'quantum': '0.5px',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
