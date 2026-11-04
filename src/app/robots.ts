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
          'OAI-SearchBot',
          'ChatGPT-User',
          'Claude-SearchBot',
          'Claude-User',
          'PerplexityBot',
          'Perplexity-User'
        ],
        allow: ['/', '/llms.txt'],
        disallow: DISALLOW_PATHS
      },
      {
        userAgent: ['GPTBot', 'ClaudeBot', 'Google-Extended'],
        disallow: '/'
      }
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
    host: SITE_ORIGIN
  };
}
