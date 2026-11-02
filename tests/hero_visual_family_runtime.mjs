import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const sourcePath = 'src/components/sections/subpage-hero-presentation.ts';
const source = fs.readFileSync(path.join(root, sourcePath), 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  fileName: sourcePath,
}).outputText;
const module = { exports: {} };
new Function('module', 'exports', code)(module, module.exports);

const fallback = '/assets/test/source-hero.jpg';
const inputText = fs.readFileSync(0, 'utf8').trim();
const input = inputText ? JSON.parse(inputText) : {};
const routes = input.routes ?? process.argv.slice(2);
const fallbackByRoute = input.fallbackByRoute ?? {};
const results = Object.fromEntries(routes.map((route) => [
  route,
  module.exports.getSubpageHeroPresentation(route, fallbackByRoute[route] ?? fallback),
]));
process.stdout.write(JSON.stringify({
  results,
  fallback,
  routeMap: module.exports.HERO_VISUAL_FAMILY_ROUTES,
}));
