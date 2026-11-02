/** @type {import('next').NextConfig} */
const isDev = process.env.NODE_ENV !== 'production';

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://www.googletagmanager.com https://www.google-analytics.com`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: https://aluplan.com.tr https://*.allplan.com https://img.youtube.com https://i.ytimg.com",
      "font-src 'self' data:",
      "frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://forms.office.com https://www.google.com https://maps.google.com",
      "connect-src 'self' https://www.google-analytics.com https://region1.google-analytics.com https://www.googletagmanager.com",
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

const nextConfig = {
  poweredByHeader: false,
  env: { ALUPLAN_2027_PREVIEW: process.env.ALUPLAN_2027_PREVIEW ?? '0' },
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: process.env.ALUPLAN_2027_PREVIEW === '1'
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
