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
  return <div className={styles.page}>
    <section className={styles.hero}><div className="alu-container"><span className="preview-kicker">3D LAZER TARAMA VERİLERİ</span><h1>Scalypso</h1><p>Karasal ve mobil 3B lazer tarama verilerini kullanarak analiz ve yeniden oluşturma görevleri için bir yazılım paketi</p><div className={styles.actions}>{form && <a className="alu-button alu-button--primary alu-button--md" href={form} target="_blank" rel="noopener noreferrer">Deneme Lisansı İste</a>}<Link className="alu-button alu-button--secondary alu-button--md" href="/solutions/scalypso/videos">Videoları İzle</Link></div><div className={styles.metrics}><span><strong>20+</strong> YILLIK Tecrübe</span><span><strong>12+</strong> ENTEGRASYON CAD Yazılımı</span><span><strong>8+</strong> DESTEK Tarayıcı</span></div></div></section>
    <section className={styles.section}><div className={`alu-container ${styles.split}`}><div><h2>Hakkında</h2>{intro?.items.map(text => <p key={text}>{text}</p>)}</div>{intro?.image && <img src={intro.image.src} alt={intro.image.alt || 'Hakkında'} />}</div></section>
    <section className={styles.section}><div className="alu-container"><h2>Dijital Avantaj Kazanın</h2>{section('Dijital Avantaj Kazanın')?.items.map(text => <p key={text}>{text}</p>)}<div className={styles.cards}>{['Modüler ve Genişletilebilir','Sanattan Bilime','İki Dünya Arasında Köprü'].map(name => <article key={name}><h3>{name}</h3>{section(name)?.items.map(text => <p key={text}>{text}</p>)}</article>)}</div></div></section>
    <section className={styles.section}><div className="alu-container"><h2>Desteklenen Tarayıcılar</h2>{section('Desteklenen Tarayıcılar')?.items.slice(0,1).map(text=><p key={text}>{text}</p>)}<ul className={styles.list}>{section('Desteklenen Tarayıcılar')?.items.slice(1).map(text=><li key={text}>{text}</li>)}</ul></div></section>
    <section className={styles.section}><div className="alu-container"><h2>Scalypso Modülleri</h2>{section('Scalypso Modülleri')?.items.map(text=><p key={text}>{text}</p>)}<div className={styles.cards}>{moduleNames.map((name,index)=>{const item=section(name);return <article key={name}>{item?.image && <img src={item.image.src} alt={item.image.alt || name} loading="lazy" />}<h3>{name}</h3>{item?.items.filter(text=>text !== 'Detaylı Bilgi').map(text=><p key={text}>{text}</p>)}<Link href={modulePaths[index]} aria-label={`Detaylı Bilgi: ${name}`}>Detaylı Bilgi →</Link></article>})}</div></div></section>
    <section className={styles.section}><div className="alu-container"><h2>Uygulamalar Her Yerde</h2>{section('Uygulamalar Her Yerde')?.items.map(text=><p key={text}>{text}</p>)}<div className={styles.cards}>{applications.map(name=>{const item=image(name);return <article key={name}>{item && <img src={item.src} alt={name} loading="lazy" />}<h3>{name}</h3></article>})}</div></div></section>
    <section className={styles.section}><div className="alu-container"><h2>Desteklenen CAD Yazılımları</h2>{section('Desteklenen CAD Yazılımları')?.items.slice(0,1).map(text=><p key={text}>{text}</p>)}<ul className={styles.list}>{section('Desteklenen CAD Yazılımları')?.items.slice(1).map(text=><li key={text}>{text}</li>)}</ul><h3>Gereksinimler</h3><ul className={styles.list}>{section('Gereksinimler')?.items.map(text=><li key={text}>{text}</li>)}</ul></div></section>
    <section className={styles.section}><div className="alu-container"><h2>Deneme Lisansı İste</h2><p>Bir deneme lisansı talep etmek için lütfen Başvuru Formunu doldurunuz.</p>{form && <a className="alu-button alu-button--primary alu-button--md" href={form} target="_blank" rel="noopener noreferrer">Başvuru Formu İçin Tıklayın</a>}</div></section>
  </div>;
}
