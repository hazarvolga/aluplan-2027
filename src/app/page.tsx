import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/metadata';
import { getPageData } from '@/lib/site-data';
import { buildPageJsonLd } from '@/lib/schema';
import { HomepageView } from '@/components/sections/HomepageView';

export function generateMetadata(): Metadata {
  return buildPageMetadata('/');
}

export default function HomePage() {
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
