import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CivilPage from '@/app/2027/civil/page';
import { isLocalPreviewEnabled } from '@/lib/release-flags';

export const metadata: Metadata = { title: 'ALLPLAN Civil | Yerel Önizleme', robots: { index: false, follow: false, nocache: true } };

export default function CivilLocalPreview() {
  if (!isLocalPreviewEnabled()) notFound();
  return <CivilPage />;
}
