/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "#1f2733",
        input: "#11151c",
        ring: "#31c48d",
        background: "#0a0c10",
        foreground: "#e6edf3",

        // FORGE Palette (Zen Sovereign — graphite base, muted bronze accent)
        // Token NAMES unchanged; values aligned to /_shared/tokens.css canon.
        forge: {
          black: "#0a0c10",  // graphite base
          steel: "#11151c",  // surface
          iron: "#1f2733",   // hairline
          dim: "#8b98a8",    // warm-gray ink, secondary
          white: "#e6edf3",  // warm-gray ink, primary
          orange: "#b08d57", // editorial bronze (world family accent — was #FF4500)
          gold: "#c9a84c",   // muted gold (quotes / gold family)
          green: "#31c48d",  // STATUS ONLY — seal/live (was phosphor #00FF41)
          red: "#f0506e",    // STATUS ONLY — void/hazard (was #FF003C)
        },

        // PRIMER Palette — MakcikGPT zen black (2026-07-31)
        // Red, blue, yellow as primary accents on pure black
        primer: {
          red: "#e0301e",
          blue: "#1f3fd4",
          yellow: "#f2b705",
          black: "#000000",
          white: "#f0f0f0",
          dim: "#888888",
          line: "#1a1a1a",
          surface: "#0a0a0a",
        },

        primary: {
          DEFAULT: "#e6edf3",
          foreground: "#0a0c10",
        },
        secondary: {
          DEFAULT: "#11151c",
          foreground: "#e6edf3",
        },
        muted: {
          DEFAULT: "#11151c",
          foreground: "#8b98a8",
        },
        accent: {
          DEFAULT: "#b08d57",
          foreground: "#0a0c10",
        },
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', '"Space Grotesk"', 'sans-serif'],
        header: ['"Cabinet Grotesk"', 'sans-serif'],
        body: ['"Satoshi"', '"IBM Plex Sans"', '"Space Grotesk"', 'sans-serif'],
        serif: ['"DM Serif Display"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
        technical: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        none: "0px",
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      borderWidth: {
        DEFAULT: '1px',
        '2': '2px',
        '3': '3px',
      },
      boxShadow: {
        'brutalist': '0 1px 2px rgba(0, 0, 0, 0.4)',
        'brutalist-hover': '0 8px 24px rgba(0, 0, 0, 0.35)',
        'glow-green': '0 0 6px rgba(49, 196, 141, 0.25)',
        'glow-orange': '0 0 6px rgba(176, 141, 87, 0.25)',
      },
      // scanline / flicker / glitch keyframes retired (Zen Sovereign, 2026-07-26) —
      // no component referenced them; the CRT overlay on .site-shell was removed.
    },
  },
  plugins: [require("tailwindcss-animate")],
}
