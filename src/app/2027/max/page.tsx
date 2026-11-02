import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AllplanMaxPreviewPage } from '@/components/sections/AllplanMaxPreviewPage';
import { isReleaseContentEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  title: 'Allplan Max | Yerel Önizleme',
  description: 'Allplan Max ürün sayfası yerel içerik ve tasarım önizlemesi.',
  robots: { index: false, follow: false, nocache: true }
};

export default function MaxPreviewRoute() {
  if (!isReleaseContentEnabled()) notFound();
  return <AllplanMaxPreviewPage />;
}
