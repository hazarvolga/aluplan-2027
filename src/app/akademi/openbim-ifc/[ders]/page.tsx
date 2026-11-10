import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmLessonDetail } from '@/components/sections/TmLessonDetail';
import {
  openbimIfcLessons,
  openbimIfcRouteParams,
  getOpenbimIfcLesson,
} from '@/data/openbim-ifc';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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
      level="Uzman"
    />
  );
}
