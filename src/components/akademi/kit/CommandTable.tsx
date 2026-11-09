import type { ReactElement } from 'react';
import type { TmCommand } from '@/data/temel-modelleme';
import styles from './CommandTable.module.css';

/**
 * Turkish command reference: tool name, ALLPLAN menu path, shortcut and a
 * short modelling note. Renders as a table on desktop and stacked cards on
 * narrow screens.
 */
export function CommandTable({ commands }: { commands: readonly TmCommand[] }): ReactElement {
  return (
    <div className={styles.wrap} role="table" aria-label="Komut, menü yolu ve kısayol tablosu">
      <div className={styles.head} role="row">
        <span role="columnheader">Komut</span>
        <span role="columnheader">Menü yolu</span>
        <span role="columnheader">Kısayol</span>
        <span role="columnheader">Açıklama</span>
      </div>
      {commands.map((c) => (
        <div key={c.name} className={styles.row} role="row">
          <span className={styles.name} role="cell" data-label="Komut">{c.name}</span>
          <span className={styles.menu} role="cell" data-label="Menü yolu">{c.menu}</span>
          <span className={styles.shortcut} role="cell" data-label="Kısayol">{c.shortcut || '—'}</span>
          <span className={styles.desc} role="cell" data-label="Açıklama">{c.desc}</span>
        </div>
      ))}
    </div>
  );
}
