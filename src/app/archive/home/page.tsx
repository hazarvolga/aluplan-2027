import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { HomepageView } from '@/components/sections/HomepageView';

export const metadata: Metadata = { title: 'Önceki ana sayfa | Arşiv', robots: { index: false, follow: false, nocache: true } };
export default function ArchivedHomePage() {
  if (process.env.NODE_ENV === 'production') notFound();
  return <HomepageView />;
}
