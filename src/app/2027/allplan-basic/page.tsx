import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { AllplanEditionNewsView } from '@/components/sections/AllplanEditionNewsView';
import { editions } from '@/data/allplan-2027-editions';
import { MAIN_QUOTE_FORM_URL } from '@/lib/site-data';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata } from '@/lib/release-2027-routes';
import { serializeJsonLd } from '@/lib/schema';

export function generateMetadata(): Metadata {
  return buildRelease2027Metadata('/2027/allplan-basic');
}

export default function Release2027Page() {
  if (!isReleaseContentEnabled()) notFound();
  const edition = editions.find(item => item.slug === 'basic')!;
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd('/2027/allplan-basic')) }} />
      <AllplanEditionNewsView edition={edition} quoteUrl={MAIN_QUOTE_FORM_URL} />
    </>
  );
}
