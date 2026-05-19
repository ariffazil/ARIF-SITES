#!/usr/bin/env python3
"""Patch vite-plugin-ssg dist/plugin.js for Tailwind v3 compatibility."""
import os, sys

plugin_path = sys.argv[1] if len(sys.argv) > 1 else "node_modules/vite-plugin-ssg/dist/plugin.js"
if not os.path.exists(plugin_path):
    print(f"[patch] {plugin_path} not found, skipping")
    sys.exit(0)

with open(plugin_path) as f:
    content = f.read()

if "dummy-tailwind" in content:
    print("[patch] vite-plugin-ssg already patched, skipping")
    sys.exit(0)

patches = 0

# Patch 1: SSR renderer - replace @tailwindcss/vite with dummy, add alias
old = 'var tailwindcss = require2("@tailwindcss/vite").default;\nasync function renderPage(options) {\n  const { componentPath, routeUrl, islands, renderHead: shouldRenderHead, config } = options;\n  const serverEntryPath = path3.join(__dirname, "..", "src", "server-entry.tsx");\nconst vite = await createServer({\n    configFile: false,\n    // Don\'t load vite.config.ts\n    root: process.cwd(),\n    // Use project\'s root to resolve node_modules\n    plugins: [reactPlugin(), tailwindcss(), ...config.vite.plugins],'
new = 'var tailwindcss = () => ({ name: "dummy-tailwind", enforce: "pre" });\nasync function renderPage(options) {\n  const { componentPath, routeUrl, islands, renderHead: shouldRenderHead, config } = options;\n  const serverEntryPath = path3.join(__dirname, "..", "src", "server-entry.tsx");\nconst _alias = { "@": path3.resolve(process.cwd(), "src") };\nconst vite = await createServer({\n    configFile: false,\n    // Don\'t load vite.config.ts\n    root: process.cwd(),\n    // Use project\'s root to resolve node_modules\n    // Rely on postcss.config.js for Tailwind CSS processing\n    plugins: [reactPlugin(), ...config.vite.plugins],\n    resolve: { alias: _alias },'
if old in content:
    content = content.replace(old, new)
    patches += 1
    print("[patch] SSR renderer patched")
else:
    print("[patch] WARNING: SSR renderer pattern not found")

# Patch 2: CSS minifier lightningcss -> esbuild
if "cssMinify: config.css.minify," in content:
    content = content.replace("cssMinify: config.css.minify,", 'cssMinify: "esbuild",')
    patches += 1
    print("[patch] CSS minifier patched")
else:
    print("[patch] WARNING: CSS minifier pattern not found")

# Patch 3: CSS bundle builder - remove tailwindcss2, add alias
old3 = 'var tailwindcss2 = require3("@tailwindcss/vite").default;'
new3 = 'var tailwindcss2 = () => ({ name: "dummy-tailwind", enforce: "pre" });'
if old3 in content:
    content = content.replace(old3, new3)
    patches += 1
    print("[patch] CSS builder tailwindcss2 patched")
else:
    print("[patch] WARNING: CSS builder tailwindcss2 pattern not found")

old3b = 'const plugins = [\n      reactPlugin2(),\n      tailwindcss2(),\n      ...config.vite.plugins\n    ];'
new3b = 'const _cssAlias = { "@": path5.resolve(process.cwd(), "src") };\n    const plugins = [\n      reactPlugin2(),\n      ...config.vite.plugins\n    ];'
if old3b in content:
    content = content.replace(old3b, new3b)
    patches += 1
    print("[patch] CSS builder plugins patched")
else:
    print("[patch] WARNING: CSS builder plugins pattern not found")

# Add resolve alias to CSS builder vite config
old3c = 'plugins,\n      build: {'
new3c = 'plugins,\n      resolve: { alias: _cssAlias },\n      build: {'
if old3c in content:
    content = content.replace(old3c, new3c)
    patches += 1
    print("[patch] CSS builder resolve alias patched")

# Patch 4: Hydration builder - remove tailwindcss3
old4 = 'var tailwindcss3 = require4("@tailwindcss/vite").default;'
new4 = 'var tailwindcss3 = () => ({ name: "dummy-tailwind", enforce: "pre" });'
if old4 in content:
    content = content.replace(old4, new4)
    patches += 1
    print("[patch] Hydration builder tailwindcss3 patched")
else:
    print("[patch] WARNING: Hydration tailwindcss3 pattern not found")

old4b = 'plugins: [\n      reactPlugin3(),\n      tailwindcss3(),\n      ...config.vite.plugins\n    ];'
new4b = 'plugins: [\n      reactPlugin3(),\n      ...config.vite.plugins\n    ];'
if old4b in content:
    content = content.replace(old4b, new4b)
    patches += 1
    print("[patch] Hydration builder plugins patched")
else:
    print("[patch] WARNING: Hydration plugins pattern not found")

with open(plugin_path, 'w') as f:
    f.write(content)

print(f"[patch] Applied {patches} patches to vite-plugin-ssg")
