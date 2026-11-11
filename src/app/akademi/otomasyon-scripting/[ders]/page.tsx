import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmLessonDetail } from '@/components/sections/TmLessonDetail';
import {
  otomasyonScriptingLessons,
  otomasyonScriptingRouteParams,
  getOtomasyonScriptingLesson,
} from '@/data/otomasyon-scripting';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamicParams = false;

export function generateStaticParams(): Array<{ ders: string }> {
  if (!isAkademiEnabled()) return [];
  return otomasyonScriptingRouteParams();
}

export default async function OtomasyonScriptingLessonPage({
  params,
}: {
  params: Promise<{ ders: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const { ders } = await params;
  const lesson = getOtomasyonScriptingLesson(ders);
  if (!lesson) notFound();
  return (
    <TmLessonDetail
      lesson={lesson}
      allLessons={otomasyonScriptingLessons}
      basePath="/akademi/otomasyon-scripting"
      breadcrumbLabel="Otomasyon"
    />
  );
}
