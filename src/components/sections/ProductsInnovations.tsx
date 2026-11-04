'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PageRecord } from '@/lib/site-data';
import innovations from '@/data/products-innovations.json';
import { handleStructuredTabKey } from './structured-tab-key';
import styles from './ProductsOverview.module.css';

export function ProductsInnovations({ page }: { page: PageRecord }) {
  const [active, setActive] = useState(0);
  const intro = page.sections.find(section => section.heading === 'Ürün Ailesindeki Yenilikler');
  const relatedLinks = page.contentLinks.filter(link => ['Yenilikleri İncele', 'ALLPLAN 2026 İncele', 'ALLPLAN CLOUD'].includes(link.text));
  if (!intro) return null;

  return <section className={styles.innovations} aria-labelledby="products-innovations-title">
      <p className={styles.kicker}>Allplan 2026</p>
      <h2 id="products-innovations-title" className={styles.sectionTitle}>{intro.heading}</h2>
      {intro.items.map(item => <p className={styles.description} key={item}>{item}</p>)}
      <div className={styles.tabs} role="tablist" aria-label="Paket yenilikleri">
        {innovations.map((item, index) => <button key={item.id} role="tab" type="button" id={`products-tab-${item.id}`} aria-controls={`products-panel-${item.id}`} aria-selected={index === active} tabIndex={index === active ? 0 : -1} className={styles.tab} onClick={() => setActive(index)} onKeyDown={event => handleStructuredTabKey(event, index, innovations.length, setActive)}>{item.label}</button>)}
      </div>
      {innovations.map((packageItem, index) => <div key={packageItem.id} role="tabpanel" id={`products-panel-${packageItem.id}`} aria-labelledby={`products-tab-${packageItem.id}`} tabIndex={0} hidden={active !== index} className={styles.innovationList}>
        {packageItem.items.map(item => <article key={item.title} className={styles.innovation}>
          <div className={styles.innovationHeading}><h3>{item.title}</h3><span className={styles.badge}>{item.tag}</span></div>
          <p className={styles.description}>{item.description}</p>
        </article>)}
      </div>)}
      <div className={styles.related}>{relatedLinks.map(link => <Link className="alu-link alu-link--standalone" key={link.href} href={link.href}>{link.text} ↗</Link>)}</div>
    </section>;
}
