import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmLessonDetail } from '@/components/sections/TmLessonDetail';
import {
  prekastLessons,
  prekastRouteParams,
  getPrekastLesson,
} from '@/data/prekast';
import { isAkademiEnabled } from '@/lib/release-flags';
import { akademiMetadata } from '@/lib/akademi-metadata';

export async function generateMetadata({ params }: { params: Promise<{ ders: string }> }): Promise<Metadata> {
  const { ders } = await params;
  return akademiMetadata(`/akademi/prekast/${ders}`);
}

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
