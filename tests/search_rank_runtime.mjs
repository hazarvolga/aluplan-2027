import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const code = ts.transpileModule(fs.readFileSync(path.join(root, 'src/lib/search.ts'), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
const module = { exports: {} };
new Function('require', 'module', 'exports', code)(() => ({}), module, module.exports);
const { rankSearchEntries } = module.exports;

const entries = [
  { path: '/a', title: 'Duvar', section: 'Site', description: '', seoTitle: '', keywords: '' },
  { path: '/akademi/x', title: 'Kapı', section: 'Akademi', description: 'Duvara kapı', seoTitle: '', keywords: 'parapet' },
  { path: '/akademi/y', title: 'Duvar Oluşturma', section: 'Akademi', description: '', seoTitle: '', keywords: 'zelle definieren' },
];
const [query, scope] = process.argv.slice(2);
const result = typeof rankSearchEntries === 'function' ? rankSearchEntries(entries, query ?? '', scope) : null;
process.stdout.write(JSON.stringify(result ? result.map((entry) => entry.path) : null));
