import type { ReactElement } from 'react';
import styles from './PrevNextNav.module.css';

export interface PrevNextItem {
  href: string;
  title: string;
}

/**
 * Compact previous / next navigation shared by akademi module and lesson
 * pages. Each side shows a small direction label and the target title on one
 * tight row; either side may be omitted at the ends of a sequence.
 */
export function PrevNextNav({
  previous,
  next,
  label = 'Sayfalar arası gezinme',
}: {
  previous?: PrevNextItem;
  next?: PrevNextItem;
  label?: string;
}): ReactElement {
  return (
    <nav className={styles.nav} aria-label={label}>
      <div className={`alu-container ${styles.row}`}>
        {previous ? (
          <a className={styles.link} href={previous.href}>
            <span className={styles.arrow} aria-hidden="true">←</span>
            <span className={styles.body}>
              <span className={styles.dir}>Önceki</span>
              <span className={styles.title}>{previous.title}</span>
            </span>
          </a>
        ) : (
          <span />
        )}
        {next && (
          <a className={`${styles.link} ${styles.next}`} href={next.href}>
            <span className={styles.body}>
              <span className={styles.dir}>Sonraki</span>
              <span className={styles.title}>{next.title}</span>
            </span>
            <span className={styles.arrow} aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </nav>
  );
}
