import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { celikYapiHero, celikYapiLessons } from '@/data/celik-yapi';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export const metadata: Metadata = akademiMetadata('/akademi/celik-yapi');

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
