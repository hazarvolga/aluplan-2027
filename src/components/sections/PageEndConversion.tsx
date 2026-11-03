import type { ReactElement } from 'react';

import { AluIcon } from '@/components/ui/AluIcon';
import { SectionHeader } from './SectionHeader';
import type { PageEndConversionModel } from './page-end-conversion-policy';
import styles from './PageEndConversion.module.css';

export function PageEndConversion({ model }: { model: PageEndConversionModel }): ReactElement {
  const headingId = model.preview?.headingId ?? `page-end-conversion-${model.kind}-heading`;

  return (
    <section
      className={`alu-trial-banner ${styles.section}`}
      aria-labelledby={headingId}
      data-page-end-conversion={model.kind}
    >
      <div className="alu-container">
        <div className={`alu-trial-banner__inner ${styles.inner}`}>
          <div className={styles.content}>
            {model.preview ? <SectionHeader kicker={model.kicker || undefined} title={model.title} id={headingId} /> : <>
              <h2 id={headingId} className={styles.title}>
                {model.title}
              </h2>
              <p className={styles.description}>{model.description}</p>
            </>}
          </div>

          <div className={`alu-trial-banner__benefits ${styles.actions} ${model.preview ? styles.previewActions : ''}`}>
            {model.preview ? model.preview.items.map((item, index) => (
              <article className={styles.previewOption} key={index}>
                {item.title && <h3 className={styles.actionTitle}>{item.title}</h3>}
                {item.paragraphs.map((paragraph, paragraphIndex) => <p className={styles.description} key={paragraphIndex}>{paragraph}</p>)}
                {item.action && <a className="alu-button alu-button--primary alu-button--md" href={item.action.href}>{item.action.label} ↗</a>}
              </article>
            )) : <><h3 className={styles.actionTitle}>Nasıl ilerlemek istersiniz?</h3>
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
            </div></>}
          </div>
        </div>
      </div>
    </section>
  );
}
