import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { prekastHero, prekastLessons } from '@/data/prekast';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PrekastPage() {
  if (!isAkademiEnabled()) notFound();
  return (
    <TmOverview
      hero={prekastHero}
      lessons={prekastLessons}
      basePath="/akademi/prekast"
      breadcrumbLabel="Prekast"
    />
  );
}
