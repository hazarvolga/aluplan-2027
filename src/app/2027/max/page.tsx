import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AllplanMaxPreviewPage } from '@/components/sections/AllplanMaxPreviewPage';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata } from '@/lib/release-2027-routes';
import { serializeJsonLd } from '@/lib/schema';

export function generateMetadata(): Metadata {
  return buildRelease2027Metadata('/2027/max');
}

function MaxPreviewRoute() {
  if (!isReleaseContentEnabled()) notFound();
  return <AllplanMaxPreviewPage />;
}

export default function Release2027Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd('/2027/max')) }} />
      <MaxPreviewRoute />
    </>
  );
}
