import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmLessonDetail } from '@/components/sections/TmLessonDetail';
import {
  openbimIfcLessons,
  openbimIfcRouteParams,
  getOpenbimIfcLesson,
} from '@/data/openbim-ifc';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export async function generateMetadata({ params }: { params: Promise<{ ders: string }> }): Promise<Metadata> {
  const { ders } = await params;
  return akademiMetadata(`/akademi/openbim-ifc/${ders}`);
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ ders: string }> {
  if (!isAkademiEnabled()) return [];
  return openbimIfcRouteParams();
}

export default async function OpenbimIfcLessonPage({
  params,
}: {
  params: Promise<{ ders: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const { ders } = await params;
  const lesson = getOpenbimIfcLesson(ders);
  if (!lesson) notFound();
  return (
    <TmLessonDetail
      lesson={lesson}
      allLessons={openbimIfcLessons}
      basePath="/akademi/openbim-ifc"
      breadcrumbLabel="OpenBIM"
    />
  );
}
