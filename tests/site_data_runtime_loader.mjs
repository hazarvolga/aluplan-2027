// Shared loader for runtime harnesses that evaluate src/lib/site-data.ts and its client-safe modules.
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

export const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function loadJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(root, relativePath), 'utf8'));
}

export function transpile(relativePath) {
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

export function evaluateCommonJs(code, requireModule) {
  const module = { exports: {} };
  const execute = new Function('require', 'module', 'exports', code);
  execute(requireModule, module, module.exports);
  return module.exports;
}

function evaluateDataModule(relativePath, jsonModules, localModules) {
  return evaluateCommonJs(transpile(relativePath), (request) => {
    if (jsonModules.has(request)) return jsonModules.get(request);
    if (localModules.has(request)) return localModules.get(request);
    throw new Error(`Unsupported import in ${relativePath}: ${request}`);
  });
}

export function loadSiteModules() {
  const jsonModules = new Map([
    ['@/data/pages.json', loadJson('src/data/pages.json')],
    ['@/data/playlists.json', loadJson('src/data/playlists.json')],
    ['@/data/navigation.json', loadJson('src/data/navigation.json')],
    ['@/data/homepage.json', loadJson('src/data/homepage.json')],
    ['@/data/search-index.json', loadJson('src/data/search-index.json')],
    ['@/data/video-library.json', loadJson('src/data/video-library.json')],
  ]);
  const siteShared = evaluateDataModule('src/lib/site-shared.ts', jsonModules, new Map());
  const playlistData = evaluateDataModule('src/lib/playlist-data.ts', jsonModules, new Map());
  const siteData = evaluateDataModule('src/lib/site-data.ts', jsonModules, new Map([
    ['./site-shared', siteShared],
    ['./playlist-data', playlistData],
  ]));
  return { siteData, siteShared, playlistData };
}
