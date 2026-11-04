import { DebugComponentLabel } from './DebugComponentLabel';
import { civilNews2027, civilNewsHero } from '@/data/allplan-civil-2027-news';
import { MediaGridWithViewer } from './MediaGridWithViewer';
import { PreviewClosingSection } from './PreviewClosingSection';
import { ProductHero } from './ProductHero';

const HERO_IMAGE = '/assets/previews/allplan-civil-2027/civil-hero.jpg';

export function CivilNewsView({ quoteUrl }: { quoteUrl: string }) {
  return <div>
    <DebugComponentLabel name="ProductHero"><ProductHero eyebrow={civilNewsHero.eyebrow} title={civilNewsHero.title} description={civilNewsHero.description} image={HERO_IMAGE} actions={[
      { label: 'Teklif isteyin ↗', href: quoteUrl, variant: 'primary' },
      { label: `${civilNewsHero.title} sayfasına dön`, href: '/products/civil', variant: 'secondary' }
    ]} /></DebugComponentLabel>
    <DebugComponentLabel name="MediaGridWithViewer"><MediaGridWithViewer grid={civilNews2027} itemKeyPrefix="civil-2027" /></DebugComponentLabel>
    <DebugComponentLabel name="PreviewClosingSection"><PreviewClosingSection id="civil-closing" title="ALLPLAN Civil hakkında görüşelim" items={[{ title: 'Uzmanla görüşün', paragraphs: ['Projelerinize ve ekibinize uygun ALLPLAN çözümünü birlikte değerlendirelim.'], action: { label: 'Teklif isteyin', href: quoteUrl } }]} /></DebugComponentLabel>
  </div>;
}
