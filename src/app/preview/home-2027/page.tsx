import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Homepage2027PreviewView } from '@/components/sections/Homepage2027PreviewView';
import { isLocalPreviewEnabled } from '@/lib/release-flags';

export const metadata: Metadata = {
  title: 'Aluplan 2027 Ana Sayfa Önizlemesi',
  description: 'Yalnızca yerel tasarım ve içerik incelemesi için kullanılan önizleme.',
  robots: {
    index: false,
    follow: false,
    nocache: true
  }
};

export default function Home2027PreviewPage() {
  if (!isLocalPreviewEnabled()) {
    notFound();
  }

  return <Homepage2027PreviewView />;
}
