'use client';

import React, { useState } from 'react';
import type { StructuredFaqDirectory } from '@/lib/site-data';
import { AluIcon } from '@/components/ui/AluIcon';
import { DirectoryCategoryIcon } from './DirectoryCategoryIcon';
import { handleStructuredTabKey } from './structured-tab-key';

type FAQSectionProps = {
  faqDirectory?: StructuredFaqDirectory;
};

export function FAQSection({ faqDirectory }: FAQSectionProps) {
  const [activeFaqCatIdx, setActiveFaqCatIdx] = useState(0);

  if (!faqDirectory || faqDirectory.categories.length === 0) return null;
  const faqDir = faqDirectory;
  const safeFaqIdx = Math.min(
    activeFaqCatIdx,
    Math.max(0, faqDir.categories.length - 1)
  );
  const currentFaqCat = faqDir.categories[safeFaqIdx];
  if (!currentFaqCat) return null;

  return (
    <section
      className="preview-section"
      aria-label={faqDir.title}
    >
      <div
        className="alu-container alu-stack"
        style={{ gap: 'var(--space-stack-xl)' }}
      >
        <div className="alu-section-header-center">
          {faqDir.kicker && (
            <span className="preview-kicker">{faqDir.kicker}</span>
          )}
          <h2 className="alu-h2" style={{ margin: 0 }}>
            {faqDir.title}
          </h2>
          {faqDir.subtitle && (
            <p
              className="alu-body preview-meta"
              style={{ margin: 0, maxWidth: 'var(--container-prose)' }}
            >
              {faqDir.subtitle}
            </p>
          )}
        </div>

        {faqDir.categories.length > 1 && (
          <div
            className="alu-wf-cats"
            role="tablist"
            aria-label={faqDir.title}
          >
            {faqDir.categories.map((cat, cIdx) => {
              const isActive = cIdx === safeFaqIdx;
              return (
                <button
                  key={cat.id}
                  type="button"
                  role="tab"
                  id={`faq-category-tab-${cIdx}`}
                  aria-controls="faq-category-panel"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onKeyDown={(event) => handleStructuredTabKey(event, cIdx, faqDir.categories.length, setActiveFaqCatIdx)}
                  className={`alu-wf-cat-btn${
                    isActive ? ' alu-wf-cat-btn--active' : ''
                  }`}
                  onClick={() => setActiveFaqCatIdx(cIdx)}
                >
                  <DirectoryCategoryIcon name={cat.iconName} />
                  <span>{cat.label}</span>
                  <span className="alu-wf-cat-btn__count">
                    {cat.items.length}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div
          className="alu-faq-stage"
          key={currentFaqCat.id}
          id="faq-category-panel"
          role={faqDir.categories.length > 1 ? 'tabpanel' : 'region'}
          aria-labelledby={faqDir.categories.length > 1 ? `faq-category-tab-${safeFaqIdx}` : undefined}
          aria-label={faqDir.categories.length > 1 ? undefined : currentFaqCat.title}
          tabIndex={0}
        >
          <div className="alu-faq-stage__header">
            <div className="alu-cluster" style={{ gap: 'var(--space-application-jsx-comfortable)' }}>
              <span className="alu-ref-card__icon">
                <DirectoryCategoryIcon name={currentFaqCat.iconName} />
              </span>
              <div>
                <h3 className="alu-h2" style={{ margin: 0 }}>
                  {currentFaqCat.title}
                </h3>
                {currentFaqCat.subtitle && (
                  <p className="alu-body-sm preview-meta" style={{ margin: 'var(--space-application-jsx-tight) 0 0 0' }}>
                    {currentFaqCat.subtitle}
                  </p>
                )}
              </div>
            </div>
            <span className="alu-badge alu-badge--accent">
              {currentFaqCat.items.length} Soru & Yanıt
            </span>
          </div>

          <div className="alu-faq-list" style={{ maxWidth: '100%' }}>
            {currentFaqCat.items.map((fItem, fIdx) => (
              <details
                key={`${currentFaqCat.id}-${fIdx}`}
                className="alu-faq-item"
                open={fIdx === 0}
              >
                <summary className="alu-faq-item__summary">
                  <span>{fItem.question}</span>
                  <span className="alu-faq-item__chevron" aria-hidden="true">
                    <AluIcon name="chevron-down" size="sm" />
                  </span>
                </summary>
                <div className="alu-faq-item__answer">
                  {fItem.answer.split('\n\n').map((para, pIdx) => (
                    <p key={pIdx}>{para}</p>
                  ))}

                  {fItem.bullets && fItem.bullets.length > 0 && (
                    <ul className="alu-media-card__bullets" style={{ marginTop: 'var(--space-application-jsx-regular)' }}>
                      {fItem.bullets.map((b, bIdx) => (
                        <li key={bIdx}>
                          <AluIcon name="check" size="sm" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {fItem.table && (
                    <div className="alu-faq-table-wrap">
                      <table className="alu-faq-table">
                        <thead>
                          <tr>
                            {fItem.table.headers.map((th, thIdx) => (
                              <th key={thIdx}>{th}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {fItem.table.rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={
                                    cell === '✓'
                                      ? 'alu-faq-table__yes'
                                      : cell === '-'
                                      ? 'alu-faq-table__no'
                                      : undefined
                                  }
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {fItem.note && (
                    <p className="alu-faq-note">{fItem.note}</p>
                  )}
                </div>
              </details>
            ))}
          </div>

          {currentFaqCat.ctaHref && (
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 'var(--space-application-jsx-section)' }}>
              <a
                href={currentFaqCat.ctaHref}
                target="_blank"
                rel="noopener noreferrer"
                className="alu-button alu-button--primary alu-button--md"
              >
                <span>{currentFaqCat.ctaText || 'Detaylı İncele'}</span>
                <AluIcon name="external-link" size="sm" />
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
