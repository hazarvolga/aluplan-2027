import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { lejantHero, lejantLessons } from '@/data/lejant';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export const metadata: Metadata = akademiMetadata('/akademi/lejant');

export default function LejantPage() {
  if (!isAkademiEnabled()) notFound();
  return (
    <TmOverview
      hero={lejantHero}
      lessons={lejantLessons}
      basePath="/akademi/lejant"
      breadcrumbLabel="Lejant Oluşturma"
    />
  );
}
