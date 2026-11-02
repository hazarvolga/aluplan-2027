'use client';

import { useState } from 'react';
import { handleStructuredTabKey } from './structured-tab-key';
import { featureGroups } from '@/data/allplan-2027-features-preview';
import { allplanImprovements, sciaImprovements } from '@/data/allplan-2027-improvements';
import { MAIN_QUOTE_FORM_URL, TRIAL_CTA_URL } from '@/lib/site-data';
import styles from './Allplan2027FeaturesPreview.module.css';
import { PreviewClosingSection } from './PreviewClosingSection';

export function Allplan2027FeaturesPreview() {
  const [activeIndex, setActiveIndex] = useState(0);
  return <div className={styles.page}>
    <section className={styles.hero}><div className="alu-container">
      <p className={styles.kicker}>2027 YENİLİKLERİ · ALLPLAN · ALLPLAN CIVIL · FRILO · SCIA · SDS2</p>
      <h1>Her mühendislik iş akışı için kapsamlı çözümler</h1>
      <p>Allplan, Allplan Civil, FRILO, SCIA ve SDS2’nin 2027 sürümlerini keşfedin. İş akışı ne olursa olsun mühendisler için çözümler sunuyoruz. Kontrolü sizin elinizde tutan yapay zekâ araçları, yapı analizi için modern araçlar, daha hızlı çizim ve detaylandırma ve altyapı için güçlü parametrik modeller.</p>
      <div className={styles.actions}><a className="alu-button alu-button--primary alu-button--md" href={MAIN_QUOTE_FORM_URL}>Demo talep edin ↗</a><a className="alu-button alu-button--secondary alu-button--md" href={TRIAL_CTA_URL}>Ücretsiz deneme ↗</a></div>
    </div></section>
    <section className={`alu-container ${styles.section}`} aria-labelledby="features-2027-title">
      <h2 id="features-2027-title">2027 yeniliklerini keşfedin</h2>
      <div className={styles.navigation} role="tablist" aria-label="2027 ürün yenilikleri">
        {featureGroups.map((group, index) => <button type="button" role="tab" id={`features-tab-${group.id}`} aria-controls={`features-${group.id}`} aria-selected={index === activeIndex} tabIndex={index === activeIndex ? 0 : -1} key={group.id} onClick={() => setActiveIndex(index)} onKeyDown={event => handleStructuredTabKey(event, index, featureGroups.length, setActiveIndex)}><span>{group.name}</span><span className={styles.tabSubtitle}>{group.subtitle}</span></button>)}
      </div>
      {featureGroups.map((group,index)=>{
        const improvements = group.id === 'allplan' ? allplanImprovements : group.id === 'scia' ? sciaImprovements : [];
        return <section className={styles.group} id={`features-${group.id}`} key={group.id} role="tabpanel" aria-labelledby={`features-tab-${group.id}`} hidden={index !== activeIndex} tabIndex={0}>
          {index === activeIndex && <>
          <p className={styles.kicker}>{group.subtitle}</p><h2 id={`heading-${group.id}`}>{group.name}</h2>
          {group.items.map(item=><article className={styles.feature} key={item.name}><div className={styles.featureContent}>
            <p className={styles.featureRibbon}>Dahil olduğu sürümler: {item.included}</p><h3>{item.name}</h3><h4>{item.heading}</h4><p>{item.body}</p>
            {group.id === 'allplan' && <a href={MAIN_QUOTE_FORM_URL}>Demo talep edin ↗</a>}
          </div><div className={styles.media}>{'image' in item ? <img src={item.image} alt={`${item.name} — ALLPLAN ürün görseli`} loading="lazy" /> : <video controls preload="metadata" playsInline aria-label={`${item.name} önizleme videosu`}><source src={item.video} type="video/mp4" />Tarayıcınız video oynatmayı desteklemiyor.</video>}</div></article>)}
          {improvements.length > 0 && <div className={styles.improvements}><h3>Diğer iyileştirmeler</h3>{improvements.map(item=><details key={item.sourceTitle}><summary>{item.title}</summary><p>{item.body}</p></details>)}</div>}
          </>}
        </section>;
      })}
    </section>
    <PreviewClosingSection id="features-closing-title" kicker="ALLPLAN" title="Daha iyi bir yarın inşa etmek için tasarlayın" items={[
      { paragraphs: ['Daha üretken, iş birlikçi ve gelişmiş iş akışları'] },
      { title: 'ALLPLAN’ı ücretsiz deneyin', paragraphs: [
        'Tek bir platformda disiplinler arası AEC ekip çalışması; malzeme ve inşaat yöntemlerinde üstün koordinasyon; gelişmiş BIM iş akışları ve gerçek zamanlı iş birliği.',
        'ALLPLAN’ın tam sürümünü 14 gün boyunca ücretsiz ve yükümlülük olmadan deneyin. Yazılımı indirerek tüm avantajları kendiniz keşfedin.'
      ], action: { label: 'Şimdi indirin', href: TRIAL_CTA_URL } }
    ]} />
  </div>;
}
