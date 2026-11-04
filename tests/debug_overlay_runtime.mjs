import fs from 'node:fs';
import ts from 'typescript';

const source = fs.readFileSync('src/components/sections/DebugComponentLabel.tsx', 'utf8');
const code = ts.transpileModule(source, { compilerOptions: {
  module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX,
  esModuleInterop: true,
} }).outputText;
const values = {};
const listeners = new Map();
let cleanup;
globalThis.document = { documentElement: { dataset: {} } };
globalThis.localStorage = {
  getItem: (key) => values[key] ?? null,
  setItem: (key, value) => { values[key] = value; },
};
globalThis.window = {
  addEventListener: (name, callback) => listeners.set(name, callback),
  removeEventListener: (name, callback) => { if (listeners.get(name) === callback) listeners.delete(name); },
};
const jsx = (type, props) => ({ type, props });
const module = { exports: {} };
new Function('require', 'module', 'exports', code)((request) => {
  if (request === 'react') return { useEffect: (effect) => { cleanup = effect(); } };
  if (request === 'react/jsx-runtime') return { jsx, jsxs: jsx };
  if (request.endsWith('.module.css')) return { __esModule: true, default: { wrapper: 'wrapper', label: 'label' } };
  throw new Error(`Unexpected import ${request}`);
}, module, module.exports);
const { DebugOverlayController, DebugComponentLabel } = module.exports;
const snapshot = () => ({ active: document.documentElement.dataset.debugOverlay ?? null, stored: values['debug-overlay'] ?? null });
DebugOverlayController();
const initial = snapshot();
window.__debugOverlay(true);
const enabled = snapshot();
window.__debugOverlay();
const toggledOff = snapshot();
window.__debugOverlay(true);
cleanup();
DebugOverlayController();
const restored = snapshot();
listeners.get('storage')({ key: 'debug-overlay', newValue: '0' });
const synchronizedOff = snapshot();
listeners.get('storage')({ key: 'debug-overlay', newValue: '1' });
const synchronizedOn = snapshot();
listeners.get('storage')({ key: 'other', newValue: '0' });
const ignored = snapshot();
const child = { state: 'preserve-me' };
const wrapper = DebugComponentLabel({ name: 'Example', children: child });
const wrapperChildPreserved = wrapper.props.children[1] === child;
const labelHidden = wrapper.props.children[0].props['aria-hidden'];
cleanup();
process.stdout.write(JSON.stringify({ initial, enabled, toggledOff, restored, synchronizedOff, synchronizedOn, ignored, wrapperChildPreserved, labelHidden, cleanedUp: !window.__debugOverlay && !listeners.has('storage') }));
