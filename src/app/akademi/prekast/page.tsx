import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { prekastHero, prekastLessons } from '@/data/prekast';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export const metadata: Metadata = akademiMetadata('/akademi/prekast');

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
