import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { EducationPartners } from '@/components/sections/EducationPartners';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata } from '@/lib/release-2027-routes';
import { serializeJsonLd } from '@/lib/schema';

export function generateMetadata(): Metadata {
  return buildRelease2027Metadata('/egitim-merkezlerimiz');
}

export default function EducationPartnersPage() {
  if (!isReleaseContentEnabled()) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd('/egitim-merkezlerimiz')) }} />
      <EducationPartners />
    </>
  );
}
