#!/bin/bash
# Patches vite-plugin-ssg dist/plugin.js to fix Tailwind CSS v3/v4 conflict
# and add @ alias resolution for SSG builds

PLUGIN="node_modules/vite-plugin-ssg/dist/plugin.js"
if [ ! -f "$PLUGIN" ]; then
  echo "[patch] vite-plugin-ssg not found, skipping"
  exit 0
fi

# Check if already patched
if grep -q "dummy-tailwind" "$PLUGIN"; then
  echo "[patch] vite-plugin-ssg already patched"
  exit 0
fi

echo "[patch] Applying vite-plugin-ssg patches..."

# Patch 1: SSR renderer - replace @tailwindcss/vite with dummy, add alias
sed -i 's|var tailwindcss = require2("@tailwindcss/vite").default;|var tailwindcss = () => ({ name: "dummy-tailwind", enforce: "pre" });|' "$PLUGIN"

# Patch 2: SSR renderer vite server - add alias resolution
sed -i 's|const vite = await createServer({|const _alias = { "@": path3.resolve(process.cwd(), "src") };\nconst vite = await createServer({|' "$PLUGIN"
sed -i 's|plugins: \[reactPlugin(), tailwindcss(), \.\.\.config\.vite\.plugins\],|plugins: [reactPlugin(), ...config.vite.plugins],\n    resolve: { alias: _alias },|' "$PLUGIN"

# Patch 3: CSS bundle builder - remove tailwindcss2 and add alias
sed -i 's|var tailwindcss2 = require3("@tailwindcss/vite").default;|var tailwindcss2 = () => ({ name: "dummy-tailwind", enforce: "pre" });|' "$PLUGIN"
sed -i 's|plugins: \[|const _cssAlias = { "@": path5.resolve(process.cwd(), "src") };\n    plugins: [|' "$PLUGIN"
sed -i 's|reactPlugin2(),\n      tailwindcss2(),\n      \.\.\.config\.vite\.plugins|reactPlugin2(),\n      ...config.vite.plugins|' "$PLUGIN"
sed -i 's|rollupOptions:|resolve: { alias: _cssAlias },\n      rollupOptions:|' "$PLUGIN"

# Patch 4: CSS minifier - lightningcss -> esbuild
sed -i 's|cssMinify: config.css.minify,|cssMinify: "esbuild",|' "$PLUGIN"

# Patch 5: Hydration builder - remove tailwindcss3
sed -i 's|var tailwindcss3 = require4("@tailwindcss/vite").default;|var tailwindcss3 = () => ({ name: "dummy-tailwind", enforce: "pre" });|' "$PLUGIN"
sed -i 's|reactPlugin3(),\n      tailwindcss3(),\n      \.\.\.config\.vite\.plugins|reactPlugin3(),\n      ...config.vite.plugins|' "$PLUGIN"

echo "[patch] vite-plugin-ssg patches applied"
