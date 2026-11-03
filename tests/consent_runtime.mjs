import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const source = fs.readFileSync(path.join(root, 'src/lib/consent.ts'), 'utf8');
const code = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function load(storage) {
  const events = [];
  globalThis.window = {
    localStorage: storage,
    addEventListener() {},
    removeEventListener() {},
    dispatchEvent(event) { events.push(event.type); return true; },
  };
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)((request) => {
    if (request === 'react') return { useSyncExternalStore: () => null };
    throw new Error(`Unsupported consent import: ${request}`);
  }, module, module.exports);
  return { consent: module.exports, events };
}

function memoryStorage(initial = {}) {
  const values = { ...initial };
  return {
    values,
    getItem: (key) => (key in values ? values[key] : null),
    setItem: (key, value) => { values[key] = String(value); },
    removeItem: (key) => { delete values[key]; },
  };
}

const fresh = memoryStorage();
const first = load(fresh);
const initial = first.consent.readConsent();
first.consent.writeConsent('accepted');
const afterAccept = first.consent.readConsent();

const invalid = load(memoryStorage({ 'cookie-consent': 'maybe' })).consent.readConsent();

const clearStorage = memoryStorage();
const clearing = load(clearStorage);
clearing.consent.writeConsent('accepted');
if (clearing.consent.clearConsent) clearing.consent.clearConsent();
const afterClear = clearing.consent.readConsent();

const throwing = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('blocked'); } };
const blocked = load(throwing);
const blockedRead = blocked.consent.readConsent();
blocked.consent.writeConsent('rejected');
const blockedAfterWrite = blocked.consent.readConsent();

process.stdout.write(JSON.stringify({
  initial,
  afterAccept,
  stored: fresh.values['cookie-consent'],
  acceptEvents: first.events,
  invalid,
  blockedRead,
  blockedEvents: blocked.events,
  blockedAfterWrite,
  afterClear,
  clearEvents: clearing.events,
}));
