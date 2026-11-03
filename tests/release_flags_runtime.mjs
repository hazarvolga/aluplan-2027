import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function transpile(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  return ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: relativePath,
  }).outputText;
}

function evaluate(relativePath, requireModule) {
  const module = { exports: {} };
  new Function('require', 'module', 'exports', transpile(relativePath))(requireModule, module, module.exports);
  return module.exports;
}

const siteDataStub = { SITE_ORIGIN: 'https://aluplan.com.tr' };
const flags = evaluate('src/lib/release-flags.ts', () => {
  throw new Error('release-flags must not import modules');
});
const robots = evaluate('src/app/robots.ts', (request) => {
  if (request === '@/lib/site-data') return siteDataStub;
  if (request === '@/lib/release-flags') return flags;
  throw new Error(`Unsupported robots import: ${request}`);
});

const matrix = [
  { show: '1', block: '1' },
  { show: '1', block: '0' },
  { show: '0', block: '0' },
];

const results = matrix.map(({ show, block }) => {
  process.env.NODE_ENV = 'production';
  process.env.ALUPLAN_SHOW_2027 = show;
  process.env.ALUPLAN_BLOCK_INDEXING = block;
  return {
    show,
    block,
    robots: robots.default(),
    homepageVariant: flags.getHomepageVariant(),
    localPreview: flags.isLocalPreviewEnabled(),
  };
});

process.stdout.write(JSON.stringify(results));
