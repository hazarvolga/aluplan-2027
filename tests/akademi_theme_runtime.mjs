// Verifies the pure theme-toggle mapping in ThemeModeProvider without rendering React.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function transpile(rel) {
  const source = fs.readFileSync(path.join(root, rel), 'utf8');
  return ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
      jsx: ts.JsxEmit.React,
    },
    fileName: rel,
  }).outputText;
}

function evaluate(rel, requireModule) {
  const module = { exports: {} };
  new Function('require', 'module', 'exports', transpile(rel))(requireModule, module, module.exports);
  return module.exports;
}

const reactStub = {
  __esModule: true,
  default: { createElement: () => null },
  createElement: () => null,
  createContext: () => ({ Provider: () => null }),
  useContext: () => null,
  useState: (value) => [value, () => {}],
  useEffect: () => {},
};

const mod = evaluate('src/components/theme/ThemeModeProvider.tsx', (request) => {
  if (request === 'react') return reactStub;
  throw new Error(`Unexpected import: ${request}`);
});

assert.equal(typeof mod.nextThemeMode, 'function', 'nextThemeMode must be exported');
assert.equal(mod.nextThemeMode('dark'), 'light', "dark toggles to light");
assert.equal(mod.nextThemeMode('light'), 'dark', "light toggles to dark");

console.log('PASS: theme toggle mapping (dark<->light)');
