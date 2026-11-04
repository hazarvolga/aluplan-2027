import type { MetadataRoute } from 'next';
import { getAllPages, SITE_ORIGIN } from '@/lib/site-data';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { PUBLISHED_RELEASE_2027_ROUTES } from '@/lib/release-2027-routes';

const NON_INDEXABLE_PATHS = new Set(['/health', '/search', '/hero-3d', '/test-webgl', '/package-overview']);
const LAST_MODIFIED = new Date('2026-10-25T00:00:00.000Z');
const RELEASE_LAST_MODIFIED = new Date('2026-11-02T00:00:00.000Z');

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

  return [...pageEntries, ...releaseEntries];
}
