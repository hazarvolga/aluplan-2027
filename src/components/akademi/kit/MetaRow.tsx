import type { ReactElement } from 'react';
import styles from './MetaRow.module.css';

export interface MetaItem {
  k: string;
  v: string;
}

/** Ruled key/value strip for a hero's meta (duration, format, prerequisite, …). */
export function MetaRow({ items }: { items: readonly MetaItem[] }): ReactElement {
  return (
    <dl className={styles.row}>
      {items.map((item) => (
        <div key={item.k} className={styles.cell}>
          <dt className={styles.k}>{item.k}</dt>
          <dd className={styles.v}>{item.v}</dd>
        </div>
      ))}
    </dl>
  );
}
