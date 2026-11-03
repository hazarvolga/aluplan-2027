import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AllplanCivilPreview } from '@/components/sections/AllplanCivilPreview';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata } from '@/lib/release-2027-routes';
import { serializeJsonLd } from '@/lib/schema';
export function generateMetadata(): Metadata {
  return buildRelease2027Metadata('/2027/civil');
}
function CivilPreviewPage() { if (!isReleaseContentEnabled()) notFound(); return <AllplanCivilPreview />; }

export default function Release2027Page() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd('/2027/civil')) }} />
      <CivilPreviewPage />
    </>
  );
}
