'use client';

import { useEffect, useState, type ReactElement } from 'react';
import styles from './LessonToc.module.css';

interface TocEntry {
  id: string;
  label: string;
}

const DONE_PREFIX = 'akademi-lesson-done-';

/**
 * In-lesson table of contents: a sticky bar listing the lesson's own sections
 * with a scroll-spy "where am I" marker, plus a per-lesson "completed" toggle
 * kept in this browser's localStorage. Sections are read from the page's own
 * `section[aria-labelledby]` headings, so the bar adapts to each lesson.
 */
export function LessonToc({ slug }: { slug: string }): ReactElement | null {
  const [entries, setEntries] = useState<readonly TocEntry[]>([]);
  const [active, setActive] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[aria-labelledby]'));
    const list = sections
      .map((section) => {
        const id = section.getAttribute('aria-labelledby') ?? '';
        const label = document.getElementById(id)?.textContent?.trim() ?? '';
        return { id, label };
      })
      .filter((entry) => entry.id !== '' && entry.label !== '');
    setEntries(list);

    const observer = new IntersectionObserver(
      (records) => {
        const inView = records
          .filter((record) => record.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const first = inView[0]?.target as HTMLElement | undefined;
        if (first) setActive(first.getAttribute('aria-labelledby') ?? '');
      },
      { rootMargin: '-128px 0px -68% 0px', threshold: 0 },
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    try {
      setDone(window.localStorage.getItem(DONE_PREFIX + slug) === '1');
    } catch {
      // Private window or blocked storage: completion just isn't remembered.
    }
  }, [slug]);

  function toggleDone(): void {
    setDone((previous) => {
      const next = !previous;
      try {
        if (next) window.localStorage.setItem(DONE_PREFIX + slug, '1');
        else window.localStorage.removeItem(DONE_PREFIX + slug);
      } catch {
        // ignore: the toggle still reflects in the UI for this view
      }
      return next;
    });
  }

  if (entries.length < 2) return null;

  return (
    <nav className={styles.toc} aria-label="Ders içi gezinme">
      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id} className={styles.item}>
            <a
              href={`#${entry.id}`}
              className={styles.link}
              aria-current={active === entry.id ? 'true' : undefined}
            >
              {entry.label}
            </a>
          </li>
        ))}
      </ul>
      <button
        type="button"
        className={styles.done}
        data-done={done ? 'true' : 'false'}
        aria-pressed={done}
        onClick={toggleDone}
      >
        <span aria-hidden="true" className={styles.check}>{done ? '✓' : '○'}</span>
        {done ? 'Tamamlandı' : 'Tamamladım'}
      </button>
    </nav>
  );
}
