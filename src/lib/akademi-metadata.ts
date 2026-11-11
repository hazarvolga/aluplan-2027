import type { Metadata } from 'next';
import { SITE_ORIGIN } from './site-data';
import { isAkademiEnabled, isIndexingBlocked } from './release-flags';
import { getAkademiPage } from './akademi-pages';

const SHARE_IMAGE_SIZE = { width: 1200, height: 630 } as const;

/**
 * Metadata for an Akademi page from the shared page catalog: title, description, canonical,
 * Open Graph + X card with a generated share image (/og/akademi/…). Indexing follows the
 * launch flag (ALLPLAN_SHOW_AKADEMI) and the review switch (ALUPLAN_BLOCK_INDEXING); when the
 * Akademi is disabled the pages 404 anyway, and robots says noindex as a second guard.
 */
export function akademiMetadata(path: string): Metadata {
  const page = getAkademiPage(path);
  if (!page) return { robots: { index: false, follow: false } };

  const title = page.kind === 'overview' ? 'Aluplan Akademi | ALLPLAN Türkçe Eğitim Programı' : `${page.title} | Aluplan Akademi`;
  const url = `${SITE_ORIGIN}${page.path}`;
  const image = { url: `${SITE_ORIGIN}/og${page.path}`, alt: page.title, ...SHARE_IMAGE_SIZE };
  // Indexable only when launched and not under the site-wide review switch (ALUPLAN_BLOCK_INDEXING).
  const indexable = isAkademiEnabled() && !isIndexingBlocked();

  return {
    title,
    description: page.description,
    alternates: { canonical: url },
    robots: indexable ? { index: true, follow: true } : { index: false, follow: false },
    openGraph: {
      title,
      description: page.description,
      url,
      siteName: 'Aluplan Akademi',
      locale: 'tr_TR',
      type: 'website',
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: page.description,
      images: [image.url],
    },
  };
}
