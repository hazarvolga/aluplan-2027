import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Allplan2027FeaturesPreview } from '@/components/sections/Allplan2027FeaturesPreview';

export const metadata: Metadata = { title: 'ALLPLAN 2027 Yenilikleri | Yerel Önizleme', robots: { index: false, follow: false, nocache: true } };
export default function Page() {
  if (process.env.NODE_ENV === 'production' && process.env.ALUPLAN_2027_PREVIEW !== '1') notFound();
  return <Allplan2027FeaturesPreview />;
}
