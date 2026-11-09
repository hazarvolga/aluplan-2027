import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmLessonDetail } from '@/components/sections/TmLessonDetail';
import {
  araziModellemeLessons,
  araziModellemeRouteParams,
  getAraziModellemeLesson,
} from '@/data/arazi-modelleme';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamicParams = false;

export function generateStaticParams(): Array<{ ders: string }> {
  if (!isAkademiEnabled()) return [];
  return araziModellemeRouteParams();
}

export default async function AraziModellemeLessonPage({
  params,
}: {
  params: Promise<{ ders: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const { ders } = await params;
  const lesson = getAraziModellemeLesson(ders);
  if (!lesson) notFound();
  return (
    <TmLessonDetail
      lesson={lesson}
      allLessons={araziModellemeLessons}
      basePath="/akademi/arazi-modelleme"
      breadcrumbLabel="Arazi Modelleme"
    />
  );
}
