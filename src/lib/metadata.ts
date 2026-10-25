import type { Metadata } from 'next';
import { getPageData, SITE_ORIGIN } from './site-data';

export function buildPageMetadata(pathname: string): Metadata {
  const page = getPageData(pathname);
  if (!page) {
    return {
      title: 'Sayfa Bulunamadı | Aluplan',
      description: 'Aradığınız sayfa bulunamadı.',
      robots: { index: false, follow: false }
    };
  }

  const isUtility = page.path === '/health' || page.path === '/search';

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: page.canonical
    },
    robots: isUtility
      ? { index: false, follow: true }
      : { index: true, follow: true },
    openGraph: {
      title: page.title,
      description: page.description,
      url: page.canonical,
      siteName: 'Aluplan Program Sistemleri',
      locale: 'tr_TR',
      type: 'website',
      images: [
        {
          url: `${SITE_ORIGIN}/opengraph-image.png`,
          width: 1200,
          height: 630,
          alt: page.h1
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [`${SITE_ORIGIN}/opengraph-image.png`]
    }
  };
}
