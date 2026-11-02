import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AllplanMaxPreviewPage } from '@/components/sections/AllplanMaxPreviewPage';

export const metadata: Metadata = {
  title: 'Allplan Max | Yerel Önizleme',
  description: 'Allplan Max ürün sayfası yerel içerik ve tasarım önizlemesi.',
  robots: { index: false, follow: false, nocache: true }
};

export default function MaxPreviewRoute() {
  if (process.env.NODE_ENV === 'production' && process.env.ALUPLAN_2027_PREVIEW !== '1') notFound();
  return <AllplanMaxPreviewPage />;
}
