import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AkademiKatalog } from '@/components/sections/AkademiKatalog';
import { isAkademiEnabled } from '@/lib/release-flags';

/** Draft section: the catalog is never indexed until the academy ships. */
export const metadata: Metadata = {
  title: 'Eğitim Kataloğu ve Öğrenme Yolları',
  robots: { index: false, follow: false },
};

export default async function AkademiKatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ seviye?: string; rol?: string; sure?: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const sp = await searchParams;
  return <AkademiKatalog seviye={sp.seviye} rol={sp.rol} sure={sp.sure} />;
}
