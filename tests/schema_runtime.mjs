import { evaluateCommonJs, loadSiteModules, transpile } from './site_data_runtime_loader.mjs';

const { siteData } = loadSiteModules();
const description = evaluateCommonJs(transpile('src/lib/metadata-description.ts'), () => { throw new Error('metadata-description must not import'); });

const presentation = evaluateCommonJs(transpile('src/components/sections/subpage-hero-presentation.ts'), () => {
  throw new Error('presentation must not import');
});
const shareImage = evaluateCommonJs(transpile('src/lib/share-image.ts'), (request) => {
  if (request === './site-data') return siteData;
  if (request === '../components/sections/subpage-hero-presentation') return presentation;
  throw new Error(`Unsupported share-image import: ${request}`);
});

const schema = evaluateCommonJs(
  transpile('src/lib/schema.ts'),
  (request) => {
    if (request === './site-data') return siteData;
    if (request === './share-image') return shareImage;
    if (request === './metadata-description') return description;
    throw new Error(`Unsupported schema import: ${request}`);
  },
);

const route = process.argv[2];
const page = siteData.getPageData(route);
if (!page) throw new Error(`Unknown page route: ${route}`);

process.stdout.write(JSON.stringify(schema.buildPageJsonLd(page, page.playlistId ? siteData.getPlaylistData(page.playlistId) : null)));
