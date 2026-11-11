'use client';

import { useEffect, useRef, useState, type ReactElement } from 'react';
import styles from './LessonToc.module.css';

interface TocEntry {
  id: string;
  label: string;
}

const DONE_PREFIX = 'akademi-lesson-done-';

/** Short, bar-friendly labels per section id; falls back to the heading text. */
const SHORT_LABELS: Record<string, string> = {
  'tm-hedef': 'Hedefler',
  'tm-adimlar': 'Adımlar',
  'tm-kontrol': 'Kontrol',
  'tm-dikkat': 'Dikkat',
  'tm-uygulama': 'Uygulama',
  'tm-quiz': 'Quiz',
  'tm-video': 'Video',
  'tm-komut': 'Komutlar',
  'tm-derin': 'Derinlemesine',
};

/**
 * In-lesson table of contents: a sticky bar listing the lesson's own sections
 * with a scroll-spy "where am I" marker, plus a per-lesson "completed" toggle
 * kept in this browser's localStorage. Sections are read from the page's own
 * `section[aria-labelledby]` headings, so the bar adapts to each lesson. The
 * bar wraps to two lines instead of scrolling sideways, and anchor clicks
 * scroll smoothly, offset below the sticky header + bar.
 */
export function LessonToc({ slug }: { slug: string }): ReactElement | null {
  const [entries, setEntries] = useState<readonly TocEntry[]>([]);
  const [active, setActive] = useState('');
  const [done, setDone] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[aria-labelledby]'));
    const list = sections
      .map((section) => {
        const id = section.getAttribute('aria-labelledby') ?? '';
        const label = SHORT_LABELS[id] ?? document.getElementById(id)?.textContent?.trim() ?? '';
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

  function goTo(event: React.MouseEvent<HTMLAnchorElement>, id: string): void {
    const target = document.getElementById(id);
    if (!target) return;
    event.preventDefault();
    const headerHeight = document.querySelector('header')?.getBoundingClientRect().height ?? 60;
    const bar = navRef.current;
    const barSticky = bar !== null && window.getComputedStyle(bar).position === 'sticky';
    const barHeight = barSticky ? bar.getBoundingClientRect().height : 0;
    const offset = headerHeight + barHeight + 12;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    try {
      window.history.replaceState(null, '', `#${id}`);
    } catch {
      // ignore: hash update is cosmetic
    }
    setActive(id);
  }

  if (entries.length < 2) return null;

  return (
    <nav ref={navRef} className={styles.toc} aria-label="Ders içi gezinme">
      <ul className={styles.list}>
        {entries.map((entry) => (
          <li key={entry.id} className={styles.item}>
            <a
              href={`#${entry.id}`}
              className={styles.link}
              aria-current={active === entry.id ? 'true' : undefined}
              onClick={(event) => goTo(event, entry.id)}
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
