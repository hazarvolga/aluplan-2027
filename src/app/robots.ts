import type { MetadataRoute } from 'next';
import { SITE_ORIGIN } from '@/lib/site-data';

const DISALLOW_PATHS = ['/api/', '/_next/', '/health', '/hero-3d', '/test-webgl'];

export default function robots(): MetadataRoute.Robots {
  if (process.env.ALUPLAN_2027_PREVIEW === '1') return { rules: { userAgent: '*', disallow: '/' } };
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
