import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AllplanCivilPreview } from '@/components/sections/AllplanCivilPreview';
import { isReleaseContentEnabled } from '@/lib/release-flags';
export const metadata: Metadata = { title: 'ALLPLAN Civil | Yerel Önizleme', robots: { index: false, follow: false, nocache: true } };
export default function CivilPreviewPage() { if (!isReleaseContentEnabled()) notFound(); return <AllplanCivilPreview />; }
