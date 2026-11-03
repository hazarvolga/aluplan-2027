import { HeroBottomLine } from './HeroBottomLine';
import Link from 'next/link';
import type { PageRecord } from '@/lib/site-data';
import styles from './ScalypsoModeler.module.css';

export function ScalypsoModeler({ page }: { page: PageRecord }) {
  const form = page.contentLinks.find(link => link.text === 'Deneme Lisansı İste')?.href;
  const introduction = page.sections.find(section => section.heading === '3B lazer veri tarama');
  const items = introduction?.items.filter(item => item !== '•' && item !== '01') ?? [];
  const paragraphs = [items[0], items[1], items[items.length - 1]].filter(Boolean);
  const systems = items.slice(2, -1);
  const modules = ['Pipe Module', 'BIM Module', 'Steel Module', 'Ortho Module'];
  const image = page.images.find(item => !item.isIcon && item.src);
  const trial = page.sections.find((item, index) => index > 1 && item.heading === 'Deneme Lisansı İste');
  return <div className={styles.page}>
    <section className={styles.hero} style={{ position: 'relative' }}><div className="alu-container"><span className="preview-kicker">SCALYPSO MODÜLÜ</span><h1>Modeler</h1><p>{page.sections[0]?.items.find(item => item.length > 50)}</p><div className={styles.actions}>{form && <a className="alu-button alu-button--primary alu-button--md" href={form} target="_blank" rel="noopener noreferrer">Deneme Lisansı İste</a>}<Link className="alu-button alu-button--secondary alu-button--md" href="/solutions/scalypso">Scalypso Ana Sayfa</Link></div></div><HeroBottomLine /></section>
    <section className={styles.section}><div className={`alu-container ${styles.intro}`}><div><span className="preview-kicker">SCALYPSO MODELER</span><h2>3B lazer veri tarama</h2>{paragraphs.slice(0,2).map((paragraph,index)=><p key={index}>{paragraph}</p>)}</div>{image && <img src={image.src} alt={image.alt || 'Scalypso Modeler'} />}</div></section>
    <section className={styles.section}><div className="alu-container"><span className="preview-kicker">BİRLİKTE ÇALIŞABİLİRLİK</span><h2>Desteklenen CAD yazılımları</h2><ul className={styles.systems}>{systems.map(system=><li key={system}>{system}</li>)}</ul></div></section>
    <section className={styles.section}><div className="alu-container"><span className="preview-kicker">SCALYPSO MODELER</span><h2>Modüller</h2>{paragraphs.slice(2).map((paragraph,index)=><p key={index}>{paragraph}</p>)}<div className={styles.modules}>{modules.map(name=>{const section=page.sections.find(item=>item.heading===name);const link=page.contentLinks.find(item=>item.text===name);return <article key={name}><h3>{name}</h3>{section?.items.filter(text=>text !== '•').map(text=><p key={text}>{text}</p>)}{link && <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={`Detaylı bilgi: ${name}`}>Detaylı bilgi ↗</a>}</article>})}</div></div></section>
    {form && <section className={styles.section}><div className={`alu-container ${styles.trial}`}><div><h2>Deneme Lisansı İste</h2>{trial?.items.filter(text=>text !== 'Başvuru Formu İçin Tıklayın').map(text=><p key={text}>{text}</p>)}</div><a className="alu-button alu-button--primary alu-button--md" href={form} target="_blank" rel="noopener noreferrer">Başvuru Formu İçin Tıklayın</a></div></section>}
  </div>;
}
