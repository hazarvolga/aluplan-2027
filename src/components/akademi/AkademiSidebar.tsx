'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AluIcon } from '@/components/ui/AluIcon';
import { buildSidebarLevels, isAkademiLevelActive, isAkademiModuleActive, isInsideLevel } from './sidebar-nav';
// Sidebar yalnızca no/slug/title kullanır; tam ders verisini (gövde, adım, makale,
// figür) tarayıcıya taşımamak için hafif _index.json dosyalarını import eder.
import temelIdx from '@/data/temel-modelleme/_index.json';
import temelGroups from '@/data/temel-modelleme/_groups.json';
import araziIdx from '@/data/arazi-modelleme/_index.json';
import lejantIdx from '@/data/lejant/_index.json';
import donatiIdx from '@/data/donati-detaylandirma/_index.json';
import celikIdx from '@/data/celik-yapi/_index.json';
import prekastIdx from '@/data/prekast/_index.json';
import otomasyonIdx from '@/data/otomasyon-scripting/_index.json';
import openbimIdx from '@/data/openbim-ifc/_index.json';
import styles from './AkademiSidebar.module.css';

const sidebarLevels = buildSidebarLevels();

interface SidebarLesson {
  no: number;
  slug: string;
  title: string;
}

/** Topic group of a series' lessons, shown as a collapsible block in focus mode. */
interface SidebarLessonGroup {
  title: string;
  lessons: readonly number[];
}

interface AkademiSeriesNav {
  levelSlug: string;
  basePath: string;
  title: string;
  lessons: readonly SidebarLesson[];
  groups?: readonly SidebarLessonGroup[];
}

/** Lesson series nested under a level in the sidebar. */
const AKADEMI_SERIES: readonly AkademiSeriesNav[] = [
  { levelSlug: 'temel', basePath: '/akademi/temel-modelleme', title: 'Temel Modelleme Eğitimi', lessons: temelIdx, groups: temelGroups },
  { levelSlug: 'temel', basePath: '/akademi/arazi-modelleme', title: 'Arazi Modelleme Eğitimi', lessons: araziIdx },
  { levelSlug: 'orta', basePath: '/akademi/lejant', title: 'Lejant Oluşturma Eğitimi', lessons: lejantIdx },
  { levelSlug: 'ileri', basePath: '/akademi/donati-detaylandirma', title: 'Donatı Detaylandırma', lessons: donatiIdx },
  { levelSlug: 'ileri', basePath: '/akademi/celik-yapi', title: 'Çelik Yapı ve SDS2', lessons: celikIdx },
  { levelSlug: 'ileri', basePath: '/akademi/prekast', title: 'Prekast Yapı Elemanları', lessons: prekastIdx },
  { levelSlug: 'uzman', basePath: '/akademi/otomasyon-scripting', title: 'Otomasyon ve Visual Scripting', lessons: otomasyonIdx },
  { levelSlug: 'uzman', basePath: '/akademi/openbim-ifc', title: 'OpenBIM ve IFC', lessons: openbimIdx },
];

const pad = (no: number) => String(no).padStart(2, '0');

function SeriesLessonList({ series, pathname, className }: {
  series: AkademiSeriesNav;
  pathname: string;
  className: string;
}) {
  const lessonsByNo = new Map(series.lessons.map((lsn) => [lsn.no, lsn]));
  const renderLesson = (lsn: SidebarLesson) => {
    const lessonActive = pathname === `${series.basePath}/${lsn.slug}`;
    return (
      <li key={lsn.slug}>
        <Link
          href={`${series.basePath}/${lsn.slug}`}
          className={`${styles.tmLessonLink} ${lessonActive ? styles.moduleActive : ''}`}
          aria-current={lessonActive ? 'page' : undefined}
        >
          <span className={styles.tmLessonNo}>{pad(lsn.no)}</span>
          <span className={styles.tmLessonTitle}>{lsn.title}</span>
        </Link>
      </li>
    );
  };

  if (!series.groups) {
    return <ul className={className}>{series.lessons.map(renderLesson)}</ul>;
  }

  return (
    <div className={styles.groups}>
      {series.groups.map((group) => {
        const lessons = group.lessons
          .map((no) => lessonsByNo.get(no))
          .filter((lsn): lsn is SidebarLesson => lsn !== undefined);
        if (lessons.length === 0) return null;
        const holdsCurrent = lessons.some((lsn) => pathname === `${series.basePath}/${lsn.slug}`);
        const first = lessons[0].no;
        const last = lessons[lessons.length - 1].no;
        return (
          <details key={group.title} className={styles.group} open={holdsCurrent}>
            <summary className={`${styles.groupSummary} ${holdsCurrent ? styles.groupCurrent : ''}`}>
              <span className={styles.groupTitle}>{group.title}</span>
              <span className={styles.groupMeta}>
                {pad(first)}–{pad(last)} · {lessons.length} ders
              </span>
            </summary>
            <ul className={className}>{lessons.map(renderLesson)}</ul>
          </details>
        );
      })}
    </div>
  );
}

/** Program-wide curriculum nav: sticky rail on desktop, off-canvas drawer on mobile. */
export function AkademiSidebar() {
  const pathname = usePathname() ?? '';
  // Focus mode: inside a lesson series, show only that series' lessons + a back link.
  const activeSeries = AKADEMI_SERIES.find((series) => pathname.startsWith(series.basePath));
  const activeSeriesLevel = activeSeries
    ? sidebarLevels.find((level) => level.slug === activeSeries.levelSlug)
    : undefined;
  const activeSeriesLevelLabel = activeSeriesLevel
    ? `${pad(activeSeriesLevel.number)} · ${activeSeriesLevel.title}`
    : 'Akademi';
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
              <span>{activeSeriesLevelLabel}</span>
            </Link>
            <p className={styles.heading}>{activeSeries.title}</p>
            <SeriesLessonList
              series={activeSeries}
              pathname={pathname}
              className={`${styles.tmLessons} ${styles.focusLessons}`}
            />
          </div>
        ) : (
          <>
        <p className={styles.heading}>Müfredat</p>
        <ol className={styles.levels}>
          {sidebarLevels.map((level) => {
            const levelSeries = AKADEMI_SERIES.filter((series) => series.levelSlug === level.slug);
            const inside = isInsideLevel(pathname, level.slug, levelSeries.map((series) => series.basePath));
            const overviewActive = isAkademiLevelActive(pathname, level.slug);
            const count = level.modules.length + levelSeries.length;
            return (
              <li key={level.slug} className={`${styles.level} ${inside ? styles.active : ''}`}>
                <details className={styles.levelGroup} open={inside}>
                  <summary className={styles.levelSummary}>
                    <span className={styles.levelNo}>{pad(level.number)}</span>
                    <span className={styles.levelTitle}>{level.title}</span>
                    <span className={styles.levelMeta}>{count} içerik</span>
                  </summary>
                  <ul className={styles.modules}>
                    <li className={styles.moduleItem}>
                      <Link
                        href={`/akademi/${level.slug}`}
                        className={`${styles.moduleLink} ${styles.overviewLink} ${overviewActive ? styles.moduleActive : ''}`}
                        aria-current={overviewActive ? 'page' : undefined}
                      >
                        <span className={styles.moduleTitle}>Seviyeye genel bakış</span>
                      </Link>
                    </li>
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
                    {levelSeries.map((series) => (
                      <li key={series.basePath} className={styles.moduleItem}>
                        <Link href={series.basePath} className={styles.moduleLink}>
                          <span className={styles.moduleTitle}>{series.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
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
