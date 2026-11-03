import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import FriloPage from '@/app/2027/frilo/page';
import { isLocalPreviewEnabled } from '@/lib/release-flags';

export const metadata: Metadata = { title: 'FRILO | Yerel Önizleme', robots: { index: false, follow: false, nocache: true } };

export default function FriloLocalPreview() {
  if (!isLocalPreviewEnabled()) notFound();
  return <FriloPage />;
}
