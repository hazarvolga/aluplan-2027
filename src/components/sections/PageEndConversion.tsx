import type { ReactElement } from 'react';

import { AluIcon } from '@/components/ui/AluIcon';
import type { PageEndConversionModel } from './page-end-conversion-policy';
import styles from './PageEndConversion.module.css';

export function PageEndConversion({ model }: { model: PageEndConversionModel }): ReactElement {
  const headingId = `page-end-conversion-${model.kind}-heading`;

  return (
    <section
      className={`alu-trial-banner ${styles.section}`}
      aria-labelledby={headingId}
      data-page-end-conversion={model.kind}
    >
      <div className="alu-container">
        <div className={`alu-trial-banner__inner ${styles.inner}`}>
          <div className={styles.content}>
            <h2 id={headingId} className={styles.title}>
              {model.title}
            </h2>
            <p className={styles.description}>{model.description}</p>
          </div>

          <div className={`alu-trial-banner__benefits ${styles.actions}`}>
            <h3 className={styles.actionTitle}>Nasıl ilerlemek istersiniz?</h3>
            <div className="alu-cluster">
              {model.actions.map((action) => (
                <a
                  key={`${action.href}-${action.label}`}
                  href={action.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`alu-button ${
                    action.emphasis === 'primary'
                      ? 'alu-button--primary'
                      : 'alu-button--secondary'
                  } alu-button--md`}
                >
                  <span>{action.label}</span>
                  <AluIcon name="external-link" size="sm" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
