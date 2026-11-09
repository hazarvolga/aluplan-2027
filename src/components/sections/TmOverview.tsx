import type { ReactElement } from 'react';
import { CompactPageHero } from './CompactPageHero';
import { SectionHeader } from './SectionHeader';
import { temelModellemeHero, temelModellemeLessons } from '@/data/temel-modelleme';
import styles from './TmOverview.module.css';

export function TmOverview(): ReactElement {
  return (
    <div className={styles.page}>
      <nav className={styles.breadcrumb} aria-label="Konum">
        <a href="/akademi">Akademi</a>
        <span aria-hidden="true" className={styles.sep}>/</span>
        <span aria-current="page">Temel Modelleme</span>
      </nav>

      <CompactPageHero
        title={temelModellemeHero.title}
        lead={temelModellemeHero.lead}
      />

      <section className={styles.band} aria-labelledby="tm-dersler">
        <div className="alu-container">
          <SectionHeader
            id="tm-dersler"
            kicker="DERSLER"
            title="On altı uygulamalı ders"
            lead="Her derste konuyu uygular, Türkçe komut tablosundan araçları öğrenir ve kaynak makalelerle derinleşirsiniz."
          />
          <ol className={styles.lessons}>
            {temelModellemeLessons.map((lesson) => (
              <li key={lesson.slug} className={styles.lesson}>
                <a className={styles.lessonLink} href={`/akademi/temel-modelleme/${lesson.slug}`}>
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
