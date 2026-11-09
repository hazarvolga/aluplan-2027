import type { ReactElement, ReactNode } from 'react';
import type { Lesson as LessonData } from '@/data/akademi-content';
import { Figure } from './Figure';
import styles from './Lesson.module.css';

/**
 * Renders text with **double-asterisk** spans as <strong>. Pure text
 * segmentation: no HTML is interpreted, so content stays injection-safe.
 */
function withEmphasis(text: string): ReactNode[] {
  return text.split('**').map((part, index) =>
    index % 2 === 1 ? <strong key={index} className={styles.term}>{part}</strong> : part,
  );
}

/**
 * The taught lesson (DERS): the spine of the student-facing module page.
 * Each section is explanatory prose, an optional embedded screenshot, and an
 * optional "now you try it" prompt — what a self-paced learner actually reads.
 */
export function Lesson({ lesson }: { lesson: LessonData }): ReactElement {
  return (
    <div className={styles.lesson}>
      {lesson.intro && <p className={styles.intro}>{withEmphasis(lesson.intro)}</p>}
      {lesson.sections.map((section, index) => (
        <section key={section.heading} className={styles.section}>
          <h3 className={styles.heading}>{section.heading}</h3>
          {section.body.map((paragraph, pIndex) => (
            <p key={pIndex} className={styles.paragraph}>{withEmphasis(paragraph)}</p>
          ))}
          {section.figure && (
            <div className={styles.figure}>
              <Figure figure={section.figure} priority={index === 0} />
            </div>
          )}
          {section.tryIt && (
            <p className={styles.tryIt}>
              <span className={styles.tryItLabel}>Şimdi sen dene</span>
              <span className={styles.tryItText}>{section.tryIt.replace(/^Şimdi sen dene:\s*/, '')}</span>
            </p>
          )}
        </section>
      ))}
    </div>
  );
}
