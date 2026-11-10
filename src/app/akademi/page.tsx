import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AkademiOverview } from '@/components/sections/AkademiOverview';
import { akademiProgram } from '@/data/akademi-content';
import { isAkademiEnabled } from '@/lib/release-flags';

const { hero: akademiHero } = akademiProgram;

/** Draft section: never indexed until the curriculum and content are approved. */
export const metadata: Metadata = {
  title: 'Aluplan Akademi | ALLPLAN Türkçe Eğitim Programı',
  description: akademiHero.lead,
  robots: { index: false, follow: false },
};

export default async function AkademiPage({
  searchParams,
}: {
  searchParams: Promise<{ seviye?: string; rol?: string; sure?: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const sp = await searchParams;
  return <AkademiOverview seviye={sp.seviye} rol={sp.rol} sure={sp.sure} />;
}
