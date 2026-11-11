// Fails the build when a JS chunk grows past its gzip budget (kB). Run after `vite build`.
import { readdirSync, readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";

const budgets = { index: 120, formula: 85, scene: 260 }; // entry chunk, KaTeX, three.js (only loaded by a 3D tab)
const fallback = 40; // any other chunk
const dir = "dist/assets";
let failed = false;
for (const file of readdirSync(dir).filter((f) => f.endsWith(".js"))) {
  const kb = gzipSync(readFileSync(`${dir}/${file}`)).length / 1024;
  const limit = budgets[file.split("-")[0]] ?? fallback;
  if (kb > limit) {
    console.error(`${file}: ${kb.toFixed(1)} kB gzip > ${limit} kB budget`);
    failed = true;
  }
}
if (failed) process.exit(1);
console.log("Bundle within budget.");
