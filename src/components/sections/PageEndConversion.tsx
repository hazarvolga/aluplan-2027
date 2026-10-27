import type { ReactElement } from 'react';

import { AluIcon } from '@/components/ui/AluIcon';
import type { PageEndConversionModel } from './page-end-conversion-policy';

export function PageEndConversion({ model }: { model: PageEndConversionModel }): ReactElement {
  const headingId = `page-end-conversion-${model.kind}-heading`;

  return (
    <section
      className="alu-trial-banner"
      aria-labelledby={headingId}
      data-page-end-conversion={model.kind}
    >
      <div className="alu-container">
        <div className="alu-trial-banner__inner">
          <div className="alu-stack" style={{ gap: 'var(--space-stack-md)' }}>
            <div className="alu-cluster">
              <span className="alu-badge alu-badge--accent">
                <AluIcon name="sparkles" size="sm" />
                <span>{model.kicker}</span>
              </span>
            </div>
            <h2 id={headingId} className="alu-h1">
              {model.title}
            </h2>
            <p className="alu-body-lg">{model.description}</p>
          </div>

          <div className="alu-trial-banner__benefits">
            <h3 className="alu-h3">Nasıl ilerlemek istersiniz?</h3>
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
                  } alu-button--lg`}
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
