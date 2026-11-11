import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmOverview } from '@/components/sections/TmOverview';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export const metadata: Metadata = akademiMetadata('/akademi/temel-modelleme');

export default function TemelModellemePage() {
  if (!isAkademiEnabled()) notFound();
  return <TmOverview />;
}
