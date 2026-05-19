#!/usr/bin/env node
/**
 * Patches vite-plugin-ssg dist/plugin.js for Tailwind v3 compatibility.
 * Run via postinstall after npm install.
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const pluginPath = path.join(__dirname, '..', 'node_modules', 'vite-plugin-ssg', 'dist', 'plugin.js');

if (!fs.existsSync(pluginPath)) {
  console.log('[patch] vite-plugin-ssg not found, skipping');
  process.exit(0);
}

let content = fs.readFileSync(pluginPath, 'utf8');

if (content.includes('dummy-tailwind')) {
  console.log('[patch] vite-plugin-ssg already patched, skipping');
  process.exit(0);
}

let patches = 0;

// Patch 1: SSR renderer - replace @tailwindcss/vite with dummy
const r1 = content.match(/var tailwindcss = require2\("@tailwindcss\/vite"\)\.default;/);
if (r1) {
  content = content.replace(r1[0], 'var tailwindcss = () => ({ name: "dummy-tailwind", enforce: "pre" });');
  patches++;
  console.log('[patch] SSR tailwindcss patched');
}

// Add @ alias after createServer root
content = content.replace(
  /const vite = await createServer\(\{\s*configFile: false,\s*root: process\.cwd\(\),/,
  `const _alias = { "@": path3.resolve(process.cwd(), "src") };\n    const vite = await createServer({\n    configFile: false,\n    root: process.cwd(),`
);

// Add resolve.alias to SSR vite config
content = content.replace(
  /plugins: \[reactPlugin\(\), \.\.\.config\.vite\.plugins\],/,
  'plugins: [reactPlugin(), ...config.vite.plugins],\n    resolve: { alias: _alias },'
);

// Patch 2: CSS builder - replace @tailwindcss/vite with dummy
const r2 = content.match(/var tailwindcss2 = require3\("@tailwindcss\/vite"\)\.default;/);
if (r2) {
  content = content.replace(r2[0], 'var tailwindcss2 = () => ({ name: "dummy-tailwind", enforce: "pre" });');
  patches++;
  console.log('[patch] CSS builder tailwindcss2 patched');
}

// Remove tailwindcss2() from CSS builder plugins
content = content.replace(
  /plugins: \[\n?      reactPlugin2\(\),\n?      tailwindcss2\(\),\n?      \.\.\.config\.vite\.plugins\n?    \];/,
  'plugins: [\n      reactPlugin2(),\n      ...config.vite.plugins\n    ];'
);

// Add resolve alias to CSS builder vite config
content = content.replace(
  /rollupOptions: \{/,
  `resolve: { alias: { "@": path5.resolve(process.cwd(), "src") } },\n      rollupOptions: {`
);

// Patch 3: CSS minifier lightningcss -> esbuild
if (content.includes('cssMinify: config.css.minify,')) {
  content = content.replace('cssMinify: config.css.minify,', 'cssMinify: "esbuild",');
  patches++;
  console.log('[patch] CSS minifier patched');
}

// Patch 4: Hydration builder - replace @tailwindcss/vite with dummy
const r3 = content.match(/var tailwindcss3 = require4\("@tailwindcss\/vite"\)\.default;/);
if (r3) {
  content = content.replace(r3[0], 'var tailwindcss3 = () => ({ name: "dummy-tailwind", enforce: "pre" });');
  patches++;
  console.log('[patch] Hydration tailwindcss3 patched');
}

// Remove tailwindcss3() from hydration plugins
content = content.replace(
  /plugins: \[\n?      reactPlugin3\(\),\n?      tailwindcss3\(\),\n?      \.\.\.config\.vite\.plugins\n?    \];/,
  'plugins: [\n      reactPlugin3(),\n      ...config.vite.plugins\n    ];'
);

fs.writeFileSync(pluginPath, content);
console.log(`[patch] Applied ${patches} patches to vite-plugin-ssg`);
