import type { ReactElement } from 'react';
import { AluIcon } from '@/components/ui/AluIcon';
import type { AkademiModule } from '@/data/akademi';
import styles from './ModuleCard.module.css';

/**
 * Compact module card in the architectural language: the code is a small separate
 * label, the title flows freely. `showHours={false}` hides the hours where a parent
 * already states the total (e.g. a single-module L3 track).
 */
export function ModuleCard({
  module,
  showHours = true,
}: {
  module: AkademiModule;
  showHours?: boolean;
}): ReactElement {
  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <span className={styles.code}>{module.code}</span>
        <h3 className={styles.title}>
          {module.title}
          {module.proposed && <span className={styles.proposed}>önerilen</span>}
        </h3>
        {showHours && <span className={styles.hours}>{module.hours} sa</span>}
      </div>
      {module.outcomes && (
        <ul className={styles.outcomes}>
          {module.outcomes.map((outcome) => (
            <li key={outcome} className={styles.outcome}>
              <span className={styles.check} aria-hidden="true"><AluIcon name="check" size="sm" /></span>
              {outcome}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
