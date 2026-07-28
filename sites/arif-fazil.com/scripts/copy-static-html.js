// post-build: copy static HTML pages into dist subdirectories
// These are standalone HTML pages not processed by Vite's React pipeline
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const dirsToCopy = ['canon', '999', 'politics', 'malaysia', 'vitals'];

const staticCopies = [
  ["canon/index.html", "dist/canon/index.html"],
  ["999/index.html", "dist/999/index.html"],
  ["politics/ns-election/index.html", "dist/politics/ns-election/index.html"],
  ["politics/index.html", "dist/politics/index.html"],
  ["malaysia/index.html", "dist/malaysia/index.html"],
  ["vitals/index.html", "dist/vitals/index.html"],
];

staticCopies.forEach(([src, dest]) => {
  const srcPath = path.join(root, src);
  const destPath = path.join(root, dest);
  if (fs.existsSync(srcPath)) {
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.copyFileSync(srcPath, destPath);
    console.log("postbuild: copied", src, "->", dest);
  }
});
