import type { ReactElement } from 'react';
import styles from './SectionRule.module.css';

/** Small uppercase mono section label over a hairline rule. */
export function SectionRule({ label, id }: { label: string; id?: string }): ReactElement {
  return (
    <p id={id} className={styles.rule}>
      {label}
    </p>
  );
}
