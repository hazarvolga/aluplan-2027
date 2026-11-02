import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/metadata';
import { getPageData } from '@/lib/site-data';
import { buildPageJsonLd } from '@/lib/schema';
import { HomepageView } from '@/components/sections/HomepageView';
import { Homepage2027PreviewView } from '@/components/sections/Homepage2027PreviewView';

export function generateMetadata(): Metadata {
  if ((process.env.NODE_ENV !== 'production' || process.env.ALUPLAN_2027_PREVIEW === '1')) return { title: 'Aluplan 2027 | Yerel inceleme', robots: { index: false, follow: false } };
  return buildPageMetadata('/');
}

export default function HomePage() {
  if ((process.env.NODE_ENV !== 'production' || process.env.ALUPLAN_2027_PREVIEW === '1')) return <Homepage2027PreviewView />;
  const page = getPageData('/')!;
  const jsonLd = buildPageJsonLd(page);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomepageView />
    </>
  );
}
