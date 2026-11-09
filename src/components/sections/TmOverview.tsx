import type { ReactElement } from 'react';
import { CompactPageHero } from './CompactPageHero';
import { SectionHeader } from './SectionHeader';
import { temelModellemeHero, temelModellemeLessons } from '@/data/temel-modelleme';
import type { TmLesson } from '@/data/temel-modelleme';
import styles from './TmOverview.module.css';

interface SeriesHero {
  title: string;
  lead: string;
}

export function TmOverview({
  hero = temelModellemeHero,
  lessons = temelModellemeLessons,
  basePath = '/akademi/temel-modelleme',
  breadcrumbLabel = 'Temel Modelleme',
  overviewLead = 'Her derste konuyu uygular, Türkçe komut tablosundan araçları öğrenir ve kaynak makalelerle derinleşirsiniz.',
}: {
  hero?: SeriesHero;
  lessons?: readonly TmLesson[];
  basePath?: string;
  breadcrumbLabel?: string;
  overviewLead?: string;
} = {}): ReactElement {
  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Konum">
        <a href="/akademi">Akademi</a>
        <span aria-hidden="true" className={styles.sep}>/</span>
        <span aria-current="page">{breadcrumbLabel}</span>
      </nav>

      <CompactPageHero title={hero.title} lead={hero.lead} />

      <section className={styles.band} aria-labelledby="tm-dersler">
        <div className="alu-container">
          <SectionHeader
            id="tm-dersler"
            kicker="DERSLER"
            title={`${lessons.length} uygulamalı ders`}
            lead={overviewLead}
          />
          <ol className={styles.lessons}>
            {lessons.map((lesson) => (
              <li key={lesson.slug} className={styles.lesson}>
                <a className={styles.lessonLink} href={`${basePath}/${lesson.slug}`}>
                  <span className={styles.no}>{String(lesson.no).padStart(2, '0')}</span>
                  <span className={styles.lessonTitle}>{lesson.title}</span>
                  {lesson.duration && <span className={styles.duration}>{lesson.duration}</span>}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
