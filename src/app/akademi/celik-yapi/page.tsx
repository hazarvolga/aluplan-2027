import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { celikYapiHero, celikYapiLessons } from '@/data/celik-yapi';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function CelikYapiPage() {
  if (!isAkademiEnabled()) notFound();
  return (
    <TmOverview
      hero={celikYapiHero}
      lessons={celikYapiLessons}
      basePath="/akademi/celik-yapi"
      breadcrumbLabel="Çelik Yapı"
    />
  );
}
