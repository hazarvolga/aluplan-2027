/** Generate searchable text from published release routes and their content sources. */
import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = process.cwd();
const output = 'src/data/search-release-index.json';
const pageSources = {
  '/2027/features': ['src/components/sections/Allplan2027FeaturesPreview.tsx', 'src/data/allplan-2027-features-preview.ts', 'src/data/allplan-2027-improvements.ts'],
  '/products/allplan-max': ['src/components/sections/AllplanMaxPreviewPage.tsx', 'src/data/allplan-max-preview.json'],
  '/2027/civil': ['src/components/sections/CivilNewsView.tsx', 'src/data/allplan-civil-2027-news.ts'],
  '/products/frilo': ['src/app/products/frilo/page.tsx', 'src/app/products/frilo/content.ts', 'src/data/frilo-editions-2027.ts', 'src/data/frilo-geotechnics-2027.ts'],
  '/products/scia': ['src/app/products/scia/page.tsx'],
  '/2027/allplan-basic': ['src/components/sections/AllplanEditionNewsView.tsx', 'src/data/allplan-2027-editions.ts#basic'],
  '/2027/allplan-concept': ['src/components/sections/AllplanEditionNewsView.tsx', 'src/data/allplan-2027-editions.ts#concept'],
  '/2027/allplan-professional': ['src/components/sections/AllplanEditionNewsView.tsx', 'src/data/allplan-2027-editions.ts#professional'],
  '/2027/allplan-ultimate': ['src/components/sections/AllplanEditionNewsView.tsx', 'src/data/allplan-2027-editions.ts#ultimate'],
  '/paket-karsilastirma': ['src/app/paket-karsilastirma/page.tsx', 'src/app/paket-karsilastirma/ComparisonTable.tsx', 'src/app/paket-karsilastirma/data.ts', 'src/app/paket-karsilastirma/descriptions.ts'],
  '/product-lifecycle': ['src/app/product-lifecycle/page.tsx', 'src/app/product-lifecycle/data.ts'],
  '/kaynaklar': ['src/components/sections/ResourcesDirectory.tsx', 'src/data/homepage.json#services'],
  '/egitim-merkezlerimiz': ['src/components/sections/EducationPartners.tsx', 'src/data/education-partners.ts'],
  '/kaydedilmis-webinarlar': ['src/components/sections/RecordedWebinars.tsx', 'src/data/recorded-webinars.ts'],
};
const ignoredKeys = new Set(['id', 'sourceId', 'slug', 'path', 'href', 'src', 'image', 'imageSrc', 'icon', 'video', 'youtubeId', 'className', 'style', 'variant', 'size', 'unit', 'key', 'labelledby', 'role', 'type', 'target', 'rel']);
function isText(value) {
  return value && !/^(?:https?:|mailto:|tel:|\/|#|\.|use client$|use server$)/.test(value)
    && !/\.(?:tsx?|json|css|jpe?g|png|svg|webp|mp4|pdf)$/i.test(value)
    && /[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(value);
}
const parse = (filename) => ts.createSourceFile(filename, fs.readFileSync(path.join(root, filename), 'utf8'), ts.ScriptTarget.Latest, true, filename.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
for (const [route, specs] of Object.entries(pageSources)) {
  const mapped = new Set(specs.map((spec) => spec.split('#')[0]));
  for (const spec of specs) {
    const file = spec.split('#')[0];
    if (file.endsWith('.json')) continue;
    const source = parse(file);
    for (const node of source.statements) {
      if (!ts.isImportDeclaration(node) || node.importClause?.isTypeOnly || !ts.isStringLiteral(node.moduleSpecifier)) continue;
      const name = node.moduleSpecifier.text;
      if (!name.startsWith('@/data/') && !/^\.\/(?:data|content|descriptions)$/.test(name)) continue;
      const base = name.startsWith('@/data/') ? `src/data/${name.slice(7)}` : path.join(path.dirname(file), name);
      const target = [base, `${base}.ts`, `${base}.json`].find((candidate) => fs.existsSync(path.join(root, candidate)));
      if (target && !mapped.has(target)) throw Error(`${route}: search content source not mapped: ${target}`);
    }
  }
}
function propertyName(node) { return node && (ts.isIdentifier(node) || ts.isStringLiteral(node)) ? node.text : ''; }
function objectProperty(obj, key) { return obj.properties.find((p) => ts.isPropertyAssignment(p) && propertyName(p.name) === key); }
function findDeclaration(source, name) {
  let found;
  function visit(node) { if (ts.isVariableDeclaration(node) && node.name.getText(source) === name) found = node.initializer; else ts.forEachChild(node, visit); }
  visit(source); return found;
}
function strings(node) {
  const results = [];
  function walk(n) {
    if (ts.isImportDeclaration(n) || ts.isImportTypeNode(n) || ts.isTypeNode(n)) return;
    if (ts.isPropertyAssignment(n) && ignoredKeys.has(propertyName(n.name))) return;
    if (ts.isJsxAttribute(n) && (ignoredKeys.has(propertyName(n.name)) || propertyName(n.name) === 'name')) return;
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isJsxText(n)) {
      if (ts.isPropertyAssignment(n.parent) && n.parent.name === n) return;
      const s = n.text.trim().replace(/\s+/g, ' ');
      const parent = n.parent;
      const contentPosition = ts.isJsxText(n) || ts.isJsxAttribute(parent) || ts.isPropertyAssignment(parent)
        || ts.isArrayLiteralExpression(parent) || (ts.isCallExpression(parent) && ts.isIdentifier(parent.expression) && parent.expression.text === 'entry')
        || (ts.isVariableDeclaration(parent) && !parent.name.getText().startsWith('HIDDEN_'));
      if (contentPosition && isText(s)) results.push(s);
      return;
    }
    ts.forEachChild(n, walk);
  }
  walk(node); return results;
}
function contentSource(spec) {
  const [file, selector] = spec.split('#');
  if (file.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
    const groupList = selector === 'services' ? data.serviceGroups.filter((g) => g.title !== 'Partner erişimi') : [];
    const titles = new Set(groupList.flatMap((g) => g.serviceTitles));
    const selected = selector === 'services' ? [...groupList.map((g) => g.title), ...data.services.filter((item) => titles.has(item.title)).flatMap((item) => [item.title, item.description, item.cta])] : [];
    function flatten(v) { if (typeof v === 'string') return [v]; if (Array.isArray(v)) return v.flatMap(flatten); if (v && typeof v === 'object') return Object.entries(v).filter(([k]) => !ignoredKeys.has(k)).flatMap(([, x]) => flatten(x)); return []; }
    return (selector === 'services' ? selected : flatten(data)).filter(isText);
  }
  const source = parse(file);
  if (!selector) return strings(source);
  const items = findDeclaration(source, 'editions');
  if (!items || !ts.isArrayLiteralExpression(items)) throw Error(`Missing editions array: ${file}`);
  const item = items.elements.find((e) => ts.isObjectLiteralExpression(e) && objectProperty(e, 'slug')?.initializer?.text === selector);
  if (!item) throw Error(`Missing edition ${selector}`);
  return strings(item);
}
const source = parse('src/lib/release-2027-routes.ts');
const routes = findDeclaration(source, 'RELEASE_2027_ROUTES');
if (!routes || !ts.isArrayLiteralExpression(routes)) throw Error('Missing release routes');
const records = routes.elements.filter(ts.isObjectLiteralExpression).filter((r) => !objectProperty(r, 'heldUntilManufacturerRelease')).map((route) => {
  const value = (name) => objectProperty(route, name)?.initializer?.text;
  const routePath = value('path');
  if (!pageSources[routePath]) throw Error(`Published route lacks search content mapping: ${routePath}`);
  const title = value('name');
  return { path: routePath, title, seoTitle: `${title} | Aluplan`, section: routePath.startsWith('/products/') ? 'Ürünler' : 'Sayfalar', description: value('description'), keywords: [...new Set(pageSources[routePath].flatMap(contentSource))].join(' ') };
});
const out = JSON.stringify(records, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== out) { console.error(`${output} is out of date; run node scripts/build_release_search_index.mjs`); process.exitCode = 1; }
} else { fs.writeFileSync(output, out); console.log(`Generated ${records.length} published release search entries`); }
