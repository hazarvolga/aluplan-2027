import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/site-data';
import { isIndexingBlocked } from '@/lib/release-flags';

const DISALLOW_PATHS = ['/api/', '/health', '/hero-3d', '/test-webgl'];

export default function robots(): MetadataRoute.Robots {
  if (isIndexingBlocked()) return { rules: { userAgent: '*', disallow: '/' } };
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: DISALLOW_PATHS
      },
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ChatGPT-User',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended'
        ],
        allow: ['/', '/llms.txt'],
        disallow: DISALLOW_PATHS
      }
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN
  };
}
