import { HeroBottomLine } from './HeroBottomLine';
import { SectionHeader } from './SectionHeader';
import { SolutionOverviewCards } from './SolutionOverviewCards';
import { CompactSpecList } from './CompactSpecList';
import Link from 'next/link';
import type { PageRecord } from '@/lib/site-data';
import styles from './ScalypsoPageContent.module.css';

const moduleNames = ['CONVERTER', 'MODELER', 'MOBILE', 'VIEWER', 'VİDEOLAR'];
const modulePaths = ['/solutions/scalypso/converter', '/solutions/scalypso/modeler', '/solutions/scalypso/mobile', '/solutions/scalypso/viewer', '/solutions/scalypso/videos'];
const applications = ['Mimarlık', 'Köprü ve Altyapı', 'Endüstri', 'Gemi İnşası', 'Robotik'];

export function ScalypsoPageContent({ page }: { page: PageRecord }) {
  const section = (heading: string) => page.sections.find(item => item.heading === heading);
  const image = (alt: string) => page.images.find(item => item.alt === alt);
  const form = page.contentLinks.find(link => link.text === 'Başvuru Formu İçin Tıklayın')?.href;
  const intro = section('Hakkında');
  const moduleItems = moduleNames.map((name, index) => {
    const item = section(name);
    return { title: name, href: modulePaths[index], description: '', external: false, image: item?.image ? { ...item.image, alt: item.image.alt || name } : undefined };
  });
  const moduleParagraphs = Object.fromEntries(moduleNames.map((name, index) => [
    modulePaths[index], section(name)?.items.filter(text => text !== 'Detaylı Bilgi') ?? [],
  ]));
  return <div className={styles.page}>
    <section className={styles.hero} style={{ position: 'relative' }}><div className="alu-container"><span className="preview-kicker">3D LAZER TARAMA VERİLERİ</span><h1>Scalypso</h1><p>Karasal ve mobil 3B lazer tarama verilerini kullanarak analiz ve yeniden oluşturma görevleri için bir yazılım paketi</p><div className={styles.actions}>{form && <a className="alu-button alu-button--primary alu-button--md" href={form} target="_blank" rel="noopener noreferrer">Deneme Lisansı İste</a>}<Link className="alu-button alu-button--secondary alu-button--md" href="/solutions/scalypso/videos">Videoları İzle</Link></div><div className={styles.metrics}><span><strong>20+</strong> YILLIK Tecrübe</span><span><strong>12+</strong> ENTEGRASYON CAD Yazılımı</span><span><strong>8+</strong> DESTEK Tarayıcı</span></div></div><HeroBottomLine /></section>
    <section className={styles.section}><div className={`alu-container ${styles.split}`}><div><SectionHeader title="Hakkında" />{intro?.items.map(text => <p key={text}>{text}</p>)}</div>{intro?.image && <img src={intro.image.src} alt={intro.image.alt || 'Hakkında'} />}</div></section>
    <section className={styles.section}><div className="alu-container"><SectionHeader title="Dijital Avantaj Kazanın" />{section('Dijital Avantaj Kazanın')?.items.map(text => <p key={text}>{text}</p>)}<div className={styles.cards}>{['Modüler ve Genişletilebilir','Sanattan Bilime','İki Dünya Arasında Köprü'].map(name => <article key={name}><h3>{name}</h3>{section(name)?.items.map(text => <p key={text}>{text}</p>)}</article>)}</div></div></section>
    <section className={styles.section}><div className="alu-container"><SectionHeader title="Desteklenen Tarayıcılar" />{section('Desteklenen Tarayıcılar')?.items.slice(0,1).map(text=><p key={text}>{text}</p>)}<CompactSpecList items={section('Desteklenen Tarayıcılar')?.items.slice(1) ?? []} /></div></section>
    <section className={styles.section}><div className="alu-container"><SectionHeader title="Scalypso Modülleri" />{section('Scalypso Modülleri')?.items.map(text=><p key={text}>{text}</p>)}<SolutionOverviewCards items={moduleItems} headingLevel={3} paragraphsByHref={moduleParagraphs} actionLabel="Detaylı Bilgi" /></div></section>
    <section className={styles.section}><div className="alu-container"><SectionHeader title="Uygulamalar Her Yerde" />{section('Uygulamalar Her Yerde')?.items.map(text=><p key={text}>{text}</p>)}<div className={styles.cards}>{applications.map(name=>{const item=image(name);return <article key={name}>{item && <img src={item.src} alt={name} loading="lazy" />}<h3>{name}</h3></article>})}</div></div></section>
    <section className={styles.section}><div className="alu-container"><SectionHeader title="Desteklenen CAD Yazılımları" />{section('Desteklenen CAD Yazılımları')?.items.slice(0,1).map(text=><p key={text}>{text}</p>)}<CompactSpecList items={section('Desteklenen CAD Yazılımları')?.items.slice(1) ?? []} /><SectionHeader as="h3" title="Gereksinimler" /><CompactSpecList items={section('Gereksinimler')?.items ?? []} /></div></section>
  </div>;
}
