import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function loadJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

function transpile(relativePath) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      resolveJsonModule: true,
    },
    fileName: relativePath,
  }).outputText;
}

function evaluateCommonJs(code, requireModule) {
  const module = { exports: {} };
  const execute = new Function('require', 'module', 'exports', code);
  execute(requireModule, module, module.exports);
  return module.exports;
}

const jsonModules = new Map([
  ['@/data/pages.json', loadJson('src/data/pages.json')],
  ['@/data/playlists.json', loadJson('src/data/playlists.json')],
  ['@/data/navigation.json', loadJson('src/data/navigation.json')],
  ['@/data/homepage.json', loadJson('src/data/homepage.json')],
  ['@/data/search-index.json', loadJson('src/data/search-index.json')],
  ['@/data/video-library.json', loadJson('src/data/video-library.json')],
]);

const siteData = evaluateCommonJs(
  transpile('src/lib/site-data.ts'),
  (request) => {
    if (jsonModules.has(request)) return jsonModules.get(request);
    throw new Error(`Unsupported site-data import: ${request}`);
  },
);

const presentation = evaluateCommonJs(transpile('src/components/sections/subpage-hero-presentation.ts'), () => {
  throw new Error('presentation must not import');
});
const shareImage = evaluateCommonJs(transpile('src/lib/share-image.ts'), (request) => {
  if (request === './site-data') return siteData;
  if (request === '../components/sections/subpage-hero-presentation') return presentation;
  throw new Error(`Unsupported share-image import: ${request}`);
});

const schema = evaluateCommonJs(
  transpile('src/lib/schema.ts'),
  (request) => {
    if (request === './site-data') return siteData;
    if (request === './share-image') return shareImage;
    throw new Error(`Unsupported schema import: ${request}`);
  },
);

const route = process.argv[2];
const page = siteData.getPageData(route);
if (!page) throw new Error(`Unknown page route: ${route}`);

process.stdout.write(JSON.stringify(schema.buildPageJsonLd(page)));
