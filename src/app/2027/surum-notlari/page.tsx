import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ReleaseNotes2027IndexView } from '@/components/sections/ReleaseNotes2027View';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata } from '@/lib/release-2027-routes';
import { serializeJsonLd } from '@/lib/schema';

export function generateMetadata(): Metadata {
  return buildRelease2027Metadata('/2027/surum-notlari');
}

export default function ReleaseNotes2027IndexPage() {
  if (!isReleaseContentEnabled()) notFound();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd('/2027/surum-notlari')) }}
      />
      <ReleaseNotes2027IndexView />
    </>
  );
}
