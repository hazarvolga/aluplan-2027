import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');

function evaluate(relativePath, requireModule) {
  const source = fs.readFileSync(path.join(root, relativePath), 'utf8');
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true },
    fileName: relativePath,
  }).outputText;
  const module = { exports: {} };
  new Function('require', 'module', 'exports', code)(requireModule, module, module.exports);
  return module.exports;
}

const SITE_ORIGIN = 'https://aluplan.com.tr';
const siteData = {
  SITE_ORIGIN,
  getAllPages: () => [{ path: '/', canonical: SITE_ORIGIN }, { path: '/products', canonical: `${SITE_ORIGIN}/products` }],
};
const flags = evaluate('src/lib/release-flags.ts', () => {
  throw new Error('release-flags must not import modules');
});
const routes = evaluate('src/lib/release-2027-routes.ts', (request) => {
  if (request === './site-data') return siteData;
  if (request === './release-flags') return flags;
  throw new Error(`Unsupported release-2027-routes import: ${request}`);
});
const schema = evaluate('src/lib/schema.ts', (request) => {
  if (request === './site-data') return { ...siteData, getSiteIdentity: () => ({}) };
  throw new Error(`Unsupported schema import: ${request}`);
});
const sitemap = evaluate('src/app/sitemap.ts', (request) => {
  if (request === '@/lib/site-data') return siteData;
  if (request === '@/lib/release-flags') return flags;
  if (request === '@/lib/release-2027-routes') return routes;
  throw new Error(`Unsupported sitemap import: ${request}`);
});

function withEnv(show, block, fn) {
  process.env.NODE_ENV = 'production';
  process.env.ALUPLAN_SHOW_2027 = show;
  process.env.ALUPLAN_BLOCK_INDEXING = block;
  return fn();
}

const live = withEnv('1', '0', () => ({
  metadata: Object.fromEntries(routes.RELEASE_2027_ROUTES.map((r) => [r.path, routes.buildRelease2027Metadata(r.path)])),
  jsonLd: Object.fromEntries(routes.RELEASE_2027_ROUTES.map((r) => [r.path, routes.buildRelease2027JsonLd(r.path)])),
  sitemap: sitemap.default().map((entry) => entry.url),
}));
const review = withEnv('1', '1', () => ({
  robots: routes.buildRelease2027Metadata('/2027/max').robots,
}));
const rollback = withEnv('0', '0', () => ({ sitemap: sitemap.default().map((entry) => entry.url) }));

process.stdout.write(JSON.stringify({
  live,
  review,
  rollback,
  escaped: schema.serializeJsonLd({ value: '</script><script>' }),
}));
