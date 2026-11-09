import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { araziModellemeHero, araziModellemeLessons } from '@/data/arazi-modelleme';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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
