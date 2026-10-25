import type { MetadataRoute } from 'next';
import { getAllPages, SITE_ORIGIN } from '@/lib/site-data';

const NON_INDEXABLE_PATHS = new Set(['/health', '/search', '/hero-3d', '/test-webgl']);

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = getAllPages().filter((p) => !NON_INDEXABLE_PATHS.has(p.path));
  const now = new Date('2026-10-25T00:00:00.000Z');

  return pages.map((page) => ({
    url: page.canonical || (page.path === '/' ? SITE_ORIGIN : `${SITE_ORIGIN}${page.path}`),
    lastModified: now,
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
}
