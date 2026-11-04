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
  const listeners = new Map();
  globalThis.window = {
    localStorage: storage,
    alert() {},
    addEventListener(type, callback) { const group = listeners.get(type) ?? new Set(); group.add(callback); listeners.set(type, group); },
    removeEventListener(type, callback) { listeners.get(type)?.delete(callback); },
    dispatchEvent(event) { events.push(event.type); for (const callback of listeners.get(event.type) ?? []) callback(event); return true; },
  };
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)((request) => {
    if (request === 'react') return { useSyncExternalStore: (subscribe, snapshot) => { subscribe(() => {}); return snapshot(); } };
    if (request === '@/lib/cloudflare-analytics') return { blockCloudflareAnalytics: () => false };
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

// A second tab clears the shared value; the first tab must not retain its own previous acceptance.
const shared = memoryStorage();
const tab = load(shared);
tab.consent.useCookieConsent();
tab.consent.writeConsent('accepted');
shared.removeItem('cookie-consent');
window.dispatchEvent(Object.assign(new Event('storage'), { key: 'cookie-consent', newValue: null, storageArea: shared }));
const afterOtherTabClear = tab.consent.readConsent();
shared.setItem('cookie-consent', 'accepted');
window.dispatchEvent(Object.assign(new Event('storage'), { key: 'cookie-consent', newValue: 'accepted', storageArea: shared }));
const afterOtherTabAccept = tab.consent.readConsent();
shared.setItem('cookie-consent', 'rejected');
window.dispatchEvent(Object.assign(new Event('storage'), { key: 'cookie-consent', newValue: 'rejected', storageArea: shared }));
const afterOtherTabReject = tab.consent.readConsent();

// Reads work, but writes/removals are denied: the fresh in-memory choice must beat the stale persisted one.
const readOnly = { getItem: () => 'accepted', setItem() { throw new Error('denied'); }, removeItem() { throw new Error('denied'); } };
const readOnlyTab = load(readOnly);
readOnlyTab.consent.writeConsent('rejected');
const rejectedDespiteStaleStorage = readOnlyTab.consent.readConsent();
readOnlyTab.consent.clearConsent();
const clearDespiteStaleStorage = readOnlyTab.consent.readConsent();

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
  afterOtherTabClear,
  afterOtherTabAccept,
  afterOtherTabReject,
  rejectedDespiteStaleStorage,
  clearDespiteStaleStorage,
}));
