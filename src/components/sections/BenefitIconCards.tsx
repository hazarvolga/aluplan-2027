import type { ReactElement } from 'react';
import type { StructuredBenefitItem } from '@/lib/site-data';
import { AluIcon, type AluIconName } from '@/components/ui/AluIcon';
import { DebugComponentLabel } from './DebugComponentLabel';
import styles from './BenefitsSection.module.css';

export type BenefitIconCardItem = StructuredBenefitItem & { iconName?: AluIconName };

interface BenefitIconCardsProps {
  items: readonly BenefitIconCardItem[];
  variant?: 'default' | 'category-list';
}

export function BenefitIconCards({ items, variant = 'default' }: BenefitIconCardsProps): ReactElement {
  const gridClassName = `alu-benefits-grid${
    items.length >= 12 || items.length === 8
      ? ' alu-benefits-grid--cols-4'
      : ' alu-benefits-grid--cols-3'
  }`;

  return (
    <DebugComponentLabel name="BenefitIconCards">
        <div className={gridClassName}>
          {items.map((benefit, index) => (
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
                {benefit.iconName ? (
                  <span className="alu-benefit-icon" aria-hidden="true"><AluIcon name={benefit.iconName} size="lg" /></span>
                ) : variant !== "category-list" && benefit.iconSrc && (
                  <span className="alu-benefit-icon" aria-hidden="true">
                    <img src={benefit.iconSrc} alt="" loading="lazy" />
                  </span>
                )}
              </div>
              {variant === "category-list" ? <ul className={styles.list}>{benefit.description.split(" • ").map((item, i) => <li key={`${i}-${item}`}>{item}</li>)}</ul> : <p className="alu-benefit-card__desc">{benefit.description}</p>}
            </article>
          ))}
        </div>
    </DebugComponentLabel>
  );
}
