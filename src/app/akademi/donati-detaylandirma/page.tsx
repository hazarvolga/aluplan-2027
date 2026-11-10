import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { donatiDetaylandirmaHero, donatiDetaylandirmaLessons } from '@/data/donati-detaylandirma';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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
