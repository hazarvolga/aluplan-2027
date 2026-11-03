import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const code = ts.transpileModule(fs.readFileSync(path.join(root, 'src/lib/embeds.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const module = { exports: {} };
new Function('require', 'module', 'exports', code)(() => { throw new Error('embeds must not import'); }, module, module.exports);
const { normalizeEmbedSrc, embedKind } = module.exports;

const cases = [
  'https://www.youtube.com/embed/SnuaHSL18e8',
  'https://youtube.com/embed/abc?rel=0',
  'https://www.youtube-nocookie.com/embed/SeA6ncaqUhY?rel=0',
  'https://www.google.com/maps/embed?pb=xyz',
];
process.stdout.write(JSON.stringify(cases.map((src) => ({ src, normalized: normalizeEmbedSrc(src), kind: embedKind(src) }))));
