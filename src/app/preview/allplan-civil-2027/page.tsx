import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AllplanCivilPreview } from '@/components/sections/AllplanCivilPreview';
export const metadata: Metadata = { title: 'ALLPLAN Civil | Yerel Önizleme', robots: { index: false, follow: false, nocache: true } };
export default function CivilPreviewPage() { if (process.env.NODE_ENV === 'production' && process.env.ALUPLAN_2027_PREVIEW !== '1') notFound(); return <AllplanCivilPreview />; }
