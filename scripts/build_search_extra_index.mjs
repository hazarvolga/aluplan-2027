/** Search text for bespoke non-release page components. */
import fs from 'node:fs';
import ts from 'typescript';

const output = 'src/data/search-extra-index.json';
const ignoredKeys = new Set(['id', 'sourceId', 'slug', 'path', 'href', 'src', 'image', 'imageSrc', 'icon', 'video', 'youtubeId', 'className', 'style', 'variant', 'size', 'unit', 'key', 'role', 'type', 'target', 'rel']);
const isText = (s) => typeof s === 'string' && s.trim() && !/^(?:https?:|mailto:|tel:|\/|#|\.|use client$|use server$)/.test(s) && !/\.(?:tsx?|json|css|jpe?g|png|svg|webp|mp4|pdf)$/i.test(s) && /[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(s);
const keyOf = (n) => n && (ts.isIdentifier(n) || ts.isStringLiteral(n)) ? n.text : '';
function parse(file) { return ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true, file.endsWith('.tsx') ? ts.ScriptKind.TSX : ts.ScriptKind.TS); }
function texts(node) {
  const found = [];
  function visit(n) {
    if (ts.isImportDeclaration(n) || ts.isImportTypeNode(n) || ts.isTypeNode(n)) return;
    if (ts.isPropertyAssignment(n) && ignoredKeys.has(keyOf(n.name))) return;
    if (ts.isJsxAttribute(n) && (ignoredKeys.has(keyOf(n.name)) || keyOf(n.name) === 'name')) return;
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isJsxText(n)) {
      const p = n.parent;
      if (ts.isPropertyAssignment(p) && p.name === n) return;
      const content = ts.isJsxText(n) || ts.isJsxAttribute(p) || ts.isPropertyAssignment(p) || ts.isArrayLiteralExpression(p) || (ts.isVariableDeclaration(p) && /^[A-Z_]+$/.test(p.name.getText()) && !p.name.getText().startsWith('HIDDEN_'));
      const s = n.text.trim().replace(/\s+/g, ' ');
      if (content && isText(s)) found.push(s);
      return;
    }
    ts.forEachChild(n, visit);
  }
  visit(node); return found;
}
function flatten(value) {
  if (typeof value === 'string') return isText(value) ? [value] : [];
  if (Array.isArray(value)) return value.flatMap(flatten);
  if (value && typeof value === 'object') return Object.entries(value).filter(([k]) => !ignoredKeys.has(k)).flatMap(([, v]) => flatten(v));
  return [];
}
function fileContent(file) { return file.endsWith('.json') ? flatten(JSON.parse(fs.readFileSync(file, 'utf8'))) : texts(parse(file)); }
function conditionalSdsText() {
  const source = parse('src/components/sections/StructuredPageLayoutSection.tsx');
  const result = [];
  function visit(n) {
    if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken && ts.isBinaryExpression(n.left)
      && n.left.operatorToken.kind === ts.SyntaxKind.EqualsEqualsEqualsToken && n.left.left.getText(source) === 'pagePath'
      && ts.isStringLiteral(n.left.right) && n.left.right.text === '/products/sds2-home') {
      result.push(...texts(n.right));
      return;
    }
    ts.forEachChild(n, visit);
  }
  visit(source);
  function survey(n) {
    if (ts.isVariableDeclaration(n) && n.name.getText(source) === 'SDS2_SURVEY_SOURCE' && n.initializer && ts.isStringLiteral(n.initializer)) result.push(n.initializer.text);
    else ts.forEachChild(n, survey);
  }
  survey(source); return result;
}
// The homepage has two render variants. Prune known previewMaxHero branches before collecting text.
function homepageVariantText(release) {
  const source = parse('src/components/sections/HomepageView.tsx');
  const result = [];
  function knownCondition(n) {
    if (ts.isIdentifier(n) && n.text === 'previewMaxHero') return release;
    if (ts.isPrefixUnaryExpression(n) && n.operator === ts.SyntaxKind.ExclamationToken) {
      const value = knownCondition(n.operand); return value === null ? null : !value;
    }
    if (ts.isParenthesizedExpression(n)) return knownCondition(n.expression);
    return null;
  }
  function visit(n) {
    if (ts.isImportDeclaration(n) || ts.isTypeNode(n)) return;
    if (ts.isPropertyAssignment(n) && ignoredKeys.has(keyOf(n.name))) return;
    if (ts.isJsxAttribute(n) && (ignoredKeys.has(keyOf(n.name)) || keyOf(n.name) === 'name')) return;
    if (ts.isConditionalExpression(n)) {
      const match = knownCondition(n.condition);
      if (match !== null) { visit(match ? n.whenTrue : n.whenFalse); return; }
    }
    if (ts.isBinaryExpression(n) && n.operatorToken.kind === ts.SyntaxKind.AmpersandAmpersandToken) {
      const match = knownCondition(n.left);
      if (match !== null) { if (match) visit(n.right); return; }
    }
    if (ts.isStringLiteral(n) || ts.isNoSubstitutionTemplateLiteral(n) || ts.isJsxText(n)) { result.push(...texts(n)); return; }
    ts.forEachChild(n, visit);
  }
  visit(source); return result;
}
function productTabLabels() {
  const source = parse('src/components/sections/ProductTabs.tsx');
  const result = [];
  function visit(n) {
    if (ts.isBindingElement(n) && ['label', 'actionLabel'].includes(n.name.getText(source)) && n.initializer && ts.isStringLiteral(n.initializer)) result.push(n.initializer.text);
    else ts.forEachChild(n, visit);
  }
  visit(source); return result;
}
function scalypsoApplicationNames() {
  const source = parse('src/components/sections/ScalypsoPageContent.tsx');
  let names = [];
  function visit(n) {
    if (ts.isVariableDeclaration(n) && n.name.getText(source) === 'APPLICATION_IMAGES' && n.initializer && ts.isObjectLiteralExpression(n.initializer)) {
      names = n.initializer.properties.map((p) => keyOf(p.name)).filter(isText);
      return;
    }
    ts.forEachChild(n, visit);
  }
  visit(source); return names;
}
const home = JSON.parse(fs.readFileSync('src/data/homepage.json', 'utf8'));
const homeCommon = ['roles', 'products', 'solutions', 'bimflex'].flatMap((key) => flatten(home[key]));
const homeLegacy = ['heroContent', 'quickLinks', 'packageAccess', 'packages'].flatMap((key) => flatten(home[key]));
const configs = [
  { path: '/', keywords: [...homeCommon, ...fileContent('src/components/sections/DisciplineWorkflowSection.tsx')] },
  { path: '/', legacyOnly: true, keywords: [...homeLegacy, ...homepageVariantText(false)] },
  { path: '/', releaseOnly: true, keywords: [...homepageVariantText(true), ...productTabLabels(), ...flatten(home.quickLinks.filter(([, href]) => href === '/products/allplan-cloud-services'))], files: ['src/components/sections/Homepage2027PreviewView.tsx', 'src/components/sections/HomepageMaxPreviewHero.tsx', 'src/components/sections/HomepageProductHeading.tsx', 'src/data/homepage-2027-preview.json'] },
  { path: '/products', files: ['src/components/sections/ProductsInnovations.tsx', 'src/data/products-innovations.json'] },
  { path: '/products/sds2-home', files: ['src/data/sds2-2027-features.ts'], keywords: conditionalSdsText() },
  { path: '/about', files: ['src/components/sections/AboutEditorialSection.tsx'] },
  { path: '/solutions/scalypso', files: ['src/components/sections/ScalypsoPageContent.tsx'], keywords: scalypsoApplicationNames() },
  { path: '/solutions/scalypso/modeler', files: ['src/components/sections/ScalypsoModeler.tsx'] },
  { path: '/solutions/scalypso/mobile', files: ['src/components/sections/ScalypsoSubpage.tsx'] },
  { path: '/solutions/scalypso/viewer', files: ['src/components/sections/ScalypsoSubpage.tsx'] },
  { path: '/solutions/scalypso/converter', files: ['src/components/sections/ScalypsoSubpage.tsx'] },
  { path: '/solutions/scalypso/videos', files: ['src/components/sections/ScalypsoSubpage.tsx'] },
  { path: '/solutions/cds-addon', files: ['src/components/sections/CdsAddonPageContent.tsx'] },
  { path: '/solutions/ax3000-mekanik-tesisat', files: ['src/components/sections/Ax3000MechanicalContent.tsx'] },
];
// Use the same route policy as SubpageView instead of assigning every CTA to every page.
const policySource = fs.readFileSync('src/components/sections/page-end-conversion-policy.ts', 'utf8');
const policyCode = ts.transpileModule(policySource, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
const policyModule = { exports: {} };
new Function('require', 'module', 'exports', policyCode)((request) => {
  if (request === '@/lib/site-shared') return { MAIN_QUOTE_FORM_URL: '/', SUPPORT_PORTAL_URL: '/', TRIAL_CTA_URL: '/' };
  throw Error(`Unexpected policy import: ${request}`);
}, policyModule, policyModule.exports);
const pageData = JSON.parse(fs.readFileSync('src/data/pages.json', 'utf8'));
for (const page of Object.values(pageData)) {
  if (page.path === '/package-overview') continue;
  const model = policyModule.exports.getPageEndConversion(page);
  if (!model) continue;
  configs.push({path: page.path, ...(page.path === '/paket-karsilastirma' ? {legacyOnly: true} : {}), keywords: [model.kicker, model.title, model.description, 'Nasıl ilerlemek istersiniz?', ...model.actions.map((action) => action.label)]});
}
const result = configs.map(({path, files = [], keywords = [], releaseOnly, legacyOnly}) => ({ path, ...(releaseOnly ? {releaseOnly: true} : {}), ...(legacyOnly ? {legacyOnly: true} : {}), keywords: [...new Set([...keywords, ...files.flatMap(fileContent)])].join(' ') }));
const out = JSON.stringify(result, null, 2) + '\n';
if (process.argv.includes('--check')) {
  if (!fs.existsSync(output) || fs.readFileSync(output, 'utf8') !== out) { console.error(`${output} is out of date; run node scripts/build_search_extra_index.mjs`); process.exitCode = 1; }
} else { fs.writeFileSync(output, out); console.log(`Generated ${result.length} route-specific extra search entries`); }
