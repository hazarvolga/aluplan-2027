import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmLessonDetail } from '@/components/sections/TmLessonDetail';
import {
  celikYapiLessons,
  celikYapiRouteParams,
  getCelikYapiLesson,
} from '@/data/celik-yapi';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamicParams = false;

export function generateStaticParams(): Array<{ ders: string }> {
  if (!isAkademiEnabled()) return [];
  return celikYapiRouteParams();
}

export default async function CelikYapiLessonPage({
  params,
}: {
  params: Promise<{ ders: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const { ders } = await params;
  const lesson = getCelikYapiLesson(ders);
  if (!lesson) notFound();
  return (
    <TmLessonDetail
      lesson={lesson}
      allLessons={celikYapiLessons}
      basePath="/akademi/celik-yapi"
      breadcrumbLabel="Çelik Yapı"
    />
  );
}
