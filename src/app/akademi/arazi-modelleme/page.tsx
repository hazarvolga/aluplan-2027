import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { araziModellemeHero, araziModellemeLessons } from '@/data/arazi-modelleme';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export const metadata: Metadata = akademiMetadata('/akademi/arazi-modelleme');

export default function AraziModellemePage() {
  if (!isAkademiEnabled()) notFound();
  return (
    <TmOverview
      hero={araziModellemeHero}
      lessons={araziModellemeLessons}
      basePath="/akademi/arazi-modelleme"
      breadcrumbLabel="Arazi Modelleme"
    />
  );
}
