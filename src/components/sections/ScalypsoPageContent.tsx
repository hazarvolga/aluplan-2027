import Image from 'next/image';
import Link from 'next/link';
import type { PageRecord } from '@/lib/site-data';
import { CompactPageHero } from './CompactPageHero';
import { SectionHeader } from './SectionHeader';
import { CompactSpecList } from './CompactSpecList';
import { ProductEditionsBand } from './ProductPageParts';
import { PreviewClosingSection } from './PreviewClosingSection';
import { FeatureRow, FeatureRowList } from './FeatureRow';
import { DebugComponentLabel } from './DebugComponentLabel';
import styles from './ScalypsoPageContent.module.css';

const MODULES: readonly { name: string; sectionKey: string; href: string }[] = [
  { name: 'Converter', sectionKey: 'CONVERTER', href: '/solutions/scalypso/converter' },
  { name: 'Modeler', sectionKey: 'MODELER', href: '/solutions/scalypso/modeler' },
  { name: 'Mobile', sectionKey: 'MOBILE', href: '/solutions/scalypso/mobile' },
  { name: 'Viewer', sectionKey: 'VIEWER', href: '/solutions/scalypso/viewer' },
  { name: 'Videolar', sectionKey: 'VİDEOLAR', href: '/solutions/scalypso/videos' },
];

const APPLICATION_IMAGES: Record<string, string> = {
  'Mimarlık': '/assets/solutions/scalypso/architecture_1900_600.jpg',
  'Köprü ve Altyapı': '/assets/solutions/scalypso/bridge_1900x600.jpg',
  'Endüstri': '/assets/solutions/scalypso/industry_1900_600.jpg',
  'Gemi İnşası': '/assets/solutions/scalypso/ship_1900_600.jpg',
  'Robotik': '/assets/solutions/scalypso/industry2_1900_600.jpg',
};

const APPLICATIONS = Object.keys(APPLICATION_IMAGES);

export function ScalypsoPageContent({ page }: { page: PageRecord }) {
  const section = (heading: string) => page.sections.find(item => item.heading === heading);
  const form = page.contentLinks.find(link => link.text === 'Başvuru Formu İçin Tıklayın')?.href;

  const aboutImage = section('Hakkında')?.image;

  const advantages = ['Modüler ve Genişletilebilir', 'Sanattan Bilime', 'İki Dünya Arasında Köprü'].map(name => ({
    title: name,
    description: section(name)?.items[0] ?? '',
  }));

  return <div className={styles.page}>
    <DebugComponentLabel name="CompactPageHero">
    <CompactPageHero
      kicker="3D LAZER TARAMA VERİLERİ"
      title="Scalypso"
      lead="Karasal ve mobil 3B lazer tarama verilerini kullanarak analiz ve yeniden oluşturma görevleri için bir yazılım paketi"
    >
      <div className={styles.heroActions}>
        {form && <a className="alu-button alu-button--primary alu-button--md" href={form} target="_blank" rel="noopener noreferrer">Deneme Lisansı İste</a>}
        <Link className="alu-button alu-button--secondary alu-button--md" href="/solutions/scalypso/videos">Videoları İzle</Link>
      </div>
    </CompactPageHero>
    </DebugComponentLabel>

    <DebugComponentLabel name="metricsBand (özel)">
    <section className={styles.metricsBand}><div className="alu-container">
      <div className={styles.metricsRow}>
        <span><strong>20+</strong> Yıllık Tecrübe</span>
        <span><strong>12+</strong> CAD Entegrasyonu</span>
        <span><strong>8+</strong> Tarayıcı Desteği</span>
      </div>
    </div></section>
    </DebugComponentLabel>

    <DebugComponentLabel name="FeatureRow (ortak)">
    <div className="alu-container">
    <FeatureRowList>
      <FeatureRow
        index={1}
        kicker="SCALYPSO"
        title="Hakkında"
        headingLevel={2}
        media={aboutImage
          ? <Image src={aboutImage.src} alt={aboutImage.alt} width={600} height={354} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : <span />}
      >
        {section('Hakkında')?.items.map(text => <p key={text} className="alu-body">{text}</p>)}
      </FeatureRow>
    </FeatureRowList>
    </div>
    </DebugComponentLabel>

    <DebugComponentLabel name="ProductEditionsBand">
    <ProductEditionsBand kicker="SCALYPSO · DİJİTAL AVANTAJ" title="Dijital Avantaj Kazanın" editions={advantages} />
    </DebugComponentLabel>

    <DebugComponentLabel name="SectionHeader + moduleGrid (özel)">
    <section className={styles.compact}><div className="alu-container">
      <SectionHeader kicker="SCALYPSO · MODÜLLER" title="Scalypso Modülleri" />
      {section('Scalypso Modülleri')?.items.map(text => <p key={text} className={styles.body}>{text}</p>)}
      <nav className={styles.moduleGrid} aria-label="Scalypso modülleri">
        {MODULES.map(m => {
          const sec = section(m.sectionKey);
          const desc = sec?.items.filter(t => t !== 'Detaylı Bilgi') ?? [];
          const img = sec?.image;
          return <Link key={m.href} href={m.href} className={styles.moduleCard}>
            {img && <div className={styles.moduleImageWrap}>
              <Image src={img.src} alt={img.alt} width={400} height={220} className={styles.moduleImage} />
            </div>}
            <div className={styles.moduleBody}>
              <strong>{m.name}</strong>
              {desc[0] && <span>{desc[0]}</span>}
            </div>
          </Link>;
        })}
      </nav>
    </div></section>
    </DebugComponentLabel>

    <DebugComponentLabel name="SectionHeader + appGrid (özel)">
    <section className={styles.compact}><div className="alu-container">
      <SectionHeader kicker="SCALYPSO · UYGULAMA ALANLARI" title="Uygulamalar Her Yerde" />
      {section('Uygulamalar Her Yerde')?.items.map(text => <p key={text} className={styles.body}>{text}</p>)}
      <div className={styles.appGrid}>
        {APPLICATIONS.map(name => <div key={name} className={styles.appCard}>
          <div className={styles.appImageWrap}>
            <Image src={APPLICATION_IMAGES[name]} alt={name} fill className={styles.appImage} />
          </div>
          <span className={styles.appLabel}>{name}</span>
        </div>)}
      </div>
    </div></section>
    </DebugComponentLabel>

    <DebugComponentLabel name="SectionHeader + CompactSpecList">
    <section className={styles.compact}><div className="alu-container">
      <SectionHeader kicker="SCALYPSO · TEKNİK" title="Desteklenen Tarayıcılar" />
      {section('Desteklenen Tarayıcılar')?.items.slice(0, 1).map(text => <p key={text} className={styles.body}>{text}</p>)}
      <CompactSpecList items={section('Desteklenen Tarayıcılar')?.items.slice(1) ?? []} />

      <SectionHeader as="h3" title="Desteklenen CAD Yazılımları" />
      {section('Desteklenen CAD Yazılımları')?.items.slice(0, 1).map(text => <p key={text} className={styles.body}>{text}</p>)}
      <CompactSpecList items={section('Desteklenen CAD Yazılımları')?.items.slice(1) ?? []} />

      <SectionHeader as="h3" title="Gereksinimler" />
      <CompactSpecList items={section('Gereksinimler')?.items ?? []} />
    </div></section>
    </DebugComponentLabel>

    <DebugComponentLabel name="PreviewClosingSection">
    <PreviewClosingSection
      id="scalypso-closing"
      title="Scalypso hakkında görüşelim"
      items={[
        { title: 'Deneme lisansı', paragraphs: ['Bir deneme lisansı talep etmek için lütfen Başvuru Formunu doldurunuz.'], action: form ? { label: 'Deneme Lisansı İste', href: form } : undefined },
      ]}
    />
    </DebugComponentLabel>
  </div>;
}
