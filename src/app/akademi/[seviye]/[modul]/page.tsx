import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AkademiModuleDetail } from '@/components/sections/AkademiModuleDetail';
import { getLevelBySlug, getModuleBySlug, moduleRouteParams } from '@/data/akademi-content';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export async function generateMetadata({ params }: { params: Promise<{ seviye: string; modul: string }> }): Promise<Metadata> {
  const { seviye, modul } = await params;
  return akademiMetadata(`/akademi/${seviye}/${modul}`);
}

export const dynamicParams = false;

/** Build the module pages only while the draft is enabled; production builds none. */
export function generateStaticParams(): Array<{ seviye: string; modul: string }> {
  if (!isAkademiEnabled()) return [];
  return moduleRouteParams();
}

export default async function AkademiModulePage({
  params,
}: {
  params: Promise<{ seviye: string; modul: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const { seviye, modul } = await params;
  const module = getModuleBySlug(seviye, modul);
  const level = getLevelBySlug(seviye);
  if (!module || !level) notFound();
  return <AkademiModuleDetail module={module} level={level} />;
}
