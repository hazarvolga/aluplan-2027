import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';

function compile(path) {
  return ts.transpileModule(fs.readFileSync(path, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
}
const analyticsCode = compile('src/lib/cloudflare-analytics.ts');
const consentCode = compile('src/lib/consent.ts');
function scenario(initial = {}, blocked = false) {
  const values = { ...initial }, nodes = [], events = new Map(), actions = [], channels = [];
  const localStorage = { blocked, getItem: k => values[k] ?? null, setItem(k,v) { if (this.blocked) throw Error('blocked'); values[k] = v; actions.push('store'); }, removeItem(k) { if (this.blocked) throw Error('blocked'); delete values[k]; actions.push('remove'); } };
  globalThis.document = { addEventListener(k, fn) { const group = events.get(k) ?? []; group.push(fn); events.set(k, group); }, createElement: tag => ({ tag, setAttribute(k, v) { this[k] = v; } }), head: { appendChild(node) { nodes.push(node); actions.push(node.tag === 'meta' ? 'block' : 'load'); } } };
  const sessionValues = {};
  const sessionStorage = { getItem: k => sessionValues[k] ?? null, setItem(k, v) { sessionValues[k] = v; }, removeItem(k) { delete sessionValues[k]; } };
  class TestChannel {
    constructor() { channels.push(this); }
    addEventListener(_type, callback) { this.onmessage = callback; }
    postMessage() { actions.push('broadcast'); }
    emit(data) { this.onmessage({data}); }
  }
  globalThis.window = { localStorage, sessionStorage, BroadcastChannel: TestChannel, alert() { actions.push('warn'); }, location: { reload() { actions.push('reload'); } }, addEventListener(k, fn) { const group = events.get(k) ?? []; group.push(fn); events.set(k, group); }, removeEventListener() {}, dispatchEvent(event) { for (const fn of events.get(event.type) ?? []) fn(event); } };
  const analytics = { exports: {} };
  new Function('require','module','exports', analyticsCode)(() => { throw Error('unexpected import'); }, analytics, analytics.exports);
  const consent = { exports: {} };
  new Function('require','module','exports', consentCode)((name) => {
    if (name === 'react') return { useSyncExternalStore: (subscribe, snapshot) => { subscribe(() => {}); return snapshot(); } };
    if (name === '@/lib/cloudflare-analytics') return analytics.exports;
    throw Error(name);
  }, consent, consent.exports);
  return { analytics: analytics.exports, consent: consent.exports, nodes, actions, localStorage, channels };
}
const token = '0'.repeat(32);
const gaDisable = 'ga-disable-G-DQYT0D9MQ5';
// Withdrawals must disable already-running Google Analytics synchronously,
// before storage writes, callbacks, or the React effect can run.
let ga = scenario({ 'cookie-consent': 'accepted' });
window[gaDisable] = false;
const removeConsent = ga.localStorage.removeItem;
ga.localStorage.removeItem = function (key) {
  if (key === 'cookie-consent') assert.equal(window[gaDisable], true, 'disable GA before storage removal');
  return removeConsent.call(this, key);
};
ga.consent.clearConsent();
assert.equal(window[gaDisable], true);
ga = scenario({ 'cookie-consent': 'accepted' }, true);
window[gaDisable] = false;
ga.consent.writeConsent('rejected');
assert.equal(window[gaDisable], true, 'failed storage writes still disable GA');
ga.consent.writeConsent('accepted');
assert.equal(window[gaDisable], true, 'acceptance alone does not re-enable an active tag without verification');
ga = scenario({ 'cookie-consent': 'accepted' });
ga.consent.useCookieConsent(); window[gaDisable] = false;
ga.localStorage.setItem('cookie-consent', 'rejected');
window.dispatchEvent(Object.assign(new Event('storage'), { key: 'cookie-consent', newValue: 'rejected', storageArea: ga.localStorage }));
assert.equal(window[gaDisable], true, 'other-tab rejection disables GA synchronously');
ga = scenario({ 'cookie-consent': 'accepted' });
ga.consent.useCookieConsent(); window[gaDisable] = false;
window.dispatchEvent(Object.assign(new Event('storage'), { key: 'cookie-consent', newValue: 'rejected', storageArea: ga.localStorage }));
assert.equal(window[gaDisable], false, 'a delayed rejection cannot disable GA after a newer acceptance');
ga = scenario({ 'cookie-consent': 'accepted' });
ga.consent.useCookieConsent(); ga.analytics.startCloudflareAnalytics(token, true); ga.actions.length = 0;
window.dispatchEvent(Object.assign(new Event('storage'), { key: 'cookie-consent', newValue: 'rejected', storageArea: ga.localStorage }));
assert.deepEqual(ga.actions, [], 'a delayed rejection must not block or reload an accepted Cloudflare session');
ga = scenario({ 'cookie-consent': 'accepted' });
ga.consent.useCookieConsent(); window[gaDisable] = false;
ga.channels[0].emit('withdrawal-not-persisted');
assert.equal(window[gaDisable], true, 'failed remote withdrawal disables GA synchronously');
let t = scenario();
t.analytics.startCloudflareAnalytics(token, false); assert.equal(t.nodes.length, 0);
t.analytics.startCloudflareAnalytics('bad-token', true); assert.equal(t.nodes.length, 0);
t = scenario({ 'cookie-consent': 'accepted' });
window.sessionStorage.setItem('aluplan-consent-withdrawal-pending', '1');
t.analytics.startCloudflareAnalytics(token, true);
assert.equal(t.nodes.length, 0, 'pending withdrawal prevents stale asynchronous start');
t = scenario({ 'cookie-consent': 'accepted' }, true);
t.analytics.startCloudflareAnalytics(token, true); assert.equal(t.nodes.length, 0, 'unwritable storage must not load');
t = scenario({ 'cookie-consent': 'accepted' });
const writeProbe = t.localStorage.setItem;
t.localStorage.setItem = function (key, value) {
  writeProbe.call(this, key, value);
  if (key.startsWith('__aluplan_consent_probe_')) this.removeItem('cookie-consent');
};
t.analytics.startCloudflareAnalytics(token, true);
assert.equal(t.nodes.length, 0, 'concurrent withdrawal during probe must not be overwritten');
assert.equal(t.localStorage.getItem('cookie-consent'), null);
t = scenario({ 'cookie-consent': 'accepted' });
t.analytics.startCloudflareAnalytics(token, true); t.analytics.startCloudflareAnalytics(token, true);
assert.equal(t.nodes.filter(n => n.tag === 'script').length, 1);
t.actions.length = 0;
t.consent.clearConsent();
assert.deepEqual(t.actions, ['block','remove','reload']);
assert.equal(t.nodes.find(n => n.tag === 'meta').content, "connect-src 'none'");
t = scenario({ 'cookie-consent': 'accepted' });
t.consent.useCookieConsent(); t.analytics.startCloudflareAnalytics(token, true); t.actions.length = 0;
t.localStorage.setItem('cookie-consent', 'rejected'); t.actions.length = 0;
window.dispatchEvent(Object.assign(new Event('storage'), {key:'cookie-consent',newValue:'rejected',storageArea:t.localStorage}));
assert.deepEqual(t.actions, ['block','reload']);
t = scenario({ 'cookie-consent': 'accepted' });
t.analytics.startCloudflareAnalytics(token, true); t.actions.length = 0;
t.localStorage.blocked = true;
t.consent.clearConsent();
assert.deepEqual(t.actions, ['block','broadcast','warn'], 'failed persistence must block, notify, and warn instead of reloading');
assert.equal(t.consent.readConsent(), null);
assert.equal(window.sessionStorage.getItem('aluplan-consent-withdrawal-pending'), '1');
t.localStorage.blocked = false;
const nextDocument = { exports: {} };
new Function('require','module','exports', consentCode)((name) => {
  if (name === 'react') return { useSyncExternalStore: () => null };
  if (name === '@/lib/cloudflare-analytics') return t.analytics;
  throw Error(name);
}, nextDocument, nextDocument.exports);
assert.equal(nextDocument.exports.readConsent(), null, 'failed withdrawal must survive same-tab navigation');
t = scenario({ 'cookie-consent': 'accepted' });
t.consent.useCookieConsent();
t.analytics.startCloudflareAnalytics(token, true); t.actions.length = 0;
t.channels[0].emit('withdrawal-not-persisted');
assert.deepEqual(t.actions, ['block','warn'], 'receiving tab must stop analytics and warn');
assert.equal(t.consent.readConsent(), null);
window.dispatchEvent(Object.assign(new Event('storage'), {key:'cookie-consent',newValue:'accepted',storageArea:t.localStorage}));
assert.equal(t.consent.readConsent(), null, 'a stale storage event cannot restore acceptance');
t = scenario({ 'cookie-consent': 'accepted' }, true);
t.consent.clearConsent();
assert.deepEqual(t.actions, ['broadcast','warn'], 'failure is visible even if Cloudflare never loaded');
t = scenario({ 'cookie-consent': 'accepted' });
t.analytics.startCloudflareAnalytics(token, true); t.actions.length = 0;
t.localStorage.removeItem('cookie-consent'); t.actions.length = 0;
window.dispatchEvent(new Event('focus'));
assert.deepEqual(t.actions, ['block','reload']);
console.log('cloudflare consent runtime: OK');
