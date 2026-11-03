/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';
// Mirrors isReleaseContentEnabled(): the 2027 pages exist in development or when the release flag is on.
const showRelease = isDev || process.env.ALUPLAN_SHOW_2027 === '1';

// The retired flag both showed 2027 content and blocked indexing; deploying without its replacements would silently index the review site.
if (
  process.env.ALUPLAN_2027_PREVIEW !== undefined &&
  (process.env.ALUPLAN_SHOW_2027 === undefined || process.env.ALUPLAN_BLOCK_INDEXING === undefined)
) {
  throw new Error(
    'ALUPLAN_2027_PREVIEW is retired. Set ALUPLAN_SHOW_2027 and ALUPLAN_BLOCK_INDEXING explicitly before building.'
  );
}

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://aluplan.com.tr https://*.allplan.com https://img.youtube.com https://i.ytimg.com https://*.google-analytics.com https://*.googletagmanager.com https://*.google.com https://*.google.com.tr",
      "font-src 'self' data:",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://forms.office.com https://www.google.com https://maps.google.com",
      "connect-src 'self' https://*.google-analytics.com https://*.analytics.google.com https://*.googletagmanager.com https://*.g.doubleclick.net https://*.google.com https://*.google.com.tr",
      "media-src 'self' blob: data:",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self' https://forms.office.com",
      "frame-ancestors 'none'",
      ...(isDev ? [] : ['upgrade-insecure-requests'])
    ].join('; ')
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
];

// Public files keep stable names, so they get a week of caching instead of `immutable`.
const STATIC_ASSET_PREFIXES = ['/assets', '/docs', '/videos', '/images'];
const STATIC_ASSET_CACHE = 'public, max-age=604800, stale-while-revalidate=86400';

const nextConfig = {
  poweredByHeader: false,
  env: {
    ALUPLAN_SHOW_2027: process.env.ALUPLAN_SHOW_2027 ?? '0',
    ALUPLAN_BLOCK_INDEXING: process.env.ALUPLAN_BLOCK_INDEXING ?? '0',
    ALUPLAN_VERCEL_INSIGHTS: process.env.VERCEL === '1' ? '1' : '0'
  },
  reactStrictMode: true,
  async headers() {
    return [
      ...STATIC_ASSET_PREFIXES.map((prefix) => ({
        source: `${prefix}/:path*`,
        headers: [{ key: 'Cache-Control', value: STATIC_ASSET_CACHE }]
      })),
      {
        source: '/:path*',
        headers: process.env.ALUPLAN_BLOCK_INDEXING === '1'
          ? [...securityHeaders, { key: 'X-Robots-Tag', value: 'noindex, nofollow' }]
          : securityHeaders
      }
    ];
  },
  async redirects() {
    return [
      {
        source: '/solutions/PlanliAlanlar',
        destination: '/solutions/imar-yonetmeligi-bim-eklentisi',
        permanent: true
      },
      {
        source: '/solutions/addons/drive-curvev',
        destination: '/solutions/addons/drive-curve',
        permanent: true
      },
      {
        source: '/solutions/extra-modules',
        destination: '/solutions/addons',
        permanent: true
      },
      {
        source: '/solutions/industry',
        destination: '/solutions/steel',
        permanent: true
      },
      {
        source: '/solutions/bimplus',
        destination: '/products/allplan-bimplus',
        permanent: true
      },
      {
        source: '/allplan-2026nin-ozellikleri',
        destination: '/products/allplan-2026-yenilikler',
        permanent: true
      },
      {
        source: '/allplan-2021-features',
        destination: '/products/allplan-2026-yenilikler',
        permanent: true
      },
      {
        source: '/docs/V2026_paket-karsilastirme-Q3-2026_R01.pdf',
        destination: '/paket-karsilastirma',
        permanent: true
      },
      {
        source: '/docs/V2026_Paket_Karsilastirma-Q4-2025_R01.pdf',
        destination: '/paket-karsilastirma',
        permanent: true
      },
      {
        source: '/2027/compare',
        destination: '/paket-karsilastirma',
        permanent: true
      },
      {
        source: '/solutions-v2/faq',
        destination: '/faq',
        permanent: true
      },
      {
        source: '/solutions-v2/training',
        destination: showRelease ? '/kaynaklar' : '/',
        permanent: true
      },
      {
        source: '/solutions-v2/training/webinar',
        destination: showRelease ? '/kaydedilmis-webinarlar' : '/',
        permanent: true
      },
      {
        source: '/solutions-v2/training/video-library/:path*',
        destination: '/video-kutuphanesi/:path*',
        permanent: true
      },
      {
        source: '/preview/product-lifecycle',
        destination: '/product-lifecycle',
        permanent: true
      },
      {
        source: '/try-free',
        destination: 'https://www.allplan.com/trial-or-subscription/',
        permanent: true
      }
    ];
  },
  async rewrites() {
    return [
      {
        source: '/solutions/imar-yonetmliği-bim-eklentisi',
        destination: '/solutions/imar-yonetmeligi-bim-eklentisi'
      },
      {
        source: '/solutions/imar-yonetmli%C4%9Fi-bim-eklentisi',
        destination: '/solutions/imar-yonetmeligi-bim-eklentisi'
      },
      {
        source: '/_next/static/chunks/assets/documents/ax3000/ax3000-brochure-de.:hash.pdf',
        destination: '/docs/ax3000/ax3000-brochure-de.pdf'
      },
      {
        source: '/_next/static/chunks/assets/documents/ax3000/ax3000-brochure-en-alternative.:hash.pdf',
        destination: '/docs/ax3000/ax3000-brochure-en-alternative.pdf'
      },
      {
        source: '/_next/static/chunks/assets/documents/ax3000/ax3000-brochure-en.:hash.pdf',
        destination: '/docs/ax3000/ax3000-brochure-en.pdf'
      },
      {
        source: '/_next/static/chunks/assets/documents/ax3000/ax3000-functions-en.:hash.pdf',
        destination: '/docs/ax3000/ax3000-functions-en.pdf'
      },
      {
        source: '/_next/static/chunks/assets/documents/ax3000/ax3000-functions-en.:hash.docx',
        destination: '/docs/ax3000/ax3000-functions-en.docx'
      },
      {
        source: '/_next/static/chunks/assets/documents/ax3000/ax3000-functions-hexagon-en.:hash.docx',
        destination: '/docs/ax3000/ax3000-functions-hexagon-en.docx'
      }
    ];
  }
};

export default nextConfig;
