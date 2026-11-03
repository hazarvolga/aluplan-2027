import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import MaxPage from '@/app/products/allplan-max/page';
import { isLocalPreviewEnabled } from '@/lib/release-flags';

export const metadata: Metadata = { title: 'Allplan Max | Yerel Önizleme', robots: { index: false, follow: false, nocache: true } };

export default function MaxLocalPreview() {
  if (!isLocalPreviewEnabled()) notFound();
  return <MaxPage />;
}
