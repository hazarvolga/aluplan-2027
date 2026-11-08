import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AkademiLevelDetail } from '@/components/sections/AkademiLevelDetail';
import { levelSlugs, getLevelBySlug } from '@/data/akademi-content';
import { isAkademiEnabled } from '@/lib/release-flags';

/** Draft section: the whole /akademi area is never indexed until content is approved. */
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamicParams = false;

/** Build the level pages only while the draft is enabled; production builds none. */
export function generateStaticParams(): Array<{ seviye: string }> {
  if (!isAkademiEnabled()) return [];
  return levelSlugs.map((seviye) => ({ seviye }));
}

export default async function AkademiLevelPage({
  params,
}: {
  params: Promise<{ seviye: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const { seviye } = await params;
  const level = getLevelBySlug(seviye);
  if (!level) notFound();
  return <AkademiLevelDetail level={level} />;
}
