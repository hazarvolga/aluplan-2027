import type { AllplanEdition2027 } from '@/data/allplan-2027-editions';
import { editionNewsItems } from '@/lib/feature-screens';
import { MediaGridWithViewer } from './MediaGridWithViewer';
import { PreviewClosingSection } from './PreviewClosingSection';
import { ProductHero } from './ProductHero';

const HERO_IMAGE = '/assets/heroes/families/vf-07-allplan-product-platform.jpg';

export function AllplanEditionNewsView({ edition, quoteUrl }: { edition: AllplanEdition2027; quoteUrl: string }) {
  const id = `allplan-${edition.slug}`;
  return <div>
    <ProductHero eyebrow={edition.eyebrow} title={edition.name} description={edition.intro} image={HERO_IMAGE} actions={[
      { label: 'Teklif isteyin ↗', href: quoteUrl, variant: 'primary' },
      { label: `${edition.name} sayfasına dön`, href: edition.productPath, variant: 'secondary' }
    ]} />
    <MediaGridWithViewer grid={{ kicker: `/ ${edition.eyebrow}`, title: edition.title, columns: 3, items: editionNewsItems(edition) }} itemKeyPrefix={id} />
    <PreviewClosingSection id={`${id}-closing`} title={`${edition.name} hakkında görüşelim`} items={[{ title: 'Uzmanla görüşün', paragraphs: [`Projelerinize ve ekibinize uygun ALLPLAN sürümünü birlikte değerlendirelim.`], action: { label: 'Teklif isteyin', href: quoteUrl } }]} />
  </div>;
}
