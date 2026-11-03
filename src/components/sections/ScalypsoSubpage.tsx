import { HeroBottomLine } from './HeroBottomLine';
import Link from 'next/link';
import type { PageRecord } from '@/lib/site-data';
import styles from './ScalypsoPageContent.module.css';

export function ScalypsoSubpage({ page }: { page: PageRecord }) {
  const mainForm = page.contentLinks.find(link => link.text === 'Deneme Lisansı İste')?.href;
  const applicationForm = page.contentLinks.find(link => link.text === 'Başvuru Formu İçin Tıklayın')?.href ?? mainForm;
  const content = page.sections.filter((item, index) => index > 1 && item.heading !== 'Deneme Lisansı İste');
  const moduleNames = ['Pipe Module', 'BIM Module', 'Steel Module', 'Ortho Module'];
  const title = page.h1;
  const intro = page.sections[0]?.items.find(item => item.length > 50) ?? page.description;
  const trialSection = page.sections.find((item, index) => index > 1 && item.heading === 'Deneme Lisansı İste');
  const image = page.images.find(item => !item.isIcon && item.src);
  return <div className={styles.page}>
    <section className={styles.hero} style={{ position: 'relative' }}><div className="alu-container"><span className="preview-kicker">SCALYPSO MODÜLÜ</span><h1>{title}</h1><p>{intro}</p><div className={styles.actions}>{mainForm && <a className="alu-button alu-button--primary alu-button--md" href={mainForm} target="_blank" rel="noopener noreferrer">Deneme Lisansı İste</a>}<Link className="alu-button alu-button--secondary alu-button--md" href="/solutions/scalypso">Scalypso Ana Sayfa</Link></div></div><HeroBottomLine /></section>
    <section className={styles.section}><div className="alu-container">
      {image && <img src={image.src} alt={image.alt || title} style={{maxWidth:'38rem',width:'100%',height:'auto'}} />}
      {content.map((item,index)=>{const moduleLink = moduleNames.includes(item.heading) ? page.contentLinks.find(link=>link.text === item.heading) : undefined; return <section key={`${item.heading}-${index}`}><h2>{item.heading}</h2>{item.items.filter(text=>text !== '•').map((text,itemIndex)=><p key={`${itemIndex}-${text}`}>{text.replaceAll('&apos;', "'")}</p>)}{moduleLink && <a href={moduleLink.href} target="_blank" rel="noopener noreferrer">{item.heading} hakkında bilgi ↗</a>}</section>})}
    </div></section>
    {applicationForm && <section className={styles.section}><div className="alu-container"><h2>Deneme Lisansı İste</h2>{trialSection?.items.filter(text=>text !== 'Başvuru Formu İçin Tıklayın').map(text=><p key={text}>{text}</p>)}<a className="alu-button alu-button--primary alu-button--md" href={applicationForm} target="_blank" rel="noopener noreferrer">Başvuru Formu İçin Tıklayın</a></div></section>}
  </div>;
}
