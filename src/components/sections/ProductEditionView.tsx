import { ProductHero } from './ProductHero';
import { ProductEditionsBand, ProductTabNav } from './ProductPageParts';
import { MediaGridWithViewer } from './MediaGridWithViewer';
import { PreviewClosingSection } from './PreviewClosingSection';
import type { ProductEditionContent } from '@/data/product-edition-content';
import { productFeatureGroups } from '@/lib/feature-screens';
import styles from './ProductEditionView.module.css';
import { SectionHeader } from './SectionHeader';

export function ProductEditionView({ content, heroImage, quoteUrl }: { content: ProductEditionContent; heroImage: string; quoteUrl: string }) {
  const id = content.path.split('/').pop();
  const featureGroups = productFeatureGroups(content);
  const kicker = (section: string) => `${content.name.toUpperCase()} · ${section}`;
  return <div>
    <div id={`${id}-top`}><ProductHero eyebrow={content.tagline.toUpperCase()} title={content.name} description={content.lead} image={heroImage} actions={[{ label: 'Teklif isteyin ↗', href: quoteUrl, variant: 'primary' }]} /></div>
    <div className="alu-container"><ul className={styles.tags} aria-label={`${content.name} konuları`}>{content.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
    <ProductEditionsBand kicker={kicker('GENEL BAKIŞ')} title={content.overviewTitle} editions={content.overview.map(item => ({ title: `${item.label}: ${item.title}`, description: item.text }))} />
    <ProductTabNav label={`${content.name} sayfa bölümleri`} links={[{ href: `#${id}-top`, label: content.name }, { href: `#${id}-benefits`, label: 'Avantajlar' }, { href: `#${id}-features`, label: 'Özellikler' }]} />
    <ProductEditionsBand id={`${id}-benefits`} className={styles.anchor} kicker={kicker('AVANTAJLAR')} title={content.benefitsTitle} editions={content.benefits.map(item => ({ title: item.title, description: item.text }))} />
    <div id={`${id}-features`} className={styles.anchor}>
      <div className="alu-container"><div className={styles.featuresHeading}><SectionHeader kicker={kicker('ÖZELLİKLER')} title={content.featuresTitle} /></div></div>
      {featureGroups.map(group => <MediaGridWithViewer key={group.label} grid={{ title: group.label, columns: 3, items: group.items }} itemKeyPrefix={`${id}-${group.label}`} />)}
    </div>
    <PreviewClosingSection id={`${id}-closing`} title={`${content.name} hakkında görüşelim`} items={[{ title: 'Uzmanla görüşün', paragraphs: [`Projelerinize ve ekibinize uygun çözümü ${content.name} ile birlikte değerlendirelim.`], action: { label: 'Teklif isteyin', href: quoteUrl } }]} />
  </div>;
}
