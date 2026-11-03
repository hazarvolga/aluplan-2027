import { ProductHero } from './ProductHero';
import { EditionCards } from './EditionCards';
import { MediaGridWithViewer } from './MediaGridWithViewer';
import { PreviewClosingSection } from './PreviewClosingSection';
import type { ProductEditionContent } from '@/data/product-edition-content';
import { productScreenItems } from '@/lib/feature-screens';
import page from '@/components/sections/ProductPage.module.css';
import styles from './ProductEditionView.module.css';

export function ProductEditionView({ content, heroImage, quoteUrl }: { content: ProductEditionContent; heroImage: string; quoteUrl: string }) {
  const id = content.path.split('/').pop();
  const screenItems = productScreenItems(content);
  const kicker = (section: string) => `${content.name.toUpperCase()} · ${section}`;
  return <div>
    <div id={`${id}-top`}><ProductHero eyebrow={content.tagline.toUpperCase()} title={content.name} description={content.lead} image={heroImage} actions={[{ label: 'Teklif isteyin ↗', href: quoteUrl, variant: 'primary' }]} /></div>
    <div className="alu-container"><ul className={styles.tags} aria-label={`${content.name} konuları`}>{content.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
    <div className={page.editionsSection}><div className="alu-container"><EditionCards kicker={kicker('GENEL BAKIŞ')} title={content.overviewTitle} editions={content.overview.map(item => ({ title: `${item.label}: ${item.title}`, description: item.text }))} /></div></div>
    <div className={page.navigationSection}><nav className={`alu-container ${page.tabList}`} aria-label={`${content.name} sayfa bölümleri`}><a href={`#${id}-top`}>{content.name}</a><a href={`#${id}-benefits`}>Avantajlar</a><a href={`#${id}-features`}>Özellikler</a></nav></div>
    <div id={`${id}-benefits`} className={`${page.editionsSection} ${styles.anchor}`}><div className="alu-container"><EditionCards kicker={kicker('AVANTAJLAR')} title={content.benefitsTitle} editions={content.benefits.map(item => ({ title: item.title, description: item.text }))} /></div></div>
    <div id={`${id}-features`} className={styles.anchor}><div className="alu-container"><EditionCards kicker={kicker('ÖZELLİKLER')} title={content.featuresTitle} editions={content.featureGroups.map(group => ({ title: group.label, items: group.items }))} /></div></div>
    {screenItems.length > 0 && <MediaGridWithViewer grid={{ kicker: '/ EKRAN GÖRÜNTÜLERİ', title: 'Ekran görüntüleri', columns: 3, items: screenItems }} itemKeyPrefix={`${id}-screens`} />}
    <PreviewClosingSection id={`${id}-closing`} title={`${content.name} hakkında görüşelim`} items={[{ title: 'Uzmanla görüşün', paragraphs: [`Projelerinize ve ekibinize uygun çözümü ${content.name} ile birlikte değerlendirelim.`], action: { label: 'Teklif isteyin', href: quoteUrl } }]} />
  </div>;
}
