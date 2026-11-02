import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Allplan2027FeaturesPreview } from '@/components/sections/Allplan2027FeaturesPreview';
import { isLocalPreviewEnabled } from '@/lib/release-flags';

export const metadata: Metadata = { title: 'ALLPLAN 2027 Yenilikleri | Yerel Önizleme', robots: { index: false, follow: false, nocache: true } };
export default function Page() {
  if (!isLocalPreviewEnabled()) notFound();
  return <Allplan2027FeaturesPreview />;
}
