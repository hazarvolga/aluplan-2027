import Image from 'next/image';
import Link from 'next/link';
import type { PageRecord } from '@/lib/site-data';
import { CompactPageHero } from './CompactPageHero';
import { SectionHeader } from './SectionHeader';
import { CompactSpecList } from './CompactSpecList';
import { PreviewClosingSection } from './PreviewClosingSection';
import { DebugComponentLabel } from './DebugComponentLabel';
import styles from './ScalypsoSubpage.module.css';

export function ScalypsoSubpage({ page }: { page: PageRecord }) {
  const form = page.contentLinks.find(link => link.text === 'Başvuru Formu İçin Tıklayın')?.href;
  const mainForm = page.contentLinks.find(link => link.text === 'Deneme Lisansı İste')?.href ?? form;
  const title = page.h1;
  const introSection = page.sections[0];
  const intro = introSection?.items.find(item => item.length > 50) ?? page.description;
  const heroImage = page.images.find(item => !item.isIcon && item.src);

  const contentSections = page.sections.filter(
    s => s.heading !== title && s.heading !== 'Deneme Lisansı İste'
  );

  const trialSection = page.sections.find(s => s.heading === 'Deneme Lisansı İste' && s.items.length > 1);

  return <div className={styles.page}>
    <DebugComponentLabel name="CompactPageHero">
    <CompactPageHero
      kicker="SCALYPSO MODÜLÜ"
      title={`Scalypso ${title}`}
      lead={intro}
    >
      <div className={styles.heroActions}>
        {mainForm && <a className="alu-button alu-button--primary alu-button--md" href={mainForm} target="_blank" rel="noopener noreferrer">Deneme Lisansı İste</a>}
        <Link className="alu-button alu-button--secondary alu-button--md" href="/solutions/scalypso">Scalypso Ana Sayfa</Link>
      </div>
    </CompactPageHero>
    </DebugComponentLabel>

    {heroImage && <DebugComponentLabel name="heroImage (next/image)">
    <section className={styles.compact}><div className="alu-container">
      <div className={styles.heroImageWrap}>
        <Image src={heroImage.src} alt={heroImage.alt || title} width={800} height={440} className={styles.heroImage} />
      </div>
    </div></section>
    </DebugComponentLabel>}

    {contentSections.map((sec, idx) => {
      const isSpecList = sec.items.length > 3 && sec.items.every(item => item.length < 100);
      const secImage = sec.image;

      return <DebugComponentLabel key={`${sec.heading}-${idx}`} name={isSpecList ? 'SectionHeader + CompactSpecList' : 'SectionHeader + paragraphs'}>
      <section className={styles.compact}><div className="alu-container">
        <SectionHeader as={idx === 0 ? 'h2' : 'h3'} title={sec.heading} />
        {secImage && <div className={styles.sectionImageWrap}>
          <Image src={secImage.src} alt={secImage.alt || sec.heading} width={600} height={354} className={styles.sectionImage} />
        </div>}
        {isSpecList
          ? <CompactSpecList items={sec.items} />
          : sec.items.filter(text => text !== '•').map((text, i) => <p key={`${i}-${text.slice(0, 20)}`} className={styles.body}>{text}</p>)
        }
      </div></section>
      </DebugComponentLabel>;
    })}

    <DebugComponentLabel name="PreviewClosingSection">
    <PreviewClosingSection
      id={`scalypso-${title.toLowerCase()}-closing`}
      title={`Scalypso ${title} hakkında görüşelim`}
      items={[
        {
          title: 'Deneme lisansı',
          paragraphs: trialSection?.items.filter(t => t !== 'Başvuru Formu İçin Tıklayın') ?? ['Bir deneme lisansı talep etmek için lütfen Başvuru Formunu doldurunuz.'],
          action: form ? { label: 'Başvuru Formu', href: form } : undefined,
        },
      ]}
    />
    </DebugComponentLabel>
  </div>;
}
