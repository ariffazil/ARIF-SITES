/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        border: "#222222",
        input: "#111111",
        ring: "#00FF41",
        background: "#050505",
        foreground: "#F0F0F0",
        
        // FORGE Palette (Industrial Brutalist)
        forge: {
          black: "#050505",
          steel: "#111111",
          iron: "#222222",
          dim: "#8A8D91",
          white: "#F0F0F0",
          orange: "#FF4500", // Forge Orange
          green: "#00FF41",  // Phosphor Green
          red: "#FF003C",    // Hazard Red
        },

        primary: {
          DEFAULT: "#F0F0F0",
          foreground: "#050505",
        },
        secondary: {
          DEFAULT: "#111111",
          foreground: "#F0F0F0",
        },
        muted: {
          DEFAULT: "#111111",
          foreground: "#8A8D91",
        },
        accent: {
          DEFAULT: "#FF4500",
          foreground: "#F0F0F0",
        },
      },
      fontFamily: {
        display: ['"Cabinet Grotesk"', '"Space Grotesk"', 'sans-serif'],
        header: ['"Cabinet Grotesk"', 'sans-serif'],
        body: ['"Satoshi"', '"Space Grotesk"', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"IBM Plex Mono"', 'monospace'],
        technical: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        none: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        xl: "0px",
      },
      borderWidth: {
        DEFAULT: '1px',
        '2': '2px',
        '3': '3px',
      },
      boxShadow: {
        'brutalist': '4px 4px 0px 0px #222222',
        'brutalist-hover': '2px 2px 0px 0px #222222',
        'glow-green': '0 0 15px rgba(0, 255, 65, 0.3)',
        'glow-orange': '0 0 15px rgba(255, 69, 0, 0.3)',
      },
      keyframes: {
        "scanline": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
        "flicker": {
          "0%": { opacity: "0.97" },
          "5%": { opacity: "0.9" },
          "10%": { opacity: "0.97" },
          "15%": { opacity: "1" },
          "70%": { opacity: "0.98" },
          "80%": { opacity: "0.9" },
          "90%": { opacity: "0.99" },
          "100%": { opacity: "1" },
        },
        "glitch": {
          "0%": { transform: "translate(0)" },
          "20%": { transform: "translate(-2px, 2px)" },
          "40%": { transform: "translate(-2px, -2px)" },
          "60%": { transform: "translate(2px, 2px)" },
          "80%": { transform: "translate(2px, -2px)" },
          "100%": { transform: "translate(0)" },
        }
      },
      animation: {
        "scanline": "scanline 8s linear infinite",
        "flicker": "flicker 0.15s infinite",
        "glitch": "glitch 0.5s infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
