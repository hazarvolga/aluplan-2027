import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductEditionView } from '@/components/sections/ProductEditionView';
import { content } from '@/data/allplan-rebar-2027';
import { MAIN_QUOTE_FORM_URL } from '@/lib/site-data';
import { isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata } from '@/lib/release-2027-routes';
import { serializeJsonLd } from '@/lib/schema';

export function generateMetadata(): Metadata {
  return buildRelease2027Metadata('/2027/rebar');
}

export default function Release2027Page() {
  if (!isReleaseContentEnabled()) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd('/2027/rebar')) }} />
      <ProductEditionView content={content} heroImage="/assets/previews/allplan-2027-features/csm_bar_group_circular_-_selected_3306dc1ad4.jpg" quoteUrl={MAIN_QUOTE_FORM_URL} />
    </>
  );
}
