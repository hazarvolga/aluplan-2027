import { evaluateCommonJs, loadSiteModules, transpile } from './site_data_runtime_loader.mjs';

const { siteData, siteShared } = loadSiteModules();

const policy = evaluateCommonJs(
  transpile('src/components/sections/page-end-conversion-policy.ts'),
  (request) => {
    if (request === '@/lib/site-data') return siteData;
    if (request === '@/lib/site-shared') return siteShared;
    throw new Error(`Unsupported policy import: ${request}`);
  },
);

const routes = process.argv.slice(2);
const results = Object.fromEntries(routes.map((route) => {
  const page = siteData.getPageData(route);
  if (!page) throw new Error(`Unknown page route: ${route}`);
  return [route, policy.getPageEndConversion(page)];
}));

process.stdout.write(JSON.stringify({
  results,
  approvedUrls: [
    siteData.MAIN_QUOTE_FORM_URL,
    siteData.TRIAL_CTA_URL,
    siteData.SUPPORT_PORTAL_URL,
  ],
}));
