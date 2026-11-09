'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AluIcon } from '@/components/ui/AluIcon';
import { buildSidebarLevels, isAkademiLevelActive, isAkademiModuleActive } from './sidebar-nav';
import { temelModellemeLessons } from '@/data/temel-modelleme';
import { araziModellemeLessons } from '@/data/arazi-modelleme';
import { lejantLessons } from '@/data/lejant';
import type { TmLesson } from '@/data/temel-modelleme';
import styles from './AkademiSidebar.module.css';

const sidebarLevels = buildSidebarLevels();

interface AkademiSeriesNav {
  levelSlug: string;
  basePath: string;
  title: string;
  lessons: readonly TmLesson[];
}

/** Lesson series nested under a level in the sidebar. */
const AKADEMI_SERIES: readonly AkademiSeriesNav[] = [
  { levelSlug: 'temel', basePath: '/akademi/temel-modelleme', title: 'Temel Modelleme Eğitimi', lessons: temelModellemeLessons },
  { levelSlug: 'temel', basePath: '/akademi/arazi-modelleme', title: 'Arazi Modelleme Eğitimi', lessons: araziModellemeLessons },
  { levelSlug: 'orta', basePath: '/akademi/lejant', title: 'Lejant Oluşturma Eğitimi', lessons: lejantLessons },
];

/** Program-wide curriculum nav: sticky rail on desktop, off-canvas drawer on mobile. */
export function AkademiSidebar() {
  const pathname = usePathname() ?? '';
  // Focus mode: inside a lesson series, show only that series' lessons + a back link.
  const activeSeries = AKADEMI_SERIES.find((series) => pathname.startsWith(series.basePath));
  const activeSeriesLevelTitle = activeSeries
    ? sidebarLevels.find((level) => level.slug === activeSeries.levelSlug)?.title ?? 'Akademi'
    : '';
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  // Track the drawer breakpoint so off-screen links are not left in the tab order on desktop.
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 959px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Move focus into the drawer when it opens on mobile.
  useEffect(() => {
    if (open && isMobile) {
      navRef.current?.querySelector<HTMLElement>('a, button')?.focus();
    }
  }, [open, isMobile]);

  // Esc closes the drawer and returns focus to the toggle.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen((wasOpen) => {
          if (wasOpen) toggleRef.current?.focus();
          return false;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const close = () => {
    setOpen(false);
    toggleRef.current?.focus();
  };

  return (
    <>
      <button
        ref={toggleRef}
        type="button"
        className={styles.toggle}
        aria-expanded={open}
        aria-controls="akademi-sidebar"
        onClick={() => setOpen((value) => !value)}
      >
        <AluIcon name={open ? 'x' : 'menu'} size="sm" />
        <span>Müfredat</span>
      </button>

      {open && <div className={styles.scrim} onClick={close} aria-hidden="true" />}

      <nav
        ref={navRef}
        id="akademi-sidebar"
        className={`${styles.sidebar} ${open ? styles.open : ''}`}
        aria-label="Müfredat gezinmesi"
        inert={isMobile && !open}
      >
        {activeSeries ? (
          <div>
            <Link href={`/akademi/${activeSeries.levelSlug}`} className={styles.backLink}>
              <span aria-hidden="true">←</span>
              <span>{activeSeriesLevelTitle} seviyesi</span>
            </Link>
            <p className={styles.heading}>{activeSeries.title}</p>
            <ul className={`${styles.tmLessons} ${styles.focusLessons}`}>
              {activeSeries.lessons.map((lsn) => {
                const lessonActive = pathname === `${activeSeries.basePath}/${lsn.slug}`;
                return (
                  <li key={lsn.slug}>
                    <Link
                      href={`${activeSeries.basePath}/${lsn.slug}`}
                      className={`${styles.tmLessonLink} ${lessonActive ? styles.moduleActive : ''}`}
                      aria-current={lessonActive ? 'page' : undefined}
                    >
                      <span className={styles.tmLessonNo}>{String(lsn.no).padStart(2, '0')}</span>
                      <span className={styles.tmLessonTitle}>{lsn.title}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : (
          <>
        <p className={styles.heading}>Müfredat</p>
        <ol className={styles.levels}>
          {sidebarLevels.map((level) => {
            const active = isAkademiLevelActive(pathname, level.slug);
            return (
              <li key={level.slug} className={`${styles.level} ${active ? styles.active : ''}`}>
                <Link
                  href={`/akademi/${level.slug}`}
                  className={styles.levelLink}
                  aria-current={active ? 'page' : undefined}
                >
                  <span className={styles.levelNo}>{String(level.number).padStart(2, '0')}</span>
                  <span className={styles.levelTitle}>{level.title}</span>
                </Link>
                <ul className={styles.modules}>
                  {level.modules.map((module) => {
                    const moduleActive = isAkademiModuleActive(pathname, module);
                    return (
                      <li key={module.code} className={styles.moduleItem}>
                        <Link
                          href={`/akademi/${module.levelSlug}/${module.slug}`}
                          className={`${styles.moduleLink} ${moduleActive ? styles.moduleActive : ''}`}
                          aria-current={moduleActive ? 'page' : undefined}
                        >
                          <span className={styles.moduleTitle}>{module.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                  {AKADEMI_SERIES.filter((series) => series.levelSlug === level.slug).map((series) => {
                    const onSeries = pathname.startsWith(series.basePath);
                    return (
                      <li key={series.basePath} className={styles.moduleItem}>
                        <Link
                          href={series.basePath}
                          className={`${styles.moduleLink} ${pathname === series.basePath ? styles.moduleActive : ''}`}
                          aria-current={pathname === series.basePath ? 'page' : undefined}
                        >
                          <span className={styles.moduleTitle}>{series.title}</span>
                        </Link>
                        {onSeries && (
                          <ul className={styles.tmLessons}>
                            {series.lessons.map((lsn) => {
                              const active = pathname === `${series.basePath}/${lsn.slug}`;
                              return (
                                <li key={lsn.slug}>
                                  <Link
                                    href={`${series.basePath}/${lsn.slug}`}
                                    className={`${styles.tmLessonLink} ${active ? styles.moduleActive : ''}`}
                                    aria-current={active ? 'page' : undefined}
                                  >
                                    <span className={styles.tmLessonNo}>{String(lsn.no).padStart(2, '0')}</span>
                                    <span className={styles.tmLessonTitle}>{lsn.title}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            );
          })}
        </ol>
          </>
        )}
      </nav>
    </>
  );
}
