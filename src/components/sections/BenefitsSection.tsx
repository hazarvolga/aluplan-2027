import type { ReactElement } from 'react';
import styles from './BenefitsSection.module.css';

import type { StructuredPageLayout } from '@/lib/site-data';
import { SectionHeader } from './SectionHeader';
import { BenefitIconCards } from './BenefitIconCards';

type BenefitsSectionData = NonNullable<StructuredPageLayout['benefits']>;

interface BenefitsSectionProps {
  benefits: BenefitsSectionData;
  variant?: "default" | "category-list";
}

export function BenefitsSection({ benefits, variant = "default" }: BenefitsSectionProps): ReactElement {
  return (
    <section className={`preview-section preview-section--subtle ${styles.section}`} aria-label={benefits.title}>
      <div className="alu-container alu-stack" style={{ gap: 'var(--space-stack-xl)' }}>
        <SectionHeader kicker={benefits.kicker} title={benefits.title} />

        <BenefitIconCards items={benefits.items} variant={variant} />
      </div>
    </section>
  );
}
