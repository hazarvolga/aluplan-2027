import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function evaluate(relativePath, requireModule) {
  const code = ts.transpileModule(fs.readFileSync(path.join(root, relativePath), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: relativePath,
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(requireModule, module, module.exports);
  return module.exports;
}

const pages = JSON.parse(fs.readFileSync(path.join(root, 'src/data/pages.json'), 'utf8'));
const presentation = evaluate('src/components/sections/subpage-hero-presentation.ts', () => {
  throw new Error('presentation must not import');
});
const shareImage = evaluate('src/lib/share-image.ts', (request) => {
  if (request === './site-data') return { SITE_ORIGIN: 'https://aluplan.com.tr' };
  if (request === '../components/sections/subpage-hero-presentation') return presentation;
  throw new Error(`Unsupported share-image import: ${request}`);
});

const routes = process.argv.slice(2);
process.stdout.write(JSON.stringify(Object.fromEntries(routes.map((route) => [route, shareImage.getPageShareImage(pages[route])]))));
