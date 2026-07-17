// post-build: copy static HTML pages into dist subdirectories
// These are standalone HTML pages not processed by Vite's React pipeline
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const staticCopies = [
  ["canon/index.html", "dist/canon/index.html"],
  ["999/index.html", "dist/999/index.html"],
];

// Human explanation pages + organ doors (public/ → dist/)
const publicRoots = [
  "public/arifos",
  "public/federation",
  "public/connect",
  "public/verify",
  "public/organs",
  "public/mcp",
];

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const from = path.join(src, entry.name);
    const to = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(from, to);
    else {
      fs.copyFileSync(from, to);
      console.log("postbuild: copied", path.relative(root, from), "->", path.relative(root, to));
    }
  }
}

staticCopies.forEach(([src, dest]) => {
  const srcPath = path.join(root, src);
  const destPath = path.join(root, dest);
  if (fs.existsSync(srcPath)) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log("postbuild: copied", src, "->", dest);
  }
});

publicRoots.forEach((rel) => {
  const src = path.join(root, rel);
  // public/arifos → dist/arifos
  const dest = path.join(root, "dist", path.relative(path.join(root, "public"), src));
  copyDir(src, dest);
});
