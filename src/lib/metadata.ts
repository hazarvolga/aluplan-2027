import type { Metadata } from 'next';
import { getPageData } from './site-data';
import { getPageShareImage } from './share-image';

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
  const shareImage = getPageShareImage(page);

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
      images: [shareImage]
    },
    twitter: {
      card: 'summary_large_image',
      title: page.title,
      description: page.description,
      images: [shareImage.url]
    }
  };
}
