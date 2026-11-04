import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ProductEditionView } from '@/components/sections/ProductEditionView';
import { content } from '@/data/allplan-parametric-2027';
import { MAIN_QUOTE_FORM_URL } from '@/lib/site-data';
import { isLocalPreviewEnabled, isReleaseContentEnabled } from '@/lib/release-flags';
import { buildRelease2027JsonLd, buildRelease2027Metadata, isHeldRelease2027Route } from '@/lib/release-2027-routes';
import { serializeJsonLd } from '@/lib/schema';

export function generateMetadata(): Metadata {
  if (!isReleaseContentEnabled() || (isHeldRelease2027Route('/products/allplan-parametric') && !isLocalPreviewEnabled())) notFound();
  return buildRelease2027Metadata('/products/allplan-parametric');
}

export default function Release2027Page() {
  if (!isReleaseContentEnabled() || (isHeldRelease2027Route('/products/allplan-parametric') && !isLocalPreviewEnabled())) notFound();
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(buildRelease2027JsonLd('/products/allplan-parametric')) }} />
      <ProductEditionView content={content} heroImage="/assets/previews/allplan-civil-2027/civil-hero.jpg" quoteUrl={MAIN_QUOTE_FORM_URL} />
    </>
  );
}
