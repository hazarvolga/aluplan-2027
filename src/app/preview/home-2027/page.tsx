import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Homepage2027PreviewView } from '@/components/sections/Homepage2027PreviewView';

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
  if (process.env.NODE_ENV === 'production') {
    notFound();
  }

  return <Homepage2027PreviewView />;
}
