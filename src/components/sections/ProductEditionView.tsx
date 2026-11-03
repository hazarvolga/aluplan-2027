import { ProductHero } from './ProductHero';
import { PreviewClosingSection } from './PreviewClosingSection';
import type { ProductEditionContent } from '@/data/product-edition-content';
import tabs from '@/app/2027/frilo/hero.module.css';
import styles from './ProductEditionView.module.css';

export function ProductEditionView({ content, heroImage, quoteUrl }: { content: ProductEditionContent; heroImage: string; quoteUrl: string }) {
  const id = content.path.split('/').pop();
  const kicker = (section: string) => `${content.name.toUpperCase()} · ${section}`;
  return <div>
    <div id={`${id}-top`}><ProductHero eyebrow={content.tagline.toUpperCase()} title={content.name} description={content.lead} image={heroImage} actions={[{ label: 'Teklif isteyin ↗', href: quoteUrl, variant: 'primary' }]} /></div>
    <div className="alu-container"><ul className={styles.tags} aria-label={`${content.name} konuları`}>{content.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></div>
    <div className={tabs.navigationSection}><nav className={`alu-container ${tabs.tabList}`} aria-label={`${content.name} sayfa bölümleri`}><a href={`#${id}-overview`}>Genel bakış</a><a href={`#${id}-benefits`}>Avantajlar</a><a href={`#${id}-features`}>Özellikler</a></nav></div>
    <div className="alu-container">
      <section id={`${id}-overview`} className={styles.section}><p className={styles.kicker}>{kicker('GENEL BAKIŞ')}</p><h2 className={styles.title}>{content.overviewTitle}</h2>
        <div className={styles.grid}>{content.overview.map(item => <article className={styles.card} key={item.title}><span className={styles.label}>{item.label}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
      <section id={`${id}-benefits`} className={styles.section}><p className={styles.kicker}>{kicker('AVANTAJLAR')}</p><h2 className={styles.title}>{content.benefitsTitle}</h2>
        <div className={styles.grid}>{content.benefits.map(item => <article className={styles.card} key={item.title}><h3>{item.title}</h3><p>{item.text}</p></article>)}</div></section>
      <section id={`${id}-features`} className={styles.section}><p className={styles.kicker}>{kicker('ÖZELLİKLER')}</p><h2 className={styles.title}>{content.featuresTitle}</h2>
        {content.featureGroups.map(group => <div className={styles.group} key={group.label}><h3>{group.label}</h3>
          <div className={styles.grid}>{group.items.map(item => <article className={`${styles.card} ${styles.feature}`} key={item.title}><h4>{item.title}</h4><p>{item.text}</p></article>)}</div></div>)}</section>
    </div>
    <PreviewClosingSection id={`${id}-closing`} title={`${content.name} hakkında görüşelim`} items={[{ title: 'Uzmanla görüşün', paragraphs: [`Projelerinize ve ekibinize uygun çözümü ${content.name} ile birlikte değerlendirelim.`], action: { label: 'Teklif isteyin', href: quoteUrl } }]} />
  </div>;
}
