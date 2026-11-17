#!/usr/bin/env node
// Downloads Atharva Infrastructures' own images from their current website into
// assets/img/atharva/ for the LOCAL prototype only. These files are git-ignored.
// Do not publish them until the company has granted permission.
// Usage: node scripts/fetch-assets.mjs
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const manifest = JSON.parse(await readFile(join(root, 'data/assets.json'), 'utf8'));
const outDir = join(root, 'assets/img/atharva');
await mkdir(outDir, { recursive: true });

let ok = 0, failed = 0;
for (const a of manifest.assets) {
  const url = manifest.origin + a.src;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    await writeFile(join(outDir, a.file), buf);
    console.log(`ok   ${a.file}  (${Math.round(buf.length / 1024)} KB)`);
    ok++;
  } catch (e) {
    console.warn(`FAIL ${a.file}  ${url}  ${e.message}`);
    failed++;
  }
}
console.log(`\n${ok} downloaded, ${failed} failed. Images are for the private local prototype only.`);
process.exitCode = failed ? 1 : 0;
