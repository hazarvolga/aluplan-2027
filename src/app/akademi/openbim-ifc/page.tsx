import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { openbimIfcHero, openbimIfcLessons } from '@/data/openbim-ifc';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function OpenbimIfcPage() {
  if (!isAkademiEnabled()) notFound();
  return (
    <TmOverview
      hero={openbimIfcHero}
      lessons={openbimIfcLessons}
      basePath="/akademi/openbim-ifc"
      breadcrumbLabel="OpenBIM"
    />
  );
}
