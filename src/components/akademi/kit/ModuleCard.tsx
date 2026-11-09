import type { ReactElement } from 'react';
import Link from 'next/link';
import type { ContentModule } from '@/data/akademi-content';
import styles from './ModuleCard.module.css';

/**
 * Compact module card in the architectural language: the title links to the
 * module detail page (stretched over the whole card). This is a student-facing
 * course, so the internal code, classroom hours and the third-person outcome
 * list are not shown; the lesson's own page states what you will learn in the
 * second person.
 */
export function ModuleCard({ module }: { module: ContentModule }): ReactElement {
  return (
    <article className={styles.card}>
      <div className={styles.head}>
        <h3 className={styles.title}>
          <Link className={styles.titleLink} href={`/akademi/${module.levelSlug}/${module.slug}`}>
            {module.title}
          </Link>
          {module.proposed && <span className={styles.proposed}>önerilen</span>}
        </h3>
      </div>
    </article>
  );
}
