import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { donatiDetaylandirmaHero, donatiDetaylandirmaLessons } from '@/data/donati-detaylandirma';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export const metadata: Metadata = akademiMetadata('/akademi/donati-detaylandirma');

export default function DonatiDetaylandirmaPage() {
  if (!isAkademiEnabled()) notFound();
  return (
    <TmOverview
      hero={donatiDetaylandirmaHero}
      lessons={donatiDetaylandirmaLessons}
      basePath="/akademi/donati-detaylandirma"
      breadcrumbLabel="Donatı"
    />
  );
}
