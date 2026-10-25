import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const previewRoot = path.resolve(here, '..');
const dataPath = process.env.HOMEPAGE_DATA_PATH || path.join(previewRoot, 'data', 'homepage-data.js');
const componentPath = path.join(previewRoot, 'ui_kits', 'homepage', 'HomepagePreview.jsx');
const previewCssPath = path.join(previewRoot, 'ui_kits', 'homepage', 'preview.css');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync(dataPath, 'utf8'), context, { filename: dataPath });
const data = context.window.previewData;
const component = fs.readFileSync(componentPath, 'utf8');
const previewCss = fs.readFileSync(previewCssPath, 'utf8');

assert.equal(data.packages.length, 6, 'Paket envanteri altı kayıt olmalı');
assert.equal(new Set(data.packages.map(({ id }) => id)).size, 6, 'Paket kimlikleri benzersiz olmalı');
for (const item of data.packages) {
  assert.ok(item.id && item.title && item.description, 'Her paket kararlı id, başlık ve açıklama taşımalı');
}
assert.equal(data.packageAccess.href, '/docs/V2026_paket-karsilastirma-Q3-2026_R01.pdf');
assert.ok(!JSON.stringify(data.packages).match(/price|offer|rating/i), 'Paket verisi fiyat, teklif veya puan içermemeli');

assert.equal(data.bimflex.href, '/solutions/bimflex');
assert.match(data.bimflex.description, /sunulabilecektir/);
assert.equal(data.bimflex.media.length, 3);
assert.deepEqual(
  Array.from(data.bimflex.media, ({ alt }) => alt),
  ['BIMFlex kolon donatısı modeli', 'BIMFlex kiriş donatısı modeli', 'BIMFlex döşeme boşluk donatısı modeli'],
);
assert.equal(data.bimflex.relationship, 'FlexSoft tarafından geliştirilen çözüm');

assert.equal(data.innovations.length, 3);
assert.equal(new Set(data.innovations.map(({ id }) => id)).size, 3, 'Yenilik kimlikleri benzersiz olmalı');
assert.equal(data.innovationsMeta.version, 'ALLPLAN 2026');
assert.equal(data.innovationsMeta.href, '/products');

const order = ['Packages', 'Services', 'Bimflex', 'Innovations'].map((name) => component.search(new RegExp(`<${name}\\s*/>`)));
assert.ok(order.every((index) => index >= 0), 'Dört ana sayfa bloğu App içinde render edilmeli');
assert.deepEqual([...order].sort((a, b) => a - b), order, 'Blok sırası packages → services → bimflex → innovations olmalı');

for (const forbidden of ['<form', 'onSubmit', 'application/ld+json', 'schema.org', '@context', '@type']) {
  assert.ok(!component.includes(forbidden), `Önizleme uygulama katmanı içermemeli: ${forbidden}`);
}

const tokenCss = ['primitives.css', 'semantic.css', 'component-aliases.css']
  .map((file) => fs.readFileSync(path.join(previewRoot, 'tokens', file), 'utf8'))
  .join('\n');
const definitions = new Set([...`${tokenCss}\n${previewCss}`.matchAll(/(--[a-z0-9-]+)\s*:/gi)].map((match) => match[1]));
const uses = new Set([...previewCss.matchAll(/var\((--[a-z0-9-]+)/gi)].map((match) => match[1]));
assert.deepEqual([...uses].filter((name) => !definitions.has(name)), [], 'Önizleme CSS tanımsız token kullanmamalı');

console.log('Homepage preview contract: 9/9 passed');
