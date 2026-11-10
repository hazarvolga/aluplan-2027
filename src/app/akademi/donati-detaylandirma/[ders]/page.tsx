import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { TmLessonDetail } from '@/components/sections/TmLessonDetail';
import {
  donatiDetaylandirmaLessons,
  donatiDetaylandirmaRouteParams,
  getDonatiDetaylandirmaLesson,
} from '@/data/donati-detaylandirma';
import { isAkademiEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export const dynamicParams = false;

export function generateStaticParams(): Array<{ ders: string }> {
  if (!isAkademiEnabled()) return [];
  return donatiDetaylandirmaRouteParams();
}

export default async function DonatiDetaylandirmaLessonPage({
  params,
}: {
  params: Promise<{ ders: string }>;
}) {
  if (!isAkademiEnabled()) notFound();
  const { ders } = await params;
  const lesson = getDonatiDetaylandirmaLesson(ders);
  if (!lesson) notFound();
  return (
    <TmLessonDetail
      lesson={lesson}
      allLessons={donatiDetaylandirmaLessons}
      basePath="/akademi/donati-detaylandirma"
      breadcrumbLabel="Donatı"
      level="İleri"
    />
  );
}
