'use client';

import Link from 'next/link';
import type { ReactElement } from 'react';

import type { StructuredLinkGroupGridSection } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';

interface LinkGroupGridSectionProps {
  grid: StructuredLinkGroupGridSection;
}

export function LinkGroupGridSection({ grid }: LinkGroupGridSectionProps): ReactElement {
  const columns = grid.columns || 3;

  return (
    <section className="preview-section" aria-label={grid.title}>
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
        <div className="alu-section-header-center">
          {grid.kicker && <span className="preview-kicker">{grid.kicker}</span>}
          <h2 className="alu-h1" style={{ margin: 0 }}>{grid.title}</h2>
          {grid.subtitle && (
            <p className="alu-body preview-meta" style={{ margin: 0, maxWidth: 'var(--container-prose)' }}>
              {grid.subtitle}
            </p>
          )}
        </div>

        <div className={`alu-media-grid alu-media-grid--cols-${columns}`}>
          {grid.items.map((card) => (
            <article
              key={card.sourceId}
              className="alu-media-card"
              data-source-id={card.sourceId}
            >
              <div className="alu-media-card__thumb">
                <img src={card.imageSrc} alt={card.title} loading="lazy" />
                <div className="alu-media-card__scrim" aria-hidden="true" />
              </div>
              <div className="alu-media-card__body">
                <h3 className="alu-media-card__title">{card.title}</h3>
                <ul className="alu-media-card__bullets">
                  {card.links.map((item, index) => (
                    <li key={`${card.sourceId}-${item.href}-${index}`}>
                      <AluIcon name="arrow-right" size="sm" />
                      {item.external ? (
                        <a href={item.href} target="_blank" rel="noopener noreferrer">
                          {item.text}
                        </a>
                      ) : (
                        <Link href={item.href}>{item.text}</Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
