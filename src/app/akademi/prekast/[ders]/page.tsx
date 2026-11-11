import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmLessonDetail } from '@/components/sections/TmLessonDetail';
import {
  prekastLessons,
  prekastRouteParams,
  getPrekastLesson,
} from '@/data/prekast';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamicParams = false;

export function generateStaticParams(): Array<{ ders: string }> {
  if (!isAkademiEnabled()) return [];
  return prekastRouteParams();
}

export default async function PrekastLessonPage({
  params,
}: {
  params: Promise<{ ders: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const { ders } = await params;
  const lesson = getPrekastLesson(ders);
  if (!lesson) notFound();
  return (
    <TmLessonDetail
      lesson={lesson}
      allLessons={prekastLessons}
      basePath="/akademi/prekast"
      breadcrumbLabel="Prekast"
    />
  );
}
