import React from 'react';
import type { Metadata } from 'next';
import { buildPageMetadata } from '@/lib/metadata';
import { getPageData } from '@/lib/site-data';
import { buildPageJsonLd } from '@/lib/schema';
import { HomepageView } from '@/components/sections/HomepageView';
import { Homepage2027PreviewView } from '@/components/sections/Homepage2027PreviewView';
import { getHomepageVariant, isIndexingBlocked } from '@/lib/release-flags';

export function generateMetadata(): Metadata {
  const metadata = buildPageMetadata('/');
  return isIndexingBlocked() ? { ...metadata, robots: { index: false, follow: false } } : metadata;
}

export default function HomePage() {
  if (getHomepageVariant() === 'release-2027') return <Homepage2027PreviewView />;
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
