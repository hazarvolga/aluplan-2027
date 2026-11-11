import type { MetadataRoute } from 'next';
import { getAllPages, SITE_ORIGIN } from '@/lib/site-data';
import { isAkademiEnabled, isReleaseContentEnabled } from '@/lib/release-flags';
import { listAkademiPages, type AkademiPageKind } from '@/lib/akademi-pages';
import { PUBLISHED_RELEASE_2027_ROUTES } from '@/lib/release-2027-routes';

const NON_INDEXABLE_PATHS = new Set(['/health', '/search', '/hero-3d', '/test-webgl', '/package-overview']);
const LAST_MODIFIED = new Date('2026-10-25T00:00:00.000Z');
const RELEASE_LAST_MODIFIED = new Date('2026-11-02T00:00:00.000Z');
const AKADEMI_LAST_MODIFIED = new Date('2026-11-11T00:00:00.000Z');
const AKADEMI_PRIORITY: Record<AkademiPageKind, number> = { overview: 0.8, level: 0.7, series: 0.7, module: 0.6, lesson: 0.6 };

export default function sitemap(): MetadataRoute.Sitemap {
  // A release route that reuses a page-data path (the package comparison) is listed once, from the release entry.
  const releasePaths = new Set(isReleaseContentEnabled() ? PUBLISHED_RELEASE_2027_ROUTES.map((route) => route.path) : []);
  const pages = getAllPages().filter((p) => !NON_INDEXABLE_PATHS.has(p.path) && !releasePaths.has(p.path));

  const pageEntries: MetadataRoute.Sitemap = pages.map((page) => ({
    url: page.canonical || (page.path === '/' ? SITE_ORIGIN : `${SITE_ORIGIN}${page.path}`),
    lastModified: LAST_MODIFIED,
    changeFrequency: page.path === '/' ? 'weekly' : 'monthly',
    priority:
      page.path === '/'
        ? 1.0
        : page.path === '/products' || page.path === '/solutions' || page.path === '/paket-karsilastirma'
          ? 0.9
          : page.path.startsWith('/products/') || page.path.startsWith('/solutions/')
            ? 0.8
            : 0.7
  }));

  const releaseEntries: MetadataRoute.Sitemap = isReleaseContentEnabled()
    ? PUBLISHED_RELEASE_2027_ROUTES.map((route) => ({
        url: `${SITE_ORIGIN}${route.path}`,
        lastModified: RELEASE_LAST_MODIFIED,
        changeFrequency: 'monthly',
        priority: 0.9
      }))
    : [];

  // Akademi pages are listed only while the launch flag is on (they 404 otherwise).
  const akademiEntries: MetadataRoute.Sitemap = isAkademiEnabled()
    ? listAkademiPages().map((page) => ({
        url: `${SITE_ORIGIN}${page.path}`,
        lastModified: AKADEMI_LAST_MODIFIED,
        changeFrequency: 'monthly',
        priority: AKADEMI_PRIORITY[page.kind]
      }))
    : [];

  return [...pageEntries, ...releaseEntries, ...akademiEntries];
}
