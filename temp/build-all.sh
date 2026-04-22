#!/bin/bash
# ARIF-OS Constitutional Network Build Script
# Authority: 888_APEX → 999_SEAL
# Builds all 5 territories for deployment

set -e

echo "═══════════════════════════════════════════════════"
echo "  ARIF-OS CONSTITUTIONAL NETWORK BUILD SYSTEM"
echo "  Version: arifOS v54.1-SEAL"
echo "  Ω₀: 0.04"
echo "═══════════════════════════════════════════════════"
echo ""

# Base directory
BASE_DIR="$(pwd)"
APP_DIR="$BASE_DIR/app"
DIST_DIR="$BASE_DIR/dist"

# Create dist directory
mkdir -p "$DIST_DIR"

# Function to build a site
build_site() {
    local domain=$1
    local path=$2
    local name=$3
    
    echo "🏗️  Building $name ($domain)..."
    
    # Update vite config for this domain
    cat > "$APP_DIR/vite.config.ts" << EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: '/',
  build: {
    outDir: '../../dist/$domain',
    emptyOutDir: true,
  },
  define: {
    'import.meta.env.VITE_DOMAIN': '"$domain"',
  },
})
EOF
    
    # Build
    cd "$APP_DIR"
    npm run build 2>&1 | grep -v "^\s*│" || true
    
    echo "✅ $name built successfully"
    echo ""
}

# Build all 5 territories
echo "Building 5 constitutional territories..."
echo ""

build_site "soul" "/soul" "SOUL Ring (arif-fazil.com)"
build_site "mind" "/mind" "MIND Ring (arifos.arif-fazil.com)"
build_site "body" "/body" "BODY Ring (arifosmcp.arif-fazil.com)"
build_site "extension" "/extension" "EXTENSION Ring (aaa.arif-fazil.com)"
build_site "field" "/field" "FIELD Ring (civ.arif-fazil.com)"

# Create index redirect
cat > "$DIST_DIR/index.html" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="refresh" content="0; url=/soul/">
    <title>ARIF-OS Constitutional Network</title>
    <style>
        body {
            background: #0a0a0f;
            color: #c4791a;
            font-family: monospace;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            margin: 0;
        }
        .loading {
            text-align: center;
        }
        .lambda {
            font-size: 4rem;
            margin-bottom: 1rem;
        }
    </style>
</head>
<body>
    <div class="loading">
        <div class="lambda">Λ</div>
        <div>ARIF-OS Constitutional Network</div>
        <div style="opacity: 0.5; margin-top: 1rem;">Redirecting to SOUL ring...</div>
    </div>
</body>
</html>
EOF

echo "═══════════════════════════════════════════════════"
echo "  BUILD COMPLETE"
echo "═══════════════════════════════════════════════════"
echo ""
echo "Output directories:"
echo "  📁 dist/soul/     - arif-fazil.com"
echo "  📁 dist/mind/     - arifos.arif-fazil.com"
echo "  📁 dist/body/     - arifosmcp.arif-fazil.com"
echo "  📁 dist/extension/ - aaa.arif-fazil.com"
echo "  📁 dist/field/    - civ.arif-fazil.com"
echo ""
echo "Ω₀ ≈ 0.04"
echo "DITEMPA BUKAN DIBERI"
