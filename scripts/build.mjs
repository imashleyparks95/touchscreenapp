import { cpSync, rmSync, existsSync } from 'node:fs';
for (const path of ['dist/index.html','dist/js/shell.js','dist/sw.js']) {
  if (!existsSync(path)) throw new Error(`Missing required source: ${path}`);
}
rmSync('build', { recursive: true, force: true });
cpSync('dist', 'build', { recursive: true });
console.log('Static application copied from authoritative dist/ source to build/. No transpilation required.');
