import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmLessonDetail } from '@/components/sections/TmLessonDetail';
import { getLejantLesson, lejantLessons, lejantRouteParams } from '@/data/lejant';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export async function generateMetadata({ params }: { params: Promise<{ ders: string }> }): Promise<Metadata> {
  const { ders } = await params;
  return akademiMetadata(`/akademi/lejant/${ders}`);
}

export const dynamicParams = false;

export function generateStaticParams(): Array<{ ders: string }> {
  if (!isAkademiEnabled()) return [];
  return lejantRouteParams();
}

export default async function LejantLessonPage({
  params,
}: {
  params: Promise<{ ders: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const { ders } = await params;
  const lesson = getLejantLesson(ders);
  if (!lesson) notFound();
  return (
    <TmLessonDetail
      lesson={lesson}
      allLessons={lejantLessons}
      basePath="/akademi/lejant"
      breadcrumbLabel="Lejant Oluşturma"
    />
  );
}
