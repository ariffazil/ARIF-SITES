// post-build: copy static HTML pages into dist subdirectories
// These are standalone HTML pages not processed by Vite's React pipeline.
//
// Two-stage copy:
//   1. Mirror ALL of public/*/ → dist/*/ (recursive) so every static
//      index.html, llms.txt, surfaces.json, etc. ends up under dist/.
//      Excludes React-build dirs (assets/, data/) and bundler temp.
//   2. Explicit copies for files that live outside public/ (canon/, etc.).
//
// The mirror approach prevents the silent drift we saw on 2026-08-02
// where 88 static subpages got the unified nav header injected in source
// but never reached the live site because copy-static-html.js only
// hard-coded 8 paths.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distRoot = path.join(root, "dist");
const publicRoot = path.join(root, "public");

const SKIP_DIRS = new Set([
  "assets",          // Vite-managed bundler output (already in dist/assets/)
  "data",            // JSON data feeds (served via /data/ via Caddy SPA fallback)
  "node_modules",
  ".git",
]);

const SKIP_FILES = new Set([
  "index.html",      // root index.html is the Vite-built SPA entry — DO NOT overwrite
  "feed.xml",
  "llms.json",
  "llms.txt",
  "llms-full.txt",
  "sitemap.xml",
  "rsl.xml",
  "robots.txt",
  "page.json",
  "missions.json",
  "soul.json",
]);

function shouldSkip(relativePath, isDir) {
  const parts = relativePath.split(path.sep);
  if (isDir && parts.some(p => SKIP_DIRS.has(p))) return true;
  if (!isDir && SKIP_FILES.has(parts[parts.length - 1])) return true;
  return false;
}

function mirrorDir(srcDir, destDir, baseRel = "") {
  let entries;
  try { entries = fs.readdirSync(srcDir, { withFileTypes: true }); }
  catch { return; }
  for (const e of entries) {
    const rel = baseRel ? path.join(baseRel, e.name) : e.name;
    if (shouldSkip(rel, e.isDirectory())) continue;
    const sp = path.join(srcDir, e.name);
    const dp = path.join(destDir, e.name);
    if (e.isDirectory()) {
      fs.mkdirSync(dp, { recursive: true });
      mirrorDir(sp, dp, rel);
    } else if (e.isFile()) {
      fs.mkdirSync(path.dirname(dp), { recursive: true });
      fs.copyFileSync(sp, dp);
      console.log("postbuild: mirror", path.relative(root, sp), "->", path.relative(root, dp));
    }
  }
}

let copied = 0;

// 1. Mirror public/ → dist/ (except root index.html and SPA-managed assets)
if (fs.existsSync(publicRoot)) {
  console.log("postbuild: mirroring public/ → dist/ (skipping root index.html, assets/, data/)...");
  mirrorDir(publicRoot, distRoot);
}

// 2. Explicit copies for paths outside public/ that the mirror does not handle.
//    NOTE: 999/, 000/, canon/, etc. all live BOTH at public/<path>/ AND at the
//    repo-root (e.g. sites/arif-fazil.com/999/index.html). The mirror covers
//    public/, so the legacy root-level files are SKIPPED here to prevent the
//    stale Jul-25 copy from overwriting the fresh public/ version.
//    If a path is NOT in public/, list it here.
const staticCopies = [
  ["canon/index.html", "dist/canon/index.html"],  // canon/ is not mirrored (lives at sites/arif-fazil.com/canon/)
];

for (const [src, dest] of staticCopies) {
  const srcPath = path.join(root, src);
  const destPath = path.join(root, dest);
  if (fs.existsSync(srcPath)) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log("postbuild: copied", src, "->", dest);
    copied++;
  }
}

console.log(`postbuild: static html sync complete.`);
