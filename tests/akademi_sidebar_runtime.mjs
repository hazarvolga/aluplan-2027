// Verifies the pure active-level predicate used by the sidebar wayfinding.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function evaluate(rel) {
  const source = fs.readFileSync(path.join(root, rel), 'utf8');
  const js = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    fileName: rel,
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', js)(() => ({}), module, module.exports);
  return module.exports;
}

const { isAkademiLevelActive } = evaluate('src/components/akademi/sidebar-nav.ts');

assert.equal(isAkademiLevelActive('/akademi/seviye-2', 'seviye-2'), true, 'exact level is active');
assert.equal(isAkademiLevelActive('/akademi/seviye-2', 'seviye-1'), false, 'other level is not active');
assert.equal(isAkademiLevelActive('/akademi', 'seviye-1'), false, 'overview marks no level active');

console.log('PASS: isAkademiLevelActive predicate');
