import type { ReactElement } from 'react';
import type { SessionStep } from '@/data/akademi-content';
import styles from './Timeline.module.css';

/**
 * Minute-by-minute session flow as a hairline vertical timeline: the time sits on a
 * ruled spine, the phase is the heading, and the instructor/participant actions follow.
 */
export function Timeline({
  steps,
}: {
  steps: readonly SessionStep[];
}): ReactElement | null {
  if (steps.length === 0) return null;

  return (
    <ol className={styles.list}>
      {steps.map((step, index) => (
        <li key={`${step.time}-${index}`} className={styles.step}>
          <div className={styles.spine} aria-hidden="true" />
          <span className={styles.time}>{step.time}</span>
          <div className={styles.body}>
            <h4 className={styles.phase}>{step.phase}</h4>
            <dl className={styles.roles}>
              <div className={styles.role}>
                <dt className={styles.roleKey}>Eğitmen</dt>
                <dd className={styles.roleVal}>{step.instructor}</dd>
              </div>
              <div className={styles.role}>
                <dt className={styles.roleKey}>Katılımcı</dt>
                <dd className={styles.roleVal}>{step.participant}</dd>
              </div>
            </dl>
            {step.material && <span className={styles.material}>{step.material}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}
