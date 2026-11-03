import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { RecordedWebinars } from '@/components/sections/RecordedWebinars';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata } from '@/lib/release-2027-routes';
import { serializeJsonLd } from '@/lib/schema';

export function generateMetadata(): Metadata {
  return buildRelease2027Metadata('/kaydedilmis-webinarlar');
}

export default function RecordedWebinarsPage() {
  if (!isReleaseContentEnabled()) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd('/kaydedilmis-webinarlar')) }} />
      <RecordedWebinars />
    </>
  );
}
