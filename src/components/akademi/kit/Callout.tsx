import type { ReactNode, ReactElement } from 'react';
import styles from './Callout.module.css';

/** Left-accent note box with a small mono label (e.g. "Sürekli proje adımı"). */
export function Callout({ label, children }: { label: string; children: ReactNode }): ReactElement {
  return (
    <aside className={styles.callout}>
      <span className={styles.label}>{label}</span>
      <div className={styles.body}>{children}</div>
    </aside>
  );
}
