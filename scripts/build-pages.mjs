import { execFileSync } from 'node:child_process';
import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

// Keep the production build at its configured domain and prepare a separate
// GitHub Pages preview under the repository path.
const base = '/avtobus-v-italiu';
execFileSync(process.execPath, ['scripts/build.mjs'], { stdio: 'inherit' });
await rm('docs', { recursive: true, force: true });
await mkdir('docs', { recursive: true });
await cp('dist', 'docs', { recursive: true });

function prefixPaths(text) {
  return text
    .replace(/(["'(\s])\/(?=assets\/|favicon-|brand-sm|hero-|ru\/|it\/|oferta\.html|privacy\.html)/g, `$1${base}/`)
    .replace(/(href[=:]["'])\/(["'])/g, `$1${base}/$2`);
}

async function prepare(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await prepare(path);
    else if (/\.(html|js)$/.test(entry.name)) {
      let text = prefixPaths(await readFile(path, 'utf8'));
      if (entry.name.endsWith('.html')) {
        text = text.replace('</head>', '<meta name="robots" content="noindex, follow"></head>');
      }
      await writeFile(path, text);
    }
  }
}
await prepare('docs');
await writeFile('docs/.nojekyll', '');
await writeFile('docs/robots.txt', 'User-agent: *\nAllow: /\n');
console.log(`GitHub Pages preview prepared in docs/ at ${base}/.`);
