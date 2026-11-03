'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';

import type { StructuredLinkGroupGridSection } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { SectionHeader } from './SectionHeader';
import styles from './ProductsOverview.module.css';
import groupStyles from './LinkGroupGridSection.module.css';

interface LinkGroupGridSectionProps {
  grid: StructuredLinkGroupGridSection;
}

export function LinkGroupGridSection({ grid }: LinkGroupGridSectionProps): ReactElement {
  return (
    <section className="preview-section" aria-label={grid.title}>
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
        <SectionHeader kicker={grid.kicker} title={grid.title} lead={grid.subtitle} />

        <div className={styles.products}>
          {grid.items.map((card, index) => (
            <article
              key={card.sourceId}
              className={index === 0 ? `${styles.product} ${styles.featured}` : styles.product}
              data-source-id={card.sourceId}
            >
              <div className={styles.productLink}>
                <div className={styles.media}>
                  <img src={card.imageSrc} alt={card.title} loading="lazy" />
                </div>
                <div className={styles.content}>
                  <h3 className={styles.title}>{card.title}</h3>
                  <ul className={groupStyles.links}>
                    {card.links.map((item, linkIndex) => (
                      <li key={`${card.sourceId}-${item.href}-${linkIndex}`}>
                        <AluIcon name="arrow-right" size="sm" />
                        {item.external ? (
                          <a href={item.href} target="_blank" rel="noopener noreferrer">{item.text}</a>
                        ) : (
                          <Link href={item.href}>{item.text}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
