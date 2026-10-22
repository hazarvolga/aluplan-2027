import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildTokens, lintComponentCss } from '../scripts/token-engine.mjs';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = name => fs.readFileSync(path.join(root, name), 'utf8');
const source = JSON.parse(read('tokens/tokens.json'));
const built = buildTokens(source, { responsiveTemplate: read('components/responsive.template.css') });

test('theme resolves with no broken aliases or failed contrast pairs', () => {
  assert.deepEqual(built.errors, []);
  assert.ok(built.contrast.filter(x => x.theme === 'sheet').length > 0);
  assert.equal(built.contrast.filter(x => x.theme === 'sheet' && x.pass === false).length, 0);
  assert.equal(Number.parseFloat(built.resolved.sheet.dark['--radius-surface']), 0);
});
test('authored CSS uses known semantic tokens and no primitive aliases', () => {
  const result = lintComponentCss({ 'app/globals.css': read('app/globals.css') }, built.definedVars);
  assert.deepEqual(result.errors, []);
});
test('component library is server-renderable and has isolated SVG identifiers', () => {
  const text = read('components/sheet.tsx');
  assert.ok(!text.includes('"use client"'));
  assert.match(text, /useId/);
  for (const name of ['AxisGrid', 'DimensionLine', 'SectionMarker', 'DetailCallout', 'TitleBlock', 'HatchPattern', 'ScaleBar', 'NorthArrow']) {
    assert.match(text, new RegExp(`export function ${name}\\b`));
  }
});
test('font payload stays below 120 KB and includes Turkish subsets', () => {
  const names = fs.readdirSync(path.join(root, 'public/fonts')).filter(x=>x.endsWith('.woff2'));
  assert.ok(names.some(x=>x.includes('latin-ext')));
  const total = names.reduce((n,f)=>n+fs.statSync(path.join(root,'public/fonts',f)).size,0);
  assert.ok(total < 120000, `${total} bytes`);
});
test('catalog is noindex and does not generate commercial schema', () => {
  assert.match(read('app/layout.tsx'), /index: false/);
  assert.ok(!read('app/page.tsx').includes('application/ld+json'));
});
test('fonts route through semantic tokens and heading labels name their section', () => {
  const css = read('app/globals.css');
  assert.ok(!css.includes('var(--alu-font-'));
  for (const name of ['body', 'heading', 'mono']) assert.ok(css.includes(`var(--font-${name})`));
  assert.match(read('components/sheet.tsx'), /<h2 id=\{headingId\}>/);
  assert.ok(!css.includes('transition:background-color'));
});
