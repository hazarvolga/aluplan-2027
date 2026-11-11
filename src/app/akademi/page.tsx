import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AkademiOverview } from '@/components/sections/AkademiOverview';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export const metadata: Metadata = akademiMetadata('/akademi');

export default async function AkademiPage({
  searchParams,
}: {
  searchParams: Promise<{ seviye?: string; rol?: string; sure?: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const sp = await searchParams;
  return <AkademiOverview seviye={sp.seviye} rol={sp.rol} sure={sp.sure} />;
}
