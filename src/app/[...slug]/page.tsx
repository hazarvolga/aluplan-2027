import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllPagePaths,
  getPageData,
  getPlaylistData
} from '@/lib/site-data';
import { buildPageMetadata } from '@/lib/metadata';
import { buildPageJsonLd } from '@/lib/schema';
import { SubpageView } from '@/components/sections/SubpageView';

interface SlugPageProps {
  params: Promise<{ slug: string[] }>;
}

export function generateStaticParams() {
  const allPaths = getAllPagePaths().filter((p) => p !== '/');
  return allPaths.map((p) => ({
    slug: p.replace(/^\/+/, '').split('/')
  }));
}

export async function generateMetadata({ params }: SlugPageProps): Promise<Metadata> {
  const { slug } = await params;
  const pathname = '/' + (slug || []).join('/');
  return buildPageMetadata(pathname);
}

export default async function SlugPage({ params }: SlugPageProps) {
  const { slug } = await params;
  const pathname = '/' + (slug || []).join('/');
  const page = getPageData(pathname);

  if (!page) {
    notFound();
  }

  const playlist = page.playlistId ? getPlaylistData(page.playlistId) : null;
  const jsonLd = buildPageJsonLd(page, playlist);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SubpageView page={page} playlist={playlist} />
    </>
  );
}
