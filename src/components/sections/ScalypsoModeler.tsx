import Image from 'next/image';
import Link from 'next/link';
import type { PageRecord } from '@/lib/site-data';
import { CompactPageHero } from './CompactPageHero';
import { SectionHeader } from './SectionHeader';
import { CompactSpecList } from './CompactSpecList';
import { PreviewClosingSection } from './PreviewClosingSection';
import { DebugComponentLabel } from './DebugComponentLabel';
import styles from './ScalypsoModeler.module.css';

const MODULE_NAMES = ['Pipe Module', 'BIM Module', 'Steel Module', 'Ortho Module'] as const;

export function ScalypsoModeler({ page }: { page: PageRecord }) {
  const form = page.contentLinks.find(link => link.text === 'Deneme Lisansı İste')?.href;
  const appForm = page.contentLinks.find(link => link.text === 'Başvuru Formu İçin Tıklayın')?.href;

  const introSection = page.sections.find(s => s.heading === '3B lazer veri tarama');
  const rawItems = introSection?.items.filter(item => item !== '•' && item !== '01') ?? [];
  const introParagraphs = [rawItems[0], rawItems[1]].filter(Boolean);
  const cadSystems = rawItems.slice(2, -1);
  const modulesIntro = rawItems[rawItems.length - 1];

  const heroImage = page.images.find(item => !item.isIcon && item.src);
  const trial = page.sections.find((s, i) => i > 1 && s.heading === 'Deneme Lisansı İste');

  const intro = page.sections[0]?.items.find(item => item.length > 50) ?? page.description;

  return <div className={styles.page}>
    <DebugComponentLabel name="CompactPageHero">
    <CompactPageHero
      kicker="SCALYPSO MODÜLÜ"
      title="Scalypso Modeler"
      lead={intro}
    >
      <div className={styles.heroActions}>
        {form && <a className="alu-button alu-button--primary alu-button--md" href={form} target="_blank" rel="noopener noreferrer">Deneme Lisansı İste</a>}
        <Link className="alu-button alu-button--secondary alu-button--md" href="/solutions/scalypso">Scalypso Ana Sayfa</Link>
      </div>
    </CompactPageHero>
    </DebugComponentLabel>

    <DebugComponentLabel name="SectionHeader + introGrid (özel)">
    <section className={styles.compact}><div className="alu-container">
      <SectionHeader kicker="SCALYPSO MODELER" title="3B lazer veri tarama" />
      <div className={styles.introGrid}>
        <div>
          {introParagraphs.map((text, i) => <p key={i} className={styles.body}>{text}</p>)}
        </div>
        {heroImage && <div className={styles.introImageWrap}>
          <Image src={heroImage.src} alt={heroImage.alt || 'Scalypso Modeler'} width={600} height={354} className={styles.introImage} />
        </div>}
      </div>
    </div></section>
    </DebugComponentLabel>

    <DebugComponentLabel name="SectionHeader + CompactSpecList">
    <section className={styles.compact}><div className="alu-container">
      <SectionHeader kicker="BİRLİKTE ÇALIŞABİLİRLİK" title="Desteklenen CAD yazılımları" />
      <CompactSpecList items={cadSystems} />
    </div></section>
    </DebugComponentLabel>

    <DebugComponentLabel name="SectionHeader + moduleGrid (özel)">
    <section className={styles.compact}><div className="alu-container">
      <SectionHeader kicker="SCALYPSO MODELER" title="Modüller" />
      {modulesIntro && <p className={styles.body}>{modulesIntro}</p>}
      <div className={styles.moduleGrid}>
        {MODULE_NAMES.map(name => {
          const sec = page.sections.find(s => s.heading === name);
          const link = page.contentLinks.find(l => l.text === name);
          return <article key={name} className={styles.moduleCard}>
            <strong>{name}</strong>
            {sec?.items.filter(t => t !== '•').map((text, i) => <p key={i} className={styles.moduleDesc}>{text}</p>)}
            {link && <a href={link.href} target="_blank" rel="noopener noreferrer" className={styles.moduleLink}>Detaylı bilgi ↗</a>}
          </article>;
        })}
      </div>
    </div></section>
    </DebugComponentLabel>

    <DebugComponentLabel name="PreviewClosingSection">
    <PreviewClosingSection
      id="scalypso-modeler-closing"
      title="Scalypso Modeler hakkında görüşelim"
      items={[
        {
          title: 'Deneme lisansı',
          paragraphs: trial?.items.filter(t => t !== 'Başvuru Formu İçin Tıklayın') ?? ['Bir deneme lisansı talep etmek için lütfen Başvuru Formunu doldurunuz.'],
          action: (appForm ?? form) ? { label: 'Başvuru Formu', href: (appForm ?? form)! } : undefined,
        },
      ]}
    />
    </DebugComponentLabel>
  </div>;
}
