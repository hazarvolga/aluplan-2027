import type { ReactElement } from 'react';
import styles from './BenefitsSection.module.css';

import type { StructuredPageLayout } from '@/lib/site-data';

type BenefitsSectionData = NonNullable<StructuredPageLayout['benefits']>;

interface BenefitsSectionProps {
  benefits: BenefitsSectionData;
  variant?: "default" | "category-list";
}

export function BenefitsSection({ benefits, variant = "default" }: BenefitsSectionProps): ReactElement {
  const gridClassName = `alu-benefits-grid${
    benefits.items.length >= 12 || benefits.items.length === 8
      ? ' alu-benefits-grid--cols-4'
      : ' alu-benefits-grid--cols-3'
  }`;

  return (
    <section className={`preview-section preview-section--subtle ${styles.section}`} aria-label={benefits.title}>
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
        <div className="alu-section-header-center">
          {benefits.kicker && <span className="preview-kicker">{benefits.kicker}</span>}
          <h2 className="alu-h1" style={{ margin: 0 }}>
            {benefits.title}
          </h2>
        </div>

        <div className={gridClassName}>
          {benefits.items.map((benefit, index) => (
            <article
              key={benefit.sourceId || `${benefit.title}-${index}`}
              className="alu-benefit-card"
              data-source-id={benefit.sourceId}
            >
              <div className="alu-benefit-card__top">
                <div className="alu-benefit-card__titles">
                  {variant === 'category-list' ? <h3 className="alu-benefit-card__subtitle">{benefit.subtitle || benefit.title}</h3> : <>
                    {benefit.subtitle && <span className="alu-benefit-card__subtitle">{benefit.subtitle}</span>}
                    <h3 className="alu-benefit-card__title">{benefit.title}</h3>
                  </>}
                </div>
                {variant !== "category-list" && benefit.iconSrc && (
                  <span className="alu-benefit-icon" aria-hidden="true">
                    <img src={benefit.iconSrc} alt="" loading="lazy" />
                  </span>
                )}
              </div>
              {variant === "category-list" ? <ul className={styles.list}>{benefit.description.split(" • ").map((item, i) => <li key={`${i}-${item}`}>{item}</li>)}</ul> : <p className="alu-benefit-card__desc">{benefit.description}</p>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
