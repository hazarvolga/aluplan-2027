// Verifies the pure hasOwnChrome() routing predicate.
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

const { hasOwnChrome } = evaluate('src/lib/chrome-routes.ts');

assert.equal(hasOwnChrome('/akademi'), true, '/akademi has own chrome');
assert.equal(hasOwnChrome('/akademi/seviye-1'), true, 'nested akademi has own chrome');
assert.equal(hasOwnChrome('/'), false, 'home uses site chrome');
assert.equal(hasOwnChrome('/products'), false, 'products uses site chrome');
assert.equal(hasOwnChrome('/akademi-benzeri'), false, 'only exact segment or subpath counts');

console.log('PASS: hasOwnChrome predicate');
